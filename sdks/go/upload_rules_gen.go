package himring

import "regexp"

const (
	uploadSizeMaximum         = 9007199254740991
	signablePartNumberMaximum = 10000
)

var sha256HexPattern = regexp.MustCompile("^[0-9a-f]{64}$")
