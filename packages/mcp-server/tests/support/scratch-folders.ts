import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const created: string[] = []

export async function scratchFolder(label: string): Promise<string> {
  const folder = await mkdtemp(join(tmpdir(), `himring-mcp-${label}-`))
  created.push(folder)
  return folder
}

export async function removeScratchFolders(): Promise<void> {
  const folders = created.splice(0)
  await Promise.all(folders.map(folder => rm(folder, { recursive: true, force: true })))
}
