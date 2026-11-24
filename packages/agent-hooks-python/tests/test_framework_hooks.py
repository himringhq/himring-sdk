from __future__ import annotations

import asyncio
from pathlib import Path

from livekit.agents import AgentSession, CloseEvent, ConversationItemAddedEvent
from livekit.agents.llm import ChatMessage
from livekit.agents.voice.events import CloseReason
from pipecat.frames.frames import (
    EndFrame,
    LLMFullResponseEndFrame,
    LLMFullResponseStartFrame,
    LLMTextFrame,
)
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineWorker
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import LLMContextAggregatorPair
from pipecat.workers.runner import WorkerRunner

from himring_agent_hooks.livekit_hook import attach_livekit_session
from himring_agent_hooks.pipecat_hook import attach_pipecat_pipeline

from .conftest import make_recorder
from .stand_in_himring import StandInHimring, chunk_id

PIPELINE_TIMEOUT_SECONDS = 30.0


def _livekit_message(role: str, text: str) -> ConversationItemAddedEvent:
    if role == "user":
        return ConversationItemAddedEvent(item=ChatMessage(role="user", content=[text]))
    return ConversationItemAddedEvent(item=ChatMessage(role="assistant", content=[text]))


def test_livekit_session_sends_the_spoken_answer_and_the_follow_up(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    cited = chunk_id()
    stand_in.search_chunks.append(cited)
    question_ids: list[str] = []

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation(end_user_id="caller-3", call_id="room-12")
        session: AgentSession[None] = AgentSession()
        attach_livekit_session(conversation, session)
        session.emit("conversation_item_added", _livekit_message("user", "When do you open?"))
        result = await conversation.search("When do you open?")
        question_ids.append(result.question_id)
        session.emit("conversation_item_added", _livekit_message("assistant", "We open at nine."))
        session.emit("conversation_item_added", _livekit_message("user", "And on Sunday?"))
        session.emit("close", CloseEvent(reason=CloseReason.PARTICIPANT_DISCONNECTED))
        await recorder.close()

    asyncio.run(scenario())

    [identifier] = question_ids
    arrived = stand_in.arrived()
    assert stand_in.refusals == []
    assert [
        (event["question_id"], event.get("answer")) for event in arrived if "answer" in event
    ] == [(identifier, "We open at nine.")]
    assert [event["follow_up"] for event in arrived if "follow_up" in event] == ["And on Sunday?"]


def test_pipecat_pipeline_sends_the_answer_when_the_pipeline_finishes(
    stand_in: StandInHimring, spool_directory: Path
) -> None:
    stand_in.search_chunks.append(chunk_id())
    arrived_before_close: list[dict[str, object]] = []
    question_ids: list[str] = []

    async def scenario() -> None:
        recorder = make_recorder(stand_in.base_url, spool_directory)
        conversation = recorder.conversation(end_user_id="caller-4")
        pair = LLMContextAggregatorPair(LLMContext())
        worker = PipelineWorker(Pipeline([pair.assistant()]))
        attach_pipecat_pipeline(conversation, pair.assistant(), pair.user(), worker)
        result = await conversation.search("Do you deliver?")
        question_ids.append(result.question_id)
        await worker.queue_frames(
            [
                LLMFullResponseStartFrame(),
                LLMTextFrame("Yes, within ten miles."),
                LLMFullResponseEndFrame(),
                EndFrame(),
            ]
        )
        runner = WorkerRunner(handle_sigint=False)
        await runner.add_workers(worker)
        await asyncio.wait_for(runner.run(), PIPELINE_TIMEOUT_SECONDS)
        arrived_before_close.extend(stand_in.arrived())
        await recorder.close()

    asyncio.run(scenario())

    [identifier] = question_ids
    assert stand_in.refusals == []
    assert [(event["question_id"], event["answer"]) for event in arrived_before_close] == [
        (identifier, "Yes, within ten miles.")
    ]
