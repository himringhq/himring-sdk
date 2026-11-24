import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const SPEC_DIRECTORY = join(import.meta.dirname, '..', '..', '..', 'spec')
export const DOCUMENT_FILES = { api: 'openapi.json', session: 'openapi-session.json' } as const
export type DocumentName = keyof typeof DOCUMENT_FILES

export type JsonSchema = Record<string, unknown>

export interface KeyPermissionNeed {
  resource_kind: string
  level: 'read' | 'write'
  target: 'resource' | 'every' | 'any'
  resource_id_field: string | null
  only_with_field: string | null
}

export interface ParameterModel {
  name: string
  required: boolean
  schema: JsonSchema
}

export type BodyModel = { kind: 'none' } | { kind: 'json'; schema: JsonSchema } | { kind: 'file'; maximumBytes: number }

export type ResponseModel =
  | { kind: 'json'; status: number; schema: JsonSchema }
  | { kind: 'download'; status: number; contentTypes: string[]; fileExtension: string }

export interface OperationModel {
  id: string
  document: DocumentName
  method: 'GET' | 'POST' | 'DELETE'
  path: string
  tag: string
  summary: string
  access: string
  changesState: boolean
  dataAccess: string | undefined
  pathParameters: ParameterModel[]
  queryParameters: ParameterModel[]
  body: BodyModel
  response: ResponseModel
  keyPermissions: KeyPermissionNeed[] | undefined
}

export interface ErrorCodeModel {
  code: string
  status: number
  message: string
}

export interface SpecModel {
  operations: OperationModel[]
  errorCodes: ErrorCodeModel[]
  components: Record<DocumentName, JsonSchema>
  fileKinds: Record<string, string[]>
  serverUrl: string
}

export class SpecModelError extends Error {
  override readonly name = 'SpecModelError'
}

const JSON_MEDIA_TYPE = 'application/json'
const FILE_MEDIA_TYPE = 'application/octet-stream'
const OPERATION_ID_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/
const LISTED_EXTENSION_PATTERN = /^\.[a-z0-9]+$/
const FILE_KIND_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/
const KEY_LEVELS: ReadonlySet<unknown> = new Set(['read', 'write'])
const KEY_TARGETS: ReadonlySet<unknown> = new Set(['resource', 'every', 'any'])

