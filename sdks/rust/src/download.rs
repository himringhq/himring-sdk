use std::fmt;
use std::time::Duration;

use bytes::Bytes;
use futures_util::Stream;
use futures_util::stream;

use crate::errors::{HimringApiError, HimringApiErrorKind};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum DownloadSource {
    Api,
    Storage,
}

impl DownloadSource {
    fn describe(self) -> &'static str {
        match self {
            Self::Api => "the API",
            Self::Storage => "storage",
        }
    }
}

#[derive(Clone, Debug)]
pub(crate) struct DownloadDetails {
    pub status: u16,
    pub file_name: String,
    pub content_type: String,
    pub content_length: Option<u64>,
    pub content_range: Option<String>,
    pub accept_ranges: Option<String>,
    pub entity_tag: Option<String>,
}

pub struct Download {
    response: Option<Box<reqwest::Response>>,
    details: DownloadDetails,
    source: DownloadSource,
    idle_timeout: Duration,
}

fn stream_failure(source: DownloadSource, error: Option<reqwest::Error>) -> HimringApiError {
    let described = source.describe();
    let failure = match &error {
        Some(error) if !error.is_timeout() => HimringApiError::new(
            HimringApiErrorKind::Network,
            format!("The connection to {described} broke during the download. Try again."),
        ),
        _ => HimringApiError::new(
            HimringApiErrorKind::Timeout,
            format!(
                "{} stopped sending the file. Try the download again.",
                capitalized(described)
            ),
        ),
    };
    match error {
        Some(error) => failure.caused_by(error),
        None => failure,
    }
}

fn capitalized(text: &str) -> String {
    let mut characters = text.chars();
    characters.next().map_or_else(String::new, |first| {
        first.to_uppercase().collect::<String>() + characters.as_str()
    })
}

impl Download {
    pub(crate) fn new(
        response: reqwest::Response,
        details: DownloadDetails,
        source: DownloadSource,
        idle_timeout: Duration,
    ) -> Self {
        Self {
            response: Some(Box::new(response)),
            details,
            source,
            idle_timeout,
        }
    }

    pub fn status(&self) -> u16 {
        self.details.status
    }

    pub fn file_name(&self) -> &str {
        &self.details.file_name
    }

    pub fn content_type(&self) -> &str {
        &self.details.content_type
    }

    pub fn content_length(&self) -> Option<u64> {
        self.details.content_length
    }

    pub fn content_range(&self) -> Option<&str> {
        self.details.content_range.as_deref()
    }

    pub fn accept_ranges(&self) -> Option<&str> {
        self.details.accept_ranges.as_deref()
    }

    pub fn entity_tag(&self) -> Option<&str> {
        self.details.entity_tag.as_deref()
    }

    pub async fn chunk(&mut self) -> Result<Option<Bytes>, HimringApiError> {
        let Some(response) = &mut self.response else {
            return Ok(None);
        };
        match tokio::time::timeout(self.idle_timeout, response.chunk()).await {
            Ok(Ok(Some(chunk))) => Ok(Some(chunk)),
            Ok(Ok(None)) => {
                self.response = None;
                Ok(None)
            }
            Ok(Err(error)) => {
                self.response = None;
                Err(stream_failure(self.source, Some(error)))
            }
            Err(_) => {
                self.response = None;
                Err(stream_failure(self.source, None))
            }
        }
    }

    pub async fn read(mut self) -> Result<Vec<u8>, HimringApiError> {
        let mut collected = Vec::new();
        while let Some(chunk) = self.chunk().await? {
            collected.extend_from_slice(&chunk);
        }
        Ok(collected)
    }

    pub fn bytes_stream(self) -> impl Stream<Item = Result<Bytes, HimringApiError>> + Send {
        stream::unfold(Some(self), |state| async move {
            let mut download = state?;
            match download.chunk().await {
                Ok(Some(chunk)) => Some((Ok(chunk), Some(download))),
                Ok(None) => None,
                Err(error) => Some((Err(error), None)),
            }
        })
    }

    pub fn close(mut self) {
        self.response = None;
    }
}

impl fmt::Debug for Download {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("Download")
            .field("status", &self.details.status)
            .field("file_name", &self.details.file_name)
            .field("content_type", &self.details.content_type)
            .finish_non_exhaustive()
    }
}
