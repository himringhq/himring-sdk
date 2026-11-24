import { randomBytes } from 'node:crypto'
import { chmod, mkdir, rename, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { syncFolder } from '../src/folders/index.js'
import { scriptFolderUploads } from './support/folder-uploads.js'
import { idOf, temporaryFolder, useHarness } from './support/harness.js'
import { fileRecord, listedFile, sha256Hex } from './support/records.js'

const harness = useHarness()
const PREFIX = ['site']
const RUNS_AS_ROOT = typeof process.getuid === 'function' && process.getuid() === 0
const lockedFolders: string[] = []

afterEach(async () => {
  for (const folder of lockedFolders.splice(0)) await chmod(folder, 0o700)
})

interface LiveSetup {
  root: string
  knowledgeBaseId: string
  liveIdOf: Map<string, string>
}

async function folderAndLiveFiles(livePaths: readonly string[]): Promise<LiveSetup> {
  const base = await temporaryFolder()
  const root = join(base, 'site')
  await mkdir(join(root, 'docs'), { recursive: true })
  await mkdir(join(root, '.drafts'), { recursive: true })
  await mkdir(join(root, 'locked'), { recursive: true })
  await writeFile(join(base, 'outside.pdf'), randomBytes(64))
  const kept = randomBytes(800)
  await writeFile(join(root, 'docs', 'kept.pdf'), kept)
  await writeFile(join(root, '.drafts', 'draft.pdf'), randomBytes(64))
  await writeFile(join(root, 'locked', 'contract.pdf'), randomBytes(64))
  await writeFile(join(root, 'docs', 'script.sh'), randomBytes(64))
  await symlink(join(base, 'outside.pdf'), join(root, 'docs', 'linked.pdf'))
  if (!RUNS_AS_ROOT) {
    await chmod(join(root, 'locked'), 0o000)
    lockedFolders.push(join(root, 'locked'))
  }
  const knowledgeBaseId = idOf('kb')
  const liveIdOf = new Map(livePaths.map(path => [path, idOf('fil')]))
  const files = livePaths.map(path =>
    listedFile({
      id: liveIdOf.get(path) ?? '',
      knowledgeBaseId,
      path,
      sizeBytes: path === 'site/docs/kept.pdf' ? kept.byteLength : 64,
      sha256: path === 'site/docs/kept.pdf' ? sha256Hex(kept) : sha256Hex(path),
    }),
  )
  harness.api.stub('list_files', { status: 200, body: { files, total_count: files.length, limit: 100, offset: 0 } })
  harness.api.stub('delete_file', request => ({
    status: 200,
    body: fileRecord({
      id: request.path_parameters.file_id ?? '',
      knowledgeBaseId,
      path: 'deleted.pdf',
      sizeBytes: 1,
      sha256: sha256Hex('deleted'),
    }),
  }))
  return { root, knowledgeBaseId, liveIdOf }
}

function deletedIds(): string[] {
  return harness.api.requests
    .filter(request => request.operation_id === 'delete_file')
    .map(request => request.path_parameters.file_id ?? '')
    .sort()
}

const LIVE_PATHS = [
  'site/docs/kept.pdf',
  'site/docs/removed.pdf',
  'site/old/removed-folder.pdf',
  'site/.drafts/draft.pdf',
  'site/.drafts/published-elsewhere.pdf',
  'site/locked/contract.pdf',
  'site/locked/other.pdf',
  'site/docs/linked.pdf',
  'site/docs/script.sh',
  'siteextra/catalog.pdf',
  'elsewhere/handbook.pdf',
]

describe('deleteMissing', () => {
  it('refuses a deletion retry after the selected directory is replaced', async () => {
    const root = join(await temporaryFolder(), 'selected')
    await mkdir(root)
    const knowledgeBaseId = idOf('kb')
    const fileId = idOf('fil')
    const file = listedFile({
      id: fileId,
      knowledgeBaseId,
      path: 'kept.pdf',
      sizeBytes: 4,
      sha256: sha256Hex('kept'),
    })
    harness.api.stub('list_files', {
      status: 200,
      body: { files: [file], total_count: 1, limit: 100, offset: 0 },
    })
    harness.api.stub('delete_file', async () => {
      await rename(root, `${root}-previous`)
      await mkdir(root)
      await writeFile(join(root, 'kept.pdf'), 'kept')
      return { status: 503, body: { error: { code: 'unavailable', message: 'Try again.' } } }
    })
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId,
      root,
      deleteMissing: true,
    })
    expect(deletedIds()).toEqual([fileId])
    expect(report.files).toMatchObject([{ path: 'kept.pdf', outcome: 'failed' }])
  })

  it('deletes only live files under the prefix that are absent from the folder', async () => {
    const setup = await folderAndLiveFiles(LIVE_PATHS)
    scriptFolderUploads(harness)
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: setup.knowledgeBaseId,
      root: setup.root,
      pathPrefix: PREFIX,
      deleteMissing: true,
    })
    const expected = ['site/docs/removed.pdf', 'site/old/removed-folder.pdf'].map(path => setup.liveIdOf.get(path))
    expect(deletedIds()).toEqual(expected.sort())
    expect(report.files.find(file => file.path === 'site/docs/kept.pdf')?.outcome).toBe('skipped')
    expect(harness.api.requests.some(request => request.operation_id === 'create_upload')).toBe(false)
    expect(harness.api.problems).toEqual([])
  })

  it('sends no write at all on a dry run', async () => {
    const setup = await folderAndLiveFiles([...LIVE_PATHS.filter(path => path !== 'site/docs/kept.pdf')])
    scriptFolderUploads(harness)
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: setup.knowledgeBaseId,
      root: setup.root,
      pathPrefix: PREFIX,
      deleteMissing: true,
      dryRun: true,
    })
    expect(harness.api.requests.map(request => request.operation_id)).toEqual(['list_files'])
    expect(harness.storage.requests).toHaveLength(0)
    expect(report.files.find(file => file.path === 'site/docs/kept.pdf')?.outcome).toBe('planned')
    expect(report.files.filter(file => file.outcome === 'planned_deletion').map(file => file.path)).toEqual([
      'site/docs/removed.pdf',
      'site/old/removed-folder.pdf',
    ])
  })

  it.each([401, 403])('stops deleting after the first %i', async status => {
    const missing = ['site/gone/one.pdf', 'site/gone/two.pdf', 'site/gone/three.pdf']
    const setup = await folderAndLiveFiles(['site/docs/kept.pdf', ...missing])
    harness.api.stub('delete_file', {
      status,
      body: { error: { code: status === 401 ? 'credential_invalid' : 'permission_denied', message: 'Refused.' } },
    })
    const report = await syncFolder({
      client: harness.client,
      projectId: idOf('prj'),
      knowledgeBaseId: setup.knowledgeBaseId,
      root: setup.root,
      pathPrefix: PREFIX,
      deleteMissing: true,
      concurrency: 1,
    })
    expect(deletedIds()).toHaveLength(1)
    expect(report.stoppedBy?.status).toBe(status)
  })
})
