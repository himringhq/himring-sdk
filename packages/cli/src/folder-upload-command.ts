import { stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describeError, HimringApiError } from '@himring/sdk'
import {
  ATTEMPTS_PER_REQUEST,
  type FileRetryNotice,
  type FolderSyncReport,
  SYNC_CONCURRENCY_DEFAULT,
  SYNC_CONCURRENCY_MAXIMUM,
  type SyncFailure,
  syncFolder,
} from '@himring/sdk/folders'
import { type Command, InvalidArgumentError, Option } from 'commander'
import * as v from 'valibot'
import {
  type CommandContext,
  type ContextFor,
  PartialResult,
  type RecordExitCode,
  runCommand,
  signedInClient,
} from './command-context.js'
import { EXIT_CODES, type ExitCode, exitCodeForApiError } from './exit-codes.js'
import { addProjectOption } from './file-body-command.js'
import { wholeNumberInRangeOf } from './option-values.js'
import { checkInput } from './spec-schemas.js'
import { UsageError } from './usage-error.js'

const TARGET_OPERATION = 'create_upload'
const TARGET_FIELDS = ['project_id', 'knowledge_base_id'] as const
const MILLISECONDS_PER_SECOND = 1_000

const commandOptionsSchema = v.object({
  project: v.optional(v.string()),
  knowledgeBase: v.optional(v.string()),
  folder: v.optional(v.string()),
  concurrency: v.optional(v.number()),
  dryRun: v.optional(v.boolean()),
  delete: v.optional(v.boolean()),
  yes: v.optional(v.boolean()),
})

type CommandOptions = v.InferOutput<typeof commandOptionsSchema>

const UPLOAD_EXAMPLES = `
Examples:
  $ himring files upload --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --folder ./policies
  $ himring files upload --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --folder ./policies --dry-run --output json
  $ himring files upload --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --folder ./policies --delete --yes`

export function retryReporter(context: CommandContext): (notice: FileRetryNotice) => void {
  return notice => {
    const seconds = Math.max(1, Math.round(notice.delayMs / MILLISECONDS_PER_SECOND))
    context.io.writeStderr(
      `${describeError(notice.error)} The CLI sends ${notice.path} again in ${seconds} s, as attempt ${notice.attempt + 1} of ${ATTEMPTS_PER_REQUEST}.\n`,
    )
  }
}

function parseConcurrency(value: string): number {
  const concurrency = wholeNumberInRangeOf(value, 1, SYNC_CONCURRENCY_MAXIMUM)
  if (concurrency !== undefined) return concurrency
  throw new InvalidArgumentError(`Pass a whole number from 1 to ${SYNC_CONCURRENCY_MAXIMUM}.`)
}

function targetOf(options: CommandOptions): { projectId: string; knowledgeBaseId: string } {
  const { project, knowledgeBase } = options
  const input = {
    ...(project === undefined ? {} : { project_id: project }),
    ...(knowledgeBase === undefined ? {} : { knowledge_base_id: knowledgeBase }),
  }
  checkInput(TARGET_OPERATION, input, 'Pass --project and --knowledge-base.', TARGET_FIELDS)
  if (project === undefined || knowledgeBase === undefined) {
    throw new UsageError('The command needs a project and a knowledge base.', 'Pass --project and --knowledge-base.')
  }
  return { projectId: project, knowledgeBaseId: knowledgeBase }
}

function summaryOf(report: FolderSyncReport) {
  const count = (outcome: string) => report.files.filter(file => file.outcome === outcome).length
  return {
    uploads: [
      ...report.files.map(file => ({
        path: file.path,
        outcome: file.outcome,
        size_bytes: file.sizeBytes ?? null,
        file_id: file.fileId ?? null,
        detail: file.failure?.message ?? null,
      })),
      ...report.ignored.map(entry => ({
        path: entry.path,
        outcome: 'ignored',
        size_bytes: null,
        file_id: null,
        detail: entry.reason,
      })),
    ],
    added: count('added'),
    new_versions: count('new_version'),
    unchanged: count('unchanged') + count('skipped'),
    planned: count('planned'),
    deleted: count('deleted'),
    planned_deletions: count('planned_deletion'),
    failed: count('failed'),
    not_sent: count('not_sent'),
    ignored: report.ignored.length,
    stopped_by: report.stoppedBy?.message ?? null,
  }
}

