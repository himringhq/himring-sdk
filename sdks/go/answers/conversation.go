package answers

import (
	"context"
	"strings"
	"sync"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const QuestionsPerTurnMaximum = 50

type Identity struct {
	EndUserID string
	CallID    string
}

type rememberedQuestion struct {
	questionID string
	returned   map[string]bool
}

type turn struct {
	questions []rememberedQuestion
	answer    string
}

type Conversation struct {
	recorder *Recorder
	identity Identity
	mutex    sync.Mutex
	current  turn
	answered *turn
}

func occurredNow() string {
	return time.Now().UTC().Format("2006-01-02T15:04:05.000Z")
}

func (conversation *Conversation) Search(ctx context.Context, input himring.SearchKnowledgeBaseInput, options ...himring.RequestOption) (*himring.SearchKnowledgeBaseOutput, error) {
	if conversation.identity.EndUserID != "" {
		input.EndUserID = himring.Ptr(conversation.identity.EndUserID)
	}
	if conversation.identity.CallID != "" {
		input.CallID = himring.Ptr(conversation.identity.CallID)
	}
	input.ProjectID = conversation.recorder.projectID
	input.KnowledgeBaseID = conversation.recorder.knowledgeBaseID
	result, err := conversation.recorder.client.SearchKnowledgeBase(ctx, input, options...)
	if err != nil {
		return nil, err
	}
	chunkIDs := make([]string, 0, len(result.Passages))
	for _, passage := range result.Passages {
		chunkIDs = append(chunkIDs, passage.ChunkID)
	}
	conversation.RememberSearch(result.QuestionID, chunkIDs)
	return result, nil
}

func (conversation *Conversation) startTurn() {
	if conversation.current.answer != "" {
		answered := conversation.current
		conversation.answered = &answered
	}
	conversation.current = turn{}
}

func (conversation *Conversation) RememberSearch(questionID string, chunkIDs []string) {
	conversation.mutex.Lock()
	defer conversation.mutex.Unlock()
	if conversation.current.answer != "" {
		conversation.startTurn()
	}
	returned := map[string]bool{}
	for _, id := range chunkIDs {
		returned[id] = true
	}
	for index, question := range conversation.current.questions {
		if question.questionID == questionID {
			conversation.current.questions[index].returned = returned
			return
		}
	}
	if len(conversation.current.questions) >= QuestionsPerTurnMaximum {
		return
	}
	conversation.current.questions = append(conversation.current.questions, rememberedQuestion{questionID: questionID, returned: returned})
}

func (conversation *Conversation) RecordAnswer(text string, citedChunkIDs []string) {
	conversation.mutex.Lock()
	piece, kept := boundedLongText(text, AnswerTextKeptMaximum)
	if len(conversation.current.questions) == 0 || !kept {
		conversation.mutex.Unlock()
		return
	}
	joined := piece
	if conversation.current.answer != "" {
		joined = conversation.current.answer + "\n" + piece
	}
	conversation.current.answer = utf16Prefix(joined, AnswerTextKeptMaximum)
	occurredAt := occurredNow()
	drafts := make([]EventDraft, 0, len(conversation.current.questions))
	for _, question := range conversation.current.questions {
		draft := EventDraft{QuestionID: question.questionID, Answer: conversation.current.answer, OccurredAt: occurredAt}
		if citedChunkIDs != nil {
			draft.CitedChunkIDs = []string{}
			seen := map[string]bool{}
			for _, id := range citedChunkIDs {
				if question.returned[id] && !seen[id] {
					seen[id] = true
					draft.CitedChunkIDs = append(draft.CitedChunkIDs, id)
				}
			}
		}
		drafts = append(drafts, draft)
	}
	answered := conversation.current
	conversation.answered = &answered
	conversation.mutex.Unlock()
	conversation.recorder.Record(drafts)
}

func (conversation *Conversation) RecordUserMessage(text string) {
	conversation.mutex.Lock()
	if conversation.current.answer == "" {
		conversation.mutex.Unlock()
		return
	}
	occurredAt := occurredNow()
	drafts := make([]EventDraft, 0, len(conversation.current.questions))
	for _, question := range conversation.current.questions {
		drafts = append(drafts, EventDraft{QuestionID: question.questionID, FollowUp: text, OccurredAt: occurredAt})
	}
	conversation.startTurn()
	conversation.mutex.Unlock()
	conversation.recorder.Record(drafts)
}

func (conversation *Conversation) targets(questionIDs []string, includeUnanswered bool) []string {
	if questionIDs != nil {
		return append([]string(nil), questionIDs...)
	}
	conversation.mutex.Lock()
	defer conversation.mutex.Unlock()
	currentCounts := conversation.current.answer != ""
	if includeUnanswered {
		currentCounts = len(conversation.current.questions) > 0
	}
	chosen := conversation.answered
	if currentCounts {
		chosen = &conversation.current
	}
	if chosen == nil {
		return nil
	}
	ids := make([]string, 0, len(chosen.questions))
	for _, question := range chosen.questions {
		ids = append(ids, question.questionID)
	}
	return ids
}

func (conversation *Conversation) RecordThumbsDown(questionIDs []string) {
	var drafts []EventDraft
	for _, questionID := range conversation.targets(questionIDs, false) {
		drafts = append(drafts, EventDraft{QuestionID: questionID, ThumbsDown: true})
	}
	conversation.recorder.Record(drafts)
}

func (conversation *Conversation) RecordHandoff(reason string, questionIDs []string) {
	var drafts []EventDraft
	for _, questionID := range conversation.targets(questionIDs, true) {
		drafts = append(drafts, EventDraft{QuestionID: questionID, HandoffReason: strings.Clone(reason)})
	}
	conversation.recorder.Record(drafts)
}

func (conversation *Conversation) End(ctx context.Context) error {
	return conversation.recorder.Flush(ctx)
}
