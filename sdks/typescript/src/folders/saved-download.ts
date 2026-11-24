import { randomUUID } from 'node:crypto'
import { constants, createWriteStream } from 'node:fs'
import { copyFile, link, lstat, rename, rm } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { HimringApiError } from '../core/errors.js'
import type { Download } from '../core/types.js'

const OWNER_READ_WRITE = 0o600
const UNLINKABLE_FILE_SYSTEM_CODES: ReadonlySet<unknown> = new Set([
  'EPERM',
  'ENOTSUP',
  'EOPNOTSUPP',
  'EXDEV',
  'ENOSYS',
])

export class DownloadTargetExistsError extends Error {
  override readonly name = 'DownloadTargetExistsError'
  readonly path: string

  constructor(path: string) {
    super(`${path} already exists.`)
    this.path = path
  }
}

export interface SavedDownload {
  file: string
  bytes: number
  content_type: string
}

export interface SaveDownloadOptions {
  replace?: boolean | undefined
}

export function isDownload(value: unknown): value is Download {
  return (
    typeof value === 'object' &&
    value !== null &&
    'body' in value &&
    value.body instanceof ReadableStream &&
    'file_name' in value &&
    typeof value.file_name === 'string' &&
    'content_type' in value &&
    typeof value.content_type === 'string'
  )
}

function codeOf(error: unknown): unknown {
  return error instanceof Error && 'code' in error ? error.code : undefined
}

async function exists(path: string): Promise<boolean> {
  try {
    await lstat(path)
    return true
  } catch (error) {
    if (codeOf(error) === 'ENOENT') return false
    throw error
  }
}

async function placeWithoutReplacing(partial: string, path: string): Promise<void> {
  try {
    await link(partial, path)
  } catch (error) {
    if (codeOf(error) === 'EEXIST') throw new DownloadTargetExistsError(path)
    if (!UNLINKABLE_FILE_SYSTEM_CODES.has(codeOf(error))) throw error
    try {
      await copyFile(partial, path, constants.COPYFILE_EXCL)
    } catch (copyError) {
      if (codeOf(copyError) === 'EEXIST') throw new DownloadTargetExistsError(path)
      throw copyError
    }
  }
  await rm(partial, { force: true })
}

export async function saveDownload(
  download: Download,
  path: string,
  options: SaveDownloadOptions = {},
): Promise<SavedDownload> {
  const replace = options.replace === true
  if (!replace && (await exists(path))) {
    await download.body.cancel().catch(() => undefined)
    throw new DownloadTargetExistsError(path)
  }
  const partial = join(dirname(path), `.${basename(path)}.${randomUUID()}.partial`)
  let bytes = 0
  try {
    const file = createWriteStream(partial, { flags: 'wx', mode: OWNER_READ_WRITE })
    const source = Readable.fromWeb(download.body)
    source.on('data', (chunk: Buffer) => {
      bytes += chunk.byteLength
    })
    await pipeline(source, file)
    if (download.content_length !== undefined && bytes !== download.content_length) {
      throw new HimringApiError(
        'network',
        `The download of ${path} ended after ${bytes} of ${download.content_length} bytes. Download it again.`,
      )
    }
    if (replace) await rename(partial, path)
    else await placeWithoutReplacing(partial, path)
  } catch (error) {
    await download.body.cancel().catch(() => undefined)
    await rm(partial, { force: true })
    throw error
  }
  return { file: path, bytes, content_type: download.content_type }
}
