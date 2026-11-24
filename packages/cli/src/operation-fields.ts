import type { HimringOperationId } from '@himring/sdk'
import { type Command, InvalidArgumentError, Option } from 'commander'
import type { CommandContext } from './command-context.js'
import { fieldHintOf, hintText } from './field-hints.js'
import { readJsonSource, readTextSource } from './input-sources.js'
import { inputPropertiesOf, type JsonSchema, requiredInputsOf } from './spec-schemas.js'
import { isRecord } from './text-cells.js'
import { UsageError } from './usage-error.js'

export type FieldKind = 'scalar' | 'json' | 'list' | 'boolean'
type TextFileReading = 'verbatim' | 'trimmed'

export interface FieldOption {
  name: string
  flag: string
  attribute: string
  kind: FieldKind
  required: boolean
  help: string
  textFile: TextFileReading | undefined
}

const TEXT_FILE_FIELDS: ReadonlyMap<string, TextFileReading> = new Map([
  ['sql', 'verbatim'],
  ['token', 'trimmed'],
])
const ID_SUFFIX = '_id'
const PROJECT_FIELD = 'project_id'
const PROJECT_VARIABLE = 'HIMRING_PROJECT'
const INPUT_FILE_ATTRIBUTE = 'inputFile'
const LIST_SEPARATOR = ','

function kebab(name: string): string {
  return name.replaceAll('_', '-')
}

function camel(flag: string): string {
  return flag.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase())
}

function optionsOf(schema: JsonSchema): JsonSchema[] {
  return Array.isArray(schema.anyOf) ? schema.anyOf.filter(isRecord) : []
}

function isNullSchema(schema: JsonSchema): boolean {
  return schema.type === 'null'
}

function isObjectSchema(schema: JsonSchema): boolean {
  if (schema.type === 'object') return true
  const options = optionsOf(schema)
  return options.length > 0 && options.every(isObjectSchema)
}

function kindOfAnyOf(options: readonly JsonSchema[]): FieldKind {
  const present = options.filter(option => !isNullSchema(option))
  const [only] = present
  if (only !== undefined && present.length === 1) {
    const kind = kindOf(only)
    if (present.length === options.length) return kind
    return kind === 'json' || kind === 'list' ? 'json' : 'scalar'
  }
  return present.length > 0 && present.every(isObjectSchema) ? 'json' : 'scalar'
}

function kindOf(schema: JsonSchema): FieldKind {
  const options = optionsOf(schema)
  if (options.length > 0) return kindOfAnyOf(options)
  if (schema.type === 'boolean') return 'boolean'
  if (schema.type === 'array') {
    return isRecord(schema.items) && schema.items.type === 'string' && schema.items.enum === undefined ? 'list' : 'json'
  }
  return schema.type === 'object' ? 'json' : 'scalar'
}

function helpOf(name: string, schema: JsonSchema, kind: FieldKind, required: boolean): string {
  if (kind === 'json') return `read ${name} as JSON from a file, or - for stdin${required ? ' (required)' : ''}`
  const shape = kind === 'list' ? ', separated by commas' : kind === 'boolean' ? ' (true or false)' : ''
  const hint = hintText(fieldHintOf(schema))
  const description = typeof schema.description === 'string' ? `: ${schema.description}` : ''
  return `${name}${required ? ' (required)' : ''}${shape}${hint}${description}`
}

export function fieldOptionsOf(id: HimringOperationId): FieldOption[] {
  const required = requiredInputsOf(id)
  return Object.entries(inputPropertiesOf(id)).map(([name, schema]) => {
    const kind = kindOf(schema)
    const flag = kebab(name.endsWith(ID_SUFFIX) ? name.slice(0, -ID_SUFFIX.length) : name)
    const optionFlag = kind === 'json' ? `${flag}-file` : flag
    return {
      name,
      flag: optionFlag,
      attribute: camel(optionFlag),
      kind,
      required: required.has(name),
      help: helpOf(name, schema, kind, required.has(name)),
      textFile: TEXT_FILE_FIELDS.get(name),
    }
  })
}

function parseBoolean(value: string): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  throw new InvalidArgumentError('Pass true or false.')
}

function parseList(value: string): string[] {
  return value
    .split(LIST_SEPARATOR)
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

function textFileAttributeOf(field: FieldOption): string {
  return camel(`${field.flag}-file`)
}

export function addFieldOptions(command: Command, fields: readonly FieldOption[]): void {
  for (const field of fields) {
    const placeholder = field.kind === 'json' ? '<path>' : '<value>'
    const option = new Option(`--${field.flag} ${placeholder}`, field.help)
    if (field.kind === 'boolean') option.argParser(parseBoolean)
    if (field.kind === 'list') option.argParser(parseList)
    if (field.name === PROJECT_FIELD) option.env(PROJECT_VARIABLE)
    command.addOption(option)
    if (field.textFile !== undefined) {
      command.addOption(new Option(`--${field.flag}-file <path>`, `read ${field.name} from a file, or - for stdin`))
    }
  }
}

export async function inputFrom(
  context: CommandContext,
  fields: readonly FieldOption[],
  options: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const input: Record<string, unknown> = {}
  const inputFile = options[INPUT_FILE_ATTRIBUTE]
  if (typeof inputFile === 'string') {
    const whole = await readJsonSource(context, inputFile, 'the input')
    if (!isRecord(whole)) throw new UsageError('The input file must hold one JSON object.', 'Wrap the fields in { }.')
    for (const [name, value] of Object.entries(whole))
      Object.defineProperty(input, name, { value, enumerable: true, writable: true, configurable: true })
  }
  for (const field of fields) {
    const value = options[field.attribute]
    const textFile = field.textFile === undefined ? undefined : options[textFileAttributeOf(field)]
    if (typeof textFile === 'string') {
      const text = await readTextSource(context, textFile, field.name)
      input[field.name] = field.textFile === 'trimmed' ? text.trim() : text
    } else if (field.kind === 'json' && typeof value === 'string') {
      input[field.name] = await readJsonSource(context, value, field.name)
    } else if (value !== undefined) input[field.name] = value
  }
  return input
}
