import { HIMRING_OPERATIONS, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { isRecord, type JsonSchema, type ToolArguments, type ToolSchemaParts } from './tool-schema.js'

type WireWidening = 'listed' | 'whole_number' | 'flag'

const RULES_KEYWORD = 'x-himring-rules'
const LISTED_RULE_KINDS: ReadonlySet<string> = new Set(['array'])
const WHOLE_NUMBER_RULE_KINDS: ReadonlySet<string> = new Set(['number', 'safe_integer', 'min_value', 'max_value'])
const FLAG_TEXTS: readonly string[] = ['false', 'true']
const LIST_SEPARATOR = ','

const WIDENED_SCHEMAS: Readonly<Record<WireWidening, JsonSchema>> = {
  listed: { type: 'array', items: { type: 'string' } },
  whole_number: { type: 'integer' },
  flag: { type: 'boolean' },
}

export interface ExtraInput {
  properties?: Readonly<Record<string, JsonSchema>> | undefined
  required?: readonly string[] | undefined
  optional?: readonly string[] | undefined
  omitted?: readonly string[] | undefined
}

function ruleKindsOf(schema: JsonSchema): Set<string> {
  const rules = schema[RULES_KEYWORD]
  const kinds = new Set<string>()
  if (!Array.isArray(rules)) return kinds
  for (const rule of rules) if (isRecord(rule) && typeof rule.kind === 'string') kinds.add(rule.kind)
  return kinds
}

function isFlagEnum(value: unknown): boolean {
  if (!Array.isArray(value) || value.length !== FLAG_TEXTS.length) return false
  return [...value].sort().every((item, position) => item === FLAG_TEXTS[position])
}

function wideningOf(schema: JsonSchema): WireWidening | undefined {
  if (isFlagEnum(schema.enum)) return 'flag'
  if (schema.type !== 'string') return undefined
  const kinds = ruleKindsOf(schema)
  if ([...kinds].some(kind => LISTED_RULE_KINDS.has(kind))) return 'listed'
  if ([...kinds].some(kind => WHOLE_NUMBER_RULE_KINDS.has(kind))) return 'whole_number'
  return undefined
}

function wireTextOf(widening: WireWidening, value: unknown): unknown {
  if (widening === 'listed' && Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return value.join(LIST_SEPARATOR)
  }
  if (widening === 'whole_number' && typeof value === 'number' && Number.isSafeInteger(value)) return String(value)
  if (widening === 'flag' && typeof value === 'boolean') return String(value)
  return value
}

function widenedSchemaOf(schema: JsonSchema, widening: WireWidening): JsonSchema {
  const { description, ...wire } = schema
  return {
    ...(typeof description === 'string' ? { description } : {}),
    anyOf: [wire, WIDENED_SCHEMAS[widening]],
  }
}

function recordOf(value: unknown): Record<string, JsonSchema> {
  const record: Record<string, JsonSchema> = {}
  if (!isRecord(value)) return record
  for (const [name, schema] of Object.entries(value)) if (isRecord(schema)) record[name] = schema
  return record
}

function textListOf(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string') : []
}

export function operationInputOf(id: HimringOperationId, extra: ExtraInput = {}): ToolSchemaParts {
  const operation = HIMRING_OPERATIONS[id]
  const base = HIMRING_OPERATION_CATALOGUE[id].inputSchema
  const omitted = new Set(extra.omitted ?? [])
  const properties = { ...recordOf(base.properties), ...extra.properties }
  for (const name of omitted) delete properties[name]
  const optional = new Set([...(extra.optional ?? []), ...omitted])
  const required = [...textListOf(base.required).filter(name => !optional.has(name)), ...(extra.required ?? [])]
  const widenings = new Map<string, WireWidening>()
  for (const name of [...operation.pathParameters, ...operation.queryParameters]) {
    const schema = properties[name]
    const widening = schema === undefined ? undefined : wideningOf(schema)
    if (widening !== undefined) widenings.set(name, widening)
  }
  const advertisedProperties = { ...properties }
  for (const [name, widening] of widenings) {
    const schema = properties[name]
    if (schema !== undefined) advertisedProperties[name] = widenedSchemaOf(schema, widening)
  }
  const checked = { ...base, properties, required }
  return {
    checked,
    advertised: { ...checked, properties: advertisedProperties },
    toChecked: (value: ToolArguments) => {
      if (widenings.size === 0) return value
      const converted = { ...value }
      for (const [name, widening] of widenings) {
        if (Object.hasOwn(converted, name)) converted[name] = wireTextOf(widening, converted[name])
      }
      return converted
    },
  }
}

export function operationPropertyOf(id: HimringOperationId, name: string): JsonSchema {
  const schema = recordOf(HIMRING_OPERATION_CATALOGUE[id].inputSchema.properties)[name]
  if (schema === undefined) throw new Error(`The spec gives ${id} no field called ${name}.`)
  return schema
}
