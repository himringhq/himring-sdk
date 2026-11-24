import { describeError, type HimringApiError, type HimringMissingPermission, isHimringApiError } from '@himring/sdk'
import { type ExitCode, exitCodeForError } from './exit-codes.js'
import { printable } from './text-cells.js'
import { formatText } from './text-output.js'

export const OUTPUT_FORMATS = ['text', 'json'] as const

export type OutputFormat = (typeof OUTPUT_FORMATS)[number]

export interface CliIo {
  writeStdout(text: string): void
  writeStderr(text: string): void
  readStdin(): Promise<string>
  stdinIsTerminal: boolean
}

export interface CommandFailure {
  code: string
  message: string
  suggestion: string
  missing_permission?: HimringMissingPermission
}

export type CommandMetadata = Record<string, string | number>

export type ResultEnvelope<Data> =
  | { status: 'success'; data: Data; error: null; metadata: CommandMetadata }
  | { status: 'error'; data: Data | null; error: CommandFailure; metadata: CommandMetadata }

export function writeEnvelope<Data>(io: CliIo, envelope: ResultEnvelope<Data>): void {
  io.writeStdout(`${JSON.stringify(envelope)}\n`)
}

export function writeFailureText(io: CliIo, failure: CommandFailure): void {
  io.writeStderr(`Error: ${printable(failure.message, true)}\n  ${printable(failure.suggestion, true)}\n`)
}

export function writeSuccess(io: CliIo, format: OutputFormat, data: unknown, metadata: CommandMetadata): void {
  if (format === 'json') {
    writeEnvelope(io, { status: 'success', data, error: null, metadata })
    return
  }
  io.writeStdout(formatText(data))
}

export function writeFailure(
  io: CliIo,
  format: OutputFormat,
  failure: CommandFailure,
  metadata: CommandMetadata,
): void {
  if (format === 'json') {
    writeEnvelope(io, { status: 'error', data: null, error: failure, metadata })
    return
  }
  writeFailureText(io, failure)
}

const SUGGESTION_BY_KIND = {
  network: 'Check that the API runs, and pass its address with --api-url or HIMRING_API_URL.',
  timeout: 'Try again, or raise the time limit with --timeout-ms or HIMRING_API_TIMEOUT_MS.',
  invalid_input: 'Correct the input as the message says. Read the --help of the command for its options.',
  invalid_response: 'Check that --api-url points at the Himring API.',
  refused: 'Follow the message of the API, then run the command again.',
} as const

const SERVER_ERROR_MINIMUM = 500

function suggestionFor(error: HimringApiError): string {
  const suggestion = SUGGESTION_BY_KIND[error.kind]
  const serverFailed = error.status !== undefined && error.status >= SERVER_ERROR_MINIMUM
  if (!serverFailed || error.requestId === undefined) return suggestion
  return `${suggestion} If it keeps failing, report request ${error.requestId} to Himring.`
}

export function failureFor(error: unknown): { failure: CommandFailure; exitCode: ExitCode } {
  const exitCode = exitCodeForError(error)
  if (!isHimringApiError(error)) {
    return {
      failure: { code: 'unexpected_error', message: describeError(error), suggestion: 'Report this to Himring.' },
      exitCode,
    }
  }
  return {
    failure: {
      code: error.code ?? error.kind,
      message: describeError(error),
      suggestion: suggestionFor(error),
      ...(error.missingPermission === undefined ? {} : { missing_permission: error.missingPermission }),
    },
    exitCode,
  }
}
