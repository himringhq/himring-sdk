use crate::errors::{HimringApiError, invalid_input};
use crate::generated_operations::OPERATIONS;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub enum HttpMethod {
    Get,
    Post,
    Delete,
}

impl HttpMethod {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Get => "GET",
            Self::Post => "POST",
            Self::Delete => "DELETE",
        }
    }

    pub(crate) fn to_reqwest(self) -> reqwest::Method {
        match self {
            Self::Get => reqwest::Method::GET,
            Self::Post => reqwest::Method::POST,
            Self::Delete => reqwest::Method::DELETE,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub enum BodyKind {
    None,
    Json,
    File,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub enum ResponseKind {
    Json,
    Download,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub struct ResponseDescription {
    pub kind: ResponseKind,
    pub status: u16,
    pub content_types: &'static [&'static str],
    pub file_extension: Option<&'static str>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub struct OperationDescription {
    pub operation_id: &'static str,
    pub method: HttpMethod,
    pub path: &'static str,
    pub path_parameters: &'static [&'static str],
    pub query_parameters: &'static [&'static str],
    pub body_kind: BodyKind,
    pub body_fields: &'static [&'static str],
    pub maximum_body_bytes: Option<u64>,
    pub nullable_fields: &'static [&'static str],
    pub response: ResponseDescription,
}

pub fn operations() -> &'static [OperationDescription] {
    OPERATIONS
}

pub fn operation(operation_id: &str) -> Option<&'static OperationDescription> {
    OPERATIONS
        .binary_search_by(|known| known.operation_id.cmp(operation_id))
        .ok()
        .map(|position| &OPERATIONS[position])
}

pub(crate) fn operation_of(
    operation_id: &str,
) -> Result<&'static OperationDescription, HimringApiError> {
    operation(operation_id).ok_or_else(|| {
        invalid_input(
            format!("The API has no operation called {operation_id}."),
            None,
        )
    })
}
