type NoFields = Record<never, never>

type Simplify<Shape> = { [Key in keyof Shape]: Shape[Key] }

type OptionalKeys<Shape> = {
  [Key in keyof Shape]-?: NoFields extends Pick<Shape, Key> ? Key : never
}[keyof Shape]

type RequiredKeys<Shape> = Exclude<keyof Shape, OptionalKeys<Shape>>

export type CallerInput<Shape> = Shape extends readonly (infer Item)[]
  ? readonly CallerInput<Item>[]
  : Shape extends object
    ? Simplify<
        { [Key in RequiredKeys<Shape>]: CallerInput<Shape[Key]> } & {
          [Key in OptionalKeys<Shape>]?: CallerInput<Exclude<Shape[Key], undefined>> | undefined
        }
      >
    : Shape

type ParametersOf<Operation> = Operation extends { parameters: infer Parameters } ? Parameters : never

type PartOrNothing<Part> = [NonNullable<Part>] extends [never] ? NoFields : NonNullable<Part>

type PathOf<Operation> = ParametersOf<Operation> extends { path: infer Path } ? PartOrNothing<Path> : NoFields

type QueryOf<Operation> = ParametersOf<Operation> extends { query?: infer Query } ? PartOrNothing<Query> : NoFields

type JsonBodyOf<Operation> = Operation extends {
  requestBody: { content: { 'application/json': infer Body } }
}
  ? Body
  : NoFields

type CombinedInput<Operation> = PathOf<Operation> & QueryOf<Operation> & JsonBodyOf<Operation>

export type OperationInput<Operation> = [keyof CombinedInput<Operation>] extends [never]
  ? Record<string, never>
  : CallerInput<CombinedInput<Operation>>

export type OperationOutput<Operation, Status extends number> = Operation extends {
  responses: { [Code in Status]: { content: { 'application/json': infer Output } } }
}
  ? Output
  : never
