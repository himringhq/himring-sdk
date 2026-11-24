import { createRequire } from 'node:module'
import { DEFAULT_HIMRING_API_TIMEOUT_MS, DEFAULT_HIMRING_API_URL, describeError } from '@himring/sdk'
import { Command, CommanderError, InvalidArgumentError, Option } from 'commander'
import * as v from 'valibot'
import { addAnswerLogCommands } from './answer-log-commands.js'
import { addAuthCommands } from './auth-commands.js'
import type { CommandContext } from './command-context.js'
import { createCredentialsStore } from './credentials.js'
import { EXIT_CODE_HELP, EXIT_CODES, type ExitCode } from './exit-codes.js'
import { addFileCommands } from './file-commands.js'
import { addIndexRecordFileCommands } from './index-record-file-commands.js'
import { addOperationCommands } from './operation-commands.js'
import { httpUrlOf, wholeNumberInRangeOf } from './option-values.js'
import { type CliIo, type CommandFailure, OUTPUT_FORMATS, writeFailure } from './output.js'
import { addQuestionFileCommands } from './question-file-commands.js'
import { secretOutput } from './secret-output.js'
import { runStatusCommand } from './status-command.js'
import { addTableImportCommands } from './table-import-commands.js'

const packageManifestSchema = v.object({ version: v.pipe(v.string(), v.nonEmpty()) })
const CLI_VERSION = v.parse(packageManifestSchema, createRequire(import.meta.url)('../package.json')).version
const CLI_VERSION_FLAGS: ReadonlySet<string> = new Set(['-V', '--version'])
const USER_ARGUMENTS_START = 2
const LONGEST_TIMER_DELAY_MS = 2_147_483_647
const REFUSED_API_URL = ''
const REFUSED_API_URL_FAILURE: CommandFailure = {
  code: 'usage',
  message:
    'The API address from --api-url or HIMRING_API_URL is not an http or https URL with no user name, password, query, or fragment.',
  suggestion: 'Pass an address such as http://127.0.0.1:4000.',
}

const VERSION_HELP = `
Version:
  himring --version        print the version of this CLI; after a command, --version picks a file version`

const globalOptionsSchema = v.object({
  apiUrl: v.string(),
  output: v.picklist(OUTPUT_FORMATS),
  timeoutMs: v.number(),
})

const ENVIRONMENT_HELP = `
Environment:
  HIMRING_API_URL          base URL of the Himring API, in place of --api-url
  HIMRING_API_TIMEOUT_MS   time limit of each request, in place of --timeout-ms
  HIMRING_API_KEY          API key of a project, used in place of a signed-in session
  HIMRING_SESSION_TOKEN    session token, used in place of the credentials file
  HIMRING_PROJECT          project ID, in place of --project
  HIMRING_PASSWORD         password, in place of --password-stdin
  HIMRING_CONFIG_DIR       folder of credentials.json, by default $XDG_CONFIG_HOME/himring or ~/.config/himring`

function parseApiUrl(value: string): string {
  return httpUrlOf(value) ?? REFUSED_API_URL
}

function parseTimeoutMs(value: string): number {
  const timeoutMs = wholeNumberInRangeOf(value, 1, LONGEST_TIMER_DELAY_MS)
  if (timeoutMs !== undefined) return timeoutMs
  throw new InvalidArgumentError(
    `Pass a whole number of milliseconds from 1 to ${LONGEST_TIMER_DELAY_MS}, such as 5000.`,
  )
}

