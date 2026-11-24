from __future__ import annotations

import time
from collections.abc import Mapping
from dataclasses import dataclass
from typing import cast

import httpx

from himring._download import DownloadDetails
from himring._errors import HimringApiError, invalid_input
from himring._generated.operations import OPERATIONS
from himring._operation_description import OperationDescription
from himring._request_parts import RequestParts, request_parts_of
from himring._responses import (
    assumed_content_type_of,
    content_length_of,
    download_name_of,
    file_name_of,
)
from himring._settings import ClientSettings, positive_seconds

JSON_CONTENT_TYPE = "application/json"
FILE_CONTENT_TYPE = "application/octet-stream"


@dataclass(frozen=True, slots=True)
class PreparedCall:
    operation: OperationDescription
    fields: Mapping[str, object]
    parts: RequestParts
    url: httpx.URL
    headers: dict[str, str]
    timeout: httpx.Timeout
    timeout_seconds: float
    deadline: float | None

    @property
    def is_upload(self) -> bool:
        return self.parts.file_body is not None


def operation_of(operation_id: str) -> OperationDescription:
    operation = OPERATIONS.get(operation_id)
    if operation is None:
        raise invalid_input(f"The API has no operation called {operation_id}.", None)
    return operation


def prepare_call(
    settings: ClientSettings, operation_id: str, fields: object, timeout_seconds: float | None
) -> PreparedCall:
    operation = operation_of(operation_id)
    parts = request_parts_of(operation, fields)
    seconds = positive_seconds(timeout_seconds, settings.timeout_seconds, "timeout_seconds")
    headers = {**settings.headers, "accept": JSON_CONTENT_TYPE}
    if settings.credential is not None:
        headers["authorization"] = f"Bearer {settings.credential}"
    if parts.file_body is not None:
        headers["content-type"] = FILE_CONTENT_TYPE
        if parts.file_body.size_bytes is not None:
            headers["content-length"] = str(parts.file_body.size_bytes)
        seconds = settings.upload_idle_timeout_seconds
    elif parts.json_body is not None:
        headers["content-type"] = JSON_CONTENT_TYPE
    deadline = None if parts.file_body is not None else time.monotonic() + seconds
    return PreparedCall(
        operation=operation,
        fields=cast("Mapping[str, object]", fields) if isinstance(fields, Mapping) else {},
        parts=parts,
        url=settings.url_of(parts.path),
        headers=headers,
        timeout=httpx.Timeout(seconds),
        timeout_seconds=seconds,
        deadline=deadline,
    )


def passed_deadline(prepared: PreparedCall, settings: ClientSettings) -> HimringApiError | None:
    if prepared.deadline is None or time.monotonic() <= prepared.deadline:
        return None
    return timeout_error(settings, prepared)


def timeout_error(settings: ClientSettings, prepared: PreparedCall) -> HimringApiError:
    if prepared.is_upload:
        return HimringApiError(
            "timeout",
            f"The upload to the API at {settings.base_url} made no progress for "
            f"{prepared.timeout_seconds:g} seconds. "
            "Check the connection, then send the file again.",
        )
    return HimringApiError(
        "timeout",
        f"The API at {settings.base_url} did not respond within "
        f"{prepared.timeout_seconds:g} seconds. Try again, or raise timeout_seconds.",
    )


def transport_failure(
    error: httpx.HTTPError, settings: ClientSettings, prepared: PreparedCall
) -> HimringApiError:
    if isinstance(error, httpx.TimeoutException):
        return timeout_error(settings, prepared)
    return HimringApiError(
        "network",
        f"The client could not reach the API at {settings.base_url}. "
        "Check the address and that the API is running.",
    )


def download_details_of(response: httpx.Response, prepared: PreparedCall) -> DownloadDetails:
    operation = prepared.operation
    return DownloadDetails(
        status=response.status_code,
        file_name=file_name_of(response.headers, download_name_of(prepared.fields, operation)),
        content_type=response.headers.get("content-type", assumed_content_type_of(operation)),
        content_length=content_length_of(response.headers),
        content_range=response.headers.get("content-range"),
        accept_ranges=response.headers.get("accept-ranges"),
        entity_tag=response.headers.get("etag"),
    )
