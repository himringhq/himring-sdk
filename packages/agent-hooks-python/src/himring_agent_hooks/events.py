from __future__ import annotations

import json
import re
import unicodedata
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import TypeAlias

from himring.types import RecordAnswerEventsInputEventsItem

from .json_shapes import object_list, object_map

ANSWER_MAXIMUM_LENGTH = 20_000
FOLLOW_UP_MAXIMUM_LENGTH = 2_000
HANDOFF_REASON_MAXIMUM_LENGTH = 200
CITED_CHUNKS_MAXIMUM = 50
ANSWER_EVENTS_PER_REQUEST_MAXIMUM = 100
ANSWER_EVENTS_BODY_MAXIMUM_BYTES = 8 * 1024 * 1024
ANSWER_BATCH_BODY_BUDGET_BYTES = ANSWER_EVENTS_BODY_MAXIMUM_BYTES // 2

QUESTION_ID_PATTERN = re.compile(r"qst_[0-9a-f]{32}")
CHUNK_ID_PATTERN = re.compile(r"chk_[0-9a-f]{32}")
LINE_BREAKS_AND_TAB = frozenset("\n\r\t")
REPLACEMENT_CHARACTER = "�"
FIRST_SURROGATE = 0xD800
LAST_SURROGATE = 0xDFFF
FIRST_ASTRAL_CODE_POINT = 0x10000
JS_TRIMMED_EXTRA = "﻿"

WireEvent: TypeAlias = RecordAnswerEventsInputEventsItem


@dataclass(frozen=True, slots=True)
class AnswerEventDraft:
    question_id: str
    answer: str | None = None
    follow_up: str | None = None
    cited_chunk_ids: tuple[str, ...] | None = None
    thumbs_down: bool = False
    handoff_reason: str | None = None
    occurred_at: str | None = None


def now_timestamp() -> str:
    return datetime.now(UTC).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _is_control(character: str) -> bool:
    return unicodedata.category(character) == "Cc"


def _well_formed(text: str) -> str:
    return "".join(
        REPLACEMENT_CHARACTER if FIRST_SURROGATE <= ord(character) <= LAST_SURROGATE else character
        for character in text
    )


def _utf16_prefix(text: str, maximum_units: int) -> str:
    kept: list[str] = []
    units = 0
    for character in text:
        width = 2 if ord(character) >= FIRST_ASTRAL_CODE_POINT else 1
        if units + width > maximum_units:
            break
        kept.append(character)
        units += width
    return "".join(kept)


def _trimmed(text: str) -> str:
    return text.strip().strip(JS_TRIMMED_EXTRA).strip()


def bounded_long_text(text: str, maximum: int) -> str | None:
    without_controls = "".join(
        character
        for character in text
        if character in LINE_BREAKS_AND_TAB or not _is_control(character)
    )
    cleaned = _utf16_prefix(_trimmed(_well_formed(without_controls)), maximum)
    return cleaned or None


def bounded_handoff_reason(reason: str) -> str | None:
    spaced = "".join(" " if _is_control(character) else character for character in reason)
    cleaned = _trimmed(_utf16_prefix(_trimmed(_well_formed(spaced)), HANDOFF_REASON_MAXIMUM_LENGTH))
    return cleaned or None


def _cited(chunk_ids: Iterable[str]) -> list[str]:
    unique = [
        chunk_id for chunk_id in dict.fromkeys(chunk_ids) if CHUNK_ID_PATTERN.fullmatch(chunk_id)
    ]
    return unique[:CITED_CHUNKS_MAXIMUM]


def _valid_timestamp(value: str) -> bool:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return False
    return parsed.tzinfo is not None


def wire_event(draft: AnswerEventDraft) -> WireEvent | None:
    if not QUESTION_ID_PATTERN.fullmatch(draft.question_id):
        return None
    event: WireEvent = {"question_id": draft.question_id}
    answer = (
        None if draft.answer is None else bounded_long_text(draft.answer, ANSWER_MAXIMUM_LENGTH)
    )
    follow_up = (
        None
        if draft.follow_up is None
        else bounded_long_text(draft.follow_up, FOLLOW_UP_MAXIMUM_LENGTH)
    )
    handoff = None if draft.handoff_reason is None else bounded_handoff_reason(draft.handoff_reason)
    if answer is not None:
        event["answer"] = answer
    if follow_up is not None:
        event["follow_up"] = follow_up
    if handoff is not None:
        event["handoff_reason"] = handoff
    if draft.cited_chunk_ids is not None:
        event["cited_chunk_ids"] = _cited(draft.cited_chunk_ids)
    if draft.thumbs_down:
        event["thumbs_down"] = True
    if len(event) == 1:
        return None
    if draft.occurred_at is not None and _valid_timestamp(draft.occurred_at):
        event["occurred_at"] = draft.occurred_at
    return event


def _text_field(value: object) -> str | None:
    return value if isinstance(value, str) else None


def wire_event_from_json(value: object) -> WireEvent | None:
    fields = object_map(value)
    if fields is None:
        return None
    question_id = _text_field(fields.get("question_id"))
    if question_id is None:
        return None
    cited = object_list(fields.get("cited_chunk_ids"))
    cited_ids = None if cited is None else tuple(item for item in cited if isinstance(item, str))
    return wire_event(
        AnswerEventDraft(
            question_id=question_id,
            answer=_text_field(fields.get("answer")),
            follow_up=_text_field(fields.get("follow_up")),
            cited_chunk_ids=cited_ids,
            thumbs_down=fields.get("thumbs_down") is True,
            handoff_reason=_text_field(fields.get("handoff_reason")),
            occurred_at=_text_field(fields.get("occurred_at")),
        )
    )


def encoded(value: object) -> bytes:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
