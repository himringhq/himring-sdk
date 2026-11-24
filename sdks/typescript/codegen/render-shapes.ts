import { inputSchemaOf } from './input-schema.ts'
import { inlined } from './render-catalogue.ts'
import { isRecord, type OperationModel, type SpecModel, SpecModelError } from './spec-model.ts'

const SHAPE_TYPES: ReadonlySet<unknown> = new Set(['string', 'number', 'integer', 'boolean', 'null', 'object', 'array'])
const UNCHECKABLE_KEYWORDS = [
  'oneOf',
  'allOf',
  'not',
  '$ref',
  'prefixItems',
  'if',
  'patternProperties',
  'dependentSchemas',
  'unevaluatedProperties',
]

type Side = 'input' | 'output'

function isLiteral(value: unknown): boolean {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value)
}

class ShapeTable {
  readonly shapes: string[] = []
  private readonly indexes = new Map<string, number>()

  add(schema: unknown, side: Side, place: string): number {
    if (!isRecord(schema)) throw new SpecModelError(`${place} has no schema.`)
    for (const keyword of UNCHECKABLE_KEYWORDS) {
      if (schema[keyword] !== undefined)
        throw new SpecModelError(`${place} uses ${keyword}, which the SDK cannot check.`)
    }
    const shape: Record<string, unknown> = {}
    if (schema.type !== undefined) {
      if (!SHAPE_TYPES.has(schema.type)) throw new SpecModelError(`${place} has the type ${String(schema.type)}.`)
      shape.type = schema.type
    }
    if (isRecord(schema.properties)) {
      shape.properties = Object.fromEntries(
        Object.entries(schema.properties).map(([name, child]) => [name, this.add(child, side, `${place}.${name}`)]),
      )
    }
    if (Array.isArray(schema.required) && schema.required.length > 0) shape.required = schema.required
    if (isRecord(schema.additionalProperties)) {
      shape.additional = this.add(schema.additionalProperties, side, `${place}{}`)
    } else if (side === 'input' && schema.additionalProperties === false) {
      shape.additional = false
    }
    if (schema.items !== undefined) shape.items = this.add(schema.items, side, `${place}[]`)
    if (Array.isArray(schema.anyOf)) {
      shape.anyOf = schema.anyOf.map((branch, position) => this.add(branch, side, `${place}|${position}`))
    }
    if (schema.const !== undefined) {
      if (!isLiteral(schema.const)) throw new SpecModelError(`${place} has a const that is not a plain value.`)
      shape.const = schema.const
    }
    if (side === 'input' && Array.isArray(schema.enum)) {
      if (!schema.enum.every(isLiteral)) throw new SpecModelError(`${place} has an enum that is not plain values.`)
      shape.enum = schema.enum
    }
    if (side === 'input' && typeof schema.pattern === 'string') shape.pattern = schema.pattern
    const text = JSON.stringify(shape)
    const known = this.indexes.get(text)
    if (known !== undefined) return known
    this.shapes.push(text)
    this.indexes.set(text, this.shapes.length - 1)
    return this.shapes.length - 1
  }
}

function inputShapeOf(operation: OperationModel, model: SpecModel, table: ShapeTable): number {
  const schema = inlined(inputSchemaOf(operation), model.components[operation.document], new Set())
  if (!isRecord(schema)) throw new SpecModelError(`${operation.id} has no input schema.`)
  return table.add({ additionalProperties: false, ...schema }, 'input', `${operation.id} input`)
}

function outputShapeOf(operation: OperationModel, model: SpecModel, table: ShapeTable): number | null {
  if (operation.response.kind !== 'json') return null
  const schema = inlined(operation.response.schema, model.components[operation.document], new Set())
  return table.add(schema, 'output', `${operation.id} output`)
}

export function renderShapes(model: SpecModel): string {
  const table = new ShapeTable()
  const operations = model.operations.map(operation => ({
    id: operation.id,
    input: inputShapeOf(operation, model, table),
    output: outputShapeOf(operation, model, table),
  }))
  const lines = [
    `import type { HimringOperationShapes, HimringShape } from '../core/shape-check.js'`,
    `import type { HimringOperationId } from './operations.js'`,
    '',
    'export const HIMRING_SHAPES: readonly HimringShape[] = [',
    ...table.shapes.map(shape => `  ${shape},`),
    ']',
    '',
    'export const HIMRING_OPERATION_SHAPES: Readonly<Record<HimringOperationId, HimringOperationShapes>> = {',
    ...operations.map(entry => `  ${entry.id}: { input: ${entry.input}, output: ${entry.output} },`),
    '}',
    '',
  ]
  return lines.join('\n')
}
