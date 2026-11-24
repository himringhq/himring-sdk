import { lstat, mkdir, readdir, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type ContractServer, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { environmentOf, type McpProcess, startMcpProcess, textOf } from './support/mcp-process.js'
import { removeScratchFolders, scratchFolder } from './support/scratch-folders.js'
import { specOperation } from './support/spec-oracle.js'

const PROJECT_ID = `prj_${'6a'.repeat(16)}`
const INDEX_ID = `ix_${'7b'.repeat(16)}`
const TARGET = { project_id: PROJECT_ID, index_id: INDEX_ID }
const OWNER_ONLY_FILE_MODE = 0o600
const BROKEN_DOWNLOAD_WAIT_MS = 1_500
const SNAPSHOT_BYTES = new Uint8Array([0x4e, 0x52, 0x53, 0x4c, 0x00, 0x01, 0x02, 0x03, 0xff, 0x10])
const ORIGINAL_TEXT = 'The download must never replace this file.'

function snapshotReply(fileName: string, headers: Record<string, string> = {}) {
  return {
    status: 200,
    raw: SNAPSHOT_BYTES,
    headers: {
      'content-type': 'application/octet-stream',
      'content-disposition': `attachment; filename="${fileName}"`,
      ...headers,
    },
  }
}

describe('writing downloads', () => {
  let api: ContractServer
  let mcp: McpProcess
  let workspace: string
  let downloads: string
  let extension: string

  beforeAll(async () => {
    const documented = specOperation('download_index').fileExtension
    if (documented === undefined || documented === '') throw new Error('The spec gives download_index no extension.')
    extension = documented
    api = await startContractServer()
    workspace = await scratchFolder('downloads')
    downloads = join(workspace, 'downloads')
    await mkdir(downloads)
    await mkdir(join(workspace, 'outside'))
    mcp = await startMcpProcess(
      environmentOf({
        HIMRING_API_URL: api.baseUrl,
        HIMRING_API_KEY: 'hk_downloads',
        HIMRING_API_TIMEOUT_MS: String(BROKEN_DOWNLOAD_WAIT_MS),
        HIMRING_DOWNLOAD_DIRECTORY: downloads,
      }),
      workspace,
    )
  })

  beforeEach(async () => {
    api.reset()
    for (const name of await readdir(downloads)) await rm(join(downloads, name), { force: true })
  })
  afterEach(() => expect(api.problems).toEqual([]))

  afterAll(async () => {
    await mcp?.close()
    await api?.stop()
    await removeScratchFolders()
  })

  it('refuses a file name that leaves the folder or lacks the documented extension, before any request', async () => {
    for (const fileName of [
      `../escaped${extension}`,
      `nested/escaped${extension}`,
      `/tmp/escaped${extension}`,
      `.hidden${extension}`,
      'escaped.sh',
      `escaped${extension}.sh`,
      `escaped${extension.toUpperCase()}x`,
      '',
    ]) {
      const refused = await mcp.callTool('download_index', { ...TARGET, file_name: fileName })
      expect(refused.isError, fileName).toBe(true)
    }
    expect(api.requests).toEqual([])
    expect(await readdir(downloads)).toEqual([])
    expect(await readdir(workspace)).toEqual(['downloads', 'outside'])
  })

  it('writes the bytes under a safe name inside the folder when the API names a path outside it', async () => {
    api.stub('download_index', snapshotReply('../../outside/evil.sh'))
    const written = await mcp.callTool('download_index', TARGET)
    expect(written.isError, textOf(written)).not.toBe(true)
    const names = await readdir(downloads)
    expect(names).toHaveLength(1)
    const [name] = names
    if (name === undefined) throw new Error('The download wrote no file.')
    expect(name.endsWith(extension)).toBe(true)
    expect(name.startsWith('.')).toBe(false)
    expect(new Uint8Array(await readFile(join(downloads, name)))).toEqual(SNAPSHOT_BYTES)
    expect((await stat(join(downloads, name))).mode & 0o777).toBe(OWNER_ONLY_FILE_MODE)
    expect(written.structuredContent).toMatchObject({ file: join(downloads, name), bytes: SNAPSHOT_BYTES.byteLength })
    expect(await readdir(join(workspace, 'outside'))).toEqual([])
  })

  it('never replaces a file or writes through a link that sits at the name', async () => {
    const existing = `existing${extension}`
    const linked = `linked${extension}`
    await writeFile(join(downloads, existing), ORIGINAL_TEXT)
    await symlink(join(workspace, 'outside', `target${extension}`), join(downloads, linked))
    api.stub('download_index', snapshotReply(`fresh${extension}`))

    for (const fileName of [existing, linked]) {
      const refused = await mcp.callTool('download_index', { ...TARGET, file_name: fileName })
      expect(textOf(refused), fileName).toMatch(/^download_refused: /)
    }
    expect(await readFile(join(downloads, existing), 'utf8')).toBe(ORIGINAL_TEXT)
    expect((await lstat(join(downloads, linked))).isSymbolicLink()).toBe(true)
    expect(await readdir(join(workspace, 'outside'))).toEqual([])
    expect((await readdir(downloads)).sort()).toEqual([existing, linked].sort())
  })

  it('keeps no part of a download that breaks off midway', async () => {
    const before = await readdir(downloads)
    api.stub('download_index', snapshotReply(`broken${extension}`, { 'content-length': '1048576' }))
    const broken = await mcp.callTool('download_index', { ...TARGET, file_name: `broken${extension}` })
    expect(broken.isError).toBe(true)
    expect((await readdir(downloads)).sort()).toEqual(before.sort())
  })
})
