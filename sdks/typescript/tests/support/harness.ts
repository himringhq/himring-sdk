import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { type ContractServer, startContractServer } from '@himring/contract-server'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { createHimringClient, type HimringClient } from '../../src/index.js'

export const API_KEY = 'hk_live_contract_test_key'

const temporaryFolders: string[] = []

export async function temporaryFolder(): Promise<string> {
  const folder = await mkdtemp(join(tmpdir(), 'himring-sdk-'))
  temporaryFolders.push(folder)
  return folder
}

export async function removeTemporaryFolders(): Promise<void> {
  const folders = temporaryFolders.splice(0)
  await Promise.all(folders.map(folder => rm(folder, { recursive: true, force: true })))
}

export function idOf(prefix: string): string {
  return `${prefix}_${randomBytes(16).toString('hex')}`
}

export interface RecordedStorageRequest {
  method: string
  url: string
  headers: Readonly<Record<string, string | string[] | undefined>>
  body: Buffer
}

export type StorageHandler = (request: RecordedStorageRequest, response: ServerResponse) => void

export interface StorageServer {
  readonly origin: string
  readonly requests: RecordedStorageRequest[]
  handle(path: string, handler: StorageHandler): void
  reset(): void
  stop(): Promise<void>
}

async function bodyOf(request: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
  return Buffer.concat(chunks)
}

export async function startStorageServer(): Promise<StorageServer> {
  const handlers = new Map<string, StorageHandler>()
  const requests: RecordedStorageRequest[] = []
  const server = createServer((request, response) => {
    bodyOf(request)
      .then(body => {
        const url = new URL(request.url ?? '/', 'http://storage.invalid')
        const recorded = { method: request.method ?? 'GET', url: url.pathname, headers: request.headers, body }
        requests.push(recorded)
        const handler = handlers.get(url.pathname)
        if (handler === undefined) {
          response.writeHead(404).end()
          return
        }
        handler(recorded, response)
      })
      .catch(() => response.destroy())
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address: AddressInfo | string | null = server.address()
  if (address === null || typeof address === 'string') throw new Error('The storage server has no TCP port.')
  return {
    origin: `http://127.0.0.1:${address.port}`,
    requests,
    handle(path, handler) {
      handlers.set(path, handler)
    },
    reset() {
      handlers.clear()
      requests.length = 0
    },
    stop: () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close(error => (error === undefined ? resolve() : reject(error)))
      }),
  }
}

export interface Harness {
  api: ContractServer
  storage: StorageServer
  client: HimringClient
}

export function useHarness(): Harness {
  const harness: Partial<Harness> = {}
  const view = {
    get api() {
      if (harness.api === undefined) throw new Error('The contract server is not running.')
      return harness.api
    },
    get storage() {
      if (harness.storage === undefined) throw new Error('The storage server is not running.')
      return harness.storage
    },
    get client() {
      if (harness.client === undefined) throw new Error('The client is not ready.')
      return harness.client
    },
  }
  beforeAll(async () => {
    harness.api = await startContractServer()
    harness.storage = await startStorageServer()
    harness.client = createHimringClient({ baseUrl: harness.api.baseUrl, credential: API_KEY })
  })
  afterEach(async () => {
    harness.api?.reset()
    harness.storage?.reset()
    await removeTemporaryFolders()
  })
  afterAll(async () => {
    await harness.api?.stop()
    await harness.storage?.stop()
  })
  return view
}

export async function refusalOf(work: Promise<unknown>): Promise<unknown> {
  try {
    await work
  } catch (error) {
    return error
  }
  throw new Error('The call succeeded where the test expected it to fail.')
}
