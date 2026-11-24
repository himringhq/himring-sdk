export interface Download {
  status: number
  body: ReadableStream<Uint8Array>
  file_name: string
  content_type: string
  content_length: number | undefined
  content_range: string | undefined
  accept_ranges: string | undefined
  entity_tag: string | undefined
}

export type FileContent = Blob | Uint8Array | ReadableStream<Uint8Array>
