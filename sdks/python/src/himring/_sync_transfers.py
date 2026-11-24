from __future__ import annotations

import hashlib
import threading
import time
from collections.abc import Callable, Iterator, Mapping
from concurrent.futures import FIRST_EXCEPTION, Future, ThreadPoolExecutor, wait
from typing import Literal

import httpx

from himring._download import Download
from himring._errors import HimringApiError, is_refusal
from himring._generated.sync_methods import SyncOperationMethods
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

PartBody = Callable[[], "bytes | Iterator[bytes]"]


class SyncFileTransfers:
    def __init__(
        self, client: SyncOperationMethods, http: httpx.Client, settings: ClientSettings
    ) -> None:
        self._client = client
        self._http = http
        self._settings = settings

    def add_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        path: str,
        content: UploadContent,
        address: str | None,
        content_sha256: str | None,
        metadata: Mapping[str, str] | None,
        on_progress: Callable[[int], object] | None,
    ) -> AddedFile:
        source = LockedSource(content)
        sha256 = checked_sha256(content_sha256) or content_sha256_of(source)
        created = self._client.create_upload(
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
            settled = self._sent_and_settled(
                ids, created, source, part_bytes, part_count, on_progress
            )
            return added_file_of(checked_record(settled, source.size_bytes, sha256))
        except BaseException as error:
            if should_cancel(error):
                ids.cancel_quietly()
            raise

    def download_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        version: int,
        rendition: Literal["pdf"] | None,
        byte_range: str | None,
    ) -> Download:
        headers = range_headers_of(byte_range)
        link = self._client.get_download_link(
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
            response = self._http.send(request, stream=True, follow_redirects=False, auth=None)
        except httpx.HTTPError as error:
            raise storage_failure(error, "download the file") from error
        if response.status_code not in (HTTP_OK, HTTP_PARTIAL_CONTENT):
            response.close()
            raise storage_download_refusal(response.status_code)
        return Download(response, link_download_details(response, link), "storage")

    def _sent_and_settled(
        self,
        ids: _UploadIds,
        created: CreateUploadOutput,
        source: LockedSource,
        part_bytes: int,
        part_count: int,
        on_progress: Callable[[int], object] | None,
    ) -> UploadRecord:
        upload = created["upload"]
        try:
            if upload["method"] == "single":
                first = created["parts"][0] if created["parts"] else None
                self._send_single(ids, upload["content_sha256"], first, source, on_progress)
            else:
                self._send_multipart(ids, source, part_bytes, part_count, on_progress)
        except HimringApiError as error:
            if not is_refusal(error, "upload_closed"):
                raise
            return self._settled(ids, ids.read())
        return self._settled(ids, ids.complete())

    def _send_single(
        self,
        ids: _UploadIds,
        sha256: str,
        first: SignedPart | None,
        source: LockedSource,
        on_progress: Callable[[int], object] | None,
    ) -> None:
        def resign() -> SignedPart:
            return checked_signed_part(ids.sign(1, sha256), 1, source.size_bytes)

        signed = checked_signed_part(first, 1, source.size_bytes) if first is not None else resign()
        sent = self._send_part(signed, resign, lambda: source.chunks(0, source.size_bytes))
        if on_progress is not None:
            on_progress(sent)

    def _send_multipart(
        self,
        ids: _UploadIds,
        source: LockedSource,
        part_bytes: int,
        part_count: int,
        on_progress: Callable[[int], object] | None,
    ) -> None:
        stopped = threading.Event()

        def send(part_number: int) -> int:
            if stopped.is_set():
                return 0
            start = (part_number - 1) * part_bytes
            data = source.read(start, min(source.size_bytes, start + part_bytes))
            sha256 = hashlib.sha256(data).hexdigest()

            def resign() -> SignedPart:
                return checked_signed_part(ids.sign(part_number, sha256), part_number, len(data))

            return self._send_part(resign(), resign, lambda: data)

        workers = max(1, min(PARTS_IN_FLIGHT, part_count))
        with ThreadPoolExecutor(
            max_workers=workers, thread_name_prefix="himring-upload"
        ) as executor:
            pending: set[Future[int]] = {
                executor.submit(send, number) for number in range(1, part_count + 1)
            }
            try:
                while pending:
                    done, pending = wait(pending, return_when=FIRST_EXCEPTION)
                    for future in done:
                        sent = future.result()
                        if on_progress is not None and sent > 0:
                            on_progress(sent)
            except BaseException:
                stopped.set()
                for future in pending:
                    future.cancel()
                raise

    def _send_part(
        self, first: SignedPart, resign: Callable[[], SignedPart], body: PartBody
    ) -> int:
        signed = first
        attempt = 1
        while True:
            size = part_size_of(signed)
            try:
                status = self._put(signed, body(), size)
            except HimringApiError:
                if attempt >= SEND_ATTEMPTS:
                    raise
                attempt += 1
                signed = resign()
                continue
            if is_success(status):
                return size
            if attempt >= SEND_ATTEMPTS or status not in RESIGNED_STATUSES:
                raise storage_refusal(status, int(signed["part_number"]))
            attempt += 1
            signed = resign()

    def _put(self, signed: SignedPart, body: bytes | Iterator[bytes], size: int) -> int:
        url = storage_url_of(signed["url"])
        timeout = send_timeout_seconds(self._settings.upload_idle_timeout_seconds, size)
        headers = {**signed["headers"], "content-length": str(size)}
        request = httpx.Request(
            "PUT", url, headers=headers, content=body, extensions=timeout_extensions(timeout)
        )
        try:
            response = self._http.send(request, stream=True, follow_redirects=False, auth=None)
        except httpx.TimeoutException as error:
            raise slow_storage_error(timeout, size) from error
        except httpx.HTTPError as error:
            raise storage_failure(error, "send the file") from error
        response.close()
        return response.status_code

    def _settled(self, ids: _UploadIds, upload: UploadRecord) -> UploadRecord:
        current = upload
        wait_seconds = CHECK_POLL_FIRST_SECONDS
        limit = give_up_at(upload)
        while current["state"] == "checking":
            if time.time() > limit:
                raise still_checking_error(upload["id"])
            time.sleep(wait_seconds)
            wait_seconds = min(CHECK_POLL_MAXIMUM_SECONDS, wait_seconds * 2)
            current = ids.read()
        if current["state"] == "open":
            raise left_open_error(upload["id"])
        return current


class _UploadIds:
    def __init__(
        self, client: SyncOperationMethods, project_id: str, knowledge_base_id: str, upload_id: str
    ) -> None:
        self._client = client
        self.project_id = project_id
        self.knowledge_base_id = knowledge_base_id
        self.upload_id = upload_id

    def sign(self, part_number: int, sha256: str) -> SignedPart:
        signed = self._client.sign_upload_parts(
            project_id=self.project_id,
            knowledge_base_id=self.knowledge_base_id,
            upload_id=self.upload_id,
            parts=[{"part_number": part_number, "sha256": sha256}],
        )
        return part_of(signed, part_number)

    def read(self) -> UploadRecord:
        return self._client.get_upload(
            project_id=self.project_id,
            knowledge_base_id=self.knowledge_base_id,
            upload_id=self.upload_id,
        )

    def complete(self) -> UploadRecord:
        return self._client.complete_upload(
            project_id=self.project_id,
            knowledge_base_id=self.knowledge_base_id,
            upload_id=self.upload_id,
        )

    def cancel_quietly(self) -> None:
        try:
            self._client.cancel_upload(
                project_id=self.project_id,
                knowledge_base_id=self.knowledge_base_id,
                upload_id=self.upload_id,
            )
        except Exception:
            return
