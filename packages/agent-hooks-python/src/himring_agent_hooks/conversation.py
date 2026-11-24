from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable, Iterable, Sequence
from dataclasses import dataclass, field
from typing import Protocol

from .events import ANSWER_MAXIMUM_LENGTH, AnswerEventDraft, bounded_long_text, now_timestamp

QUESTIONS_PER_TURN_MAXIMUM = 50


@dataclass(frozen=True, slots=True)
class SearchResult:
    question_id: str
    chunk_ids: tuple[str, ...]
    passages: tuple[dict[str, object], ...]


class ConversationHost(Protocol):
    def record(self, drafts: Sequence[AnswerEventDraft]) -> None: ...

    def search(
        self, question: str, limit: int | None, end_user_id: str | None, call_id: str | None
    ) -> Awaitable[SearchResult]: ...

    def flush(self) -> Awaitable[None]: ...


@dataclass(slots=True)
class _Turn:
    questions: dict[str, frozenset[str]] = field(default_factory=dict[str, frozenset[str]])
    answer: str = ""


class AnswerConversation:
    def __init__(
        self,
        host: ConversationHost,
        logger: logging.Logger,
        end_user_id: str | None = None,
        call_id: str | None = None,
    ) -> None:
        self._host = host
        self._logger = logger
        self._end_user_id = end_user_id
        self._call_id = call_id
        self._current = _Turn()
        self._answered: _Turn | None = None

    async def search(self, question: str, limit: int | None = None) -> SearchResult:
        result = await self._host.search(question, limit, self._end_user_id, self._call_id)
        self.remember_search(result.question_id, result.chunk_ids)
        return result

    def remember_search(self, question_id: str, chunk_ids: Iterable[str]) -> None:
        def remember() -> None:
            if self._current.answer:
                self._start_turn()
            if len(self._current.questions) < QUESTIONS_PER_TURN_MAXIMUM:
                self._current.questions[question_id] = frozenset(chunk_ids)

        self._guarded("remember a search", remember)

    def record_answer(self, text: str, cited_chunk_ids: Iterable[str] | None = None) -> None:
        def record() -> None:
            turn = self._current
            piece = bounded_long_text(text, ANSWER_MAXIMUM_LENGTH)
            if not turn.questions or piece is None:
                return
            joined = f"{turn.answer}\n{piece}" if turn.answer else piece
            turn.answer = joined[:ANSWER_MAXIMUM_LENGTH]
            occurred_at = now_timestamp()
            cited = None if cited_chunk_ids is None else tuple(dict.fromkeys(cited_chunk_ids))
            self._host.record(
                [
                    AnswerEventDraft(
                        question_id=question_id,
                        answer=turn.answer,
                        occurred_at=occurred_at,
                        cited_chunk_ids=None
                        if cited is None
                        else tuple(chunk for chunk in cited if chunk in returned),
                    )
                    for question_id, returned in turn.questions.items()
                ]
            )
            self._answered = turn

        self._guarded("record an answer", record)

    def record_user_message(self, text: str) -> None:
        def record() -> None:
            if not self._current.answer:
                return
            occurred_at = now_timestamp()
            self._host.record(
                [
                    AnswerEventDraft(
                        question_id=question_id, follow_up=text, occurred_at=occurred_at
                    )
                    for question_id in self._current.questions
                ]
            )
            self._start_turn()

        self._guarded("record a user message", record)

    def record_thumbs_down(self, question_ids: Iterable[str] | None = None) -> None:
        def record() -> None:
            self._host.record(
                [
                    AnswerEventDraft(question_id=question_id, thumbs_down=True)
                    for question_id in self._targets(question_ids, include_unanswered=False)
                ]
            )

        self._guarded("record a thumbs-down", record)

    def record_handoff(self, reason: str, question_ids: Iterable[str] | None = None) -> None:
        def record() -> None:
            self._host.record(
                [
                    AnswerEventDraft(question_id=question_id, handoff_reason=reason)
                    for question_id in self._targets(question_ids, include_unanswered=True)
                ]
            )

        self._guarded("record a handoff", record)

    async def end(self) -> None:
        await self._host.flush()

    def _targets(self, question_ids: Iterable[str] | None, include_unanswered: bool) -> list[str]:
        if question_ids is not None:
            return list(question_ids)
        current_counts = (
            bool(self._current.questions) if include_unanswered else bool(self._current.answer)
        )
        turn = self._current if current_counts else self._answered
        return [] if turn is None else list(turn.questions)

    def _start_turn(self) -> None:
        if self._current.answer:
            self._answered = self._current
        self._current = _Turn()

    def _guarded(self, action: str, work: Callable[[], None]) -> None:
        try:
            work()
        except Exception:
            self._logger.warning("The answer recorder could not %s", action, exc_info=True)
