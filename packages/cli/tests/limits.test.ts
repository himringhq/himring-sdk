import { truncate, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type ContractServer, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { EXIT, envelopeOf, failureCodeOf, runCli } from './support/cli-run.js'
import { scratchFolders } from './support/scratch.js'
import { specMaximumBodyBytes, specParameterSchema, specRuleBound } from './support/spec-oracle.js'

const PROJECT = 'prj_0123456789abcdef0123456789abcdef'
const KNOWLEDGE_BASE = 'kb_0123456789abcdef0123456789abcdef'
const INDEX = 'ix_0123456789abcdef0123456789abcdef'
const DATABASE = 'db_0123456789abcdef0123456789abcdef'
const API_KEY = 'hmk_contract_test_key'

const FILE_COMMANDS = [
  {
    id: 'import_saved_questions',
    args: ['saved-questions', 'import', '--knowledge-base', KNOWLEDGE_BASE],
    name: 'q.jsonl',
  },
  { id: 'import_index_records', args: ['records', 'import', '--index', INDEX], name: 'records.ndjson' },
  { id: 'import_answer_log', args: ['answer-events', 'import', '--knowledge-base', KNOWLEDGE_BASE], name: 'a.jsonl' },
  {
    id: 'upload_table_import',
    args: ['imports', 'upload', '--database', DATABASE, '--table-name', 'orders'],
    name: 'o.csv',
  },
] as const

describe('limits that the spec sets', () => {
  let server: ContractServer
  const scratch = scratchFolders()

  function himring(args: readonly string[], cwd?: string) {
    return runCli([...args, '--output', 'json'], {
      environment: { HIMRING_API_URL: server.baseUrl, HIMRING_API_KEY: API_KEY, HIMRING_PROJECT: PROJECT },
      ...(cwd === undefined ? {} : { cwd }),
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

  it.each(FILE_COMMANDS)('refuses a file one byte over the maximum of $id before it sends anything', async command => {
    const folder = await scratch.make('over-limit')
    const path = join(folder, command.name)
    await writeFile(path, '')
    await truncate(path, specMaximumBodyBytes(command.id) + 1)
    const result = await himring([...command.args, '--from', path])
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.usage, 'usage'])
    expect(envelopeOf(result).error?.message).toContain('holds more than')
    expect(server.requests).toEqual([])
  })

  it('sends a file of exactly the maximum size whole', async () => {
    const maximum = specMaximumBodyBytes('import_saved_questions')
    server.stub('import_saved_questions', {
      status: 201,
      body: { added: 0, refused_count: 0, refused: [], saved_questions: [] },
    })
    const folder = await scratch.make('at-limit')
    const path = join(folder, 'questions.jsonl')
    await writeFile(path, '')
    await truncate(path, maximum)
    const result = await himring(['saved-questions', 'import', '--knowledge-base', KNOWLEDGE_BASE, '--from', path])
    expect(result.exitCode, result.stderr).toBe(EXIT.success)
    expect(server.requests.map(request => [request.operation_id, request.raw_body.byteLength])).toEqual([
      ['import_saved_questions', maximum],
    ])
    expect(server.problems).toEqual([])
  })

  it('refuses a list limit above the documented maximum and sends one at the maximum', async () => {
    const maximum = specRuleBound(specParameterSchema('list_projects', 'limit'), 'max_value')
    const over = await himring(['projects', 'list', '--limit', String(maximum + 1)])
    expect([over.exitCode, failureCodeOf(over)]).toEqual([EXIT.usage, 'usage'])
    expect(server.requests).toEqual([])
    server.stub('list_projects', { status: 200, body: { projects: [], total_count: 0, limit: maximum, offset: 0 } })
    const at = await himring(['projects', 'list', '--limit', String(maximum)])
    expect(at.exitCode, at.stderr).toBe(EXIT.success)
    expect(server.requests.map(request => request.query.limit)).toEqual([String(maximum)])
  })

  it('refuses IDs that would change the request path before it sends anything', async () => {
    for (const index of ['../../api-keys', `${INDEX}/../../api-keys`, '%2e%2e', '']) {
      const result = await himring(['indexes', 'get', '--index', index])
      expect([result.exitCode, failureCodeOf(result)], index).toEqual([EXIT.usage, 'usage'])
    }
    const project = await himring(['indexes', 'get', '--project', '../', '--index', INDEX])
    expect(project.exitCode).toBe(EXIT.usage)
    expect(server.requests).toEqual([])
  })

  it('refuses a list value outside the documented choices before it sends anything', async () => {
    const result = await himring([
      'flagged-questions',
      'list',
      '--knowledge-base',
      KNOWLEDGE_BASE,
      '--status',
      'saved,everything',
    ])
    expect([result.exitCode, failureCodeOf(result)]).toEqual([EXIT.usage, 'usage'])
    expect(envelopeOf(result).error?.message).toContain('status')
    expect(server.requests).toEqual([])
  })
})
