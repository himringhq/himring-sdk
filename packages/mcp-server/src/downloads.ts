import { randomUUID } from 'node:crypto'
import { link, lstat, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { type Download, HimringApiError, safeDownloadName } from '@himring/sdk'
import { isDownload, type SavedDownload, saveDownload } from '@himring/sdk/folders'
import { ToolRefusedError } from './tool-results.js'
import type { JsonSchema } from './tool-schema.js'

const FILE_NAME_STEM_PATTERN = '[A-Za-z0-9][A-Za-z0-9._-]{0,200}'
const PATTERN_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g
const FALLBACK_FILE_NAME = 'download'
const DOWNLOAD_REFUSED = 'download_refused'

type ChunkRead = Awaited<ReturnType<ReadableStreamDefaultReader<Uint8Array>['read']>>

export interface DownloadGuard {
  idleTimeoutMs: number
  signal: AbortSignal | undefined
}

export function downloadFileNameSchema(extension: string): JsonSchema {
  const example = extension === '' ? 'handbook.pdf' : `articles${extension}`
  const ending = extension === '' ? '' : ` that ends in ${extension}`
  const sentence = `Use a plain file name${ending}, with letters, digits, dots, hyphens, and underscores, such as ${example}.`
  return {
    type: 'string',
    pattern: `^${FILE_NAME_STEM_PATTERN}${extension.replace(PATTERN_SPECIAL_CHARACTERS, '\\$&')}$`,
    description: `The name of the file to write. ${sentence}`,
    'x-himring-rules': [{ kind: 'regex', message: sentence }],
  }
}

function nameFromApi(fileName: string, extension: string): string {
  const safe = safeDownloadName(fileName, FALLBACK_FILE_NAME)
  if (extension === '' || safe.toLowerCase().endsWith(extension.toLowerCase())) return safe
  return `${safe}${extension}`
}

function isFileExists(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST'
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

async function holdsEntry(path: string): Promise<boolean> {
  try {
    await lstat(path)
    return true
  } catch (error) {
    if (isMissing(error)) return false
    throw error
  }
}

function existsRefusal(path: string): ToolRefusedError {
  return new ToolRefusedError(
    DOWNLOAD_REFUSED,
    `${path} already exists, and the tool never replaces a file. Pass another file_name.`,
  )
}

function readWithin(reader: ReadableStreamDefaultReader<Uint8Array>, guard: DownloadGuard): Promise<ChunkRead> {
  return new Promise((resolve, reject) => {
    function release(): void {
      clearTimeout(timer)
      guard.signal?.removeEventListener('abort', stopForCaller)
    }
    function stop(reason: unknown): void {
      release()
      reader.cancel(reason).catch(() => undefined)
      reject(reason)
    }
    function stopForCaller(): void {
      stop(guard.signal?.reason)
    }
    const timer = setTimeout(() => {
      stop(
        new HimringApiError(
          'timeout',
          `The download sent no bytes for ${guard.idleTimeoutMs} ms, so the tool stopped it and kept no part of the file. Try again.`,
        ),
      )
    }, guard.idleTimeoutMs)
    guard.signal?.addEventListener('abort', stopForCaller, { once: true })
    if (guard.signal?.aborted === true) {
      stopForCaller()
      return
    }
    reader.read().then(
      read => {
        release()
        resolve(read)
      },
      (error: unknown) => {
        release()
        reject(error)
      },
    )
  })
}

function guardedBody(body: ReadableStream<Uint8Array>, guard: DownloadGuard): ReadableStream<Uint8Array> {
  const reader = body.getReader()
  return new ReadableStream<Uint8Array>(
    {
      async pull(controller) {
        const read = await readWithin(reader, guard)
        if (read.done) controller.close()
        else controller.enqueue(read.value)
      },
      cancel(reason) {
        return reader.cancel(reason)
      },
    },
    { highWaterMark: 0 },
  )
}

export async function writeDownload(
  result: unknown,
  directory: string,
  requestedName: string | undefined,
  extension: string,
  guard: DownloadGuard,
): Promise<SavedDownload> {
  if (!isDownload(result))
    throw new HimringApiError('invalid_response', 'The API answered the download without a file.')
  const download: Download = result
  const target = join(directory, requestedName ?? nameFromApi(download.file_name, extension))
  if (await holdsEntry(target)) {
    await download.body.cancel().catch(() => undefined)
    throw existsRefusal(target)
  }
  const partial = join(directory, `.himring-download-${randomUUID()}.part`)
  try {
    const saved = await saveDownload({ ...download, body: guardedBody(download.body, guard) }, partial)
    try {
      await link(partial, target)
    } catch (error) {
      if (isFileExists(error)) throw existsRefusal(target)
      throw error
    }
    return { ...saved, file: target }
  } finally {
    await rm(partial, { force: true })
  }
}
