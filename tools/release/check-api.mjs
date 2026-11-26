import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'

import { loadSpecModel } from '../../sdks/typescript/codegen/spec-model.ts'

const [baseline, candidate] = process.argv.slice(2)
if (!baseline || !candidate) throw new Error('Pass the released and candidate spec directories.')
const scratch = mkdtempSync(join(tmpdir(), 'himring-api-diff-'))

function comparableDocument(directory, file) {
  const source = JSON.parse(readFileSync(join(directory, file), 'utf8'), (key, value) => {
    if (key === 'x-himring-rules' && Array.isArray(value)) {
      return value.map(({ message, ...rule }) => rule)
    }
    return value
  })
  const code = source.components.schemas.error_code
  if (
    code.anyOf?.some(branch => isDeepStrictEqual(branch, { type: 'string' })) &&
    code.anyOf.every(branch => branch.type === 'string')
  ) {
    delete code.anyOf
    code.type = 'string'
  }
  return source
}

try {
  const offered = new Set(
    loadSpecModel(candidate)
      .operations.filter(op => op.mcp)
      .map(op => op.id),
  )
  for (const op of loadSpecModel(baseline).operations) {
    if (op.mcp && !offered.has(op.id)) throw new Error(`Removed MCP tool ${op.id}.`)
  }
  for (const file of ['openapi.json', 'openapi-session.json']) {
    const before = comparableDocument(baseline, file)
    const after = comparableDocument(candidate, file)
    for (const [path, item] of Object.entries(before.paths)) {
      for (const [method, old] of Object.entries(item)) {
        const next = after.paths[path]?.[method]
        if (next?.operationId !== old.operationId) throw new Error(`Changed operation ID for ${method} ${path}.`)
        if (old['x-himring-cli'] && !isDeepStrictEqual(old['x-himring-cli'], next['x-himring-cli']))
          throw new Error(`Changed CLI contract for ${old.operationId}.`)
      }
    }
    const a = join(scratch, 'released.json')
    const b = join(scratch, 'candidate.json')
    writeFileSync(a, JSON.stringify(before))
    writeFileSync(b, JSON.stringify(after))
    execFileSync('oasdiff', ['breaking', a, b, '--fail-on', 'ERR'], { stdio: 'inherit' })
  }
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
