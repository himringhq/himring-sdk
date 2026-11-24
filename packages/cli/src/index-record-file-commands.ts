import { extname } from 'node:path'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import { type ContextFor, type RecordExitCode, runCommand } from './command-context.js'
import { addProjectOption, choicesOf, sendFileBody } from './file-body-command.js'
import { UsageError } from './usage-error.js'

const OPERATION = 'import_index_records'

const commandOptionsSchema = v.object({
  project: v.optional(v.string()),
  index: v.optional(v.string()),
  from: v.optional(v.string()),
  format: v.optional(v.string()),
  dryRun: v.optional(v.boolean()),
})

type CommandOptions = v.InferOutput<typeof commandOptionsSchema>

const FORMAT_OF_EXTENSION: ReadonlyMap<string, string> = new Map([
  ['.json', 'json'],
  ['.ndjson', 'ndjson'],
  ['.jsonl', 'ndjson'],
  ['.csv', 'csv'],
])

const IMPORT_EXAMPLES = `
Examples:
  $ himring records import --index ix_8c4b2a0f1e3d5c7b9a8f6e4d2c0b1a3f --from articles.ndjson
  $ himring records import --index ix_8c4b2a0f1e3d5c7b9a8f6e4d2c0b1a3f --from articles.csv --output json

A JSON file holds a list of records, an NDJSON file holds one record on each line, and a CSV file starts with a header row of field names, where a dotted name such as author.name fills a nested field.`

function formatOf(options: CommandOptions): string | undefined {
  if (options.format !== undefined) return options.format
  if (options.from === undefined) return undefined
  const choices = choicesOf(OPERATION, 'format')
  const format = FORMAT_OF_EXTENSION.get(extname(options.from).toLowerCase())
  if (format === undefined || !choices.includes(format)) {
    throw new UsageError(
      `The CLI cannot tell the format of ${options.from} from its extension.`,
      `Pass --format with one of ${choices.join(', ')}.`,
    )
  }
  return format
}

export function addIndexRecordFileCommands(
  program: Command,
  contextFor: ContextFor,
  recordExitCode: RecordExitCode,
): void {
  const group = program.commands.find(command => command.name() === 'records')
  if (group === undefined) throw new Error('The import command needs the records group.')
  addProjectOption(group.command('import').description(HIMRING_OPERATION_CATALOGUE[OPERATION].summary))
    .addOption(new Option('--index <value>', 'index_id (required)'))
    .requiredOption('--from <path>', 'the local file of records, in JSON, NDJSON, or CSV')
    .addOption(
      new Option(
        '--format <value>',
        'the format of the file, by default from its extension: .json, .ndjson or .jsonl, or .csv',
      ).choices(choicesOf(OPERATION, 'format')),
    )
    .option('--dry-run', 'check the input and show the request, without sending it')
    .addHelpText('after', IMPORT_EXAMPLES)
    .action(async (_options: unknown, invoked: Command) => {
      const context = contextFor(invoked)
      if (context === undefined) return
      const options = v.parse(commandOptionsSchema, invoked.opts())
      recordExitCode(
        await runCommand(context, () =>
          sendFileBody(context, {
            id: OPERATION,
            input: { project_id: options.project, index_id: options.index, format: formatOf(options) },
            from: options.from,
            dryRun: options.dryRun === true,
            suggestion: 'Pass --project and --index.',
            splitHint: 'Split the records into several files and import each one.',
          }),
        ),
      )
    })
}
