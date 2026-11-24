import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { type DocumentedOperation, isObject, objectAt, PublishedDocuments } from './documents.js'

const LOOPBACK_HOST = '127.0.0.1'
const BODY_LIMIT_BYTES = 64 * 1024 * 1024
const CONTROL_PREFIX = '/__contract/'
const JSON_MEDIA_TYPE = 'application/json'
const FILE_MEDIA_TYPE = 'application/octet-stream'

export interface ContractRequest {
  operation_id: string | undefined
  method: string
  path: string
  path_parameters: Record<string, string>
  query: Record<string, string>
  headers: Record<string, string>
  body: unknown
  raw_body: Buffer
  problems: string[]
}

export interface ContractReply {
  status: number
  body?: unknown
  raw?: Uint8Array | string | undefined
  headers?: Readonly<Record<string, string>> | undefined
}

export type ContractHandler = (request: ContractRequest) => ContractReply | Promise<ContractReply>

export interface ContractServer {
  readonly baseUrl: string
  readonly documents: PublishedDocuments
  readonly requests: readonly ContractRequest[]
  readonly problems: readonly string[]
  stub(operationId: string, reply: ContractReply | ContractHandler): void
  route(method: string, path: string, handler: ContractHandler): void
  reset(): void
  stop(): Promise<void>
}

export interface ContractServerOptions {
  control?: boolean
  documents?: PublishedDocuments
}

export function errorReply(status: number, code: string, message: string, extra: Record<string, unknown> = {}) {
  return { status, body: { error: { code, message, ...extra } } }
}

function headersOf(request: IncomingMessage): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') headers[name] = value
    else if (Array.isArray(value)) headers[name] = value.join(', ')
  }
  return headers
}

async function bodyOf(request: IncomingMessage): Promise<Buffer | undefined> {
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))
    total += buffer.byteLength
    if (total > BODY_LIMIT_BYTES) return undefined
    chunks.push(buffer)
  }
  return Buffer.concat(chunks)
}

function write(response: ServerResponse, reply: ContractReply): void {
  const raw = reply.raw ?? (reply.body === undefined ? '' : JSON.stringify(reply.body))
  const bytes = typeof raw === 'string' ? Buffer.from(raw, 'utf8') : Buffer.from(raw)
  const headers: Record<string, string> = {
    'content-length': String(bytes.byteLength),
    'x-request-id': 'req_contract',
    ...(reply.raw === undefined && reply.body !== undefined ? { 'content-type': JSON_MEDIA_TYPE } : {}),
    ...reply.headers,
  }
  response.writeHead(reply.status, headers)
  response.end(bytes)
}

function mediaTypeOf(headers: Record<string, string>): string {
  return (headers['content-type'] ?? '').split(';')[0]?.trim().toLowerCase() ?? ''
}

function decodedPath(values: Record<string, string>): Record<string, string> | undefined {
  const decoded: Record<string, string> = {}
  try {
    for (const [name, value] of Object.entries(values)) decoded[name] = decodeURIComponent(value)
  } catch {
    return undefined
  }
  return decoded
}

function queryOf(search: URLSearchParams): Record<string, string> | string {
  const query: Record<string, string> = {}
  for (const [name, value] of search) {
    if (Object.hasOwn(query, name)) return name
    query[name] = value
  }
  return query
}

