package himring

import (
	"context"
	"net/http"
	"time"
)

type AddFileInput struct {
	ProjectID       string
	KnowledgeBaseID string
	Path            string
	Content         UploadSource
	Address         *string
	ContentSHA256   string
	Metadata        map[string]string
	OnProgress      func(partBytes int64) error
}

type DownloadFileInput struct {
	ProjectID       string
	KnowledgeBaseID string
	FileID          string
	Version         int64
	Rendition       string
	Range           string
}

type uploadIDs struct {
	client          *Client
	projectID       string
	knowledgeBaseID string
	uploadID        string
}

func (ids uploadIDs) sign(ctx context.Context, partNumber int64, sha256 string) (signedPart, error) {
	var signed SignUploadPartsOutput
	input := SignUploadPartsInput{
		ProjectID: ids.projectID, KnowledgeBaseID: ids.knowledgeBaseID, UploadID: ids.uploadID,
		Parts: []SignUploadPartsInputPartsItem{{PartNumber: partNumber, SHA256: sha256}},
	}
	if err := ids.client.callOperation(ctx, "sign_upload_parts", input, nil, &signed, nil); err != nil {
		return signedPart{}, err
	}
	return partOf(&signed, partNumber)
}

func (ids uploadIDs) record(ctx context.Context, operationID string) (*uploadRecord, error) {
	var upload uploadRecord
	input := GetUploadInput{ProjectID: ids.projectID, KnowledgeBaseID: ids.knowledgeBaseID, UploadID: ids.uploadID}
	if err := ids.client.callOperation(ctx, operationID, input, nil, &upload, nil); err != nil {
		return nil, err
	}
	return &upload, nil
}

func (ids uploadIDs) cancelQuietly(ctx context.Context) {
	ids.record(context.WithoutCancel(ctx), "cancel_upload")
}

func (c *Client) AddFile(ctx context.Context, input AddFileInput) (*AddedFile, error) {
	if ctx == nil {
		return nil, invalidInput("Pass a context to the call.", "")
	}
	source, err := lockedSourceOf(input.Content)
	if err != nil {
		return nil, err
	}
	if err := checkedSHA256(input.ContentSHA256); err != nil {
		return nil, err
	}
	sha256 := input.ContentSHA256
	if sha256 == "" {
		if sha256, err = source.contentSHA256(ctx); err != nil {
			return nil, err
		}
	}
	request := CreateUploadInput{
		ProjectID: input.ProjectID, KnowledgeBaseID: input.KnowledgeBaseID, Path: input.Path,
		Address: input.Address, SizeBytes: source.sizeBytes, ContentSHA256: sha256,
	}
	if input.Metadata != nil {
		metadata := input.Metadata
		request.Metadata = &CreateUploadInputMetadata{Map: &metadata}
	}
	var created createdUpload
	if err := c.callOperation(ctx, "create_upload", request, nil, &created, nil); err != nil {
		return nil, err
	}
	upload := &created.Upload
	if upload.State != uploadStateOpen {
		if err := checkedRecord(upload, source.sizeBytes, sha256); err != nil {
			return nil, err
		}
		return addedFileOf(upload)
	}
	ids := uploadIDs{client: c, projectID: input.ProjectID, knowledgeBaseID: input.KnowledgeBaseID, uploadID: upload.ID}
	added, err := c.sentAndAdded(ctx, ids, &created, source, sha256, input.OnProgress)
	if err != nil && shouldCancel(err) {
		ids.cancelQuietly(ctx)
	}
	return added, err
}

func (c *Client) sentAndAdded(ctx context.Context, ids uploadIDs, created *createdUpload, source *lockedSource, sha256 string, onProgress func(int64) error) (*AddedFile, error) {
	upload := &created.Upload
	if err := checkedRecord(upload, source.sizeBytes, sha256); err != nil {
		return nil, err
	}
	partBytes, partCount, err := checkedLayout(upload, source.sizeBytes)
	if err != nil {
		return nil, err
	}
	sender := partSender{client: c, ids: ids, source: source, onProgress: onProgress}
	if upload.Method == uploadMethodSingle {
		var first *signedPart
		if len(created.Parts) > 0 {
			first = &created.Parts[0]
		}
		err = sender.sendSingle(ctx, upload.ContentSHA256, first)
	} else {
		err = sender.sendMultipart(ctx, partBytes, partCount)
	}
	var settled *uploadRecord
	switch {
	case err == nil:
		settled, err = ids.record(ctx, "complete_upload")
	case IsRefusal(err, uploadClosedCode):
		settled, err = ids.record(ctx, "get_upload")
	}
	if err != nil {
		return nil, err
	}
	if settled, err = c.settled(ctx, ids, settled); err != nil {
		return nil, err
	}
	if err := checkedRecord(settled, source.sizeBytes, sha256); err != nil {
		return nil, err
	}
	return addedFileOf(settled)
}

func (c *Client) settled(ctx context.Context, ids uploadIDs, upload *uploadRecord) (*uploadRecord, error) {
	current := upload
	wait := checkPollFirst
	limit := giveUpAt(upload)
	for current.State == uploadStateChecking {
		if time.Now().After(limit) {
			return nil, stillCheckingError(upload.ID)
		}
		if err := pause(ctx, wait); err != nil {
			return nil, err
		}
		wait = min(checkPollMaximum, wait*2)
		next, err := ids.record(ctx, "get_upload")
		if err != nil {
			return nil, err
		}
		current = next
	}
	if current.State == uploadStateOpen {
		return nil, leftOpenError(upload.ID)
	}
	return current, nil
}

func (c *Client) DownloadFile(ctx context.Context, input DownloadFileInput) (*Download, error) {
	if ctx == nil {
		return nil, invalidInput("Pass a context to the call.", "")
	}
	header := http.Header{}
	if input.Range != "" {
		if !byteRangePattern.MatchString(input.Range) {
			return nil, invalidInput("Send Range as a byte range, such as bytes=0-1023.", "range")
		}
		header.Set("range", input.Range)
	}
	request := GetDownloadLinkInput{
		ProjectID: input.ProjectID, KnowledgeBaseID: input.KnowledgeBaseID, FileID: input.FileID,
		Version: formatWhole(input.Version), Disposition: Ptr("attachment"),
	}
	if input.Rendition != "" {
		request.Rendition = Ptr(input.Rendition)
	}
	link, err := c.GetDownloadLink(ctx, request)
	if err != nil {
		return nil, err
	}
	started, err := c.getFromStorage(ctx, link.URL, header)
	if err != nil {
		return nil, err
	}
	response := started.response
	if response.StatusCode != httpOK && response.StatusCode != httpPartialContent {
		started.body.Close()
		started.release()
		problem := newError(ErrorKindRefused, "Storage refused the download with status "+formatWhole(int64(response.StatusCode))+".")
		problem.Status = response.StatusCode
		return nil, problem
	}
	return &Download{
		Status:        response.StatusCode,
		FileName:      link.FileName,
		ContentType:   link.ContentType,
		ContentLength: contentLengthOf(response.Header),
		ContentRange:  response.Header.Get("content-range"),
		AcceptRanges:  response.Header.Get("accept-ranges"),
		EntityTag:     link.EntityTag,
		body:          started.body,
		source:        "storage",
		callContext:   started.call,
		parent:        ctx,
		release:       started.release,
	}, nil
}
