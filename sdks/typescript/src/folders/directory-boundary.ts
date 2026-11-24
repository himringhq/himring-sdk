import { realpath, stat } from 'node:fs/promises'

export interface DirectoryBoundary {
  path: string
  device: number
  inode: number
}

export async function directoryBoundaryOf(root: string): Promise<DirectoryBoundary> {
  const path = await realpath(root)
  const details = await stat(path)
  if (!details.isDirectory()) throw new Error(`${root} is not a folder.`)
  return { path, device: details.dev, inode: details.ino }
}

export async function confirmDirectory(boundary: DirectoryBoundary): Promise<void> {
  const resolved = await realpath(boundary.path)
  const details = await stat(boundary.path)
  if (resolved !== boundary.path || details.dev !== boundary.device || details.ino !== boundary.inode) {
    throw new Error('The selected folder changed while its files were being sent. Select the folder again.')
  }
}
