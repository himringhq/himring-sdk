use std::time::Duration;

use reqwest::header::{CONTENT_LENGTH, HeaderMap, HeaderName, HeaderValue, RANGE};

use crate::download::{Download, DownloadDetails, DownloadSource};
use crate::errors::{HimringApiError, HimringApiErrorKind, invalid_response};
use crate::responses::{content_length_of, header_text, retry_after_seconds_of};
use crate::types::GetDownloadLinkOutput;
use crate::upload_plan::{SignedPart, send_timeout, storage_url_of};

const HTTP_OK: u16 = 200;
const HTTP_PARTIAL_CONTENT: u16 = 206;

pub(crate) struct StorageAnswer {
    pub status: u16,
    pub retry_after_seconds: Option<u64>,
}

fn storage_failure(error: reqwest::Error, action: &str) -> HimringApiError {
    let kind = if error.is_timeout() {
        HimringApiErrorKind::Timeout
    } else {
        HimringApiErrorKind::Network
    };
    let message = if error.is_timeout() {
        format!("Storage did not answer in time to {action}. Try again.")
    } else {
        format!(
            "The client could not reach storage to {action}. Check the connection, then try again."
        )
    };
    HimringApiError::new(kind, message).caused_by(error)
}

fn slow_storage_error(timeout: Duration, size_bytes: u64) -> HimringApiError {
    HimringApiError::new(
        HimringApiErrorKind::Timeout,
        format!(
            "Storage took more than {} seconds to take {size_bytes} bytes. Check the connection, then send the file again.",
            timeout.as_secs()
        ),
    )
}

fn signed_headers_of(part: &SignedPart) -> Result<HeaderMap, HimringApiError> {
    let mut headers = HeaderMap::new();
    for (name, value) in &part.headers {
        let (Ok(name), Ok(value)) = (
            HeaderName::from_bytes(name.as_bytes()),
            HeaderValue::from_str(value),
        ) else {
            return Err(invalid_response(
                "The API signed a storage header that HTTP cannot carry.",
            ));
        };
        headers.insert(name, value);
    }
    Ok(headers)
}

pub(crate) async fn put_to_storage(
    http: &reqwest::Client,
    part: &SignedPart,
    body: reqwest::Body,
    size_bytes: u64,
    idle_timeout: Duration,
) -> Result<StorageAnswer, HimringApiError> {
    let url = storage_url_of(&part.url)?;
    let timeout = send_timeout(idle_timeout, size_bytes);
    let mut headers = signed_headers_of(part)?;
    headers.insert(CONTENT_LENGTH, HeaderValue::from(size_bytes));
    let sent = http.put(url).headers(headers).body(body).send();
    match tokio::time::timeout(timeout, sent).await {
        Err(_) => Err(slow_storage_error(timeout, size_bytes)),
        Ok(Err(error)) if error.is_timeout() => {
            Err(slow_storage_error(timeout, size_bytes).caused_by(error))
        }
        Ok(Err(error)) => Err(storage_failure(error, "send the file")),
        Ok(Ok(response)) => Ok(StorageAnswer {
            status: response.status().as_u16(),
            retry_after_seconds: retry_after_seconds_of(
                header_text(response.headers(), "retry-after").as_deref(),
            ),
        }),
    }
}

pub(crate) async fn get_from_storage(
    http: &reqwest::Client,
    link: &GetDownloadLinkOutput,
    byte_range: Option<&str>,
    timeout: Duration,
) -> Result<Download, HimringApiError> {
    let url = storage_url_of(&link.url)?;
    let mut request = http.get(url);
    if let Some(range) = byte_range {
        request = request.header(RANGE, range);
    }
    let response = match tokio::time::timeout(timeout, request.send()).await {
        Err(_) => {
            return Err(HimringApiError::new(
                HimringApiErrorKind::Timeout,
                "Storage did not answer in time to download the file. Try again.",
            ));
        }
        Ok(Err(error)) => return Err(storage_failure(error, "download the file")),
        Ok(Ok(response)) => response,
    };
    let status = response.status().as_u16();
    if status != HTTP_OK && status != HTTP_PARTIAL_CONTENT {
        return Err(HimringApiError::with_status(
            HimringApiErrorKind::Refused,
            format!("Storage refused the download with status {status}."),
            status,
        ));
    }
    let details = DownloadDetails {
        status,
        file_name: link.file_name.clone(),
        content_type: link.content_type.clone(),
        content_length: content_length_of(response.headers()),
        content_range: header_text(response.headers(), "content-range"),
        accept_ranges: header_text(response.headers(), "accept-ranges"),
        entity_tag: Some(link.entity_tag.clone()),
    };
    Ok(Download::new(
        response,
        details,
        DownloadSource::Storage,
        timeout,
    ))
}
