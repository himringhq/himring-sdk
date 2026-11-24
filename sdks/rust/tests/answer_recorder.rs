#[allow(dead_code, unused_imports)]
mod support;

use std::sync::Arc;
use std::time::{Duration, SystemTime};

use himring::answers::{AnswerRecorder, AnswerRecorderOptions, SpoolDirectory};
use serde_json::{Value, json};
use support::answers::{
    CollectedWarnings, TemporaryFolder, accepted, act_as_crashing_recorder, answer_drafts,
    delivered_in, delivered_in_bodies, drafts_of, expected_of, record_then_crash, recorder_at,
    spool_names,
};
use support::{ContractApi, RawReply, StandInServer, client_for, identifier};

const OWNER_ONLY_BITS: u32 = 0o077;
const SLOW_REPLY: Duration = Duration::from_secs(3);
const SHORT_CLOSE: Duration = Duration::from_millis(200);
const STALE_HEARTBEAT: Duration = Duration::from_secs(600);
const NO_SPOOL_FILES: Vec<String> = Vec::new();

fn too_large() -> Value {
    json!({ "error": { "code": "payload_too_large", "message": "Send fewer events." } })
}

fn unavailable() -> Value {
    json!({ "error": { "code": "service_unavailable", "message": "Try again." } })
}

fn record_answer_events_path(project_id: &str, knowledge_base_id: &str) -> String {
    format!("/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/answer-events")
}

fn stand_in_bodies(stand_in: &StandInServer) -> Vec<Value> {
    stand_in
        .arrived(Some("POST"))
        .into_iter()
        .map(|request| serde_json::from_slice(&request.body).expect("each body is JSON"))
        .collect()
}

#[test]
#[ignore = "the crash tests start this test in a child process and kill it"]
fn crashing_recorder_child() {
    act_as_crashing_recorder();
}

#[tokio::test]
async fn halves_a_batch_that_the_api_finds_too_large_with_no_event_lost_or_sent_twice() {
    let contract = ContractApi::start().await;
    let reply = |status: u16, body: Value| json!({ "status": status, "body": body });
    contract
        .script(
            "record_answer_events",
            vec![
                reply(413, too_large()),
                reply(413, too_large()),
                reply(200, accepted(15)),
            ],
        )
        .await;
    let folder = TemporaryFolder::new();
    let recorder = recorder_at(
        &client_for(&contract.base_url),
        SpoolDirectory::At(folder.spool()),
        &identifier("prj"),
        &identifier("kb"),
    );
    let answers = answer_drafts(60);

    recorder.record(&drafts_of(&answers));
    recorder.flush().await;
    recorder.close().await;

    let requests = contract.assert_clean().await;
    let sizes: Vec<usize> = requests
        .iter()
        .map(|request| request.body["events"].as_array().map_or(0, Vec::len))
        .collect();
    assert_eq!(sizes[..2], [60, 30]);
    assert_eq!(delivered_in(&requests[2..]), expected_of(&answers));
    assert_eq!(recorder.dropped_event_count(), 0);
    assert_eq!(spool_names(&folder.spool()), NO_SPOOL_FILES);
}

