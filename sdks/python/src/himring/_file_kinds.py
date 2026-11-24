from __future__ import annotations

import re
from collections.abc import Mapping

from himring._generated.operations import FILE_KIND_LIST, FILE_KINDS, FileKind

LAST_EXTENSION_PATTERN = re.compile(r"\.[^./]+\Z")

KIND_OF_EXTENSION: Mapping[str, FileKind] = {
    extension: kind for kind in FILE_KIND_LIST for extension in FILE_KINDS[kind]
}

READABLE_FILE_EXTENSIONS: tuple[str, ...] = tuple(KIND_OF_EXTENSION)


def file_extension_of(path: str) -> str:
    found = LAST_EXTENSION_PATTERN.search(path)
    return "" if found is None else found.group(0).lower()


def file_kind_of(path: str) -> FileKind | None:
    return KIND_OF_EXTENSION.get(file_extension_of(path))
