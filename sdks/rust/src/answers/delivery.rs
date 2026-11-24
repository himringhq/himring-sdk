use std::future::IntoFuture;
use std::time::Duration;

use tokio::sync::watch;
use tokio::time::{Instant, sleep, sleep_until};

use crate::answers::event_rules::{ANSWER_EVENTS_PER_REQUEST, AnswerEventInput};
use crate::client::Himring;
use crate::errors::{HimringApiError, HimringApiErrorKind, describe_error};
use crate::types::{
    RecordAnswerEventsInput, RecordAnswerEventsInputOrigin,
    RecordAnswerEventsOutputResultsItemOutcome,
};

pub const DEFAULT_ANSWER_DELIVERY_ATTEMPTS: u32 = 6;
const HTTP_PAYLOAD_TOO_LARGE: u16 = 413;
const HTTP_TOO_MANY_REQUESTS: u16 = 429;
const HTTP_SERVER_ERROR_MINIMUM: u16 = 500;
const RETRY_AFTER_CEILING: Duration = Duration::from_secs(60);
const BACKOFF_FIRST: Duration = Duration::from_millis(500);
const BACKOFF_CEILING: Duration = Duration::from_secs(30);

#[derive(Clone, Debug)]
pub(crate) struct PendingAnswerEvent {
    pub id: String,
    pub event: AnswerEventInput,
    pub bytes: usize,
}

pub(crate) struct DeliveryTarget<'a> {
    pub client: &'a Himring,
    pub project_id: &'a str,
    pub knowledge_base_id: &'a str,
}

pub(crate) struct DeliveryPolicy<'a> {
    pub maximum_attempts: u32,
    pub deadline: &'a (dyn Fn() -> Instant + Send + Sync),
    pub wake: watch::Receiver<bool>,
}

pub(crate) enum DeliveryOutcome {
    Delivered { unknown_question_ids: Vec<String> },
    TooLarge { bytes: usize },
    Refused { reason: String },
    GaveUp { reason: String },
    DeadlinePassed,
}

pub(crate) fn encoded_size(event: &AnswerEventInput) -> usize {
    serde_json::to_vec(event).map_or(usize::MAX, |bytes| bytes.len())
}

pub(crate) fn next_batch(
    pending: &[PendingAnswerEvent],
    byte_budget: usize,
) -> Vec<PendingAnswerEvent> {
    let mut batch = Vec::new();
    let mut bytes = 0_usize;
    for item in pending {
        if batch.len() >= ANSWER_EVENTS_PER_REQUEST {
            break;
        }
        if !batch.is_empty() && bytes.saturating_add(item.bytes) > byte_budget {
            break;
        }
        bytes = bytes.saturating_add(item.bytes);
        batch.push(item.clone());
    }
    batch
}

fn is_retryable(error: &HimringApiError) -> bool {
    match error.kind() {
        HimringApiErrorKind::Network | HimringApiErrorKind::Timeout => true,
        _ => error.status().is_some_and(|status| {
            status == HTTP_TOO_MANY_REQUESTS || status >= HTTP_SERVER_ERROR_MINIMUM
        }),
    }
}

fn retry_delay(error: &HimringApiError, attempt: u32) -> Duration {
    if let Some(seconds) = error.retry_after_seconds() {
        return Duration::from_secs(seconds).min(RETRY_AFTER_CEILING);
    }
    let ceiling = BACKOFF_FIRST
        .saturating_mul(2_u32.saturating_pow(attempt))
        .min(BACKOFF_CEILING);
    ceiling.mul_f64(fastrand::f64())
}

async fn woken(wake: &mut watch::Receiver<bool>) {
    if wake.wait_for(|closing| *closing).await.is_err() {
        std::future::pending::<()>().await;
    }
}

async fn paused(delay: Duration, wake: &mut watch::Receiver<bool>) {
    tokio::select! {
        () = sleep(delay) => {}
        () = woken(wake) => {}
    }
}

pub(crate) async fn deliver_batch(
    target: &DeliveryTarget<'_>,
    batch: &[PendingAnswerEvent],
    policy: DeliveryPolicy<'_>,
) -> DeliveryOutcome {
    let DeliveryPolicy {
        maximum_attempts,
        deadline,
        mut wake,
    } = policy;
    let mut attempt = 0;
    loop {
        if Instant::now() >= deadline() {
            return DeliveryOutcome::DeadlinePassed;
        }
        let input = RecordAnswerEventsInput::new(
            target.project_id,
            target.knowledge_base_id,
            batch.iter().map(|item| item.event.clone()).collect(),
        )
        .origin(RecordAnswerEventsInputOrigin::Sdk);
        let call = target.client.record_answer_events(input).into_future();
        tokio::pin!(call);
        let answered = loop {
            let closing_now = *wake.borrow();
            tokio::select! {
                answered = &mut call => break Some(answered),
                () = sleep_until(deadline()) => break None,
                () = woken(&mut wake), if !closing_now => {}
            }
        };
        let error = match answered {
            None => return DeliveryOutcome::DeadlinePassed,
            Some(Ok(reply)) => {
                let unknown_question_ids = reply
                    .results
                    .into_iter()
                    .filter(|result| {
                        result.outcome
                            == RecordAnswerEventsOutputResultsItemOutcome::QuestionNotFound
                    })
                    .map(|result| result.question_id)
                    .collect();
                return DeliveryOutcome::Delivered {
                    unknown_question_ids,
                };
            }
            Some(Err(error)) => error,
        };
        if error.status() == Some(HTTP_PAYLOAD_TOO_LARGE) {
            return DeliveryOutcome::TooLarge {
                bytes: batch.iter().map(|item| item.bytes).sum(),
            };
        }
        attempt += 1;
        if !is_retryable(&error) {
            return DeliveryOutcome::Refused {
                reason: describe_error(&error),
            };
        }
        if attempt >= maximum_attempts {
            return DeliveryOutcome::GaveUp {
                reason: describe_error(&error),
            };
        }
        let delay = retry_delay(&error, attempt);
        if Instant::now() + delay > deadline() {
            return DeliveryOutcome::DeadlinePassed;
        }
        paused(delay, &mut wake).await;
    }
}