export async function startContractServer(options: ContractServerOptions = {}): Promise<ContractServer> {
  const documents = options.documents ?? new PublishedDocuments()
  const stubs = new Map<string, ContractHandler>()
  const routes = new Map<string, ContractHandler>()
  const requests: ContractRequest[] = []
  const problems: string[] = []

  function requestProblems(operation: DocumentedOperation, request: ContractRequest): string[] {
    const found: string[] = []
    for (const parameter of operation.parameters) {
      const value =
        parameter.location === 'path' ? request.path_parameters[parameter.name] : request.query[parameter.name]
      if (value === undefined) {
        if (parameter.required) found.push(`${parameter.location} parameter ${parameter.name} is missing.`)
        continue
      }
      found.push(...documents.problemsOf(operation.file, parameter.schemaKeys, value, `${parameter.name}`))
    }
    const known = new Set(operation.parameters.filter(item => item.location === 'query').map(item => item.name))
    for (const name of Object.keys(request.query)) {
      if (!known.has(name)) found.push(`The query parameter ${name} is not documented.`)
    }
    const type = mediaTypeOf(request.headers)
    if (operation.bodyKind === 'json') {
      if (type !== JSON_MEDIA_TYPE) found.push(`The body is ${type || 'missing its content type'}, not JSON.`)
      else {
        const keys = [...operation.keys, 'requestBody', 'content', JSON_MEDIA_TYPE, 'schema']
        found.push(...documents.problemsOf(operation.file, keys, request.body, 'The body'))
      }
    } else if (operation.bodyKind === 'file') {
      if (type !== FILE_MEDIA_TYPE) found.push(`The file body is ${type || 'missing its content type'}.`)
    } else if (request.raw_body.byteLength > 0) {
      found.push(`${operation.id} takes no body, but the request sent ${request.raw_body.byteLength} bytes.`)
    }
    return found
  }

  function checkReply(operation: DocumentedOperation, reply: ContractReply): void {
    if (reply.status >= 400) {
      const keys = ['components', 'schemas', 'error_envelope']
      problems.push(...documents.problemsOf(operation.file, keys, reply.body, `The ${operation.id} refusal`))
      return
    }
    const success = documents.successResponseKeys(operation)
    if (success === undefined || success.status !== reply.status) {
      problems.push(`${operation.id} answered ${reply.status}, which its document does not list.`)
      return
    }
    const schemaKeys = [...success.keys, 'content', JSON_MEDIA_TYPE, 'schema']
    if (reply.raw === undefined && documents.hasSchemaAt(operation.file, schemaKeys)) {
      const schema = objectAt(operation.operation, schemaKeys.slice(operation.keys.length))
      if (isObject(schema) && schema.format === 'binary') return
      problems.push(...documents.problemsOf(operation.file, schemaKeys, reply.body, `The ${operation.id} answer`))
    }
  }

  async function answer(request: IncomingMessage): Promise<ContractReply> {
    const method = (request.method ?? 'GET').toUpperCase()
    const url = new URL(request.url ?? '/', `http://${LOOPBACK_HOST}`)
    const raw = await bodyOf(request)
    if (raw === undefined) return errorReply(413, 'payload_too_large', 'The contract server takes at most 64 MiB.')
    const headers = headersOf(request)
    const query = queryOf(url.searchParams)
    if (typeof query === 'string') {
      return errorReply(400, 'validation_failed', `Send ${query} once.`, {
        issues: [{ message: 'Repeated.', path: [query] }],
      })
    }
    const base: ContractRequest = {
      operation_id: undefined,
      method,
      path: url.pathname,
      path_parameters: {},
      query,
      headers,
      body: undefined,
      raw_body: raw,
      problems: [],
    }
    if (mediaTypeOf(headers) === JSON_MEDIA_TYPE && raw.byteLength > 0) {
      try {
        base.body = JSON.parse(raw.toString('utf8'))
      } catch {
        requests.push(base)
        return errorReply(400, 'invalid_json', 'The request body is not valid JSON.')
      }
    }
    if (options.control === true && url.pathname.startsWith(CONTROL_PREFIX)) return control(method, url.pathname, base)
    const plainRoute = routes.get(`${method} ${url.pathname}`)
    if (plainRoute !== undefined) {
      requests.push(base)
      return plainRoute(base)
    }
    const matched = documents.match(method, url.pathname)
    if (matched === undefined) {
      requests.push(base)
      return errorReply(404, 'not_found', `No documented operation takes ${method} ${url.pathname}.`)
    }
    const { operation } = matched
    const pathParameters = decodedPath(matched.pathValues)
    const recorded: ContractRequest = { ...base, operation_id: operation.id, path_parameters: pathParameters ?? {} }
    requests.push(recorded)
    if (pathParameters === undefined) {
      return errorReply(400, 'invalid_path_parameter', 'A part of the path is not valid percent-encoding.')
    }
    if (operation.maximumBodyBytes !== undefined && raw.byteLength > operation.maximumBodyBytes) {
      return errorReply(413, 'file_too_large', 'The file is larger than this operation takes.')
    }
    if (operation.needsCredential && !/^Bearer \S+$/.test(headers.authorization ?? '')) {
      return errorReply(401, 'credential_required', 'Send a credential in the Authorization header.')
    }
    recorded.problems = requestProblems(operation, recorded)
    if (recorded.problems.length > 0) {
      return errorReply(400, 'validation_failed', recorded.problems.join(' '), {
        issues: recorded.problems.map(message => ({ message, path: [] })),
      })
    }
    const handler = stubs.get(operation.id)
    if (handler === undefined) return errorReply(501, 'internal_error', `${operation.id} has no stub.`)
    const reply = await handler(recorded)
    checkReply(operation, reply)
    return reply
  }

  function control(method: string, path: string, request: ContractRequest): ContractReply {
    if (method === 'POST' && path === `${CONTROL_PREFIX}stubs`) {
      const body = request.body
      if (!isObject(body) || typeof body.operation_id !== 'string' || typeof body.status !== 'number') {
        return errorReply(400, 'validation_failed', 'Send operation_id and status.')
      }
      documents.operation(body.operation_id)
      const replies = Array.isArray(body.replies) ? body.replies.filter(isObject) : [body]
      let index = 0
      stubs.set(body.operation_id, () => {
        const next = replies[Math.min(index, replies.length - 1)] ?? body
        index += 1
        const headers = isObject(next.headers) ? next.headers : {}
        return {
          status: typeof next.status === 'number' ? next.status : 200,
          body: next.body,
          headers: Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, String(value)])),
        }
      })
      return { status: 204 }
    }
    if (method === 'GET' && path === `${CONTROL_PREFIX}requests`) {
      return {
        status: 200,
        body: {
          requests: requests.map(({ raw_body, ...rest }) => ({ ...rest, raw_body_bytes: raw_body.byteLength })),
          problems,
        },
      }
    }
    if (method === 'POST' && path === `${CONTROL_PREFIX}reset`) {
      reset()
      return { status: 204 }
    }
    return errorReply(404, 'not_found', `The contract server has no control route ${method} ${path}.`)
  }

  function reset(): void {
    stubs.clear()
    routes.clear()
    requests.length = 0
    problems.length = 0
  }

  const server = createServer((request, response) => {
    answer(request)
      .then(reply => write(response, reply))
      .catch(error => {
        problems.push(`The contract server failed: ${error instanceof Error ? error.message : String(error)}`)
        write(response, errorReply(500, 'internal_error', 'The contract server failed.'))
      })
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, LOOPBACK_HOST, () => {
      server.off('error', reject)
      resolve()
    })
  })
  const address = server.address()
  if (address === null || typeof address === 'string') throw new Error('The contract server has no TCP port.')
  const { port } = address satisfies AddressInfo
  return {
    baseUrl: `http://${LOOPBACK_HOST}:${port}`,
    documents,
    requests,
    problems,
    stub(operationId, reply) {
      documents.operation(operationId)
      stubs.set(operationId, typeof reply === 'function' ? reply : () => reply)
    },
    route(method, path, handler) {
      routes.set(`${method.toUpperCase()} ${path}`, handler)
    },
    reset,
    stop: () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close(error => (error === undefined ? resolve() : reject(error)))
      }),
  }
}
