import { randomBytes } from 'node:crypto'
import { lstat, mkdir, readdir, readFile, readlink, symlink, writeFile } from 'node:fs/promises'
import type { ServerResponse } from 'node:http'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DownloadTargetExistsError, saveDownload } from '../src/folders/index.js'
import { createHimringClient, HimringApiError, type HimringClient, safeDownloadName } from '../src/index.js'
import { API_KEY, idOf, refusalOf, temporaryFolder, useHarness } from './support/harness.js'

const harness = useHarness()
const INDEX_BYTES = randomBytes(4_096)
const FALLBACK_NAME = 'download.bin'

function indexDownload(contentDisposition: string) {
  harness.api.stub('download_index', {
    status: 200,
    raw: INDEX_BYTES,
    headers: { 'content-type': 'application/octet-stream', 'content-disposition': contentDisposition },
  })
  return harness.client.downloadIndex({ project_id: idOf('prj'), index_id: idOf('ix') })
}

async function storageDownload(write: (response: ServerResponse) => void, client: HimringClient = harness.client) {
  harness.api.stub('get_download_link', {
    status: 200,
    body: {
      url: `${harness.storage.origin}/files/manual`,
      expires_at: '2026-11-25T09:00:00.000Z',
      file_name: 'manual.pdf',
      content_type: 'application/pdf',
      disposition: 'attachment',
      size_bytes: INDEX_BYTES.byteLength,
      entity_tag: '"v2"',
    },
  })
  harness.storage.handle('/files/manual', (_request, response) => write(response))
  return client.downloadFile({
    project_id: idOf('prj'),
    knowledge_base_id: idOf('kb'),
    file_id: idOf('fil'),
    version: 2,
  })
}

function cutShort(response: ServerResponse): void {
  response.writeHead(200, { 'content-length': String(INDEX_BYTES.byteLength) })
  response.write(INDEX_BYTES.subarray(0, 1_000), () => response.destroy())
}

function whole(response: ServerResponse): void {
  response.writeHead(200, { 'content-length': String(INDEX_BYTES.byteLength) }).end(INDEX_BYTES)
}

describe('hostile file names from the API', () => {
  it.each([
    'attachment; filename="../../escape.nrsl"',
    'attachment; filename="..\\\\..\\\\escape.dll"',
    'attachment; filename="/etc/cron.d/escape"',
    'attachment; filename=".bashrc"',
    'attachment; filename=".."',
    'attachment; filename="..."',
    `attachment; filename*=UTF-8''..%2F..%2Fescape%00.nrsl`,
    `attachment; filename*=UTF-8''%2E%2E%2F%2E%2E%2F.ssh%2Fauthorized_keys`,
    `attachment; filename*=UTF-8''${'a'.repeat(30)}.${'b'.repeat(199)}`,
    `attachment; filename*=UTF-8''%E2%80%AEfdp.exe`,
  ])('saves the file from %j as a plain visible file inside the chosen folder', async disposition => {
    const root = await temporaryFolder()
    const folder = join(root, 'downloads')
    await mkdir(folder)
    const download = await indexDownload(disposition)
    const name = safeDownloadName(download.file_name, FALLBACK_NAME)
    const saved = await saveDownload(download, join(folder, name))
    expect(dirname(saved.file)).toBe(folder)
    expect(await readdir(root)).toEqual(['downloads'])
    const [only, ...others] = await readdir(folder)
    expect(others).toEqual([])
    expect(only?.startsWith('.')).toBe(false)
    expect(only).toMatch(/^[A-Za-z0-9._-]{1,200}$/)
    expect((await readFile(join(folder, only ?? ''))).equals(INDEX_BYTES)).toBe(true)
  })
})

describe('downloads that end early', () => {
  it('leaves no file behind when storage closes the connection partway', async () => {
    const folder = await temporaryFolder()
    const download = await storageDownload(cutShort)
    await refusalOf(saveDownload(download, join(folder, 'manual.pdf')))
    expect(await readdir(folder)).toEqual([])
  })

  it('keeps the existing file whole when a replacing download ends early', async () => {
    const folder = await temporaryFolder()
    const target = join(folder, 'manual.pdf')
    const kept = randomBytes(2_000)
    await writeFile(target, kept)
    const download = await storageDownload(cutShort)
    await refusalOf(saveDownload(download, target, { replace: true }))
    expect(await readdir(folder)).toEqual(['manual.pdf'])
    expect((await readFile(target)).equals(kept)).toBe(true)
  })
})

