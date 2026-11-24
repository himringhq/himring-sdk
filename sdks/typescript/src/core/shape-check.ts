export type HimringShapeType = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'object' | 'array'

export type HimringShapeLiteral = string | number | boolean | null

export interface HimringShape {
  readonly type?: HimringShapeType
  readonly properties?: Readonly<Record<string, number>>
  readonly required?: readonly string[]
  readonly additional?: number | false
  readonly items?: number
  readonly anyOf?: readonly number[]
  readonly const?: HimringShapeLiteral
  readonly enum?: readonly HimringShapeLiteral[]
  readonly pattern?: string
}

export interface HimringOperationShapes {
  readonly input: number
  readonly output: number | null
}

export interface ShapeProblem {
  readonly path: readonly (string | number)[]
  readonly message: string
}

const TYPE_WORDS: Readonly<Record<HimringShapeType, string>> = {
  string: 'text',
  number: 'a number',
  integer: 'a whole number',
  boolean: 'true or false',
  null: 'null',
  object: 'an object',
  array: 'a list',
}

const compiledPatterns = new Map<string, RegExp>()

function patternOf(source: string): RegExp {
  const known = compiledPatterns.get(source)
  if (known !== undefined) return known
  const compiled = new RegExp(source, 'u')
  compiledPatterns.set(source, compiled)
  return compiled
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function wordFor(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'a list'
  if (typeof value === 'string') return 'text'
  if (typeof value === 'number') return Number.isInteger(value) ? 'a whole number' : 'a number'
  if (typeof value === 'boolean') return 'true or false'
  if (typeof value === 'object') return 'an object'
  return `a ${typeof value} value`
}

function hasType(type: HimringShapeType, value: unknown): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
    case 'integer':
      return typeof value === 'number' && Number.isSafeInteger(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'null':
      return value === null
    case 'object':
      return isRecord(value)
    case 'array':
      return Array.isArray(value)
  }
}

function mismatch(path: readonly (string | number)[], value: unknown, expected: string): ShapeProblem {
  return { path, message: `is ${wordFor(value)}, where the API expects ${expected}` }
}

function expectationOf(shape: HimringShape | undefined): string {
  if (shape?.const !== undefined) return JSON.stringify(shape.const)
  if (shape?.enum !== undefined) return `one of ${shape.enum.map(option => JSON.stringify(option)).join(', ')}`
  if (shape?.type !== undefined) return TYPE_WORDS[shape.type]
  return 'another documented form'
}

function deepest(problems: readonly ShapeProblem[]): ShapeProblem | undefined {
  let found: ShapeProblem | undefined
  for (const problem of problems) if (found === undefined || problem.path.length > found.path.length) found = problem
  return found
}

export function shapeProblemOf(
  shapes: readonly HimringShape[],
  index: number,
  value: unknown,
  path: readonly (string | number)[] = [],
): ShapeProblem | undefined {
  const shape = shapes[index]
  if (shape === undefined) throw new RangeError(`The SDK has no generated shape ${index}.`)
  if (shape.anyOf !== undefined) {
    const problems: ShapeProblem[] = []
    for (const branch of shape.anyOf) {
      const problem = shapeProblemOf(shapes, branch, value, path)
      if (problem === undefined) {
        problems.length = 0
        break
      }
      problems.push(problem)
    }
    const problem = deepest(problems)
    if (problem !== undefined) {
      if (problem.path.length > path.length) return problem
      const expected = new Set(shape.anyOf.map(branch => expectationOf(shapes[branch])))
      return mismatch(path, value, [...expected].join(' or '))
    }
  }
  if (shape.type !== undefined && !hasType(shape.type, value)) return mismatch(path, value, TYPE_WORDS[shape.type])
  if (shape.const !== undefined && value !== shape.const) return mismatch(path, value, JSON.stringify(shape.const))
  if (shape.enum !== undefined && !shape.enum.some(option => option === value)) {
    return mismatch(path, value, `one of ${shape.enum.map(option => JSON.stringify(option)).join(', ')}`)
  }
  if (shape.pattern !== undefined && typeof value === 'string' && !patternOf(shape.pattern).test(value)) {
    return { path, message: `does not match the pattern ${shape.pattern}` }
  }
  if (Array.isArray(value) && shape.items !== undefined) {
    for (const [position, item] of value.entries()) {
      const problem = shapeProblemOf(shapes, shape.items, item, [...path, position])
      if (problem !== undefined) return problem
    }
  }
  if (isRecord(value)) return objectProblemOf(shapes, shape, value, path)
  return undefined
}

function objectProblemOf(
  shapes: readonly HimringShape[],
  shape: HimringShape,
  value: Record<string, unknown>,
  path: readonly (string | number)[],
): ShapeProblem | undefined {
  for (const name of shape.required ?? []) {
    if (value[name] === undefined) return { path: [...path, name], message: 'is missing' }
  }
  for (const [name, child] of Object.entries(value)) {
    if (child === undefined) continue
    const known = shape.properties !== undefined && Object.hasOwn(shape.properties, name)
    const childShape = known ? shape.properties?.[name] : shape.additional
    if (childShape === false) return { path: [...path, name], message: 'is not a documented field' }
    if (childShape === undefined) continue
    const problem = shapeProblemOf(shapes, childShape, child, [...path, name])
    if (problem !== undefined) return problem
  }
  return undefined
}

export function placeOf(path: readonly (string | number)[]): string {
  if (path.length === 0) return 'the value'
  return path
    .map((part, position) => (typeof part === 'number' ? `[${part}]` : position === 0 ? part : `.${part}`))
    .join('')
}
