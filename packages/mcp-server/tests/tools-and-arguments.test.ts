import { type ContractServer, errorReply, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { environmentOf, type McpProcess, startMcpProcess, textOf } from './support/mcp-process.js'
import { removeScratchFolders, scratchFolder } from './support/scratch-folders.js'
import { SPEC_OPERATIONS, specRequestBodyFieldMaximumLength } from './support/spec-oracle.js'

const PROJECT_ID = `prj_${'0a'.repeat(16)}`
const KNOWLEDGE_BASE_ID = `kb_${'1b'.repeat(16)}`
const SIGN_IN_STEPS = [
  'sign_up',
  'sign_in',
  'verify_second_factor',
  'begin_second_factor_setup',
  'confirm_second_factor_setup',
  'sign_out',
  'finish_source_sign_in',
]
const FILE_IMPORT_TOOLS = ['import_saved_questions', 'import_index_records', 'import_answer_log']
const TOOLS_OUTSIDE_THE_SPEC = ['get_status', 'add_file', 'download_file', 'upload_folder']
const OVERSIZED_ARGUMENT_CHARACTERS = 2 * 1024 * 1024

describe('the tools and their arguments', () => {
  let api: ContractServer
  let mcp: McpProcess

  beforeAll(async () => {
    api = await startContractServer()
    const folder = await scratchFolder('tools')
    mcp = await startMcpProcess(
      environmentOf({
        HIMRING_API_URL: api.baseUrl,
        HIMRING_API_KEY: 'hk_tools_and_arguments',
        HIMRING_UPLOAD_DIRECTORY: folder,
        HIMRING_DOWNLOAD_DIRECTORY: folder,
      }),
      folder,
    )
  })

  beforeEach(() => api.reset())
  afterEach(() => expect(api.problems).toEqual([]))

  afterAll(async () => {
    await mcp?.close()
    await api?.stop()
    await removeScratchFolders()
  })

  it('offers a tool for every operation in the spec except the sign-in steps, and nothing the spec lacks', async () => {
    const names = (await mcp.listTools()).map(tool => tool.name).sort()
    const offeredFromTheSpec = SPEC_OPERATIONS.filter(operation =>
      typeof operation.input['x-himring-mcp'] === 'boolean'
        ? operation.input['x-himring-mcp']
        : !SIGN_IN_STEPS.includes(operation.id) && (!operation.hasFileBody || FILE_IMPORT_TOOLS.includes(operation.id)),
    ).map(operation => operation.id)
    expect(names).toEqual([...offeredFromTheSpec, ...TOOLS_OUTSIDE_THE_SPEC].sort())
    for (const step of SIGN_IN_STEPS) expect(names).not.toContain(step)
  })

  it('sends typed list and number values in the wire form that the spec documents', async () => {
    api.stub('list_saved_questions', {
      status: 200,
      body: { saved_questions: [], total_count: 0, offset: 0, limit: 200 },
    })
    const answer = await mcp.callTool('list_saved_questions', {
      project_id: PROJECT_ID,
      knowledge_base_id: KNOWLEDGE_BASE_ID,
      state: ['broken', 'working'],
      limit: 200,
      offset: '0',
    })
    expect(answer.isError, textOf(answer)).not.toBe(true)
    expect(api.requests.map(request => [request.operation_id, request.query, request.problems])).toEqual([
      ['list_saved_questions', { state: 'broken,working', limit: '200', offset: '0' }, []],
    ])
  })

  it('refuses malformed arguments before it sends any request', async () => {
    const target = { project_id: PROJECT_ID, knowledge_base_id: KNOWLEDGE_BASE_ID }
    const malformed: [string, unknown][] = [
      ['list_saved_questions', { ...target, limit: -1 }],
      ['list_saved_questions', { ...target, limit: 1.5 }],
      ['list_saved_questions', { ...target, limit: '1e3' }],
      ['list_saved_questions', { ...target, limit: 2 ** 60 }],
      ['list_saved_questions', { ...target, state: [7] }],
      ['list_saved_questions', { ...target, state: { broken: true } }],
      ['list_saved_questions', { knowledge_base_id: KNOWLEDGE_BASE_ID }],
      ['list_saved_questions', { ...target, project_id: 'prj_../../v1/projects' }],
      ['list_saved_questions', { ...target, project_id: `${PROJECT_ID}/../x` }],
      ['list_saved_questions', { ...target, include_everything: 'true' }],
      ['get_file', { ...target, file_id: `fil_${'2c'.repeat(16)}`, file_name: 'x.pdf' }],
      ['create_database', { project_id: PROJECT_ID, name: 'Bad Name; DROP' }],
      ['list_saved_questions', [PROJECT_ID]],
      ['list_saved_questions', 'project_id=prj'],
    ]
    for (const [tool, args] of malformed) {
      const refused = await mcp.callTool(tool, args).then(
        result => result.isError === true,
        () => true,
      )
      expect(refused, `${tool} ${JSON.stringify(args)}`).toBe(true)
    }
    expect(api.requests).toEqual([])
  })

  it('refuses a field one character over the documented maximum length, and sends one at the maximum', async () => {
    const maximum = specRequestBodyFieldMaximumLength('create_database', 'name')
    api.stub('create_database', errorReply(404, 'project_not_found', 'The project does not exist.'))
    const over = await mcp.callTool('create_database', { project_id: PROJECT_ID, name: 'a'.repeat(maximum + 1) })
    expect(over.isError).toBe(true)
    expect(api.requests).toEqual([])
    const atMaximum = await mcp.callTool('create_database', { project_id: PROJECT_ID, name: 'a'.repeat(maximum) })
    expect(textOf(atMaximum)).toMatch(/^project_not_found: /)
    expect(api.requests.map(request => request.body)).toEqual([{ name: 'a'.repeat(maximum) }])
  })

  it('keeps answering after an argument of several megabytes', async () => {
    const huge = await mcp.callTool('create_database', {
      project_id: PROJECT_ID,
      name: 'a'.repeat(OVERSIZED_ARGUMENT_CHARACTERS),
    })
    expect(huge.isError).toBe(true)
    expect(api.requests).toEqual([])
    api.stub('get_project', errorReply(404, 'project_not_found', 'The project does not exist.'))
    expect(textOf(await mcp.callTool('get_project', { project_id: PROJECT_ID }))).toMatch(/^project_not_found: /)
  })
})
