import * as v from 'valibot'
import { retryAfterSecondsOf } from './backoff.js'
import { HimringApiError, isRejectedRedirect } from './errors.js'

export const ERROR_ENVELOPE_SCHEMA = v.object({
  error: v.object({
    code: v.string(),
    message: v.string(),
    details: v.optional(v.string()),
    request_id: v.optional(v.string()),
    issues: v.optional(v.array(v.object({ message: v.string(), path: v.array(v.union([v.string(), v.number()])) }))),
    missing_permission: v.optional(
      v.object({ resource_kind: v.string(), level: v.string(), resource_id: v.nullable(v.string()) }),
    ),
  }),
})

export interface TransportOptions {
  baseUrl: URL
  timeoutMs: number
  fetch: typeof globalThis.fetch
  credential: string | undefined
  headers: Readonly<Record<string, string>>
}

export type RawBody = Blob | Uint8Array | ReadableStream<Uint8Array>

export interface TransportRequest {
  method: string
  path: string
  query?: URLSearchParams | undefined
  body?: unknown
  rawBody?: RawBody | undefined
  timeoutMs?: number | undefined
  idleTimeoutMs?: number | undefined
  signal?: AbortSignal | undefined
  keepTimerUntilBodyRead: boolean
}

export const RAW_BODY_CONTENT_TYPE = 'application/octet-stream'
const RESERVED_HEADERS: ReadonlySet<string> = new Set(['authorization', 'content-type', 'content-length', 'host'])

function streamOf(body: RawBody): ReadableStream<Uint8Array> {
  if (body instanceof ReadableStream) return body
  if (body instanceof Blob) return body.stream()
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(body)
      controller.close()
    },
  })
}

function progressOf(body: RawBody, onProgress: () => void): ReadableStream<Uint8Array> {
  const reader = streamOf(body).getReader()
  return new ReadableStream<Uint8Array>(
    {
      async pull(controller) {
        onProgress()
        const read = await reader.read()
        onProgress()
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

function bodyOf(request: TransportRequest, onProgress: () => void): RequestInit {
  if (request.rawBody !== undefined && request.idleTimeoutMs !== undefined) {
    return { body: progressOf(request.rawBody, onProgress), duplex: 'half' }
  }
  if (request.rawBody instanceof ReadableStream) return { body: request.rawBody, duplex: 'half' }
  if (request.rawBody !== undefined) return { body: request.rawBody }
  if (request.body !== undefined) return { body: JSON.stringify(request.body) }
  return {}
}

function timeoutMessage(baseUrl: URL, timeoutMs: number, idle: boolean): string {
  if (idle) {
    return `The upload to the API at ${baseUrl.href} made no progress for ${timeoutMs} ms. Check the connection, then send the file again.`
  }
  return `The API at ${baseUrl.href} did not respond within ${timeoutMs} ms. Try again, or raise the time limit.`
}

export interface TransportResponse {
  response: Response
  finish(): void
}

export function customHeadersOf(headers: Readonly<Record<string, string>>): Record<string, string> {
  const kept: Record<string, string> = {}
  for (const [name, value] of Object.entries(headers)) {
    const lower = name.toLowerCase()
    if (RESERVED_HEADERS.has(lower)) {
      throw new HimringApiError('invalid_input', `The client sets the ${lower} header itself. Remove it from headers.`)
    }
    kept[lower] = value
  }
  return kept
}

export async function sendRequest(options: TransportOptions, request: TransportRequest): Promise<TransportResponse> {
  const url = new URL(request.path.replace(/^\/+/, ''), options.baseUrl)
  if (request.query !== undefined) url.search = request.query.toString()
  const headers: Record<string, string> = { ...options.headers, accept: 'application/json' }
  if (options.credential !== undefined) headers.authorization = `Bearer ${options.credential}`
  if (request.rawBody !== undefined) headers['content-type'] = RAW_BODY_CONTENT_TYPE
  else if (request.body !== undefined) headers['content-type'] = 'application/json'

  const idle = request.idleTimeoutMs !== undefined
  const timeoutMs = request.idleTimeoutMs ?? request.timeoutMs ?? options.timeoutMs
  const controller = new AbortController()
  const callerSignal = request.signal
  const stopForCaller = () => controller.abort(callerSignal?.reason)
  callerSignal?.throwIfAborted()
  callerSignal?.addEventListener('abort', stopForCaller, { once: true })
  let finished = false
  let timedOut = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const arm = () => {
    clearTimeout(timer)
    if (finished) return
    timer = setTimeout(() => {
      timedOut = true
      controller.abort(new DOMException('timeout', 'TimeoutError'))
    }, timeoutMs)
  }
  const finish = () => {
    finished = true
    clearTimeout(timer)
    callerSignal?.removeEventListener('abort', stopForCaller)
  }
  arm()
  try {
    const response = await options.fetch(url, {
      method: request.method,
      headers,
      signal: controller.signal,
      redirect: request.rawBody === undefined ? 'manual' : 'error',
      ...bodyOf(request, arm),
    })
    if (!request.keepTimerUntilBodyRead) finish()
    else if (idle) arm()
    return { response, finish }
  } catch (error) {
    finish()
    if (callerSignal?.aborted === true) throw callerSignal.reason
    if (request.rawBody !== undefined && isRejectedRedirect(error)) {
      throw new HimringApiError('invalid_response', 'The API redirected the upload request.', { cause: error })
    }
    if (timedOut) {
      throw new HimringApiError('timeout', timeoutMessage(options.baseUrl, timeoutMs, idle), { cause: error })
    }
    throw new HimringApiError(
      'network',
      `The client could not reach the API at ${options.baseUrl.href}. Check the address and that the API is running.`,
      { cause: error },
    )
  }
}

export async function readJson(response: Response, path: string): Promise<unknown> {
  try {
    return await response.json()
  } catch (error) {
    throw new HimringApiError(
      'invalid_response',
      `The API answered ${path} with a body that is not JSON. Check that the address points at the Himring API.`,
      { status: response.status, cause: error },
    )
  }
}

export async function refusalFrom(response: Response, path: string): Promise<HimringApiError> {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = undefined
  }
  const envelope = v.safeParse(ERROR_ENVELOPE_SCHEMA, body)
  if (!envelope.success) {
    return new HimringApiError(
      'invalid_response',
      `The API answered ${path} with status ${response.status} and no error envelope. Check that the address points at the Himring API.`,
      { status: response.status, requestId: response.headers.get('x-request-id') ?? undefined },
    )
  }
  const { code, message, issues, details, request_id: requestId, missing_permission } = envelope.output.error
  return new HimringApiError('refused', message, {
    status: response.status,
    code,
    issues,
    details,
    missingPermission: missing_permission,
    retryAfterSeconds: retryAfterSecondsOf(response.headers.get('retry-after')),
    requestId: requestId ?? response.headers.get('x-request-id') ?? undefined,
  })
}
