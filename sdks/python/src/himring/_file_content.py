from __future__ import annotations

from typing import BinaryIO, TypeAlias

FileContent: TypeAlias = bytes | bytearray | memoryview | BinaryIO
