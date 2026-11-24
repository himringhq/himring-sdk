from __future__ import annotations

import asyncio
import os
import signal
import stat
import subprocess
import sys
import time
from pathlib import Path

import pytest

from himring_agent_hooks import AnswerRecorder, HimringTarget, RecorderSettings

from .conftest import make_recorder, spool_files
from .stand_in_himring import (
    API_KEY,
    KNOWLEDGE_BASE_ID,
    PROJECT_ID,
    RunningStandIn,
    ScriptedReply,
    StandInHimring,
    chunk_id,
    question_id,
)

RETRY_AFTER_SECONDS = 1
RETRY_AFTER_TOLERANCE_SECONDS = 0.05
CHILD_RECORDED_QUESTIONS = 5
CHILD_START_TIMEOUT_SECONDS = 60
OWNER_READ_WRITE_ONLY = 0o600


def test_waits_out_429_and_500_honours_retry_after_and_delivers_once(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    identifier = question_id()
    stand_in.known_question_ids.add(identifier)
    stand_in.scripted.extend(
        [
            ScriptedReply(
                429,
                {"error": {"code": "rate_limited", "message": "Slow down."}},
                {"retry-after": str(RETRY_AFTER_SECONDS)},
            ),
            ScriptedReply(500, {"error": {"code": "internal", "message": "Broken."}}),
        ]
    )

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation()
        conversation.remember_search(identifier, [])
        conversation.record_answer("Opening hours are nine to five.")
        await recorder.close()

    asyncio.run(scenario())

    assert len(stand_in.arrival_times) == 3
    first, second = stand_in.arrival_times[0], stand_in.arrival_times[1]
    assert second - first >= RETRY_AFTER_SECONDS - RETRY_AFTER_TOLERANCE_SECONDS
    assert [(event["question_id"], event["answer"]) for event in stand_in.arrived()] == [
        (identifier, "Opening hours are nine to five.")
    ]
    assert spool_files(spool_directory) == []


def test_splits_250_answers_into_requests_of_at_most_100(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    identifiers = [question_id() for _ in range(250)]
    stand_in.known_question_ids.update(identifiers)

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation()
        for identifier in identifiers:
            conversation.remember_search(identifier, [])
            conversation.record_answer(f"Answer for {identifier}")
        await recorder.close()

    asyncio.run(scenario())

    assert stand_in.refusals == []
    assert all(len(batch) <= 100 for batch in stand_in.batches)
    assert sorted(str(event["question_id"]) for event in stand_in.arrived()) == sorted(identifiers)


def test_keeps_the_first_20000_characters_and_strips_control_characters(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    identifier = question_id()
    stand_in.known_question_ids.add(identifier)

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation()
        conversation.remember_search(identifier, [])
        conversation.record_answer("\x07" + "ab" * 15_000 + "\x00")
        await recorder.close()

    asyncio.run(scenario())

    assert stand_in.refusals == []
    assert [event["answer"] for event in stand_in.arrived()] == ["ab" * 10_000]


def test_sends_only_the_cited_chunks_that_the_search_returned(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    returned = [chunk_id(), chunk_id()]
    foreign = chunk_id()
    stand_in.search_chunks.extend(returned)

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation(end_user_id="caller-9", call_id="call-42")
        await conversation.search("When do you open?")
        conversation.record_answer("At nine.", cited_chunk_ids=[foreign, returned[1]])
        await recorder.close()

    asyncio.run(scenario())

    assert stand_in.search_requests == [
        {"question": "When do you open?", "end_user_id": "caller-9", "call_id": "call-42"}
    ]
    assert [event["cited_chunk_ids"] for event in stand_in.arrived()] == [[returned[1]]]


def test_accepts_question_not_found_never_resends_it_and_keeps_the_rest(
    stand_in: StandInHimring, spool_directory: Path, caplog: pytest.LogCaptureFixture
) -> None:
    known, unknown = question_id(), question_id()
    stand_in.known_question_ids.add(known)
    requests_after_first_flush = 0

    async def scenario() -> None:
        nonlocal requests_after_first_flush
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation()
        conversation.remember_search(known, [])
        conversation.remember_search(unknown, [])
        conversation.remember_search("qst_not_issued_by_himring", [])
        conversation.record_answer("Two questions, one answer.")
        await recorder.flush()
        requests_after_first_flush = len(stand_in.arrival_times)
        await recorder.close()

    asyncio.run(scenario())

    assert stand_in.refusals == []
    assert len(stand_in.arrival_times) == requests_after_first_flush
    assert sorted(str(event["question_id"]) for event in stand_in.arrived()) == sorted(
        [known, unknown]
    )
    assert "did not recognise" in caplog.text
    assert spool_files(spool_directory) == []


def test_never_raises_while_himring_is_unreachable_and_keeps_answers_on_disk(
    running_stand_in: RunningStandIn, spool_directory: Path
) -> None:
    base_url = running_stand_in.state.base_url
    running_stand_in.stop()

    async def scenario() -> None:
        recorder = make_recorder(base_url, spool_directory, close_timeout_seconds=0.2)
        conversation = recorder.conversation()
        conversation.remember_search(question_id(), [])
        conversation.record_answer("Kept for later.")
        conversation.record_handoff("transferred_to_person")
        await recorder.close()

    asyncio.run(scenario())
    assert len(spool_files(spool_directory)) == 1


def _run_agent_until_killed(
    stand_in: StandInHimring, spool_directory: Path, ids: list[str]
) -> None:
    script = Path(__file__).with_name("recording_agent_process.py")
    arguments = [stand_in.base_url, str(spool_directory), API_KEY, PROJECT_ID, KNOWLEDGE_BASE_ID]
    with subprocess.Popen(
        [sys.executable, str(script), *arguments, *ids], stdout=subprocess.PIPE
    ) as child:
        assert child.stdout is not None
        line = child.stdout.readline()
        assert line == b"recorded\n"
        os.kill(child.pid, signal.SIGKILL)
        assert child.wait(CHILD_START_TIMEOUT_SECONDS) == -signal.SIGKILL


def test_sends_what_a_killed_agent_recorded_and_skips_its_torn_last_line(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    identifiers = [question_id() for _ in range(CHILD_RECORDED_QUESTIONS)]
    stand_in.known_question_ids.update(identifiers)
    _run_agent_until_killed(stand_in, spool_directory, identifiers)

    [left_behind] = spool_files(spool_directory)
    assert stat.S_IMODE(left_behind.stat().st_mode) == OWNER_READ_WRITE_ONLY
    assert stand_in.arrival_times == []
    content = left_behind.read_bytes()
    last_line_start = content.rindex(b"\n", 0, len(content) - 1) + 1
    left_behind.write_bytes(content[: last_line_start + (len(content) - last_line_start) // 2])

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        await recorder.flush()
        await recorder.close()

    asyncio.run(scenario())

    assert stand_in.refusals == []
    arrived = stand_in.arrived()
    assert sorted(str(event["question_id"]) for event in arrived) == sorted(identifiers[:-1])
    assert all(event["answer"] == f"The answer to {event['question_id']}." for event in arrived)
    assert spool_files(spool_directory) == []


def test_replays_answers_only_to_the_original_api_project_and_knowledge_base(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    identifiers = [question_id()]
    stand_in.known_question_ids.update(identifiers)
    _run_agent_until_killed(stand_in, spool_directory, identifiers)
    original_files = spool_files(spool_directory)
    other = RunningStandIn()

    async def scenario() -> None:
        targets = [
            HimringTarget(stand_in.base_url, API_KEY, "prj_" + "3" * 32, KNOWLEDGE_BASE_ID),
            HimringTarget(stand_in.base_url, API_KEY, PROJECT_ID, "kb_" + "4" * 32),
            HimringTarget(other.state.base_url, API_KEY, PROJECT_ID, KNOWLEDGE_BASE_ID),
        ]
        for target in targets:
            recorder = AnswerRecorder(target, RecorderSettings(spool_directory=spool_directory))
            try:
                await recorder.flush()
            finally:
                await recorder.close()
            assert stand_in.arrival_times == []
            assert other.state.arrival_times == []
            assert stand_in.refusals == []
            assert spool_files(spool_directory) == original_files
        original = make_recorder(stand_in.base_url, spool_directory)
        try:
            await original.flush()
        finally:
            await original.close()

    try:
        asyncio.run(scenario())
    finally:
        other.stop()
    assert [event["question_id"] for event in stand_in.arrived()] == identifiers
    assert spool_files(spool_directory) == []


def test_a_stale_heartbeat_does_not_steal_answers_from_a_live_recorder(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    identifier = question_id()
    stand_in.known_question_ids.add(identifier)
    first = make_recorder(stand_in.base_url, spool_directory)
    conversation = first.conversation()
    conversation.remember_search(identifier, [])
    conversation.record_answer("The refund is approved.")
    for file in spool_files(spool_directory):
        os.utime(file, (time.time() - 600, time.time() - 600))

    async def scenario() -> None:
        second = make_recorder(stand_in.base_url, spool_directory)
        try:
            await second.flush()
            assert stand_in.arrival_times == []
        finally:
            await second.close()
            await first.close()

    asyncio.run(scenario())
    assert [event["question_id"] for event in stand_in.arrived()] == [identifier]
