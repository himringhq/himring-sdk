use std::fmt;
use std::io::SeekFrom;
use std::pin::Pin;

use bytes::Bytes;
use tokio::io::{AsyncRead, AsyncSeekExt};

use crate::errors::{HimringApiError, invalid_input};

pub(crate) const FILE_CONTENT_FIELD: &str = "content";

pub(crate) enum FileSource {
    Bytes(Bytes),
    Reader(Pin<Box<dyn AsyncRead + Send>>),
}

pub struct FileContent {
    pub(crate) source: FileSource,
    pub(crate) size_bytes: Option<u64>,
}

impl FileContent {
    pub fn from_bytes(bytes: impl Into<Bytes>) -> Self {
        let bytes = bytes.into();
        let size_bytes = Some(bytes.len() as u64);
        Self {
            source: FileSource::Bytes(bytes),
            size_bytes,
        }
    }

    pub fn from_reader(reader: impl AsyncRead + Send + 'static) -> Self {
        Self {
            source: FileSource::Reader(Box::pin(reader)),
            size_bytes: None,
        }
    }

    pub async fn from_file(mut file: tokio::fs::File) -> Result<Self, HimringApiError> {
        let measured = async {
            let length = file.metadata().await?.len();
            let position = file.seek(SeekFrom::Current(0)).await?;
            Ok::<u64, std::io::Error>(length.saturating_sub(position))
        }
        .await
        .map_err(|error| {
            invalid_input(
                "The client could not measure the file.",
                Some(FILE_CONTENT_FIELD),
            )
            .caused_by(error)
        })?;
        Ok(Self {
            source: FileSource::Reader(Box::pin(file)),
            size_bytes: Some(measured),
        })
    }

    pub fn size_bytes(&self) -> Option<u64> {
        self.size_bytes
    }
}

impl fmt::Debug for FileContent {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let source = match self.source {
            FileSource::Bytes(_) => "bytes",
            FileSource::Reader(_) => "reader",
        };
        formatter
            .debug_struct("FileContent")
            .field("source", &source)
            .field("size_bytes", &self.size_bytes)
            .finish()
    }
}

impl From<Bytes> for FileContent {
    fn from(bytes: Bytes) -> Self {
        Self::from_bytes(bytes)
    }
}

impl From<Vec<u8>> for FileContent {
    fn from(bytes: Vec<u8>) -> Self {
        Self::from_bytes(bytes)
    }
}

impl From<&'static [u8]> for FileContent {
    fn from(bytes: &'static [u8]) -> Self {
        Self::from_bytes(bytes)
    }
}

impl From<String> for FileContent {
    fn from(text: String) -> Self {
        Self::from_bytes(text)
    }
}
