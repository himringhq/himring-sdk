import { hasRequiredInput } from './input-schema.ts'
import { inputTypeNameOf, methodNameOf, outputTypeNameOf } from './names.ts'
import type { SpecModel } from './spec-model.ts'

export function renderMethods(model: SpecModel): string {
  const lines = [
    `import type { OperationCaller, RequestOptions } from '../core/operation-caller.js'`,
    `import type * as Types from './types.js'`,
    '',
    'export interface HimringOperationMethods {',
  ]
  for (const operation of model.operations) {
    const optional = hasRequiredInput(operation) ? '' : '?'
    lines.push(
      `  ${methodNameOf(operation.id)}(input${optional}: Types.${inputTypeNameOf(operation.id)}, options?: RequestOptions): Promise<Types.${outputTypeNameOf(operation.id)}>`,
    )
  }
  lines.push('}', '')
  lines.push('export function bindOperationMethods(call: OperationCaller): HimringOperationMethods {')
  lines.push('  return {')
  for (const operation of model.operations) {
    lines.push(`    ${methodNameOf(operation.id)}: (input, options) => call('${operation.id}', input, options),`)
  }
  lines.push('  }', '}', '')
  return lines.join('\n')
}
