#[allow(dead_code, unused_imports)]
mod support;

use std::sync::{Arc, Mutex};
use std::time::Duration;

use futures_util::StreamExt;
use himring::types::GetUploadInput;
use himring::{Himring, HimringApiErrorKind, ProgressError};
use serde_json::json;
use support::downloads::{
    ENTITY_TAG, STORED_FILE_BYTES, STORED_FILE_PATH, download_input, link_to, linked,
};
use support::records::{FILE_ID, UPLOAD_ID, part_slices, random_bytes};
use support::uploads::{
    MULTIPART_CONTENT_BYTES, PART_BYTES, PARTS_IN_FLIGHT_LIMIT, add_file_input, script_multipart,
    script_single,
};
use support::{
    API_KEY, ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, RawReply, StandInServer, client_for,
    refusal,
};

const FIRST_BYTES: usize = 100;
const FILE_VERSION: u64 = 3;
const STORAGE_PAUSE: Duration = Duration::from_millis(150);

#[tokio::test]
async fn reads_a_byte_range_of_a_file_from_storage_without_the_api_key_or_custom_headers() {
    let storage = StandInServer::start().await;
    let contract = linked(&storage).await;
    let stored = random_bytes(STORED_FILE_BYTES);
    let content_range = format!("bytes 0-{}/{STORED_FILE_BYTES}", FIRST_BYTES - 1);
    let reply = RawReply::with_body(206, stored[..FIRST_BYTES].to_vec())
        .header("content-range", &content_range)
        .header("accept-ranges", "bytes");
    storage.answer("GET", STORED_FILE_PATH, vec![reply]);
    let himring = Himring::builder()
        .api_key(API_KEY)
        .base_url(&contract.base_url)
        .header("x-tenant", "acme")
        .build()
        .expect("the client builds");

    let download = himring
        .download_file(download_input(FILE_VERSION).range(format!("bytes=0-{}", FIRST_BYTES - 1)))
        .await
        .expect("the download starts");
    let details = (
        download.status(),
        download.file_name().to_owned(),
        download.entity_tag().map(str::to_owned),
    );
    let range = download.content_range().map(str::to_owned);
    let chunks: Vec<_> = download.bytes_stream().collect().await;
    let content: Vec<u8> = chunks
        .into_iter()
        .flat_map(|chunk| chunk.expect("each chunk arrives").to_vec())
        .collect();

    assert_eq!(content, stored[..FIRST_BYTES]);
    assert_eq!(
        details,
        (206, "refunds.pdf".to_owned(), Some(ENTITY_TAG.to_owned()))
    );
    assert_eq!(range, Some(content_range));
    let fetches = storage.arrived(Some("GET"));
    let [fetch] = fetches.as_slice() else {
        panic!("one fetch arrived")
    };
    assert_eq!(
        fetch.headers.get("range").map(String::as_str),
        Some("bytes=0-99")
    );
    assert!(!fetch.headers.contains_key("authorization"));
    assert!(!fetch.headers.contains_key("x-tenant"));
    let links = contract.assert_clean().await;
    assert_eq!(
        links[0].path_parameters["version"],
        json!(FILE_VERSION.to_string())
    );
    assert_eq!(links[0].header("x-tenant"), Some("acme"));
    assert_eq!(links[0].query, json!({ "disposition": "attachment" }));
}

#[tokio::test]
async fn returns_a_refusal_when_storage_does_not_hand_over_the_file() {
    for status in [301, 302, 403, 404, 500] {
        let storage = StandInServer::start().await;
        let contract = linked(&storage).await;
        let collect = format!("{}/collect", storage.base_url);
        storage.answer(
            "GET",
            STORED_FILE_PATH,
            vec![RawReply::with_body(status, "<Error/>").header("location", &collect)],
        );

        let error = refusal(
            client_for(&contract.base_url)
                .download_file(download_input(1))
                .await,
        );

        assert_eq!(
            (error.kind(), error.status()),
            (HimringApiErrorKind::Refused, Some(status))
        );
        let paths: Vec<String> = storage
            .arrived(None)
            .into_iter()
            .map(|request| request.path)
            .collect();
        assert_eq!(paths, vec![STORED_FILE_PATH.to_owned()]);
    }
}

#[tokio::test]
async fn refuses_a_range_that_is_not_a_byte_range_before_asking_for_a_link() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);
    for byte_range in [
        "bytes=0-9\r\nx-forwarded-for: 10.0.0.1",
        "rows=0-9",
        "",
        "bytes=",
    ] {
        let error = refusal(
            himring
                .download_file(download_input(1).range(byte_range))
                .await,
        );

        assert_eq!(
            error.kind(),
            HimringApiErrorKind::InvalidInput,
            "{byte_range:?}"
        );
    }
    contract.assert_untouched().await;
}

