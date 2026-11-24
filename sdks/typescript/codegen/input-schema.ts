import { isRecord, type JsonSchema, type OperationModel, SpecModelError } from './spec-model.ts'

const RULES_KEYWORD = 'x-himring-rules'

export function inputSchemaOf(operation: OperationModel): JsonSchema {
  const properties: Record<string, unknown> = {}
  const required: string[] = []
  function add(name: string, schema: unknown, isRequired: boolean, part: string): void {
    if (Object.hasOwn(properties, name)) {
      throw new SpecModelError(`${operation.id} takes ${name} in more than one part of the request.`)
    }
    if (!isRecord(schema)) throw new SpecModelError(`${operation.id} ${part} ${name} has no schema.`)
    properties[name] = schema
    if (isRequired) required.push(name)
  }
  for (const parameter of operation.pathParameters) add(parameter.name, parameter.schema, true, 'path parameter')
  for (const parameter of operation.queryParameters) {
    add(parameter.name, parameter.schema, parameter.required, 'query parameter')
  }
  const extra: Record<string, unknown> = {}
  if (operation.body.kind === 'json') {
    const body = operation.body.schema
    const bodyProperties = isRecord(body.properties) ? body.properties : {}
    const bodyRequired = new Set(Array.isArray(body.required) ? body.required : [])
    for (const [name, schema] of Object.entries(bodyProperties)) add(name, schema, bodyRequired.has(name), 'body field')
    if (body.additionalProperties !== undefined) extra.additionalProperties = body.additionalProperties
    if (body[RULES_KEYWORD] !== undefined) extra[RULES_KEYWORD] = body[RULES_KEYWORD]
  } else {
    extra.additionalProperties = false
  }
  return { type: 'object', properties, required, ...extra }
}

export function hasRequiredInput(operation: OperationModel): boolean {
  if (operation.body.kind === 'file') return true
  const schema = inputSchemaOf(operation)
  return Array.isArray(schema.required) && schema.required.length > 0
}
