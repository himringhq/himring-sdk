from __future__ import annotations

import re
from dataclasses import dataclass, field, replace

from codegen.input_schema import FILE_CONTENT_FIELD, input_fields_of
from codegen.names import input_type_name_of, is_plain_identifier, output_type_name_of
from codegen.spec_model import JsonObject, OperationModel, SpecModel
from codegen.type_printer import (
    PrintContext,
    TypeCollector,
    TypedDictModel,
    annotation_accepts_none,
)

FILE_CONTENT_TYPE = "FileContent"
WORD_PATTERN = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")


@dataclass
class OperationTypes:
    input_name: str
    output_name: str | None
    field_annotations: dict[str, str] = field(default_factory=dict[str, str])
    nullable_fields: frozenset[str] = frozenset()


@dataclass
class RenderedTypes:
    text: str
    names: frozenset[str]
    by_operation: dict[str, OperationTypes]


def _typed_dict_lines(model: TypedDictModel) -> list[str]:
    keys = [name for name, _ in (*model.required, *model.optional)]
    if all(is_plain_identifier(name) for name in keys):
        return _class_lines(model)
    required_name = f"_{model.name}Required"
    optional_name = f"_{model.name}Optional"
    return [
        *_part_lines(required_name, model.required, total=True),
        "",
        "",
        *_part_lines(optional_name, model.optional, total=False),
        "",
        "",
        f"class {model.name}({required_name}, {optional_name}):",
        "    pass",
    ]


def _part_lines(name: str, fields: tuple[tuple[str, str], ...], *, total: bool) -> list[str]:
    if all(is_plain_identifier(key) for key, _ in fields):
        header = f"class {name}(TypedDict):" if total else f"class {name}(TypedDict, total=False):"
        return [header, *_body(fields)]
    entries = ", ".join(f'"{key}": {annotation}' for key, annotation in fields)
    totality = "" if total else ", total=False"
    return [f'{name} = TypedDict("{name}", {{{entries}}}{totality})']


def _body(fields: tuple[tuple[str, str], ...]) -> list[str]:
    return [f"    {name}: {annotation}" for name, annotation in fields] or ["    pass"]


def _class_lines(model: TypedDictModel) -> list[str]:
    if model.required and model.optional:
        base = f"_{model.name}Required"
        return [
            f"class {base}(TypedDict):",
            *_body(model.required),
            "",
            "",
            f"class {model.name}({base}, total=False):",
            *_body(model.optional),
        ]
    if model.optional:
        return [f"class {model.name}(TypedDict, total=False):", *_body(model.optional)]
    return [f"class {model.name}(TypedDict):", *_body(model.required)]


def _operation_types(
    operation: OperationModel, components: JsonObject, collector: TypeCollector
) -> tuple[OperationTypes, str | None]:
    input_name = input_type_name_of(operation.id)
    context = PrintContext("input", components, f"{operation.id} input", input_name)
    fields = input_fields_of(operation)
    collector.typed_dict_of([(item.name, item.schema, item.required) for item in fields], context)
    model = collector.definitions[input_name]
    if operation.body.kind == "file":
        model = replace(model, required=(*model.required, (FILE_CONTENT_FIELD, FILE_CONTENT_TYPE)))
        collector.definitions[input_name] = model
    annotations = dict((*model.required, *model.optional))
    nullable = frozenset(
        name for name, annotation in annotations.items() if annotation_accepts_none(annotation)
    )
    types = OperationTypes(input_name, None, annotations, nullable)
    if operation.response.is_download or operation.response.schema is None:
        return types, None
    output_name = output_type_name_of(operation.id)
    output_context = PrintContext("output", components, f"{operation.id} output", output_name)
    rendered = collector.union_of(operation.response.schema, output_context).render()
    types.output_name = output_name
    return types, None if rendered == output_name else rendered


def render_types(model: SpecModel) -> RenderedTypes:
    collector = TypeCollector()
    blocks: list[list[str]] = []
    written: set[str] = set()
    by_operation: dict[str, OperationTypes] = {}
    for operation in model.operations:
        types, alias = _operation_types(operation, model.components[operation.document], collector)
        by_operation[operation.id] = types
        for name, definition in collector.definitions.items():
            if name not in written:
                written.add(name)
                blocks.append(_typed_dict_lines(definition))
        if alias is not None and types.output_name is not None:
            written.add(types.output_name)
            blocks.append([f"{types.output_name}: TypeAlias = {alias}"])
    body = "\n\n\n".join("\n".join(block) for block in blocks)
    public = sorted(name for name in written if not name.startswith("_"))
    used = set(WORD_PATTERN.findall(body))
    typing_names = [name for name in ("Literal", "TypeAlias", "TypedDict") if name in used]
    abc_names = [name for name in ("Mapping", "Sequence") if name in used]
    lines = ["from __future__ import annotations", ""]
    if abc_names:
        lines.append(f"from collections.abc import {', '.join(abc_names)}")
    lines.append(f"from typing import {', '.join(typing_names)}")
    lines.append("")
    if FILE_CONTENT_TYPE in used:
        lines.extend([f"from himring._file_content import {FILE_CONTENT_TYPE}", ""])
    lines.append("__all__ = [")
    lines.extend(f'    "{name}",' for name in public)
    lines.extend(["]", "", "", body, ""])
    return RenderedTypes("\n".join(lines), frozenset(written), by_operation)
