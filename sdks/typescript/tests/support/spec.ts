import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SPEC_DIRECTORY = join(import.meta.dirname, '..', '..', '..', '..', 'spec')
const DOCUMENT_FILES = ['openapi.json', 'openapi-session.json']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export interface SpecOperation {
  method: string
  path: string
  operation: Record<string, unknown>
}

export function specOperationIds(): string[] {
  const operationIds = new Set<string>()
  for (const file of DOCUMENT_FILES) {
    const document: unknown = JSON.parse(readFileSync(join(SPEC_DIRECTORY, file), 'utf8'))
    const paths = isRecord(document) && isRecord(document.paths) ? document.paths : {}
    for (const item of Object.values(paths)) {
      if (!isRecord(item)) continue
      for (const operation of Object.values(item)) {
        if (isRecord(operation) && typeof operation.operationId === 'string') operationIds.add(operation.operationId)
      }
    }
  }
  return [...operationIds].sort()
}

export function specOperation(operationId: string): SpecOperation {
  for (const file of DOCUMENT_FILES) {
    const document: unknown = JSON.parse(readFileSync(join(SPEC_DIRECTORY, file), 'utf8'))
    const paths = isRecord(document) && isRecord(document.paths) ? document.paths : {}
    for (const [path, item] of Object.entries(paths)) {
      if (!isRecord(item)) continue
      for (const [method, operation] of Object.entries(item)) {
        if (isRecord(operation) && operation.operationId === operationId) return { method, path, operation }
      }
    }
  }
  throw new Error(`The spec has no operation ${operationId}.`)
}

export function documentedMaximumBodyBytes(operationId: string): number {
  const { operation } = specOperation(operationId)
  const body = operation.requestBody
  const limit = isRecord(body) ? body['x-himring-maximum-bytes'] : undefined
  if (typeof limit !== 'number') throw new Error(`The spec gives ${operationId} no body limit.`)
  return limit
}
