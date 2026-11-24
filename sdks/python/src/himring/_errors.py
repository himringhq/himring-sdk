from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Literal

from himring._generated.operations import ERROR_STATUSES

HimringApiErrorKind = Literal["network", "timeout", "refused", "invalid_response", "invalid_input"]


@dataclass(frozen=True, slots=True)
class HimringApiIssue:
    message: str
    path: tuple[str | int | float, ...]


@dataclass(frozen=True, slots=True)
class HimringMissingPermission:
    resource_kind: str
    level: str
    resource_id: str | None


class HimringApiError(Exception):
    kind: HimringApiErrorKind
    message: str
    status: int | None
    code: str | None
    details: str | None
    issues: tuple[HimringApiIssue, ...]
    missing_permission: HimringMissingPermission | None
    retry_after_seconds: int | None
    request_id: str | None

    def __init__(
        self,
        kind: HimringApiErrorKind,
        message: str,
        *,
        status: int | None = None,
        code: str | None = None,
        details: str | None = None,
        issues: Sequence[HimringApiIssue] = (),
        missing_permission: HimringMissingPermission | None = None,
        retry_after_seconds: int | None = None,
        request_id: str | None = None,
    ) -> None:
        super().__init__(message)
        self.kind = kind
        self.message = message
        self.status = status
        self.code = code
        self.details = details
        self.issues = tuple(issues)
        self.missing_permission = missing_permission
        self.retry_after_seconds = retry_after_seconds
        self.request_id = request_id

    @property
    def is_documented_code(self) -> bool:
        return self.code is not None and self.code in ERROR_STATUSES

    def __repr__(self) -> str:
        return (
            f"HimringApiError(kind={self.kind!r}, status={self.status!r}, code={self.code!r}, "
            f"message={self.message!r}, request_id={self.request_id!r})"
        )


def documented_status_of(code: str) -> int | None:
    return ERROR_STATUSES.get(code)


def invalid_input(message: str, field: str | None) -> HimringApiError:
    path: tuple[str | int | float, ...] = () if field is None else (field,)
    return HimringApiError("invalid_input", message, issues=(HimringApiIssue(message, path),))


def is_refusal(error: BaseException, code: str) -> bool:
    return isinstance(error, HimringApiError) and error.kind == "refused" and error.code == code
