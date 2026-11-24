import { backoffMs } from '../core/backoff.js'
import { documentedStatusOf, HimringApiError, invalidInput } from '../core/errors.js'
import { idleLimitedStream } from '../core/idle-stream.js'
import type { OperationCaller } from '../core/operation-caller.js'
import type { Download } from '../core/types.js'
import type {
  CreateUploadInput,
  CreateUploadOutput,
  GetDownloadLinkInput,
  GetUploadOutput,
  SignUploadPartsOutput,
} from '../generated/types.js'
import { getFromStorage, putToStorage, type StorageAnswer, type StorageTransport } from './storage-requests.js'
import {
  contentSha256Of,
  isUploadContent,
  partBytesOf,
  sha256HexOf,
  type UploadBody,
  type UploadContent,
  uploadBodyOf,
  uploadSourceOf,
} from './upload-sources.js'

export type UploadRecord = GetUploadOutput
export type SignedPart = SignUploadPartsOutput['parts'][number]
export type FileMetadata = NonNullable<CreateUploadInput['metadata']>
export type FileRendition = NonNullable<GetDownloadLinkInput['rendition']>

export interface AddedFile {
  outcome: NonNullable<UploadRecord['outcome']>
  file: NonNullable<UploadRecord['file']>
}

export interface AddFileInput {
  project_id: string
  knowledge_base_id: string
  path: string
  address?: string | undefined
  content: UploadContent
  content_sha256?: string | undefined
  metadata?: FileMetadata | undefined
}

export interface DownloadFileInput {
  project_id: string
  knowledge_base_id: string
  file_id: string
  version: number
  rendition?: FileRendition | undefined
  range?: string | undefined
}

export interface TransferOptions {
  signal?: AbortSignal | undefined
  onProgress?: ((bytesSent: number) => void) | undefined
}

export interface FileTransfers {
  addFile(input: AddFileInput, options?: TransferOptions): Promise<AddedFile>
  downloadFile(input: DownloadFileInput, options?: TransferOptions): Promise<Download>
}

const PARTS_IN_FLIGHT = 4
const SEND_ATTEMPTS = 3
const RESIGNED_STATUSES: ReadonlySet<number> = new Set([403, 408, 429, 500, 502, 503, 504])
const CHECK_POLL_FIRST_MS = 200
const CHECK_POLL_MAXIMUM_MS = 2_000
const CHECK_WAIT_PAST_DEADLINE_MS = 30 * 60_000
const HTTP_OK = 200
const HTTP_PARTIAL_CONTENT = 206
const HTTP_FORBIDDEN = 403
const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/

interface UploadIds {
  project_id: string
  knowledge_base_id: string
  upload_id: string
}

function delay(milliseconds: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(signal.reason)
      return
    }
    const timer = setTimeout(done, milliseconds)
    function done() {
      signal?.removeEventListener('abort', stop)
      resolve()
    }
    function stop() {
      clearTimeout(timer)
      reject(signal?.reason)
    }
    signal?.addEventListener('abort', stop, { once: true })
  })
}

function refusalOf(upload: UploadRecord): HimringApiError {
  const code = upload.failure?.code
  return new HimringApiError('refused', upload.failure?.message ?? 'Himring closed the upload without the file.', {
    code,
    status: code === undefined ? undefined : documentedStatusOf(code),
  })
}

function storageRefusal(status: number, partNumber: number): HimringApiError {
  return new HimringApiError(
    'refused',
    `Storage refused part ${partNumber} of the file with status ${status}. Check that nothing changed the file while it was sent, then send it again.`,
    { status },
  )
}

function isUnreachable(error: unknown): boolean {
  return error instanceof HimringApiError && (error.kind === 'network' || error.kind === 'timeout')
}

function retryWaitMs(answer: StorageAnswer, attempt: number): number | undefined {
  if (!RESIGNED_STATUSES.has(answer.status)) return undefined
  if (answer.status === HTTP_FORBIDDEN) return 0
  return backoffMs(attempt, answer.retryAfterSeconds)
}

function expectedPartBytes(upload: UploadRecord, partNumber: number): number {
  if (upload.method === 'single') return upload.size_bytes
  const start = (partNumber - 1) * upload.part_bytes
  return Math.min(upload.size_bytes, start + upload.part_bytes) - start
}

function checkedSignedPart(upload: UploadRecord, part: SignedPart, partNumber: number): SignedPart {
  if (part.part_number === partNumber && part.size_bytes === expectedPartBytes(upload, partNumber)) return part
  throw new HimringApiError(
    'invalid_response',
    `The API signed part ${part.part_number} of the upload ${upload.id} for ${part.size_bytes} bytes, where the file needs part ${partNumber} of ${expectedPartBytes(upload, partNumber)} bytes.`,
  )
}

