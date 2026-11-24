#[allow(dead_code, unused_imports)]
mod support;

use std::time::{Duration, Instant};

use himring::HimringApiErrorKind;
use serde_json::{Value, json};
use support::records::{UploadPlan, random_bytes, signed_part, upload_record};
use support::uploads::{add_file, put_paths, script_single};
use support::{ContractApi, RawReply, StandInServer, client_for, refusal};

const CONTENT: &[u8] = b"customer refund policy";
const LONGEST_HONORED_RETRY_AFTER_SECONDS: u64 = 120;
const STALLED_STORAGE: Duration = Duration::from_secs(3);
const ABANDON_AFTER: Duration = Duration::from_millis(300);
const CANCEL_SETTLES: Duration = Duration::from_millis(500);

fn part_url(storage: &StandInServer) -> String {
    format!("{}/parts/1", storage.base_url)
}

async fn prepared(content: &[u8]) -> (ContractApi, StandInServer) {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    script_single(&contract, &part_url(&storage), content).await;
    (contract, storage)
}

fn failed(content: &[u8], code: &'static str) -> Value {
    upload_record(
        content,
        &UploadPlan {
            state: "failed",
            part_bytes: None,
            part_count: None,
            failure_code: Some(code),
        },
    )
}

#[tokio::test]
async fn refuses_an_upload_for_different_content_before_sending_bytes() {
    let (contract, storage) = prepared(CONTENT).await;
    let foreign = upload_record(&vec![b'x'; CONTENT.len()], &UploadPlan::single("open"));
    let parts = json!([signed_part(&part_url(&storage), 1, CONTENT.len())]);
    contract
        .stub(
            "create_upload",
            201,
            json!({ "upload": foreign, "parts": parts }),
        )
        .await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse);
    assert!(storage.arrived(None).is_empty());
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    assert!(contract.requests_for("complete_upload").await.is_empty());
}

#[tokio::test]
async fn refuses_a_signed_part_with_a_different_size_before_sending_bytes() {
    let (contract, storage) = prepared(CONTENT).await;
    let parts = json!([signed_part(&part_url(&storage), 1, CONTENT.len() - 1)]);
    let open = upload_record(CONTENT, &UploadPlan::single("open"));
    contract
        .stub(
            "create_upload",
            201,
            json!({ "upload": open, "parts": parts }),
        )
        .await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse);
    assert!(storage.arrived(None).is_empty());
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    assert!(contract.requests_for("complete_upload").await.is_empty());
}

#[tokio::test]
async fn rejects_a_completion_receipt_for_different_content() {
    let (contract, storage) = prepared(CONTENT).await;
    let foreign = upload_record(&vec![b'x'; CONTENT.len()], &UploadPlan::single("completed"));
    contract.stub("complete_upload", 200, foreign).await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse);
    let bodies: Vec<Vec<u8>> = storage
        .arrived(Some("PUT"))
        .into_iter()
        .map(|put| put.body)
        .collect();
    assert_eq!(bodies, vec![CONTENT.to_vec()]);
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
}

#[tokio::test]
async fn refuses_a_file_that_the_api_says_it_already_holds_under_other_content() {
    let (contract, storage) = prepared(CONTENT).await;
    let mut other = upload_record(b"other content", &UploadPlan::single("completed"));
    other["outcome"] = json!("unchanged");
    contract
        .stub(
            "create_upload",
            201,
            json!({ "upload": other, "parts": [] }),
        )
        .await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse);
    assert!(storage.arrived(None).is_empty());
}

#[tokio::test]
async fn refuses_an_upload_plan_without_its_parts_before_it_sends_a_byte() {
    let stand_in = StandInServer::start().await;
    let path = format!(
        "/v1/projects/{}/knowledge-bases/{}/uploads",
        support::PROJECT_ID,
        support::KNOWLEDGE_BASE_ID
    );
    let plan = json!({ "upload": upload_record(CONTENT, &UploadPlan::single("open")) });
    stand_in.answer(
        "POST",
        &path,
        vec![RawReply::with_body(201, plan.to_string())],
    );

    let error = refusal(add_file(&client_for(&stand_in.base_url), CONTENT).await);

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::InvalidResponse, Some(201))
    );
    let paths: Vec<String> = stand_in
        .arrived(None)
        .into_iter()
        .map(|request| request.path)
        .collect();
    assert_eq!(paths, vec![path]);
}

#[tokio::test]
async fn reports_a_checksum_mismatch_as_a_refusal_and_never_as_an_added_file() {
    let (contract, _storage) = prepared(CONTENT).await;
    contract
        .stub(
            "complete_upload",
            200,
            failed(CONTENT, "upload_checksum_mismatch"),
        )
        .await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(
        (error.kind(), error.code()),
        (
            HimringApiErrorKind::Refused,
            Some("upload_checksum_mismatch")
        )
    );
}

