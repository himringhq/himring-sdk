import type { ContractRequest } from '@himring/contract-server'
import type { Harness } from './harness.js'
import { idOf } from './harness.js'

export interface DeliveredEvent {
  question_id: string
  answer: string | undefined
}

export interface AnswerEventLog {
  delivered: DeliveredEvent[]
  requestSizes: number[]
}

function eventsOf(request: ContractRequest): DeliveredEvent[] {
  const events = typeof request.body === 'object' && request.body !== null ? Reflect.get(request.body, 'events') : []
  if (!Array.isArray(events)) return []
  return events.flatMap((event: unknown) => {
    if (typeof event !== 'object' || event === null) return []
    const questionId = Reflect.get(event, 'question_id')
    const answer = Reflect.get(event, 'answer')
    if (typeof questionId !== 'string') return []
    return [{ question_id: questionId, answer: typeof answer === 'string' ? answer : undefined }]
  })
}

export function acceptAnswerEvents(harness: Harness, maximumEventsAccepted = Number.POSITIVE_INFINITY): AnswerEventLog {
  const log: AnswerEventLog = { delivered: [], requestSizes: [] }
  harness.api.stub('record_answer_events', request => {
    const events = eventsOf(request)
    log.requestSizes.push(events.length)
    if (events.length > maximumEventsAccepted) {
      return { status: 413, body: { error: { code: 'payload_too_large', message: 'Send fewer events.' } } }
    }
    log.delivered.push(...events)
    return {
      status: 200,
      body: {
        results: events.map(event => ({ question_id: event.question_id, outcome: 'recorded' })),
        recorded_count: events.length,
      },
    }
  })
  return log
}

export function answerDrafts(count: number): DeliveredEvent[] {
  return Array.from({ length: count }, (_unused, index) => ({
    question_id: idOf('qst'),
    answer: `Refunds arrive within ${index + 1} business days.`,
  }))
}

export function sortedByQuestion(events: readonly DeliveredEvent[]): DeliveredEvent[] {
  return [...events].sort((left, right) => left.question_id.localeCompare(right.question_id))
}
