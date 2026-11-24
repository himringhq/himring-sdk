from __future__ import annotations

import asyncio
import contextlib
import json
import logging
import tempfile
import time
import uuid
from collections import deque
from collections.abc import Sequence
from dataclasses import dataclass, field
from pathlib import Path

from .conversation import AnswerConversation, SearchResult
from .delivery import (
    DEFAULT_DELIVERY_ATTEMPTS,
    DeliveryOutcome,
    HimringConnection,
    HimringTarget,
    Waker,
    deliver_batch,
)
from .events import (
    ANSWER_BATCH_BODY_BUDGET_BYTES,
    ANSWER_EVENTS_PER_REQUEST_MAXIMUM,
    AnswerEventDraft,
    encoded,
    wire_event,
)
from .search import search_knowledge_base
from .spool import AnswerSpool
from .spool_files import SpooledEvent

DEFAULT_FLUSH_INTERVAL_SECONDS = 5.0
DEFAULT_BUFFER_MAXIMUM = 10_000
DEFAULT_CLOSE_TIMEOUT_SECONDS = 10.0
RECOVERY_INTERVAL_SECONDS = 60.0
DROP_WARNING_INTERVAL_SECONDS = 10.0
BACKGROUND_DELIVERY_WINDOW_SECONDS = 10 * 60.0

LOGGER = logging.getLogger("himring_agent_hooks")


def default_spool_directory() -> Path:
    return Path(tempfile.gettempdir()) / "himring-answer-spool"


@dataclass(frozen=True, slots=True)
class RecorderSettings:
    spool_directory: Path | None = field(default_factory=default_spool_directory)
    flush_interval_seconds: float = DEFAULT_FLUSH_INTERVAL_SECONDS
    maximum_buffered_events: int = DEFAULT_BUFFER_MAXIMUM
    maximum_attempts: int = DEFAULT_DELIVERY_ATTEMPTS
    close_timeout_seconds: float = DEFAULT_CLOSE_TIMEOUT_SECONDS


@dataclass(frozen=True, slots=True)
class _Pending:
    item: SpooledEvent
    size: int


def next_batch(pending: Sequence[_Pending]) -> list[_Pending]:
    batch: list[_Pending] = []
    total = 0
    for entry in pending:
        if len(batch) >= ANSWER_EVENTS_PER_REQUEST_MAXIMUM:
            break
        if batch and total + entry.size > ANSWER_BATCH_BODY_BUDGET_BYTES:
            break
        batch.append(entry)
        total += entry.size
    return batch


