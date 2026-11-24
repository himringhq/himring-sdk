package tests

import (
	"context"
	"encoding/json"
	"reflect"
	"strings"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

var (
	emptyDatabasePage = map[string]any{"databases": []any{}, "total_count": 0, "limit": 20, "offset": 0}
	searchAnswer      = map[string]any{"question_id": "qst_" + strings.Repeat("a", 32), "duration_ms": 4, "passages": []any{}, "memories": []any{}, "recall_id": nil}
	hostilePathValues = []string{"%2F", "a/b", "../../v1/projects", "..%2F..%2F", "?state=deleted", "#fragment", "café ☃", " ", "..."}
)

func TestSendsTheAPIKeyThePathAndTheQueryThatTheDocumentDescribes(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "list_databases", 200, emptyDatabasePage)

	page, err := client.ListDatabases(context.Background(), himring.ListDatabasesInput{
		ProjectID: projectID, State: himring.Ptr("deleted"), Sort: himring.Ptr("name"), Limit: himring.Ptr("5"),
	})

	if err != nil || page.TotalCount != 0 || page.Databases == nil {
		t.Fatalf("the page is %+v, %v", page, err)
	}
	requests := contract.assertClean(t)
	if len(requests) != 1 {
		t.Fatalf("the client sent %d requests", len(requests))
	}
	request := requests[0]
	if request.operation() != "list_databases" || request.Headers["authorization"] != "Bearer "+apiKey || request.RawBodyBytes != 0 {
		t.Fatalf("the request is %+v", request)
	}
	if !reflect.DeepEqual(request.PathParameters, map[string]string{"project_id": projectID}) ||
		!reflect.DeepEqual(request.Query, map[string]string{"state": "deleted", "sort": "name", "limit": "5"}) {
		t.Fatalf("the request carries %v and %v", request.PathParameters, request.Query)
	}
}

func TestSendsTheJSONBodyFieldsAndLeavesOutTheOnesNotGiven(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "search_knowledge_base", 200, searchAnswer)
	question := "When do you open on Sunday? <b>&</b> — \U0001f600"

	found, err := client.SearchKnowledgeBase(context.Background(), himring.SearchKnowledgeBaseInput{
		ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, Question: question,
		Limit: &himring.SearchKnowledgeBaseInputLimit{Integer: himring.Ptr(int64(3))},
	})

	if err != nil || found.QuestionID != searchAnswer["question_id"] {
		t.Fatalf("the search returned %+v, %v", found, err)
	}
	requests := contract.assertClean(t)
	if requests[0].Headers["content-type"] != "application/json" {
		t.Fatalf("the content type is %q", requests[0].Headers["content-type"])
	}
	if !reflect.DeepEqual(requests[0].Body, map[string]any{"question": question, "limit": float64(3)}) {
		t.Fatalf("the body is %#v", requests[0].Body)
	}
}

func TestAHostilePathValueReachesTheAPIAsOneLiteralSegment(t *testing.T) {
	for _, hostile := range hostilePathValues {
		client := newClient(t)
		_, err := client.GetDatabase(context.Background(), himring.GetDatabaseInput{ProjectID: projectID, DatabaseID: hostile})

		refusal := expectKind(t, err, himring.ErrorKindRefused)
		if refusal.Code != "validation_failed" {
			t.Fatalf("%q was refused with %s", hostile, refusal.Code)
		}
		requests, _ := contract.recorded(t)
		if len(requests) != 1 || requests[0].operation() != "get_database" ||
			!reflect.DeepEqual(requests[0].PathParameters, map[string]string{"project_id": projectID, "database_id": hostile}) {
			t.Fatalf("%q reached the API as %+v", hostile, requests)
		}
	}
}

func TestRefusesAnEmptyOrDotPathValueOrBrokenTextBeforeSending(t *testing.T) {
	for _, hostile := range []string{"", ".", "..", "db_\xff"} {
		client := newClient(t)
		_, err := client.GetDatabase(context.Background(), himring.GetDatabaseInput{ProjectID: projectID, DatabaseID: hostile})

		refusal := expectKind(t, err, himring.ErrorKindInvalidInput)
		if len(refusal.Issues) != 1 || !reflect.DeepEqual(refusal.Issues[0].Path, []any{"database_id"}) {
			t.Fatalf("%q was refused with %+v", hostile, refusal.Issues)
		}
		contract.assertNothingSent(t)
	}
}

func TestInvokeRefusesUnknownFieldsUnknownOperationsAndValuesJSONCannotCarry(t *testing.T) {
	client := newClient(t)
	cases := map[string]struct {
		operation string
		fields    map[string]any
		path      []any
	}{
		"unknown field":     {"list_databases", map[string]any{"project_id": projectID, "include_deleted": "true"}, []any{"include_deleted"}},
		"unknown operation": {"drop_every_database", map[string]any{"project_id": projectID}, []any{}},
		"object in a query": {"list_databases", map[string]any{"project_id": projectID, "search": map[string]any{"or": "1"}}, []any{"search"}},
		"channel":           {"list_databases", map[string]any{"project_id": projectID, "search": make(chan int)}, []any{}},
	}
	for name, input := range cases {
		_, err := client.Invoke(context.Background(), input.operation, input.fields)
		refusal := expectKind(t, err, himring.ErrorKindInvalidInput)
		if len(refusal.Issues) != 1 || !reflect.DeepEqual(refusal.Issues[0].Path, input.path) {
			t.Fatalf("%s: the issues are %+v", name, refusal.Issues)
		}
	}
	contract.assertNothingSent(t)
}

