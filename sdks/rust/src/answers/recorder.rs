use std::fmt;
use std::sync::{Arc, Mutex, MutexGuard};
use std::time::Duration;

use serde_json::{Value, json};
use tokio::sync::watch;
use tokio::time::Instant;

use crate::answers::conversation::{AnswerConversation, AnswerConversationIdentity};
use crate::answers::delivery::{
    DeliveryOutcome, DeliveryPolicy, DeliveryTarget, PendingAnswerEvent, deliver_batch,
    encoded_size, next_batch,
};
use crate::answers::event_rules::{ANSWER_EVENTS_PER_REQUEST, AnswerEventDraft, wire_answer_event};
use crate::answers::recorder_options::{
    ANSWER_RECOVERY_INTERVAL, AnswerRecorderLogger, AnswerRecorderOptions, SpoolDirectory,
    StandardErrorLogger,
};
use crate::answers::recorder_timers::spawn_timers;
use crate::answers::spool::{AnswerSpool, SpoolWarning, Warnings};
use crate::answers::spool_files::{SpooledAnswerEvent, default_spool_directory};
use crate::client::Himring;
use crate::errors::{HimringApiError, invalid_input};

const DROP_WARNING_INTERVAL: Duration = Duration::from_secs(10);
const BACKGROUND_DELIVERY_WINDOW: Duration = Duration::from_secs(10 * 60);

#[derive(Default)]
pub(super) struct RecorderState {
    pub(super) pending: Vec<PendingAnswerEvent>,
    pub(super) spool: Option<AnswerSpool>,
    byte_budget: Option<usize>,
    last_recovery_at: Option<Instant>,
    dropped_count: u64,
    last_drop_warning_at: Option<Instant>,
    pub(super) closed: bool,
    background_queued: bool,
    close_deadline: Option<Instant>,
}

pub(crate) struct RecorderShared {
    pub client: Himring,
    pub project_id: String,
    pub knowledge_base_id: String,
    logger: Arc<dyn AnswerRecorderLogger>,
    maximum_buffered: usize,
    maximum_attempts: u32,
    close_timeout: Duration,
    state: Mutex<RecorderState>,
    drain_lock: tokio::sync::Mutex<()>,
    closing: watch::Sender<bool>,
}

#[derive(Clone)]
pub struct AnswerRecorder {
    shared: Arc<RecorderShared>,
}

impl fmt::Debug for AnswerRecorder {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("AnswerRecorder")
            .field("project_id", &self.shared.project_id)
            .field("knowledge_base_id", &self.shared.knowledge_base_id)
            .finish_non_exhaustive()
    }
}

