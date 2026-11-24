import type { HimringOperationId } from '@himring/sdk'
import { DATABASE_WORKSPACE_COMMANDS, DATABASE_WORKSPACE_RESOURCE_DESCRIPTIONS } from './database-workspace-specs.js'
import { FLAGGED_QUESTION_COMMANDS, FLAGGED_QUESTION_RESOURCE_DESCRIPTIONS } from './flagged-question-specs.js'
import { INDEX_RECORD_COMMANDS, INDEX_RECORD_RESOURCE_DESCRIPTIONS } from './index-record-specs.js'
import { KNOWLEDGE_BASE_COMMANDS, KNOWLEDGE_BASE_RESOURCE_DESCRIPTIONS } from './knowledge-base-specs.js'
import { MEMORY_REVIEW_COMMANDS, MEMORY_REVIEW_RESOURCE_DESCRIPTIONS } from './memory-review-specs.js'
import { MEMORY_COMMANDS, MEMORY_RESOURCE_DESCRIPTIONS } from './memory-specs.js'
import { QUESTION_SET_COMMANDS, QUESTION_SET_RESOURCE_DESCRIPTIONS } from './question-set-specs.js'
import { SOURCE_COMMANDS, SOURCE_RESOURCE_DESCRIPTIONS } from './source-specs.js'

export interface CommandSpec {
  resource: string
  verb: string
  examples: readonly string[]
  confirm?: true
}

export const RESOURCE_DESCRIPTIONS: Readonly<Record<string, string>> = {
  operations: 'List the operations of the Himring API.',
  auth: 'Sign up, sign in, set up your second factor, and sign out.',
  projects: 'Create, read, delete, and restore projects.',
  members: 'List and remove the members of a project.',
  invitations: 'Invite people to a project, and accept invitations.',
  'api-keys': 'Create, list, and revoke the API keys of a project.',
  databases: 'Create, read, change, delete, restore, and compact the SQLite databases of a project.',
  migrations: 'List and add the migrations of a database.',
  indexes: 'Create, read, change, delete, restore, download, and preview searches of the search indexes of a project.',
  ...DATABASE_WORKSPACE_RESOURCE_DESCRIPTIONS,
  ...INDEX_RECORD_RESOURCE_DESCRIPTIONS,
  ...KNOWLEDGE_BASE_RESOURCE_DESCRIPTIONS,
  ...QUESTION_SET_RESOURCE_DESCRIPTIONS,
  ...FLAGGED_QUESTION_RESOURCE_DESCRIPTIONS,
  ...SOURCE_RESOURCE_DESCRIPTIONS,
  ...MEMORY_RESOURCE_DESCRIPTIONS,
  ...MEMORY_REVIEW_RESOURCE_DESCRIPTIONS,
}

const PROJECT = '--project prj_6d2f0c1e9a8b4c7d5e3f2a1b0c9d8e7f'
const ACCOUNT = '--account 0b6e8f6a-3c1d-4f5e-9a7b-2c4d6e8f0a1b'
const INVITATION = '--invitation inv_5e7d9c1b3a2f4e6d8c0b1a9f7e5d3c2b'
const KEY = '--key key_2b4d6f8a0c1e3a5c7e9b8d6f4a2c0e1b'
const DATABASE = '--database db_3a9e5c7b1d2f4e6a8c0b9d7f5e3a1c2b'
const INDEX = '--index ix_8c4b2a0f1e3d5c7b9a8f6e4d2c0b1a3f'

