import type { StandardSchemaV1, StandardSchemaWithJSON } from '@modelcontextprotocol/server'
import { Ajv2020, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js'

export type JsonSchema = Readonly<Record<string, unknown>>
export type ToolArguments = Record<string, unknown>
export type ToolSchema = StandardSchemaWithJSON<ToolArguments, ToolArguments>

const RULES_KEYWORD = 'x-himring-rules'
const EXTENSION_KEYWORD_PREFIX = 'x-himring-'
const SCHEMA_MAP_KEYWORDS: ReadonlySet<string> = new Set(['properties', 'patternProperties', '$defs'])
const TOOL_SCHEMA_VENDOR = 'himring'

const RULE_KIND_OF_KEYWORD: ReadonlyMap<string, string> = new Map([
  ['maxLength', 'max_length'],
  ['maxItems', 'max_length'],
  ['minLength', 'min_length'],
  ['minItems', 'min_length'],
  ['maximum', 'max_value'],
  ['minimum', 'min_value'],
  ['pattern', 'regex'],
  ['enum', 'picklist'],
])

const validators = new Ajv2020({ strict: false, allErrors: false, verbose: true, validateFormats: false })

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function withoutExtensions(value: unknown, isSchemaMap = false): unknown {
  if (Array.isArray(value)) return value.map(item => withoutExtensions(item))
  if (!isRecord(value)) return value
  const kept: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value)) {
    if (!isSchemaMap && key.startsWith(EXTENSION_KEYWORD_PREFIX)) continue
    kept[key] = withoutExtensions(child, !isSchemaMap && SCHEMA_MAP_KEYWORDS.has(key))
  }
  return kept
}

export function advertisedSchemaOf(schema: JsonSchema): JsonSchema {
  const stripped = withoutExtensions(schema)
  return isRecord(stripped) ? stripped : {}
}

function ruleMessageOf(error: ErrorObject): string | undefined {
  const kind = RULE_KIND_OF_KEYWORD.get(error.keyword)
  const parent: unknown = error.parentSchema
  if (kind === undefined || !isRecord(parent)) return undefined
  const rules = parent[RULES_KEYWORD]
  if (!Array.isArray(rules)) return undefined
  for (const rule of rules) {
    if (isRecord(rule) && rule.kind === kind && typeof rule.message === 'string') return rule.message
  }
  return undefined
}

function decodedPointerSegment(segment: string): string {
  return segment.replaceAll('~1', '/').replaceAll('~0', '~')
}

function messageOf(error: ErrorObject): string {
  const ruleMessage = ruleMessageOf(error)
  if (ruleMessage !== undefined) return ruleMessage
  const params: unknown = error.params
  if (error.keyword === 'required' && isRecord(params) && typeof params.missingProperty === 'string') {
    return `Send ${params.missingProperty}.`
  }
  if (error.keyword === 'additionalProperties' && isRecord(params) && typeof params.additionalProperty === 'string') {
    return `Remove ${params.additionalProperty}, because the tool takes no field by that name.`
  }
  return `The value ${error.message ?? 'breaks the schema of the tool'}.`
}

function issuesOf(errors: readonly ErrorObject[] | null | undefined): StandardSchemaV1.Issue[] {
  const found = (errors ?? []).map(error => ({
    message: messageOf(error),
    path: error.instancePath.split('/').slice(1).map(decodedPointerSegment),
  }))
  return found.length > 0 ? found : [{ message: 'The value breaks the schema of the tool.' }]
}

export type SchemaCheck = (value: unknown) => StandardSchemaV1.Issue[] | undefined

export function schemaCheckOf(schema: JsonSchema): SchemaCheck {
  let validate: ValidateFunction | undefined
  return value => {
    validate ??= validators.compile(schema)
    return validate(value) ? undefined : issuesOf(validate.errors)
  }
}

export function describeIssues(issues: readonly StandardSchemaV1.Issue[]): string {
  return issues
    .map(issue => {
      const path = (issue.path ?? []).map(segment => String(typeof segment === 'object' ? segment.key : segment))
      return path.length === 0 ? issue.message : `${path.join('.')}: ${issue.message}`
    })
    .join(' ')
}

export interface ToolSchemaParts {
  advertised: JsonSchema
  checked: JsonSchema
  toChecked?: ((value: ToolArguments) => ToolArguments) | undefined
}

export function toolSchemaOf(parts: ToolSchemaParts): ToolSchema {
  const check = schemaCheckOf(parts.checked)
  const advertised = advertisedSchemaOf(parts.advertised)
  return {
    '~standard': {
      version: 1,
      vendor: TOOL_SCHEMA_VENDOR,
      validate(value) {
        if (!isRecord(value)) return { issues: [{ message: 'Send the arguments of the tool as an object.' }] }
        const converted = parts.toChecked === undefined ? value : parts.toChecked(value)
        const issues = check(converted)
        return issues === undefined ? { value: converted } : { issues }
      },
      jsonSchema: {
        input: () => ({ ...advertised }),
        output: () => ({ ...advertised }),
      },
    },
  }
}

export function plainToolSchemaOf(schema: JsonSchema): ToolSchema {
  return toolSchemaOf({ advertised: schema, checked: schema })
}
