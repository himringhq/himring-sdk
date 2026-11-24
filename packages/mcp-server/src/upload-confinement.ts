import { realpath } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import { describeError } from '@himring/sdk'
import { boundedBytesOf, isInside, LocalFileRefusedError, openLocalFile } from '@himring/sdk/folders'
import type { CallToolResult } from '@modelcontextprotocol/server'
import { failed, ToolRefusedError } from './tool-results.js'
import type { JsonSchema } from './tool-schema.js'

const LOCAL_PATH_MAXIMUM_LENGTH = 4_096
const BYTES_PER_MEBIBYTE = 1024 * 1024
const UPLOAD_REFUSED = 'upload_refused'

export interface ConfinedPath {
  root: string
  absolutePath: string
  inside: string
}

export interface BoundedUpload {
  absolutePath: string
  content: Uint8Array
}

export function localPathSchema(description: string): JsonSchema {
  return {
    type: 'string',
    minLength: 1,
    maxLength: LOCAL_PATH_MAXIMUM_LENGTH,
    description,
    'x-himring-rules': [
      { kind: 'min_length', message: 'Send the local path.' },
      {
        kind: 'max_length',
        message: `Shorten the local path to ${LOCAL_PATH_MAXIMUM_LENGTH} characters or fewer.`,
      },
    ],
  }
}

export function uploadRefusal(message: string): ToolRefusedError {
  return new ToolRefusedError(UPLOAD_REFUSED, message)
}

export function refusedUpload(error: unknown): CallToolResult {
  if (error instanceof LocalFileRefusedError) return failed(uploadRefusal(describeError(error)))
  return failed(error)
}

export function sizeText(bytes: number): string {
  return bytes % BYTES_PER_MEBIBYTE === 0 ? `${bytes / BYTES_PER_MEBIBYTE} MiB` : `${bytes} bytes`
}

function knowledgeBasePathOf(root: string, absolutePath: string): string {
  return relative(root, absolutePath).split(sep).join('/')
}

export async function confinedPathOf(uploadDirectory: string, localPath: string): Promise<ConfinedPath> {
  if (isAbsolute(localPath)) {
    throw uploadRefusal('Send local_path relative to the upload folder, such as policies/refunds.pdf.')
  }
  const root = await realpath(uploadDirectory)
  const resolved = await realpath(resolve(root, localPath)).catch(() => undefined)
  if (resolved === undefined) throw uploadRefusal(`${localPath} does not exist in the upload folder.`)
  if (!isInside(root, resolved)) {
    throw uploadRefusal(`${localPath} leads outside the upload folder, so the tool refuses to send it.`)
  }
  const inside = knowledgeBasePathOf(root, resolved)
  if (inside.split('/').some(segment => segment.startsWith('.'))) {
    throw uploadRefusal(`${localPath} is hidden, and hidden files and folders stay local.`)
  }
  return { root, absolutePath: resolved, inside }
}

export async function boundedUploadOf(
  uploadDirectory: string,
  localPath: string,
  maximumBytes: number,
): Promise<BoundedUpload> {
  const confined = await confinedPathOf(uploadDirectory, localPath)
  const opened = await openLocalFile(confined.absolutePath, confined.root)
  let content: Uint8Array | undefined
  try {
    content = await boundedBytesOf(opened, maximumBytes)
  } finally {
    await opened.close()
  }
  if (content === undefined) {
    throw uploadRefusal(`${localPath} holds more than ${sizeText(maximumBytes)}, so split it into several files.`)
  }
  return { absolutePath: confined.absolutePath, content }
}
