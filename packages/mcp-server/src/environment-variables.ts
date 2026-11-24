import * as v from 'valibot'

export const LONGEST_TIMER_DELAY_MS = 2_147_483_647

const HTTP_URL_SCHEMES: ReadonlySet<string> = new Set(['http:', 'https:'])
const CONTROL_CHARACTER_PATTERN = /\p{Cc}/u
const WHOLE_NUMBER_PATTERN = /^\d{1,16}$/

function isPlainHttpUrl(value: string): boolean {
  if (!URL.canParse(value)) return false
  const url = new URL(value)
  return (
    HTTP_URL_SCHEMES.has(url.protocol) &&
    url.username === '' &&
    url.password === '' &&
    url.search === '' &&
    url.hash === ''
  )
}

function hasNoControlCharacters(value: string): boolean {
  return !CONTROL_CHARACTER_PATTERN.test(value)
}

export function urlVariable(name: string, defaultUrl: string) {
  const refusal = `Set ${name} to an http or https URL with no user name, password, query, or fragment, such as ${defaultUrl}.`
  return v.optional(v.pipe(v.string(refusal), v.trim(), v.check(isPlainHttpUrl, refusal)), defaultUrl)
}

export function timerDelayVariable(name: string, defaultMs: number) {
  const refusal = `Set ${name} to a whole number of milliseconds from 1 to ${LONGEST_TIMER_DELAY_MS}.`
  return v.optional(
    v.pipe(
      v.string(refusal),
      v.trim(),
      v.regex(WHOLE_NUMBER_PATTERN, refusal),
      v.transform(Number),
      v.minValue(1, refusal),
      v.maxValue(LONGEST_TIMER_DELAY_MS, refusal),
    ),
    String(defaultMs),
  )
}

export function credentialVariable(name: string) {
  const refusal = `Set ${name} to the credential exactly as Himring issued it, with no line breaks or other control characters, or leave it unset.`
  return v.optional(v.pipe(v.string(refusal), v.trim(), v.nonEmpty(refusal), v.check(hasNoControlCharacters, refusal)))
}

export function absoluteDirectoryVariable(name: string, isAbsolute: (path: string) => boolean, example: string) {
  const refusal = `Use an absolute path for ${name}, such as ${example}.`
  return v.optional(v.pipe(v.string(refusal), v.check(isAbsolute, refusal)))
}

export function readEnvironment<const TSchema extends v.GenericSchema>(
  owner: string,
  schema: TSchema,
  environment: NodeJS.ProcessEnv,
): v.InferOutput<TSchema> {
  const result = v.safeParse(schema, environment)
  if (!result.success) {
    const sentences = [...new Set(result.issues.map(issue => issue.message))]
    throw new Error(`The environment of ${owner} is invalid. ${sentences.join(' ')}`)
  }
  return result.output
}
