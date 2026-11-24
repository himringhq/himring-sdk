package himring

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"sync"
)

const (
	digestWindowBytes = 8 * 1024 * 1024
	streamChunkBytes  = 1024 * 1024
)

type UploadSource interface {
	io.ReaderAt
	Size() int64
}

func FileUploadSource(file *os.File) (UploadSource, error) {
	if file == nil {
		return nil, invalidInput("Send a file that the client can read, not nil.", "content")
	}
	base, err := file.Seek(0, io.SeekCurrent)
	if err != nil {
		return nil, measuringFailure(err)
	}
	info, err := file.Stat()
	if err != nil {
		return nil, measuringFailure(err)
	}
	return io.NewSectionReader(file, base, max(0, info.Size()-base)), nil
}

func measuringFailure(cause error) *Error {
	problem := invalidInput("The client could not measure the file.", "content")
	problem.cause = cause
	return problem
}

type lockedSource struct {
	mutex     sync.Mutex
	source    UploadSource
	sizeBytes int64
}

func lockedSourceOf(source UploadSource) (*lockedSource, error) {
	if source == nil || isNilValue(source) {
		return nil, invalidInput("Send the file under Content, as an upload source such as a bytes.Reader or FileUploadSource.", "content")
	}
	size := source.Size()
	if size < 0 {
		return nil, invalidInput("Give the upload source a size of zero or more.", "content")
	}
	if size > uploadSizeMaximum {
		return nil, invalidInput(fmt.Sprintf("Send a file of at most %d bytes.", uploadSizeMaximum), "content")
	}
	return &lockedSource{source: source, sizeBytes: size}, nil
}

func changedWhileRead() *Error {
	return invalidInput("The file changed size while the client read it. Send it again once nothing writes to it.", "content")
}

func (source *lockedSource) readInto(buffer []byte, start int64) error {
	source.mutex.Lock()
	count, err := source.source.ReadAt(buffer, start)
	source.mutex.Unlock()
	if count < 0 || count > len(buffer) {
		return invalidInput("The upload source returned an impossible byte count.", "content")
	}
	if count == len(buffer) {
		return nil
	}
	if err == nil || errors.Is(err, io.EOF) {
		return changedWhileRead()
	}
	problem := invalidInput("The client could not read the file.", "content")
	problem.cause = err
	problem.Details = err.Error()
	return problem
}

func (source *lockedSource) read(start int64, end int64) ([]byte, error) {
	buffer := make([]byte, end-start)
	if err := source.readInto(buffer, start); err != nil {
		return nil, err
	}
	return buffer, nil
}

func (source *lockedSource) contentSHA256(ctx context.Context) (string, error) {
	digest := sha256.New()
	buffer := make([]byte, min(digestWindowBytes, max(source.sizeBytes, 1)))
	for start := int64(0); start < source.sizeBytes; start += digestWindowBytes {
		if err := ctx.Err(); err != nil {
			return "", context.Cause(ctx)
		}
		window := buffer[:min(digestWindowBytes, source.sizeBytes-start)]
		if err := source.readInto(window, start); err != nil {
			return "", err
		}
		digest.Write(window)
	}
	return hex.EncodeToString(digest.Sum(nil)), nil
}

type windowReader struct {
	source  *lockedSource
	offset  int64
	end     int64
	mutex   sync.Mutex
	problem error
}

func (reader *windowReader) Read(buffer []byte) (int, error) {
	if reader.offset >= reader.end {
		return 0, io.EOF
	}
	window := buffer[:min(int64(len(buffer)), reader.end-reader.offset, streamChunkBytes)]
	if err := reader.source.readInto(window, reader.offset); err != nil {
		reader.mutex.Lock()
		reader.problem = err
		reader.mutex.Unlock()
		return 0, err
	}
	reader.offset += int64(len(window))
	return len(window), nil
}

func (reader *windowReader) failure() error {
	reader.mutex.Lock()
	defer reader.mutex.Unlock()
	return reader.problem
}

func checkedSHA256(value string) error {
	if value != "" && !sha256HexPattern.MatchString(value) {
		return invalidInput("Send ContentSHA256 as 64 lowercase hexadecimal characters.", "content_sha256")
	}
	return nil
}
