import { stat } from 'node:fs/promises'
import { describeError, type FileMetadata, fileKindOf, type HimringClient } from '@himring/sdk'
import {
  ATTEMPTS_PER_REQUEST,
  type FileRetryNotice,
  FOLDER_RULES,
  SYNC_CONCURRENCY_DEFAULT,
  SYNC_CONCURRENCY_MAXIMUM,
  syncFolder,
  uploadLocalFile,
} from '@himring/sdk/folders'
import type { McpServer } from '@modelcontextprotocol/server'
import { folderUploadResult, LISTED_ROWS_MAXIMUM, progressReporter } from './folder-upload-result.js'
import { accessSentencesOf } from './operation-descriptions.js'
import { operationPropertyOf } from './operation-input.js'
import { flagOf, optionalTextOf, textOf, wholeNumberOf } from './tool-arguments.js'
import { succeeded, ToolRefusedError } from './tool-results.js'
import { isRecord, type JsonSchema, plainToolSchemaOf } from './tool-schema.js'
import { confinedPathOf, localPathSchema, refusedUpload, uploadRefusal } from './upload-confinement.js'

const CONTROL_CHARACTER_PATTERN = /\p{Cc}/u
const TRAILING_SLASH_PATTERN = /\/$/
const DOT_SEGMENTS: ReadonlySet<string> = new Set(['.', '..'])
const WHOLE_UPLOAD_FOLDER = '.'

const knowledgeBaseTarget = {
  project_id: operationPropertyOf('create_upload', 'project_id'),
  knowledge_base_id: operationPropertyOf('create_upload', 'knowledge_base_id'),
}

const addFileSchema: JsonSchema = {
  type: 'object',
  properties: {
    ...knowledgeBaseTarget,
    local_path: localPathSchema(
      'The file to send, relative to the upload folder of this MCP server, such as policies/refunds.pdf.',
    ),
    path: {
      ...operationPropertyOf('create_upload', 'path'),
      description: 'The path of the file inside the knowledge base, by default local_path.',
    },
    address: operationPropertyOf('create_upload', 'address'),
    metadata: operationPropertyOf('create_upload', 'metadata'),
  },
  required: ['project_id', 'knowledge_base_id', 'local_path'],
  additionalProperties: false,
}

const uploadFolderSchema: JsonSchema = {
  type: 'object',
  properties: {
    ...knowledgeBaseTarget,
    folder: localPathSchema(
      'The folder to send, relative to the upload folder of this MCP server. By default the whole folder.',
    ),
    path: {
      type: 'string',
      maxLength: FOLDER_RULES.pathMaximumLength,
      description:
        'The folder inside the knowledge base that receives the files, such as policies, or an empty string for the top folder. By default the path of the sent folder inside the upload folder.',
    },
    concurrency: {
      type: 'integer',
      minimum: 1,
      maximum: SYNC_CONCURRENCY_MAXIMUM,
      description: `How many files to send at once, by default ${SYNC_CONCURRENCY_DEFAULT}.`,
    },
    dry_run: { type: 'boolean', description: 'List what the upload would send, without sending it.' },
  },
  required: ['project_id', 'knowledge_base_id'],
  additionalProperties: false,
}

function metadataOf(value: unknown): FileMetadata | undefined {
  if (typeof value === 'string') return value
  if (!isRecord(value)) return undefined
  const metadata: Record<string, string> = {}
  for (const [key, text] of Object.entries(value)) if (typeof text === 'string') metadata[key] = text
  return metadata
}

export interface UploadToolOptions {
  client: HimringClient
  uploadDirectory: string
  log: (line: string) => void
}

function retryLoggerOf(log: (line: string) => void): (notice: FileRetryNotice) => void {
  return notice =>
    log(
      `${describeError(notice.error)} The MCP server sends ${notice.path} again in ${notice.delayMs} ms, as attempt ${notice.attempt + 1} of ${ATTEMPTS_PER_REQUEST}.\n`,
    )
}

