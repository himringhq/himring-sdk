#[allow(dead_code, unused_imports)]
mod support;

use std::time::{Duration, Instant, SystemTime};

use himring::types::ListDatabasesInput;
use himring::{Himring, HimringApiError, HimringApiErrorKind};
use serde_json::json;
use support::{API_KEY, PROJECT_ID, RawReply, StandInServer, refusal};

const SLOW_ANSWER: Duration = Duration::from_secs(2);
const TIME_LIMIT: Duration = Duration::from_millis(300);
const PROMPT_FAILURE: Duration = Duration::from_millis(1200);
const DRIP_PAUSE: Duration = Duration::from_millis(100);
const DRIPPED_BYTES: usize = 40;

fn list_databases_path() -> String {
    format!("/v1/projects/{PROJECT_ID}/databases")
}

fn gone_with(extra: serde_json::Value) -> Vec<u8> {
    let mut error = json!({ "code": "not_found", "message": "Gone." });
    if let (Some(fields), serde_json::Value::Object(extra)) = (error.as_object_mut(), extra) {
        fields.extend(extra);
    }
    serde_json::to_vec(&json!({ "error": error })).expect("the envelope serializes")
}

fn wrong_shaped_envelopes() -> Vec<Vec<u8>> {
    vec![
        b"[]".to_vec(),
        b"null".to_vec(),
        br#"{"error": "not_found"}"#.to_vec(),
        br#"{"error": {"code": 404, "message": "Gone."}}"#.to_vec(),
        br#"{"error": {"code": "not_found"}}"#.to_vec(),
        gone_with(json!({ "details": null })),
        gone_with(json!({ "issues": [{ "message": 1, "path": [] }] })),
        gone_with(json!({ "issues": [{ "message": "x", "path": [true] }] })),
        gone_with(json!({ "missing_permission": { "level": "read" } })),
        gone_with(json!({ "request_id": 7 })),
    ]
}

fn dripped_reply() -> RawReply {
    let mut body = vec![b'{'];
    body.extend(std::iter::repeat_n(b' ', DRIPPED_BYTES));
    body.push(b'}');
    RawReply::with_body(200, body).dripped(DRIP_PAUSE)
}

fn client_with_limit(base_url: &str, timeout: Option<Duration>) -> Himring {
    let builder = Himring::builder().api_key(API_KEY).base_url(base_url);
    let builder = match timeout {
        Some(timeout) => builder.timeout(timeout),
        None => builder,
    };
    builder.build().expect("the test client builds")
}

async fn refusal_of(stand_in: &StandInServer, timeout: Option<Duration>) -> HimringApiError {
    let client = client_with_limit(&stand_in.base_url, timeout);
    refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .await,
    )
}

#[tokio::test]
async fn a_success_answer_that_is_not_json_raises_invalid_response() {
    let stand_in = StandInServer::start().await;
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![RawReply::with_body(
            200,
            "<html>Sign in to the proxy</html>",
        )],
    );

    let error = refusal_of(&stand_in, None).await;

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::InvalidResponse, Some(200))
    );
}

#[tokio::test]
async fn a_success_answer_of_the_wrong_shape_raises_invalid_response_with_the_path() {
    let stand_in = StandInServer::start().await;
    let page = json!({ "databases": [], "total_count": "many", "limit": 20, "offset": 0 });
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![RawReply::with_body(200, page.to_string())],
    );

    let error = refusal_of(&stand_in, None).await;

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::InvalidResponse, Some(200))
    );
    let paths: Vec<String> = error.issues()[0]
        .path
        .iter()
        .map(ToString::to_string)
        .collect();
    assert_eq!(paths, vec!["total_count".to_owned()]);
}

#[tokio::test]
async fn a_proxy_error_page_raises_invalid_response_with_its_status_and_request_id() {
    let stand_in = StandInServer::start().await;
    let reply =
        RawReply::with_body(502, "<html>Bad gateway</html>").header("x-request-id", "req_proxy");
    stand_in.answer("GET", &list_databases_path(), vec![reply]);

    let error = refusal_of(&stand_in, None).await;

    assert_eq!(
        (
            error.kind(),
            error.status(),
            error.code(),
            error.request_id()
        ),
        (
            HimringApiErrorKind::InvalidResponse,
            Some(502),
            None,
            Some("req_proxy")
        )
    );
}

#[tokio::test]
async fn an_error_envelope_of_the_wrong_shape_raises_invalid_response() {
    let stand_in = StandInServer::start().await;
    for envelope in wrong_shaped_envelopes() {
        stand_in.answer(
            "GET",
            &list_databases_path(),
            vec![RawReply::with_body(404, envelope.clone())],
        );

        let error = refusal_of(&stand_in, None).await;

        assert_eq!(
            (error.kind(), error.status(), error.code()),
            (HimringApiErrorKind::InvalidResponse, Some(404), None),
            "{}",
            String::from_utf8_lossy(&envelope)
        );
    }
}

#[tokio::test]
async fn a_retry_after_date_becomes_seconds_from_now() {
    let stand_in = StandInServer::start().await;
    let later = httpdate::fmt_http_date(SystemTime::now() + Duration::from_secs(120));
    let envelope = json!({ "error": { "code": "rate_limited", "message": "Wait." } }).to_string();
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![RawReply::with_body(429, envelope).header("retry-after", &later)],
    );

    let error = refusal_of(&stand_in, None).await;

    let seconds = error
        .retry_after_seconds()
        .expect("the refusal carries a retry-after");
    assert!((100..=121).contains(&seconds), "{seconds}");
}

