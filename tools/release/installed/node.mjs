import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { environmentOf, startMcpProcess } from '../../../packages/mcp-server/tests/support/mcp-process.ts'

const requireInstalled = createRequire(resolve('package.json'))
const { createHimringClient, HIMRING_OPERATION_IDS } = requireInstalled('@himring/sdk')
const documents = ['openapi.json', 'openapi-session.json'].map(file => requireInstalled(`@himring/openapi/${file}`))
const expected = documents.flatMap(doc =>
  Object.entries(doc.paths).flatMap(([path, methods]) =>
    Object.entries(methods).map(([method, op]) => ({
      id: op.operationId,
      method: method.toUpperCase(),
      path: path.replace(/\{(\w+)\}/g, ':$1'),
      access: op['x-himring-access'],
      mcp: op['x-himring-mcp'],
    })),
  ),
)
const ids = expected.map(op => op.id).sort()
assert.deepEqual([...HIMRING_OPERATION_IDS].sort(), ids)
const url = process.env.HIMRING_API_URL
assert(url)
const client = createHimringClient({ baseUrl: url })
function checkCatalogue(result) {
  for (const { id, method, path, access } of expected) {
    const rows = result.operations.filter(row => row.id === id)
    assert.equal(rows.length, 1, id)
    assert.deepEqual([rows[0].method, rows[0].path, rows[0].access], [method, path, access], id)
  }
}
checkCatalogue(await client.listOperations({}))
const environment = environmentOf({ HIMRING_API_URL: url, HIMRING_CONFIG_DIR: process.cwd() })
const cli = resolve('node_modules/.bin/himring')
checkCatalogue(
  JSON.parse(
    execFileSync(cli, ['operations', 'list', '--output', 'json'], {
      encoding: 'utf8',
      env: environment,
      timeout: 30000,
    }),
  ).data,
)
const mcp = await startMcpProcess(environment, process.cwd(), resolve('node_modules/.bin/himring-mcp'))
try {
  const tools = (await mcp.listTools()).map(t => t.name)
  assert.equal(tools.length, new Set(tools).size)
  for (const op of expected) {
    assert.equal(typeof op.mcp, 'boolean', 'Choose a contract that declares MCP exposure.')
    assert.equal(tools.includes(op.id), op.mcp, op.id)
  }
  const reply = await mcp.callTool('list_operations', {})
  assert(!reply.isError)
  checkCatalogue(reply.structuredContent)
} finally {
  await mcp.close()
}
writeFileSync('operations.txt', ids.join('\n') + '\n')
