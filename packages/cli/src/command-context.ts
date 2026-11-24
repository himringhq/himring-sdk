import { createHimringClient, type HimringClient } from '@himring/sdk'
import type { Command } from 'commander'
import { CredentialsFileError, type CredentialsStore } from './credentials.js'
import { EXIT_CODES, type ExitCode } from './exit-codes.js'
import { nonEmptyText } from './option-values.js'
import {
  type CliIo,
  type CommandFailure,
  type CommandMetadata,
  failureFor,
  type OutputFormat,
  writeEnvelope,
  writeFailure,
  writeFailureText,
  writeSuccess,
} from './output.js'
import { formatText } from './text-output.js'
import { UsageError } from './usage-error.js'

function writePartial(io: CliIo, format: OutputFormat, partial: PartialResult, metadata: CommandMetadata): void {
  if (format === 'json') {
    writeEnvelope(io, { status: 'error', data: partial.data, error: partial.failure, metadata })
    return
  }
  io.writeStdout(formatText(partial.data))
  writeFailureText(io, partial.failure)
}

export interface GlobalOptions {
  apiUrl: string
  output: OutputFormat
  timeoutMs: number
}

export interface CommandContext {
  io: CliIo
  protectSecret(value: string | undefined): void
  environment: NodeJS.ProcessEnv
  credentials: CredentialsStore
  options: GlobalOptions
}

export type ContextFor = (command: Command) => CommandContext | undefined

export type RecordExitCode = (exitCode: ExitCode) => void

export class PartialResult {
  readonly data: unknown
  readonly failure: CommandFailure
  readonly exitCode: ExitCode

  constructor(data: unknown, failure: CommandFailure, exitCode: ExitCode) {
    this.data = data
    this.failure = failure
    this.exitCode = exitCode
  }
}

export async function credentialFor(context: CommandContext): Promise<string | undefined> {
  const fromEnvironment =
    nonEmptyText(context.environment.HIMRING_API_KEY) ?? nonEmptyText(context.environment.HIMRING_SESSION_TOKEN)
  if (fromEnvironment !== undefined) return fromEnvironment
  return (await context.credentials.read(context.options.apiUrl)).sessionToken
}

export function clientFor(context: CommandContext, credential: string | undefined): HimringClient {
  context.protectSecret(credential)
  return createHimringClient({ baseUrl: context.options.apiUrl, timeoutMs: context.options.timeoutMs, credential })
}

export async function signedInClient(context: CommandContext): Promise<HimringClient> {
  return clientFor(context, await credentialFor(context))
}

export async function runCommand(
  context: CommandContext,
  work: (metadata: CommandMetadata) => Promise<unknown>,
): Promise<ExitCode> {
  const startedAt = performance.now()
  const metadata: CommandMetadata = { api_url: context.options.apiUrl }
  const finished = (): CommandMetadata => ({ ...metadata, duration_ms: Math.round(performance.now() - startedAt) })
  try {
    const data = await work(metadata)
    if (data instanceof PartialResult) {
      writePartial(context.io, context.options.output, data, finished())
      return data.exitCode
    }
    writeSuccess(context.io, context.options.output, data, finished())
    return EXIT_CODES.success
  } catch (error) {
    if (error instanceof UsageError) {
      writeFailure(
        context.io,
        context.options.output,
        { code: 'usage', message: error.message, suggestion: error.suggestion },
        finished(),
      )
      return EXIT_CODES.usage
    }
    if (error instanceof CredentialsFileError) {
      writeFailure(
        context.io,
        context.options.output,
        {
          code: 'credentials_file',
          message: error.message,
          suggestion: 'Set HIMRING_CONFIG_DIR to a writable folder.',
        },
        finished(),
      )
      return EXIT_CODES.configuration
    }
    const { failure, exitCode } = failureFor(error)
    writeFailure(context.io, context.options.output, failure, finished())
    return exitCode
  }
}
