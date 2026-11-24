import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SPEC_FILES = ['openapi.json', 'openapi-session.json'] as const
const HTTP_METHODS: ReadonlySet<string> = new Set(['get', 'post', 'put', 'patch', 'delete'])

export interface SpecOperation {
  id: string
  maximumBodyBytes: number | undefined
  fileExtension: string | undefined
  hasFileBody: boolean
  input: Record<string, unknown>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function at(root: unknown, ...keys: string[]): unknown {
  let current = root
  for (const key of keys) current = isRecord(current) ? current[key] : undefined
  return current
}

function successResponseOf(operation: Record<string, unknown>): unknown {
  const responses = at(operation, 'responses')
  if (!isRecord(responses)) return undefined
  const status = Object.keys(responses).find(code => /^2\d\d$/.test(code))
  return status === undefined ? undefined : responses[status]
}

function operationsOf(file: string): SpecOperation[] {
  const document: unknown = JSON.parse(
    readFileSync(fileURLToPath(new URL(`../../../../spec/${file}`, import.meta.url)), 'utf8'),
  )
  const found: SpecOperation[] = []
  const paths = at(document, 'paths')
  for (const item of Object.values(isRecord(paths) ? paths : {})) {
    for (const [method, operation] of Object.entries(isRecord(item) ? item : {})) {
      if (!HTTP_METHODS.has(method) || !isRecord(operation) || typeof operation.operationId !== 'string') continue
      const maximum = at(operation, 'requestBody', 'x-himring-maximum-bytes')
      const extension = at(successResponseOf(operation), 'x-himring-file-extension')
      found.push({
        id: operation.operationId,
        maximumBodyBytes: typeof maximum === 'number' ? maximum : undefined,
        fileExtension: typeof extension === 'string' ? extension : undefined,
        hasFileBody: at(operation, 'requestBody', 'content', 'application/octet-stream') !== undefined,
        input: operation,
      })
    }
  }
  return found
}

export const SPEC_OPERATIONS: readonly SpecOperation[] = SPEC_FILES.flatMap(operationsOf)

export function specOperation(id: string): SpecOperation {
  const found = SPEC_OPERATIONS.find(operation => operation.id === id)
  if (found === undefined) throw new Error(`The spec holds no operation called ${id}.`)
  return found
}

export function specMaximumBodyBytes(id: string): number {
  const maximum = specOperation(id).maximumBodyBytes
  if (maximum === undefined) throw new Error(`The spec gives ${id} no maximum body size.`)
  return maximum
}

export function specRequestBodyFieldMaximumLength(id: string, field: string): number {
  const maximum = at(
    specOperation(id).input,
    'requestBody',
    'content',
    'application/json',
    'schema',
    'properties',
    field,
    'maxLength',
  )
  if (typeof maximum !== 'number') throw new Error(`The spec gives ${id} no maxLength for ${field}.`)
  return maximum
}
