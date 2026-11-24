from __future__ import annotations

from himring import Himring, HimringApiError

from .conversation import SearchResult
from .delivery import HimringConnection, HimringRequestError, is_success, reply_status_of
from .json_shapes import object_list, object_map

HIMRING_SEARCH_SUCCESS_STATUS = 200


def _passages(value: object) -> tuple[dict[str, object], ...]:
    entries = object_list(value) or []
    return tuple(passage for entry in entries if (passage := object_map(entry)) is not None)


def search_result_of(status: int, answer: object) -> SearchResult:
    reply = object_map(answer)
    if reply is None:
        raise HimringRequestError(status, "Himring answered the search with an unexpected body.")
    question_id = reply.get("question_id")
    if not isinstance(question_id, str):
        raise HimringRequestError(status, "Himring answered the search without a question_id.")
    passages = _passages(reply.get("passages"))
    chunk_ids = tuple(
        chunk_id for passage in passages if isinstance(chunk_id := passage.get("chunk_id"), str)
    )
    return SearchResult(question_id=question_id, chunk_ids=chunk_ids, passages=passages)


async def search_knowledge_base(
    connection: HimringConnection,
    question: str,
    limit: int | None,
    end_user_id: str | None,
    call_id: str | None,
) -> SearchResult:
    target = connection.target

    def search(client: Himring) -> object:
        return client.search_knowledge_base(
            project_id=target.project_id,
            knowledge_base_id=target.knowledge_base_id,
            question=question,
            limit=limit,
            end_user_id=end_user_id,
            call_id=call_id,
        )

    try:
        answer = await connection.call(search)
    except HimringApiError as error:
        status = reply_status_of(error)
        if error.kind == "invalid_response" and is_success(status):
            raise HimringRequestError(
                status, "Himring answered the search with an unexpected body."
            ) from error
        raise HimringRequestError(
            status, f"Himring refused the search with status {status}."
        ) from error
    return search_result_of(HIMRING_SEARCH_SUCCESS_STATUS, answer)
