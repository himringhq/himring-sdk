import { execFileSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { specOperationIds } from './support/spec.js'

const PACKAGE_ROOT = join(import.meta.dirname, '..')
const TYPESCRIPT_COMPILER = join(PACKAGE_ROOT, 'node_modules', 'typescript', 'bin', 'tsc')
const RUNTIME_DEPENDENCIES = ['valibot', '@noble/hashes', '@types/node']
const COMMAND_TIMEOUT_MS = 60_000
const CONSUMER_KINDS = ['module', 'commonjs'] as const

type ConsumerKind = (typeof CONSUMER_KINDS)[number]

const CONSUMER_SOURCE = `import { createHimringClient, fileKindOf, isHimringApiError } from '@himring/sdk'
import { createAnswerRecorder, DEFAULT_ANSWER_DELIVERY_ATTEMPTS } from '@himring/sdk/answers'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import { checkedFilePath, FOLDER_RULES, syncFolder } from '@himring/sdk/folders'

const deliveryAttempts: number = DEFAULT_ANSWER_DELIVERY_ATTEMPTS
const report = {
  operationIds: Object.keys(HIMRING_OPERATION_CATALOGUE).sort(),
  functionTypes: [createHimringClient, fileKindOf, isHimringApiError, createAnswerRecorder, checkedFilePath, syncFolder].map(
    exported => typeof exported,
  ),
  plainErrorIsApiError: isHimringApiError(new Error('refused')),
  deliveryAttempts,
  folderRulesType: typeof FOLDER_RULES,
}
console.log(JSON.stringify(report))
`

const CONSUMER_TSCONFIG = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022'],
    module: 'NodeNext',
    moduleResolution: 'NodeNext',
    strict: true,
    skipLibCheck: false,
    types: ['node'],
    outDir: 'out',
    rootDir: '.',
  },
  include: ['index.ts'],
}

interface ConsumerReport {
  operationIds: string[]
  functionTypes: string[]
  plainErrorIsApiError: boolean
  deliveryAttempts: number
  folderRulesType: string
}

let scratch = ''
let tarballEntries: string[] = []
const reports = new Map<ConsumerKind, ConsumerReport>()

function runCommand(command: string, args: readonly string[], cwd: string): string {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: COMMAND_TIMEOUT_MS,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

async function packedPackage(): Promise<string> {
  const packDirectory = join(scratch, 'pack')
  await mkdir(packDirectory)
  runCommand('pnpm', ['pack', '--pack-destination', packDirectory], PACKAGE_ROOT)
  const [tarball] = (await readdir(packDirectory)).filter(file => file.endsWith('.tgz'))
  if (tarball === undefined) throw new Error('pnpm pack wrote no tarball.')
  const tarballPath = join(packDirectory, tarball)
  tarballEntries = runCommand('tar', ['--list', '--gzip', '--file', tarballPath], scratch)
    .split('\n')
    .filter(entry => entry.length > 0)
  const unpacked = join(scratch, 'unpacked')
  await mkdir(unpacked)
  runCommand('tar', ['--extract', '--gzip', '--file', tarballPath, '--directory', unpacked], scratch)
  return join(unpacked, 'package')
}

async function linkDependency(consumer: string, name: string): Promise<void> {
  const target = await realpath(join(PACKAGE_ROOT, 'node_modules', name))
  const link = join(consumer, 'node_modules', name)
  await mkdir(join(link, '..'), { recursive: true })
  await symlink(target, link, 'dir')
}

async function consumerReport(kind: ConsumerKind, packedRoot: string): Promise<ConsumerReport> {
  const consumer = join(scratch, kind)
  await mkdir(join(consumer, 'node_modules', '@himring'), { recursive: true })
  await cp(packedRoot, join(consumer, 'node_modules', '@himring', 'sdk'), { recursive: true })
  for (const name of RUNTIME_DEPENDENCIES) await linkDependency(consumer, name)
  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify({ name: `${kind}-consumer`, private: true, type: kind }),
  )
  await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify(CONSUMER_TSCONFIG))
  await writeFile(join(consumer, 'index.ts'), CONSUMER_SOURCE)
  runCommand(process.execPath, [TYPESCRIPT_COMPILER, '-p', 'tsconfig.json'], consumer)
  const output = runCommand(process.execPath, [join('out', 'index.js')], consumer)
  const parsed: ConsumerReport = JSON.parse(output)
  return parsed
}

beforeAll(async () => {
  scratch = await mkdtemp(join(tmpdir(), 'himring-sdk-package-'))
  const packedRoot = await packedPackage()
  for (const kind of CONSUMER_KINDS) reports.set(kind, await consumerReport(kind, packedRoot))
}, COMMAND_TIMEOUT_MS * 4)

afterAll(async () => {
  if (scratch.length > 0) await rm(scratch, { recursive: true, force: true })
})

describe('the packed @himring/sdk tarball', () => {
  it('ships built code only, with no source maps and no TypeScript sources', () => {
    expect(tarballEntries.filter(entry => entry.endsWith('.map'))).toEqual([])
    expect(tarballEntries.filter(entry => entry.startsWith('package/src/'))).toEqual([])
    expect(tarballEntries.filter(entry => entry.startsWith('package/tests/'))).toEqual([])
  })

  it.each(CONSUMER_KINDS)('typechecks and runs every entry for a %s consumer', kind => {
    const report = reports.get(kind)
    expect(report?.operationIds).toEqual(specOperationIds())
    expect(report?.functionTypes).toEqual(Array.from({ length: 6 }, () => 'function'))
    expect(report?.plainErrorIsApiError).toBe(false)
    expect(report?.deliveryAttempts).toBeGreaterThan(0)
    expect(report?.folderRulesType).toBe('object')
  })
})
