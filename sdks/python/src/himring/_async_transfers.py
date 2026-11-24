from __future__ import annotations

import asyncio
import hashlib
import inspect
import time
from collections.abc import AsyncIterator, Awaitable, Callable, Mapping
from typing import Literal

import httpx

from himring._download import AsyncDownload
from himring._errors import HimringApiError, is_refusal
from himring._generated.async_methods import AsyncOperationMethods
from himring._generated.types import CreateUploadOutput
from himring._settings import ClientSettings
from himring._upload_integrity import checked_record, checked_signed_part
from himring._upload_plan import (
    CHECK_POLL_FIRST_SECONDS,
    CHECK_POLL_MAXIMUM_SECONDS,
    HTTP_OK,
    HTTP_PARTIAL_CONTENT,
    PARTS_IN_FLIGHT,
    RESIGNED_STATUSES,
    SEND_ATTEMPTS,
    STREAM_CHUNK_BYTES,
    AddedFile,
    LockedSource,
    SignedPart,
    UploadContent,
    UploadRecord,
    added_file_of,
    checked_layout,
    checked_sha256,
    content_sha256_of,
    give_up_at,
    is_success,
    left_open_error,
    link_download_details,
    part_of,
    part_size_of,
    range_headers_of,
    send_timeout_seconds,
    should_cancel,
    slow_storage_error,
    still_checking_error,
    storage_download_refusal,
    storage_failure,
    storage_refusal,
    storage_url_of,
    timeout_extensions,
)

ProgressCallback = Callable[[int], object]
PartBody = Callable[[], "bytes | AsyncIterator[bytes]"]


async def _reported(on_progress: ProgressCallback | None, sent: int) -> None:
    if on_progress is None:
        return
    result = on_progress(sent)
    if inspect.isawaitable(result):
        await result


async def _chunks_of(source: LockedSource, start: int, end: int) -> AsyncIterator[bytes]:
    for offset in range(start, end, STREAM_CHUNK_BYTES):
        yield await asyncio.to_thread(source.read, offset, min(end, offset + STREAM_CHUNK_BYTES))


async def _part_of(source: LockedSource, start: int, end: int) -> tuple[bytes, str]:
    def read() -> tuple[bytes, str]:
        data = source.read(start, end)
        return data, hashlib.sha256(data).hexdigest()

    return await asyncio.to_thread(read)


