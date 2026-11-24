#![forbid(unsafe_code)]

#[allow(clippy::all, clippy::pedantic)]
#[path = "generated/answer_event_rules.rs"]
mod answer_event_rules;
#[allow(clippy::all, clippy::pedantic)]
#[path = "generated/methods.rs"]
mod generated_methods;
#[allow(clippy::all, clippy::pedantic)]
#[path = "generated/operations.rs"]
mod generated_operations;
#[allow(clippy::all, clippy::pedantic)]
#[path = "generated/types.rs"]
pub mod types;

pub mod answers;
mod backoff;
mod citation_text;
mod client;
mod download;
mod download_names;
mod errors;
mod file_content;
mod file_kinds;
mod finite_numbers;
mod idle_clock;
mod operation_call;
mod operation_description;
mod request_parts;
mod responses;
mod serde_fields;
mod settings;
mod storage;
mod transfer_inputs;
mod transfers;
mod transport;
mod upload_body;
mod upload_plan;
mod upload_source;
mod webhooks;

pub use bytes::Bytes;
pub use reqwest;

pub use crate::citation_text::{Citation, citation_text, format_clock};
pub use crate::client::{Himring, HimringBuilder};
pub use crate::download::Download;
pub use crate::download_names::safe_download_name;
pub use crate::errors::{
    HimringApiError, HimringApiErrorKind, HimringApiIssue, HimringMissingPermission, IssuePathPart,
    describe_error, documented_status_of,
};
pub use crate::file_content::FileContent;
pub use crate::file_kinds::{file_extension_of, file_kind_of, readable_file_extensions};
pub use crate::generated_operations::{
    ERROR_MESSAGES, ERROR_STATUSES, FILE_KIND_LIST, FILE_KINDS, FileKind, SPEC_API_URL,
};
pub use crate::operation_call::{Invoked, OperationCall};
pub use crate::operation_description::{
    BodyKind, HttpMethod, OperationDescription, ResponseDescription, ResponseKind, operation,
    operations,
};
pub use crate::settings::{DEFAULT_HIMRING_API_URL, DEFAULT_TIMEOUT, DEFAULT_UPLOAD_IDLE_TIMEOUT};
pub use crate::transfer_inputs::{AddFileInput, DownloadFileInput, ProgressError, ProgressFuture};
pub use crate::upload_plan::{AddedFile, SignedPart, UploadRecord};
pub use crate::upload_source::{UploadContent, UploadRead, UploadSource};
pub use crate::webhooks::{
    DEFAULT_MEMORY_WEBHOOK_TOLERANCE, MEMORY_WEBHOOK_EVENT_ID_HEADER, MEMORY_WEBHOOK_REJECTIONS,
    MEMORY_WEBHOOK_SIGNATURE_HEADER, MemoryWebhookError, MemoryWebhookEvent, MemoryWebhookRejected,
    MemoryWebhookRejection, MemoryWebhookVerification, verify_memory_webhook,
};

pub const VERSION: &str = env!("CARGO_PKG_VERSION");