impl RecorderShared {
    pub(super) fn state(&self) -> MutexGuard<'_, RecorderState> {
        self.state
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner)
    }

    fn warn(&self, message: &str, details: &Value) {
        let logger = &self.logger;
        let _ = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            logger.warn(message, details);
        }));
    }

    pub(super) fn emit(&self, warnings: Warnings) {
        for warning in warnings {
            self.warn(&warning.message, &warning.details);
        }
    }

    pub(crate) fn record(self: &Arc<Self>, drafts: &[AnswerEventDraft]) {
        let mut warnings = Warnings::new();
        let should_flush = {
            let mut state = self.state();
            if state.closed {
                return;
            }
            let items: Vec<SpooledAnswerEvent> = drafts
                .iter()
                .filter_map(wire_answer_event)
                .map(|event| SpooledAnswerEvent {
                    id: uuid::Uuid::new_v4().to_string(),
                    event,
                })
                .collect();
            if let Some(spool) = &mut state.spool {
                spool.append(&items, &mut warnings);
            }
            self.enqueue(&mut state, items, &mut warnings);
            state.pending.len() >= ANSWER_EVENTS_PER_REQUEST
        };
        self.emit(warnings);
        if should_flush {
            self.flush_in_background();
        }
    }

    fn enqueue(
        &self,
        state: &mut RecorderState,
        items: Vec<SpooledAnswerEvent>,
        warnings: &mut Warnings,
    ) {
        for item in items {
            let bytes = encoded_size(&item.event);
            state.pending.push(PendingAnswerEvent {
                id: item.id,
                event: item.event,
                bytes,
            });
        }
        let excess = state.pending.len().saturating_sub(self.maximum_buffered);
        if excess == 0 {
            return;
        }
        let dropped: Vec<String> = state.pending.drain(..excess).map(|item| item.id).collect();
        if let Some(spool) = &mut state.spool {
            spool.mark_done(&dropped, warnings);
        }
        state.dropped_count += dropped.len() as u64;
        let now = Instant::now();
        if state
            .last_drop_warning_at
            .is_none_or(|last| now.duration_since(last) >= DROP_WARNING_INTERVAL)
        {
            state.last_drop_warning_at = Some(now);
            warnings.push(SpoolWarning {
                message: "The answer buffer is full, so the oldest events were dropped".to_owned(),
                details: json!({
                    "dropped_event_count": state.dropped_count,
                    "maximum_buffered_events": self.maximum_buffered,
                }),
            });
        }
    }

    pub(super) fn recovery_is_due(state: &RecorderState) -> bool {
        state.spool.is_some()
            && state
                .last_recovery_at
                .is_none_or(|last| last.elapsed() >= ANSWER_RECOVERY_INTERVAL)
    }

    fn recover(&self) {
        let mut warnings = Warnings::new();
        {
            let mut state = self.state();
            if !Self::recovery_is_due(&state) {
                return;
            }
            state.last_recovery_at = Some(Instant::now());
            let recovered = match &mut state.spool {
                Some(spool) => spool.recover_orphans(&mut warnings),
                None => Vec::new(),
            };
            self.enqueue(&mut state, recovered, &mut warnings);
        }
        self.emit(warnings);
    }

    pub(crate) async fn flush(self: &Arc<Self>) {
        self.drained(Instant::now() + self.close_timeout).await;
    }

    pub(super) fn flush_in_background(self: &Arc<Self>) {
        {
            let mut state = self.state();
            if state.background_queued {
                return;
            }
            state.background_queued = true;
        }
        let Ok(runtime) = tokio::runtime::Handle::try_current() else {
            self.state().background_queued = false;
            return;
        };
        let shared = Arc::clone(self);
        runtime.spawn(async move {
            let _guard = shared.drain_lock.lock().await;
            shared.state().background_queued = false;
            shared
                .drain(Instant::now() + BACKGROUND_DELIVERY_WINDOW)
                .await;
        });
    }

    async fn drained(&self, deadline: Instant) {
        let _guard = self.drain_lock.lock().await;
        self.drain(deadline).await;
    }

    fn deadline_with_close(&self, deadline: Instant) -> Instant {
        self.state()
            .close_deadline
            .map_or(deadline, |close| close.min(deadline))
    }

    async fn drain(&self, deadline: Instant) {
        self.recover();
        let target = DeliveryTarget {
            client: &self.client,
            project_id: &self.project_id,
            knowledge_base_id: &self.knowledge_base_id,
        };
        let current_deadline = || self.deadline_with_close(deadline);
        loop {
            let (batch, budget) = {
                let state = self.state();
                if state.pending.is_empty() {
                    break;
                }
                (
                    next_batch(&state.pending, state.byte_budget.unwrap_or(usize::MAX)),
                    state.byte_budget,
                )
            };
            let policy = DeliveryPolicy {
                maximum_attempts: self.maximum_attempts,
                deadline: &current_deadline,
                wake: self.closing.subscribe(),
            };
            let outcome = deliver_batch(&target, &batch, policy).await;
            match outcome {
                DeliveryOutcome::DeadlinePassed => return,
                DeliveryOutcome::TooLarge { bytes } if batch.len() > 1 => {
                    let halved = (bytes / 2).max(1);
                    self.state().byte_budget =
                        Some(budget.map_or(halved, |known| known.min(halved)));
                }
                other => self.settle_batch(&batch, other),
            }
        }
        let mut warnings = Warnings::new();
        {
            let mut state = self.state();
            let RecorderState { pending, spool, .. } = &mut *state;
            if let Some(spool) = spool {
                spool.settle(pending, &mut warnings);
            }
        }
        self.emit(warnings);
    }

    fn settle_batch(&self, batch: &[PendingAnswerEvent], outcome: DeliveryOutcome) {
        let ids: Vec<String> = batch.iter().map(|item| item.id.clone()).collect();
        let mut warnings = Warnings::new();
        {
            let mut state = self.state();
            state.pending.retain(|item| !ids.contains(&item.id));
            if let Some(spool) = &mut state.spool {
                spool.mark_done(&ids, &mut warnings);
            }
        }
        self.emit(warnings);
        let reason = match outcome {
            DeliveryOutcome::Delivered {
                unknown_question_ids,
            } => {
                if !unknown_question_ids.is_empty() {
                    self.warn(
                        "Himring did not recognize some question IDs, so it ignored their events",
                        &json!({ "question_ids": unknown_question_ids }),
                    );
                }
                return;
            }
            DeliveryOutcome::DeadlinePassed => return,
            DeliveryOutcome::TooLarge { bytes } => format!("the event holds {bytes} bytes"),
            DeliveryOutcome::Refused { reason } | DeliveryOutcome::GaveUp { reason } => reason,
        };
        self.warn(
            "Himring did not accept a batch of answer events, so the batch was dropped",
            &json!({ "event_count": batch.len(), "reason": reason }),
        );
    }
}

