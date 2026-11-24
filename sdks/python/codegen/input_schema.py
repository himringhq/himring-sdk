from __future__ import annotations

from dataclasses import dataclass

from codegen.spec_model import JsonObject, OperationModel, SpecModelError, list_at, optional_record

FILE_CONTENT_FIELD = "content"


@dataclass(frozen=True)
class InputField:
    name: str
    schema: JsonObject
    required: bool
    location: str


def input_fields_of(operation: OperationModel) -> tuple[InputField, ...]:
    fields: dict[str, InputField] = {}

    def add(name: str, schema: object, required: bool, location: str) -> None:
        if name in fields:
            raise SpecModelError(
                f"{operation.id} takes {name} in more than one part of the request."
            )
        record = optional_record(schema)
        if record is None:
            raise SpecModelError(f"{operation.id} {location} {name} has no schema.")
        fields[name] = InputField(name, record, required, location)

    for parameter in operation.path_parameters:
        add(parameter.name, parameter.schema, True, "path parameter")
    for parameter in operation.query_parameters:
        add(parameter.name, parameter.schema, parameter.required, "query parameter")
    if operation.body.kind == "json" and operation.body.schema is not None:
        body = operation.body.schema
        properties = optional_record(body.get("properties")) or {}
        required = {name for name in list_at(body.get("required")) if isinstance(name, str)}
        missing = sorted(required - set(properties))
        if missing:
            raise SpecModelError(f"{operation.id} requires the undocumented {', '.join(missing)}.")
        for name, schema in properties.items():
            add(name, schema, name in required, "body field")
    if operation.body.kind == "file" and FILE_CONTENT_FIELD in fields:
        raise SpecModelError(
            f"{operation.id} takes a field called {FILE_CONTENT_FIELD} beside its file."
        )
    return tuple(fields.values())
