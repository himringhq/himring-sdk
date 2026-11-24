from __future__ import annotations

import asyncio
from collections.abc import Mapping
from typing import cast

import pytest

from himring import AsyncHimring, Himring, HimringApiError

from .conftest import API_KEY, KNOWLEDGE_BASE_ID, PROJECT_ID
from .contract_api import ContractApi

EMPTY_DATABASE_PAGE: dict[str, object] = {
    "databases": [],
    "total_count": 0,
    "limit": 20,
    "offset": 0,
}
SEARCH_ANSWER: dict[str, object] = {
    "question_id": "qst_" + "a" * 32,
    "duration_ms": 4,
    "passages": [],
    "memories": [],
    "recall_id": None,
}
HOSTILE_PATH_VALUES = [
    "%2F",
    "a/b",
    "../../v1/projects",
    "..%2F..%2F",
    "?state=deleted",
    "#fragment",
    "café ☃",
    " ",
    "...",
]


def test_sends_the_api_key_the_path_and_the_query_that_the_document_describes(
    himring: Himring, contract: ContractApi
) -> None:
    contract.stub("list_databases", 200, EMPTY_DATABASE_PAGE)

    page = himring.list_databases(
        project_id=PROJECT_ID, state="deleted", sort="name", limit="5", search=None
    )

    assert page == EMPTY_DATABASE_PAGE
    [request] = contract.assert_clean()
    assert request.operation_id == "list_databases"
    assert request.headers["authorization"] == f"Bearer {API_KEY}"
    assert request.path_parameters == {"project_id": PROJECT_ID}
    assert request.query == {"state": "deleted", "sort": "name", "limit": "5"}
    assert request.raw_body_bytes == 0


def test_sends_the_json_body_fields_and_leaves_out_the_ones_not_given(
    himring: Himring, contract: ContractApi
) -> None:
    contract.stub("search_knowledge_base", 200, SEARCH_ANSWER)

    found = himring.search_knowledge_base(
        project_id=PROJECT_ID,
        knowledge_base_id=KNOWLEDGE_BASE_ID,
        question="When do you open on Sunday? — \U0001f600",
        limit=3,
    )

    assert found["question_id"] == SEARCH_ANSWER["question_id"]
    [request] = contract.assert_clean()
    assert request.headers["content-type"] == "application/json"
    assert request.body == {"question": "When do you open on Sunday? — \U0001f600", "limit": 3}


@pytest.mark.parametrize("hostile", HOSTILE_PATH_VALUES)
def test_a_hostile_path_value_reaches_the_api_as_one_literal_segment(
    himring: Himring, contract: ContractApi, hostile: str
) -> None:
    with pytest.raises(HimringApiError) as refusal:
        himring.get_database(project_id=PROJECT_ID, database_id=hostile)

    assert refusal.value.kind == "refused"
    assert refusal.value.code == "validation_failed"
    requests, _ = contract.recorded()
    [request] = requests
    assert request.operation_id == "get_database"
    assert request.path_parameters == {"project_id": PROJECT_ID, "database_id": hostile}


@pytest.mark.parametrize("hostile", ["", ".", ".."])
def test_refuses_an_empty_or_dot_path_value_before_sending(
    himring: Himring, contract: ContractApi, hostile: str
) -> None:
    with pytest.raises(HimringApiError) as refusal:
        himring.get_database(project_id=PROJECT_ID, database_id=hostile)

    assert refusal.value.kind == "invalid_input"
    assert [issue.path for issue in refusal.value.issues] == [("database_id",)]
    assert contract.recorded() == ([], [])


def test_refuses_an_unknown_query_field_and_an_unknown_operation_before_sending(
    himring: Himring, contract: ContractApi
) -> None:
    with pytest.raises(HimringApiError) as unknown_field:
        himring.invoke("list_databases", {"project_id": PROJECT_ID, "include_deleted": "true"})
    with pytest.raises(HimringApiError) as unknown_operation:
        himring.invoke("drop_every_database", {"project_id": PROJECT_ID})
    pairs: object = [("project_id", PROJECT_ID)]
    with pytest.raises(HimringApiError) as not_a_mapping:
        himring.invoke("list_databases", cast("Mapping[str, object]", pairs))

    assert unknown_field.value.kind == "invalid_input"
    assert unknown_field.value.issues[0].path == ("include_deleted",)
    assert unknown_operation.value.kind == "invalid_input"
    assert not_a_mapping.value.kind == "invalid_input"
    assert contract.recorded() == ([], [])


def test_joins_list_query_values_with_commas_and_spells_booleans_in_lowercase(
    himring: Himring, contract: ContractApi
) -> None:
    contract.stub("list_databases", 200, EMPTY_DATABASE_PAGE)

    himring.invoke(
        "list_databases",
        {"project_id": PROJECT_ID, "search": ["refund", "policy, 2026", True], "offset": 0},
    )

    [request] = contract.assert_clean()
    assert request.query == {"search": "refund,policy, 2026,true", "offset": "0"}


