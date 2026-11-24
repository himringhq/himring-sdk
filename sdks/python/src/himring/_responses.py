from __future__ import annotations

import json
import math
import re
import time
import unicodedata
import urllib.parse
from collections.abc import Mapping
from email.utils import parsedate_to_datetime
from typing import cast

import httpx

from himring._errors import HimringApiError, HimringApiIssue, HimringMissingPermission
from himring._operation_description import OperationDescription

OCTET_STREAM_CONTENT_TYPE = "application/octet-stream"
FILE_NAME_PATTERN = re.compile(r'filename="([^"]+)"')
ENCODED_FILE_NAME_PATTERN = re.compile(r"filename\*=UTF-8''([^;\s]+)", re.IGNORECASE)
BROKEN_PERCENT_ESCAPE_PATTERN = re.compile(r"%(?![0-9A-Fa-f]{2})")
DOWNLOAD_ID_FIELDS = ("index_id", "file_id", "memory_id", "table_name")
DIGITS_PATTERN = re.compile(r"[0-9]+")
PATH_SEPARATOR_PATTERN = re.compile(r"[\\/]")
UNSAFE_NAME_CHARACTERS_PATTERN = re.compile(r"[^A-Za-z0-9._-]+")
LEADING_PUNCTUATION_PATTERN = re.compile(r"\A[._-]+")
SAFE_NAME_MAXIMUM_LENGTH = 200
REQUEST_ID_HEADER = "x-request-id"


def _optional_text(fields: Mapping[str, object], key: str) -> tuple[bool, str | None]:
    if key not in fields:
        return True, None
    value = fields[key]
    return (True, value) if isinstance(value, str) else (False, None)


def _issues_of(value: object) -> tuple[HimringApiIssue, ...] | None:
    if not isinstance(value, list):
        return None
    issues: list[HimringApiIssue] = []
    for raw in cast("list[object]", value):
        if not isinstance(raw, dict):
            return None
        entry = cast("dict[str, object]", raw)
        message, path = entry.get("message"), entry.get("path")
        if not isinstance(message, str) or not isinstance(path, list):
            return None
        parts = cast("list[object]", path)
        if not all(
            isinstance(part, (str, int, float)) and not isinstance(part, bool) for part in parts
        ):
            return None
        issues.append(HimringApiIssue(message, tuple(cast("list[str | int | float]", parts))))
    return tuple(issues)


def _missing_permission_of(value: object) -> HimringMissingPermission | None:
    if not isinstance(value, dict):
        return None
    entry = cast("dict[str, object]", value)
    kind, level, resource_id = (
        entry.get("resource_kind"),
        entry.get("level"),
        entry.get("resource_id"),
    )
    if not isinstance(kind, str) or not isinstance(level, str) or "resource_id" not in entry:
        return None
    if resource_id is not None and not isinstance(resource_id, str):
        return None
    return HimringMissingPermission(kind, level, resource_id)


def retry_after_seconds_of(header: str | None) -> int | None:
    if header is None:
        return None
    text = header.strip()
    if DIGITS_PATTERN.fullmatch(text):
        return int(text)
    try:
        moment = parsedate_to_datetime(text)
    except (TypeError, ValueError, IndexError):
        return None
    if moment.tzinfo is None:
        return None
    return max(0, math.ceil(moment.timestamp() - time.time()))


def refusal_of(response: httpx.Response, body: bytes, path: str) -> HimringApiError:
    header_request_id = response.headers.get(REQUEST_ID_HEADER)
    shapeless = HimringApiError(
        "invalid_response",
        f"The API answered {path} with status {response.status_code} and no error envelope. "
        "Check that the address points at the Himring API.",
        status=response.status_code,
        request_id=header_request_id,
    )
    try:
        envelope: object = json.loads(body)
    except ValueError:
        return shapeless
    error = cast("dict[str, object]", envelope).get("error") if isinstance(envelope, dict) else None
    if not isinstance(error, dict):
        return shapeless
    fields = cast("dict[str, object]", error)
    code, message = fields.get("code"), fields.get("message")
    details_ok, details = _optional_text(fields, "details")
    request_id_ok, request_id = _optional_text(fields, "request_id")
    issues = _issues_of(fields["issues"]) if "issues" in fields else ()
    has_permission = "missing_permission" in fields
    missing = _missing_permission_of(fields["missing_permission"]) if has_permission else None
    well_shaped = (
        isinstance(code, str)
        and isinstance(message, str)
        and details_ok
        and request_id_ok
        and issues is not None
        and (missing is not None or not has_permission)
    )
    if (
        not well_shaped
        or not isinstance(code, str)
        or not isinstance(message, str)
        or issues is None
    ):
        return shapeless
    return HimringApiError(
        "refused",
        message,
        status=response.status_code,
        code=code,
        details=details,
        issues=issues,
        missing_permission=missing,
        retry_after_seconds=retry_after_seconds_of(response.headers.get("retry-after")),
        request_id=request_id if request_id is not None else header_request_id,
    )


def json_of(response: httpx.Response, body: bytes, path: str) -> object:
    try:
        return json.loads(body)
    except ValueError as error:
        raise HimringApiError(
            "invalid_response",
            f"The API answered {path} with a body that is not JSON. "
            "Check that the address points at the Himring API.",
            status=response.status_code,
            request_id=response.headers.get(REQUEST_ID_HEADER),
        ) from error


def _decoded_file_name(encoded: str) -> str | None:
    if BROKEN_PERCENT_ESCAPE_PATTERN.search(encoded):
        return None
    try:
        return urllib.parse.unquote_to_bytes(encoded).decode("utf-8")
    except UnicodeDecodeError:
        return None


def file_name_of(headers: httpx.Headers, fallback: str) -> str:
    disposition = headers.get("content-disposition", "")
    encoded = ENCODED_FILE_NAME_PATTERN.search(disposition)
    decoded = None if encoded is None else _decoded_file_name(encoded.group(1))
    if decoded is not None:
        return decoded
    plain = FILE_NAME_PATTERN.search(disposition)
    return fallback if plain is None else plain.group(1)


def download_name_of(fields: Mapping[str, object], operation: OperationDescription) -> str:
    extension = operation.response.file_extension or ""
    for field in DOWNLOAD_ID_FIELDS:
        value = fields.get(field)
        if isinstance(value, str) and value:
            return f"{value}{extension}"
    return f"download{extension}"


def assumed_content_type_of(operation: OperationDescription) -> str:
    content_types = operation.response.content_types
    return content_types[0] if len(content_types) == 1 else OCTET_STREAM_CONTENT_TYPE


def content_length_of(headers: httpx.Headers) -> int | None:
    value = headers.get("content-length")
    return int(value) if value is not None and DIGITS_PATTERN.fullmatch(value) else None


def safe_download_name(name: str, fallback: str) -> str:
    last_segment = PATH_SEPARATOR_PATTERN.split(name)[-1]
    decomposed = unicodedata.normalize("NFKD", last_segment)
    without_marks = "".join(
        character for character in decomposed if not unicodedata.category(character).startswith("M")
    )
    safe = UNSAFE_NAME_CHARACTERS_PATTERN.sub("_", without_marks)
    safe = LEADING_PUNCTUATION_PATTERN.sub("", safe)[-SAFE_NAME_MAXIMUM_LENGTH:]
    return safe or fallback