#[tokio::test]
async fn does_not_steal_the_events_of_a_live_recorder_with_a_stale_heartbeat() {
    let (project_id, knowledge_base_id) = (identifier("prj"), identifier("kb"));
    let stand_in = StandInServer::start().await;
    let path = record_answer_events_path(&project_id, &knowledge_base_id);
    stand_in.answer(
        "POST",
        &path,
        vec![RawReply::with_body(200, accepted(1).to_string()).delayed(SLOW_REPLY)],
    );
    let folder = TemporaryFolder::new();
    let client = client_for(&stand_in.base_url);
    let first = recorder_at(
        &client,
        SpoolDirectory::At(folder.spool()),
        &project_id,
        &knowledge_base_id,
    );
    first.record(&drafts_of(&answer_drafts(1)));
    let first_flush = tokio::spawn({
        let first = first.clone();
        async move { first.flush().await }
    });
    while stand_in.arrived(Some("POST")).is_empty() {
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
    let stale = SystemTime::now() - STALE_HEARTBEAT;
    for name in spool_names(&folder.spool()) {
        let file = std::fs::File::options()
            .write(true)
            .open(folder.spool().join(name))
            .expect("the spool file opens");
        file.set_modified(stale)
            .expect("the spool file takes a stale time");
    }
    let second = AnswerRecorder::new(
        AnswerRecorderOptions::new(client.clone(), &project_id, &knowledge_base_id)
            .spool_directory(SpoolDirectory::At(folder.spool()))
            .close_timeout(SHORT_CLOSE)
            .logger(Arc::new(CollectedWarnings::default())),
    )
    .expect("the second recorder starts");

    second.flush().await;

    assert_eq!(stand_in.arrived(Some("POST")).len(), 1);
    first_flush.await.expect("the first flush finishes");
    first.close().await;
    second.close().await;
    assert_eq!(stand_in.arrived(Some("POST")).len(), 1);
}

#[tokio::test]
async fn recovers_answers_only_for_their_original_api_project_and_knowledge_base() {
    let contract = ContractApi::start().await;
    contract
        .stub("record_answer_events", 200, accepted(2))
        .await;
    let elsewhere = StandInServer::start().await;
    let (project_id, knowledge_base_id) = (identifier("prj"), identifier("kb"));
    let folder = TemporaryFolder::new();
    let answers = answer_drafts(2);
    record_then_crash(
        &contract.base_url,
        &project_id,
        &knowledge_base_id,
        &folder.spool(),
        &answers,
    )
    .await;
    let original = spool_names(&folder.spool());
    assert_ne!(original, NO_SPOOL_FILES);

    let client = client_for(&contract.base_url);
    let foreign_targets = [
        (client.clone(), identifier("prj"), knowledge_base_id.clone()),
        (client.clone(), project_id.clone(), identifier("kb")),
        (
            client_for(&elsewhere.base_url),
            project_id.clone(),
            knowledge_base_id.clone(),
        ),
    ];
    for (foreign_client, foreign_project, foreign_knowledge_base) in foreign_targets {
        let foreign = recorder_at(
            &foreign_client,
            SpoolDirectory::At(folder.spool()),
            &foreign_project,
            &foreign_knowledge_base,
        );
        foreign.flush().await;
        foreign.close().await;

        assert!(
            contract
                .requests_for("record_answer_events")
                .await
                .is_empty()
        );
        assert!(elsewhere.arrived(None).is_empty());
        assert_eq!(spool_names(&folder.spool()), original);
    }
    let recovered = recorder_at(
        &client,
        SpoolDirectory::At(folder.spool()),
        &project_id,
        &knowledge_base_id,
    );
    recovered.flush().await;
    recovered.close().await;

    let requests = contract.assert_clean().await;
    assert_eq!(delivered_in(&requests), expected_of(&answers));
    assert_eq!(spool_names(&folder.spool()), NO_SPOOL_FILES);
}

#[tokio::test]
async fn replays_the_events_of_a_crashed_process_exactly_once() {
    let contract = ContractApi::start().await;
    contract
        .stub("record_answer_events", 200, accepted(30))
        .await;
    let (project_id, knowledge_base_id) = (identifier("prj"), identifier("kb"));
    let folder = TemporaryFolder::new();
    let answers = answer_drafts(30);
    record_then_crash(
        &contract.base_url,
        &project_id,
        &knowledge_base_id,
        &folder.spool(),
        &answers,
    )
    .await;
    assert!(
        contract
            .requests_for("record_answer_events")
            .await
            .is_empty()
    );
    assert_ne!(spool_names(&folder.spool()), NO_SPOOL_FILES);
    let client = client_for(&contract.base_url);

    let first = recorder_at(
        &client,
        SpoolDirectory::At(folder.spool()),
        &project_id,
        &knowledge_base_id,
    );
    let second = recorder_at(
        &client,
        SpoolDirectory::At(folder.spool()),
        &project_id,
        &knowledge_base_id,
    );
    tokio::join!(first.flush(), second.flush());
    tokio::join!(first.close(), second.close());
    let third = recorder_at(
        &client,
        SpoolDirectory::At(folder.spool()),
        &project_id,
        &knowledge_base_id,
    );
    third.flush().await;
    third.close().await;

    let requests = contract.assert_clean().await;
    assert_eq!(delivered_in(&requests), expected_of(&answers));
    assert_eq!(spool_names(&folder.spool()), NO_SPOOL_FILES);
}

#[tokio::test]
async fn replays_the_events_that_a_closed_recorder_could_not_send_exactly_once() {
    let (project_id, knowledge_base_id) = (identifier("prj"), identifier("kb"));
    let stand_in = StandInServer::start().await;
    let path = record_answer_events_path(&project_id, &knowledge_base_id);
    let hanging = RawReply::with_body(200, accepted(12).to_string())
        .delayed(SLOW_REPLY)
        .hanging();
    stand_in.answer(
        "POST",
        &path,
        vec![hanging, RawReply::with_body(200, accepted(12).to_string())],
    );
    let folder = TemporaryFolder::new();
    let client = client_for(&stand_in.base_url);
    let answers = answer_drafts(12);
    let stopped = AnswerRecorder::new(
        AnswerRecorderOptions::new(client.clone(), &project_id, &knowledge_base_id)
            .spool_directory(SpoolDirectory::At(folder.spool()))
            .flush_interval(support::answers::NEVER_FLUSH_ON_A_TIMER)
            .close_timeout(SHORT_CLOSE)
            .logger(Arc::new(CollectedWarnings::default())),
    )
    .expect("the recorder starts");

    stopped.record(&drafts_of(&answers));
    stopped.close().await;
    let restarted = recorder_at(
        &client,
        SpoolDirectory::At(folder.spool()),
        &project_id,
        &knowledge_base_id,
    );
    restarted.flush().await;
    restarted.close().await;

    let bodies = stand_in_bodies(&stand_in);
    assert_eq!(delivered_in_bodies(&bodies[..1]), expected_of(&answers));
    assert_eq!(delivered_in_bodies(&bodies[1..]), expected_of(&answers));
    assert_eq!(spool_names(&folder.spool()), NO_SPOOL_FILES);
}

#[cfg(unix)]
#[tokio::test]
async fn keeps_the_spool_folder_and_its_files_private_to_the_user() {
    use std::os::unix::fs::{MetadataExt, PermissionsExt};

    let contract = ContractApi::start().await;
    contract
        .stub("record_answer_events", 503, unavailable())
        .await;
    let folder = TemporaryFolder::new();
    let recorder = recorder_at(
        &client_for(&contract.base_url),
        SpoolDirectory::At(folder.spool()),
        &identifier("prj"),
        &identifier("kb"),
    );

    recorder.record(&drafts_of(&answer_drafts(3)));

    let spool = std::fs::metadata(folder.spool()).expect("the spool folder exists");
    assert_eq!(spool.permissions().mode() & OWNER_ONLY_BITS, 0);
    let names = spool_names(&folder.spool());
    assert_ne!(names, NO_SPOOL_FILES);
    let user = rustix::process::getuid().as_raw();
    for name in names {
        let file = std::fs::metadata(folder.spool().join(&name)).expect("the spool file exists");
        assert_eq!(file.permissions().mode() & OWNER_ONLY_BITS, 0, "{name}");
        assert_eq!(file.uid(), user, "{name}");
    }
    recorder.close().await;
}

#[cfg(unix)]
#[tokio::test]
async fn writes_no_answer_into_a_spool_folder_that_other_users_can_write_to() {
    use std::os::unix::fs::PermissionsExt;

    let contract = ContractApi::start().await;
    contract
        .stub("record_answer_events", 503, unavailable())
        .await;
    let folder = TemporaryFolder::new();
    let shared = folder.0.join("shared");
    std::fs::create_dir(&shared).expect("the shared folder is created");
    std::fs::set_permissions(&shared, std::fs::Permissions::from_mode(0o777))
        .expect("the shared folder opens to everyone");
    let recorder = recorder_at(
        &client_for(&contract.base_url),
        SpoolDirectory::At(shared.clone()),
        &identifier("prj"),
        &identifier("kb"),
    );

    recorder.record(&drafts_of(&answer_drafts(3)));

    assert_eq!(spool_names(&shared), NO_SPOOL_FILES);
    recorder.close().await;
}

#[cfg(unix)]
#[tokio::test]
async fn writes_no_answer_through_a_symbolic_link_where_the_spool_folder_goes() {
    let contract = ContractApi::start().await;
    contract
        .stub("record_answer_events", 503, unavailable())
        .await;
    let folder = TemporaryFolder::new();
    let target = folder.0.join("elsewhere");
    std::fs::create_dir(&target).expect("the link target is created");
    std::os::unix::fs::symlink(&target, folder.spool()).expect("the link is created");
    let recorder = recorder_at(
        &client_for(&contract.base_url),
        SpoolDirectory::At(folder.spool()),
        &identifier("prj"),
        &identifier("kb"),
    );

    recorder.record(&drafts_of(&answer_drafts(3)));

    assert_eq!(spool_names(&target), NO_SPOOL_FILES);
    recorder.close().await;
}
