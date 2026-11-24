use crate::spec_model::{SpecResult, spec_error};

const RUST_KEYWORDS: [&str; 51] = [
    "as", "async", "await", "break", "const", "continue", "crate", "dyn", "else", "enum", "extern",
    "false", "fn", "for", "gen", "if", "impl", "in", "let", "loop", "match", "mod", "move", "mut",
    "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "true", "type",
    "unsafe", "use", "where", "while", "abstract", "become", "box", "do", "final", "macro",
    "override", "priv", "try", "typeof", "unsized", "virtual",
];
const UNRAWABLE_KEYWORDS: [&str; 4] = ["crate", "self", "Self", "super"];
const RESERVED_INPUT_MEMBERS: [&str; 1] = ["new"];

pub fn pascal_of(text: &str) -> String {
    text.split(|character: char| !character.is_ascii_alphanumeric())
        .filter(|part| !part.is_empty())
        .map(|part| {
            let mut characters = part.chars();
            characters.next().map_or_else(String::new, |first| {
                first.to_ascii_uppercase().to_string() + characters.as_str()
            })
        })
        .collect()
}

pub fn input_type_name_of(operation_id: &str) -> String {
    format!("{}Input", pascal_of(operation_id))
}

pub fn output_type_name_of(operation_id: &str) -> String {
    format!("{}Output", pascal_of(operation_id))
}

fn is_plain_field(name: &str) -> bool {
    name.bytes()
        .next()
        .is_some_and(|first| first.is_ascii_lowercase() || first == b'_')
        && name
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        && name != "_"
}

pub fn field_identifier_of(field: &str, place: &str) -> SpecResult<String> {
    if UNRAWABLE_KEYWORDS.contains(&field) {
        return spec_error(format!(
            "{place} takes the field {field}, which cannot be a Rust field name."
        ));
    }
    if RUST_KEYWORDS.contains(&field) {
        return Ok(format!("r#{field}"));
    }
    if is_plain_field(field) {
        return Ok(field.to_owned());
    }
    let mut converted = String::new();
    for character in field.chars() {
        if character.is_ascii_uppercase() && !converted.is_empty() && !converted.ends_with('_') {
            converted.push('_');
        }
        if character.is_ascii_alphanumeric() {
            converted.push(character.to_ascii_lowercase());
        } else if !converted.ends_with('_') {
            converted.push('_');
        }
    }
    let trimmed = converted.trim_matches('_');
    if trimmed.is_empty() {
        return spec_error(format!(
            "{place} takes the field {field:?}, which has no Rust name."
        ));
    }
    if trimmed
        .bytes()
        .next()
        .is_some_and(|first| first.is_ascii_digit())
    {
        return Ok(format!("field_{trimmed}"));
    }
    if RUST_KEYWORDS.contains(&trimmed) {
        return Ok(format!("r#{trimmed}"));
    }
    Ok(trimmed.to_owned())
}

pub fn setter_name_of(identifier: &str, place: &str) -> SpecResult<String> {
    let bare = identifier.strip_prefix("r#").unwrap_or(identifier);
    if RESERVED_INPUT_MEMBERS.contains(&bare) {
        return spec_error(format!(
            "{place} takes the field {bare}, which the input builder uses for itself."
        ));
    }
    Ok(identifier.to_owned())
}

pub fn variant_name_of(value: &str, place: &str) -> SpecResult<String> {
    let pascal = pascal_of(value);
    if pascal.is_empty() {
        return spec_error(format!(
            "{place} allows {value:?}, which has no Rust variant name."
        ));
    }
    if pascal
        .bytes()
        .next()
        .is_some_and(|first| first.is_ascii_digit())
    {
        return Ok(format!("Value{pascal}"));
    }
    if pascal == "Self" {
        return Ok("SelfValue".to_owned());
    }
    Ok(pascal)
}

pub fn bare_identifier(identifier: &str) -> &str {
    identifier.strip_prefix("r#").unwrap_or(identifier)
}
