use std::time::Duration;

pub(crate) const FIRST_BACKOFF: Duration = Duration::from_secs(1);
pub(crate) const LONGEST_BACKOFF: Duration = Duration::from_secs(30);
pub(crate) const LONGEST_RETRY_AFTER_SECONDS: u64 = 120;

pub(crate) fn jitter_fraction() -> f64 {
    fastrand::f64()
}

pub(crate) fn backoff(attempt: u32, retry_after_seconds: Option<u64>) -> Option<Duration> {
    if let Some(seconds) = retry_after_seconds {
        if seconds > LONGEST_RETRY_AFTER_SECONDS {
            return None;
        }
        return Some(Duration::from_secs(seconds) + FIRST_BACKOFF.mul_f64(jitter_fraction()));
    }
    let doubled = FIRST_BACKOFF.saturating_mul(2_u32.saturating_pow(attempt.saturating_sub(1)));
    let ceiling = doubled.min(LONGEST_BACKOFF);
    Some(ceiling / 2 + (ceiling / 2).mul_f64(jitter_fraction()))
}
