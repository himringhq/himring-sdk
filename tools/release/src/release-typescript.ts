import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  type Commit,
  findLastTag,
  isTopEntryFor,
  listScopedCommits,
  prependChangelogEntry,
  readTopEntry,
  renderChangelogEntry,
  tagExists,
} from './lib/git-history.ts'
import { assertCleanExcept } from './lib/git-tree.ts'
import { createGithubRelease } from './lib/github-release.ts'
import { isPublishedOnNpm, readNpmManifest, workspaceDependenciesOf } from './lib/npm-manifest.ts'
import { projectOf, type ReleaseOptions, readReleaseOptions, today } from './lib/release-options.ts'
import { repositoryUrl, resolveRepositorySlug } from './lib/repo.ts'
import { run } from './lib/run.ts'
import { resolveVersion } from './lib/version.ts'

interface TypescriptProject {
  directory: string
  title: string
}

const TYPESCRIPT_PROJECTS: Readonly<Record<string, TypescriptProject>> = {
  'sdk-typescript': { directory: 'sdks/typescript', title: 'TypeScript SDK' },
  cli: { directory: 'packages/cli', title: 'Himring CLI' },
  'mcp-server': { directory: 'packages/mcp-server', title: 'Himring MCP server' },
}

interface ReleaseNotes {
  fromTag: string | undefined
  commits: readonly Commit[]
  entry: string
}

function manifestVersion(directory: string): string {
  return readNpmManifest(directory).version
}

function tagPrefixOf(projectName: string): string {
  return `${projectName}@v`
}

function checkWorkspaceDependencies(projectName: string, project: TypescriptProject, options: ReleaseOptions): void {
  const workspaceVersions = new Map(
    Object.values(TYPESCRIPT_PROJECTS).map(({ directory }) => {
      const manifest = readNpmManifest(directory)
      return [manifest.name, manifest.version] as const
    }),
  )
  for (const name of workspaceDependenciesOf(readNpmManifest(project.directory))) {
    const version = workspaceVersions.get(name)
    if (version === undefined) throw new Error(`${projectName} depends on ${name}, which no project here releases.`)
    if (isPublishedOnNpm(name, version)) continue
    const message = `${projectName} depends on ${name}@${version}, which is not on npm yet, so release ${name} first.`
    if (!options.dryRun) throw new Error(message)
    process.stdout.write(`[dry-run] ${message}\n`)
  }
}

function releaseNotes(projectName: string, project: TypescriptProject, version: string, firstRelease: boolean) {
  const fromTag = firstRelease ? undefined : findLastTag(tagPrefixOf(projectName))
  const commits = listScopedCommits(fromTag, [project.directory])
  const entry = renderChangelogEntry({
    version,
    date: today(),
    commits,
    repositoryUrl: repositoryUrl(resolveRepositorySlug()),
  })
  const notes: ReleaseNotes = { fromTag, commits, entry }
  return notes
}

function writeNotes(projectName: string, project: TypescriptProject, options: ReleaseOptions): void {
  const version = resolveVersion(options.version, manifestVersion(project.directory), { allowPrerelease: true })
  const { fromTag, commits, entry } = releaseNotes(projectName, project, version, options.firstRelease)
  const changelogPath = join(project.directory, 'CHANGELOG.md')
  if (options.dryRun) {
    process.stdout.write(`[dry-run] ${projectName} ${version}, commits since ${fromTag ?? 'the first commit'}\n`)
    process.stdout.write(`[dry-run] ${commits.length} commits touch ${project.directory}\n${entry}\n`)
    return
  }
  const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : ''
  writeFileSync(changelogPath, prependChangelogEntry(existing, entry, version))
  run('git', ['add', '--', changelogPath])
  assertCleanExcept([changelogPath])
  process.stdout.write(`Wrote and staged ${changelogPath} for ${projectName} ${version}\n`)
}

function publishGithubRelease(projectName: string, project: TypescriptProject, options: ReleaseOptions): void {
  const version = manifestVersion(project.directory)
  const tag = `${tagPrefixOf(projectName)}${version}`
  if (options.dryRun) {
    process.stdout.write(`[dry-run] The GitHub release for ${tag} would be created\n`)
    return
  }
  if (!tagExists(tag)) throw new Error(`The tag ${tag} does not exist, so run nx release before the GitHub release.`)
  const changelogPath = join(project.directory, 'CHANGELOG.md')
  const changelog = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : ''
  const committedEntry = isTopEntryFor(changelog, version) ? readTopEntry(changelog) : undefined
  const notes = committedEntry ?? releaseNotes(projectName, project, version, options.firstRelease).entry
  const result = createGithubRelease({
    tag,
    title: `${project.title} ${version}`,
    notes,
    repository: resolveRepositorySlug(),
  })
  process.stdout.write(
    result.created ? `Created the GitHub release for ${tag}\n` : `The GitHub release for ${tag} exists already\n`,
  )
}

function main(): void {
  const options = readReleaseOptions(process.argv.slice(2))
  const project = projectOf(TYPESCRIPT_PROJECTS, options.project)
  if (options.command === 'dependencies') {
    checkWorkspaceDependencies(options.project, project, options)
  } else if (options.command === 'notes') {
    writeNotes(options.project, project, options)
  } else if (options.command === 'release') {
    publishGithubRelease(options.project, project, options)
  } else {
    throw new Error(`Run this script with dependencies, notes, or release, not ${options.command ?? 'nothing'}.`)
  }
}

try {
  main()
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}
