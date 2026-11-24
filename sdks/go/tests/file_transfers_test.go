package tests

import (
	"bytes"
	"context"
	"errors"
	"net/http"
	"reflect"
	"sort"
	"strconv"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	partBytes             = 64 * 1024
	multipartContentBytes = 5*partBytes + 10
	storagePause          = 150 * time.Millisecond
	partsInFlightLimit    = 4
	firstTwoPolls         = 600 * time.Millisecond
)

func addFile(client *himring.Client, content himring.UploadSource, onProgress func(int64) error, sha256 string) (*himring.AddedFile, error) {
	return client.AddFile(context.Background(), himring.AddFileInput{
		ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, Path: filePath, Content: content, ContentSHA256: sha256, OnProgress: onProgress,
	})
}

func scriptMultipart(t testing.TB, storage *standIn, content []byte) {
	t.Helper()
	contract.stub(t, "create_upload", 201, map[string]any{"upload": uploadRecord(content, uploadPlan{state: "open", partBytes: partBytes}), "parts": []any{}})
	contract.stub(t, "sign_upload_parts", 200, signedParts(storage.baseURL, content, partBytes))
	completed := uploadRecord(content, uploadPlan{state: "completed", partBytes: partBytes})
	contract.stub(t, "complete_upload", 200, completed)
	contract.stub(t, "get_upload", 200, completed)
	contract.stub(t, "cancel_upload", 200, uploadRecord(content, uploadPlan{state: "failed", partBytes: partBytes}))
}

func scriptSingle(t testing.TB, url string, content []byte) {
	t.Helper()
	contract.stub(t, "create_upload", 201, map[string]any{"upload": uploadRecord(content, uploadPlan{state: "open"}), "parts": []any{signedPart(url, 1, len(content))}})
	contract.stub(t, "sign_upload_parts", 200, map[string]any{"parts": []any{signedPart(url, 1, len(content))}})
	contract.stub(t, "complete_upload", 200, uploadRecord(content, uploadPlan{state: "completed"}))
	contract.stub(t, "cancel_upload", 200, uploadRecord(content, uploadPlan{state: "failed"}))
}

func signedDigests(t testing.TB) (map[int]string, []int) {
	t.Helper()
	digests := map[int]string{}
	var numbers []int
	for _, request := range contract.requestsFor(t, "sign_upload_parts") {
		body, _ := request.Body.(map[string]any)
		parts, _ := body["parts"].([]any)
		for _, raw := range parts {
			part, _ := raw.(map[string]any)
			number := int(part["part_number"].(float64))
			numbers = append(numbers, number)
			digests[number], _ = part["sha256"].(string)
		}
	}
	sort.Ints(numbers)
	return digests, numbers
}

func putBodies(storage *standIn) map[string][]byte {
	bodies := map[string][]byte{}
	for _, put := range storage.arrived(http.MethodPut) {
		bodies[put.path] = put.body
	}
	return bodies
}

func TestSendsASingleFileToStorageWithoutTheAPIKeyOrCustomHeaders(t *testing.T) {
	client := newClient(t, himring.WithHeaders(map[string]string{"x-trace": "trace-1"}))
	storage := newStandIn(t)
	content := randomBytes(t, 300_000)
	scriptSingle(t, storage.baseURL+"/parts/1", content)

	added, err := addFile(client, bytes.NewReader(content), nil, "")

	if err != nil || added.Outcome != "added" || added.File.ID != fileID {
		t.Fatalf("the upload returned %+v, %v", added, err)
	}
	puts := storage.arrived(http.MethodPut)
	if len(puts) != 1 || !bytes.Equal(puts[0].body, content) || puts[0].headers["authorization"] != "" || puts[0].headers["x-trace"] != "" {
		t.Fatalf("storage received %d puts with headers %v", len(puts), puts[0].headers)
	}
	if puts[0].headers["x-amz-checksum-sha256"] != "part-1" || puts[0].headers["content-length"] != strconv.Itoa(len(content)) {
		t.Fatalf("the put headers are %v", puts[0].headers)
	}
	create := contract.requestsFor(t, "create_upload")[0]
	if !reflect.DeepEqual(create.Body, map[string]any{"path": filePath, "size_bytes": float64(len(content)), "content_sha256": sha256Of(content)}) {
		t.Fatalf("create_upload sent %#v", create.Body)
	}
	var operations []string
	for _, request := range contract.assertClean(t) {
		operations = append(operations, request.operation())
		if request.Headers["x-trace"] != "trace-1" {
			t.Fatalf("%s lost the custom header", request.operation())
		}
	}
	if !reflect.DeepEqual(operations, []string{"create_upload", "complete_upload"}) {
		t.Fatalf("the client called %v", operations)
	}
}

