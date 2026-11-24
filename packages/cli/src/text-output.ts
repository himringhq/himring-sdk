import { citationText } from '@himring/sdk'
import { isCitation, isPassageMatch } from './spec-shapes.js'
import {
  displayWidth,
  isRecord,
  isScalar,
  type JsonRecord,
  labelOf,
  nounOf,
  padEnd,
  printable,
  scalarText,
} from './text-cells.js'
import { columnsFor, tableLines } from './text-table.js'
import { UNREAD_PARTS_FIELD, unreadPartsText } from './unread-parts-text.js'

const LABEL_GAP = '  '
const NESTED_INDENT = '  '
const COMPACT_JSON_LIMIT = 80
const CITATION_FIELDS: ReadonlySet<string> = new Set(['citation', 'match_citation'])
const MATCH_FIELD = 'match'
const SECTION_FIELDS: ReadonlySet<string> = new Set(['account', 'api_key', 'invitation', 'session'])

interface ListPayload {
  listKey: string
  records: JsonRecord[]
  extras: JsonRecord
}

function isRecordList(value: unknown): value is JsonRecord[] {
  return Array.isArray(value) && value.every(isRecord)
}

function isSection(field: string, value: unknown): boolean {
  return SECTION_FIELDS.has(field) && isRecord(value)
}

function jsonLines(value: unknown): string[] {
  const compact = JSON.stringify(value) ?? String(value)
  const text = displayWidth(compact) <= COMPACT_JSON_LIMIT ? compact : JSON.stringify(value, null, 2)
  return printable(text, true).split('\n')
}

function valueLines(value: unknown): string[] {
  if (isScalar(value)) return scalarText(value, true).split('\n')
  if (Array.isArray(value) && value.every(isScalar)) {
    return value.length === 0 ? ['-'] : value.map(item => scalarText(item, false))
  }
  return jsonLines(value)
}

function fieldLines(label: string, value: unknown, labelWidth: number, indent: string): string[] {
  const prefix = `${indent}${padEnd(label, labelWidth)}${LABEL_GAP}`
  const continuation = ' '.repeat(displayWidth(prefix))
  return valueLines(value).map((line, position) => `${position === 0 ? prefix : continuation}${line}`.trimEnd())
}

function readableCitation(value: unknown): unknown {
  if (!isCitation(value)) return value
  const text = citationText(value)
  return value.kind === 'web_page' && value.address !== null ? `${text}, at ${value.address}` : text
}

function readableValue(field: string, value: unknown): unknown {
  if (CITATION_FIELDS.has(field)) return readableCitation(value)
  if (field === UNREAD_PARTS_FIELD) return unreadPartsText(value) ?? value
  if (field !== MATCH_FIELD) return value
  return isPassageMatch(value) ? readableCitation(value.citation) : value
}

function blockLines(record: JsonRecord, indent: string): string[] {
  const entries = Object.entries(record)
  const inline = entries.filter(([field, value]) => !isSection(field, value))
  const labelWidth = Math.max(0, ...inline.map(([field]) => displayWidth(labelOf(field))))
  const lines = inline.flatMap(([field, value]) =>
    fieldLines(labelOf(field), readableValue(field, value), labelWidth, indent),
  )
  for (const [field, value] of entries) {
    if (!isSection(field, value) || !isRecord(value)) continue
    if (lines.length > 0) lines.push('')
    lines.push(`${indent}${labelOf(field)}`, ...blockLines(value, `${indent}${NESTED_INDENT}`))
  }
  return lines
}

function listPayloadOf(data: JsonRecord): ListPayload | undefined {
  const lists = Object.entries(data).filter(([, value]) => Array.isArray(value))
  const only = lists.length === 1 ? lists[0] : undefined
  if (only === undefined) return undefined
  const [listKey, records] = only
  if (!isRecordList(records)) return undefined
  const extras = Object.fromEntries(Object.entries(data).filter(([field]) => field !== listKey))
  if (!Object.values(extras).every(isScalar)) return undefined
  return { listKey, records, extras }
}

function separateBlocks(records: readonly JsonRecord[]): string[] {
  return records.flatMap((record, position) => [...(position === 0 ? [] : ['']), ...blockLines(record, '')])
}

interface PageWindow {
  totalCount: number
  limit: number
  offset: number
}

function pageWindowOf(extras: JsonRecord): PageWindow | undefined {
  const { total_count: totalCount, limit, offset } = extras
  if (typeof totalCount !== 'number' || typeof limit !== 'number' || typeof offset !== 'number') return undefined
  return { totalCount, limit, offset }
}

function pageSentence(noun: string, shown: number, page: PageWindow): string {
  if (shown === 0) {
    return `No ${noun} on this page. The list holds ${page.totalCount}, and the offset ${page.offset} passes its end.`
  }
  const last = page.offset + shown
  const showing = `Showing ${page.offset + 1}–${last} of ${page.totalCount} ${noun}.`
  return last < page.totalCount ? `${showing} Pass --offset ${last} for the next page.` : showing
}

function recordLines(listKey: string, records: readonly JsonRecord[]): string[] {
  const columns = columnsFor(listKey, records)
  if (records.length === 0) return [`No ${nounOf(listKey)}.`]
  return columns.length === 0 ? separateBlocks(records) : tableLines(columns, records)
}

function listLines({ listKey, records, extras }: ListPayload): string[] {
  const page = pageWindowOf(extras)
  if (page !== undefined) {
    if (page.totalCount === 0) return [`No ${nounOf(listKey)}.`]
    const body = records.length === 0 ? [] : [...recordLines(listKey, records), '']
    return [...body, pageSentence(nounOf(listKey), records.length, page)]
  }
  const body = recordLines(listKey, records)
  return Object.keys(extras).length === 0 ? body : [...body, '', ...blockLines(extras, '')]
}

function textLinesOf(data: unknown): string[] {
  if (isScalar(data)) return scalarText(data, true).split('\n')
  if (isRecordList(data)) return listLines({ listKey: 'items', records: data, extras: {} })
  if (!isRecord(data)) return valueLines(data)
  const list = listPayloadOf(data)
  if (list !== undefined) return listLines(list)
  const entries = Object.entries(data)
  const wrapped = entries.length === 1 ? entries[0] : undefined
  if (wrapped !== undefined && isSection(wrapped[0], wrapped[1]) && isRecord(wrapped[1])) {
    return blockLines(wrapped[1], '')
  }
  return blockLines(data, '')
}

export function formatText(data: unknown): string {
  const lines = textLinesOf(data)
  return lines.length === 0 ? '' : `${lines.join('\n')}\n`
}
