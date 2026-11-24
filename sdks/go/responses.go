package himring

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"
	"unicode/utf8"

	"golang.org/x/text/unicode/norm"
)

const (
	octetStreamContentType = "application/octet-stream"
	safeNameMaximumLength  = 200
)

var (
	fileNamePattern            = regexp.MustCompile(`filename="([^"]+)"`)
	encodedFileNamePattern     = regexp.MustCompile(`(?i)filename\*=UTF-8''([^;\s]+)`)
	brokenPercentEscapePattern = regexp.MustCompile(`%([^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|[0-9A-Fa-f]?$)`)
	digitsPattern              = regexp.MustCompile(`^[0-9]+$`)
	unsafeNameCharacters       = regexp.MustCompile(`[^A-Za-z0-9._-]+`)
	leadingPunctuation         = regexp.MustCompile(`^[._-]+`)
	downloadIDFields           = []string{"index_id", "file_id", "memory_id", "table_name"}
	alternativeDateLayouts     = []string{time.RFC1123Z, time.RFC822Z, "Mon, 2 Jan 2006 15:04:05 -0700", "Mon, 2 Jan 2006 15:04:05 MST"}
)

func textField(fields map[string]any, key string) (string, bool, bool) {
	value, present := fields[key]
	if !present {
		return "", false, true
	}
	text, isText := value.(string)
	return text, true, isText
}

func issuesOf(value any) ([]Issue, bool) {
	list, isList := value.([]any)
	if !isList {
		return nil, false
	}
	issues := make([]Issue, 0, len(list))
	for _, raw := range list {
		entry, isObject := raw.(map[string]any)
		if !isObject {
			return nil, false
		}
		message, isText := entry["message"].(string)
		path, isPath := entry["path"].([]any)
		if !isText || !isPath {
			return nil, false
		}
		parts := make([]any, 0, len(path))
		for _, part := range path {
			switch typed := part.(type) {
			case string:
				parts = append(parts, typed)
			case json.Number:
				if whole, err := typed.Int64(); err == nil {
					parts = append(parts, whole)
				} else if fraction, err := typed.Float64(); err == nil {
					parts = append(parts, fraction)
				} else {
					return nil, false
				}
			default:
				return nil, false
			}
		}
		issues = append(issues, Issue{Message: message, Path: parts})
	}
	return issues, true
}

func missingPermissionOf(value any) (*MissingPermission, bool) {
	entry, isObject := value.(map[string]any)
	if !isObject {
		return nil, false
	}
	kind, kindIsText := entry["resource_kind"].(string)
	level, levelIsText := entry["level"].(string)
	resourceID, present := entry["resource_id"]
	if !kindIsText || !levelIsText || !present {
		return nil, false
	}
	permission := &MissingPermission{ResourceKind: kind, Level: level}
	if resourceID == nil {
		return permission, true
	}
	text, isText := resourceID.(string)
	if !isText {
		return nil, false
	}
	permission.ResourceID = &text
	return permission, true
}

func retryAfterSecondsOf(header string, now time.Time) *int64 {
	if header == "" {
		return nil
	}
	text := strings.TrimSpace(header)
	if digitsPattern.MatchString(text) {
		value, err := strconv.ParseInt(text, 10, 64)
		if err != nil && !errors.Is(err, strconv.ErrRange) {
			return nil
		}
		return &value
	}
	moment, err := http.ParseTime(text)
	if err != nil {
		moment, err = alternativeDate(text)
		if err != nil {
			return nil
		}
	}
	wait := max(0, int64(math.Ceil(moment.Sub(now).Seconds())))
	return &wait
}

func alternativeDate(text string) (time.Time, error) {
	var lastErr error
	for _, layout := range alternativeDateLayouts {
		moment, err := time.Parse(layout, text)
		if err == nil {
			return moment, nil
		}
		lastErr = err
	}
	return time.Time{}, lastErr
}

func decodedJSON(body []byte) (any, bool) {
	if !json.Valid(body) {
		return nil, false
	}
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.UseNumber()
	var value any
	if err := decoder.Decode(&value); err != nil {
		return nil, false
	}
	return value, true
}

