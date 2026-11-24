package answers

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"math"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	DefaultFlushInterval     = 5 * time.Second
	DefaultBufferMaximum     = 10_000
	DefaultCloseTimeout      = 10 * time.Second
	RecoveryInterval         = 60 * time.Second
	dropWarningInterval      = 10 * time.Second
	backgroundDeliveryWindow = 10 * time.Minute
	spoolDirectoryName       = "himring-answer-spool"
)

type Logger interface {
	Warn(message string, details map[string]any)
}

type Options struct {
	Client                *himring.Client
	ProjectID             string
	KnowledgeBaseID       string
	SpoolDirectory        string
	DisableSpool          bool
	FlushInterval         time.Duration
	MaximumBufferedEvents int
	MaximumAttempts       int
	CloseTimeout          time.Duration
	Logger                Logger
}

type slogLogger struct{}

func (slogLogger) Warn(message string, details map[string]any) {
	names := make([]string, 0, len(details))
	for name := range details {
		names = append(names, name)
	}
	sort.Strings(names)
	attributes := make([]any, 0, len(names))
	for _, name := range names {
		attributes = append(attributes, slog.Any(name, details[name]))
	}
	slog.Default().Warn("[himring] "+message, attributes...)
}

func defaultSpoolDirectory() string {
	name := spoolDirectoryName
	if uid := os.Getuid(); uid >= 0 {
		name = fmt.Sprintf("%s-%d", name, uid)
	}
	return filepath.Join(os.TempDir(), name)
}

type Recorder struct {
	client          *himring.Client
	projectID       string
	knowledgeBaseID string
	logger          Logger
	maximumBuffered int
	maximumAttempts int
	closeTimeout    time.Duration
	spool           *spool

	mutex             sync.Mutex
	pending           []pendingEvent
	byteBudget        int
	lastRecoveryAt    time.Time
	droppedCount      int
	lastDropWarningAt time.Time
	closed            bool
	closeDeadline     time.Time
	warningsMutex     sync.Mutex
	warnings          []recorderWarning
	warningActive     bool

	drainSlot  chan struct{}
	wake       chan struct{}
	closing    context.Context
	markClosed context.CancelFunc
	stopped    chan struct{}
	closeDone  chan struct{}
}

func NewRecorder(options Options) (*Recorder, error) {
	if options.Client == nil {
		return nil, errors.New("pass the Himring client that sends the answers")
	}
	closing, markClosed := context.WithCancel(context.Background())
	recorder := &Recorder{
		client: options.Client, projectID: options.ProjectID, knowledgeBaseID: options.KnowledgeBaseID,
		logger: options.Logger, maximumBuffered: atLeastOne(options.MaximumBufferedEvents, DefaultBufferMaximum),
		maximumAttempts: atLeastOne(options.MaximumAttempts, DefaultDeliveryAttempts), closeTimeout: DefaultCloseTimeout,
		byteBudget: math.MaxInt, drainSlot: make(chan struct{}, 1), wake: make(chan struct{}, 1),
		closing: closing, markClosed: markClosed, stopped: make(chan struct{}), closeDone: make(chan struct{}),
	}
	if recorder.logger == nil {
		recorder.logger = slogLogger{}
	}
	if options.CloseTimeout > 0 {
		recorder.closeTimeout = options.CloseTimeout
	} else if options.CloseTimeout < 0 {
		recorder.closeTimeout = 0
	}
	if !options.DisableSpool {
		directory := options.SpoolDirectory
		if directory == "" {
			directory = defaultSpoolDirectory()
		}
		destination := jsonLine([]string{options.Client.BaseURL(), options.ProjectID, options.KnowledgeBaseID})
		recorder.spool = openSpool(directory, destination[:len(destination)-1], recorder.warn, recorder.touchSpool)
	}
	interval := options.FlushInterval
	if interval <= 0 {
		interval = DefaultFlushInterval
	}
	go recorder.run(interval)
	recorder.flushInBackground()
	return recorder, nil
}

func atLeastOne(value int, fallback int) int {
	if value <= 0 {
		return fallback
	}
	return value
}

func (recorder *Recorder) DroppedEventCount() int {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	return recorder.droppedCount
}

func (recorder *Recorder) BufferedEventCount() int {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	return len(recorder.pending)
}

func (recorder *Recorder) Conversation(identity Identity) *Conversation {
	return &Conversation{recorder: recorder, identity: identity}
}

func (recorder *Recorder) snapshot() []spooledEvent {
	items := make([]spooledEvent, 0, len(recorder.pending))
	for _, item := range recorder.pending {
		items = append(items, spooledEvent{ID: item.ID, Event: item.Event})
	}
	return items
}

func (recorder *Recorder) Record(drafts []EventDraft) {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	if recorder.closed {
		return
	}
	var items []spooledEvent
	for _, draft := range drafts {
		if event, valid := wireEvent(draft); valid {
			items = append(items, spooledEvent{ID: newIdentifier(), Event: event})
		}
	}
	if recorder.spool != nil {
		recorder.spool.append(items)
	}
	if recorder.enqueue(items) >= answerEventsPerRequest {
		recorder.flushInBackground()
	}
}

func (recorder *Recorder) enqueue(items []spooledEvent) int {
	for _, item := range items {
		recorder.pending = append(recorder.pending, pendingEvent{ID: item.ID, Event: item.Event, Bytes: encodedSize(item.Event)})
	}
	var dropped []string
	if excess := len(recorder.pending) - recorder.maximumBuffered; excess > 0 {
		for _, item := range recorder.pending[:excess] {
			dropped = append(dropped, item.ID)
		}
		recorder.pending = append([]pendingEvent(nil), recorder.pending[excess:]...)
		recorder.droppedCount += excess
	}
	count := len(recorder.pending)
	warnNow := len(dropped) > 0 && time.Since(recorder.lastDropWarningAt) >= dropWarningInterval
	droppedCount := recorder.droppedCount
	if warnNow {
		recorder.lastDropWarningAt = time.Now()
	}
	if recorder.spool != nil {
		recorder.spool.markDone(dropped)
	}
	if warnNow {
		recorder.warn("The answer buffer is full, so the oldest events were dropped", map[string]any{
			"dropped_event_count": droppedCount, "maximum_buffered_events": recorder.maximumBuffered,
		})
	}
	return count
}

func (recorder *Recorder) touchSpool() {
	recorder.mutex.Lock()
	defer recorder.mutex.Unlock()
	if recorder.spool != nil {
		recorder.spool.touch(recorder.snapshot())
	}
}
