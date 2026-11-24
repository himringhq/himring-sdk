package himring

import (
	"regexp"
	"strings"
)

var (
	lastExtensionPattern = regexp.MustCompile(`\.[^./]+$`)
	kindOfExtension      = kindsByExtension()
)

func kindsByExtension() map[string]FileKind {
	kinds := map[string]FileKind{}
	for _, kind := range fileKindList {
		for _, extension := range fileKindExtensions[kind] {
			kinds[extension] = kind
		}
	}
	return kinds
}

func FileKinds() []FileKind {
	return append([]FileKind(nil), fileKindList...)
}

func FileKindExtensions(kind FileKind) []string {
	return append([]string(nil), fileKindExtensions[kind]...)
}

func ReadableFileExtensions() []string {
	var extensions []string
	for _, kind := range fileKindList {
		extensions = append(extensions, fileKindExtensions[kind]...)
	}
	return extensions
}

func FileExtensionOf(path string) string {
	return strings.ToLower(lastExtensionPattern.FindString(path))
}

func FileKindOf(path string) (FileKind, bool) {
	kind, known := kindOfExtension[FileExtensionOf(path)]
	return kind, known
}
