import { describe, expect, it } from 'vitest'
import { HimringApiError } from '../src/index.js'
import { idOf, refusalOf, useHarness } from './support/harness.js'
import { sha256Hex } from './support/records.js'

const harness = useHarness()

function expectRefusedBeforeSending(error: unknown): void {
  expect(error).toBeInstanceOf(HimringApiError)
  expect(error instanceof HimringApiError ? error.kind : undefined).toBe('invalid_input')
  expect(harness.api.requests).toHaveLength(0)
}

describe('path segments from the caller', () => {
  it.each(['..', '.', ''])('refuses the record ID %j before any request', async recordId => {
    const error = await refusalOf(
      harness.client.deleteIndexRecord({ project_id: idOf('prj'), index_id: idOf('ix'), record_id: recordId }),
    )
    expectRefusedBeforeSending(error)
  })

  it.each(['a/b', '../..', '%2e%2e', '.%2E', '..%2F..', '%2F', '..\\..', '?state=deleted', '#fragment'])(
    'keeps the record ID %j inside its own path segment',
    async recordId => {
      const projectId = idOf('prj')
      const indexId = idOf('ix')
      harness.api.stub('delete_index_record', request => ({
        status: 200,
        body: { id: request.path_parameters.record_id ?? '' },
      }))
      const deleted = await harness.client.deleteIndexRecord({
        project_id: projectId,
        index_id: indexId,
        record_id: recordId,
      })
      expect(deleted.id).toBe(recordId)
      expect(harness.api.requests).toHaveLength(1)
      const [request] = harness.api.requests
      expect(request?.operation_id).toBe('delete_index_record')
      expect(request?.method).toBe('DELETE')
      expect(request?.path_parameters).toEqual({ project_id: projectId, index_id: indexId, record_id: recordId })
      expect(request?.query).toEqual({})
      expect(harness.api.problems).toEqual([])
    },
  )

  it.each(['../files', `${idOf('fil')}/../..`, idOf('fil').toUpperCase(), ` ${idOf('fil')}`])(
    'refuses the file ID %j that breaks the documented pattern before any request',
    async fileId => {
      const error = await refusalOf(
        harness.client.deleteFile({ project_id: idOf('prj'), knowledge_base_id: idOf('kb'), file_id: fileId }),
      )
      expectRefusedBeforeSending(error)
    },
  )
})

describe('fields that the spec does not document', () => {
  const projectId = idOf('prj')
  const knowledgeBaseId = idOf('kb')
  const uploadInput = {
    project_id: projectId,
    knowledge_base_id: knowledgeBaseId,
    path: 'guides/returns.pdf',
    size_bytes: 4,
    content_sha256: sha256Hex('%PDF'),
  }

  it.each([
    ['a misspelled body field', 'create_upload', { ...uploadInput, metdata: { owner: 'finance' } }],
    [
      'a misspelled query field',
      'list_files',
      { project_id: projectId, knowledge_base_id: knowledgeBaseId, limt: '5' },
    ],
    [
      'a field on an operation without a body',
      'delete_file',
      { project_id: projectId, knowledge_base_id: knowledgeBaseId, file_id: idOf('fil'), force: 'true' },
    ],
    ['a prototype key', 'create_upload', JSON.parse(`{"__proto__":{"admin":true},"path":"x.pdf"}`)],
  ] as const)('refuses %s before any request', async (_label, operation, input) => {
    expectRefusedBeforeSending(await refusalOf(harness.client.invoke(operation, input)))
  })
})

describe('null and wrong types from the caller', () => {
  const projectId = idOf('prj')
  const knowledgeBaseId = idOf('kb')
  const listing = { project_id: projectId, knowledge_base_id: knowledgeBaseId }
  const upload = {
    project_id: projectId,
    knowledge_base_id: knowledgeBaseId,
    path: 'guides/returns.pdf',
    size_bytes: 4,
    content_sha256: sha256Hex('%PDF'),
  }

  it.each([
    ['a null query value', 'list_files', { ...listing, limit: null }],
    ['a number in a text query value', 'list_files', { ...listing, limit: 5 }],
    ['a list in a query value', 'list_files', { ...listing, state: ['live', 'deleted'] }],
    ['an object in a query value', 'list_files', { ...listing, search: { $ne: '' } }],
    ['a value outside the documented choices', 'list_files', { ...listing, state: 'everything' }],
    ['a null path value', 'list_files', { ...listing, knowledge_base_id: null }],
    ['a number as a path value', 'list_files', { ...listing, project_id: 7 }],
    ['a null body field', 'create_upload', { ...upload, path: null }],
    ['text where the body takes a whole number', 'create_upload', { ...upload, size_bytes: '4' }],
    ['a fraction where the body takes a whole number', 'create_upload', { ...upload, size_bytes: 4.5 }],
    ['a missing required body field', 'create_upload', { ...upload, content_sha256: undefined }],
    ['an input that is a list', 'list_files', [listing]],
    ['an input that is text', 'list_files', 'project_id=prj'],
  ] as const)('refuses %s before any request', async (_label, operation, input) => {
    expectRefusedBeforeSending(await refusalOf(harness.client.invoke(operation, input)))
  })

  it('sends a valid input that the contract server accepts without problems', async () => {
    harness.api.stub('list_files', { status: 200, body: { files: [], total_count: 0, limit: 5, offset: 0 } })
    const page = await harness.client.listFiles({ ...listing, limit: '5', state: 'live' })
    expect(page.files).toEqual([])
    expect(harness.api.requests.map(request => request.query)).toEqual([{ limit: '5', state: 'live' }])
    expect(harness.api.problems).toEqual([])
  })
})
