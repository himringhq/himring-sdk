package tests

import (
	"bufio"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"runtime"
	"sort"
	"strings"
	"testing"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
	"github.com/himringhq/himring-sdk/sdks/go/answers"
)

const (
	recorderSetupVariable = "HIMRING_TEST_RECORDER_SETUP"
	neverFlushOnATimer    = time.Hour
	ownerOnlyBits         = 0o077
)

type quietLogger struct{}

func (quietLogger) Warn(string, map[string]any) {}

type recorderSetup struct {
	BaseURL         string               `json:"base_url"`
	ProjectID       string               `json:"project_id"`
	KnowledgeBaseID string               `json:"knowledge_base_id"`
	SpoolDirectory  string               `json:"spool_directory"`
	Drafts          []answers.EventDraft `json:"drafts"`
}

func randomID(prefix string) string {
	raw := make([]byte, 16)
	rand.Read(raw)
	return prefix + "_" + hex.EncodeToString(raw)
}

func answerDrafts(count int) []answers.EventDraft {
	drafts := make([]answers.EventDraft, 0, count)
	for index := range count {
		drafts = append(drafts, answers.EventDraft{QuestionID: randomID("qst"), Answer: fmt.Sprintf("Refunds arrive within %d business days.", index+1)})
	}
	return drafts
}

func answersPath(project string, knowledgeBase string) string {
	return "/v1/projects/" + project + "/knowledge-bases/" + knowledgeBase + "/answer-events"
}

func recorderAt(t testing.TB, client *himring.Client, spool string, project string, knowledgeBase string, closeTimeout time.Duration) *answers.Recorder {
	t.Helper()
	recorder, err := answers.NewRecorder(answers.Options{
		Client: client, ProjectID: project, KnowledgeBaseID: knowledgeBase, SpoolDirectory: spool,
		FlushInterval: neverFlushOnATimer, CloseTimeout: closeTimeout, Logger: quietLogger{},
	})
	if err != nil {
		t.Fatal(err)
	}
	return recorder
}

func flushAndClose(t testing.TB, recorders ...*answers.Recorder) {
	t.Helper()
	done := make(chan struct{}, len(recorders))
	for _, recorder := range recorders {
		go func() {
			recorder.Flush(context.Background())
			done <- struct{}{}
		}()
	}
	for range recorders {
		<-done
	}
	for _, recorder := range recorders {
		recorder.Close(context.Background())
	}
}

func deliveredAnswers(t testing.TB, requests []recordedRequest) map[string][]string {
	t.Helper()
	delivered := map[string][]string{}
	for _, request := range requests {
		body, _ := request.Body.(map[string]any)
		events, _ := body["events"].([]any)
		for _, raw := range events {
			event, _ := raw.(map[string]any)
			question, _ := event["question_id"].(string)
			answer, _ := event["answer"].(string)
			delivered[question] = append(delivered[question], answer)
		}
	}
	return delivered
}

func expectExactlyOnce(t testing.TB, delivered map[string][]string, drafts []answers.EventDraft) {
	t.Helper()
	expected := map[string][]string{}
	for _, draft := range drafts {
		expected[draft.QuestionID] = []string{draft.Answer}
	}
	if !reflect.DeepEqual(delivered, expected) {
		t.Fatalf("Himring received %d questions where %d were recorded once each", len(delivered), len(expected))
	}
}

func spoolFiles(t testing.TB, directory string) []string {
	t.Helper()
	entries, err := os.ReadDir(directory)
	if err != nil && !os.IsNotExist(err) {
		t.Fatal(err)
	}
	var names []string
	for _, entry := range entries {
		names = append(names, entry.Name())
	}
	sort.Strings(names)
	return names
}

func runCrashingRecorder() {
	var setup recorderSetup
	if err := json.Unmarshal([]byte(os.Getenv(recorderSetupVariable)), &setup); err != nil {
		os.Exit(2)
	}
	client, err := himring.New(himring.WithAPIKey(apiKey), himring.WithBaseURL(setup.BaseURL))
	if err != nil {
		os.Exit(3)
	}
	recorder, err := answers.NewRecorder(answers.Options{
		Client: client, ProjectID: setup.ProjectID, KnowledgeBaseID: setup.KnowledgeBaseID, SpoolDirectory: setup.SpoolDirectory,
		FlushInterval: neverFlushOnATimer, Logger: quietLogger{},
	})
	if err != nil {
		os.Exit(4)
	}
	recorder.Record(setup.Drafts)
	fmt.Println("recorded")
	select {}
}

