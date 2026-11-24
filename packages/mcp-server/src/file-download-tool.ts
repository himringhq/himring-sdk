import type { HimringClient } from '@himring/sdk'
import type { McpServer } from '@modelcontextprotocol/server'
import { downloadFileNameSchema, writeDownload } from './downloads.js'
import { accessSentencesOf } from './operation-descriptions.js'
import { operationInputOf } from './operation-input.js'
import { optionalTextOf, textOf } from './tool-arguments.js'
import { failed, succeeded } from './tool-results.js'
import { toolSchemaOf } from './tool-schema.js'

const PDF_RENDITION = 'pdf'

export interface FileDownloadToolOptions {
  client: HimringClient
  downloadDirectory: string
  timeoutMs: number
}

export function registerFileDownloadTool(server: McpServer, options: FileDownloadToolOptions): void {
  server.registerTool(
    'download_file',
    {
      title: 'Download one version of a file',
      description: `Download one version of a file of a knowledge base straight from storage, through a link that Himring signs for a few minutes, or with rendition=pdf the PDF that Himring made of a Word file or a slide deck. Writes the file into ${options.downloadDirectory}, under file_name or the name of the file, and never replaces a file that exists. ${accessSentencesOf('get_download_link')}`,
      inputSchema: toolSchemaOf(
        operationInputOf('get_download_link', {
          properties: { file_name: downloadFileNameSchema('') },
          omitted: ['disposition'],
        }),
      ),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (input, context) => {
      const signal = context.mcpReq.signal
      try {
        const download = await options.client.downloadFile(
          {
            project_id: textOf(input, 'project_id'),
            knowledge_base_id: textOf(input, 'knowledge_base_id'),
            file_id: textOf(input, 'file_id'),
            version: Number(textOf(input, 'version')),
            rendition: optionalTextOf(input, 'rendition') === PDF_RENDITION ? PDF_RENDITION : undefined,
          },
          { signal },
        )
        const guard = { idleTimeoutMs: options.timeoutMs, signal }
        return succeeded(
          await writeDownload(download, options.downloadDirectory, optionalTextOf(input, 'file_name'), '', guard),
        )
      } catch (error) {
        return failed(error)
      }
    },
  )
}
