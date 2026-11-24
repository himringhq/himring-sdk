from __future__ import annotations

import asyncio

import pytest

from himring import AsyncHimring, Himring, HimringApiError

from .conftest import API_KEY, KNOWLEDGE_BASE_ID, PROJECT_ID
from .contract_api import ContractApi
from .stand_in_server import StandInServer
from .upload_records import FILE_PATH, signed_part, upload_record

CONTENT = b"customer refund policy"


def upload(contract: ContractApi, asynchronous: bool) -> None:
    async def send() -> None:
        async with AsyncHimring(api_key=API_KEY, base_url=contract.base_url) as client:
            await client.add_file(
                project_id=PROJECT_ID,
                knowledge_base_id=KNOWLEDGE_BASE_ID,
                path=FILE_PATH,
                content=CONTENT,
            )

    if asynchronous:
        asyncio.run(send())
    else:
        with Himring(api_key=API_KEY, base_url=contract.base_url) as client:
            client.add_file(
                project_id=PROJECT_ID,
                knowledge_base_id=KNOWLEDGE_BASE_ID,
                path=FILE_PATH,
                content=CONTENT,
            )


def prepare(contract: ContractApi, storage: StandInServer) -> None:
    contract.stub(
        "create_upload",
        201,
        {
            "upload": upload_record(CONTENT, state="open"),
            "parts": [signed_part(f"{storage.base_url}/part", 1, len(CONTENT))],
        },
    )
    contract.stub("complete_upload", 200, upload_record(CONTENT, state="completed"))
    contract.stub("cancel_upload", 200, upload_record(CONTENT, state="failed"))


@pytest.mark.parametrize("asynchronous", [False, True])
def test_refuses_an_upload_for_different_content_before_sending_bytes(
    contract: ContractApi, storage: StandInServer, asynchronous: bool
) -> None:
    prepare(contract, storage)
    foreign = upload_record(b"x" * len(CONTENT), state="open")
    contract.stub(
        "create_upload",
        201,
        {"upload": foreign, "parts": [signed_part(f"{storage.base_url}/part", 1, len(CONTENT))]},
    )
    with pytest.raises(HimringApiError) as refused:
        upload(contract, asynchronous)
    assert refused.value.kind == "invalid_response"
    assert storage.arrived() == []
    assert len(contract.requests_for("cancel_upload")) == 1
    assert contract.requests_for("complete_upload") == []


@pytest.mark.parametrize("asynchronous", [False, True])
def test_refuses_a_signed_part_with_a_different_size_before_sending_bytes(
    contract: ContractApi, storage: StandInServer, asynchronous: bool
) -> None:
    prepare(contract, storage)
    contract.stub(
        "create_upload",
        201,
        {
            "upload": upload_record(CONTENT, state="open"),
            "parts": [signed_part(f"{storage.base_url}/part", 1, len(CONTENT) - 1)],
        },
    )
    with pytest.raises(HimringApiError) as refused:
        upload(contract, asynchronous)
    assert refused.value.kind == "invalid_response"
    assert storage.arrived() == []
    assert len(contract.requests_for("cancel_upload")) == 1
    assert contract.requests_for("complete_upload") == []


@pytest.mark.parametrize("asynchronous", [False, True])
def test_rejects_a_completion_receipt_for_different_content(
    contract: ContractApi, storage: StandInServer, asynchronous: bool
) -> None:
    prepare(contract, storage)
    contract.stub("complete_upload", 200, upload_record(b"x" * len(CONTENT), state="completed"))
    with pytest.raises(HimringApiError) as refused:
        upload(contract, asynchronous)
    assert refused.value.kind == "invalid_response"
    assert [request.body for request in storage.arrived("PUT")] == [CONTENT]
    assert len(contract.requests_for("cancel_upload")) == 1
