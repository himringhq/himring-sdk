# himring

The Rust SDK of the [Himring API](https://himring.ai), which lets AI agents answer from what a business knows. It has one method for every operation of the API, with types generated from the published OpenAPI documents, so a field that the API renames will fail your build instead of failing in production.

```sh
cargo add himring
```

The crate needs Rust 1.88 or later and a Tokio runtime. It sends requests with reqwest over rustls by default, and the `native-tls` feature switches it to the TLS library of the operating system.

## Call the API

`Himring` is an async client that you can clone cheaply and share between tasks. Each operation of the API is a method that takes a typed input, which you build with `new` and the setters of its optional fields. The call starts when you await it, and it returns the typed answer, or a streamed `Download` when the operation answers with a file.

```rust
use himring::Himring;
use himring::types::SearchKnowledgeBaseInput;

let himring = Himring::builder().api_key(std::env::var("HIMRING_API_KEY")?).build()?;

let found = himring
    .search_knowledge_base(SearchKnowledgeBaseInput::new(
        "prj_0f3c9a7d5e1b42c6a8d4e2f19b7c6a30",
        "kb_6e2a1c9f4b8d47e3a5c0d9f2b1e7a463",
        "When does the store open on Sunday?",
    ))
    .await?;
for passage in &found.passages {
    println!("{} {}", passage.file_path, passage.text);
}
```

The client calls `https://api.himring.ai`, the first server that the OpenAPI documents list, unless you set `base_url`. It sends the API key, or a token that you set with `session_token`, in the `Authorization` header, and it never follows a redirect. A call stops waiting after `timeout`, which is 30 seconds unless you set another value on the builder or call `.timeout` on one call. A call that sends a file stops only when the upload makes no progress for `upload_idle_timeout`, which is two minutes by default. Dropping a call's future cancels the call and closes its connection.

`invoke` takes an operation ID and a JSON object of its fields, for a tool that chooses the operation at run time. The client refuses a field that the operation does not take, and an ID such as `..` that would reach another path, before it sends anything.

## Handle errors

Every failure is a `HimringApiError`. Its `kind` is `Refused` when the API answered with an error, `InvalidInput` when the client refused the call before sending it, `InvalidResponse` when the answer was not JSON or broke the documented schema, and `Network` or `Timeout` when the API did not answer. A refusal carries the `status`, the documented `code`, the `message`, the `issues` of each refused field, the `missing_permission` of an API key, `retry_after_seconds`, and the `request_id` of the call.

```rust
use himring::types::GetDatabaseInput;

match himring.get_database(GetDatabaseInput::new("prj_...", "db_...")).await {
    Ok(database) => println!("{}", database.name),
    Err(error) if error.is_refusal("database_not_found") => println!("The database is gone."),
    Err(error) => return Err(error.into()),
}
```

`describe_error` turns an error into one line that names the reason and each refused field.

## Send and read files

`add_file` sends a file to a knowledge base through an upload. The API signs links to storage, and the client sends a large file to storage in parts, at most four at a time, checks each part, and waits until the API confirms the file. It never sends your API key or your custom headers to storage. After each part arrives, the client awaits `on_progress` with the number of bytes in that part, and an error from the callback cancels the upload. Dropping the future of `add_file` cancels the upload too.

```rust
use himring::{AddFileInput, DownloadFileInput, ProgressError, safe_download_name};

let file = tokio::fs::File::open("refunds.pdf").await?;
let added = himring
    .add_file(
        AddFileInput::new("prj_...", "kb_...", "policies/refunds.pdf", file).on_progress(
            |part_bytes| async move {
                println!("Storage took {part_bytes} more bytes.");
                Ok::<(), ProgressError>(())
            },
        ),
    )
    .await?;

let download = himring
    .download_file(DownloadFileInput::new("prj_...", "kb_...", added.file.id.clone(), 1))
    .await?;
let name = safe_download_name(download.file_name(), "file.pdf");
tokio::fs::write(name, download.read().await?).await?;
```

A `Download` also gives its bytes one chunk at a time through `chunk` or `bytes_stream`, and a chunk that does not arrive within the time limit ends the download with a `Timeout` error. Pass the file name through `safe_download_name` before you write it to the disk, because it holds whatever name the file had when someone uploaded it.

## Record what your agent answers

The `answers` module records each answer, citation, follow-up, thumbs-down, and handoff of your agent, so that Himring can show which questions your knowledge base answers badly. The recorder batches events in memory and in a private folder on the disk, so a crash, a restart, or an outage of the API loses none of them.

```rust
use himring::answers::{AnswerConversationIdentity, AnswerRecorder, AnswerRecorderOptions};

let recorder = AnswerRecorder::new(AnswerRecorderOptions::new(himring.clone(), "prj_...", "kb_..."))?;
let mut conversation =
    recorder.conversation(AnswerConversationIdentity::new().end_user_id("customer-1042"));
let input = conversation.search_input("How long do refunds take?");
let found = conversation.search(input).await?;
let cited: Vec<String> = found.passages.iter().take(1).map(|passage| passage.chunk_id.clone()).collect();
conversation.record_answer("Refunds take five business days.", Some(&cited));
recorder.close().await;
```

## Verify memory webhooks

`verify_memory_webhook` checks the `himring-signature` header of a Memory webhook against its signing secret. It returns the event only when the signature matches the body and Himring signed the request no more than five minutes away from the current time.

```rust
use himring::{MemoryWebhookError, MemoryWebhookVerification, verify_memory_webhook};

match verify_memory_webhook(MemoryWebhookVerification::new(&body, signature, &secret)) {
    Ok(event) => println!("{} {}", event.event_type, event.memory_id),
    Err(MemoryWebhookError::Rejected(rejection)) => println!("{}", rejection.reason.as_str()),
    Err(error) => return Err(error.into()),
}
```

## License

MIT
