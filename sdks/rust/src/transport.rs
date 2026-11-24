use std::sync::Arc;
use std::time::Duration;

use bytes::Bytes;
use reqwest::header::{
    ACCEPT, AUTHORIZATION, CONTENT_LENGTH, CONTENT_TYPE, HeaderMap, HeaderValue,
};
use serde_json::{Map, Value};

use crate::client::ClientInner;
use crate::download::{Download, DownloadDetails, DownloadSource};
use crate::errors::{HimringApiError, HimringApiErrorKind};
use crate::idle_clock::IdleClock;
use crate::operation_description::{OperationDescription, ResponseKind};
use crate::request_parts::RequestParts;
use crate::responses::{
    assumed_content_type_of, content_length_of, download_name_of, file_name_of, header_text,
    refusal_of,
};
use crate::upload_body::{AbortSlot, upload_body_of};

const JSON_CONTENT_TYPE: &str = "application/json";
const FILE_CONTENT_TYPE: &str = "application/octet-stream";

pub(crate) enum Answer {
    Body {
        status: u16,
        headers: HeaderMap,
        body: Bytes,
    },
    Download(Download),
}

struct Prepared {
    request: reqwest::Request,
    upload: Option<(Arc<IdleClock>, AbortSlot)>,
}

fn seconds_text(duration: Duration) -> String {
    let seconds = duration.as_secs_f64();
    if seconds.fract() == 0.0 {
        format!("{seconds:.0}")
    } else {
        format!("{seconds}")
    }
}

fn timeout_error(client: &ClientInner, duration: Duration, upload: bool) -> HimringApiError {
    let base = client.settings.base_url.as_str();
    let message = if upload {
        format!(
            "The upload to the API at {base} made no progress for {} seconds. Check the connection, then send the file again.",
            seconds_text(duration)
        )
    } else {
        format!(
            "The API at {base} did not respond within {} seconds. Try again, or raise the timeout.",
            seconds_text(duration)
        )
    };
    HimringApiError::new(HimringApiErrorKind::Timeout, message)
}

fn transport_failure(
    client: &ClientInner,
    error: reqwest::Error,
    duration: Duration,
    upload: Option<&AbortSlot>,
) -> HimringApiError {
    if let Some(aborted) = upload.and_then(AbortSlot::take) {
        return aborted;
    }
    if error.is_timeout() {
        return timeout_error(client, duration, upload.is_some()).caused_by(error);
    }
    HimringApiError::new(
        HimringApiErrorKind::Network,
        format!(
            "The client could not reach the API at {}. Check the address and that the API is running.",
            client.settings.base_url
        ),
    )
    .caused_by(error)
}

fn prepared(
    client: &ClientInner,
    parts: RequestParts,
    method: reqwest::Method,
) -> Result<Prepared, HimringApiError> {
    let mut url = client.settings.url_of(&parts.path)?;
    if !parts.query.is_empty() {
        url.query_pairs_mut().extend_pairs(&parts.query);
    }
    let mut request = reqwest::Request::new(method, url);
    let headers = request.headers_mut();
    for (name, value) in &client.settings.headers {
        headers.insert(name.clone(), value.clone());
    }
    headers.insert(ACCEPT, HeaderValue::from_static(JSON_CONTENT_TYPE));
    if let Some(credential) = &client.settings.credential
        && let Ok(value) = HeaderValue::from_str(&format!("Bearer {credential}"))
    {
        let mut value = value;
        value.set_sensitive(true);
        headers.insert(AUTHORIZATION, value);
    }
    let mut upload = None;
    if let Some(file) = parts.file_body {
        headers.insert(CONTENT_TYPE, HeaderValue::from_static(FILE_CONTENT_TYPE));
        if let Some(size) = file.content.size_bytes {
            headers.insert(CONTENT_LENGTH, HeaderValue::from(size));
        }
        let clock = Arc::new(IdleClock::new());
        let abort = AbortSlot::default();
        *request.body_mut() = Some(upload_body_of(file, Arc::clone(&clock), abort.clone()));
        upload = Some((clock, abort));
    } else if let Some(json) = parts.json_body {
        headers.insert(CONTENT_TYPE, HeaderValue::from_static(JSON_CONTENT_TYPE));
        *request.body_mut() = Some(reqwest::Body::from(json));
    }
    Ok(Prepared { request, upload })
}

async fn read_body(
    response: &mut reqwest::Response,
    clock: Option<&IdleClock>,
) -> Result<Bytes, reqwest::Error> {
    let mut collected = Vec::new();
    while let Some(chunk) = response.chunk().await? {
        if let Some(clock) = clock {
            clock.touch();
        }
        collected.extend_from_slice(&chunk);
    }
    Ok(Bytes::from(collected))
}

async fn finished(
    operation: &'static OperationDescription,
    fields: &Map<String, Value>,
    mut response: reqwest::Response,
    timeout: Duration,
    clock: Option<&IdleClock>,
) -> Result<Answer, reqwest::Error> {
    let status = response.status().as_u16();
    let success = response.status().is_success();
    if success && operation.response.kind == ResponseKind::Download {
        let headers = response.headers();
        let details = DownloadDetails {
            status,
            file_name: file_name_of(headers, download_name_of(fields, operation)),
            content_type: header_text(headers, "content-type")
                .unwrap_or_else(|| assumed_content_type_of(operation)),
            content_length: content_length_of(headers),
            content_range: header_text(headers, "content-range"),
            accept_ranges: header_text(headers, "accept-ranges"),
            entity_tag: header_text(headers, "etag"),
        };
        return Ok(Answer::Download(Download::new(
            response,
            details,
            DownloadSource::Api,
            timeout,
        )));
    }
    let body = read_body(&mut response, clock).await?;
    Ok(Answer::Body {
        status,
        headers: response.headers().clone(),
        body,
    })
}

pub(crate) async fn execute(
    client: &ClientInner,
    operation: &'static OperationDescription,
    parts: RequestParts,
    fields: &Map<String, Value>,
    timeout: Duration,
) -> Result<Answer, HimringApiError> {
    let Prepared { request, upload } = prepared(client, parts, operation.method.to_reqwest())?;
    let answer = if let Some((clock, abort)) = &upload {
        let idle = client.settings.upload_idle_timeout;
        let work = async {
            let response = client.http.execute(request).await?;
            clock.touch();
            finished(operation, fields, response, idle, Some(clock)).await
        };
        let Ok(outcome) = clock.bounded(idle, work).await else {
            return Err(abort
                .take()
                .unwrap_or_else(|| timeout_error(client, idle, true)));
        };
        outcome.map_err(|error| transport_failure(client, error, idle, Some(abort)))?
    } else {
        let work = async {
            let response = client.http.execute(request).await?;
            finished(operation, fields, response, timeout, None).await
        };
        let Ok(outcome) = tokio::time::timeout(timeout, work).await else {
            return Err(timeout_error(client, timeout, false));
        };
        outcome.map_err(|error| transport_failure(client, error, timeout, None))?
    };
    if let Answer::Body {
        status,
        headers,
        body,
    } = &answer
        && !(200..300).contains(status)
    {
        return Err(refusal_of(*status, headers, body, operation.path));
    }
    Ok(answer)
}