func recordThenCrash(t testing.TB, setup recorderSetup) {
	t.Helper()
	if runtime.GOOS == "windows" {
		t.Skip("the crash needs a signal that Windows does not send")
	}
	encoded, _ := json.Marshal(setup)
	child := exec.Command(os.Args[0], "-test.run=^$")
	child.Env = append(os.Environ(), recorderSetupVariable+"="+string(encoded))
	stdout, err := child.StdoutPipe()
	if err != nil {
		t.Fatal(err)
	}
	if err := child.Start(); err != nil {
		t.Fatal(err)
	}
	line, err := bufio.NewReader(stdout).ReadString('\n')
	child.Process.Kill()
	child.Wait()
	if err != nil || strings.TrimSpace(line) != "recorded" {
		t.Fatalf("the recorder process printed %q before it crashed: %v", line, err)
	}
}

func TestHalvesABatchThatTheAPIFindsTooLargeWithNoEventLostOrSentTwice(t *testing.T) {
	client := newClient(t)
	tooLarge := map[string]any{"status": 413, "body": map[string]any{"error": map[string]any{"code": "payload_too_large", "message": "Send fewer events."}}}
	contract.script(t, "record_answer_events", tooLarge, tooLarge, map[string]any{"status": 200, "body": map[string]any{"results": []any{}, "recorded_count": 0}})
	recorder := recorderAt(t, client, filepath.Join(t.TempDir(), "spool"), projectID, knowledgeBaseID, 0)
	drafts := answerDrafts(60)

	recorder.Record(drafts)
	flushAndClose(t, recorder)

	requests := contract.assertClean(t)
	if len(requests) < 3 {
		t.Fatalf("the recorder sent %d requests", len(requests))
	}
	firstSize := len(deliveredAnswers(t, requests[:1]))
	for _, request := range requests[2:] {
		if size := len(deliveredAnswers(t, []recordedRequest{request})); size >= firstSize {
			t.Fatalf("a batch of %d followed a refused batch of %d", size, firstSize)
		}
	}
	expectExactlyOnce(t, deliveredAnswers(t, requests[2:]), drafts)
	if recorder.DroppedEventCount() != 0 {
		t.Fatalf("the recorder dropped %d events", recorder.DroppedEventCount())
	}
}

func TestDoesNotStealTheSpoolOfALiveRecorderWithAStaleHeartbeat(t *testing.T) {
	storage := newStandIn(t)
	spool := filepath.Join(t.TempDir(), "spool")
	client := clientAt(t, storage.baseURL)
	storage.script(http.MethodPost, answersPath(projectID, knowledgeBaseID), rawReply{status: 200, body: []byte(`{"results": [], "recorded_count": 1}`), delay: slowAnswer})
	first := recorderAt(t, client, spool, projectID, knowledgeBaseID, 100*time.Millisecond)
	first.Record(answerDrafts(1))
	go first.Flush(context.Background())
	for deadline := time.Now().Add(slowAnswer); len(storage.arrived(http.MethodPost)) == 0 && time.Now().Before(deadline); {
		time.Sleep(10 * time.Millisecond)
	}
	stale := time.Now().Add(-10 * time.Minute)
	for _, name := range spoolFiles(t, spool) {
		os.Chtimes(filepath.Join(spool, name), stale, stale)
	}
	second := recorderAt(t, client, spool, projectID, knowledgeBaseID, 100*time.Millisecond)

	second.Flush(context.Background())

	if arrived := len(storage.arrived(http.MethodPost)); arrived != 1 {
		t.Fatalf("Himring received %d requests", arrived)
	}
	first.Close(context.Background())
	second.Close(context.Background())
}

