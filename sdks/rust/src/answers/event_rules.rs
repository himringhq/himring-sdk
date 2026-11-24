use std::collections::HashSet;
use std::sync::OnceLock;

use regress::Regex;
use serde_json::Value;

use crate::answer_event_rules::{
    CHUNK_ID_PATTERN, CITED_CHUNKS_MAXIMUM, EVENTS_PER_REQUEST, HANDOFF_REASON_MAXIMUM,
    OCCURRED_AT_PATTERN, QUESTION_ID_PATTERN,
};
use crate::types::RecordAnswerEventsInputEventsItem;

pub type AnswerEventInput = RecordAnswerEventsInputEventsItem;

pub const ANSWER_TEXT_KEPT_MAXIMUM: usize = 65_536;
pub(crate) const ANSWER_EVENTS_PER_REQUEST: usize = EVENTS_PER_REQUEST;
const PATTERN_FLAGS: &str = "u";

#[derive(Clone, Debug, Default, PartialEq, Eq)]
#[non_exhaustive]
pub struct AnswerEventDraft {
    pub question_id: String,
    pub answer: Option<String>,
    pub follow_up: Option<String>,
    pub cited_chunk_ids: Option<Vec<String>>,
    pub thumbs_down: bool,
    pub handoff_reason: Option<String>,
    pub occurred_at: Option<String>,
}

impl AnswerEventDraft {
    pub fn new(question_id: impl Into<String>) -> Self {
        Self {
            question_id: question_id.into(),
            ..Self::default()
        }
    }

    #[must_use]
    pub fn answer(mut self, answer: impl Into<String>) -> Self {
        self.answer = Some(answer.into());
        self
    }

    #[must_use]
    pub fn follow_up(mut self, follow_up: impl Into<String>) -> Self {
        self.follow_up = Some(follow_up.into());
        self
    }

    #[must_use]
    pub fn cited_chunk_ids(mut self, chunk_ids: Vec<String>) -> Self {
        self.cited_chunk_ids = Some(chunk_ids);
        self
    }

    #[must_use]
    pub fn thumbs_down(mut self) -> Self {
        self.thumbs_down = true;
        self
    }

    #[must_use]
    pub fn handoff_reason(mut self, reason: impl Into<String>) -> Self {
        self.handoff_reason = Some(reason.into());
        self
    }

    #[must_use]
    pub fn occurred_at(mut self, occurred_at: impl Into<String>) -> Self {
        self.occurred_at = Some(occurred_at.into());
        self
    }
}

struct CompiledRules {
    question_id: Regex,
    chunk_id: Regex,
    occurred_at: Regex,
}

fn compiled_rules() -> &'static CompiledRules {
    static RULES: OnceLock<CompiledRules> = OnceLock::new();
    RULES.get_or_init(|| {
        let compile = |pattern: &str| match Regex::with_flags(pattern, PATTERN_FLAGS) {
            Ok(regex) => regex,
            Err(error) => panic!("The spec of record_answer_events holds the pattern {pattern}, which does not compile: {error}"),
        };
        CompiledRules {
            question_id: compile(QUESTION_ID_PATTERN),
            chunk_id: compile(CHUNK_ID_PATTERN),
            occurred_at: compile(OCCURRED_AT_PATTERN),
        }
    })
}

fn matches(regex: &Regex, text: &str) -> bool {
    regex.find(text).is_some()
}

fn within_utf16_units(text: &str, maximum: usize) -> String {
    let mut kept = String::new();
    let mut units = 0;
    for character in text.chars() {
        units += character.len_utf16();
        if units > maximum {
            break;
        }
        kept.push(character);
    }
    kept
}

pub(crate) fn bounded_long_text(text: &str, maximum: usize) -> Option<String> {
    let cleaned: String = text
        .chars()
        .filter(|character| !character.is_control() || matches!(character, '\n' | '\r' | '\t'))
        .collect();
    let bounded = within_utf16_units(cleaned.trim(), maximum);
    if bounded.is_empty() {
        None
    } else {
        Some(bounded)
    }
}

fn bounded_handoff_reason(reason: &str) -> Option<String> {
    let cleaned: String = reason
        .chars()
        .map(|character| {
            if character.is_control() {
                ' '
            } else {
                character
            }
        })
        .collect();
    let bounded = within_utf16_units(cleaned.trim(), HANDOFF_REASON_MAXIMUM);
    let trimmed = bounded.trim();
    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed.to_owned())
    }
}

pub(crate) fn wire_answer_event(draft: &AnswerEventDraft) -> Option<AnswerEventInput> {
    let rules = compiled_rules();
    if !matches(&rules.question_id, &draft.question_id) {
        return None;
    }
    let mut event = AnswerEventInput::new(draft.question_id.clone());
    event.answer = draft
        .answer
        .as_deref()
        .and_then(|text| bounded_long_text(text, ANSWER_TEXT_KEPT_MAXIMUM));
    event.follow_up = draft
        .follow_up
        .as_deref()
        .and_then(|text| bounded_long_text(text, ANSWER_TEXT_KEPT_MAXIMUM));
    event.handoff_reason = draft
        .handoff_reason
        .as_deref()
        .and_then(bounded_handoff_reason);
    if let Some(chunk_ids) = &draft.cited_chunk_ids {
        let mut seen = HashSet::new();
        let cited: Vec<String> = chunk_ids
            .iter()
            .filter(|id| seen.insert(id.as_str()))
            .filter(|id| matches(&rules.chunk_id, id))
            .take(CITED_CHUNKS_MAXIMUM)
            .cloned()
            .collect();
        event.cited_chunk_ids = Some(cited);
    }
    if draft.thumbs_down {
        event.thumbs_down = Some(true);
    }
    if let Some(occurred_at) = &draft.occurred_at {
        if !matches(&rules.occurred_at, occurred_at) {
            return None;
        }
        event.occurred_at = Some(occurred_at.clone());
    }
    let carries_signal = event.answer.is_some()
        || event.follow_up.is_some()
        || event.cited_chunk_ids.is_some()
        || event.thumbs_down == Some(true)
        || event.handoff_reason.is_some();
    carries_signal.then_some(event)
}

pub(crate) fn parsed_wire_answer_event(value: &Value) -> Option<AnswerEventInput> {
    let record = value.as_object()?;
    let text = |name: &str| record.get(name).and_then(Value::as_str).map(str::to_owned);
    let draft = AnswerEventDraft {
        question_id: text("question_id")?,
        answer: text("answer"),
        follow_up: text("follow_up"),
        cited_chunk_ids: record
            .get("cited_chunk_ids")
            .and_then(Value::as_array)
            .map(|ids| {
                ids.iter()
                    .filter_map(Value::as_str)
                    .map(str::to_owned)
                    .collect()
            }),
        thumbs_down: record.get("thumbs_down") == Some(&Value::Bool(true)),
        handoff_reason: text("handoff_reason"),
        occurred_at: text("occurred_at"),
    };
    wire_answer_event(&draft)
}