@pytest.mark.parametrize("header", ["Authorization", "content-type", "Content-Length", "HOST"])
def test_refuses_a_custom_header_that_the_client_sets_itself(header: str) -> None:
    with pytest.raises(HimringApiError) as refusal:
        Himring(api_key=API_KEY, headers={header: "value"})

    assert refusal.value.kind == "invalid_input"


@pytest.mark.parametrize(
    "headers",
    [{"x-trace": "a\r\nauthorization: Bearer stolen"}, {"x trace": "a"}, {"x-name": "café"}],
)
def test_refuses_a_custom_header_that_could_split_the_request(headers: dict[str, str]) -> None:
    with pytest.raises(HimringApiError):
        Himring(api_key=API_KEY, headers=headers)


@pytest.mark.parametrize("credential", ["", "hk live", "hk_live\r\nx-admin: 1", "hk_é"])
def test_refuses_a_credential_that_is_not_one_header_token(credential: str) -> None:
    with pytest.raises(ValueError):
        Himring(api_key=credential)


def test_refuses_an_api_key_and_a_session_token_together() -> None:
    with pytest.raises(ValueError):
        Himring(api_key=API_KEY, session_token="st_session")


@pytest.mark.parametrize(
    "base_url",
    [
        "ftp://api.himring.ai",
        "file:///etc/passwd",
        "https://admin:secret@api.himring.ai",
        "https://api.himring.ai/?region=eu",
        "https://api.himring.ai/#fragment",
        "https://",
        "api.himring.ai",
        "",
    ],
)
def test_refuses_a_base_url_that_is_not_a_plain_http_address(base_url: str) -> None:
    with pytest.raises(ValueError):
        Himring(api_key=API_KEY, base_url=base_url)


@pytest.mark.parametrize("seconds", [0, -1, float("nan"), float("inf"), True])
def test_refuses_a_time_limit_that_is_not_a_positive_number(
    himring: Himring, contract: ContractApi, seconds: float
) -> None:
    with pytest.raises(ValueError):
        Himring(api_key=API_KEY, timeout_seconds=seconds)
    with pytest.raises(ValueError):
        himring.list_databases(project_id=PROJECT_ID, timeout_seconds=seconds)
    assert contract.recorded() == ([], [])


def test_reads_every_field_of_a_documented_refusal(himring: Himring, contract: ContractApi) -> None:
    contract.stub(
        "list_databases",
        403,
        {
            "error": {
                "code": "api_key_permission_missing",
                "message": "The key may not read databases.",
                "details": "Ask an owner to add the permission.",
                "request_id": "req_body",
                "issues": [{"message": "Not allowed.", "path": ["project_id", 0]}],
                "missing_permission": {
                    "resource_kind": "database",
                    "level": "read",
                    "resource_id": None,
                },
            }
        },
        {"retry-after": "7"},
    )

    with pytest.raises(HimringApiError) as refusal:
        himring.list_databases(project_id=PROJECT_ID)

    error = refusal.value
    contract.assert_clean()
    assert (error.kind, error.status, error.code) == ("refused", 403, "api_key_permission_missing")
    assert error.message == "The key may not read databases."
    assert error.details == "Ask an owner to add the permission."
    assert error.request_id == "req_body"
    assert error.retry_after_seconds == 7
    assert [(issue.message, issue.path) for issue in error.issues] == [
        ("Not allowed.", ("project_id", 0))
    ]
    assert error.missing_permission is not None
    assert (error.missing_permission.resource_kind, error.missing_permission.resource_id) == (
        "database",
        None,
    )
    assert error.is_documented_code


def test_the_async_client_sends_the_same_request_and_reads_the_same_refusal(
    contract: ContractApi,
) -> None:
    contract.stub("list_databases", 200, EMPTY_DATABASE_PAGE)
    contract.stub(
        "search_knowledge_base", 429, {"error": {"code": "rate_limited", "message": "Wait."}}
    )

    async def scenario() -> tuple[object, HimringApiError]:
        async with AsyncHimring(session_token="st_session", base_url=contract.base_url) as client:
            page = await client.list_databases(project_id=PROJECT_ID, direction="asc")
            try:
                await client.search_knowledge_base(
                    project_id=PROJECT_ID, knowledge_base_id=KNOWLEDGE_BASE_ID, question="Hours?"
                )
            except HimringApiError as error:
                return page, error
            raise AssertionError("The refusal did not raise.")

    page, refusal = asyncio.run(scenario())

    assert page == EMPTY_DATABASE_PAGE
    assert (refusal.kind, refusal.status, refusal.code) == ("refused", 429, "rate_limited")
    listing, search = contract.assert_clean()
    assert listing.headers["authorization"] == "Bearer st_session"
    assert listing.query == {"direction": "asc"}
    assert search.body == {"question": "Hours?"}
