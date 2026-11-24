import { createRequire } from 'node:module'
import { describeError, type HimringClient } from '@himring/sdk'
import { type CallToolResult, McpServer } from '@modelcontextprotocol/server'
import * as v from 'valibot'
import { registerFileBodyTools } from './file-body-tools.js'
import { registerFileDownloadTool } from './file-download-tool.js'
import { registerOperationTools } from './operation-tools.js'
import { succeeded } from './tool-results.js'
import { type JsonSchema, plainToolSchemaOf } from './tool-schema.js'
import { registerUploadTools } from './upload-tools.js'

const packageManifestSchema = v.object({ version: v.pipe(v.string(), v.nonEmpty()) })
const MCP_SERVER_VERSION = v.parse(packageManifestSchema, createRequire(import.meta.url)('../package.json')).version

const READINESS_REPORT_SCHEMA: JsonSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ready', 'not_ready'] },
    dependencies: { type: 'object', additionalProperties: { type: 'string', enum: ['up', 'down'] } },
  },
  required: ['status', 'dependencies'],
}

export interface HimringMcpServerOptions {
  client: HimringClient
  downloadDirectory: string
  uploadDirectory: string
  timeoutMs: number
  log: (line: string) => void
}

async function readStatus(client: HimringClient, signal: AbortSignal): Promise<CallToolResult> {
  try {
    return succeeded(await client.getReadiness({ signal }))
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `${describeError(error)} Check that the Himring API is up and that HIMRING_API_URL holds its address.`,
        },
      ],
    }
  }
}

export function createHimringMcpServer(options: HimringMcpServerOptions): McpServer {
  const server = new McpServer({ name: 'himring', version: MCP_SERVER_VERSION })

  server.registerTool(
    'get_status',
    {
      title: 'Get Himring status',
      description:
        'Reports whether the Himring API is ready, and whether the control database, the search engine, and the database server behind it respond to requests.',
      outputSchema: plainToolSchemaOf(READINESS_REPORT_SCHEMA),
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    context => readStatus(options.client, context.mcpReq.signal),
  )
  registerOperationTools(server, options)
  registerFileDownloadTool(server, options)
  registerUploadTools(server, options)
  registerFileBodyTools(server, options.client, options.uploadDirectory)

  return server
}