function buildProgram(
  io: CliIo,
  environment: NodeJS.ProcessEnv,
  recordExitCode: (exitCode: ExitCode) => void,
  protectSecret: (value: string | undefined) => void,
): Command {
  const program = new Command('himring')
    .description('Work with Himring, the backend that lets AI agents answer from what your business knows.')
    .addOption(
      new Option('--api-url <url>', 'base URL of the Himring API')
        .env('HIMRING_API_URL')
        .default(DEFAULT_HIMRING_API_URL)
        .argParser(parseApiUrl),
    )
    .addOption(new Option('--output <format>', 'output format').choices(OUTPUT_FORMATS).default('text'))
    .addOption(
      new Option('--timeout-ms <milliseconds>', 'how long to wait for the API to respond')
        .env('HIMRING_API_TIMEOUT_MS')
        .default(DEFAULT_HIMRING_API_TIMEOUT_MS)
        .argParser(parseTimeoutMs),
    )
    .configureOutput({ writeOut: io.writeStdout, writeErr: io.writeStderr })
    .showHelpAfterError()
    .exitOverride()
    .addHelpText('after', `${VERSION_HELP}\n${ENVIRONMENT_HELP}\n${EXIT_CODE_HELP}`)

  const credentials = createCredentialsStore(environment)
  const contextFor = (command: Command): CommandContext | undefined => {
    const parsed = v.safeParse(globalOptionsSchema, command.optsWithGlobals())
    if (parsed.success && parsed.output.apiUrl === REFUSED_API_URL) {
      writeFailure(io, parsed.output.output, REFUSED_API_URL_FAILURE, {})
      recordExitCode(EXIT_CODES.usage)
      return undefined
    }
    if (parsed.success) return { io, protectSecret, environment, credentials, options: parsed.output }
    writeFailure(
      io,
      'text',
      {
        code: 'usage',
        message: `The global options are invalid: ${v.summarize(parsed.issues)}`,
        suggestion: 'Read himring --help for the valid options.',
      },
      {},
    )
    recordExitCode(EXIT_CODES.usage)
    return undefined
  }

  program
    .command('status')
    .description('Report whether the API and the services behind it are ready.')
    .addHelpText(
      'after',
      `
Examples:
  $ himring status
  $ himring status --output json
  $ HIMRING_API_URL=http://127.0.0.1:4000 himring status --timeout-ms 2000`,
    )
    .action(async (_options: unknown, command: Command) => {
      const context = contextFor(command)
      if (context === undefined) return
      recordExitCode(await runStatusCommand(context.options, io))
    })

  addAuthCommands(program, contextFor, recordExitCode)
  addOperationCommands(program, contextFor, recordExitCode)
  addFileCommands(program, contextFor, recordExitCode)
  addQuestionFileCommands(program, contextFor, recordExitCode)
  addIndexRecordFileCommands(program, contextFor, recordExitCode)
  addAnswerLogCommands(program, contextFor, recordExitCode)
  addTableImportCommands(program, contextFor, recordExitCode)
  return program
}

export async function runCli(argv: readonly string[], io: CliIo, environment: NodeJS.ProcessEnv): Promise<ExitCode> {
  const output = secretOutput(io)
  output.protectSecret(environment.HIMRING_API_KEY)
  output.protectSecret(environment.HIMRING_SESSION_TOKEN)
  output.protectSecret(environment.HIMRING_PASSWORD)
  io = output.io
  const [firstArgument, ...otherArguments] = argv.slice(USER_ARGUMENTS_START)
  if (firstArgument !== undefined && otherArguments.length === 0 && CLI_VERSION_FLAGS.has(firstArgument)) {
    io.writeStdout(`${CLI_VERSION}\n`)
    return EXIT_CODES.success
  }
  let exitCode: ExitCode = EXIT_CODES.success
  const program = buildProgram(
    io,
    environment,
    recordedExitCode => {
      exitCode = recordedExitCode
    },
    output.protectSecret,
  )
  try {
    await program.parseAsync([...argv])
  } catch (error) {
    if (error instanceof CommanderError) {
      return error.exitCode === 0 ? EXIT_CODES.success : EXIT_CODES.usage
    }
    io.writeStderr(`Error: ${describeError(error)}\n`)
    return EXIT_CODES.unexpected
  }
  return exitCode
}
