import { boundedBytesOf, openLocalFile } from '@himring/sdk/folders'
import { UsageError } from './usage-error.js'

const BYTES_PER_MEBIBYTE = 1024 * 1024

export interface BoundedFileRead {
  givenPath: string
  absolutePath: string
  maximumBytes: number
  splitHint: string
}

export function sizeText(bytes: number): string {
  return bytes % BYTES_PER_MEBIBYTE === 0 ? `${bytes / BYTES_PER_MEBIBYTE} MiB` : `${bytes} bytes`
}

export async function boundedFileBytesOf(read: BoundedFileRead): Promise<Uint8Array> {
  const opened = await openLocalFile(read.absolutePath).catch(() => undefined)
  if (opened === undefined) {
    throw new UsageError(`${read.givenPath} is not a file that the CLI can read.`, 'Pass the path of a readable file.')
  }
  let content: Uint8Array | undefined
  try {
    content = await boundedBytesOf(opened, read.maximumBytes)
  } finally {
    await opened.close()
  }
  if (content === undefined) {
    throw new UsageError(`${read.givenPath} holds more than ${sizeText(read.maximumBytes)}.`, read.splitHint)
  }
  return content
}
