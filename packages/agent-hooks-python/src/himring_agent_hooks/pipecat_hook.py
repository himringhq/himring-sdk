from __future__ import annotations

from collections.abc import Callable, Coroutine
from typing import Protocol

from pipecat.frames.frames import Frame
from pipecat.processors.aggregators.llm_response_universal import (
    AssistantTurnStoppedMessage,
    UserTurnMessageAddedMessage,
)

from .conversation import AnswerConversation

PipecatHandler = Callable[..., Coroutine[object, object, None]]


class PipecatEventSource(Protocol):
    def add_event_handler(self, event_name: str, handler: PipecatHandler) -> None: ...


class PipecatAnswerHook:
    def __init__(self, conversation: AnswerConversation) -> None:
        self._conversation = conversation

    async def on_assistant_turn_stopped(
        self, aggregator: object, message: AssistantTurnStoppedMessage
    ) -> None:
        if message.content:
            self._conversation.record_answer(message.content)

    async def on_user_turn_message_added(
        self, aggregator: object, message: UserTurnMessageAddedMessage
    ) -> None:
        if message.content:
            self._conversation.record_user_message(message.content)

    async def on_pipeline_finished(self, worker: object, frame: Frame) -> None:
        await self._conversation.end()


def attach_pipecat_pipeline(
    conversation: AnswerConversation,
    assistant_aggregator: PipecatEventSource,
    user_aggregator: PipecatEventSource | None = None,
    worker: PipecatEventSource | None = None,
) -> PipecatAnswerHook:
    hook = PipecatAnswerHook(conversation)
    assistant_aggregator.add_event_handler(
        "on_assistant_turn_stopped", hook.on_assistant_turn_stopped
    )
    if user_aggregator is not None:
        user_aggregator.add_event_handler(
            "on_user_turn_message_added", hook.on_user_turn_message_added
        )
    if worker is not None:
        worker.add_event_handler("on_pipeline_finished", hook.on_pipeline_finished)
    return hook
