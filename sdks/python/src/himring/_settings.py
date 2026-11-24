from __future__ import annotations

import math
import re
from collections.abc import Mapping
from dataclasses import dataclass

import httpx

from himring._errors import HimringApiError
from himring._generated.operations import SPEC_API_URL

DEFAULT_HIMRING_API_URL: str = SPEC_API_URL
DEFAULT_TIMEOUT_SECONDS = 30.0
DEFAULT_UPLOAD_IDLE_TIMEOUT_SECONDS = 120.0
API_URL_SCHEMES = frozenset({"http", "https"})
CLIENT_SET_HEADERS = frozenset({"authorization", "content-type", "content-length", "host"})
HEADER_NAME_PATTERN = re.compile(r"[!#$%&'*+.^_`|~0-9A-Za-z-]+")
HEADER_VALUE_PATTERN = re.compile(r"[\t\x20-\x7e]*")
CREDENTIAL_PATTERN = re.compile(r"[\x21-\x7e]+")


@dataclass(frozen=True, slots=True)
class ClientSettings:
    base_url: httpx.URL
    timeout_seconds: float
    upload_idle_timeout_seconds: float
    credential: str | None
    headers: Mapping[str, str]

    def url_of(self, path: str) -> httpx.URL:
        prefix = self.base_url.raw_path.rstrip(b"/")
        return self.base_url.copy_with(raw_path=prefix + b"/" + path.lstrip("/").encode("ascii"))


def positive_seconds(value: float | None, fallback: float, option: str) -> float:
    if value is None:
        return fallback
    if isinstance(value, bool) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"Set {option} to a number of seconds above zero.")
    return float(value)


def api_url_of(base_url: str) -> httpx.URL:
    example = f"Set base_url to an http or https URL, such as {DEFAULT_HIMRING_API_URL}."
    try:
        url = httpx.URL(base_url)
    except (httpx.InvalidURL, TypeError, ValueError) as error:
        raise ValueError(example) from error
    if url.scheme not in API_URL_SCHEMES or not url.host:
        raise ValueError(example)
    if url.userinfo or url.query or url.fragment or "#" in base_url or "?" in base_url:
        raise ValueError("Set base_url without a user name, a password, a query, or a fragment.")
    path = url.raw_path if url.raw_path.endswith(b"/") else url.raw_path + b"/"
    return url.copy_with(raw_path=path)


def credential_of(api_key: str | None, session_token: str | None) -> str | None:
    if api_key is not None and session_token is not None:
        raise ValueError("Pass api_key or session_token, not both.")
    credential = api_key if api_key is not None else session_token
    if credential is None:
        return None
    if not CREDENTIAL_PATTERN.fullmatch(credential):
        raise ValueError("Pass the credential as the text that Himring gave you, with no spaces.")
    return credential


def custom_headers_of(headers: Mapping[str, str] | None) -> dict[str, str]:
    kept: dict[str, str] = {}
    for name, value in (headers or {}).items():
        lower = name.lower()
        if lower in CLIENT_SET_HEADERS:
            raise HimringApiError(
                "invalid_input",
                f"The client sets the {lower} header itself. Remove it from headers.",
            )
        if not HEADER_NAME_PATTERN.fullmatch(lower):
            raise HimringApiError(
                "invalid_input", f"The header name {name!r} is not a valid HTTP header name."
            )
        if not HEADER_VALUE_PATTERN.fullmatch(value):
            raise HimringApiError(
                "invalid_input",
                f"The {lower} header holds characters that HTTP headers cannot carry.",
            )
        kept[lower] = value
    return kept


def settings_of(
    *,
    api_key: str | None,
    session_token: str | None,
    base_url: str,
    timeout_seconds: float | None,
    upload_idle_timeout_seconds: float | None,
    headers: Mapping[str, str] | None,
) -> ClientSettings:
    return ClientSettings(
        base_url=api_url_of(base_url),
        timeout_seconds=positive_seconds(
            timeout_seconds, DEFAULT_TIMEOUT_SECONDS, "timeout_seconds"
        ),
        upload_idle_timeout_seconds=positive_seconds(
            upload_idle_timeout_seconds,
            DEFAULT_UPLOAD_IDLE_TIMEOUT_SECONDS,
            "upload_idle_timeout_seconds",
        ),
        credential=credential_of(api_key, session_token),
        headers=custom_headers_of(headers),
    )