func TestSendsALargeFileInPartsWithAtMostFourInFlight(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, multipartContentBytes)
	scriptMultipart(t, storage, content)
	for path := range partSlices(content, partBytes) {
		storage.script(http.MethodPut, path, rawReply{status: 200, delay: storagePause})
	}
	total := int64(0)

	if _, err := addFile(client, bytes.NewReader(content), func(sent int64) error { total += sent; return nil }, ""); err != nil {
		t.Fatal(err)
	}

	if !reflect.DeepEqual(putBodies(storage), partSlices(content, partBytes)) {
		t.Fatal("storage did not receive the parts of the file")
	}
	if peak := storage.peakInFlight(); peak <= 1 || peak > partsInFlightLimit {
		t.Fatalf("storage saw %d parts in flight", peak)
	}
	if total != int64(len(content)) {
		t.Fatalf("the progress added up to %d", total)
	}
	digests, _ := signedDigests(t)
	for number := 1; number <= len(digests); number++ {
		if digests[number] != sha256Of(partSlices(content, partBytes)["/parts/"+strconv.Itoa(number)]) {
			t.Fatalf("part %d was signed with the wrong digest", number)
		}
	}
	contract.assertClean(t)
}

func TestSignsAPartAgainWhenStorageAnswers503(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, multipartContentBytes)
	scriptMultipart(t, storage, content)
	storage.script(http.MethodPut, "/parts/2", rawReply{status: 503}, rawReply{status: 200})

	if _, err := addFile(client, bytes.NewReader(content), nil, ""); err != nil {
		t.Fatal(err)
	}

	if _, numbers := signedDigests(t); !reflect.DeepEqual(numbers, []int{1, 2, 2, 3, 4, 5, 6}) {
		t.Fatalf("the client signed %v", numbers)
	}
	if len(contract.requestsFor(t, "cancel_upload")) != 0 {
		t.Fatal("the client cancelled the upload")
	}
	contract.assertClean(t)
}

func TestCancelsTheUploadWhenStorageRefusesAPartOrKeepsFailing(t *testing.T) {
	for _, replies := range [][]rawReply{{{status: 400}}, {{status: 503}, {status: 503}, {status: 503}}, {{status: 429, headers: map[string]string{"retry-after": "3600"}}}} {
		client := newClient(t)
		storage := newStandIn(t)
		content := randomBytes(t, multipartContentBytes)
		scriptMultipart(t, storage, content)
		storage.script(http.MethodPut, "/parts/3", replies...)

		_, err := addFile(client, bytes.NewReader(content), nil, "")

		refusal := expectKind(t, err, himring.ErrorKindRefused)
		if refusal.Status != replies[0].status || len(contract.requestsFor(t, "cancel_upload")) != 1 || len(contract.requestsFor(t, "complete_upload")) != 0 {
			t.Fatalf("the refusal is %+v", refusal)
		}
		contract.assertClean(t)
	}
}

func TestNeverFollowsAStorageLinkWithAnotherSchemeOrARedirect(t *testing.T) {
	storage := newStandIn(t)
	elsewhere := newStandIn(t)
	storage.script(http.MethodPut, "/parts/1", rawReply{status: 307, headers: map[string]string{"location": elsewhere.baseURL + "/collect"}})
	for _, url := range []string{"file:///etc/passwd", "ftp://storage.example/part", "gopher://x", "not a url", storage.baseURL + "/parts/1"} {
		client := newClient(t)
		content := randomBytes(t, 1_000)
		scriptSingle(t, url, content)

		_, err := addFile(client, bytes.NewReader(content), nil, "")

		if apiError(t, err).Kind == himring.ErrorKindNetwork || len(elsewhere.arrived("")) != 0 {
			t.Fatalf("%s gave %v", url, err)
		}
		if len(contract.requestsFor(t, "cancel_upload")) != 1 {
			t.Fatalf("%s left the upload open", url)
		}
	}
}

func TestRefusesAPartPlanThatDoesNotFitTheFile(t *testing.T) {
	for _, plan := range [][2]int{{partBytes, 3}, {partBytes, 7}, {0, 0}, {1, multipartContentBytes}} {
		client := newClient(t)
		storage := newStandIn(t)
		content := randomBytes(t, multipartContentBytes)
		scriptMultipart(t, storage, content)
		record := uploadRecord(content, uploadPlan{state: "open", partBytes: plan[0], partCount: plan[1]})
		if plan[0] == 0 {
			record["method"], record["part_bytes"], record["part_count"] = "multipart", 0, 0
		}
		contract.stub(t, "create_upload", 201, map[string]any{"upload": record, "parts": []any{}})

		_, err := addFile(client, bytes.NewReader(content), nil, "")

		expectKind(t, err, himring.ErrorKindInvalidResponse)
		if len(contract.requestsFor(t, "sign_upload_parts")) != 0 || len(storage.arrived("")) != 0 || len(contract.requestsFor(t, "cancel_upload")) != 1 {
			t.Fatalf("the plan %v reached storage or left the upload open", plan)
		}
	}
}

