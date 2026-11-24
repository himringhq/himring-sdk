use himring::DownloadFileInput;
use serde_json::{Value, json};

use super::records::FILE_ID;
use super::{ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, StandInServer};

pub const STORED_FILE_BYTES: usize = 5_000;
pub const ENTITY_TAG: &str = "\"v3-etag\"";
pub const INDEX_ID: &str = "ix_33333333333333333333333333333333";
pub const STORED_FILE_PATH: &str = "/files/refunds.pdf";

pub fn link_to(url: &str) -> Value {
    json!({
        "url": url,
        "expires_at": "2099-01-01T00:00:00.000Z",
        "file_name": "refunds.pdf",
        "content_type": "application/pdf",
        "disposition": "attachment",
        "size_bytes": STORED_FILE_BYTES,
        "entity_tag": ENTITY_TAG,
    })
}

pub fn download_input(version: u64) -> DownloadFileInput {
    DownloadFileInput::new(PROJECT_ID, KNOWLEDGE_BASE_ID, FILE_ID, version)
}

pub fn index_download_path() -> String {
    format!("/v1/projects/{PROJECT_ID}/indexes/{INDEX_ID}/download")
}

pub async fn linked(storage: &StandInServer) -> ContractApi {
    let contract = ContractApi::start().await;
    contract
        .stub(
            "get_download_link",
            200,
            link_to(&format!("{}{STORED_FILE_PATH}", storage.base_url)),
        )
        .await;
    contract
}
