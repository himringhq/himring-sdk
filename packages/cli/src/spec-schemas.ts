import { HimringApiError, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { Ajv2020, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js'
import { RULES_KEYWORD, ruleFailuresOf, specRulesOf } from './spec-rules.js'
import { UsageError } from './usage-error.js'

export type JsonSchema = Record<string, unknown>

interface RuleCheck {
  (rules: unknown, data: unknown): boolean
  errors?: Partial<ErrorObject>[]
}

const checkRules: RuleCheck = (rules, data) => {
  const failures = ruleFailuresOf(rules, data)
  checkRules.errors = failures.map(message => ({ keyword: RULES_KEYWORD, message, params: {} }))
  return failures.length === 0
}

const ajv = new Ajv2020({ strict: false, allErrors: true, verbose: true, validateFormats: false })
ajv.addKeyword({ keyword: RULES_KEYWORD, schemaType: 'array', errors: true, validate: checkRules })

const RULE_KINDS_OF_KEYWORD: Readonly<Record<string, readonly string[]>> = {
  maxLength: ['max_length'],
  minLength: ['min_length'],
  maxItems: ['max_length'],
  minItems: ['min_length'],
  maximum: ['max_value'],
  minimum: ['min_value'],
  pattern: ['number', 'regex'],
  enum: ['picklist'],
}
const COMBINING_KEYWORDS: ReadonlySet<string> = new Set(['anyOf', 'oneOf', 'if'])
const SENTENCE_END = /[.!?]$/

function isRecord(value: unknown): value is JsonSchema {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function inputSchemaOf(id: HimringOperationId): JsonSchema {
  return HIMRING_OPERATION_CATALOGUE[id].inputSchema
}

export function inputPropertiesOf(id: HimringOperationId): Record<string, JsonSchema> {
  const properties = inputSchemaOf(id).properties
  if (!isRecord(properties)) return {}
  return Object.fromEntries(
    Object.entries(properties).filter((entry): entry is [string, JsonSchema] => isRecord(entry[1])),
  )
}

export function requiredInputsOf(id: HimringOperationId): ReadonlySet<string> {
  const required = inputSchemaOf(id).required
  return new Set(Array.isArray(required) ? required.filter(name => typeof name === 'string') : [])
}

export function propertySchemaOf(id: HimringOperationId, name: string): JsonSchema {
  const schema = inputPropertiesOf(id)[name]
  if (schema === undefined) throw new Error(`The spec of ${id} has no field called ${name}.`)
  return schema
}

const validators = new Map<string, ValidateFunction>()

function validatorOf(key: string, schema: () => JsonSchema): ValidateFunction {
  const known = validators.get(key)
  if (known !== undefined) return known
  const compiled = ajv.compile(schema())
  validators.set(key, compiled)
  return compiled
}

export function compiledGuard<Value>(schema: JsonSchema): (value: unknown) => value is Value {
  const validate = ajv.compile<Value>(schema)
  return (value: unknown): value is Value => validate(value)
}

function fieldPathOf(instancePath: string): string {
  return instancePath
    .split('/')
    .filter(part => part.length > 0)
    .map(part => part.replaceAll('~1', '/').replaceAll('~0', '~'))
    .join('.')
}

function textParameter(error: ErrorObject, name: string): string | undefined {
  const value: unknown = Reflect.get(error.params, name)
  return typeof value === 'string' ? value : undefined
}

function plainMessageOf(error: ErrorObject): string {
  const missing = textParameter(error, 'missingProperty')
  if (error.keyword === 'required' && missing !== undefined) return `${missing} is missing`
  const extra = textParameter(error, 'additionalProperty')
  if (error.keyword === 'additionalProperties' && extra !== undefined) {
    return `${extra} is not a field that this operation takes`
  }
  const allowed: unknown = Reflect.get(error.params, 'allowedValues')
  if (error.keyword === 'enum' && Array.isArray(allowed)) return `must be one of ${allowed.map(String).join(', ')}`
  return error.message ?? 'is invalid'
}

function specMessageOf(error: ErrorObject): string | undefined {
  if (error.keyword === RULES_KEYWORD) return error.message
  const kinds = RULE_KINDS_OF_KEYWORD[error.keyword]
  if (kinds === undefined) return undefined
  return specRulesOf(error.parentSchema).find(rule => kinds.includes(rule.kind) && rule.message !== undefined)?.message
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)]
}

function sentenceOf(text: string): string {
  return SENTENCE_END.test(text) ? text : `${text}.`
}

export function issuesTextOf(errors: readonly ErrorObject[]): string {
  const byPath = new Map<string, ErrorObject[]>()
  for (const error of errors) {
    const path = fieldPathOf(error.instancePath)
    byPath.set(path, [...(byPath.get(path) ?? []), error])
  }
  const sentences = [...byPath.entries()].map(([path, found]) => {
    const spec = unique(found.flatMap(error => specMessageOf(error) ?? []))
    const plain = unique(found.filter(error => !COMBINING_KEYWORDS.has(error.keyword)).map(plainMessageOf))
    const chosen = spec.length > 0 ? spec : plain.length > 0 ? plain : unique(found.map(plainMessageOf))
    const text = chosen.map(sentenceOf).join(' ')
    return path.length === 0 ? text : `${path}: ${text}`
  })
  return sentences.join(' ')
}

function pickedSchemaOf(id: HimringOperationId, fields: readonly string[]): JsonSchema {
  const properties = inputPropertiesOf(id)
  const required = requiredInputsOf(id)
  return {
    type: 'object',
    properties: Object.fromEntries(
      fields.flatMap(name => (properties[name] === undefined ? [] : [[name, properties[name]]])),
    ),
    required: fields.filter(name => required.has(name)),
    additionalProperties: false,
  }
}

export function checkInput(
  id: HimringOperationId,
  input: Record<string, unknown>,
  suggestion: string,
  fields?: readonly string[],
): void {
  const validate =
    fields === undefined
      ? validatorOf(`input:${id}`, () => inputSchemaOf(id))
      : validatorOf(`input:${id}:${fields.join(',')}`, () => pickedSchemaOf(id, fields))
  if (validate(input)) return
  throw new UsageError(`The input is invalid: ${issuesTextOf(validate.errors ?? [])}`, suggestion)
}

export function checkOutput(id: HimringOperationId, output: unknown): void {
  const schema = HIMRING_OPERATION_CATALOGUE[id].outputSchema
  if (schema === null) return
  const validate = validatorOf(`output:${id}`, () => schema)
  if (validate(output)) return
  throw new HimringApiError(
    'invalid_response',
    `The API answered ${id} with data that its documented schema does not allow.`,
    {
      details: issuesTextOf(validate.errors ?? []),
    },
  )
}
