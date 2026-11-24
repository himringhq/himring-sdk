import { createHimringClient, describeError, isHimringApiError, type ReadinessReport } from '@himring/sdk'
import { EXIT_CODES, type ExitCode } from './exit-codes.js'
import {
  type CliIo,
  type CommandFailure,
  type CommandMetadata,
  type OutputFormat,
  writeEnvelope,
  writeFailureText,
} from './output.js'
import { formatText } from './text-output.js'

export interface StatusCommandOptions {
  apiUrl: string
  output: OutputFormat
  timeoutMs: number
}

const READY_STATUS = 'ready'
const REPORT_FIELDS: ReadonlySet<string> = new Set(['api', 'api_url'])

const START_API_SUGGESTION = 'Check that the API runs, and pass its address with --api-url or HIMRING_API_URL.'

const NOT_READY_FAILURE: CommandFailure = {
  code: 'not_ready',
  message: 'A service behind the API is not ready.',
  suggestion: 'Find the dependency that reports down, then try again once it is up.',
}

function failureFor(error: unknown, apiUrl: string): { failure: CommandFailure; exitCode: ExitCode } {
  if (isHimringApiError(error) && (error.kind === 'network' || error.kind === 'timeout')) {
    return {
      failure: {
        code: error.kind === 'network' ? 'api_unreachable' : 'api_timeout',
        message: error.message,
        suggestion: START_API_SUGGESTION,
      },
      exitCode: EXIT_CODES.network,
    }
  }
  return {
    failure: {
      code: 'unexpected_response',
      message: describeError(error),
      suggestion: `Check that ${apiUrl} serves the Himring API.`,
    },
    exitCode: EXIT_CODES.unexpected,
  }
}

function writeReportText(io: CliIo, report: ReadinessReport, apiUrl: string): void {
  const dependencies = Object.entries(report.dependencies).filter(([name]) => !REPORT_FIELDS.has(name))
  io.writeStdout(formatText(Object.fromEntries([['api', report.status], ...dependencies, ['api_url', apiUrl]])))
}

function writeReport(io: CliIo, report: ReadinessReport, options: StatusCommandOptions, metadata: CommandMetadata) {
  const ready = report.status === READY_STATUS
  if (options.output === 'text') {
    writeReportText(io, report, options.apiUrl)
    if (!ready) writeFailureText(io, NOT_READY_FAILURE)
    return
  }
  writeEnvelope<ReadinessReport>(
    io,
    ready
      ? { status: 'success', data: report, error: null, metadata }
      : { status: 'error', data: report, error: NOT_READY_FAILURE, metadata },
  )
}

export async function runStatusCommand(options: StatusCommandOptions, io: CliIo): Promise<ExitCode> {
  const startedAt = performance.now()
  const client = createHimringClient({ baseUrl: options.apiUrl, timeoutMs: options.timeoutMs })
  const metadata = (): CommandMetadata => ({
    api_url: options.apiUrl,
    duration_ms: Math.round(performance.now() - startedAt),
  })

  let report: ReadinessReport
  try {
    report = await client.getReadiness()
  } catch (error) {
    const { failure, exitCode } = failureFor(error, options.apiUrl)
    if (options.output === 'json') {
      writeEnvelope<ReadinessReport>(io, { status: 'error', data: null, error: failure, metadata: metadata() })
    } else {
      writeFailureText(io, failure)
    }
    return exitCode
  }

  writeReport(io, report, options, metadata())
  return report.status === READY_STATUS ? EXIT_CODES.success : EXIT_CODES.notReady
}
