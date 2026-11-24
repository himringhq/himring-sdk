#[allow(dead_code, unused_imports)]
mod support;

use std::time::Duration;

use himring::types::ListDatabasesInput;
use himring::{Himring, HimringApiErrorKind};
use support::{API_KEY, ContractApi, PROJECT_ID, client_for, refusal};

fn builds(builder: himring::HimringBuilder) -> bool {
    builder.build().is_ok()
}

#[test]
fn refuses_a_custom_header_that_the_client_sets_itself() {
    for header in ["Authorization", "content-type", "Content-Length", "HOST"] {
        let built = Himring::builder()
            .api_key(API_KEY)
            .header(header, "value")
            .build();

        assert_eq!(
            refusal(built).kind(),
            HimringApiErrorKind::InvalidInput,
            "{header}"
        );
    }
}

#[test]
fn refuses_a_custom_header_that_could_split_the_request() {
    for (name, value) in [
        ("x-trace", "a\r\nauthorization: Bearer stolen"),
        ("x trace", "a"),
        ("x-name", "café"),
    ] {
        assert!(
            !builds(Himring::builder().api_key(API_KEY).header(name, value)),
            "{name}"
        );
    }
}

#[test]
fn refuses_a_credential_that_is_not_one_header_token() {
    for credential in ["", "hk live", "hk_live\r\nx-admin: 1", "hk_é"] {
        assert!(
            !builds(Himring::builder().api_key(credential)),
            "{credential:?}"
        );
    }
    assert!(!builds(
        Himring::builder()
            .api_key(API_KEY)
            .session_token("st_session")
    ));
}

#[test]
fn refuses_a_base_url_that_is_not_a_plain_http_address() {
    for base_url in [
        "ftp://api.himring.ai",
        "file:///etc/passwd",
        "https://admin:secret@api.himring.ai",
        "https://api.himring.ai/?region=eu",
        "https://api.himring.ai/#fragment",
        "https://",
        "api.himring.ai",
        "",
    ] {
        assert!(
            !builds(Himring::builder().api_key(API_KEY).base_url(base_url)),
            "{base_url}"
        );
    }
    assert!(builds(Himring::builder().api_key(API_KEY)));
}

#[tokio::test]
async fn refuses_a_zero_time_limit_on_the_client_or_on_one_call_before_sending() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);

    let error = refusal(
        himring
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .timeout(Duration::ZERO)
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    assert!(!builds(
        Himring::builder().api_key(API_KEY).timeout(Duration::ZERO)
    ));
    assert!(!builds(
        Himring::builder()
            .api_key(API_KEY)
            .upload_idle_timeout(Duration::ZERO)
    ));
    contract.assert_untouched().await;
}
