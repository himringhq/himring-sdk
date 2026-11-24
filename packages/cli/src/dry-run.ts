import { HIMRING_OPERATIONS, type HimringOperationId } from '@himring/sdk'

export function requestPathOf(id: HimringOperationId, input: Record<string, unknown>): string {
  return HIMRING_OPERATIONS[id].path.replace(/\{([^}]+)\}/g, (_whole, name: string) =>
    encodeURIComponent(String(input[name])),
  )
}

export function withoutPathFields(id: HimringOperationId, input: Record<string, unknown>): Record<string, unknown> {
  const pathNames: ReadonlySet<string> = new Set(HIMRING_OPERATIONS[id].pathParameters)
  return Object.fromEntries(Object.entries(input).filter(([name]) => !pathNames.has(name)))
}

export function dryRunOf(id: HimringOperationId, input: Record<string, unknown>, sent: Record<string, unknown>) {
  return {
    dry_run: true,
    operation: id,
    method: HIMRING_OPERATIONS[id].method,
    path: requestPathOf(id, input),
    input: sent,
    applied: false,
  }
}
