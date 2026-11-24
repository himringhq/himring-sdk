import { ToolRefusedError } from './tool-results.js'
import type { ToolArguments } from './tool-schema.js'

const VALIDATION_FAILED = 'validation_failed'

export function optionalTextOf(input: ToolArguments, name: string): string | undefined {
  const value = input[name]
  if (value === undefined) return undefined
  if (typeof value !== 'string') throw new ToolRefusedError(VALIDATION_FAILED, `Send ${name} as text.`)
  return value
}

export function textOf(input: ToolArguments, name: string): string {
  const value = optionalTextOf(input, name)
  if (value === undefined) throw new ToolRefusedError(VALIDATION_FAILED, `Send ${name}.`)
  return value
}

export function flagOf(input: ToolArguments, name: string): boolean | undefined {
  const value = input[name]
  if (value === undefined) return undefined
  if (typeof value !== 'boolean') throw new ToolRefusedError(VALIDATION_FAILED, `Send ${name} as true or false.`)
  return value
}

export function wholeNumberOf(input: ToolArguments, name: string): number | undefined {
  const value = input[name]
  if (value === undefined) return undefined
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) {
    throw new ToolRefusedError(VALIDATION_FAILED, `Send ${name} as a whole number.`)
  }
  return value
}
