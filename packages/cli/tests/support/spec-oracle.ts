import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SPEC_FILES = ['openapi.json', 'openapi-session.json'] as const
const SPEC_DIRECTORY = new URL('../../../../spec/', import.meta.url)
const HTTP_METHODS: ReadonlySet<string> = new Set(['get', 'post', 'put', 'patch', 'delete'])

type JsonObject = Record<string, unknown>

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function documentOf(file: string): JsonObject {
  const parsed: unknown = JSON.parse(readFileSync(fileURLToPath(new URL(file, SPEC_DIRECTORY)), 'utf8'))
  if (!isObject(parsed)) throw new Error(`${file} is not a JSON object.`)
  return parsed
}

const DOCUMENTS = SPEC_FILES.map(documentOf)

export interface SpecOperation {
  method: string
  path: string
  operation: JsonObject
}

export function specOperation(operationId: string): SpecOperation {
  for (const document of DOCUMENTS) {
    const paths = isObject(document.paths) ? document.paths : {}
    for (const [path, item] of Object.entries(paths)) {
      if (!isObject(item)) continue
      for (const [method, operation] of Object.entries(item)) {
        if (HTTP_METHODS.has(method) && isObject(operation) && operation.operationId === operationId) {
          return { method: method.toUpperCase(), path, operation }
        }
      }
    }
  }
  throw new Error(`The spec has no operation called ${operationId}.`)
}

export function specMaximumBodyBytes(operationId: string): number {
  const body = specOperation(operationId).operation.requestBody
  const maximum = isObject(body) ? body['x-himring-maximum-bytes'] : undefined
  if (typeof maximum !== 'number') throw new Error(`The spec gives ${operationId} no maximum body size.`)
  return maximum
}

export function specParameterSchema(operationId: string, name: string): JsonObject {
  const parameters = specOperation(operationId).operation.parameters
  const found = Array.isArray(parameters)
    ? parameters.find(parameter => isObject(parameter) && parameter.name === name)
    : undefined
  if (!isObject(found) || !isObject(found.schema)) throw new Error(`${operationId} has no parameter ${name}.`)
  return found.schema
}

export function specRuleBound(schema: JsonObject, kind: string): number {
  const rules = Array.isArray(schema['x-himring-rules']) ? schema['x-himring-rules'] : []
  const rule = rules.find(candidate => isObject(candidate) && candidate.kind === kind)
  const expects = isObject(rule) ? rule.expects : undefined
  const digits = typeof expects === 'string' ? /^[<>]=(\d+)$/.exec(expects)?.[1] : undefined
  if (digits === undefined) throw new Error(`The schema has no ${kind} bound.`)
  return Number(digits)
}

export function specServerUrl(): string {
  const [first] = DOCUMENTS
  const servers = first?.servers
  const server = Array.isArray(servers) ? servers[0] : undefined
  if (!isObject(server) || typeof server.url !== 'string') throw new Error('The spec lists no server.')
  return server.url
}

export function filledPath(template: string, values: Record<string, string>): string {
  return template.replace(/\{([^}]+)\}/g, (_whole, name: string) => values[name] ?? `{${name}}`)
}
