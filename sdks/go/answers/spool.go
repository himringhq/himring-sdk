package answers

import (
	"errors"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

const (
	SpoolHeartbeat            = 30 * time.Second
	spoolCompactAfterBytes    = 16 * 1024 * 1024
	recoveredFileMaximumBytes = 64 * 1024 * 1024
)

var (
	liveInstancesMutex sync.Mutex
	liveInstances      = map[string]bool{}
)

func isLiveInstance(instance string) bool {
	liveInstancesMutex.Lock()
	defer liveInstancesMutex.Unlock()
	return liveInstances[instance]
}

func setLiveInstance(instance string, live bool) {
	liveInstancesMutex.Lock()
	defer liveInstancesMutex.Unlock()
	if live {
		liveInstances[instance] = true
	} else {
		delete(liveInstances, instance)
	}
}

type spool struct {
	mutex         sync.Mutex
	instance      string
	host          string
	directory     string
	destination   string
	warn          func(string, map[string]any)
	heartbeat     func()
	file          *os.File
	filePath      string
	writtenBytes  int
	lineBreakOwed bool
	heartbeatStop chan struct{}
	closed        bool
}

func openSpool(directory string, destination string, warn func(string, map[string]any), heartbeat func()) *spool {
	if err := os.MkdirAll(directory, ownerOnlyDirectoryMode); err != nil {
		warn("The answer spool directory is unusable, so answers are kept in memory only", map[string]any{"directory": directory, "error": err})
		return nil
	}
	private, err := isPrivateDirectory(directory)
	if err != nil {
		warn("The answer spool directory is unusable, so answers are kept in memory only", map[string]any{"directory": directory, "error": err})
		return nil
	}
	if !private {
		warn("The answer spool directory is shared with other users, so answers are kept in memory only", map[string]any{"directory": directory})
		return nil
	}
	host, _ := os.Hostname()
	opened := &spool{instance: newIdentifier(), host: host, directory: directory, destination: destination, warn: warn, heartbeat: heartbeat}
	setLiveInstance(opened.instance, true)
	return opened
}

func (store *spool) append(items []spooledEvent) bool {
	if len(items) == 0 {
		return true
	}
	lines := make([]string, 0, len(items))
	for _, item := range items {
		lines = append(lines, eventLine(item))
	}
	store.mutex.Lock()
	defer store.mutex.Unlock()
	return store.write(strings.Join(lines, ""))
}

func (store *spool) markDone(ids []string) {
	if len(ids) == 0 {
		return
	}
	store.mutex.Lock()
	defer store.mutex.Unlock()
	if store.file == nil {
		return
	}
	store.write(doneLine(ids))
}

func (store *spool) settle(pending []spooledEvent) {
	store.mutex.Lock()
	defer store.mutex.Unlock()
	if store.file == nil {
		return
	}
	if len(pending) == 0 {
		store.discardFile()
		return
	}
	if store.writtenBytes > spoolCompactAfterBytes {
		store.replaceFile(pending)
	}
}

func (store *spool) close(keepUnsent bool, pending []spooledEvent) {
	store.mutex.Lock()
	defer store.mutex.Unlock()
	store.closed = true
	if store.heartbeatStop != nil {
		close(store.heartbeatStop)
		store.heartbeatStop = nil
	}
	if keepUnsent && len(pending) > 0 {
		store.closeFile()
	} else {
		store.discardFile()
	}
	setLiveInstance(store.instance, false)
}

func (store *spool) recoverOrphans() []spooledEvent {
	names, err := os.ReadDir(store.directory)
	if err != nil {
		store.warnLater("The answer spool directory could not be read", map[string]any{"directory": store.directory, "error": err})
		return nil
	}
	store.mutex.Lock()
	ownName := filepath.Base(store.filePath)
	store.mutex.Unlock()
	var recovered []spooledEvent
	for _, entry := range names {
		if !isSpoolFileName(entry.Name()) || entry.Name() == ownName {
			continue
		}
		recovered = append(recovered, store.recoverFile(filepath.Join(store.directory, entry.Name()))...)
	}
	return recovered
}

func (store *spool) warnLater(message string, details map[string]any) {
	store.warn(message, details)
}

func (store *spool) recoverFile(path string) []spooledEvent {
	info, err := os.Lstat(path)
	if err != nil || !isOwnRegularFile(info) {
		return nil
	}
	if store.claimIsLive(filepath.Base(path), info.ModTime()) {
		return nil
	}
	owner, known := ownerOf(path)
	if !known || owner.Destination != store.destination {
		return nil
	}
	if !isOrphaned(owner, known, info.ModTime(), store.host, time.Now()) {
		return nil
	}
	if info.Size() > recoveredFileMaximumBytes {
		store.warn("An answer spool file left by an earlier process is too large to send", map[string]any{"file_path": path})
		return nil
	}
	claimed := filepath.Join(store.directory, store.claimName())
	if err := os.Rename(path, claimed); err != nil {
		if !errors.Is(err, fs.ErrNotExist) {
			store.warn("An answer spool file left by an earlier process could not be read", map[string]any{"file_path": path, "error": err})
		}
		return nil
	}
	claimedInfo, err := os.Lstat(claimed)
	if err != nil || !isOwnRegularFile(claimedInfo) || claimedInfo.Size() > recoveredFileMaximumBytes {
		os.Remove(claimed)
		return nil
	}
	data, err := os.ReadFile(claimed)
	if err != nil {
		store.warn("An answer spool file left by an earlier process could not be read", map[string]any{"file_path": path, "error": err})
		return nil
	}
	events := unsentEvents(string(data))
	if !store.append(events) {
		return nil
	}
	os.Remove(claimed)
	return events
}

func (store *spool) ensureFile() (*os.File, error) {
	if store.file != nil {
		return store.file, nil
	}
	path := filepath.Join(store.directory, spoolFilePrefix+store.instance+"-"+newIdentifier()+spoolFileSuffix)
	file, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_EXCL|openNoFollow, ownerOnlyFileMode)
	if err != nil {
		return nil, err
	}
	store.file, store.filePath, store.writtenBytes, store.lineBreakOwed = file, path, 0, false
	if err := store.writeAll(ownerLine(spoolOwner{Host: store.host, PID: os.Getpid(), Instance: store.instance, Destination: store.destination})); err != nil {
		return nil, err
	}
	store.startHeartbeat()
	return file, nil
}

