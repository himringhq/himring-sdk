use std::collections::BTreeMap;

use himring::{AddFileInput, AddedFile, Himring, HimringApiError, UploadContent};
use serde_json::json;

use super::records::{FILE_PATH, UploadPlan, signed_part, signed_parts, upload_record};
use super::{ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, StandInServer};

pub const PART_BYTES: usize = 64 * 1024;
pub const MULTIPART_CONTENT_BYTES: usize = 5 * PART_BYTES + 10;
pub const PARTS_IN_FLIGHT_LIMIT: usize = 4;

pub fn add_file_input(content: impl Into<UploadContent>) -> AddFileInput {
    AddFileInput::new(PROJECT_ID, KNOWLEDGE_BASE_ID, FILE_PATH, content)
}

pub async fn add_file(
    himring: &Himring,
    content: impl Into<UploadContent>,
) -> Result<AddedFile, HimringApiError> {
    himring.add_file(add_file_input(content)).await
}

pub async fn script_multipart(contract: &ContractApi, storage: &StandInServer, content: &[u8]) {
    let open = upload_record(content, &UploadPlan::multipart("open", PART_BYTES));
    contract
        .stub("create_upload", 201, json!({ "upload": open, "parts": [] }))
        .await;
    contract
        .stub(
            "sign_upload_parts",
            200,
            signed_parts(&storage.base_url, content, PART_BYTES),
        )
        .await;
    let completed = upload_record(content, &UploadPlan::multipart("completed", PART_BYTES));
    contract
        .stub("complete_upload", 200, completed.clone())
        .await;
    contract.stub("get_upload", 200, completed).await;
    contract
        .stub(
            "cancel_upload",
            200,
            upload_record(content, &UploadPlan::multipart("failed", PART_BYTES)),
        )
        .await;
}

pub async fn script_single(contract: &ContractApi, url: &str, content: &[u8]) {
    let part = signed_part(url, 1, content.len());
    let created = json!({ "upload": upload_record(content, &UploadPlan::single("open")), "parts": [part.clone()] });
    contract.stub("create_upload", 201, created).await;
    contract
        .stub("sign_upload_parts", 200, json!({ "parts": [part] }))
        .await;
    contract
        .stub(
            "complete_upload",
            200,
            upload_record(content, &UploadPlan::single("completed")),
        )
        .await;
    contract
        .stub(
            "cancel_upload",
            200,
            upload_record(content, &UploadPlan::single("failed")),
        )
        .await;
}

pub async fn signed_digests(contract: &ContractApi) -> BTreeMap<u64, Vec<String>> {
    let mut digests: BTreeMap<u64, Vec<String>> = BTreeMap::new();
    for request in contract.requests_for("sign_upload_parts").await {
        for part in request.body["parts"]
            .as_array()
            .cloned()
            .unwrap_or_default()
        {
            let number = part["part_number"]
                .as_u64()
                .expect("each signed part has a whole number");
            let digest = part["sha256"]
                .as_str()
                .expect("each signed part has a digest")
                .to_owned();
            digests.entry(number).or_default().push(digest);
        }
    }
    digests
}

pub async fn signed_part_numbers(contract: &ContractApi) -> Vec<u64> {
    let mut numbers: Vec<u64> = Vec::new();
    for (number, digests) in signed_digests(contract).await {
        numbers.extend(std::iter::repeat_n(number, digests.len()));
    }
    numbers
}

pub fn put_paths(storage: &StandInServer) -> Vec<String> {
    storage
        .arrived(Some("PUT"))
        .into_iter()
        .map(|put| put.path)
        .collect()
}
