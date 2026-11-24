from __future__ import annotations

import hashlib
import math
from typing import Literal

from .conftest import KNOWLEDGE_BASE_ID

UPLOAD_ID = "upl_" + "4" * 32
FILE_ID = "fil_" + "5" * 32
FILE_PATH = "policies/refunds.pdf"
CREATED_AT = "2026-11-24T08:00:00.000Z"
FAR_DEADLINE_AT = "2099-01-01T00:00:00.000Z"
UploadState = Literal["open", "checking", "completed", "failed"]


def sha256_of(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def file_record(content: bytes) -> dict[str, object]:
    return {
        "id": FILE_ID,
        "knowledge_base_id": KNOWLEDGE_BASE_ID,
        "path": FILE_PATH,
        "kind": "pdf",
        "address": None,
        "status": "queued",
        "current_version": None,
        "latest_version": 1,
        "size_bytes": len(content),
        "content_sha256": sha256_of(content),
        "failure": None,
        "unread_parts": [],
        "metadata": {"team": "support"},
        "created_at": CREATED_AT,
        "updated_at": CREATED_AT,
        "deleted_at": None,
        "purge_after": None,
    }


def upload_record(
    content: bytes,
    *,
    state: UploadState,
    part_bytes: int | None = None,
    part_count: int | None = None,
    failure_code: str | None = None,
) -> dict[str, object]:
    size = len(content)
    method = "single" if part_bytes is None else "multipart"
    chosen_part_bytes = size if part_bytes is None else part_bytes
    if part_count is not None:
        chosen_count = part_count
    elif part_bytes is None:
        chosen_count = 1
    else:
        chosen_count = math.ceil(size / part_bytes)
    completed = state == "completed"
    return {
        "id": UPLOAD_ID,
        "knowledge_base_id": KNOWLEDGE_BASE_ID,
        "path": FILE_PATH,
        "address": None,
        "size_bytes": size,
        "content_sha256": sha256_of(content),
        "method": method,
        "part_bytes": chosen_part_bytes,
        "part_count": chosen_count,
        "state": state,
        "outcome": "added" if completed else None,
        "file": file_record(content) if completed else None,
        "failure": None
        if failure_code is None
        else {"code": failure_code, "message": "The bytes did not match the SHA-256."},
        "created_at": CREATED_AT,
        "deadline_at": FAR_DEADLINE_AT,
    }


def signed_part(url: str, part_number: int, size_bytes: int) -> dict[str, object]:
    return {
        "part_number": part_number,
        "size_bytes": size_bytes,
        "method": "PUT",
        "url": url,
        "headers": {"x-amz-checksum-sha256": f"part-{part_number}"},
        "expires_at": FAR_DEADLINE_AT,
    }


def signed_parts(storage_url: str, content: bytes, part_bytes: int) -> dict[str, object]:
    count = math.ceil(len(content) / part_bytes)
    return {
        "parts": [
            signed_part(
                f"{storage_url}/parts/{number}",
                number,
                len(content[(number - 1) * part_bytes : number * part_bytes]),
            )
            for number in range(1, count + 1)
        ]
    }


def part_slices(content: bytes, part_bytes: int) -> dict[str, bytes]:
    count = math.ceil(len(content) / part_bytes)
    return {
        f"/parts/{number}": content[(number - 1) * part_bytes : number * part_bytes]
        for number in range(1, count + 1)
    }
