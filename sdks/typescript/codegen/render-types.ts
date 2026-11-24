import { inputTypeNameOf, outputTypeNameOf } from './names.ts'
import type { DocumentName, OperationModel, SpecModel } from './spec-model.ts'

const OPERATIONS_TYPE_OF: Readonly<Record<DocumentName, string>> = {
  api: 'ApiOperations',
  session: 'SessionOperations',
}

function operationTypeOf(operation: OperationModel): string {
  return `${OPERATIONS_TYPE_OF[operation.document]}[${JSON.stringify(operation.id)}]`
}

export function renderTypes(model: SpecModel): string {
  const lines = [
    `import type { OperationInput, OperationOutput } from '../core/operation-types.js'`,
    `import type { Download, FileContent } from '../core/types.js'`,
    `import type { operations as ApiOperations } from './api-document.js'`,
    `import type { operations as SessionOperations } from './session-document.js'`,
    '',
  ]
  for (const operation of model.operations) {
    const input = `OperationInput<${operationTypeOf(operation)}>`
    const inputType = operation.body.kind === 'file' ? `${input} & { content: FileContent }` : input
    lines.push(`export type ${inputTypeNameOf(operation.id)} = ${inputType}`, '')
    const output =
      operation.response.kind === 'download'
        ? 'Download'
        : `OperationOutput<${operationTypeOf(operation)}, ${operation.response.status}>`
    lines.push(`export type ${outputTypeNameOf(operation.id)} = ${output}`, '')
  }
  lines.push('export interface HimringOperationInputs {')
  for (const operation of model.operations) lines.push(`  ${operation.id}: ${inputTypeNameOf(operation.id)}`)
  lines.push('}', '', 'export interface HimringOperationOutputs {')
  for (const operation of model.operations) lines.push(`  ${operation.id}: ${outputTypeNameOf(operation.id)}`)
  lines.push('}', '')
  return lines.join('\n')
}
