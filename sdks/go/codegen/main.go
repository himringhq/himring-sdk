package main

import (
	"bytes"
	"errors"
	"flag"
	"fmt"
	"go/format"
	"os"
	"path/filepath"
	"strings"
)

const generateCommand = "pnpm nx run sdk-go:generate"

type generatedFile struct {
	path string
	text []byte
}

func renderedFiles(specDirectory string) ([]generatedFile, int, error) {
	model, err := loadSpecModel(specDirectory)
	if err != nil {
		return nil, 0, err
	}
	types, err := renderTypes(model)
	if err != nil {
		return nil, 0, err
	}
	operations, err := renderOperations(model, types)
	if err != nil {
		return nil, 0, err
	}
	methods, err := renderMethods(model, types)
	if err != nil {
		return nil, 0, err
	}
	answerRules, err := renderAnswerRules(model)
	if err != nil {
		return nil, 0, err
	}
	sources := []struct{ path, text string }{
		{"types_gen.go", types.text},
		{"operations_gen.go", operations},
		{"methods_gen.go", methods},
		{filepath.Join("answers", "event_rules_gen.go"), answerRules},
	}
	files := make([]generatedFile, 0, len(sources))
	for _, source := range sources {
		formatted, err := format.Source([]byte(source.text))
		if err != nil {
			return nil, 0, fmt.Errorf("gofmt could not tidy %s: %w", source.path, err)
		}
		files = append(files, generatedFile{path: source.path, text: formatted})
	}
	return files, len(model.operations), nil
}

func committedText(path string) []byte {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	return data
}

func check(files []generatedFile, outputDirectory string) error {
	var stale []string
	for _, file := range files {
		if !bytes.Equal(committedText(filepath.Join(outputDirectory, file.path)), file.text) {
			stale = append(stale, filepath.ToSlash(file.path))
		}
	}
	if len(stale) > 0 {
		return fmt.Errorf("%s differ from the spec. Run %s and commit", strings.Join(stale, ", "), generateCommand)
	}
	return nil
}

func write(files []generatedFile, outputDirectory string) error {
	for _, file := range files {
		path := filepath.Join(outputDirectory, file.path)
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			return err
		}
		pending := fmt.Sprintf("%s.%d.pending", path, os.Getpid())
		if err := os.WriteFile(pending, file.text, 0o644); err != nil {
			os.Remove(pending)
			return err
		}
		if err := os.Rename(pending, path); err != nil {
			os.Remove(pending)
			return err
		}
	}
	return nil
}

func run(arguments []string) error {
	flags := flag.NewFlagSet("codegen", flag.ContinueOnError)
	specDirectory := flags.String("spec-directory", filepath.Join("..", "..", "spec"), "the folder that holds the OpenAPI documents")
	outputDirectory := flags.String("output-directory", ".", "the root of the Go module")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if flags.NArg() != 1 || (flags.Arg(0) != "write" && flags.Arg(0) != "check") {
		return errors.New("run with write or check")
	}
	files, count, err := renderedFiles(*specDirectory)
	if err != nil {
		return err
	}
	if flags.Arg(0) == "check" {
		if err := check(files, *outputDirectory); err != nil {
			return err
		}
		fmt.Printf("The generated Go files match the spec for %d operations.\n", count)
		return nil
	}
	if err := write(files, *outputDirectory); err != nil {
		return err
	}
	fmt.Printf("Wrote the generated Go files for %d operations.\n", count)
	return nil
}

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
