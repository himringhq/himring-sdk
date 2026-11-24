import { stat } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { uploadLocalFile } from '@himring/sdk/folders'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import {
  type CommandContext,
  type ContextFor,
  type RecordExitCode,
  runCommand,
  signedInClient,
} from './command-context.js'
import { dryRunOf } from './dry-run.js'
import { addProjectOption } from './file-body-command.js'
import { addFileDownloadCommand } from './file-download-command.js'
import { addFolderUploadCommand, retryReporter } from './folder-upload-command.js'
import { checkInput } from './spec-schemas.js'
import { isRecord } from './text-cells.js'
import { UsageError } from './usage-error.js'

const OPERATION = 'create_upload'
const ADDED_FILE_FIELDS = ['project_id', 'knowledge_base_id', 'path', 'address', 'metadata'] as const

const commandOptionsSchema = v.object({
  project: v.optional(v.string()),
  knowledgeBase: v.optional(v.string()),
  from: v.optional(v.string()),
  path: v.optional(v.string()),
  address: v.optional(v.string()),
  metadata: v.optional(v.string()),
  dryRun: v.optional(v.boolean()),
})

type CommandOptions = v.InferOutput<typeof commandOptionsSchema>

const ADD_EXAMPLES = `
Examples:
  $ himring files add --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from ./refunds.pdf
  $ himring files add --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from ./export/faq.html --path help/faq.html --address https://example.com/help/faq
  $ himring files add --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from ./travel.pdf --path policies/travel.pdf --metadata '{"department": "finance"}'`

const INPUT_SUGGESTION =
  'Pass --project and --knowledge-base, --path with a relative path that ends in an extension that Himring reads, and --metadata as a JSON object of text values.'

function isTextRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every(item => typeof item === 'string')
}

function metadataOf(text: string | undefined): Record<string, string> | undefined {
  if (text === undefined) return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new UsageError('--metadata is not valid JSON.', 'Pass --metadata as a JSON object of text values.')
  }
  if (!isTextRecord(parsed)) {
    throw new UsageError(
      '--metadata must be one JSON object of text values.',
      'Pass labels such as {"region": "emea"}.',
    )
  }
  return parsed
}

async function regularFileOf(path: string): Promise<{ absolutePath: string; sizeBytes: number }> {
  const absolutePath = resolve(path)
  const details = await stat(absolutePath).catch(() => undefined)
  if (details?.isFile() !== true) {
    throw new UsageError(`${path} is not a file that the CLI can read.`, 'Pass the path of a readable file to --from.')
  }
  return { absolutePath, sizeBytes: details.size }
}

function definedFieldsOf(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined))
}

async function addOne(context: CommandContext, options: CommandOptions): Promise<unknown> {
  if (options.from === undefined) throw new UsageError('The command needs a file.', 'Pass its path with --from.')
  const local = await regularFileOf(options.from)
  const metadata = metadataOf(options.metadata)
  const path = options.path ?? basename(local.absolutePath)
  const input = definedFieldsOf({
    project_id: options.project,
    knowledge_base_id: options.knowledgeBase,
    path,
    address: options.address,
    metadata,
  })
  checkInput(OPERATION, input, INPUT_SUGGESTION, ADDED_FILE_FIELDS)
  const { project_id: projectId, knowledge_base_id: knowledgeBaseId } = input
  if (typeof projectId !== 'string' || typeof knowledgeBaseId !== 'string') {
    throw new UsageError('The command needs a project and a knowledge base.', INPUT_SUGGESTION)
  }
  if (options.dryRun === true) {
    const sent = { path, address: options.address, metadata, from: local.absolutePath, size_bytes: local.sizeBytes }
    return dryRunOf(OPERATION, input, sent)
  }
  return uploadLocalFile({
    client: await signedInClient(context),
    projectId,
    knowledgeBaseId,
    absolutePath: local.absolutePath,
    path,
    address: options.address,
    metadata,
    onRetry: retryReporter(context),
  })
}

export function addFileCommands(program: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  const group = program.commands.find(command => command.name() === 'files')
  if (group === undefined) throw new Error('The files commands need the files group.')
  addProjectOption(
    group
      .command('add')
      .description(
        'Send one local file to a knowledge base. The CLI sends its bytes straight to storage through links that Himring signs for a few minutes. Himring skips the file when the knowledge base already holds the same content at that path, and keeps any other content as a new version.',
      ),
  )
    .addOption(new Option('--knowledge-base <value>', 'knowledge_base_id (required)'))
    .option('--from <path>', 'the local file to send (required)')
    .option('--path <value>', 'its path inside the knowledge base, by default the name of the file')
    .option('--address <value>', 'the web address that a citation of this file links to')
    .option(
      '--metadata <json>',
      'labels that a search can filter by, as a JSON object of text values, which replace the labels that the file had',
    )
    .option('--dry-run', 'check the input and show the request, without sending it')
    .addHelpText('after', ADD_EXAMPLES)
    .action(async (_options: unknown, invoked: Command) => {
      const context = contextFor(invoked)
      if (context === undefined) return
      const options = v.parse(commandOptionsSchema, invoked.opts())
      recordExitCode(await runCommand(context, () => addOne(context, options)))
    })
  addFolderUploadCommand(group, contextFor, recordExitCode)
  addFileDownloadCommand(group, contextFor, recordExitCode)
}
