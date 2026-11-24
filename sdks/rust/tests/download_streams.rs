#[allow(dead_code, unused_imports)]
mod support;

use std::time::{Duration, Instant};

use himring::types::DownloadIndexInput;
use himring::{Himring, HimringApiErrorKind};
use support::downloads::{
    INDEX_ID, STORED_FILE_BYTES, STORED_FILE_PATH, download_input, index_download_path, linked,
};
use support::records::random_bytes;
use support::{API_KEY, PROJECT_ID, RawReply, StandInServer, client_for, refusal};

const TIME_LIMIT: Duration = Duration::from_millis(300);
const PROMPT_FAILURE: Duration = Duration::from_secs(2);
const DRIP_PAUSE: Duration = Duration::from_millis(50);
const FIRST_CHUNK_WAIT: Duration = Duration::from_millis(10);
const CONNECTION_SETTLES: Duration = Duration::from_secs(3);

fn client_with_limit(base_url: &str) -> Himring {
    Himring::builder()
        .api_key(API_KEY)
        .base_url(base_url)
        .timeout(TIME_LIMIT)
        .build()
        .expect("the client builds")
}

#[tokio::test]
async fn a_storage_connection_that_closes_partway_fails_the_read() {
    let storage = StandInServer::start().await;
    let contract = linked(&storage).await;
    let cut = RawReply::with_body(200, random_bytes(STORED_FILE_BYTES)).cut_after(1_000);
    storage.answer("GET", STORED_FILE_PATH, vec![cut]);

    let download = client_for(&contract.base_url)
        .download_file(download_input(1))
        .await
        .expect("the download starts");
    let error = refusal(download.read().await);

    assert_eq!(error.kind(), HimringApiErrorKind::Network);
}

#[tokio::test]
async fn a_stalled_storage_download_ends_with_a_timeout() {
    let storage = StandInServer::start().await;
    let contract = linked(&storage).await;
    let stalled = RawReply::with_body(200, random_bytes(40)).dripped(TIME_LIMIT * 2);
    storage.answer("GET", STORED_FILE_PATH, vec![stalled]);
    let started = Instant::now();

    let download = client_with_limit(&contract.base_url)
        .download_file(download_input(1))
        .await
        .expect("the download starts");
    let error = refusal(download.read().await);

    assert_eq!(error.kind(), HimringApiErrorKind::Timeout);
    assert!(
        started.elapsed() < PROMPT_FAILURE,
        "{:?}",
        started.elapsed()
    );
}

#[tokio::test]
async fn bounds_a_download_refusal_whose_json_body_never_finishes() {
    let stand_in = StandInServer::start().await;
    let unfinished = RawReply::with_body(
        403,
        r#"{"error": {"code": "index_not_found", "message": "Gone."}}"#,
    )
    .header("content-type", "application/json")
    .cut_after(9)
    .hanging();
    stand_in.answer("GET", &index_download_path(), vec![unfinished]);
    let started = Instant::now();

    let error = refusal(
        client_with_limit(&stand_in.base_url)
            .download_index(DownloadIndexInput::new(PROJECT_ID, INDEX_ID))
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::Timeout);
    assert!(
        started.elapsed() < PROMPT_FAILURE,
        "{:?}",
        started.elapsed()
    );
}

#[tokio::test]
async fn dropping_a_download_while_its_next_chunk_is_pending_closes_the_connection() {
    let stand_in = StandInServer::start().await;
    let slow = RawReply::with_body(200, "first chunk and then a long pause")
        .dripped(DRIP_PAUSE)
        .hanging();
    stand_in.answer("GET", &index_download_path(), vec![slow]);
    let himring = client_for(&stand_in.base_url);

    let mut download = himring
        .download_index(DownloadIndexInput::new(PROJECT_ID, INDEX_ID))
        .await
        .expect("the download starts");
    let first = download
        .chunk()
        .await
        .expect("the first chunk arrives")
        .expect("the stream holds a chunk");
    let pending = tokio::time::timeout(FIRST_CHUNK_WAIT, download.chunk()).await;
    drop(download);
    tokio::time::sleep(CONNECTION_SETTLES).await;

    assert!(!first.is_empty());
    assert!(
        pending.is_err(),
        "the next chunk arrived before the call was dropped"
    );
    assert_eq!(stand_in.closed_early(), 1);
}
