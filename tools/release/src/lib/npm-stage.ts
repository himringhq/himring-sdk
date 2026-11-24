import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { isPublishedOnNpm, readNpmManifest } from './npm-manifest.ts'
import { run, tryRun } from './run.ts'
import { compareVersions } from './version.ts'

const MINIMUM_STAGING_NPM_VERSION = '11.15.0'
const MINIMUM_STAGING_NODE_VERSION = '22.14.0'
const STABLE_DIST_TAG = 'latest'
const PRERELEASE_DIST_TAG = 'next'
const STAGE_FOLDER_PREFIX = 'himring-stage-'
const ALREADY_STAGED_ERROR_CODE = 'E409'
const ALREADY_STAGED_MESSAGE = /previously staged version/i

export type StageOutcome =
  | { kind: 'staged'; stageId: string | undefined }
  | { kind: 'published-already' }
  | { kind: 'staged-already' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsedJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function assertStagingToolchain(): void {
  const npmVersion = run('npm', ['--version']).trim()
  if (compareVersions(npmVersion, MINIMUM_STAGING_NPM_VERSION) < 0) {
    throw new Error(`npm ${npmVersion} cannot stage packages, so install npm ${MINIMUM_STAGING_NPM_VERSION} or later.`)
  }
  const nodeVersion = process.versions.node
  if (compareVersions(nodeVersion, MINIMUM_STAGING_NODE_VERSION) < 0) {
    throw new Error(`Node ${nodeVersion} cannot stage packages, so use Node ${MINIMUM_STAGING_NODE_VERSION} or later.`)
  }
}

export function distTagOf(version: string): string {
  return version.includes('-') ? PRERELEASE_DIST_TAG : STABLE_DIST_TAG
}

function packedTarball(directory: string, destination: string, name: string, version: string): string {
  const output = run('pnpm', ['pack', '--pack-destination', destination, '--json'], { cwd: directory })
  const packed = parsedJson(output)
  if (!isRecord(packed) || typeof packed.filename !== 'string') {
    throw new Error(`pnpm pack printed no tarball for ${name}:\n${output}`)
  }
  if (packed.name !== name || packed.version !== version) {
    throw new Error(`pnpm pack made ${String(packed.name)}@${String(packed.version)}, not ${name}@${version}.`)
  }
  return join(destination, basename(packed.filename))
}

function npmErrorOf(output: string): { code: string; text: string } {
  const parsed = parsedJson(output)
  const error = isRecord(parsed) && isRecord(parsed.error) ? parsed.error : {}
  const code = typeof error.code === 'string' ? error.code : ''
  const text = [error.summary, error.detail].filter((part): part is string => typeof part === 'string').join('\n')
  return { code, text }
}

function isAlreadyStaged(stdout: string, stderr: string): boolean {
  const { code, text } = npmErrorOf(stdout)
  const message = `${text}\n${stderr}`
  const reportsConflict = code === ALREADY_STAGED_ERROR_CODE || message.includes(ALREADY_STAGED_ERROR_CODE)
  return reportsConflict && ALREADY_STAGED_MESSAGE.test(message)
}

function stagingFailure(name: string, version: string, detail: string): Error {
  return new Error(
    [
      `npm refused to stage ${name}@${version}.`,
      `The trusted publisher of ${name} on npmjs.com has to allow npm stage publish from publish-typescript.yml in this repository.`,
      detail.length > 0 ? detail : 'npm printed nothing.',
    ].join('\n'),
  )
}

function stageTarball(tarball: string, name: string, version: string, dryRun: boolean): StageOutcome {
  const args = ['stage', 'publish', tarball, '--access', 'public', '--tag', distTagOf(version), '--json']
  if (dryRun) args.push('--dry-run')
  const result = tryRun('npm', args)
  if (result.ok) {
    const staged = parsedJson(result.stdout)
    const entry = isRecord(staged) ? staged[name] : undefined
    const stageId = isRecord(entry) && typeof entry.stageId === 'string' ? entry.stageId : undefined
    return { kind: 'staged', stageId }
  }
  if (isAlreadyStaged(result.stdout, result.stderr)) return { kind: 'staged-already' }
  throw stagingFailure(name, version, [result.stderr, result.stdout].filter(part => part.length > 0).join('\n'))
}

export function stagePackage(directory: string, dryRun: boolean): StageOutcome {
  assertStagingToolchain()
  const { name, version } = readNpmManifest(directory)
  if (isPublishedOnNpm(name, version)) return { kind: 'published-already' }
  const destination = mkdtempSync(join(tmpdir(), STAGE_FOLDER_PREFIX))
  try {
    return stageTarball(packedTarball(directory, destination, name, version), name, version, dryRun)
  } finally {
    rmSync(destination, { recursive: true, force: true })
  }
}
