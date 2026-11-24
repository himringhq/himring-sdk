import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import openapiTS from 'openapi-typescript'
import ts from 'typescript'
import { DOCUMENT_FILES, type DocumentName, SPEC_DIRECTORY } from './spec-model.ts'

export const DOCUMENT_TYPE_FILES: Readonly<Record<DocumentName, string>> = {
  api: 'api-document.ts',
  session: 'session-document.ts',
}

const COMMENT_FREE_PRINTER = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true })

export async function documentTypesOf(document: DocumentName, directory = SPEC_DIRECTORY): Promise<string> {
  const file = DOCUMENT_FILES[document]
  const nodes = await openapiTS(await readFile(join(directory, file), 'utf8'), {
    alphabetize: true,
    defaultNonNullable: false,
    exportType: false,
    silent: true,
  })
  const context = ts.createSourceFile(file.replace('.json', '.ts'), '', ts.ScriptTarget.Latest)
  const printed = COMMENT_FREE_PRINTER.printList(ts.ListFormat.MultiLine, ts.factory.createNodeArray(nodes), context)
  return printed.endsWith('\n') ? printed : `${printed}\n`
}
