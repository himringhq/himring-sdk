import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { startContractServer } from '@himring/contract-server'
import { afterEach, describe, expect, it } from 'vitest'
import { environmentOf, type McpProcess, runUntilExit, startMcpProcess, textOf } from './support/mcp-process.js'
import { removeScratchFolders, scratchFolder } from './support/scratch-folders.js'
import { json, type ScriptedApi, startScriptedApi } from './support/scripted-api.js'

const PROJECT_ID = `prj_${'8c'.repeat(16)}`
const KNOWLEDGE_BASE_ID = `kb_${'9d'.repeat(16)}`
const INDEX_ID = `ix_${'ae'.repeat(16)}`
const CREDENTIAL = `hk_live_${'7Qm2'.repeat(8)}`
const SESSION_TOKEN = `hs_live_${'Pq4W'.repeat(8)}`
const STALL_LIMIT_MS = 3_000
const READY_REPORT = { status: 'ready', dependencies: { control_database: 'up', search: 'up' } }

const opened: (McpProcess | ScriptedApi)[] = []

async function serverAgainst(apiUrl: string, extra: Record<string, string> = {}): Promise<McpProcess> {
  const folder = await scratchFolder('hostile-api')
  const mcp = await startMcpProcess(
    environmentOf({
      HIMRING_API_URL: apiUrl,
      HIMRING_DOWNLOAD_DIRECTORY: folder,
      HIMRING_UPLOAD_DIRECTORY: folder,
      ...extra,
    }),
    folder,
  )
  opened.push(mcp)
  return mcp
}

async function scriptedApi(): Promise<ScriptedApi> {
  const api = await startScriptedApi()
  opened.push(api)
  return api
}

afterEach(async () => {
  for (const handle of opened.splice(0).reverse()) {
    if ('close' in handle) await handle.close()
    else await handle.stop()
  }
  await removeScratchFolders()
})

