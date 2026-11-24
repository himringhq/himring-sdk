package himring

import (
	"errors"
	"fmt"
	"io"
	"net/url"
	"reflect"
	"sync"
)

type FileContent = io.Reader

type fileBody struct {
	operationID  string
	reader       io.Reader
	sizeBytes    int64
	maximumBytes int64
}

type lengthReporter interface {
	Len() int
}

func queryEscape(text string) string {
	return url.QueryEscape(text)
}

func isNilReader(reader io.Reader) bool {
	return isNilValue(reader)
}

func isNilValue(candidate any) bool {
	if candidate == nil {
		return true
	}
	value := reflect.ValueOf(candidate)
	switch value.Kind() {
	case reflect.Pointer, reflect.Map, reflect.Slice, reflect.Interface, reflect.Func, reflect.Chan:
		return value.IsNil()
	}
	return false
}

func remainingBytesOf(reader io.Reader) int64 {
	if sized, isSized := reader.(lengthReporter); isSized {
		return int64(sized.Len())
	}
	seeker, isSeeker := reader.(io.Seeker)
	if !isSeeker {
		return -1
	}
	start, err := seeker.Seek(0, io.SeekCurrent)
	if err != nil {
		return -1
	}
	end, err := seeker.Seek(0, io.SeekEnd)
	if err != nil {
		return -1
	}
	if _, err := seeker.Seek(start, io.SeekStart); err != nil {
		return -1
	}
	return max(0, end-start)
}

func fileBodyOf(operation *OperationDescription, content any) (*fileBody, error) {
	reader, readable := readerOfContent(content)
	if !readable || isNilReader(reader) {
		return nil, invalidInput(fmt.Sprintf("%s needs the file under content, as bytes or an io.Reader.", operation.OperationID), fileContentField)
	}
	size := remainingBytesOf(reader)
	if size > operation.MaximumBodyBytes {
		return nil, invalidInput(fmt.Sprintf("%s takes a file of at most %d bytes, and this one holds %d.",
			operation.OperationID, operation.MaximumBodyBytes, size), fileContentField)
	}
	return &fileBody{operationID: operation.OperationID, reader: reader, sizeBytes: size, maximumBytes: operation.MaximumBodyBytes}, nil
}

func (body *fileBody) tooLarge() *Error {
	return invalidInput(fmt.Sprintf("%s takes a file of at most %d bytes, and this one holds more.", body.operationID, body.maximumBytes), fileContentField)
}

func changedSize() *Error {
	return invalidInput("The file changed size while the client sent it. Send it again once nothing writes to it.", fileContentField)
}

const (
	fileReadChunkBytes = 64 * 1024
	emptyReadsAllowed  = 100
)

type fileChunk struct {
	data []byte
	err  error
}

type sentFile struct {
	body     *fileBody
	sent     int64
	progress func()
	done     <-chan struct{}
	stopped  func() error
	mutex    sync.Mutex
	problem  *Error
	start    sync.Once
	chunks   chan fileChunk
	leftover []byte
	finished error
}

func (file *sentFile) pump() {
	defer close(file.chunks)
	emptyReads := 0
	for {
		data, err := file.readChunk()
		if data == nil && err == nil {
			emptyReads++
			if emptyReads < emptyReadsAllowed {
				continue
			}
			data, err = file.failed(invalidInput("The file reader returned no bytes many times in a row.", fileContentField))
		}
		emptyReads = 0
		select {
		case file.chunks <- fileChunk{data: data, err: err}:
		case <-file.done:
			return
		}
		if err != nil {
			return
		}
	}
}

func (file *sentFile) Read(buffer []byte) (int, error) {
	file.progress()
	if len(file.leftover) == 0 && file.finished == nil {
		file.start.Do(func() {
			file.chunks = make(chan fileChunk)
			go file.pump()
		})
		select {
		case chunk, open := <-file.chunks:
			if !open {
				return 0, file.stopped()
			}
			file.leftover, file.finished = chunk.data, chunk.err
		case <-file.done:
			return 0, file.stopped()
		}
	}
	count := copy(buffer, file.leftover)
	file.leftover = file.leftover[count:]
	if len(file.leftover) == 0 && file.finished != nil {
		return count, file.finished
	}
	return count, nil
}

func (file *sentFile) fail(problem *Error) (int, error) {
	file.mutex.Lock()
	if file.problem == nil {
		file.problem = problem
	}
	file.mutex.Unlock()
	return 0, problem
}

func (file *sentFile) failure() *Error {
	file.mutex.Lock()
	defer file.mutex.Unlock()
	return file.problem
}

func (file *sentFile) failed(problem *Error) ([]byte, error) {
	_, err := file.fail(problem)
	return nil, err
}

func (file *sentFile) readChunk() ([]byte, error) {
	limit := file.body.maximumBytes - file.sent + 1
	if file.body.sizeBytes >= 0 {
		limit = file.body.sizeBytes - file.sent + 1
	}
	buffer := make([]byte, min(limit, fileReadChunkBytes))
	count, err := file.body.reader.Read(buffer)
	file.progress()
	if count < 0 || count > len(buffer) {
		return file.failed(invalidInput("The file reader returned an impossible byte count.", fileContentField))
	}
	file.sent += int64(count)
	if file.sent > file.body.maximumBytes {
		return file.failed(file.body.tooLarge())
	}
	if file.body.sizeBytes >= 0 && file.sent > file.body.sizeBytes {
		return file.failed(changedSize())
	}
	if errors.Is(err, io.EOF) {
		if file.body.sizeBytes >= 0 && file.sent != file.body.sizeBytes {
			return file.failed(changedSize())
		}
		return buffer[:count], io.EOF
	}
	if err != nil {
		problem := invalidInput("The client could not read the file.", fileContentField)
		problem.cause = err
		problem.Details = err.Error()
		return file.failed(problem)
	}
	if count == 0 {
		return nil, nil
	}
	return buffer[:count], nil
}
