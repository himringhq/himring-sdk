package himring

import (
	"context"
	"errors"
	"sync"
	"time"
)

var (
	errCallTimedOut = errors.New("the call passed its time limit")
	errCallIdle     = errors.New("the call made no progress within its idle time limit")
)

type idleWatch struct {
	mutex   sync.Mutex
	timer   *time.Timer
	idle    time.Duration
	stopped bool
}

func newIdleWatch(idle time.Duration, cancel context.CancelCauseFunc) *idleWatch {
	watch := &idleWatch{idle: idle}
	watch.timer = time.AfterFunc(idle, func() { cancel(errCallIdle) })
	return watch
}

func (watch *idleWatch) touch() {
	watch.mutex.Lock()
	defer watch.mutex.Unlock()
	if watch.stopped {
		return
	}
	if watch.timer.Stop() {
		watch.timer.Reset(watch.idle)
	}
}

func (watch *idleWatch) stop() {
	watch.mutex.Lock()
	defer watch.mutex.Unlock()
	watch.stopped = true
	watch.timer.Stop()
}

type watchedBody struct {
	body  interface{ Read([]byte) (int, error) }
	watch *idleWatch
}

func (reader watchedBody) Read(buffer []byte) (int, error) {
	count, err := reader.body.Read(buffer)
	reader.watch.touch()
	return count, err
}

func failureCause(callContext context.Context, parent context.Context) (error, bool) {
	if parent.Err() != nil {
		return context.Cause(parent), true
	}
	cause := context.Cause(callContext)
	if errors.Is(cause, errCallTimedOut) || errors.Is(cause, errCallIdle) {
		return cause, false
	}
	return nil, false
}
