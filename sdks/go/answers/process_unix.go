//go:build unix

package answers

import (
	"errors"
	"io/fs"
	"os"
	"syscall"
)

const openNoFollow = syscall.O_NOFOLLOW

func processIsAlive(pid int) bool {
	if pid <= 0 {
		return false
	}
	err := syscall.Kill(pid, 0)
	return err == nil || !errors.Is(err, syscall.ESRCH)
}

func isOwnedByCurrentUser(info fs.FileInfo) bool {
	status, known := info.Sys().(*syscall.Stat_t)
	return !known || int(status.Uid) == os.Getuid()
}
