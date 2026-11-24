import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export interface ScratchFolders {
  make(label: string): Promise<string>
  removeAll(): Promise<void>
}

export function scratchFolders(): ScratchFolders {
  const made: string[] = []
  return {
    async make(label) {
      const folder = await mkdtemp(join(tmpdir(), `himring-cli-${label}-`))
      made.push(folder)
      return folder
    },
    async removeAll() {
      const folders = made.splice(0)
      await Promise.all(folders.map(folder => rm(folder, { recursive: true, force: true })))
    },
  }
}
