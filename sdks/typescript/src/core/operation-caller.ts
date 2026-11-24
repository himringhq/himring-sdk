import type { HimringOperationId } from '../generated/operations.js'
import type { HimringOperationInputs, HimringOperationOutputs } from '../generated/types.js'

export interface RequestOptions {
  signal?: AbortSignal | undefined
  timeoutMs?: number | undefined
}

export type OperationCaller = <Id extends HimringOperationId>(
  id: Id,
  input: HimringOperationInputs[Id] | undefined,
  options?: RequestOptions,
) => Promise<HimringOperationOutputs[Id]>
