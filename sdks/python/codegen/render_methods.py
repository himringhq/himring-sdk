from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

from codegen.input_schema import FILE_CONTENT_FIELD, input_fields_of
from codegen.names import parameter_name_of
from codegen.render_types import FILE_CONTENT_TYPE, RenderedTypes
from codegen.spec_model import OperationModel, SpecModel, SpecModelError
from codegen.type_printer import NONE_TYPE, UNKNOWN_TYPE, annotation_accepts_none

ClientFlavor = Literal["sync", "async"]
HAND_WRITTEN_MEMBERS = frozenset(
    {"add_file", "download_file", "invoke", "close", "aclose", "base_url", "operations"}
)
WORD_PATTERN = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
OMITTED_DEFAULT = "OMITTED"


@dataclass(frozen=True)
class FlavorNames:
    class_name: str
    download_type: str
    download_module: str


FLAVORS: dict[ClientFlavor, FlavorNames] = {
    "sync": FlavorNames("SyncOperationMethods", "Download", "himring._download"),
    "async": FlavorNames("AsyncOperationMethods", "AsyncDownload", "himring._download"),
}


@dataclass(frozen=True)
class MethodParameter:
    field: str
    name: str
    annotation: str
    default: str | None


def omittable(annotation: str) -> str:
    if annotation == UNKNOWN_TYPE:
        return annotation
    if annotation == NONE_TYPE:
        return f"Omitted | {NONE_TYPE}"
    return f"{annotation.removesuffix(f' | {NONE_TYPE}')} | Omitted | {NONE_TYPE}"


def _parameters_of(operation: OperationModel, rendered: RenderedTypes) -> list[MethodParameter]:
    annotations = rendered.by_operation[operation.id].field_annotations
    fields = input_fields_of(operation)
    required: list[MethodParameter] = []
    optional: list[MethodParameter] = []
    for item in fields:
        name = parameter_name_of(item.name, operation.id)
        annotation = annotations[item.name]
        if item.required:
            required.append(MethodParameter(item.name, name, annotation, None))
        elif annotation_accepts_none(annotation):
            optional.append(
                MethodParameter(item.name, name, omittable(annotation), OMITTED_DEFAULT)
            )
        else:
            optional.append(MethodParameter(item.name, name, f"{annotation} | None", "None"))
    if operation.body.kind == "file":
        required.append(
            MethodParameter(FILE_CONTENT_FIELD, FILE_CONTENT_FIELD, FILE_CONTENT_TYPE, None)
        )
    parameters = [*required, *optional]
    names = [parameter.name for parameter in parameters]
    if len(set(names)) != len(names):
        raise SpecModelError(f"{operation.id} takes two fields that share one Python name.")
    return parameters


def _method_lines(
    operation: OperationModel, rendered: RenderedTypes, flavor: ClientFlavor
) -> list[str]:
    if operation.id in HAND_WRITTEN_MEMBERS:
        raise SpecModelError(
            f"{operation.id} has the name of a member that the client writes by hand."
        )
    types = rendered.by_operation[operation.id]
    output = types.output_name if types.output_name is not None else FLAVORS[flavor].download_type
    parameters = _parameters_of(operation, rendered)
    signature = [f"        {_parameter_text(parameter)}," for parameter in parameters]
    fields = ", ".join(f'"{parameter.field}": {parameter.name}' for parameter in parameters)
    call = f'self._call_operation("{operation.id}", {{{fields}}}, timeout_seconds)'
    prefix = "async def" if flavor == "async" else "def"
    awaited = f"await {call}" if flavor == "async" else call
    return [
        f"    {prefix} {operation.id}(",
        "        self,",
        "        *,",
        *signature,
        "        timeout_seconds: float | None = None,",
        f"    ) -> {output}:",
        f'        return cast("{output}", {awaited})',
    ]


def _parameter_text(parameter: MethodParameter) -> str:
    if parameter.default is None:
        return f"{parameter.name}: {parameter.annotation}"
    return f"{parameter.name}: {parameter.annotation} = {parameter.default}"


def render_methods(model: SpecModel, rendered: RenderedTypes, flavor: ClientFlavor) -> str:
    names = FLAVORS[flavor]
    prefix = "async def" if flavor == "async" else "def"
    body: list[str] = [
        f"class {names.class_name}(ABC):",
        "    @abstractmethod",
        f"    {prefix} _call_operation(",
        "        self,",
        "        operation_id: str,",
        "        fields: Mapping[str, object],",
        "        timeout_seconds: float | None,",
        "    ) -> object: ...",
    ]
    for operation in model.operations:
        body.append("")
        body.extend(_method_lines(operation, rendered, flavor))
    text = "\n".join(body)
    used = set(WORD_PATTERN.findall(text))
    abc_names = [name for name in ("Mapping", "Sequence") if name in used]
    typing_names = [name for name in ("Literal", "cast") if name in used]
    type_names = sorted(
        name for name in rendered.names if name in used and not name.startswith("_")
    )
    lines = ["from __future__ import annotations", "", "from abc import ABC, abstractmethod"]
    lines.append(f"from collections.abc import {', '.join(abc_names)}")
    lines.append(f"from typing import {', '.join(typing_names)}")
    lines.append("")
    if names.download_type in used:
        lines.append(f"from {names.download_module} import {names.download_type}")
    if FILE_CONTENT_TYPE in used:
        lines.append(f"from himring._file_content import {FILE_CONTENT_TYPE}")
    lines.append("from himring._generated.types import (")
    lines.extend(f"    {name}," for name in type_names)
    lines.append(")")
    lines.append("from himring._omitted import OMITTED, Omitted")
    lines.extend(["", "", text, ""])
    return "\n".join(lines)
