package tests

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

var (
	specWordSeparator = regexp.MustCompile(`[^A-Za-z0-9]+`)
	specInitialisms   = map[string]string{
		"api": "API", "csv": "CSV", "html": "HTML", "http": "HTTP", "https": "HTTPS", "id": "ID", "ids": "IDs", "ip": "IP",
		"json": "JSON", "pdf": "PDF", "sha256": "SHA256", "sql": "SQL", "uri": "URI", "url": "URL", "urls": "URLs",
		"uuid": "UUID", "mfa": "MFA", "ttl": "TTL",
	}
)

func readSpec(t testing.TB, file string) []byte {
	t.Helper()
	data, err := os.ReadFile(filepath.Join("..", "..", "..", "spec", file))
	if err != nil {
		t.Fatal(err)
	}
	return data
}

func goName(operationID string) string {
	var builder strings.Builder
	for _, word := range specWordSeparator.Split(operationID, -1) {
		if word == "" {
			continue
		}
		if initialism, known := specInitialisms[word]; known {
			builder.WriteString(initialism)
		} else {
			builder.WriteString(strings.ToUpper(word[:1]) + word[1:])
		}
	}
	return builder.String()
}
