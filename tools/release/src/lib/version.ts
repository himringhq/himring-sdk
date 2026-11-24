const BUMP_KEYWORDS = new Set(['patch', 'minor', 'major'])
const VERSION_INPUT_LENGTH_LIMIT = 64
const STABLE_VERSION = /^(\d+)\.(\d+)\.(\d+)$/
const SEMANTIC_VERSION = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/

export class VersionError extends Error {
  override readonly name = 'VersionError'
}

interface StableVersion {
  major: number
  minor: number
  patch: number
}

function parseStableVersion(value: string): StableVersion {
  const match = STABLE_VERSION.exec(value)
  const [, major, minor, patch] = match ?? []
  if (major === undefined || minor === undefined || patch === undefined) {
    throw new VersionError(
      `${value} is not a MAJOR.MINOR.PATCH version, so patch, minor, and major cannot apply to it.`,
    )
  }
  return { major: Number(major), minor: Number(minor), patch: Number(patch) }
}

interface VersionPrecedence {
  core: readonly [number, number, number]
  prerelease: readonly string[]
}

function precedenceOf(value: string): VersionPrecedence {
  const [, major, minor, patch, prerelease] = SEMANTIC_VERSION.exec(value) ?? []
  if (major === undefined || minor === undefined || patch === undefined) {
    throw new VersionError(`${value} is not a semantic version.`)
  }
  return { core: [Number(major), Number(minor), Number(patch)], prerelease: prerelease?.split('.') ?? [] }
}

function compareIdentifiers(left: string, right: string): number {
  const leftIsNumber = /^\d+$/.test(left)
  const rightIsNumber = /^\d+$/.test(right)
  if (leftIsNumber && rightIsNumber) return Number(left) - Number(right)
  if (leftIsNumber !== rightIsNumber) return leftIsNumber ? -1 : 1
  if (left === right) return 0
  return left < right ? -1 : 1
}

export function compareVersions(left: string, right: string): number {
  const leftPrecedence = precedenceOf(left)
  const rightPrecedence = precedenceOf(right)
  for (const [index, leftPart] of leftPrecedence.core.entries()) {
    const difference = leftPart - (rightPrecedence.core[index] ?? 0)
    if (difference !== 0) return difference
  }
  if (leftPrecedence.prerelease.length === 0 || rightPrecedence.prerelease.length === 0) {
    return rightPrecedence.prerelease.length - leftPrecedence.prerelease.length
  }
  const identifierCount = Math.max(leftPrecedence.prerelease.length, rightPrecedence.prerelease.length)
  for (let index = 0; index < identifierCount; index += 1) {
    const leftIdentifier = leftPrecedence.prerelease[index]
    const rightIdentifier = rightPrecedence.prerelease[index]
    if (leftIdentifier === undefined) return -1
    if (rightIdentifier === undefined) return 1
    const difference = compareIdentifiers(leftIdentifier, rightIdentifier)
    if (difference !== 0) return difference
  }
  return 0
}

export interface VersionRules {
  allowPrerelease: boolean
}

export function resolveVersion(input: string, currentVersion: string, rules: VersionRules): string {
  if (input.length === 0) throw new VersionError('Pass a version: patch, minor, major, or one like 1.2.3.')
  if (input.length > VERSION_INPUT_LENGTH_LIMIT) throw new VersionError('The version input is too long.')
  if (BUMP_KEYWORDS.has(input)) {
    const { major, minor, patch } = parseStableVersion(currentVersion)
    if (input === 'major') return `${major + 1}.0.0`
    if (input === 'minor') return `${major}.${minor + 1}.0`
    return `${major}.${minor}.${patch + 1}`
  }
  const pattern = rules.allowPrerelease ? SEMANTIC_VERSION : STABLE_VERSION
  if (!pattern.test(input)) {
    const shape = rules.allowPrerelease ? 'a semantic version like 1.2.3' : 'a stable version like 1.2.3'
    throw new VersionError(`${input} is not patch, minor, major, or ${shape}.`)
  }
  if (compareVersions(input, currentVersion) < 0) {
    throw new VersionError(`${input} is lower than the current version ${currentVersion}, so it cannot be released.`)
  }
  return input
}
