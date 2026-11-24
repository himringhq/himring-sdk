import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const WORKFLOW_DIRECTORY = '.github/workflows'
const PUBLISH_WORKFLOW = /^\.github\/workflows\/publish(?:-[a-z0-9]+)*\.ya?ml$/
const MINIMUM_RELEASE_AGE_DAYS = 4
const MINIMUM_RELEASE_AGE_MINUTES = MINIMUM_RELEASE_AGE_DAYS * 24 * 60
const DEPENDENCY_SECTIONS = ['dependencies', 'devDependencies', 'optionalDependencies'] as const
const SKIPPED_DIRECTORIES = new Set(['node_modules', '.git', '.nx', '.venv', 'dist'])
const FULL_COMMIT_SHA = /^[a-f0-9]{40}$/i
const REMOTE_SPECIFIER = /^(github:|git\+|git:|https?:\/\/)/
const BLOCK_SCALAR_KEY = /^\s*(?:-\s*)?[\w-]+:\s*[|>]/

interface DependabotUpdate {
  line: number
  cooldownDays: number | undefined
}

function stripYamlComment(line: string): string {
  return line.replace(/\s+#.*$/, '')
}

function indentOf(line: string): number {
  return line.length - line.trimStart().length
}

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, '')
}

function escapeAnnotationValue(value: string): string {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')
}

function listFiles(directory: string, pattern: RegExp): string[] {
  const files: string[] = []
  for (const entry of readdirSync(directory)) {
    if (SKIPPED_DIRECTORIES.has(entry)) continue
    const path = join(directory, entry)
    const stats = lstatSync(path)
    if (stats.isSymbolicLink()) continue
    if (stats.isDirectory()) files.push(...listFiles(path, pattern))
    else if (pattern.test(path)) files.push(path)
  }
  return files.sort()
}

function visibleLines(content: string): string[] {
  const lines: string[] = []
  let blockIndent: number | undefined
  for (const line of content.split(/\r?\n/)) {
    const indent = indentOf(line)
    if (blockIndent !== undefined && (line.trim() === '' || indent > blockIndent)) continue
    blockIndent = undefined
    lines.push(line)
    if (BLOCK_SCALAR_KEY.test(stripYamlComment(line))) blockIndent = indent
  }
  return lines
}

function hasIdTokenWrite(content: string): boolean {
  return visibleLines(content).some(line => /^\s*id-token:\s*write\s*$/.test(stripYamlComment(line)))
}