#[tokio::test]
async fn an_api_that_never_answers_raises_timeout_within_the_limit() {
    let stand_in = StandInServer::start().await;
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![RawReply::with_body(200, "{}").delayed(SLOW_ANSWER)],
    );
    let started = Instant::now();

    let error = refusal_of(&stand_in, Some(TIME_LIMIT)).await;

    assert_eq!(error.kind(), HimringApiErrorKind::Timeout);
    assert!(
        started.elapsed() < PROMPT_FAILURE,
        "{:?}",
        started.elapsed()
    );
}

#[tokio::test]
async fn an_answer_dripped_a_byte_at_a_time_cannot_outlast_the_time_limit() {
    let stand_in = StandInServer::start().await;
    stand_in.answer("GET", &list_databases_path(), vec![dripped_reply()]);
    let started = Instant::now();

    let error = refusal_of(&stand_in, Some(TIME_LIMIT)).await;

    assert_eq!(error.kind(), HimringApiErrorKind::Timeout);
    assert!(
        started.elapsed() < PROMPT_FAILURE,
        "{:?}",
        started.elapsed()
    );
}

#[tokio::test]
async fn a_time_limit_on_one_call_overrides_the_client_limit() {
    let stand_in = StandInServer::start().await;
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![RawReply::with_body(200, "{}").delayed(SLOW_ANSWER)],
    );
    let client = client_with_limit(&stand_in.base_url, None);
    let started = Instant::now();

    let error = refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .timeout(TIME_LIMIT)
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
async fn a_redirect_is_never_followed_so_the_key_stays_with_the_api() {
    let stand_in = StandInServer::start().await;
    let elsewhere = StandInServer::start().await;
    let reply =
        RawReply::status(307).header("location", &format!("{}/collect", elsewhere.base_url));
    stand_in.answer("GET", &list_databases_path(), vec![reply]);

    let error = refusal_of(&stand_in, None).await;

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::InvalidResponse, Some(307))
    );
    assert!(elsewhere.arrived(None).is_empty());
}

#[tokio::test]
async fn a_supplied_http_client_builder_cannot_turn_redirects_back_on() {
    let stand_in = StandInServer::start().await;
    let elsewhere = StandInServer::start().await;
    let reply =
        RawReply::status(302).header("location", &format!("{}/collect", elsewhere.base_url));
    stand_in.answer("GET", &list_databases_path(), vec![reply]);
    let following = himring::reqwest::Client::builder()
        .redirect(himring::reqwest::redirect::Policy::limited(5));
    let client = Himring::builder()
        .api_key(API_KEY)
        .base_url(&stand_in.base_url)
        .http_client_builder(following)
        .build()
        .expect("the test client builds");

    let error = refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .await,
    );

    assert_eq!(
        (error.kind(), error.status()),
        (HimringApiErrorKind::InvalidResponse, Some(302))
    );
    assert!(elsewhere.arrived(None).is_empty());
}

#[tokio::test]
async fn an_address_where_nothing_listens_raises_network() {
    let probe =
        std::net::TcpListener::bind("127.0.0.1:0").expect("the probe binds a loopback port");
    let port = probe.local_addr().expect("the probe has an address").port();
    drop(probe);
    let client = client_with_limit(&format!("http://127.0.0.1:{port}"), None);

    let error = refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::Network);
}

#[tokio::test]
async fn a_dripped_answer_and_a_shapeless_envelope_in_a_row_each_fail_on_their_own_terms() {
    let stand_in = StandInServer::start().await;
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![
            dripped_reply(),
            RawReply::with_body(400, r#"{"error": []}"#),
        ],
    );
    let client = client_with_limit(&stand_in.base_url, Some(TIME_LIMIT));
    let started = Instant::now();

    let timeout = refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .await,
    );
    let shapeless = refusal(
        client
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .await,
    );

    assert_eq!(timeout.kind(), HimringApiErrorKind::Timeout);
    assert!(
        started.elapsed() < PROMPT_FAILURE * 2,
        "{:?}",
        started.elapsed()
    );
    assert_eq!(
        (shapeless.kind(), shapeless.status()),
        (HimringApiErrorKind::InvalidResponse, Some(400))
    );
}

#[tokio::test]
async fn a_dropped_call_releases_its_connection_and_leaves_the_client_usable() {
    let stand_in = StandInServer::start().await;
    let page = json!({ "databases": [], "total_count": 0, "limit": 20, "offset": 0 }).to_string();
    stand_in.answer(
        "GET",
        &list_databases_path(),
        vec![
            RawReply::with_body(200, "{}")
                .delayed(SLOW_ANSWER)
                .hanging(),
            RawReply::with_body(200, page),
        ],
    );
    let client = client_with_limit(&stand_in.base_url, None);

    let abandoned = tokio::time::timeout(
        TIME_LIMIT,
        client.list_databases(ListDatabasesInput::new(PROJECT_ID)),
    )
    .await;
    let listed = client
        .list_databases(ListDatabasesInput::new(PROJECT_ID))
        .await;

    assert!(
        abandoned.is_err(),
        "the slow call finished before it was dropped"
    );
    assert_eq!(listed.expect("the next call succeeds").databases, []);
    tokio::time::sleep(SLOW_ANSWER + TIME_LIMIT).await;
    assert_eq!(stand_in.closed_early(), 1);
    assert_eq!(stand_in.arrived(Some("GET")).len(), 2);
}
