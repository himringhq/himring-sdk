import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type ContractServer, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { type CliResult, EXIT, envelopeOf, failureCodeOf, runCli } from './support/cli-run.js'
import { scratchFolders } from './support/scratch.js'
import { filledPath, specOperation, specServerUrl } from './support/spec-oracle.js'

const PROJECT = 'prj_0123456789abcdef0123456789abcdef'
const KNOWLEDGE_BASE = 'kb_0123456789abcdef0123456789abcdef'
const INDEX = 'ix_0123456789abcdef0123456789abcdef'
const API_KEY = 'hmk_contract_test_key'
const URL_SECRET = 'secret-in-the-url'
const TERMINAL_ESCAPE = '\u001b'

const INDEX_RECORD = {
  id: INDEX,
  project_id: PROJECT,
  name: 'articles',
  end_user_id: null,
  device_sync: false,
  sync_limit_bytes: null,
  created_at: '2026-11-01T00:00:00.000Z',
  created_by: { kind: 'key', id: 'key_0123456789abcdef0123456789abcdef', name: 'CI' },
  deleted_at: null,
  purge_after: null,
  config: {},
  narsil_url: 'https://narsil.example.com',
}

function printed(result: CliResult): string {
  return `${result.stdout}\n${result.stderr}`
}

