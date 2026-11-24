import { spawn } from 'node:child_process'
import { chmod, mkdir, readdir, stat, utimes } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { type AnswerRecorder, createAnswerRecorder } from '../src/answers/index.js'
import { createHimringClient } from '../src/index.js'
import { acceptAnswerEvents, answerDrafts, type DeliveredEvent, sortedByQuestion } from './support/answer-events.js'
import { API_KEY, idOf, temporaryFolder, useHarness } from './support/harness.js'

const harness = useHarness()
const QUIET_LOGGER = { warn: () => undefined }
const NEVER_FLUSH_ON_A_TIMER_MS = 3_600_000
const BUILT_SDK = join(import.meta.dirname, '..', 'dist')
const OWNER_ONLY_BITS = 0o077

function recorderAt(spoolDirectory: string | false, knowledgeBaseId: string, projectId: string): AnswerRecorder {
  return createAnswerRecorder({
    client: harness.client,
    projectId,
    knowledgeBaseId,
    spoolDirectory,
    flushIntervalMs: NEVER_FLUSH_ON_A_TIMER_MS,
    logger: QUIET_LOGGER,
  })
}

const CRASHING_RECORDER = `
const { createHimringClient } = await import(process.env.SDK_INDEX)
const { createAnswerRecorder } = await import(process.env.SDK_ANSWERS)
const setup = JSON.parse(process.env.RECORDER_SETUP)
const client = createHimringClient({ baseUrl: setup.baseUrl, credential: setup.credential })
const recorder = createAnswerRecorder({
  client,
  projectId: setup.projectId,
  knowledgeBaseId: setup.knowledgeBaseId,
  spoolDirectory: setup.spoolDirectory,
  flushIntervalMs: 3600000,
  logger: { warn: () => undefined },
})
recorder.record(setup.drafts)
process.stdout.write('recorded\\n')
setInterval(() => undefined, 1000)
`

