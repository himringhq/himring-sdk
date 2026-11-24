import { describeError, isHimringApiError } from '../core/errors.js'
import type { AddedFile } from '../files/file-transfers.js'
import type { ListFilesOutput } from '../generated/types.js'
import { confirmDirectory, directoryBoundaryOf } from './directory-boundary.js'
import { type FileRetryNotice, type KnowledgeBaseTarget, sendOpenedFile } from './file-upload.js'
import { FOLDER_RULES } from './folder-rules.js'
import { byPath, type IgnoredEntry, type LocalFile, localFilesOf } from './local-files.js'
import { type OpenedFile, openLocalFile } from './opened-file.js'
import { isUnreachable, withRetries } from './retry.js'

export const SYNC_CONCURRENCY_DEFAULT = 4
export const SYNC_CONCURRENCY_MAXIMUM = 16

const FATAL_STATUSES: ReadonlySet<number> = new Set([401, 403, 404])
const CREDENTIAL_REFUSED_STATUSES: ReadonlySet<number> = new Set([401, 403])
const STOPPED_MESSAGE = 'The upload was stopped before every file was sent.'
const UNREACHABLE_FILES_TO_STOP = 3

export type SyncedFileOutcome =
  | AddedFile['outcome']
  | 'skipped'
  | 'planned'
  | 'failed'
  | 'not_sent'
  | 'deleted'
  | 'planned_deletion'

export interface SyncFailure {
  message: string
  code?: string | undefined
  status?: number | undefined
}

export interface SyncedFile {
  path: string
  outcome: SyncedFileOutcome
  sizeBytes?: number | undefined
  fileId?: string | undefined
  failure?: SyncFailure | undefined
}

export interface SyncProgress {
  filesFinished: number
  filesTotal: number
  bytesSent: number
}

export interface FolderSyncReport {
  files: SyncedFile[]
  ignored: IgnoredEntry[]
  stoppedBy: SyncFailure | undefined
}

export interface SyncFolderOptions extends KnowledgeBaseTarget {
  root: string
  pathPrefix?: readonly string[] | undefined
  concurrency?: number | undefined
  dryRun?: boolean | undefined
  deleteMissing?: boolean | undefined
  signal?: AbortSignal | undefined
  onFile?: ((file: SyncedFile) => void) | undefined
  onRetry?: ((notice: FileRetryNotice) => void) | undefined
  onProgress?: ((progress: SyncProgress) => void) | undefined
}

type LiveFile = Pick<ListFilesOutput['files'][number], 'id' | 'path' | 'content_sha256' | 'status' | 'unread_parts'>

async function liveFilesOf(target: KnowledgeBaseTarget, signal: AbortSignal | undefined) {
  const live = new Map<string, LiveFile>()
  for (let offset = 0; offset <= FOLDER_RULES.listOffsetMaximum; ) {
    const from = offset
    const page = await withRetries(
      () =>
        target.client.listFiles(
          {
            project_id: target.projectId,
            knowledge_base_id: target.knowledgeBaseId,
            state: 'live',
            sort: 'path',
            direction: 'asc',
            limit: String(FOLDER_RULES.listPageMaximum),
            offset: String(from),
          },
          { signal },
        ),
      { signal },
    )
    for (const file of page.files) live.set(file.path, file)
    offset += page.files.length
    if (page.files.length === 0 || offset >= page.total_count) break
  }
  return live
}

function concurrencyOf(requested: number | undefined): number {
  const concurrency = requested ?? SYNC_CONCURRENCY_DEFAULT
  if (Number.isSafeInteger(concurrency) && concurrency >= 1 && concurrency <= SYNC_CONCURRENCY_MAXIMUM) {
    return concurrency
  }
  throw new RangeError(`Choose a concurrency from 1 to ${SYNC_CONCURRENCY_MAXIMUM}.`)
}

export function failureOf(error: unknown): SyncFailure {
  if (!isHimringApiError(error)) return { message: describeError(error) }
  return { message: describeError(error), code: error.code, status: error.status }
}

function refusesEveryFile(error: unknown): boolean {
  return isHimringApiError(error) && error.status !== undefined && FATAL_STATUSES.has(error.status)
}

function isSkippable(live: LiveFile | undefined, sha256: string): boolean {
  return (
    live !== undefined && live.status !== 'failed' && live.unread_parts.length === 0 && live.content_sha256 === sha256
  )
}

