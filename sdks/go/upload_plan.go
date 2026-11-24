package himring

import (
	"fmt"
	"math"
	"time"
)

const (
	partsInFlight             = 4
	sendAttempts              = 3
	checkPollFirst            = 200 * time.Millisecond
	checkPollMaximum          = 2 * time.Second
	checkWaitPastDeadline     = 30 * time.Minute
	signablePartNumberMaximum = 10_000
	largestExactWholeNumber   = 1 << 53
	uploadMethodSingle        = "single"
	uploadStateOpen           = "open"
	uploadStateChecking       = "checking"
	uploadStateFailed         = "failed"
	uploadClosedCode          = "upload_closed"
)

var resignedStatuses = map[int]bool{403: true, 408: true, 429: true, 500: true, 502: true, 503: true, 504: true}

type uploadRecord = GetUploadOutput

type signedPart = SignUploadPartsOutputPartsItem

type createdUpload struct {
	Upload uploadRecord `json:"upload"`
	Parts  []signedPart `json:"parts"`
}

type AddedFile struct {
	Outcome string
	File    GetUploadOutputFile
}

func wholeNumber(value float64) (int64, bool) {
	if math.IsNaN(value) || math.IsInf(value, 0) || value != math.Trunc(value) || math.Abs(value) > largestExactWholeNumber {
		return 0, false
	}
	return int64(value), true
}

func checkedRecord(upload *uploadRecord, sizeBytes int64, sha256 string) error {
	size, isWhole := wholeNumber(upload.SizeBytes)
	if isWhole && size == sizeBytes && upload.ContentSHA256 == sha256 {
		return nil
	}
	return newError(ErrorKindInvalidResponse, "The API answered with an upload for different content than the file that the client sent.")
}

func checkedSignedPart(part signedPart, number int64, sizeBytes int64) (signedPart, error) {
	partNumber, numberIsWhole := wholeNumber(part.PartNumber)
	size, sizeIsWhole := wholeNumber(part.SizeBytes)
	if numberIsWhole && sizeIsWhole && partNumber == number && size == sizeBytes {
		return part, nil
	}
	return signedPart{}, newError(ErrorKindInvalidResponse, fmt.Sprintf("The API signed a part that does not match part %d of %d bytes.", number, sizeBytes))
}

func checkedLayout(upload *uploadRecord, sizeBytes int64) (int64, int64, error) {
	count, countIsWhole := wholeNumber(upload.PartCount)
	partBytes, partBytesIsWhole := wholeNumber(upload.PartBytes)
	size, sizeIsWhole := wholeNumber(upload.SizeBytes)
	fits := false
	if countIsWhole && partBytesIsWhole {
		if upload.Method == uploadMethodSingle {
			fits = count == 1 && partBytes == sizeBytes
		} else {
			fits = partBytes >= 1 && count == (sizeBytes+partBytes-1)/partBytes && count <= signablePartNumberMaximum
		}
	}
	if !sizeIsWhole || size != sizeBytes || !fits {
		return 0, 0, newError(ErrorKindInvalidResponse, fmt.Sprintf("The API planned the upload %s with parts that do not fit the file.", upload.ID))
	}
	return partBytes, count, nil
}

func refusalOfUpload(upload *uploadRecord) *Error {
	if upload.Failure == nil {
		return newError(ErrorKindRefused, "Himring closed the upload without the file.")
	}
	problem := newError(ErrorKindRefused, upload.Failure.Message)
	problem.Code = upload.Failure.Code
	problem.Status, _ = DocumentedStatusOf(upload.Failure.Code)
	return problem
}

func addedFileOf(upload *uploadRecord) (*AddedFile, error) {
	if upload.State == uploadStateFailed {
		return nil, refusalOfUpload(upload)
	}
	if upload.Outcome == nil || upload.File == nil {
		return nil, newError(ErrorKindInvalidResponse, fmt.Sprintf("The upload %s completed with no file.", upload.ID))
	}
	return &AddedFile{Outcome: *upload.Outcome, File: *upload.File}, nil
}

func partOf(signed *SignUploadPartsOutput, partNumber int64) (signedPart, error) {
	for _, part := range signed.Parts {
		if number, isWhole := wholeNumber(part.PartNumber); isWhole && number == partNumber {
			return part, nil
		}
	}
	return signedPart{}, newError(ErrorKindInvalidResponse, fmt.Sprintf("The API signed no link for part %d.", partNumber))
}

func giveUpAt(upload *uploadRecord) time.Time {
	deadline, err := time.Parse(time.RFC3339Nano, upload.DeadlineAt)
	if err != nil {
		deadline = time.Now()
	}
	return deadline.Add(checkWaitPastDeadline)
}

func stillCheckingError(uploadID string) *Error {
	return newError(ErrorKindTimeout, fmt.Sprintf("Himring was still checking the upload %s long after its deadline. Read it later with GetUpload.", uploadID))
}

func leftOpenError(uploadID string) *Error {
	return newError(ErrorKindInvalidResponse, fmt.Sprintf("The API left the upload %s open after completing it.", uploadID))
}

func shouldCancel(err error) bool {
	apiError, isAPIError := AsError(err)
	return !(isAPIError && apiError.Kind == ErrorKindRefused && apiError.Code != "")
}

func isUnreachable(err error) bool {
	apiError, isAPIError := AsError(err)
	return isAPIError && (apiError.Kind == ErrorKindNetwork || apiError.Kind == ErrorKindTimeout)
}
