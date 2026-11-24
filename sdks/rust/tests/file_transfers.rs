#[allow(dead_code, unused_imports)]
mod support;

use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use himring::types::GetUploadOutputOutcome;
use himring::{HimringApiErrorKind, ProgressError};
use serde_json::json;
use support::records::{
    FILE_ID, FILE_PATH, UploadPlan, part_slices, random_bytes, sha256_of, upload_record,
};
use support::uploads::{
    MULTIPART_CONTENT_BYTES, PART_BYTES, PARTS_IN_FLIGHT_LIMIT, add_file, add_file_input,
    put_paths, script_multipart, script_single, signed_digests, signed_part_numbers,
};
use support::{ContractApi, RawReply, StandInServer, client_for, refusal};

const STORAGE_PAUSE: Duration = Duration::from_millis(150);
const FIRST_TWO_POLLS: Duration = Duration::from_millis(600);

#[tokio::test]
async fn sends_a_single_file_to_storage_without_the_api_key() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(300_000);
    script_single(
        &contract,
        &format!("{}/parts/1", storage.base_url),
        &content,
    )
    .await;
    let himring = client_for(&contract.base_url);

    let added = add_file(&himring, content.clone())
        .await
        .expect("the file is added");

    assert_eq!(
        (added.outcome, added.file.id.as_str()),
        (GetUploadOutputOutcome::Added, FILE_ID)
    );
    let puts = storage.arrived(Some("PUT"));
    let [put] = puts.as_slice() else {
        panic!("one part arrived")
    };
    assert_eq!(put.body, content);
    assert!(!put.headers.contains_key("authorization"));
    assert_eq!(
        put.headers.get("x-amz-checksum-sha256").map(String::as_str),
        Some("part-1")
    );
    assert_eq!(
        put.headers.get("content-length"),
        Some(&content.len().to_string())
    );
    let creates = contract.requests_for("create_upload").await;
    assert_eq!(
        creates[0].body,
        json!({ "path": FILE_PATH, "size_bytes": content.len(), "content_sha256": sha256_of(&content) })
    );
    assert_eq!(
        contract.operations_called().await,
        vec!["create_upload", "complete_upload"]
    );
    contract.assert_clean().await;
}

#[tokio::test]
async fn sends_a_large_file_in_parts_with_at_most_four_in_flight() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    for path in part_slices(&content, PART_BYTES).keys() {
        storage.answer(
            "PUT",
            path,
            vec![RawReply::status(200).delayed(STORAGE_PAUSE)],
        );
    }
    let progress = Arc::new(Mutex::new(Vec::<u64>::new()));
    let recorded = Arc::clone(&progress);
    let input = add_file_input(content.clone()).on_progress(move |sent| {
        recorded
            .lock()
            .expect("the progress list is not poisoned")
            .push(sent);
        async { Ok::<(), ProgressError>(()) }
    });

    client_for(&contract.base_url)
        .add_file(input)
        .await
        .expect("the file is added");

    let arrived: std::collections::BTreeMap<String, Vec<u8>> = storage
        .arrived(Some("PUT"))
        .into_iter()
        .map(|put| (put.path, put.body))
        .collect();
    assert_eq!(arrived, part_slices(&content, PART_BYTES));
    assert!(
        (2..=PARTS_IN_FLIGHT_LIMIT).contains(&storage.most_in_flight()),
        "{}",
        storage.most_in_flight()
    );
    assert!(
        storage
            .arrived(Some("PUT"))
            .iter()
            .all(|put| !put.headers.contains_key("authorization"))
    );
    assert_eq!(
        progress
            .lock()
            .expect("the progress list is not poisoned")
            .iter()
            .sum::<u64>(),
        content.len() as u64
    );
    let expected: std::collections::BTreeMap<u64, Vec<String>> = part_slices(&content, PART_BYTES)
        .values()
        .zip(1..)
        .map(|(part, number)| (number, vec![sha256_of(part)]))
        .collect();
    assert_eq!(signed_digests(&contract).await, expected);
    contract.assert_clean().await;
}

#[tokio::test]
async fn signs_a_part_again_when_storage_answers_503() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    storage.answer(
        "PUT",
        "/parts/2",
        vec![RawReply::status(503), RawReply::status(200)],
    );

    add_file(&client_for(&contract.base_url), content)
        .await
        .expect("the file is added");

    assert_eq!(
        signed_part_numbers(&contract).await,
        vec![1, 2, 2, 3, 4, 5, 6]
    );
    assert_eq!(
        put_paths(&storage)
            .iter()
            .filter(|path| *path == "/parts/2")
            .count(),
        2
    );
    assert!(contract.requests_for("cancel_upload").await.is_empty());
    contract.assert_clean().await;
}

