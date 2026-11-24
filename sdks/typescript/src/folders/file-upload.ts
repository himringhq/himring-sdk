import type { HimringClient } from '../core/client.js'
import { invalidInput } from '../core/errors.js'
import type { AddedFile, FileMetadata } from '../files/file-transfers.js'
import type { UploadSource } from '../files/upload-sources.js'
import { checkedFilePath } from './folder-rules.js'
import { type FileDigest, type OpenedFile, openLocalFile } from './opened-file.js'
import { type RetryNotice, withRetries } from './retry.js'

export interface KnowledgeBaseTarget {
  client: HimringClient
  projectId: string
  knowledgeBaseId: string
}

export interface FileRetryNotice extends RetryNotice {
  path: string
}

export interface SendOptions {
  address?: string | undefined
  metadata?: FileMetadata | undefined
  signal?: AbortSignal | undefined
  onRetry?: ((notice: FileRetryNotice) => void) | undefined
  onBytes?: ((byteCount: number) => void) | undefined
}

export interface UploadLocalFileOptions extends KnowledgeBaseTarget {
  absolutePath: string
  path: string
  confinedTo?: string | undefined
  address?: string | undefined
  metadata?: FileMetadata | undefined
  signal?: AbortSignal | undefined
  onRetry?: ((notice: FileRetryNotice) => void) | undefined
}

function uploadSourceOf(file: OpenedFile, digest: FileDigest): UploadSource {
  return {
    sizeBytes: digest.sizeBytes,
    read: (start, end) => file.read(start, end),
    stream: (start, end) => file.stream(start, end),
  }
}

export function sendOpenedFile(
  target: KnowledgeBaseTarget,
  file: OpenedFile,
  digest: FileDigest,
  path: string,
  options: SendOptions,
): Promise<AddedFile> {
  return withRetries(
    () =>
      target.client.addFile(
        {
          project_id: target.projectId,
          knowledge_base_id: target.knowledgeBaseId,
          path,
          address: options.address,
          metadata: options.metadata,
          content: uploadSourceOf(file, digest),
          content_sha256: digest.sha256,
        },
        { signal: options.signal, onProgress: options.onBytes },
      ),
    { signal: options.signal, onRetry: notice => options.onRetry?.({ ...notice, path }) },
  )
}

export async function uploadLocalFile(options: UploadLocalFileOptions): Promise<AddedFile> {
  const checked = checkedFilePath(options.path)
  if ('reason' in checked) throw invalidInput(checked.reason, 'path')
  const file = await openLocalFile(options.absolutePath, options.confinedTo)
  try {
    return await sendOpenedFile(options, file, await file.digest(), checked.path, options)
  } finally {
    await file.close()
  }
}
