import { HIMRING_OPERATION_IDS, HIMRING_OPERATIONS, type HimringClient, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import type { McpServer } from '@modelcontextprotocol/server'
import { answerCheckOf } from './answer-checks.js'
import { downloadFileNameSchema, writeDownload } from './downloads.js'
import { annotationsOf, descriptionOf, pagingSentenceOf } from './operation-descriptions.js'
import { operationInputOf } from './operation-input.js'
import { failed, succeeded } from './tool-results.js'
import { plainToolSchemaOf, toolSchemaOf } from './tool-schema.js'

const OPERATIONS_FOR_PEOPLE_ONLY: ReadonlySet<string> = new Set<HimringOperationId>([
  'sign_up',
  'sign_in',
  'verify_second_factor',
  'begin_second_factor_setup',
  'confirm_second_factor_setup',
  'sign_out',
])

const FILE_NAME_FIELD = 'file_name'

export interface OperationToolOptions {
  client: HimringClient
  downloadDirectory: string
  timeoutMs: number
}

function registerJsonTool(server: McpServer, options: OperationToolOptions, id: HimringOperationId): void {
  const outputSchema = HIMRING_OPERATION_CATALOGUE[id].outputSchema
  const checkedAnswer = answerCheckOf(id)
  server.registerTool(
    id,
    {
      title: HIMRING_OPERATION_CATALOGUE[id].summary,
      description: descriptionOf(id, pagingSentenceOf(id)),
      inputSchema: toolSchemaOf(operationInputOf(id)),
      ...(outputSchema !== null && outputSchema.type === 'object'
        ? { outputSchema: plainToolSchemaOf(outputSchema) }
        : {}),
      annotations: annotationsOf(id),
    },
    async (input, context) => {
      try {
        const answer = await options.client.invoke(id, input, { signal: context.mcpReq.signal })
        return succeeded(checkedAnswer(answer))
      } catch (error) {
        return failed(error)
      }
    },
  )
}

function registerDownloadTool(server: McpServer, options: OperationToolOptions, id: HimringOperationId): void {
  const response = HIMRING_OPERATIONS[id].response
  const extension = response.kind === 'download' ? response.fileExtension : ''
  const written = extension === '' ? 'the file' : `the ${extension} file`
  server.registerTool(
    id,
    {
      title: HIMRING_OPERATION_CATALOGUE[id].summary,
      description: descriptionOf(
        id,
        `Writes ${written} into ${options.downloadDirectory}, under file_name or the name that the API gives, and never replaces a file that exists.`,
      ),
      inputSchema: toolSchemaOf(
        operationInputOf(id, { properties: { [FILE_NAME_FIELD]: downloadFileNameSchema(extension) } }),
      ),
      annotations: { ...annotationsOf(id), readOnlyHint: false, idempotentHint: false },
    },
    async (input, context) => {
      const { [FILE_NAME_FIELD]: fileName, ...operationInput } = input
      const signal = context.mcpReq.signal
      try {
        const result = await options.client.invoke(id, operationInput, { signal })
        const requestedName = typeof fileName === 'string' ? fileName : undefined
        const guard = { idleTimeoutMs: options.timeoutMs, signal }
        return succeeded(await writeDownload(result, options.downloadDirectory, requestedName, extension, guard))
      } catch (error) {
        return failed(error)
      }
    },
  )
}

export function registerOperationTools(server: McpServer, options: OperationToolOptions): void {
  for (const id of HIMRING_OPERATION_IDS) {
    const operation = HIMRING_OPERATIONS[id]
    if (OPERATIONS_FOR_PEOPLE_ONLY.has(id) || operation.body === 'file') continue
    if (operation.response.kind === 'download') registerDownloadTool(server, options, id)
    else registerJsonTool(server, options, id)
  }
}
