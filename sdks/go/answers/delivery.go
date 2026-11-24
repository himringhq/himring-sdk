package answers

import (
	"context"
	"encoding/json"
	"errors"
	"math/rand/v2"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	DefaultDeliveryAttempts = 6
	httpPayloadTooLarge     = 413
	httpTooManyRequests     = 429
	httpServerErrorMinimum  = 500
	retryAfterCeiling       = 60 * time.Second
	backoffFirst            = 500 * time.Millisecond
	backoffCeiling          = 30 * time.Second
	deliveryOrigin          = "sdk"
	questionNotFoundOutcome = "question_not_found"
)

type pendingEvent struct {
	ID    string
	Event Event
	Bytes int
}

type outcomeKind int

const (
	outcomeDelivered outcomeKind = iota
	outcomeTooLarge
	outcomeRefused
	outcomeGaveUp
	outcomeDeadlinePassed
)

type deliveryOutcome struct {
	kind               outcomeKind
	unknownQuestionIDs []string
	bytes              int
	reason             string
}

type deliveryPolicy struct {
	maximumAttempts int
	deadline        func() time.Time
	closing         context.Context
}

func encodedSize(event Event) int {
	encoded, err := json.Marshal(event)
	if err != nil {
		return 0
	}
	return len(encoded)
}

func nextBatch(pending []pendingEvent, byteBudget int) []pendingEvent {
	var batch []pendingEvent
	total := 0
	for _, item := range pending {
		if len(batch) >= answerEventsPerRequest {
			break
		}
		if len(batch) > 0 && total+item.Bytes > byteBudget {
			break
		}
		batch = append(batch, item)
		total += item.Bytes
	}
	return batch
}

func isRetryable(err error) bool {
	apiError, isAPIError := himring.AsError(err)
	if !isAPIError {
		return true
	}
	if apiError.Kind == himring.ErrorKindNetwork || apiError.Kind == himring.ErrorKindTimeout {
		return true
	}
	return apiError.Status == httpTooManyRequests || apiError.Status >= httpServerErrorMinimum
}

func retryDelay(err error, attempt int) time.Duration {
	if apiError, isAPIError := himring.AsError(err); isAPIError && apiError.RetryAfterSeconds != nil {
		seconds := *apiError.RetryAfterSeconds
		if seconds > int64(retryAfterCeiling/time.Second) {
			return retryAfterCeiling
		}
		return time.Duration(seconds) * time.Second
	}
	ceiling := backoffCeiling
	if attempt < 16 {
		ceiling = min(backoffCeiling, backoffFirst<<attempt)
	}
	return rand.N(ceiling)
}

func pauseUnlessClosing(wait time.Duration, closing context.Context) {
	timer := time.NewTimer(wait)
	defer timer.Stop()
	select {
	case <-timer.C:
	case <-closing.Done():
	}
}

func attemptContext(base context.Context, policy deliveryPolicy) (context.Context, func()) {
	attempt, cancel := context.WithDeadline(base, policy.deadline())
	stop := context.AfterFunc(policy.closing, func() {
		time.AfterFunc(time.Until(policy.deadline()), cancel)
	})
	return attempt, func() {
		stop()
		cancel()
	}
}

func deliverBatch(base context.Context, target *Recorder, batch []pendingEvent, policy deliveryPolicy) deliveryOutcome {
	events := make([]Event, 0, len(batch))
	total := 0
	for _, item := range batch {
		events = append(events, item.Event)
		total += item.Bytes
	}
	origin := deliveryOrigin
	input := himring.RecordAnswerEventsInput{ProjectID: target.projectID, KnowledgeBaseID: target.knowledgeBaseID, Origin: &origin, Events: events}
	for attempt := 1; ; attempt++ {
		if !time.Now().Before(policy.deadline()) || base.Err() != nil {
			return deliveryOutcome{kind: outcomeDeadlinePassed}
		}
		attemptCtx, release := attemptContext(base, policy)
		reply, err := target.client.RecordAnswerEvents(attemptCtx, input)
		passed := attemptCtx.Err() != nil
		release()
		if err == nil {
			var unknown []string
			for _, result := range reply.Results {
				if result.Outcome == questionNotFoundOutcome {
					unknown = append(unknown, result.QuestionID)
				}
			}
			return deliveryOutcome{kind: outcomeDelivered, unknownQuestionIDs: unknown}
		}
		if passed || errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
			return deliveryOutcome{kind: outcomeDeadlinePassed}
		}
		if apiError, isAPIError := himring.AsError(err); isAPIError && apiError.Status == httpPayloadTooLarge {
			return deliveryOutcome{kind: outcomeTooLarge, bytes: total}
		}
		if !isRetryable(err) {
			return deliveryOutcome{kind: outcomeRefused, reason: himring.DescribeError(err)}
		}
		if attempt >= policy.maximumAttempts {
			return deliveryOutcome{kind: outcomeGaveUp, reason: himring.DescribeError(err)}
		}
		wait := retryDelay(err, attempt)
		if time.Now().Add(wait).After(policy.deadline()) {
			return deliveryOutcome{kind: outcomeDeadlinePassed}
		}
		pauseUnlessClosing(wait, policy.closing)
	}
}
