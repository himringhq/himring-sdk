from __future__ import annotations

import asyncio
import random
import threading
import time
import urllib.parse
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from typing import Literal, TypeVar

from himring import Himring, HimringApiError

from .events import WireEvent
from .json_shapes import object_list, object_map

DEFAULT_REQUEST_TIMEOUT_SECONDS = 30.0
DEFAULT_DELIVERY_ATTEMPTS = 6
HTTP_OK_MINIMUM = 200
HTTP_OK_MAXIMUM = 299
HTTP_TOO_MANY_REQUESTS = 429
HTTP_SERVER_ERROR_MINIMUM = 500
NO_HTTP_STATUS = 0
RETRY_AFTER_CEILING_SECONDS = 60.0
BACKOFF_FIRST_SECONDS = 0.5
BACKOFF_CEILING_SECONDS = 30.0
ALLOWED_SCHEMES = frozenset({"http", "https"})

ResultT = TypeVar("ResultT")


class HimringRequestError(Exception):
    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


@dataclass(frozen=True, slots=True)
class HimringTarget:
    base_url: str
    api_key: str
    project_id: str
    knowledge_base_id: str
    request_timeout_seconds: float = DEFAULT_REQUEST_TIMEOUT_SECONDS

    def __post_init__(self) -> None:
        scheme = urllib.parse.urlsplit(self.base_url).scheme
        if scheme not in ALLOWED_SCHEMES:
            raise ValueError("Give Himring's base URL with http or https.")


class HimringConnection:
    def __init__(self, target: HimringTarget) -> None:
        self.target = target
        self._lock = threading.Lock()
        self._client: Himring | None = None

    def client(self) -> Himring:
        with self._lock:
            if self._client is None:
                self._client = Himring(
                    api_key=self.target.api_key,
                    base_url=self.target.base_url,
                    timeout_seconds=self.target.request_timeout_seconds,
                )
            return self._client

    async def call(self, work: Callable[[Himring], ResultT]) -> ResultT:
        return await asyncio.to_thread(lambda: work(self.client()))

    def close(self) -> None:
        with self._lock:
            client, self._client = self._client, None
        if client is not None:
            client.close()


@dataclass(frozen=True, slots=True)
class DeliveryReply:
    status: int
    answer: object
    retry_after_seconds: float | None
    refused_before_sending: bool = False


def is_success(status: int) -> bool:
    return HTTP_OK_MINIMUM <= status <= HTTP_OK_MAXIMUM


def reply_status_of(error: HimringApiError) -> int:
    return NO_HTTP_STATUS if error.status is None else error.status


def _record_events(connection: HimringConnection, events: Sequence[WireEvent]) -> DeliveryReply:
    target = connection.target
    try:
        answer = connection.client().record_answer_events(
            project_id=target.project_id,
            knowledge_base_id=target.knowledge_base_id,
            origin="sdk",
            events=events,
        )
    except HimringApiError as error:
        if error.kind == "invalid_input":
            return DeliveryReply(NO_HTTP_STATUS, None, None, refused_before_sending=True)
        return DeliveryReply(reply_status_of(error), None, error.retry_after_seconds)
    return DeliveryReply(HTTP_OK_MINIMUM, answer, None)


def _is_retryable(status: int) -> bool:
    return status in (NO_HTTP_STATUS, HTTP_TOO_MANY_REQUESTS) or status >= HTTP_SERVER_ERROR_MINIMUM


def _retry_delay(reply: DeliveryReply, attempt: int) -> float:
    if reply.retry_after_seconds is not None:
        return min(reply.retry_after_seconds, RETRY_AFTER_CEILING_SECONDS)
    ceiling = min(BACKOFF_CEILING_SECONDS, BACKOFF_FIRST_SECONDS * 2**attempt)
    return random.uniform(0, ceiling)


def _unknown_question_ids(answer: object) -> tuple[str, ...]:
    reply = object_map(answer)
    results = None if reply is None else object_list(reply.get("results"))
    unknown: list[str] = []
    for entry in results or []:
        fields = object_map(entry)
        if fields is None:
            continue
        question_id = fields.get("question_id")
        if fields.get("outcome") == "question_not_found" and isinstance(question_id, str):
            unknown.append(question_id)
    return tuple(unknown)


class Waker:
    def __init__(self) -> None:
        self._waiting: set[asyncio.Future[None]] = set()

    async def pause(self, seconds: float) -> None:
        waiter: asyncio.Future[None] = asyncio.get_running_loop().create_future()
        self._waiting.add(waiter)
        try:
            await asyncio.wait({waiter}, timeout=seconds)
        finally:
            self._waiting.discard(waiter)

    def wake_all(self) -> None:
        for waiter in self._waiting:
            if not waiter.done():
                waiter.set_result(None)


@dataclass(frozen=True, slots=True)
class DeliveryOutcome:
    kind: Literal["delivered", "refused", "gave_up", "deadline_passed"]
    unknown_question_ids: tuple[str, ...] = ()
    reason: str = ""


async def deliver_batch(
    connection: HimringConnection,
    events: Sequence[WireEvent],
    *,
    maximum_attempts: int,
    deadline: Callable[[], float],
    waker: Waker,
) -> DeliveryOutcome:
    batch = list(events)
    attempt = 0
    while True:
        reply = await asyncio.to_thread(_record_events, connection, batch)
        if is_success(reply.status):
            return DeliveryOutcome("delivered", _unknown_question_ids(reply.answer))
        attempt += 1
        if reply.refused_before_sending:
            return DeliveryOutcome("refused", reason="the client refused the batch")
        reason = f"status {reply.status}" if reply.status else "no connection"
        if not _is_retryable(reply.status):
            return DeliveryOutcome("refused", reason=reason)
        if attempt >= maximum_attempts:
            return DeliveryOutcome("gave_up", reason=reason)
        delay = _retry_delay(reply, attempt)
        if time.monotonic() + delay > deadline():
            return DeliveryOutcome("deadline_passed")
        await waker.pause(delay)
