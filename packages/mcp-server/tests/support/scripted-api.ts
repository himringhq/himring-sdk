import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'

const LOOPBACK_HOST = '127.0.0.1'

export type ScriptedHandler = (request: IncomingMessage, response: ServerResponse) => void

export interface ScriptedApi {
  readonly baseUrl: string
  readonly authorizations: string[]
  answer(pathPattern: RegExp, handler: ScriptedHandler): void
  stop(): Promise<void>
}

export function json(response: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body)
  response.writeHead(status, { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(text)) })
  response.end(text)
}

export async function startScriptedApi(): Promise<ScriptedApi> {
  const handlers: [RegExp, ScriptedHandler][] = []
  const authorizations: string[] = []
  const server = createServer((request, response) => {
    authorizations.push(request.headers.authorization ?? '')
    const path = new URL(request.url ?? '/', `http://${LOOPBACK_HOST}`).pathname
    const handler = handlers.find(([pattern]) => pattern.test(path))?.[1]
    request.resume()
    if (handler === undefined)
      json(response, 404, { error: { code: 'not_found', message: `Nothing answers ${path}.` } })
    else handler(request, response)
  })
  await new Promise<void>(resolve => server.listen(0, LOOPBACK_HOST, resolve))
  const address = server.address()
  if (address === null || typeof address === 'string') throw new Error('The scripted API has no TCP port.')
  const { port } = address satisfies AddressInfo
  return {
    baseUrl: `http://${LOOPBACK_HOST}:${port}`,
    authorizations,
    answer(pathPattern, handler) {
      handlers.push([pathPattern, handler])
    },
    stop: () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close(error => (error === undefined ? resolve() : reject(error)))
      }),
  }
}
