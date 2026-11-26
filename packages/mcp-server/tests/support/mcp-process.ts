import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import * as v from 'valibot'

export const MCP_SERVER_ENTRY = fileURLToPath(new URL('../../dist/main.js', import.meta.url))

const PROTOCOL_VERSION = '2025-11-25'
const ANSWER_TIMEOUT_MS = 20_000
const OUTPUT_KEPT_CHARACTERS = 4 * 1024 * 1024

const answerSchema = v.object({
  jsonrpc: v.literal('2.0'),
  id: v.number(),
  result: v.optional(v.unknown()),
  error: v.optional(v.object({ code: v.number(), message: v.string() })),
})

export const toolResultSchema = v.object({
  content: v.array(v.object({ type: v.string(), text: v.optional(v.string()) })),
  structuredContent: v.optional(v.record(v.string(), v.unknown())),
  isError: v.optional(v.boolean()),
})

export type ToolResult = v.InferOutput<typeof toolResultSchema>

export const toolListSchema = v.object({
  nextCursor: v.optional(v.string()),
  tools: v.array(
    v.object({
      name: v.string(),
      description: v.string(),
      inputSchema: v.looseObject({
        type: v.literal('object'),
        properties: v.optional(v.record(v.string(), v.unknown())),
      }),
    }),
  ),
})

export interface McpProcess {
  request(method: string, params: Record<string, unknown>): Promise<unknown>
  callTool(name: string, args: unknown): Promise<ToolResult>
  listTools(): Promise<v.InferOutput<typeof toolListSchema>['tools']>
  stdout(): string
  stderr(): string
  close(): Promise<void>
}

export function textOf(result: ToolResult): string {
  return result.content.map(part => part.text ?? '').join('\n')
}

export function environmentOf(extra: Record<string, string>): NodeJS.ProcessEnv {
  return { ...(process.env.PATH === undefined ? {} : { PATH: process.env.PATH }), ...extra }
}

function jsonOrUndefined(line: string): unknown {
  try {
    return JSON.parse(line)
  } catch {
    return undefined
  }
}

function spawned(
  environment: NodeJS.ProcessEnv,
  cwd: string,
  entry = MCP_SERVER_ENTRY,
): ChildProcessWithoutNullStreams {
  return spawn(process.execPath, [entry], { cwd, env: environment, stdio: ['pipe', 'pipe', 'pipe'] })
}

export async function startMcpProcess(
  environment: NodeJS.ProcessEnv,
  cwd: string,
  entry = MCP_SERVER_ENTRY,
): Promise<McpProcess> {
  const child = spawned(environment, cwd, entry)
  const waiting = new Map<number, { resolve(result: unknown): void; reject(error: Error): void }>()
  let nextId = 1
  let buffered = ''
  let output = ''
  let errors = ''
  child.stderr.setEncoding('utf8')
  child.stderr.on('data', (chunk: string) => {
    errors = `${errors}${chunk}`.slice(-OUTPUT_KEPT_CHARACTERS)
  })
  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (chunk: string) => {
    output = `${output}${chunk}`.slice(-OUTPUT_KEPT_CHARACTERS)
    buffered += chunk
    for (let newline = buffered.indexOf('\n'); newline >= 0; newline = buffered.indexOf('\n')) {
      const line = buffered.slice(0, newline).trim()
      buffered = buffered.slice(newline + 1)
      const parsed = v.safeParse(answerSchema, jsonOrUndefined(line))
      if (!parsed.success) continue
      const entry = waiting.get(parsed.output.id)
      if (entry === undefined) continue
      waiting.delete(parsed.output.id)
      if (parsed.output.error === undefined) entry.resolve(parsed.output.result)
      else entry.reject(new Error(`${parsed.output.error.code}: ${parsed.output.error.message}`))
    }
  })
  child.once('close', () => {
    for (const entry of waiting.values()) entry.reject(new Error(`The MCP server exited. Its stderr: ${errors}`))
    waiting.clear()
  })

  function send(message: Record<string, unknown>): void {
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`)
  }

  function request(method: string, params: Record<string, unknown>): Promise<unknown> {
    const id = nextId
    nextId += 1
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        waiting.delete(id)
        reject(new Error(`The MCP server did not answer ${method}. Its stderr: ${errors}`))
      }, ANSWER_TIMEOUT_MS)
      waiting.set(id, {
        resolve: result => {
          clearTimeout(timer)
          resolve(result)
        },
        reject: error => {
          clearTimeout(timer)
          reject(error)
        },
      })
      send({ id, method, params })
    })
  }

  await request('initialize', {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: { name: 'himring-mcp-server-tests', version: '0.0.0' },
  })
  send({ method: 'notifications/initialized' })

  return {
    request,
    async callTool(name, args) {
      return v.parse(toolResultSchema, await request('tools/call', { name, arguments: args }))
    },
    async listTools() {
      const tools: v.InferOutput<typeof toolListSchema>['tools'] = []
      const cursors = new Set<string>()
      let cursor: string | undefined
      do {
        const page = v.parse(toolListSchema, await request('tools/list', cursor === undefined ? {} : { cursor }))
        tools.push(...page.tools)
        cursor = page.nextCursor
        if (cursor !== undefined) {
          if (cursors.has(cursor)) throw new Error('The MCP server repeated a tool list cursor.')
          cursors.add(cursor)
        }
      } while (cursor !== undefined)
      return tools
    },
    stdout: () => output,
    stderr: () => errors,
    async close() {
      if (child.exitCode !== null || child.signalCode !== null) return
      const closed = new Promise(resolve => child.once('close', resolve))
      child.stdin.end()
      const forced = setTimeout(() => child.kill('SIGKILL'), ANSWER_TIMEOUT_MS)
      await closed
      clearTimeout(forced)
    },
  }
}

export interface ExitedProcess {
  exitCode: number | null
  stdout: string
  stderr: string
}

export function runUntilExit(environment: NodeJS.ProcessEnv, cwd: string): Promise<ExitedProcess> {
  const child = spawned(environment, cwd)
  let stdout = ''
  let stderr = ''
  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', (chunk: string) => {
    stdout += chunk
  })
  child.stderr.on('data', (chunk: string) => {
    stderr += chunk
  })
  child.stdin.end()
  return new Promise(resolve => {
    const forced = setTimeout(() => child.kill('SIGKILL'), ANSWER_TIMEOUT_MS)
    child.once('close', exitCode => {
      clearTimeout(forced)
      resolve({ exitCode, stdout, stderr })
    })
  })
}
