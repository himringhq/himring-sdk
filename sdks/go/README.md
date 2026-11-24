# himring

The Go SDK of the [Himring API](https://himring.ai), which lets AI agents answer from what a business knows.

```sh
go get github.com/himringhq/himring-sdk/sdks/go
```

The module needs Go 1.26 or later, and its only dependency is `golang.org/x/text`, which the client uses to turn a download's file name into a safe one. The package is called `himring`, so import it under that name:

```go
import himring "github.com/himringhq/himring-sdk/sdks/go"
```

## Calling the API

`himring.New` returns the client, and each operation of the API is a method that takes a `context.Context` and a typed input struct. A method returns the JSON answer as a typed struct, or a streamed `*himring.Download` when the operation answers with a file.

```go
client, err := himring.New(himring.WithAPIKey(os.Getenv("HIMRING_API_KEY")))
if err != nil {
	return err
}
found, err := client.SearchKnowledgeBase(ctx, himring.SearchKnowledgeBaseInput{
	ProjectID:       "prj_...",
	KnowledgeBaseID: "kb_...",
	Question:        "When does the store open on Sunday?",
})
if err != nil {
	return err
}
for _, passage := range found.Passages {
	fmt.Println(passage.FilePath, passage.Text)
}
```

The client sends the API key, or a session token passed through `himring.WithSessionToken`, in the `Authorization` header. It never follows redirects, and it stops waiting after 30 seconds unless you pass another value to `himring.WithTimeout` on the client or to `himring.WithRequestTimeout` on one call. A call that sends a file stops only when the upload makes no progress for the `himring.WithUploadIdleTimeout` duration, which is 120 seconds by default. When your context is canceled or passes its deadline, the call stops and returns the context's error.

## Errors

Every refusal returns a `*himring.Error`. Its `Kind` is `refused` when the API answered with an error, `invalid_input` when the client refused the call before sending it, `invalid_response` when the answer was not JSON or carried an error of the wrong shape, and `network` or `timeout` when the API did not answer. A refusal carries the `Status`, the documented `Code`, the `Message`, the `Issues` of each refused field, the `MissingPermission` of an API key, `RetryAfterSeconds`, and the `RequestID` of the call.

```go
_, err := client.GetDatabase(ctx, himring.GetDatabaseInput{ProjectID: "prj_...", DatabaseID: "db_..."})
if himring.IsRefusal(err, "database_not_found") {
	fmt.Println("The database is gone.")
} else if err != nil {
	return err
}
```

## Files

`AddFile` sends a file to a knowledge base. It sends a large file in parts, at most four at a time, straight to storage, and it never sends your API key to storage. After each part arrives, the client calls `OnProgress` with the number of bytes in that part, and an error that `OnProgress` returns cancels the upload. `DownloadFile` reads a version of a file from storage.

```go
file, err := os.Open("refunds.pdf")
if err != nil {
	return err
}
defer file.Close()
source, err := himring.FileUploadSource(file)
if err != nil {
	return err
}
added, err := client.AddFile(ctx, himring.AddFileInput{
	ProjectID:       "prj_...",
	KnowledgeBaseID: "kb_...",
	Path:            "policies/refunds.pdf",
	Content:         source,
	OnProgress: func(partBytes int64) error {
		fmt.Printf("Storage took %d more bytes.\n", partBytes)
		return nil
	},
})
if err != nil {
	return err
}

download, err := client.DownloadFile(ctx, himring.DownloadFileInput{
	ProjectID: "prj_...", KnowledgeBaseID: "kb_...", FileID: added.File.ID, Version: 1,
})
if err != nil {
	return err
}
defer download.Close()
saved, err := os.Create(himring.SafeDownloadName(download.FileName, "file.pdf"))
if err != nil {
	return err
}
defer saved.Close()
_, err = io.Copy(saved, download)
```

## Record what your agent answers

The `answers` package records each answer, citation, follow-up, thumbs-down, and handoff of your agent, so that Himring can show which questions your knowledge base answers badly. The recorder batches events in memory and in a spool file on the disk, so a restart or an outage of the API loses none of them.

```go
import "github.com/himringhq/himring-sdk/sdks/go/answers"

recorder, err := answers.NewRecorder(answers.Options{Client: client, ProjectID: "prj_...", KnowledgeBaseID: "kb_..."})
if err != nil {
	return err
}
defer recorder.Close(ctx)
conversation := recorder.Conversation(answers.Identity{EndUserID: "customer-1042"})
result, err := conversation.Search(ctx, himring.SearchKnowledgeBaseInput{Question: "How long do refunds take?"})
if err != nil {
	return err
}
conversation.RecordAnswer("Refunds take five business days.", []string{result.Passages[0].ChunkID})
```

## Verify memory webhooks

`VerifyMemoryWebhook` checks the `himring-signature` header of a webhook from a Himring Memory against your signing secret. It returns the event only when the signature matches the body and Himring signed the request no more than five minutes away from the current time.

```go
event, err := himring.VerifyMemoryWebhook(himring.MemoryWebhook{
	Body:      body,
	Signature: request.Header.Get(himring.MemoryWebhookSignatureHeader),
	Secret:    signingSecret,
})
var rejection *himring.MemoryWebhookRejected
if errors.As(err, &rejection) {
	fmt.Println(rejection.Reason)
}
```

## License

MIT
