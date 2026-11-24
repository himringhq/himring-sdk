use std::collections::BTreeMap;
use std::fmt::Write as _;

use serde_json::{Value, json};
use sha2::{Digest, Sha256};

use super::KNOWLEDGE_BASE_ID;

pub const UPLOAD_ID: &str = "upl_44444444444444444444444444444444";
pub const FILE_ID: &str = "fil_55555555555555555555555555555555";
pub const FILE_PATH: &str = "policies/refunds.pdf";
pub const CREATED_AT: &str = "2026-11-24T08:00:00.000Z";
pub const FAR_DEADLINE_AT: &str = "2099-01-01T00:00:00.000Z";

pub fn sha256_of(content: &[u8]) -> String {
    Sha256::digest(content)
        .iter()
        .fold(String::new(), |mut text, byte| {
            write!(text, "{byte:02x}").expect("writing to a String succeeds");
            text
        })
}

pub fn file_record(content: &[u8]) -> Value {
    json!({
        "id": FILE_ID,
        "knowledge_base_id": KNOWLEDGE_BASE_ID,
        "path": FILE_PATH,
        "kind": "pdf",
        "address": null,
        "status": "queued",
        "current_version": null,
        "latest_version": 1,
        "size_bytes": content.len(),
        "content_sha256": sha256_of(content),
        "failure": null,
        "unread_parts": [],
        "metadata": { "team": "support" },
        "created_at": CREATED_AT,
        "updated_at": CREATED_AT,
        "deleted_at": null,
        "purge_after": null,
    })
}

pub struct UploadPlan {
    pub state: &'static str,
    pub part_bytes: Option<usize>,
    pub part_count: Option<usize>,
    pub failure_code: Option<&'static str>,
}

impl UploadPlan {
    pub fn single(state: &'static str) -> Self {
        Self {
            state,
            part_bytes: None,
            part_count: None,
            failure_code: None,
        }
    }

    pub fn multipart(state: &'static str, part_bytes: usize) -> Self {
        Self {
            state,
            part_bytes: Some(part_bytes),
            part_count: None,
            failure_code: None,
        }
    }
}

pub fn upload_record(content: &[u8], plan: &UploadPlan) -> Value {
    let size = content.len();
    let method = if plan.part_bytes.is_none() {
        "single"
    } else {
        "multipart"
    };
    let part_bytes = plan.part_bytes.unwrap_or(size);
    let part_count = plan.part_count.unwrap_or_else(|| match plan.part_bytes {
        None => 1,
        Some(bytes) => size.div_ceil(bytes.max(1)),
    });
    let completed = plan.state == "completed";
    json!({
        "id": UPLOAD_ID,
        "knowledge_base_id": KNOWLEDGE_BASE_ID,
        "path": FILE_PATH,
        "address": null,
        "size_bytes": size,
        "content_sha256": sha256_of(content),
        "method": method,
        "part_bytes": part_bytes,
        "part_count": part_count,
        "state": plan.state,
        "outcome": if completed { json!("added") } else { Value::Null },
        "file": if completed { file_record(content) } else { Value::Null },
        "failure": plan.failure_code.map_or(Value::Null, |code| json!({ "code": code, "message": "The bytes did not match the SHA-256." })),
        "created_at": CREATED_AT,
        "deadline_at": FAR_DEADLINE_AT,
    })
}

pub fn signed_part(url: &str, part_number: usize, size_bytes: usize) -> Value {
    json!({
        "part_number": part_number,
        "size_bytes": size_bytes,
        "method": "PUT",
        "url": url,
        "headers": { "x-amz-checksum-sha256": format!("part-{part_number}") },
        "expires_at": FAR_DEADLINE_AT,
    })
}

pub fn part_slices(content: &[u8], part_bytes: usize) -> BTreeMap<String, Vec<u8>> {
    content
        .chunks(part_bytes)
        .enumerate()
        .map(|(index, slice)| (format!("/parts/{}", index + 1), slice.to_vec()))
        .collect()
}

pub fn signed_parts(storage_url: &str, content: &[u8], part_bytes: usize) -> Value {
    let parts: Vec<Value> = content
        .chunks(part_bytes)
        .enumerate()
        .map(|(index, slice)| {
            signed_part(
                &format!("{storage_url}/parts/{}", index + 1),
                index + 1,
                slice.len(),
            )
        })
        .collect();
    json!({ "parts": parts })
}

pub fn random_bytes(count: usize) -> Vec<u8> {
    let mut state: u64 = 0x9e37_79b9_7f4a_7c15 ^ count as u64;
    (0..count)
        .map(|_| {
            state ^= state << 13;
            state ^= state >> 7;
            state ^= state << 17;
            state.to_le_bytes()[0]
        })
        .collect()
}
