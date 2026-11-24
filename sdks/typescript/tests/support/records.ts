import { createHash } from 'node:crypto'
import type { CreateUploadOutput, GetUploadOutput, ListFilesOutput } from '../../src/index.js'

export type UploadRecordReply = GetUploadOutput
export type FileRecordReply = NonNullable<GetUploadOutput['file']>
export type SignedPartReply = CreateUploadOutput['parts'][number]

const RECORDED_AT = '2026-11-24T09:00:00.000Z'
const DEADLINE_AT = '2026-11-25T09:00:00.000Z'

export function sha256Hex(bytes: Uint8Array | string): string {
  return createHash('sha256').update(bytes).digest('hex')
}

export interface FileFacts {
  id: string
  knowledgeBaseId: string
  path: string
  sizeBytes: number
  sha256: string
}

export function fileRecord(facts: FileFacts): FileRecordReply {
  return {
    id: facts.id,
    knowledge_base_id: facts.knowledgeBaseId,
    path: facts.path,
    kind: 'pdf',
    address: null,
    status: 'queued',
    current_version: null,
    latest_version: 1,
    size_bytes: facts.sizeBytes,
    content_sha256: facts.sha256,
    failure: null,
    unread_parts: [],
    metadata: {},
    created_at: RECORDED_AT,
    updated_at: RECORDED_AT,
    deleted_at: null,
    purge_after: null,
  }
}

export function listedFile(facts: FileFacts): ListFilesOutput['files'][number] {
  return { ...fileRecord(facts), status: 'ready', current_version: 1 }
}

export interface UploadFacts {
  id: string
  knowledgeBaseId: string
  path: string
  sizeBytes: number
  sha256: string
  method: 'single' | 'multipart'
  partBytes: number
  partCount: number
}

export function openUpload(facts: UploadFacts): UploadRecordReply {
  return {
    id: facts.id,
    knowledge_base_id: facts.knowledgeBaseId,
    path: facts.path,
    address: null,
    size_bytes: facts.sizeBytes,
    content_sha256: facts.sha256,
    method: facts.method,
    part_bytes: facts.partBytes,
    part_count: facts.partCount,
    state: 'open',
    outcome: null,
    file: null,
    failure: null,
    created_at: RECORDED_AT,
    deadline_at: DEADLINE_AT,
  }
}

export function completedUpload(facts: UploadFacts, fileId: string): UploadRecordReply {
  const file = fileRecord({ ...facts, id: fileId })
  return { ...openUpload(facts), state: 'completed', outcome: 'added', file }
}

export function failedUpload(facts: UploadFacts, code: string, message: string): UploadRecordReply {
  return { ...openUpload(facts), state: 'failed', failure: { code, message } }
}

export function signedPart(partNumber: number, sizeBytes: number, url: string): SignedPartReply {
  return {
    part_number: partNumber,
    size_bytes: sizeBytes,
    method: 'PUT',
    url,
    headers: { 'x-storage-signature': `part-${partNumber}` },
    expires_at: DEADLINE_AT,
  }
}
