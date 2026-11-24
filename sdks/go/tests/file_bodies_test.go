package tests

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"strconv"
	"strings"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const exportedLines = `{"id": "rec_1", "text": "Refunds take 5 days."}` + "\n"

var (
	importAnswer = map[string]any{"added": 0, "refused_count": 0, "refused": []any{}, "saved_questions": []any{}}
	indexID      = "ix_" + strings.Repeat("3", 32)
)

type unmeasuredReader struct {
	left int
}

func (reader *unmeasuredReader) Read(buffer []byte) (int, error) {
	if reader.left == 0 {
		return 0, io.EOF
	}
	count := min(len(buffer), reader.left)
	for index := range count {
		buffer[index] = 'q'
	}
	reader.left -= count
	return count, nil
}

type stalledReader struct{}

func (stalledReader) Read([]byte) (int, error) {
	time.Sleep(slowAnswer)
	return 0, io.EOF
}

func savedQuestionsLimit(t testing.TB) int {
	t.Helper()
	operation, known := himring.Operation("import_saved_questions")
	if !known {
		t.Fatal("the SDK has no import_saved_questions")
	}
	var document struct {
		Paths map[string]map[string]struct {
			OperationID string `json:"operationId"`
			RequestBody struct {
				MaximumBytes int `json:"x-himring-maximum-bytes"`
			} `json:"requestBody"`
		} `json:"paths"`
	}
	decodeSpec(t, "openapi.json", &document)
	documented := document.Paths[operation.Path]["post"].RequestBody.MaximumBytes
	if documented == 0 || int64(documented) != operation.MaximumBodyBytes {
		t.Fatalf("the spec takes %d bytes and the SDK %d", documented, operation.MaximumBodyBytes)
	}
	return documented
}

func importSavedQuestions(client *himring.Client, content io.Reader) error {
	_, err := client.ImportSavedQuestions(context.Background(), himring.ImportSavedQuestionsInput{
		ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, Format: himring.Ptr("jsonl"), Content: content,
	})
	return err
}

func TestSendsAFileOfExactlyTheDocumentedLimitAsOctetStream(t *testing.T) {
	limit := savedQuestionsLimit(t)
	client := newClient(t)
	contract.stub(t, "import_saved_questions", 201, importAnswer)

	if err := importSavedQuestions(client, bytes.NewReader(randomBytes(t, limit))); err != nil {
		t.Fatal(err)
	}

	requests := contract.assertClean(t)
	request := requests[0]
	if request.RawBodyBytes != limit || request.Headers["content-type"] != "application/octet-stream" ||
		request.Headers["content-length"] != strconv.Itoa(limit) || request.Query["format"] != "jsonl" {
		t.Fatalf("the request is %+v", request)
	}
}

func TestRefusesAFileOnePastTheLimitBeforeSendingAndStopsAnUnmeasuredStream(t *testing.T) {
	limit := savedQuestionsLimit(t)
	client := newClient(t)
	contract.stub(t, "import_saved_questions", 201, importAnswer)

	expectKind(t, importSavedQuestions(client, bytes.NewReader(make([]byte, limit+1))), himring.ErrorKindInvalidInput)
	contract.assertNothingSent(t)

	expectKind(t, importSavedQuestions(client, &unmeasuredReader{left: limit + 1}), himring.ErrorKindInvalidInput)
	requests, _ := contract.recorded(t)
	for _, request := range requests {
		if request.RawBodyBytes > limit {
			t.Fatalf("the contract server took %d bytes", request.RawBodyBytes)
		}
	}
}

func TestSendsAnUnmeasuredStreamWithinTheLimitAndRefusesAMissingFile(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "import_saved_questions", 201, importAnswer)

	if err := importSavedQuestions(client, &unmeasuredReader{left: 70_000}); err != nil {
		t.Fatal(err)
	}
	var nilReader *bytes.Reader
	expectKind(t, importSavedQuestions(client, nilReader), himring.ErrorKindInvalidInput)
	expectKind(t, importSavedQuestions(client, nil), himring.ErrorKindInvalidInput)

	requests := contract.assertClean(t)
	if len(requests) != 1 || requests[0].RawBodyBytes != 70_000 {
		t.Fatalf("the requests are %+v", requests)
	}
}

