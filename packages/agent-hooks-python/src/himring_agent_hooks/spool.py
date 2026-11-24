from __future__ import annotations

import contextlib
import logging
import os
import socket
import time
import uuid
from collections.abc import Callable, Sequence
from pathlib import Path

from .spool_files import (
    OWNER_ONLY_DIRECTORY_MODE,
    OWNER_ONLY_FILE_MODE,
    SPOOL_FILE_PREFIX,
    SPOOL_FILE_SUFFIX,
    SpooledEvent,
    SpoolOwner,
    done_line,
    event_line,
    is_orphaned,
    is_own_regular_file,
    is_private_directory,
    is_spool_file_name,
    owner_line,
    owner_of,
    unsent_events,
)

SPOOL_HEARTBEAT_SECONDS = 30.0
SPOOL_COMPACT_AFTER_BYTES = 16 * 1024 * 1024
RECOVERED_FILE_MAXIMUM_BYTES = 64 * 1024 * 1024
CREATE_EXCLUSIVE_FOR_APPEND = os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_APPEND

_live_instances: set[str] = set()


class AnswerSpool:
    def __init__(
        self,
        directory: Path,
        destination: str,
        logger: logging.Logger,
        pending_events: Callable[[], Sequence[SpooledEvent]],
    ) -> None:
        self._directory = directory
        self._destination = destination
        self._logger = logger
        self._pending_events = pending_events
        self._instance = uuid.uuid4().hex
        self._host = socket.gethostname()
        self._descriptor: int | None = None
        self._path: Path | None = None
        self._written_bytes = 0
        self._line_break_owed = False
        self._last_heartbeat = 0.0
        _live_instances.add(self._instance)

    @classmethod
    def open(
        cls,
        directory: Path,
        destination: str,
        logger: logging.Logger,
        pending_events: Callable[[], Sequence[SpooledEvent]],
    ) -> AnswerSpool | None:
        try:
            directory.mkdir(mode=OWNER_ONLY_DIRECTORY_MODE, parents=True, exist_ok=True)
            if not is_private_directory(directory):
                logger.warning(
                    "The answer spool directory %s is shared with other users, "
                    "so answers are kept in memory only",
                    directory,
                )
                return None
        except OSError:
            logger.warning(
                "The answer spool directory %s is unusable, so answers are kept in memory only",
                directory,
                exc_info=True,
            )
            return None
        return cls(directory, destination, logger, pending_events)

    def append(self, items: Sequence[SpooledEvent]) -> bool:
        return not items or self._write(b"".join(event_line(item) for item in items))

    def mark_done(self, ids: list[str]) -> None:
        if ids and self._descriptor is not None:
            self._write(done_line(ids))

    def settle(self) -> None:
        if self._descriptor is None:
            return
        if not self._pending_events():
            self._discard_file()
        elif self._written_bytes > SPOOL_COMPACT_AFTER_BYTES:
            self._replace_file()

    def close(self, keep_unsent: bool) -> None:
        if keep_unsent and self._pending_events():
            self._close_descriptor()
        else:
            self._discard_file()
        _live_instances.discard(self._instance)

    def heartbeat(self) -> None:
        now = time.monotonic()
        if self._path is None or now - self._last_heartbeat < SPOOL_HEARTBEAT_SECONDS:
            return
        self._last_heartbeat = now
        try:
            os.utime(self._path)
        except FileNotFoundError:
            self._replace_file()
        except OSError:
            return

    def recover_orphans(self) -> list[SpooledEvent]:
        try:
            names = sorted(entry.name for entry in os.scandir(self._directory))
        except OSError:
            self._logger.warning("The answer spool directory could not be read", exc_info=True)
            return []
        own = None if self._path is None else self._path.name
        recovered: list[SpooledEvent] = []
        for name in names:
            if is_spool_file_name(name) and name != own:
                recovered.extend(self._recover_file(self._directory / name))
        return recovered

    def _recover_file(self, path: Path) -> list[SpooledEvent]:
        try:
            details = path.lstat()
            if not is_own_regular_file(details):
                return []
            owner = owner_of(path)
            if owner is None or owner.destination != self._destination:
                return []
            if not is_orphaned(owner, details.st_mtime, self._host, _live_instances):
                return []
            if details.st_size > RECOVERED_FILE_MAXIMUM_BYTES:
                self._logger.warning("The answer spool file %s is too large to send", path)
                return []
            claimed = (
                self._directory
                / f"{SPOOL_FILE_PREFIX}claimed-{uuid.uuid4().hex}{SPOOL_FILE_SUFFIX}"
            )
            path.rename(claimed)
            events = unsent_events(claimed.read_bytes().decode("utf-8", "replace"))
            if not self.append(events):
                return []
            claimed.unlink()
            return events
        except FileNotFoundError:
            return []
        except OSError:
            self._logger.warning("The answer spool file %s could not be read", path, exc_info=True)
            return []

    def _ensure_file(self) -> int:
        if self._descriptor is not None:
            return self._descriptor
        name = f"{SPOOL_FILE_PREFIX}{self._instance}-{uuid.uuid4().hex}{SPOOL_FILE_SUFFIX}"
        path = self._directory / name
        descriptor = os.open(path, CREATE_EXCLUSIVE_FOR_APPEND, OWNER_ONLY_FILE_MODE)
        self._descriptor = descriptor
        self._path = path
        self._written_bytes = 0
        self._line_break_owed = False
        self._last_heartbeat = time.monotonic()
        self._write_all(
            descriptor,
            owner_line(SpoolOwner(self._host, os.getpid(), self._instance, self._destination)),
        )
        return descriptor

    def _write(self, data: bytes) -> bool:
        try:
            descriptor = self._ensure_file()
            self._write_all(descriptor, b"\n" + data if self._line_break_owed else data)
            os.fsync(descriptor)
            self._line_break_owed = False
            return True
        except OSError:
            self._line_break_owed = True
            self._logger.warning(
                "An answer could not be written to the spool, so it is kept in memory only",
                exc_info=True,
            )
            return False

    def _write_all(self, descriptor: int, data: bytes) -> None:
        view = memoryview(data)
        while view:
            written = os.write(descriptor, view)
            view = view[written:]
        self._written_bytes += len(data)

    def _replace_file(self) -> None:
        previous = self._path
        self._close_descriptor()
        if not self.append(list(self._pending_events())):
            return
        if previous is not None:
            previous.unlink(missing_ok=True)

    def _discard_file(self) -> None:
        previous = self._path
        self._close_descriptor()
        if previous is not None:
            previous.unlink(missing_ok=True)

    def _close_descriptor(self) -> None:
        if self._descriptor is not None:
            with contextlib.suppress(OSError):
                os.close(self._descriptor)
        self._descriptor = None
        self._path = None
