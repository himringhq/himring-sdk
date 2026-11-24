# himring-agent-hooks

This package records what a voice agent built on LiveKit or Pipecat said after it searched a [Himring](https://himring.ai) knowledge base, and it sends those answers to Himring so that Himring can judge them.

```sh
pip install "himring-agent-hooks[livekit]"
pip install "himring-agent-hooks[pipecat]"
```

The package needs Python 3.11 or later, and it calls Himring through the `himring` SDK.

## Recording a conversation

```python
from himring_agent_hooks import AnswerRecorder, HimringTarget
from himring_agent_hooks.livekit_hook import attach_livekit_session

recorder = AnswerRecorder(
    HimringTarget(
        base_url="https://api.himring.ai",
        api_key="hk_live_...",
        project_id="prj_...",
        knowledge_base_id="kb_...",
    )
)
conversation = recorder.conversation(end_user_id="caller-7", call_id="room-12")
attach_livekit_session(conversation, session)

found = await conversation.search("When do you open on Sunday?")
```

The recorder sends answers in batches of at most 100, every 5 seconds by default or as soon as 100 answers are waiting. It retries a batch when Himring is unreachable or answers 429 or a 5xx status, and it waits as long as the `Retry-After` header asks, up to 60 seconds. The recorder also writes each answer to a spool directory that only your user can read, so that a later recorder can send what an agent left there when its process died.

Call `await recorder.close()` before the process exits, so that the recorder can send what it still holds.

## License

MIT
