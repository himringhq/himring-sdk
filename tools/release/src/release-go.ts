import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  findLastTag,
  listScopedCommits,
  prependChangelogEntry,
  readTopEntry,
  renderChangelogEntry,
  tagExists,
  tagPointsAtHead,
} from './lib/git-history.ts'
import { assertCleanExcept } from './lib/git-tree.ts'
import { createGithubRelease } from './lib/github-release.ts'
import { projectOf, readReleaseOptions, today } from './lib/release-options.ts'
import { repositoryUrl, resolveRepositorySlug } from './lib/repo.ts'
import { run, tryRun } from './lib/run.ts'
import { resolveVersion } from './lib/version.ts'

interface GoModule {
  directory: string
  title: string
}

const GO_MODULES: Readonly<Record<string, GoModule>> = {
  'sdk-go': { directory: 'sdks/go', title: 'Go SDK' },
}

const VERSION_BEFORE_FIRST_RELEASE = '0.0.0'
const PUBLIC_GO_MODULE_PROXY = 'https://proxy.golang.org'
const PROXY_CHECK_DIRECTORY_PREFIX = 'himring-go-release-check-'
const PROXY_CHECK_MODULE = 'example.com/himring-release-check'
const MODULE_DIRECTIVE = /^module\s+(\S+)\s*$/m

function modulePathOf(directory: string): string {
  const [, path] = MODULE_DIRECTIVE.exec(readFileSync(join(directory, 'go.mod'), 'utf8')) ?? []
  if (path === undefined) throw new Error(`${directory}/go.mod has no module directive.`)
  return path
}

function tagPrefixOf(directory: string): string {
  return `${directory}/v`
}

function currentVersionOf(lastTag: string | undefined, directory: string, firstRelease: boolean): string {
  if (lastTag !== undefined) return lastTag.slice(tagPrefixOf(directory).length)
  if (!firstRelease) {
    throw new Error(`No ${tagPrefixOf(directory)} tag exists, so run the first release with --first-release.`)
  }
  return VERSION_BEFORE_FIRST_RELEASE
}

function stageReleaseFiles(files: readonly string[]): boolean {
  run('git', ['add', '--', ...files])
  return tryRun('git', ['diff', '--cached', '--quiet']).status === 1
}

function fetchThroughProxy(modulePath: string, version: string): void {
  const directory = mkdtempSync(join(tmpdir(), PROXY_CHECK_DIRECTORY_PREFIX))
  try {
    const environment = { ...process.env, GOPROXY: PUBLIC_GO_MODULE_PROXY, GOFLAGS: '', GOWORK: 'off' }
    run('go', ['mod', 'init', PROXY_CHECK_MODULE], { cwd: directory, env: environment })
    run('go', ['get', `${modulePath}@v${version}`], { cwd: directory, env: environment })
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

function main(): void {
  const options = readReleaseOptions(process.argv.slice(2))
  const goModule = projectOf(GO_MODULES, options.project)
  const prefix = tagPrefixOf(goModule.directory)
  const lastTag = findLastTag(prefix)
  const currentVersion = currentVersionOf(lastTag, goModule.directory, options.firstRelease)
  const version = resolveVersion(options.version, currentVersion, { allowPrerelease: false })
  const tag = `${prefix}${version}`
  if (tagExists(tag) && !tagPointsAtHead(tag)) {
    throw new Error(`The tag ${tag} exists on another commit, so this release would overwrite it.`)
  }
  const modulePath = modulePathOf(goModule.directory)
  const slug = resolveRepositorySlug()
  const fromTag = options.firstRelease ? undefined : lastTag
  const commits = listScopedCommits(fromTag, [goModule.directory])
  const entry = renderChangelogEntry({ version, date: today(), commits, repositoryUrl: repositoryUrl(slug) })
  if (options.dryRun) {
    process.stdout.write(`[dry-run] ${modulePath} ${currentVersion} to ${version}, tagged ${tag}\n`)
    process.stdout.write(`[dry-run] ${commits.length} commits touch ${goModule.directory}\n${entry}\n`)
    return
  }
  const changelogPath = join(goModule.directory, 'CHANGELOG.md')
  const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : ''
  const changelog = prependChangelogEntry(existing, entry, version)
  writeFileSync(changelogPath, changelog)
  assertCleanExcept([changelogPath])
  if (stageReleaseFiles([changelogPath])) run('git', ['commit', '-m', `chore(release): ${options.project} ${version}`])
  if (!tagExists(tag)) run('git', ['tag', '-a', tag, '-m', `${options.project} ${version}`])
  run('git', ['push', 'origin', 'HEAD'])
  run('git', ['push', 'origin', tag])
  const notes = readTopEntry(changelog) ?? entry
  const result = createGithubRelease({ tag, title: `${goModule.title} ${version}`, notes, repository: slug })
  process.stdout.write(
    result.created ? `Created the GitHub release for ${tag}\n` : `The GitHub release for ${tag} exists already\n`,
  )
  fetchThroughProxy(modulePath, version)
  process.stdout.write(`go get ${modulePath}@v${version} resolves through ${PUBLIC_GO_MODULE_PROXY}\n`)
}

try {
  main()
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}
