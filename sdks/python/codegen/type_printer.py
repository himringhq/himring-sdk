from __future__ import annotations

import json
from dataclasses import dataclass, field, replace
from typing import Literal

from codegen.names import pascal_of
from codegen.spec_model import JsonObject, SpecModelError, list_at, optional_record

TypeDirection = Literal["input", "output"]

COMPONENT_REFERENCE_PREFIX = "#/components/"
SHAPE_KEYWORDS = frozenset(
    {
        "type",
        "anyOf",
        "enum",
        "const",
        "properties",
        "required",
        "additionalProperties",
        "items",
        "$ref",
    }
)
VALIDATION_KEYWORDS = frozenset(
    {
        "description",
        "default",
        "format",
        "pattern",
        "minLength",
        "maxLength",
        "minimum",
        "maximum",
        "exclusiveMinimum",
        "exclusiveMaximum",
        "multipleOf",
        "minItems",
        "maxItems",
        "uniqueItems",
        "minProperties",
        "maxProperties",
        "propertyNames",
        "title",
        "examples",
        "deprecated",
        "readOnly",
        "writeOnly",
    }
)
EXTENSION_PREFIX = "x-"
UNKNOWN_TYPE = "object"
NONE_TYPE = "None"


@dataclass(frozen=True)
class TypedDictModel:
    name: str
    required: tuple[tuple[str, str], ...]
    optional: tuple[tuple[str, str], ...]


@dataclass(frozen=True)
class TypeUnion:
    members: tuple[str, ...] = ()
    literals: tuple[str, ...] = ()
    nullable: bool = False

    def render(self) -> str:
        members = list(dict.fromkeys(self.members))
        if UNKNOWN_TYPE in members:
            return UNKNOWN_TYPE
        if "float" in members and "int" in members:
            members.remove("int")
        literals = [
            literal for literal in dict.fromkeys(self.literals) if not _covered(literal, members)
        ]
        parts = [*members]
        if literals:
            parts.append(f"Literal[{', '.join(literals)}]")
        if self.nullable:
            parts.append(NONE_TYPE)
        if not parts:
            raise SpecModelError("A schema allows no value at all.")
        return " | ".join(parts)


def annotation_accepts_none(annotation: str) -> bool:
    return annotation in (UNKNOWN_TYPE, NONE_TYPE) or annotation.endswith(f" | {NONE_TYPE}")


def _covered(literal: str, members: list[str]) -> bool:
    if literal.startswith('"'):
        return "str" in members
    if literal in ("True", "False"):
        return "bool" in members
    return "int" in members or "float" in members


def merged(unions: list[TypeUnion]) -> TypeUnion:
    return TypeUnion(
        members=tuple(member for union in unions for member in union.members),
        literals=tuple(literal for union in unions for literal in union.literals),
        nullable=any(union.nullable for union in unions),
    )


@dataclass(frozen=True)
class PrintContext:
    direction: TypeDirection
    components: JsonObject
    place: str
    name: str


