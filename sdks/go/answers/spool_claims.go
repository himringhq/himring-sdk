package answers

import (
	"crypto/sha256"
	"encoding/hex"
	"os"
	"strconv"
	"strings"
	"time"
)

const spoolClaimPrefix = spoolFilePrefix + "claimed-"

func hostFingerprint(host string) string {
	digest := sha256.Sum256([]byte(host))
	return hex.EncodeToString(digest[:])
}

func (store *spool) claimName() string {
	return spoolClaimPrefix + strings.Join([]string{
		hostFingerprint(store.host), strconv.Itoa(os.Getpid()), store.instance, newIdentifier(),
	}, "_") + spoolFileSuffix
}

func (store *spool) claimIsLive(name string, modifiedAt time.Time) bool {
	if !strings.HasPrefix(name, spoolClaimPrefix) {
		return false
	}
	parts := strings.Split(strings.TrimSuffix(strings.TrimPrefix(name, spoolClaimPrefix), spoolFileSuffix), "_")
	if len(parts) != 4 {
		return time.Since(modifiedAt) <= SpoolOrphanAfter
	}
	pid, err := strconv.Atoi(parts[1])
	if err != nil || pid <= 0 {
		return time.Since(modifiedAt) <= SpoolOrphanAfter
	}
	owner := spoolOwner{Host: parts[0], PID: pid, Instance: parts[2]}
	return !isOrphaned(owner, true, modifiedAt, hostFingerprint(store.host), time.Now())
}
