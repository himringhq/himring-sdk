from __future__ import annotations

import json
from typing import cast


def object_map(value: object) -> dict[str, object] | None:
    if not isinstance(value, dict):
        return None
    entries = cast("dict[object, object]", value)
    return {key: item for key, item in entries.items() if isinstance(key, str)}


def object_list(value: object) -> list[object] | None:
    if not isinstance(value, list):
        return None
    return list(cast("list[object]", value))


def parsed_object_map(text: str | bytes) -> dict[str, object] | None:
    try:
        value: object = json.loads(text)
    except ValueError:
        return None
    return object_map(value)
