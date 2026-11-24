package himring

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

type Download struct {
	Status        int
	FileName      string
	ContentType   string
	ContentLength int64
	ContentRange  string
	AcceptRanges  string
	EntityTag     string
	body          io.ReadCloser
	source        string
	callContext   context.Context
	parent        context.Context
	release       func()
	closeOnce     sync.Once
}

func (download *Download) String() string {
	return fmt.Sprintf("himring.Download{FileName: %q, ContentType: %q}", download.FileName, download.ContentType)
}

func (download *Download) Read(buffer []byte) (int, error) {
	if download.body == nil {
		return 0, io.EOF
	}
	count, err := download.body.Read(buffer)
	if err == nil {
		return count, nil
	}
	if errors.Is(err, io.EOF) {
		download.Close()
		return count, io.EOF
	}
	reason, fromCaller := failureCause(download.callContext, download.parent)
	download.Close()
	if fromCaller {
		return count, reason
	}
	if reason != nil {
		problem := newError(ErrorKindTimeout, fmt.Sprintf("%s stopped sending the file. Try the download again.", download.source))
		problem.cause = err
		return count, problem
	}
	problem := newError(ErrorKindNetwork, fmt.Sprintf("The connection to %s broke during the download. Try again.", download.source))
	problem.cause = err
	return count, problem
}

func (download *Download) Close() error {
	var err error
	download.closeOnce.Do(func() {
		if download.body != nil {
			err = download.body.Close()
		}
		if download.release != nil {
			download.release()
		}
	})
	return err
}

type downloadStart struct {
	response *http.Response
	body     io.ReadCloser
	call     context.Context
	release  func()
}

func startDownload(ctx context.Context, idle time.Duration, client *http.Client, build func(context.Context) (*http.Request, error)) (*downloadStart, error) {
	callContext, cancel := context.WithCancelCause(ctx)
	watch := newIdleWatch(idle, cancel)
	release := func() {
		watch.stop()
		cancel(nil)
	}
	request, err := build(callContext)
	if err != nil {
		release()
		return nil, err
	}
	response, err := client.Do(request)
	if err != nil {
		return &downloadStart{call: callContext, release: release}, err
	}
	watch.touch()
	return &downloadStart{
		response: response,
		body:     readCloser{Reader: watchedBody{body: response.Body, watch: watch}, Closer: response.Body},
		call:     callContext,
		release:  release,
	}, nil
}

type readCloser struct {
	io.Reader
	io.Closer
}

func (c *Client) callDownload(ctx context.Context, call preparedCall) (*callResult, error) {
	started, err := startDownload(ctx, call.timeout, c.http, func(callContext context.Context) (*http.Request, error) {
		return c.newRequest(callContext, call, nil)
	})
	if started == nil {
		return nil, err
	}
	if err != nil {
		failure := c.failureOf(started.call, ctx, call, nil, err)
		started.release()
		return nil, failure
	}
	response := started.response
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		body, readErr := io.ReadAll(started.body)
		started.body.Close()
		failure := c.failureOf(started.call, ctx, call, nil, readErr)
		started.release()
		if readErr != nil {
			return nil, failure
		}
		result := &callResult{status: response.StatusCode, header: response.Header, body: body, requestID: response.Header.Get(requestIDHeader)}
		return nil, refusalOf(result, call.operation.Path)
	}
	download := &Download{
		Status:        response.StatusCode,
		FileName:      fileNameOf(response.Header, downloadNameOf(call.fields, call.operation)),
		ContentType:   headerOr(response.Header, "content-type", assumedContentTypeOf(call.operation)),
		ContentLength: contentLengthOf(response.Header),
		ContentRange:  response.Header.Get("content-range"),
		AcceptRanges:  response.Header.Get("accept-ranges"),
		EntityTag:     response.Header.Get("etag"),
		body:          started.body,
		source:        "the API",
		callContext:   started.call,
		parent:        ctx,
		release:       started.release,
	}
	return &callResult{status: response.StatusCode, header: response.Header, download: download}, nil
}

func headerOr(header http.Header, name string, fallback string) string {
	if values := header.Values(name); len(values) > 0 {
		return values[0]
	}
	return fallback
}
