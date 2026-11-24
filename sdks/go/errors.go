package himring

import (
	"errors"
	"fmt"
	"strings"
)

type ErrorKind string

const (
	ErrorKindNetwork         ErrorKind = "network"
	ErrorKindTimeout         ErrorKind = "timeout"
	ErrorKindRefused         ErrorKind = "refused"
	ErrorKindInvalidResponse ErrorKind = "invalid_response"
	ErrorKindInvalidInput    ErrorKind = "invalid_input"
)

type Issue struct {
	Message string
	Path    []any
}

type MissingPermission struct {
	ResourceKind string
	Level        string
	ResourceID   *string
}

type Error struct {
	Kind              ErrorKind
	Message           string
	Status            int
	Code              string
	Details           string
	Issues            []Issue
	MissingPermission *MissingPermission
	RetryAfterSeconds *int64
	RequestID         string
	cause             error
}

func (e *Error) Error() string {
	return e.Message
}

func (e *Error) Unwrap() error {
	return e.cause
}

func (e *Error) IsDocumentedCode() bool {
	if e.Code == "" {
		return false
	}
	_, documented := errorStatuses[e.Code]
	return documented
}

func (e *Error) String() string {
	return fmt.Sprintf("himring.Error{Kind: %q, Status: %d, Code: %q, Message: %q, RequestID: %q}",
		e.Kind, e.Status, e.Code, e.Message, e.RequestID)
}

func DocumentedStatusOf(code string) (int, bool) {
	status, documented := errorStatuses[code]
	return status, documented
}

func DocumentedMessageOf(code string) (string, bool) {
	message, documented := errorMessages[code]
	return message, documented
}

func ErrorCodes() []string {
	return append([]string(nil), errorCodeList...)
}

func IsRefusal(err error, code string) bool {
	var apiError *Error
	return errors.As(err, &apiError) && apiError.Kind == ErrorKindRefused && apiError.Code == code
}

func AsError(err error) (*Error, bool) {
	var apiError *Error
	if errors.As(err, &apiError) {
		return apiError, true
	}
	return nil, false
}

func invalidInput(message string, field string) *Error {
	path := []any{}
	if field != "" {
		path = []any{field}
	}
	return &Error{Kind: ErrorKindInvalidInput, Message: message, Issues: []Issue{{Message: message, Path: path}}}
}

func newError(kind ErrorKind, message string) *Error {
	return &Error{Kind: kind, Message: message}
}

func issuePlace(path []any) string {
	parts := make([]string, 0, len(path))
	for _, part := range path {
		parts = append(parts, fmt.Sprint(part))
	}
	return strings.Join(parts, ".")
}

func DescribeError(err error) string {
	if err == nil {
		return ""
	}
	apiError, isAPIError := AsError(err)
	if !isAPIError {
		return err.Error()
	}
	parts := []string{apiError.Message}
	if apiError.Details != "" {
		parts = append(parts, apiError.Details)
	}
	if missing := apiError.MissingPermission; missing != nil {
		place := missing.ResourceKind
		if missing.ResourceID != nil {
			place = missing.ResourceKind + " " + *missing.ResourceID
		}
		parts = append(parts, fmt.Sprintf("missing_permission: %s on %s.", missing.Level, place))
	}
	for _, issue := range apiError.Issues {
		sentence := issue.Message
		if len(issue.Path) > 0 {
			sentence = issuePlace(issue.Path) + ": " + issue.Message
		}
		if sentence != apiError.Message {
			parts = append(parts, sentence)
		}
	}
	return strings.Join(parts, " ")
}
