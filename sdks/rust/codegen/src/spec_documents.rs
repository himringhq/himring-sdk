use std::collections::{BTreeMap, HashSet};
use std::fs;
use std::path::Path;

use serde_json::Value;

use crate::spec_model::{
    DOCUMENT_FILES, ErrorCodeModel, JsonObject, SpecModel, SpecModelError, SpecResult,
    is_snake_case, list_at, operation_of, optional_record, record_at, spec_error, text_at,
};

const FILE_KINDS_KEYWORD: &str = "x-himring-file-kinds";
const ERROR_CODES_KEYWORD: &str = "x-himring-error-codes";

fn is_listed_extension(text: &str) -> bool {
    text.len() > 1
        && text.starts_with('.')
        && text[1..]
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit())
}

fn error_codes_of(document: &JsonObject, place: &str) -> SpecResult<Vec<ErrorCodeModel>> {
    let components = record_at(document.get("components"), &format!("{place} components"))?;
    let schemas = record_at(components.get("schemas"), &format!("{place} schemas"))?;
    let error_code = record_at(schemas.get("error_code"), &format!("{place} error_code"))?;
    let codes = record_at(
        error_code.get(ERROR_CODES_KEYWORD),
        &format!("{place} {ERROR_CODES_KEYWORD}"),
    )?;
    let mut found = Vec::new();
    for (code, raw) in codes {
        let description = record_at(Some(raw), &format!("{place} error code {code}"))?;
        let status = description
            .get("status")
            .and_then(Value::as_u64)
            .and_then(|status| u16::try_from(status).ok());
        let message = description.get("message").and_then(Value::as_str);
        let (Some(status), Some(message)) = (status, message) else {
            return spec_error(format!(
                "{place} error code {code} has no status and message."
            ));
        };
        found.push(ErrorCodeModel {
            code: code.clone(),
            status,
            message: message.to_owned(),
        });
    }
    Ok(found)
}

fn file_kinds_of(components: &JsonObject, place: &str) -> SpecResult<Vec<(String, Vec<String>)>> {
    let kinds = record_at(
        components.get(FILE_KINDS_KEYWORD),
        &format!("{place} {FILE_KINDS_KEYWORD}"),
    )?;
    let mut owners: BTreeMap<String, String> = BTreeMap::new();
    let mut found = Vec::new();
    for (kind, raw) in kinds {
        if !is_snake_case(kind) {
            return spec_error(format!("{place} lists the file kind {kind}."));
        }
        let extensions = list_at(Some(raw));
        if extensions.is_empty() {
            return spec_error(format!("{place} lists no extensions for {kind}."));
        }
        let mut listed = Vec::new();
        for extension in extensions {
            let Some(text) = extension.as_str().filter(|text| is_listed_extension(text)) else {
                return spec_error(format!("{place} lists {extension} for {kind}."));
            };
            if let Some(owner) = owners.get(text) {
                return spec_error(format!("{place} lists {text} for {owner} and {kind}."));
            }
            owners.insert(text.to_owned(), kind.clone());
            listed.push(text.to_owned());
        }
        found.push((kind.clone(), listed));
    }
    if found.is_empty() {
        return spec_error(format!("{place} lists no file kinds."));
    }
    Ok(found)
}

fn server_url_of(document: &JsonObject, place: &str) -> SpecResult<String> {
    let servers = list_at(document.get("servers"));
    let first = servers
        .first()
        .and_then(|server| optional_record(Some(server)));
    let url = text_at(
        first.and_then(|server| server.get("url")),
        &format!("{place} servers[0].url"),
    )?;
    let host = url.strip_prefix("https://").unwrap_or_default();
    let authority = host.split(['/', '?', '#']).next().unwrap_or_default();
    if authority.is_empty() || authority.contains('@') {
        return spec_error(format!(
            "{place} gives {url} as its first server, which is not an https URL."
        ));
    }
    Ok(url.to_owned())
}

fn same_in<T: PartialEq + Clone>(found: &[T], what: &str) -> SpecResult<T> {
    let Some(first) = found.first() else {
        return spec_error(format!("The documents give no {what}."));
    };
    if found.iter().any(|value| value != first) {
        return spec_error(format!("The documents give different {what}."));
    }
    Ok(first.clone())
}

pub fn load_spec_model(directory: &Path) -> SpecResult<SpecModel> {
    let mut operations = Vec::new();
    let mut error_codes: BTreeMap<String, ErrorCodeModel> = BTreeMap::new();
    let mut components = BTreeMap::new();
    let mut file_kinds = Vec::new();
    let mut server_urls = Vec::new();
    for (document, file) in DOCUMENT_FILES {
        let text = fs::read_to_string(directory.join(file))
            .map_err(|error| SpecModelError(format!("{file} could not be read: {error}.")))?;
        let parsed: Value = serde_json::from_str(&text)
            .map_err(|error| SpecModelError(format!("{file} is not JSON: {error}.")))?;
        let parsed = record_at(Some(&parsed), file)?;
        let document_components =
            record_at(parsed.get("components"), &format!("{file} components"))?;
        file_kinds.push(file_kinds_of(document_components, file)?);
        components.insert(document, document_components.clone());
        server_urls.push(server_url_of(parsed, file)?);
        for (path, item) in record_at(parsed.get("paths"), &format!("{file} paths"))? {
            for (method_key, raw) in record_at(Some(item), &format!("{file} {path}"))? {
                operations.push(operation_of(document, file, path, method_key, raw)?);
            }
        }
        for code in error_codes_of(parsed, file)? {
            if let Some(known) = error_codes.get(&code.code)
                && known != &code
            {
                return spec_error(format!(
                    "The documents describe the error code {} in two ways.",
                    code.code
                ));
            }
            error_codes.insert(code.code.clone(), code);
        }
    }
    let mut seen = HashSet::new();
    for operation in &operations {
        if !seen.insert(operation.id.clone()) {
            return spec_error(format!("The documents hold {} twice.", operation.id));
        }
    }
    operations.sort_by(|left, right| left.id.cmp(&right.id));
    Ok(SpecModel {
        operations,
        error_codes: error_codes.into_values().collect(),
        components,
        file_kinds: same_in(&file_kinds, "file kinds")?,
        server_url: same_in(&server_urls, "server URLs")?,
    })
}
