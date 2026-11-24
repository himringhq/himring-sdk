use serde_json::Value;

use crate::spec_model::{JsonObject, SpecModel, SpecResult, list_at, optional_record, spec_error};

const ANSWER_EVENTS_OPERATION: &str = "record_answer_events";
const RULES_KEYWORD: &str = "x-himring-rules";

fn schema_at<'a>(root: &'a JsonObject, keys: &[&str]) -> SpecResult<&'a JsonObject> {
    let mut current = root;
    for key in keys {
        let Some(next) = optional_record(current.get(*key)) else {
            return spec_error(format!(
                "The spec of {ANSWER_EVENTS_OPERATION} has no schema at {}.",
                keys.join(".")
            ));
        };
        current = next;
    }
    Ok(current)
}

fn whole_number_at(schema: &JsonObject, keyword: &str, place: &str) -> SpecResult<u64> {
    match schema.get(keyword).and_then(Value::as_u64) {
        Some(value) if value > 0 => Ok(value),
        _ => spec_error(format!(
            "The spec of {ANSWER_EVENTS_OPERATION} has no {keyword} for {place}."
        )),
    }
}

fn pattern_at<'a>(schema: &'a JsonObject, place: &str) -> SpecResult<&'a str> {
    schema.get("pattern").and_then(Value::as_str).map_or_else(
        || {
            spec_error(format!(
                "The spec of {ANSWER_EVENTS_OPERATION} has no pattern for {place}."
            ))
        },
        Ok,
    )
}

fn rule_expectation<'a>(schema: &'a JsonObject, kind: &str, place: &str) -> SpecResult<&'a str> {
    list_at(schema.get(RULES_KEYWORD))
        .iter()
        .filter_map(|rule| optional_record(Some(rule)))
        .find(|rule| rule.get("kind").and_then(Value::as_str) == Some(kind))
        .and_then(|rule| rule.get("expects").and_then(Value::as_str))
        .map_or_else(
            || {
                spec_error(format!(
                    "The spec of {ANSWER_EVENTS_OPERATION} has no {kind} rule for {place}."
                ))
            },
            Ok,
        )
}

fn at_most(schema: &JsonObject, place: &str) -> SpecResult<u64> {
    let expectation = rule_expectation(schema, "max_length", place)?;
    expectation
        .strip_prefix("<=")
        .filter(|digits| !digits.is_empty() && digits.bytes().all(|byte| byte.is_ascii_digit()))
        .and_then(|digits| digits.parse().ok())
        .map_or_else(
            || spec_error(format!(
                "The spec of {ANSWER_EVENTS_OPERATION} gives {place} a bound of {expectation}, which is not a whole number."
            )),
            Ok,
        )
}

fn regular_expression_literal(expectation: &str) -> SpecResult<&str> {
    let source = expectation
        .strip_prefix('/')
        .and_then(|rest| rest.rsplit_once('/'))
        .filter(|(source, flags)| !source.is_empty() && (flags.is_empty() || *flags == "u"));
    source.map_or_else(
        || {
            spec_error(format!(
                "The spec of {ANSWER_EVENTS_OPERATION} describes its time rule in an unknown way."
            ))
        },
        |(source, _)| Ok(source),
    )
}

pub fn render_rules(model: &SpecModel) -> SpecResult<String> {
    let Some(operation) = model
        .operations
        .iter()
        .find(|operation| operation.id == ANSWER_EVENTS_OPERATION)
    else {
        return spec_error(format!("The documents hold no {ANSWER_EVENTS_OPERATION}."));
    };
    let Some(body) = &operation.body.schema else {
        return spec_error(format!("{ANSWER_EVENTS_OPERATION} takes no JSON body."));
    };
    let events = schema_at(body, &["properties", "events"])?;
    let item = schema_at(events, &["items"])?;
    let cited = schema_at(item, &["properties", "cited_chunk_ids"])?;
    let handoff = schema_at(item, &["properties", "handoff_reason"])?;
    let occurred_at = schema_at(item, &["properties", "occurred_at"])?;
    let question_id = schema_at(item, &["properties", "question_id"])?;
    let lines = [
        format!(
            "pub const EVENTS_PER_REQUEST: usize = {};",
            whole_number_at(events, "maxItems", "events")?
        ),
        format!(
            "pub const CITED_CHUNKS_MAXIMUM: usize = {};",
            whole_number_at(cited, "maxItems", "cited_chunk_ids")?
        ),
        format!(
            "pub const QUESTION_ID_PATTERN: &str = {:?};",
            pattern_at(question_id, "question_id")?
        ),
        format!(
            "pub const CHUNK_ID_PATTERN: &str = {:?};",
            pattern_at(schema_at(cited, &["items"])?, "cited_chunk_ids")?
        ),
        format!(
            "pub const HANDOFF_REASON_MAXIMUM: usize = {};",
            at_most(handoff, "handoff_reason")?
        ),
        format!(
            "pub const OCCURRED_AT_PATTERN: &str = {:?};",
            regular_expression_literal(rule_expectation(
                occurred_at,
                "iso_timestamp",
                "occurred_at"
            )?)?
        ),
    ];
    Ok(format!("{}\n", lines.join("\n")))
}
