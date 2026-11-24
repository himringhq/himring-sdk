use std::future::Future;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::Duration;

use tokio::time::{Instant, sleep_until};

pub(crate) struct IdleClock {
    started: Instant,
    last_progress_micros: AtomicU64,
}

pub(crate) struct IdleTimedOut;

impl IdleClock {
    pub fn new() -> Self {
        Self {
            started: Instant::now(),
            last_progress_micros: AtomicU64::new(0),
        }
    }

    pub fn touch(&self) {
        let elapsed = u64::try_from(self.started.elapsed().as_micros()).unwrap_or(u64::MAX);
        self.last_progress_micros
            .fetch_max(elapsed, Ordering::Relaxed);
    }

    fn last_progress(&self) -> Instant {
        self.started + Duration::from_micros(self.last_progress_micros.load(Ordering::Relaxed))
    }

    pub async fn bounded<F: Future>(
        &self,
        idle: Duration,
        work: F,
    ) -> Result<F::Output, IdleTimedOut> {
        tokio::pin!(work);
        loop {
            let deadline = self.last_progress() + idle;
            tokio::select! {
                output = &mut work => return Ok(output),
                () = sleep_until(deadline) => {
                    if self.last_progress() + idle <= Instant::now() {
                        return Err(IdleTimedOut);
                    }
                }
            }
        }
    }
}