export const OPERATION_COMMANDS = {
  list_operations: {
    resource: 'operations',
    verb: 'list',
    examples: ['himring operations list', 'himring operations list --output json'],
  },
  get_session: {
    resource: 'auth',
    verb: 'session',
    examples: ['himring auth session', 'himring auth session --output json'],
  },
  create_project: {
    resource: 'projects',
    verb: 'create',
    examples: ['himring projects create --name "Support answers"', 'himring projects create --name Docs --output json'],
  },
  list_projects: {
    resource: 'projects',
    verb: 'list',
    examples: [
      'himring projects list --search support --role owner',
      'himring projects list --state deleted --sort purge_after --direction asc --output json',
    ],
  },
  get_project: {
    resource: 'projects',
    verb: 'get',
    examples: [
      `himring projects get ${PROJECT}`,
      'HIMRING_PROJECT=prj_6d2f0c1e9a8b4c7d5e3f2a1b0c9d8e7f himring projects get',
    ],
  },
  delete_project: {
    resource: 'projects',
    verb: 'delete',
    confirm: true,
    examples: [`himring projects delete ${PROJECT} --yes`, `himring projects delete ${PROJECT} --dry-run`],
  },
  restore_project: {
    resource: 'projects',
    verb: 'restore',
    examples: [`himring projects restore ${PROJECT}`, `himring projects restore ${PROJECT} --output json`],
  },
  list_members: {
    resource: 'members',
    verb: 'list',
    examples: [
      `himring members list ${PROJECT} --role owner`,
      'himring members list --search example.com --sort added_at --direction desc --limit 20 --output json',
    ],
  },
  remove_member: {
    resource: 'members',
    verb: 'remove',
    confirm: true,
    examples: [`himring members remove ${PROJECT} ${ACCOUNT} --yes`, `himring members remove ${ACCOUNT} --dry-run`],
  },
  invite_member: {
    resource: 'invitations',
    verb: 'create',
    examples: [
      'himring invitations create --email teammate@example.com',
      'himring invitations create --email second-owner@example.com --role owner',
    ],
  },
  list_invitations: {
    resource: 'invitations',
    verb: 'list',
    examples: [
      `himring invitations list ${PROJECT} --status expired`,
      'himring invitations list --role member --sort expires_at --direction asc --output json',
    ],
  },
  revoke_invitation: {
    resource: 'invitations',
    verb: 'revoke',
    confirm: true,
    examples: [`himring invitations revoke ${INVITATION} --yes`, `himring invitations revoke ${INVITATION} --dry-run`],
  },
  accept_invitation: {
    resource: 'invitations',
    verb: 'accept',
    examples: [
      'himring invitations accept --token-file invitation.txt',
      'printf "%s" "$INVITATION_TOKEN" | himring invitations accept --token-file - --output json',
    ],
  },
  create_api_key: {
    resource: 'api-keys',
    verb: 'create',
    examples: [
      `printf '%s' '{"access":"full"}' | himring api-keys create --name CI --permissions-file -`,
      'himring api-keys create --name "Support agent" --permissions-file support-agent-permissions.json --output json',
    ],
  },
  update_api_key: {
    resource: 'api-keys',
    verb: 'update',
    examples: [
      `printf '%s' '{"access":"restricted","indexes":{"level":"read"}}' | himring api-keys update ${KEY} --permissions-file -`,
      `himring api-keys update ${KEY} --permissions-file read-only.json --output json`,
    ],
  },
  list_api_key_permission_changes: {
    resource: 'api-keys',
    verb: 'permission-changes',
    examples: [
      `himring api-keys permission-changes ${KEY}`,
      `himring api-keys permission-changes ${KEY} --limit 10 --output json`,
    ],
  },
  list_api_keys: {
    resource: 'api-keys',
    verb: 'list',
    examples: [
      `himring api-keys list ${PROJECT} --status active`,
      'himring api-keys list --search hmr_3f9a --created-from 2026-10-01 --output json',
    ],
  },
  revoke_api_key: {
    resource: 'api-keys',
    verb: 'revoke',
    confirm: true,
    examples: [`himring api-keys revoke ${KEY} --yes`, `himring api-keys revoke ${KEY} --dry-run`],
  },
  create_database: {
    resource: 'databases',
    verb: 'create',
    examples: [
      'himring databases create --name orders',
      'himring databases create --name orders --migrations-file migrations.json',
    ],
  },
  list_databases: {
    resource: 'databases',
    verb: 'list',
    examples: [
      'himring databases list --search orders --creator key --sort name --direction asc',
      'himring databases list --state deleted --sort purge_after --direction asc --limit 20 --offset 20 --output json',
    ],
  },
  get_database: {
    resource: 'databases',
    verb: 'get',
    examples: [`himring databases get ${DATABASE}`, `himring databases get ${DATABASE} --output json`],
  },
  update_database: {
    resource: 'databases',
    verb: 'update',
    confirm: true,
    examples: [
      `himring databases update ${DATABASE} --sql-write-preview true --yes`,
      `himring databases update ${DATABASE} --sql-write-preview false --dry-run`,
    ],
  },
  delete_database: {
    resource: 'databases',
    verb: 'delete',
    confirm: true,
    examples: [`himring databases delete ${DATABASE} --yes`, `himring databases delete ${DATABASE} --dry-run`],
  },
  restore_database: {
    resource: 'databases',
    verb: 'restore',
    examples: [`himring databases restore ${DATABASE}`, `himring databases restore ${DATABASE} --output json`],
  },
  compact_database: {
    resource: 'databases',
    verb: 'compact',
    examples: [`himring databases compact ${DATABASE}`, `himring databases compact ${DATABASE} --output json`],
  },
  list_database_migrations: {
    resource: 'migrations',
    verb: 'list',
    examples: [`himring migrations list ${DATABASE}`, `himring migrations list ${DATABASE} --output json`],
  },
  add_database_migration: {
    resource: 'migrations',
    verb: 'add',
    examples: [
      `himring migrations add ${DATABASE} --name add_orders --sql-file 002_add_orders.sql`,
      `echo 'CREATE INDEX orders_by_day ON orders (day);' | himring migrations add ${DATABASE} --name orders_by_day --sql-file -`,
    ],
  },
  create_index: {
    resource: 'indexes',
    verb: 'create',
    examples: [
      'himring indexes create --name articles --config-file articles.json',
      'cat articles.json | himring indexes create --name articles --config-file -',
    ],
  },
  list_indexes: {
    resource: 'indexes',
    verb: 'list',
    examples: [
      'himring indexes list --search articles --created-from 2026-10-01 --created-to 2026-10-31',
      'himring indexes list --state deleted --sort purge_after --direction asc --output json',
    ],
  },
  get_index: {
    resource: 'indexes',
    verb: 'get',
    examples: [`himring indexes get ${INDEX}`, `himring indexes get ${INDEX} --output json`],
  },
  delete_index: {
    resource: 'indexes',
    verb: 'delete',
    confirm: true,
    examples: [`himring indexes delete ${INDEX} --yes`, `himring indexes delete ${INDEX} --dry-run`],
  },
  restore_index: {
    resource: 'indexes',
    verb: 'restore',
    examples: [`himring indexes restore ${INDEX}`, `himring indexes restore ${INDEX} --output json`],
  },
  download_index: {
    resource: 'indexes',
    verb: 'download',
    examples: [`himring indexes download ${INDEX}`, `himring indexes download ${INDEX} --out backup.nrsl --force`],
  },
  ...DATABASE_WORKSPACE_COMMANDS,
  ...INDEX_RECORD_COMMANDS,
  ...KNOWLEDGE_BASE_COMMANDS,
  ...QUESTION_SET_COMMANDS,
  ...FLAGGED_QUESTION_COMMANDS,
  ...SOURCE_COMMANDS,
  ...MEMORY_COMMANDS,
  ...MEMORY_REVIEW_COMMANDS,
} as const satisfies Partial<Record<HimringOperationId, CommandSpec>>
