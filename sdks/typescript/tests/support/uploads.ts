import type { ContractRequest } from '@himring/contract-server'
import type { Harness } from './harness.js'
import { idOf } from './harness.js'
import {
  completedUpload,
  openUpload,
  type SignedPartReply,
  sha256Hex,
  signedPart,
  type UploadFacts,
} from './records.js'

export interface ScriptedUpload {
  facts: UploadFacts
  projectId: string
  fileId: string
  partUrl(partNumber: number): string
  partPath(partNumber: number): string
}

export interface UploadScript {
  path?: string
  partBytes?: number
}

function partSizeOf(facts: UploadFacts, partNumber: number): number {
  if (facts.method === 'single') return facts.sizeBytes
  const start = (partNumber - 1) * facts.partBytes
  return Math.min(facts.sizeBytes, start + facts.partBytes) - start
}

function requestedPartNumbers(request: ContractRequest): number[] {
  const body = request.body
  if (typeof body !== 'object' || body === null || !('parts' in body) || !Array.isArray(body.parts)) return []
  return body.parts.flatMap((part: unknown) =>
    typeof part === 'object' && part !== null && 'part_number' in part && typeof part.part_number === 'number'
      ? [part.part_number]
      : [],
  )
}

export function scriptUpload(harness: Harness, content: Uint8Array, script: UploadScript = {}): ScriptedUpload {
  const uploadId = idOf('upl')
  const multipart = script.partBytes !== undefined
  const facts: UploadFacts = {
    id: uploadId,
    knowledgeBaseId: idOf('kb'),
    path: script.path ?? 'guides/returns.pdf',
    sizeBytes: content.byteLength,
    sha256: sha256Hex(content),
    method: multipart ? 'multipart' : 'single',
    partBytes: script.partBytes ?? content.byteLength,
    partCount: multipart ? Math.ceil(content.byteLength / (script.partBytes ?? 1)) : 1,
  }
  const fileId = idOf('fil')
  const partPath = (partNumber: number) => `/parts/${uploadId}/${partNumber}`
  const partUrl = (partNumber: number) => `${harness.storage.origin}${partPath(partNumber)}`
  const signed = (partNumber: number): SignedPartReply =>
    signedPart(partNumber, partSizeOf(facts, partNumber), partUrl(partNumber))
  harness.api.stub('create_upload', {
    status: 201,
    body: { upload: openUpload(facts), parts: multipart ? [] : [signed(1)] },
  })
  harness.api.stub('sign_upload_parts', request => ({
    status: 200,
    body: { parts: requestedPartNumbers(request).map(signed) },
  }))
  harness.api.stub('complete_upload', { status: 200, body: completedUpload(facts, fileId) })
  harness.api.stub('cancel_upload', { status: 200, body: { ...openUpload(facts), state: 'failed' } })
  for (let partNumber = 1; partNumber <= facts.partCount; partNumber += 1) {
    harness.storage.handle(partPath(partNumber), (_request, response) => response.writeHead(200).end())
  }
  return { facts, projectId: idOf('prj'), fileId, partUrl, partPath }
}

export function storedBytes(harness: Harness, upload: ScriptedUpload): Buffer {
  const parts: Buffer[] = []
  for (let partNumber = 1; partNumber <= upload.facts.partCount; partNumber += 1) {
    const accepted = harness.storage.requests.filter(
      request => request.method === 'PUT' && request.url === upload.partPath(partNumber),
    )
    const last = accepted.at(-1)
    if (last !== undefined) parts.push(last.body)
  }
  return Buffer.concat(parts)
}

export function operationsCalled(harness: Harness): (string | undefined)[] {
  return harness.api.requests.map(request => request.operation_id)
}
