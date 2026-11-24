package himring

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

const (
	DefaultAPIURL            = SpecAPIURL
	DefaultTimeout           = 30 * time.Second
	DefaultUploadIdleTimeout = 120 * time.Second
)

var (
	clientSetHeaders   = map[string]bool{"authorization": true, "content-type": true, "content-length": true, "host": true}
	headerNamePattern  = regexp.MustCompile(`^[!#$%&'*+.^_` + "`" + `|~0-9A-Za-z-]+$`)
	headerValuePattern = regexp.MustCompile(`^[\t\x20-\x7e]*$`)
	credentialPattern  = regexp.MustCompile(`^[\x21-\x7e]+$`)
)

type clientSettings struct {
	apiKey            string
	apiKeySet         bool
	sessionToken      string
	sessionTokenSet   bool
	baseURL           string
	timeout           time.Duration
	uploadIdleTimeout time.Duration
	headers           map[string]string
	httpClient        *http.Client
}

type Option func(*clientSettings) error

func WithAPIKey(apiKey string) Option {
	return func(settings *clientSettings) error {
		settings.apiKey, settings.apiKeySet = apiKey, true
		return nil
	}
}

func WithSessionToken(sessionToken string) Option {
	return func(settings *clientSettings) error {
		settings.sessionToken, settings.sessionTokenSet = sessionToken, true
		return nil
	}
}

func WithBaseURL(baseURL string) Option {
	return func(settings *clientSettings) error {
		settings.baseURL = baseURL
		return nil
	}
}

func WithTimeout(timeout time.Duration) Option {
	return func(settings *clientSettings) error {
		if timeout <= 0 {
			return errors.New("set the timeout to a duration above zero")
		}
		settings.timeout = timeout
		return nil
	}
}

func WithUploadIdleTimeout(timeout time.Duration) Option {
	return func(settings *clientSettings) error {
		if timeout <= 0 {
			return errors.New("set the upload idle timeout to a duration above zero")
		}
		settings.uploadIdleTimeout = timeout
		return nil
	}
}

func WithHeaders(headers map[string]string) Option {
	return func(settings *clientSettings) error {
		kept, err := customHeadersOf(headers)
		if err != nil {
			return err
		}
		for name, value := range kept {
			settings.headers[name] = value
		}
		return nil
	}
}

func WithHTTPClient(client *http.Client) Option {
	return func(settings *clientSettings) error {
		if client == nil {
			return errors.New("pass an HTTP client, not nil")
		}
		settings.httpClient = client
		return nil
	}
}

type requestSettings struct {
	timeout time.Duration
}

type RequestOption func(*requestSettings) error

func WithRequestTimeout(timeout time.Duration) RequestOption {
	return func(settings *requestSettings) error {
		if timeout <= 0 {
			return errors.New("set the request timeout to a duration above zero")
		}
		settings.timeout = timeout
		return nil
	}
}

func requestSettingsOf(fallback time.Duration, options []RequestOption) (requestSettings, error) {
	settings := requestSettings{timeout: fallback}
	for _, option := range options {
		if option == nil {
			return settings, errors.New("pass a request option, not nil")
		}
		if err := option(&settings); err != nil {
			return settings, err
		}
	}
	return settings, nil
}

func apiURLOf(baseURL string) (*url.URL, error) {
	example := fmt.Errorf("set the base URL to an http or https URL, such as %s", DefaultAPIURL)
	if strings.ContainsAny(baseURL, "?#") {
		return nil, errors.New("set the base URL without a user name, a password, a query, or a fragment")
	}
	parsed, err := url.Parse(baseURL)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Hostname() == "" || parsed.Opaque != "" {
		return nil, example
	}
	if parsed.User != nil || parsed.RawQuery != "" || parsed.Fragment != "" {
		return nil, errors.New("set the base URL without a user name, a password, a query, or a fragment")
	}
	return parsed, nil
}

func credentialOf(settings clientSettings) (string, error) {
	if settings.apiKeySet && settings.sessionTokenSet {
		return "", errors.New("pass an API key or a session token, not both")
	}
	if !settings.apiKeySet && !settings.sessionTokenSet {
		return "", nil
	}
	credential := settings.apiKey
	if settings.sessionTokenSet {
		credential = settings.sessionToken
	}
	if !credentialPattern.MatchString(credential) {
		return "", errors.New("pass the credential as the text that Himring gave you, with no spaces")
	}
	return credential, nil
}

func customHeadersOf(headers map[string]string) (map[string]string, error) {
	kept := map[string]string{}
	for name, value := range headers {
		lower := strings.ToLower(name)
		if clientSetHeaders[lower] {
			return nil, newError(ErrorKindInvalidInput, fmt.Sprintf("The client sets the %s header itself. Remove it from headers.", lower))
		}
		if !headerNamePattern.MatchString(lower) {
			return nil, newError(ErrorKindInvalidInput, fmt.Sprintf("The header name %q is not a valid HTTP header name.", name))
		}
		if !headerValuePattern.MatchString(value) {
			return nil, newError(ErrorKindInvalidInput, fmt.Sprintf("The %s header holds characters that HTTP headers cannot carry.", lower))
		}
		kept[lower] = value
	}
	return kept, nil
}

func refuseRedirect(*http.Request, []*http.Request) error {
	return http.ErrUseLastResponse
}

func withoutRedirects(supplied *http.Client) *http.Client {
	client := &http.Client{}
	if supplied != nil {
		copied := *supplied
		client = &copied
	}
	client.CheckRedirect = refuseRedirect
	client.Timeout = 0
	return client
}
