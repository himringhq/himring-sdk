import type { SearchKnowledgeBaseOutput } from '../generated/types.js'

export type Citation = SearchKnowledgeBaseOutput['passages'][number]['citation']

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const TEXT_LOCALE = 'en-US'

function twoDigits(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatClock(totalSeconds: number): string {
  const whole = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0
  const hours = Math.floor(whole / SECONDS_PER_HOUR)
  const minutes = Math.floor((whole % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const seconds = whole % SECONDS_PER_MINUTE
  return hours > 0 ? `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}` : `${minutes}:${twoDigits(seconds)}`
}

function numberRanges(numbers: readonly number[]): string {
  const sorted = [...new Set(numbers)].toSorted((left, right) => left - right)
  const runs: [number, number][] = []
  for (const value of sorted) {
    const last = runs.at(-1)
    if (last !== undefined && value === last[1] + 1) last[1] = value
    else runs.push([value, value])
  }
  return runs.map(([start, end]) => (start === end ? String(start) : `${start}–${end}`)).join(', ')
}

function numbered(numbers: readonly number[], one: string, many: string): string {
  if (numbers.length === 0) return `No ${one.toLocaleLowerCase(TEXT_LOCALE)} number`
  return `${new Set(numbers).size === 1 ? one : many} ${numberRanges(numbers)}`
}

function spreadsheetText(sheet: string | null, firstRow: number, lastRow: number): string {
  const rows = firstRow === lastRow ? `row ${firstRow}` : `rows ${firstRow}–${lastRow}`
  return sheet === null ? `${rows.charAt(0).toLocaleUpperCase(TEXT_LOCALE)}${rows.slice(1)}` : `Sheet ${sheet}, ${rows}`
}

export function citationText(citation: Citation): string {
  switch (citation.kind) {
    case 'document':
      return numbered(citation.pages, 'Page', 'Pages')
    case 'spreadsheet':
      return spreadsheetText(citation.sheet, citation.first_row, citation.last_row)
    case 'slides':
      return numbered(citation.slides, 'Slide', 'Slides')
    case 'web_page':
      return citation.heading === null ? 'Web page' : `Web page, section ${citation.heading}`
    case 'image':
      return citation.areas.length === 0 ? 'Whole image' : 'Part of the image'
    case 'recording': {
      const span = `From ${formatClock(citation.start_second)} to ${formatClock(citation.end_second)}`
      return citation.frame === null ? span : `${span}, frame ${citation.frame}`
    }
    default:
      return 'Part of the file'
  }
}