describe('a hostile or broken API', () => {
  it('never shows the credential to the agent or in the log, even when the API repeats it back', async () => {
    const api = await scriptedApi()
    api.answer(/\/databases$/, (request, response) =>
      json(response, 403, {
        error: {
          code: 'forbidden',
          message: `You sent ${request.headers.authorization ?? ''}.`,
          details: `The key ${CREDENTIAL} is not allowed here.`,
        },
      }),
    )
    api.answer(/\/uploads$/, (_request, response) => {
      response.setHeader('retry-after', '0')
      json(response, 503, { error: { code: 'storage_unavailable', message: `Busy for ${CREDENTIAL}.` } })
    })
    const folder = await scratchFolder('hostile-upload')
    await writeFile(join(folder, 'refunds.html'), '<p>Refunds arrive within 14 days.</p>')
    const mcp = await serverAgainst(api.baseUrl, { HIMRING_API_KEY: CREDENTIAL, HIMRING_UPLOAD_DIRECTORY: folder })

    const refused = await mcp.callTool('list_databases', { project_id: PROJECT_ID })
    expect(textOf(refused)).toMatch(/^forbidden: /)
    expect(textOf(refused)).toContain('[redacted credential]')
    const retried = await mcp.callTool('add_file', {
      project_id: PROJECT_ID,
      knowledge_base_id: KNOWLEDGE_BASE_ID,
      local_path: 'refunds.html',
    })
    expect(retried.isError).toBe(true)

    expect(api.authorizations).toContain(`Bearer ${CREDENTIAL}`)
    expect(mcp.stderr()).toContain('[redacted credential]')
    expect(mcp.stdout()).not.toContain(CREDENTIAL)
    expect(mcp.stderr()).not.toContain(CREDENTIAL)
  })

  it('reports an answer that breaks the spec as invalid_response, and writes no file for a refused download', async () => {
    const api = await scriptedApi()
    api.answer(/\/databases$/, (_request, response) => json(response, 200, { databases: 'none', total_count: 'many' }))
    api.answer(/\/knowledge-bases$/, (_request, response) => {
      response.writeHead(200, { 'content-type': 'application/json' })
      response.end('<html>Welcome to the login page</html>')
    })
    api.answer(new RegExp(`^/v1/projects/${PROJECT_ID}$`), (_request, response) => {
      response.writeHead(404, { 'content-type': 'text/html' })
      response.end('<html>Not here</html>')
    })
    api.answer(/\/download$/, (_request, response) =>
      json(response, 404, { error: { code: 'project_not_found', message: 'The project does not exist.' } }),
    )
    const mcp = await serverAgainst(api.baseUrl, { HIMRING_API_KEY: CREDENTIAL })

    for (const [tool, args] of [
      ['list_databases', { project_id: PROJECT_ID }],
      ['list_knowledge_bases', { project_id: PROJECT_ID }],
      ['get_project', { project_id: PROJECT_ID }],
    ] as const) {
      const answer = await mcp.callTool(tool, args)
      expect(answer.isError, tool).toBe(true)
      expect(textOf(answer), tool).toMatch(/^invalid_response: /)
    }
    const refusedDownload = await mcp.callTool('download_index', { project_id: PROJECT_ID, index_id: INDEX_ID })
    expect(textOf(refusedDownload)).toMatch(/^project_not_found: /)
    expect(mcp.stdout()).not.toContain('Welcome to the login page')
  })

  it('answers other calls while the API stalls, then gives up on each stalled call and keeps no partial file', async () => {
    const api = await scriptedApi()
    api.answer(/\/databases$/, () => undefined)
    api.answer(/\/download$/, (_request, response) => {
      response.writeHead(200, {
        'content-type': 'application/octet-stream',
        'content-disposition': 'attachment; filename="stalled.nrsl"',
      })
      response.write(new Uint8Array([1, 2, 3]))
    })
    api.answer(/^\/ready$/, (_request, response) => json(response, 200, READY_REPORT))
    const downloads = await scratchFolder('stalled-downloads')
    const mcp = await serverAgainst(api.baseUrl, {
      HIMRING_API_KEY: CREDENTIAL,
      HIMRING_API_TIMEOUT_MS: String(STALL_LIMIT_MS),
      HIMRING_DOWNLOAD_DIRECTORY: downloads,
    })

    const settled: string[] = []
    const stalledJson = mcp.callTool('list_databases', { project_id: PROJECT_ID }).finally(() => settled.push('json'))
    const stalledDownload = mcp
      .callTool('download_index', { project_id: PROJECT_ID, index_id: INDEX_ID })
      .finally(() => settled.push('download'))
    const status = await mcp.callTool('get_status', {})
    expect(status.structuredContent).toEqual(READY_REPORT)
    expect(settled).toEqual([])

    expect(textOf(await stalledJson)).toMatch(/^timeout: /)
    expect(textOf(await stalledDownload)).toMatch(/^timeout: /)
    expect(await readdir(downloads)).toEqual([])
  })

  it('sends the API key over the session token, and no credential at all when none is set', async () => {
    const api = await startContractServer()
    try {
      const anonymous = await serverAgainst(api.baseUrl)
      expect(textOf(await anonymous.callTool('list_databases', { project_id: PROJECT_ID }))).toMatch(
        /^credential_required: /,
      )
      const both = await serverAgainst(api.baseUrl, {
        HIMRING_API_KEY: CREDENTIAL,
        HIMRING_SESSION_TOKEN: SESSION_TOKEN,
      })
      await both.callTool('list_databases', { project_id: PROJECT_ID })
      expect(api.requests.map(request => request.headers.authorization)).toEqual([undefined, `Bearer ${CREDENTIAL}`])
    } finally {
      await api.stop()
    }
  })
})

describe('bad settings', () => {
  it('refuses to start, names the setting, and never repeats a secret', async () => {
    const folder = await scratchFolder('settings')
    await mkdir(join(folder, 'relative'))
    const badSettings: Record<string, string>[] = [
      { HIMRING_API_URL: 'ftp://api.himring.example' },
      { HIMRING_API_URL: 'not a url' },
      { HIMRING_API_URL: `https://agent:${SESSION_TOKEN}@api.himring.example` },
      { HIMRING_API_TIMEOUT_MS: '0' },
      { HIMRING_API_TIMEOUT_MS: '-5' },
      { HIMRING_API_TIMEOUT_MS: '1.5' },
      { HIMRING_API_TIMEOUT_MS: 'soon' },
      { HIMRING_API_TIMEOUT_MS: '2147483648' },
      { HIMRING_API_KEY: '' },
      { HIMRING_API_KEY: `${CREDENTIAL}\r\nx-forwarded-for: 10.0.0.1` },
      { HIMRING_SESSION_TOKEN: `${SESSION_TOKEN}\u001b[2J` },
      { HIMRING_UPLOAD_DIRECTORY: 'relative' },
      { HIMRING_DOWNLOAD_DIRECTORY: 'relative' },
    ]
    for (const setting of badSettings) {
      const exited = await runUntilExit(environmentOf(setting), folder)
      const [name] = Object.keys(setting)
      expect(exited.exitCode, JSON.stringify(setting)).toBe(1)
      expect(exited.stdout).toBe('')
      if (name !== undefined) expect(exited.stderr).toContain(name)
      expect(exited.stderr).not.toContain(CREDENTIAL)
      expect(exited.stderr).not.toContain(SESSION_TOKEN)
    }
  })
})
