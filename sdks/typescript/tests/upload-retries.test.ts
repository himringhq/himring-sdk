import { randomBytes } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { HimringApiError } from '../src/index.js'
import { refusalOf, useHarness } from './support/harness.js'
import { operationsCalled, type ScriptedUpload, scriptUpload, storedBytes } from './support/uploads.js'

const harness = useHarness()
const LONGEST_HONORED_RETRY_AFTER_SECONDS = 120

function addScripted(upload: ScriptedUpload, content: Uint8Array) {
  return harness.client.addFile({
    project_id: upload.projectId,
    knowledge_base_id: upload.facts.knowledgeBaseId,
    path: upload.facts.path,
    content,
  })
}

function failFirst(upload: ScriptedUpload, failures: number, status: number, retryAfter?: string): void {
  let answered = 0
  harness.storage.handle(upload.partPath(1), (_request, response) => {
    answered += 1
    if (answered > failures) {
      response.writeHead(200).end()
      return
    }
    response.writeHead(status, retryAfter === undefined ? {} : { 'retry-after': retryAfter }).end()
  })
}

function partSends(upload: ScriptedUpload): unknown[] {
  return harness.storage.requests.filter(request => request.url === upload.partPath(1))
}

describe('storage that asks the client to slow down', () => {
  const content = randomBytes(3_000)

  it.each([429, 503])('waits the retry-after seconds after a %i and then stores the whole file', async status => {
    const upload = scriptUpload(harness, content)
    failFirst(upload, 1, status, '1')
    const started = Date.now()
    const added = await addScripted(upload, content)
    expect(Date.now() - started).toBeGreaterThanOrEqual(1_000)
    expect(added.file.id).toBe(upload.fileId)
    expect(partSends(upload)).toHaveLength(2)
    expect(storedBytes(harness, upload).equals(content)).toBe(true)
    expect(operationsCalled(harness)).toEqual(['create_upload', 'sign_upload_parts', 'complete_upload'])
  })

  it('gives up at once when storage asks for a wait beyond the cap', async () => {
    const upload = scriptUpload(harness, content)
    failFirst(upload, 1, 503, String(LONGEST_HONORED_RETRY_AFTER_SECONDS + 1))
    const started = Date.now()
    const error = await refusalOf(addScripted(upload, content))
    expect(Date.now() - started).toBeLessThan(1_000)
    expect(error instanceof HimringApiError ? error.status : undefined).toBe(503)
    expect(partSends(upload)).toHaveLength(1)
    expect(operationsCalled(harness)).not.toContain('complete_upload')
  })

  it('stops after three tries of a storage server that keeps failing and never completes the upload', async () => {
    const upload = scriptUpload(harness, content)
    failFirst(upload, Number.POSITIVE_INFINITY, 500)
    const error = await refusalOf(addScripted(upload, content))
    expect(error instanceof HimringApiError ? error.status : undefined).toBe(500)
    expect(partSends(upload)).toHaveLength(3)
    expect(operationsCalled(harness)).not.toContain('complete_upload')
    expect(operationsCalled(harness)).toContain('cancel_upload')
  })

  it('stops at once on a storage refusal that a retry cannot fix', async () => {
    const upload = scriptUpload(harness, content)
    failFirst(upload, Number.POSITIVE_INFINITY, 400)
    const error = await refusalOf(addScripted(upload, content))
    expect(error instanceof HimringApiError ? error.status : undefined).toBe(400)
    expect(partSends(upload)).toHaveLength(1)
  })
})
