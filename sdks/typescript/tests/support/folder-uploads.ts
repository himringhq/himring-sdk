import type { ContractRequest } from '@himring/contract-server'
import { type Harness, idOf } from './harness.js'
import { completedUpload, openUpload, signedPart, type UploadFacts } from './records.js'

export interface FolderUploads {
  sentPaths(): string[]
  sentBytes(): Map<string, Buffer>
}

function fieldOf(body: unknown, name: string): unknown {
  return typeof body === 'object' && body !== null ? Reflect.get(body, name) : undefined
}

function factsOf(request: ContractRequest): UploadFacts {
  const path = fieldOf(request.body, 'path')
  const sizeBytes = fieldOf(request.body, 'size_bytes')
  const sha256 = fieldOf(request.body, 'content_sha256')
  if (typeof path !== 'string' || typeof sizeBytes !== 'number' || typeof sha256 !== 'string') {
    throw new Error('create_upload arrived without a path, a size, and a digest.')
  }
  return {
    id: idOf('upl'),
    knowledgeBaseId: request.path_parameters.knowledge_base_id ?? '',
    path,
    sizeBytes,
    sha256,
    method: 'single',
    partBytes: sizeBytes,
    partCount: 1,
  }
}

export function scriptFolderUploads(harness: Harness): FolderUploads {
  const uploads = new Map<string, UploadFacts>()
  const partPath = (uploadId: string) => `/parts/${uploadId}/1`
  harness.api.stub('create_upload', request => {
    const facts = factsOf(request)
    uploads.set(facts.id, facts)
    harness.storage.handle(partPath(facts.id), (_put, response) => response.writeHead(200).end())
    return {
      status: 201,
      body: {
        upload: openUpload(facts),
        parts: [signedPart(1, facts.sizeBytes, `${harness.storage.origin}${partPath(facts.id)}`)],
      },
    }
  })
  harness.api.stub('complete_upload', request => {
    const facts = uploads.get(request.path_parameters.upload_id ?? '')
    if (facts === undefined) return { status: 404, body: { error: { code: 'upload_not_found', message: 'No.' } } }
    return { status: 200, body: completedUpload(facts, idOf('fil')) }
  })
  return {
    sentPaths: () =>
      harness.api.requests
        .filter(request => request.operation_id === 'create_upload')
        .map(request => String(fieldOf(request.body, 'path')))
        .sort(),
    sentBytes: () => {
      const sent = new Map<string, Buffer>()
      for (const facts of uploads.values()) {
        const put = harness.storage.requests.find(request => request.url === partPath(facts.id))
        if (put !== undefined) sent.set(facts.path, put.body)
      }
      return sent
    },
  }
}
