from __future__ import annotations

from himring._errors import HimringApiError
from himring._upload_plan import SignedPart, UploadRecord, whole_number


def checked_record(upload: UploadRecord, size_bytes: int, sha256: str) -> UploadRecord:
    if whole_number(upload["size_bytes"]) == size_bytes and upload["content_sha256"] == sha256:
        return upload
    raise HimringApiError(
        "invalid_response",
        "The API answered with an upload for different content than the file that the client sent.",
    )


def checked_signed_part(part: SignedPart, number: int, size_bytes: int) -> SignedPart:
    if (
        whole_number(part["part_number"]) == number
        and whole_number(part["size_bytes"]) == size_bytes
    ):
        return part
    raise HimringApiError(
        "invalid_response",
        f"The API signed a part that does not match part {number} of {size_bytes} bytes.",
    )
