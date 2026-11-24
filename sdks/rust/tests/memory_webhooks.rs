use std::fmt::Write as _;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use himring::{
    MemoryWebhookError, MemoryWebhookEvent, MemoryWebhookRejection, MemoryWebhookVerification,
    verify_memory_webhook,
};
use hmac::{Hmac, KeyInit, Mac};
use serde_json::{Value, json};
use sha2::Sha256;

const SECRET: &str = "whsec_memory_test";
const SIGNED_AT_SECONDS: u64 = 1_795_512_600;
const TOLERANCE_SECONDS: u64 = 300;
const ARABIC_INDIC_DIGIT_ONE: char = '\u{0661}';

fn event() -> Value {
    json!({
        "id": "evt_1",
        "type": "memory.decision.applied",
        "created_at": "2026-11-24T09:30:00.000Z",
        "project_id": "prj_11111111111111111111111111111111",
        "memory_id": "mem_1",
        "decision": { "id": "dec_1", "memory_id": "mem_1", "kind": "kept", "reason": "Confirmed twice." },
    })
}

fn body() -> Vec<u8> {
    serde_json::to_vec(&event()).expect("the event serializes")
}

fn at(seconds: u64) -> SystemTime {
    UNIX_EPOCH + Duration::from_secs(seconds)
}

fn signature_with(body: &[u8], secret: &str, timestamp: u64) -> String {
    let mut mac =
        Hmac::<Sha256>::new_from_slice(secret.as_bytes()).expect("any key length is accepted");
    mac.update(format!("{timestamp}.").as_bytes());
    mac.update(body);
    let digest = mac
        .finalize()
        .into_bytes()
        .iter()
        .fold(String::new(), |mut text, byte| {
            write!(text, "{byte:02x}").expect("writing to a String succeeds");
            text
        });
    format!("t={timestamp},v1={digest}")
}

fn signature_of(body: &[u8]) -> String {
    signature_with(body, SECRET, SIGNED_AT_SECONDS)
}

fn verified(
    body: &[u8],
    signature: &str,
    now: SystemTime,
) -> Result<MemoryWebhookEvent, MemoryWebhookError> {
    verify_memory_webhook(MemoryWebhookVerification::new(body, Some(signature), SECRET).now(now))
}

fn rejection_of(body: &[u8], signature: Option<&str>, now: SystemTime) -> MemoryWebhookRejection {
    match verify_memory_webhook(MemoryWebhookVerification::new(body, signature, SECRET).now(now)) {
        Err(MemoryWebhookError::Rejected(rejected)) => rejected.reason,
        other => {
            panic!("the verification was due to reject the request, and it returned {other:?}")
        }
    }
}

#[test]
fn returns_the_event_when_himring_signed_the_body() {
    let body = body();

    let event = verified(&body, &signature_of(&body), at(SIGNED_AT_SECONDS))
        .expect("the signature verifies");

    assert_eq!(
        serde_json::to_value(&event).expect("the event serializes"),
        self::event()
    );
    assert_eq!(event.event_type, "memory.decision.applied");
}

#[test]
fn accepts_the_new_signature_while_the_secret_rotates() {
    let body = body();
    let old_signature = signature_with(&body, "whsec_old", SIGNED_AT_SECONDS);
    let old_digest = old_signature
        .split(',')
        .nth(1)
        .expect("the signature holds a digest");
    let header = format!("{},{old_digest}", signature_of(&body));

    assert!(verified(&body, &header, at(SIGNED_AT_SECONDS)).is_ok());
}

#[test]
fn rejects_a_body_or_signature_that_himring_did_not_produce() {
    let body = body();
    let signed = signature_of(&body);
    let tampered = String::from_utf8(body.clone())
        .expect("the body is text")
        .replace("kept", "dropped")
        .into_bytes();
    let mut trailing_space = body.clone();
    trailing_space.push(b' ');
    let cases: Vec<(Vec<u8>, String)> = vec![
        (tampered, signed.clone()),
        (trailing_space, signed.clone()),
        (Vec::new(), signed.clone()),
        (
            body.clone(),
            signature_with(&body, "whsec_attacker", SIGNED_AT_SECONDS),
        ),
        (
            body.clone(),
            signature_with(&body, &SECRET.to_uppercase(), SIGNED_AT_SECONDS),
        ),
        (body.clone(), signed.to_uppercase()),
        (body.clone(), format!("t={SIGNED_AT_SECONDS}")),
        (body.clone(), format!("{signed},t={SIGNED_AT_SECONDS}")),
        (
            body.clone(),
            format!("t={},{signed}", SIGNED_AT_SECONDS - 600),
        ),
        (
            body.clone(),
            signed.replace(
                &format!("t={SIGNED_AT_SECONDS}"),
                &format!("t={}", SIGNED_AT_SECONDS + 1),
            ),
        ),
        (
            body.clone(),
            signed.replace("t=", &format!("t={ARABIC_INDIC_DIGIT_ONE}")),
        ),
        (body.clone(), signed.replace("v1=", "v0=")),
        (body.clone(), format!("{signed},{}", "x".repeat(4_096))),
        (body.clone(), format!("v1={}", "0".repeat(64))),
        (
            body.clone(),
            signed.replace(&format!("t={SIGNED_AT_SECONDS},"), ""),
        ),
    ];
    for (body, signature) in cases {
        assert_eq!(
            rejection_of(&body, Some(&signature), at(SIGNED_AT_SECONDS)),
            MemoryWebhookRejection::SignatureInvalid,
            "{signature}"
        );
    }
}

