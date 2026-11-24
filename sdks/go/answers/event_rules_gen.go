package answers

import "regexp"

const (
	answerEventsPerRequest = 100
	citedChunksMaximum     = 50
	handoffReasonMaximum   = 200
)

var (
	questionIDPattern = regexp.MustCompile("^qst_[0-9a-f]{32}$")
	chunkIDPattern    = regexp.MustCompile("^chk_[0-9a-f]{32}$")
	occurredAtPattern = regexp.MustCompile("^\\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\\d|0[1-9]|3[01])[T ](?:0\\d|1\\d|2[0-3])(?::[0-5]\\d){2}(?:\\.\\d{1,9})?(?:Z| ?[+-](?:0\\d|1\\d|2[0-3])(?::?[0-5]\\d)?)$")
)
