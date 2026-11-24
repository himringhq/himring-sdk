export const FIRST_BACKOFF_MS = 1_000
export const LONGEST_BACKOFF_MS = 30_000
export const LONGEST_RETRY_AFTER_SECONDS = 120
const MILLISECONDS_PER_SECOND = 1_000

export function retryAfterSecondsOf(header: string | null): number | undefined {
  if (header === null) return undefined
  const seconds = Number(header)
  return Number.isSafeInteger(seconds) && seconds >= 0 ? seconds : undefined
}

export function backoffMs(attempt: number, retryAfterSeconds: number | undefined): number | undefined {
  if (retryAfterSeconds !== undefined) {
    if (retryAfterSeconds > LONGEST_RETRY_AFTER_SECONDS) return undefined
    return retryAfterSeconds * MILLISECONDS_PER_SECOND + Math.round(Math.random() * FIRST_BACKOFF_MS)
  }
  const ceiling = Math.min(LONGEST_BACKOFF_MS, FIRST_BACKOFF_MS * 2 ** (attempt - 1))
  return Math.round(ceiling / 2 + Math.random() * (ceiling / 2))
}