func (store *spool) write(text string) bool {
	if store.closed {
		return false
	}
	file, err := store.ensureFile()
	if err == nil {
		if store.lineBreakOwed {
			text = "\n" + text
		}
		if err = store.writeAll(text); err == nil {
			err = file.Sync()
		}
	}
	if err != nil {
		store.lineBreakOwed = true
		store.warn("An answer could not be written to the spool, so it is kept in memory only", map[string]any{"error": err})
		return false
	}
	store.lineBreakOwed = false
	return true
}

func (store *spool) writeAll(text string) error {
	written, err := store.file.WriteString(text)
	store.writtenBytes += written
	return err
}

func (store *spool) startHeartbeat() {
	if store.heartbeatStop != nil {
		return
	}
	stop := make(chan struct{})
	store.heartbeatStop = stop
	go func() {
		ticker := time.NewTicker(SpoolHeartbeat)
		defer ticker.Stop()
		for {
			select {
			case <-stop:
				return
			case <-ticker.C:
				store.heartbeat()
			}
		}
	}()
}

func (store *spool) touch(pending []spooledEvent) {
	store.mutex.Lock()
	defer store.mutex.Unlock()
	if store.filePath == "" || store.closed {
		return
	}
	now := time.Now()
	if err := os.Chtimes(store.filePath, now, now); err != nil && errors.Is(err, fs.ErrNotExist) {
		store.replaceFile(pending)
	}
}

func (store *spool) replaceFile(pending []spooledEvent) {
	previous := store.filePath
	store.closeFile()
	lines := make([]string, 0, len(pending))
	for _, item := range pending {
		lines = append(lines, eventLine(item))
	}
	if len(lines) > 0 && !store.write(strings.Join(lines, "")) {
		return
	}
	if previous != "" {
		os.Remove(previous)
	}
}

func (store *spool) discardFile() {
	previous := store.filePath
	store.closeFile()
	if previous != "" {
		os.Remove(previous)
	}
}

func (store *spool) closeFile() {
	if store.file != nil {
		store.file.Close()
	}
	store.file, store.filePath = nil, ""
	if store.heartbeatStop != nil {
		close(store.heartbeatStop)
		store.heartbeatStop = nil
	}
}
