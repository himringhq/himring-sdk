import { inputSchemaOf } from './input-schema.ts'
import { isRecord, type JsonSchema, type OperationModel, type SpecModel } from './spec-model.ts'

const COMPONENT_REFERENCE_PREFIX = '#/components/'

export function inlined(value: unknown, components: JsonSchema, seen: ReadonlySet<string>): unknown {
  if (Array.isArray(value)) return value.map(item => inlined(item, components, seen))
  if (!isRecord(value)) return value
  const reference = value.$ref
  if (typeof reference === 'string' && reference.startsWith(COMPONENT_REFERENCE_PREFIX)) {
    if (seen.has(reference)) throw new Error(`The reference ${reference} refers to itself.`)
    let target: unknown = components
    for (const part of reference.slice(COMPONENT_REFERENCE_PREFIX.length).split('/')) {
      target = isRecord(target) ? target[part] : undefined
    }
    return inlined(target, components, new Set([...seen, reference]))
  }
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, inlined(child, components, seen)]))
}

function outputSchemaOf(operation: OperationModel, components: JsonSchema): unknown {
  if (operation.response.kind !== 'json') return null
  return inlined(operation.response.schema, components, new Set())
}

export function renderCatalogue(model: SpecModel): string {
  const lines = [
    `import type { HimringOperationCatalogueEntry } from '../core/operation-description.js'`,
    `import type { HimringOperationId } from './operations.js'`,
    '',
    'export const HIMRING_OPERATION_CATALOGUE: Readonly<Record<HimringOperationId, HimringOperationCatalogueEntry>> = {',
  ]
  for (const operation of model.operations) {
    const components = model.components[operation.document]
    const entry = {
      summary: operation.summary,
      tag: operation.tag,
      document: operation.document,
      access: operation.access,
      changesState: operation.changesState,
      dataAccess: operation.dataAccess ?? null,
      keyPermissions: operation.keyPermissions ?? null,
      inputSchema: inlined(inputSchemaOf(operation), components, new Set()),
      outputSchema: outputSchemaOf(operation, components),
    }
    lines.push(`  ${operation.id}: ${JSON.stringify(entry)},`)
  }
  lines.push('}', '')
  lines.push('export const HIMRING_ERROR_MESSAGES: Readonly<Record<string, string>> = {')
  for (const code of model.errorCodes) lines.push(`  ${code.code}: ${JSON.stringify(code.message)},`)
  lines.push('}', '')
  return lines.join('\n')
}
