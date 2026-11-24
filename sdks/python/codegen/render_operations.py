from __future__ import annotations

import json

from codegen.input_schema import input_fields_of
from codegen.render_types import RenderedTypes
from codegen.spec_model import OperationModel, SpecModel


def _text(value: str) -> str:
    return json.dumps(value)


def _names(values: tuple[str, ...] | list[str]) -> str:
    if not values:
        return "()"
    return f"({', '.join(_text(value) for value in values)},)"


def _name_set(values: frozenset[str]) -> str:
    if not values:
        return "frozenset()"
    return f"frozenset({{{', '.join(_text(value) for value in sorted(values))}}})"


def _response_of(operation: OperationModel) -> str:
    response = operation.response
    kind = "download" if response.is_download else "json"
    extension = "None" if response.file_extension is None else _text(response.file_extension)
    return (
        f"ResponseDescription(kind={_text(kind)}, status={response.status}, "
        f"content_types={_names(response.content_types)}, file_extension={extension})"
    )


def _entry_lines(operation: OperationModel, rendered: RenderedTypes) -> list[str]:
    body_fields = [
        item.name for item in input_fields_of(operation) if item.location == "body field"
    ]
    maximum = "None" if operation.body.maximum_bytes is None else str(operation.body.maximum_bytes)
    nullable = rendered.by_operation[operation.id].nullable_fields
    return [
        f"    {_text(operation.id)}: OperationDescription(",
        f"        operation_id={_text(operation.id)},",
        f"        method={_text(operation.method)},",
        f"        path={_text(operation.path)},",
        f"        path_parameters={_names([item.name for item in operation.path_parameters])},",
        f"        query_parameters={_names([item.name for item in operation.query_parameters])},",
        f"        body_kind={_text(operation.body.kind)},",
        f"        body_fields={_names(body_fields)},",
        f"        maximum_body_bytes={maximum},",
        f"        nullable_fields={_name_set(nullable)},",
        f"        response={_response_of(operation)},",
        "    ),",
    ]


def render_operations(model: SpecModel, rendered: RenderedTypes) -> str:
    kinds = list(model.file_kinds)
    lines = [
        "from __future__ import annotations",
        "",
        "from collections.abc import Mapping",
        "from typing import Final, Literal, TypeAlias",
        "",
        "from himring._operation_description import OperationDescription, ResponseDescription",
        "",
        f"SPEC_API_URL: Final = {_text(model.server_url)}",
        "",
        f"FileKind: TypeAlias = Literal[{', '.join(_text(kind) for kind in kinds)}]",
        "",
        f"FILE_KIND_LIST: tuple[FileKind, ...] = {_names(kinds)}",
        "",
        "FILE_KINDS: Mapping[FileKind, tuple[str, ...]] = {",
        *(
            f"    {_text(kind)}: {_names(list(extensions))},"
            for kind, extensions in model.file_kinds.items()
        ),
        "}",
        "",
        "OPERATIONS: Mapping[str, OperationDescription] = {",
    ]
    for operation in model.operations:
        lines.extend(_entry_lines(operation, rendered))
    lines.extend(["}", "", "ERROR_STATUSES: Mapping[str, int] = {"])
    lines.extend(f"    {_text(code.code)}: {code.status}," for code in model.error_codes)
    lines.extend(["}", "", "ERROR_MESSAGES: Mapping[str, str] = {"])
    lines.extend(f"    {_text(code.code)}: {_text(code.message)}," for code in model.error_codes)
    lines.extend(["}", ""])
    return "\n".join(lines)
