from __future__ import annotations

import keyword
import re

from codegen.spec_model import SpecModelError

WORD_SEPARATOR_PATTERN = re.compile(r"[^A-Za-z0-9]+")
RESERVED_PARAMETER_NAMES = frozenset({"self", "timeout_seconds"})


def pascal_of(text: str) -> str:
    return "".join(
        part[:1].upper() + part[1:] for part in WORD_SEPARATOR_PATTERN.split(text) if part
    )


def input_type_name_of(operation_id: str) -> str:
    return f"{pascal_of(operation_id)}Input"


def output_type_name_of(operation_id: str) -> str:
    return f"{pascal_of(operation_id)}Output"


def is_plain_identifier(name: str) -> bool:
    return name.isidentifier() and name.isascii() and not keyword.iskeyword(name)


def parameter_name_of(field: str, place: str) -> str:
    if keyword.iskeyword(field):
        return f"{field}_"
    if not is_plain_identifier(field) or field in RESERVED_PARAMETER_NAMES:
        raise SpecModelError(
            f"{place} takes the field {field}, which cannot be a Python keyword argument."
        )
    return field
