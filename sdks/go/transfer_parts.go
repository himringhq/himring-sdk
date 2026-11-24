package himring

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"io"
	"strconv"
	"sync"
	"sync/atomic"
)

var errUploadStopped = errors.New("another part of the upload failed")

type partSender struct {
	client     *Client
	ids        uploadIDs
	source     *lockedSource
	onProgress func(int64) error
}

type partResult struct {
	sentBytes int64
	err       error
}

func formatWhole(value int64) string {
	return strconv.FormatInt(value, 10)
}

func (sender partSender) sendSingle(ctx context.Context, sha256 string, first *signedPart) error {
	size := sender.source.sizeBytes
	resign := func() (signedPart, error) {
		part, err := sender.ids.sign(ctx, 1, sha256)
		if err != nil {
			return signedPart{}, err
		}
		return checkedSignedPart(part, 1, size)
	}
	var signed signedPart
	var err error
	if first != nil {
		signed, err = checkedSignedPart(*first, 1, size)
	} else {
		signed, err = resign()
	}
	if err != nil {
		return err
	}
	body := func() (io.Reader, func() error) {
		reader := &windowReader{source: sender.source, end: size}
		return reader, reader.failure
	}
	if err := sender.sendPart(ctx, signed, resign, body, size); err != nil {
		return err
	}
	if sender.onProgress != nil {
		return sender.onProgress(size)
	}
	return nil
}

func (sender partSender) sendNumbered(ctx context.Context, partNumber int64, partBytes int64) (int64, error) {
	start := (partNumber - 1) * partBytes
	data, err := sender.source.read(start, min(sender.source.sizeBytes, start+partBytes))
	if err != nil {
		return 0, err
	}
	digest := sha256.Sum256(data)
	sha := hex.EncodeToString(digest[:])
	size := int64(len(data))
	resign := func() (signedPart, error) {
		part, err := sender.ids.sign(ctx, partNumber, sha)
		if err != nil {
			return signedPart{}, err
		}
		return checkedSignedPart(part, partNumber, size)
	}
	signed, err := resign()
	if err != nil {
		return 0, err
	}
	body := func() (io.Reader, func() error) {
		return bytes.NewReader(data), func() error { return nil }
	}
	if err := sender.sendPart(ctx, signed, resign, body, size); err != nil {
		return 0, err
	}
	return size, nil
}

func (sender partSender) sendMultipart(ctx context.Context, partBytes int64, partCount int64) error {
	laneContext, cancel := context.WithCancelCause(ctx)
	results := make(chan partResult)
	var next atomic.Int64
	var lanes sync.WaitGroup
	for range min(int64(partsInFlight), partCount) {
		lanes.Add(1)
		go func() {
			defer lanes.Done()
			for {
				partNumber := next.Add(1)
				if partNumber > partCount || laneContext.Err() != nil {
					return
				}
				sent, err := sender.sendNumbered(laneContext, partNumber, partBytes)
				results <- partResult{sentBytes: sent, err: err}
				if err != nil {
					return
				}
			}
		}()
	}
	go func() {
		lanes.Wait()
		close(results)
	}()
	defer func() {
		cancel(errUploadStopped)
		for range results {
		}
	}()
	var failure error
	for result := range results {
		if result.err != nil {
			if failure == nil {
				failure = result.err
				cancel(errUploadStopped)
			}
			continue
		}
		if failure == nil && sender.onProgress != nil {
			if err := sender.onProgress(result.sentBytes); err != nil {
				failure = err
				cancel(errUploadStopped)
			}
		}
	}
	if failure != nil && ctx.Err() != nil {
		return context.Cause(ctx)
	}
	return failure
}

func (sender partSender) sendPart(ctx context.Context, first signedPart, resign func() (signedPart, error), body func() (io.Reader, func() error), size int64) error {
	signed := first
	for attempt := 1; ; attempt++ {
		answer, err := sender.client.putToStorage(ctx, storagePut{part: signed, body: body, sizeBytes: size})
		if err != nil {
			if attempt >= sendAttempts || ctx.Err() != nil || !isUnreachable(err) {
				return err
			}
			wait, _ := backoff(attempt, nil)
			if err := pause(ctx, wait); err != nil {
				return err
			}
			if signed, err = resign(); err != nil {
				return err
			}
			continue
		}
		if answer.status >= 200 && answer.status < 300 {
			return nil
		}
		wait, retryable := retryWait(answer, attempt)
		if attempt >= sendAttempts || !retryable {
			partNumber, _ := wholeNumber(signed.PartNumber)
			return storageRefusal(answer.status, partNumber)
		}
		if err := pause(ctx, wait); err != nil {
			return err
		}
		if signed, err = resign(); err != nil {
			return err
		}
	}
}
