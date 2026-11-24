const HTTP_URL_SCHEMES: ReadonlySet<string> = new Set(['http:', 'https:'])
const WHOLE_NUMBER_TEXT = /^\d+$/

export function httpUrlOf(text: string): string | undefined {
  const trimmed = text.trim()
  if (!URL.canParse(trimmed)) return undefined
  const url = new URL(trimmed)
  if (!HTTP_URL_SCHEMES.has(url.protocol)) return undefined
  if (url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '') return undefined
  return trimmed
}

export function wholeNumberInRangeOf(text: string, smallest: number, largest: number): number | undefined {
  const trimmed = text.trim()
  if (!WHOLE_NUMBER_TEXT.test(trimmed)) return undefined
  const value = Number(trimmed)
  return Number.isSafeInteger(value) && value >= smallest && value <= largest ? value : undefined
}

export function nonEmptyText(value: string | undefined): string | undefined {
  return value !== undefined && value.length > 0 ? value : undefined
}
