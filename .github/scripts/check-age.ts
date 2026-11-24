import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const DAY_MS = 24 * 60 * 60 * 1000
const LOCKFILE = 'pnpm-lock.yaml'
const WORKSPACE_FILE = 'pnpm-workspace.yaml'
const REGISTRY_URL = 'https://registry.npmjs.org'
const REGISTRY_TIMEOUT_MS = 10_000
const GIT_OUTPUT_LIMIT_BYTES = 64 * 1024 * 1024
const LOCKFILE_PACKAGE_KEY = /^ {2}(['"]?)([^'"]+)\1:\s*$/
const LOCKFILE_TOP_LEVEL_KEY = /^[a-zA-Z][^:]*:\s*$/

interface LockedPackage {
  name: string
  version: string
}

interface AgeExclusion {
  namePattern: RegExp
  versions: ReadonlySet<string> | undefined
}

function positiveIntegerOf(value: string): number {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isSafeInteger(parsed) || parsed < 1 || String(parsed) !== value.trim()) {
    throw new Error('MIN_AGE_DAYS must be a positive integer.')
  }
  return parsed
}

function gitCommitExists(ref: string): boolean {
  try {
    execFileSync('git', ['cat-file', '-e', `${ref}^{commit}`], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function baseShaFromEvent(): string | undefined {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (eventPath === undefined || !existsSync(eventPath)) return undefined
  const event: unknown = JSON.parse(readFileSync(eventPath, 'utf8'))
  if (typeof event !== 'object' || event === null || !('pull_request' in event)) return undefined
  const pullRequest = event.pull_request
  if (typeof pullRequest !== 'object' || pullRequest === null || !('base' in pullRequest)) return undefined
  const base = pullRequest.base
  if (typeof base !== 'object' || base === null || !('sha' in base)) return undefined
  return typeof base.sha === 'string' ? base.sha : undefined
}

function resolveBaseRef(): string {
  const candidates = [
    process.env.BASE_SHA,
    baseShaFromEvent(),
    process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : undefined,
    'origin/main',
    'HEAD~1',
  ]
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate.length > 0 && gitCommitExists(candidate)) return candidate
  }
  throw new Error(`No base commit to compare ${LOCKFILE} against was found.`)
}

function fileAtRef(ref: string, path: string): string {
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], {
      encoding: 'utf8',
      maxBuffer: GIT_OUTPUT_LIMIT_BYTES,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return ''
  }
}

function packageOfKey(key: string): LockedPackage | undefined {
  const packageKey = key.split('(')[0] ?? ''
  const separator = packageKey.lastIndexOf('@')
  if (separator <= 0) return undefined
  const name = packageKey.slice(0, separator)
  const version = packageKey.slice(separator + 1)
  if (name.length === 0 || version.length === 0) return undefined
  if (version.startsWith('link:') || version.startsWith('workspace:')) return undefined
  return { name, version }
}

function packageKeyOf(locked: LockedPackage): string {
  return `${locked.name}@${locked.version}`
}

function lockedPackages(lockfile: string): Map<string, LockedPackage> {
  const packages = new Map<string, LockedPackage>()
  let inPackages = false
  for (const line of lockfile.split(/\r?\n/)) {
    if (line === 'packages:') {
      inPackages = true
      continue
    }
    if (!inPackages) continue
    if (LOCKFILE_TOP_LEVEL_KEY.test(line)) break
    const key = LOCKFILE_PACKAGE_KEY.exec(line)?.[2]
    const locked = key === undefined ? undefined : packageOfKey(key)
    if (locked !== undefined) packages.set(packageKeyOf(locked), locked)
  }
  return packages
}

function unquote(value: string): string {
  return value.trim().replace(/^(['"])(.*)\1$/, '$2')
}

function namePatternOf(name: string): RegExp {
  const escaped = name.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*')
  return new RegExp(`^${escaped}$`)
}

function exclusionOf(entry: string): AgeExclusion {
  const versionSeparator = entry.indexOf('@', 1)
  if (versionSeparator === -1) return { namePattern: namePatternOf(entry), versions: undefined }
  const versions = entry
    .slice(versionSeparator + 1)
    .split('||')
    .map(version => version.trim())
  return { namePattern: namePatternOf(entry.slice(0, versionSeparator)), versions: new Set(versions) }
}

function ageExclusions(workspace: string): AgeExclusion[] {
  const exclusions: AgeExclusion[] = []
  let inExclusions = false
  for (const line of workspace.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      inExclusions = line.trim() === 'minimumReleaseAgeExclude:'
      continue
    }
    const entry = inExclusions ? /^\s+-\s+(.+)$/.exec(line)?.[1] : undefined
    if (entry !== undefined) exclusions.push(exclusionOf(unquote(entry)))
  }
  return exclusions
}

function isExcluded(locked: LockedPackage, exclusions: readonly AgeExclusion[]): boolean {
  return exclusions.some(
    exclusion =>
      exclusion.namePattern.test(locked.name) &&
      (exclusion.versions === undefined || exclusion.versions.has(locked.version)),
  )
}

async function publishTimes(name: string, cache: Map<string, Record<string, unknown>>) {
  const cached = cache.get(name)
  if (cached !== undefined) return cached
  const response = await fetch(`${REGISTRY_URL}/${encodeURIComponent(name)}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(REGISTRY_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`the npm registry answered HTTP ${response.status} for ${name}`)
  const metadata: unknown = await response.json()
  const time = typeof metadata === 'object' && metadata !== null && 'time' in metadata ? metadata.time : undefined
  const times = typeof time === 'object' && time !== null ? Object.fromEntries(Object.entries(time)) : {}
  cache.set(name, times)
  return times
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function escapeAnnotationValue(value: string): string {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')
}

async function ageFailureOf(
  locked: LockedPackage,
  minimumPublishedAt: number,
  minimumAgeDays: number,
  cache: Map<string, Record<string, unknown>>,
): Promise<string | undefined> {
  const key = packageKeyOf(locked)
  let publishedAt: unknown
  try {
    publishedAt = (await publishTimes(locked.name, cache))[locked.version]
  } catch (error) {
    return `${key}: the npm metadata lookup failed: ${errorText(error)}`
  }
  if (typeof publishedAt !== 'string') return `${key}: the npm registry gave no publish time`
  const publishedTime = Date.parse(publishedAt)
  if (Number.isNaN(publishedTime)) return `${key}: the publish time ${publishedAt} is not a date`
  if (publishedTime <= minimumPublishedAt) return undefined
  const ageDays = Math.max(0, (Date.now() - publishedTime) / DAY_MS).toFixed(2)
  return `${key}: published ${ageDays} days ago, under the ${minimumAgeDays}-day minimum`
}

async function main(): Promise<void> {
  const minimumAgeDays = positiveIntegerOf(process.env.MIN_AGE_DAYS ?? '4')
  const minimumPublishedAt = Date.now() - minimumAgeDays * DAY_MS
  const baseRef = resolveBaseRef()
  const exclusions = ageExclusions(fileAtRef(baseRef, WORKSPACE_FILE))
  const basePackages = lockedPackages(fileAtRef(baseRef, LOCKFILE))
  const added = [...lockedPackages(readFileSync(LOCKFILE, 'utf8')).values()]
    .filter(locked => !basePackages.has(packageKeyOf(locked)))
    .sort((left, right) => packageKeyOf(left).localeCompare(packageKeyOf(right)))
  const checked = added.filter(locked => !isExcluded(locked, exclusions))
  if (checked.length === 0) {
    console.log(`The dependency age gate passed. ${LOCKFILE} adds no package versions that need an age check.`)
    return
  }
  console.log(`Checking ${checked.length} package versions that ${LOCKFILE} adds.`)
  const cache = new Map<string, Record<string, unknown>>()
  const failures: string[] = []
  for (const locked of checked) {
    const failure = await ageFailureOf(locked, minimumPublishedAt, minimumAgeDays, cache)
    if (failure !== undefined) failures.push(failure)
  }
  if (failures.length === 0) {
    console.log(`The dependency age gate passed. Every added version is at least ${minimumAgeDays} days old.`)
    return
  }
  console.error(`The dependency age gate failed on ${failures.length} package versions.`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
    console.error(`::error title=Dependency age gate failed::${escapeAnnotationValue(failure)}`)
  }
  process.exitCode = 1
}

try {
  await main()
} catch (error) {
  console.error(errorText(error))
  process.exitCode = 1
}
