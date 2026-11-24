import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { DOCUMENT_TYPE_FILES, documentTypesOf } from './openapi-types.ts'
import { renderCatalogue } from './render-catalogue.ts'
import { renderMethods } from './render-methods.ts'
import { renderOperations } from './render-operations.ts'
import { renderShapes } from './render-shapes.ts'
import { renderTypes } from './render-types.ts'
import { loadSpecModel } from './spec-model.ts'

const GENERATED_DIRECTORY = join(import.meta.dirname, '..', 'src', 'generated')
const GENERATE_COMMAND = 'pnpm nx run sdk-typescript:generate'

async function committedText(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return undefined
    throw error
  }
}

async function main(mode: string | undefined): Promise<void> {
  if (mode !== 'write' && mode !== 'check') throw new Error('Run with write or check.')
  const model = loadSpecModel()
  const files = new Map([
    [DOCUMENT_TYPE_FILES.api, await documentTypesOf('api')],
    [DOCUMENT_TYPE_FILES.session, await documentTypesOf('session')],
    ['operations.ts', renderOperations(model)],
    ['types.ts', renderTypes(model)],
    ['methods.ts', renderMethods(model)],
    ['catalogue.ts', renderCatalogue(model)],
    ['shapes.ts', renderShapes(model)],
  ])
  if (mode === 'check') {
    const stale: string[] = []
    for (const [file, content] of files) {
      if ((await committedText(join(GENERATED_DIRECTORY, file))) !== content) stale.push(file)
    }
    if (stale.length > 0) {
      throw new Error(`src/generated/${stale.join(', ')} differ from the spec. Run ${GENERATE_COMMAND} and commit.`)
    }
    console.log(`src/generated matches the spec for ${model.operations.length} operations.`)
    return
  }
  await mkdir(GENERATED_DIRECTORY, { recursive: true })
  for (const [file, content] of files) {
    const path = join(GENERATED_DIRECTORY, file)
    const pending = `${path}.${process.pid}.pending`
    await writeFile(pending, content, 'utf8')
    await rename(pending, path)
  }
  console.log(`Wrote src/generated for ${model.operations.length} operations.`)
}

try {
  await main(process.argv[2])
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
