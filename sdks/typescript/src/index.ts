export {
  createHimringClient,
  DEFAULT_HIMRING_API_TIMEOUT_MS,
  DEFAULT_HIMRING_API_URL,
  DEFAULT_HIMRING_UPLOAD_IDLE_TIMEOUT_MS,
  type HimringClient,
  type HimringClientCore,
  type HimringClientOptions,
} from './core/client.js'
export {
  describeError,
  documentedStatusOf,
  HimringApiError,
  type HimringApiErrorDetails,
  type HimringApiErrorKind,
  type HimringApiIssue,
  type HimringMissingPermission,
  isHimringApiError,
  isRefusal,
} from './core/errors.js'
export type { OperationCaller, RequestOptions } from './core/operation-caller.js'
export type {
  HimringKeyPermissionNeed,
  HimringOperationCatalogueEntry,
  HimringOperationDescription,
  HimringOperationResponse,
} from './core/operation-description.js'
export type { DependencyState, LivenessReport, ReadinessReport } from './core/reports.js'
export type { Download, FileContent } from './core/types.js'
export { safeDownloadName } from './downloads/download-names.js'
export { fileExtensionOf, fileKindOf, READABLE_FILE_EXTENSIONS } from './files/file-kinds.js'
export type {
  AddedFile,
  AddFileInput,
  DownloadFileInput,
  FileMetadata,
  FileRendition,
  FileTransfers,
  SignedPart,
  TransferOptions,
  UploadRecord,
} from './files/file-transfers.js'
export type { UploadBody, UploadContent, UploadSource } from './files/upload-sources.js'
export type { HimringOperationMethods } from './generated/methods.js'
export {
  HIMRING_ERROR_STATUSES,
  HIMRING_FILE_KIND_LIST,
  HIMRING_FILE_KINDS,
  HIMRING_OPERATION_IDS,
  HIMRING_OPERATIONS,
  type HimringFileKind,
  type HimringOperationId,
} from './generated/operations.js'
export type * from './generated/types.js'
export { type Citation, citationText, formatClock } from './text/citation-text.js'
export {
  MEMORY_WEBHOOK_REJECTIONS,
  type MemoryWebhookEvent,
  MemoryWebhookRejected,
  type MemoryWebhookRejection,
  type ReceivedMemoryWebhook,
  verifyMemoryWebhook,
} from './webhooks/memory-webhook-verification.js'
