import { extname } from 'node:path'
import { HIMRING_OPERATIONS, type HimringClient, type HimringOperationId } from '@himring/sdk'
import { HIMRING_OPERATION_CATALOGUE } from '@himring/sdk/catalogue'
import type { McpServer, ToolAnnotations } from '@modelcontextprotocol/server'
import { answerCheckOf } from './answer-checks.js'
import { accessSentencesOf } from './operation-descriptions.js'
import { operationInputOf, operationPropertyOf } from './operation-input.js'
import { optionalTextOf, textOf } from './tool-arguments.js'
import { succeeded, ToolRefusedError } from './tool-results.js'
import { type ToolArguments, toolSchemaOf } from './tool-schema.js'
import { boundedUploadOf, localPathSchema, refusedUpload, sizeText } from './upload-confinement.js'

const LOCAL_PATH_FIELD = 'local_path'
const FORMAT_FIELD = 'format'

const INDEX_RECORD_FORMAT_OF_EXTENSION: ReadonlyMap<string, string> = new Map([
  ['.json', 'json'],
  ['.ndjson', 'ndjson'],
  ['.jsonl', 'ndjson'],
  ['.csv', 'csv'],
])

interface FileBodyTool {
  id: HimringOperationId
  title: string
  localPathDescription: string
  extraSentence: string
  formatIsOptional: boolean
  annotations: ToolAnnotations
  formatOf?: ((requested: string | undefined, absolutePath: string) => string) | undefined
}

function choicesOf(id: HimringOperationId): string[] {
  const choices = operationPropertyOf(id, FORMAT_FIELD).enum
  return Array.isArray(choices) ? choices.filter(choice => typeof choice === 'string') : []
}

function indexRecordFormatOf(requested: string | undefined, absolutePath: string): string {
  if (requested !== undefined) return requested
  const fromExtension = INDEX_RECORD_FORMAT_OF_EXTENSION.get(extname(absolutePath).toLowerCase())
  if (fromExtension === undefined) {
    throw new ToolRefusedError(
      'validation_failed',
      `Send format as one of ${choicesOf('import_index_records').join(', ')}, because the extension of the file names none.`,
    )
  }
  return fromExtension
}

function savedQuestionFormatOf(requested: string | undefined, absolutePath: string): string {
  return requested ?? (extname(absolutePath).toLowerCase() === '.csv' ? 'csv' : 'jsonl')
}

const FILE_BODY_TOOLS: readonly FileBodyTool[] = [
  {
    id: 'import_saved_questions',
    title: 'Import a file of saved questions',
    localPathDescription:
      'The file of questions, relative to the upload folder of this MCP server, such as questions.jsonl.',
    extraSentence:
      'Each JSON line holds question, file, and quote, and a CSV file starts with the header row question,file,quote. The format is csv for a .csv file and jsonl otherwise, unless format names it.',
    formatIsOptional: true,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    formatOf: savedQuestionFormatOf,
  },
  {
    id: 'import_index_records',
    title: 'Import a file of index records',
    localPathDescription:
      'The file of records, relative to the upload folder of this MCP server, such as articles.ndjson.',
    extraSentence:
      'The format is json, ndjson, or csv, by default from the extension .json, .ndjson or .jsonl, or .csv.',
    formatIsOptional: true,
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
    formatOf: indexRecordFormatOf,
  },
  {
    id: 'import_answer_log',
    title: 'Import a log of answers',
    localPathDescription:
      'The JSON Lines log of answers, relative to the upload folder of this MCP server, such as answers.jsonl.',
    extraSentence: '',
    formatIsOptional: false,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
]

function maximumBytesOf(id: HimringOperationId): number {
  const operation = HIMRING_OPERATIONS[id]
  if (operation.body !== 'file') throw new Error(`The spec gives ${id} no file body.`)
  return operation.maximumBodyBytes
}

function registerFileBodyTool(server: McpServer, client: HimringClient, uploadDirectory: string, tool: FileBodyTool) {
  const maximumBytes = maximumBytesOf(tool.id)
  const checkedAnswer = answerCheckOf(tool.id)
  const description = [
    HIMRING_OPERATION_CATALOGUE[tool.id].summary,
    `Reads the file from ${uploadDirectory}, refuses any path that leads outside it, and refuses a file over ${sizeText(maximumBytes)}.`,
    tool.extraSentence,
    accessSentencesOf(tool.id),
  ]
  server.registerTool(
    tool.id,
    {
      title: tool.title,
      description: description.filter(part => part.length > 0).join(' '),
      inputSchema: toolSchemaOf(
        operationInputOf(tool.id, {
          properties: { [LOCAL_PATH_FIELD]: localPathSchema(tool.localPathDescription) },
          required: [LOCAL_PATH_FIELD],
          optional: tool.formatIsOptional ? [FORMAT_FIELD] : [],
        }),
      ),
      annotations: tool.annotations,
    },
    async (input, context) => {
      try {
        const { [LOCAL_PATH_FIELD]: localPath, ...operationInput }: ToolArguments = input
        const upload = await boundedUploadOf(uploadDirectory, textOf(input, LOCAL_PATH_FIELD), maximumBytes)
        const format = tool.formatOf?.(optionalTextOf(input, FORMAT_FIELD), upload.absolutePath)
        const sent = { ...operationInput, ...(format === undefined ? {} : { format }), content: upload.content }
        const answer = await client.invoke(tool.id, sent, { signal: context.mcpReq.signal })
        return succeeded(checkedAnswer(answer))
      } catch (error) {
        return refusedUpload(error)
      }
    },
  )
}

export function registerFileBodyTools(server: McpServer, client: HimringClient, uploadDirectory: string): void {
  for (const tool of FILE_BODY_TOOLS) registerFileBodyTool(server, client, uploadDirectory, tool)
}
