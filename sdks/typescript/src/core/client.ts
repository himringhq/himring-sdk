import * as v from 'valibot'
import { createFileTransfers, type FileTransfers } from '../files/file-transfers.js'
import { bindOperationMethods, type HimringOperationMethods } from '../generated/methods.js'
import { HIMRING_OPERATIONS, HIMRING_SPEC_API_URL, type HimringOperationId } from '../generated/operations.js'
import type { HimringOperationInputs, HimringOperationOutputs } from '../generated/types.js'
import { HimringApiError, invalidInput } from './errors.js'
import { idleLimitedStream } from './idle-stream.js'
import type { OperationCaller, RequestOptions } from './operation-caller.js'
import type { HimringOperationDescription } from './operation-description.js'
import { checkedOutput } from './operation-shapes.js'
import { type LivenessReport, livenessReportSchema, type ReadinessReport, readinessReportSchema } from './reports.js'
import { requestPartsOf } from './request-parts.js'
import {
  customHeadersOf,
  RAW_BODY_CONTENT_TYPE,
  readJson,
  refusalFrom,
  sendRequest,
  type TransportOptions,
} from './transport.js'
import type { Download } from './types.js'

export const DEFAULT_HIMRING_API_URL: string = HIMRING_SPEC_API_URL
export const DEFAULT_HIMRING_API_TIMEOUT_MS = 30_000
export const DEFAULT_HIMRING_UPLOAD_IDLE_TIMEOUT_MS = 120_000

const HTTP_OK = 200
const HTTP_SERVICE_UNAVAILABLE = 503
const FILE_NAME_PATTERN = /filename="([^"]+)"/
const ENCODED_FILE_NAME_PATTERN = /filename\*=UTF-8''([^;\s]+)/i
const DOWNLOAD_ID_FIELDS = ['index_id', 'file_id', 'memory_id', 'table_name'] as const

export interface HimringClientOptions {
  baseUrl?: string | undefined
  timeoutMs?: number | undefined
  uploadIdleTimeoutMs?: number | undefined
  fetch?: typeof globalThis.fetch | undefined
  credential?: string | undefined
  headers?: Readonly<Record<string, string>> | undefined
}

export interface HimringClientCore {
  readonly baseUrl: string
  getLiveness(options?: RequestOptions): Promise<LivenessReport>
  getReadiness(options?: RequestOptions): Promise<ReadinessReport>
  call: OperationCaller
  invoke(id: HimringOperationId, input: unknown, options?: RequestOptions): Promise<unknown>
  withCredential(credential: string | undefined): HimringClient
  withHeaders(headers: Readonly<Record<string, string>>): HimringClient
}

export type HimringClient = HimringClientCore & HimringOperationMethods & FileTransfers

function positiveMilliseconds(value: number | undefined, fallback: number, option: string): number {
  if (value === undefined) return fallback
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`Set ${option} to a whole number of milliseconds above zero.`)
  }
  return value
}

function apiUrlOf(baseUrl: string): URL {
  let url: URL
  try {
    url = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  } catch {
    throw new RangeError(`Set baseUrl to an http or https URL, such as ${DEFAULT_HIMRING_API_URL}.`)
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new RangeError(`Set baseUrl to an http or https URL, such as ${DEFAULT_HIMRING_API_URL}.`)
  }
  if (url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '') {
    throw new RangeError('Set baseUrl without a user name, a password, a query, or a fragment.')
  }
  return url
}

function decodedFileName(encoded: string | undefined): string | undefined {
  if (encoded === undefined) return undefined
  try {
    return decodeURIComponent(encoded)
  } catch {
    return undefined
  }
}

function fileNameOf(response: Response, fallback: string): string {
  const disposition = response.headers.get('content-disposition') ?? ''
  return (
    decodedFileName(ENCODED_FILE_NAME_PATTERN.exec(disposition)?.[1]) ??
    FILE_NAME_PATTERN.exec(disposition)?.[1] ??
    fallback
  )
}

function downloadNameOf(input: unknown, operation: HimringOperationDescription): string {
  const extension = operation.response.kind === 'download' ? operation.response.fileExtension : ''
  const record = typeof input === 'object' && input !== null ? input : {}
  for (const field of DOWNLOAD_ID_FIELDS) {
    const id = Reflect.get(record, field)
    if (typeof id === 'string' && id.length > 0) return `${id}${extension}`
  }
  return `download${extension}`
}

function assumedContentTypeOf(operation: HimringOperationDescription): string {
  if (operation.response.kind !== 'download') return RAW_BODY_CONTENT_TYPE
  const [only, ...others] = operation.response.contentTypes
  return only !== undefined && others.length === 0 ? only : RAW_BODY_CONTENT_TYPE
}

function headerOf(response: Response, name: string): string | undefined {
  return response.headers.get(name) ?? undefined
}

const OPERATION_DESCRIPTIONS: ReadonlyMap<string, HimringOperationDescription> = new Map(
  Object.values(HIMRING_OPERATIONS).map(operation => [operation.id, operation]),
)

function descriptionOf(id: string): HimringOperationDescription {
  const description = OPERATION_DESCRIPTIONS.get(id)
  if (description === undefined) throw invalidInput(`The API has no operation called ${id}.`, undefined)
  return description
}