async function recordThenCrash(setup: Record<string, unknown>): Promise<void> {
  const child = spawn(process.execPath, ['--input-type=module', '--eval', CRASHING_RECORDER], {
    env: {
      ...process.env,
      SDK_INDEX: pathToFileURL(join(BUILT_SDK, 'index.js')).href,
      SDK_ANSWERS: pathToFileURL(join(BUILT_SDK, 'answers', 'index.js')).href,
      RECORDER_SETUP: JSON.stringify(setup),
    },
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  const exited = new Promise<void>(resolve => child.once('exit', () => resolve()))
  try {
    await new Promise<void>((resolve, reject) => {
      child.stdout.on('data', (chunk: Buffer) => {
        if (chunk.toString('utf8').includes('recorded')) resolve()
      })
      child.once('exit', code => reject(new Error(`The recorder process exited with ${code} before it recorded.`)))
    })
  } finally {
    child.kill('SIGKILL')
    await exited
  }
}

function expectExactlyOnce(delivered: readonly DeliveredEvent[], recorded: readonly DeliveredEvent[]): void {
  expect(sortedByQuestion(delivered)).toEqual(sortedByQuestion(recorded))
}

describe('a batch that the API finds too large', () => {
  it('halves the batch until the API takes it, with no event lost or sent twice', async () => {
    const log = acceptAnswerEvents(harness, 7)
    const recorder = recorderAt(join(await temporaryFolder(), 'spool'), idOf('kb'), idOf('prj'))
    const drafts = answerDrafts(60)
    try {
      recorder.record(drafts)
      await recorder.flush()
    } finally {
      await recorder.close()
    }
    expectExactlyOnce(log.delivered, drafts)
    expect(log.requestSizes.some(size => size > 7)).toBe(true)
    expect(recorder.droppedEventCount).toBe(0)
    expect(harness.api.problems).toEqual([])
  })
})

describe('a recorder that restarts', () => {
  it('does not steal a live recorder with a stale heartbeat', async () => {
    const spoolDirectory = join(await temporaryFolder(), 'spool')
    const projectId = idOf('prj')
    const knowledgeBaseId = idOf('kb')
    const drafts = answerDrafts(1)
    const arrived = Promise.withResolvers<void>()
    const reply = Promise.withResolvers<void>()
    let requests = 0
    harness.api.stub('record_answer_events', async () => {
      requests += 1
      arrived.resolve()
      await reply.promise
      return { status: 200, body: { results: [], recorded_count: 1 } }
    })
    const first = recorderAt(spoolDirectory, knowledgeBaseId, projectId)
    first.record(drafts)
    await arrived.promise
    const stale = new Date(Date.now() - 600_000)
    for (const file of await readdir(spoolDirectory)) await utimes(join(spoolDirectory, file), stale, stale)
    const second = createAnswerRecorder({
      client: harness.client,
      projectId,
      knowledgeBaseId,
      spoolDirectory,
      closeTimeoutMs: 100,
      logger: QUIET_LOGGER,
    })
    try {
      await second.flush()
      expect(requests).toBe(1)
    } finally {
      reply.resolve()
      await Promise.all([first.close(), second.close()])
    }
  })

  it('recovers answers only for their original API, project, and knowledge base', async () => {
    const spoolDirectory = join(await temporaryFolder(), 'spool')
    const projectId = idOf('prj')
    const knowledgeBaseId = idOf('kb')
    const drafts = answerDrafts(2)
    const log = acceptAnswerEvents(harness)
    await recordThenCrash({
      baseUrl: harness.api.baseUrl,
      credential: API_KEY,
      projectId,
      knowledgeBaseId,
      spoolDirectory,
      drafts,
    })
    const original = await readdir(spoolDirectory)
    for (const target of [
      { client: harness.client, projectId: idOf('prj'), knowledgeBaseId },
      { client: harness.client, projectId, knowledgeBaseId: idOf('kb') },
      { client: createHimringClient({ baseUrl: harness.storage.origin }), projectId, knowledgeBaseId },
    ]) {
      const foreign = createAnswerRecorder({ ...target, spoolDirectory, logger: QUIET_LOGGER })
      try {
        await foreign.flush()
      } finally {
        await foreign.close()
      }
      expect(log.delivered).toEqual([])
      expect(harness.storage.requests).toEqual([])
      expect(await readdir(spoolDirectory)).toEqual(original)
    }
    const originalRecorder = recorderAt(spoolDirectory, knowledgeBaseId, projectId)
    try {
      await originalRecorder.flush()
    } finally {
      await originalRecorder.close()
    }
    expectExactlyOnce(log.delivered, drafts)
    expect(await readdir(spoolDirectory)).toEqual([])
  })

  it('replays the events of a crashed process exactly once', async () => {
    const spoolDirectory = join(await temporaryFolder(), 'spool')
    const projectId = idOf('prj')
    const knowledgeBaseId = idOf('kb')
    const drafts = answerDrafts(30)
    const log = acceptAnswerEvents(harness)
    await recordThenCrash({
      baseUrl: harness.api.baseUrl,
      credential: API_KEY,
      projectId,
      knowledgeBaseId,
      spoolDirectory,
      drafts,
    })
    expect(log.delivered).toEqual([])
    expect((await readdir(spoolDirectory)).length).toBeGreaterThan(0)
    const first = recorderAt(spoolDirectory, knowledgeBaseId, projectId)
    const second = recorderAt(spoolDirectory, knowledgeBaseId, projectId)
    try {
      await Promise.all([first.flush(), second.flush()])
    } finally {
      await Promise.all([first.close(), second.close()])
    }
    expectExactlyOnce(log.delivered, drafts)
    const third = recorderAt(spoolDirectory, knowledgeBaseId, projectId)
    try {
      await third.flush()
    } finally {
      await third.close()
    }
    expectExactlyOnce(log.delivered, drafts)
    expect(await readdir(spoolDirectory)).toEqual([])
  })

  it('replays the events that a closed recorder could not send exactly once', async () => {
    const spoolDirectory = join(await temporaryFolder(), 'spool')
    const projectId = idOf('prj')
    const knowledgeBaseId = idOf('kb')
    const drafts = answerDrafts(12)
    harness.api.stub('record_answer_events', () => new Promise(() => undefined))
    const stopped = createAnswerRecorder({
      client: harness.client,
      projectId,
      knowledgeBaseId,
      spoolDirectory,
      flushIntervalMs: NEVER_FLUSH_ON_A_TIMER_MS,
      closeTimeoutMs: 200,
      logger: QUIET_LOGGER,
    })
    stopped.record(drafts)
    await stopped.close()
    const log = acceptAnswerEvents(harness)
    const restarted = recorderAt(spoolDirectory, knowledgeBaseId, projectId)
    try {
      await restarted.flush()
    } finally {
      await restarted.close()
    }
    expectExactlyOnce(log.delivered, drafts)
  })
})

describe('the spool on disk', () => {
  it('keeps the spool folder and its files private to the user', async () => {
    const spoolDirectory = join(await temporaryFolder(), 'spool')
    harness.api.stub('record_answer_events', {
      status: 503,
      body: { error: { code: 'service_unavailable', message: 'Try again.' } },
    })
    const recorder = recorderAt(spoolDirectory, idOf('kb'), idOf('prj'))
    try {
      recorder.record(answerDrafts(3))
      const folder = await stat(spoolDirectory)
      expect(folder.mode & OWNER_ONLY_BITS).toBe(0)
      const names = await readdir(spoolDirectory)
      expect(names.length).toBeGreaterThan(0)
      for (const name of names) {
        const file = await stat(join(spoolDirectory, name))
        expect(file.mode & OWNER_ONLY_BITS).toBe(0)
        if (typeof process.getuid === 'function') expect(file.uid).toBe(process.getuid())
      }
    } finally {
      await recorder.close()
    }
  })

  it('writes no answer into a spool folder that other users can write to', async () => {
    const spoolDirectory = join(await temporaryFolder(), 'shared')
    await mkdir(spoolDirectory)
    await chmod(spoolDirectory, 0o777)
    harness.api.stub('record_answer_events', {
      status: 503,
      body: { error: { code: 'service_unavailable', message: 'Try again.' } },
    })
    const recorder = recorderAt(spoolDirectory, idOf('kb'), idOf('prj'))
    try {
      recorder.record(answerDrafts(3))
      expect(await readdir(spoolDirectory)).toEqual([])
    } finally {
      await recorder.close()
    }
  })
})