#[test]
fn rejects_a_request_without_a_signature() {
    for signature in [None, Some(""), Some("   ")] {
        assert_eq!(
            rejection_of(&body(), signature, at(SIGNED_AT_SECONDS)),
            MemoryWebhookRejection::SignatureMissing
        );
    }
}

#[test]
fn rejects_a_replay_signed_outside_the_tolerance() {
    let body = body();
    for now in [
        SIGNED_AT_SECONDS + TOLERANCE_SECONDS + 1,
        SIGNED_AT_SECONDS - TOLERANCE_SECONDS - 1,
    ] {
        assert_eq!(
            rejection_of(&body, Some(&signature_of(&body)), at(now)),
            MemoryWebhookRejection::TimestampOutsideTolerance
        );
    }
    let ancient = signature_with(&body, SECRET, 0);
    assert_eq!(
        rejection_of(&body, Some(&ancient), at(SIGNED_AT_SECONDS)),
        MemoryWebhookRejection::TimestampOutsideTolerance
    );
    let largest_timestamp = signature_with(&body, SECRET, 999_999_999_999);
    assert_eq!(
        rejection_of(&body, Some(&largest_timestamp), at(SIGNED_AT_SECONDS)),
        MemoryWebhookRejection::TimestampOutsideTolerance
    );
    let thirteen_digits = signature_with(&body, SECRET, 1_000_000_000_000);
    assert_eq!(
        rejection_of(&body, Some(&thirteen_digits), at(SIGNED_AT_SECONDS)),
        MemoryWebhookRejection::SignatureInvalid
    );
}

#[test]
fn accepts_a_request_signed_exactly_at_either_edge_of_the_tolerance() {
    let body = body();
    for now in [
        SIGNED_AT_SECONDS + TOLERANCE_SECONDS,
        SIGNED_AT_SECONDS - TOLERANCE_SECONDS,
    ] {
        assert!(
            verified(&body, &signature_of(&body), at(now)).is_ok(),
            "{now}"
        );
    }
}

#[test]
fn rejects_a_signed_body_that_is_not_a_memory_event() {
    let with = |field: &str, value: Value| {
        let mut changed = event();
        changed[field] = value;
        serde_json::to_vec(&changed).expect("the event serializes")
    };
    let bodies: Vec<Vec<u8>> = vec![
        b"\xff\xfe not utf-8".to_vec(),
        b"[]".to_vec(),
        br#"{"id": "evt_1", "value": NaN}"#.to_vec(),
        br#"{"id": "evt_1"}"#.to_vec(),
        with("decision", Value::Null),
        with("id", json!("")),
        with("decision", json!({ "id": "dec_1", "memory_id": "mem_1" })),
    ];
    for body in bodies {
        assert_eq!(
            rejection_of(&body, Some(&signature_of(&body)), at(SIGNED_AT_SECONDS)),
            MemoryWebhookRejection::EventInvalid,
            "{}",
            String::from_utf8_lossy(&body)
        );
    }
}

#[test]
fn refuses_settings_that_would_accept_anything() {
    let body = body();
    let signature = signature_of(&body);
    let empty_secret =
        MemoryWebhookVerification::new(&body, Some(&signature), "").now(at(SIGNED_AT_SECONDS));
    let no_tolerance = MemoryWebhookVerification::new(&body, Some(&signature), SECRET)
        .tolerance(Duration::ZERO)
        .now(at(SIGNED_AT_SECONDS));

    assert!(matches!(
        verify_memory_webhook(empty_secret),
        Err(MemoryWebhookError::InvalidSettings(_))
    ));
    assert!(matches!(
        verify_memory_webhook(no_tolerance),
        Err(MemoryWebhookError::InvalidSettings(_))
    ));
}
