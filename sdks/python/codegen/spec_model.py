from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Literal, TypeVar, cast
from urllib.parse import urlsplit

ValueT = TypeVar("ValueT")
JsonObject = dict[str, object]
DocumentName = Literal["api", "session"]
HttpMethod = Literal["GET", "POST", "DELETE"]
BodyKind = Literal["none", "json", "file"]

SPEC_DIRECTORY = Path(__file__).resolve().parents[3] / "spec"
DOCUMENT_FILES: dict[DocumentName, str] = {
    "api": "openapi.json",
    "session": "openapi-session.json",
}
JSON_MEDIA_TYPE = "application/json"
FILE_MEDIA_TYPE = "application/octet-stream"
OPERATION_ID_PATTERN = re.compile(r"[a-z][a-z0-9]*(_[a-z0-9]+)*")
SUCCESS_STATUS_PATTERN = re.compile(r"2[0-9][0-9]")
PATH_TEMPLATE_PATTERN = re.compile(r"\{([^}]+)\}")
LISTED_EXTENSION_PATTERN = re.compile(r"\.[a-z0-9]+")
FILE_KIND_PATTERN = OPERATION_ID_PATTERN
FILE_KINDS_KEYWORD = "x-himring-file-kinds"
MAXIMUM_BYTES_KEYWORD = "x-himring-maximum-bytes"
FILE_EXTENSION_KEYWORD = "x-himring-file-extension"
ERROR_CODES_KEYWORD = "x-himring-error-codes"
METHODS_BY_KEY: dict[str, HttpMethod] = {"get": "GET", "post": "POST", "delete": "DELETE"}


class SpecModelError(Exception):
    pass


@dataclass(frozen=True)
class ParameterModel:
    name: str
    required: bool
    schema: JsonObject


@dataclass(frozen=True)
class BodyModel:
    kind: BodyKind
    schema: JsonObject | None
    maximum_bytes: int | None


@dataclass(frozen=True)
class ResponseModel:
    status: int
    schema: JsonObject | None
    content_types: tuple[str, ...]
    file_extension: str | None

    @property
    def is_download(self) -> bool:
        return self.file_extension is not None


@dataclass(frozen=True)
class OperationModel:
    id: str
    document: DocumentName
    method: HttpMethod
    path: str
    path_parameters: tuple[ParameterModel, ...]
    query_parameters: tuple[ParameterModel, ...]
    body: BodyModel
    response: ResponseModel


@dataclass(frozen=True)
class ErrorCodeModel:
    code: str
    status: int
    message: str


@dataclass(frozen=True)
class SpecModel:
    operations: tuple[OperationModel, ...]
    error_codes: tuple[ErrorCodeModel, ...]
    components: dict[DocumentName, JsonObject]
    file_kinds: dict[str, tuple[str, ...]]
    server_url: str


def is_record(value: object) -> bool:
    return isinstance(value, dict)


def record_at(value: object, place: str) -> JsonObject:
    if not isinstance(value, dict):
        raise SpecModelError(f"{place} is not a JSON object.")
    return cast("JsonObject", value)


def optional_record(value: object) -> JsonObject | None:
    return cast("JsonObject", value) if isinstance(value, dict) else None


def list_at(value: object) -> list[object]:
    return cast("list[object]", value) if isinstance(value, list) else []


def text_at(value: object, place: str) -> str:
    if not isinstance(value, str) or value == "":
        raise SpecModelError(f"{place} is not a text value.")
    return value


def is_whole_number(value: object) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def _parameter_of(raw: object, place: str) -> tuple[str, ParameterModel]:
    parameter = record_at(raw, place)
    name = text_at(parameter.get("name"), f"{place} name")
    location = text_at(parameter.get("in"), f"{place} in")
    if location not in ("path", "query"):
        raise SpecModelError(f"{place} is in {location}.")
    if location == "query" and (
        parameter.get("style") != "form" or parameter.get("explode") is not False
    ):
        raise SpecModelError(f"{place} is not a form parameter without explode.")
    schema = record_at(parameter.get("schema"), f"{place} schema")
    return location, ParameterModel(name, parameter.get("required") is True, schema)


