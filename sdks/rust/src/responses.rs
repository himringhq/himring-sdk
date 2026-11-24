use std::time::SystemTime;

use percent_encoding::percent_decode_str;
use reqwest::header::HeaderMap;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::errors::{
    ErrorDetails, HimringApiError, HimringApiErrorKind, HimringApiIssue, HimringMissingPermission,
    IssuePathPart,
};
use crate::operation_description::OperationDescription;

const OCTET_STREAM_CONTENT_TYPE: &str = "application/octet-stream";
const REQUEST_ID_HEADER: &str = "x-request-id";
const DOWNLOAD_ID_FIELDS: [&str; 4] = ["index_id", "file_id", "memory_id", "table_name"];

pub(crate) fn header_text(headers: &HeaderMap, name: &str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::to_owned)
}

fn optional_text(fields: &Map<String, Value>, key: &str) -> Result<Option<String>, ()> {
    match fields.get(key) {
        None => Ok(None),
        Some(Value::String(text)) => Ok(Some(text.clone())),
        Some(_) => Err(()),
    }
}

fn issues_of(value: &Value) -> Option<Vec<HimringApiIssue>> {
    let mut issues = Vec::new();
    for raw in value.as_array()? {
        let entry = raw.as_object()?;
        let message = entry.get("message")?.as_str()?;
        let mut path = Vec::new();
        for part in entry.get("path")?.as_array()? {
            path.push(match part {
                Value::String(name) => IssuePathPart::Field(name.clone()),
                Value::Number(number) => IssuePathPart::Index(number.clone()),
                _ => return None,
            });
        }
        issues.push(HimringApiIssue {
            message: message.to_owned(),
            path,
        });
    }
    Some(issues)
}

fn missing_permission_of(value: &Value) -> Option<HimringMissingPermission> {
    let entry = value.as_object()?;
    let resource_id = match entry.get("resource_id")? {
        Value::Null => None,
        Value::String(text) => Some(text.clone()),
        _ => return None,
    };
    Some(HimringMissingPermission {
        resource_kind: entry.get("resource_kind")?.as_str()?.to_owned(),
        level: entry.get("level")?.as_str()?.to_owned(),
        resource_id,
    })
}

pub(crate) fn retry_after_seconds_of(header: Option<&str>) -> Option<u64> {
    let text = header?.trim();
    if !text.is_empty() && text.bytes().all(|byte| byte.is_ascii_digit()) {
        return Some(text.parse().unwrap_or(u64::MAX));
    }
    let moment = httpdate::parse_http_date(text).ok()?;
    let remaining = moment
        .duration_since(SystemTime::now())
        .map_or(0, |duration| {
            duration.as_secs() + u64::from(duration.subsec_nanos() > 0)
        });
    Some(remaining)
}

pub(crate) fn refusal_of(
    status: u16,
    headers: &HeaderMap,
    body: &[u8],
    path: &str,
) -> HimringApiError {
    let header_request_id = header_text(headers, REQUEST_ID_HEADER);
    let shapeless = || {
        HimringApiError::with_details(
            HimringApiErrorKind::InvalidResponse,
            format!(
                "The API answered {path} with status {status} and no error envelope. Check that the address points at the Himring API."
            ),
            ErrorDetails {
                status: Some(status),
                request_id: header_request_id.clone(),
                ..ErrorDetails::default()
            },
        )
    };
    let Ok(Value::Object(envelope)) = serde_json::from_slice::<Value>(body) else {
        return shapeless();
    };
    let Some(Value::Object(fields)) = envelope.get("error") else {
        return shapeless();
    };
    let (Some(Value::String(code)), Some(Value::String(message))) =
        (fields.get("code"), fields.get("message"))
    else {
        return shapeless();
    };
    let (Ok(details), Ok(request_id)) = (
        optional_text(fields, "details"),
        optional_text(fields, "request_id"),
    ) else {
        return shapeless();
    };
    let issues = match fields.get("issues") {
        None => Vec::new(),
        Some(raw) => match issues_of(raw) {
            Some(issues) => issues,
            None => return shapeless(),
        },
    };
    let missing_permission = match fields.get("missing_permission") {
        None => None,
        Some(raw) => match missing_permission_of(raw) {
            Some(missing) => Some(missing),
            None => return shapeless(),
        },
    };
    HimringApiError::with_details(
        HimringApiErrorKind::Refused,
        message.clone(),
        ErrorDetails {
            status: Some(status),
            code: Some(code.clone()),
            details,
            issues,
            missing_permission,
            retry_after_seconds: retry_after_seconds_of(
                header_text(headers, "retry-after").as_deref(),
            ),
            request_id: request_id.or(header_request_id),
            source: None,
        },
    )
}