func TestAnUploadThatMakesNoProgressStopsAfterTheIdleLimit(t *testing.T) {
	client := newClient(t, himring.WithUploadIdleTimeout(timeLimit))
	started := time.Now()

	expectKind(t, importSavedQuestions(client, stalledReader{}), himring.ErrorKindTimeout)

	if elapsed := time.Since(started); elapsed > promptFailure {
		t.Fatalf("the upload took %s", elapsed)
	}
}

func TestNamesADownloadFromItsContentDispositionAndKeepsTheSafeNameSafe(t *testing.T) {
	cases := []struct{ disposition, expected, safe string }{
		{"attachment; filename*=UTF-8''r%C3%A9sum%C3%A9%20%E2%82%AC.ndjson", "résumé €.ndjson", "resume_.ndjson"},
		{`attachment; filename="../../../etc/passwd"`, "../../../etc/passwd", "passwd"},
		{`attachment; filename*=UTF-8''%C3%28.ndjson; filename="plain.ndjson"`, "plain.ndjson", "plain.ndjson"},
		{"attachment; filename*=UTF-8''%E2%82.ndjson", indexID + ".ndjson", indexID + ".ndjson"},
		{`attachment; filename="..\\..\\boot.ini"`, `..\\..\\boot.ini`, "boot.ini"},
	}
	for _, expected := range cases {
		client := newClient(t)
		contract.stub(t, "export_index_records", 200, exportedLines, map[string]string{"content-type": "application/x-ndjson", "content-disposition": expected.disposition})

		download, err := client.ExportIndexRecords(context.Background(), himring.ExportIndexRecordsInput{ProjectID: projectID, IndexID: indexID})
		if err != nil {
			t.Fatal(err)
		}
		content, err := io.ReadAll(download)
		download.Close()

		wanted, _ := json.Marshal(exportedLines)
		if err != nil || !bytes.Equal(content, bytes.ReplaceAll(wanted, []byte(`\u003c`), []byte("<"))) {
			t.Fatalf("the download held %q, %v", content, err)
		}
		if download.FileName != expected.expected || himring.SafeDownloadName(download.FileName, "export.ndjson") != expected.safe {
			t.Fatalf("the name is %q and the safe name %q", download.FileName, himring.SafeDownloadName(download.FileName, "export.ndjson"))
		}
		if download.ContentType != "application/x-ndjson" || download.ContentLength != int64(len(content)) {
			t.Fatalf("the download is %+v", download)
		}
		contract.assertClean(t)
	}
}

func TestARefusedDownloadReturnsTheRefusalAndNoStream(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "download_index", 404, map[string]any{"error": map[string]any{"code": "index_not_found", "message": "Gone."}})

	download, err := client.DownloadIndex(context.Background(), himring.DownloadIndexInput{ProjectID: projectID, IndexID: indexID})

	if download != nil || !himring.IsRefusal(err, "index_not_found") {
		t.Fatalf("the download returned %v, %v", download, err)
	}
	contract.assertClean(t)
}

func TestSafeDownloadNameNeverReturnsAPathOrAHiddenName(t *testing.T) {
	for name, expected := range map[string]string{
		"": "fallback", "/": "fallback", "...": "fallback", "a/": "fallback", ".bashrc": "bashrc", "C:\\Windows\\system32": "system32",
		"..\u202e.txt": "txt", strings.Repeat("a", 250) + ".pdf": strings.Repeat("a", 196) + ".pdf",
	} {
		if safe := himring.SafeDownloadName(name, "fallback"); safe != expected {
			t.Fatalf("%q became %q, not %q", name, safe, expected)
		}
	}
}
