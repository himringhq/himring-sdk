use crate::input_schema::{FieldLocation, input_fields_of};
use crate::names::variant_name_of;
use crate::render_types::RenderedTypes;
use crate::spec_model::{
    BodyKind, OperationModel, SpecModel, SpecResult, optional_record, spec_error,
};

fn upload_part_maximum(model: &SpecModel) -> SpecResult<u64> {
    let mut schema = model
        .operations
        .iter()
        .find(|operation| operation.id == "sign_upload_parts")
        .and_then(|operation| operation.body.schema.as_ref());
    for key in ["properties", "parts", "items", "properties", "part_number"] {
        schema = schema.and_then(|record| optional_record(record.get(key)));
    }
    match schema
        .and_then(|record| record.get("maximum"))
        .and_then(serde_json::Value::as_u64)
    {
        Some(maximum) if maximum > 0 => Ok(maximum),
        _ => spec_error("sign_upload_parts has no positive whole maximum for part_number."),
    }
}

fn texts(values: &[String]) -> String {
    let quoted: Vec<String> = values.iter().map(|value| format!("{value:?}")).collect();
    format!("&[{}]", quoted.join(", "))
}

fn optional_text(value: Option<&String>) -> String {
    value.map_or_else(|| "None".to_owned(), |text| format!("Some({text:?})"))
}

fn body_kind_of(kind: BodyKind) -> &'static str {
    match kind {
        BodyKind::None => "BodyKind::None",
        BodyKind::Json => "BodyKind::Json",
        BodyKind::File => "BodyKind::File",
    }
}

fn entry_lines(operation: &OperationModel, rendered: &RenderedTypes) -> SpecResult<Vec<String>> {
    let body_fields: Vec<String> = input_fields_of(operation)?
        .into_iter()
        .filter(|field| field.location == FieldLocation::Body)
        .map(|field| field.name)
        .collect();
    let Some(types) = rendered.by_operation.get(&operation.id) else {
        return spec_error(format!("{} has no rendered types.", operation.id));
    };
    let path_names: Vec<String> = operation
        .path_parameters
        .iter()
        .map(|item| item.name.clone())
        .collect();
    let query_names: Vec<String> = operation
        .query_parameters
        .iter()
        .map(|item| item.name.clone())
        .collect();
    let mut nullable = types.nullable_fields.clone();
    nullable.sort();
    let response = &operation.response;
    let response_kind = if response.is_download() {
        "ResponseKind::Download"
    } else {
        "ResponseKind::Json"
    };
    let maximum = operation
        .body
        .maximum_bytes
        .map_or_else(|| "None".to_owned(), |bytes| format!("Some({bytes})"));
    Ok(vec![
        "OperationDescription {".to_owned(),
        format!("operation_id: {:?},", operation.id),
        format!(
            "method: HttpMethod::{},",
            match operation.method.as_str() {
                "GET" => "Get",
                "POST" => "Post",
                _ => "Delete",
            }
        ),
        format!("path: {:?},", operation.path),
        format!("path_parameters: {},", texts(&path_names)),
        format!("query_parameters: {},", texts(&query_names)),
        format!("body_kind: {},", body_kind_of(operation.body.kind)),
        format!("body_fields: {},", texts(&body_fields)),
        format!("maximum_body_bytes: {maximum},"),
        format!("nullable_fields: {},", texts(&nullable)),
        "response: ResponseDescription {".to_owned(),
        format!("kind: {response_kind},"),
        format!("status: {},", response.status),
        format!("content_types: {},", texts(&response.content_types)),
        format!(
            "file_extension: {},",
            optional_text(response.file_extension.as_ref())
        ),
        "},".to_owned(),
        "},".to_owned(),
    ])
}

pub fn render_operations(model: &SpecModel, rendered: &RenderedTypes) -> SpecResult<String> {
    let mut lines = vec![
        "use crate::operation_description::{BodyKind, HttpMethod, OperationDescription, ResponseDescription, ResponseKind};".to_owned(),
        String::new(),
        format!("pub const SPEC_API_URL: &str = {:?};", model.server_url),
        format!("pub const SIGNABLE_PART_NUMBER_MAXIMUM: u64 = {};", upload_part_maximum(model)?),
        String::new(),
        "#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]".to_owned(),
        "#[non_exhaustive]".to_owned(),
        "pub enum FileKind {".to_owned(),
    ];
    let mut variants = Vec::new();
    for (kind, _) in &model.file_kinds {
        let variant = variant_name_of(kind, "x-himring-file-kinds")?;
        lines.push(format!("{variant},"));
        variants.push((variant, kind.clone()));
    }
    lines.extend([
        "}".to_owned(),
        String::new(),
        "impl FileKind {".to_owned(),
        "#[must_use]".to_owned(),
        "pub fn as_str(self) -> &'static str {".to_owned(),
        "match self {".to_owned(),
    ]);
    for (variant, kind) in &variants {
        lines.push(format!("Self::{variant} => {kind:?},"));
    }
    lines.extend([
        "}".to_owned(),
        "}".to_owned(),
        "}".to_owned(),
        String::new(),
    ]);
    let listed: Vec<String> = variants
        .iter()
        .map(|(variant, _)| format!("FileKind::{variant}"))
        .collect();
    lines.push(format!(
        "pub const FILE_KIND_LIST: &[FileKind] = &[{}];",
        listed.join(", ")
    ));
    lines.push(String::new());
    lines.push("pub const FILE_KINDS: &[(FileKind, &[&str])] = &[".to_owned());
    for ((variant, _), (_, extensions)) in variants.iter().zip(&model.file_kinds) {
        lines.push(format!("(FileKind::{variant}, {}),", texts(extensions)));
    }
    lines.extend(["];".to_owned(), String::new()]);
    lines.push("pub static OPERATIONS: &[OperationDescription] = &[".to_owned());
    for operation in &model.operations {
        lines.extend(entry_lines(operation, rendered)?);
    }
    lines.extend(["];".to_owned(), String::new()]);
    lines.push("pub const ERROR_STATUSES: &[(&str, u16)] = &[".to_owned());
    for code in &model.error_codes {
        lines.push(format!("({:?}, {}),", code.code, code.status));
    }
    lines.extend(["];".to_owned(), String::new()]);
    lines.push("pub const ERROR_MESSAGES: &[(&str, &str)] = &[".to_owned());
    for code in &model.error_codes {
        lines.push(format!("({:?}, {:?}),", code.code, code.message));
    }
    lines.extend(["];".to_owned(), String::new()]);
    Ok(lines.join("\n"))
}
