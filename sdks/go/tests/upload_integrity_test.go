package tests

import (
	"bytes"
	"net/http"
	"testing"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

var integrityContent = []byte("customer refund policy")

func prepareIntegrity(t testing.TB, storage *standIn, upload map[string]any, partSize int) {
	t.Helper()
	contract.stub(t, "create_upload", 201, map[string]any{"upload": upload, "parts": []any{signedPart(storage.baseURL+"/part", 1, partSize)}})
	contract.stub(t, "complete_upload", 200, uploadRecord(integrityContent, uploadPlan{state: "completed"}))
	contract.stub(t, "cancel_upload", 200, uploadRecord(integrityContent, uploadPlan{state: "failed"}))
}

func TestRefusesAnUploadPlanOrSignedPartForOtherContentBeforeSendingBytes(t *testing.T) {
	foreign := bytes.Repeat([]byte("x"), len(integrityContent))
	cases := []struct {
		upload   map[string]any
		partSize int
	}{
		{uploadRecord(foreign, uploadPlan{state: "open"}), len(integrityContent)},
		{uploadRecord(integrityContent, uploadPlan{state: "open"}), len(integrityContent) - 1},
		{uploadRecord(foreign, uploadPlan{state: "completed"}), len(integrityContent)},
	}
	for _, scenario := range cases {
		client := newClient(t)
		storage := newStandIn(t)
		prepareIntegrity(t, storage, scenario.upload, scenario.partSize)

		_, err := addFile(client, bytes.NewReader(integrityContent), nil, "")

		expectKind(t, err, himring.ErrorKindInvalidResponse)
		if len(storage.arrived("")) != 0 || len(contract.requestsFor(t, "complete_upload")) != 0 {
			t.Fatal("the client sent bytes for content that the API planned differently")
		}
	}
}

func TestRejectsACompletionReceiptForOtherContent(t *testing.T) {
	client := newClient(t)
	storage := newStandIn(t)
	prepareIntegrity(t, storage, uploadRecord(integrityContent, uploadPlan{state: "open"}), len(integrityContent))
	contract.stub(t, "complete_upload", 200, uploadRecord(bytes.Repeat([]byte("x"), len(integrityContent)), uploadPlan{state: "completed"}))

	_, err := addFile(client, bytes.NewReader(integrityContent), nil, "")

	expectKind(t, err, himring.ErrorKindInvalidResponse)
	puts := storage.arrived(http.MethodPut)
	if len(puts) != 1 || !bytes.Equal(puts[0].body, integrityContent) || len(contract.requestsFor(t, "cancel_upload")) != 1 {
		t.Fatal("the client accepted a receipt for other content")
	}
}
