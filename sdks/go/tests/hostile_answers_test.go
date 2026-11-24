package tests

import (
	"context"
	"errors"
	"net"
	"net/http"
	"strings"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	slowAnswer    = 2 * time.Second
	timeLimit     = 300 * time.Millisecond
	promptFailure = 1200 * time.Millisecond
	dripPause     = 100 * time.Millisecond
	drippedBytes  = 40
	goneEnvelope  = `"code": "not_found", "message": "Gone."`
)

var listDatabasesPath = "/v1/projects/" + projectID + "/databases"

func listDatabasesAt(t testing.TB, baseURL string, options ...himring.Option) error {
	t.Helper()
	_, err := clientAt(t, baseURL, options...).ListDatabases(context.Background(), himring.ListDatabasesInput{ProjectID: projectID})
	return err
}

func TestASuccessAnswerThatIsNotJSONOrBreaksTheShapeIsAnInvalidResponse(t *testing.T) {
	for _, body := range []string{"<html>Sign in to the proxy</html>", `{"databases": "none", "total_count": 0}`, `{"databases": []} trailing`} {
		standIn := newStandIn(t)
		standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 200, body: []byte(body)})

		refusal := expectKind(t, listDatabasesAt(t, standIn.baseURL), himring.ErrorKindInvalidResponse)

		if refusal.Status != 200 {
			t.Fatalf("%q gave status %d", body, refusal.Status)
		}
	}
}

func TestAProxyErrorPageIsAnInvalidResponseWithItsStatusAndRequestID(t *testing.T) {
	standIn := newStandIn(t)
	standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 502, body: []byte("<html>Bad gateway</html>"), headers: map[string]string{"x-request-id": "req_proxy"}})

	refusal := expectKind(t, listDatabasesAt(t, standIn.baseURL), himring.ErrorKindInvalidResponse)

	if refusal.Status != 502 || refusal.Code != "" || refusal.RequestID != "req_proxy" {
		t.Fatalf("the error is %+v", refusal)
	}
}

func TestAnErrorEnvelopeOfTheWrongShapeIsAnInvalidResponse(t *testing.T) {
	envelopes := []string{
		`[]`, `null`, `{"error": "not_found"}`, `{"error": {"code": 404, "message": "Gone."}}`, `{"error": {"code": "not_found"}}`,
		`{"error": {` + goneEnvelope + `, "details": null}}`,
		`{"error": {` + goneEnvelope + `, "issues": [{"message": 1, "path": []}]}}`,
		`{"error": {` + goneEnvelope + `, "issues": [{"message": "x", "path": [true]}]}}`,
		`{"error": {` + goneEnvelope + `, "missing_permission": {"level": "read"}}}`,
		`{"error": {` + goneEnvelope + `, "request_id": 7}}`,
		`{"error": {` + goneEnvelope + `}} {"error": {}}`,
	}
	for _, envelope := range envelopes {
		standIn := newStandIn(t)
		standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 404, body: []byte(envelope)})

		refusal := expectKind(t, listDatabasesAt(t, standIn.baseURL), himring.ErrorKindInvalidResponse)

		if refusal.Status != 404 || refusal.Code != "" {
			t.Fatalf("%s gave %+v", envelope, refusal)
		}
	}
}

func TestARetryAfterDateBecomesSecondsFromNow(t *testing.T) {
	standIn := newStandIn(t)
	later := time.Now().Add(120 * time.Second).UTC().Format(http.TimeFormat)
	standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 429, body: []byte(`{"error": {"code": "rate_limited", "message": "Wait."}}`), headers: map[string]string{"retry-after": later}})

	refusal := expectKind(t, listDatabasesAt(t, standIn.baseURL), himring.ErrorKindRefused)

	if refusal.RetryAfterSeconds == nil || *refusal.RetryAfterSeconds < 100 || *refusal.RetryAfterSeconds > 121 {
		t.Fatalf("retry after is %v", refusal.RetryAfterSeconds)
	}
}

