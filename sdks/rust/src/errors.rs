use std::error::Error as StandardError;
use std::fmt;

use crate::generated_operations::ERROR_STATUSES;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum HimringApiErrorKind {
    Network,
    Timeout,
    Refused,
    InvalidResponse,
    InvalidInput,
}

impl HimringApiErrorKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Network => "network",
            Self::Timeout => "timeout",
            Self::Refused => "refused",
            Self::InvalidResponse => "invalid_response",
            Self::InvalidInput => "invalid_input",
        }
    }
}

impl fmt::Display for HimringApiErrorKind {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.as_str())
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum IssuePathPart {
    Field(String),
    Index(serde_json::Number),
}

impl fmt::Display for IssuePathPart {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Field(name) => formatter.write_str(name),
            Self::Index(index) => write!(formatter, "{index}"),
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct HimringApiIssue {
    pub message: String,
    pub path: Vec<IssuePathPart>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct HimringMissingPermission {
    pub resource_kind: String,
    pub level: String,
    pub resource_id: Option<String>,
}

#[derive(Debug, Default)]
pub(crate) struct ErrorDetails {
    pub status: Option<u16>,
    pub code: Option<String>,
    pub details: Option<String>,
    pub issues: Vec<HimringApiIssue>,
    pub missing_permission: Option<HimringMissingPermission>,
    pub retry_after_seconds: Option<u64>,
    pub request_id: Option<String>,
    pub source: Option<Box<dyn StandardError + Send + Sync>>,
}

#[derive(Debug)]
struct ErrorParts {
    kind: HimringApiErrorKind,
    message: String,
    details: ErrorDetails,
}

pub struct HimringApiError(Box<ErrorParts>);

impl HimringApiError {
    pub fn new(kind: HimringApiErrorKind, message: impl Into<String>) -> Self {
        Self::with_details(kind, message, ErrorDetails::default())
    }

    pub(crate) fn with_details(
        kind: HimringApiErrorKind,
        message: impl Into<String>,
        details: ErrorDetails,
    ) -> Self {
        Self(Box::new(ErrorParts {
            kind,
            message: message.into(),
            details,
        }))
    }

    pub(crate) fn with_status(
        kind: HimringApiErrorKind,
        message: impl Into<String>,
        status: u16,
    ) -> Self {
        Self::with_details(
            kind,
            message,
            ErrorDetails {
                status: Some(status),
                ..ErrorDetails::default()
            },
        )
    }

    pub(crate) fn caused_by(mut self, source: impl StandardError + Send + Sync + 'static) -> Self {
        self.0.details.source = Some(Box::new(source));
        self
    }

    pub fn kind(&self) -> HimringApiErrorKind {
        self.0.kind
    }

    pub fn message(&self) -> &str {
        &self.0.message
    }

    pub fn status(&self) -> Option<u16> {
        self.0.details.status
    }

    pub fn code(&self) -> Option<&str> {
        self.0.details.code.as_deref()
    }

    pub fn details(&self) -> Option<&str> {
        self.0.details.details.as_deref()
    }

    pub fn issues(&self) -> &[HimringApiIssue] {
        &self.0.details.issues
    }

    pub fn missing_permission(&self) -> Option<&HimringMissingPermission> {
        self.0.details.missing_permission.as_ref()
    }

    pub fn retry_after_seconds(&self) -> Option<u64> {
        self.0.details.retry_after_seconds
    }

    pub fn request_id(&self) -> Option<&str> {
        self.0.details.request_id.as_deref()
    }

    pub fn is_documented_code(&self) -> bool {
        self.code()
            .is_some_and(|code| documented_status_of(code).is_some())
    }

    pub fn is_refusal(&self, code: &str) -> bool {
        self.kind() == HimringApiErrorKind::Refused && self.code() == Some(code)
    }
}

impl fmt::Debug for HimringApiError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("HimringApiError")
            .field("kind", &self.kind())
            .field("status", &self.status())
            .field("code", &self.code())
            .field("message", &self.message())
            .field("request_id", &self.request_id())
            .finish()
    }
}

impl fmt::Display for HimringApiError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.message())
    }
}

impl StandardError for HimringApiError {
    fn source(&self) -> Option<&(dyn StandardError + 'static)> {
        self.0
            .details
            .source
            .as_deref()
            .map(|source| source as &(dyn StandardError + 'static))
    }
}

pub fn documented_status_of(code: &str) -> Option<u16> {
    ERROR_STATUSES
        .binary_search_by(|(known, _)| (*known).cmp(code))
        .ok()
        .map(|position| ERROR_STATUSES[position].1)
}

pub fn describe_error(error: &HimringApiError) -> String {
    let mut parts = vec![error.message().to_owned()];
    if let Some(details) = error.details() {
        parts.push(details.to_owned());
    }
    if let Some(missing) = error.missing_permission() {
        let place = match &missing.resource_id {
            None => missing.resource_kind.clone(),
            Some(id) => format!("{} {id}", missing.resource_kind),
        };
        parts.push(format!("missing_permission: {} on {place}.", missing.level));
    }
    for issue in error.issues() {
        let sentence = if issue.path.is_empty() {
            issue.message.clone()
        } else {
            let path: Vec<String> = issue.path.iter().map(ToString::to_string).collect();
            format!("{}: {}", path.join("."), issue.message)
        };
        if sentence != error.message() {
            parts.push(sentence);
        }
    }
    parts.join(" ")
}

pub(crate) fn invalid_input(message: impl Into<String>, field: Option<&str>) -> HimringApiError {
    let message = message.into();
    let path = field.map_or_else(Vec::new, |name| vec![IssuePathPart::Field(name.to_owned())]);
    HimringApiError::with_details(
        HimringApiErrorKind::InvalidInput,
        message.clone(),
        ErrorDetails {
            issues: vec![HimringApiIssue { message, path }],
            ..ErrorDetails::default()
        },
    )
}

pub(crate) fn invalid_response(message: impl Into<String>) -> HimringApiError {
    HimringApiError::new(HimringApiErrorKind::InvalidResponse, message)
}