def _body_of(operation: JsonObject, place: str) -> BodyModel:
    if "requestBody" not in operation:
        return BodyModel("none", None, None)
    body = record_at(operation["requestBody"], f"{place} requestBody")
    content = record_at(body.get("content"), f"{place} requestBody content")
    media_types = list(content)
    if body.get("required") is not True or len(media_types) != 1:
        raise SpecModelError(f"{place} needs one required request body media type.")
    media_type = media_types[0]
    if media_type == FILE_MEDIA_TYPE:
        limit = body.get(MAXIMUM_BYTES_KEYWORD)
        if not isinstance(limit, int) or isinstance(limit, bool) or limit <= 0:
            raise SpecModelError(f"{place} takes a file without {MAXIMUM_BYTES_KEYWORD}.")
        return BodyModel("file", None, limit)
    if media_type != JSON_MEDIA_TYPE:
        raise SpecModelError(f"{place} takes {media_type}.")
    schema = record_at(
        record_at(content[JSON_MEDIA_TYPE], place).get("schema"), f"{place} body schema"
    )
    if schema.get("type") != "object" or not is_record(schema.get("properties")):
        raise SpecModelError(f"{place} takes a JSON body that is not an object with properties.")
    return BodyModel("json", schema, None)


def _response_of(operation: JsonObject, place: str) -> ResponseModel:
    responses = record_at(operation.get("responses"), f"{place} responses")
    successes = [
        (status, raw)
        for status, raw in responses.items()
        if SUCCESS_STATUS_PATTERN.fullmatch(status)
    ]
    if len(successes) != 1:
        raise SpecModelError(f"{place} has no single success response.")
    status_text, raw = successes[0]
    response = record_at(raw, f"{place} {status_text} response")
    content = record_at(response.get("content"), f"{place} {status_text} content")
    status = int(status_text)
    extension = response.get(FILE_EXTENSION_KEYWORD)
    if extension is not None:
        if not isinstance(extension, str):
            raise SpecModelError(f"{place} has a file extension that is not text.")
        return ResponseModel(status, None, tuple(content), extension)
    json_content = record_at(content.get(JSON_MEDIA_TYPE), f"{place} JSON response")
    schema = record_at(json_content.get("schema"), f"{place} response schema")
    return ResponseModel(status, schema, (JSON_MEDIA_TYPE,), None)


def _operation_of(
    document: DocumentName, path: str, method_key: str, raw: object
) -> OperationModel:
    place = f"{DOCUMENT_FILES[document]} {method_key.upper()} {path}"
    method = METHODS_BY_KEY.get(method_key)
    if method is None:
        raise SpecModelError(f"{place} uses a method that the SDK does not send.")
    operation = record_at(raw, place)
    operation_id = text_at(operation.get("operationId"), f"{place} operationId")
    if not OPERATION_ID_PATTERN.fullmatch(operation_id):
        raise SpecModelError(f"{place} has the operationId {operation_id}, not snake_case.")
    path_parameters: list[ParameterModel] = []
    query_parameters: list[ParameterModel] = []
    for index, item in enumerate(list_at(operation.get("parameters"))):
        location, parameter = _parameter_of(item, f"{place} parameter {index}")
        (path_parameters if location == "path" else query_parameters).append(parameter)
    templated = PATH_TEMPLATE_PATTERN.findall(path)
    if templated != [parameter.name for parameter in path_parameters]:
        raise SpecModelError(f"{place} documents path parameters that differ from its path.")
    if any(not parameter.required for parameter in path_parameters):
        raise SpecModelError(f"{place} has an optional path parameter.")
    return OperationModel(
        id=operation_id,
        document=document,
        method=method,
        path=path,
        path_parameters=tuple(path_parameters),
        query_parameters=tuple(query_parameters),
        body=_body_of(operation, place),
        response=_response_of(operation, place),
    )


def _error_codes_of(document: JsonObject, place: str) -> list[ErrorCodeModel]:
    components = record_at(document.get("components"), f"{place} components")
    schemas = record_at(components.get("schemas"), f"{place} schemas")
    error_code = record_at(schemas.get("error_code"), f"{place} error_code")
    codes = record_at(error_code.get(ERROR_CODES_KEYWORD), f"{place} {ERROR_CODES_KEYWORD}")
    found: list[ErrorCodeModel] = []
    for code, raw in codes.items():
        description = record_at(raw, f"{place} error code {code}")
        status = description.get("status")
        message = description.get("message")
        if not isinstance(status, int) or isinstance(status, bool) or not isinstance(message, str):
            raise SpecModelError(f"{place} error code {code} has no status and message.")
        found.append(ErrorCodeModel(code, status, message))
    return found


