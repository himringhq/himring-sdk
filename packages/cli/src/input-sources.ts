import { resolve } from 'node:path'
import { boundedFileBytesOf, sizeText } from './bounded-file-read.js'
import type { CommandContext } from './command-context.js'
import { MAXIMUM_LOCAL_INPUT_BYTES } from './input-limits.js'
import { UsageError } from './usage-error.js'

const STDIN_PATH = '-'
const SPLIT_HINT = 'Split the input into smaller requests.'

async function readLocalFile(path: string): Promise<string> {
  const bytes = await boundedFileBytesOf({
    givenPath: path,
    absolutePath: resolve(path),
    maximumBytes: MAXIMUM_LOCAL_INPUT_BYTES,
    splitHint: SPLIT_HINT,
  })
  return Buffer.from(bytes).toString('utf8')
}

export async function readTextSource(context: CommandContext, path: string, label: string): Promise<string> {
  const text = path === STDIN_PATH ? await context.io.readStdin() : await readLocalFile(path)
  if (Buffer.byteLength(text, 'utf8') > MAXIMUM_LOCAL_INPUT_BYTES) {
    throw new UsageError(`${label} is larger than ${sizeText(MAXIMUM_LOCAL_INPUT_BYTES)}.`, SPLIT_HINT)
  }
  return text
}

export async function readJsonSource(context: CommandContext, path: string, label: string): Promise<unknown> {
  const text = await readTextSource(context, path, label)
  try {
    return JSON.parse(text)
  } catch {
    throw new UsageError(`${label} in ${path === STDIN_PATH ? 'stdin' : path} is not valid JSON.`, 'Fix the JSON.')
  }
}

export const PASSWORD_VARIABLE = 'HIMRING_PASSWORD'

export async function readPassword(context: CommandContext, fromStdin: boolean): Promise<string> {
  if (fromStdin) {
    if (context.io.stdinIsTerminal) {
      throw new UsageError(
        '--password-stdin reads a pipe, and stdin is a terminal.',
        'Pipe the password, as in printf "%s" "$PASSWORD" | himring …',
      )
    }
    const firstLine = (await context.io.readStdin()).split(/\r?\n/, 1)[0] ?? ''
    if (firstLine.length === 0) {
      throw new UsageError('stdin held no password.', 'Pipe the password on the first line of stdin.')
    }
    context.protectSecret(firstLine)
    return firstLine
  }
  const fromEnvironment = context.environment[PASSWORD_VARIABLE]
  if (fromEnvironment !== undefined && fromEnvironment.length > 0) {
    context.protectSecret(fromEnvironment)
    return fromEnvironment
  }
  throw new UsageError(
    'The command needs the password of the account.',
    `Pipe it with --password-stdin, or set ${PASSWORD_VARIABLE}, so that it never shows in your shell history.`,
  )
}
