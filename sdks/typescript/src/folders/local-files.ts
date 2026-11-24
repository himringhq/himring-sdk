import { opendir } from 'node:fs/promises'
import { join } from 'node:path'
import { checkedFilePath } from './folder-rules.js'

export const FOLDER_FILE_MAXIMUM = 100_000
export const FOLDER_ENTRY_MAXIMUM = 1_000_000

export interface LocalFile {
  path: string
  absolutePath: string
}

export interface IgnoredEntry {
  path: string
  reason: string
}

export interface FolderContents {
  files: LocalFile[]
  ignored: IgnoredEntry[]
}

export class FolderTooLargeError extends Error {
  override readonly name = 'FolderTooLargeError'

  constructor(root: string) {
    super(
      `The folder ${root} holds more than ${FOLDER_FILE_MAXIMUM} files that Himring reads, or more than ${FOLDER_ENTRY_MAXIMUM} entries in all. Send it in smaller folders.`,
    )
  }
}

interface PendingDirectory {
  absolutePath: string
  segments: readonly string[]
}

interface Candidate {
  path: string
  absolutePath: string
  sentPath: string
}

function errorMessageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function byPath(left: { path: string }, right: { path: string }): number {
  if (left.path < right.path) return -1
  return left.path > right.path ? 1 : 0
}

function claimedFiles(candidates: Candidate[], ignored: IgnoredEntry[]): LocalFile[] {
  const files: LocalFile[] = []
  const claimedPaths = new Set<string>()
  for (const candidate of candidates.sort(byPath)) {
    if (claimedPaths.has(candidate.sentPath)) {
      ignored.push({
        path: candidate.path,
        reason: `Another file in the folder has the same path once its letters are normalized, ${candidate.sentPath}.`,
      })
    } else {
      claimedPaths.add(candidate.sentPath)
      files.push({ path: candidate.sentPath, absolutePath: candidate.absolutePath })
    }
  }
  return files.sort(byPath)
}

export async function localFilesOf(root: string, pathPrefix: readonly string[] = []): Promise<FolderContents> {
  const candidates: Candidate[] = []
  const ignored: IgnoredEntry[] = []
  let visited = 0
  const pending: PendingDirectory[] = [{ absolutePath: root, segments: pathPrefix }]
  for (let directory = pending.pop(); directory !== undefined; directory = pending.pop()) {
    let entries: Awaited<ReturnType<typeof opendir>>
    try {
      entries = await opendir(directory.absolutePath)
    } catch (error) {
      if (directory.absolutePath === root) throw error
      ignored.push({ path: directory.segments.join('/'), reason: errorMessageOf(error) })
      continue
    }
    for await (const entry of entries) {
      visited += 1
      if (visited > FOLDER_ENTRY_MAXIMUM) throw new FolderTooLargeError(root)
      const segments = [...directory.segments, entry.name]
      const path = segments.join('/')
      const absolutePath = join(directory.absolutePath, entry.name)
      if (entry.name.startsWith('.')) {
        ignored.push({ path, reason: 'Hidden files and folders stay local.' })
      } else if (entry.isSymbolicLink()) {
        ignored.push({ path, reason: 'Symbolic links stay local, so that the upload never leaves the folder.' })
      } else if (entry.isDirectory()) {
        pending.push({ absolutePath, segments })
      } else if (!entry.isFile()) {
        ignored.push({ path, reason: 'Only regular files are sent.' })
      } else {
        const checked = checkedFilePath(path)
        if ('reason' in checked) {
          ignored.push({ path, reason: checked.reason })
        } else {
          candidates.push({ path, absolutePath, sentPath: checked.path })
          if (candidates.length > FOLDER_FILE_MAXIMUM) throw new FolderTooLargeError(root)
        }
      }
    }
  }
  const files = claimedFiles(candidates, ignored)
  return { files, ignored: ignored.sort(byPath) }
}
