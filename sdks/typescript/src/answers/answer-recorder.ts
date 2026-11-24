import type { HimringClient } from '../core/client.js'
import {
  AnswerConversation,
  type AnswerConversationHost,
  type AnswerConversationIdentity,
} from './answer-conversation.js'
import {
  type AnswerDeliveryOutcome,
  DEFAULT_ANSWER_DELIVERY_ATTEMPTS,
  deliverBatch,
  encodedSize,
  nextBatch,
  type PendingAnswerEvent,
} from './answer-delivery.js'
import { ANSWER_EVENT_RULES, type AnswerEventDraft, wireAnswerEvent } from './answer-event-rules.js'
import { AnswerSpool } from './answer-spool.js'
import type { SpooledAnswerEvent } from './answer-spool-files.js'

export const DEFAULT_ANSWER_FLUSH_INTERVAL_MS = 5_000
export const DEFAULT_ANSWER_BUFFER_MAXIMUM = 10_000
export const DEFAULT_ANSWER_CLOSE_TIMEOUT_MS = 10_000
export const ANSWER_RECOVERY_INTERVAL_MS = 60_000
const DROP_WARNING_INTERVAL_MS = 10_000
const BACKGROUND_DELIVERY_WINDOW_MS = 10 * 60_000

export interface AnswerRecorderLogger {
  warn(message: string, details: Readonly<Record<string, unknown>>): void
}

export interface AnswerRecorderOptions {
  client: HimringClient
  projectId: string
  knowledgeBaseId: string
  spoolDirectory?: string | false | undefined
  flushIntervalMs?: number | undefined
  maximumBufferedEvents?: number | undefined
  maximumAttempts?: number | undefined
  closeTimeoutMs?: number | undefined
  logger?: AnswerRecorderLogger | undefined
}

const consoleLogger: AnswerRecorderLogger = {
  warn(message, details) {
    console.warn(`[himring] ${message}`, details)
  },
}

function defaultSpoolDirectory(): string | undefined {
  if (typeof process === 'undefined' || typeof process.getBuiltinModule !== 'function') return undefined
  const os = process.getBuiltinModule('node:os')
  const path = process.getBuiltinModule('node:path')
  const user = typeof process.getuid === 'function' ? `-${process.getuid()}` : ''
  return path.join(os.tmpdir(), `himring-answer-spool${user}`)
}

function wholeNumberAtLeastOne(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback
  return Math.max(1, Math.floor(value))
}

export class AnswerRecorder {
  private pending: PendingAnswerEvent[] = []
  private chain: Promise<void> = Promise.resolve()
  private readonly spool: AnswerSpool | undefined
  private readonly timer: ReturnType<typeof setInterval>
  private readonly logger: AnswerRecorderLogger
  private readonly maximumBuffered: number
  private readonly maximumAttempts: number
  private readonly closeTimeoutMs: number
  private readonly options: AnswerRecorderOptions
  private byteBudget = Number.POSITIVE_INFINITY
  private lastRecoveryAt = Number.NEGATIVE_INFINITY
  private droppedCount = 0
  private lastDropWarningAt = Number.NEGATIVE_INFINITY
  private closed = false
  private backgroundQueued = false
  private closeDeadline = Number.POSITIVE_INFINITY
  private readonly wake = new AbortController()

  constructor(options: AnswerRecorderOptions) {
    this.options = options
    this.logger = options.logger ?? consoleLogger
    this.maximumBuffered = wholeNumberAtLeastOne(options.maximumBufferedEvents, DEFAULT_ANSWER_BUFFER_MAXIMUM)
    this.maximumAttempts = wholeNumberAtLeastOne(options.maximumAttempts, DEFAULT_ANSWER_DELIVERY_ATTEMPTS)
    this.closeTimeoutMs = Math.max(0, options.closeTimeoutMs ?? DEFAULT_ANSWER_CLOSE_TIMEOUT_MS)
    const directory = options.spoolDirectory === false ? undefined : (options.spoolDirectory ?? defaultSpoolDirectory())
    this.spool =
      directory === undefined
        ? undefined
        : AnswerSpool.open(
            directory,
            JSON.stringify([options.client.baseUrl, options.projectId, options.knowledgeBaseId]),
            (message, details) => this.warn(message, details),
            () => this.pending,
          )
    this.timer = setInterval(
      () => {
        if (this.pending.length > 0 || this.recoveryIsDue()) void this.flushInBackground()
      },
      wholeNumberAtLeastOne(options.flushIntervalMs, DEFAULT_ANSWER_FLUSH_INTERVAL_MS),
    )
    this.timer.unref?.()
    void this.flushInBackground()
  }

  get droppedEventCount(): number {
    return this.droppedCount
  }

  get bufferedEventCount(): number {
    return this.pending.length
  }

  conversation(identity: AnswerConversationIdentity = {}): AnswerConversation {
    const host: AnswerConversationHost = {
      record: drafts => this.record(drafts),
      search: input =>
        this.options.client.searchKnowledgeBase({
          ...input,
          project_id: this.options.projectId,
          knowledge_base_id: this.options.knowledgeBaseId,
        }),
      flush: () => this.flush(),
      warn: (message, details) => this.warn(message, details),
    }
    return new AnswerConversation(host, identity)
  }

