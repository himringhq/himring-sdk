//go:build !unix

package answers

import (
	"io/fs"
	"os"
)

const openNoFollow = 0

func processIsAlive(pid int) bool {
	if pid <= 0 {
		return false
	}
	process, err := os.FindProcess(pid)
	if err != nil {
		return false
	}
	process.Release()
	return true
}

func isOwnedByCurrentUser(fs.FileInfo) bool {
	return true
}
