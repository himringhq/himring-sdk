use std::sync::{Arc, Weak};
use std::time::Duration;

use tokio::time::Instant;

use crate::answers::recorder::{RecorderShared, RecorderState};
use crate::answers::recorder_options::ANSWER_SPOOL_HEARTBEAT;
use crate::answers::spool::Warnings;

pub(super) fn spawn_timers(shared: &Arc<RecorderShared>, flush_interval: Duration) {
    let weak: Weak<RecorderShared> = Arc::downgrade(shared);
    tokio::spawn(async move {
        let mut flush = tokio::time::interval_at(Instant::now() + flush_interval, flush_interval);
        let mut heartbeat = tokio::time::interval_at(
            Instant::now() + ANSWER_SPOOL_HEARTBEAT,
            ANSWER_SPOOL_HEARTBEAT,
        );
        loop {
            let flushing = tokio::select! {
                _ = flush.tick() => true,
                _ = heartbeat.tick() => false,
            };
            let Some(shared) = weak.upgrade() else { return };
            if shared.state().closed {
                return;
            }
            if flushing {
                let due = {
                    let state = shared.state();
                    !state.pending.is_empty() || RecorderShared::recovery_is_due(&state)
                };
                if due {
                    shared.flush_in_background();
                }
                continue;
            }
            let mut warnings = Warnings::new();
            {
                let mut state = shared.state();
                let RecorderState { pending, spool, .. } = &mut *state;
                if let Some(spool) = spool {
                    spool.touch(pending, &mut warnings);
                }
            }
            shared.emit(warnings);
        }
    });
}
