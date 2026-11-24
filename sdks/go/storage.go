package himring

import (
	"context"
	"fmt"
	"io"
	"math/rand/v2"
	"net/http"
	"net/url"
	"regexp"
	"time"
)

const (
	firstBackoff              = time.Second
	longestBackoff            = 30 * time.Second
	longestRetryAfterSeconds  = 120
	minimumSendBytesPerSecond = 64 * 1024
	httpOK                    = 200
	httpPartialContent        = 206
	httpForbidden             = 403
)

var byteRangePattern = regexp.MustCompile(`^bytes=[0-9]*-[0-9]*(,\s*[0-9]*-[0-9]*)*$`)

func backoff(attempt int, retryAfterSeconds *int64) (time.Duration, bool) {
	if retryAfterSeconds != nil {
		if *retryAfterSeconds > longestRetryAfterSeconds {
			return 0, false
		}
		return time.Duration(*retryAfterSeconds)*time.Second + rand.N(firstBackoff), true
	}
	ceiling := longestBackoff
	if shift := attempt - 1; shift < 5 {
		ceiling = min(longestBackoff, firstBackoff<<shift)
	}
	return ceiling/2 + rand.N(ceiling/2+1), true
}

func pause(ctx context.Context, wait time.Duration) error {
	if wait <= 0 {
		if ctx.Err() != nil {
			return context.Cause(ctx)
		}
		return nil
	}
	timer := time.NewTimer(wait)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return context.Cause(ctx)
	case <-timer.C:
		return nil
	}
}

func storageURLOf(address string) (string, error) {
	parsed, err := url.Parse(address)
	if err != nil {
		return "", newError(ErrorKindInvalidResponse, "The API signed a storage link that is not a URL.")
	}
	if (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Hostname() == "" {
		return "", newError(ErrorKindInvalidResponse, fmt.Sprintf("The API signed a storage link with the scheme %s:.", parsed.Scheme))
	}
	return parsed.String(), nil
}

func sendTimeoutOf(idle time.Duration, sizeBytes int64) time.Duration {
	return idle + time.Duration((sizeBytes+minimumSendBytesPerSecond-1)/minimumSendBytesPerSecond)*time.Second
}

type storageAnswer struct {
	status            int
	retryAfterSeconds *int64
}

type storagePut struct {
	part      signedPart
	body      func() (io.Reader, func() error)
	sizeBytes int64
}

func (c *Client) putToStorage(ctx context.Context, put storagePut) (storageAnswer, error) {
	address, err := storageURLOf(put.part.URL)
	if err != nil {
		return storageAnswer{}, err
	}
	timeout := sendTimeoutOf(c.uploadIdleTimeout, put.sizeBytes)
	callContext, cancel := context.WithTimeoutCause(ctx, timeout, errCallTimedOut)
	defer cancel()
	body, bodyFailure := put.body()
	request, err := http.NewRequestWithContext(callContext, http.MethodPut, address, body)
	if err != nil {
		return storageAnswer{}, newError(ErrorKindInvalidResponse, "The API signed a storage link that is not a URL.")
	}
	for name, value := range put.part.Headers {
		request.Header.Set(name, value)
	}
	request.ContentLength = put.sizeBytes
	if put.sizeBytes == 0 {
		request.Body = http.NoBody
	}
	response, err := c.http.Do(request)
	if err != nil {
		if problem := bodyFailure(); problem != nil {
			return storageAnswer{}, problem
		}
		reason, fromCaller := failureCause(callContext, ctx)
		if fromCaller {
			return storageAnswer{}, reason
		}
		if reason != nil {
			problem := newError(ErrorKindTimeout, fmt.Sprintf("Storage took more than %s seconds to take %d bytes. Check the connection, then send the file again.", seconds(timeout), put.sizeBytes))
			problem.cause = err
			return storageAnswer{}, problem
		}
		problem := newError(ErrorKindNetwork, "The client could not reach storage to send the file. Check the connection, then send the file again.")
		problem.cause = err
		return storageAnswer{}, problem
	}
	io.Copy(io.Discard, io.LimitReader(response.Body, streamChunkBytes))
	response.Body.Close()
	return storageAnswer{status: response.StatusCode, retryAfterSeconds: retryAfterSecondsOf(response.Header.Get("retry-after"), time.Now())}, nil
}

func storageRefusal(status int, partNumber int64) *Error {
	problem := newError(ErrorKindRefused, fmt.Sprintf("Storage refused part %d of the file with status %d. Check that nothing changed the file while it was sent, then send it again.", partNumber, status))
	problem.Status = status
	return problem
}

func retryWait(answer storageAnswer, attempt int) (time.Duration, bool) {
	if !resignedStatuses[answer.status] {
		return 0, false
	}
	if answer.status == httpForbidden {
		return 0, true
	}
	return backoff(attempt, answer.retryAfterSeconds)
}

func (c *Client) getFromStorage(ctx context.Context, address string, header http.Header) (*downloadStart, error) {
	target, err := storageURLOf(address)
	if err != nil {
		return nil, err
	}
	started, err := startDownload(ctx, c.timeout, c.http, func(callContext context.Context) (*http.Request, error) {
		request, err := http.NewRequestWithContext(callContext, http.MethodGet, target, nil)
		if err != nil {
			return nil, newError(ErrorKindInvalidResponse, "The API signed a storage link that is not a URL.")
		}
		request.Header = header
		return request, nil
	})
	if started == nil || err == nil {
		return started, err
	}
	reason, fromCaller := failureCause(started.call, ctx)
	started.release()
	if fromCaller {
		return nil, reason
	}
	if reason != nil {
		problem := newError(ErrorKindTimeout, "Storage did not answer in time to download the file. Try again.")
		problem.cause = err
		return nil, problem
	}
	problem := newError(ErrorKindNetwork, "The client could not reach storage to download the file. Check the connection, then try again.")
	problem.cause = err
	return nil, problem
}