function hasPullRequestTargetTrigger(content: string): boolean {
  const lines = content.split(/\r?\n/).map(stripYamlComment)
  for (const [index, line] of lines.entries()) {
    const inlineValue = /^(['"]?)on\1:\s*(.*)$/.exec(line)?.[2]
    if (inlineValue === undefined) continue
    if (/\bpull_request_target\b/.test(inlineValue)) return true
    for (const nested of lines.slice(index + 1)) {
      if (nested.trim() === '') continue
      if (indentOf(nested) === 0) break
      if (/\bpull_request_target\b/.test(nested)) return true
    }
  }
  return false
}

function workflowActions(content: string): string[] {
  return visibleLines(content).flatMap(line => {
    const action = /^\s*(?:-\s*)?uses:\s*([^\s#]+)/.exec(stripYamlComment(line))?.[1]
    return action === undefined ? [] : [unquote(action)]
  })
}

function checkWorkflows(): string[] {
  const failures: string[] = []
  for (const file of listFiles(WORKFLOW_DIRECTORY, /\.ya?ml$/)) {
    const content = readFileSync(file, 'utf8')
    if (hasPullRequestTargetTrigger(content)) failures.push(`${file}: pull_request_target is not allowed`)
    for (const action of workflowActions(content)) {
      if (action.startsWith('./')) continue
      const ref = action.includes('@') ? action.slice(action.lastIndexOf('@') + 1) : ''
      if (!FULL_COMMIT_SHA.test(ref)) failures.push(`${file}: pin the action ${action} to a full commit SHA`)
    }
    if (!PUBLISH_WORKFLOW.test(file) && hasIdTokenWrite(content)) {
      failures.push(`${file}: only publish workflows may ask for id-token: write`)
    }
  }
  return failures
}

function dependencyEntries(manifest: unknown, section: string): [string, unknown][] {
  if (typeof manifest !== 'object' || manifest === null || !(section in manifest)) return []
  const dependencies: unknown = Reflect.get(manifest, section)
  return typeof dependencies === 'object' && dependencies !== null ? Object.entries(dependencies) : []
}

function checkPackageManifests(): string[] {
  const failures: string[] = []
  for (const file of listFiles('.', /(^|\/)package\.json$/)) {
    const manifest: unknown = JSON.parse(readFileSync(file, 'utf8'))
    for (const section of DEPENDENCY_SECTIONS) {
      for (const [name, specifier] of dependencyEntries(manifest, section)) {
        if (typeof specifier !== 'string') continue
        if (specifier === 'latest') failures.push(`${file}: ${section}.${name} must name a version, not latest`)
        if (REMOTE_SPECIFIER.test(specifier)) {
          failures.push(`${file}: ${section}.${name} must come from the registry, not a git or URL source`)
        }
      }
    }
  }
  return failures
}

function dependabotUpdates(content: string): DependabotUpdate[] {
  const updates: DependabotUpdate[] = []
  let inUpdates = false
  let current: DependabotUpdate | undefined
  let cooldownIndent: number | undefined
  for (const [index, rawLine] of content.split(/\r?\n/).entries()) {
    const line = stripYamlComment(rawLine)
    const trimmed = line.trim()
    if (trimmed === '') continue
    const indent = indentOf(line)
    if (indent === 0) {
      if (current !== undefined) updates.push(current)
      current = undefined
      inUpdates = trimmed === 'updates:'
      cooldownIndent = undefined
      continue
    }
    if (!inUpdates) continue
    if (indent === 2 && trimmed.startsWith('- ')) {
      if (current !== undefined) updates.push(current)
      current = { line: index + 1, cooldownDays: undefined }
      cooldownIndent = undefined
      continue
    }
    if (current === undefined) continue
    if (trimmed === 'cooldown:') {
      cooldownIndent = indent
      continue
    }
    const days =
      cooldownIndent !== undefined && indent > cooldownIndent ? /^default-days:\s*(\d+)$/.exec(trimmed) : null
    if (days?.[1] !== undefined) current.cooldownDays = Number.parseInt(days[1], 10)
  }
  if (current !== undefined) updates.push(current)
  return updates
}

function checkDependencyCooldowns(): string[] {
  const failures: string[] = []
  if (!existsSync('pnpm-workspace.yaml')) {
    failures.push('pnpm-workspace.yaml is missing')
  } else {
    const minutes = /^minimumReleaseAge:\s*(\d+)\s*$/m.exec(readFileSync('pnpm-workspace.yaml', 'utf8'))?.[1]
    if (minutes === undefined || Number.parseInt(minutes, 10) < MINIMUM_RELEASE_AGE_MINUTES) {
      failures.push(`pnpm-workspace.yaml: minimumReleaseAge must be at least ${MINIMUM_RELEASE_AGE_MINUTES} minutes`)
    }
  }
  if (!existsSync('.github/dependabot.yml')) return [...failures, '.github/dependabot.yml is missing']
  const updates = dependabotUpdates(readFileSync('.github/dependabot.yml', 'utf8'))
  if (updates.length === 0) failures.push('.github/dependabot.yml: list at least one update entry')
  for (const update of updates) {
    if (update.cooldownDays === undefined || update.cooldownDays < MINIMUM_RELEASE_AGE_DAYS) {
      failures.push(
        `.github/dependabot.yml: the update entry on line ${update.line} needs cooldown.default-days of at least ${MINIMUM_RELEASE_AGE_DAYS}`,
      )
    }
  }
  return failures
}

function main(): void {
  const failures = [
    ...checkWorkflows(),
    ...checkPackageManifests(),
    ...checkDependencyCooldowns(),
    ...(existsSync('pnpm-lock.yaml') ? [] : ['pnpm-lock.yaml is missing']),
  ]
  if (failures.length === 0) {
    console.log('The supply-chain gate passed.')
    return
  }
  console.error(`The supply-chain gate failed with ${failures.length} issues.`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
    console.error(`::error title=Supply-chain gate failed::${escapeAnnotationValue(failure)}`)
  }
  process.exitCode = 1
}

main()
