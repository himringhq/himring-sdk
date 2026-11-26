import { HIMRING_ERROR_STATUSES } from '../generated/operations.js'

export type HimringApiErrorKind = 'network' | 'timeout' | 'refused' | 'invalid_response' | 'invalid_input'

export interface HimringApiIssue {
  message: string
  path: readonly (string | number)[]
}

export interface HimringMissingPermission {
  resource_kind: string
  level: string
  resource_id: string | null
}

export interface HimringApiErrorDetails {
  status?: number | undefined
  code?: string | undefined
  issues?: readonly HimringApiIssue[] | undefined
  details?: string | undefined
  missingPermission?: HimringMissingPermission | undefined
  retryAfterSeconds?: number | undefined
  requestId?: string | undefined
  cause?: unknown
}

export class HimringApiError extends Error {
  readonly kind: HimringApiErrorKind
  readonly status: number | undefined
  readonly code: string | undefined
  readonly issues: readonly HimringApiIssue[]
  readonly details: string | undefined
  readonly missingPermission: HimringMissingPermission | undefined
  readonly retryAfterSeconds: number | undefined
  readonly requestId: string | undefined

  constructor(kind: HimringApiErrorKind, message: string, details: HimringApiErrorDetails = {}) {
    super(message, { cause: details.cause })
    this.name = 'HimringApiError'
    this.kind = kind
    this.status = details.status
    this.code = details.code
    this.issues = details.issues ?? []
    this.details = details.details
    this.missingPermission = details.missingPermission
    this.retryAfterSeconds = details.retryAfterSeconds
    this.requestId = details.requestId
  }

  get isRejectedRedirect(): boolean {
    return isRejectedRedirect(this.cause)
  }

  get isDocumentedCode(): boolean {
    return this.code !== undefined && Object.hasOwn(HIMRING_ERROR_STATUSES, this.code)
  }
}

export function isRejectedRedirect(error: unknown): boolean {
  return error instanceof TypeError && error.cause instanceof Error && error.cause.message === 'unexpected redirect'
}

export function isHimringApiError(error: unknown): error is HimringApiError {
  return error instanceof HimringApiError
}

export function isRefusal(error: unknown, code: string): error is HimringApiError {
  return error instanceof HimringApiError && error.kind === 'refused' && error.code === code
}

export function documentedStatusOf(code: string): number | undefined {
  return Object.hasOwn(HIMRING_ERROR_STATUSES, code) ? HIMRING_ERROR_STATUSES[code] : undefined
}

export function invalidInput(message: string, field: string | undefined): HimringApiError {
  return new HimringApiError('invalid_input', message, {
    issues: [{ message, path: field === undefined ? [] : [field] }],
  })
}

export function describeError(error: unknown): string {
  if (!(error instanceof HimringApiError)) return error instanceof Error ? error.message : String(error)
  const parts = [error.message]
  if (error.details !== undefined) parts.push(error.details)
  const missing = error.missingPermission
  if (missing !== undefined) {
    const place =
      missing.resource_id === null ? missing.resource_kind : `${missing.resource_kind} ${missing.resource_id}`
    parts.push(`missing_permission: ${missing.level} on ${place}.`)
  }
  for (const issue of error.issues) {
    const sentence = issue.path.length === 0 ? issue.message : `${issue.path.join('.')}: ${issue.message}`
    if (sentence !== error.message) parts.push(sentence)
  }
  return parts.join(' ')
}