class AnswerRecorder:
    def __init__(
        self,
        target: HimringTarget,
        settings: RecorderSettings | None = None,
        logger: logging.Logger | None = None,
    ) -> None:
        self._connection = HimringConnection(target)
        self._settings = settings or RecorderSettings()
        self._logger = logger or LOGGER
        self._maximum_buffered = max(1, self._settings.maximum_buffered_events)
        self._maximum_attempts = max(1, self._settings.maximum_attempts)
        self._pending: deque[_Pending] = deque()
        directory = self._settings.spool_directory
        destination = json.dumps(
            [target.base_url.rstrip("/"), target.project_id, target.knowledge_base_id],
            separators=(",", ":"),
        )
        self._spool = (
            None
            if directory is None
            else AnswerSpool.open(directory, destination, self._logger, self._spooled)
        )
        self._lock = asyncio.Lock()
        self._nudge = asyncio.Event()
        self._waker = Waker()
        self._worker: asyncio.Task[None] | None = None
        self._closed = False
        self._close_deadline = float("inf")
        self._last_recovery = float("-inf")
        self._dropped = 0
        self._last_drop_warning = float("-inf")

    @property
    def dropped_event_count(self) -> int:
        return self._dropped

    @property
    def buffered_event_count(self) -> int:
        return len(self._pending)

    def conversation(
        self, end_user_id: str | None = None, call_id: str | None = None
    ) -> AnswerConversation:
        self._ensure_worker()
        return AnswerConversation(self, self._logger, end_user_id, call_id)

    async def search(
        self, question: str, limit: int | None, end_user_id: str | None, call_id: str | None
    ) -> SearchResult:
        self._ensure_worker()
        return await search_knowledge_base(self._connection, question, limit, end_user_id, call_id)

    def record(self, drafts: Sequence[AnswerEventDraft]) -> None:
        try:
            if self._closed:
                return
            items = [
                SpooledEvent(uuid.uuid4().hex, event)
                for event in (wire_event(draft) for draft in drafts)
                if event is not None
            ]
            if self._spool is not None:
                self._spool.append(items)
            self._enqueue(items)
            if len(self._pending) >= ANSWER_EVENTS_PER_REQUEST_MAXIMUM:
                self._nudge.set()
            self._ensure_worker()
        except Exception:
            self._logger.warning("The answer recorder could not record an event", exc_info=True)

    async def start(self) -> None:
        self._ensure_worker()

    async def flush(self) -> None:
        await self._drain_guarded(time.monotonic() + self._settings.close_timeout_seconds)

    async def close(self) -> None:
        if self._closed:
            return
        self._closed = True
        self._close_deadline = time.monotonic() + self._settings.close_timeout_seconds
        self._waker.wake_all()
        self._nudge.set()
        await self._drain_guarded(self._close_deadline)
        if self._worker is not None:
            self._worker.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._worker
        if self._spool is not None:
            self._spool.close(keep_unsent=True)
        self._connection.close()

    def _spooled(self) -> list[SpooledEvent]:
        return [entry.item for entry in self._pending]

    def _ensure_worker(self) -> None:
        if self._worker is not None or self._closed:
            return
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return
        self._worker = loop.create_task(self._run(), name="himring-answer-recorder")

    async def _run(self) -> None:
        while not self._closed:
            await self._drain_guarded(time.monotonic() + BACKGROUND_DELIVERY_WINDOW_SECONDS)
            if self._spool is not None:
                self._spool.heartbeat()
            with contextlib.suppress(TimeoutError):
                await asyncio.wait_for(self._nudge.wait(), self._settings.flush_interval_seconds)
            self._nudge.clear()

    def _enqueue(self, items: Sequence[SpooledEvent]) -> None:
        for item in items:
            self._pending.append(_Pending(item, len(encoded(item.event))))
        excess = len(self._pending) - self._maximum_buffered
        if excess <= 0:
            return
        dropped = [self._pending.popleft().item.id for _ in range(excess)]
        if self._spool is not None:
            self._spool.mark_done(dropped)
        self._dropped += len(dropped)
        now = time.monotonic()
        if now - self._last_drop_warning >= DROP_WARNING_INTERVAL_SECONDS:
            self._last_drop_warning = now
            self._logger.warning(
                "The answer buffer is full, so the oldest events were dropped "
                "(%d dropped so far, at most %d kept)",
                self._dropped,
                self._maximum_buffered,
            )

    def _recover(self) -> None:
        now = time.monotonic()
        if self._spool is None or now - self._last_recovery < RECOVERY_INTERVAL_SECONDS:
            return
        self._last_recovery = now
        self._enqueue(self._spool.recover_orphans())

    async def _drain_guarded(self, deadline: float) -> None:
        try:
            async with self._lock:
                await self._drain(deadline)
        except asyncio.CancelledError:
            raise
        except Exception:
            self._logger.warning("The answer recorder could not send its events", exc_info=True)

    async def _drain(self, deadline: float) -> None:
        self._recover()
        while self._pending:
            batch = next_batch(self._pending)
            outcome = await deliver_batch(
                self._connection,
                [entry.item.event for entry in batch],
                maximum_attempts=self._maximum_attempts,
                deadline=lambda: min(deadline, self._close_deadline),
                waker=self._waker,
            )
            if outcome.kind == "deadline_passed":
                return
            self._settle(batch, outcome)
        if self._spool is not None:
            self._spool.settle()

    def _settle(self, batch: list[_Pending], outcome: DeliveryOutcome) -> None:
        ids = {entry.item.id for entry in batch}
        self._pending = deque(entry for entry in self._pending if entry.item.id not in ids)
        if self._spool is not None:
            self._spool.mark_done(sorted(ids))
        if outcome.kind == "delivered":
            if outcome.unknown_question_ids:
                self._logger.warning(
                    "Himring did not recognise %d question IDs, so it ignored their events: %s",
                    len(outcome.unknown_question_ids),
                    ", ".join(outcome.unknown_question_ids),
                )
            return
        self._logger.warning(
            "Himring did not accept a batch of %d answer events (%s), so the batch was dropped",
            len(batch),
            outcome.reason,
        )
