from __future__ import annotations

import errno
import json
import os
import stat
import sys
import time
from collections.abc import Set
from dataclasses import dataclass
from pathlib import Path

from .events import WireEvent, wire_event_from_json
from .json_shapes import object_list, parsed_object_map

SPOOL_FILE_PREFIX = "answers-"
SPOOL_FILE_SUFFIX = ".jsonl"
SPOOL_ORPHAN_AFTER_SECONDS = 5 * 60.0
OWNER_ONLY_FILE_MODE = 0o600
OWNER_ONLY_DIRECTORY_MODE = 0o700
GROUP_OR_OTHER_WRITE_BITS = 0o022
SPOOL_HEADER_READ_BYTES = 4_096
POSIX_PROCESS_SIGNALS = os.name == "posix"


@dataclass(frozen=True, slots=True)
class SpooledEvent:
    id: str
    event: WireEvent


@dataclass(frozen=True, slots=True)
class SpoolOwner:
    host: str
    pid: int
    instance: str
    destination: str


def _line(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")


def owner_line(owner: SpoolOwner) -> bytes:
    return _line(
        {
            "kind": "owner",
            "host": owner.host,
            "pid": owner.pid,
            "instance": owner.instance,
            "destination": owner.destination,
        }
    )


def event_line(item: SpooledEvent) -> bytes:
    return _line({"kind": "event", "id": item.id, "event": item.event})


def done_line(ids: list[str]) -> bytes:
    return _line({"kind": "done", "ids": ids})


def unsent_events(text: str) -> list[SpooledEvent]:
    events: dict[str, WireEvent] = {}
    done: set[str] = set()
    for raw in text.split("\n"):
        if not raw.strip():
            continue
        line = parsed_object_map(raw)
        if line is None:
            continue
        identifier = line.get("id")
        if line.get("kind") == "event" and isinstance(identifier, str):
            event = wire_event_from_json(line.get("event"))
            if event is not None:
                events[identifier] = event
            continue
        ids = object_list(line.get("ids"))
        if line.get("kind") == "done" and ids is not None:
            done.update(entry for entry in ids if isinstance(entry, str))
    return [SpooledEvent(id, event) for id, event in events.items() if id not in done]


def owner_of(path: Path) -> SpoolOwner | None:
    try:
        with path.open("rb") as file:
            head = file.read(SPOOL_HEADER_READ_BYTES)
    except OSError:
        return None
    first = head.split(b"\n", 1)[0].decode("utf-8", "replace")
    line = parsed_object_map(first)
    if line is None or line.get("kind") != "owner":
        return None
    host, pid, instance = line.get("host"), line.get("pid"), line.get("instance")
    if not isinstance(host, str) or not isinstance(instance, str) or not isinstance(pid, int):
        return None
    destination = line.get("destination")
    if not isinstance(destination, str):
        return None
    return SpoolOwner(host, pid, instance, destination)


def _process_is_alive(pid: int) -> bool:
    if not POSIX_PROCESS_SIGNALS:
        return True
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except OSError as error:
        return error.errno != errno.ESRCH
    return True


def is_orphaned(
    owner: SpoolOwner | None,
    modified_at: float,
    host: str,
    live_instances: Set[str],
) -> bool:
    if owner is None or owner.host != host:
        return time.time() - modified_at > SPOOL_ORPHAN_AFTER_SECONDS
    if owner.pid == os.getpid():
        return owner.instance not in live_instances
    return not _process_is_alive(owner.pid)


def _own_uid() -> int | None:
    if sys.platform == "win32":
        return None
    return os.getuid()


def is_private_directory(directory: Path) -> bool:
    details = directory.lstat()
    if not stat.S_ISDIR(details.st_mode) or details.st_mode & GROUP_OR_OTHER_WRITE_BITS:
        return False
    uid = _own_uid()
    return uid is None or details.st_uid == uid


def is_own_regular_file(details: os.stat_result) -> bool:
    if not stat.S_ISREG(details.st_mode):
        return False
    uid = _own_uid()
    return uid is None or details.st_uid == uid


def is_spool_file_name(name: str) -> bool:
    return name.startswith(SPOOL_FILE_PREFIX) and name.endswith(SPOOL_FILE_SUFFIX)
