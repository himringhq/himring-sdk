import { HIMRING_OPERATIONS, type HimringKeyPermissionNeed, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import type { ToolAnnotations } from '@modelcontextprotocol/server'
import { isRecord } from './tool-schema.js'

export const DESTRUCTIVE_OPERATIONS: ReadonlySet<string> = new Set<HimringOperationId>([
  'delete_project',
  'remove_member',
  'revoke_invitation',
  'revoke_api_key',
  'update_api_key',
  'update_database',
  'delete_database',
  'update_table_row',
  'delete_table_rows',
  'run_database_sql',
  'delete_saved_query',
  'change_table_columns',
  'delete_index',
  'update_index',
  'save_index_record',
  'delete_index_record',
  'update_knowledge_base',
  'delete_knowledge_base',
  'delete_file',
  'erase_end_user',
  'delete_saved_question',
  'dismiss_flagged_question',
  'promote_correction',
  'discard_correction',
  'update_source',
  'delete_source',
  'update_memory',
  'delete_memory',
  'promote_memory',
  'settle_memory_review',
  'update_memory_source',
  'delete_memory_source',
  'settle_memory',
  'forget_memory',
  'set_memory_webhook',
  'remove_memory_webhook',
  'undo_learned_change',
  'delete_memory_saved_question',
])

const ACCESS_SENTENCES: ReadonlyMap<string, string> = new Map([
  ['public', 'Needs no credential.'],
  ['session', 'Needs a session token in HIMRING_SESSION_TOKEN.'],
  ['account', 'Needs the session of an approved account in HIMRING_SESSION_TOKEN.'],
  ['project_member', 'Needs the session of a member of the project in HIMRING_SESSION_TOKEN.'],
  ['project_owner', 'Needs the session of an owner of the project in HIMRING_SESSION_TOKEN.'],
  [
    'project',
    'Needs an API key of the project in HIMRING_API_KEY, or the session of a member in HIMRING_SESSION_TOKEN.',
  ],
])

const KEY_RESOURCE_NOUNS: ReadonlyMap<string, { one: string; many: string }> = new Map([
  ['databases', { one: 'database', many: 'databases' }],
  ['indexes', { one: 'index', many: 'indexes' }],
  ['knowledge_bases', { one: 'knowledge base', many: 'knowledge bases' }],
  ['memory', { one: 'Memory', many: 'Memory' }],
])

function nounsOf(resourceKind: string): { one: string; many: string } {
  const spoken = resourceKind.replaceAll('_', ' ')
  return KEY_RESOURCE_NOUNS.get(resourceKind) ?? { one: spoken, many: spoken }
}

function keyNeedText(need: HimringKeyPermissionNeed): string {
  const nouns = nounsOf(need.resource_kind)
  const place =
    need.target === 'resource' && need.resource_id_field !== null
      ? `the ${nouns.one} in ${need.resource_id_field}`
      : need.target === 'every'
        ? `every ${nouns.one} of the project`
        : nouns.many
  const condition = need.only_with_field === null ? '' : ` when it sends ${need.only_with_field}`
  return `${need.level} on ${place}${condition}`
}

function keyPermissionSentenceOf(id: HimringOperationId): string {
  const entry = HIMRING_OPERATION_CATALOGUE[id]
  if (entry.access !== 'project') return ''
  const needs = entry.keyPermissions
  if (needs === null) return 'An API key cannot call it.'
  if (needs.length === 0) return 'An API key of the project needs no further permission.'
  return `An API key needs ${needs.map(keyNeedText).join(', and ')}.`
}

export function accessSentencesOf(id: HimringOperationId): string {
  const access = ACCESS_SENTENCES.get(HIMRING_OPERATION_CATALOGUE[id].access) ?? ''
  return [access, keyPermissionSentenceOf(id)].filter(part => part.length > 0).join(' ')
}

export function descriptionOf(id: HimringOperationId, ...extra: readonly string[]): string {
  return [HIMRING_OPERATION_CATALOGUE[id].summary, accessSentencesOf(id), ...extra]
    .filter(part => part.length > 0)
    .join(' ')
}

export function pagingSentenceOf(id: HimringOperationId): string {
  const properties = HIMRING_OPERATION_CATALOGUE[id].inputSchema.properties
  if (!isRecord(properties) || !Object.hasOwn(properties, 'offset') || !Object.hasOwn(properties, 'limit')) return ''
  return 'Each call returns one page and the total_count of every matching record; add limit to offset to read the next page.'
}

export function annotationsOf(id: HimringOperationId): ToolAnnotations {
  const entry = HIMRING_OPERATION_CATALOGUE[id]
  return {
    title: entry.summary,
    readOnlyHint: !entry.changesState,
    destructiveHint: DESTRUCTIVE_OPERATIONS.has(id),
    idempotentHint: !entry.changesState || HIMRING_OPERATIONS[id].method === 'DELETE',
    openWorldHint: false,
  }
}
