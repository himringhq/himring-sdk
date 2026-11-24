use std::fmt;
use std::time::{Duration, SystemTime};

use hmac::{Hmac, KeyInit, Mac};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use sha2::Sha256;

pub const MEMORY_WEBHOOK_SIGNATURE_HEADER: &str = "himring-signature";
pub const MEMORY_WEBHOOK_EVENT_ID_HEADER: &str = "himring-event-id";
pub const DEFAULT_MEMORY_WEBHOOK_TOLERANCE: Duration = Duration::from_secs(300);
pub const MEMORY_WEBHOOK_REJECTIONS: [MemoryWebhookRejection; 4] = [
    MemoryWebhookRejection::SignatureMissing,
    MemoryWebhookRejection::SignatureInvalid,
    MemoryWebhookRejection::TimestampOutsideTolerance,
    MemoryWebhookRejection::EventInvalid,
];

const SIGNATURE_VERSION: &str = "v1";
const SIGNATURE_HEADER_MAXIMUM_LENGTH: usize = 4_096;
const UNIX_SECONDS_MAXIMUM_DIGITS: usize = 12;
const DIGEST_HEX_LENGTH: usize = 64;
const EVENT_NONEMPTY_FIELDS: [&str; 2] = ["id", "type"];
const EVENT_TEXT_FIELDS: [&str; 3] = ["created_at", "project_id", "memory_id"];
const DECISION_TEXT_FIELDS: [&str; 3] = ["id", "memory_id", "kind"];

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum MemoryWebhookRejection {
    SignatureMissing,
    SignatureInvalid,
    TimestampOutsideTolerance,
    EventInvalid,
}

impl MemoryWebhookRejection {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::SignatureMissing => "signature_missing",
            Self::SignatureInvalid => "signature_invalid",
            Self::TimestampOutsideTolerance => "timestamp_outside_tolerance",
            Self::EventInvalid => "event_invalid",
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct MemoryWebhookRejected {
    pub reason: MemoryWebhookRejection,
    pub message: String,
}

impl fmt::Display for MemoryWebhookRejected {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(&self.message)
    }
}

impl std::error::Error for MemoryWebhookRejected {}

#[derive(Clone, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub enum MemoryWebhookError {
    Rejected(MemoryWebhookRejected),
    InvalidSettings(String),
}

impl fmt::Display for MemoryWebhookError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Rejected(rejected) => rejected.fmt(formatter),
            Self::InvalidSettings(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for MemoryWebhookError {}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct MemoryWebhookEvent {
    pub id: String,
    #[serde(rename = "type")]
    pub event_type: String,
    pub created_at: String,
    pub project_id: String,
    pub memory_id: String,
    pub decision: Map<String, Value>,
}

#[derive(Clone, Copy, Debug)]
#[must_use]
pub struct MemoryWebhookVerification<'a> {
    pub body: &'a [u8],
    pub signature: Option<&'a str>,
    pub secret: &'a str,
    pub tolerance: Duration,
    pub now: Option<SystemTime>,
}

impl<'a> MemoryWebhookVerification<'a> {
    pub fn new(body: &'a [u8], signature: Option<&'a str>, secret: &'a str) -> Self {
        Self {
            body,
            signature,
            secret,
            tolerance: DEFAULT_MEMORY_WEBHOOK_TOLERANCE,
            now: None,
        }
    }

    pub fn tolerance(mut self, tolerance: Duration) -> Self {
        self.tolerance = tolerance;
        self
    }

    pub fn now(mut self, now: SystemTime) -> Self {
        self.now = Some(now);
        self
    }
}

fn rejected(reason: MemoryWebhookRejection, message: impl Into<String>) -> MemoryWebhookError {
    MemoryWebhookError::Rejected(MemoryWebhookRejected {
        reason,
        message: message.into(),
    })
}

fn digest_bytes_of(hex: &str) -> Option<Vec<u8>> {
    if hex.len() != DIGEST_HEX_LENGTH
        || !hex
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        return None;
    }
    (0..hex.len())
        .step_by(2)
        .map(|index| u8::from_str_radix(&hex[index..index + 2], 16).ok())
        .collect()
}

