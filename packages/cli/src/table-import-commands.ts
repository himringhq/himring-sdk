import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { type Command, Option } from 'commander'
import * as v from 'valibot'
import { type ContextFor, type RecordExitCode, runCommand } from './command-context.js'
import { addProjectOption, sendFileBody } from './file-body-command.js'

const OPERATION = 'upload_table_import'

const commandOptionsSchema = v.object({
  project: v.optional(v.string()),
  database: v.optional(v.string()),
  tableName: v.optional(v.string()),
  from: v.optional(v.string()),
  dryRun: v.optional(v.boolean()),
})

const UPLOAD_EXAMPLES = `
Examples:
  $ himring imports upload --database db_3a9e5c7b1d2f4e6a8c0b9d7f5e3a1c2b --table-name orders --from orders.csv
  $ himring imports upload --database db_3a9e5c7b1d2f4e6a8c0b9d7f5e3a1c2b --table-name suppliers --from suppliers.xlsx --output json

The first row of the file holds the column names. Then map them with himring imports check, and insert the rows with himring imports apply.`

export function addTableImportCommands(program: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  const group = program.commands.find(command => command.name() === 'imports')
  if (group === undefined) throw new Error('The upload command needs the imports group.')
  addProjectOption(group.command('upload').description(HIMRING_OPERATION_CATALOGUE[OPERATION].summary))
    .addOption(new Option('--database <value>', 'database_id (required)'))
    .addOption(new Option('--table-name <value>', 'table_name, of a table that exists or a new one (required)'))
    .requiredOption('--from <path>', 'the local CSV or XLSX file')
    .option('--dry-run', 'check the input and show the request, without sending it')
    .addHelpText('after', UPLOAD_EXAMPLES)
    .action(async (_options: unknown, invoked: Command) => {
      const context = contextFor(invoked)
      if (context === undefined) return
      const options = v.parse(commandOptionsSchema, invoked.opts())
      recordExitCode(
        await runCommand(context, () =>
          sendFileBody(context, {
            id: OPERATION,
            input: { project_id: options.project, database_id: options.database, table_name: options.tableName },
            from: options.from,
            dryRun: options.dryRun === true,
            suggestion: 'Pass --project, --database, and --table-name.',
            splitHint: 'Split the rows into several files and import each one.',
          }),
        ),
      )
    })
}
