package tests

import (
	"context"
	"errors"
	"path/filepath"
	"sync"
	"testing"
	"time"

	"github.com/himringhq/himring-sdk/sdks/go/answers"
)

type callbackLogger struct {
	warn func()
}

func (logger callbackLogger) Warn(string, map[string]any) {
	logger.warn()
}

func TestRecorderLoggerCanFlushAndCloseTheRecorder(t *testing.T) {
	client := newClient(t)
	drafts := answerDrafts(1)
	contract.stub(t, "record_answer_events", 200, map[string]any{
		"results": []any{map[string]any{"question_id": drafts[0].QuestionID, "outcome": "question_not_found"}}, "recorded_count": 0,
	})
	ready := make(chan *answers.Recorder, 1)
	finished := make(chan error, 1)
	logger := callbackLogger{warn: func() {
		recorder := <-ready
		ctx, cancel := context.WithTimeout(context.Background(), controlTimeout)
		defer cancel()
		if err := recorder.Flush(ctx); err != nil {
			finished <- err
			return
		}
		finished <- recorder.Close(ctx)
	}}
	recorder, err := answers.NewRecorder(answers.Options{
		Client: client, ProjectID: projectID, KnowledgeBaseID: knowledgeBaseID,
		SpoolDirectory: filepath.Join(t.TempDir(), "spool"), Logger: logger,
	})
	if err != nil {
		t.Fatal(err)
	}
	ready <- recorder
	recorder.Record(drafts)
	ctx, cancel := context.WithTimeout(context.Background(), controlTimeout)
	defer cancel()
	if err := recorder.Flush(ctx); err != nil {
		t.Fatal(err)
	}
	select {
	case err := <-finished:
		if err != nil {
			t.Fatal(err)
		}
	case <-ctx.Done():
		t.Fatal("the logger could not close the recorder")
	}
	expectExactlyOnce(t, deliveredAnswers(t, contract.assertClean(t)), drafts)
}

func TestCanceledCloseReleasesUnsentAnswersForAnotherRecorder(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "record_answer_events", 503,
		map[string]any{"error": map[string]any{"code": "service_unavailable", "message": "Try again."}},
		map[string]string{"retry-after": "1"})
	spool := filepath.Join(t.TempDir(), "spool")
	recorder := recorderAt(t, client, spool, projectID, knowledgeBaseID, 100*time.Millisecond)
	drafts := answerDrafts(1)
	recorder.Record(drafts)
	canceled, cancel := context.WithCancel(context.Background())
	cancel()
	if err := recorder.Close(canceled); !errors.Is(err, context.Canceled) {
		t.Fatalf("Close returned %v", err)
	}
	ctx, stop := context.WithTimeout(context.Background(), controlTimeout)
	defer stop()
	if err := recorder.Close(ctx); err != nil {
		t.Fatal(err)
	}
	contract.reset(t)
	contract.stub(t, "record_answer_events", 200, map[string]any{"results": []any{}, "recorded_count": 1})
	flushAndClose(t, recorderAt(t, client, spool, projectID, knowledgeBaseID, 0))
	expectExactlyOnce(t, deliveredAnswers(t, contract.assertClean(t)), drafts)
}

func TestConcurrentRecordingAndFlushingPreserveEveryAnswerAcrossClose(t *testing.T) {
	client := newClient(t)
	contract.stub(t, "record_answer_events", 200, map[string]any{"results": []any{}, "recorded_count": 0})
	spool := filepath.Join(t.TempDir(), "spool")
	recorder := recorderAt(t, client, spool, projectID, knowledgeBaseID, -time.Second)
	drafts := answerDrafts(200)
	var writers sync.WaitGroup
	for _, draft := range drafts {
		writers.Go(func() {
			recorder.Record([]answers.EventDraft{draft})
			recorder.Flush(context.Background())
		})
	}
	writers.Wait()
	if err := recorder.Close(context.Background()); err != nil {
		t.Fatal(err)
	}
	flushAndClose(t, recorderAt(t, client, spool, projectID, knowledgeBaseID, 0))
	delivered := deliveredAnswers(t, contract.assertClean(t))
	for _, draft := range drafts {
		if len(delivered[draft.QuestionID]) == 0 {
			t.Fatalf("the recorder lost %s", draft.QuestionID)
		}
	}
}
