import { isRecord, type OperationModel, type SpecModel } from './spec-model.ts'

function literal(value: unknown): string {
  return JSON.stringify(value)
}

function responseOf(operation: OperationModel): string {
  const { response } = operation
  if (response.kind === 'json') return `{ kind: 'json', status: ${response.status} }`
  return `{ kind: 'download', status: ${response.status}, contentTypes: ${literal(response.contentTypes)}, fileExtension: ${literal(response.fileExtension)} }`
}

function bodyOf(operation: OperationModel): string {
  const { body } = operation
  if (body.kind === 'file') return `body: 'file', maximumBodyBytes: ${body.maximumBytes}`
  if (body.kind === 'json') {
    const properties = Object.keys(isRecord(body.schema.properties) ? body.schema.properties : {})
    return `body: 'json', bodyFields: ${literal(properties)}`
  }
  return `body: 'none'`
}

export function renderOperations(model: SpecModel): string {
  const lines = [`import type { HimringOperationDescription } from '../core/operation-description.js'`, '']
  lines.push('export const HIMRING_OPERATIONS = {')
  for (const operation of model.operations) {
    lines.push(`  ${operation.id}: {`)
    lines.push(`    id: ${literal(operation.id)},`)
    lines.push(`    method: ${literal(operation.method)},`)
    lines.push(`    path: ${literal(operation.path)},`)
    lines.push(`    pathParameters: ${literal(operation.pathParameters.map(parameter => parameter.name))},`)
    lines.push(`    queryParameters: ${literal(operation.queryParameters.map(parameter => parameter.name))},`)
    lines.push(`    ${bodyOf(operation)},`)
    lines.push(`    response: ${responseOf(operation)},`)
    lines.push('  },')
  }
  lines.push('} as const satisfies Readonly<Record<string, HimringOperationDescription>>', '')
  lines.push('export type HimringOperationId = keyof typeof HIMRING_OPERATIONS', '')
  lines.push('export const HIMRING_OPERATION_IDS: readonly HimringOperationId[] = [')
  for (const operation of model.operations) lines.push(`  ${literal(operation.id)},`)
  lines.push(']', '')
  lines.push('export const HIMRING_ERROR_STATUSES: Readonly<Record<string, number>> = {')
  for (const code of model.errorCodes) lines.push(`  ${code.code}: ${code.status},`)
  lines.push('}', '')
  lines.push('export const HIMRING_FILE_KINDS = {')
  for (const [kind, extensions] of Object.entries(model.fileKinds)) lines.push(`  ${kind}: ${literal(extensions)},`)
  lines.push('} as const satisfies Readonly<Record<string, readonly string[]>>', '')
  lines.push('export type HimringFileKind = keyof typeof HIMRING_FILE_KINDS', '')
  lines.push(
    `export const HIMRING_FILE_KIND_LIST: readonly HimringFileKind[] = ${literal(Object.keys(model.fileKinds))}`,
    '',
  )
  lines.push(`export const HIMRING_SPEC_API_URL = ${literal(model.serverUrl)}`, '')
  return lines.join('\n')
}