fn signed_parts_of(header: &str) -> Option<(u64, Vec<Vec<u8>>)> {
    if header.len() > SIGNATURE_HEADER_MAXIMUM_LENGTH {
        return None;
    }
    let mut timestamp = None;
    let mut digests = Vec::new();
    for part in header.split(',') {
        let Some((key, value)) = part.split_once('=') else {
            continue;
        };
        let (key, value) = (key.trim(), value.trim());
        if key.is_empty() {
            continue;
        }
        if key == "t" {
            let digits = !value.is_empty()
                && value.len() <= UNIX_SECONDS_MAXIMUM_DIGITS
                && value.bytes().all(|byte| byte.is_ascii_digit());
            if timestamp.is_some() || !digits {
                return None;
            }
            timestamp = Some(value.parse().ok()?);
        } else if key == SIGNATURE_VERSION
            && let Some(digest) = digest_bytes_of(value)
        {
            digests.push(digest);
        }
    }
    let timestamp = timestamp?;
    if digests.is_empty() {
        None
    } else {
        Some((timestamp, digests))
    }
}

fn signed_by_himring(timestamp: u64, digests: &[Vec<u8>], body: &[u8], secret: &str) -> bool {
    let mut matched = false;
    for digest in digests {
        let Ok(mut mac) = Hmac::<Sha256>::new_from_slice(secret.as_bytes()) else {
            return false;
        };
        mac.update(format!("{timestamp}.").as_bytes());
        mac.update(body);
        matched |= mac.verify_slice(digest).is_ok();
    }
    matched
}

fn parsed_event(body: &[u8]) -> Result<MemoryWebhookEvent, MemoryWebhookError> {
    let Ok(text) = std::str::from_utf8(body) else {
        return Err(rejected(
            MemoryWebhookRejection::EventInvalid,
            "The body is not UTF-8 text.",
        ));
    };
    let Ok(value) = serde_json::from_str::<Value>(text) else {
        return Err(rejected(
            MemoryWebhookRejection::EventInvalid,
            "The body is not JSON.",
        ));
    };
    let not_an_event = || {
        rejected(
            MemoryWebhookRejection::EventInvalid,
            "The body is not a Memory webhook event.",
        )
    };
    let Value::Object(event) = &value else {
        return Err(not_an_event());
    };
    let text_at = |record: &Map<String, Value>, name: &str| {
        record.get(name).and_then(Value::as_str).map(str::to_owned)
    };
    let Some(Value::Object(decision)) = event.get("decision") else {
        return Err(not_an_event());
    };
    let well_shaped = EVENT_NONEMPTY_FIELDS
        .iter()
        .all(|name| text_at(event, name).is_some_and(|text| !text.is_empty()))
        && EVENT_TEXT_FIELDS
            .iter()
            .all(|name| text_at(event, name).is_some())
        && DECISION_TEXT_FIELDS
            .iter()
            .all(|name| text_at(decision, name).is_some());
    if !well_shaped {
        return Err(not_an_event());
    }
    serde_json::from_value(value).map_err(|_| not_an_event())
}

fn unix_seconds(moment: SystemTime) -> i128 {
    match moment.duration_since(SystemTime::UNIX_EPOCH) {
        Ok(after) => i128::from(after.as_secs()),
        Err(before) => {
            let duration = before.duration();
            -i128::from(duration.as_secs() + u64::from(duration.subsec_nanos() > 0))
        }
    }
}

pub fn verify_memory_webhook(
    received: MemoryWebhookVerification<'_>,
) -> Result<MemoryWebhookEvent, MemoryWebhookError> {
    if received.tolerance.is_zero() {
        return Err(MemoryWebhookError::InvalidSettings(
            "Set tolerance to a duration above zero.".to_owned(),
        ));
    }
    if received.secret.is_empty() {
        return Err(MemoryWebhookError::InvalidSettings(
            "Pass the signing secret of the webhook.".to_owned(),
        ));
    }
    let header = received.signature.unwrap_or_default();
    if header.trim().is_empty() {
        return Err(rejected(
            MemoryWebhookRejection::SignatureMissing,
            "The request carries no himring-signature header.",
        ));
    }
    let Some((timestamp, digests)) = signed_parts_of(header) else {
        return Err(rejected(
            MemoryWebhookRejection::SignatureInvalid,
            "The signature does not match the body and the secret.",
        ));
    };
    if !signed_by_himring(timestamp, &digests, received.body, received.secret) {
        return Err(rejected(
            MemoryWebhookRejection::SignatureInvalid,
            "The signature does not match the body and the secret.",
        ));
    }
    let now = unix_seconds(received.now.unwrap_or_else(SystemTime::now));
    let distance = u64::try_from((now - i128::from(timestamp)).unsigned_abs()).unwrap_or(u64::MAX);
    if Duration::from_secs(distance) > received.tolerance {
        return Err(rejected(
            MemoryWebhookRejection::TimestampOutsideTolerance,
            format!(
                "Himring signed the request more than {} seconds away from now.",
                received.tolerance.as_secs()
            ),
        ));
    }
    parsed_event(received.body)
}
