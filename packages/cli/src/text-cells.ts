export type Scalar = string | number | boolean | null | undefined

export type JsonRecord = Record<string, unknown>

const ACRONYMS: ReadonlyMap<string, string> = new Map([
  ['id', 'ID'],
  ['ids', 'IDs'],
  ['url', 'URL'],
  ['uri', 'URI'],
  ['api', 'API'],
  ['totp', 'TOTP'],
  ['sql', 'SQL'],
])

const LABEL_OVERRIDES: ReadonlyMap<string, string> = new Map([
  ['is_operator', 'Operator'],
  ['duration_ms', 'Search time (ms)'],
  ['match', 'Matched part'],
  ['match_citation', 'Matched part'],
])

const WIDE_CHARACTER =
  /\p{Emoji_Presentation}|\u{FE0F}|[\u{1100}-\u{115F}\u{2E80}-\u{303E}\u{3041}-\u{33FF}\u{3400}-\u{4DBF}\u{4E00}-\u{9FFF}\u{A000}-\u{A4CF}\u{AC00}-\u{D7A3}\u{F900}-\u{FAFF}\u{FE30}-\u{FE4F}\u{FF00}-\u{FF60}\u{FFE0}-\u{FFE6}\u{20000}-\u{3FFFD}]/u
const ZERO_WIDTH_GRAPHEME = /^\p{Default_Ignorable_Code_Point}+$/u
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isScalar(value: unknown): value is Scalar {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

function wordsOf(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(word => word.length > 0)
    .map(word => ACRONYMS.get(word.toLowerCase()) ?? word.toLowerCase())
}

export function nounOf(key: string): string {
  const words = wordsOf(key)
  return words.length === 0 ? 'items' : printable(words.join(' '), false)
}

export function labelOf(key: string): string {
  const override = LABEL_OVERRIDES.get(key)
  if (override !== undefined) return override
  const words = wordsOf(key)
  if (words.length === 0) return printable(key, false)
  const sentence = words.join(' ')
  return printable(`${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}`, false)
}

function isHiddenFromTerminal(codePoint: number): boolean {
  return (
    codePoint < 0x20 ||
    (codePoint >= 0x7f && codePoint < 0xa0) ||
    (codePoint >= 0x202a && codePoint <= 0x202e) ||
    (codePoint >= 0x2066 && codePoint <= 0x2069)
  )
}

export function printable(text: string, keepLineBreaks: boolean): string {
  const source = keepLineBreaks ? text.replace(/\r\n/g, '\n') : text
  let result = ''
  for (const character of source) {
    const codePoint = character.codePointAt(0) ?? 0
    if (keepLineBreaks && (character === '\n' || character === '\t')) result += character
    else if (isHiddenFromTerminal(codePoint)) result += `\\u${codePoint.toString(16).padStart(4, '0')}`
    else result += character
  }
  return result
}

export function scalarText(value: Scalar, keepLineBreaks: boolean): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'number') return String(value)
  if (value.length === 0) return '""'
  return printable(value, keepLineBreaks)
}

export function cellText(value: unknown): string {
  if (isScalar(value)) return scalarText(value, false)
  return printable(JSON.stringify(value), false)
}

export function displayWidth(text: string): number {
  let width = 0
  for (const { segment } of graphemes.segment(text)) {
    if (ZERO_WIDTH_GRAPHEME.test(segment)) continue
    width += WIDE_CHARACTER.test(segment) ? 2 : 1
  }
  return width
}

export function padEnd(text: string, width: number): string {
  return `${text}${' '.repeat(Math.max(0, width - displayWidth(text)))}`
}
