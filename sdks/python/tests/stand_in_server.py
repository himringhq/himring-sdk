from __future__ import annotations

import threading
import time
from collections import defaultdict
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DEFAULT_PUT_STATUS = 200
NOT_SCRIPTED_STATUS = 404
SHUTDOWN_POLL_SECONDS = 0.02


@dataclass(frozen=True)
class RawReply:
    status: int
    body: bytes = b""
    headers: dict[str, str] = field(default_factory=dict[str, str])
    delay_seconds: float = 0.0
    drip_seconds: float = 0.0


@dataclass(frozen=True)
class ArrivedRequest:
    method: str
    path: str
    headers: dict[str, str]
    body: bytes


@dataclass
class StandInState:
    replies: dict[tuple[str, str], list[RawReply]] = field(
        default_factory=lambda: defaultdict[tuple[str, str], list[RawReply]](list)
    )
    arrived: list[ArrivedRequest] = field(default_factory=list[ArrivedRequest])
    in_flight: int = 0
    most_in_flight: int = 0
    lock: threading.Lock = field(default_factory=threading.Lock)

    def next_reply(self, method: str, path: str) -> RawReply:
        with self.lock:
            queue = self.replies.get((method, path))
            if queue:
                return queue.pop(0) if len(queue) > 1 else queue[0]
        return RawReply(DEFAULT_PUT_STATUS if method == "PUT" else NOT_SCRIPTED_STATUS)


def _read_body(handler: BaseHTTPRequestHandler) -> bytes:
    if handler.headers.get("transfer-encoding", "").lower() == "chunked":
        pieces: list[bytes] = []
        while True:
            size = int(handler.rfile.readline().strip().split(b";")[0], 16)
            if size == 0:
                handler.rfile.readline()
                return b"".join(pieces)
            pieces.append(handler.rfile.read(size))
            handler.rfile.readline()
    return handler.rfile.read(int(handler.headers.get("content-length", "0")))


def _handler_for(state: StandInState) -> type[BaseHTTPRequestHandler]:
    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def log_message(self, format: str, *args: object) -> None:
            return

        def _answer(self) -> None:
            with state.lock:
                state.in_flight += 1
                state.most_in_flight = max(state.most_in_flight, state.in_flight)
            try:
                body = _read_body(self)
                headers = {name.lower(): value for name, value in self.headers.items()}
                with state.lock:
                    state.arrived.append(ArrivedRequest(self.command, self.path, headers, body))
                reply = state.next_reply(self.command, self.path)
                time.sleep(reply.delay_seconds)
                self.send_response(reply.status)
                for name, value in reply.headers.items():
                    self.send_header(name, value)
                self.send_header("content-length", str(len(reply.body)))
                self.end_headers()
                if reply.drip_seconds > 0:
                    for index in range(len(reply.body)):
                        self.wfile.write(reply.body[index : index + 1])
                        self.wfile.flush()
                        time.sleep(reply.drip_seconds)
                else:
                    self.wfile.write(reply.body)
            except OSError:
                self.close_connection = True
            finally:
                with state.lock:
                    state.in_flight -= 1

        def do_GET(self) -> None:
            self._answer()

        def do_PUT(self) -> None:
            self._answer()

        def do_POST(self) -> None:
            self._answer()

        def do_DELETE(self) -> None:
            self._answer()

    return Handler


class StandInServer:
    def __init__(self) -> None:
        self.state = StandInState()
        self._server = ThreadingHTTPServer(("127.0.0.1", 0), _handler_for(self.state))
        self._server.daemon_threads = True
        host, port = self._server.server_address[0], self._server.server_address[1]
        self.base_url = f"http://{host!s}:{port}"
        self._thread = threading.Thread(
            target=self._server.serve_forever, args=(SHUTDOWN_POLL_SECONDS,), daemon=True
        )
        self._thread.start()

    def answer(self, method: str, path: str, *replies: RawReply) -> None:
        with self.state.lock:
            self.state.replies[(method, path)] = list(replies)

    def arrived(self, method: str | None = None) -> list[ArrivedRequest]:
        with self.state.lock:
            return [item for item in self.state.arrived if method is None or item.method == method]

    def stop(self) -> None:
        self._server.shutdown()
        self._server.server_close()
        self._thread.join()
