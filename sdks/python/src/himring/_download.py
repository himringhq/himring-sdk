from __future__ import annotations

from collections.abc import AsyncIterator, Iterator
from dataclasses import dataclass
from types import TracebackType

import httpx

from himring._errors import HimringApiError


@dataclass(frozen=True, slots=True)
class DownloadDetails:
    status: int
    file_name: str
    content_type: str
    content_length: int | None
    content_range: str | None
    accept_ranges: str | None
    entity_tag: str | None


def stream_failure(error: httpx.HTTPError, source: str) -> HimringApiError:
    if isinstance(error, httpx.TimeoutException):
        return HimringApiError(
            "timeout", f"{source} stopped sending the file. Try the download again."
        )
    return HimringApiError(
        "network", f"The connection to {source} broke during the download. Try again."
    )


class _DownloadFields:
    __slots__ = ("_details", "_response", "_source")

    def __init__(self, response: httpx.Response, details: DownloadDetails, source: str) -> None:
        self._response = response
        self._details = details
        self._source = source

    @property
    def status(self) -> int:
        return self._details.status

    @property
    def file_name(self) -> str:
        return self._details.file_name

    @property
    def content_type(self) -> str:
        return self._details.content_type

    @property
    def content_length(self) -> int | None:
        return self._details.content_length

    @property
    def content_range(self) -> str | None:
        return self._details.content_range

    @property
    def accept_ranges(self) -> str | None:
        return self._details.accept_ranges

    @property
    def entity_tag(self) -> str | None:
        return self._details.entity_tag

    def __repr__(self) -> str:
        name = type(self).__name__
        return f"{name}(file_name={self.file_name!r}, content_type={self.content_type!r})"


class Download(_DownloadFields):
    __slots__ = ()

    def iter_bytes(self, chunk_size: int | None = None) -> Iterator[bytes]:
        try:
            yield from self._response.iter_bytes(chunk_size)
        except httpx.HTTPError as error:
            raise stream_failure(error, self._source) from error
        finally:
            self._response.close()

    def read(self) -> bytes:
        return b"".join(self.iter_bytes())

    def close(self) -> None:
        self._response.close()

    def __enter__(self) -> Download:
        return self

    def __exit__(
        self,
        kind: type[BaseException] | None,
        error: BaseException | None,
        trace: TracebackType | None,
    ) -> None:
        self.close()


class AsyncDownload(_DownloadFields):
    __slots__ = ()

    async def iter_bytes(self, chunk_size: int | None = None) -> AsyncIterator[bytes]:
        try:
            async for chunk in self._response.aiter_bytes(chunk_size):
                yield chunk
        except httpx.HTTPError as error:
            raise stream_failure(error, self._source) from error
        finally:
            await self._response.aclose()

    async def read(self) -> bytes:
        return b"".join([chunk async for chunk in self.iter_bytes()])

    async def aclose(self) -> None:
        await self._response.aclose()

    async def __aenter__(self) -> AsyncDownload:
        return self

    async def __aexit__(
        self,
        kind: type[BaseException] | None,
        error: BaseException | None,
        trace: TracebackType | None,
    ) -> None:
        await self.aclose()
