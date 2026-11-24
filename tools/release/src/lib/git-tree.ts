import { relative, resolve } from 'node:path'
import { run } from './run.ts'

const PORCELAIN_STATUS_WIDTH = 3

export class DirtyTreeError extends Error {
  override readonly name = 'DirtyTreeError'
  readonly paths: readonly string[]

  constructor(paths: readonly string[]) {
    super(`The working tree has changes outside the release files:\n${paths.map(path => `  ${path}`).join('\n')}`)
    this.paths = paths
  }
}

function normalize(path: string): string {
  return relative(process.cwd(), resolve(path)).split('\\').join('/')
}

function changedPaths(porcelain: string): string[] {
  const entries = porcelain.split('\u0000').filter(entry => entry.length > 0)
  const paths: string[] = []
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index] ?? ''
    const status = entry.slice(0, 2)
    const path = entry.slice(PORCELAIN_STATUS_WIDTH)
    if (path.length === 0) continue
    paths.push(path)
    const renamedFrom = status.startsWith('R') || status.startsWith('C') ? entries[index + 1] : undefined
    if (renamedFrom !== undefined) {
      paths.push(renamedFrom)
      index += 1
    }
  }
  return paths
}

export function assertCleanExcept(allowedPaths: readonly string[]): void {
  const allowed = new Set(allowedPaths.map(normalize))
  const porcelain = run('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all'])
  const offending = [...new Set(changedPaths(porcelain).map(normalize))].filter(path => !allowed.has(path)).sort()
  if (offending.length > 0) throw new DirtyTreeError(offending)
}
