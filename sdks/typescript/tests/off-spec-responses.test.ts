import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { syncFolder } from '../src/folders/index.js'
import { HimringApiError } from '../src/index.js'
import { idOf, refusalOf, temporaryFolder, useHarness } from './support/harness.js'
import { listedFile, openUpload, sha256Hex } from './support/records.js'
import { operationsCalled, scriptUpload } from './support/uploads.js'

const harness = useHarness()

function expectInvalidResponse(error: unknown, status?: number): void {
  expect(error).toBeInstanceOf(HimringApiError)
  expect(error instanceof HimringApiError ? error.kind : undefined).toBe('invalid_response')
  if (status !== undefined) expect(error instanceof HimringApiError ? error.status : undefined).toBe(status)
}

function listing() {
  return { project_id: idOf('prj'), knowledge_base_id: idOf('kb') }
}

function liveFile() {
  return listedFile({
    id: idOf('fil'),
    knowledgeBaseId: idOf('kb'),
    path: 'guides/returns.pdf',
    sizeBytes: 10,
    sha256: sha256Hex('returns'),
  })
}

describe('answers that break the documented schema', () => {
  it.each([
    ['files as text', { files: 'none', total_count: 0, limit: 100, offset: 0 }],
    ['no total count', { files: [], limit: 100, offset: 0 }],
    ['a file without an ID', { files: [{ ...liveFile(), id: undefined }], total_count: 1, limit: 100, offset: 0 }],
    ['a file with a numeric path', { files: [{ ...liveFile(), path: 42 }], total_count: 1, limit: 100, offset: 0 }],
    [
      'metadata with a number',
      { files: [{ ...liveFile(), metadata: { pages: 4 } }], total_count: 1, limit: 100, offset: 0 },
    ],
    ['null for the whole answer', null],
    ['a list for the whole answer', []],
  ])('refuses a file listing with %s', async (_label, body) => {
    harness.api.stub('list_files', { status: 200, body })
    expectInvalidResponse(await refusalOf(harness.client.listFiles(listing())), 200)
    expect(harness.api.problems.length).toBeGreaterThan(0)
  })

  it('refuses an upload plan without its parts before it sends a byte', async () => {
    const content = randomBytes(512)
    const upload = scriptUpload(harness, content)
    harness.api.stub('create_upload', { status: 201, body: { upload: openUpload(upload.facts) } })
    const error = await refusalOf(
      harness.client.addFile({
        project_id: upload.projectId,
        knowledge_base_id: upload.facts.knowledgeBaseId,
        path: upload.facts.path,
        content,
      }),
    )
    expectInvalidResponse(error)
    expect(harness.storage.requests).toHaveLength(0)
    expect(operationsCalled(harness)).toEqual(['create_upload'])
  })

  it('refuses a download link whose address is not text', async () => {
    harness.api.stub('get_download_link', {
      status: 200,
      body: {
        url: { href: `${harness.storage.origin}/files/returns` },
        expires_at: '2026-11-25T09:00:00.000Z',
        file_name: 'returns.pdf',
        content_type: 'application/pdf',
        disposition: 'attachment',
        size_bytes: 10,
        entity_tag: '"v1"',
      },
    })
    const error = await refusalOf(harness.client.downloadFile({ ...listing(), file_id: idOf('fil'), version: 1 }))
    expectInvalidResponse(error)
    expect(harness.storage.requests).toHaveLength(0)
  })

  it('stops a folder sync with an API error when the listing breaks the schema', async () => {
    const root = join(await temporaryFolder(), 'site')
    await mkdir(root)
    await writeFile(join(root, 'returns.pdf'), randomBytes(64))
    harness.api.stub('list_files', { status: 200, body: { total_count: 1, limit: 100, offset: 0 } })
    const error = await refusalOf(
      syncFolder({
        client: harness.client,
        projectId: idOf('prj'),
        knowledgeBaseId: idOf('kb'),
        root,
        deleteMissing: true,
      }),
    )
    expectInvalidResponse(error)
    expect(harness.api.requests.map(request => request.method)).toEqual(['GET'])
  })
})

describe('answers that are not JSON', () => {
  it.each([
    ['an HTML error page', 502, '<html><body>Bad gateway</body></html>', 'text/html'],
    ['an empty error', 500, '', 'text/plain'],
    ['an error body that is JSON without the envelope', 400, '{"message":"bad"}', 'application/json'],
    ['a truncated error envelope', 409, '{"error":{"code":"upload_closed"', 'application/json'],
    ['a success that is plain text', 200, 'OK', 'text/plain'],
    ['an empty success', 200, '', 'application/json'],
  ])('reports %s as an invalid response', async (_label, status, raw, contentType) => {
    harness.api.stub('list_files', { status, raw, headers: { 'content-type': contentType } })
    expectInvalidResponse(await refusalOf(harness.client.listFiles(listing())), status)
  })
})
