from __future__ import annotations

import io
import os
import time
from collections.abc import Callable
from typing import cast

import pytest

from himring import AddedFile, Himring, HimringApiError, UploadContent

from .conftest import KNOWLEDGE_BASE_ID, PROJECT_ID
from .contract_api import ContractApi
from .stand_in_server import RawReply, StandInServer
from .upload_records import (
    FILE_ID,
    FILE_PATH,
    UPLOAD_ID,
    part_slices,
    sha256_of,
    signed_part,
    signed_parts,
    upload_record,
)

PART_BYTES = 64 * 1024
MULTIPART_CONTENT_BYTES = 5 * PART_BYTES + 10
STORAGE_PAUSE_SECONDS = 0.15
PARTS_IN_FLIGHT_LIMIT = 4
FIRST_TWO_POLLS_SECONDS = 0.6


def add_file(
    himring: Himring,
    content: UploadContent,
    on_progress: Callable[[int], object] | None = None,
    content_sha256: str | None = None,
) -> AddedFile:
    return himring.add_file(
        project_id=PROJECT_ID,
        knowledge_base_id=KNOWLEDGE_BASE_ID,
        path=FILE_PATH,
        content=content,
        content_sha256=content_sha256,
        on_progress=on_progress,
    )


def script_multipart(contract: ContractApi, storage: StandInServer, content: bytes) -> None:
    contract.stub(
        "create_upload",
        201,
        {"upload": upload_record(content, state="open", part_bytes=PART_BYTES), "parts": []},
    )
    contract.stub("sign_upload_parts", 200, signed_parts(storage.base_url, content, PART_BYTES))
    completed = upload_record(content, state="completed", part_bytes=PART_BYTES)
    contract.stub("complete_upload", 200, completed)
    contract.stub("get_upload", 200, completed)
    contract.stub(
        "cancel_upload", 200, upload_record(content, state="failed", part_bytes=PART_BYTES)
    )


def script_single(contract: ContractApi, url: str, content: bytes) -> None:
    created = {
        "upload": upload_record(content, state="open"),
        "parts": [signed_part(url, 1, len(content))],
    }
    contract.stub("create_upload", 201, created)
    contract.stub("sign_upload_parts", 200, {"parts": [signed_part(url, 1, len(content))]})
    contract.stub("complete_upload", 200, upload_record(content, state="completed"))
    contract.stub("cancel_upload", 200, upload_record(content, state="failed"))


def signed_part_numbers(contract: ContractApi) -> list[int]:
    numbers: list[int] = []
    for request in contract.requests_for("sign_upload_parts"):
        body = cast("dict[str, list[dict[str, object]]]", request.body)
        numbers.extend(int(str(part["part_number"])) for part in body["parts"])
    return sorted(numbers)


def signed_digests(contract: ContractApi) -> dict[int, str]:
    digests: dict[int, str] = {}
    for request in contract.requests_for("sign_upload_parts"):
        for part in cast("dict[str, list[dict[str, object]]]", request.body)["parts"]:
            digests[int(str(part["part_number"]))] = str(part["sha256"])
    return digests


