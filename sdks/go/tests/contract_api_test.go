package tests

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"
)

const controlTimeout = 10 * time.Second

var contract *contractAPI

type recordedRequest struct {
	OperationID    *string           `json:"operation_id"`
	Method         string            `json:"method"`
	Path           string            `json:"path"`
	PathParameters map[string]string `json:"path_parameters"`
	Query          map[string]string `json:"query"`
	Headers        map[string]string `json:"headers"`
	Body           any               `json:"body"`
	RawBodyBytes   int               `json:"raw_body_bytes"`
	Problems       []string          `json:"problems"`
}

func (request recordedRequest) operation() string {
	if request.OperationID == nil {
		return ""
	}
	return *request.OperationID
}

type contractAPI struct {
	baseURL string
	process *exec.Cmd
	stdin   io.WriteCloser
	http    *http.Client
}

func startContractAPI() (*contractAPI, error) {
	root, err := filepath.Abs(filepath.Join("..", "..", ".."))
	if err != nil {
		return nil, err
	}
	process := exec.Command("node", filepath.Join(root, "tools", "contract-server", "dist", "serve.js"))
	process.Dir = root
	process.Stderr = os.Stderr
	stdin, err := process.StdinPipe()
	if err != nil {
		return nil, err
	}
	stdout, err := process.StdoutPipe()
	if err != nil {
		return nil, err
	}
	if err := process.Start(); err != nil {
		return nil, err
	}
	line, err := bufio.NewReader(stdout).ReadString('\n')
	if err != nil {
		process.Process.Kill()
		return nil, fmt.Errorf("the contract server printed no base_url: %w", err)
	}
	var started struct {
		BaseURL string `json:"base_url"`
	}
	if err := json.Unmarshal([]byte(line), &started); err != nil || started.BaseURL == "" {
		process.Process.Kill()
		return nil, fmt.Errorf("the contract server printed %q", line)
	}
	return &contractAPI{baseURL: started.BaseURL, process: process, stdin: stdin, http: &http.Client{Timeout: controlTimeout}}, nil
}

func (api *contractAPI) stop() {
	api.stdin.Close()
	finished := make(chan struct{})
	go func() {
		api.process.Wait()
		close(finished)
	}()
	select {
	case <-finished:
	case <-time.After(controlTimeout):
		api.process.Process.Kill()
		<-finished
	}
}

func (api *contractAPI) control(t testing.TB, method string, path string, body any) []byte {
	t.Helper()
	encoded, err := json.Marshal(body)
	if err != nil {
		t.Fatal(err)
	}
	request, err := http.NewRequest(method, api.baseURL+"/__contract/"+path, bytes.NewReader(encoded))
	if err != nil {
		t.Fatal(err)
	}
	request.Header.Set("content-type", "application/json")
	response, err := api.http.Do(request)
	if err != nil {
		t.Fatal(err)
	}
	defer response.Body.Close()
	data, err := io.ReadAll(response.Body)
	if err != nil {
		t.Fatal(err)
	}
	if response.StatusCode >= 300 {
		t.Fatalf("the contract server refused %s %s with %d: %s", method, path, response.StatusCode, data)
	}
	return data
}

func (api *contractAPI) stub(t testing.TB, operationID string, status int, body any, headers ...map[string]string) {
	t.Helper()
	reply := map[string]any{"operation_id": operationID, "status": status, "body": body}
	if len(headers) > 0 {
		reply["headers"] = headers[0]
	}
	api.control(t, http.MethodPost, "stubs", reply)
}

func (api *contractAPI) script(t testing.TB, operationID string, replies ...map[string]any) {
	t.Helper()
	api.control(t, http.MethodPost, "stubs", map[string]any{"operation_id": operationID, "status": replies[0]["status"], "replies": replies})
}

func (api *contractAPI) recorded(t testing.TB) ([]recordedRequest, []string) {
	t.Helper()
	var report struct {
		Requests []recordedRequest `json:"requests"`
		Problems []string          `json:"problems"`
	}
	if err := json.Unmarshal(api.control(t, http.MethodGet, "requests", nil), &report); err != nil {
		t.Fatal(err)
	}
	return report.Requests, report.Problems
}

func (api *contractAPI) requestsFor(t testing.TB, operationID string) []recordedRequest {
	t.Helper()
	requests, _ := api.recorded(t)
	var matching []recordedRequest
	for _, request := range requests {
		if request.operation() == operationID {
			matching = append(matching, request)
		}
	}
	return matching
}

func (api *contractAPI) assertClean(t testing.TB) []recordedRequest {
	t.Helper()
	requests, problems := api.recorded(t)
	if len(problems) > 0 {
		t.Fatalf("the contract server found problems: %v", problems)
	}
	for _, request := range requests {
		if len(request.Problems) > 0 {
			t.Fatalf("%s %s broke the spec: %v", request.Method, request.Path, request.Problems)
		}
	}
	return requests
}

func (api *contractAPI) assertNothingSent(t testing.TB) {
	t.Helper()
	requests, problems := api.recorded(t)
	if len(requests) != 0 || len(problems) != 0 {
		t.Fatalf("the client sent %d requests with problems %v before it should have refused", len(requests), problems)
	}
}

func (api *contractAPI) reset(t testing.TB) {
	t.Helper()
	api.control(t, http.MethodPost, "reset", map[string]any{})
}

func TestMain(m *testing.M) {
	if os.Getenv(recorderSetupVariable) != "" {
		runCrashingRecorder()
	}
	started, err := startContractAPI()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	contract = started
	code := m.Run()
	contract.stop()
	os.Exit(code)
}
