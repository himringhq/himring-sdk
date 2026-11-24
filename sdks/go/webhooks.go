package himring

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
)

type MemoryWebhookRejection string

const (
	MemoryWebhookSignatureMissing          MemoryWebhookRejection = "signature_missing"
	MemoryWebhookSignatureInvalid          MemoryWebhookRejection = "signature_invalid"
	MemoryWebhookTimestampOutsideTolerance MemoryWebhookRejection = "timestamp_outside_tolerance"
	MemoryWebhookEventInvalid              MemoryWebhookRejection = "event_invalid"
)

const (
	MemoryWebhookSignatureHeader       = "himring-signature"
	MemoryWebhookEventIDHeader         = "himring-event-id"
	DefaultMemoryWebhookTolerance      = 300 * time.Second
	memoryWebhookSignatureVersion      = "v1"
	memoryWebhookSignatureHeaderLength = 4096
)

var (
	memoryWebhookRejections = []MemoryWebhookRejection{
		MemoryWebhookSignatureMissing, MemoryWebhookSignatureInvalid, MemoryWebhookTimestampOutsideTolerance, MemoryWebhookEventInvalid,
	}
	hexDigestPattern   = regexp.MustCompile(`^[0-9a-f]{64}$`)
	unixSecondsPattern = regexp.MustCompile(`^[0-9]{1,12}$`)
)

func MemoryWebhookRejections() []MemoryWebhookRejection {
	return append([]MemoryWebhookRejection(nil), memoryWebhookRejections...)
}

type MemoryWebhook struct {
	Body      []byte
	Signature string
	Secret    string
	Tolerance time.Duration
	Now       time.Time
}

type MemoryWebhookEvent struct {
	ID        string         `json:"id"`
	Type      string         `json:"type"`
	CreatedAt string         `json:"created_at"`
	ProjectID string         `json:"project_id"`
	MemoryID  string         `json:"memory_id"`
	Decision  map[string]any `json:"decision"`
}

type MemoryWebhookRejected struct {
	Reason  MemoryWebhookRejection
	Message string
}

func (rejection *MemoryWebhookRejected) Error() string {
	return rejection.Message
}

func rejected(reason MemoryWebhookRejection, message string) *MemoryWebhookRejected {
	return &MemoryWebhookRejected{Reason: reason, Message: message}
}

func signedPartsOf(header string) (int64, [][]byte, bool) {
	if len(header) > memoryWebhookSignatureHeaderLength {
		return 0, nil, false
	}
	timestamp := int64(-1)
	var digests [][]byte
	for _, part := range strings.Split(header, ",") {
		key, value, found := strings.Cut(part, "=")
		key, value = strings.TrimSpace(key), strings.TrimSpace(value)
		if !found || key == "" {
			continue
		}
		switch {
		case key == "t":
			if timestamp >= 0 || !unixSecondsPattern.MatchString(value) {
				return 0, nil, false
			}
			parsed, err := strconv.ParseInt(value, 10, 64)
			if err != nil {
				return 0, nil, false
			}
			timestamp = parsed
		case key == memoryWebhookSignatureVersion && hexDigestPattern.MatchString(value):
			digest, err := hex.DecodeString(value)
			if err != nil {
				return 0, nil, false
			}
			digests = append(digests, digest)
		}
	}
	if timestamp < 0 || len(digests) == 0 {
		return 0, nil, false
	}
	return timestamp, digests, true
}

func signedByHimring(timestamp int64, digests [][]byte, body []byte, secret string) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strconv.FormatInt(timestamp, 10) + "."))
	mac.Write(body)
	expected := mac.Sum(nil)
	matched := false
	for _, digest := range digests {
		matched = hmac.Equal(expected, digest) || matched
	}
	return matched
}

func nonEmptyText(fields map[string]any, name string) bool {
	text, isText := fields[name].(string)
	return isText && text != ""
}

func isText(fields map[string]any, name string) bool {
	_, matches := fields[name].(string)
	return matches
}

func parsedMemoryWebhookEvent(body []byte) (*MemoryWebhookEvent, error) {
	if !utf8.Valid(body) {
		return nil, rejected(MemoryWebhookEventInvalid, "The body is not UTF-8 text.")
	}
	var value any
	if err := json.Unmarshal(body, &value); err != nil {
		return nil, rejected(MemoryWebhookEventInvalid, "The body is not JSON.")
	}
	event, isObject := value.(map[string]any)
	decision, decisionIsObject := event["decision"].(map[string]any)
	wellShaped := isObject && decisionIsObject && nonEmptyText(event, "id") && nonEmptyText(event, "type") &&
		isText(event, "created_at") && isText(event, "project_id") && isText(event, "memory_id") &&
		isText(decision, "id") && isText(decision, "memory_id") && isText(decision, "kind")
	if !wellShaped {
		return nil, rejected(MemoryWebhookEventInvalid, "The body is not a Memory webhook event.")
	}
	return &MemoryWebhookEvent{
		ID:        event["id"].(string),
		Type:      event["type"].(string),
		CreatedAt: event["created_at"].(string),
		ProjectID: event["project_id"].(string),
		MemoryID:  event["memory_id"].(string),
		Decision:  decision,
	}, nil
}

func VerifyMemoryWebhook(received MemoryWebhook) (*MemoryWebhookEvent, error) {
	tolerance := received.Tolerance
	if tolerance == 0 {
		tolerance = DefaultMemoryWebhookTolerance
	}
	if tolerance < 0 {
		return nil, errors.New("set the tolerance to a duration above zero")
	}
	if received.Secret == "" {
		return nil, errors.New("pass the signing secret of the webhook")
	}
	if strings.TrimSpace(received.Signature) == "" {
		return nil, rejected(MemoryWebhookSignatureMissing, "The request carries no himring-signature header.")
	}
	timestamp, digests, parsed := signedPartsOf(received.Signature)
	if !parsed || !signedByHimring(timestamp, digests, received.Body, received.Secret) {
		return nil, rejected(MemoryWebhookSignatureInvalid, "The signature does not match the body and the secret.")
	}
	now := received.Now
	if now.IsZero() {
		now = time.Now()
	}
	distance := math.Abs(float64(now.Unix() - timestamp))
	if distance > tolerance.Seconds() {
		return nil, rejected(MemoryWebhookTimestampOutsideTolerance,
			fmt.Sprintf("Himring signed the request more than %s seconds away from now.", seconds(tolerance)))
	}
	return parsedMemoryWebhookEvent(received.Body)
}
