import type { HimringOperationId } from '@himring/sdk'

export const FLAGGED_QUESTION_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'answer-events': 'Send what your agent answered, the follow-up, thumbs-downs, and handoffs for each search.',
  'flagged-questions':
    'Read the likely wrong answers from live traffic, choose the passage for an unsure one, and start a review.',
}

const KB = '--knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f'
const QUESTION = '--question qst_6d8f0a2c4e1b3d5f7a9c0e2b4d6f8a1c'

export const FLAGGED_QUESTION_EXAMPLES = {
  record_answer_events: [
    `echo '[{"question_id":"qst_6d8f0a2c4e1b3d5f7a9c0e2b4d6f8a1c","answer":"Refunds take 5 days."}]' | himring answer-events record ${KB} --events-file -`,
    `himring answer-events record ${KB} --origin sdk --events-file events.json --output json`,
  ],
  list_flagged_questions: [
    `himring flagged-questions list ${KB} --status unsure`,
    `himring flagged-questions list ${KB} --status unanswerable,saved --limit 20 --output json`,
  ],
  get_flagged_question: [
    `himring flagged-questions get ${KB} ${QUESTION}`,
    `himring flagged-questions get ${KB} ${QUESTION} --output json`,
  ],
  settle_flagged_question: [
    `himring flagged-questions settle ${KB} ${QUESTION} --chunk chk_2b4d6f8a0c1e3a5c7e9b8d6f4a2c0e1b`,
    `himring flagged-questions settle ${KB} ${QUESTION} --file fil_0a1b2c3d4e5f60718293a4b5c6d7e8f9 --first-position 12 --last-position 14 --output json`,
  ],
  dismiss_flagged_question: [
    `himring flagged-questions dismiss ${KB} ${QUESTION} --yes`,
    `himring flagged-questions dismiss ${KB} ${QUESTION} --dry-run`,
  ],
  review_flagged_questions: [
    `himring flagged-questions review ${KB}`,
    `himring flagged-questions review ${KB} --output json`,
  ],
} as const satisfies Partial<Record<HimringOperationId, readonly string[]>>
