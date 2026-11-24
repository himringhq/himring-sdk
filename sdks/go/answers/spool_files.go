package answers

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"io/fs"
	"os"
	"strings"
	"time"
)

const (
	spoolFilePrefix        = "answers-"
	spoolFileSuffix        = ".jsonl"
	SpoolOrphanAfter       = 5 * time.Minute
	ownerOnlyFileMode      = 0o600
	ownerOnlyDirectoryMode = 0o700
	groupOrOtherWriteBits  = 0o022
	spoolHeaderReadBytes   = 4096
)

type spooledEvent struct {
	ID    string
	Event Event
}

type spoolOwner struct {
	Kind        string `json:"kind"`
	Host        string `json:"host"`
	PID         int    `json:"pid"`
	Instance    string `json:"instance"`
	Destination string `json:"destination"`
}

type spoolLine struct {
	Kind  string          `json:"kind"`
	ID    string          `json:"id,omitempty"`
	Event json.RawMessage `json:"event,omitempty"`
	IDs   []string        `json:"ids,omitempty"`
}

func newIdentifier() string {
	var raw [16]byte
	if _, err := rand.Read(raw[:]); err != nil {
		panic(err)
	}
	raw[6] = raw[6]&0x0f | 0x40
	raw[8] = raw[8]&0x3f | 0x80
	text := hex.EncodeToString(raw[:])
	return text[0:8] + "-" + text[8:12] + "-" + text[12:16] + "-" + text[16:20] + "-" + text[20:32]
}

func jsonLine(value any) string {
	var buffer bytes.Buffer
	encoder := json.NewEncoder(&buffer)
	encoder.SetEscapeHTML(false)
	if err := encoder.Encode(value); err != nil {
		return ""
	}
	return buffer.String()
}

func ownerLine(owner spoolOwner) string {
	owner.Kind = "owner"
	return jsonLine(owner)
}

func eventLine(item spooledEvent) string {
	return jsonLine(struct {
		Kind  string `json:"kind"`
		ID    string `json:"id"`
		Event Event  `json:"event"`
	}{Kind: "event", ID: item.ID, Event: item.Event})
}

func doneLine(ids []string) string {
	return jsonLine(struct {
		Kind string   `json:"kind"`
		IDs  []string `json:"ids"`
	}{Kind: "done", IDs: ids})
}

func unsentEvents(text string) []spooledEvent {
	var order []string
	events := map[string]Event{}
	done := map[string]bool{}
	for _, raw := range strings.Split(text, "\n") {
		if strings.TrimSpace(raw) == "" {
			continue
		}
		var line spoolLine
		if err := json.Unmarshal([]byte(raw), &line); err != nil {
			continue
		}
		switch line.Kind {
		case "event":
			var event Event
			if line.ID == "" || json.Unmarshal(line.Event, &event) != nil {
				continue
			}
			checked, valid := wireEvent(draftOf(event))
			if !valid {
				continue
			}
			if _, seen := events[line.ID]; !seen {
				order = append(order, line.ID)
			}
			events[line.ID] = checked
		case "done":
			for _, id := range line.IDs {
				done[id] = true
			}
		}
	}
	var unsent []spooledEvent
	for _, id := range order {
		if !done[id] {
			unsent = append(unsent, spooledEvent{ID: id, Event: events[id]})
		}
	}
	return unsent
}

func ownerOf(path string) (spoolOwner, bool) {
	file, err := os.OpenFile(path, os.O_RDONLY|openNoFollow, 0)
	if err != nil {
		return spoolOwner{}, false
	}
	defer file.Close()
	buffer := make([]byte, spoolHeaderReadBytes)
	count, err := io.ReadFull(file, buffer)
	if err != nil && !errors.Is(err, io.ErrUnexpectedEOF) && !errors.Is(err, io.EOF) {
		return spoolOwner{}, false
	}
	first, _, _ := strings.Cut(string(buffer[:count]), "\n")
	var owner spoolOwner
	if json.Unmarshal([]byte(first), &owner) != nil || owner.Kind != "owner" {
		return spoolOwner{}, false
	}
	return owner, true
}

func isOrphaned(owner spoolOwner, known bool, modifiedAt time.Time, host string, now time.Time) bool {
	if !known || owner.Host != host {
		return now.Sub(modifiedAt) > SpoolOrphanAfter
	}
	if owner.PID == os.Getpid() {
		return !isLiveInstance(owner.Instance)
	}
	return !processIsAlive(owner.PID)
}

func isPrivateDirectory(directory string) (bool, error) {
	info, err := os.Lstat(directory)
	if err != nil {
		return false, err
	}
	if !info.IsDir() || info.Mode().Perm()&groupOrOtherWriteBits != 0 {
		return false, nil
	}
	return isOwnedByCurrentUser(info), nil
}

func isOwnRegularFile(info fs.FileInfo) bool {
	return info.Mode().IsRegular() && isOwnedByCurrentUser(info)
}

func isSpoolFileName(name string) bool {
	return strings.HasPrefix(name, spoolFilePrefix) && strings.HasSuffix(name, spoolFileSuffix)
}