func TestJoinsListQueryValuesWithCommasAndSpellsBooleansInLowercase(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "list_databases", 200, emptyDatabasePage)

	if _, err := client.Invoke(context.Background(), "list_databases", map[string]any{
		"project_id": projectID, "search": []any{"refund", "policy, 2026", true}, "offset": 0,
	}); err != nil {
		t.Fatal(err)
	}

	requests := contract.assertClean(t)
	if !reflect.DeepEqual(requests[0].Query, map[string]string{"search": "refund,policy, 2026,true", "offset": "0"}) {
		t.Fatalf("the query is %v", requests[0].Query)
	}
}

func TestRefusesHeadersCredentialsAddressesAndTimeoutsThatCouldLeakOrSplitTheRequest(t *testing.T) {
	refused := [][]himring.Option{
		{himring.WithHeaders(map[string]string{"Authorization": "value"})},
		{himring.WithHeaders(map[string]string{"content-type": "value"})},
		{himring.WithHeaders(map[string]string{"Content-Length": "1"})},
		{himring.WithHeaders(map[string]string{"HOST": "evil.example"})},
		{himring.WithHeaders(map[string]string{"x-trace": "a\r\nauthorization: Bearer stolen"})},
		{himring.WithHeaders(map[string]string{"x trace": "a"})},
		{himring.WithHeaders(map[string]string{"x-name": "café"})},
		{himring.WithAPIKey("")}, {himring.WithAPIKey("hk live")}, {himring.WithAPIKey("hk_live\r\nx-admin: 1")}, {himring.WithAPIKey("hk_é")},
		{himring.WithAPIKey(apiKey), himring.WithSessionToken("st_session")},
		{himring.WithTimeout(0)}, {himring.WithTimeout(-time.Second)}, {himring.WithUploadIdleTimeout(0)}, {himring.WithHTTPClient(nil)},
	}
	for _, address := range []string{"ftp://api.himring.ai", "file:///etc/passwd", "https://admin:secret@api.himring.ai", "https://api.himring.ai/?region=eu",
		"https://api.himring.ai/#fragment", "https://", "api.himring.ai", "", "mailto:someone@example.com"} {
		refused = append(refused, []himring.Option{himring.WithBaseURL(address)})
	}
	for index, options := range refused {
		if client, err := himring.New(options...); err == nil {
			t.Fatalf("case %d made a client at %s", index, client.BaseURL())
		}
	}
	client := newClient(t)
	_, err := client.ListDatabases(context.Background(), himring.ListDatabasesInput{ProjectID: projectID}, himring.WithRequestTimeout(0))
	if err == nil {
		t.Fatal("a zero request timeout was accepted")
	}
	contract.assertNothingSent(t)
}

func TestReadsEveryFieldOfADocumentedRefusal(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "list_databases", 403, map[string]any{"error": map[string]any{
		"code": "api_key_permission_missing", "message": "The key may not read databases.", "details": "Ask an owner to add the permission.",
		"request_id": "req_body", "issues": []any{map[string]any{"message": "Not allowed.", "path": []any{"project_id", 0}}},
		"missing_permission": map[string]any{"resource_kind": "database", "level": "read", "resource_id": nil},
	}}, map[string]string{"retry-after": "7"})

	_, err := client.ListDatabases(context.Background(), himring.ListDatabasesInput{ProjectID: projectID})

	contract.assertClean(t)
	refusal := expectKind(t, err, himring.ErrorKindRefused)
	if refusal.Status != 403 || refusal.Code != "api_key_permission_missing" || refusal.Message != "The key may not read databases." ||
		refusal.Details != "Ask an owner to add the permission." || refusal.RequestID != "req_body" || !refusal.IsDocumentedCode() {
		t.Fatalf("the refusal is %+v", refusal)
	}
	if refusal.RetryAfterSeconds == nil || *refusal.RetryAfterSeconds != 7 {
		t.Fatalf("retry after is %v", refusal.RetryAfterSeconds)
	}
	if len(refusal.Issues) != 1 || !reflect.DeepEqual(refusal.Issues[0].Path, []any{"project_id", int64(0)}) {
		t.Fatalf("the issues are %+v", refusal.Issues)
	}
	if refusal.MissingPermission == nil || refusal.MissingPermission.ResourceKind != "database" || refusal.MissingPermission.ResourceID != nil {
		t.Fatalf("the missing permission is %+v", refusal.MissingPermission)
	}
	if !himring.IsRefusal(err, "api_key_permission_missing") {
		t.Fatal("IsRefusal missed the code")
	}
}

func TestEveryOperationOfBothDocumentsIsAClientMethod(t *testing.T) {
	documented := map[string]bool{}
	for _, file := range []string{"openapi.json", "openapi-session.json"} {
		var document struct {
			Paths map[string]map[string]struct {
				OperationID string `json:"operationId"`
			} `json:"paths"`
		}
		decodeSpec(t, file, &document)
		for _, item := range document.Paths {
			for _, operation := range item {
				documented[operation.OperationID] = true
			}
		}
	}
	listed := himring.OperationIDs()
	if len(listed) != len(documented) {
		t.Fatalf("the SDK lists %d operations and the documents hold %d", len(listed), len(documented))
	}
	methods := reflect.TypeOf(&himring.Client{})
	for _, id := range listed {
		if !documented[id] {
			t.Fatalf("the SDK lists %s, which no document holds", id)
		}
		if _, found := methods.MethodByName(goName(id)); !found {
			t.Fatalf("the client has no method for %s", id)
		}
	}
}

func decodeSpec(t testing.TB, file string, target any) {
	t.Helper()
	if err := json.Unmarshal(readSpec(t, file), target); err != nil {
		t.Fatal(err)
	}
}
