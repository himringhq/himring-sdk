import { invalidInput } from './errors.js'
import type { HimringOperationDescription } from './operation-description.js'
import { checkedInput } from './operation-shapes.js'
import type { RawBody } from './transport.js'

export interface RequestParts {
  path: string
  query: URLSearchParams | undefined
  body: Record<string, unknown> | undefined
  rawBody: RawBody | undefined
}

const DOT_SEGMENTS: ReadonlySet<string> = new Set(['.', '..'])
const FILE_CONTENT_FIELD = 'content'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFileContent(value: unknown): value is RawBody {
  return value instanceof Blob || value instanceof Uint8Array || value instanceof ReadableStream
}

function pathSegmentOf(operation: HimringOperationDescription, name: string, value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw invalidInput(`${operation.id} needs ${name} as text in the path.`, name)
  }
  const text = String(value)
  if (text.length === 0 || DOT_SEGMENTS.has(text)) {
    throw invalidInput(`${operation.id} needs ${name}, and it cannot be empty, '.', or '..'.`, name)
  }
  return encodeURIComponent(text)
}

function queryTextOf(value: unknown): string {
  if (Array.isArray(value)) return value.map(item => queryTextOf(item)).join(',')
  if (isRecord(value)) return JSON.stringify(value)
  return String(value)
}

function fileBodyOf(operation: HimringOperationDescription, input: Record<string, unknown>): RawBody {
  const content = input[FILE_CONTENT_FIELD]
  if (!isFileContent(content)) {
    throw invalidInput(
      `${operation.id} needs the file under content, as a Blob, a Uint8Array, or a ReadableStream.`,
      FILE_CONTENT_FIELD,
    )
  }
  if (operation.body !== 'file') return content
  const size = content instanceof Blob ? content.size : content instanceof Uint8Array ? content.byteLength : undefined
  if (size !== undefined && size > operation.maximumBodyBytes) {
    throw invalidInput(
      `${operation.id} takes a file of at most ${operation.maximumBodyBytes} bytes, and this one holds ${size}.`,
      FILE_CONTENT_FIELD,
    )
  }
  return content
}

export function requestPartsOf(operation: HimringOperationDescription, raw: unknown): RequestParts {
  if (raw !== undefined && !isRecord(raw))
    throw invalidInput(`The input of ${operation.id} must be an object.`, undefined)
  const input: Record<string, unknown> = raw ?? {}
  const { [FILE_CONTENT_FIELD]: _content, ...withoutContent } = input
  checkedInput(operation.id, operation.body === 'file' ? withoutContent : input)
  const pathNames = new Set(operation.pathParameters)
  const path = operation.path.replace(/\{([^}]+)\}/g, (_whole, name: string) =>
    pathSegmentOf(operation, name, input[name]),
  )
  const rest = Object.entries(input).filter(([name, value]) => !pathNames.has(name) && value !== undefined)
  if (operation.body === 'json') {
    return { path, query: undefined, body: Object.fromEntries(rest), rawBody: undefined }
  }
  const rawBody = operation.body === 'file' ? fileBodyOf(operation, input) : undefined
  const queryNames = new Set(operation.queryParameters)
  const query = new URLSearchParams()
  for (const [name, value] of rest) {
    if (operation.body === 'file' && name === FILE_CONTENT_FIELD) continue
    if (!queryNames.has(name)) throw invalidInput(`${operation.id} takes no field called ${name}.`, name)
    if (value === null) throw invalidInput(`${operation.id} takes ${name} as text, not null.`, name)
    query.set(name, queryTextOf(value))
  }
  return { path, query: query.size === 0 ? undefined : query, body: undefined, rawBody }
}