func TestWaitsWhileHimringChecksTheFileThenReturnsIt(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, 2_000)
	scriptSingle(t, storage.baseURL+"/parts/1", content)
	contract.stub(t, "complete_upload", 200, uploadRecord(content, uploadPlan{state: "checking"}))
	contract.script(t, "get_upload", map[string]any{"status": 200, "body": uploadRecord(content, uploadPlan{state: "checking"})},
		map[string]any{"status": 200, "body": uploadRecord(content, uploadPlan{state: "completed"})})
	started := time.Now()

	added, err := addFile(client, bytes.NewReader(content), nil, "")

	if err != nil || added.File.ID != fileID || time.Since(started) < firstTwoPolls || len(contract.requestsFor(t, "get_upload")) != 2 {
		t.Fatalf("the upload returned %+v, %v after %s", added, err, time.Since(started))
	}
	contract.assertClean(t)
}

func TestReturnsTheDocumentedFailureOfTheUploadWithoutCancellingIt(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, 2_000)
	scriptSingle(t, storage.baseURL+"/parts/1", content)
	contract.stub(t, "complete_upload", 200, uploadRecord(content, uploadPlan{state: "failed", failureCode: "upload_part_mismatch"}))

	_, err := addFile(client, bytes.NewReader(content), nil, "")

	refusal := expectKind(t, err, himring.ErrorKindRefused)
	status, _ := himring.DocumentedStatusOf("upload_part_mismatch")
	if refusal.Code != "upload_part_mismatch" || refusal.Status != status || status == 0 || len(contract.requestsFor(t, "cancel_upload")) != 0 {
		t.Fatalf("the refusal is %+v", refusal)
	}
	contract.assertClean(t)
}

func TestReadsTheUploadWhenHimringClosedItWhilePartsWereSent(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, multipartContentBytes)
	scriptMultipart(t, storage, content)
	contract.stub(t, "sign_upload_parts", 409, map[string]any{"error": map[string]any{"code": "upload_closed", "message": "Closed."}})

	added, err := addFile(client, bytes.NewReader(content), nil, "")

	if err != nil || added.Outcome != "added" || len(contract.requestsFor(t, "complete_upload")) != 0 || len(contract.requestsFor(t, "cancel_upload")) != 0 {
		t.Fatalf("the upload returned %+v, %v", added, err)
	}
	contract.assertClean(t)
}

func TestAProgressCallbackCanCallBackIntoTheClientOrStopTheUpload(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, multipartContentBytes)
	scriptMultipart(t, storage, content)
	var states []string
	readBack := func(sent int64) error {
		upload, err := client.GetUpload(context.Background(), himring.GetUploadInput{ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, UploadID: uploadID})
		if err != nil {
			return err
		}
		states = append(states, upload.State+":"+strconv.FormatInt(sent, 10))
		return nil
	}

	if _, err := addFile(client, bytes.NewReader(content), readBack, ""); err != nil {
		t.Fatal(err)
	}
	if len(states) != len(partSlices(content, partBytes)) || len(contract.requestsFor(t, "complete_upload")) != 1 {
		t.Fatalf("the callback saw %v", states)
	}
	contract.assertClean(t)

	client = newClient(t)
	scriptMultipart(t, storage, content)
	gaveUp := errors.New("the caller gave up")
	_, err := addFile(client, bytes.NewReader(content), func(int64) error { return gaveUp }, "")

	if !errors.Is(err, gaveUp) || len(contract.requestsFor(t, "cancel_upload")) != 1 || len(contract.requestsFor(t, "complete_upload")) != 0 {
		t.Fatalf("the stopped upload returned %v", err)
	}
}

type shrinkingSource struct{}

func (shrinkingSource) Size() int64 {
	return multipartContentBytes
}

func (shrinkingSource) ReadAt(buffer []byte, offset int64) (int, error) {
	return max(0, len(buffer)-1), errors.New("the file shrank")
}

func TestCancelsTheUploadWhenTheFileShrinksWhileItIsSent(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := bytes.Repeat([]byte("x"), multipartContentBytes)
	scriptMultipart(t, storage, content)

	_, err := addFile(client, shrinkingSource{}, nil, sha256Of(content))

	expectKind(t, err, himring.ErrorKindInvalidInput)
	if len(contract.requestsFor(t, "cancel_upload")) != 1 || len(storage.arrived(http.MethodPut)) != 0 {
		t.Fatal("the shrunken file reached storage or left the upload open")
	}
}

func TestRefusesADigestThatIsNotLowercaseHexOrAMissingSourceBeforeSending(t *testing.T) {
	client := newClient(t)
	for _, digest := range []string{"A" + sha256Of(nil)[1:], sha256Of(nil)[1:], "g" + sha256Of(nil)[1:], " "} {
		_, err := addFile(client, bytes.NewReader([]byte("data")), nil, digest)
		expectKind(t, err, himring.ErrorKindInvalidInput)
	}
	var missing *bytes.Reader
	_, err := addFile(client, missing, nil, "")
	expectKind(t, err, himring.ErrorKindInvalidInput)
	contract.assertNothingSent(t)
}
