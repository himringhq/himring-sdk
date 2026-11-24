import type { HimringOperationId } from '@himring/sdk'
import type { CommandSpec } from './operation-specs.js'

export const MEMORY_REVIEW_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'memory-decisions':
    'List the decisions that Himring applied to memories, settle a memory over any of them, forget or recover a memory, and send feedback on a recalled memory.',
  recall: 'Recall memories for an agent with their labels, or read the context of one end user or team.',
  'memory-webhooks':
    'Set the endpoint that receives each applied decision as a signed event, read or remove it, and list its deliveries.',
  'memory-learning':
    'List what Himring learned from labeled decisions, undo a learned change, run tuning now, and read the scores of the Memory.',
  'memory-questions': 'Save the questions that the recall score checks, list them, and delete them.',
}

const MEMORY = '--memory mem_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f'
const STORED = '--stored-memory mm_9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a'
const CHANGE = '--change lrn_5e7a9c1e3a5c7e9a1c3e5a7c9e1a3c5e'
const SAVED = '--saved-question msq_8a0c2e4a6c8e0a2c4e6a8c0e2a4c6e8a'
const RECALL = '--recall rcl_1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a'

export const MEMORY_REVIEW_COMMANDS = {
  list_memory_decisions: {
    resource: 'memory-decisions',
    verb: 'list',
    examples: [
      `himring memory-decisions list ${MEMORY} --kind disputed,file_conflict`,
      `himring memory-decisions list ${MEMORY} --subject-owner billing-team --by-person true --output json`,
    ],
  },
  settle_memory: {
    resource: 'memory-decisions',
    verb: 'settle',
    confirm: true,
    examples: [
      `himring memory-decisions settle ${MEMORY} ${STORED} --trust-level confirmed --yes`,
      `himring memory-decisions settle ${MEMORY} ${STORED} --trust-level confirmed --over-file true --dry-run`,
    ],
  },
  forget_memory: {
    resource: 'memory-decisions',
    verb: 'forget',
    confirm: true,
    examples: [
      `himring memory-decisions forget ${MEMORY} ${STORED} --yes`,
      `himring memory-decisions forget ${MEMORY} ${STORED} --dry-run`,
    ],
  },
  recover_memory: {
    resource: 'memory-decisions',
    verb: 'recover',
    examples: [
      `himring memory-decisions recover ${MEMORY} ${STORED}`,
      `himring memory-decisions recover ${MEMORY} ${STORED} --output json`,
    ],
  },
  list_forgetting_suggestions: {
    resource: 'memory-decisions',
    verb: 'suggestions',
    examples: [
      `himring memory-decisions suggestions ${MEMORY}`,
      `himring memory-decisions suggestions ${MEMORY} --limit 50 --output json`,
    ],
  },
  send_memory_feedback: {
    resource: 'memory-decisions',
    verb: 'feedback',
    examples: [
      `himring memory-decisions feedback ${MEMORY} ${STORED} --verdict wrong ${RECALL}`,
      `himring memory-decisions feedback ${MEMORY} ${STORED} --verdict right --output json`,
    ],
  },
  recall_memories: {
    resource: 'recall',
    verb: 'search',
    examples: [
      `himring recall search ${MEMORY} --query "delivery address" --end-user customer-1042`,
      `himring recall search ${MEMORY} --query "returns window" --as-of 2026-10-01T09:00:00Z --output json`,
    ],
  },
  get_memory_context: {
    resource: 'recall',
    verb: 'context',
    examples: [
      `himring recall context ${MEMORY} --end-user customer-1042`,
      `himring recall context ${MEMORY} --team support-emea --agent billing-bot --output json`,
    ],
  },
  set_memory_webhook: {
    resource: 'memory-webhooks',
    verb: 'set',
    confirm: true,
    examples: [
      `himring memory-webhooks set ${MEMORY} --url https://example.com/himring/events --yes`,
      `himring memory-webhooks set ${MEMORY} --url https://example.com/himring/events --dry-run`,
    ],
  },
  get_memory_webhook: {
    resource: 'memory-webhooks',
    verb: 'get',
    examples: [`himring memory-webhooks get ${MEMORY}`, `himring memory-webhooks get ${MEMORY} --output json`],
  },
  remove_memory_webhook: {
    resource: 'memory-webhooks',
    verb: 'remove',
    confirm: true,
    examples: [`himring memory-webhooks remove ${MEMORY} --yes`, `himring memory-webhooks remove ${MEMORY} --dry-run`],
  },
  list_memory_webhook_deliveries: {
    resource: 'memory-webhooks',
    verb: 'deliveries',
    examples: [
      `himring memory-webhooks deliveries ${MEMORY} --state waiting,failed`,
      `himring memory-webhooks deliveries ${MEMORY} --output json`,
    ],
  },
  list_learned_changes: {
    resource: 'memory-learning',
    verb: 'list',
    examples: [`himring memory-learning list ${MEMORY}`, `himring memory-learning list ${MEMORY} --output json`],
  },
  undo_learned_change: {
    resource: 'memory-learning',
    verb: 'undo',
    confirm: true,
    examples: [
      `himring memory-learning undo ${MEMORY} ${CHANGE} --yes`,
      `himring memory-learning undo ${MEMORY} ${CHANGE} --dry-run`,
    ],
  },
  tune_memory: {
    resource: 'memory-learning',
    verb: 'tune',
    examples: [`himring memory-learning tune ${MEMORY}`, `himring memory-learning tune ${MEMORY} --output json`],
  },
  get_memory_scores: {
    resource: 'memory-learning',
    verb: 'scores',
    examples: [`himring memory-learning scores ${MEMORY}`, `himring memory-learning scores ${MEMORY} --output json`],
  },
  save_memory_question: {
    resource: 'memory-questions',
    verb: 'save',
    examples: [
      `himring memory-questions save ${MEMORY} ${STORED} --question "Where do I send returns?"`,
      `himring memory-questions save ${MEMORY} ${STORED} --question "What is my delivery address?" --end-user customer-1042 --output json`,
    ],
  },
  list_memory_saved_questions: {
    resource: 'memory-questions',
    verb: 'list',
    examples: [
      `himring memory-questions list ${MEMORY}`,
      `himring memory-questions list ${MEMORY} --flagged true --output json`,
    ],
  },
  delete_memory_saved_question: {
    resource: 'memory-questions',
    verb: 'delete',
    confirm: true,
    examples: [
      `himring memory-questions delete ${MEMORY} ${SAVED} --yes`,
      `himring memory-questions delete ${MEMORY} ${SAVED} --dry-run`,
    ],
  },
} as const satisfies Partial<Record<HimringOperationId, CommandSpec>>
