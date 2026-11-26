import { describe, expect, it } from 'vitest'
import { HimringApiError } from '../src/index.js'
import { API_KEY, idOf, refusalOf, useHarness } from './support/harness.js'
import { openUpload, signedPart } from './support/records.js'
import { operationsCalled, scriptUpload } from './support/uploads.js'

const harness = useHarness()
const PDF_BYTES = new TextEncoder().encode('%PDF-1.7 returns policy')
const CUSTOM_HEADER = 'x-himring-tenant'

function kindOf(error: unknown): string | undefined {
  return error instanceof HimringApiError ? error.kind : undefined
}

function linkTo(url: string) {
  return {
    url,
    expires_at: '2026-11-25T09:00:00.000Z',
    file_name: 'returns.pdf',
    content_type: 'application/pdf',
    disposition: 'attachment',
    size_bytes: PDF_BYTES.byteLength,
    entity_tag: '"v1"',
  }
}

function downloadInput() {
  return { project_id: idOf('prj'), knowledge_base_id: idOf('kb'), file_id: idOf('fil'), version: 1 }
}

describe('the API key on uploads and downloads', () => {
  it('sends the key and custom headers to the API and neither to storage when it adds a file', async () => {
    const upload = scriptUpload(harness, PDF_BYTES)
    const client = harness.client.withHeaders({ [CUSTOM_HEADER]: 'acme' })
    await client.addFile({
      project_id: upload.projectId,
      knowledge_base_id: upload.facts.knowledgeBaseId,
      path: upload.facts.path,
      content: PDF_BYTES,
    })
    expect(operationsCalled(harness)).toEqual(['create_upload', 'complete_upload'])
    for (const request of harness.api.requests) {
      expect(request.headers.authorization).toBe(`Bearer ${API_KEY}`)
      expect(request.headers[CUSTOM_HEADER]).toBe('acme')
    }
    expect(harness.storage.requests).toHaveLength(1)
    const [put] = harness.storage.requests
    expect(put?.headers.authorization).toBeUndefined()
    expect(put?.headers[CUSTOM_HEADER]).toBeUndefined()
    expect(put?.headers['x-storage-signature']).toBe('part-1')
    expect(put?.body.equals(Buffer.from(PDF_BYTES))).toBe(true)
  })

  it('sends neither the key nor custom headers to storage when it downloads a file', async () => {
    harness.api.stub('get_download_link', { status: 200, body: linkTo(`${harness.storage.origin}/files/returns`) })
    harness.storage.handle('/files/returns', (_request, response) => response.writeHead(200).end(PDF_BYTES))
    const client = harness.client.withHeaders({ [CUSTOM_HEADER]: 'acme' })
    const download = await client.downloadFile(downloadInput())
    expect(Buffer.from(await new Response(download.body).arrayBuffer()).equals(Buffer.from(PDF_BYTES))).toBe(true)
    expect(harness.api.requests[0]?.headers.authorization).toBe(`Bearer ${API_KEY}`)
    expect(harness.storage.requests).toHaveLength(1)
    expect(harness.storage.requests[0]?.headers.authorization).toBeUndefined()
    expect(harness.storage.requests[0]?.headers[CUSTOM_HEADER]).toBeUndefined()
  })
})

describe('redirects', () => {
  it('never follows an API redirect, so the key stays with the API', async () => {
    const projectId = idOf('prj')
    const knowledgeBaseId = idOf('kb')
    harness.api.route('GET', `/v1/projects/${projectId}/knowledge-bases/${knowledgeBaseId}/files`, () => ({
      status: 302,
      headers: { location: `${harness.storage.origin}/collect` },
    }))
    const error = await refusalOf(
      harness.client.listFiles({ project_id: projectId, knowledge_base_id: knowledgeBaseId }),
    )
    expect(kindOf(error)).toBe('invalid_response')
    expect(harness.storage.requests).toHaveLength(0)
  })

  it.each(['bytes', 'stream'])('refuses a storage redirect once when sending a part as %s', async kind => {
    const upload = scriptUpload(harness, PDF_BYTES)
    harness.storage.handle(upload.partPath(1), (_request, response) =>
      response.writeHead(307, { location: `${harness.storage.origin}/collect` }).end(),
    )
    const file = new Blob([PDF_BYTES])
    const error = await refusalOf(
      harness.client.addFile({
        project_id: upload.projectId,
        knowledge_base_id: upload.facts.knowledgeBaseId,
        path: upload.facts.path,
        content:
          kind === 'bytes'
            ? PDF_BYTES
            : {
                sizeBytes: file.size,
                read: async (start, end) => new Uint8Array(await file.slice(start, end).arrayBuffer()),
                stream: (start, end) => file.slice(start, end).stream(),
              },
      }),
    )
    expect(kindOf(error)).toBe('refused')
    expect(harness.storage.requests.map(request => request.url)).toEqual([upload.partPath(1)])
    expect(operationsCalled(harness)).not.toContain('complete_upload')
  })

  it('never follows a storage redirect while it downloads', async () => {
    harness.api.stub('get_download_link', { status: 200, body: linkTo(`${harness.storage.origin}/files/returns`) })
    harness.storage.handle('/files/returns', (_request, response) =>
      response.writeHead(302, { location: `${harness.storage.origin}/collect` }).end(),
    )
    const error = await refusalOf(harness.client.downloadFile(downloadInput()))
    expect(kindOf(error)).toBe('refused')
    expect(harness.storage.requests.map(request => request.url)).toEqual(['/files/returns'])
  })
})

describe('storage links with a scheme other than http or https', () => {
  const hostileLinks = [
    'file:///etc/passwd',
    'ftp://127.0.0.1/returns.pdf',
    'data:application/pdf;base64,JVBERg==',
    'javascript:alert(1)',
    '/relative/part',
    'not a url',
  ]

  it.each(hostileLinks)('refuses the signed part link %j and cancels the upload', async url => {
    const upload = scriptUpload(harness, PDF_BYTES)
    harness.api.stub('create_upload', {
      status: 201,
      body: { upload: openUpload(upload.facts), parts: [signedPart(1, PDF_BYTES.byteLength, url)] },
    })
    const error = await refusalOf(
      harness.client.addFile({
        project_id: upload.projectId,
        knowledge_base_id: upload.facts.knowledgeBaseId,
        path: upload.facts.path,
        content: PDF_BYTES,
      }),
    )
    expect(kindOf(error)).toBe('invalid_response')
    expect(harness.storage.requests).toHaveLength(0)
    expect(operationsCalled(harness)).toEqual(['create_upload', 'cancel_upload'])
  })

  it.each(hostileLinks)('refuses the download link %j', async url => {
    harness.api.stub('get_download_link', { status: 200, body: linkTo(url) })
    const error = await refusalOf(harness.client.downloadFile(downloadInput()))
    expect(kindOf(error)).toBe('invalid_response')
    expect(harness.storage.requests).toHaveLength(0)
  })
})