func TestAnAPIThatNeverAnswersOrDripsItsAnswerTimesOutWithinTheLimit(t *testing.T) {
	replies := []rawReply{
		{status: 200, body: []byte("{}"), delay: slowAnswer},
		{status: 200, body: []byte("{" + strings.Repeat(" ", drippedBytes) + "}"), drip: dripPause},
	}
	for _, reply := range replies {
		standIn := newStandIn(t)
		standIn.script(http.MethodGet, listDatabasesPath, reply)
		started := time.Now()

		expectKind(t, listDatabasesAt(t, standIn.baseURL, himring.WithTimeout(timeLimit)), himring.ErrorKindTimeout)

		if elapsed := time.Since(started); elapsed > promptFailure {
			t.Fatalf("the call took %s", elapsed)
		}
	}
}

func TestACallPerRequestTimeoutOverridesTheClientOne(t *testing.T) {
	standIn := newStandIn(t)
	standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 200, body: []byte("{}"), delay: slowAnswer})
	started := time.Now()

	_, err := clientAt(t, standIn.baseURL).ListDatabases(context.Background(), himring.ListDatabasesInput{ProjectID: projectID}, himring.WithRequestTimeout(timeLimit))

	expectKind(t, err, himring.ErrorKindTimeout)
	if elapsed := time.Since(started); elapsed > promptFailure {
		t.Fatalf("the call took %s", elapsed)
	}
}

func TestACancelledContextStopsAWaitingCallWithTheContextError(t *testing.T) {
	standIn := newStandIn(t)
	standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 200, body: []byte("{}"), delay: slowAnswer})
	ctx, cancel := context.WithCancel(context.Background())
	time.AfterFunc(timeLimit, cancel)
	started := time.Now()

	_, err := clientAt(t, standIn.baseURL).ListDatabases(ctx, himring.ListDatabasesInput{ProjectID: projectID})

	if !errors.Is(err, context.Canceled) {
		t.Fatalf("the call returned %v", err)
	}
	if elapsed := time.Since(started); elapsed > promptFailure {
		t.Fatalf("the call took %s", elapsed)
	}
	expired, stop := context.WithTimeout(context.Background(), -time.Second)
	defer stop()
	if _, err := clientAt(t, standIn.baseURL).ListDatabases(expired, himring.ListDatabasesInput{ProjectID: projectID}); !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("an expired context returned %v", err)
	}
	if len(standIn.arrived(http.MethodGet)) != 1 {
		t.Fatalf("the expired context still sent a request")
	}
}

func TestAnAnswerCutOffMidwayIsANetworkError(t *testing.T) {
	standIn := newStandIn(t)
	standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 200, body: []byte(`{"databases": [], "total_count": 0, "limit": 20, "offset": 0}`), cutAt: 12})

	expectKind(t, listDatabasesAt(t, standIn.baseURL), himring.ErrorKindNetwork)
}

func TestARedirectIsNeverFollowedSoTheKeyStaysWithTheAPI(t *testing.T) {
	standIn := newStandIn(t)
	elsewhere := newStandIn(t)
	standIn.script(http.MethodGet, listDatabasesPath, rawReply{status: 307, headers: map[string]string{"location": elsewhere.baseURL + "/collect"}})

	refusal := expectKind(t, listDatabasesAt(t, standIn.baseURL), himring.ErrorKindInvalidResponse)

	if refusal.Status != 307 || len(elsewhere.arrived("")) != 0 {
		t.Fatalf("the redirect gave %+v and reached %d requests", refusal, len(elsewhere.arrived("")))
	}
}

func TestAnAddressWhereNothingListensIsANetworkError(t *testing.T) {
	probe, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	address := "http://" + probe.Addr().String()
	probe.Close()

	expectKind(t, listDatabasesAt(t, address), himring.ErrorKindNetwork)
}
