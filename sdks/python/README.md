# himring

The Python SDK of the [Himring API](https://himring.ai), which lets AI agents answer from what a business knows.

```sh
pip install himring
```

The package needs Python 3.10 or later, and its only dependency is httpx.

## Calling the API

`Himring` is the synchronous client, and `AsyncHimring` is the asyncio client. Each operation of the API is a method that takes keyword arguments. A method returns the JSON answer as a typed dictionary, or a streamed `Download` when the operation answers with a file.

```python
from himring import Himring

with Himring(api_key="hk_live_...") as himring:
    found = himring.search_knowledge_base(
        project_id="prj_...",
        knowledge_base_id="kb_...",
        question="When does the store open on Sunday?",
    )
    for passage in found["passages"]:
        print(passage["file_path"], passage["text"])
```

The client sends the API key, or a session token passed as `session_token`, in the `Authorization` header. It never follows redirects, and it stops waiting after `timeout_seconds`, which is 30 seconds unless you set another value on the client or on one call. A call that sends a file stops only when the upload makes no progress for `upload_idle_timeout_seconds`, which is 120 seconds by default.

## Errors

Every refusal raises `HimringApiError`. Its `kind` is `refused` when the API answered with an error, `invalid_input` when the client refused the call before sending it, `invalid_response` when the answer was not JSON or carried an error of the wrong shape, and `network` or `timeout` when the API did not answer. A refusal carries the `status`, the documented `code`, the `message`, the `issues` of each refused field, the `missing_permission` of an API key, `retry_after_seconds`, and the `request_id` of the call.

```python
from himring import HimringApiError

try:
    himring.get_database(project_id="prj_...", database_id="db_...")
except HimringApiError as error:
    if error.kind == "refused" and error.code == "database_not_found":
        print("The database is gone.")
    else:
        raise
```

## Files

`add_file` sends a file to a knowledge base. It sends a large file in parts, at most four at a time, straight to storage, and it never sends your API key to storage. After each part arrives, the client calls `on_progress` with the number of bytes in that part. `download_file` reads a version of a file from storage.

```python
from pathlib import Path

from himring import safe_download_name

with Path("refunds.pdf").open("rb") as file:
    added = himring.add_file(
        project_id="prj_...",
        knowledge_base_id="kb_...",
        path="policies/refunds.pdf",
        content=file,
        on_progress=lambda part_bytes: print(f"Storage took {part_bytes} more bytes."),
    )
print(added["outcome"], added["file"]["id"])

with himring.download_file(
    project_id="prj_...", knowledge_base_id="kb_...", file_id=added["file"]["id"], version=1
) as download:
    Path(safe_download_name(download.file_name, "file.pdf")).write_bytes(download.read())
```

## Memory webhooks

`verify_memory_webhook` checks the `himring-signature` header of a Memory webhook against its signing secret. It returns the event only when the signature matches the body and Himring signed the request no more than 5 minutes away from the current time.

```python
from himring import MemoryWebhookRejected, verify_memory_webhook

try:
    event = verify_memory_webhook(
        body=request_body,
        signature=request_headers.get("himring-signature"),
        secret=signing_secret,
    )
except MemoryWebhookRejected as rejection:
    print(rejection.reason)
```

## License

MIT
