import type * as NodeFs from 'node:fs'
import type * as NodeOs from 'node:os'
import type * as NodePath from 'node:path'
import * as v from 'valibot'
import { type AnswerEventInput, parsedWireAnswerEvent } from './answer-event-rules.js'

export const ANSWER_SPOOL_FILE_PREFIX = 'answers-'
export const ANSWER_SPOOL_FILE_SUFFIX = '.jsonl'
export const ANSWER_SPOOL_ORPHAN_AFTER_MS = 5 * 60_000
export const OWNER_ONLY_FILE_MODE = 0o600
export const OWNER_ONLY_DIRECTORY_MODE = 0o700
const GROUP_OR_OTHER_WRITE_BITS = 0o022
const SPOOL_HEADER_READ_BYTES = 4_096
const PROCESS_NOT_FOUND = 'ESRCH'

export interface NodeModules {
  fs: typeof NodeFs
  os: typeof NodeOs
  path: typeof NodePath
}

export interface SpooledAnswerEvent {
  id: string
  event: AnswerEventInput
}

export interface SpoolOwner {
  host: string
  pid: number
  instance: string
  destination: string
}

const ownerLineSchema = v.object({
  kind: v.literal('owner'),
  host: v.string(),
  pid: v.pipe(v.number(), v.integer()),
  instance: v.string(),
  destination: v.string(),
})
const eventLineSchema = v.object({ kind: v.literal('event'), id: v.string(), event: v.unknown() })
const doneLineSchema = v.object({ kind: v.literal('done'), ids: v.array(v.string()) })

export function nodeModules(): NodeModules | undefined {
  if (typeof process === 'undefined' || typeof process.getBuiltinModule !== 'function') return undefined
  return {
    fs: process.getBuiltinModule('node:fs'),
    os: process.getBuiltinModule('node:os'),
    path: process.getBuiltinModule('node:path'),
  }
}

export function ownerLine(owner: SpoolOwner): string {
  return `${JSON.stringify({ kind: 'owner', ...owner })}\n`
}

export function eventLine(item: SpooledAnswerEvent): string {
  return `${JSON.stringify({ kind: 'event', id: item.id, event: item.event })}\n`
}

export function doneLine(ids: readonly string[]): string {
  return `${JSON.stringify({ kind: 'done', ids })}\n`
}

function parsedLine(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function unsentEvents(text: string): SpooledAnswerEvent[] {
  const events = new Map<string, AnswerEventInput>()
  const done = new Set<string>()
  for (const raw of text.split('\n')) {
    if (raw.trim().length === 0) continue
    const value = parsedLine(raw)
    const asEvent = v.safeParse(eventLineSchema, value)
    if (asEvent.success) {
      const event = parsedWireAnswerEvent(asEvent.output.event)
      if (event !== undefined) events.set(asEvent.output.id, event)
      continue
    }
    const asDone = v.safeParse(doneLineSchema, value)
    if (asDone.success) for (const id of asDone.output.ids) done.add(id)
  }
  return [...events].filter(([id]) => !done.has(id)).map(([id, event]) => ({ id, event }))
}

export function ownerOf(modules: NodeModules, filePath: string): SpoolOwner | undefined {
  let descriptor: number | undefined
  try {
    descriptor = modules.fs.openSync(filePath, modules.fs.constants.O_RDONLY | modules.fs.constants.O_NOFOLLOW)
    const buffer = new Uint8Array(SPOOL_HEADER_READ_BYTES)
    const read = modules.fs.readSync(descriptor, buffer, 0, buffer.byteLength, 0)
    const [first] = new TextDecoder().decode(buffer.subarray(0, read)).split('\n')
    const owner = v.safeParse(ownerLineSchema, parsedLine(first ?? ''))
    return owner.success ? owner.output : undefined
  } catch {
    return undefined
  } finally {
    if (descriptor !== undefined) modules.fs.closeSync(descriptor)
  }
}

function processIsAlive(pid: number): boolean {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return !(error instanceof Error && 'code' in error && error.code === PROCESS_NOT_FOUND)
  }
}

export function isOrphaned(
  owner: SpoolOwner | undefined,
  modifiedAtMs: number,
  self: { host: string; liveInstances: ReadonlySet<string> },
  nowMs: number,
): boolean {
  if (owner === undefined || owner.host !== self.host) return nowMs - modifiedAtMs > ANSWER_SPOOL_ORPHAN_AFTER_MS
  if (owner.pid === process.pid) return !self.liveInstances.has(owner.instance)
  return !processIsAlive(owner.pid)
}

export function isPrivateDirectory(modules: NodeModules, directory: string): boolean {
  const stats = modules.fs.lstatSync(directory)
  if (!stats.isDirectory()) return false
  if ((stats.mode & GROUP_OR_OTHER_WRITE_BITS) !== 0) return false
  const uid = typeof process.getuid === 'function' ? process.getuid() : undefined
  return uid === undefined || stats.uid === uid
}

export function isOwnRegularFile(stats: NodeFs.Stats): boolean {
  if (!stats.isFile()) return false
  const uid = typeof process.getuid === 'function' ? process.getuid() : undefined
  return uid === undefined || stats.uid === uid
}

export function isSpoolFileName(name: string): boolean {
  return name.startsWith(ANSWER_SPOOL_FILE_PREFIX) && name.endsWith(ANSWER_SPOOL_FILE_SUFFIX)
}
