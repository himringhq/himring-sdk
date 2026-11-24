from __future__ import annotations

import hashlib
import math
import re
import threading
import time
from collections.abc import Iterator
from datetime import datetime
from typing import BinaryIO, Literal, Protocol, TypeAlias, TypedDict, cast, runtime_checkable

import httpx

from himring._download import DownloadDetails
from himring._errors import HimringApiError, documented_status_of, invalid_input
from himring._generated.types import (
    GetDownloadLinkOutput,
    GetUploadOutput,
    GetUploadOutputFile,
    SignUploadPartsOutput,
    SignUploadPartsOutputPartsItem,
)
from himring._responses import content_length_of

PARTS_IN_FLIGHT = 4
SEND_ATTEMPTS = 3
RESIGNED_STATUSES = frozenset({403, 408, 429, 500, 502, 503, 504})
CHECK_POLL_FIRST_SECONDS = 0.2
CHECK_POLL_MAXIMUM_SECONDS = 2.0
CHECK_WAIT_PAST_DEADLINE_SECONDS = 30 * 60.0
SIGNABLE_PART_NUMBER_MAXIMUM = 10_000
DIGEST_WINDOW_BYTES = 8 * 1024 * 1024
STREAM_CHUNK_BYTES = 1024 * 1024
MINIMUM_SEND_BYTES_PER_SECOND = 64 * 1024
STORAGE_URL_SCHEMES = frozenset({"http", "https"})
SHA256_HEX_PATTERN = re.compile(r"[0-9a-f]{64}")
BYTE_RANGE_PATTERN = re.compile(r"bytes=[0-9]*-[0-9]*(,\s*[0-9]*-[0-9]*)*")
HTTP_OK = 200
HTTP_PARTIAL_CONTENT = 206
HTTP_SUCCESS_LIMIT = 300

UploadRecord: TypeAlias = GetUploadOutput
SignedPart: TypeAlias = SignUploadPartsOutputPartsItem
FileOutcome = Literal["added", "new_version", "unchanged"]


class AddedFile(TypedDict):
    outcome: FileOutcome
    file: GetUploadOutputFile


@runtime_checkable
class UploadSource(Protocol):
    @property
    def size_bytes(self) -> int: ...

    def read(self, start: int, end: int) -> bytes: ...


UploadContent: TypeAlias = bytes | bytearray | memoryview | BinaryIO | UploadSource


def _changed_size() -> HimringApiError:
    return invalid_input(
        "The file changed size while the client read it. Send it again once nothing writes to it.",
        "content",
    )


def checked_window(window: object, expected_bytes: int) -> bytes:
    if not isinstance(window, (bytes, bytearray, memoryview)):
        raise invalid_input("The upload source returned something other than bytes.", "content")
    data = bytes(cast("bytes", window))
    if len(data) != expected_bytes:
        raise _changed_size()
    return data


