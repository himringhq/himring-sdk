import type { HimringOperationId } from '@himring/sdk'
import type { CommandSpec } from './operation-specs.js'

export const SOURCE_RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  sources:
    'Connect the systems that feed a knowledge base, such as call platforms, Zendesk, S3 buckets, Slack, Notion, Confluence, and Google Drive, and sign in to them, sync, change, or disconnect them.',
  'source-sign-ins': 'Finish the sign-in of a source with the state and the code that the platform returned.',
  'source-items':
    'Send conversations, messages, and records from any system to a push source, and list their receipts.',
}

const KB = '--knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f'
const SOURCE = '--source src_6d8f0a2c4e1b3d5f7a9c0e2b4d6f8a1c'

export const SOURCE_COMMANDS = {
  create_source: {
    resource: 'sources',
    verb: 'create',
    examples: [
      `himring sources create ${KB} --name "Order system" --kind push`,
      `himring sources create ${KB} --name "Support calls" --kind retell --credentials-file retell.json`,
      `himring sources create ${KB} --name "Contracts bucket" --kind s3 --settings-file bucket.json --credentials-file bucket-key.json --output json`,
    ],
  },
  list_sources: {
    resource: 'sources',
    verb: 'list',
    examples: [`himring sources list ${KB}`, `himring sources list ${KB} --kind vapi,retell --output json`],
  },
  get_source: {
    resource: 'sources',
    verb: 'get',
    examples: [`himring sources get ${KB} ${SOURCE}`, `himring sources get ${KB} ${SOURCE} --output json`],
  },
  list_source_syncs: {
    resource: 'sources',
    verb: 'syncs',
    examples: [
      `himring sources syncs ${KB} ${SOURCE}`,
      `himring sources syncs ${KB} ${SOURCE} --limit 5 --output json`,
    ],
  },
  update_source: {
    resource: 'sources',
    verb: 'update',
    confirm: true,
    examples: [
      `himring sources update ${KB} ${SOURCE} --credentials-file new-key.json --yes`,
      `himring sources update ${KB} ${SOURCE} --rotate-webhook-secret true --yes --output json`,
      `himring sources update ${KB} ${SOURCE} --name "Support calls, Europe" --dry-run`,
    ],
  },
  delete_source: {
    resource: 'sources',
    verb: 'delete',
    confirm: true,
    examples: [`himring sources delete ${KB} ${SOURCE} --yes`, `himring sources delete ${KB} ${SOURCE} --dry-run`],
  },
  sync_source: {
    resource: 'sources',
    verb: 'sync',
    examples: [`himring sources sync ${KB} ${SOURCE}`, `himring sources sync ${KB} ${SOURCE} --output json`],
  },
  start_source_sign_in: {
    resource: 'sources',
    verb: 'sign-in',
    examples: [`himring sources sign-in ${KB} ${SOURCE}`, `himring sources sign-in ${KB} ${SOURCE} --output json`],
  },
  finish_source_sign_in: {
    resource: 'source-sign-ins',
    verb: 'finish',
    examples: ['himring source-sign-ins finish --state 4kQ9xT2mW7pL0vB3nR8sY1dF6hJ5gK2cZ9aE4uI7oP0 --code 7a1f0c9e2b'],
  },
  ingest_items: {
    resource: 'source-items',
    verb: 'ingest',
    examples: [
      `himring source-items ingest ${KB} ${SOURCE} --items-file items.json`,
      `cat items.json | himring source-items ingest ${KB} ${SOURCE} --items-file - --output json`,
    ],
  },
  list_source_items: {
    resource: 'source-items',
    verb: 'list',
    examples: [
      `himring source-items list ${KB} ${SOURCE} --state waiting`,
      `himring source-items list ${KB} ${SOURCE} --external-id order-1042 --output json`,
    ],
  },
} as const satisfies Partial<Record<HimringOperationId, CommandSpec>>