fn issue_path_of(path: &serde_path_to_error::Path) -> Vec<IssuePathPart> {
    path.iter()
        .filter_map(|segment| match segment {
            serde_path_to_error::Segment::Seq { index } => {
                Some(IssuePathPart::Index(serde_json::Number::from(*index)))
            }
            serde_path_to_error::Segment::Map { key } => Some(IssuePathPart::Field(key.clone())),
            serde_path_to_error::Segment::Enum { variant } => {
                Some(IssuePathPart::Field(variant.clone()))
            }
            serde_path_to_error::Segment::Unknown => None,
        })
        .collect()
}

pub(crate) fn json_of<T: DeserializeOwned>(
    status: u16,
    headers: &HeaderMap,
    body: &[u8],
    operation: &OperationDescription,
) -> Result<T, HimringApiError> {
    let mut deserializer = serde_json::Deserializer::from_slice(body);
    let parsed: Result<T, serde_path_to_error::Error<serde_json::Error>> =
        serde_path_to_error::deserialize(&mut deserializer);
    let trailing_text = parsed.is_ok() && deserializer.end().is_err();
    let not_json_error = || {
        HimringApiError::with_details(
            HimringApiErrorKind::InvalidResponse,
            format!(
                "The API answered {} with a body that is not JSON. Check that the address points at the Himring API.",
                operation.path
            ),
            ErrorDetails {
                status: Some(status),
                request_id: header_text(headers, REQUEST_ID_HEADER),
                ..ErrorDetails::default()
            },
        )
    };
    if trailing_text {
        return Err(not_json_error());
    }
    parsed.map_err(|error| {
        let not_json = error.inner().is_syntax() || error.inner().is_eof();
        let message = if not_json {
            format!(
                "The API answered {} with a body that is not JSON. Check that the address points at the Himring API.",
                operation.path
            )
        } else {
            format!(
                "The API answered {} with {}, which does not match the spec: {}. Check that the address points at the Himring API and that the SDK is up to date.",
                operation.operation_id,
                error.path(),
                error.inner()
            )
        };
        let issues = if not_json {
            Vec::new()
        } else {
            vec![HimringApiIssue {
                message: error.inner().to_string(),
                path: issue_path_of(error.path()),
            }]
        };
        HimringApiError::with_details(
            HimringApiErrorKind::InvalidResponse,
            message,
            ErrorDetails {
                status: Some(status),
                request_id: header_text(headers, REQUEST_ID_HEADER),
                issues,
                ..ErrorDetails::default()
            },
        )
    })
}

fn decoded_file_name(encoded: &str) -> Option<String> {
    let bytes = encoded.as_bytes();
    for (index, byte) in bytes.iter().enumerate() {
        if *byte == b'%' {
            let escape = bytes.get(index + 1..index + 3)?;
            if !escape.iter().all(u8::is_ascii_hexdigit) {
                return None;
            }
        }
    }
    percent_decode_str(encoded)
        .decode_utf8()
        .ok()
        .map(std::borrow::Cow::into_owned)
}

fn encoded_file_name(disposition: &str) -> Option<&str> {
    let lower = disposition.to_ascii_lowercase();
    let start = lower.find("filename*=utf-8''")? + "filename*=utf-8''".len();
    let rest = &disposition[start..];
    let end = rest
        .find(|character: char| character == ';' || character.is_whitespace())
        .unwrap_or(rest.len());
    Some(&rest[..end]).filter(|name| !name.is_empty())
}

fn plain_file_name(disposition: &str) -> Option<&str> {
    let start = disposition.find("filename=\"")? + "filename=\"".len();
    let rest = &disposition[start..];
    let end = rest.find('"')?;
    Some(&rest[..end]).filter(|name| !name.is_empty())
}

pub(crate) fn file_name_of(headers: &HeaderMap, fallback: String) -> String {
    let disposition = header_text(headers, "content-disposition").unwrap_or_default();
    if let Some(decoded) = encoded_file_name(&disposition).and_then(decoded_file_name) {
        return decoded;
    }
    plain_file_name(&disposition).map_or(fallback, str::to_owned)
}

pub(crate) fn download_name_of(
    fields: &Map<String, Value>,
    operation: &OperationDescription,
) -> String {
    let extension = operation.response.file_extension.unwrap_or_default();
    for field in DOWNLOAD_ID_FIELDS {
        if let Some(Value::String(value)) = fields.get(field)
            && !value.is_empty()
        {
            return format!("{value}{extension}");
        }
    }
    format!("download{extension}")
}

pub(crate) fn assumed_content_type_of(operation: &OperationDescription) -> String {
    match operation.response.content_types {
        [only] => (*only).to_owned(),
        _ => OCTET_STREAM_CONTENT_TYPE.to_owned(),
    }
}

pub(crate) fn content_length_of(headers: &HeaderMap) -> Option<u64> {
    let value = header_text(headers, "content-length")?;
    if value.is_empty() || !value.bytes().all(|byte| byte.is_ascii_digit()) {
        return None;
    }
    value.parse().ok()
}
