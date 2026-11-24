package tests

import (
	"bytes"
	"net/http"
	"strings"
	"testing"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

func TestStorageRetryAfterOverflowDoesNotCauseAnImmediateRetry(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	content := []byte("refund policy")
	scriptSingle(t, storage.baseURL+"/part", content)
	storage.script(http.MethodPut, "/part", rawReply{
		status: 429, headers: map[string]string{"retry-after": strings.Repeat("9", 32)},
	})
	_, err := addFile(client, bytes.NewReader(content), nil, "")
	refusal := expectKind(t, err, himring.ErrorKindRefused)
	if refusal.Status != 429 || len(storage.arrived(http.MethodPut)) != 1 {
		t.Fatal("the client retried before the storage retry deadline")
	}
	if len(contract.requestsFor(t, "cancel_upload")) != 1 || len(contract.requestsFor(t, "sign_upload_parts")) != 0 {
		t.Fatal("the client resigned the part or left the refused upload open")
	}
	contract.assertClean(t)
}