function checkedRecord(upload: UploadRecord, sizeBytes: number, sha256: string): UploadRecord {
  if (upload.size_bytes === sizeBytes && upload.content_sha256 === sha256) return upload
  throw new HimringApiError(
    'invalid_response',
    `The API answered with the upload ${upload.id} for other content than the file that the client sent.`,
  )
}

function addedFileOf(upload: UploadRecord): AddedFile {
  if (upload.state === 'failed') throw refusalOf(upload)
  if (upload.outcome === null || upload.file === null) {
    throw new HimringApiError('invalid_response', `The upload ${upload.id} completed with no file.`)
  }
  return { outcome: upload.outcome, file: upload.file }
}

function checkedPartLayout(upload: UploadRecord, sizeBytes: number): void {
  const { part_count: count, part_bytes: partBytes } = upload
  const fits =
    upload.method === 'single'
      ? count === 1 && partBytes === sizeBytes
      : Number.isSafeInteger(partBytes) && partBytes >= 1 && count === Math.ceil(sizeBytes / partBytes)
  if (upload.size_bytes !== sizeBytes || !fits) {
    throw new HimringApiError(
      'invalid_response',
      `The API planned the upload ${upload.id} with parts that do not fit the file.`,
    )
  }
}

export function createFileTransfers(call: OperationCaller, storage: StorageTransport): FileTransfers {
  async function sendPart(
    first: SignedPart,
    resign: () => Promise<SignedPart>,
    body: () => UploadBody | Promise<UploadBody>,
    options: TransferOptions,
  ): Promise<void> {
    let signed = first
    for (let attempt = 1; ; attempt += 1) {
      let answer: StorageAnswer
      try {
        answer = await putToStorage(storage, {
          url: signed.url,
          headers: signed.headers,
          body: await body(),
          sizeBytes: signed.size_bytes,
          signal: options.signal,
        })
      } catch (error) {
        if (attempt >= SEND_ATTEMPTS || options.signal?.aborted === true || !isUnreachable(error)) throw error
        await delay(backoffMs(attempt, undefined) ?? 0, options.signal)
        signed = await resign()
        continue
      }
      if (answer.status >= HTTP_OK && answer.status < 300) {
        options.onProgress?.(signed.size_bytes)
        return
      }
      const wait = retryWaitMs(answer, attempt)
      if (attempt >= SEND_ATTEMPTS || wait === undefined) throw storageRefusal(answer.status, signed.part_number)
      await delay(wait, options.signal)
      signed = await resign()
    }
  }

  async function signedPart(
    ids: UploadIds,
    upload: UploadRecord,
    partNumber: number,
    sha256: string,
  ): Promise<SignedPart> {
    const signed = await call('sign_upload_parts', { ...ids, parts: [{ part_number: partNumber, sha256 }] })
    const part = signed.parts.find(candidate => candidate.part_number === partNumber)
    if (part === undefined) {
      throw new HimringApiError('invalid_response', `The API signed no link for part ${partNumber}.`)
    }
    return checkedSignedPart(upload, part, partNumber)
  }

  async function sendSingle(
    ids: UploadIds,
    upload: UploadRecord,
    first: SignedPart | undefined,
    content: UploadContent,
    options: TransferOptions,
  ): Promise<void> {
    const resign = () => signedPart(ids, upload, 1, upload.content_sha256)
    const signed = first === undefined ? await resign() : checkedSignedPart(upload, first, 1)
    await sendPart(signed, resign, () => uploadBodyOf(content, 0, upload.size_bytes), options)
  }

  async function sendMultipart(
    ids: UploadIds,
    upload: UploadRecord,
    content: UploadContent,
    options: TransferOptions,
  ): Promise<void> {
    let next = 1
    async function lane(): Promise<void> {
      while (next <= upload.part_count) {
        options.signal?.throwIfAborted()
        const partNumber = next
        next += 1
        const start = (partNumber - 1) * upload.part_bytes
        const end = Math.min(upload.size_bytes, start + upload.part_bytes)
        const bytes = await partBytesOf(content, start, end)
        const sha256 = await sha256HexOf(bytes)
        const resign = () => signedPart(ids, upload, partNumber, sha256)
        await sendPart(await resign(), resign, () => bytes, options)
      }
    }
    await Promise.all(Array.from({ length: Math.min(PARTS_IN_FLIGHT, upload.part_count) }, lane))
  }

  async function settled(ids: UploadIds, upload: UploadRecord, signal: AbortSignal | undefined) {
    let current = upload
    let wait = CHECK_POLL_FIRST_MS
    const deadline = Date.parse(upload.deadline_at)
    const giveUpAt = (Number.isFinite(deadline) ? deadline : Date.now()) + CHECK_WAIT_PAST_DEADLINE_MS
    while (current.state === 'checking') {
      if (Date.now() > giveUpAt) {
        throw new HimringApiError(
          'timeout',
          `Himring was still checking the upload ${upload.id} long after its deadline. Read it later with get_upload.`,
        )
      }
      await delay(wait, signal)
      wait = Math.min(CHECK_POLL_MAXIMUM_MS, wait * 2)
      current = await call('get_upload', ids, { signal })
    }
    if (current.state === 'open') {
      throw new HimringApiError('invalid_response', `The API left the upload ${upload.id} open after completing it.`)
    }
    return current
  }

  async function sentAndSettled(
    ids: UploadIds,
    created: CreateUploadOutput,
    content: UploadContent,
    options: TransferOptions,
  ): Promise<UploadRecord> {
    const { upload } = created
    try {
      if (upload.method === 'single') await sendSingle(ids, upload, created.parts[0], content, options)
      else await sendMultipart(ids, upload, content, options)
    } catch (error) {
      if (!(error instanceof HimringApiError && error.code === 'upload_closed')) throw error
      return settled(ids, await call('get_upload', ids), options.signal)
    }
    return settled(ids, await call('complete_upload', ids), options.signal)
  }

  async function cancelQuietly(ids: UploadIds): Promise<void> {
    try {
      await call('cancel_upload', ids)
    } catch {
      return
    }
  }

  async function addFile(input: AddFileInput, options: TransferOptions = {}): Promise<AddedFile> {
    if (!isUploadContent(input.content)) {
      throw invalidInput('Send the file under content, as a Blob, a Uint8Array, or an upload source.', 'content')
    }
    if (input.content_sha256 !== undefined && !SHA256_HEX_PATTERN.test(input.content_sha256)) {
      throw invalidInput('Send content_sha256 as 64 lowercase hexadecimal characters.', 'content_sha256')
    }
    const source = uploadSourceOf(input.content)
    const sha256 = input.content_sha256 ?? (await contentSha256Of(input.content, options.signal))
    const created = await call(
      'create_upload',
      {
        project_id: input.project_id,
        knowledge_base_id: input.knowledge_base_id,
        path: input.path,
        address: input.address,
        size_bytes: source.sizeBytes,
        content_sha256: sha256,
        metadata: input.metadata,
      },
      { signal: options.signal },
    )
    const upload = created.upload
    if (upload.state !== 'open') return addedFileOf(checkedRecord(upload, source.sizeBytes, sha256))
    const ids = { project_id: input.project_id, knowledge_base_id: input.knowledge_base_id, upload_id: upload.id }
    try {
      checkedPartLayout(checkedRecord(upload, source.sizeBytes, sha256), source.sizeBytes)
      const finished = await sentAndSettled(ids, created, input.content, options)
      return addedFileOf(checkedRecord(finished, source.sizeBytes, sha256))
    } catch (error) {
      if (!(error instanceof HimringApiError && error.kind === 'refused' && error.code !== undefined)) {
        await cancelQuietly(ids)
      }
      throw error
    }
  }

  async function downloadFile(input: DownloadFileInput, options: TransferOptions = {}): Promise<Download> {
    const { range, version, ...target } = input
    const link = await call(
      'get_download_link',
      { ...target, version: String(version), disposition: 'attachment' },
      { signal: options.signal },
    )
    const response = await getFromStorage(storage, link.url, range === undefined ? {} : { range }, options.signal)
    if ((response.status !== HTTP_OK && response.status !== HTTP_PARTIAL_CONTENT) || response.body === null) {
      await response.body?.cancel()
      throw new HimringApiError('refused', `Storage refused the download with status ${response.status}.`, {
        status: response.status,
      })
    }
    const length = Number(response.headers.get('content-length') ?? Number.NaN)
    const stalled = () =>
      new HimringApiError(
        'timeout',
        `Storage sent no bytes of ${link.file_name} for ${storage.idleTimeoutMs} ms. Check the connection, then download it again.`,
        { status: response.status },
      )
    return {
      status: response.status,
      body: idleLimitedStream(response.body, storage.idleTimeoutMs, stalled, options.signal),
      file_name: link.file_name,
      content_type: link.content_type,
      content_length: Number.isSafeInteger(length) && length >= 0 ? length : undefined,
      content_range: response.headers.get('content-range') ?? undefined,
      accept_ranges: response.headers.get('accept-ranges') ?? undefined,
      entity_tag: link.entity_tag,
    }
  }

  return { addFile, downloadFile }
}
