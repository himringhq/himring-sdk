import type { FileRendition } from '@himring/sdk'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import {
  type CommandContext,
  type ContextFor,
  type RecordExitCode,
  runCommand,
  signedInClient,
} from './command-context.js'
import { saveDownloadTo } from './download-target.js'
import { addProjectOption, choicesOf } from './file-body-command.js'
import { checkInput } from './spec-schemas.js'

const OPERATION = 'get_download_link'
const DOWNLOAD_FIELDS = ['project_id', 'knowledge_base_id', 'file_id', 'version', 'rendition'] as const

const downloadOptionsSchema = v.object({
  project: v.optional(v.string()),
  knowledgeBase: v.optional(v.string()),
  file: v.optional(v.string()),
  version: v.optional(v.string()),
  rendition: v.optional(v.string()),
  out: v.optional(v.string()),
  force: v.optional(v.boolean()),
})

type DownloadOptions = v.InferOutput<typeof downloadOptionsSchema>

const DOWNLOAD_EXAMPLES = `
Examples:
  $ himring files download --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --file fil_0a1b2c3d4e5f60718293a4b5c6d7e8f9 --version 2
  $ himring files download --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --file fil_0a1b2c3d4e5f60718293a4b5c6d7e8f9 --version 1 --rendition pdf --out handbook.pdf`

function isRendition(value: string): value is FileRendition {
  return choicesOf(OPERATION, 'rendition').includes(value)
}

function definedOnly(input: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(input).filter((entry): entry is [string, string] => entry[1] !== undefined))
}

async function downloadOne(context: CommandContext, options: DownloadOptions): Promise<unknown> {
  const input = definedOnly({
    project_id: options.project,
    knowledge_base_id: options.knowledgeBase,
    file_id: options.file,
    version: options.version,
    rendition: options.rendition,
  })
  checkInput(OPERATION, input, 'Pass --project, --knowledge-base, --file, and --version.', DOWNLOAD_FIELDS)
  const { project_id, knowledge_base_id, file_id, version, rendition } = input
  if (project_id === undefined || knowledge_base_id === undefined || file_id === undefined || version === undefined) {
    throw new Error('The checked download input lost a required field.')
  }
  const client = await signedInClient(context)
  const download = await client.downloadFile({
    project_id,
    knowledge_base_id,
    file_id,
    version: Number(version),
    ...(rendition !== undefined && isRendition(rendition) ? { rendition } : {}),
  })
  return saveDownloadTo(download, {
    out: options.out,
    force: options.force === true,
    idleTimeoutMs: context.options.timeoutMs,
  })
}

export function addFileDownloadCommand(group: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  addProjectOption(
    group
      .command('download')
      .description(
        'Download one version of a file straight from storage, through a link that Himring signs for a few minutes, or with --rendition pdf the PDF that Himring made of a Word file or a slide deck.',
      ),
  )
    .addOption(new Option('--knowledge-base <value>', 'knowledge_base_id (required)'))
    .option('--file <value>', 'file_id (required)')
    .option('--version <value>', 'the version of the file (required)')
    .addOption(
      new Option('--rendition <value>', 'pdf for the PDF that Himring made of the file').choices(
        choicesOf(OPERATION, 'rendition'),
      ),
    )
    .option(
      '--out <path>',
      'write the file to this path; without it, the CLI writes the file under its own name in this folder',
    )
    .option('--force', 'replace a file that already exists')
    .addHelpText('after', DOWNLOAD_EXAMPLES)
    .action(async (_options: unknown, invoked: Command) => {
      const context = contextFor(invoked)
      if (context === undefined) return
      const options = v.parse(downloadOptionsSchema, invoked.opts())
      recordExitCode(await runCommand(context, () => downloadOne(context, options)))
    })
}
