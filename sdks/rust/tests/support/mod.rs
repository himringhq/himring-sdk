pub mod answers;
pub mod contract;
pub mod downloads;
pub mod records;
pub mod stand_in;
pub mod uploads;

use himring::{Himring, HimringApiError};

pub use contract::{API_KEY, ContractApi, RecordedRequest};
pub use stand_in::{RawReply, StandInServer};

pub const PROJECT_ID: &str = "prj_11111111111111111111111111111111";
pub const KNOWLEDGE_BASE_ID: &str = "kb_22222222222222222222222222222222";

pub fn client_for(base_url: &str) -> Himring {
    Himring::builder()
        .api_key(API_KEY)
        .base_url(base_url)
        .build()
        .expect("the test client builds")
}

pub fn identifier(prefix: &str) -> String {
    format!("{prefix}_{}", uuid_hex())
}

fn uuid_hex() -> String {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    let counter = NEXT.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    format!(
        "{:032x}",
        nanos
            .wrapping_mul(1_000_003)
            .wrapping_add(u128::from(counter))
    )
}

static NEXT: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(1);

pub fn refusal<T: std::fmt::Debug>(result: Result<T, HimringApiError>) -> HimringApiError {
    match result {
        Ok(value) => panic!("the call succeeded with {value:?} where a refusal was due"),
        Err(error) => error,
    }
}
