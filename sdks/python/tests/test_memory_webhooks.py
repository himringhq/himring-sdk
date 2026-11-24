from __future__ import annotations

import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone

import pytest

from himring import MemoryWebhookRejected, verify_memory_webhook

SECRET = "whsec_memory_test"
SIGNED_AT = datetime(2026, 11, 24, 9, 30, tzinfo=timezone.utc)
TOLERANCE_SECONDS = 300
ARABIC_INDIC_DIGIT_ONE = chr(0x0661)
EVENT = {
    "id": "evt_1",
    "type": "memory.decision.applied",
    "created_at": "2026-11-24T09:30:00.000Z",
    "project_id": "prj_" + "1" * 32,
    "memory_id": "mem_1",
    "decision": {"id": "dec_1", "memory_id": "mem_1", "kind": "kept", "reason": "Confirmed twice."},
}
BODY = json.dumps(EVENT).encode()


def signature_of(body: bytes, secret: str = SECRET, signed_at: datetime = SIGNED_AT) -> str:
    timestamp = int(signed_at.timestamp())
    digest = hmac.new(secret.encode(), f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()
    return f"t={timestamp},v1={digest}"


def rejection_of(body: bytes | str, signature: str | None, now: datetime = SIGNED_AT) -> str:
    with pytest.raises(MemoryWebhookRejected) as rejected:
        verify_memory_webhook(body=body, signature=signature, secret=SECRET, now=now)
    return rejected.value.reason


def test_returns_the_event_when_himring_signed_the_body() -> None:
    event = verify_memory_webhook(
        body=BODY, signature=signature_of(BODY), now=SIGNED_AT, secret=SECRET
    )

    assert event == EVENT
    text_event = verify_memory_webhook(
        body=BODY.decode(), signature=signature_of(BODY), now=SIGNED_AT, secret=SECRET
    )
    assert text_event == EVENT


def test_accepts_the_new_signature_while_the_secret_rotates() -> None:
    old = signature_of(BODY, secret="whsec_old").split(",")[1]
    header = f"{signature_of(BODY)},{old}"

    assert verify_memory_webhook(body=BODY, signature=header, secret=SECRET, now=SIGNED_AT) == EVENT


@pytest.mark.parametrize(
    ("body", "signature"),
    [
        (BODY.replace(b"kept", b"dropped"), signature_of(BODY)),
        (BODY, signature_of(BODY, secret="whsec_attacker")),
        (BODY, signature_of(BODY).upper()),
        (BODY, f"t={int(SIGNED_AT.timestamp())}"),
        (BODY, f"{signature_of(BODY)},t={int(SIGNED_AT.timestamp())}"),
        (BODY, signature_of(BODY).replace("t=", f"t={ARABIC_INDIC_DIGIT_ONE}")),
        (BODY, signature_of(BODY) + "," + "x" * 4_096),
        (BODY, "v1=" + "0" * 64),
    ],
)
def test_rejects_a_body_or_signature_that_himring_did_not_produce(
    body: bytes, signature: str
) -> None:
    assert rejection_of(body, signature) == "signature_invalid"


@pytest.mark.parametrize("signature", [None, "", "   "])
def test_rejects_a_request_without_a_signature(signature: str | None) -> None:
    assert rejection_of(BODY, signature) == "signature_missing"


@pytest.mark.parametrize("offset_seconds", [TOLERANCE_SECONDS + 1, -(TOLERANCE_SECONDS + 1)])
def test_rejects_a_replay_signed_outside_the_tolerance(offset_seconds: int) -> None:
    now = SIGNED_AT + timedelta(seconds=offset_seconds)

    assert rejection_of(BODY, signature_of(BODY), now) == "timestamp_outside_tolerance"


def test_accepts_a_request_signed_exactly_at_the_tolerance() -> None:
    now = SIGNED_AT + timedelta(seconds=TOLERANCE_SECONDS)

    assert (
        verify_memory_webhook(body=BODY, signature=signature_of(BODY), secret=SECRET, now=now)
        == EVENT
    )


@pytest.mark.parametrize(
    "body",
    [
        b"\xff\xfe not utf-8",
        b"[]",
        b'{"id": "evt_1", "value": NaN}',
        json.dumps({**EVENT, "decision": None}).encode(),
        json.dumps({**EVENT, "id": ""}).encode(),
        json.dumps({**EVENT, "decision": {"id": "dec_1", "memory_id": "mem_1"}}).encode(),
    ],
)
def test_rejects_a_signed_body_that_is_not_a_memory_event(body: bytes) -> None:
    assert rejection_of(body, signature_of(body)) == "event_invalid"


@pytest.mark.parametrize(
    ("secret", "tolerance"), [("", 300.0), (SECRET, 0.0), (SECRET, -5.0), (SECRET, float("nan"))]
)
def test_refuses_settings_that_would_accept_anything(secret: str, tolerance: float) -> None:
    with pytest.raises(ValueError):
        verify_memory_webhook(
            body=BODY, signature=signature_of(BODY), secret=secret, tolerance_seconds=tolerance
        )
