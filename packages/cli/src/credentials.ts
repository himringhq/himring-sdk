import { randomBytes } from 'node:crypto'
import { chmod, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import * as v from 'valibot'

const OWNER_ONLY_FILE = 0o600
const OWNER_ONLY_DIRECTORY = 0o700
const TOKEN_MAXIMUM_LENGTH = 4096

const tokenSchema = v.pipe(v.string(), v.minLength(1), v.maxLength(TOKEN_MAXIMUM_LENGTH))

const apiCredentialsSchema = v.object({
  sessionToken: v.optional(tokenSchema),
  challengeToken: v.optional(tokenSchema),
  knownDeviceTokens: v.optional(v.record(v.string(), tokenSchema), {}),
})

const credentialsFileSchema = v.object({
  version: v.literal(1),
  apis: v.record(v.string(), apiCredentialsSchema),
})

export type ApiCredentials = v.InferOutput<typeof apiCredentialsSchema>
type CredentialsFile = v.InferOutput<typeof credentialsFileSchema>

export class CredentialsFileError extends Error {
  constructor(message: string, options: { cause?: unknown } = {}) {
    super(message, { cause: options.cause })
    this.name = 'CredentialsFileError'
  }
}

export function credentialsDirectory(environment: NodeJS.ProcessEnv): string {
  const explicit = environment.HIMRING_CONFIG_DIR
  if (explicit !== undefined && explicit.length > 0) return explicit
  const xdg = environment.XDG_CONFIG_HOME
  return join(xdg !== undefined && xdg.length > 0 ? xdg : join(homedir(), '.config'), 'himring')
}

export function credentialsPath(environment: NodeJS.ProcessEnv): string {
  return join(credentialsDirectory(environment), 'credentials.json')
}

async function readCredentialsFile(path: string): Promise<CredentialsFile> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return { version: 1, apis: {} }
    throw new CredentialsFileError(`The CLI could not read ${path}. Check its permissions.`, { cause: error })
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    throw new CredentialsFileError(`${path} is not valid JSON. Delete it and sign in again.`, { cause: error })
  }
  const checked = v.safeParse(credentialsFileSchema, parsed)
  if (!checked.success) throw new CredentialsFileError(`${path} has an unknown shape. Delete it and sign in again.`)
  return checked.output
}

export interface CredentialsStore {
  readonly path: string
  read(apiUrl: string): Promise<ApiCredentials>
  update(apiUrl: string, change: (current: ApiCredentials) => ApiCredentials): Promise<void>
}

function storedFor(file: CredentialsFile, apiUrl: string): ApiCredentials {
  return Object.hasOwn(file.apis, apiUrl) ? (file.apis[apiUrl] ?? { knownDeviceTokens: {} }) : { knownDeviceTokens: {} }
}

export function createCredentialsStore(environment: NodeJS.ProcessEnv): CredentialsStore {
  const directory = credentialsDirectory(environment)
  const path = credentialsPath(environment)
  return {
    path,
    async read(apiUrl) {
      return storedFor(await readCredentialsFile(path), apiUrl)
    },
    async update(apiUrl, change) {
      const file = await readCredentialsFile(path)
      const next: CredentialsFile = {
        version: 1,
        apis: { ...file.apis, [apiUrl]: change(storedFor(file, apiUrl)) },
      }
      const temporary = `${path}.${randomBytes(6).toString('hex')}.tmp`
      try {
        await mkdir(directory, { recursive: true, mode: OWNER_ONLY_DIRECTORY })
        await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, { mode: OWNER_ONLY_FILE, flag: 'wx' })
        await chmod(temporary, OWNER_ONLY_FILE)
        await rename(temporary, path)
      } catch (error) {
        await rm(temporary, { force: true })
        throw new CredentialsFileError(`The CLI could not write ${path}. Check the permissions of ${directory}.`, {
          cause: error,
        })
      }
    },
  }
}
