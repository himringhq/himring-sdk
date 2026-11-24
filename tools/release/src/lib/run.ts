import { type SpawnSyncOptions, spawnSync } from 'node:child_process'

const COMMAND_OUTPUT_LIMIT_BYTES = 64 * 1024 * 1024

export class CommandError extends Error {
  override readonly name = 'CommandError'
  readonly status: number | null

  constructor(command: string, args: readonly string[], detail: string, status: number | null) {
    super(`Command failed: ${command} ${args.join(' ')}\n${detail.length > 0 ? detail : 'no output'}`)
    this.status = status
  }
}

export interface CommandResult {
  ok: boolean
  status: number | null
  stdout: string
  stderr: string
}

function spawnCommand(command: string, args: readonly string[], options: SpawnSyncOptions) {
  return spawnSync(command, args, {
    ...options,
    encoding: 'utf8',
    shell: false,
    maxBuffer: COMMAND_OUTPUT_LIMIT_BYTES,
  })
}

export function run(command: string, args: readonly string[], options: SpawnSyncOptions = {}): string {
  const result = spawnCommand(command, args, options)
  if (result.error !== undefined) throw new CommandError(command, args, result.error.message, null)
  if (result.status !== 0 || result.signal !== null) {
    const detail = result.stderr.trim() || result.stdout.trim()
    throw new CommandError(command, args, detail, result.status)
  }
  return result.stdout
}

export function tryRun(command: string, args: readonly string[], options: SpawnSyncOptions = {}): CommandResult {
  const result = spawnCommand(command, args, options)
  if (result.error !== undefined) return { ok: false, status: null, stdout: '', stderr: result.error.message }
  return {
    ok: result.status === 0 && result.signal === null,
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  }
}