function exitCodeOfStop(stop: SyncFailure): ExitCode {
  const kind = stop.status === undefined ? 'network' : 'refused'
  return exitCodeForApiError(new HimringApiError(kind, stop.message, { status: stop.status, code: stop.code }))
}

async function syncedReport(context: CommandContext, options: CommandOptions, root: string): Promise<FolderSyncReport> {
  const interrupted = new AbortController()
  const stopOnInterrupt = () => interrupted.abort()
  process.once('SIGINT', stopOnInterrupt)
  try {
    return await syncFolder({
      client: await signedInClient(context),
      ...targetOf(options),
      root,
      concurrency: options.concurrency ?? SYNC_CONCURRENCY_DEFAULT,
      dryRun: options.dryRun === true,
      deleteMissing: options.delete === true,
      signal: interrupted.signal,
      onRetry: retryReporter(context),
    })
  } finally {
    process.off('SIGINT', stopOnInterrupt)
  }
}

async function uploadFolder(context: CommandContext, options: CommandOptions): Promise<unknown> {
  if (options.folder === undefined) throw new UsageError('The command needs a folder.', 'Pass its path with --folder.')
  targetOf(options)
  const root = resolve(options.folder)
  const details = await stat(root).catch(() => undefined)
  if (details?.isDirectory() !== true) {
    throw new UsageError(`${options.folder} is not a folder that the CLI can read.`, 'Pass a folder to --folder.')
  }
  if (options.delete === true && options.dryRun !== true && options.yes !== true) {
    throw new UsageError(
      'The upload deletes each file of the knowledge base that the folder no longer holds, so it needs your confirmation.',
      'Pass --yes to go ahead, or --dry-run to list those files first.',
    )
  }
  const report = await syncedReport(context, options, root)
  const summary = summaryOf(report)
  if (report.stoppedBy !== undefined) {
    return new PartialResult(
      summary,
      {
        code: report.stoppedBy.code ?? 'upload_stopped',
        message: `The upload stopped: ${report.stoppedBy.message}`,
        suggestion: 'Fix the cause, then run the same command again. It skips the files already sent.',
      },
      exitCodeOfStop(report.stoppedBy),
    )
  }
  if (summary.failed > 0) {
    return new PartialResult(
      summary,
      {
        code: 'upload_partly_failed',
        message: `${summary.failed} of the files failed to send. Their rows give the reason.`,
        suggestion: 'Fix those files, then run the same command again. It skips the files already sent.',
      },
      EXIT_CODES.partialFailure,
    )
  }
  return summary
}

export function addFolderUploadCommand(group: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  addProjectOption(
    group
      .command('upload')
      .description(
        'Send every file of a local folder that Himring reads, with its path inside the folder. Files whose content the knowledge base already holds are skipped, and hidden files, symbolic links, and files of other kinds stay local.',
      ),
  )
    .addOption(new Option('--knowledge-base <value>', 'knowledge_base_id (required)'))
    .requiredOption('--folder <path>', 'the local folder to send')
    .addOption(
      new Option('--concurrency <number>', `how many files to send at once, from 1 to ${SYNC_CONCURRENCY_MAXIMUM}`)
        .default(SYNC_CONCURRENCY_DEFAULT)
        .argParser(parseConcurrency),
    )
    .option(
      '--delete',
      'also delete each file of the knowledge base that the folder no longer holds, which you can restore until Himring purges it',
    )
    .option('--yes', 'confirm the deletions that --delete makes')
    .option('--dry-run', 'list the files that the upload would send or delete, without changing anything')
    .addHelpText('after', UPLOAD_EXAMPLES)
    .action(async (_options: unknown, invoked: Command) => {
      const context = contextFor(invoked)
      if (context === undefined) return
      const options = v.parse(commandOptionsSchema, invoked.opts())
      recordExitCode(await runCommand(context, () => uploadFolder(context, options)))
    })
}
