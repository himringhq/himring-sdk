import { backoffMs } from '../core/backoff.js'
import { isHimringApiError } from '../core/errors.js'

export const ATTEMPTS_PER_REQUEST = 5

const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([408, 429, 500, 502, 503, 504])

export interface RetryNotice {
  attempt: number
  delayMs: number
  error: unknown
}

export interface RetryOptions {
  signal?: AbortSignal | undefined
  onRetry?: ((notice: RetryNotice) => void) | undefined
}

export function isTransient(error: unknown): boolean {
  if (!isHimringApiError(error)) return false
  if (error.kind === 'network' || error.kind === 'timeout') return true
  return error.kind === 'refused' && error.status !== undefined && RETRYABLE_STATUSES.has(error.status)
}

export function isUnreachable(error: unknown): boolean {
  return isHimringApiError(error) && (error.kind === 'network' || error.kind === 'timeout')
}

function pause(delayMs: number, signal: AbortSignal | undefined): Promise<boolean> {
  return new Promise(resolve => {
    if (signal?.aborted === true) {
      resolve(false)
      return
    }
    function stopEarly(): void {
      clearTimeout(timer)
      resolve(false)
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', stopEarly)
      resolve(true)
    }, delayMs)
    signal?.addEventListener('abort', stopEarly, { once: true })
  })
}

export async function withRetries<Result>(work: () => Promise<Result>, options: RetryOptions = {}): Promise<Result> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await work()
    } catch (error) {
      if (attempt >= ATTEMPTS_PER_REQUEST || !isTransient(error)) throw error
      const delayMs = backoffMs(attempt, isHimringApiError(error) ? error.retryAfterSeconds : undefined)
      if (delayMs === undefined) throw error
      options.onRetry?.({ attempt, delayMs, error })
      if (!(await pause(delayMs, options.signal))) throw error
    }
  }
}
