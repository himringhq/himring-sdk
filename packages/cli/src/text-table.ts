import { KEY_PERMISSION_FIELDS, keyPermissionsText } from './key-permissions-text.js'
import { cellText, displayWidth, isScalar, type JsonRecord, labelOf, padEnd } from './text-cells.js'
import { UNREAD_PARTS_FIELD, unreadPartsText } from './unread-parts-text.js'

const COLUMN_GAP = '  '

const COLUMN_PREFERENCES: Readonly<Record<string, readonly string[]>> = {
  projects: ['id', 'name', 'role', 'region', 'created_at', 'deleted_at', 'purge_after'],
  members: ['account_id', 'name', 'email', 'role', 'added_at'],
  invitations: ['id', 'email', 'role', 'created_at', 'expires_at', 'accepted_at', 'revoked_at'],
  api_keys: [
    'id',
    'name',
    'display_prefix',
    'permissions',
    'created_by_name',
    'created_at',
    'expires_at',
    'last_used_at',
    'revoked_at',
  ],
  changes: ['changed_at', 'changed_by_name', 'permissions_before', 'permissions_after'],
  databases: ['id', 'name', 'migration_version', 'created_at', 'deleted_at', 'purge_after'],
  migrations: ['version', 'name', 'added_at'],
  indexes: ['id', 'name', 'created_at', 'deleted_at', 'purge_after'],
  operations: ['id', 'method', 'path', 'access'],
  knowledge_bases: ['id', 'name', 'language', 'chunk_tokens', 'created_at', 'deleted_at', 'purge_after'],
  files: [
    'id',
    'path',
    'kind',
    'status',
    UNREAD_PARTS_FIELD,
    'current_version',
    'size_bytes',
    'updated_at',
    'deleted_at',
    'purge_after',
  ],
  versions: [
    'version',
    'status',
    UNREAD_PARTS_FIELD,
    'size_bytes',
    'page_count',
    'ocr_page_count',
    'received_at',
    'processed_at',
  ],
  entries: ['type', 'name', 'file_count', 'ready_count', 'failed_count', 'size_bytes', 'updated_at'],
  blocks: ['position', 'kind', 'text'],
  questions: ['id', 'asked_at', 'end_user_id', 'question'],
  passages: [],
  uploads: ['path', 'outcome', 'size_bytes', 'file_id', 'detail'],
}

function cellOf(column: string, value: unknown): string {
  if (KEY_PERMISSION_FIELDS.has(column)) return keyPermissionsText(value) ?? cellText(value)
  if (column !== UNREAD_PARTS_FIELD) return cellText(value)
  return unreadPartsText(value) ?? cellText(value)
}

function scalarFieldsOf(records: readonly JsonRecord[]): string[] {
  const fields: string[] = []
  for (const record of records) {
    for (const field of Object.keys(record)) if (!fields.includes(field)) fields.push(field)
  }
  return fields.filter(field => records.every(record => isScalar(record[field])))
}

function hasValue(records: readonly JsonRecord[], field: string): boolean {
  return records.some(record => record[field] !== null && record[field] !== undefined)
}

export function columnsFor(listKey: string, records: readonly JsonRecord[]): string[] {
  const preferred = Object.hasOwn(COLUMN_PREFERENCES, listKey) ? COLUMN_PREFERENCES[listKey] : undefined
  const candidates = preferred ?? scalarFieldsOf(records)
  return candidates.filter(field => hasValue(records, field))
}

export function tableLines(columns: readonly string[], records: readonly JsonRecord[]): string[] {
  const rows = [
    columns.map(column => labelOf(column).toUpperCase()),
    ...records.map(record => columns.map(column => cellOf(column, record[column]))),
  ]
  const widths = columns.map((_, position) => Math.max(...rows.map(row => displayWidth(row[position] ?? ''))))
  return rows.map(row =>
    row
      .map((cell, position) => (position === row.length - 1 ? cell : padEnd(cell, widths[position] ?? 0)))
      .join(COLUMN_GAP),
  )
}
