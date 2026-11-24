package answers

import (
	"strings"
	"unicode"
	"unicode/utf16"

	himring "github.com/himringhq/himring-sdk/sdks/go"
)

const (
	AnswerTextKeptMaximum = 65_536
	byteOrderMark         = rune(0xFEFF)
)

type Event = himring.RecordAnswerEventsInputEventsItem

type EventDraft struct {
	QuestionID    string
	Answer        string
	FollowUp      string
	CitedChunkIDs []string
	ThumbsDown    bool
	HandoffReason string
	OccurredAt    string
}

func isJavaScriptSpace(character rune) bool {
	return unicode.IsSpace(character) || character == byteOrderMark
}

func isControl(character rune) bool {
	return unicode.Is(unicode.Cc, character)
}

func utf16Prefix(text string, maximum int) string {
	var builder strings.Builder
	units := 0
	for _, character := range text {
		width := utf16.RuneLen(character)
		if width < 1 {
			width = 1
		}
		if units+width > maximum {
			if units < maximum {
				builder.WriteRune(unicode.ReplacementChar)
			}
			break
		}
		builder.WriteRune(character)
		units += width
	}
	return builder.String()
}

func wellFormed(text string) string {
	return strings.ToValidUTF8(text, string(unicode.ReplacementChar))
}

func boundedLongText(text string, maximum int) (string, bool) {
	cleaned := strings.Map(func(character rune) rune {
		if isControl(character) && character != '\n' && character != '\r' && character != '\t' {
			return -1
		}
		return character
	}, wellFormed(text))
	cleaned = utf16Prefix(strings.TrimFunc(cleaned, isJavaScriptSpace), maximum)
	return cleaned, cleaned != ""
}

func boundedHandoffReason(reason string) (string, bool) {
	cleaned := strings.Map(func(character rune) rune {
		if isControl(character) {
			return ' '
		}
		return character
	}, wellFormed(reason))
	cleaned = strings.TrimFunc(utf16Prefix(strings.TrimFunc(cleaned, isJavaScriptSpace), handoffReasonMaximum), isJavaScriptSpace)
	return cleaned, cleaned != ""
}

func citedChunksOf(ids []string) []string {
	seen := map[string]bool{}
	cited := []string{}
	for _, id := range ids {
		if seen[id] {
			continue
		}
		seen[id] = true
		if chunkIDPattern.MatchString(id) {
			cited = append(cited, id)
		}
	}
	return cited[:min(len(cited), citedChunksMaximum)]
}

func wireEvent(draft EventDraft) (Event, bool) {
	if !questionIDPattern.MatchString(draft.QuestionID) {
		return Event{}, false
	}
	event := Event{QuestionID: draft.QuestionID}
	if answer, kept := boundedLongText(draft.Answer, AnswerTextKeptMaximum); kept {
		event.Answer = &answer
	}
	if followUp, kept := boundedLongText(draft.FollowUp, AnswerTextKeptMaximum); kept {
		event.FollowUp = &followUp
	}
	if reason, kept := boundedHandoffReason(draft.HandoffReason); kept {
		event.HandoffReason = &reason
	}
	if draft.CitedChunkIDs != nil {
		event.CitedChunkIDs = citedChunksOf(draft.CitedChunkIDs)
	}
	if draft.ThumbsDown {
		thumbsDown := true
		event.ThumbsDown = &thumbsDown
	}
	if draft.OccurredAt != "" {
		if !occurredAtPattern.MatchString(draft.OccurredAt) {
			return Event{}, false
		}
		occurredAt := draft.OccurredAt
		event.OccurredAt = &occurredAt
	}
	carriesSignal := event.Answer != nil || event.FollowUp != nil || event.CitedChunkIDs != nil ||
		event.ThumbsDown != nil || event.HandoffReason != nil
	return event, carriesSignal
}

func draftOf(event Event) EventDraft {
	draft := EventDraft{QuestionID: event.QuestionID, CitedChunkIDs: event.CitedChunkIDs}
	if event.Answer != nil {
		draft.Answer = *event.Answer
	}
	if event.FollowUp != nil {
		draft.FollowUp = *event.FollowUp
	}
	if event.HandoffReason != nil {
		draft.HandoffReason = *event.HandoffReason
	}
	if event.OccurredAt != nil {
		draft.OccurredAt = *event.OccurredAt
	}
	draft.ThumbsDown = event.ThumbsDown != nil && *event.ThumbsDown
	return draft
}
