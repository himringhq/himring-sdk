from __future__ import annotations

import json
import re
import secrets
import threading
import time
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import cast

PROJECT_ID = "prj_" + "1" * 32
KNOWLEDGE_BASE_ID = "kb_" + "2" * 32
API_KEY = "hk_test_agent_hooks"
QUESTION_ID_SHAPE = re.compile(r"qst_[0-9a-f]{32}")
CHUNK_ID_SHAPE = re.compile(r"chk_[0-9a-f]{32}")
EVENTS_PER_REQUEST_LIMIT = 100
TEXT_LIMITS = {"answer": 20_000, "follow_up": 2_000, "handoff_reason": 200}
CITED_LIMIT = 50
LAST_C0_CONTROL = 0x1F
DELETE_CONTROL = 0x7F
ALLOWED_CONTROLS = frozenset("\n\r\t")
ANSWER_EVENTS_PATH = f"/v1/projects/{PROJECT_ID}/knowledge-bases/{KNOWLEDGE_BASE_ID}/answer-events"
SEARCH_PATH = f"/v1/projects/{PROJECT_ID}/knowledge-bases/{KNOWLEDGE_BASE_ID}/search"


def question_id() -> str:
    return "qst_" + secrets.token_hex(16)


def chunk_id() -> str:
    return "chk_" + secrets.token_hex(16)


@dataclass
class ScriptedReply:
    status: int
    body: dict[str, object]
    headers: dict[str, str] = field(default_factory=dict[str, str])


@dataclass
class StandInHimring:
    base_url: str = ""
    batches: list[list[dict[str, object]]] = field(default_factory=list[list[dict[str, object]]])
    arrival_times: list[float] = field(default_factory=list[float])
    refusals: list[str] = field(default_factory=list[str])
    known_question_ids: set[str] = field(default_factory=set[str])
    scripted: list[ScriptedReply] = field(default_factory=list[ScriptedReply])
    search_requests: list[dict[str, object]] = field(default_factory=list[dict[str, object]])
    search_chunks: list[str] = field(default_factory=list[str])
    lock: threading.Lock = field(default_factory=threading.Lock)

    def arrived(self) -> list[dict[str, object]]:
        with self.lock:
            return [event for batch in self.batches for event in batch]


def _has_forbidden_control(text: str) -> bool:
    return any(
        (ord(character) <= LAST_C0_CONTROL or ord(character) == DELETE_CONTROL)
        and character not in ALLOWED_CONTROLS
        for character in text
    )


def _utf16_length(text: str) -> int:
    return len(text.encode("utf-16-le")) // 2


def _problem(event: dict[str, object]) -> str | None:
    identifier = event.get("question_id")
    if not isinstance(identifier, str) or not QUESTION_ID_SHAPE.fullmatch(identifier):
        return f"bad question_id {identifier!r}"
    for name, limit in TEXT_LIMITS.items():
        value = event.get(name)
        if value is None:
            continue
        if not isinstance(value, str) or not value.strip() or _utf16_length(value) > limit:
            return f"{name} outside its bounds"
        if _has_forbidden_control(value):
            return f"{name} carries control characters"
    raw_cited = event.get("cited_chunk_ids", [])
    if not isinstance(raw_cited, list):
        return "bad cited_chunk_ids"
    cited = cast("list[object]", raw_cited)
    if len(cited) > CITED_LIMIT:
        return "bad cited_chunk_ids"
    if not all(isinstance(item, str) and CHUNK_ID_SHAPE.fullmatch(item) for item in cited):
        return "bad cited_chunk_ids"
    return None


def _handler_for(stand_in: StandInHimring) -> type[BaseHTTPRequestHandler]:
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format: str, *args: object) -> None:
            return

        def _reply(self, status: int, body: object, headers: dict[str, str] | None = None) -> None:
            data = json.dumps(body).encode("utf-8")
            self.send_response(status)
            self.send_header("content-type", "application/json")
            self.send_header("content-length", str(len(data)))
            for name, value in (headers or {}).items():
                self.send_header(name, value)
            self.end_headers()
            self.wfile.write(data)

        def do_POST(self) -> None:
            length = int(self.headers.get("content-length", "0"))
            payload: dict[str, object] = json.loads(self.rfile.read(length) or b"{}")
            if self.headers.get("authorization") != f"Bearer {API_KEY}":
                self._reply(401, {"error": {"code": "unauthorised", "message": "Send the key."}})
            elif self.path == SEARCH_PATH:
                self._search(payload)
            elif self.path == ANSWER_EVENTS_PATH:
                self._answer_events(payload)
            else:
                self._reply(404, {"error": {"code": "not_found", "message": "No route."}})

        def _search(self, payload: dict[str, object]) -> None:
            identifier = question_id()
            with stand_in.lock:
                stand_in.search_requests.append(payload)
                stand_in.known_question_ids.add(identifier)
                chunks = list(stand_in.search_chunks)
            passages = [{"chunk_id": chunk, "text": "A passage."} for chunk in chunks]
            self._reply(200, {"question_id": identifier, "duration_ms": 3, "passages": passages})

        def _answer_events(self, payload: dict[str, object]) -> None:
            with stand_in.lock:
                stand_in.arrival_times.append(time.monotonic())
                scripted = stand_in.scripted.pop(0) if stand_in.scripted else None
            if scripted is not None:
                self._reply(scripted.status, scripted.body, scripted.headers)
                return
            raw_events = payload.get("events")
            events = (
                cast("list[dict[str, object]]", raw_events) if isinstance(raw_events, list) else []
            )
            problem: str | None
            if payload.get("origin") != "sdk":
                problem = "origin is not sdk"
            elif not events or len(events) > EVENTS_PER_REQUEST_LIMIT:
                problem = f"{len(events)} events in one request"
            else:
                problem = next((found for found in map(_problem, events) if found), None)
            with stand_in.lock:
                if problem is not None:
                    stand_in.refusals.append(problem)
                else:
                    stand_in.batches.append(events)
                known = set(stand_in.known_question_ids)
            if problem is not None:
                self._reply(400, {"error": {"code": "invalid_input", "message": problem}})
                return
            results = [
                {
                    "question_id": event["question_id"],
                    "outcome": "recorded"
                    if event["question_id"] in known
                    else "question_not_found",
                }
                for event in events
            ]
            recorded = sum(1 for result in results if result["outcome"] == "recorded")
            self._reply(200, {"results": results, "recorded_count": recorded})

    return Handler


class RunningStandIn:
    def __init__(self) -> None:
        self.state = StandInHimring()
        self._server = ThreadingHTTPServer(("127.0.0.1", 0), _handler_for(self.state))
        self._server.daemon_threads = True
        host, port = self._server.server_address[0], self._server.server_address[1]
        self.state.base_url = f"http://{host!s}:{port}"
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._server.shutdown()
        self._server.server_close()
        self._thread.join()