function folderSegmentsOf(path: string): string[] {
  const folder = path.normalize('NFC').replace(TRAILING_SLASH_PATTERN, '')
  if (folder === '') return []
  const segments = folder.split('/')
  const safe =
    !CONTROL_CHARACTER_PATTERN.test(folder) &&
    !folder.includes('\\') &&
    segments.every(segment => segment.trim().length > 0 && !DOT_SEGMENTS.has(segment))
  if (!safe) {
    throw new ToolRefusedError(
      'validation_failed',
      'Send path as a relative folder with forward slashes, such as policies/travel, with no empty, dot, or dot-dot parts, or as an empty string for the top folder.',
    )
  }
  return segments
}

export function registerUploadTools(server: McpServer, options: UploadToolOptions): void {
  const { client, uploadDirectory } = options
  const logRetry = retryLoggerOf(options.log)
  server.registerTool(
    'add_file',
    {
      title: 'Send one file to a knowledge base',
      description: `Send one file to a knowledge base under its path. The MCP server hashes the file, sends its bytes straight to storage through links that Himring signs for a few minutes, and answers once Himring has checked the bytes and recorded the file version. Himring skips a file whose content it already holds at that path. Reads the file from ${uploadDirectory}, and refuses any path that leads outside it. ${accessSentencesOf('create_upload')}`,
      inputSchema: plainToolSchemaOf(addFileSchema),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (input, context) => {
      try {
        const localPath = textOf(input, 'local_path')
        const confined = await confinedPathOf(uploadDirectory, localPath)
        if (fileKindOf(confined.inside) === undefined) {
          throw uploadRefusal(`${localPath} is not a kind of file that Himring reads.`)
        }
        const added = await uploadLocalFile({
          client,
          projectId: textOf(input, 'project_id'),
          knowledgeBaseId: textOf(input, 'knowledge_base_id'),
          absolutePath: confined.absolutePath,
          confinedTo: confined.root,
          path: optionalTextOf(input, 'path') ?? confined.inside,
          address: optionalTextOf(input, 'address'),
          metadata: metadataOf(input.metadata),
          signal: context.mcpReq.signal,
          onRetry: logRetry,
        })
        return succeeded(added)
      } catch (error) {
        return refusedUpload(error)
      }
    },
  )

  server.registerTool(
    'upload_folder',
    {
      title: 'Send a folder to a knowledge base',
      description: `Send every file of a folder inside ${uploadDirectory} that Himring reads, each under its path inside ${uploadDirectory}, the same path that add_file gives it, or inside the knowledge base folder that path names. Files whose content the knowledge base already holds are skipped, and hidden files, symbolic links, and files of other kinds stay local. The result counts the files added, kept as new versions, unchanged, failed, and left local, and it lists up to ${LISTED_ROWS_MAXIMUM} failed files with the reason, or the files that a dry run would send. The server reports progress while it sends when the request carries a progress token. ${accessSentencesOf('create_upload')}`,
      inputSchema: plainToolSchemaOf(uploadFolderSchema),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (input, context) => {
      try {
        const folder = optionalTextOf(input, 'folder') ?? WHOLE_UPLOAD_FOLDER
        const requestedPath = optionalTextOf(input, 'path')
        const pathPrefix = requestedPath === undefined ? undefined : folderSegmentsOf(requestedPath)
        const dryRun = flagOf(input, 'dry_run') ?? false
        const confined = await confinedPathOf(uploadDirectory, folder)
        const details = await stat(confined.absolutePath)
        if (!details.isDirectory()) throw uploadRefusal(`${folder} is not a folder.`)
        const report = await syncFolder({
          client,
          projectId: textOf(input, 'project_id'),
          knowledgeBaseId: textOf(input, 'knowledge_base_id'),
          root: confined.absolutePath,
          pathPrefix: pathPrefix ?? (confined.inside === '' ? [] : confined.inside.split('/')),
          concurrency: wholeNumberOf(input, 'concurrency') ?? SYNC_CONCURRENCY_DEFAULT,
          dryRun,
          signal: context.mcpReq.signal,
          onRetry: logRetry,
          onProgress: progressReporter(context.mcpReq._meta?.progressToken, notification =>
            context.mcpReq.notify(notification),
          ),
        })
        const result = folderUploadResult(report, dryRun)
        if (report.stoppedBy !== undefined || report.files.some(file => file.outcome === 'failed')) {
          return { ...succeeded(result), isError: true }
        }
        return succeeded(result)
      } catch (error) {
        return refusedUpload(error)
      }
    },
  )
}