impl AnswerRecorder {
    pub fn new(options: AnswerRecorderOptions) -> Result<Self, HimringApiError> {
        if tokio::runtime::Handle::try_current().is_err() {
            return Err(invalid_input(
                "Create the answer recorder inside a Tokio runtime.",
                None,
            ));
        }
        let logger = options
            .logger
            .unwrap_or_else(|| Arc::new(StandardErrorLogger));
        let (closing, _) = watch::channel(false);
        let shared = Arc::new(RecorderShared {
            client: options.client,
            project_id: options.project_id,
            knowledge_base_id: options.knowledge_base_id,
            logger,
            maximum_buffered: options.maximum_buffered_events.max(1),
            maximum_attempts: options.maximum_attempts.max(1),
            close_timeout: options.close_timeout,
            state: Mutex::new(RecorderState::default()),
            drain_lock: tokio::sync::Mutex::new(()),
            closing,
        });
        let directory = match options.spool_directory {
            SpoolDirectory::Disabled => None,
            SpoolDirectory::Default => Some(default_spool_directory()),
            SpoolDirectory::At(path) => Some(path),
        };
        if let Some(directory) = directory {
            let destination = serde_json::to_string(&[
                shared.client.base_url(),
                shared.project_id.as_str(),
                shared.knowledge_base_id.as_str(),
            ])
            .unwrap_or_default();
            let mut warnings = Warnings::new();
            let spool = AnswerSpool::open(&directory, destination, &mut warnings);
            shared.state().spool = spool;
            shared.emit(warnings);
        }
        spawn_timers(
            &shared,
            options.flush_interval.max(Duration::from_millis(1)),
        );
        shared.flush_in_background();
        Ok(Self { shared })
    }

    pub fn dropped_event_count(&self) -> u64 {
        self.shared.state().dropped_count
    }

    pub fn buffered_event_count(&self) -> usize {
        self.shared.state().pending.len()
    }

    pub fn conversation(&self, identity: AnswerConversationIdentity) -> AnswerConversation {
        AnswerConversation::new(Arc::clone(&self.shared), identity)
    }

    pub fn record(&self, drafts: &[AnswerEventDraft]) {
        self.shared.record(drafts);
    }

    pub async fn flush(&self) {
        self.shared.flush().await;
    }

    pub async fn close(&self) {
        let deadline = {
            let mut state = self.shared.state();
            if state.closed {
                None
            } else {
                state.closed = true;
                let deadline = Instant::now() + self.shared.close_timeout;
                state.close_deadline = Some(deadline);
                Some(deadline)
            }
        };
        let Some(deadline) = deadline else {
            let _guard = self.shared.drain_lock.lock().await;
            return;
        };
        self.shared.closing.send_replace(true);
        self.shared.drained(deadline).await;
        let mut state = self.shared.state();
        let RecorderState { pending, spool, .. } = &mut *state;
        if let Some(spool) = spool {
            spool.close(true, pending);
        }
    }
}
