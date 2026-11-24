use std::collections::HashSet;
use std::sync::Arc;

use time::OffsetDateTime;
use time::format_description::well_known::Rfc3339;

use crate::answers::event_rules::{ANSWER_TEXT_KEPT_MAXIMUM, AnswerEventDraft, bounded_long_text};
use crate::answers::recorder::RecorderShared;
use crate::errors::HimringApiError;
use crate::types::{SearchKnowledgeBaseInput, SearchKnowledgeBaseOutput};

pub const QUESTIONS_PER_TURN_MAXIMUM: usize = 50;

#[derive(Clone, Debug, Default, PartialEq, Eq)]
#[non_exhaustive]
pub struct AnswerConversationIdentity {
    pub end_user_id: Option<String>,
    pub call_id: Option<String>,
}

impl AnswerConversationIdentity {
    pub fn new() -> Self {
        Self::default()
    }

    #[must_use]
    pub fn end_user_id(mut self, end_user_id: impl Into<String>) -> Self {
        self.end_user_id = Some(end_user_id.into());
        self
    }

    #[must_use]
    pub fn call_id(mut self, call_id: impl Into<String>) -> Self {
        self.call_id = Some(call_id.into());
        self
    }
}

#[derive(Clone, Default)]
struct Turn {
    questions: Vec<(String, HashSet<String>)>,
    answer: String,
}

pub struct AnswerConversation {
    recorder: Arc<RecorderShared>,
    identity: AnswerConversationIdentity,
    current: Turn,
    answered: Option<Turn>,
}

fn now_text() -> String {
    let now = OffsetDateTime::now_utc();
    let truncated = now.replace_millisecond(now.millisecond()).unwrap_or(now);
    truncated.format(&Rfc3339).unwrap_or_default()
}

fn within_text_limit(text: &str) -> String {
    let mut units = 0;
    text.chars()
        .take_while(|character| {
            units += character.len_utf16();
            units <= ANSWER_TEXT_KEPT_MAXIMUM
        })
        .collect()
}

impl AnswerConversation {
    pub(crate) fn new(recorder: Arc<RecorderShared>, identity: AnswerConversationIdentity) -> Self {
        Self {
            recorder,
            identity,
            current: Turn::default(),
            answered: None,
        }
    }

    pub fn search_input(&self, question: impl Into<String>) -> SearchKnowledgeBaseInput {
        SearchKnowledgeBaseInput::new(
            self.recorder.project_id.clone(),
            self.recorder.knowledge_base_id.clone(),
            question,
        )
    }

    pub async fn search(
        &mut self,
        input: SearchKnowledgeBaseInput,
    ) -> Result<SearchKnowledgeBaseOutput, HimringApiError> {
        let mut input = input;
        input.project_id.clone_from(&self.recorder.project_id);
        input
            .knowledge_base_id
            .clone_from(&self.recorder.knowledge_base_id);
        if let Some(end_user_id) = &self.identity.end_user_id {
            input.end_user_id = Some(end_user_id.clone());
        }
        if let Some(call_id) = &self.identity.call_id {
            input.call_id = Some(call_id.clone());
        }
        let result = self.recorder.client.search_knowledge_base(input).await?;
        self.remember_search(&result);
        Ok(result)
    }

    pub fn remember_search(&mut self, result: &SearchKnowledgeBaseOutput) {
        let chunk_ids = result
            .passages
            .iter()
            .map(|passage| passage.chunk_id.clone())
            .collect();
        self.remember_question(&result.question_id, chunk_ids);
    }

    pub fn remember_question(&mut self, question_id: &str, chunk_ids: HashSet<String>) {
        if !self.current.answer.is_empty() {
            self.start_turn();
        }
        if let Some(known) = self
            .current
            .questions
            .iter_mut()
            .find(|(id, _)| id == question_id)
        {
            known.1 = chunk_ids;
            return;
        }
        if self.current.questions.len() >= QUESTIONS_PER_TURN_MAXIMUM {
            return;
        }
        self.current
            .questions
            .push((question_id.to_owned(), chunk_ids));
    }

    pub fn record_answer(&mut self, text: &str, cited_chunk_ids: Option<&[String]>) {
        let Some(piece) = bounded_long_text(text, ANSWER_TEXT_KEPT_MAXIMUM) else {
            return;
        };
        if self.current.questions.is_empty() {
            return;
        }
        let joined = if self.current.answer.is_empty() {
            piece
        } else {
            format!("{}\n{piece}", self.current.answer)
        };
        self.current.answer = within_text_limit(&joined);
        let occurred_at = now_text();
        let cited: Option<HashSet<&String>> = cited_chunk_ids.map(|ids| ids.iter().collect());
        let drafts: Vec<AnswerEventDraft> = self
            .current
            .questions
            .iter()
            .map(|(question_id, returned)| {
                let mut draft = AnswerEventDraft::new(question_id.clone())
                    .answer(self.current.answer.clone())
                    .occurred_at(occurred_at.clone());
                if let Some(cited) = &cited {
                    draft.cited_chunk_ids = Some(
                        cited
                            .iter()
                            .filter(|id| returned.contains(**id))
                            .map(|id| (*id).clone())
                            .collect(),
                    );
                }
                draft
            })
            .collect();
        self.recorder.record(&drafts);
        self.answered = Some(self.current.clone());
    }

    pub fn record_user_message(&mut self, text: &str) {
        if self.current.answer.is_empty() {
            return;
        }
        let occurred_at = now_text();
        let drafts: Vec<AnswerEventDraft> = self
            .current
            .questions
            .iter()
            .map(|(question_id, _)| {
                AnswerEventDraft::new(question_id.clone())
                    .follow_up(text)
                    .occurred_at(occurred_at.clone())
            })
            .collect();
        self.recorder.record(&drafts);
        self.start_turn();
    }

    pub fn record_thumbs_down(&mut self, question_ids: Option<&[String]>) {
        let drafts: Vec<AnswerEventDraft> = self
            .targets(question_ids, false)
            .into_iter()
            .map(|question_id| AnswerEventDraft::new(question_id).thumbs_down())
            .collect();
        self.recorder.record(&drafts);
    }

    pub fn record_handoff(&mut self, reason: &str, question_ids: Option<&[String]>) {
        let drafts: Vec<AnswerEventDraft> = self
            .targets(question_ids, true)
            .into_iter()
            .map(|question_id| AnswerEventDraft::new(question_id).handoff_reason(reason))
            .collect();
        self.recorder.record(&drafts);
    }

    pub async fn end(&self) {
        self.recorder.flush().await;
    }

    fn targets(&self, question_ids: Option<&[String]>, include_unanswered: bool) -> Vec<String> {
        if let Some(ids) = question_ids {
            return ids.to_vec();
        }
        let current_counts = if include_unanswered {
            !self.current.questions.is_empty()
        } else {
            !self.current.answer.is_empty()
        };
        let turn = if current_counts {
            Some(&self.current)
        } else {
            self.answered.as_ref()
        };
        turn.map(|turn| turn.questions.iter().map(|(id, _)| id.clone()).collect())
            .unwrap_or_default()
    }

    fn start_turn(&mut self) {
        if !self.current.answer.is_empty() {
            self.answered = Some(std::mem::take(&mut self.current));
        }
        self.current = Turn::default();
    }
}
