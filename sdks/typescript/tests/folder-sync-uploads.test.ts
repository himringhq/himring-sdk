import { randomBytes } from 'node:crypto'
import { mkdir, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { syncFolder } from '../src/folders/index.js'
import { scriptFolderUploads } from './support/folder-uploads.js'
import { idOf, temporaryFolder, useHarness } from './support/harness.js'

const harness = useHarness()
const SECRET = Buffer.from(`private key ${randomBytes(16).toString('hex')}`)

interface Layout {
  root: string
  outside: string
  visible: Map<string, Buffer>
}

async function folderWithTraps(): Promise<Layout> {
  const base = await temporaryFolder()
  const root = join(base, 'site')
  const outside = join(base, 'outside')
  await mkdir(join(root, 'docs', 'nested'), { recursive: true })
  await mkdir(join(root, '.git'), { recursive: true })
  await mkdir(join(outside, 'folder'), { recursive: true })
  await writeFile(join(outside, 'secret.pdf'), SECRET)
  await writeFile(join(outside, 'folder', 'leak.pdf'), SECRET)
  const visible = new Map([
    ['docs/returns.pdf', randomBytes(900)],
    ['docs/nested/policy.docx', randomBytes(700)],
    ['prices.csv', Buffer.from('sku,price\nA1,10\n')],
  ])
  for (const [path, bytes] of visible) await writeFile(join(root, path), bytes)
  await writeFile(join(root, '.env.pdf'), SECRET)
  await writeFile(join(root, '.git', 'config.pdf'), SECRET)
  await writeFile(join(root, 'docs', 'install.sh'), SECRET)
  await writeFile(join(root, 'docs', 'notes'), SECRET)
  await writeFile(join(root, 'docs', 'archive.pdf.exe'), SECRET)
  await symlink(join(outside, 'secret.pdf'), join(root, 'docs', 'linked.pdf'))
  await symlink(join(outside, 'folder'), join(root, 'linked-folder'))
  return { root, outside, visible }
}

function emptyListing(): void {
  harness.api.stub('list_files', { status: 200, body: { files: [], total_count: 0, limit: 100, offset: 0 } })
}

function expectSecretNeverSent(): void {
  for (const request of harness.storage.requests) expect(request.body.includes(SECRET)).toBe(false)
  for (const request of harness.api.requests) expect(request.raw_body.includes(SECRET)).toBe(false)
}

describe('what a folder sync sends', () => {
  it('refuses a replacement of the selected root with a link to private files', async () => {
    const base = await temporaryFolder()
    const root = join(base, 'selected')
    const outside = join(base, 'private')
    await mkdir(root)
    await mkdir(outside)
    await writeFile(join(root, 'report.pdf'), 'public report')
    await writeFile(join(outside, 'report.pdf'), SECRET)
    const uploads = scriptFolderUploads(harness)
    harness.api.stub('list_files', async () => {
      await rename(root, join(base, 'original'))
      await symlink(outside, root)
      return { status: 200, body: { files: [], total_count: 0, limit: 100, offset: 0 } }
    })
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: idOf('kb'),
      root,
    })
    expect(report.files).toMatchObject([{ path: 'report.pdf', outcome: 'failed' }])
    expect(uploads.sentPaths()).toEqual([])
    expectSecretNeverSent()
  })

  it('sends only visible regular files with readable extensions, byte for byte', async () => {
    const layout = await folderWithTraps()
    emptyListing()
    const uploads = scriptFolderUploads(harness)
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: idOf('kb'),
      root: layout.root,
    })
    expect(uploads.sentPaths()).toEqual([...layout.visible.keys()].sort())
    const sent = uploads.sentBytes()
    for (const [path, bytes] of layout.visible) expect(sent.get(path)?.equals(bytes)).toBe(true)
    expectSecretNeverSent()
    expect(report.stoppedBy).toBeUndefined()
    expect(report.ignored.map(entry => entry.path).sort()).toEqual(
      [
        '.env.pdf',
        '.git',
        'docs/archive.pdf.exe',
        'docs/install.sh',
        'docs/linked.pdf',
        'docs/notes',
        'linked-folder',
      ].sort(),
    )
    expect(harness.api.problems).toEqual([])
  })

  it('refuses a file that becomes a symbolic link between the walk and the upload', async () => {
    const layout = await folderWithTraps()
    const uploads = scriptFolderUploads(harness)
    harness.api.stub('list_files', async () => {
      await rm(join(layout.root, 'docs', 'returns.pdf'))
      await symlink(join(layout.outside, 'secret.pdf'), join(layout.root, 'docs', 'returns.pdf'))
      return { status: 200, body: { files: [], total_count: 0, limit: 100, offset: 0 } }
    })
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: idOf('kb'),
      root: layout.root,
    })
    expect(uploads.sentPaths()).not.toContain('docs/returns.pdf')
    expect(report.files.find(file => file.path === 'docs/returns.pdf')?.outcome).toBe('failed')
    expectSecretNeverSent()
  })

  it('refuses a file whose folder becomes a symbolic link between the walk and the upload', async () => {
    const layout = await folderWithTraps()
    await writeFile(join(layout.outside, 'folder', 'policy.docx'), SECRET)
    const uploads = scriptFolderUploads(harness)
    harness.api.stub('list_files', async () => {
      await rename(join(layout.root, 'docs', 'nested'), join(layout.root, 'docs', 'moved-away'))
      await symlink(join(layout.outside, 'folder'), join(layout.root, 'docs', 'nested'))
      return { status: 200, body: { files: [], total_count: 0, limit: 100, offset: 0 } }
    })
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: idOf('kb'),
      root: layout.root,
    })
    expect(uploads.sentPaths()).not.toContain('docs/nested/policy.docx')
    expect(report.files.find(file => file.path === 'docs/nested/policy.docx')?.outcome).toBe('failed')
    expectSecretNeverSent()
  })
})

describe('a sync that the API refuses', () => {
  it.each([401, 403])('stops sending files after the first %i', async status => {
    const layout = await folderWithTraps()
    emptyListing()
    harness.api.stub('create_upload', {
      status,
      body: { error: { code: status === 401 ? 'credential_invalid' : 'permission_denied', message: 'Refused.' } },
    })
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: idOf('kb'),
      root: layout.root,
      concurrency: 1,
      deleteMissing: true,
    })
    const creates = harness.api.requests.filter(request => request.operation_id === 'create_upload')
    expect(creates).toHaveLength(1)
    expect(report.stoppedBy?.status).toBe(status)
    expect(harness.api.requests.some(request => request.method === 'DELETE')).toBe(false)
    expect(harness.storage.requests).toHaveLength(0)
  })
})
