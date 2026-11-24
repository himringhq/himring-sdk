package main

import (
	"fmt"
	"strconv"
	"strings"
)

func bodyKindConstant(kind string) string {
	return map[string]string{"none": "BodyKindNone", "json": "BodyKindJSON", "file": "BodyKindFile"}[kind]
}

func operationEntry(operation operationModel, types operationTypes) ([]string, error) {
	fields, err := inputFieldsOf(operation)
	if err != nil {
		return nil, err
	}
	var bodyFields, pathParameters, queryParameters []string
	for _, field := range fields {
		if field.location == "body field" {
			bodyFields = append(bodyFields, field.name)
		}
	}
	for _, parameter := range operation.pathParameters {
		pathParameters = append(pathParameters, parameter.name)
	}
	for _, parameter := range operation.queryParameters {
		queryParameters = append(queryParameters, parameter.name)
	}
	responseKind := "ResponseKindJSON"
	if operation.response.isDownload {
		responseKind = "ResponseKindDownload"
	}
	return []string{
		fmt.Sprintf("\t%q: {", operation.id),
		fmt.Sprintf("\t\tOperationID: %q,", operation.id),
		fmt.Sprintf("\t\tMethod: %q,", operation.method),
		fmt.Sprintf("\t\tPath: %q,", operation.path),
		fmt.Sprintf("\t\tPathParameters: %s,", quotedList(pathParameters)),
		fmt.Sprintf("\t\tQueryParameters: %s,", quotedList(queryParameters)),
		fmt.Sprintf("\t\tBodyKind: %s,", bodyKindConstant(operation.body.kind)),
		fmt.Sprintf("\t\tBodyFields: %s,", quotedList(bodyFields)),
		fmt.Sprintf("\t\tMaximumBodyBytes: %d,", operation.body.maximumBytes),
		fmt.Sprintf("\t\tNullableFields: %s,", quotedList(types.nullableFields)),
		fmt.Sprintf("\t\tResponse: ResponseDescription{Kind: %s, Status: %d, ContentTypes: %s, FileExtension: %q},",
			responseKind, operation.response.status, quotedList(operation.response.contentTypes), operation.response.fileExtension),
		"\t},",
	}, nil
}

func renderOperations(model *specModel, rendered renderedTypes) (string, error) {
	lines := []string{"package himring", "", fmt.Sprintf("const SpecAPIURL = %q", model.serverURL), "", "type FileKind string", "", "const ("}
	var kindNames []string
	for _, kind := range model.fileKinds {
		name := "FileKind" + goNameOf(kind.kind)
		kindNames = append(kindNames, name)
		lines = append(lines, fmt.Sprintf("\t%s FileKind = %q", name, kind.kind))
	}
	lines = append(lines, ")", "", "var fileKindList = []FileKind{"+strings.Join(kindNames, ", ")+"}", "", "var fileKindExtensions = map[FileKind][]string{")
	for index, kind := range model.fileKinds {
		lines = append(lines, fmt.Sprintf("\t%s: %s,", kindNames[index], quotedList(kind.extensions)))
	}
	lines = append(lines, "}", "", "var operations = map[string]*OperationDescription{")
	var ids []string
	for _, operation := range model.operations {
		entry, err := operationEntry(operation, rendered.byOperation[operation.id])
		if err != nil {
			return "", err
		}
		lines = append(lines, entry...)
		ids = append(ids, operation.id)
	}
	lines = append(lines, "}", "", "var operationIDList = "+quotedList(ids), "", "var errorStatuses = map[string]int{")
	var codes []string
	for _, code := range model.errorCodes {
		lines = append(lines, fmt.Sprintf("\t%q: %d,", code.code, code.status))
		codes = append(codes, code.code)
	}
	lines = append(lines, "}", "", "var errorMessages = map[string]string{")
	for _, code := range model.errorCodes {
		lines = append(lines, fmt.Sprintf("\t%q: %s,", code.code, strconv.Quote(code.message)))
	}
	lines = append(lines, "}", "", "var errorCodeList = "+quotedList(codes), "")
	return strings.Join(lines, "\n"), nil
}
