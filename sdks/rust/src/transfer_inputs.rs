use std::error::Error as StandardError;
use std::fmt;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use crate::types::{CreateUploadInputMetadata, GetDownloadLinkInputRendition};
use crate::upload_source::UploadContent;

pub type ProgressError = Box<dyn StandardError + Send + Sync>;
pub type ProgressFuture = Pin<Box<dyn Future<Output = Result<(), ProgressError>> + Send>>;
pub(crate) type ProgressCallback = Arc<dyn Fn(u64) -> ProgressFuture + Send + Sync>;

#[must_use]
#[non_exhaustive]
pub struct AddFileInput {
    pub project_id: String,
    pub knowledge_base_id: String,
    pub path: String,
    pub content: UploadContent,
    pub address: Option<String>,
    pub content_sha256: Option<String>,
    pub metadata: Option<CreateUploadInputMetadata>,
    pub(crate) on_progress: Option<ProgressCallback>,
}

impl AddFileInput {
    pub fn new(
        project_id: impl Into<String>,
        knowledge_base_id: impl Into<String>,
        path: impl Into<String>,
        content: impl Into<UploadContent>,
    ) -> Self {
        Self {
            project_id: project_id.into(),
            knowledge_base_id: knowledge_base_id.into(),
            path: path.into(),
            content: content.into(),
            address: None,
            content_sha256: None,
            metadata: None,
            on_progress: None,
        }
    }

    pub fn address(mut self, address: impl Into<String>) -> Self {
        self.address = Some(address.into());
        self
    }

    pub fn content_sha256(mut self, content_sha256: impl Into<String>) -> Self {
        self.content_sha256 = Some(content_sha256.into());
        self
    }

    pub fn metadata(mut self, metadata: CreateUploadInputMetadata) -> Self {
        self.metadata = Some(metadata);
        self
    }

    pub fn on_progress<F, Fut, E>(mut self, callback: F) -> Self
    where
        F: Fn(u64) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = Result<(), E>> + Send + 'static,
        E: Into<ProgressError> + 'static,
    {
        self.on_progress = Some(Arc::new(move |bytes_sent| {
            let reported = callback(bytes_sent);
            Box::pin(async move { reported.await.map_err(Into::into) })
        }));
        self
    }
}

impl fmt::Debug for AddFileInput {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("AddFileInput")
            .field("project_id", &self.project_id)
            .field("knowledge_base_id", &self.knowledge_base_id)
            .field("path", &self.path)
            .field("content", &self.content)
            .finish_non_exhaustive()
    }
}

#[derive(Clone, Debug, PartialEq)]
#[must_use]
#[non_exhaustive]
pub struct DownloadFileInput {
    pub project_id: String,
    pub knowledge_base_id: String,
    pub file_id: String,
    pub version: u64,
    pub rendition: Option<GetDownloadLinkInputRendition>,
    pub range: Option<String>,
}

impl DownloadFileInput {
    pub fn new(
        project_id: impl Into<String>,
        knowledge_base_id: impl Into<String>,
        file_id: impl Into<String>,
        version: u64,
    ) -> Self {
        Self {
            project_id: project_id.into(),
            knowledge_base_id: knowledge_base_id.into(),
            file_id: file_id.into(),
            version,
            rendition: None,
            range: None,
        }
    }

    pub fn rendition(mut self, rendition: GetDownloadLinkInputRendition) -> Self {
        self.rendition = Some(rendition);
        self
    }

    pub fn range(mut self, range: impl Into<String>) -> Self {
        self.range = Some(range.into());
        self
    }
}
