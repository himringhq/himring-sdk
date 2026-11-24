import type { HimringOperationId } from '@himring/sdk'
import type { CommandSpec } from './operation-specs.js'

export const MEMORY_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  memory:
    'Turn on the Memory of a project, read how far it has sorted, change its thresholds, and delete or restore it.',
  memories:
    'List the memories that an agent may receive, inspect one with its sources and decisions, share a personal memory, sort a message without storing it, and export the memories as JSON.',
  'memory-reviews': 'List the memories that wait for a person, and settle them.',
  'memory-owners': 'List the end users and teams that the Memory holds memories for.',
  'memory-sources':
    "Connect your agents' conversations, your code, a database table, or a connected tool to the Memory, and sync, change, or disconnect them.",
  messages:
    'Send messages to an agent or push source of the Memory, list their receipts, and read one with the memories that it wrote.',
}

const MEMORY = '--memory mem_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f'
const STORED = '--stored-memory mm_9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a'
const REVIEW = '--review rev_2c4e6a8c0e2a4c6e8a0c2e4a6c8e0a2c'
const SOURCE = '--source src_6d8f0a2c4e1b3d5f7a9c0e2b4d6f8a1c'

export const MEMORY_COMMANDS = {
  enable_memory: {
    resource: 'memory',
    verb: 'enable',
    examples: ['himring memory enable', 'himring memory enable --language french --confidence-threshold 0.9'],
  },
  get_memory: {
    resource: 'memory',
    verb: 'get',
    examples: ['himring memory get', 'himring memory get --state deleted --output json'],
  },
  update_memory: {
    resource: 'memory',
    verb: 'update',
    confirm: true,
    examples: [
      `himring memory update ${MEMORY} --duplicate-threshold 0.85 --yes`,
      `himring memory update ${MEMORY} --knowledge-base-choice listed --checked-knowledge-base-ids kb_4a6c8e0a2c4e6a8c0e2a4c6e8a0c2e4a,kb_7e9a1c3e5a7c9e1a3c5e7a9c1e3a5c7e --dry-run`,
    ],
  },
  delete_memory: {
    resource: 'memory',
    verb: 'delete',
    confirm: true,
    examples: [`himring memory delete ${MEMORY} --yes`, `himring memory delete ${MEMORY} --dry-run`],
  },
  restore_memory: {
    resource: 'memory',
    verb: 'restore',
    examples: [`himring memory restore ${MEMORY}`, `himring memory restore ${MEMORY} --output json`],
  },
  list_memories: {
    resource: 'memories',
    verb: 'list',
    examples: [
      `himring memories list ${MEMORY} --end-user customer-1042 --query "delivery address"`,
      `himring memories list ${MEMORY} --type plan --plan-state open,overdue --output json`,
    ],
  },
  inspect_memory: {
    resource: 'memories',
    verb: 'inspect',
    examples: [
      `himring memories inspect ${MEMORY} ${STORED}`,
      `himring memories inspect ${MEMORY} ${STORED} --output json`,
    ],
  },
  promote_memory: {
    resource: 'memories',
    verb: 'promote',
    confirm: true,
    examples: [
      `himring memories promote ${MEMORY} ${STORED} --scope company --yes`,
      `himring memories promote ${MEMORY} ${STORED} --scope team --team support-emea --dry-run`,
    ],
  },
  sort_message: {
    resource: 'memories',
    verb: 'sort',
    examples: [
      `himring memories sort ${MEMORY} --text "Refunds now take 5 working days." --author "Head of support" --author-kind staff`,
      `himring memories sort ${MEMORY} --text "I moved to Leeds." --author customer-1042 --author-kind end_user --end-user customer-1042 --output json`,
    ],
  },
  list_memory_reviews: {
    resource: 'memory-reviews',
    verb: 'list',
    examples: [
      `himring memory-reviews list ${MEMORY}`,
      `himring memory-reviews list ${MEMORY} --reason instruction_like,disputed --output json`,
    ],
  },
  settle_memory_review: {
    resource: 'memory-reviews',
    verb: 'settle',
    confirm: true,
    examples: [
      `himring memory-reviews settle ${MEMORY} ${REVIEW} --trust-level confirmed --yes`,
      `himring memory-reviews settle ${MEMORY} ${REVIEW} --trust-level not_kept --dry-run`,
    ],
  },
  create_memory_source: {
    resource: 'memory-sources',
    verb: 'create',
    examples: [
      `himring memory-sources create ${MEMORY} --name "Support agent" --kind agent`,
      `himring memory-sources create ${MEMORY} --name "Customers table" --kind database --settings-file table.json --output json`,
    ],
  },
  list_memory_sources: {
    resource: 'memory-sources',
    verb: 'list',
    examples: [
      `himring memory-sources list ${MEMORY}`,
      `himring memory-sources list ${MEMORY} --kind slack --output json`,
    ],
  },
  get_memory_source: {
    resource: 'memory-sources',
    verb: 'get',
    examples: [
      `himring memory-sources get ${MEMORY} ${SOURCE}`,
      `himring memory-sources get ${MEMORY} ${SOURCE} --output json`,
    ],
  },
  update_memory_source: {
    resource: 'memory-sources',
    verb: 'update',
    confirm: true,
    examples: [
      `himring memory-sources update ${MEMORY} ${SOURCE} --sorting rules_only --yes`,
      `himring memory-sources update ${MEMORY} ${SOURCE} --name "Support agent, Europe" --dry-run`,
    ],
  },
  delete_memory_source: {
    resource: 'memory-sources',
    verb: 'delete',
    confirm: true,
    examples: [
      `himring memory-sources delete ${MEMORY} ${SOURCE} --yes`,
      `himring memory-sources delete ${MEMORY} ${SOURCE} --dry-run`,
    ],
  },
  sync_memory_source: {
    resource: 'memory-sources',
    verb: 'sync',
    examples: [
      `himring memory-sources sync ${MEMORY} ${SOURCE}`,
      `himring memory-sources sync ${MEMORY} ${SOURCE} --output json`,
    ],
  },
  start_memory_source_sign_in: {
    resource: 'memory-sources',
    verb: 'sign-in',
    examples: [
      `himring memory-sources sign-in ${MEMORY} ${SOURCE}`,
      `himring memory-sources sign-in ${MEMORY} ${SOURCE} --output json`,
    ],
  },
  add_messages: {
    resource: 'messages',
    verb: 'add',
    examples: [
      `himring messages add ${MEMORY} ${SOURCE} --items-file messages.json`,
      `cat messages.json | himring messages add ${MEMORY} ${SOURCE} --items-file - --output json`,
    ],
  },
  list_messages: {
    resource: 'messages',
    verb: 'list',
    examples: [
      `himring messages list ${MEMORY} --state waiting,failed`,
      `himring messages list ${MEMORY} ${SOURCE} --conversation-id ticket-88 --output json`,
    ],
  },
  get_message: {
    resource: 'messages',
    verb: 'get',
    examples: [
      `himring messages get ${MEMORY} ${SOURCE} --external-id ticket-88-reply-3`,
      `himring messages get ${MEMORY} ${SOURCE} --external-id ticket-88-reply-3 --version 2 --output json`,
    ],
  },
  export_memories: {
    resource: 'memories',
    verb: 'export',
    examples: [
      `himring memories export ${MEMORY} --end-user customer-1042 --out customer-1042-memories.json`,
      `himring memories export ${MEMORY} --after mm_9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a --out memories-part-2.json --force`,
    ],
  },
  list_memory_owners: {
    resource: 'memory-owners',
    verb: 'list',
    examples: [
      `himring memory-owners list ${MEMORY} --query support`,
      `himring memory-owners list ${MEMORY} --scope team --output json`,
    ],
  },
} as const satisfies Partial<Record<HimringOperationId, CommandSpec>>
