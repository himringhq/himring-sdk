from __future__ import annotations

import asyncio
import json
import socket
import time

import pytest

from himring import AsyncHimring, Himring, HimringApiError

from .conftest import API_KEY, PROJECT_ID
from .stand_in_server import RawReply, StandInServer

LIST_DATABASES_PATH = f"/v1/projects/{PROJECT_ID}/databases"
SLOW_ANSWER_SECONDS = 2.0
TIME_LIMIT_SECONDS = 0.3
PROMPT_FAILURE_SECONDS = 1.2
DRIP_PAUSE_SECONDS = 0.1
DRIPPED_BYTES = 40
GONE = {"code": "not_found", "message": "Gone."}
WRONG_SHAPED_ENVELOPES = [
    b"[]",
    b"null",
    b'{"error": "not_found"}',
    b'{"error": {"code": 404, "message": "Gone."}}',
    b'{"error": {"code": "not_found"}}',
    json.dumps({"error": {**GONE, "details": None}}).encode(),
    json.dumps({"error": {**GONE, "issues": [{"message": 1, "path": []}]}}).encode(),
    json.dumps({"error": {**GONE, "issues": [{"message": "x", "path": [True]}]}}).encode(),
    json.dumps({"error": {**GONE, "missing_permission": {"level": "read"}}}).encode(),
    json.dumps({"error": {**GONE, "request_id": 7}}).encode(),
]


def _refusal_of(stand_in: StandInServer, timeout_seconds: float | None = None) -> HimringApiError:
    client = Himring(api_key=API_KEY, base_url=stand_in.base_url, timeout_seconds=timeout_seconds)
    with client, pytest.raises(HimringApiError) as refusal:
        client.list_databases(project_id=PROJECT_ID)
    return refusal.value


def test_a_success_answer_that_is_not_json_raises_invalid_response(stand_in: StandInServer) -> None:
    stand_in.answer("GET", LIST_DATABASES_PATH, RawReply(200, b"<html>Sign in to the proxy</html>"))

    error = _refusal_of(stand_in)

    assert (error.kind, error.status) == ("invalid_response", 200)


def test_a_proxy_error_page_raises_invalid_response_with_its_status_and_request_id(
    stand_in: StandInServer,
) -> None:
    stand_in.answer(
        "GET",
        LIST_DATABASES_PATH,
        RawReply(502, b"<html>Bad gateway</html>", {"x-request-id": "req_proxy"}),
    )

    error = _refusal_of(stand_in)

    assert (error.kind, error.status, error.code, error.request_id) == (
        "invalid_response",
        502,
        None,
        "req_proxy",
    )


@pytest.mark.parametrize("envelope", WRONG_SHAPED_ENVELOPES)
def test_an_error_envelope_of_the_wrong_shape_raises_invalid_response(
    stand_in: StandInServer, envelope: bytes
) -> None:
    stand_in.answer("GET", LIST_DATABASES_PATH, RawReply(404, envelope))

    error = _refusal_of(stand_in)

    assert (error.kind, error.status, error.code) == ("invalid_response", 404, None)


def test_a_retry_after_date_becomes_seconds_from_now(stand_in: StandInServer) -> None:
    later = time.strftime("%a, %d %b %Y %H:%M:%S GMT", time.gmtime(time.time() + 120))
    envelope = json.dumps({"error": {"code": "rate_limited", "message": "Wait."}}).encode()
    stand_in.answer("GET", LIST_DATABASES_PATH, RawReply(429, envelope, {"retry-after": later}))

    error = _refusal_of(stand_in)

    assert error.retry_after_seconds is not None
    assert 100 <= error.retry_after_seconds <= 121


def test_an_api_that_never_answers_raises_timeout_within_the_limit(stand_in: StandInServer) -> None:
    stand_in.answer(
        "GET", LIST_DATABASES_PATH, RawReply(200, b"{}", delay_seconds=SLOW_ANSWER_SECONDS)
    )
    started = time.monotonic()

    error = _refusal_of(stand_in, timeout_seconds=TIME_LIMIT_SECONDS)

    assert error.kind == "timeout"
    assert time.monotonic() - started < PROMPT_FAILURE_SECONDS


def test_an_answer_dripped_a_byte_at_a_time_cannot_outlast_the_time_limit(
    stand_in: StandInServer,
) -> None:
    dripped = RawReply(200, b"{" + b" " * DRIPPED_BYTES + b"}", drip_seconds=DRIP_PAUSE_SECONDS)
    stand_in.answer("GET", LIST_DATABASES_PATH, dripped)
    started = time.monotonic()

    error = _refusal_of(stand_in, timeout_seconds=TIME_LIMIT_SECONDS)

    assert error.kind == "timeout"
    assert time.monotonic() - started < PROMPT_FAILURE_SECONDS


def test_a_redirect_is_never_followed_so_the_key_stays_with_the_api(
    stand_in: StandInServer,
) -> None:
    elsewhere = StandInServer()
    try:
        stand_in.answer(
            "GET",
            LIST_DATABASES_PATH,
            RawReply(307, b"", {"location": f"{elsewhere.base_url}/collect"}),
        )

        error = _refusal_of(stand_in)

        assert (error.kind, error.status) == ("invalid_response", 307)
        assert elsewhere.arrived() == []
    finally:
        elsewhere.stop()


def test_an_address_where_nothing_listens_raises_network() -> None:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    client = Himring(api_key=API_KEY, base_url=f"http://127.0.0.1:{port}")
    with client, pytest.raises(HimringApiError) as refusal:
        client.list_databases(project_id=PROJECT_ID)

    assert refusal.value.kind == "network"


def test_the_async_client_bounds_a_dripped_answer_and_refuses_a_shapeless_envelope(
    stand_in: StandInServer,
) -> None:
    dripped = RawReply(200, b"{" + b" " * DRIPPED_BYTES + b"}", drip_seconds=DRIP_PAUSE_SECONDS)
    stand_in.answer("GET", LIST_DATABASES_PATH, dripped, RawReply(400, b'{"error": []}'))

    async def scenario() -> list[HimringApiError]:
        errors: list[HimringApiError] = []
        async with AsyncHimring(
            api_key=API_KEY, base_url=stand_in.base_url, timeout_seconds=TIME_LIMIT_SECONDS
        ) as client:
            for _ in range(2):
                try:
                    await client.list_databases(project_id=PROJECT_ID)
                except HimringApiError as error:
                    errors.append(error)
        return errors

    started = time.monotonic()
    timeout, shapeless = asyncio.run(scenario())

    assert timeout.kind == "timeout"
    assert time.monotonic() - started < PROMPT_FAILURE_SECONDS * 2
    assert (shapeless.kind, shapeless.status) == ("invalid_response", 400)
