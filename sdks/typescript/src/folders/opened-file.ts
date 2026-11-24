import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { type FileHandle, open, realpath, stat } from 'node:fs/promises'
import { isAbsolute, relative, sep } from 'node:path'
import { confirmDirectory, type DirectoryBoundary, directoryBoundaryOf } from './directory-boundary.js'

const READ_CHUNK_BYTES = 1024 * 1024
const PLAIN_OPEN_FLAGS = constants.O_RDONLY | constants.O_NONBLOCK
const CONFINED_OPEN_FLAGS = PLAIN_OPEN_FLAGS | constants.O_NOFOLLOW

export class LocalFileRefusedError extends Error {
  override readonly name = 'LocalFileRefusedError'
}

export interface FileDigest {
  sha256: string
  sizeBytes: number
}

export interface OpenedFile {
  readonly sizeBytes: number
  digest(): Promise<FileDigest>
  stream(start?: number, end?: number): ReadableStream<Uint8Array>
  read(start: number, end: number): Promise<Uint8Array>
  close(): Promise<void>
}

export function isInside(root: string, candidate: string): boolean {
  const between = relative(root, candidate)
  return between === '' || (!between.startsWith(`..${sep}`) && between !== '..' && !isAbsolute(between))
}

async function readAt(handle: FileHandle, position: number, limit = READ_CHUNK_BYTES): Promise<Uint8Array | undefined> {
  const length = Math.min(READ_CHUNK_BYTES, limit)
  if (length <= 0) return undefined
  const chunk = new Uint8Array(length)
  const { bytesRead } = await handle.read(chunk, 0, length, position)
  return bytesRead === 0 ? undefined : chunk.subarray(0, bytesRead)
}

async function readRange(handle: FileHandle, start: number, end: number): Promise<Uint8Array> {
  const bytes = new Uint8Array(end - start)
  let filled = 0
  while (filled < bytes.byteLength) {
    const { bytesRead } = await handle.read(bytes, filled, bytes.byteLength - filled, start + filled)
    if (bytesRead === 0) throw new LocalFileRefusedError('The file got shorter while it was being sent.')
    filled += bytesRead
  }
  return bytes
}

function openedFileOf(handle: FileHandle, sizeBytes: number): OpenedFile {
  return {
    sizeBytes,
    async digest() {
      const hash = createHash('sha256')
      let position = 0
      for (let chunk = await readAt(handle, 0); chunk !== undefined; chunk = await readAt(handle, position)) {
        hash.update(chunk)
        position += chunk.byteLength
      }
      return { sha256: hash.digest('hex'), sizeBytes: position }
    },
    stream(start = 0, end = Number.MAX_SAFE_INTEGER) {
      let position = start
      return new ReadableStream<Uint8Array>({
        async pull(controller) {
          const chunk = await readAt(handle, position, end - position)
          if (chunk === undefined) {
            controller.close()
            return
          }
          position += chunk.byteLength
          controller.enqueue(chunk)
        },
      })
    },
    read(start, end) {
      return readRange(handle, start, end)
    },
    close() {
      return handle.close()
    },
  }
}

async function confirmedInside(boundary: DirectoryBoundary, absolutePath: string, handle: FileHandle): Promise<void> {
  const opened = await handle.stat()
  await confirmDirectory(boundary)
  const resolved = await realpath(absolutePath)
  if (!isInside(boundary.path, resolved)) {
    throw new LocalFileRefusedError(`${absolutePath} leads outside ${boundary.path}, so it stays local.`)
  }
  const named = await stat(resolved)
  if (named.dev !== opened.dev || named.ino !== opened.ino) {
    throw new LocalFileRefusedError(`${absolutePath} changed while it was being opened, so it stays local.`)
  }
}

export async function boundedBytesOf(opened: OpenedFile, maximumBytes: number): Promise<Uint8Array | undefined> {
  if (opened.sizeBytes > maximumBytes) return undefined
  const chunks: Uint8Array[] = []
  let total = 0
  for await (const chunk of opened.stream()) {
    total += chunk.byteLength
    if (total > maximumBytes) return undefined
    chunks.push(chunk)
  }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return bytes
}

function isSymbolicLinkLoop(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ELOOP'
}

export async function openLocalFile(
  absolutePath: string,
  confinedTo?: string | DirectoryBoundary,
): Promise<OpenedFile> {
  const boundary = typeof confinedTo === 'string' ? await directoryBoundaryOf(confinedTo) : confinedTo
  let handle: FileHandle
  try {
    handle = await open(absolutePath, confinedTo === undefined ? PLAIN_OPEN_FLAGS : CONFINED_OPEN_FLAGS)
  } catch (error) {
    if (isSymbolicLinkLoop(error)) {
      throw new LocalFileRefusedError(`${absolutePath} is a symbolic link, and symbolic links stay local.`)
    }
    throw error
  }
  try {
    const details = await handle.stat()
    if (!details.isFile()) throw new LocalFileRefusedError(`${absolutePath} is not a regular file. Send a file.`)
    if (boundary !== undefined) await confirmedInside(boundary, absolutePath, handle)
    return openedFileOf(handle, details.size)
  } catch (error) {
    await handle.close()
    throw error
  }
}
