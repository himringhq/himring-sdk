from __future__ import annotations

import json
import subprocess
import urllib.request
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path
from typing import IO, cast

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
CONTRACT_SERVER_SCRIPT = REPOSITORY_ROOT / "tools" / "contract-server" / "dist" / "serve.js"
CONTROL_TIMEOUT_SECONDS = 10.0
STOP_TIMEOUT_SECONDS = 10.0


@dataclass(frozen=True)
class RecordedRequest:
    operation_id: str | None
    method: str
    path: str
    path_parameters: dict[str, str]
    query: dict[str, str]
    headers: dict[str, str]
    body: object
    raw_body_bytes: int
    problems: list[str]


def _record_of(value: object) -> dict[str, object]:
    if not isinstance(value, dict):
        raise AssertionError(f"The contract server answered {value!r}, not an object.")
    return cast("dict[str, object]", value)


def _texts_of(value: object) -> dict[str, str]:
    return {key: str(item) for key, item in _record_of(value).items()}


class ContractApi:
    def __init__(self) -> None:
        self._process = subprocess.Popen(
            ["node", str(CONTRACT_SERVER_SCRIPT)],
            cwd=REPOSITORY_ROOT,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
        )
        output = cast("IO[bytes]", self._process.stdout)
        first_line = output.readline()
        base_url = _record_of(json.loads(first_line)).get("base_url")
        if not isinstance(base_url, str):
            self.stop()
            raise AssertionError("The contract server printed no base_url.")
        self.base_url = base_url

    def stop(self) -> None:
        if self._process.stdin is not None:
            self._process.stdin.close()
        try:
            self._process.wait(STOP_TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired:
            self._process.kill()
            self._process.wait(STOP_TIMEOUT_SECONDS)
        if self._process.stdout is not None:
            self._process.stdout.close()

    def _control(self, method: str, path: str, body: object = None) -> object:
        data = None if body is None else json.dumps(body).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}/__contract/{path}",
            data=data,
            method=method,
            headers={"content-type": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=CONTROL_TIMEOUT_SECONDS) as response:
            raw = response.read()
        return None if not raw else json.loads(raw)

    def stub(
        self,
        operation_id: str,
        status: int,
        body: object,
        headers: Mapping[str, str] | None = None,
    ) -> None:
        reply: dict[str, object] = {"operation_id": operation_id, "status": status, "body": body}
        if headers is not None:
            reply["headers"] = dict(headers)
        self._control("POST", "stubs", reply)

    def script(self, operation_id: str, replies: Sequence[Mapping[str, object]]) -> None:
        first = replies[0]
        self._control(
            "POST",
            "stubs",
            {"operation_id": operation_id, "status": first["status"], "replies": list(replies)},
        )

    def recorded(self) -> tuple[list[RecordedRequest], list[str]]:
        report = _record_of(self._control("GET", "requests"))
        requests: list[RecordedRequest] = []
        for raw in cast("list[object]", report.get("requests")):
            entry = _record_of(raw)
            operation_id = entry.get("operation_id")
            requests.append(
                RecordedRequest(
                    operation_id=operation_id if isinstance(operation_id, str) else None,
                    method=str(entry.get("method")),
                    path=str(entry.get("path")),
                    path_parameters=_texts_of(entry.get("path_parameters")),
                    query=_texts_of(entry.get("query")),
                    headers=_texts_of(entry.get("headers")),
                    body=entry.get("body"),
                    raw_body_bytes=int(str(entry.get("raw_body_bytes"))),
                    problems=[
                        str(problem) for problem in cast("list[object]", entry.get("problems"))
                    ],
                )
            )
        problems = [str(problem) for problem in cast("list[object]", report.get("problems"))]
        return requests, problems

    def requests_for(self, operation_id: str) -> list[RecordedRequest]:
        requests, _ = self.recorded()
        return [request for request in requests if request.operation_id == operation_id]

    def assert_clean(self) -> list[RecordedRequest]:
        requests, problems = self.recorded()
        assert problems == []
        assert [request.problems for request in requests if request.problems] == []
        return requests

    def reset(self) -> None:
        self._control("POST", "reset", {})
