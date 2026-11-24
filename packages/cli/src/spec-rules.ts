export const RULES_KEYWORD = 'x-himring-rules'

export interface SpecRule {
  kind: string
  expects: string | null
  message: string | undefined
}

const BOUND_PATTERN = /^(>=|<=)(-?\d+(?:\.\d+)?)$/
const NUMERIC_TEXT = /^-?\d+(?:\.\d+)?$/
const QUOTED_CHOICE = /"((?:[^"\\]|\\.)*)"/g
const LIST_SEPARATOR = ','

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function specRulesOf(schema: unknown): SpecRule[] {
  if (!isRecord(schema)) return []
  const rules = schema[RULES_KEYWORD]
  if (!Array.isArray(rules)) return []
  return rules.flatMap(rule => {
    if (!isRecord(rule) || typeof rule.kind !== 'string') return []
    return [
      {
        kind: rule.kind,
        expects: typeof rule.expects === 'string' ? rule.expects : null,
        message: typeof rule.message === 'string' ? rule.message : undefined,
      },
    ]
  })
}

export function picklistChoicesOf(rule: SpecRule): string[] {
  if (rule.kind !== 'picklist' || rule.expects === null) return []
  return [...rule.expects.matchAll(QUOTED_CHOICE)].flatMap(match => (match[1] === undefined ? [] : [match[1]]))
}

export function isListRules(rules: readonly SpecRule[]): boolean {
  return rules.some(rule => rule.kind === 'array')
}

function boundOf(rule: SpecRule): number | undefined {
  const found = rule.expects === null ? null : BOUND_PATTERN.exec(rule.expects)
  const digits = found?.[2]
  return digits === undefined ? undefined : Number(digits)
}

function numberOf(data: unknown): number | undefined {
  if (typeof data === 'number') return data
  if (typeof data === 'string' && NUMERIC_TEXT.test(data)) return Number(data)
  return undefined
}

function lengthOf(data: unknown): number | undefined {
  if (typeof data === 'string' || Array.isArray(data)) return data.length
  return undefined
}

function listItemsOf(text: string): string[] {
  return text
    .split(LIST_SEPARATOR)
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

function messageOf(rule: SpecRule, fallback: string): string {
  return rule.message ?? fallback
}

function boundFailure(rule: SpecRule, value: number | undefined, atLeast: boolean): string | undefined {
  const bound = boundOf(rule)
  if (bound === undefined || value === undefined) return undefined
  const breaks = atLeast ? value < bound : value > bound
  return breaks ? messageOf(rule, `must be ${atLeast ? 'at least' : 'at most'} ${bound}`) : undefined
}

function picklistFailure(rule: SpecRule, data: unknown, listed: boolean): string | undefined {
  if (typeof data !== 'string') return undefined
  const choices = picklistChoicesOf(rule)
  if (choices.length === 0) return undefined
  const values = listed ? listItemsOf(data) : [data]
  const unknown = values.find(value => !choices.includes(value))
  return unknown === undefined ? undefined : messageOf(rule, `must be one of ${choices.join(', ')}`)
}

function ruleFailure(rule: SpecRule, data: unknown, listed: boolean): string | undefined {
  switch (rule.kind) {
    case 'number':
      if (typeof data !== 'string') return undefined
      return numberOf(data.trim()) === undefined ? messageOf(rule, 'must be a number') : undefined
    case 'min_value':
      return boundFailure(rule, numberOf(data), true)
    case 'max_value':
      return boundFailure(rule, numberOf(data), false)
    case 'min_length':
      return listed ? undefined : boundFailure(rule, lengthOf(data), true)
    case 'max_length':
      return listed ? undefined : boundFailure(rule, lengthOf(data), false)
    case 'picklist':
      return picklistFailure(rule, data, listed)
    default:
      return undefined
  }
}

export function ruleFailuresOf(rulesValue: unknown, data: unknown): string[] {
  const rules = specRulesOf({ [RULES_KEYWORD]: rulesValue })
  const listed = isListRules(rules)
  return rules.flatMap(rule => {
    const failure = ruleFailure(rule, data, listed)
    return failure === undefined ? [] : [failure]
  })
}