#[tokio::test]
async fn keeps_checking_an_upload_until_himring_settles_it_and_reports_the_final_failure() {
    let (contract, _storage) = prepared(CONTENT).await;
    contract
        .stub(
            "complete_upload",
            200,
            upload_record(CONTENT, &UploadPlan::single("checking")),
        )
        .await;
    contract
        .stub("get_upload", 200, failed(CONTENT, "upload_size_mismatch"))
        .await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.code(), Some("upload_size_mismatch"));
}

#[tokio::test]
async fn reports_an_upload_that_expired_while_storage_refused_the_part() {
    let (contract, storage) = prepared(CONTENT).await;
    storage.answer("PUT", "/parts/1", vec![RawReply::status(403)]);
    let expired = json!({ "error": { "code": "upload_expired", "message": "The upload expired. Start it again." } });
    contract.stub("sign_upload_parts", 409, expired).await;

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(
        (error.kind(), error.code()),
        (HimringApiErrorKind::Refused, Some("upload_expired"))
    );
    assert!(contract.requests_for("complete_upload").await.is_empty());
}

#[tokio::test]
async fn waits_the_retry_after_seconds_and_then_stores_the_whole_file() {
    for status in [429, 503] {
        let content = random_bytes(3_000);
        let (contract, storage) = prepared(&content).await;
        storage.answer(
            "PUT",
            "/parts/1",
            vec![
                RawReply::status(status).header("retry-after", "1"),
                RawReply::status(200),
            ],
        );
        let started = Instant::now();

        add_file(&client_for(&contract.base_url), content.clone())
            .await
            .expect("the file is added");

        assert!(
            started.elapsed() >= Duration::from_secs(1),
            "{status}: {:?}",
            started.elapsed()
        );
        let bodies: Vec<Vec<u8>> = storage
            .arrived(Some("PUT"))
            .into_iter()
            .map(|put| put.body)
            .collect();
        assert_eq!(bodies, vec![content.clone(), content]);
        assert_eq!(
            contract.operations_called().await,
            vec!["create_upload", "sign_upload_parts", "complete_upload"]
        );
    }
}

#[tokio::test]
async fn gives_up_at_once_when_storage_asks_for_a_wait_beyond_the_cap() {
    let (contract, storage) = prepared(CONTENT).await;
    let beyond = (LONGEST_HONORED_RETRY_AFTER_SECONDS + 1).to_string();
    storage.answer(
        "PUT",
        "/parts/1",
        vec![
            RawReply::status(503).header("retry-after", &beyond),
            RawReply::status(200),
        ],
    );
    let started = Instant::now();

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert!(
        started.elapsed() < Duration::from_secs(1),
        "{:?}",
        started.elapsed()
    );
    assert_eq!(error.status(), Some(503));
    assert_eq!(put_paths(&storage).len(), 1);
    assert!(contract.requests_for("complete_upload").await.is_empty());
}

#[tokio::test]
async fn stops_after_three_tries_of_storage_that_keeps_failing_and_cancels_the_upload() {
    let (contract, storage) = prepared(CONTENT).await;
    storage.answer("PUT", "/parts/1", vec![RawReply::status(500)]);

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.status(), Some(500));
    assert_eq!(put_paths(&storage).len(), 3);
    assert!(contract.requests_for("complete_upload").await.is_empty());
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
}

#[tokio::test]
async fn stops_at_once_on_a_storage_refusal_that_a_retry_cannot_fix() {
    let (contract, storage) = prepared(CONTENT).await;
    storage.answer("PUT", "/parts/1", vec![RawReply::status(400)]);

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.status(), Some(400));
    assert_eq!(put_paths(&storage).len(), 1);
}

#[tokio::test]
async fn never_follows_a_storage_redirect_while_it_sends_a_part() {
    let (contract, storage) = prepared(CONTENT).await;
    let collect = format!("{}/collect", storage.base_url);
    storage.answer(
        "PUT",
        "/parts/1",
        vec![RawReply::status(307).header("location", &collect)],
    );

    let error = refusal(add_file(&client_for(&contract.base_url), CONTENT).await);

    assert_eq!(error.kind(), HimringApiErrorKind::Refused);
    let paths: Vec<String> = storage
        .arrived(None)
        .into_iter()
        .map(|request| request.path)
        .collect();
    assert_eq!(paths, vec!["/parts/1".to_owned()]);
    assert!(contract.requests_for("complete_upload").await.is_empty());
}

#[tokio::test]
async fn a_dropped_upload_cancels_itself_and_never_completes() {
    let (contract, storage) = prepared(CONTENT).await;
    storage.answer(
        "PUT",
        "/parts/1",
        vec![RawReply::status(200).delayed(STALLED_STORAGE)],
    );
    let himring = client_for(&contract.base_url);

    let abandoned = tokio::time::timeout(ABANDON_AFTER, add_file(&himring, CONTENT)).await;
    tokio::time::sleep(CANCEL_SETTLES).await;

    assert!(
        abandoned.is_err(),
        "the upload finished before it was dropped"
    );
    assert_eq!(put_paths(&storage).len(), 1);
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    assert!(contract.requests_for("complete_upload").await.is_empty());
}
