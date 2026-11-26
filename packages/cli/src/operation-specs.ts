import type { HimringOperationId } from '@himring/sdk'
import { DATABASE_WORKSPACE_EXAMPLES, DATABASE_WORKSPACE_RESOURCE_DESCRIPTIONS } from './database-workspace-specs.js'
import { FLAGGED_QUESTION_EXAMPLES, FLAGGED_QUESTION_RESOURCE_DESCRIPTIONS } from './flagged-question-specs.js'
import { INDEX_RECORD_EXAMPLES, INDEX_RECORD_RESOURCE_DESCRIPTIONS } from './index-record-specs.js'
import { KNOWLEDGE_BASE_EXAMPLES, KNOWLEDGE_BASE_RESOURCE_DESCRIPTIONS } from './knowledge-base-specs.js'
import { MEMORY_REVIEW_EXAMPLES, MEMORY_REVIEW_RESOURCE_DESCRIPTIONS } from './memory-review-specs.js'
import { MEMORY_EXAMPLES, MEMORY_RESOURCE_DESCRIPTIONS } from './memory-specs.js'
import { QUESTION_SET_EXAMPLES, QUESTION_SET_RESOURCE_DESCRIPTIONS } from './question-set-specs.js'
import { SOURCE_EXAMPLES, SOURCE_RESOURCE_DESCRIPTIONS } from './source-specs.js'

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

export const OPERATION_EXAMPLES = {
  list_operations: ['himring operations list', 'himring operations list --output json'],
  get_session: ['himring auth session', 'himring auth session --output json'],
  create_project: [
    'himring projects create --name "Support answers"',
    'himring projects create --name Docs --output json',
  ],
  list_projects: [
    'himring projects list --search support --role owner',
    'himring projects list --state deleted --sort purge_after --direction asc --output json',
  ],
  get_project: [
    `himring projects get ${PROJECT}`,
    'HIMRING_PROJECT=prj_6d2f0c1e9a8b4c7d5e3f2a1b0c9d8e7f himring projects get',
  ],
  delete_project: [`himring projects delete ${PROJECT} --yes`, `himring projects delete ${PROJECT} --dry-run`],
  restore_project: [`himring projects restore ${PROJECT}`, `himring projects restore ${PROJECT} --output json`],
  list_members: [
    `himring members list ${PROJECT} --role owner`,
    'himring members list --search example.com --sort added_at --direction desc --limit 20 --output json',
  ],
  remove_member: [`himring members remove ${PROJECT} ${ACCOUNT} --yes`, `himring members remove ${ACCOUNT} --dry-run`],
  invite_member: [
    'himring invitations create --email teammate@example.com',
    'himring invitations create --email second-owner@example.com --role owner',
  ],
  list_invitations: [
    `himring invitations list ${PROJECT} --status expired`,
    'himring invitations list --role member --sort expires_at --direction asc --output json',
  ],
  revoke_invitation: [
    `himring invitations revoke ${INVITATION} --yes`,
    `himring invitations revoke ${INVITATION} --dry-run`,
  ],
  accept_invitation: [
    'himring invitations accept --token-file invitation.txt',
    'printf "%s" "$INVITATION_TOKEN" | himring invitations accept --token-file - --output json',
  ],
  create_api_key: [
    `printf '%s' '{"access":"full"}' | himring api-keys create --name CI --permissions-file -`,
    'himring api-keys create --name "Support agent" --permissions-file support-agent-permissions.json --output json',
  ],
  update_api_key: [
    `printf '%s' '{"access":"restricted","indexes":{"level":"read"}}' | himring api-keys update ${KEY} --permissions-file -`,
    `himring api-keys update ${KEY} --permissions-file read-only.json --output json`,
  ],
  list_api_key_permission_changes: [
    `himring api-keys permission-changes ${KEY}`,
    `himring api-keys permission-changes ${KEY} --limit 10 --output json`,
  ],
  list_api_keys: [
    `himring api-keys list ${PROJECT} --status active`,
    'himring api-keys list --search hmr_3f9a --created-from 2026-10-01 --output json',
  ],
  revoke_api_key: [`himring api-keys revoke ${KEY} --yes`, `himring api-keys revoke ${KEY} --dry-run`],
  create_database: [
    'himring databases create --name orders',
    'himring databases create --name orders --migrations-file migrations.json',
  ],
  list_databases: [
    'himring databases list --search orders --creator key --sort name --direction asc',
    'himring databases list --state deleted --sort purge_after --direction asc --limit 20 --offset 20 --output json',
  ],
  get_database: [`himring databases get ${DATABASE}`, `himring databases get ${DATABASE} --output json`],
  update_database: [
    `himring databases update ${DATABASE} --sql-write-preview true --yes`,
    `himring databases update ${DATABASE} --sql-write-preview false --dry-run`,
  ],
  delete_database: [`himring databases delete ${DATABASE} --yes`, `himring databases delete ${DATABASE} --dry-run`],
  restore_database: [`himring databases restore ${DATABASE}`, `himring databases restore ${DATABASE} --output json`],
  compact_database: [`himring databases compact ${DATABASE}`, `himring databases compact ${DATABASE} --output json`],
  list_database_migrations: [
    `himring migrations list ${DATABASE}`,
    `himring migrations list ${DATABASE} --output json`,
  ],
  add_database_migration: [
    `himring migrations add ${DATABASE} --name add_orders --sql-file 002_add_orders.sql`,
    `echo 'CREATE INDEX orders_by_day ON orders (day);' | himring migrations add ${DATABASE} --name orders_by_day --sql-file -`,
  ],
  create_index: [
    'himring indexes create --name articles --config-file articles.json',
    'cat articles.json | himring indexes create --name articles --config-file -',
  ],
  list_indexes: [
    'himring indexes list --search articles --created-from 2026-10-01 --created-to 2026-10-31',
    'himring indexes list --state deleted --sort purge_after --direction asc --output json',
  ],
  get_index: [`himring indexes get ${INDEX}`, `himring indexes get ${INDEX} --output json`],
  delete_index: [`himring indexes delete ${INDEX} --yes`, `himring indexes delete ${INDEX} --dry-run`],
  restore_index: [`himring indexes restore ${INDEX}`, `himring indexes restore ${INDEX} --output json`],
  download_index: [`himring indexes download ${INDEX}`, `himring indexes download ${INDEX} --out backup.nrsl --force`],
  ...DATABASE_WORKSPACE_EXAMPLES,
  ...INDEX_RECORD_EXAMPLES,
  ...KNOWLEDGE_BASE_EXAMPLES,
  ...QUESTION_SET_EXAMPLES,
  ...FLAGGED_QUESTION_EXAMPLES,
  ...SOURCE_EXAMPLES,
  ...MEMORY_EXAMPLES,
  ...MEMORY_REVIEW_EXAMPLES,
} as const satisfies Partial<Record<HimringOperationId, readonly string[]>>
