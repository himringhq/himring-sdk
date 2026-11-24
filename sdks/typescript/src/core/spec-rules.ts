import { HIMRING_OPERATION_CATALOGUE } from '../generated/catalogue.js'
import type { HimringOperationId } from '../generated/operations.js'

const AT_MOST_EXPECTATION = /^<=(\d+)$/
const AT_LEAST_EXPECTATION = /^>=(\d+)$/

export class SpecRuleError extends Error {
  override readonly name = 'SpecRuleError'
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export interface OperationSpec {
  readonly id: HimringOperationId
  schemaAt(root: unknown, keys: readonly string[]): Record<string, unknown>
  input(keys: readonly string[]): Record<string, unknown>
  wholeNumberAt(schema: Record<string, unknown>, keyword: string, place: string): number
  patternAt(schema: Record<string, unknown>, place: string): RegExp
  ruleExpectation(schema: Record<string, unknown>, kind: string, place: string): string
  atMost(schema: Record<string, unknown>, kind: 'max_length' | 'max_value', place: string): number
  atLeast(schema: Record<string, unknown>, kind: 'min_length' | 'min_value', place: string): number
}

function boundOf(expectation: string, pattern: RegExp, id: string, place: string): number {
  const digits = pattern.exec(expectation)?.[1]
  const bound = digits === undefined ? Number.NaN : Number(digits)
  if (!Number.isSafeInteger(bound)) {
    throw new SpecRuleError(`The spec of ${id} gives ${place} a bound of ${expectation}, which is not a whole number.`)
  }
  return bound
}

export function operationSpec(id: HimringOperationId): OperationSpec {
  const spec: OperationSpec = {
    id,
    schemaAt(root, keys) {
      let current = root
      for (const key of keys) current = isRecord(current) ? current[key] : undefined
      if (!isRecord(current)) throw new SpecRuleError(`The spec of ${id} has no schema at ${keys.join('.')}.`)
      return current
    },
    input(keys) {
      return spec.schemaAt(HIMRING_OPERATION_CATALOGUE[id].inputSchema, keys)
    },
    wholeNumberAt(schema, keyword, place) {
      const value = schema[keyword]
      if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
        throw new SpecRuleError(`The spec of ${id} has no ${keyword} for ${place}.`)
      }
      return value
    },
    patternAt(schema, place) {
      if (typeof schema.pattern !== 'string') throw new SpecRuleError(`The spec of ${id} has no pattern for ${place}.`)
      return new RegExp(schema.pattern, 'u')
    },
    ruleExpectation(schema, kind, place) {
      const rules = Array.isArray(schema['x-himring-rules']) ? schema['x-himring-rules'] : []
      const rule = rules.find(candidate => isRecord(candidate) && candidate.kind === kind)
      const expects = isRecord(rule) ? rule.expects : undefined
      if (typeof expects !== 'string') throw new SpecRuleError(`The spec of ${id} has no ${kind} rule for ${place}.`)
      return expects
    },
    atMost(schema, kind, place) {
      return boundOf(spec.ruleExpectation(schema, kind, place), AT_MOST_EXPECTATION, id, place)
    },
    atLeast(schema, kind, place) {
      return boundOf(spec.ruleExpectation(schema, kind, place), AT_LEAST_EXPECTATION, id, place)
    },
  }
  return spec
}
