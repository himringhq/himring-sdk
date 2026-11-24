use std::time::Duration;

use reqwest::Url;
use reqwest::header::{HeaderName, HeaderValue};

use crate::errors::{HimringApiError, HimringApiErrorKind};
use crate::generated_operations::SPEC_API_URL;

pub const DEFAULT_HIMRING_API_URL: &str = SPEC_API_URL;
pub const DEFAULT_TIMEOUT: Duration = Duration::from_secs(30);
pub const DEFAULT_UPLOAD_IDLE_TIMEOUT: Duration = Duration::from_secs(120);
const API_URL_SCHEMES: [&str; 2] = ["http", "https"];
const CLIENT_SET_HEADERS: [&str; 4] = ["authorization", "content-type", "content-length", "host"];

#[derive(Clone, Debug)]
pub(crate) struct ClientSettings {
    pub base_url: Url,
    pub timeout: Duration,
    pub upload_idle_timeout: Duration,
    pub credential: Option<String>,
    pub headers: Vec<(HeaderName, HeaderValue)>,
}

impl ClientSettings {
    pub fn url_of(&self, path: &str) -> Result<Url, HimringApiError> {
        let base = self.base_url.as_str().trim_end_matches('/');
        let joined = format!("{base}/{}", path.trim_start_matches('/'));
        Url::parse(&joined).map_err(|error| {
            setting_error(format!("The client could not join {path} to the base URL."))
                .caused_by(error)
        })
    }
}

pub(crate) fn setting_error(message: impl Into<String>) -> HimringApiError {
    HimringApiError::new(HimringApiErrorKind::InvalidInput, message)
}

pub(crate) fn positive_duration(
    value: Option<Duration>,
    fallback: Duration,
    option: &str,
) -> Result<Duration, HimringApiError> {
    match value {
        None => Ok(fallback),
        Some(duration) if duration.is_zero() => Err(setting_error(format!(
            "Set {option} to a duration above zero."
        ))),
        Some(duration) if std::time::Instant::now().checked_add(duration).is_none() => Err(
            setting_error(format!("Set {option} to a shorter duration.")),
        ),
        Some(duration) => Ok(duration),
    }
}

pub(crate) fn api_url_of(base_url: &str) -> Result<Url, HimringApiError> {
    let example =
        format!("Set base_url to an http or https URL, such as {DEFAULT_HIMRING_API_URL}.");
    let url =
        Url::parse(base_url).map_err(|error| setting_error(example.clone()).caused_by(error))?;
    if !API_URL_SCHEMES.contains(&url.scheme()) || url.host_str().is_none_or(str::is_empty) {
        return Err(setting_error(example));
    }
    if !url.username().is_empty()
        || url.password().is_some()
        || url.query().is_some()
        || url.fragment().is_some()
        || base_url.contains(['#', '?'])
    {
        return Err(setting_error(
            "Set base_url without a user name, a password, a query, or a fragment.",
        ));
    }
    let mut normalized = url;
    if !normalized.path().ends_with('/') {
        let path = format!("{}/", normalized.path());
        normalized.set_path(&path);
    }
    Ok(normalized)
}

pub(crate) fn credential_of(
    api_key: Option<String>,
    session_token: Option<String>,
) -> Result<Option<String>, HimringApiError> {
    if api_key.is_some() && session_token.is_some() {
        return Err(setting_error("Pass api_key or session_token, not both."));
    }
    let Some(credential) = api_key.or(session_token) else {
        return Ok(None);
    };
    if credential.is_empty() || !credential.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err(setting_error(
            "Pass the credential as the text that Himring gave you, with no spaces.",
        ));
    }
    Ok(Some(credential))
}

fn is_token_byte(byte: u8) -> bool {
    byte.is_ascii_alphanumeric() || b"!#$%&'*+.^_`|~-".contains(&byte)
}

pub(crate) fn custom_headers_of(
    headers: Vec<(String, String)>,
) -> Result<Vec<(HeaderName, HeaderValue)>, HimringApiError> {
    let mut kept: Vec<(HeaderName, HeaderValue)> = Vec::new();
    for (name, value) in headers {
        let lower = name.to_ascii_lowercase();
        if CLIENT_SET_HEADERS.contains(&lower.as_str()) {
            return Err(setting_error(format!(
                "The client sets the {lower} header itself. Remove it from headers."
            )));
        }
        if lower.is_empty() || !lower.bytes().all(is_token_byte) {
            return Err(setting_error(format!(
                "The header name {name:?} is not a valid HTTP header name."
            )));
        }
        if !value
            .bytes()
            .all(|byte| byte == b'\t' || (0x20..=0x7e).contains(&byte))
        {
            return Err(setting_error(format!(
                "The {lower} header holds characters that HTTP headers cannot carry."
            )));
        }
        let header_name = HeaderName::from_bytes(lower.as_bytes()).map_err(|error| {
            setting_error(format!("The header name {name:?} is not valid.")).caused_by(error)
        })?;
        let header_value = HeaderValue::from_str(&value).map_err(|error| {
            setting_error(format!(
                "The {lower} header holds a value that HTTP cannot carry."
            ))
            .caused_by(error)
        })?;
        kept.retain(|(known, _)| known != header_name);
        kept.push((header_name, header_value));
    }
    Ok(kept)
}
