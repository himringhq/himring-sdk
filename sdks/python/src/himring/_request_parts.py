from __future__ import annotations

import json
import math
import os
import urllib.parse
from collections.abc import AsyncIterator, Iterator, Mapping
from dataclasses import dataclass
from typing import BinaryIO, cast

from himring._errors import invalid_input
from himring._omitted import Omitted
from himring._operation_description import OperationDescription

FILE_CONTENT_FIELD = "content"
DOT_SEGMENTS = frozenset({".", ".."})
FILE_CHUNK_BYTES = 64 * 1024
MEMORY_CHUNK_BYTES = 1024 * 1024
JSON_SEPARATORS = (",", ":")


@dataclass(frozen=True, slots=True)
class FileBody:
    operation_id: str
    content: memoryview | BinaryIO
    size_bytes: int | None
    maximum_bytes: int


@dataclass(frozen=True, slots=True)
class RequestParts:
    path: str
    query: tuple[tuple[str, str], ...]
    json_body: bytes | None
    file_body: FileBody | None


def json_bytes_of(value: object) -> bytes:
    text = json.dumps(value, ensure_ascii=False, separators=JSON_SEPARATORS, allow_nan=False)
    return text.encode("utf-8")


def _given_fields(operation: OperationDescription, raw: object) -> dict[str, object]:
    if raw is None:
        return {}
    if not isinstance(raw, Mapping):
        raise invalid_input(f"The input of {operation.operation_id} must be a mapping.", None)
    given: dict[str, object] = {}
    for name, value in cast("Mapping[object, object]", raw).items():
        if not isinstance(name, str):
            raise invalid_input(
                f"The input of {operation.operation_id} takes text field names.", None
            )
        if isinstance(value, Omitted):
            continue
        if value is None and name not in operation.nullable_fields:
            continue
        given[name] = value
    return given


def _path_segment(operation: OperationDescription, name: str, value: object) -> str:
    if isinstance(value, bool) or not isinstance(value, (str, int)):
        raise invalid_input(f"{operation.operation_id} needs {name} as text in the path.", name)
    text = str(value)
    if text == "" or text in DOT_SEGMENTS:
        raise invalid_input(
            f"{operation.operation_id} needs {name}, and it cannot be empty, '.', or '..'.", name
        )
    try:
        return urllib.parse.quote(text, safe="")
    except UnicodeEncodeError as error:
        raise invalid_input(
            f"{operation.operation_id} needs {name} as valid Unicode text.", name
        ) from error


def _query_text(operation: OperationDescription, name: str, value: object) -> str:
    if isinstance(value, str):
        if not value.isascii():
            try:
                value.encode("utf-8")
            except UnicodeEncodeError as error:
                raise invalid_input(
                    f"{operation.operation_id} needs {name} as valid Unicode text.", name
                ) from error
        return value
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        if not math.isfinite(value):
            raise invalid_input(f"{operation.operation_id} takes {name} as a finite number.", name)
        return str(int(value)) if value.is_integer() else repr(value)
    if isinstance(value, (list, tuple)):
        items = cast("list[object] | tuple[object, ...]", value)
        return ",".join(_query_text(operation, name, item) for item in items)
    raise invalid_input(f"{operation.operation_id} takes {name} as text.", name)


def _remaining_bytes(file: BinaryIO) -> int | None:
    try:
        if not file.seekable():
            return None
        start = file.tell()
        end = file.seek(0, os.SEEK_END)
        file.seek(start)
    except (OSError, ValueError):
        return None
    return max(0, end - start)


def _file_body_of(operation: OperationDescription, given: Mapping[str, object]) -> FileBody:
    content = given.get(FILE_CONTENT_FIELD)
    maximum = operation.maximum_body_bytes or 0
    size: int | None
    body: memoryview | BinaryIO
    if isinstance(content, (bytes, bytearray, memoryview)):
        view = memoryview(cast("bytes", content)).cast("B")
        body, size = view, view.nbytes
    elif content is not None and callable(getattr(content, "read", None)):
        body = cast("BinaryIO", content)
        size = _remaining_bytes(body)
    else:
        raise invalid_input(
            f"{operation.operation_id} needs the file under content, as bytes or a binary file.",
            FILE_CONTENT_FIELD,
        )
    if size is not None and size > maximum:
        raise invalid_input(
            f"{operation.operation_id} takes a file of at most {maximum} bytes, "
            f"and this one holds {size}.",
            FILE_CONTENT_FIELD,
        )
    return FileBody(operation.operation_id, body, size, maximum)


def request_parts_of(operation: OperationDescription, raw: object) -> RequestParts:
    given = _given_fields(operation, raw)
    segments = {
        name: _path_segment(operation, name, given.get(name)) for name in operation.path_parameters
    }
    path = operation.path
    for name, segment in segments.items():
        path = path.replace(f"{{{name}}}", segment, 1)
    query_names = set(operation.query_parameters)
    query: list[tuple[str, str]] = []
    body: dict[str, object] = {}
    for name, value in given.items():
        if name in segments or (operation.body_kind == "file" and name == FILE_CONTENT_FIELD):
            continue
        if name in query_names:
            if value is None:
                raise invalid_input(
                    f"{operation.operation_id} takes {name} as text, not None.", name
                )
            query.append((name, _query_text(operation, name, value)))
        elif operation.body_kind == "json":
            body[name] = value
        else:
            raise invalid_input(f"{operation.operation_id} takes no field called {name}.", name)
    json_body: bytes | None = None
    if operation.body_kind == "json":
        try:
            json_body = json_bytes_of(body)
        except (TypeError, ValueError) as error:
            raise invalid_input(
                f"The body of {operation.operation_id} holds a value that JSON cannot carry.", None
            ) from error
    file_body = _file_body_of(operation, given) if operation.body_kind == "file" else None
    return RequestParts(path, tuple(query), json_body, file_body)


def _too_large(body: FileBody) -> Exception:
    return invalid_input(
        f"{body.operation_id} takes a file of at most {body.maximum_bytes} bytes, "
        "and this one holds more.",
        FILE_CONTENT_FIELD,
    )


def _changed_size(body: FileBody) -> Exception:
    return invalid_input(
        "The file changed size while the client sent it. Send it again once nothing writes to it.",
        FILE_CONTENT_FIELD,
    )


def _checked_chunk(body: FileBody, chunk: object, sent: int) -> bytes:
    if not isinstance(chunk, (bytes, bytearray)):
        raise invalid_input(
            "Open the file in binary mode, so that it reads bytes.", FILE_CONTENT_FIELD
        )
    total = sent + len(chunk)
    if total > body.maximum_bytes:
        raise _too_large(body)
    if body.size_bytes is not None and total > body.size_bytes:
        raise _changed_size(body)
    return bytes(chunk)


def file_chunks(body: FileBody) -> Iterator[bytes]:
    if isinstance(body.content, memoryview):
        view = body.content
        for start in range(0, view.nbytes, MEMORY_CHUNK_BYTES):
            yield view[start : start + MEMORY_CHUNK_BYTES].tobytes()
        return
    sent = 0
    while chunk := body.content.read(FILE_CHUNK_BYTES):
        checked = _checked_chunk(body, chunk, sent)
        sent += len(checked)
        yield checked
    if body.size_bytes is not None and sent != body.size_bytes:
        raise _changed_size(body)


async def async_file_chunks(body: FileBody) -> AsyncIterator[bytes]:
    for chunk in file_chunks(body):
        yield chunk