def test_sends_a_single_file_to_storage_without_the_api_key(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(300_000)
    script_single(contract, f"{storage.base_url}/parts/1", content)

    added = add_file(himring, content)

    assert (added["outcome"], added["file"]["id"]) == ("added", FILE_ID)
    [put] = storage.arrived("PUT")
    assert put.body == content
    assert "authorization" not in put.headers
    assert put.headers["x-amz-checksum-sha256"] == "part-1"
    assert put.headers["content-length"] == str(len(content))
    [create] = contract.requests_for("create_upload")
    assert create.body == {
        "path": FILE_PATH,
        "size_bytes": len(content),
        "content_sha256": sha256_of(content),
    }
    assert [request.operation_id for request in contract.assert_clean()] == [
        "create_upload",
        "complete_upload",
    ]


def test_sends_a_large_file_in_parts_with_at_most_four_in_flight(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)
    for path in part_slices(content, PART_BYTES):
        storage.answer("PUT", path, RawReply(200, delay_seconds=STORAGE_PAUSE_SECONDS))
    progress: list[int] = []

    add_file(himring, io.BytesIO(content), on_progress=progress.append)

    arrived = {put.path: put.body for put in storage.arrived("PUT")}
    assert arrived == part_slices(content, PART_BYTES)
    assert 1 < storage.state.most_in_flight <= PARTS_IN_FLIGHT_LIMIT
    assert all("authorization" not in put.headers for put in storage.arrived("PUT"))
    assert sum(progress) == len(content)
    expected_digests = {
        number: sha256_of(part)
        for number, part in enumerate(part_slices(content, PART_BYTES).values(), start=1)
    }
    assert signed_digests(contract) == expected_digests
    contract.assert_clean()


def test_signs_a_part_again_when_storage_answers_503(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)
    storage.answer("PUT", "/parts/2", RawReply(503), RawReply(200))

    add_file(himring, content)

    assert signed_part_numbers(contract) == [1, 2, 2, 3, 4, 5, 6]
    assert [put.path for put in storage.arrived("PUT")].count("/parts/2") == 2
    assert contract.requests_for("cancel_upload") == []
    contract.assert_clean()


def test_cancels_the_upload_when_storage_refuses_a_part(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)
    storage.answer("PUT", "/parts/3", RawReply(400))

    with pytest.raises(HimringApiError) as refusal:
        add_file(himring, content)

    assert (refusal.value.kind, refusal.value.status) == ("refused", 400)
    assert len(contract.requests_for("cancel_upload")) == 1
    assert contract.requests_for("complete_upload") == []
    contract.assert_clean()


@pytest.mark.parametrize(
    "url", ["file:///etc/passwd", "ftp://storage.example/part", "gopher://x", "not a url"]
)
def test_never_follows_a_storage_link_with_another_scheme(
    himring: Himring, contract: ContractApi, storage: StandInServer, url: str
) -> None:
    content = os.urandom(1_000)
    script_single(contract, url, content)

    with pytest.raises(HimringApiError) as refusal:
        add_file(himring, content)

    assert refusal.value.kind == "invalid_response"
    assert storage.arrived() == []
    assert len(contract.requests_for("cancel_upload")) == 1
    contract.assert_clean()


@pytest.mark.parametrize(
    ("part_bytes", "part_count"),
    [(PART_BYTES, 3), (PART_BYTES, 7), (0, 0), (1, MULTIPART_CONTENT_BYTES)],
)
def test_refuses_a_part_plan_that_does_not_fit_the_file(
    himring: Himring,
    contract: ContractApi,
    storage: StandInServer,
    part_bytes: int,
    part_count: int,
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)
    plan = upload_record(content, state="open", part_bytes=part_bytes, part_count=part_count)
    contract.stub("create_upload", 201, {"upload": plan, "parts": []})

    with pytest.raises(HimringApiError) as refusal:
        add_file(himring, content)

    assert refusal.value.kind == "invalid_response"
    assert contract.requests_for("sign_upload_parts") == []
    assert storage.arrived() == []
    assert len(contract.requests_for("cancel_upload")) == 1


def test_waits_while_himring_checks_the_file_then_returns_it(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(2_000)
    script_single(contract, f"{storage.base_url}/parts/1", content)
    contract.stub("complete_upload", 200, upload_record(content, state="checking"))
    checking = {"status": 200, "body": upload_record(content, state="checking")}
    completed = {"status": 200, "body": upload_record(content, state="completed")}
    contract.script("get_upload", [checking, completed])
    started = time.monotonic()

    added = add_file(himring, content)

    assert added["file"]["id"] == FILE_ID
    assert time.monotonic() - started >= FIRST_TWO_POLLS_SECONDS
    assert len(contract.requests_for("get_upload")) == 2
    contract.assert_clean()


def test_raises_the_documented_failure_of_the_upload_without_cancelling_it(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(2_000)
    script_single(contract, f"{storage.base_url}/parts/1", content)
    failed = upload_record(content, state="failed", failure_code="upload_part_mismatch")
    contract.stub("complete_upload", 200, failed)

    with pytest.raises(HimringApiError) as refusal:
        add_file(himring, content)

    assert (refusal.value.kind, refusal.value.code, refusal.value.status) == (
        "refused",
        "upload_part_mismatch",
        400,
    )
    assert contract.requests_for("cancel_upload") == []
    contract.assert_clean()


def test_reads_the_upload_when_himring_closed_it_while_parts_were_sent(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)
    contract.stub(
        "sign_upload_parts", 409, {"error": {"code": "upload_closed", "message": "Closed."}}
    )

    added = add_file(himring, content)

    assert added["outcome"] == "added"
    assert contract.requests_for("complete_upload") == []
    assert contract.requests_for("cancel_upload") == []
    contract.assert_clean()


def test_a_progress_callback_can_call_back_into_the_client(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)
    states: list[str] = []

    def read_back(sent: int) -> None:
        upload = himring.get_upload(
            project_id=PROJECT_ID, knowledge_base_id=KNOWLEDGE_BASE_ID, upload_id=UPLOAD_ID
        )
        states.append(f"{upload['state']}:{sent}")

    add_file(himring, content, on_progress=read_back)

    assert len(states) == len(part_slices(content, PART_BYTES))
    assert len(contract.requests_for("complete_upload")) == 1
    contract.assert_clean()


def test_cancels_the_upload_when_the_progress_callback_raises(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(MULTIPART_CONTENT_BYTES)
    script_multipart(contract, storage, content)

    def stop(sent: int) -> None:
        raise RuntimeError(f"The caller gave up after {sent} bytes.")

    with pytest.raises(RuntimeError):
        add_file(himring, content, on_progress=stop)

    assert len(contract.requests_for("cancel_upload")) == 1
    assert contract.requests_for("complete_upload") == []


class ShrinkingSource:
    size_bytes = MULTIPART_CONTENT_BYTES

    def read(self, start: int, end: int) -> bytes:
        return b"x" * max(0, end - start - 1)


def test_cancels_the_upload_when_the_file_shrinks_while_it_is_sent(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    content = b"x" * MULTIPART_CONTENT_BYTES
    script_multipart(contract, storage, content)

    with pytest.raises(HimringApiError) as refusal:
        add_file(himring, ShrinkingSource(), content_sha256=sha256_of(content))

    assert refusal.value.kind == "invalid_input"
    assert len(contract.requests_for("cancel_upload")) == 1
    assert storage.arrived("PUT") == []


@pytest.mark.parametrize("digest", ["A" * 64, "0" * 63, "g" * 64, ""])
def test_refuses_a_sha256_that_is_not_lowercase_hex_before_sending(
    himring: Himring, contract: ContractApi, digest: str
) -> None:
    with pytest.raises(HimringApiError) as refusal:
        add_file(himring, b"data", content_sha256=digest)

    assert refusal.value.kind == "invalid_input"
    assert contract.recorded() == ([], [])