#[tokio::test]
async fn never_follows_a_download_link_with_another_scheme() {
    for url in [
        "file:///etc/shadow",
        "ftp://127.0.0.1/returns.pdf",
        "data:application/pdf;base64,JVBERg==",
        "/relative/part",
        "not a url",
    ] {
        let contract = ContractApi::start().await;
        contract.stub("get_download_link", 200, link_to(url)).await;

        let error = refusal(
            client_for(&contract.base_url)
                .download_file(download_input(1))
                .await,
        );

        assert_eq!(error.kind(), HimringApiErrorKind::InvalidResponse, "{url}");
    }
}

#[tokio::test]
async fn refuses_a_download_link_whose_address_is_not_text() {
    let stand_in = StandInServer::start().await;
    let path = format!(
        "/v1/projects/{PROJECT_ID}/knowledge-bases/{KNOWLEDGE_BASE_ID}/files/{FILE_ID}/versions/1/link?disposition=attachment"
    );
    let mut link = link_to("unused");
    link["url"] = json!(7);
    stand_in.answer(
        "GET",
        &path,
        vec![RawReply::with_body(200, link.to_string())],
    );

    let error = refusal(
        client_for(&stand_in.base_url)
            .download_file(download_input(1))
            .await,
    );

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::InvalidResponse, Some(200))
    );
    let paths: Vec<String> = stand_in
        .arrived(None)
        .into_iter()
        .map(|request| request.path)
        .collect();
    assert_eq!(paths, vec![path]);
}

#[tokio::test]
async fn sends_parts_four_at_a_time_and_awaits_a_callback_that_calls_back_before_downloading() {
    let storage = StandInServer::start().await;
    let contract = linked(&storage).await;
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    contract
        .stub(
            "get_download_link",
            200,
            link_to(&format!("{}{STORED_FILE_PATH}", storage.base_url)),
        )
        .await;
    for path in part_slices(&content, PART_BYTES).keys() {
        storage.answer(
            "PUT",
            path,
            vec![RawReply::status(200).delayed(STORAGE_PAUSE)],
        );
    }
    let stored = random_bytes(STORED_FILE_BYTES);
    storage.answer(
        "GET",
        STORED_FILE_PATH,
        vec![RawReply::with_body(200, stored.clone())],
    );
    let himring = client_for(&contract.base_url);
    let sent = Arc::new(Mutex::new(Vec::<u64>::new()));
    let (reader, recorded) = (himring.clone(), Arc::clone(&sent));
    let input = add_file_input(content.clone()).on_progress(move |part_bytes| {
        let (reader, recorded) = (reader.clone(), Arc::clone(&recorded));
        async move {
            reader
                .get_upload(GetUploadInput::new(
                    PROJECT_ID,
                    KNOWLEDGE_BASE_ID,
                    UPLOAD_ID,
                ))
                .await?;
            recorded
                .lock()
                .expect("the sent list is not poisoned")
                .push(part_bytes);
            Ok::<(), ProgressError>(())
        }
    });

    himring.add_file(input).await.expect("the file is added");
    let downloaded = himring
        .download_file(download_input(1))
        .await
        .expect("the download starts")
        .read()
        .await;

    assert_eq!(downloaded.expect("the download reads to the end"), stored);
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
    let sent = sent.lock().expect("the sent list is not poisoned").clone();
    assert_eq!(sent.iter().sum::<u64>(), content.len() as u64);
    assert_eq!(contract.requests_for("get_upload").await.len(), sent.len());
    contract.assert_clean().await;
}

#[tokio::test]
async fn sends_neither_the_key_nor_custom_headers_to_storage_when_it_adds_a_file() {
    let storage = StandInServer::start().await;
    let contract = ContractApi::start().await;
    let content = random_bytes(2_000);
    script_single(
        &contract,
        &format!("{}/parts/1", storage.base_url),
        &content,
    )
    .await;
    let himring = Himring::builder()
        .api_key(API_KEY)
        .base_url(&contract.base_url)
        .header("x-tenant", "acme")
        .build()
        .expect("the client builds");

    himring
        .add_file(add_file_input(content))
        .await
        .expect("the file is added");

    let puts = storage.arrived(Some("PUT"));
    assert!(
        puts.iter()
            .all(|put| !put.headers.contains_key("authorization")
                && !put.headers.contains_key("x-tenant"))
    );
    let requests = contract.assert_clean().await;
    assert!(
        requests
            .iter()
            .all(|request| request.header("x-tenant") == Some("acme"))
    );
    assert!(requests.iter().all(
        |request| request.header("authorization") == Some(format!("Bearer {API_KEY}").as_str())
    ));
}
