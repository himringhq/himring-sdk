use std::collections::BTreeMap;
use std::fmt;

use serde_json::{Map, Value};

pub type JsonObject = Map<String, Value>;

pub const DOCUMENT_FILES: [(DocumentName, &str); 2] = [
    (DocumentName::Api, "openapi.json"),
    (DocumentName::Session, "openapi-session.json"),
];
pub const JSON_MEDIA_TYPE: &str = "application/json";
pub const FILE_MEDIA_TYPE: &str = "application/octet-stream";
const MAXIMUM_BYTES_KEYWORD: &str = "x-himring-maximum-bytes";
const FILE_EXTENSION_KEYWORD: &str = "x-himring-file-extension";

#[derive(Debug)]
pub struct SpecModelError(pub String);

impl fmt::Display for SpecModelError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(&self.0)
    }
}

impl std::error::Error for SpecModelError {}

pub type SpecResult<T> = Result<T, SpecModelError>;

pub fn spec_error<T>(message: impl Into<String>) -> SpecResult<T> {
    Err(SpecModelError(message.into()))
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub enum DocumentName {
    Api,
    Session,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum HttpMethod {
    Get,
    Post,
    Delete,
}

impl HttpMethod {
    pub fn as_str(self) -> &'static str {
        match self {
            HttpMethod::Get => "GET",
            HttpMethod::Post => "POST",
            HttpMethod::Delete => "DELETE",
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum BodyKind {
    None,
    Json,
    File,
}

#[derive(Clone, Debug)]
pub struct ParameterModel {
    pub name: String,
    pub required: bool,
    pub schema: JsonObject,
}

#[derive(Clone, Debug)]
pub struct BodyModel {
    pub kind: BodyKind,
    pub schema: Option<JsonObject>,
    pub maximum_bytes: Option<u64>,
}

#[derive(Clone, Debug)]
pub struct ResponseModel {
    pub status: u16,
    pub schema: Option<JsonObject>,
    pub content_types: Vec<String>,
    pub file_extension: Option<String>,
}

impl ResponseModel {
    pub fn is_download(&self) -> bool {
        self.file_extension.is_some()
    }
}

#[derive(Clone, Debug)]
pub struct OperationModel {
    pub id: String,
    pub document: DocumentName,
    pub method: HttpMethod,
    pub path: String,
    pub path_parameters: Vec<ParameterModel>,
    pub query_parameters: Vec<ParameterModel>,
    pub body: BodyModel,
    pub response: ResponseModel,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ErrorCodeModel {
    pub code: String,
    pub status: u16,
    pub message: String,
}

pub struct SpecModel {
    pub operations: Vec<OperationModel>,
    pub error_codes: Vec<ErrorCodeModel>,
    pub components: BTreeMap<DocumentName, JsonObject>,
    pub file_kinds: Vec<(String, Vec<String>)>,
    pub server_url: String,
}

pub fn record_at<'a>(value: Option<&'a Value>, place: &str) -> SpecResult<&'a JsonObject> {
    match value {
        Some(Value::Object(record)) => Ok(record),
        _ => spec_error(format!("{place} is not a JSON object.")),
    }
}

pub fn optional_record(value: Option<&Value>) -> Option<&JsonObject> {
    match value {
        Some(Value::Object(record)) => Some(record),
        _ => None,
    }
}

pub fn list_at(value: Option<&Value>) -> &[Value] {
    match value {
        Some(Value::Array(items)) => items,
        _ => &[],
    }
}

pub fn text_at<'a>(value: Option<&'a Value>, place: &str) -> SpecResult<&'a str> {
    match value {
        Some(Value::String(text)) if !text.is_empty() => Ok(text),
        _ => spec_error(format!("{place} is not a text value.")),
    }
}

pub fn is_snake_case(text: &str) -> bool {
    text.bytes()
        .next()
        .is_some_and(|first| first.is_ascii_lowercase())
        && text.split('_').all(|part| {
            !part.is_empty()
                && part
                    .bytes()
                    .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit())
        })
}

fn parameter_of(raw: &Value, place: &str) -> SpecResult<(String, ParameterModel)> {
    let parameter = record_at(Some(raw), place)?;
    let name = text_at(parameter.get("name"), &format!("{place} name"))?;
    let location = text_at(parameter.get("in"), &format!("{place} in"))?;
    if location != "path" && location != "query" {
        return spec_error(format!("{place} is in {location}."));
    }
    if location == "query"
        && (parameter.get("style") != Some(&Value::from("form"))
            || parameter.get("explode") != Some(&Value::Bool(false)))
    {
        return spec_error(format!("{place} is not a form parameter without explode."));
    }
    let schema = record_at(parameter.get("schema"), &format!("{place} schema"))?.clone();
    let required = parameter.get("required") == Some(&Value::Bool(true));
    Ok((
        location.to_owned(),
        ParameterModel {
            name: name.to_owned(),
            required,
            schema,
        },
    ))
}

