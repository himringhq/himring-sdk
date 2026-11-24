package himring

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
)

const (
	jsonContentType = "application/json"
	fileContentType = "application/octet-stream"
	requestIDHeader = "x-request-id"
)

type callResult struct {
	status    int
	header    http.Header
	body      []byte
	download  *Download
	requestID string
}

type preparedCall struct {
	operation *OperationDescription
	fields    map[string]any
	parts     requestParts
	timeout   time.Duration
}

func (call preparedCall) isUpload() bool {
	return call.parts.fileBody != nil
}

func seconds(duration time.Duration) string {
	return strconv.FormatFloat(duration.Seconds(), 'g', -1, 64)
}

func (c *Client) timeoutError(call preparedCall) *Error {
	if call.isUpload() {
		return newError(ErrorKindTimeout, fmt.Sprintf("The upload to the API at %s made no progress for %s seconds. Check the connection, then send the file again.", c.BaseURL(), seconds(call.timeout)))
	}
	return newError(ErrorKindTimeout, fmt.Sprintf("The API at %s did not respond within %s seconds. Try again, or raise the timeout.", c.BaseURL(), seconds(call.timeout)))
}

func (c *Client) networkError(cause error) *Error {
	problem := newError(ErrorKindNetwork, fmt.Sprintf("The client could not reach the API at %s. Check the address and that the API is running.", c.BaseURL()))
	problem.cause = cause
	return problem
}

func (c *Client) prepare(operation *OperationDescription, fields map[string]any, content any, options []RequestOption) (preparedCall, error) {
	settings, err := requestSettingsOf(c.timeout, options)
	if err != nil {
		return preparedCall{}, err
	}
	parts, err := requestPartsOf(operation, fields, content)
	if err != nil {
		return preparedCall{}, err
	}
	timeout := settings.timeout
	if parts.fileBody != nil {
		timeout = c.uploadIdleTimeout
	}
	return preparedCall{operation: operation, fields: fields, parts: parts, timeout: timeout}, nil
}

func (c *Client) newRequest(ctx context.Context, call preparedCall, file *sentFile) (*http.Request, error) {
	var body io.Reader
	length := int64(0)
	switch {
	case file != nil:
		body, length = file, file.body.sizeBytes
		if length == 0 {
			body = http.NoBody
		}
	case call.parts.jsonBody != nil:
		body, length = bytes.NewReader(call.parts.jsonBody), int64(len(call.parts.jsonBody))
	}
	request, err := http.NewRequestWithContext(ctx, call.operation.Method, c.urlOf(call.parts.path, call.parts.query), body)
	if err != nil {
		return nil, invalidInput("The client could not build a request URL from the input.", "")
	}
	for name, value := range c.headers {
		request.Header.Set(name, value)
	}
	request.Header.Set("accept", jsonContentType)
	if c.credential != "" {
		request.Header.Set("authorization", "Bearer "+c.credential)
	}
	switch {
	case file != nil:
		request.Header.Set("content-type", fileContentType)
		request.ContentLength = length
	case call.parts.jsonBody != nil:
		request.Header.Set("content-type", jsonContentType)
		request.ContentLength = length
	}
	return request, nil
}

func (c *Client) call(ctx context.Context, operation *OperationDescription, fields map[string]any, content any, options []RequestOption) (*callResult, error) {
	if ctx == nil {
		return nil, invalidInput("Pass a context to the call.", "")
	}
	call, err := c.prepare(operation, fields, content, options)
	if err != nil {
		return nil, err
	}
	if err := ctx.Err(); err != nil {
		return nil, context.Cause(ctx)
	}
	if operation.Response.Kind == ResponseKindDownload {
		return c.callDownload(ctx, call)
	}
	callContext, cancel := context.WithCancelCause(ctx)
	defer cancel(nil)
	var watch *idleWatch
	var file *sentFile
	if call.isUpload() {
		watch = newIdleWatch(call.timeout, cancel)
		file = &sentFile{
			body: call.parts.fileBody, progress: watch.touch, done: callContext.Done(),
			stopped: func() error { return context.Cause(callContext) },
		}
	} else {
		timer := time.AfterFunc(call.timeout, func() { cancel(errCallTimedOut) })
		defer timer.Stop()
	}
	if watch != nil {
		defer watch.stop()
	}
	if file != nil && file.body.sizeBytes == 0 {
		if _, err := file.Read(make([]byte, 1)); err != io.EOF {
			return nil, c.failureOf(callContext, ctx, call, file, err)
		}
	}
	request, err := c.newRequest(callContext, call, file)
	if err != nil {
		return nil, err
	}
	response, err := c.http.Do(request)
	if err != nil {
		return nil, c.failureOf(callContext, ctx, call, file, err)
	}
	var reader io.Reader = response.Body
	if watch != nil {
		watch.touch()
		reader = watchedBody{body: response.Body, watch: watch}
	}
	body, err := io.ReadAll(reader)
	response.Body.Close()
	if err != nil {
		return nil, c.failureOf(callContext, ctx, call, file, err)
	}
	result := &callResult{status: response.StatusCode, header: response.Header, body: body, requestID: response.Header.Get(requestIDHeader)}
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, refusalOf(result, operation.Path)
	}
	return result, nil
}

func (c *Client) failureOf(callContext context.Context, parent context.Context, call preparedCall, file *sentFile, cause error) error {
	if file != nil {
		if problem := file.failure(); problem != nil {
			return problem
		}
	}
	reason, fromCaller := failureCause(callContext, parent)
	if fromCaller {
		return reason
	}
	if reason != nil {
		problem := c.timeoutError(call)
		problem.cause = cause
		return problem
	}
	return c.networkError(cause)
}

func notJSON(result *callResult, operation *OperationDescription) *Error {
	return &Error{
		Kind:      ErrorKindInvalidResponse,
		Message:   fmt.Sprintf("The API answered %s with a body that is not JSON. Check that the address points at the Himring API.", operation.Path),
		Status:    result.status,
		RequestID: result.requestID,
	}
}

func decodedOutput(result *callResult, operation *OperationDescription, output any) error {
	if !json.Valid(result.body) {
		return notJSON(result, operation)
	}
	if err := json.Unmarshal(result.body, output); err != nil {
		return &Error{
			Kind:      ErrorKindInvalidResponse,
			Message:   fmt.Sprintf("The API answered %s with a body that does not match the documented shape. Check that the address points at the Himring API and that the SDK is up to date.", operation.Path),
			Details:   err.Error(),
			Status:    result.status,
			RequestID: result.requestID,
			cause:     err,
		}
	}
	return nil
}
