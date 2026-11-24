import { run, tryRun } from './run.ts'

const GIT_FIELD_SEPARATOR_PLACEHOLDER = '%x00'
const GIT_FIELD_SEPARATOR = '\u0000'
const CONVENTIONAL_HEADER = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/
const RELEASE_COMMIT = /^chore\(release\):/
const SUBJECT_LENGTH_LIMIT = 200
const MARKDOWN_METACHARACTERS = /[\\`*_{}[\]()#+.!<>|~]/g
const TAG_REFERENCE = /^[\w./@-]+$/
const TAGGED_VERSION = /^\d+\.\d+\.\d+(?:-[\w.-]+)?$/
const LAST_C0_CONTROL_CODE_POINT = 0x1f
const FIRST_DELETE_OR_C1_CODE_POINT = 0x7f
const LAST_C1_CONTROL_CODE_POINT = 0x9f

const SECTIONS = [
  { key: 'feat', title: 'Features' },
  { key: 'fix', title: 'Fixes' },
  { key: 'perf', title: 'Performance' },
  { key: 'refactor', title: 'Refactors' },
  { key: 'docs', title: 'Documentation' },
  { key: 'other', title: 'Other changes' },
] as const

type SectionKey = (typeof SECTIONS)[number]['key']

const SECTION_OF_TYPE: ReadonlyMap<string, SectionKey> = new Map([
  ['feat', 'feat'],
  ['fix', 'fix'],
  ['perf', 'perf'],
  ['refactor', 'refactor'],
  ['docs', 'docs'],
])

export interface Commit {
  hash: string
  shortHash: string
  subject: string
}

interface ClassifiedSubject {
  section: SectionKey
  scope: string | undefined
  description: string
}

function isControlCharacter(character: string): boolean {
  const codePoint = character.codePointAt(0) ?? 0
  return (
    codePoint <= LAST_C0_CONTROL_CODE_POINT ||
    (codePoint >= FIRST_DELETE_OR_C1_CODE_POINT && codePoint <= LAST_C1_CONTROL_CODE_POINT)
  )
}

function withoutControlCharacters(value: string): string {
  return [...value].filter(character => !isControlCharacter(character)).join('')
}

export function tagExists(tag: string): boolean {
  return tryRun('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`]).ok
}

export function tagPointsAtHead(tag: string): boolean {
  const tagged = tryRun('git', ['rev-list', '-n', '1', tag])
  const head = tryRun('git', ['rev-parse', 'HEAD'])
  return tagged.ok && head.ok && tagged.stdout === head.stdout
}

export function findLastTag(tagPrefix: string): string | undefined {
  const listed = tryRun('git', ['tag', '--list', `${tagPrefix}*`, '--sort=-v:refname'])
  if (!listed.ok) return undefined
  const [newest] = listed.stdout.split('\n').filter(line => line.length > 0)
  if (newest === undefined) return undefined
  const taggedVersion = newest.slice(tagPrefix.length)
  if (!TAG_REFERENCE.test(newest) || !newest.startsWith(tagPrefix) || !TAGGED_VERSION.test(taggedVersion)) {
    throw new Error(`The newest tag ${newest} is not ${tagPrefix} followed by a version.`)
  }
  return newest
}

function commitOf(record: string): Commit | undefined {
  const [hash, shortHash, rawSubject] = record.split(GIT_FIELD_SEPARATOR).map(field => field.trim())
  if (hash === undefined || shortHash === undefined || rawSubject === undefined) return undefined
  const subject = withoutControlCharacters(rawSubject).trim().slice(0, SUBJECT_LENGTH_LIMIT)
  if (hash.length === 0 || shortHash.length === 0 || subject.length === 0) return undefined
  return { hash, shortHash, subject }
}

export function listScopedCommits(fromTag: string | undefined, paths: readonly string[]): Commit[] {
  if (paths.length === 0) throw new Error('Listing the commits of a release needs at least one path.')
  const range = fromTag === undefined ? 'HEAD' : `${fromTag}..HEAD`
  const format = ['%H', '%h', '%s'].join(GIT_FIELD_SEPARATOR_PLACEHOLDER)
  const output = run('git', ['log', range, `--format=${format}`, '--no-merges', '--', ...paths])
  return output
    .split('\n')
    .map(commitOf)
    .filter((commit): commit is Commit => commit !== undefined && !RELEASE_COMMIT.test(commit.subject))
}

function classify(subject: string): ClassifiedSubject {
  const [, type, scope, , description] = CONVENTIONAL_HEADER.exec(subject) ?? []
  if (type === undefined || description === undefined) {
    return { section: 'other', scope: undefined, description: subject }
  }
  return { section: SECTION_OF_TYPE.get(type.toLowerCase()) ?? 'other', scope, description }
}

function escapeMarkdown(value: string): string {
  return withoutControlCharacters(value).replace(MARKDOWN_METACHARACTERS, character => `\\${character}`)
}

function entryLine(commit: Commit, repositoryUrl: string): string {
  const { scope, description } = classify(commit.subject)
  const prefix = scope === undefined ? '' : `**${escapeMarkdown(scope)}:** `
  return `- ${prefix}${escapeMarkdown(description)} ([${commit.shortHash}](${repositoryUrl}/commit/${commit.hash}))`
}

export interface ChangelogEntryInput {
  version: string
  date: string
  commits: readonly Commit[]
  repositoryUrl: string
}

export function renderChangelogEntry(input: ChangelogEntryInput): string {
  const lines = [`## ${input.version} (${input.date})`]
  if (input.commits.length === 0) {
    lines.push('', 'This release records no changes to the package.')
    return `${lines.join('\n')}\n`
  }
  for (const section of SECTIONS) {
    const commits = input.commits.filter(commit => classify(commit.subject).section === section.key)
    if (commits.length === 0) continue
    lines.push('', `### ${section.title}`, '')
    lines.push(...commits.map(commit => entryLine(commit, input.repositoryUrl)))
  }
  return `${lines.join('\n')}\n`
}

function topEntryStart(contents: string): number | undefined {
  if (contents.startsWith('## ')) return 0
  const heading = contents.indexOf('\n## ')
  return heading === -1 ? undefined : heading + 1
}

export function readTopEntry(contents: string): string | undefined {
  const start = topEntryStart(contents)
  if (start === undefined) return undefined
  const next = contents.indexOf('\n## ', start)
  const block = next === -1 ? contents.slice(start) : contents.slice(start, next + 1)
  return block.trimEnd()
}

export function isTopEntryFor(contents: string, version: string): boolean {
  return readTopEntry(contents)?.startsWith(`## ${version} (`) === true
}

export function prependChangelogEntry(existing: string, entry: string, version: string): string {
  if (isTopEntryFor(existing, version)) return existing
  const trimmed = existing.trimStart()
  return trimmed.length === 0 ? entry : `${entry}\n${trimmed}`
}