function methodOf(key: string): OperationModel['method'] | undefined {
  if (key === 'get') return 'GET'
  if (key === 'post') return 'POST'
  if (key === 'delete') return 'DELETE'
  return undefined
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function recordAt(value: unknown, place: string): Record<string, unknown> {
  if (!isRecord(value)) throw new SpecModelError(`${place} is not a JSON object.`)
  return value
}

function textAt(value: unknown, place: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new SpecModelError(`${place} is not a text value.`)
  return value
}

function parameterOf(raw: unknown, place: string): { location: string; parameter: ParameterModel } {
  const parameter = recordAt(raw, place)
  const name = textAt(parameter.name, `${place} name`)
  const location = textAt(parameter.in, `${place} in`)
  if (location !== 'path' && location !== 'query') throw new SpecModelError(`${place} is in ${location}.`)
  if (location === 'query' && (parameter.style !== 'form' || parameter.explode !== false)) {
    throw new SpecModelError(`${place} is not a form parameter without explode.`)
  }
  return {
    location,
    parameter: { name, required: parameter.required === true, schema: recordAt(parameter.schema, `${place} schema`) },
  }
}

function bodyOf(operation: Record<string, unknown>, place: string): BodyModel {
  if (operation.requestBody === undefined) return { kind: 'none' }
  const body = recordAt(operation.requestBody, `${place} requestBody`)
  const content = recordAt(body.content, `${place} requestBody content`)
  const mediaTypes = Object.keys(content)
  if (body.required !== true || mediaTypes.length !== 1) {
    throw new SpecModelError(`${place} needs one required request body media type.`)
  }
  if (mediaTypes[0] === FILE_MEDIA_TYPE) {
    const limit = body['x-himring-maximum-bytes']
    if (typeof limit !== 'number' || !Number.isSafeInteger(limit) || limit <= 0) {
      throw new SpecModelError(`${place} takes a file without x-himring-maximum-bytes.`)
    }
    return { kind: 'file', maximumBytes: limit }
  }
  if (mediaTypes[0] !== JSON_MEDIA_TYPE) throw new SpecModelError(`${place} takes ${mediaTypes[0]}.`)
  const schema = recordAt(recordAt(content[JSON_MEDIA_TYPE], place).schema, `${place} body schema`)
  if (schema.type !== 'object' || !isRecord(schema.properties)) {
    throw new SpecModelError(`${place} takes a JSON body that is not an object with properties.`)
  }
  return { kind: 'json', schema }
}

function responseOf(operation: Record<string, unknown>, place: string): ResponseModel {
  const responses = recordAt(operation.responses, `${place} responses`)
  const successes = Object.entries(responses).filter(([status]) => /^2\d\d$/.test(status))
  const [only, ...others] = successes
  if (only === undefined || others.length > 0) throw new SpecModelError(`${place} has no single success response.`)
  const [statusText, raw] = only
  const response = recordAt(raw, `${place} ${statusText} response`)
  const content = recordAt(response.content, `${place} ${statusText} content`)
  const status = Number(statusText)
  const extension = response['x-himring-file-extension']
  if (extension !== undefined) {
    if (typeof extension !== 'string') throw new SpecModelError(`${place} has a file extension that is not text.`)
    return { kind: 'download', status, contentTypes: Object.keys(content), fileExtension: extension }
  }
  const json = recordAt(content[JSON_MEDIA_TYPE], `${place} JSON response`)
  return { kind: 'json', status, schema: recordAt(json.schema, `${place} response schema`) }
}

function keyPermissionsOf(operation: Record<string, unknown>, place: string): KeyPermissionNeed[] | undefined {
  const raw = operation['x-himring-key-permissions']
  const callableWithKey =
    Array.isArray(operation.security) && operation.security.some(item => isRecord(item) && 'api_key' in item)
  if (!callableWithKey) {
    if (raw !== undefined) throw new SpecModelError(`${place} lists key permissions, but no API key can call it.`)
    return undefined
  }
  if (!Array.isArray(raw)) throw new SpecModelError(`${place} lists no x-himring-key-permissions.`)
  return raw.map((item, index) => {
    const need = recordAt(item, `${place} key permission ${index}`)
    const resourceIdField = need.resource_id_field
    const onlyWithField = need.only_with_field
    if (
      typeof need.resource_kind !== 'string' ||
      !KEY_LEVELS.has(need.level) ||
      !KEY_TARGETS.has(need.target) ||
      (resourceIdField !== null && typeof resourceIdField !== 'string') ||
      (onlyWithField !== null && typeof onlyWithField !== 'string')
    ) {
      throw new SpecModelError(`${place} key permission ${index} has an unknown shape.`)
    }
    return {
      resource_kind: need.resource_kind,
      level: need.level === 'read' ? 'read' : 'write',
      target: need.target === 'resource' ? 'resource' : need.target === 'every' ? 'every' : 'any',
      resource_id_field: resourceIdField,
      only_with_field: onlyWithField,
    }
  })
}

function operationOf(
  document: DocumentName,
  path: string,
  methodKey: string,
  raw: unknown,
  method: OperationModel['method'],
): OperationModel {
  const place = `${DOCUMENT_FILES[document]} ${methodKey.toUpperCase()} ${path}`
  const operation = recordAt(raw, place)
  const id = textAt(operation.operationId, `${place} operationId`)
  if (!OPERATION_ID_PATTERN.test(id)) throw new SpecModelError(`${place} has the operationId ${id}, not snake_case.`)
  const tags = Array.isArray(operation.tags) ? operation.tags : []
  const pathParameters: ParameterModel[] = []
  const queryParameters: ParameterModel[] = []
  const parameters = Array.isArray(operation.parameters) ? operation.parameters : []
  for (const [index, item] of parameters.entries()) {
    const { location, parameter } = parameterOf(item, `${place} parameter ${index}`)
    if (location === 'path') pathParameters.push(parameter)
    else queryParameters.push(parameter)
  }
  const templated = [...path.matchAll(/\{([^}]+)\}/g)].map(match => match[1])
  if (templated.join(',') !== pathParameters.map(parameter => parameter.name).join(',')) {
    throw new SpecModelError(`${place} documents path parameters that differ from its path.`)
  }
  if (pathParameters.some(parameter => !parameter.required)) {
    throw new SpecModelError(`${place} has an optional path parameter.`)
  }
  const dataAccess = operation['x-himring-data-access']
  return {
    id,
    document,
    method,
    path,
    tag: textAt(tags[0], `${place} tag`),
    summary: textAt(operation.summary, `${place} summary`),
    access: textAt(operation['x-himring-access'], `${place} x-himring-access`),
    changesState: operation['x-himring-changes-state'] === true,
    dataAccess: typeof dataAccess === 'string' ? dataAccess : undefined,
    pathParameters,
    queryParameters,
    body: bodyOf(operation, place),
    response: responseOf(operation, place),
    keyPermissions: keyPermissionsOf(operation, place),
  }
}