@dataclass
class TypeCollector:
    definitions: dict[str, TypedDictModel] = field(default_factory=dict[str, TypedDictModel])

    def register(self, model: TypedDictModel, place: str) -> str:
        known = self.definitions.get(model.name)
        if known is not None and known != model:
            raise SpecModelError(
                f"{place} needs the type name {model.name}, which another shape holds."
            )
        self.definitions[model.name] = model
        return model.name

    def union_of(self, raw: JsonObject, context: PrintContext) -> TypeUnion:
        schema = _resolved(raw, context)
        _check_keywords(schema, context.place)
        if "const" in schema:
            return _literal_union([schema["const"]], context.place)
        if "enum" in schema:
            return _literal_union(list_at(schema["enum"]), context.place)
        if "anyOf" in schema:
            return self._any_of(schema, context)
        kind = schema.get("type")
        members = list_at(kind)
        if members:
            return merged([self._of_type(str(member), schema, context) for member in members])
        if isinstance(kind, str):
            return self._of_type(kind, schema, context)
        return TypeUnion(members=(UNKNOWN_TYPE,))

    def typed_dict_of(
        self, fields: list[tuple[str, JsonObject, bool]], context: PrintContext
    ) -> str:
        required: list[tuple[str, str]] = []
        optional: list[tuple[str, str]] = []
        for name, schema, is_required in fields:
            child = replace(
                context, place=f"{context.place}.{name}", name=f"{context.name}{pascal_of(name)}"
            )
            annotation = self.union_of(schema, child).render()
            (required if is_required else optional).append((name, annotation))
        return self.register(
            TypedDictModel(context.name, tuple(required), tuple(optional)), context.place
        )

    def _any_of(self, schema: JsonObject, context: PrintContext) -> TypeUnion:
        base = {
            key: value
            for key, value in schema.items()
            if key not in ("anyOf", "description", "default")
            and not key.startswith(EXTENSION_PREFIX)
        }
        options: list[JsonObject] = []
        for index, option in enumerate(list_at(schema["anyOf"])):
            record = optional_record(option)
            if record is None:
                raise SpecModelError(f"{context.place} anyOf {index} is not a schema.")
            options.append({**base, **_resolved(record, context)})
        names = _option_names(options, context.name)
        return merged(
            [
                self.union_of(
                    option, replace(context, place=f"{context.place}|{index}", name=names[index])
                )
                for index, option in enumerate(options)
            ]
        )

    def _of_type(self, kind: str, schema: JsonObject, context: PrintContext) -> TypeUnion:
        simple = {"string": "str", "integer": "int", "number": "float", "boolean": "bool"}
        if kind in simple:
            return TypeUnion(members=(simple[kind],))
        if kind == "null":
            return TypeUnion(nullable=True)
        if kind == "array":
            items = optional_record(schema.get("items"))
            item = (
                UNKNOWN_TYPE
                if items is None
                else self.union_of(
                    items, replace(context, place=f"{context.place}[]", name=f"{context.name}Item")
                ).render()
            )
            container = "Sequence" if context.direction == "input" else "list"
            return TypeUnion(members=(f"{container}[{item}]",))
        if kind == "object":
            return TypeUnion(members=(self._object_of(schema, context),))
        raise SpecModelError(f"{context.place} has the type {kind}, which the SDK cannot carry.")

    def _object_of(self, schema: JsonObject, context: PrintContext) -> str:
        properties = optional_record(schema.get("properties")) or {}
        required = {name for name in list_at(schema.get("required")) if isinstance(name, str)}
        missing = sorted(required - set(properties))
        if missing:
            raise SpecModelError(f"{context.place} requires the undocumented {', '.join(missing)}.")
        if properties:
            fields: list[tuple[str, JsonObject, bool]] = []
            for name, value in properties.items():
                record = optional_record(value)
                if record is None:
                    raise SpecModelError(f"{context.place}.{name} has no schema.")
                fields.append((name, record, name in required))
            return self.typed_dict_of(fields, context)
        additional = schema.get("additionalProperties")
        additional_schema = optional_record(additional)
        value_type = (
            self.union_of(
                additional_schema,
                replace(context, place=f"{context.place}[key]", name=f"{context.name}Value"),
            ).render()
            if additional_schema is not None
            else UNKNOWN_TYPE
        )
        container = "Mapping" if context.direction == "input" else "dict"
        return f"{container}[str, {value_type}]"


def _option_names(options: list[JsonObject], name: str) -> list[str]:
    shaped = [
        index for index, option in enumerate(options) if optional_record(option.get("properties"))
    ]
    if len(shaped) <= 1:
        return [name for _ in options]
    discriminators = [_discriminator_of(options[index]) for index in shaped]
    distinct = all(value is not None for value in discriminators) and len(
        set(discriminators)
    ) == len(shaped)
    names = [name for _ in options]
    for position, index in enumerate(shaped):
        value = discriminators[position]
        suffix = pascal_of(value) if distinct and value is not None else f"Option{position + 1}"
        names[index] = f"{name}{suffix}"
    return names


def _discriminator_of(option: JsonObject) -> str | None:
    for value in (optional_record(option.get("properties")) or {}).values():
        record = optional_record(value)
        constant = None if record is None else record.get("const")
        if isinstance(constant, str):
            return constant if pascal_of(constant) else None
    return None


def _resolved(schema: JsonObject, context: PrintContext) -> JsonObject:
    if "$ref" not in schema:
        return schema
    reference = schema["$ref"]
    if not isinstance(reference, str) or not reference.startswith(COMPONENT_REFERENCE_PREFIX):
        raise SpecModelError(f"{context.place} holds the reference {reference!r}.")
    current: object = context.components
    for part in reference[len(COMPONENT_REFERENCE_PREFIX) :].split("/"):
        record = optional_record(current)
        current = None if record is None else record.get(part)
    target = optional_record(current)
    if target is None:
        raise SpecModelError(f"{context.place} holds the unknown reference {reference}.")
    if any(
        key != "$ref" and not key.startswith(EXTENSION_PREFIX) and key not in VALIDATION_KEYWORDS
        for key in schema
    ):
        raise SpecModelError(
            f"{context.place} puts shape keywords beside its reference {reference}."
        )
    return target


def _check_keywords(schema: JsonObject, place: str) -> None:
    for key in schema:
        if key in SHAPE_KEYWORDS or key in VALIDATION_KEYWORDS or key.startswith(EXTENSION_PREFIX):
            continue
        raise SpecModelError(f"{place} uses the keyword {key}, which the generator cannot convert.")


def _literal_union(values: list[object], place: str) -> TypeUnion:
    literals: list[str] = []
    nullable = False
    for value in values:
        if value is None:
            nullable = True
        elif isinstance(value, bool):
            literals.append("True" if value else "False")
        elif isinstance(value, (int, str)):
            literals.append(json.dumps(value))
        else:
            raise SpecModelError(
                f"{place} holds the literal {value!r}, which a Python Literal cannot carry."
            )
    if not literals and not nullable:
        raise SpecModelError(f"{place} lists no allowed value.")
    return TypeUnion(literals=tuple(literals), nullable=nullable)
