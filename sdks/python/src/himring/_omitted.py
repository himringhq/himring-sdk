from __future__ import annotations

from typing import Final, final


@final
class Omitted:
    __slots__ = ()

    def __repr__(self) -> str:
        return "OMITTED"

    def __bool__(self) -> bool:
        return False


OMITTED: Final = Omitted()
