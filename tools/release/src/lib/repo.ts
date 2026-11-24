import { tryRun } from './run.ts'

const REPOSITORY_SLUG = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/
const SSH_REMOTE = /^git@github\.com:(.+)$/
const HTTPS_REMOTE = /^https?:\/\/(?:[^@/]+@)?github\.com\/(.+)$/

function slugOf(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  const trimmed = value
    .trim()
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
  const candidate = SSH_REMOTE.exec(trimmed)?.[1] ?? HTTPS_REMOTE.exec(trimmed)?.[1] ?? trimmed
  return REPOSITORY_SLUG.test(candidate) ? candidate : undefined
}

export function resolveRepositorySlug(): string {
  const fromEnvironment = slugOf(process.env.GITHUB_REPOSITORY)
  if (fromEnvironment !== undefined) return fromEnvironment
  const remote = tryRun('git', ['remote', 'get-url', 'origin'])
  const fromRemote = remote.ok ? slugOf(remote.stdout) : undefined
  if (fromRemote !== undefined) return fromRemote
  throw new Error('Neither GITHUB_REPOSITORY nor the origin remote holds a GitHub owner/name.')
}

export function repositoryUrl(slug: string): string {
  return `https://github.com/${slug}`
}
