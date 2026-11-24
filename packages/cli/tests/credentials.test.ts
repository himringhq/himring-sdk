import { readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type ContractServer, errorReply, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { type CliResult, EXIT, failureCodeOf, runCli } from './support/cli-run.js'
import { scratchFolders } from './support/scratch.js'

const OWNER_ONLY_FILE = 0o600
const OWNER_ONLY_FOLDER = 0o700
const PERMISSION_BITS = 0o777
const PASSWORD = 'a long passphrase for the contract test'
const CHALLENGE_TOKEN = 'challengeTokenFromContract'
const DEVICE_TOKEN = 'knownDeviceTokenFromContract'
const SESSION_TOKEN = 'hms_session_token_from_contract'
const WRONG_KEY = `hk_live_${'7Qm2'.repeat(8)}`

const ACCOUNT = {
  id: 'acc_0123456789abcdef0123456789abcdef',
  email: 'owner@example.com',
  name: 'Support lead',
  status: 'approved',
  created_at: '2026-11-01T00:00:00.000Z',
  decided_at: '2026-11-02T00:00:00.000Z',
  is_operator: false,
}

const EMPTY_PROJECTS = { projects: [], total_count: 0, limit: 50, offset: 0 }

function printed(result: CliResult): string {
  return `${result.stdout}\n${result.stderr}`
}

describe('credentials', () => {
  let server: ContractServer
  let otherServer: ContractServer
  const scratch = scratchFolders()

  beforeAll(async () => {
    server = await startContractServer()
    otherServer = await startContractServer()
  })

  afterEach(async () => {
    server.reset()
    otherServer.reset()
    await scratch.removeAll()
  })

  afterAll(async () => {
    await server.stop()
    await otherServer.stop()
  })

  it('keeps the session in an owner-only file, sends it only to the API that issued it, and forgets it on sign-out', async () => {
    const configFolder = join(await scratch.make('credentials'), 'config')
    const environment = { HIMRING_API_URL: server.baseUrl, HIMRING_CONFIG_DIR: configFolder }
    server.stub('sign_in', {
      status: 200,
      body: { state: 'second_factor_required', challenge_token: CHALLENGE_TOKEN, known_device_token: DEVICE_TOKEN },
    })
    server.stub('verify_second_factor', {
      status: 200,
      body: {
        session_token: SESSION_TOKEN,
        session: { account: ACCOUNT, second_factor_enabled: true, expires_at: '2026-12-01T00:00:00.000Z' },
      },
    })
    const signedIn = await runCli(
      ['auth', 'sign-in', '--email', ACCOUNT.email, '--password-stdin', '--code', '123456', '--output', 'json'],
      { environment, stdin: `${PASSWORD}\n` },
    )
    expect(signedIn.exitCode, signedIn.stderr).toBe(EXIT.success)
    for (const secret of [SESSION_TOKEN, CHALLENGE_TOKEN, DEVICE_TOKEN, PASSWORD]) {
      expect(printed(signedIn)).not.toContain(secret)
    }
    const file = join(configFolder, 'credentials.json')
    expect((await stat(file)).mode & PERMISSION_BITS).toBe(OWNER_ONLY_FILE)
    expect((await stat(configFolder)).mode & PERMISSION_BITS).toBe(OWNER_ONLY_FOLDER)
    expect(await readFile(file, 'utf8')).not.toContain(PASSWORD)
    expect(server.requests.map(request => request.headers.authorization)).toEqual([undefined, undefined])

    server.stub('list_projects', { status: 200, body: EMPTY_PROJECTS })
    const listed = await runCli(['projects', 'list', '--output', 'json'], { environment })
    expect(listed.exitCode, listed.stderr).toBe(EXIT.success)
    expect(server.requests.at(-1)?.headers.authorization).toBe(`Bearer ${SESSION_TOKEN}`)

    server.stub('list_projects', errorReply(401, 'invalid_credential', `Refused ${SESSION_TOKEN}`))
    const echoedSession = await runCli(['projects', 'list', '--output', 'json'], { environment })
    expect(echoedSession.exitCode).toBe(EXIT.permissionDenied)
    expect(printed(echoedSession)).not.toContain(SESSION_TOKEN)
    expect(printed(echoedSession)).toContain('[redacted credential]')

    const elsewhere = await runCli(['projects', 'list', '--api-url', otherServer.baseUrl, '--output', 'json'], {
      environment,
    })
    expect([elsewhere.exitCode, failureCodeOf(elsewhere)]).toEqual([EXIT.permissionDenied, 'credential_required'])
    expect(otherServer.requests.map(request => request.headers.authorization)).toEqual([undefined])

    server.stub('sign_out', { status: 200, body: { signed_out: true } })
    const signedOut = await runCli(['auth', 'sign-out', '--output', 'json'], { environment })
    expect(signedOut.exitCode, signedOut.stderr).toBe(EXIT.success)
    expect(await readFile(file, 'utf8')).not.toContain(SESSION_TOKEN)
    const afterwards = await runCli(['projects', 'list', '--output', 'json'], { environment })
    expect(afterwards.exitCode).toBe(EXIT.permissionDenied)
    expect(server.requests.at(-1)?.headers.authorization).toBeUndefined()
    expect(server.problems).toEqual([])
  })

  it('never prints a wrong API key that the API refuses', async () => {
    server.stub('list_projects', errorReply(401, 'invalid_credential', `The credential ${WRONG_KEY} is not valid.`))
    const result = await runCli(['projects', 'list', '--output', 'json'], {
      environment: { HIMRING_API_URL: server.baseUrl, HIMRING_API_KEY: WRONG_KEY },
    })
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.permissionDenied, 'invalid_credential'])
    expect(server.requests.map(request => request.headers.authorization)).toEqual([`Bearer ${WRONG_KEY}`])
    expect(printed(result)).not.toContain(WRONG_KEY)
    const asText = await runCli(['projects', 'list'], {
      environment: { HIMRING_API_URL: server.baseUrl, HIMRING_API_KEY: WRONG_KEY },
    })
    expect(asText.exitCode).toBe(EXIT.permissionDenied)
    expect(printed(asText)).not.toContain(WRONG_KEY)
  })

  it('redacts a piped password echoed in an API error without damaging JSON output', async () => {
    const password = `quote"slash\\${'p9T4'.repeat(8)}`
    const configFolder = await scratch.make('echoed-password')
    server.stub('sign_in', errorReply(401, 'invalid_credential', `Refused ${password}`))
    const result = await runCli(['auth', 'sign-in', '--email', ACCOUNT.email, '--password-stdin', '--output', 'json'], {
      environment: { HIMRING_API_URL: server.baseUrl, HIMRING_CONFIG_DIR: configFolder },
      stdin: `${password}\n`,
    })
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.permissionDenied, 'invalid_credential'])
    expect(printed(result)).not.toContain(JSON.stringify(password).slice(1, -1))
    expect(printed(result)).toContain('[redacted credential]')
  })

  it('stops with exit code 3 on a damaged credentials file and sends nothing', async () => {
    const configFolder = await scratch.make('damaged')
    await writeFile(join(configFolder, 'credentials.json'), '{"version":1,"apis":')
    const result = await runCli(['projects', 'list', '--output', 'json'], {
      environment: { HIMRING_API_URL: server.baseUrl, HIMRING_CONFIG_DIR: configFolder },
    })
    expect([result.exitCode, failureCodeOf(result)]).toEqual([3, 'credentials_file'])
    expect(server.requests).toEqual([])
  })

  it('reads the password only from a pipe or HIMRING_PASSWORD, and refuses an empty one before it sends anything', async () => {
    const configFolder = await scratch.make('password')
    const environment = { HIMRING_API_URL: server.baseUrl, HIMRING_CONFIG_DIR: configFolder }
    const empty = await runCli(['auth', 'sign-in', '--email', ACCOUNT.email, '--password-stdin', '--output', 'json'], {
      environment,
      stdin: '\n',
    })
    const missing = await runCli(['auth', 'sign-in', '--email', ACCOUNT.email, '--output', 'json'], { environment })
    expect([empty.exitCode, missing.exitCode]).toEqual([EXIT.usage, EXIT.usage])
    expect(server.requests).toEqual([])
  })
})