describe('downloads whose body stalls', () => {
  const IDLE_LIMIT_MS = 300

  function stall(response: ServerResponse): void {
    response.writeHead(200, {
      'content-type': 'application/octet-stream',
      'content-length': String(INDEX_BYTES.byteLength),
    })
    response.write(INDEX_BYTES.subarray(0, 100))
  }

  async function expectTimeoutInTime(saving: Promise<unknown>): Promise<void> {
    const started = Date.now()
    const error = await refusalOf(saving)
    expect(error instanceof HimringApiError ? error.kind : error).toBe('timeout')
    expect(Date.now() - started).toBeLessThan(IDLE_LIMIT_MS * 10)
  }

  it('ends a stalled storage download with a timeout and leaves no file', async () => {
    const folder = await temporaryFolder()
    const client = createHimringClient({
      baseUrl: harness.api.baseUrl,
      credential: API_KEY,
      uploadIdleTimeoutMs: IDLE_LIMIT_MS,
    })
    const download = await storageDownload(stall, client)
    await expectTimeoutInTime(saveDownload(download, join(folder, 'manual.pdf')))
    expect(await readdir(folder)).toEqual([])
  })

  it('ends a stalled API download with a timeout and leaves no file', async () => {
    const folder = await temporaryFolder()
    const projectId = idOf('prj')
    const indexId = idOf('ix')
    harness.storage.handle(`/v1/projects/${projectId}/indexes/${indexId}/download`, (_request, response) =>
      stall(response),
    )
    const client = createHimringClient({
      baseUrl: harness.storage.origin,
      credential: API_KEY,
      uploadIdleTimeoutMs: IDLE_LIMIT_MS,
    })
    const download = await client.downloadIndex({ project_id: projectId, index_id: indexId })
    await expectTimeoutInTime(saveDownload(download, join(folder, 'index.nrsl')))
    expect(await readdir(folder)).toEqual([])
  })
})

describe('files that are already there', () => {
  it('refuses to replace an existing file unless the caller asks', async () => {
    const folder = await temporaryFolder()
    const target = join(folder, 'manual.pdf')
    const kept = randomBytes(2_000)
    await writeFile(target, kept)
    const download = await storageDownload(whole)
    const error = await refusalOf(saveDownload(download, target))
    expect(error).toBeInstanceOf(DownloadTargetExistsError)
    expect(await readdir(folder)).toEqual(['manual.pdf'])
    expect((await readFile(target)).equals(kept)).toBe(true)
  })

  it('refuses to write through a dangling symbolic link that sits where the file goes', async () => {
    const root = await temporaryFolder()
    const folder = join(root, 'downloads')
    await mkdir(folder)
    const outside = join(root, 'planted.txt')
    await symlink(outside, join(folder, 'manual.pdf'))
    const download = await storageDownload(whole)
    const error = await refusalOf(saveDownload(download, join(folder, 'manual.pdf')))
    expect(error).toBeInstanceOf(DownloadTargetExistsError)
    expect(await readdir(root)).toEqual(['downloads'])
  })

  it('replaces a symbolic link with the file and leaves the file that it pointed at alone', async () => {
    const root = await temporaryFolder()
    const folder = join(root, 'downloads')
    await mkdir(folder)
    const outside = join(root, 'settings.json')
    const settings = Buffer.from('{"keep":"this"}')
    await writeFile(outside, settings)
    await symlink(outside, join(folder, 'manual.pdf'))
    expect(await readlink(join(folder, 'manual.pdf'))).toBe(outside)
    const download = await storageDownload(whole)
    await saveDownload(download, join(folder, 'manual.pdf'), { replace: true })
    expect((await readFile(outside)).equals(settings)).toBe(true)
    expect((await lstat(join(folder, 'manual.pdf'))).isFile()).toBe(true)
    expect((await readFile(join(folder, 'manual.pdf'))).equals(INDEX_BYTES)).toBe(true)
    expect((await readdir(folder)).sort()).toEqual(['manual.pdf'])
  })
})
