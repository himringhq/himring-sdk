package tests

import (
	"bytes"
	"context"
	"errors"
	"io"
	"net/http"
	"reflect"
	"strconv"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	entityTag   = `"v3-etag"`
	fileVersion = 3
	firstBytes  = 100
)

func linkTo(url string, size int) map[string]any {
	return map[string]any{
		"url": url, "expires_at": farDeadlineAt, "file_name": "refunds.pdf", "content_type": "application/pdf",
		"disposition": "attachment", "size_bytes": size, "entity_tag": entityTag,
	}
}

func downloadFile(ctx context.Context, client *himring.Client, byteRange string) (*himring.Download, error) {
	return client.DownloadFile(ctx, himring.DownloadFileInput{
		ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, FileID: fileID, Version: fileVersion, Range: byteRange,
	})
}

func TestReadsAByteRangeOfAFileFromStorageWithoutTheAPIKey(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	stored := randomBytes(t, 5_000)
	contentRange := "bytes 0-" + strconv.Itoa(firstBytes-1) + "/" + strconv.Itoa(len(stored))
	contract.stub(t, "get_download_link", 200, linkTo(storage.baseURL+"/files/refunds.pdf", len(stored)))
	storage.script(http.MethodGet, "/files/refunds.pdf", rawReply{status: 206, body: stored[:firstBytes], headers: map[string]string{"content-range": contentRange, "accept-ranges": "bytes"}})

	download, err := downloadFile(context.Background(), client, "bytes=0-"+strconv.Itoa(firstBytes-1))
	if err != nil {
		t.Fatal(err)
	}
	content, err := io.ReadAll(download)
	download.Close()

	if err != nil || !bytes.Equal(content, stored[:firstBytes]) {
		t.Fatalf("the download held %d bytes, %v", len(content), err)
	}
	if download.Status != 206 || download.FileName != "refunds.pdf" || download.EntityTag != entityTag || download.ContentRange != contentRange {
		t.Fatalf("the download is %+v", download)
	}
	fetches := storage.arrived(http.MethodGet)
	if len(fetches) != 1 || fetches[0].headers["range"] != "bytes=0-"+strconv.Itoa(firstBytes-1) || fetches[0].headers["authorization"] != "" {
		t.Fatalf("storage received %+v", fetches)
	}
	link := contract.assertClean(t)[0]
	if link.PathParameters["version"] != strconv.Itoa(fileVersion) || !reflect.DeepEqual(link.Query, map[string]string{"disposition": "attachment"}) {
		t.Fatalf("the link request is %+v", link)
	}
}

func TestReturnsARefusalWhenStorageDoesNotHandOverTheFile(t *testing.T) {
	for _, status := range []int{301, 403, 404, 500} {
		client := newClient(t)
		storage := newStandIn(t)
		contract.stub(t, "get_download_link", 200, linkTo(storage.baseURL+"/files/refunds.pdf", 10))
		storage.script(http.MethodGet, "/files/refunds.pdf", rawReply{status: status, body: []byte("<Error/>"), headers: map[string]string{"location": "/x"}})

		_, err := downloadFile(context.Background(), client, "")

		if refusal := expectKind(t, err, himring.ErrorKindRefused); refusal.Status != status || len(storage.arrived(http.MethodGet)) != 1 {
			t.Fatalf("status %d gave %+v", status, refusal)
		}
	}
}

func TestRefusesARangeThatIsNotAByteRangeAndALinkWithAnotherScheme(t *testing.T) {
	client := newClient(t)
	for _, byteRange := range []string{"bytes=0-9\r\nx-forwarded-for: 10.0.0.1", "rows=0-9", " "} {
		_, err := downloadFile(context.Background(), client, byteRange)
		expectKind(t, err, himring.ErrorKindInvalidInput)
	}
	contract.assertNothingSent(t)
	contract.stub(t, "get_download_link", 200, linkTo("file:///etc/shadow", 10))

	_, err := downloadFile(context.Background(), client, "")

	expectKind(t, err, himring.ErrorKindInvalidResponse)
}

func TestADownloadCutOffOrStalledMidwayFailsTheRead(t *testing.T) {
	stored := randomBytes(t, 5_000)
	for kind, reply := range map[himring.ErrorKind]rawReply{
		himring.ErrorKindNetwork: {status: 200, body: stored, cutAt: 1_000},
		himring.ErrorKindTimeout: {status: 200, body: stored[:40], drip: slowAnswer},
	} {
		client := newClient(t, himring.WithTimeout(timeLimit))
		storage := newStandIn(t)
		contract.stub(t, "get_download_link", 200, linkTo(storage.baseURL+"/files/refunds.pdf", len(stored)))
		storage.script(http.MethodGet, "/files/refunds.pdf", reply)
		started := time.Now()

		download, err := downloadFile(context.Background(), client, "")
		if err != nil {
			t.Fatal(err)
		}
		_, err = io.ReadAll(download)
		download.Close()

		expectKind(t, err, kind)
		if elapsed := time.Since(started); elapsed > promptFailure {
			t.Fatalf("the %s download took %s", kind, elapsed)
		}
	}
}

func TestACancelledContextStopsADownloadMidway(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	stored := randomBytes(t, 400)
	contract.stub(t, "get_download_link", 200, linkTo(storage.baseURL+"/files/refunds.pdf", len(stored)))
	storage.script(http.MethodGet, "/files/refunds.pdf", rawReply{status: 200, body: stored, drip: 20 * time.Millisecond})
	ctx, cancel := context.WithCancel(context.Background())
	time.AfterFunc(timeLimit, cancel)

	download, err := downloadFile(ctx, client, "")
	if err != nil {
		t.Fatal(err)
	}
	read, err := io.ReadAll(download)
	download.Close()

	if !errors.Is(err, context.Canceled) || len(read) == 0 || len(read) >= len(stored) {
		t.Fatalf("the download read %d bytes and returned %v", len(read), err)
	}
}

func TestACancelledContextStopsAMultipartUploadAndCancelsIt(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := randomBytes(t, multipartContentBytes)
	scriptMultipart(t, storage, content)
	for path := range partSlices(content, partBytes) {
		storage.script(http.MethodPut, path, rawReply{status: 200, delay: slowAnswer})
	}
	ctx, cancel := context.WithCancel(context.Background())
	time.AfterFunc(timeLimit, cancel)
	started := time.Now()

	_, err := client.AddFile(ctx, himring.AddFileInput{ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, Path: filePath, Content: bytes.NewReader(content)})

	if !errors.Is(err, context.Canceled) || time.Since(started) > promptFailure {
		t.Fatalf("the upload returned %v after %s", err, time.Since(started))
	}
	if len(contract.requestsFor(t, "cancel_upload")) != 1 || len(contract.requestsFor(t, "complete_upload")) != 0 {
		t.Fatal("the cancelled upload was left open or completed")
	}
	contract.assertClean(t)
}