export function createHimringClient(options: HimringClientOptions = {}): HimringClient {
  const baseUrl = apiUrlOf(options.baseUrl ?? DEFAULT_HIMRING_API_URL)
  const transport: TransportOptions = {
    baseUrl,
    timeoutMs: positiveMilliseconds(options.timeoutMs, DEFAULT_HIMRING_API_TIMEOUT_MS, 'timeoutMs'),
    fetch: options.fetch ?? globalThis.fetch,
    credential: options.credential,
    headers: customHeadersOf(options.headers ?? {}),
  }
  const uploadIdleTimeoutMs = positiveMilliseconds(
    options.uploadIdleTimeoutMs,
    DEFAULT_HIMRING_UPLOAD_IDLE_TIMEOUT_MS,
    'uploadIdleTimeoutMs',
  )

  async function readReport<Schema extends v.GenericSchema>(
    path: string,
    schema: Schema,
    acceptedStatuses: readonly number[],
    requestOptions: RequestOptions,
  ): Promise<v.InferOutput<Schema>> {
    const sent = await sendRequest(transport, {
      method: 'GET',
      path,
      keepTimerUntilBodyRead: true,
      signal: requestOptions.signal,
      timeoutMs: requestOptions.timeoutMs,
    })
    try {
      if (!acceptedStatuses.includes(sent.response.status)) throw await refusalFrom(sent.response, path)
      const parsed = v.safeParse(schema, await readJson(sent.response, path))
      if (parsed.success) return parsed.output
      throw new HimringApiError('invalid_response', `The API answered ${path} with a report of an unexpected shape.`, {
        status: sent.response.status,
        details: v.summarize(parsed.issues),
      })
    } finally {
      sent.finish()
    }
  }

  async function download(
    operation: HimringOperationDescription,
    input: unknown,
    requestOptions: RequestOptions,
  ): Promise<Download> {
    const parts = requestPartsOf(operation, input)
    const sent = await sendRequest(transport, {
      method: operation.method,
      ...parts,
      keepTimerUntilBodyRead: true,
      signal: requestOptions.signal,
      timeoutMs: requestOptions.timeoutMs,
    })
    try {
      if (!sent.response.ok) throw await refusalFrom(sent.response, operation.path)
    } finally {
      sent.finish()
    }
    if (sent.response.body === null) {
      throw new HimringApiError('invalid_response', `The API answered ${operation.path} with no file.`, {
        status: sent.response.status,
      })
    }
    const length = Number(sent.response.headers.get('content-length') ?? Number.NaN)
    const stalled = () =>
      new HimringApiError(
        'timeout',
        `The API sent no bytes of ${operation.path} for ${uploadIdleTimeoutMs} ms. Check the connection, then download it again.`,
        { status: sent.response.status },
      )
    return {
      status: sent.response.status,
      body: idleLimitedStream(sent.response.body, uploadIdleTimeoutMs, stalled, requestOptions.signal),
      file_name: fileNameOf(sent.response, downloadNameOf(input, operation)),
      content_type: headerOf(sent.response, 'content-type') ?? assumedContentTypeOf(operation),
      content_length: Number.isSafeInteger(length) && length >= 0 ? length : undefined,
      content_range: headerOf(sent.response, 'content-range'),
      accept_ranges: headerOf(sent.response, 'accept-ranges'),
      entity_tag: headerOf(sent.response, 'etag'),
    }
  }

  async function callJson(
    operation: HimringOperationDescription,
    input: unknown,
    requestOptions: RequestOptions,
  ): Promise<unknown> {
    const parts = requestPartsOf(operation, input)
    const sent = await sendRequest(transport, {
      method: operation.method,
      ...parts,
      idleTimeoutMs: parts.rawBody === undefined ? undefined : uploadIdleTimeoutMs,
      keepTimerUntilBodyRead: true,
      signal: requestOptions.signal,
      timeoutMs: requestOptions.timeoutMs,
    })
    try {
      if (!sent.response.ok) throw await refusalFrom(sent.response, operation.path)
      const output = await readJson(sent.response, operation.path)
      return checkedOutput(operation.id, output, sent.response.status, headerOf(sent.response, 'x-request-id'))
    } finally {
      sent.finish()
    }
  }

  async function invoke(id: HimringOperationId, input: unknown, requestOptions: RequestOptions = {}) {
    const operation = descriptionOf(id)
    if (operation.response.kind === 'download') return download(operation, input, requestOptions)
    return callJson(operation, input, requestOptions)
  }

  const call: OperationCaller = <Id extends HimringOperationId>(
    id: Id,
    input: HimringOperationInputs[Id] | undefined,
    requestOptions?: RequestOptions,
  ) => invoke(id, input, requestOptions ?? {}) as Promise<HimringOperationOutputs[Id]>

  const transfers = createFileTransfers(call, {
    fetch: (resource, init) => transport.fetch(resource, init),
    timeoutMs: transport.timeoutMs,
    idleTimeoutMs: uploadIdleTimeoutMs,
  })

  return {
    ...bindOperationMethods(call),
    ...transfers,
    baseUrl: baseUrl.href,
    getLiveness: (requestOptions = {}) => readReport('/health', livenessReportSchema, [HTTP_OK], requestOptions),
    getReadiness: (requestOptions = {}) =>
      readReport('/ready', readinessReportSchema, [HTTP_OK, HTTP_SERVICE_UNAVAILABLE], requestOptions),
    call,
    invoke,
    withCredential: credential => createHimringClient({ ...options, credential }),
    withHeaders: headers => createHimringClient({ ...options, headers: { ...options.headers, ...headers } }),
  }
}