#[tokio::test]
async fn cancels_the_upload_when_storage_refuses_a_part() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    storage.answer("PUT", "/parts/3", vec![RawReply::status(400)]);

    let error = refusal(add_file(&client_for(&contract.base_url), content).await);

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::Refused, Some(400))
    );
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    assert!(contract.requests_for("complete_upload").await.is_empty());
    contract.assert_clean().await;
}

#[tokio::test]
async fn never_follows_a_storage_link_with_another_scheme() {
    for url in [
        "file:///etc/passwd",
        "ftp://storage.example/part",
        "gopher://x",
        "/relative/part",
        "not a url",
    ] {
        let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
        script_single(&contract, url, b"x".repeat(1_000).as_slice()).await;

        let error = refusal(add_file(&client_for(&contract.base_url), b"x".repeat(1_000)).await);

        assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse, "{url}");
        assert!(storage.arrived(None).is_empty());
        assert_eq!(
            contract.requests_for("cancel_upload").await.len(),
            1,
            "{url}"
        );
        contract.assert_clean().await;
    }
}

#[tokio::test]
async fn refuses_a_part_plan_that_does_not_fit_the_file() {
    for (part_bytes, part_count) in [
        (PART_BYTES, 3),
        (PART_BYTES, 7),
        (0, 0),
        (1, MULTIPART_CONTENT_BYTES),
    ] {
        let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
        let content = random_bytes(MULTIPART_CONTENT_BYTES);
        script_multipart(&contract, &storage, &content).await;
        let plan = UploadPlan {
            state: "open",
            part_bytes: Some(part_bytes),
            part_count: Some(part_count),
            failure_code: None,
        };
        contract
            .stub(
                "create_upload",
                201,
                json!({ "upload": upload_record(&content, &plan), "parts": [] }),
            )
            .await;

        let error = refusal(add_file(&client_for(&contract.base_url), content).await);

        assert_eq!(
            error.kind(),
            HimringApiErrorKind::InvalidResponse,
            "{part_bytes} {part_count}"
        );
        assert!(contract.requests_for("sign_upload_parts").await.is_empty());
        assert!(storage.arrived(None).is_empty());
        assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    }
}

#[tokio::test]
async fn waits_while_himring_checks_the_file_then_returns_it() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(2_000);
    script_single(
        &contract,
        &format!("{}/parts/1", storage.base_url),
        &content,
    )
    .await;
    let checking = upload_record(&content, &UploadPlan::single("checking"));
    contract
        .stub("complete_upload", 200, checking.clone())
        .await;
    let completed = upload_record(&content, &UploadPlan::single("completed"));
    contract
        .script(
            "get_upload",
            vec![
                json!({ "status": 200, "body": checking }),
                json!({ "status": 200, "body": completed }),
            ],
        )
        .await;
    let started = Instant::now();

    let added = add_file(&client_for(&contract.base_url), content)
        .await
        .expect("the file is added");

    assert_eq!(added.file.id, FILE_ID);
    assert!(
        started.elapsed() >= FIRST_TWO_POLLS,
        "{:?}",
        started.elapsed()
    );
    assert_eq!(contract.requests_for("get_upload").await.len(), 2);
    contract.assert_clean().await;
}

#[tokio::test]
async fn returns_the_documented_failure_of_the_upload_without_cancelling_it() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(2_000);
    script_single(
        &contract,
        &format!("{}/parts/1", storage.base_url),
        &content,
    )
    .await;
    let plan = UploadPlan {
        state: "failed",
        part_bytes: None,
        part_count: None,
        failure_code: Some("upload_part_mismatch"),
    };
    contract
        .stub("complete_upload", 200, upload_record(&content, &plan))
        .await;

    let error = refusal(add_file(&client_for(&contract.base_url), content).await);

    assert_eq!(
        (error.kind(), error.code(), error.status()),
        (
            HimringApiErrorKind::Refused,
            Some("upload_part_mismatch"),
            Some(400)
        )
    );
    assert!(contract.requests_for("cancel_upload").await.is_empty());
    contract.assert_clean().await;
}

#[tokio::test]
async fn reads_the_upload_when_himring_closed_it_while_parts_were_sent() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    contract
        .stub(
            "sign_upload_parts",
            409,
            json!({ "error": { "code": "upload_closed", "message": "Closed." } }),
        )
        .await;

    let added = add_file(&client_for(&contract.base_url), content)
        .await
        .expect("the file is added");

    assert_eq!(added.outcome, GetUploadOutputOutcome::Added);
    assert!(contract.requests_for("complete_upload").await.is_empty());
    assert!(contract.requests_for("cancel_upload").await.is_empty());
    contract.assert_clean().await;
}