async function runInLanes<Item>(
  items: readonly Item[],
  concurrency: number,
  work: (item: Item, index: number) => Promise<void>,
  stopped: () => boolean,
): Promise<void> {
  let next = 0
  async function lane(): Promise<void> {
    while (!stopped() && next < items.length) {
      const index = next
      next += 1
      const item = items[index]
      if (item !== undefined) await work(item, index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane))
}

export async function syncFolder(options: SyncFolderOptions): Promise<FolderSyncReport> {
  const concurrency = concurrencyOf(options.concurrency)
  const boundary = await directoryBoundaryOf(options.root)
  const folder = await localFilesOf(boundary.path, options.pathPrefix)
  const live = await liveFilesOf(options, options.signal)
  const results: (SyncedFile | undefined)[] = folder.files.map(file => ({ path: file.path, outcome: 'not_sent' }))
  const ignored = [...folder.ignored]
  let stoppedBy: SyncFailure | undefined
  let unreachableInARow = 0
  const progress: SyncProgress = { filesFinished: 0, filesTotal: folder.files.length, bytesSent: 0 }

  function reportProgress(): void {
    options.onProgress?.({ ...progress })
  }

  function countBytes(byteCount: number): void {
    progress.bytesSent += byteCount
    reportProgress()
  }

  function stopped(): boolean {
    if (stoppedBy === undefined && options.signal?.aborted === true) stoppedBy = { message: STOPPED_MESSAGE }
    return stoppedBy !== undefined
  }

  async function syncOpened(file: LocalFile, opened: OpenedFile): Promise<SyncedFile | undefined> {
    const digest = await opened.digest()
    if (digest.sizeBytes === 0) {
      ignored.push({ path: file.path, reason: 'The file is empty, and Himring reads only files with content.' })
      return undefined
    }
    const base = { path: file.path, sizeBytes: digest.sizeBytes }
    if (isSkippable(live.get(file.path), digest.sha256)) return { ...base, outcome: 'skipped' }
    if (options.dryRun === true) return { ...base, outcome: 'planned' }
    const added = await sendOpenedFile(options, opened, digest, file.path, { ...options, onBytes: countBytes })
    return { ...base, outcome: added.outcome, fileId: added.file.id }
  }

  async function syncOne(file: LocalFile, index: number): Promise<void> {
    let result: SyncedFile | undefined
    try {
      const opened = await openLocalFile(file.absolutePath, boundary)
      try {
        result = await syncOpened(file, opened)
      } finally {
        await opened.close()
      }
      unreachableInARow = 0
    } catch (error) {
      result = { path: file.path, outcome: 'failed', failure: failureOf(error) }
      unreachableInARow = isUnreachable(error) ? unreachableInARow + 1 : 0
      if (refusesEveryFile(error) || unreachableInARow >= UNREACHABLE_FILES_TO_STOP) stoppedBy = result.failure
    }
    results[index] = result
    progress.filesFinished += 1
    if (result !== undefined) options.onFile?.(result)
    reportProgress()
  }

  await runInLanes(folder.files, concurrency, syncOne, stopped)
  function stopWith(failure: SyncFailure): void {
    stoppedBy ??= failure
  }

  const deletions =
    options.deleteMissing === true && !stopped()
      ? await deleteMissing(options, { files: folder.files, ignored }, live, stopped, stopWith, () =>
          confirmDirectory(boundary),
        )
      : []
  return {
    files: [...results.filter(result => result !== undefined), ...deletions],
    ignored: ignored.sort(byPath),
    stoppedBy,
  }
}

function isInsideKeptFolder(path: string, kept: ReadonlySet<string>): boolean {
  for (let cut = path.indexOf('/'); cut !== -1; cut = path.indexOf('/', cut + 1)) {
    if (kept.has(path.slice(0, cut))) return true
  }
  return false
}

async function deleteMissing(
  options: SyncFolderOptions,
  local: { files: readonly LocalFile[]; ignored: readonly IgnoredEntry[] },
  live: ReadonlyMap<string, LiveFile>,
  stopped: () => boolean,
  stopWith: (failure: SyncFailure) => void,
  confirmRoot: () => Promise<void>,
): Promise<SyncedFile[]> {
  const ignoredPaths = new Set(local.ignored.map(entry => entry.path.normalize('NFC')))
  const present = new Set([...local.files.map(file => file.path), ...ignoredPaths])
  const prefix =
    options.pathPrefix === undefined || options.pathPrefix.length === 0 ? '' : `${options.pathPrefix.join('/')}/`
  const missing = [...live.values()].filter(
    file => file.path.startsWith(prefix) && !present.has(file.path) && !isInsideKeptFolder(file.path, ignoredPaths),
  )
  const deleted: SyncedFile[] = []

  async function deletionOf(file: LiveFile): Promise<SyncedFile> {
    const base = { path: file.path, fileId: file.id }
    await confirmRoot()
    if (options.dryRun === true) return { ...base, outcome: 'planned_deletion' }
    try {
      await withRetries(
        async () => {
          await confirmRoot()
          return options.client.deleteFile(
            { project_id: options.projectId, knowledge_base_id: options.knowledgeBaseId, file_id: file.id },
            { signal: options.signal },
          )
        },
        { signal: options.signal },
      )
      return { ...base, outcome: 'deleted' }
    } catch (error) {
      const failure = failureOf(error)
      if (isHimringApiError(error) && error.status !== undefined && CREDENTIAL_REFUSED_STATUSES.has(error.status)) {
        stopWith(failure)
      }
      return { ...base, outcome: 'failed', failure }
    }
  }

  async function deleteOne(file: LiveFile): Promise<void> {
    const result = await deletionOf(file)
    deleted.push(result)
    options.onFile?.(result)
  }

  await runInLanes(missing, concurrencyOf(options.concurrency), deleteOne, stopped)
  return deleted.sort(byPath)
}
