import { randomBytes } from 'node:crypto'
import { rmSync } from 'node:fs'
import { link, rename, rm, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { HimringApiError, safeDownloadName } from '@himring/sdk'
import { isDownload, type SavedDownload, saveDownload } from '@himring/sdk/folders'
import { UsageError } from './usage-error.js'

const FALLBACK_FILE_NAME = 'download'
const INTERRUPTED_EXIT_CODE = 130
const WRITE_FAILURE_CODES: ReadonlySet<string> = new Set(['ENOENT', 'EACCES', 'EPERM', 'EISDIR', 'ENOTDIR', 'EROFS'])
const NO_HARD_LINK_CODES: ReadonlySet<string> = new Set(['EPERM', 'ENOTSUP', 'EXDEV', 'EOPNOTSUPP'])

export interface DownloadTarget {
  out: string | undefined
  force: boolean
  idleTimeoutMs: number
}

function withIdleLimit(body: ReadableStream<Uint8Array>, idleTimeoutMs: number): ReadableStream<Uint8Array> {
  const reader = body.getReader()
  return new ReadableStream<Uint8Array>(
    {
      async pull(controller) {
        let timer: ReturnType<typeof setTimeout> | undefined
        const stalled = new Promise<never>((_resolve, reject) => {
          timer = setTimeout(() => {
            reject(
              new HimringApiError(
                'timeout',
                `The download sent no data for ${idleTimeoutMs} ms, so the CLI stopped it.`,
              ),
            )
          }, idleTimeoutMs)
        })
        try {
          const read = await Promise.race([reader.read(), stalled])
          if (read.done) controller.close()
          else controller.enqueue(read.value)
        } catch (error) {
          await reader.cancel(error).catch(() => undefined)
          throw error
        } finally {
          clearTimeout(timer)
        }
      },
      cancel(reason) {
        return reader.cancel(reason)
      },
    },
    { highWaterMark: 0 },
  )
}

function codeOf(error: unknown): string | undefined {
  if (!(error instanceof Error) || !('code' in error)) return undefined
  return typeof error.code === 'string' ? error.code : undefined
}

async function exists(path: string): Promise<boolean> {
  return (await stat(path).catch(() => undefined)) !== undefined
}

function alreadyExists(path: string): UsageError {
  return new UsageError(`${path} already exists.`, 'Pass --force to replace it, or --out with another path.')
}

function downloadFailure(error: unknown, path: string): unknown {
  if (error instanceof UsageError || error instanceof HimringApiError) return error
  const code = codeOf(error)
  if (code !== undefined && WRITE_FAILURE_CODES.has(code)) {
    return new UsageError(
      `The CLI could not write ${path} (${code}).`,
      'Pass --out with a path in a folder that you can write.',
    )
  }
  return new HimringApiError(
    'network',
    `The download of ${path} stopped before the whole file arrived, so the CLI kept no part of it.`,
    { cause: error },
  )
}

async function placeWithoutReplacing(temporary: string, target: string): Promise<void> {
  try {
    await link(temporary, target)
  } catch (error) {
    const code = codeOf(error)
    if (code === 'EEXIST') throw alreadyExists(target)
    if (code === undefined || !NO_HARD_LINK_CODES.has(code)) throw error
    if (await exists(target)) throw alreadyExists(target)
    await rename(temporary, target)
  }
}

export async function saveDownloadTo(result: unknown, target: DownloadTarget): Promise<SavedDownload> {
  if (!isDownload(result))
    throw new HimringApiError('invalid_response', 'The API answered the download without a file.')
  const path = resolve(target.out ?? safeDownloadName(result.file_name, FALLBACK_FILE_NAME))
  if (!target.force && (await exists(path))) {
    await result.body.cancel().catch(() => undefined)
    throw alreadyExists(path)
  }
  const temporary = join(dirname(path), `.himring-download-${randomBytes(8).toString('hex')}.part`)
  const removeOnInterrupt = () => {
    rmSync(temporary, { force: true })
    process.exit(INTERRUPTED_EXIT_CODE)
  }
  process.once('SIGINT', removeOnInterrupt)
  try {
    const saved = await saveDownload({ ...result, body: withIdleLimit(result.body, target.idleTimeoutMs) }, temporary)
    if (target.force) await rename(temporary, path)
    else await placeWithoutReplacing(temporary, path)
    return { file: path, bytes: saved.bytes, content_type: saved.content_type }
  } catch (error) {
    await result.body.cancel().catch(() => undefined)
    throw downloadFailure(error, path)
  } finally {
    process.off('SIGINT', removeOnInterrupt)
    await rm(temporary, { force: true })
  }
}
