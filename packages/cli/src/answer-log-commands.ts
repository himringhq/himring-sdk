import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import { type ContextFor, type RecordExitCode, runCommand } from './command-context.js'
import { addProjectOption, sendFileBody } from './file-body-command.js'

const OPERATION = 'import_answer_log'

const commandOptionsSchema = v.object({
  project: v.optional(v.string()),
  knowledgeBase: v.optional(v.string()),
  from: v.optional(v.string()),
  dryRun: v.optional(v.boolean()),
})

const IMPORT_EXAMPLES = `
Examples:
  $ himring answer-events import --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from answers.jsonl
  $ himring answer-events import --knowledge-base kb_3f9a0c1e2d4b6a8c0e2f4a6b8c0d2e4f --from answers.jsonl --output json

Each JSON line holds one event, such as {"question_id": "qst_...", "answer": "...", "follow_up": "...", "thumbs_down": true}.`

export function addAnswerLogCommands(program: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  const group = program.commands.find(command => command.name() === 'answer-events')
  if (group === undefined) throw new Error('The import command needs the answer-events group.')
  addProjectOption(group.command('import').description(HIMRING_OPERATION_CATALOGUE[OPERATION].summary))
    .addOption(new Option('--knowledge-base <value>', 'knowledge_base_id (required)'))
    .requiredOption('--from <path>', 'the local log of answers, in JSON Lines')
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
            input: { project_id: options.project, knowledge_base_id: options.knowledgeBase },
            from: options.from,
            dryRun: options.dryRun === true,
            suggestion: 'Pass --project and --knowledge-base.',
            splitHint: 'Split the log into several files and import each one.',
          }),
        ),
      )
    })
}
