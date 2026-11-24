import { operationSpec } from '../core/spec-rules.js'
import { fileKindOf, READABLE_FILE_EXTENSIONS } from '../files/file-kinds.js'

function loadFolderRules() {
  const upload = operationSpec('create_upload')
  const listing = operationSpec('list_files')
  const limit = listing.input(['properties', 'limit'])
  const offset = listing.input(['properties', 'offset'])
  return {
    pathMaximumLength: upload.atMost(upload.input(['properties', 'path']), 'max_length', 'path'),
    listPageMaximum: listing.atMost(limit, 'max_value', 'limit'),
    listOffsetMaximum: listing.atMost(offset, 'max_value', 'offset'),
  }
}

export const FOLDER_RULES = loadFolderRules()

export type CheckedPath = { path: string } | { reason: string }

export function checkedFilePath(path: string): CheckedPath {
  const normalized = path.normalize('NFC')
  if (normalized.length === 0) return { reason: 'Give the path of the file inside the folder.' }
  if (normalized.length > FOLDER_RULES.pathMaximumLength) {
    return { reason: `The path is longer than ${FOLDER_RULES.pathMaximumLength} characters.` }
  }
  if (fileKindOf(normalized) === undefined) {
    return { reason: `Himring reads only files that end in ${READABLE_FILE_EXTENSIONS.join(', ')}.` }
  }
  return { path: normalized }
}
