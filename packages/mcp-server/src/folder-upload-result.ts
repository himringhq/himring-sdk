import type { FolderSyncReport, SyncedFile, SyncProgress } from '@himring/sdk/folders'

export const LISTED_ROWS_MAXIMUM = 100

const PROGRESS_INTERVAL_MS = 500

type ProgressToken = string | number

interface ListedRow {
  path: string
  outcome: string
  message: string | null
  code: string | null
  status: number | null
}

export interface ProgressNotification {
  method: 'notifications/progress'
  params: { progressToken: ProgressToken; progress: number; message: string }
}

function countOf(report: FolderSyncReport, ...outcomes: readonly string[]): number {
  return report.files.filter(file => outcomes.includes(file.outcome)).length
}

function rowOf(file: SyncedFile): ListedRow {
  return {
    path: file.path,
    outcome: file.outcome,
    message: file.failure?.message ?? null,
    code: file.failure?.code ?? null,
    status: file.failure?.status ?? null,
  }
}

function listedOutcomes(dryRun: boolean): ReadonlySet<string> {
  return new Set(dryRun ? ['failed', 'planned', 'planned_deletion'] : ['failed'])
}

export function folderUploadResult(report: FolderSyncReport, dryRun: boolean): Record<string, unknown> {
  const listed = listedOutcomes(dryRun)
  const notable = report.files.filter(file => listed.has(file.outcome))
  const rows = notable.slice(0, LISTED_ROWS_MAXIMUM).map(rowOf)
  const omitted = notable.length - rows.length
  return {
    counts: {
      added: countOf(report, 'added'),
      new_versions: countOf(report, 'new_version'),
      unchanged: countOf(report, 'unchanged', 'skipped'),
      planned: countOf(report, 'planned'),
      failed: countOf(report, 'failed'),
      not_sent: countOf(report, 'not_sent'),
      ignored: report.ignored.length,
    },
    rows,
    omitted_rows: omitted,
    note:
      omitted === 0
        ? null
        : `The result lists ${rows.length} of the ${notable.length} files that failed${dryRun ? ' or that the upload would send' : ''}. Call upload_folder again after you fix the cause, and it skips the files already sent.`,
    stopped_by: report.stoppedBy ?? null,
  }
}

function progressMessage(progress: SyncProgress): string {
  return `Finished ${progress.filesFinished} of ${progress.filesTotal} files, after sending ${progress.bytesSent} bytes.`
}

export function progressReporter(
  progressToken: ProgressToken | undefined,
  notify: (notification: ProgressNotification) => Promise<void>,
): ((progress: SyncProgress) => void) | undefined {
  if (progressToken === undefined) return undefined
  let lastSentAt = 0
  let lastValue = -1
  return progress => {
    const value = progress.filesFinished + progress.bytesSent
    const now = Date.now()
    const finished = progress.filesFinished === progress.filesTotal
    if (value <= lastValue || (!finished && now - lastSentAt < PROGRESS_INTERVAL_MS)) return
    lastSentAt = now
    lastValue = value
    notify({
      method: 'notifications/progress',
      params: { progressToken, progress: value, message: progressMessage(progress) },
    }).catch(() => undefined)
  }
}
