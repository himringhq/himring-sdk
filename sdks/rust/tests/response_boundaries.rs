#[allow(dead_code, unused_imports)]
mod support;

use std::time::Duration;

use himring::answers::{AnswerRecorder, AnswerRecorderOptions};
use himring::types::DeleteSavedQueryInput;
use himring::types::{ListDatabasesInput, SearchKnowledgeBaseInput};
use himring::{Himring, HimringApiErrorKind};
use serde_json::json;
use support::uploads::{add_file, script_single};
use support::{
    ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, RawReply, StandInServer, client_for, refusal,
};

#[tokio::test]
async fn rejects_a_delete_receipt_that_denies_the_documented_success() {
    let contract = ContractApi::start().await;
    contract
        .script(
            "delete_saved_query",
            vec![
                json!({ "status": 200, "body": { "deleted": false } }),
                json!({ "status": 200, "body": { "deleted": true } }),
            ],
        )
        .await;
    let client = client_for(&contract.base_url);
    let input = DeleteSavedQueryInput::new(
        PROJECT_ID,
        support::identifier("db"),
        support::identifier("sql"),
    );

    let error = refusal(client.delete_saved_query(input.clone()).await);
    let receipt = client
        .delete_saved_query(input)
        .await
        .expect("the true receipt is valid");

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse);
    assert!(receipt.deleted);
    let (requests, problems) = contract.recorded().await;
    assert_eq!(requests.len(), 2);
    assert!(requests.iter().all(|request| request.problems.is_empty()));
    assert!(problems.iter().any(|problem| problem.contains("deleted")));
}

#[tokio::test]
async fn rejects_a_search_answer_without_its_required_nullable_recall_id() {
    let contract = ContractApi::start().await;
    let missing = json!({
        "question_id": support::identifier("qst"),
        "duration_ms": 1,
        "passages": [],
        "memories": [],
    });
    let mut complete = missing.clone();
    complete["recall_id"] = serde_json::Value::Null;
    contract
        .script(
            "search_knowledge_base",
            vec![
                json!({ "status": 200, "body": missing }),
                json!({ "status": 200, "body": complete }),
            ],
        )
        .await;
    let client = client_for(&contract.base_url);
    let input = || SearchKnowledgeBaseInput::new(PROJECT_ID, KNOWLEDGE_BASE_ID, "Refunds?");

    let error = refusal(client.search_knowledge_base(input()).await);
    let found = client
        .search_knowledge_base(input())
        .await
        .expect("an explicit null is valid");

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse);
    assert_eq!(found.recall_id, None);
    let (requests, problems) = contract.recorded().await;
    assert_eq!(requests.len(), 2);
    assert!(requests.iter().all(|request| request.problems.is_empty()));
    assert!(problems.iter().any(|problem| problem.contains("recall_id")));
}

#[tokio::test]
async fn refuses_unrepresentable_deadlines_before_sending_or_starting_a_recorder() {
    let contract = ContractApi::start().await;
    let client = client_for(&contract.base_url);
    let error = refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .timeout(Duration::MAX)
            .await,
    );
    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    assert!(Himring::builder().timeout(Duration::MAX).build().is_err());
    assert!(
        Himring::builder()
            .upload_idle_timeout(Duration::MAX)
            .build()
            .is_err()
    );
    let options = AnswerRecorderOptions::new(client.clone(), PROJECT_ID, KNOWLEDGE_BASE_ID)
        .close_timeout(Duration::MAX);
    assert!(AnswerRecorder::new(options).is_err());
    let options = AnswerRecorderOptions::new(client, PROJECT_ID, KNOWLEDGE_BASE_ID)
        .flush_interval(Duration::MAX);
    assert!(AnswerRecorder::new(options).is_err());
    contract.assert_untouched().await;
}

#[tokio::test]
async fn an_overflowing_retry_after_does_not_retry_storage_early() {
    let contract = ContractApi::start().await;
    let storage = StandInServer::start().await;
    let content: &'static [u8] = b"refund policy";
    script_single(&contract, &format!("{}/parts/1", storage.base_url), content).await;
    storage.answer(
        "PUT",
        "/parts/1",
        vec![
            RawReply::status(503).header("retry-after", "999999999999999999999999999999"),
            RawReply::status(200),
        ],
    );

    let error = refusal(add_file(&client_for(&contract.base_url), content).await);

    assert_eq!(error.status(), Some(503));
    assert_eq!(storage.arrived(Some("PUT")).len(), 1);
    assert_eq!(
        contract.operations_called().await,
        ["create_upload", "cancel_upload"]
    );
    contract.assert_clean().await;
}
