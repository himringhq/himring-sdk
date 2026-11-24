use std::sync::Arc;

use tokio::time::Instant;

use crate::answers::recorder::RecorderShared;

impl RecorderShared {
    pub(super) async fn close(self: &Arc<Self>) {
        let mut finished = self.close_finished.subscribe();
        {
            let mut state = self.state();
            if !state.closed {
                state.closed = true;
                let deadline = Instant::now() + self.close_timeout;
                state.close_deadline = Some(deadline);
                self.closing.send_replace(true);
                let shared = Arc::clone(self);
                tokio::spawn(async move {
                    let _guard = shared.drain_lock.lock().await;
                    shared.drain(deadline).await;
                    {
                        let mut state = shared.state();
                        if let Some(mut spool) = state.spool.take() {
                            spool.close(true, &state.pending);
                        }
                    }
                    shared.close_finished.send_replace(true);
                });
            }
        }
        let _ = finished.wait_for(|closed| *closed).await;
    }
}