function errorCodesOf(document: Record<string, unknown>, place: string): ErrorCodeModel[] {
  const components = recordAt(document.components, `${place} components`)
  const schemas = recordAt(components.schemas, `${place} schemas`)
  const errorCode = recordAt(schemas.error_code, `${place} error_code`)
  const codes = recordAt(errorCode['x-himring-error-codes'], `${place} x-himring-error-codes`)
  return Object.entries(codes).map(([code, raw]) => {
    const description = recordAt(raw, `${place} error code ${code}`)
    if (typeof description.status !== 'number' || typeof description.message !== 'string') {
      throw new SpecModelError(`${place} error code ${code} has no status and message.`)
    }
    return { code, status: description.status, message: description.message }
  })
}

function fileKindsOf(components: Record<string, unknown>, place: string): Record<string, string[]> {
  const kinds = recordAt(components['x-himring-file-kinds'], `${place} x-himring-file-kinds`)
  const owners = new Map<string, string>()
  const entries = Object.entries(kinds).map(([kind, raw]): [string, string[]] => {
    if (!FILE_KIND_PATTERN.test(kind)) throw new SpecModelError(`${place} lists the file kind ${kind}.`)
    if (!Array.isArray(raw) || raw.length === 0) throw new SpecModelError(`${place} lists no extensions for ${kind}.`)
    const extensions = raw.map(extension => {
      if (typeof extension !== 'string' || !LISTED_EXTENSION_PATTERN.test(extension)) {
        throw new SpecModelError(`${place} lists ${JSON.stringify(extension)} for ${kind}.`)
      }
      const owner = owners.get(extension)
      if (owner !== undefined) throw new SpecModelError(`${place} lists ${extension} for ${owner} and ${kind}.`)
      owners.set(extension, kind)
      return extension
    })
    return [kind, extensions]
  })
  if (entries.length === 0) throw new SpecModelError(`${place} lists no file kinds.`)
  return Object.fromEntries(entries)
}

function serverUrlOf(document: Record<string, unknown>, place: string): string {
  const servers = document.servers
  const first = Array.isArray(servers) ? servers[0] : undefined
  const url = textAt(isRecord(first) ? first.url : undefined, `${place} servers[0].url`)
  if (!URL.canParse(url) || new URL(url).protocol !== 'https:') {
    throw new SpecModelError(`${place} gives ${url} as its first server, which is not an https URL.`)
  }
  return url
}

function sameIn<Value>(found: ReadonlyMap<DocumentName, Value>, what: string): Value {
  const [first, ...others] = [...found.values()]
  if (first === undefined) throw new SpecModelError(`The documents give no ${what}.`)
  if (others.some(other => JSON.stringify(other) !== JSON.stringify(first))) {
    throw new SpecModelError(`The documents give different ${what}.`)
  }
  return first
}

export function loadSpecModel(directory = SPEC_DIRECTORY): SpecModel {
  const operations: OperationModel[] = []
  const errorCodes = new Map<string, ErrorCodeModel>()
  const components: Partial<Record<DocumentName, JsonSchema>> = {}
  const fileKinds = new Map<DocumentName, Record<string, string[]>>()
  const serverUrls = new Map<DocumentName, string>()
  for (const document of ['api', 'session'] as const) {
    const file = DOCUMENT_FILES[document]
    const parsed = recordAt(JSON.parse(readFileSync(join(directory, file), 'utf8')), file)
    const documentComponents = recordAt(parsed.components, `${file} components`)
    components[document] = documentComponents
    fileKinds.set(document, fileKindsOf(documentComponents, file))
    serverUrls.set(document, serverUrlOf(parsed, file))
    for (const [path, item] of Object.entries(recordAt(parsed.paths, `${file} paths`))) {
      for (const [methodKey, raw] of Object.entries(recordAt(item, `${file} ${path}`))) {
        const method = methodOf(methodKey)
        if (method === undefined) throw new SpecModelError(`${file} ${path} has the method ${methodKey}.`)
        operations.push(operationOf(document, path, methodKey, raw, method))
      }
    }
    for (const code of errorCodesOf(parsed, file)) {
      const known = errorCodes.get(code.code)
      if (known !== undefined && (known.status !== code.status || known.message !== code.message)) {
        throw new SpecModelError(`The documents describe the error code ${code.code} in two ways.`)
      }
      errorCodes.set(code.code, code)
    }
  }
  const ids = new Set<string>()
  for (const operation of operations) {
    if (ids.has(operation.id)) throw new SpecModelError(`The documents hold ${operation.id} twice.`)
    ids.add(operation.id)
  }
  const api = components.api
  const session = components.session
  if (api === undefined || session === undefined) throw new SpecModelError('A document has no components.')
  return {
    operations: operations.toSorted((left, right) => left.id.localeCompare(right.id)),
    errorCodes: [...errorCodes.values()].toSorted((left, right) => left.code.localeCompare(right.code)),
    components: { api, session },
    fileKinds: sameIn(fileKinds, 'file kinds'),
    serverUrl: sameIn(serverUrls, 'server URLs'),
  }
}
