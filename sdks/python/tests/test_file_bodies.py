from __future__ import annotations

import asyncio
import io
import json
import os
from typing import BinaryIO, cast

import pytest

from himring import AsyncHimring, Himring, HimringApiError, safe_download_name

from .conftest import API_KEY, KNOWLEDGE_BASE_ID, PROJECT_ID
from .contract_api import ContractApi

SAVED_QUESTIONS_LIMIT_BYTES = 4 * 1024 * 1024
IMPORT_ANSWER: dict[str, object] = {
    "added": 0,
    "refused_count": 0,
    "refused": [],
    "saved_questions": [],
}
INDEX_ID = "ix_" + "3" * 32
EXPORTED_LINES = '{"id": "rec_1", "text": "Refunds take 5 days."}\n'


class UnseekableUpload:
    def __init__(self, size: int) -> None:
        self._left = size

    def readable(self) -> bool:
        return True

    def seekable(self) -> bool:
        return False

    def read(self, size: int = -1) -> bytes:
        count = self._left if size < 0 else min(size, self._left)
        self._left -= count
        return b"q" * count


def _upload(himring: Himring, content: bytes | BinaryIO) -> object:
    return himring.import_saved_questions(
        project_id=PROJECT_ID, knowledge_base_id=KNOWLEDGE_BASE_ID, format="jsonl", content=content
    )


def test_sends_a_file_of_exactly_the_documented_limit_as_octet_stream(
    himring: Himring, contract: ContractApi
) -> None:
    contract.stub("import_saved_questions", 201, IMPORT_ANSWER)

    assert _upload(himring, os.urandom(SAVED_QUESTIONS_LIMIT_BYTES)) == IMPORT_ANSWER

    [request] = contract.assert_clean()
    assert request.raw_body_bytes == SAVED_QUESTIONS_LIMIT_BYTES
    assert request.headers["content-type"] == "application/octet-stream"
    assert request.headers["content-length"] == str(SAVED_QUESTIONS_LIMIT_BYTES)
    assert request.query == {"format": "jsonl"}


def test_refuses_a_file_one_byte_past_the_limit_before_sending(
    himring: Himring, contract: ContractApi
) -> None:
    oversized = io.BytesIO(b"q" * (SAVED_QUESTIONS_LIMIT_BYTES + 1))

    with pytest.raises(HimringApiError) as refusal:
        _upload(himring, oversized)

    assert refusal.value.kind == "invalid_input"
    assert contract.recorded() == ([], [])


def test_stops_an_unmeasurable_stream_once_it_passes_the_limit(
    himring: Himring, contract: ContractApi
) -> None:
    stream = cast("BinaryIO", UnseekableUpload(SAVED_QUESTIONS_LIMIT_BYTES + 1))

    with pytest.raises(HimringApiError) as refusal:
        _upload(himring, stream)

    assert refusal.value.kind == "invalid_input"
    requests, _ = contract.recorded()
    assert [
        request for request in requests if request.raw_body_bytes > SAVED_QUESTIONS_LIMIT_BYTES
    ] == []


def test_refuses_a_file_opened_in_text_mode(himring: Himring, contract: ContractApi) -> None:
    text_file = cast("BinaryIO", io.StringIO("question,path\n"))

    with pytest.raises(HimringApiError) as refusal:
        _upload(himring, text_file)

    assert refusal.value.kind == "invalid_input"
    assert [request.raw_body_bytes for request in contract.recorded()[0]] in ([], [0])


def test_the_async_client_streams_a_file_and_refuses_one_past_the_limit(
    contract: ContractApi,
) -> None:
    contract.stub("import_saved_questions", 201, IMPORT_ANSWER)
    content = os.urandom(SAVED_QUESTIONS_LIMIT_BYTES)

    async def scenario() -> HimringApiError:
        async with AsyncHimring(api_key=API_KEY, base_url=contract.base_url) as client:
            await client.import_saved_questions(
                project_id=PROJECT_ID,
                knowledge_base_id=KNOWLEDGE_BASE_ID,
                content=io.BytesIO(content),
            )
            try:
                await client.import_saved_questions(
                    project_id=PROJECT_ID,
                    knowledge_base_id=KNOWLEDGE_BASE_ID,
                    content=content + b"q",
                )
            except HimringApiError as error:
                return error
        raise AssertionError("The oversized file did not raise.")

    refusal = asyncio.run(scenario())

    assert refusal.kind == "invalid_input"
    [request] = contract.assert_clean()
    assert request.raw_body_bytes == SAVED_QUESTIONS_LIMIT_BYTES


@pytest.mark.parametrize(
    ("disposition", "expected", "safe"),
    [
        (
            "attachment; filename*=UTF-8''r%C3%A9sum%C3%A9%20%E2%82%AC.ndjson",
            "résumé €.ndjson",
            "resume_.ndjson",
        ),
        ('attachment; filename="../../../etc/passwd"', "../../../etc/passwd", "passwd"),
        (
            "attachment; filename*=UTF-8''%C3%28.ndjson; filename=\"plain.ndjson\"",
            "plain.ndjson",
            "plain.ndjson",
        ),
        ("attachment; filename*=UTF-8''%E2%82.ndjson", f"{INDEX_ID}.ndjson", f"{INDEX_ID}.ndjson"),
        ('attachment; filename="..\\\\..\\\\boot.ini"', "..\\\\..\\\\boot.ini", "boot.ini"),
    ],
)
def test_names_a_download_from_its_content_disposition_and_keeps_the_safe_name_safe(
    himring: Himring, contract: ContractApi, disposition: str, expected: str, safe: str
) -> None:
    contract.stub(
        "export_index_records",
        200,
        EXPORTED_LINES,
        {"content-type": "application/x-ndjson", "content-disposition": disposition},
    )

    with himring.export_index_records(project_id=PROJECT_ID, index_id=INDEX_ID) as download:
        content = download.read()

    assert content == json.dumps(EXPORTED_LINES).encode()
    assert download.file_name == expected
    assert safe_download_name(download.file_name, "export.ndjson") == safe
    assert download.content_type == "application/x-ndjson"
    assert download.content_length == len(content)
    contract.assert_clean()


def test_a_refused_download_raises_the_refusal_and_returns_no_stream(
    himring: Himring, contract: ContractApi
) -> None:
    contract.stub("download_index", 404, {"error": {"code": "index_not_found", "message": "Gone."}})

    with pytest.raises(HimringApiError) as refusal:
        himring.download_index(project_id=PROJECT_ID, index_id=INDEX_ID)

    assert (refusal.value.kind, refusal.value.code) == ("refused", "index_not_found")
    contract.assert_clean()
