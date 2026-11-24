import type { HimringClient } from '../core/client.js'
import { describeError, isHimringApiError } from '../core/errors.js'
import { ANSWER_EVENT_RULES, type AnswerEventInput } from './answer-event-rules.js'

export const DEFAULT_ANSWER_DELIVERY_ATTEMPTS = 6
const HTTP_PAYLOAD_TOO_LARGE = 413
const HTTP_TOO_MANY_REQUESTS = 429
const HTTP_SERVER_ERROR_MINIMUM = 500
const RETRY_AFTER_CEILING_MS = 60_000
const BACKOFF_FIRST_MS = 500
const BACKOFF_CEILING_MS = 30_000
const MILLISECONDS_PER_SECOND = 1_000
const LONGEST_TIMER_MS = 2_147_483_647

export interface PendingAnswerEvent {
  id: string
  event: AnswerEventInput
  bytes: number
}

export interface AnswerDeliveryTarget {
  client: HimringClient
  projectId: string
  knowledgeBaseId: string
}

export interface AnswerDeliveryPolicy {
  maximumAttempts: number
  deadline: () => number
  keepProcessAlive: boolean
  wake: AbortSignal
}

export type AnswerDeliveryOutcome =
  | { kind: 'delivered'; unknownQuestionIds: readonly string[] }
  | { kind: 'too_large'; bytes: number }
  | { kind: 'refused'; reason: string }
  | { kind: 'gave_up'; reason: string }
  | { kind: 'deadline_passed' }

export function encodedSize(event: AnswerEventInput): number {
  return new TextEncoder().encode(JSON.stringify(event)).byteLength
}

export function nextBatch(pending: readonly PendingAnswerEvent[], byteBudget: number): PendingAnswerEvent[] {
  const batch: PendingAnswerEvent[] = []
  let bytes = 0
  for (const item of pending) {
    if (batch.length >= ANSWER_EVENT_RULES.eventsPerRequest) break
    if (batch.length > 0 && bytes + item.bytes > byteBudget) break
    batch.push(item)
    bytes += item.bytes
  }
  return batch
}

function isRetryable(error: unknown): boolean {
  if (!isHimringApiError(error)) return true
  if (error.kind === 'network' || error.kind === 'timeout') return true
  if (error.status === undefined) return false
  return error.status === HTTP_TOO_MANY_REQUESTS || error.status >= HTTP_SERVER_ERROR_MINIMUM
}

function retryDelayMs(error: unknown, attempt: number): number {
  if (isHimringApiError(error) && error.retryAfterSeconds !== undefined) {
    return Math.min(error.retryAfterSeconds * MILLISECONDS_PER_SECOND, RETRY_AFTER_CEILING_MS)
  }
  const ceiling = Math.min(BACKOFF_CEILING_MS, BACKOFF_FIRST_MS * 2 ** attempt)
  return Math.random() * ceiling
}

function pause(milliseconds: number, keepProcessAlive: boolean, wake: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    if (wake.aborted) {
      resolve()
      return
    }
    const finish = () => {
      clearTimeout(timer)
      wake.removeEventListener('abort', finish)
      resolve()
    }
    const timer = setTimeout(finish, milliseconds)
    if (!keepProcessAlive) timer.unref?.()
    wake.addEventListener('abort', finish, { once: true })
  })
}

function deadlineSignal(policy: AnswerDeliveryPolicy): { signal: AbortSignal; release(): void } {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const arm = () => {
    clearTimeout(timer)
    const wait = Math.min(LONGEST_TIMER_MS, Math.max(0, policy.deadline() - Date.now()))
    timer = setTimeout(() => controller.abort(new DOMException('deadline', 'TimeoutError')), wait)
    if (!policy.keepProcessAlive) timer.unref?.()
  }
  arm()
  policy.wake.addEventListener('abort', arm, { once: true })
  return {
    signal: controller.signal,
    release() {
      clearTimeout(timer)
      policy.wake.removeEventListener('abort', arm)
    },
  }
}

export async function deliverBatch(
  target: AnswerDeliveryTarget,
  batch: readonly PendingAnswerEvent[],
  policy: AnswerDeliveryPolicy,
): Promise<AnswerDeliveryOutcome> {
  let attempt = 0
  for (;;) {
    if (Date.now() >= policy.deadline()) return { kind: 'deadline_passed' }
    const deadline = deadlineSignal(policy)
    try {
      const reply = await target.client.recordAnswerEvents(
        {
          project_id: target.projectId,
          knowledge_base_id: target.knowledgeBaseId,
          origin: 'sdk',
          events: batch.map(item => item.event),
        },
        { signal: deadline.signal },
      )
      const unknownQuestionIds = reply.results
        .filter(result => result.outcome === 'question_not_found')
        .map(result => result.question_id)
      return { kind: 'delivered', unknownQuestionIds }
    } catch (error) {
      if (deadline.signal.aborted) return { kind: 'deadline_passed' }
      if (isHimringApiError(error) && error.status === HTTP_PAYLOAD_TOO_LARGE) {
        return { kind: 'too_large', bytes: batch.reduce((total, item) => total + item.bytes, 0) }
      }
      attempt += 1
      if (!isRetryable(error)) return { kind: 'refused', reason: describeError(error) }
      if (attempt >= policy.maximumAttempts) return { kind: 'gave_up', reason: describeError(error) }
      const delay = retryDelayMs(error, attempt)
      if (Date.now() + delay > policy.deadline()) return { kind: 'deadline_passed' }
      await pause(delay, policy.keepProcessAlive, policy.wake)
    } finally {
      deadline.release()
    }
  }
}
