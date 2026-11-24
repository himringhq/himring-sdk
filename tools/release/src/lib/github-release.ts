import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { run, tryRun } from './run.ts'

const NOTES_DIRECTORY_PREFIX = 'himring-release-notes-'

export interface ReleaseRequest {
  tag: string
  title: string
  notes: string
  repository: string
}

export function createGithubRelease(request: ReleaseRequest): { created: boolean } {
  if (request.tag.length === 0) throw new Error('A GitHub release needs a tag.')
  const existing = tryRun('gh', ['release', 'view', request.tag, '--json', 'tagName', '--repo', request.repository])
  if (existing.ok) return { created: false }
  const directory = mkdtempSync(join(tmpdir(), NOTES_DIRECTORY_PREFIX))
  try {
    const notesPath = join(directory, 'notes.md')
    writeFileSync(notesPath, request.notes)
    run('gh', [
      'release',
      'create',
      request.tag,
      '--title',
      request.title,
      '--notes-file',
      notesPath,
      '--verify-tag',
      '--repo',
      request.repository,
    ])
    return { created: true }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}
