import { randomBytes } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { HimringApiError } from '../src/index.js'
import { idOf, refusalOf, useHarness } from './support/harness.js'
import { completedUpload, failedUpload, openUpload, sha256Hex, signedPart } from './support/records.js'
import { documentedMaximumBodyBytes } from './support/spec.js'
import { operationsCalled, type ScriptedUpload, scriptUpload, storedBytes } from './support/uploads.js'

const harness = useHarness()

function addScripted(upload: ScriptedUpload, content: Uint8Array) {
  return harness.client.addFile({
    project_id: upload.projectId,
    knowledge_base_id: upload.facts.knowledgeBaseId,
    path: upload.facts.path,
    content,
  })
}

function errorOf(error: unknown): HimringApiError {
  if (error instanceof HimringApiError) return error
  throw new Error(`The SDK threw ${String(error)} where it should throw a HimringApiError.`)
}

describe('file bodies over the documented limit', () => {
  const limit = documentedMaximumBodyBytes('import_answer_log')
  const target = () => ({ project_id: idOf('prj'), knowledge_base_id: idOf('kb') })

  it('sends a body of exactly the documented limit', async () => {
    harness.api.stub('import_answer_log', { status: 200, body: { recorded_count: 0, refused: [] } })
    await harness.client.importAnswerLog({ ...target(), content: new Uint8Array(limit) })
    expect(harness.api.requests.map(request => request.raw_body.byteLength)).toEqual([limit])
    expect(harness.api.problems).toEqual([])
  })

  it.each([
    ['bytes', () => new Uint8Array(limit + 1)],
    ['a Blob', () => new Blob([new Uint8Array(limit + 1)])],
  ])('refuses %s one byte over the limit before any request', async (_label, content) => {
    const error = errorOf(await refusalOf(harness.client.importAnswerLog({ ...target(), content: content() })))
    expect(error.kind).toBe('invalid_input')
    expect(harness.api.requests).toHaveLength(0)
  })
})

describe('upload plans that do not fit the file', () => {
  const content = randomBytes(10_000)

  it('stores every byte of a multipart file in order and signs each part with its own digest', async () => {
    const upload = scriptUpload(harness, content, { partBytes: 4_096 })
    const added = await addScripted(upload, content)
    expect(added.file.id).toBe(upload.fileId)
    expect(storedBytes(harness, upload).equals(content)).toBe(true)
    const signedDigests = harness.api.requests
      .filter(request => request.operation_id === 'sign_upload_parts')
      .map(request => JSON.stringify(request.body))
      .sort()
    const expected = [0, 4_096, 8_192]
      .map((start, index) =>
        JSON.stringify({
          parts: [{ part_number: index + 1, sha256: sha256Hex(content.subarray(start, start + 4_096)) }],
        }),
      )
      .sort()
    expect(signedDigests).toEqual(expected)
    expect(harness.api.problems).toEqual([])
  })

  it.each([
    ['one part too few', { method: 'multipart', partBytes: 4_096, partCount: 2 }],
    ['one part too many', { method: 'multipart', partBytes: 4_096, partCount: 4 }],
    ['a single part shorter than the file', { method: 'single', partBytes: 9_999, partCount: 1 }],
    ['a size that is not the file size', { method: 'single', partBytes: 10_000, partCount: 1, sizeBytes: 9_000 }],
    ['the digest of other content', { method: 'single', partBytes: 10_000, partCount: 1, sha256: sha256Hex('x') }],
  ] as const)('cancels a plan with %s before it sends a byte', async (_label, layout) => {
    const upload = scriptUpload(harness, content, { partBytes: 4_096 })
    const facts = { ...upload.facts, ...layout }
    harness.api.stub('create_upload', {
      status: 201,
      body: { upload: openUpload(facts), parts: [signedPart(1, facts.partBytes, upload.partUrl(1))] },
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.kind).toBe('invalid_response')
    expect(harness.storage.requests).toHaveLength(0)
    expect(operationsCalled(harness)).toEqual(['create_upload', 'cancel_upload'])
  })

  it.each([
    ['short', 9_999, 1],
    ['long', 10_001, 1],
    ['for another part', 10_000, 2],
  ])('cancels the upload when the API signs a part that is %s', async (_label, sizeBytes, partNumber) => {
    const upload = scriptUpload(harness, content, { partBytes: 16_384 })
    harness.api.stub('sign_upload_parts', {
      status: 200,
      body: { parts: [signedPart(partNumber, sizeBytes, upload.partUrl(partNumber))] },
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.kind).toBe('invalid_response')
    expect(harness.storage.requests).toHaveLength(0)
    expect(operationsCalled(harness)).not.toContain('complete_upload')
    expect(operationsCalled(harness)).toContain('cancel_upload')
  })
})

describe('uploads that Himring refuses after the bytes arrive', () => {
  const content = randomBytes(2_048)

  it('reports a checksum mismatch as a refusal and never as an added file', async () => {
    const upload = scriptUpload(harness, content)
    harness.api.stub('complete_upload', {
      status: 200,
      body: failedUpload(upload.facts, 'upload_checksum_mismatch', 'The file does not match its SHA-256.'),
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.kind).toBe('refused')
    expect(error.code).toBe('upload_checksum_mismatch')
  })

  it('refuses a completed upload that the API reports for other content', async () => {
    const upload = scriptUpload(harness, content)
    harness.api.stub('complete_upload', {
      status: 200,
      body: completedUpload({ ...upload.facts, sha256: sha256Hex('other content') }, upload.fileId),
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.kind).toBe('invalid_response')
  })

  it('refuses a file that the API says it already holds under other content', async () => {
    const upload = scriptUpload(harness, content)
    const other = { ...upload.facts, sha256: sha256Hex('other content'), sizeBytes: 13 }
    harness.api.stub('create_upload', {
      status: 201,
      body: { upload: { ...completedUpload(other, upload.fileId), outcome: 'unchanged' }, parts: [] },
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.kind).toBe('invalid_response')
    expect(harness.storage.requests).toHaveLength(0)
  })

  it('reports an upload that expired while storage refused the part', async () => {
    const upload = scriptUpload(harness, content)
    harness.storage.handle(upload.partPath(1), (_request, response) => response.writeHead(403).end())
    harness.api.stub('sign_upload_parts', {
      status: 409,
      body: { error: { code: 'upload_expired', message: 'The upload expired. Start it again.' } },
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.kind).toBe('refused')
    expect(error.code).toBe('upload_expired')
    expect(operationsCalled(harness)).not.toContain('complete_upload')
  })

  it('keeps checking an upload until Himring settles it and reports the final failure', async () => {
    const upload = scriptUpload(harness, content)
    harness.api.stub('complete_upload', { status: 200, body: { ...openUpload(upload.facts), state: 'checking' } })
    harness.api.stub('get_upload', {
      status: 200,
      body: failedUpload(upload.facts, 'upload_size_mismatch', 'The file is not the size that the upload declared.'),
    })
    const error = errorOf(await refusalOf(addScripted(upload, content)))
    expect(error.code).toBe('upload_size_mismatch')
  })
})
