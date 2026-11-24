from __future__ import annotations

import asyncio
import sys
from pathlib import Path

from himring_agent_hooks import AnswerRecorder, HimringTarget, RecorderSettings

NEVER_FLUSH_SECONDS = 3_600.0


async def record_then_wait(arguments: list[str]) -> None:
    base_url, spool_directory, api_key, project_id, knowledge_base_id, *question_ids = arguments
    recorder = AnswerRecorder(
        HimringTarget(base_url, api_key, project_id, knowledge_base_id),
        RecorderSettings(
            spool_directory=Path(spool_directory), flush_interval_seconds=NEVER_FLUSH_SECONDS
        ),
    )
    conversation = recorder.conversation(end_user_id="caller-7")
    for question_id in question_ids:
        conversation.remember_search(question_id, [])
        conversation.record_answer(f"The answer to {question_id}.")
    sys.stdout.write("recorded\n")
    sys.stdout.flush()
    await asyncio.sleep(NEVER_FLUSH_SECONDS)


if __name__ == "__main__":
    asyncio.run(record_then_wait(sys.argv[1:]))
