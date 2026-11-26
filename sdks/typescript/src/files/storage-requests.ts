import { retryAfterSecondsOf } from '../core/backoff.js'
import { HimringApiError, isRejectedRedirect } from '../core/errors.js'
import type { UploadBody } from './upload-sources.js'

export interface StorageTransport {
  fetch: typeof globalThis.fetch
  timeoutMs: number
  idleTimeoutMs: number
}

export interface StoragePut {
  url: string
  headers: Readonly<Record<string, string>>
  body: UploadBody
  sizeBytes: number
  signal: AbortSignal | undefined
}

const MINIMUM_SEND_BYTES_PER_SECOND = 64 * 1024
const MILLISECONDS_PER_SECOND = 1_000
const STORAGE_PROTOCOLS: ReadonlySet<string> = new Set(['https:', 'http:'])

function signalWithin(timeoutMs: number, signal: AbortSignal | undefined) {
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort(new DOMException('timeout', 'TimeoutError'))
  }, timeoutMs)
  const onAbort = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', onAbort, { once: true })
  if (signal?.aborted === true) onAbort()
  return {
    signal: controller.signal,
    timedOut: () => timedOut,
    release() {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
    },
  }
}

function storageUrlOf(url: string): URL {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new HimringApiError('invalid_response', 'The API signed a storage link that is not a URL.')
  }
  if (!STORAGE_PROTOCOLS.has(parsed.protocol)) {
    throw new HimringApiError('invalid_response', `The API signed a storage link with the scheme ${parsed.protocol}.`)
  }
  return parsed
}

function sendTimeoutMs(transport: StorageTransport, sizeBytes: number): number {
  return transport.idleTimeoutMs + Math.ceil((sizeBytes / MINIMUM_SEND_BYTES_PER_SECOND) * MILLISECONDS_PER_SECOND)
}

export interface StorageAnswer {
  status: number
  retryAfterSeconds: number | undefined
}

export async function putToStorage(transport: StorageTransport, put: StoragePut): Promise<StorageAnswer> {
  const url = storageUrlOf(put.url)
  const timeoutMs = sendTimeoutMs(transport, put.sizeBytes)
  const deadline = signalWithin(timeoutMs, put.signal)
  const streamed = put.body instanceof ReadableStream
  try {
    const response = await transport.fetch(url, {
      method: 'PUT',
      headers: streamed ? { ...put.headers, 'content-length': String(put.sizeBytes) } : put.headers,
      body: put.body,
      signal: deadline.signal,
      redirect: streamed ? 'error' : 'manual',
      ...(streamed ? { duplex: 'half' } : {}),
    })
    await response.body?.cancel()
    return { status: response.status, retryAfterSeconds: retryAfterSecondsOf(response.headers.get('retry-after')) }
  } catch (error) {
    put.signal?.throwIfAborted()
    if (streamed && isRejectedRedirect(error)) {
      throw new HimringApiError('refused', 'Storage redirected the signed upload request.', { cause: error })
    }
    if (deadline.timedOut()) {
      throw new HimringApiError(
        'timeout',
        `Storage took more than ${timeoutMs} ms to take ${put.sizeBytes} bytes. Check the connection, then send the file again.`,
        { cause: error },
      )
    }
    throw new HimringApiError(
      'network',
      'The client could not reach storage to send the file. Check the connection, then send the file again.',
      { cause: error },
    )
  } finally {
    deadline.release()
  }
}

export async function getFromStorage(
  transport: StorageTransport,
  url: string,
  headers: Readonly<Record<string, string>>,
  signal: AbortSignal | undefined,
): Promise<Response> {
  const parsed = storageUrlOf(url)
  const deadline = signalWithin(transport.timeoutMs, signal)
  try {
    return await transport.fetch(parsed, { method: 'GET', headers, signal: deadline.signal, redirect: 'manual' })
  } catch (error) {
    deadline.release()
    signal?.throwIfAborted()
    throw new HimringApiError(
      deadline.timedOut() ? 'timeout' : 'network',
      deadline.timedOut()
        ? `Storage did not start the download within ${transport.timeoutMs} ms. Try again.`
        : 'The client could not reach storage to download the file. Check the connection, then try again.',
      { cause: error },
    )
  } finally {
    deadline.release()
  }
}
