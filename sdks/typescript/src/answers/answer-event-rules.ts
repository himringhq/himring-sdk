import { isRecord, operationSpec, SpecRuleError } from '../core/spec-rules.js'
import type { RecordAnswerEventsInput } from '../generated/types.js'

export type AnswerEventInput = RecordAnswerEventsInput['events'][number]

export interface AnswerEventDraft {
  question_id: string
  answer?: string | undefined
  follow_up?: string | undefined
  cited_chunk_ids?: readonly string[] | undefined
  thumbs_down?: boolean | undefined
  handoff_reason?: string | undefined
  occurred_at?: string | undefined
}

export const ANSWER_TEXT_KEPT_MAXIMUM = 65_536
const CONTROL_EXCEPT_LINE_BREAKS = /(?![\n\r\t])\p{Cc}/gu
const ANY_CONTROL = /\p{Cc}/gu
const REGULAR_EXPRESSION_LITERAL = /^\/(.+)\/([a-z]*)$/s

function loadRules() {
  const spec = operationSpec('record_answer_events')
  const events = spec.input(['properties', 'events'])
  const item = spec.schemaAt(events, ['items'])
  const cited = spec.schemaAt(item, ['properties', 'cited_chunk_ids'])
  const handoff = spec.schemaAt(item, ['properties', 'handoff_reason'])
  const occurredAt = spec.schemaAt(item, ['properties', 'occurred_at'])
  const timestamp = REGULAR_EXPRESSION_LITERAL.exec(spec.ruleExpectation(occurredAt, 'iso_timestamp', 'occurred_at'))
  if (timestamp?.[1] === undefined) {
    throw new SpecRuleError('The spec of record_answer_events describes its time rule in an unknown way.')
  }
  return {
    eventsPerRequest: spec.wholeNumberAt(events, 'maxItems', 'events'),
    citedChunksMaximum: spec.wholeNumberAt(cited, 'maxItems', 'cited_chunk_ids'),
    questionIdPattern: spec.patternAt(spec.schemaAt(item, ['properties', 'question_id']), 'question_id'),
    chunkIdPattern: spec.patternAt(spec.schemaAt(cited, ['items']), 'cited_chunk_ids'),
    handoffReasonMaximum: spec.atMost(handoff, 'max_length', 'handoff_reason'),
    occurredAtPattern: new RegExp(timestamp[1], timestamp[2]),
  }
}

export const ANSWER_EVENT_RULES = loadRules()

export function boundedLongText(text: string, maximum: number): string | undefined {
  const cleaned = text.replace(CONTROL_EXCEPT_LINE_BREAKS, '').trim().slice(0, maximum).toWellFormed()
  return cleaned.length === 0 ? undefined : cleaned
}

function boundedHandoffReason(reason: string): string | undefined {
  const cleaned = reason
    .replace(ANY_CONTROL, ' ')
    .trim()
    .slice(0, ANSWER_EVENT_RULES.handoffReasonMaximum)
    .trim()
    .toWellFormed()
  return cleaned.length === 0 ? undefined : cleaned
}

function isText(value: unknown): value is string {
  return typeof value === 'string'
}

export function wireAnswerEvent(draft: AnswerEventDraft): AnswerEventInput | undefined {
  if (!isText(draft.question_id) || !ANSWER_EVENT_RULES.questionIdPattern.test(draft.question_id)) return undefined
  const event: AnswerEventInput = { question_id: draft.question_id }
  const answer = isText(draft.answer) ? boundedLongText(draft.answer, ANSWER_TEXT_KEPT_MAXIMUM) : undefined
  const followUp = isText(draft.follow_up) ? boundedLongText(draft.follow_up, ANSWER_TEXT_KEPT_MAXIMUM) : undefined
  const handoff = isText(draft.handoff_reason) ? boundedHandoffReason(draft.handoff_reason) : undefined
  if (answer !== undefined) event.answer = answer
  if (followUp !== undefined) event.follow_up = followUp
  if (handoff !== undefined) event.handoff_reason = handoff
  if (Array.isArray(draft.cited_chunk_ids)) {
    const cited = [...new Set(draft.cited_chunk_ids)].filter(
      id => isText(id) && ANSWER_EVENT_RULES.chunkIdPattern.test(id),
    )
    event.cited_chunk_ids = cited.slice(0, ANSWER_EVENT_RULES.citedChunksMaximum)
  }
  if (draft.thumbs_down === true) event.thumbs_down = true
  if (isText(draft.occurred_at)) {
    if (!ANSWER_EVENT_RULES.occurredAtPattern.test(draft.occurred_at)) return undefined
    event.occurred_at = draft.occurred_at
  }
  const carriesSignal =
    event.answer !== undefined ||
    event.follow_up !== undefined ||
    event.cited_chunk_ids !== undefined ||
    event.thumbs_down === true ||
    event.handoff_reason !== undefined
  return carriesSignal ? event : undefined
}

export function parsedWireAnswerEvent(value: unknown): AnswerEventInput | undefined {
  if (!isRecord(value)) return undefined
  const { question_id, answer, follow_up, cited_chunk_ids, thumbs_down, handoff_reason, occurred_at } = value
  if (!isText(question_id)) return undefined
  return wireAnswerEvent({
    question_id,
    answer: isText(answer) ? answer : undefined,
    follow_up: isText(follow_up) ? follow_up : undefined,
    cited_chunk_ids: Array.isArray(cited_chunk_ids) ? cited_chunk_ids.filter(isText) : undefined,
    thumbs_down: thumbs_down === true ? true : undefined,
    handoff_reason: isText(handoff_reason) ? handoff_reason : undefined,
    occurred_at: isText(occurred_at) ? occurred_at : undefined,
  })
}
