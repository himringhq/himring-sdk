package answers

import (
	"context"
	"errors"
	"strconv"
	"time"
)

func (recorder *Recorder) run(interval time.Duration) {
	defer close(recorder.stopped)
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	for {
		select {
		case <-recorder.closing.Done():
			return
		case <-ticker.C:
			if recorder.BufferedEventCount() > 0 || recorder.recoveryIsDue() {
				recorder.flushInBackground()
			}
		case <-recorder.wake:
			if !recorder.acquire(recorder.closing) {
				return
			}
			recorder.drain(context.Background(), time.Now().Add(backgroundDeliveryWindow))
			recorder.release()
		}
	}
}

func (recorder *Recorder) flushInBackground() {
	select {
	case recorder.wake <- struct{}{}:
	default:
	}
}

func (recorder *Recorder) acquire(ctx context.Context) bool {
	if ctx.Err() != nil {
		return false
	}
	select {
	case recorder.drainSlot <- struct{}{}:
		return true
	case <-ctx.Done():
		return false
	}
}

func (recorder *Recorder) release() {
	<-recorder.drainSlot
}

func (recorder *Recorder) Flush(ctx context.Context) error {
	if ctx == nil {
		return errors.New("pass a context to Flush")
	}
	deadline := time.Now().Add(recorder.closeTimeout)
	wait, cancel := context.WithDeadline(ctx, deadline)
	defer cancel()
	if !recorder.acquire(wait) {
		return context.Cause(ctx)
	}
	defer recorder.release()
	recorder.mutex.Lock()
	closed := recorder.closed
	recorder.mutex.Unlock()
	if !closed {
		recorder.drain(wait, deadline)
	}
	return context.Cause(ctx)
}

func (recorder *Recorder) Close(ctx context.Context) error {
	if ctx == nil {
		return errors.New("pass a context to Close")
	}
	recorder.mutex.Lock()
	if !recorder.closed {
		recorder.closed = true
		recorder.closeDeadline = time.Now().Add(recorder.closeTimeout)
		recorder.markClosed()
		go recorder.finishClose()
	}
	recorder.mutex.Unlock()
	select {
	case <-recorder.closeDone:
		return context.Cause(ctx)
	case <-ctx.Done():
		return context.Cause(ctx)
	}
}

func (recorder *Recorder) finishClose() {
	defer close(recorder.closeDone)
	<-recorder.stopped
	recorder.acquire(context.Background())
	defer recorder.release()
	ctx, cancel := context.WithDeadline(context.Background(), recorder.closeDeadline)
	defer cancel()
	recorder.drain(ctx, recorder.closeDeadline)
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	if recorder.spool != nil {
		recorder.spool.close(true, recorder.snapshot())
	}
}

func (recorder *Recorder) effectiveDeadline(deadline time.Time) func() time.Time {
	return func() time.Time {
		recorder.mutex.Lock()
		defer recorder.mutex.Unlock()
		if !recorder.closeDeadline.IsZero() && recorder.closeDeadline.Before(deadline) {
			return recorder.closeDeadline
		}
		return deadline
	}
}

func (recorder *Recorder) recoveryIsDue() bool {
	if recorder.spool == nil {
		return false
	}
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	return time.Since(recorder.lastRecoveryAt) >= RecoveryInterval
}

func (recorder *Recorder) recoverOrphans() {
	if !recorder.recoveryIsDue() {
		return
	}
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	recorder.lastRecoveryAt = time.Now()
	recorder.enqueue(recorder.spool.recoverOrphans())
}

func (recorder *Recorder) nextBatch() ([]pendingEvent, int) {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	return nextBatch(recorder.pending, recorder.byteBudget), recorder.byteBudget
}

func (recorder *Recorder) drain(base context.Context, deadline time.Time) {
	recorder.recoverOrphans()
	policy := deliveryPolicy{maximumAttempts: recorder.maximumAttempts, deadline: recorder.effectiveDeadline(deadline), closing: recorder.closing}
	for {
		batch, _ := recorder.nextBatch()
		if len(batch) == 0 {
			break
		}
		outcome := deliverBatch(base, recorder, batch, policy)
		if outcome.kind == outcomeDeadlinePassed {
			return
		}
		if outcome.kind == outcomeTooLarge && len(batch) > 1 {
			recorder.mutex.Lock()
			recorder.byteBudget = max(1, outcome.bytes/2)
			recorder.mutex.Unlock()
			continue
		}
		recorder.settleBatch(batch, outcome)
	}
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	if recorder.spool != nil {
		recorder.spool.settle(recorder.snapshot())
	}
}

func (recorder *Recorder) settleBatch(batch []pendingEvent, outcome deliveryOutcome) {
	settled := map[string]bool{}
	ids := make([]string, 0, len(batch))
	for _, item := range batch {
		settled[item.ID] = true
		ids = append(ids, item.ID)
	}
	recorder.mutex.Lock()
	kept := recorder.pending[:0:0]
	for _, item := range recorder.pending {
		if !settled[item.ID] {
			kept = append(kept, item)
		}
	}
	recorder.pending = kept
	if recorder.spool != nil {
		recorder.spool.markDone(ids)
	}
	recorder.mutex.Unlock()
	switch outcome.kind {
	case outcomeDelivered:
		if len(outcome.unknownQuestionIDs) > 0 {
			recorder.warn("Himring did not recognize some question IDs, so it ignored their events", map[string]any{"question_ids": outcome.unknownQuestionIDs})
		}
		return
	case outcomeTooLarge:
		recorder.warn("Himring did not accept a batch of answer events, so the batch was dropped", map[string]any{
			"event_count": len(batch), "reason": "the event holds " + strconv.Itoa(outcome.bytes) + " bytes",
		})
	default:
		recorder.warn("Himring did not accept a batch of answer events, so the batch was dropped", map[string]any{"event_count": len(batch), "reason": outcome.reason})
	}
}
