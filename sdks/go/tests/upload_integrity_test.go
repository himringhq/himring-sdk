package tests

import (
	"bytes"
	"errors"
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

type oversizedSource struct {
	size int64
	read bool
}

func (source *oversizedSource) Size() int64 {
	return source.size
}

func (source *oversizedSource) ReadAt([]byte, int64) (int, error) {
	source.read = true
	return 0, errors.New("the oversized source must not be read")
}

func TestRefusesAnOversizedUploadBeforeReadingOrSendingItsContent(t *testing.T) {
	client := newClient(t)
	var document struct {
		Paths map[string]map[string]struct {
			OperationID string `json:"operationId"`
			RequestBody struct {
				Content map[string]struct {
					Schema struct {
						Properties map[string]struct {
							Maximum int64 `json:"maximum"`
						} `json:"properties"`
					} `json:"schema"`
				} `json:"content"`
			} `json:"requestBody"`
		} `json:"paths"`
	}
	decodeSpec(t, "openapi.json", &document)
	var maximum int64
	for _, path := range document.Paths {
		for _, operation := range path {
			if operation.OperationID == "create_upload" {
				maximum = operation.RequestBody.Content["application/json"].Schema.Properties["size_bytes"].Maximum
			}
		}
	}
	if maximum <= 0 {
		t.Fatal("the spec has no upload size limit")
	}
	source := &oversizedSource{size: maximum + 1}
	_, err := addFile(client, source, nil, "")
	expectKind(t, err, himring.ErrorKindInvalidInput)
	if source.read {
		t.Fatal("the client tried to read content larger than the documented maximum")
	}
	contract.assertNothingSent(t)
}
