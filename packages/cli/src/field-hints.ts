import { isListRules, picklistChoicesOf, specRulesOf } from './spec-rules.js'
import type { JsonSchema } from './spec-schemas.js'
import { isRecord, isScalar } from './text-cells.js'

const PARSED_DEFAULT_KEYWORD = 'x-himring-parsed-default'

interface FieldHint {
  choices: readonly string[]
  manyChoices: boolean
  fallback: string | undefined
}

function optionsOf(schema: JsonSchema): JsonSchema[] {
  return Array.isArray(schema.anyOf) ? schema.anyOf.filter(isRecord) : []
}

function enumChoicesOf(schema: JsonSchema): string[] {
  if (Array.isArray(schema.enum)) return schema.enum.map(String)
  for (const option of optionsOf(schema)) {
    const found = enumChoicesOf(option)
    if (found.length > 0) return found
  }
  return []
}

function choicesOf(schema: JsonSchema): { choices: string[]; manyChoices: boolean } {
  const direct = enumChoicesOf(schema)
  if (direct.length > 0) return { choices: direct, manyChoices: false }
  if (schema.type === 'array' && isRecord(schema.items)) {
    const listed = enumChoicesOf(schema.items)
    if (listed.length > 0) return { choices: listed, manyChoices: true }
  }
  const rules = specRulesOf(schema)
  const picklist = rules.find(rule => rule.kind === 'picklist')
  const choices = picklist === undefined ? [] : picklistChoicesOf(picklist)
  return { choices, manyChoices: choices.length > 0 && isListRules(rules) }
}

function fallbackOf(schema: JsonSchema): string | undefined {
  const fallback = schema.default ?? schema[PARSED_DEFAULT_KEYWORD]
  if (!isScalar(fallback) || fallback === undefined || fallback === null || fallback === '') return undefined
  return String(fallback)
}

export function fieldHintOf(schema: JsonSchema): FieldHint {
  return { ...choicesOf(schema), fallback: fallbackOf(schema) }
}

export function hintText(hint: FieldHint): string {
  const parts: string[] = []
  if (hint.choices.length > 0) {
    const listed = hint.choices.join(', ')
    parts.push(hint.manyChoices ? `any of ${listed}, separated by commas` : `one of ${listed}`)
  }
  if (hint.fallback !== undefined) parts.push(`default ${hint.fallback}`)
  return parts.length === 0 ? '' : ` (${parts.join('; ')})`
}
