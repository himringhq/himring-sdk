import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'
import { HimringApiError } from '../core/errors.js'

export interface UploadSource {
  readonly sizeBytes: number
  read(start: number, end: number): Promise<Uint8Array>
  stream?(start: number, end: number): ReadableStream<Uint8Array>
}

export type UploadContent = Blob | Uint8Array | UploadSource

export type UploadBody = Blob | Uint8Array | ReadableStream<Uint8Array>

const NATIVE_DIGEST_MAXIMUM_BYTES = 64 * 1024 * 1024
const INCREMENTAL_DIGEST_WINDOW_BYTES = 8 * 1024 * 1024

function isUploadSource(value: unknown): value is UploadSource {
  if (typeof value !== 'object' || value === null) return false
  const sizeBytes = Reflect.get(value, 'sizeBytes')
  return (
    typeof sizeBytes === 'number' &&
    Number.isSafeInteger(sizeBytes) &&
    sizeBytes >= 0 &&
    typeof Reflect.get(value, 'read') === 'function'
  )
}

export function isUploadContent(value: unknown): value is UploadContent {
  return value instanceof Blob || value instanceof Uint8Array || isUploadSource(value)
}

function blobSource(blob: Blob): UploadSource {
  return {
    sizeBytes: blob.size,
    async read(start, end) {
      return new Uint8Array(await blob.slice(start, end).arrayBuffer())
    },
  }
}

function bytesSource(bytes: Uint8Array): UploadSource {
  return {
    sizeBytes: bytes.byteLength,
    async read(start, end) {
      return bytes.subarray(start, end)
    },
  }
}

export function uploadSourceOf(content: UploadContent): UploadSource {
  if (content instanceof Blob) return blobSource(content)
  if (content instanceof Uint8Array) return bytesSource(content)
  return content
}

export function uploadBodyOf(content: UploadContent, start: number, end: number): UploadBody | Promise<Uint8Array> {
  if (content instanceof Blob) return content.slice(start, end)
  if (content instanceof Uint8Array) return content.subarray(start, end)
  if (content.stream !== undefined) return content.stream(start, end)
  return content.read(start, end)
}

function hexOf(digest: ArrayBuffer): string {
  return bytesToHex(new Uint8Array(digest))
}

function digestibleOf(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  if (bytes.buffer instanceof ArrayBuffer) return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy
}

export async function sha256HexOf(bytes: Uint8Array): Promise<string> {
  const subtle = globalThis.crypto?.subtle
  if (subtle === undefined) return bytesToHex(sha256(bytes))
  return hexOf(await subtle.digest('SHA-256', digestibleOf(bytes)))
}

function checkedWindow(window: Uint8Array, expectedBytes: number): Uint8Array {
  if (window.byteLength === expectedBytes) return window
  throw new HimringApiError(
    'invalid_input',
    'The file changed size while the client read it. Send it again once nothing writes to it.',
  )
}

export async function contentSha256Of(content: UploadContent, signal: AbortSignal | undefined): Promise<string> {
  const source = uploadSourceOf(content)
  if (source.sizeBytes <= NATIVE_DIGEST_MAXIMUM_BYTES) {
    return sha256HexOf(checkedWindow(await source.read(0, source.sizeBytes), source.sizeBytes))
  }
  const hash = sha256.create()
  for (let start = 0; start < source.sizeBytes; start += INCREMENTAL_DIGEST_WINDOW_BYTES) {
    signal?.throwIfAborted()
    const end = Math.min(source.sizeBytes, start + INCREMENTAL_DIGEST_WINDOW_BYTES)
    hash.update(checkedWindow(await source.read(start, end), end - start))
  }
  return bytesToHex(hash.digest())
}

export async function partBytesOf(content: UploadContent, start: number, end: number): Promise<Uint8Array> {
  return checkedWindow(await uploadSourceOf(content).read(start, end), end - start)
}
