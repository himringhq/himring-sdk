import type { Citation, HimringOperationId, ListApiKeysOutput, ListFilesOutput } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { compiledGuard, type JsonSchema } from './spec-schemas.js'

export type KeyPermissions = ListApiKeysOutput['api_keys'][number]['permissions']
export type UnreadPart = ListFilesOutput['files'][number]['unread_parts'][number]
export interface PassageMatch {
  citation: Citation
}

const KEY_ACCESS_FIELD = 'access'

function isSchema(value: unknown): value is JsonSchema {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function outputSchemaAt(id: HimringOperationId, keys: readonly string[]): JsonSchema {
  let current: unknown = HIMRING_OPERATION_CATALOGUE[id].outputSchema
  for (const key of keys) current = isSchema(current) ? current[key] : undefined
  if (!isSchema(current)) throw new Error(`The spec of ${id} has no output schema at ${keys.join('.')}.`)
  return current
}

function lazyGuard<Value>(schema: () => JsonSchema): (value: unknown) => value is Value {
  let guard: ((value: unknown) => value is Value) | undefined
  return (value: unknown): value is Value => {
    guard ??= compiledGuard<Value>(schema())
    return guard(value)
  }
}

const PASSAGE_FIELDS = ['properties', 'passages', 'items', 'properties']
const KEY_PERMISSIONS_FIELDS = ['properties', 'api_keys', 'items', 'properties', 'permissions']

export const isCitation = lazyGuard<Citation>(() =>
  outputSchemaAt('search_knowledge_base', [...PASSAGE_FIELDS, 'citation']),
)

export const isPassageMatch = lazyGuard<PassageMatch>(() =>
  outputSchemaAt('search_knowledge_base', [...PASSAGE_FIELDS, 'match']),
)

export const isUnreadParts = lazyGuard<UnreadPart[]>(() =>
  outputSchemaAt('list_files', ['properties', 'files', 'items', 'properties', 'unread_parts']),
)

export const isKeyPermissions = lazyGuard<KeyPermissions>(() => outputSchemaAt('list_api_keys', KEY_PERMISSIONS_FIELDS))

export function keyResourceKinds(): string[] {
  const properties = outputSchemaAt('list_api_keys', [...KEY_PERMISSIONS_FIELDS, 'properties'])
  return Object.keys(properties).filter(kind => kind !== KEY_ACCESS_FIELD)
}
