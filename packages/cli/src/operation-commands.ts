import { HIMRING_OPERATIONS, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import type { Command } from 'commander'
import {
  type CommandContext,
  type ContextFor,
  type RecordExitCode,
  runCommand,
  signedInClient,
} from './command-context.js'
import { saveDownloadTo } from './download-target.js'
import { dryRunOf, withoutPathFields } from './dry-run.js'
import type { ExitCode } from './exit-codes.js'
import { addFieldOptions, type FieldOption, fieldOptionsOf, inputFrom } from './operation-fields.js'
import { type CommandSpec, OPERATION_COMMANDS, RESOURCE_DESCRIPTIONS } from './operation-specs.js'
import { checkInput, checkOutput } from './spec-schemas.js'
import { isRecord } from './text-cells.js'
import { UsageError } from './usage-error.js'

const INPUT_SUGGESTION = 'Correct the options and try again.'

function isCommandOperation(id: string): id is keyof typeof OPERATION_COMMANDS {
  return Object.hasOwn(OPERATION_COMMANDS, id) && Object.hasOwn(HIMRING_OPERATIONS, id)
}

async function runOperation(
  context: CommandContext,
  id: HimringOperationId,
  spec: CommandSpec,
  fields: readonly FieldOption[],
  options: Record<string, unknown>,
): Promise<ExitCode> {
  return runCommand(context, async () => {
    const input = await inputFrom(context, fields, options)
    checkInput(id, input, INPUT_SUGGESTION)
    if (options.dryRun === true) return dryRunOf(id, input, withoutPathFields(id, input))
    if (spec.confirm === true && options.yes !== true) {
      throw new UsageError(
        `${HIMRING_OPERATION_CATALOGUE[id].summary} The command needs your confirmation.`,
        'Pass --yes to go ahead.',
      )
    }
    const result = await (await signedInClient(context)).invoke(id, input)
    if (HIMRING_OPERATIONS[id].response.kind === 'download') {
      return saveDownloadTo(result, {
        out: typeof options.out === 'string' ? options.out : undefined,
        force: options.force === true,
        idleTimeoutMs: context.options.timeoutMs,
      })
    }
    checkOutput(id, result)
    return result
  })
}

function examplesText(spec: CommandSpec): string {
  return `\nExamples:\n${spec.examples.map(example => `  $ ${example}`).join('\n')}`
}

function groupFor(program: Command, groups: Map<string, Command>, resource: string): Command {
  const known = groups.get(resource) ?? program.commands.find(command => command.name() === resource)
  const group = known ?? program.command(resource).description(RESOURCE_DESCRIPTIONS[resource] ?? resource)
  groups.set(resource, group)
  return group
}

function addOperationCommand(
  group: Command,
  id: HimringOperationId,
  spec: CommandSpec,
  contextFor: ContextFor,
  recordExitCode: RecordExitCode,
): void {
  const entry = HIMRING_OPERATION_CATALOGUE[id]
  const fields = fieldOptionsOf(id)
  const command = group.command(spec.verb).description(entry.summary).addHelpText('after', examplesText(spec))
  addFieldOptions(command, fields)
  command.option('--input-file <path>', 'read the whole input as one JSON object from a file, or - for stdin')
  if (entry.changesState) command.option('--dry-run', 'check the input and show the request, without sending it')
  if (spec.confirm === true) command.option('--yes', 'confirm the change that the command makes')
  if (HIMRING_OPERATIONS[id].response.kind === 'download') {
    command.option(
      '--out <path>',
      'write the file to this path; without it, the CLI writes the file under its own name in this folder',
    )
    command.option('--force', 'replace a file that already exists')
  }
  command.action(async (_options: unknown, invoked: Command) => {
    const context = contextFor(invoked)
    if (context === undefined) return
    const options: unknown = invoked.opts()
    recordExitCode(await runOperation(context, id, spec, fields, isRecord(options) ? options : {}))
  })
}

export function addOperationCommands(program: Command, contextFor: ContextFor, recordExitCode: RecordExitCode): void {
  const groups = new Map<string, Command>()
  for (const id of Object.keys(OPERATION_COMMANDS).filter(isCommandOperation)) {
    const spec: CommandSpec = OPERATION_COMMANDS[id]
    addOperationCommand(groupFor(program, groups, spec.resource), id, spec, contextFor, recordExitCode)
  }
}
