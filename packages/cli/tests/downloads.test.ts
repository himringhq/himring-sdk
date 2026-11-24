import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { join } from 'node:path'
import { type ContractServer, errorReply, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { EXIT, failureCodeOf, runCli } from './support/cli-run.js'
import { scratchFolders } from './support/scratch.js'

const PROJECT = 'prj_0123456789abcdef0123456789abcdef'
const INDEX = 'ix_0123456789abcdef0123456789abcdef'
const API_KEY = 'hmk_contract_test_key'
const SNAPSHOT = 'snapshot bytes of the index'
const PROMISED_BYTES = 1000
const CUT_DELAY_MS = 50
const SHORT_TIMEOUT_MS = '500'
const ESCAPING_NAMES = [
  'attachment; filename="../../escaped.nrsl"',
  "attachment; filename*=UTF-8''..%2F..%2Fescaped.nrsl",
  'attachment; filename="/etc/cron.d/escaped"',
  'attachment; filename="..\\\\..\\\\escaped.nrsl"',
  'attachment; filename=".bashrc"',
]

function snapshotReply(disposition: string) {
  return {
    status: 200,
    raw: SNAPSHOT,
    headers: { 'content-type': 'application/octet-stream', 'content-disposition': disposition },
  }
}

function startPartialServer(cutsTheConnection: boolean): Promise<Server> {
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'application/octet-stream', 'content-length': String(PROMISED_BYTES) })
    response.write('only part of the file')
    if (cutsTheConnection) setTimeout(() => response.socket?.destroy(), CUT_DELAY_MS)
  })
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)))
}

function stopServer(server: Server): Promise<void> {
  server.closeAllConnections()
  return new Promise(resolve => server.close(() => resolve()))
}

function urlOf(server: Server): string {
  const address: AddressInfo | string | null = server.address()
  if (address === null || typeof address === 'string') throw new Error('The test server has no TCP port.')
  return `http://127.0.0.1:${address.port}`
}

describe('downloads', () => {
  let server: ContractServer
  const scratch = scratchFolders()

  function download(cwd: string, extra: readonly string[] = [], apiUrl?: string) {
    return runCli(['indexes', 'download', '--index', INDEX, ...extra, '--output', 'json'], {
      environment: { HIMRING_API_URL: apiUrl ?? server.baseUrl, HIMRING_API_KEY: API_KEY, HIMRING_PROJECT: PROJECT },
      cwd,
    })
  }

  beforeAll(async () => {
    server = await startContractServer()
  })

  afterEach(async () => {
    server.reset()
    await scratch.removeAll()
  })

  afterAll(async () => {
    await server.stop()
  })

  it.each(ESCAPING_NAMES)('keeps a download named %s inside the working folder', async disposition => {
    const root = await scratch.make('escape')
    const work = join(root, 'work')
    await mkdir(work)
    server.stub('download_index', snapshotReply(disposition))
    const result = await download(work)
    expect(result.exitCode, result.stderr).toBe(EXIT.success)
    expect(await readdir(root)).toEqual(['work'])
    const saved = await readdir(work)
    expect(saved).toHaveLength(1)
    const [name] = saved
    expect(name?.startsWith('.')).toBe(false)
    expect(await readFile(join(work, name ?? ''), 'utf8')).toBe(SNAPSHOT)
  })

  it('refuses to replace a file without --force, and replaces it whole with --force', async () => {
    const work = await scratch.make('replace')
    const target = join(work, 'backup.nrsl')
    await writeFile(target, 'the copy that the owner keeps')
    server.stub('download_index', snapshotReply('attachment; filename="backup.nrsl"'))
    const refused = await download(work, ['--out', 'backup.nrsl'])
    expect([refused.exitCode, failureCodeOf(refused)]).toEqual([EXIT.usage, 'usage'])
    expect(await readFile(target, 'utf8')).toBe('the copy that the owner keeps')
    const replaced = await download(work, ['--out', 'backup.nrsl', '--force'])
    expect(replaced.exitCode, replaced.stderr).toBe(EXIT.success)
    expect(await readFile(target, 'utf8')).toBe(SNAPSHOT)
    expect(await readdir(work)).toEqual(['backup.nrsl'])
  })

  it('stops a download that sends no more data and leaves no file behind', async () => {
    const stalling = await startPartialServer(false)
    try {
      const work = await scratch.make('stalled')
      const stalled = await download(work, ['--out', 'stalled.nrsl', '--timeout-ms', SHORT_TIMEOUT_MS], urlOf(stalling))
      expect([stalled.exitCode, failureCodeOf(stalled)]).toEqual([EXIT.network, 'timeout'])
      expect(await readdir(work)).toEqual([])
    } finally {
      await stopServer(stalling)
    }
  })

  it('leaves no file behind when the API cuts the download short', async () => {
    const truncating = await startPartialServer(true)
    try {
      const work = await scratch.make('truncated')
      await writeFile(join(work, 'kept.nrsl'), 'the copy that the owner keeps')
      const fresh = await download(work, ['--out', 'fresh.nrsl'], urlOf(truncating))
      expect(fresh.exitCode, fresh.stdout).toBe(EXIT.network)
      const forced = await download(work, ['--out', 'kept.nrsl', '--force'], urlOf(truncating))
      expect(forced.exitCode, forced.stdout).toBe(EXIT.network)
      expect(await readdir(work)).toEqual(['kept.nrsl'])
      expect(await readFile(join(work, 'kept.nrsl'), 'utf8')).toBe('the copy that the owner keeps')
    } finally {
      await stopServer(truncating)
    }
  })

  it('writes no file when the API refuses the download', async () => {
    const work = await scratch.make('refused')
    server.stub('download_index', errorReply(404, 'index_not_found', 'The project has no such index.'))
    const result = await download(work)
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.notFound, 'index_not_found'])
    expect(await readdir(work)).toEqual([])
  })
})
