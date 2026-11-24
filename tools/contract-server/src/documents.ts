import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Ajv2020, type ValidateFunction } from 'ajv/dist/2020.js'

export const SPEC_DIRECTORY = join(import.meta.dirname, '..', '..', '..', 'spec')
export const DOCUMENT_FILES = ['openapi.json', 'openapi-session.json'] as const

export type JsonObject = Record<string, unknown>

export interface DocumentedParameter {
  name: string
  location: 'path' | 'query'
  required: boolean
  schemaKeys: (string | number)[]
}

export interface DocumentedOperation {
  id: string
  file: string
  method: string
  pathTemplate: string
  matcher: RegExp
  pathNames: string[]
  keys: (string | number)[]
  operation: JsonObject
  parameters: DocumentedParameter[]
  bodyKind: 'none' | 'json' | 'file'
  maximumBodyBytes: number | undefined
  needsCredential: boolean
}

export function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function objectAt(root: unknown, keys: readonly (string | number)[]): JsonObject | undefined {
  let current: unknown = root
  for (const key of keys) {
    current = isObject(current) || Array.isArray(current) ? Reflect.get(current, key) : undefined
  }
  return isObject(current) ? current : undefined
}

function pointerOf(keys: readonly (string | number)[]): string {
  return `#/${keys.map(key => String(key).replaceAll('~', '~0').replaceAll('/', '~1')).join('/')}`
}

function escapedForPattern(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function compiledPath(template: string): { matcher: RegExp; pathNames: string[] } {
  const pathNames: string[] = []
  const pattern = template
    .split('/')
    .map(segment => {
      const name = /^\{([^}]+)\}$/.exec(segment)?.[1]
      if (name === undefined) return escapedForPattern(segment)
      pathNames.push(name)
      return '([^/]+)'
    })
    .join('/')
  return { matcher: new RegExp(`^${pattern}$`), pathNames }
}

function parametersOf(operation: JsonObject, keys: (string | number)[]): DocumentedParameter[] {
  const raw = Array.isArray(operation.parameters) ? operation.parameters : []
  return raw.flatMap((parameter, index) => {
    if (!isObject(parameter) || typeof parameter.name !== 'string') return []
    if (parameter.in !== 'path' && parameter.in !== 'query') return []
    return [
      {
        name: parameter.name,
        location: parameter.in,
        required: parameter.required === true,
        schemaKeys: [...keys, 'parameters', index, 'schema'],
      },
    ]
  })
}

export class PublishedDocuments {
  readonly operations: DocumentedOperation[] = []
  private readonly ajv = new Ajv2020({ strict: false, validateFormats: false, allErrors: true })
  private readonly validators = new Map<string, ValidateFunction>()
  private readonly documents = new Map<string, JsonObject>()

  constructor(directory = SPEC_DIRECTORY) {
    for (const file of DOCUMENT_FILES) {
      const document: unknown = JSON.parse(readFileSync(join(directory, file), 'utf8'))
      if (!isObject(document)) throw new Error(`${file} is not a JSON object.`)
      this.documents.set(file, document)
      this.ajv.addSchema(document, file)
      for (const [pathTemplate, item] of Object.entries(objectAt(document, ['paths']) ?? {})) {
        for (const [method, operation] of Object.entries(isObject(item) ? item : {})) {
          if (!isObject(operation) || typeof operation.operationId !== 'string') continue
          const keys = ['paths', pathTemplate, method]
          const { matcher, pathNames } = compiledPath(pathTemplate)
          const content = objectAt(operation, ['requestBody', 'content'])
          const limit = objectAt(operation, ['requestBody'])?.['x-himring-maximum-bytes']
          const security = Array.isArray(operation.security) ? operation.security : []
          this.operations.push({
            id: operation.operationId,
            file,
            method: method.toUpperCase(),
            pathTemplate,
            matcher,
            pathNames,
            keys,
            operation,
            parameters: parametersOf(operation, keys),
            bodyKind:
              content === undefined ? 'none' : content['application/octet-stream'] === undefined ? 'json' : 'file',
            maximumBodyBytes: typeof limit === 'number' ? limit : undefined,
            needsCredential: security.length > 0,
          })
        }
      }
    }
  }

  operation(id: string): DocumentedOperation {
    const found = this.operations.find(candidate => candidate.id === id)
    if (found === undefined) throw new Error(`The documents hold no operation called ${id}.`)
    return found
  }

  match(
    method: string,
    path: string,
  ): { operation: DocumentedOperation; pathValues: Record<string, string> } | undefined {
    let best: { operation: DocumentedOperation; pathValues: Record<string, string> } | undefined
    for (const operation of this.operations) {
      if (operation.method !== method) continue
      const found = operation.matcher.exec(path)
      if (found === null) continue
      if (best !== undefined && best.operation.pathNames.length <= operation.pathNames.length) continue
      const pathValues: Record<string, string> = {}
      operation.pathNames.forEach((name, index) => {
        pathValues[name] = found[index + 1] ?? ''
      })
      best = { operation, pathValues }
    }
    return best
  }

  problemsOf(file: string, keys: readonly (string | number)[], value: unknown, place: string): string[] {
    const reference = `${file}${pointerOf(keys)}`
    let validate = this.validators.get(reference)
    if (validate === undefined) {
      validate = this.ajv.compile({ $ref: reference })
      this.validators.set(reference, validate)
    }
    if (validate(value)) return []
    return [`${place} breaks the documented schema: ${this.ajv.errorsText(validate.errors)}`]
  }

  successResponseKeys(operation: DocumentedOperation): { status: number; keys: (string | number)[] } | undefined {
    for (const status of Object.keys(objectAt(operation.operation, ['responses']) ?? {})) {
      if (/^2\d\d$/.test(status)) return { status: Number(status), keys: [...operation.keys, 'responses', status] }
    }
    return undefined
  }

  hasSchemaAt(file: string, keys: readonly (string | number)[]): boolean {
    return objectAt(this.documents.get(file), keys) !== undefined
  }
}
