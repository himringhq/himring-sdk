from __future__ import annotations

import asyncio
from collections.abc import Callable
from typing import Literal, Protocol

from livekit.agents import CloseEvent, ConversationItemAddedEvent, JobContext
from livekit.agents.llm import ChatMessage

from .conversation import AnswerConversation

LiveKitSessionEvent = Literal["conversation_item_added", "close"]


class LiveKitSession(Protocol):
    def on(
        self, event: LiveKitSessionEvent, callback: Callable[..., object] | None = None
    ) -> object: ...


class LiveKitAnswerHook:
    def __init__(self, conversation: AnswerConversation) -> None:
        self._conversation = conversation
        self._ending: set[asyncio.Task[None]] = set()

    def on_conversation_item_added(self, event: ConversationItemAddedEvent) -> None:
        item = event.item
        if not isinstance(item, ChatMessage):
            return
        text = item.text_content
        if not text:
            return
        if item.role == "assistant":
            self._conversation.record_answer(text)
        elif item.role == "user":
            self._conversation.record_user_message(text)

    def on_close(self, event: CloseEvent) -> None:
        try:
            task = asyncio.get_running_loop().create_task(self._conversation.end())
        except RuntimeError:
            return
        self._ending.add(task)
        task.add_done_callback(self._ending.discard)

    async def on_shutdown(self) -> None:
        await self._conversation.end()


def attach_livekit_session(
    conversation: AnswerConversation,
    session: LiveKitSession,
    job_context: JobContext | None = None,
) -> LiveKitAnswerHook:
    hook = LiveKitAnswerHook(conversation)
    session.on("conversation_item_added", hook.on_conversation_item_added)
    session.on("close", hook.on_close)
    if job_context is not None:
        job_context.add_shutdown_callback(hook.on_shutdown)
    return hook