describe('hostile input and hostile answers', () => {
  let server: ContractServer
  const scratch = scratchFolders()

  function himring(args: readonly string[], options: { stdin?: string; environment?: Record<string, string> } = {}) {
    return runCli([...args, '--output', 'json'], {
      environment: {
        HIMRING_API_URL: server.baseUrl,
        HIMRING_API_KEY: API_KEY,
        HIMRING_PROJECT: PROJECT,
        ...options.environment,
      },
      ...(options.stdin === undefined ? {} : { stdin: options.stdin }),
    })
  }

  beforeAll(async () => {
    server = await startContractServer()
  })

  afterEach(async () => {
    server.reset()
    await scratch.removeAll()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('refuses API URLs that are not plain http or https before it sends anything', async () => {
    const { port } = new URL(server.baseUrl)
    const refused = [
      'ftp://127.0.0.1/',
      'javascript:alert(1)',
      'not a url',
      `http://owner:${URL_SECRET}@127.0.0.1:${port}`,
      `${server.baseUrl}/?token=${URL_SECRET}`,
    ]
    for (const apiUrl of refused) {
      const byFlag = await himring(['indexes', 'get', '--index', INDEX, '--api-url', apiUrl])
      const byVariable = await himring(['indexes', 'get', '--index', INDEX], {
        environment: { HIMRING_API_URL: apiUrl },
      })
      expect([byFlag.exitCode, byVariable.exitCode], apiUrl).toEqual([EXIT.usage, EXIT.usage])
      expect(printed(byFlag)).not.toContain(URL_SECRET)
      expect(printed(byVariable)).not.toContain(URL_SECRET)
    }
    expect(server.requests).toEqual([])
  })

  it('uses the API address of the spec by default, and HIMRING_API_URL in its place', async () => {
    const byDefault = await runCli(['indexes', 'get', '--index', 'not-an-index', '--output', 'json'], {
      environment: { HIMRING_PROJECT: PROJECT },
    })
    expect(envelopeOf(byDefault).metadata.api_url).toBe(specServerUrl())
    server.stub('get_index', { status: 200, body: INDEX_RECORD })
    const overridden = await himring(['indexes', 'get', '--index', INDEX])
    expect(overridden.exitCode, overridden.stderr).toBe(EXIT.success)
    expect(envelopeOf(overridden).metadata.api_url).toBe(server.baseUrl)
    expect(server.requests.map(request => request.path)).toEqual([
      filledPath(specOperation('get_index').path, { project_id: PROJECT, index_id: INDEX }),
    ])
  })

  it('refuses malformed JSON, a non-object input file, a device file, and two readers of stdin before it sends anything', async () => {
    const results = [
      await himring(['indexes', 'create', '--name', 'articles', '--config-file', '-'], { stdin: '{"schema": ' }),
      await himring(['indexes', 'create', '--input-file', '-'], { stdin: '[{"name": "articles"}]' }),
      await himring(['indexes', 'create', '--name', 'articles', '--config-file', '/dev/zero']),
      await himring(['indexes', 'create', '--config-file', '-', '--input-file', '-'], { stdin: '{}' }),
      await himring(['indexes', 'create', '--name', 'articles', '--unknown-flag', 'x']),
      await himring(['indexes', 'get', '--index', INDEX, '--timeout-ms', '0']),
      await himring(['indexes', 'get', '--index', INDEX, '--timeout-ms', '99999999999']),
    ]
    expect(results.map(result => result.exitCode)).toEqual(results.map(() => EXIT.usage))
    expect(server.requests).toEqual([])
  })

  it('changes nothing without --yes, and shows the documented request on --dry-run', async () => {
    const unconfirmed = await himring(['indexes', 'delete', '--index', INDEX])
    expect([unconfirmed.exitCode, failureCodeOf(unconfirmed)]).toEqual([EXIT.usage, 'usage'])
    const planned = await himring(['indexes', 'delete', '--index', INDEX, '--dry-run'])
    expect(planned.exitCode, planned.stderr).toBe(EXIT.success)
    const documented = specOperation('delete_index')
    expect(envelopeOf(planned).data).toMatchObject({
      dry_run: true,
      applied: false,
      method: documented.method,
      path: filledPath(documented.path, { project_id: PROJECT, index_id: INDEX }),
    })
    const folder = await scratch.make('mirror')
    await mkdir(join(folder, 'policies'))
    await writeFile(join(folder, 'policies', 'refunds.html'), '<p>Refunds take five days.</p>')
    const mirrored = await himring([
      'files',
      'upload',
      '--knowledge-base',
      KNOWLEDGE_BASE,
      '--folder',
      folder,
      '--delete',
    ])
    expect([mirrored.exitCode, failureCodeOf(mirrored)]).toEqual([EXIT.usage, 'usage'])
    expect(server.requests).toEqual([])
  })

  it('refuses an answer that breaks the documented schema in place of printing it as a success', async () => {
    const { narsil_url: _dropped, ...partial } = INDEX_RECORD
    server.stub('get_index', { status: 200, body: { ...partial, created_by: 'someone' } })
    const result = await himring(['indexes', 'get', '--index', INDEX])
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.unexpected, 'invalid_response'])
    expect(server.problems.length).toBeGreaterThan(0)
    server.reset()
    server.stub('get_index', {
      status: 200,
      raw: '<html>sign in to the portal</html>',
      headers: { 'content-type': 'text/html' },
    })
    const html = await himring(['indexes', 'get', '--index', INDEX])
    expect([html.exitCode, failureCodeOf(html)]).toEqual([EXIT.unexpected, 'invalid_response'])
  })

  it('prints terminal control characters from an answer as visible escapes', async () => {
    const hostileName = `articles${TERMINAL_ESCAPE}]52;c;Y3VybCBldmlsLmV4YW1wbGUgfCBzaA==\u0007‮`
    server.stub('get_index', { status: 200, body: { ...INDEX_RECORD, name: hostileName } })
    const asText = await runCli(['indexes', 'get', '--index', INDEX], {
      environment: { HIMRING_API_URL: server.baseUrl, HIMRING_API_KEY: API_KEY, HIMRING_PROJECT: PROJECT },
    })
    expect(asText.exitCode, asText.stderr).toBe(EXIT.success)
    expect(asText.stdout).toContain('articles\\u001b]52;c;')
    expect(asText.stdout).not.toContain(TERMINAL_ESCAPE)
    expect(asText.stdout).not.toContain('‮')
  })

  it('reports an API that does not answer with exit code 10', async () => {
    const closed = await startContractServer()
    const closedUrl = closed.baseUrl
    await closed.stop()
    const result = await himring(['indexes', 'get', '--index', INDEX], { environment: { HIMRING_API_URL: closedUrl } })
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.network, 'network'])
  })
})
