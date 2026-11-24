import { extname } from 'node:path'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import type { ContextFor, RecordExitCode } from './command-context.js'
import { runCommand } from './command-context.js'
import { addProjectOption, choicesOf, sendFileBody } from './file-body-command.js'

const OPERATION = 'import_saved_questions'
const CSV_FORMAT = 'csv'
const LINES_FORMAT = 'jsonl'
const CSV_EXTENSION = '.csv'

const commandOptionsSchema = v.object({
  project: v.optional(v.string()),
  knowledgeBase: v.optional(v.string()),
  from: v.optional(v.string()),
  format: v.optional(v.string()),
  dryRun: v.optional(v.boolean()),
})

type CommandOptions = v.InferOutput<typeof commandOptionsSchema>

const IMPORT_EXAMPLES = `
Examples:
  $ himring saved-questions import --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from questions.jsonl
  $ himring saved-questions import --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from questions.csv --output json

Each JSON line holds {"question": "...", "file": "policies/refunds.pdf", "quote": "..."}, and a CSV file starts with the header row question,file,quote.`

function formatOf(options: CommandOptions): string {
  if (options.format !== undefined) return options.format
  return options.from !== undefined && extname(options.from).toLowerCase() === CSV_EXTENSION ? CSV_FORMAT : LINES_FORMAT
}

export function addQuestionFileCommands(
  program: Command,
  contextFor: ContextFor,
  recordExitCode: RecordExitCode,
): void {
  const group = program.commands.find(command => command.name() === 'saved-questions')
  if (group === undefined) throw new Error('The import command needs the saved-questions group.')
  addProjectOption(group.command('import').description(HIMRING_OPERATION_CATALOGUE[OPERATION].summary))
    .addOption(new Option('--knowledge-base <value>', 'knowledge_base_id (required)'))
    .requiredOption('--from <path>', 'the local file of questions, in JSON Lines or CSV')
    .addOption(
      new Option(
        '--format <value>',
        'the format of the file, by default csv for a .csv file and jsonl otherwise',
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
            input: { project_id: options.project, knowledge_base_id: options.knowledgeBase, format: formatOf(options) },
            from: options.from,
            dryRun: options.dryRun === true,
            suggestion: 'Pass --project and --knowledge-base.',
            splitHint: 'Split the questions into several files and import each one.',
          }),
        ),
      )
    })
}
