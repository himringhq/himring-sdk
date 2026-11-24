import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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

interface RustProject {
  directory: string
  crate: string
  title: string
}

const RUST_PROJECTS: Readonly<Record<string, RustProject>> = {
  'sdk-rust': {
    directory: 'sdks/rust',
    crate: 'himring',
    title: 'Rust SDK',
  },
}

const PACKAGE_TABLE_HEADER = '[package]'
const VERSION_LINE = /^version\s*=\s*"[^"]*"\s*$/

function manifestOf(project: RustProject): string {
  return join(project.directory, 'Cargo.toml')
}

function crateVersion(project: RustProject): string {
  const metadata: unknown = JSON.parse(
    run('cargo', ['metadata', '--no-deps', '--format-version', '1', '--manifest-path', manifestOf(project)]),
  )
  const packages = typeof metadata === 'object' && metadata !== null ? Reflect.get(metadata, 'packages') : undefined
  const found = Array.isArray(packages)
    ? packages.find(
        entry => typeof entry === 'object' && entry !== null && Reflect.get(entry, 'name') === project.crate,
      )
    : undefined
  const version: unknown = found === undefined ? undefined : Reflect.get(found, 'version')
  if (typeof version !== 'string') {
    throw new Error(`cargo metadata lists no version for the ${project.crate} crate.`)
  }
  return version
}

function withPackageVersion(manifest: string, version: string): string {
  const lines = manifest.split('\n')
  const header = lines.findIndex(line => line.trim() === PACKAGE_TABLE_HEADER)
  if (header === -1) throw new Error(`The manifest has no ${PACKAGE_TABLE_HEADER} table.`)
  for (let index = header + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? ''
    if (line.trimStart().startsWith('[')) break
    if (VERSION_LINE.test(line)) {
      lines[index] = `version = "${version}"`
      return lines.join('\n')
    }
  }
  throw new Error(`The ${PACKAGE_TABLE_HEADER} table of the manifest has no version line.`)
}

function setCrateVersion(project: RustProject, version: string): void {
  const manifestPath = manifestOf(project)
  writeFileSync(manifestPath, withPackageVersion(readFileSync(manifestPath, 'utf8'), version))
  run('cargo', ['update', '--workspace', '--manifest-path', manifestPath])
  const written = crateVersion(project)
  if (written !== version) {
    throw new Error(`The manifest holds ${written} after the bump to ${version}.`)
  }
}

function releaseFilesOf(project: RustProject): string[] {
  return [manifestOf(project), join(project.directory, 'Cargo.lock'), join(project.directory, 'CHANGELOG.md')]
}

function stageReleaseFiles(files: readonly string[]): boolean {
  run('git', ['add', '--', ...files])
  return tryRun('git', ['diff', '--cached', '--quiet']).status === 1
}

function main(): void {
  const options = readReleaseOptions(process.argv.slice(2))
  const project = projectOf(RUST_PROJECTS, options.project)
  const currentVersion = crateVersion(project)
  const version = resolveVersion(options.version, currentVersion, { allowPrerelease: false })
  const tag = `${options.project}@v${version}`
  if (tagExists(tag) && !tagPointsAtHead(tag)) {
    throw new Error(`The tag ${tag} exists on another commit, so this release would overwrite it.`)
  }
  const slug = resolveRepositorySlug()
  const fromTag = options.firstRelease ? undefined : findLastTag(`${options.project}@v`)
  const commits = listScopedCommits(fromTag, [project.directory])
  const entry = renderChangelogEntry({ version, date: today(), commits, repositoryUrl: repositoryUrl(slug) })
  if (options.dryRun) {
    process.stdout.write(
      `[dry-run] ${options.project} ${currentVersion} to ${version}, since ${fromTag ?? 'the start'}\n`,
    )
    process.stdout.write(`[dry-run] ${commits.length} commits touch ${project.directory}\n${entry}\n`)
    return
  }
  if (version !== currentVersion) setCrateVersion(project, version)
  const changelogPath = join(project.directory, 'CHANGELOG.md')
  const existing = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : ''
  const changelog = prependChangelogEntry(existing, entry, version)
  writeFileSync(changelogPath, changelog)
  const releaseFiles = releaseFilesOf(project)
  assertCleanExcept(releaseFiles)
  if (stageReleaseFiles(releaseFiles)) run('git', ['commit', '-m', `chore(release): ${options.project} ${version}`])
  if (!tagExists(tag)) run('git', ['tag', '-a', tag, '-m', `${options.project} ${version}`])
  run('git', ['push', 'origin', 'HEAD'])
  run('git', ['push', 'origin', tag])
  const notes = readTopEntry(changelog) ?? entry
  const result = createGithubRelease({ tag, title: `${project.title} ${version}`, notes, repository: slug })
  process.stdout.write(
    result.created ? `Created the GitHub release for ${tag}\n` : `The GitHub release for ${tag} exists already\n`,
  )
}

try {
  main()
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}
