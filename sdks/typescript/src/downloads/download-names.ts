const COMBINING_MARKS = /\p{M}+/gu
const UNSAFE_NAME_CHARACTERS = /[^A-Za-z0-9._-]+/g
const LEADING_PUNCTUATION = /^[._-]+/
const PATH_SEPARATORS = /[\\/]/
const SAFE_NAME_MAXIMUM_LENGTH = 200

export function safeDownloadName(name: string, fallback: string): string {
  const lastSegment = name.split(PATH_SEPARATORS).at(-1) ?? ''
  const safe = lastSegment
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .replace(UNSAFE_NAME_CHARACTERS, '_')
    .slice(-SAFE_NAME_MAXIMUM_LENGTH)
    .replace(LEADING_PUNCTUATION, '')
  return safe.length === 0 ? fallback : safe
}
