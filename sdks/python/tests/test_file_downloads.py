from __future__ import annotations

import asyncio
import io
import os

import pytest

from himring import AsyncHimring, Himring, HimringApiError

from .conftest import API_KEY, KNOWLEDGE_BASE_ID, PROJECT_ID
from .contract_api import ContractApi
from .stand_in_server import RawReply, StandInServer
from .test_file_transfers import (
    PART_BYTES,
    PARTS_IN_FLIGHT_LIMIT,
    STORAGE_PAUSE_SECONDS,
    script_multipart,
)
from .upload_records import FILE_ID, FILE_PATH, UPLOAD_ID, part_slices

STORED_FILE = os.urandom(5_000)
FIRST_BYTES = 100
ENTITY_TAG = '"v3-etag"'
FILE_VERSION = 3


def link_to(url: str) -> dict[str, object]:
    return {
        "url": url,
        "expires_at": "2099-01-01T00:00:00.000Z",
        "file_name": "refunds.pdf",
        "content_type": "application/pdf",
        "disposition": "attachment",
        "size_bytes": len(STORED_FILE),
        "entity_tag": ENTITY_TAG,
    }


def test_reads_a_byte_range_of_a_file_from_storage_without_the_api_key(
    himring: Himring, contract: ContractApi, storage: StandInServer
) -> None:
    contract.stub("get_download_link", 200, link_to(f"{storage.base_url}/files/refunds.pdf"))
    storage.answer(
        "GET",
        "/files/refunds.pdf",
        RawReply(
            206,
            STORED_FILE[:FIRST_BYTES],
            {
                "content-range": f"bytes 0-{FIRST_BYTES - 1}/{len(STORED_FILE)}",
                "accept-ranges": "bytes",
            },
        ),
    )

    with himring.download_file(
        project_id=PROJECT_ID,
        knowledge_base_id=KNOWLEDGE_BASE_ID,
        file_id=FILE_ID,
        version=FILE_VERSION,
        range=f"bytes=0-{FIRST_BYTES - 1}",
    ) as download:
        content = b"".join(download.iter_bytes())

    assert content == STORED_FILE[:FIRST_BYTES]
    assert (download.status, download.file_name, download.entity_tag) == (
        206,
        "refunds.pdf",
        ENTITY_TAG,
    )
    assert download.content_range == f"bytes 0-{FIRST_BYTES - 1}/{len(STORED_FILE)}"
    [fetch] = storage.arrived("GET")
    assert fetch.headers["range"] == f"bytes=0-{FIRST_BYTES - 1}"
    assert "authorization" not in fetch.headers
    [link] = contract.assert_clean()
    assert link.path_parameters["version"] == str(FILE_VERSION)
    assert link.query == {"disposition": "attachment"}


@pytest.mark.parametrize("status", [301, 403, 404, 500])
def test_raises_a_refusal_when_storage_does_not_hand_over_the_file(
    himring: Himring, contract: ContractApi, storage: StandInServer, status: int
) -> None:
    contract.stub("get_download_link", 200, link_to(f"{storage.base_url}/files/refunds.pdf"))
    storage.answer("GET", "/files/refunds.pdf", RawReply(status, b"<Error/>", {"location": "/x"}))

    with pytest.raises(HimringApiError) as refusal:
        himring.download_file(
            project_id=PROJECT_ID, knowledge_base_id=KNOWLEDGE_BASE_ID, file_id=FILE_ID, version=1
        )

    assert (refusal.value.kind, refusal.value.status) == ("refused", status)
    assert len(storage.arrived("GET")) == 1


@pytest.mark.parametrize("byte_range", ["bytes=0-9\r\nx-forwarded-for: 10.0.0.1", "rows=0-9", ""])
def test_refuses_a_range_that_is_not_a_byte_range_before_asking_for_a_link(
    himring: Himring, contract: ContractApi, byte_range: str
) -> None:
    with pytest.raises(HimringApiError) as refusal:
        himring.download_file(
            project_id=PROJECT_ID,
            knowledge_base_id=KNOWLEDGE_BASE_ID,
            file_id=FILE_ID,
            version=1,
            range=byte_range,
        )

    assert refusal.value.kind == "invalid_input"
    assert contract.recorded() == ([], [])


def test_never_follows_a_download_link_with_another_scheme(
    himring: Himring, contract: ContractApi
) -> None:
    contract.stub("get_download_link", 200, link_to("file:///etc/shadow"))

    with pytest.raises(HimringApiError) as refusal:
        himring.download_file(
            project_id=PROJECT_ID, knowledge_base_id=KNOWLEDGE_BASE_ID, file_id=FILE_ID, version=1
        )

    assert refusal.value.kind == "invalid_response"


def test_the_async_client_sends_parts_four_at_a_time_and_awaits_a_callback_that_calls_back(
    contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(5 * PART_BYTES + 10)
    script_multipart(contract, storage, content)
    for path in part_slices(content, PART_BYTES):
        storage.answer("PUT", path, RawReply(200, delay_seconds=STORAGE_PAUSE_SECONDS))
    contract.stub("get_download_link", 200, link_to(f"{storage.base_url}/files/refunds.pdf"))
    storage.answer("GET", "/files/refunds.pdf", RawReply(200, STORED_FILE))
    sent: list[int] = []

    async def scenario() -> bytes:
        async with AsyncHimring(api_key=API_KEY, base_url=contract.base_url) as client:

            async def read_back(part_bytes: int) -> None:
                await client.get_upload(
                    project_id=PROJECT_ID, knowledge_base_id=KNOWLEDGE_BASE_ID, upload_id=UPLOAD_ID
                )
                sent.append(part_bytes)

            added = await client.add_file(
                project_id=PROJECT_ID,
                knowledge_base_id=KNOWLEDGE_BASE_ID,
                path=FILE_PATH,
                content=io.BytesIO(content),
                on_progress=read_back,
            )
            assert added["outcome"] == "added"
            async with await client.download_file(
                project_id=PROJECT_ID,
                knowledge_base_id=KNOWLEDGE_BASE_ID,
                file_id=FILE_ID,
                version=1,
            ) as download:
                return await download.read()

    downloaded = asyncio.run(scenario())

    assert downloaded == STORED_FILE
    assert {put.path: put.body for put in storage.arrived("PUT")} == part_slices(
        content, PART_BYTES
    )
    assert 1 < storage.state.most_in_flight <= PARTS_IN_FLIGHT_LIMIT
    assert sum(sent) == len(content)
    assert len(contract.requests_for("get_upload")) == len(sent)
    contract.assert_clean()


def test_the_async_client_cancels_the_upload_when_storage_refuses_a_part(
    contract: ContractApi, storage: StandInServer
) -> None:
    content = os.urandom(5 * PART_BYTES + 10)
    script_multipart(contract, storage, content)
    storage.answer("PUT", "/parts/4", RawReply(400))

    async def scenario() -> HimringApiError:
        async with AsyncHimring(api_key=API_KEY, base_url=contract.base_url) as client:
            try:
                await client.add_file(
                    project_id=PROJECT_ID,
                    knowledge_base_id=KNOWLEDGE_BASE_ID,
                    path=FILE_PATH,
                    content=content,
                )
            except HimringApiError as error:
                return error
        raise AssertionError("The refused part did not raise.")

    refusal = asyncio.run(scenario())

    assert (refusal.kind, refusal.status) == ("refused", 400)
    assert len(contract.requests_for("cancel_upload")) == 1
    assert contract.requests_for("complete_upload") == []
