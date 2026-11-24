#!/usr/bin/env node
import { createHimringClient, describeError } from '@himring/sdk'
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio'
import { readMcpServerConfig } from './config.js'
import { redactionOf } from './redaction.js'
import { createHimringMcpServer } from './server.js'

try {
  const config = readMcpServerConfig(process.env, process.cwd())
  const redaction = redactionOf(config.credential)
  const client = createHimringClient({
    baseUrl: config.apiUrl,
    timeoutMs: config.timeoutMs,
    credential: config.credential,
  })
  const server = createHimringMcpServer({
    client,
    downloadDirectory: config.downloadDirectory,
    uploadDirectory: config.uploadDirectory,
    timeoutMs: config.timeoutMs,
    log: line => process.stderr.write(redaction.text(line)),
  })
  await server.connect(new StdioServerTransport(process.stdin, redaction.output(process.stdout)))
} catch (error) {
  process.stderr.write(`The Himring MCP server failed to start: ${describeError(error)}\n`)
  process.exitCode = 1
}
