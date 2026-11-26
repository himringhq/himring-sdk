export type HimringOperationResponse =
  | { readonly kind: 'json'; readonly status: number }
  | {
      readonly kind: 'download'
      readonly status: number
      readonly contentTypes: readonly string[]
      readonly fileExtension: string
    }

interface OperationDescriptionBase {
  readonly id: string
  readonly method: 'GET' | 'POST' | 'DELETE'
  readonly path: string
  readonly pathParameters: readonly string[]
  readonly queryParameters: readonly string[]
  readonly response: HimringOperationResponse
}

export type HimringOperationDescription = OperationDescriptionBase &
  (
    | { readonly body: 'none' }
    | { readonly body: 'json'; readonly bodyFields: readonly string[] }
    | { readonly body: 'file'; readonly maximumBodyBytes: number }
  )

export interface HimringKeyPermissionNeed {
  readonly resource_kind: string
  readonly level: 'read' | 'write'
  readonly target: 'resource' | 'every' | 'any'
  readonly resource_id_field: string | null
  readonly only_with_field: string | null
}

export interface HimringOperationCatalogueEntry {
  readonly cli: { readonly command: string; readonly workflow?: true; readonly confirm?: true } | null
  readonly mcp: boolean
  readonly summary: string
  readonly tag: string
  readonly document: 'api' | 'session'
  readonly access: string
  readonly changesState: boolean
  readonly dataAccess: string | null
  readonly keyPermissions: readonly HimringKeyPermissionNeed[] | null
  readonly inputSchema: Readonly<Record<string, unknown>>
  readonly outputSchema: Readonly<Record<string, unknown>> | null
}
