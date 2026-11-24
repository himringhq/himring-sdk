from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

HttpMethod = Literal["GET", "POST", "DELETE"]
BodyKind = Literal["none", "json", "file"]
ResponseKind = Literal["json", "download"]


@dataclass(frozen=True, slots=True)
class ResponseDescription:
    kind: ResponseKind
    status: int
    content_types: tuple[str, ...]
    file_extension: str | None


@dataclass(frozen=True, slots=True)
class OperationDescription:
    operation_id: str
    method: HttpMethod
    path: str
    path_parameters: tuple[str, ...]
    query_parameters: tuple[str, ...]
    body_kind: BodyKind
    body_fields: tuple[str, ...]
    maximum_body_bytes: int | None
    nullable_fields: frozenset[str]
    response: ResponseDescription