class AsyncFileTransfers:
    def __init__(
        self, client: AsyncOperationMethods, http: httpx.AsyncClient, settings: ClientSettings
    ) -> None:
        self._client = client
        self._http = http
        self._settings = settings

    async def add_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        path: str,
        content: UploadContent,
        address: str | None,
        content_sha256: str | None,
        metadata: Mapping[str, str] | None,
        on_progress: ProgressCallback | None,
    ) -> AddedFile:
        source = LockedSource(content)
        sha256 = checked_sha256(content_sha256) or await asyncio.to_thread(
            content_sha256_of, source
        )
        created = await self._client.create_upload(
            project_id=project_id,
            knowledge_base_id=knowledge_base_id,
            path=path,
            address=address,
            size_bytes=source.size_bytes,
            content_sha256=sha256,
            metadata=metadata,
        )
        upload = created["upload"]
        if upload["state"] != "open":
            return added_file_of(checked_record(upload, source.size_bytes, sha256))
        ids = _UploadIds(self._client, project_id, knowledge_base_id, upload["id"])
        try:
            checked_record(upload, source.size_bytes, sha256)
            part_bytes, part_count = checked_layout(upload, source.size_bytes)
            settled = await self._sent_and_settled(
                ids, created, source, part_bytes, part_count, on_progress
            )
            return added_file_of(checked_record(settled, source.size_bytes, sha256))
        except BaseException as error:
            if should_cancel(error):
                await ids.cancel_quietly()
            raise

    async def download_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        version: int,
        rendition: Literal["pdf"] | None,
        byte_range: str | None,
    ) -> AsyncDownload:
        headers = range_headers_of(byte_range)
        link = await self._client.get_download_link(
            project_id=project_id,
            knowledge_base_id=knowledge_base_id,
            file_id=file_id,
            version=str(version),
            rendition=rendition,
            disposition="attachment",
        )
        url = storage_url_of(link["url"])
        extensions = timeout_extensions(self._settings.timeout_seconds)
        request = httpx.Request("GET", url, headers=headers, extensions=extensions)
        try:
            response = await self._http.send(
                request, stream=True, follow_redirects=False, auth=None
            )
        except httpx.HTTPError as error:
            raise storage_failure(error, "download the file") from error
        if response.status_code not in (HTTP_OK, HTTP_PARTIAL_CONTENT):
            await response.aclose()
            raise storage_download_refusal(response.status_code)
        return AsyncDownload(response, link_download_details(response, link), "storage")

    async def _sent_and_settled(
        self,
        ids: _UploadIds,
        created: CreateUploadOutput,
        source: LockedSource,
        part_bytes: int,
        part_count: int,
        on_progress: ProgressCallback | None,
    ) -> UploadRecord:
        upload = created["upload"]
        try:
            if upload["method"] == "single":
                first = created["parts"][0] if created["parts"] else None
                await self._send_single(ids, upload["content_sha256"], first, source, on_progress)
            else:
                await self._send_multipart(ids, source, part_bytes, part_count, on_progress)
        except HimringApiError as error:
            if not is_refusal(error, "upload_closed"):
                raise
            return await self._settled(ids, await ids.read())
        return await self._settled(ids, await ids.complete())

    async def _send_single(
        self,
        ids: _UploadIds,
        sha256: str,
        first: SignedPart | None,
        source: LockedSource,
        on_progress: ProgressCallback | None,
    ) -> None:
        async def resign() -> SignedPart:
            return checked_signed_part(await ids.sign(1, sha256), 1, source.size_bytes)

        signed = (
            checked_signed_part(first, 1, source.size_bytes)
            if first is not None
            else await resign()
        )
        sent = await self._send_part(
            signed, resign, lambda: _chunks_of(source, 0, source.size_bytes)
        )
        await _reported(on_progress, sent)

    async def _send_multipart(
        self,
        ids: _UploadIds,
        source: LockedSource,
        part_bytes: int,
        part_count: int,
        on_progress: ProgressCallback | None,
    ) -> None:
        next_part = 1

        async def lane() -> None:
            nonlocal next_part
            while next_part <= part_count:
                part_number = next_part
                next_part += 1
                start = (part_number - 1) * part_bytes
                data, sha256 = await _part_of(
                    source, start, min(source.size_bytes, start + part_bytes)
                )

                async def resign(
                    number: int = part_number, digest: str = sha256, size: int = len(data)
                ) -> SignedPart:
                    return checked_signed_part(await ids.sign(number, digest), number, size)

                sent = await self._send_part(await resign(), resign, lambda chunk=data: chunk)
                await _reported(on_progress, sent)

        lanes = [asyncio.ensure_future(lane()) for _ in range(min(PARTS_IN_FLIGHT, part_count))]
        if not lanes:
            return
        try:
            done, _ = await asyncio.wait(lanes, return_when=asyncio.FIRST_EXCEPTION)
            for finished in done:
                finished.result()
        finally:
            for running in lanes:
                running.cancel()
            await asyncio.gather(*lanes, return_exceptions=True)

    async def _send_part(
        self, first: SignedPart, resign: Callable[[], Awaitable[SignedPart]], body: PartBody
    ) -> int:
        signed = first
        attempt = 1
        while True:
            size = part_size_of(signed)
            try:
                status = await self._put(signed, body(), size)
            except HimringApiError:
                if attempt >= SEND_ATTEMPTS:
                    raise
                attempt += 1
                signed = await resign()
                continue
            if is_success(status):
                return size
            if attempt >= SEND_ATTEMPTS or status not in RESIGNED_STATUSES:
                raise storage_refusal(status, int(signed["part_number"]))
            attempt += 1
            signed = await resign()

    async def _put(self, signed: SignedPart, body: bytes | AsyncIterator[bytes], size: int) -> int:
        url = storage_url_of(signed["url"])
        timeout = send_timeout_seconds(self._settings.upload_idle_timeout_seconds, size)
        headers = {**signed["headers"], "content-length": str(size)}
        request = httpx.Request(
            "PUT", url, headers=headers, content=body, extensions=timeout_extensions(timeout)
        )
        try:
            response = await self._http.send(
                request, stream=True, follow_redirects=False, auth=None
            )
        except httpx.TimeoutException as error:
            raise slow_storage_error(timeout, size) from error
        except httpx.HTTPError as error:
            raise storage_failure(error, "send the file") from error
        await response.aclose()
        return response.status_code

    async def _settled(self, ids: _UploadIds, upload: UploadRecord) -> UploadRecord:
        current = upload
        wait_seconds = CHECK_POLL_FIRST_SECONDS
        limit = give_up_at(upload)
        while current["state"] == "checking":
            if time.time() > limit:
                raise still_checking_error(upload["id"])
            await asyncio.sleep(wait_seconds)
            wait_seconds = min(CHECK_POLL_MAXIMUM_SECONDS, wait_seconds * 2)
            current = await ids.read()
        if current["state"] == "open":
            raise left_open_error(upload["id"])
        return current


class _UploadIds:
    def __init__(
        self, client: AsyncOperationMethods, project_id: str, knowledge_base_id: str, upload_id: str
    ) -> None:
        self._client = client
        self.project_id = project_id
        self.knowledge_base_id = knowledge_base_id
        self.upload_id = upload_id

    async def sign(self, part_number: int, sha256: str) -> SignedPart:
        signed = await self._client.sign_upload_parts(
            project_id=self.project_id,
            knowledge_base_id=self.knowledge_base_id,
            upload_id=self.upload_id,
            parts=[{"part_number": part_number, "sha256": sha256}],
        )
        return part_of(signed, part_number)

    async def read(self) -> UploadRecord:
        return await self._client.get_upload(
            project_id=self.project_id,
            knowledge_base_id=self.knowledge_base_id,
            upload_id=self.upload_id,
        )

    async def complete(self) -> UploadRecord:
        return await self._client.complete_upload(
            project_id=self.project_id,
            knowledge_base_id=self.knowledge_base_id,
            upload_id=self.upload_id,
        )

    async def cancel_quietly(self) -> None:
        try:
            await self._client.cancel_upload(
                project_id=self.project_id,
                knowledge_base_id=self.knowledge_base_id,
                upload_id=self.upload_id,
            )
        except Exception:
            return
