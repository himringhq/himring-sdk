import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tryRun } from './run.ts'

const WORKSPACE_PROTOCOL = 'workspace:'

export interface NpmManifest {
  name: string
  version: string
  dependencies: Readonly<Record<string, string>>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function readNpmManifest(directory: string): NpmManifest {
  const parsed: unknown = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'))
  if (!isRecord(parsed) || typeof parsed.name !== 'string' || typeof parsed.version !== 'string') {
    throw new Error(`${directory}/package.json needs a name and a version.`)
  }
  const dependencies = isRecord(parsed.dependencies) ? parsed.dependencies : {}
  return {
    name: parsed.name,
    version: parsed.version,
    dependencies: Object.fromEntries(
      Object.entries(dependencies).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    ),
  }
}

export function workspaceDependenciesOf(manifest: NpmManifest): string[] {
  return Object.entries(manifest.dependencies)
    .filter(([, specifier]) => specifier.startsWith(WORKSPACE_PROTOCOL))
    .map(([name]) => name)
}

export function isPublishedOnNpm(name: string, version: string): boolean {
  const lookup = tryRun('npm', ['view', `${name}@${version}`, 'version', '--json'])
  if (lookup.ok) return lookup.stdout.length > 0
  if (lookup.stderr.includes('E404')) return false
  throw new Error(`npm could not say whether ${name}@${version} is published: ${lookup.stderr}`)
}
