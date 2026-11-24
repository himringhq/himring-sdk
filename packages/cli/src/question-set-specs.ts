import type { HimringOperationId } from '@himring/sdk'
import type { CommandSpec } from './operation-specs.js'

export const QUESTION_SET_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'question-set': 'Read the saved questions of a knowledge base in summary, with the settings that search uses.',
  'saved-questions': 'Save, import, list, read, update, and delete the questions that a knowledge base answers.',
  scorecards: 'Score the saved questions and read the result of each one.',
  corrections: 'Propose, try, promote, and discard corrections to the search settings of a knowledge base.',
  'correction-passes': 'List and read the passes that propose and try corrections.',
}

const KB = '--knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f'
const SAVED_QUESTION = '--saved-question svq_7c1e3a5b9d2f4e6a8c0b1d3f5a7c9e2b'
const SCORECARD = '--scorecard scr_4a6c8e0b2d1f3a5c7e9b0d2f4a6c8e1b'
const CORRECTION = '--correction cor_9e1c3a5b7d0f2e4a6c8b1d3f5e7a9c2b'
const PASS = '--pass pas_5b7d9f1a3c0e2b4d6f8a0c2e4b6d8f1a'

export const QUESTION_SET_COMMANDS = {
  get_question_set: {
    resource: 'question-set',
    verb: 'get',
    examples: [`himring question-set get ${KB}`, `himring question-set get ${KB} --output json`],
  },
  save_question: {
    resource: 'saved-questions',
    verb: 'save',
    examples: [
      `himring saved-questions save ${KB} --question "How long do refunds take?" --chunk chk_2b4d6f8a0c1e3a5c7e9b8d6f4a2c0e1b`,
      `himring saved-questions save ${KB} --question "Where do I sign for repairs?" --file fil_0a1b2c3d4e5f60718293a4b5c6d7e8f9 --first-position 12 --last-position 14`,
    ],
  },
  list_saved_questions: {
    resource: 'saved-questions',
    verb: 'list',
    examples: [
      `himring saved-questions list ${KB} --state broken`,
      `himring saved-questions list ${KB} --split held_back --search refund --output json`,
    ],
  },
  get_saved_question: {
    resource: 'saved-questions',
    verb: 'get',
    examples: [
      `himring saved-questions get ${KB} ${SAVED_QUESTION}`,
      `himring saved-questions get ${KB} ${SAVED_QUESTION} --output json`,
    ],
  },
  update_saved_question: {
    resource: 'saved-questions',
    verb: 'update',
    examples: [
      `himring saved-questions update ${KB} ${SAVED_QUESTION} --confirm true`,
      `himring saved-questions update ${KB} ${SAVED_QUESTION} --file fil_0a1b2c3d4e5f60718293a4b5c6d7e8f9 --first-position 20 --last-position 22`,
    ],
  },
  delete_saved_question: {
    resource: 'saved-questions',
    verb: 'delete',
    confirm: true,
    examples: [
      `himring saved-questions delete ${KB} ${SAVED_QUESTION} --yes`,
      `himring saved-questions delete ${KB} ${SAVED_QUESTION} --dry-run`,
    ],
  },
  score_question_set: {
    resource: 'scorecards',
    verb: 'score',
    examples: [`himring scorecards score ${KB}`, `himring scorecards score ${KB} --output json`],
  },
  list_scorecards: {
    resource: 'scorecards',
    verb: 'list',
    examples: [`himring scorecards list ${KB}`, `himring scorecards list ${KB} --limit 5 --output json`],
  },
  get_scorecard: {
    resource: 'scorecards',
    verb: 'get',
    examples: [`himring scorecards get ${KB} ${SCORECARD}`, `himring scorecards get ${KB} ${SCORECARD} --output json`],
  },
  list_scorecard_results: {
    resource: 'scorecards',
    verb: 'results',
    examples: [
      `himring scorecards results ${KB} ${SCORECARD} --outcome failed --cause ranked_lower`,
      `himring scorecards results ${KB} ${SCORECARD} --compare-to scr_1b3d5f7a9c0e2b4d6f8a1c3e5b7d9f0a --output json`,
      `himring scorecards results ${KB} ${SCORECARD} --compare-to scr_1b3d5f7a9c0e2b4d6f8a1c3e5b7d9f0a --change now_passes,now_fails`,
    ],
  },
  propose_corrections: {
    resource: 'corrections',
    verb: 'propose',
    examples: [`himring corrections propose ${KB}`, `himring corrections propose ${KB} --output json`],
  },
  create_correction: {
    resource: 'corrections',
    verb: 'create',
    examples: [
      `himring corrections create ${KB} --setting-file setting.json`,
      `echo '{"kind":"chunking","chunk_tokens":300}' | himring corrections create ${KB} --setting-file - --target-ids svq_7c1e3a5b9d2f4e6a8c0b1d3f5a7c9e2b`,
    ],
  },
  list_corrections: {
    resource: 'corrections',
    verb: 'list',
    examples: [
      `himring corrections list ${KB} ${PASS}`,
      `himring corrections list ${KB} --status proposed,tried`,
      `himring corrections list ${KB} --kind chunking --output json`,
    ],
  },
  get_correction: {
    resource: 'corrections',
    verb: 'get',
    examples: [
      `himring corrections get ${KB} ${CORRECTION}`,
      `himring corrections get ${KB} ${CORRECTION} --output json`,
    ],
  },
  try_corrections: {
    resource: 'corrections',
    verb: 'try',
    examples: [
      `himring corrections try ${KB} --correction-ids cor_9e1c3a5b7d0f2e4a6c8b1d3f5e7a9c2b`,
      `himring corrections try ${KB} --correction-ids cor_9e1c3a5b7d0f2e4a6c8b1d3f5e7a9c2b --complete-index true`,
    ],
  },
  promote_correction: {
    resource: 'corrections',
    verb: 'promote',
    confirm: true,
    examples: [
      `himring corrections promote ${KB} ${CORRECTION} --yes`,
      `himring corrections promote ${KB} ${CORRECTION} --note "Held-back score held at 41 of 50" --yes`,
    ],
  },
  discard_correction: {
    resource: 'corrections',
    verb: 'discard',
    confirm: true,
    examples: [
      `himring corrections discard ${KB} ${CORRECTION} --yes`,
      `himring corrections discard ${KB} ${CORRECTION} --note "Too slow to build" --dry-run`,
    ],
  },
  list_correction_passes: {
    resource: 'correction-passes',
    verb: 'list',
    examples: [`himring correction-passes list ${KB}`, `himring correction-passes list ${KB} --limit 5 --output json`],
  },
  get_correction_pass: {
    resource: 'correction-passes',
    verb: 'get',
    examples: [
      `himring correction-passes get ${KB} ${PASS}`,
      `himring correction-passes get ${KB} ${PASS} --output json`,
    ],
  },
} as const satisfies Partial<Record<HimringOperationId, CommandSpec>>
