import { isAbsolute } from 'node:path'
import { DEFAULT_HIMRING_API_TIMEOUT_MS, DEFAULT_HIMRING_API_URL } from '@himring/sdk'
import * as v from 'valibot'
import {
  absoluteDirectoryVariable,
  credentialVariable,
  readEnvironment,
  timerDelayVariable,
  urlVariable,
} from './environment-variables.js'

const environmentSchema = v.object({
  HIMRING_API_URL: urlVariable('HIMRING_API_URL', DEFAULT_HIMRING_API_URL),
  HIMRING_API_TIMEOUT_MS: timerDelayVariable('HIMRING_API_TIMEOUT_MS', DEFAULT_HIMRING_API_TIMEOUT_MS),
  HIMRING_API_KEY: credentialVariable('HIMRING_API_KEY'),
  HIMRING_SESSION_TOKEN: credentialVariable('HIMRING_SESSION_TOKEN'),
  HIMRING_DOWNLOAD_DIRECTORY: absoluteDirectoryVariable(
    'HIMRING_DOWNLOAD_DIRECTORY',
    isAbsolute,
    '/srv/himring/downloads',
  ),
  HIMRING_UPLOAD_DIRECTORY: absoluteDirectoryVariable('HIMRING_UPLOAD_DIRECTORY', isAbsolute, '/srv/himring/policies'),
})

export interface McpServerConfig {
  apiUrl: string
  timeoutMs: number
  credential: string | undefined
  downloadDirectory: string
  uploadDirectory: string
}

export function readMcpServerConfig(environment: NodeJS.ProcessEnv, workingDirectory: string): McpServerConfig {
  const values = readEnvironment('the Himring MCP server', environmentSchema, environment)
  return {
    apiUrl: values.HIMRING_API_URL,
    timeoutMs: values.HIMRING_API_TIMEOUT_MS,
    credential: values.HIMRING_API_KEY ?? values.HIMRING_SESSION_TOKEN,
    downloadDirectory: values.HIMRING_DOWNLOAD_DIRECTORY ?? workingDirectory,
    uploadDirectory: values.HIMRING_UPLOAD_DIRECTORY ?? workingDirectory,
  }
}