class LockedSource:
    def __init__(self, content: object) -> None:
        self._lock = threading.Lock()
        self._bytes: memoryview | None = None
        self._file: BinaryIO | None = None
        self._source: UploadSource | None = None
        self._base = 0
        if isinstance(content, (bytes, bytearray, memoryview)):
            self._bytes = memoryview(cast("bytes", content)).cast("B")
            self.size_bytes = self._bytes.nbytes
        elif isinstance(content, UploadSource):
            size = whole_number(cast("object", content.size_bytes))
            if size is None or size < 0:
                raise invalid_input(
                    "Give the upload source a whole size_bytes of zero or more.", "content"
                )
            self._source, self.size_bytes = content, size
        elif callable(getattr(content, "read", None)) and callable(getattr(content, "seek", None)):
            self._file = cast("BinaryIO", content)
            self._base, self.size_bytes = self._extent_of(self._file)
        else:
            raise invalid_input(
                "Send the file under content, as bytes, a binary file that the client can seek in, "
                "or an upload source.",
                "content",
            )

    @staticmethod
    def _extent_of(file: BinaryIO) -> tuple[int, int]:
        try:
            if not file.seekable():
                raise invalid_input("Send a file that the client can seek in.", "content")
            base = file.tell()
            end = file.seek(0, 2)
            file.seek(base)
        except (OSError, ValueError) as error:
            raise invalid_input("The client could not measure the file.", "content") from error
        return base, max(0, end - base)

    def read(self, start: int, end: int) -> bytes:
        if self._bytes is not None:
            return self._bytes[start:end].tobytes()
        if self._source is not None:
            with self._lock:
                return checked_window(self._source.read(start, end), end - start)
        if self._file is None:
            raise _changed_size()
        pieces: list[bytes] = []
        wanted = end - start
        with self._lock:
            try:
                self._file.seek(self._base + start)
                while wanted > 0:
                    piece = cast("object", self._file.read(min(wanted, STREAM_CHUNK_BYTES)))
                    if not isinstance(piece, (bytes, bytearray)):
                        raise invalid_input(
                            "Open the file in binary mode, so that it reads bytes.", "content"
                        )
                    if not piece:
                        break
                    pieces.append(bytes(piece))
                    wanted -= len(piece)
            except OSError as error:
                raise invalid_input("The client could not read the file.", "content") from error
        return checked_window(b"".join(pieces), end - start)

    def chunks(self, start: int, end: int) -> Iterator[bytes]:
        for offset in range(start, end, STREAM_CHUNK_BYTES):
            yield self.read(offset, min(end, offset + STREAM_CHUNK_BYTES))


def content_sha256_of(source: LockedSource) -> str:
    digest = hashlib.sha256()
    for start in range(0, source.size_bytes, DIGEST_WINDOW_BYTES):
        digest.update(source.read(start, min(source.size_bytes, start + DIGEST_WINDOW_BYTES)))
    return digest.hexdigest()


def checked_sha256(value: str | None) -> str | None:
    if value is not None and not SHA256_HEX_PATTERN.fullmatch(value):
        raise invalid_input(
            "Send content_sha256 as 64 lowercase hexadecimal characters.", "content_sha256"
        )
    return value


def whole_number(value: object) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return None


def checked_layout(upload: UploadRecord, size_bytes: int) -> tuple[int, int]:
    count = whole_number(upload["part_count"])
    part_bytes = whole_number(upload["part_bytes"])
    fits = False
    if count is not None and part_bytes is not None:
        if upload["method"] == "single":
            fits = count == 1 and part_bytes == size_bytes
        else:
            fits = (
                part_bytes >= 1
                and count == math.ceil(size_bytes / part_bytes)
                and count <= SIGNABLE_PART_NUMBER_MAXIMUM
            )
    if (
        whole_number(upload["size_bytes"]) != size_bytes
        or not fits
        or count is None
        or part_bytes is None
    ):
        raise HimringApiError(
            "invalid_response",
            f"The API planned the upload {upload['id']} with parts that do not fit the file.",
        )
    return part_bytes, count


def refusal_of_upload(upload: UploadRecord) -> HimringApiError:
    failure = upload["failure"]
    if failure is None:
        return HimringApiError("refused", "Himring closed the upload without the file.")
    return HimringApiError(
        "refused",
        failure["message"],
        code=failure["code"],
        status=documented_status_of(failure["code"]),
    )


def added_file_of(upload: UploadRecord) -> AddedFile:
    if upload["state"] == "failed":
        raise refusal_of_upload(upload)
    outcome, file = upload["outcome"], upload["file"]
    if outcome is None or file is None:
        raise HimringApiError(
            "invalid_response", f"The upload {upload['id']} completed with no file."
        )
    return {"outcome": outcome, "file": file}


def storage_refusal(status: int, part_number: int) -> HimringApiError:
    return HimringApiError(
        "refused",
        f"Storage refused part {part_number} of the file with status {status}. Check that nothing "
        "changed the file while it was sent, then send it again.",
        status=status,
    )


