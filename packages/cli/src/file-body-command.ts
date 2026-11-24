import { resolve } from 'node:path'
import { HIMRING_OPERATIONS, type HimringOperationId } from '@himring/sdk'
import { type Command, Option } from 'commander'
import { boundedFileBytesOf } from './bounded-file-read.js'
import { type CommandContext, signedInClient } from './command-context.js'
import { dryRunOf, withoutPathFields } from './dry-run.js'
import { checkInput, checkOutput, propertySchemaOf } from './spec-schemas.js'
import { UsageError } from './usage-error.js'

export interface FileBodyRequest {
  id: HimringOperationId
  input: Record<string, unknown>
  from: string | undefined
  dryRun: boolean
  suggestion: string
  splitHint: string
}

const PROJECT_VARIABLE = 'HIMRING_PROJECT'

function definedFieldsOf(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined))
}

export function choicesOf(id: HimringOperationId, field: string): string[] {
  const choices = propertySchemaOf(id, field).enum
  return Array.isArray(choices) ? choices.filter(choice => typeof choice === 'string') : []
}

export function addProjectOption(command: Command): Command {
  return command.addOption(new Option('--project <value>', 'project_id (required)').env(PROJECT_VARIABLE))
}

export async function sendFileBody(context: CommandContext, request: FileBodyRequest): Promise<unknown> {
  const description = HIMRING_OPERATIONS[request.id]
  if (description.body !== 'file') throw new Error(`${request.id} takes no file.`)
  if (request.from === undefined) throw new UsageError('The command needs a file.', 'Pass its path with --from.')
  const input = definedFieldsOf(request.input)
  checkInput(request.id, input, request.suggestion)
  const absolutePath = resolve(request.from)
  const content = await boundedFileBytesOf({
    givenPath: request.from,
    absolutePath,
    maximumBytes: description.maximumBodyBytes,
    splitHint: request.splitHint,
  })
  if (request.dryRun) {
    const sent = withoutPathFields(request.id, input)
    return dryRunOf(request.id, input, { ...sent, from: absolutePath, size_bytes: content.byteLength })
  }
  const result = await (await signedInClient(context)).invoke(request.id, { ...input, content })
  checkOutput(request.id, result)
  return result
}
