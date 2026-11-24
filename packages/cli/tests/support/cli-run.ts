import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const CLI_ENTRY = fileURLToPath(new URL('../../dist/main.js', import.meta.url))

const PROCESS_TIMEOUT_MS = 20_000
const OUTPUT_LIMIT_BYTES = 4 * 1024 * 1024

export const EXIT = {
  success: 0,
  unexpected: 1,
  usage: 2,
  notFound: 4,
  permissionDenied: 5,
  network: 10,
} as const

export interface CliResult {
  exitCode: number | null
  stdout: string
  stderr: string
}

export interface CliRunOptions {
  environment?: Record<string, string>
  stdin?: string
  cwd?: string
}

export function cleanEnvironment(extra: Record<string, string>): NodeJS.ProcessEnv {
  const { PATH, HOME } = process.env
  return { ...(PATH === undefined ? {} : { PATH }), ...(HOME === undefined ? {} : { HOME }), ...extra }
}

export function runCli(args: readonly string[], options: CliRunOptions = {}): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI_ENTRY, ...args], {
      cwd: options.cwd ?? process.cwd(),
      env: cleanEnvironment(options.environment ?? {}),
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: PROCESS_TIMEOUT_MS,
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    let collected = 0
    function collect(target: Buffer[], chunk: Buffer): void {
      collected += chunk.byteLength
      if (collected > OUTPUT_LIMIT_BYTES) child.kill()
      else target.push(chunk)
    }
    child.stdout.on('data', (chunk: Buffer) => collect(stdout, chunk))
    child.stderr.on('data', (chunk: Buffer) => collect(stderr, chunk))
    child.on('error', reject)
    child.on('close', exitCode =>
      resolve({
        exitCode,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
      }),
    )
    child.stdin.on('error', () => undefined)
    child.stdin.end(options.stdin ?? '')
  })
}

export interface Envelope {
  status: string
  data: unknown
  error: { code: string; message: string; suggestion: string } | null
  metadata: Record<string, unknown>
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function envelopeOf(result: CliResult): Envelope {
  const lines = result.stdout.trim().split('\n')
  const parsed: unknown = JSON.parse(lines.at(-1) ?? 'null')
  if (!isObject(parsed) || typeof parsed.status !== 'string' || !isObject(parsed.metadata)) {
    throw new Error(`The CLI printed no envelope:\n${result.stdout}\n${result.stderr}`)
  }
  const error = parsed.error
  return {
    status: parsed.status,
    data: parsed.data,
    error:
      isObject(error) &&
      typeof error.code === 'string' &&
      typeof error.message === 'string' &&
      typeof error.suggestion === 'string'
        ? { code: error.code, message: error.message, suggestion: error.suggestion }
        : null,
    metadata: parsed.metadata,
  }
}

export function failureCodeOf(result: CliResult): string | undefined {
  return envelopeOf(result).error?.code
}
