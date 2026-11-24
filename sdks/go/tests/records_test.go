package tests

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"strconv"
	"strings"
	"testing"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	apiKey          = "hk_test_go_sdk"
	uploadCreatedAt = "2026-11-24T08:00:00.000Z"
	farDeadlineAt   = "2099-01-01T00:00:00.000Z"
	filePath        = "policies/refunds.pdf"
)

var (
	projectID       = "prj_" + strings.Repeat("1", 32)
	knowledgeBaseID = "kb_" + strings.Repeat("2", 32)
	uploadID        = "upl_" + strings.Repeat("4", 32)
	fileID          = "fil_" + strings.Repeat("5", 32)
)

func newClient(t testing.TB, options ...himring.Option) *himring.Client {
	t.Helper()
	contract.reset(t)
	client, err := himring.New(append([]himring.Option{himring.WithAPIKey(apiKey), himring.WithBaseURL(contract.baseURL)}, options...)...)
	if err != nil {
		t.Fatal(err)
	}
	return client
}

func clientAt(t testing.TB, baseURL string, options ...himring.Option) *himring.Client {
	t.Helper()
	client, err := himring.New(append([]himring.Option{himring.WithAPIKey(apiKey), himring.WithBaseURL(baseURL)}, options...)...)
	if err != nil {
		t.Fatal(err)
	}
	return client
}

func randomBytes(t testing.TB, size int) []byte {
	t.Helper()
	content := make([]byte, size)
	if _, err := rand.Read(content); err != nil {
		t.Fatal(err)
	}
	return content
}

func sha256Of(content []byte) string {
	digest := sha256.Sum256(content)
	return hex.EncodeToString(digest[:])
}

func apiError(t testing.TB, err error) *himring.Error {
	t.Helper()
	if err == nil {
		t.Fatal("the call returned no error")
	}
	found, isAPIError := himring.AsError(err)
	if !isAPIError {
		t.Fatalf("the call returned %T %v, not a himring.Error", err, err)
	}
	return found
}

func expectKind(t testing.TB, err error, kind himring.ErrorKind) *himring.Error {
	t.Helper()
	found := apiError(t, err)
	if found.Kind != kind {
		t.Fatalf("the error kind is %s (%s), not %s", found.Kind, found.Message, kind)
	}
	return found
}

func fileRecord(content []byte) map[string]any {
	return map[string]any{
		"id": fileID, "knowledge_base_id": knowledgeBaseID, "path": filePath, "kind": "pdf", "address": nil,
		"status": "queued", "current_version": nil, "latest_version": 1, "size_bytes": len(content),
		"content_sha256": sha256Of(content), "failure": nil, "unread_parts": []any{},
		"metadata": map[string]any{"team": "support"}, "created_at": uploadCreatedAt, "updated_at": uploadCreatedAt,
		"deleted_at": nil, "purge_after": nil,
	}
}

type uploadPlan struct {
	state       string
	partBytes   int
	partCount   int
	failureCode string
}

func uploadRecord(content []byte, plan uploadPlan) map[string]any {
	size := len(content)
	method, partBytes, partCount := "single", size, 1
	if plan.partBytes > 0 || plan.partCount > 0 {
		method, partBytes = "multipart", plan.partBytes
		partCount = plan.partCount
		if partCount == 0 && partBytes > 0 {
			partCount = (size + partBytes - 1) / partBytes
		}
	}
	record := map[string]any{
		"id": uploadID, "knowledge_base_id": knowledgeBaseID, "path": filePath, "address": nil, "size_bytes": size,
		"content_sha256": sha256Of(content), "method": method, "part_bytes": partBytes, "part_count": partCount,
		"state": plan.state, "outcome": nil, "file": nil, "failure": nil, "created_at": uploadCreatedAt, "deadline_at": farDeadlineAt,
	}
	if plan.state == "completed" {
		record["outcome"], record["file"] = "added", fileRecord(content)
	}
	if plan.failureCode != "" {
		record["failure"] = map[string]any{"code": plan.failureCode, "message": "The bytes did not match the SHA-256."}
	}
	return record
}

func signedPart(url string, partNumber int, sizeBytes int) map[string]any {
	return map[string]any{
		"part_number": partNumber, "size_bytes": sizeBytes, "method": "PUT", "url": url,
		"headers": map[string]any{"x-amz-checksum-sha256": "part-" + itoa(partNumber)}, "expires_at": farDeadlineAt,
	}
}

func partSlices(content []byte, partBytes int) map[string][]byte {
	slices := map[string][]byte{}
	for number, start := 1, 0; start < len(content); number, start = number+1, start+partBytes {
		slices["/parts/"+itoa(number)] = content[start:min(len(content), start+partBytes)]
	}
	return slices
}

func signedParts(storageURL string, content []byte, partBytes int) map[string]any {
	var parts []any
	for number, start := 1, 0; start < len(content); number, start = number+1, start+partBytes {
		parts = append(parts, signedPart(storageURL+"/parts/"+itoa(number), number, min(len(content), start+partBytes)-start))
	}
	return map[string]any{"parts": parts}
}

func itoa(value int) string {
	return strconv.Itoa(value)
}
