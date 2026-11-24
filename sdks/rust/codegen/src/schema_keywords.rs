use serde_json::Value;

use crate::names::pascal_of;
use crate::spec_model::{JsonObject, SpecResult, optional_record, spec_error};

const COMPONENT_REFERENCE_PREFIX: &str = "#/components/";
const EXTENSION_PREFIX: &str = "x-";
const SHAPE_KEYWORDS: [&str; 9] = [
    "type",
    "anyOf",
    "enum",
    "const",
    "properties",
    "required",
    "additionalProperties",
    "items",
    "$ref",
];
const VALIDATION_KEYWORDS: [&str; 22] = [
    "description",
    "default",
    "format",
    "pattern",
    "minLength",
    "maxLength",
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
    "minItems",
    "maxItems",
    "uniqueItems",
    "minProperties",
    "maxProperties",
    "propertyNames",
    "title",
    "examples",
    "deprecated",
    "readOnly",
    "writeOnly",
];

fn is_extension(key: &str) -> bool {
    key.starts_with(EXTENSION_PREFIX)
}

pub fn resolved<'a>(
    schema: &'a JsonObject,
    components: &'a JsonObject,
    place: &str,
) -> SpecResult<&'a JsonObject> {
    let Some(reference) = schema.get("$ref") else {
        return Ok(schema);
    };
    let Some(pointer) = reference
        .as_str()
        .and_then(|text| text.strip_prefix(COMPONENT_REFERENCE_PREFIX))
    else {
        return spec_error(format!("{place} holds the reference {reference}."));
    };
    let mut current: Option<&JsonObject> = Some(components);
    for part in pointer.split('/') {
        current = current.and_then(|record| optional_record(record.get(part)));
    }
    let Some(target) = current else {
        return spec_error(format!("{place} holds the unknown reference {reference}."));
    };
    if schema.keys().any(|key| {
        key != "$ref" && !is_extension(key) && !VALIDATION_KEYWORDS.contains(&key.as_str())
    }) {
        return spec_error(format!(
            "{place} puts shape keywords beside its reference {reference}."
        ));
    }
    Ok(target)
}

pub fn checked_keywords(schema: &JsonObject, place: &str) -> SpecResult<()> {
    for key in schema.keys() {
        let known = SHAPE_KEYWORDS.contains(&key.as_str())
            || VALIDATION_KEYWORDS.contains(&key.as_str())
            || is_extension(key);
        if !known {
            return spec_error(format!(
                "{place} uses the keyword {key}, which the generator cannot convert."
            ));
        }
    }
    Ok(())
}

pub fn discriminator_of(option: &JsonObject) -> Option<String> {
    let properties = optional_record(option.get("properties"))?;
    let joined: String = properties
        .values()
        .filter_map(|value| optional_record(Some(value)))
        .filter_map(|record| record.get("const").and_then(Value::as_str))
        .map(pascal_of)
        .collect();
    if joined.is_empty()
        || joined
            .bytes()
            .next()
            .is_some_and(|first| first.is_ascii_digit())
    {
        None
    } else {
        Some(joined)
    }
}
