use percent_encoding::{AsciiSet, NON_ALPHANUMERIC, utf8_percent_encode};
use serde::Serialize;
use serde_json::{Map, Value};

use crate::errors::{HimringApiError, invalid_input};
use crate::file_content::{FILE_CONTENT_FIELD, FileContent};
use crate::finite_numbers::holds_only_finite_numbers;
use crate::operation_description::{BodyKind, OperationDescription};

const PATH_SEGMENT_KEEPS: &AsciiSet = &NON_ALPHANUMERIC
    .remove(b'-')
    .remove(b'.')
    .remove(b'_')
    .remove(b'~');
const DOT_SEGMENTS: [&str; 2] = [".", ".."];

pub(crate) struct FileBody {
    pub operation_id: &'static str,
    pub content: FileContent,
    pub maximum_bytes: u64,
}

pub(crate) struct RequestParts {
    pub path: String,
    pub query: Vec<(String, String)>,
    pub json_body: Option<Vec<u8>>,
    pub file_body: Option<FileBody>,
}

pub(crate) fn fields_of<T: Serialize>(
    operation_id: &str,
    input: &T,
) -> Result<Map<String, Value>, HimringApiError> {
    if !holds_only_finite_numbers(input) {
        return Err(invalid_input(
            format!("The input of {operation_id} holds a number that JSON cannot carry."),
            None,
        ));
    }
    match serde_json::to_value(input) {
        Ok(Value::Object(fields)) => Ok(fields),
        Ok(_) => Err(invalid_input(
            format!("The input of {operation_id} must be an object."),
            None,
        )),
        Err(error) => Err(invalid_input(
            format!("The input of {operation_id} holds a value that JSON cannot carry."),
            None,
        )
        .caused_by(error)),
    }
}

fn given_fields(operation: &OperationDescription, raw: Map<String, Value>) -> Map<String, Value> {
    raw.into_iter()
        .filter(|(name, value)| {
            !value.is_null() || operation.nullable_fields.contains(&name.as_str())
        })
        .collect()
}

fn path_segment(
    operation: &OperationDescription,
    name: &str,
    value: Option<&Value>,
) -> Result<String, HimringApiError> {
    let text = match value {
        Some(Value::String(text)) => text.clone(),
        Some(Value::Number(number)) if number.is_i64() || number.is_u64() => number.to_string(),
        _ => {
            return Err(invalid_input(
                format!(
                    "{} needs {name} as text in the path.",
                    operation.operation_id
                ),
                Some(name),
            ));
        }
    };
    if text.is_empty() || DOT_SEGMENTS.contains(&text.as_str()) {
        return Err(invalid_input(
            format!(
                "{} needs {name}, and it cannot be empty, '.', or '..'.",
                operation.operation_id
            ),
            Some(name),
        ));
    }
    Ok(utf8_percent_encode(&text, PATH_SEGMENT_KEEPS).to_string())
}

fn float_text(value: f64) -> String {
    if value.fract() == 0.0 && value.abs() < 9.007_199_254_740_992e15 {
        format!("{value:.0}")
    } else {
        value.to_string()
    }
}

fn query_text(
    operation: &OperationDescription,
    name: &str,
    value: &Value,
) -> Result<String, HimringApiError> {
    match value {
        Value::String(text) => Ok(text.clone()),
        Value::Bool(flag) => Ok(if *flag { "true" } else { "false" }.to_owned()),
        Value::Number(number) => Ok(match number.as_f64() {
            Some(float) if !number.is_i64() && !number.is_u64() => float_text(float),
            _ => number.to_string(),
        }),
        Value::Array(items) => {
            let texts: Result<Vec<String>, HimringApiError> = items
                .iter()
                .map(|item| query_text(operation, name, item))
                .collect();
            Ok(texts?.join(","))
        }
        Value::Null => Err(invalid_input(
            format!("{} takes {name} as text, not null.", operation.operation_id),
            Some(name),
        )),
        Value::Object(_) => Err(invalid_input(
            format!("{} takes {name} as text.", operation.operation_id),
            Some(name),
        )),
    }
}

fn file_body_of(
    operation: &OperationDescription,
    content: Option<FileContent>,
) -> Result<FileBody, HimringApiError> {
    let maximum = operation.maximum_body_bytes.unwrap_or(0);
    let Some(content) = content else {
        return Err(invalid_input(
            format!(
                "{} needs the file under content, as bytes or a reader.",
                operation.operation_id
            ),
            Some(FILE_CONTENT_FIELD),
        ));
    };
    if let Some(size) = content.size_bytes
        && size > maximum
    {
        return Err(invalid_input(
            format!(
                "{} takes a file of at most {maximum} bytes, and this one holds {size}.",
                operation.operation_id
            ),
            Some(FILE_CONTENT_FIELD),
        ));
    }
    Ok(FileBody {
        operation_id: operation.operation_id,
        content,
        maximum_bytes: maximum,
    })
}

pub(crate) fn request_parts_of(
    operation: &'static OperationDescription,
    raw: Map<String, Value>,
    content: Option<FileContent>,
) -> Result<RequestParts, HimringApiError> {
    let given = given_fields(operation, raw);
    let mut path = operation.path.to_owned();
    for name in operation.path_parameters {
        let segment = path_segment(operation, name, given.get(*name))?;
        path = path.replacen(&format!("{{{name}}}"), &segment, 1);
    }
    let mut query = Vec::new();
    let mut body = Map::new();
    for (name, value) in given {
        if operation.path_parameters.contains(&name.as_str()) {
            continue;
        }
        if operation.query_parameters.contains(&name.as_str()) {
            let text = query_text(operation, &name, &value)?;
            query.push((name, text));
        } else if operation.body_kind == BodyKind::Json {
            body.insert(name, value);
        } else {
            return Err(invalid_input(
                format!("{} takes no field called {name}.", operation.operation_id),
                Some(&name),
            ));
        }
    }
    let json_body = if operation.body_kind == BodyKind::Json {
        Some(serde_json::to_vec(&body).map_err(|error| {
            invalid_input(
                format!(
                    "The body of {} holds a value that JSON cannot carry.",
                    operation.operation_id
                ),
                None,
            )
            .caused_by(error)
        })?)
    } else {
        None
    };
    let file_body = if operation.body_kind == BodyKind::File {
        Some(file_body_of(operation, content)?)
    } else {
        None
    };
    Ok(RequestParts {
        path,
        query,
        json_body,
        file_body,
    })
}
