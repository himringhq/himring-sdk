import { describeError, isHimringApiError } from '@himring/sdk'
import type { CallToolResult } from '@modelcontextprotocol/server'
import { isRecord } from './tool-schema.js'

export class ToolRefusedError extends Error {
  override readonly name = 'ToolRefusedError'
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

export function succeeded(result: unknown): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(result) ?? 'null' }],
    ...(isRecord(result) ? { structuredContent: result } : {}),
  }
}

export function failed(error: unknown): CallToolResult {
  if (error instanceof ToolRefusedError) {
    return { isError: true, content: [{ type: 'text', text: `${error.code}: ${error.message}` }] }
  }
  const code = isHimringApiError(error) ? (error.code ?? error.kind) : undefined
  const prefix = code === undefined ? '' : `${code}: `
  const missing = isHimringApiError(error) ? error.missingPermission : undefined
  return {
    isError: true,
    content: [{ type: 'text', text: `${prefix}${describeError(error)}` }],
    ...(missing === undefined ? {} : { structuredContent: { code, missing_permission: missing } }),
  }
}