def _file_kinds_of(components: JsonObject, place: str) -> dict[str, tuple[str, ...]]:
    kinds = record_at(components.get(FILE_KINDS_KEYWORD), f"{place} {FILE_KINDS_KEYWORD}")
    owners: dict[str, str] = {}
    found: dict[str, tuple[str, ...]] = {}
    for kind, raw in kinds.items():
        if not FILE_KIND_PATTERN.fullmatch(kind):
            raise SpecModelError(f"{place} lists the file kind {kind}.")
        extensions = list_at(raw)
        if not extensions:
            raise SpecModelError(f"{place} lists no extensions for {kind}.")
        listed: list[str] = []
        for extension in extensions:
            if not isinstance(extension, str) or not LISTED_EXTENSION_PATTERN.fullmatch(extension):
                raise SpecModelError(f"{place} lists {json.dumps(extension)} for {kind}.")
            owner = owners.get(extension)
            if owner is not None:
                raise SpecModelError(f"{place} lists {extension} for {owner} and {kind}.")
            owners[extension] = kind
            listed.append(extension)
        found[kind] = tuple(listed)
    if not found:
        raise SpecModelError(f"{place} lists no file kinds.")
    return found


def _server_url_of(document: JsonObject, place: str) -> str:
    servers = list_at(document.get("servers"))
    first = optional_record(servers[0]) if servers else None
    url = text_at(None if first is None else first.get("url"), f"{place} servers[0].url")
    try:
        parts = urlsplit(url)
        hostname = parts.hostname
    except ValueError as error:
        raise SpecModelError(
            f"{place} gives {url} as its first server, which is not an https URL."
        ) from error
    if parts.scheme != "https" or not hostname:
        raise SpecModelError(f"{place} gives {url} as its first server, which is not an https URL.")
    return url


def _same_in(found: dict[DocumentName, ValueT], what: str) -> ValueT:
    values = list(found.values())
    if not values:
        raise SpecModelError(f"The documents give no {what}.")
    if any(value != values[0] for value in values[1:]):
        raise SpecModelError(f"The documents give different {what}.")
    return values[0]


def load_spec_model(directory: Path = SPEC_DIRECTORY) -> SpecModel:
    operations: list[OperationModel] = []
    error_codes: dict[str, ErrorCodeModel] = {}
    components: dict[DocumentName, JsonObject] = {}
    file_kinds: dict[DocumentName, dict[str, tuple[str, ...]]] = {}
    server_urls: dict[DocumentName, str] = {}
    for document, file in DOCUMENT_FILES.items():
        parsed = record_at(json.loads((directory / file).read_text(encoding="utf-8")), file)
        components[document] = record_at(parsed.get("components"), f"{file} components")
        file_kinds[document] = _file_kinds_of(components[document], file)
        server_urls[document] = _server_url_of(parsed, file)
        for path, item in record_at(parsed.get("paths"), f"{file} paths").items():
            for method_key, raw in record_at(item, f"{file} {path}").items():
                operations.append(_operation_of(document, path, method_key, raw))
        for code in _error_codes_of(parsed, file):
            known = error_codes.get(code.code)
            if known is not None and known != code:
                raise SpecModelError(
                    f"The documents describe the error code {code.code} in two ways."
                )
            error_codes[code.code] = code
    seen: set[str] = set()
    for operation in operations:
        if operation.id in seen:
            raise SpecModelError(f"The documents hold {operation.id} twice.")
        seen.add(operation.id)
    return SpecModel(
        operations=tuple(sorted(operations, key=lambda operation: operation.id)),
        error_codes=tuple(sorted(error_codes.values(), key=lambda code: code.code)),
        components=components,
        file_kinds=_same_in(file_kinds, "file kinds"),
        server_url=_same_in(server_urls, "server URLs"),
    )
