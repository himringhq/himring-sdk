package himring

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Client struct {
	baseURL           *url.URL
	pathPrefix        string
	credential        string
	headers           map[string]string
	timeout           time.Duration
	uploadIdleTimeout time.Duration
	http              *http.Client
}

func New(options ...Option) (*Client, error) {
	settings := clientSettings{
		baseURL:           DefaultAPIURL,
		timeout:           DefaultTimeout,
		uploadIdleTimeout: DefaultUploadIdleTimeout,
		headers:           map[string]string{},
	}
	for _, option := range options {
		if option == nil {
			return nil, errors.New("pass a client option, not nil")
		}
		if err := option(&settings); err != nil {
			return nil, err
		}
	}
	baseURL, err := apiURLOf(settings.baseURL)
	if err != nil {
		return nil, err
	}
	credential, err := credentialOf(settings)
	if err != nil {
		return nil, err
	}
	prefix := strings.TrimRight(baseURL.EscapedPath(), "/")
	baseURL.Path, baseURL.RawPath = "", ""
	return &Client{
		baseURL:           baseURL,
		pathPrefix:        prefix,
		credential:        credential,
		headers:           settings.headers,
		timeout:           settings.timeout,
		uploadIdleTimeout: settings.uploadIdleTimeout,
		http:              withoutRedirects(settings.httpClient),
	}, nil
}

func (c *Client) BaseURL() string {
	return c.baseURL.String() + c.pathPrefix + "/"
}

func (c *Client) String() string {
	return "himring.Client{BaseURL: " + c.BaseURL() + ", credential: [redacted]}"
}

func (c *Client) GoString() string {
	return c.String()
}

func (c *Client) urlOf(path string, query string) string {
	target := c.baseURL.String() + c.pathPrefix + "/" + strings.TrimLeft(path, "/")
	if query != "" {
		target += "?" + query
	}
	return target
}

func (c *Client) Invoke(ctx context.Context, operationID string, fields map[string]any, options ...RequestOption) (any, error) {
	operation, err := operationOf(operationID)
	if err != nil {
		return nil, err
	}
	content, rest, err := splitFileContent(operation, fields)
	if err != nil {
		return nil, err
	}
	normalized, err := normalizedFields(operation, rest)
	if err != nil {
		return nil, err
	}
	result, err := c.call(ctx, operation, normalized, content, options)
	if err != nil {
		return nil, err
	}
	if result.download != nil {
		return result.download, nil
	}
	var value any
	if err := json.Unmarshal(result.body, &value); err != nil {
		return nil, notJSON(result, operation)
	}
	return value, nil
}

func (c *Client) callOperation(ctx context.Context, operationID string, input any, content FileContent, output any, options []RequestOption) error {
	operation, err := operationOf(operationID)
	if err != nil {
		return err
	}
	fields, err := fieldsOfInput(operation, input)
	if err != nil {
		return err
	}
	result, err := c.call(ctx, operation, fields, fileContentOf(operation, content), options)
	if err != nil {
		return err
	}
	return decodedOutput(result, operation, output)
}

func (c *Client) downloadOperation(ctx context.Context, operationID string, input any, options []RequestOption) (*Download, error) {
	operation, err := operationOf(operationID)
	if err != nil {
		return nil, err
	}
	fields, err := fieldsOfInput(operation, input)
	if err != nil {
		return nil, err
	}
	result, err := c.call(ctx, operation, fields, nil, options)
	if err != nil {
		return nil, err
	}
	return result.download, nil
}

func operationOf(operationID string) (*OperationDescription, error) {
	operation, known := operations[operationID]
	if !known {
		return nil, invalidInput("The API has no operation called "+operationID+".", "")
	}
	return operation, nil
}

func fileContentOf(operation *OperationDescription, content FileContent) any {
	if operation.BodyKind != BodyKindFile {
		return nil
	}
	return content
}
