import type { SearchKnowledgeBaseInput, SearchKnowledgeBaseOutput } from '../generated/types.js'
import { ANSWER_TEXT_KEPT_MAXIMUM, type AnswerEventDraft, boundedLongText } from './answer-event-rules.js'

export const QUESTIONS_PER_TURN_MAXIMUM = 50

export interface RememberedSearch {
  question_id: string
  passages: readonly { chunk_id: string }[]
}

export type AnswerConversationSearch = Omit<
  SearchKnowledgeBaseInput,
  'project_id' | 'knowledge_base_id' | 'end_user_id' | 'call_id'
>

export interface AnswerSignalOptions {
  questionIds?: readonly string[] | undefined
}

export interface AnswerConversationHost {
  record(drafts: readonly AnswerEventDraft[]): void
  search(
    input: AnswerConversationSearch & { end_user_id?: string; call_id?: string },
  ): Promise<SearchKnowledgeBaseOutput>
  flush(): Promise<void>
  warn(message: string, details: Readonly<Record<string, unknown>>): void
}

export interface AnswerConversationIdentity {
  endUserId?: string | undefined
  callId?: string | undefined
}

interface Turn {
  questions: Map<string, ReadonlySet<string>>
  answer: string
}

function emptyTurn(): Turn {
  return { questions: new Map(), answer: '' }
}

export class AnswerConversation {
  private current: Turn = emptyTurn()
  private answered: Turn | undefined
  private readonly host: AnswerConversationHost
  private readonly identity: AnswerConversationIdentity

  constructor(host: AnswerConversationHost, identity: AnswerConversationIdentity) {
    this.host = host
    this.identity = identity
  }

  async search(input: AnswerConversationSearch): Promise<SearchKnowledgeBaseOutput> {
    const result = await this.host.search({
      ...input,
      ...(this.identity.endUserId === undefined ? {} : { end_user_id: this.identity.endUserId }),
      ...(this.identity.callId === undefined ? {} : { call_id: this.identity.callId }),
    })
    this.rememberSearch(result)
    return result
  }

  rememberSearch(result: RememberedSearch): void {
    this.guarded('remember a search', () => {
      if (this.current.answer.length > 0) this.startTurn()
      if (this.current.questions.size >= QUESTIONS_PER_TURN_MAXIMUM) return
      this.current.questions.set(result.question_id, new Set(result.passages.map(passage => passage.chunk_id)))
    })
  }

  recordAnswer(text: string, options: { citedChunkIds?: readonly string[] | undefined } = {}): void {
    this.guarded('record an answer', () => {
      const turn = this.current
      const piece = boundedLongText(text, ANSWER_TEXT_KEPT_MAXIMUM)
      if (turn.questions.size === 0 || piece === undefined) return
      const joined = turn.answer.length === 0 ? piece : `${turn.answer}\n${piece}`
      turn.answer = joined.slice(0, ANSWER_TEXT_KEPT_MAXIMUM)
      const occurredAt = new Date().toISOString()
      const cited = options.citedChunkIds === undefined ? undefined : new Set(options.citedChunkIds)
      const drafts = [...turn.questions].map(([questionId, returned]) => ({
        question_id: questionId,
        answer: turn.answer,
        occurred_at: occurredAt,
        cited_chunk_ids: cited === undefined ? undefined : [...cited].filter(id => returned.has(id)),
      }))
      this.host.record(drafts)
      this.answered = turn
    })
  }

  recordUserMessage(text: string): void {
    this.guarded('record a user message', () => {
      if (this.current.answer.length === 0) return
      const occurredAt = new Date().toISOString()
      this.host.record(
        [...this.current.questions.keys()].map(questionId => ({
          question_id: questionId,
          follow_up: text,
          occurred_at: occurredAt,
        })),
      )
      this.startTurn()
    })
  }

  recordThumbsDown(options: AnswerSignalOptions = {}): void {
    this.guarded('record a thumbs-down', () => {
      this.host.record(this.targets(options, false).map(questionId => ({ question_id: questionId, thumbs_down: true })))
    })
  }

  recordHandoff(reason: string, options: AnswerSignalOptions = {}): void {
    this.guarded('record a handoff', () => {
      this.host.record(
        this.targets(options, true).map(questionId => ({ question_id: questionId, handoff_reason: reason })),
      )
    })
  }

  end(): Promise<void> {
    return this.host.flush()
  }

  private targets(options: AnswerSignalOptions, includeUnanswered: boolean): string[] {
    if (options.questionIds !== undefined) return [...options.questionIds]
    const currentCounts = includeUnanswered ? this.current.questions.size > 0 : this.current.answer.length > 0
    const turn = currentCounts ? this.current : this.answered
    return turn === undefined ? [] : [...turn.questions.keys()]
  }

  private startTurn(): void {
    if (this.current.answer.length > 0) this.answered = this.current
    this.current = emptyTurn()
  }

  private guarded(action: string, work: () => void): void {
    try {
      work()
    } catch (error) {
      this.host.warn(`The answer recorder could not ${action}`, { error })
    }
  }
}
