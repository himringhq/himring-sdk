import { readFile, rename, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { compileErrors, validate } from '@readme/openapi-parser'

const SPEC_PACKAGE = '@himring/openapi'
const DOCUMENT_FILES = ['openapi.json', 'openapi-session.json'] as const
const SPEC_DIRECTORY = join(import.meta.dirname, '..')
const SYNC_COMMAND = 'pnpm nx run spec:sync'

class SpecSyncError extends Error {
  override readonly name = 'SpecSyncError'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function jsonAt(path: string): Promise<Record<string, unknown>> {
  const parsed: unknown = JSON.parse(await readFile(path, 'utf8'))
  if (!isRecord(parsed)) throw new SpecSyncError(`${path} does not hold a JSON object.`)
  return parsed
}

async function pinnedVersion(): Promise<string> {
  const manifest = await jsonAt(join(SPEC_DIRECTORY, 'package.json'))
  const version = isRecord(manifest.devDependencies) ? manifest.devDependencies[SPEC_PACKAGE] : undefined
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new SpecSyncError(`spec/package.json must pin ${SPEC_PACKAGE} to one exact version, such as 0.2.0.`)
  }
  return version
}

async function installedPackageDirectory(version: string): Promise<string> {
  const manifestPath = createRequire(join(SPEC_DIRECTORY, 'package.json')).resolve(`${SPEC_PACKAGE}/package.json`)
  const manifest = await jsonAt(manifestPath)
  if (manifest.name !== SPEC_PACKAGE || manifest.version !== version) {
    throw new SpecSyncError(
      `node_modules holds ${String(manifest.name)}@${String(manifest.version)}, but spec/package.json pins ${version}. Run pnpm install.`,
    )
  }
  return dirname(manifestPath)
}

async function validatorProblems(path: string, file: string): Promise<string[]> {
  const result = await validate(path, { resolve: { external: false } })
  return result.valid ? [] : [`${file} is not a valid OpenAPI document:\n${compileErrors(result)}`]
}

async function write(source: string): Promise<void> {
  for (const file of DOCUMENT_FILES) {
    const content = await readFile(join(source, file))
    const target = join(SPEC_DIRECTORY, file)
    const pending = `${target}.${process.pid}.pending`
    await writeFile(pending, content)
    await rename(pending, target)
  }
}

async function check(source: string, version: string): Promise<void> {
  const problems: string[] = []
  for (const file of DOCUMENT_FILES) {
    const committedPath = join(SPEC_DIRECTORY, file)
    const [published, committed] = await Promise.all([readFile(join(source, file)), readFile(committedPath)])
    if (!published.equals(committed)) {
      problems.push(`spec/${file} differs from ${SPEC_PACKAGE}@${version}. Run ${SYNC_COMMAND} and commit the result.`)
    }
  }
  if (problems.length > 0) throw new SpecSyncError(problems.join('\n'))
}

async function validateDocuments(): Promise<void> {
  const problems = (
    await Promise.all(DOCUMENT_FILES.map(file => validatorProblems(join(SPEC_DIRECTORY, file), file)))
  ).flat()
  if (problems.length > 0) throw new SpecSyncError(problems.join('\n'))
}

const MODES = ['write', 'check', 'candidate'] as const
type Mode = (typeof MODES)[number]

function isMode(value: string | undefined): value is Mode {
  return MODES.some(mode => mode === value)
}

const mode = process.argv[2]
if (!isMode(mode)) {
  console.error('Run with write, check, or candidate, as in node scripts/sync-spec.ts check.')
  process.exitCode = 2
} else {
  try {
    if (mode === 'candidate') {
      await validateDocuments()
      console.log('Both candidate OpenAPI documents are valid.')
    } else {
      const version = await pinnedVersion()
      const source = await installedPackageDirectory(version)
      if (mode === 'write') await write(source)
      else {
        await check(source, version)
        await validateDocuments()
      }
      console.log(`spec/ holds the documents of ${SPEC_PACKAGE}@${version}.`)
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