fn body_of(operation: &JsonObject, place: &str) -> SpecResult<BodyModel> {
    let Some(raw) = operation.get("requestBody") else {
        return Ok(BodyModel {
            kind: BodyKind::None,
            schema: None,
            maximum_bytes: None,
        });
    };
    let body = record_at(Some(raw), &format!("{place} requestBody"))?;
    let content = record_at(body.get("content"), &format!("{place} requestBody content"))?;
    if body.get("required") != Some(&Value::Bool(true)) || content.len() != 1 {
        return spec_error(format!(
            "{place} needs one required request body media type."
        ));
    }
    let Some((media_type, media)) = content.iter().next() else {
        return spec_error(format!("{place} has no request body media type."));
    };
    if media_type == FILE_MEDIA_TYPE {
        return match body.get(MAXIMUM_BYTES_KEYWORD).and_then(Value::as_u64) {
            Some(limit) if limit > 0 => Ok(BodyModel {
                kind: BodyKind::File,
                schema: None,
                maximum_bytes: Some(limit),
            }),
            _ => spec_error(format!(
                "{place} takes a file without {MAXIMUM_BYTES_KEYWORD}."
            )),
        };
    }
    if media_type != JSON_MEDIA_TYPE {
        return spec_error(format!("{place} takes {media_type}."));
    }
    let schema = record_at(
        record_at(Some(media), place)?.get("schema"),
        &format!("{place} body schema"),
    )?;
    if schema.get("type") != Some(&Value::from("object"))
        || optional_record(schema.get("properties")).is_none()
    {
        return spec_error(format!(
            "{place} takes a JSON body that is not an object with properties."
        ));
    }
    Ok(BodyModel {
        kind: BodyKind::Json,
        schema: Some(schema.clone()),
        maximum_bytes: None,
    })
}

fn is_success_status(status: &str) -> bool {
    status.len() == 3 && status.starts_with('2') && status.bytes().all(|byte| byte.is_ascii_digit())
}

fn response_of(operation: &JsonObject, place: &str) -> SpecResult<ResponseModel> {
    let responses = record_at(operation.get("responses"), &format!("{place} responses"))?;
    let successes: Vec<(&String, &Value)> = responses
        .iter()
        .filter(|(status, _)| is_success_status(status))
        .collect();
    let [(status_text, raw)] = successes.as_slice() else {
        return spec_error(format!("{place} has no single success response."));
    };
    let response = record_at(Some(raw), &format!("{place} {status_text} response"))?;
    let content = record_at(
        response.get("content"),
        &format!("{place} {status_text} content"),
    )?;
    let status: u16 = status_text
        .parse()
        .map_err(|_| SpecModelError(format!("{place} has the status {status_text}.")))?;
    if let Some(extension) = response.get(FILE_EXTENSION_KEYWORD) {
        let Value::String(extension) = extension else {
            return spec_error(format!("{place} has a file extension that is not text."));
        };
        return Ok(ResponseModel {
            status,
            schema: None,
            content_types: content.keys().cloned().collect(),
            file_extension: Some(extension.clone()),
        });
    }
    let json_content = record_at(
        content.get(JSON_MEDIA_TYPE),
        &format!("{place} JSON response"),
    )?;
    let schema = record_at(
        json_content.get("schema"),
        &format!("{place} response schema"),
    )?;
    Ok(ResponseModel {
        status,
        schema: Some(schema.clone()),
        content_types: vec![JSON_MEDIA_TYPE.to_owned()],
        file_extension: None,
    })
}

fn path_template_names(path: &str) -> Vec<String> {
    let mut names = Vec::new();
    let mut rest = path;
    while let Some(start) = rest.find('{') {
        let after = &rest[start + 1..];
        let Some(end) = after.find('}') else { break };
        names.push(after[..end].to_owned());
        rest = &after[end + 1..];
    }
    names
}

pub fn operation_of(
    document: DocumentName,
    file: &str,
    path: &str,
    method_key: &str,
    raw: &Value,
) -> SpecResult<OperationModel> {
    let place = format!("{file} {} {path}", method_key.to_uppercase());
    let method = match method_key {
        "get" => HttpMethod::Get,
        "post" => HttpMethod::Post,
        "delete" => HttpMethod::Delete,
        _ => {
            return spec_error(format!("{place} uses a method that the SDK does not send."));
        }
    };
    let operation = record_at(Some(raw), &place)?;
    let operation_id = text_at(
        operation.get("operationId"),
        &format!("{place} operationId"),
    )?;
    if !is_snake_case(operation_id) {
        return spec_error(format!(
            "{place} has the operationId {operation_id}, not snake_case."
        ));
    }
    let mut path_parameters = Vec::new();
    let mut query_parameters = Vec::new();
    for (index, item) in list_at(operation.get("parameters")).iter().enumerate() {
        let (location, parameter) = parameter_of(item, &format!("{place} parameter {index}"))?;
        if location == "path" {
            path_parameters.push(parameter);
        } else {
            query_parameters.push(parameter);
        }
    }
    let documented: Vec<String> = path_parameters
        .iter()
        .map(|item| item.name.clone())
        .collect();
    if path_template_names(path) != documented {
        return spec_error(format!(
            "{place} documents path parameters that differ from its path."
        ));
    }
    if path_parameters.iter().any(|parameter| !parameter.required) {
        return spec_error(format!("{place} has an optional path parameter."));
    }
    Ok(OperationModel {
        id: operation_id.to_owned(),
        document,
        method,
        path: path.to_owned(),
        path_parameters,
        query_parameters,
        body: body_of(operation, &place)?,
        response: response_of(operation, &place)?,
    })
}
