from __future__ import annotations

import hashlib
import hmac
import json
import math
import re
from datetime import datetime, timezone
from typing import Final, Literal, TypedDict, cast

MemoryWebhookRejection = Literal[
    "signature_missing", "signature_invalid", "timestamp_outside_tolerance", "event_invalid"
]

MEMORY_WEBHOOK_REJECTIONS: Final[tuple[MemoryWebhookRejection, ...]] = (
    "signature_missing",
    "signature_invalid",
    "timestamp_outside_tolerance",
    "event_invalid",
)
MEMORY_WEBHOOK_SIGNATURE_HEADER: Final = "himring-signature"
MEMORY_WEBHOOK_EVENT_ID_HEADER: Final = "himring-event-id"
DEFAULT_MEMORY_WEBHOOK_TOLERANCE_SECONDS: Final = 300

SIGNATURE_VERSION = "v1"
SIGNATURE_HEADER_MAXIMUM_LENGTH = 4_096
HEX_DIGEST_PATTERN = re.compile(r"[0-9a-f]{64}")
UNIX_SECONDS_PATTERN = re.compile(r"[0-9]{1,12}")
EVENT_TEXT_FIELDS = ("created_at", "project_id", "memory_id")
EVENT_NONEMPTY_FIELDS = ("id", "type")
DECISION_TEXT_FIELDS = ("id", "memory_id", "kind")


class MemoryWebhookEvent(TypedDict):
    id: str
    type: str
    created_at: str
    project_id: str
    memory_id: str
    decision: dict[str, object]


class MemoryWebhookRejected(Exception):
    def __init__(self, reason: MemoryWebhookRejection, message: str) -> None:
        super().__init__(message)
        self.reason: MemoryWebhookRejection = reason
        self.message = message


def _signed_parts_of(header: str) -> tuple[int, list[bytes]] | None:
    if len(header) > SIGNATURE_HEADER_MAXIMUM_LENGTH:
        return None
    timestamp: int | None = None
    digests: list[bytes] = []
    for part in header.split(","):
        key, separator, value = part.partition("=")
        key, value = key.strip(), value.strip()
        if not separator or not key:
            continue
        if key == "t":
            if timestamp is not None or not UNIX_SECONDS_PATTERN.fullmatch(value):
                return None
            timestamp = int(value)
        elif key == SIGNATURE_VERSION and HEX_DIGEST_PATTERN.fullmatch(value):
            digests.append(bytes.fromhex(value))
    if timestamp is None or not digests:
        return None
    return timestamp, digests


def _body_bytes_of(body: str | bytes) -> bytes | None:
    if isinstance(body, bytes):
        return body
    try:
        return body.encode("utf-8")
    except UnicodeEncodeError:
        return None


def _signed_by_himring(timestamp: int, digests: list[bytes], body: bytes, secret: str) -> bool:
    expected = hmac.new(
        secret.encode("utf-8"), f"{timestamp}.".encode() + body, hashlib.sha256
    ).digest()
    matched = False
    for digest in digests:
        matched = hmac.compare_digest(expected, digest) or matched
    return matched


def _refuse_constant(constant: str) -> object:
    raise ValueError(f"The body holds {constant}, which JSON does not allow.")


def _parsed_event(body: bytes) -> MemoryWebhookEvent:
    try:
        text = body.decode("utf-8")
    except UnicodeDecodeError as error:
        raise MemoryWebhookRejected("event_invalid", "The body is not UTF-8 text.") from error
    try:
        value: object = json.loads(text, parse_constant=_refuse_constant)
    except ValueError as error:
        raise MemoryWebhookRejected("event_invalid", "The body is not JSON.") from error
    if not isinstance(value, dict):
        raise MemoryWebhookRejected("event_invalid", "The body is not a Memory webhook event.")
    event = cast("dict[str, object]", value)
    decision = event.get("decision")
    well_shaped = (
        all(
            isinstance(event.get(name), str) and event.get(name) != ""
            for name in EVENT_NONEMPTY_FIELDS
        )
        and all(isinstance(event.get(name), str) for name in EVENT_TEXT_FIELDS)
        and isinstance(decision, dict)
        and all(
            isinstance(cast("dict[str, object]", decision).get(name), str)
            for name in DECISION_TEXT_FIELDS
        )
    )
    if not well_shaped:
        raise MemoryWebhookRejected("event_invalid", "The body is not a Memory webhook event.")
    return cast("MemoryWebhookEvent", event)


def verify_memory_webhook(
    *,
    body: str | bytes,
    signature: str | None,
    secret: str,
    tolerance_seconds: float = DEFAULT_MEMORY_WEBHOOK_TOLERANCE_SECONDS,
    now: datetime | None = None,
) -> MemoryWebhookEvent:
    if (
        isinstance(tolerance_seconds, bool)
        or not math.isfinite(tolerance_seconds)
        or tolerance_seconds <= 0
    ):
        raise ValueError("Set tolerance_seconds to a number of seconds above 0.")
    if not secret:
        raise ValueError("Pass the signing secret of the webhook.")
    header = signature or ""
    if not header.strip():
        raise MemoryWebhookRejected(
            "signature_missing", "The request carries no himring-signature header."
        )
    parts = _signed_parts_of(header)
    body_bytes = _body_bytes_of(body)
    if (
        parts is None
        or body_bytes is None
        or not _signed_by_himring(parts[0], parts[1], body_bytes, secret)
    ):
        raise MemoryWebhookRejected(
            "signature_invalid", "The signature does not match the body and the secret."
        )
    moment = now if now is not None else datetime.now(timezone.utc)
    now_seconds = math.floor(moment.timestamp())
    if abs(now_seconds - parts[0]) > tolerance_seconds:
        raise MemoryWebhookRejected(
            "timestamp_outside_tolerance",
            f"Himring signed the request more than {tolerance_seconds:g} seconds away from now.",
        )
    return _parsed_event(body_bytes)
