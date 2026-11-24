from __future__ import annotations

from collections.abc import Callable, Mapping
from types import TracebackType
from typing import Literal

import httpx

from himring._calls import (
    PreparedCall,
    download_details_of,
    passed_deadline,
    prepare_call,
    transport_failure,
)
from himring._download import Download
from himring._generated.sync_methods import SyncOperationMethods
from himring._request_parts import file_chunks
from himring._responses import json_of, refusal_of
from himring._settings import DEFAULT_HIMRING_API_URL, ClientSettings, settings_of
from himring._sync_transfers import SyncFileTransfers
from himring._upload_plan import AddedFile, UploadContent


class Himring(SyncOperationMethods):
    def __init__(
        self,
        *,
        api_key: str | None = None,
        session_token: str | None = None,
        base_url: str = DEFAULT_HIMRING_API_URL,
        timeout_seconds: float | None = None,
        upload_idle_timeout_seconds: float | None = None,
        headers: Mapping[str, str] | None = None,
        http_client: httpx.Client | None = None,
    ) -> None:
        self._settings: ClientSettings = settings_of(
            api_key=api_key,
            session_token=session_token,
            base_url=base_url,
            timeout_seconds=timeout_seconds,
            upload_idle_timeout_seconds=upload_idle_timeout_seconds,
            headers=headers,
        )
        self._owns_http = http_client is None
        self._http = (
            http_client if http_client is not None else httpx.Client(follow_redirects=False)
        )
        self._transfers = SyncFileTransfers(self, self._http, self._settings)

    @property
    def base_url(self) -> str:
        return str(self._settings.base_url)

    def close(self) -> None:
        if self._owns_http:
            self._http.close()

    def __enter__(self) -> Himring:
        return self

    def __exit__(
        self,
        kind: type[BaseException] | None,
        error: BaseException | None,
        trace: TracebackType | None,
    ) -> None:
        self.close()

    def invoke(
        self,
        operation_id: str,
        fields: Mapping[str, object] | None = None,
        *,
        timeout_seconds: float | None = None,
    ) -> object:
        prepared = prepare_call(self._settings, operation_id, fields, timeout_seconds)
        response = self._send(prepared)
        if prepared.operation.response.kind == "download" and response.is_success:
            return Download(response, download_details_of(response, prepared), "the API")
        body = self._read(response, prepared)
        if not response.is_success:
            raise refusal_of(response, body, prepared.operation.path)
        return json_of(response, body, prepared.operation.path)

    def _call_operation(
        self, operation_id: str, fields: Mapping[str, object], timeout_seconds: float | None
    ) -> object:
        return self.invoke(operation_id, fields, timeout_seconds=timeout_seconds)

    def add_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        path: str,
        content: UploadContent,
        address: str | None = None,
        content_sha256: str | None = None,
        metadata: Mapping[str, str] | None = None,
        on_progress: Callable[[int], object] | None = None,
    ) -> AddedFile:
        return self._transfers.add_file(
            project_id=project_id,
            knowledge_base_id=knowledge_base_id,
            path=path,
            content=content,
            address=address,
            content_sha256=content_sha256,
            metadata=metadata,
            on_progress=on_progress,
        )

    def download_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        version: int,
        rendition: Literal["pdf"] | None = None,
        range: str | None = None,
    ) -> Download:
        return self._transfers.download_file(
            project_id=project_id,
            knowledge_base_id=knowledge_base_id,
            file_id=file_id,
            version=version,
            rendition=rendition,
            byte_range=range,
        )

    def _send(self, prepared: PreparedCall) -> httpx.Response:
        file_body = prepared.parts.file_body
        content = file_chunks(file_body) if file_body is not None else prepared.parts.json_body
        request = self._http.build_request(
            prepared.operation.method,
            prepared.url,
            params=list(prepared.parts.query) or None,
            content=content,
            headers=prepared.headers,
            timeout=prepared.timeout,
        )
        try:
            return self._http.send(request, stream=True, follow_redirects=False)
        except httpx.HTTPError as error:
            raise transport_failure(error, self._settings, prepared) from error

    def _read(self, response: httpx.Response, prepared: PreparedCall) -> bytes:
        chunks: list[bytes] = []
        try:
            for chunk in response.iter_bytes():
                chunks.append(chunk)
                late = passed_deadline(prepared, self._settings)
                if late is not None:
                    raise late
        except httpx.HTTPError as error:
            raise transport_failure(error, self._settings, prepared) from error
        finally:
            response.close()
        return b"".join(chunks)
