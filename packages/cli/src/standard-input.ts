import type { Readable } from 'node:stream'
import { MAXIMUM_LOCAL_INPUT_BYTES } from './input-limits.js'
import { UsageError } from './usage-error.js'

async function readCapped(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of stream) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))
    total += bytes.byteLength
    if (total > MAXIMUM_LOCAL_INPUT_BYTES) {
      stream.destroy()
      throw new UsageError('stdin holds more than 8 MiB.', 'Split the input into smaller requests.')
    }
    chunks.push(bytes)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export function readStandardInputOnce(stream: Readable): () => Promise<string> {
  let alreadyRead = false
  return async () => {
    if (alreadyRead) {
      throw new UsageError(
        'Two options asked to read stdin.',
        'Read at most one input from stdin, and pass the others as files.',
      )
    }
    alreadyRead = true
    return readCapped(stream)
  }
}
