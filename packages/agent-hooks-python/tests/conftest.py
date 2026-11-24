from __future__ import annotations

import logging
from collections.abc import Iterator
from pathlib import Path

import pytest

from himring_agent_hooks import AnswerRecorder, HimringTarget, RecorderSettings

from .stand_in_himring import API_KEY, KNOWLEDGE_BASE_ID, PROJECT_ID, RunningStandIn, StandInHimring

NEVER_FLUSH_SECONDS = 3_600.0


@pytest.fixture
def running_stand_in() -> Iterator[RunningStandIn]:
    server = RunningStandIn()
    yield server
    server.stop()


@pytest.fixture
def stand_in(running_stand_in: RunningStandIn) -> StandInHimring:
    return running_stand_in.state


@pytest.fixture
def spool_directory(tmp_path: Path) -> Path:
    return tmp_path / "spool"


def make_recorder(
    base_url: str, spool_directory: Path, close_timeout_seconds: float = 10.0
) -> AnswerRecorder:
    return AnswerRecorder(
        HimringTarget(base_url, API_KEY, PROJECT_ID, KNOWLEDGE_BASE_ID),
        RecorderSettings(
            spool_directory=spool_directory,
            flush_interval_seconds=NEVER_FLUSH_SECONDS,
            close_timeout_seconds=close_timeout_seconds,
        ),
        logging.getLogger("himring_agent_hooks.tests"),
    )


def spool_files(spool_directory: Path) -> list[Path]:
    if not spool_directory.exists():
        return []
    return sorted(spool_directory.glob("*.jsonl"))
