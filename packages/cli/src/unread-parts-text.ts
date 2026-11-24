import { formatClock } from '@himring/sdk'
import { isUnreadParts, type UnreadPart } from './spec-shapes.js'

export const UNREAD_PARTS_FIELD = 'unread_parts'
const EVERY_PART_READ = '-'

function stretchOf(part: UnreadPart): string {
  if (part.first_page !== null && part.last_page !== null) {
    return part.first_page === part.last_page ? `page ${part.first_page}` : `pages ${part.first_page}-${part.last_page}`
  }
  if (part.start_second !== null && part.end_second !== null) {
    return `${formatClock(part.start_second)}-${formatClock(part.end_second)}`
  }
  return 'whole file'
}

export function unreadPartsText(value: unknown): string | undefined {
  if (!isUnreadParts(value)) return undefined
  if (value.length === 0) return EVERY_PART_READ
  return value.map(stretchOf).join(', ')
}