  record(drafts: readonly AnswerEventDraft[]): void {
    try {
      if (this.closed) return
      const items: SpooledAnswerEvent[] = []
      for (const draft of drafts) {
        const event = wireAnswerEvent(draft)
        if (event === undefined) continue
        items.push({ id: crypto.randomUUID(), event })
      }
      this.spool?.append(items)
      this.enqueue(items)
      if (this.pending.length >= ANSWER_EVENT_RULES.eventsPerRequest) void this.flushInBackground()
    } catch (error) {
      this.warn('The answer recorder could not record an event', { error })
    }
  }

  flush(): Promise<void> {
    return this.schedule(Date.now() + this.closeTimeoutMs, true)
  }

  async close(): Promise<void> {
    if (this.closed) return this.chain
    this.closed = true
    clearInterval(this.timer)
    this.closeDeadline = Date.now() + this.closeTimeoutMs
    this.wake.abort()
    await this.schedule(this.closeDeadline, true)
    this.spool?.close(true)
  }

  private flushInBackground(): Promise<void> {
    if (this.backgroundQueued) return this.chain
    this.backgroundQueued = true
    return this.schedule(Date.now() + BACKGROUND_DELIVERY_WINDOW_MS, false, () => {
      this.backgroundQueued = false
    })
  }

  private schedule(deadline: number, keepProcessAlive: boolean, onStart?: () => void): Promise<void> {
    this.chain = this.chain
      .then(() => {
        onStart?.()
        return this.drain(deadline, keepProcessAlive)
      })
      .catch(error => this.warn('The answer recorder could not send its events', { error }))
    return this.chain
  }

  private enqueue(items: readonly SpooledAnswerEvent[]): void {
    for (const item of items) {
      this.pending.push({ ...item, bytes: encodedSize(item.event) })
    }
    const excess = this.pending.length - this.maximumBuffered
    if (excess <= 0) return
    const dropped = this.pending.splice(0, excess)
    this.spool?.markDone(dropped.map(item => item.id))
    this.droppedCount += dropped.length
    const now = Date.now()
    if (now - this.lastDropWarningAt >= DROP_WARNING_INTERVAL_MS) {
      this.lastDropWarningAt = now
      this.warn('The answer buffer is full, so the oldest events were dropped', {
        dropped_event_count: this.droppedCount,
        maximum_buffered_events: this.maximumBuffered,
      })
    }
  }

  private recoveryIsDue(): boolean {
    return this.spool !== undefined && Date.now() - this.lastRecoveryAt >= ANSWER_RECOVERY_INTERVAL_MS
  }

  private recover(): void {
    if (this.spool === undefined || !this.recoveryIsDue()) return
    this.lastRecoveryAt = Date.now()
    this.enqueue(this.spool.recoverOrphans())
  }

  private async drain(deadline: number, keepProcessAlive: boolean): Promise<void> {
    this.recover()
    const target = {
      client: this.options.client,
      projectId: this.options.projectId,
      knowledgeBaseId: this.options.knowledgeBaseId,
    }
    while (this.pending.length > 0) {
      const batch = nextBatch(this.pending, this.byteBudget)
      const outcome = await deliverBatch(target, batch, {
        maximumAttempts: this.maximumAttempts,
        deadline: () => Math.min(deadline, this.closeDeadline),
        keepProcessAlive,
        wake: this.wake.signal,
      })
      if (outcome.kind === 'deadline_passed') return
      if (outcome.kind === 'too_large' && batch.length > 1) {
        this.byteBudget = Math.max(1, Math.floor(outcome.bytes / 2))
        continue
      }
      this.settleBatch(batch, outcome)
    }
    this.spool?.settle()
  }

  private settleBatch(batch: readonly PendingAnswerEvent[], outcome: AnswerDeliveryOutcome): void {
    const ids = new Set(batch.map(item => item.id))
    this.pending = this.pending.filter(item => !ids.has(item.id))
    this.spool?.markDone([...ids])
    if (outcome.kind === 'delivered') {
      if (outcome.unknownQuestionIds.length > 0) {
        this.warn('Himring did not recognise some question IDs, so it ignored their events', {
          question_ids: outcome.unknownQuestionIds,
        })
      }
      return
    }
    if (outcome.kind === 'deadline_passed') return
    const reason = outcome.kind === 'too_large' ? `the event holds ${outcome.bytes} bytes` : outcome.reason
    this.warn('Himring did not accept a batch of answer events, so the batch was dropped', {
      event_count: batch.length,
      reason,
    })
  }

  private warn(message: string, details: Readonly<Record<string, unknown>>): void {
    try {
      this.logger.warn(message, details)
    } catch {
      return
    }
  }
}

export function createAnswerRecorder(options: AnswerRecorderOptions): AnswerRecorder {
  return new AnswerRecorder(options)
}
