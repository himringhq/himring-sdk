import { HIMRING_FILE_KIND_LIST, HIMRING_FILE_KINDS, type HimringFileKind } from '../generated/operations.js'

const LAST_EXTENSION_PATTERN = /\.[^./]+$/

const KIND_OF_EXTENSION: ReadonlyMap<string, HimringFileKind> = new Map(
  HIMRING_FILE_KIND_LIST.flatMap(kind => HIMRING_FILE_KINDS[kind].map(extension => [extension, kind] as const)),
)

export const READABLE_FILE_EXTENSIONS: readonly string[] = [...KIND_OF_EXTENSION.keys()]

export function fileExtensionOf(path: string): string {
  return LAST_EXTENSION_PATTERN.exec(path)?.[0]?.toLowerCase() ?? ''
}

export function fileKindOf(path: string): HimringFileKind | undefined {
  return KIND_OF_EXTENSION.get(fileExtensionOf(path))
}
