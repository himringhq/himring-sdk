import { createHash } from 'node:crypto'
import { mkdir, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type ContractServer, errorReply, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { environmentOf, type McpProcess, startMcpProcess, textOf } from './support/mcp-process.js'
import { removeScratchFolders, scratchFolder } from './support/scratch-folders.js'
import { specMaximumBodyBytes } from './support/spec-oracle.js'

const PROJECT_ID = `prj_${'3d'.repeat(16)}`
const KNOWLEDGE_BASE_ID = `kb_${'4e'.repeat(16)}`
const INDEX_ID = `ix_${'5f'.repeat(16)}`
const TARGET = { project_id: PROJECT_ID, knowledge_base_id: KNOWLEDGE_BASE_ID }
const POLICY_TEXT = '<html><body><p>Refunds arrive within 14 days.</p></body></html>'
const SECRET_TEXT = '<html><body><p>The payroll export password.</p></body></html>'

const FILE_IMPORTS = [
  { tool: 'import_saved_questions', target: TARGET, fileName: 'questions.jsonl' },
  { tool: 'import_index_records', target: { project_id: PROJECT_ID, index_id: INDEX_ID }, fileName: 'records.ndjson' },
  { tool: 'import_answer_log', target: TARGET, fileName: 'answers.jsonl' },
]

function sha256(bytes: Uint8Array | string): string {
  return createHash('sha256').update(bytes).digest('hex')
}

describe('sending local files', () => {
  let api: ContractServer
  let mcp: McpProcess
  let workspace: string
  let uploads: string

  beforeAll(async () => {
    api = await startContractServer()
    workspace = await scratchFolder('uploads')
    uploads = join(workspace, 'uploads')
    await mkdir(join(uploads, 'policies'), { recursive: true })
    await mkdir(join(uploads, '.hidden'), { recursive: true })
    await mkdir(join(workspace, 'outside'), { recursive: true })
    await writeFile(join(uploads, 'policies', 'refunds.html'), POLICY_TEXT)
    await writeFile(join(uploads, '.env.html'), SECRET_TEXT)
    await writeFile(join(uploads, '.hidden', 'notes.html'), SECRET_TEXT)
    await writeFile(join(workspace, 'outside', 'secret.html'), SECRET_TEXT)
    await writeFile(join(workspace, 'outside', 'questions.jsonl'), SECRET_TEXT)
    await symlink(join(workspace, 'outside', 'secret.html'), join(uploads, 'link.html'))
    await symlink(join(workspace, 'outside', 'questions.jsonl'), join(uploads, 'linked.jsonl'))
    await symlink(join(workspace, 'outside'), join(uploads, 'linked-folder'))
    mcp = await startMcpProcess(
      environmentOf({ HIMRING_API_URL: api.baseUrl, HIMRING_API_KEY: 'hk_uploads', HIMRING_UPLOAD_DIRECTORY: uploads }),
      workspace,
    )
  })

  beforeEach(() => api.reset())
  afterEach(() => expect(api.problems).toEqual([]))

  afterAll(async () => {
    await mcp?.close()
    await api?.stop()
    await removeScratchFolders()
  })

  it.each(FILE_IMPORTS)(
    'refuses a file one byte over the documented maximum for $tool before any request',
    async entry => {
      const maximum = specMaximumBodyBytes(entry.tool)
      const fitting = new Uint8Array(maximum).fill(0x61)
      await writeFile(join(uploads, `fitting-${entry.fileName}`), fitting)
      await writeFile(join(uploads, `over-${entry.fileName}`), new Uint8Array(maximum + 1).fill(0x61))
      api.stub(entry.tool, errorReply(400, 'validation_failed', 'The stand-in API refuses every file.'))

      const over = await mcp.callTool(entry.tool, { ...entry.target, local_path: `over-${entry.fileName}` })
      expect(textOf(over)).toMatch(/^upload_refused: /)
      expect(api.requests).toEqual([])

      const sent = await mcp.callTool(entry.tool, { ...entry.target, local_path: `fitting-${entry.fileName}` })
      expect(textOf(sent)).toMatch(/^validation_failed: /)
      expect(api.requests.map(request => [request.operation_id, request.raw_body.byteLength])).toEqual([
        [entry.tool, maximum],
      ])
      expect(sha256(api.requests[0]?.raw_body ?? new Uint8Array())).toBe(sha256(fitting))
    },
  )

  it('reads a file to import only from inside the upload folder', async () => {
    const escapes = [
      '../outside/questions.jsonl',
      join(workspace, 'outside', 'questions.jsonl'),
      'linked.jsonl',
      'linked-folder/questions.jsonl',
      '.env.html',
      '.hidden/notes.html',
      'policies/../../outside/questions.jsonl',
      'missing.jsonl',
    ]
    for (const localPath of escapes) {
      const refused = await mcp.callTool('import_saved_questions', { ...TARGET, local_path: localPath })
      expect(textOf(refused), localPath).toMatch(/^upload_refused: /)
    }
    expect(api.requests).toEqual([])
  })

  it('sends one file only from inside the upload folder, and sends its true size and path', async () => {
    for (const localPath of ['../outside/secret.html', join(workspace, 'outside', 'secret.html'), 'link.html']) {
      const refused = await mcp.callTool('add_file', { ...TARGET, local_path: localPath, path: 'leak.html' })
      expect(textOf(refused), localPath).toMatch(/^upload_refused: /)
    }
    for (const localPath of ['linked-folder/secret.html', '.env.html', '.hidden/notes.html']) {
      const refused = await mcp.callTool('add_file', { ...TARGET, local_path: localPath })
      expect(textOf(refused), localPath).toMatch(/^upload_refused: /)
    }
    expect(api.requests).toEqual([])

    api.stub('create_upload', errorReply(409, 'upload_closed', 'The stand-in API closes every upload.'))
    const inside = await mcp.callTool('add_file', { ...TARGET, local_path: 'policies/refunds.html' })
    expect(textOf(inside)).toMatch(/^upload_closed: /)
    expect(api.requests.map(request => request.body)).toEqual([
      {
        path: 'policies/refunds.html',
        size_bytes: Buffer.byteLength(POLICY_TEXT),
        content_sha256: sha256(POLICY_TEXT),
      },
    ])
  })

  it('sends a folder only from inside the upload folder, into a knowledge base folder with no escape', async () => {
    for (const folder of ['..', '../outside', 'linked-folder', join(workspace, 'outside'), '.hidden']) {
      const refused = await mcp.callTool('upload_folder', { ...TARGET, folder })
      expect(textOf(refused), folder).toMatch(/^upload_refused: /)
    }
    for (const path of ['../escape', '/escape', 'a//b', 'a/./b', 'a\\b']) {
      const refused = await mcp.callTool('upload_folder', { ...TARGET, folder: 'policies', path })
      expect(refused.isError, path).toBe(true)
    }
    expect(api.requests).toEqual([])

    api.stub('list_files', { status: 200, body: { files: [], total_count: 0, offset: 0, limit: 100 } })
    api.stub('create_upload', errorReply(409, 'upload_closed', 'The stand-in API closes every upload.'))
    const sent = await mcp.callTool('upload_folder', { ...TARGET, path: 'handbook' })
    expect(sent.isError).toBe(true)
    expect(sent.structuredContent).toMatchObject({ counts: { failed: 1, added: 0 } })
    const sentPaths = api.requests
      .filter(request => request.operation_id === 'create_upload')
      .map(request => request.body)
    expect(sentPaths).toEqual([
      {
        path: 'handbook/policies/refunds.html',
        size_bytes: Buffer.byteLength(POLICY_TEXT),
        content_sha256: sha256(POLICY_TEXT),
      },
    ])
  })
})
