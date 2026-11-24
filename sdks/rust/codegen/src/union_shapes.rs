use serde_json::Value;

use crate::schema_keywords::discriminator_of;
use crate::spec_model::{JsonObject, SpecResult, optional_record, spec_error};
use crate::type_model::{RustType, TypeUnion, deduplicated};

pub fn ordered_members(members: Vec<RustType>) -> Vec<RustType> {
    let rank = |member: &RustType| match member {
        RustType::Named(_) => 0,
        RustType::List(_) => 1,
        RustType::Map(_) | RustType::JsonObject => 2,
        RustType::Integer => 3,
        RustType::Number => 4,
        RustType::Boolean => 5,
        RustType::Text => 6,
        _ => 7,
    };
    let mut ordered = members;
    ordered.sort_by_key(rank);
    ordered
}

pub fn option_names(options: &[JsonObject], name: &str) -> Vec<String> {
    let shaped: Vec<usize> = options
        .iter()
        .enumerate()
        .filter(|(_, option)| optional_record(option.get("properties")).is_some())
        .map(|(index, _)| index)
        .collect();
    let mut names = vec![name.to_owned(); options.len()];
    let non_null = options
        .iter()
        .filter(|option| option.get("type") != Some(&Value::from("null")))
        .count();
    if shaped.len() == 1 {
        if non_null > 1 {
            names[shaped[0]] = format!("{name}Object");
        }
        return names;
    }
    let discriminators: Vec<Option<String>> = shaped
        .iter()
        .map(|index| discriminator_of(&options[*index]))
        .collect();
    let distinct = discriminators.iter().all(Option::is_some)
        && deduplicated(&discriminators).len() == shaped.len();
    for (position, index) in shaped.iter().enumerate() {
        let suffix = match (&discriminators[position], distinct) {
            (Some(value), true) => value.clone(),
            _ => format!("Option{}", position + 1),
        };
        names[*index] = format!("{name}{suffix}");
    }
    names
}

pub fn literal_union(values: &[Value], place: &str) -> SpecResult<TypeUnion> {
    let mut union = TypeUnion::default();
    for value in values {
        match value {
            Value::Null => union.nullable = true,
            Value::String(text) => union.literals.push(text.clone()),
            Value::Bool(_) => union.members.push(RustType::Boolean),
            Value::Number(number) if number.is_i64() || number.is_u64() => {
                union.members.push(RustType::Integer);
            }
            other => {
                return spec_error(format!(
                    "{place} holds the literal {other}, which the Rust SDK carries only as text."
                ));
            }
        }
    }
    if union.literals.is_empty() && union.members.is_empty() && !union.nullable {
        return spec_error(format!("{place} lists no allowed value."));
    }
    Ok(union)
}
