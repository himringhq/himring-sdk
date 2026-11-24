#[allow(dead_code, unused_imports)]
mod support;

use std::sync::Arc;

use himring::answers::SpoolDirectory;
use support::answers::{
    TemporaryFolder, accepted, act_as_crashing_recorder, answer_drafts, delivered_in, expected_of,
    record_then_crash, recorder_at, spool_names,
};
use support::{ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, client_for};

#[test]
#[ignore = "the recovery test starts this process and kills it after recording"]
fn crashing_recorder_child() {
    act_as_crashing_recorder();
}

#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn concurrent_recorders_recover_each_crashed_event_once() {
    let contract = ContractApi::start().await;
    contract
        .stub("record_answer_events", 200, accepted(64))
        .await;
    let temporary = TemporaryFolder::new();
    let folder = temporary.spool();
    let mut answers = answer_drafts(64);
    for answer in answers.values_mut() {
        answer.push_str(&" policy".repeat(4_000));
    }
    record_then_crash(
        &contract.base_url,
        PROJECT_ID,
        KNOWLEDGE_BASE_ID,
        &folder,
        &answers,
    )
    .await;
    let client = client_for(&contract.base_url);
    let barrier = Arc::new(tokio::sync::Barrier::new(8));
    let mut tasks = Vec::new();
    for _ in 0..8 {
        let barrier = Arc::clone(&barrier);
        let client = client.clone();
        let folder = folder.clone();
        tasks.push(tokio::spawn(async move {
            barrier.wait().await;
            let recorder = recorder_at(
                &client,
                SpoolDirectory::At(folder),
                PROJECT_ID,
                KNOWLEDGE_BASE_ID,
            );
            recorder.flush().await;
            recorder.close().await;
        }));
    }
    for task in tasks {
        task.await.expect("each recorder finishes recovery");
    }
    let restarted = recorder_at(
        &client,
        SpoolDirectory::At(folder.clone()),
        PROJECT_ID,
        KNOWLEDGE_BASE_ID,
    );
    restarted.flush().await;
    restarted.close().await;

    assert_eq!(
        delivered_in(&contract.assert_clean().await),
        expected_of(&answers)
    );
    assert_eq!(spool_names(&folder), Vec::<String>::new());
}