def part_of(signed: SignUploadPartsOutput, part_number: int) -> SignedPart:
    for part in signed["parts"]:
        if whole_number(part["part_number"]) == part_number:
            return part
    raise HimringApiError("invalid_response", f"The API signed no link for part {part_number}.")


def part_size_of(part: SignedPart) -> int:
    size = whole_number(part["size_bytes"])
    if size is None or size < 0:
        raise HimringApiError("invalid_response", "The API signed a part with no whole size.")
    return size


def storage_url_of(url: str) -> httpx.URL:
    try:
        parsed = httpx.URL(url)
    except (httpx.InvalidURL, TypeError, ValueError) as error:
        raise HimringApiError(
            "invalid_response", "The API signed a storage link that is not a URL."
        ) from error
    if parsed.scheme not in STORAGE_URL_SCHEMES or not parsed.host:
        raise HimringApiError(
            "invalid_response", f"The API signed a storage link with the scheme {parsed.scheme}:."
        )
    return parsed


def send_timeout_seconds(idle_timeout_seconds: float, size_bytes: int) -> float:
    return idle_timeout_seconds + math.ceil(size_bytes / MINIMUM_SEND_BYTES_PER_SECOND)


def range_headers_of(byte_range: str | None) -> dict[str, str]:
    if byte_range is None:
        return {}
    if not BYTE_RANGE_PATTERN.fullmatch(byte_range):
        raise invalid_input("Send range as a byte range, such as bytes=0-1023.", "range")
    return {"range": byte_range}


def timeout_extensions(seconds: float) -> dict[str, object]:
    return {"timeout": httpx.Timeout(seconds).as_dict()}


def storage_failure(error: httpx.HTTPError, action: str) -> HimringApiError:
    if isinstance(error, httpx.TimeoutException):
        return HimringApiError("timeout", f"Storage did not answer in time to {action}. Try again.")
    return HimringApiError(
        "network",
        f"The client could not reach storage to {action}. Check the connection, then try again.",
    )


def slow_storage_error(timeout_seconds: float, size_bytes: int) -> HimringApiError:
    return HimringApiError(
        "timeout",
        f"Storage took more than {timeout_seconds:g} seconds to take {size_bytes} bytes. "
        "Check the connection, then send the file again.",
    )


def storage_download_refusal(status: int) -> HimringApiError:
    return HimringApiError(
        "refused", f"Storage refused the download with status {status}.", status=status
    )


def link_download_details(response: httpx.Response, link: GetDownloadLinkOutput) -> DownloadDetails:
    return DownloadDetails(
        status=response.status_code,
        file_name=link["file_name"],
        content_type=link["content_type"],
        content_length=content_length_of(response.headers),
        content_range=response.headers.get("content-range"),
        accept_ranges=response.headers.get("accept-ranges"),
        entity_tag=link["entity_tag"],
    )


def give_up_at(upload: UploadRecord) -> float:
    try:
        deadline = datetime.fromisoformat(upload["deadline_at"].replace("Z", "+00:00")).timestamp()
    except (ValueError, OverflowError, OSError):
        deadline = time.time()
    return deadline + CHECK_WAIT_PAST_DEADLINE_SECONDS


def still_checking_error(upload_id: str) -> HimringApiError:
    return HimringApiError(
        "timeout",
        f"Himring was still checking the upload {upload_id} long after its deadline. "
        "Read it later with get_upload.",
    )


def left_open_error(upload_id: str) -> HimringApiError:
    return HimringApiError(
        "invalid_response", f"The API left the upload {upload_id} open after completing it."
    )


def is_success(status: int) -> bool:
    return HTTP_OK <= status < HTTP_SUCCESS_LIMIT


def should_cancel(error: BaseException) -> bool:
    return not (
        isinstance(error, HimringApiError) and error.kind == "refused" and error.code is not None
    )
