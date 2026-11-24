#[allow(dead_code, unused_imports)]
mod support;

use std::sync::Arc;
use std::time::Duration;

use himring::answers::{AnswerRecorder, AnswerRecorderOptions, SpoolDirectory};
use serde_json::json;
use support::answers::{
    CollectedWarnings, NEVER_FLUSH_ON_A_TIMER, accepted, answer_drafts, delivered_in, drafts_of,
    expected_of, recorder_at,
};
use support::{
    ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, RawReply, StandInServer, client_for, identifier,
};

fn spool_directory() -> std::path::PathBuf {
    std::env::temp_dir().join(identifier("himring-recorder-shutdown"))
}

#[tokio::test]
async fn cancelling_close_releases_unsent_events_for_another_recorder() {
    let contract = ContractApi::start().await;
    contract
        .stub_with_headers(
            "record_answer_events",
            503,
            json!({ "error": { "code": "internal_error", "message": "Try later." } }),
            json!({ "retry-after": "1" }),
        )
        .await;
    let client = client_for(&contract.base_url);
    let folder = spool_directory();
    let recorder = AnswerRecorder::new(
        AnswerRecorderOptions::new(client.clone(), PROJECT_ID, KNOWLEDGE_BASE_ID)
            .spool_directory(SpoolDirectory::At(folder.clone()))
            .flush_interval(NEVER_FLUSH_ON_A_TIMER)
            .close_timeout(Duration::from_millis(200))
            .logger(Arc::new(CollectedWarnings::default())),
    )
    .expect("the recorder starts");
    let answers = answer_drafts(2);
    recorder.record(&drafts_of(&answers));
    let mut close = Box::pin(recorder.close());
    tokio::select! {
        () = &mut close => panic!("close must yield while draining"),
        () = tokio::task::yield_now() => {}
    }
    drop(close);
    recorder.close().await;
    let refused_requests = contract.requests_for("record_answer_events").await.len();
    contract
        .stub("record_answer_events", 200, accepted(2))
        .await;
    let restarted = recorder_at(
        &client,
        SpoolDirectory::At(folder),
        PROJECT_ID,
        KNOWLEDGE_BASE_ID,
    );

    restarted.flush().await;
    restarted.close().await;

    let requests = contract.assert_clean().await;
    assert_eq!(
        delivered_in(&requests[refused_requests..]),
        expected_of(&answers)
    );
}

#[tokio::test]
async fn flush_respects_its_deadline_while_background_delivery_holds_the_lock() {
    let server = StandInServer::start().await;
    let path =
        format!("/v1/projects/{PROJECT_ID}/knowledge-bases/{KNOWLEDGE_BASE_ID}/answer-events");
    server.answer(
        "POST",
        &path,
        vec![RawReply::with_body(200, accepted(1).to_string()).delayed(Duration::from_secs(2))],
    );
    let recorder = AnswerRecorder::new(
        AnswerRecorderOptions::new(client_for(&server.base_url), PROJECT_ID, KNOWLEDGE_BASE_ID)
            .spool_directory(SpoolDirectory::Disabled)
            .close_timeout(Duration::from_millis(50))
            .flush_interval(NEVER_FLUSH_ON_A_TIMER)
            .logger(Arc::new(CollectedWarnings::default())),
    )
    .expect("the recorder starts");
    recorder.record(&drafts_of(&answer_drafts(1)));
    tokio::time::timeout(Duration::from_secs(2), async {
        while server.arrived(Some("POST")).is_empty() {
            tokio::task::yield_now().await;
        }
    })
    .await
    .expect("background delivery starts");

    tokio::time::timeout(Duration::from_millis(500), recorder.flush())
        .await
        .expect("flush includes the lock wait in its time limit");
    recorder.close().await;
}