func TestRecoversTheAnswersOfACrashedProcessOnlyForTheirOwnDestinationAndExactlyOnce(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "record_answer_events", 200, map[string]any{"results": []any{}, "recorded_count": 0})
	spool := filepath.Join(t.TempDir(), "spool")
	drafts := answerDrafts(30)
	recordThenCrash(t, recorderSetup{BaseURL: contract.baseURL, ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID, SpoolDirectory: spool, Drafts: drafts})
	original := spoolFiles(t, spool)
	if len(original) == 0 {
		t.Fatal("the crashed recorder left no spool file")
	}
	storage := newStandIn(t)
	for _, foreign := range []*answers.Recorder{
		recorderAt(t, client, spool, randomID("prj"), knowledgeBaseID, 0),
		recorderAt(t, client, spool, projectID, randomID("kb"), 0),
		recorderAt(t, clientAt(t, storage.baseURL), spool, projectID, knowledgeBaseID, 0),
	} {
		flushAndClose(t, foreign)
		if requests, _ := contract.recorded(t); len(requests) != 0 || len(storage.arrived("")) != 0 || !reflect.DeepEqual(spoolFiles(t, spool), original) {
			t.Fatal("a recorder for another destination took the crashed answers")
		}
	}

	flushAndClose(t, recorderAt(t, client, spool, projectID, knowledgeBaseID, 0), recorderAt(t, client, spool, projectID, knowledgeBaseID, 0))
	flushAndClose(t, recorderAt(t, client, spool, projectID, knowledgeBaseID, 0))

	expectExactlyOnce(t, deliveredAnswers(t, contract.assertClean(t)), drafts)
	if left := spoolFiles(t, spool); len(left) != 0 {
		t.Fatalf("the spool still holds %v", left)
	}
}

func TestReplaysTheAnswersThatAClosedRecorderCouldNotSendExactlyOnce(t *testing.T) {
	storage := newStandIn(t)
	path := answersPath(projectID, knowledgeBaseID)
	accepted := rawReply{status: 200, body: []byte(`{"results": [], "recorded_count": 0}`)}
	storage.script(http.MethodPost, path, rawReply{status: 200, body: accepted.body, delay: 5 * time.Second}, accepted)
	spool := filepath.Join(t.TempDir(), "spool")
	client := clientAt(t, storage.baseURL)
	drafts := answerDrafts(12)
	stopped := recorderAt(t, client, spool, projectID, knowledgeBaseID, 200*time.Millisecond)
	stopped.Record(drafts)
	stopped.Close(context.Background())

	flushAndClose(t, recorderAt(t, client, spool, projectID, knowledgeBaseID, 0))

	arrived := storage.arrived(http.MethodPost)
	var replayed []recordedRequest
	for _, request := range arrived[1:] {
		var body any
		json.Unmarshal(request.body, &body)
		replayed = append(replayed, recordedRequest{Body: body})
	}
	expectExactlyOnce(t, deliveredAnswers(t, replayed), drafts)
}

func TestKeepsTheSpoolPrivateAndWritesNothingIntoAFolderThatOthersCanWrite(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("Windows reports no POSIX permission bits")
	}
	client := newClient(t)
	contract.stub(t, "record_answer_events", 503, map[string]any{"error": map[string]any{"code": "service_unavailable", "message": "Try again."}})
	private := filepath.Join(t.TempDir(), "spool")
	recorder := recorderAt(t, client, private, projectID, knowledgeBaseID, 50*time.Millisecond)
	recorder.Record(answerDrafts(3))
	folder, err := os.Stat(private)
	if err != nil || folder.Mode().Perm()&ownerOnlyBits != 0 {
		t.Fatalf("the spool folder is %v, %v", folder.Mode(), err)
	}
	names := spoolFiles(t, private)
	if len(names) == 0 {
		t.Fatal("the recorder kept no spool file")
	}
	for _, name := range names {
		if info, err := os.Stat(filepath.Join(private, name)); err != nil || info.Mode().Perm()&ownerOnlyBits != 0 {
			t.Fatalf("%s is %v, %v", name, info.Mode(), err)
		}
	}
	recorder.Close(context.Background())

	shared := filepath.Join(t.TempDir(), "shared")
	if err := os.Mkdir(shared, 0o700); err != nil || os.Chmod(shared, 0o777) != nil {
		t.Fatal("the shared folder could not be made")
	}
	sharedRecorder := recorderAt(t, client, shared, projectID, knowledgeBaseID, 50*time.Millisecond)
	sharedRecorder.Record(answerDrafts(3))
	sharedRecorder.Close(context.Background())
	if left := spoolFiles(t, shared); len(left) != 0 {
		t.Fatalf("the recorder wrote %v into a shared folder", left)
	}
}
