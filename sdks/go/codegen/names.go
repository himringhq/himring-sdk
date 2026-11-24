package main

import (
	"regexp"
	"strings"
	"unicode"
)

var (
	wordSeparatorPattern = regexp.MustCompile(`[^A-Za-z0-9]+`)
	goInitialisms        = map[string]string{
		"api": "API", "csv": "CSV", "html": "HTML", "http": "HTTP", "https": "HTTPS", "id": "ID",
		"ids": "IDs", "ip": "IP", "json": "JSON", "pdf": "PDF", "sha256": "SHA256", "sql": "SQL",
		"uri": "URI", "url": "URL", "urls": "URLs", "uuid": "UUID", "mfa": "MFA", "ttl": "TTL",
	}
	handWrittenMethods = map[string]bool{"AddFile": true, "DownloadFile": true, "Invoke": true, "BaseURL": true, "String": true, "GoString": true}
)

func goNameOf(text string) string {
	var builder strings.Builder
	for _, part := range wordSeparatorPattern.Split(text, -1) {
		if part == "" {
			continue
		}
		if initialism, known := goInitialisms[strings.ToLower(part)]; known {
			builder.WriteString(initialism)
			continue
		}
		builder.WriteString(strings.ToUpper(part[:1]) + part[1:])
	}
	return builder.String()
}

func exportedFieldName(field string, place string) (string, error) {
	name := goNameOf(field)
	if name == "" || !unicode.IsLetter(rune(name[0])) {
		return "", failf("%s takes the field %s, which cannot be a Go field name.", place, field)
	}
	return name, nil
}

func inputTypeNameOf(operationID string) string {
	return goNameOf(operationID) + "Input"
}

func outputTypeNameOf(operationID string) string {
	return goNameOf(operationID) + "Output"
}

func unexportedNameOf(name string) string {
	return strings.ToLower(name[:1]) + name[1:]
}
