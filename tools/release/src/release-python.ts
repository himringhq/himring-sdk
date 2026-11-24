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

interface PythonProject {
  directory: string
  title: string
  dependentDirectories: readonly string[]
}

const PYTHON_PROJECTS: Readonly<Record<string, PythonProject>> = {
  'sdk-python': {
    directory: 'sdks/python',
    title: 'Python SDK',
    dependentDirectories: ['packages/agent-hooks-python'],
  },
  'agent-hooks-python': {
    directory: 'packages/agent-hooks-python',
    title: 'Agent hooks for Python',
    dependentDirectories: [],
  },
}

function projectVersion(directory: string): string {
  return run('uv', ['version', '--short', '--project', directory]).trim()
}

function releaseFilesOf(project: PythonProject): string[] {
  return [
    join(project.directory, 'pyproject.toml'),
    join(project.directory, 'uv.lock'),
    join(project.directory, 'CHANGELOG.md'),
    ...project.dependentDirectories.map(directory => join(directory, 'uv.lock')),
  ]
}

function stageReleaseFiles(files: readonly string[]): boolean {
  run('git', ['add', '--', ...files])
  return tryRun('git', ['diff', '--cached', '--quiet']).status === 1
}

function main(): void {
  const options = readReleaseOptions(process.argv.slice(2))
  const project = projectOf(PYTHON_PROJECTS, options.project)
  const currentVersion = projectVersion(project.directory)
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
  if (version !== currentVersion) {
    run('uv', ['version', version, '--no-sync', '--project', project.directory])
    for (const directory of project.dependentDirectories) run('uv', ['lock', '--project', directory])
  }
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