func refusalOf(result *callResult, path string) *Error {
	shapeless := &Error{
		Kind:      ErrorKindInvalidResponse,
		Message:   fmt.Sprintf("The API answered %s with status %d and no error envelope. Check that the address points at the Himring API.", path, result.status),
		Status:    result.status,
		RequestID: result.requestID,
	}
	envelope, parsed := decodedJSON(result.body)
	record, isObject := envelope.(map[string]any)
	if !parsed || !isObject {
		return shapeless
	}
	fields, isObject := record["error"].(map[string]any)
	if !isObject {
		return shapeless
	}
	code, codeIsText := fields["code"].(string)
	message, messageIsText := fields["message"].(string)
	details, _, detailsOK := textField(fields, "details")
	requestID, hasRequestID, requestIDOK := textField(fields, "request_id")
	issues := []Issue{}
	issuesOK := true
	if raw, present := fields["issues"]; present {
		issues, issuesOK = issuesOf(raw)
	}
	var missing *MissingPermission
	missingOK := true
	if raw, present := fields["missing_permission"]; present {
		missing, missingOK = missingPermissionOf(raw)
	}
	if !codeIsText || !messageIsText || !detailsOK || !requestIDOK || !issuesOK || !missingOK {
		return shapeless
	}
	if !hasRequestID {
		requestID = result.requestID
	}
	return &Error{
		Kind:              ErrorKindRefused,
		Message:           message,
		Status:            result.status,
		Code:              code,
		Details:           details,
		Issues:            issues,
		MissingPermission: missing,
		RetryAfterSeconds: retryAfterSecondsOf(result.header.Get("retry-after"), time.Now()),
		RequestID:         requestID,
	}
}

func decodedFileName(encoded string) (string, bool) {
	if brokenPercentEscapePattern.MatchString(encoded) {
		return "", false
	}
	var decoded []byte
	for index := 0; index < len(encoded); index++ {
		if encoded[index] == '%' && index+2 < len(encoded) {
			value, err := strconv.ParseUint(encoded[index+1:index+3], 16, 8)
			if err != nil {
				return "", false
			}
			decoded = append(decoded, byte(value))
			index += 2
			continue
		}
		decoded = append(decoded, encoded[index])
	}
	if !utf8.Valid(decoded) {
		return "", false
	}
	return string(decoded), true
}

func fileNameOf(header http.Header, fallback string) string {
	disposition := header.Get("content-disposition")
	if found := encodedFileNamePattern.FindStringSubmatch(disposition); found != nil {
		if decoded, valid := decodedFileName(found[1]); valid {
			return decoded
		}
	}
	if found := fileNamePattern.FindStringSubmatch(disposition); found != nil {
		return found[1]
	}
	return fallback
}

func downloadNameOf(fields map[string]any, operation *OperationDescription) string {
	extension := operation.Response.FileExtension
	for _, field := range downloadIDFields {
		if value, isText := fields[field].(string); isText && value != "" {
			return value + extension
		}
	}
	return "download" + extension
}

func assumedContentTypeOf(operation *OperationDescription) string {
	if len(operation.Response.ContentTypes) == 1 {
		return operation.Response.ContentTypes[0]
	}
	return octetStreamContentType
}

func contentLengthOf(header http.Header) int64 {
	value := header.Get("content-length")
	if !digitsPattern.MatchString(value) {
		return -1
	}
	length, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return -1
	}
	return length
}

func SafeDownloadName(name string, fallback string) string {
	segments := strings.FieldsFunc(name, func(character rune) bool { return character == '/' || character == '\\' })
	lastSegment := ""
	if len(segments) > 0 && !strings.HasSuffix(name, "/") && !strings.HasSuffix(name, "\\") {
		lastSegment = segments[len(segments)-1]
	}
	var withoutMarks strings.Builder
	for _, character := range norm.NFKD.String(lastSegment) {
		if !unicode.Is(unicode.M, character) {
			withoutMarks.WriteRune(character)
		}
	}
	safe := unsafeNameCharacters.ReplaceAllString(withoutMarks.String(), "_")
	safe = leadingPunctuation.ReplaceAllString(safe, "")
	if length := utf8.RuneCountInString(safe); length > safeNameMaximumLength {
		safe = string([]rune(safe)[length-safeNameMaximumLength:])
	}
	if safe == "" {
		return fallback
	}
	return safe
}
