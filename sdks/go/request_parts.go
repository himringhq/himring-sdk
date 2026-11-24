package himring

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"sort"
	"strings"
	"unicode/utf8"
)

const fileContentField = "content"

type requestParts struct {
	path     string
	query    string
	jsonBody []byte
	fileBody *fileBody
}

func jsonBytesOf(value any) ([]byte, error) {
	var buffer bytes.Buffer
	encoder := json.NewEncoder(&buffer)
	encoder.SetEscapeHTML(false)
	if err := encoder.Encode(value); err != nil {
		return nil, err
	}
	return bytes.TrimRight(buffer.Bytes(), "\n"), nil
}

func decodedFields(operation *OperationDescription, encoded []byte) (map[string]any, error) {
	decoder := json.NewDecoder(bytes.NewReader(encoded))
	decoder.UseNumber()
	var fields map[string]any
	if err := decoder.Decode(&fields); err != nil || fields == nil {
		return nil, invalidInput(fmt.Sprintf("The input of %s must be an object of fields.", operation.OperationID), "")
	}
	return fields, nil
}

func fieldsOfInput(operation *OperationDescription, input any) (map[string]any, error) {
	if err := checkedInputText(operation, input); err != nil {
		return nil, err
	}
	encoded, err := jsonBytesOf(input)
	if err != nil {
		return nil, unencodableInput(operation, err)
	}
	return decodedFields(operation, encoded)
}

func unencodableInput(operation *OperationDescription, cause error) *Error {
	problem := invalidInput(fmt.Sprintf("The input of %s holds a value that JSON cannot carry.", operation.OperationID), "")
	problem.Details = cause.Error()
	problem.cause = cause
	return problem
}

func splitFileContent(operation *OperationDescription, fields map[string]any) (any, map[string]any, error) {
	rest := make(map[string]any, len(fields))
	var content any
	for name, value := range fields {
		if operation.BodyKind == BodyKindFile && name == fileContentField {
			content = value
			continue
		}
		rest[name] = value
	}
	return content, rest, nil
}

func normalizedFields(operation *OperationDescription, fields map[string]any) (map[string]any, error) {
	if fields == nil {
		return map[string]any{}, nil
	}
	if err := checkedInputText(operation, fields); err != nil {
		return nil, err
	}
	encoded, err := jsonBytesOf(fields)
	if err != nil {
		return nil, unencodableInput(operation, err)
	}
	return decodedFields(operation, encoded)
}

func givenFields(operation *OperationDescription, fields map[string]any) map[string]any {
	given := make(map[string]any, len(fields))
	for name, value := range fields {
		if value == nil && !operation.isNullable(name) {
			continue
		}
		given[name] = value
	}
	return given
}

func pathSegmentOf(operation *OperationDescription, name string, value any) (string, error) {
	var text string
	switch typed := value.(type) {
	case string:
		text = typed
	case json.Number:
		if strings.ContainsAny(typed.String(), ".eE") {
			return "", invalidInput(fmt.Sprintf("%s needs %s as text in the path.", operation.OperationID, name), name)
		}
		text = typed.String()
	default:
		return "", invalidInput(fmt.Sprintf("%s needs %s as text in the path.", operation.OperationID, name), name)
	}
	if text == "" || text == "." || text == ".." {
		return "", invalidInput(fmt.Sprintf("%s needs %s, and it cannot be empty, '.', or '..'.", operation.OperationID, name), name)
	}
	if !utf8.ValidString(text) {
		return "", invalidInput(fmt.Sprintf("%s needs %s as valid Unicode text.", operation.OperationID, name), name)
	}
	return escapedSegment(text), nil
}

func isUnreservedByte(character byte) bool {
	return character >= 'A' && character <= 'Z' || character >= 'a' && character <= 'z' ||
		character >= '0' && character <= '9' || character == '-' || character == '.' || character == '_' || character == '~'
}

func escapedSegment(text string) string {
	const hexDigits = "0123456789ABCDEF"
	var builder strings.Builder
	for index := 0; index < len(text); index++ {
		character := text[index]
		if isUnreservedByte(character) {
			builder.WriteByte(character)
			continue
		}
		builder.WriteByte('%')
		builder.WriteByte(hexDigits[character>>4])
		builder.WriteByte(hexDigits[character&0x0f])
	}
	return builder.String()
}

func queryTextOf(operation *OperationDescription, name string, value any) (string, error) {
	switch typed := value.(type) {
	case string:
		if !utf8.ValidString(typed) {
			return "", invalidInput(fmt.Sprintf("%s needs %s as valid Unicode text.", operation.OperationID, name), name)
		}
		return typed, nil
	case bool:
		if typed {
			return "true", nil
		}
		return "false", nil
	case json.Number:
		return typed.String(), nil
	case []any:
		texts := make([]string, 0, len(typed))
		for _, item := range typed {
			text, err := queryTextOf(operation, name, item)
			if err != nil {
				return "", err
			}
			texts = append(texts, text)
		}
		return strings.Join(texts, ","), nil
	}
	return "", invalidInput(fmt.Sprintf("%s takes %s as text.", operation.OperationID, name), name)
}

func encodedQuery(pairs [][2]string) string {
	sort.SliceStable(pairs, func(left, right int) bool { return pairs[left][0] < pairs[right][0] })
	encoded := make([]string, 0, len(pairs))
	for _, pair := range pairs {
		encoded = append(encoded, queryEscape(pair[0])+"="+queryEscape(pair[1]))
	}
	return strings.Join(encoded, "&")
}

func requestPartsOf(operation *OperationDescription, fields map[string]any, content any) (requestParts, error) {
	given := givenFields(operation, fields)
	path := operation.Path
	isPathParameter := map[string]bool{}
	for _, name := range operation.PathParameters {
		segment, err := pathSegmentOf(operation, name, given[name])
		if err != nil {
			return requestParts{}, err
		}
		path = strings.Replace(path, "{"+name+"}", segment, 1)
		isPathParameter[name] = true
	}
	isQueryParameter := map[string]bool{}
	for _, name := range operation.QueryParameters {
		isQueryParameter[name] = true
	}
	query := [][2]string{}
	body := map[string]any{}
	for name, value := range given {
		switch {
		case isPathParameter[name]:
		case isQueryParameter[name]:
			if value == nil {
				return requestParts{}, invalidInput(fmt.Sprintf("%s takes %s as text, not null.", operation.OperationID, name), name)
			}
			text, err := queryTextOf(operation, name, value)
			if err != nil {
				return requestParts{}, err
			}
			query = append(query, [2]string{name, text})
		case operation.BodyKind == BodyKindJSON:
			body[name] = value
		default:
			return requestParts{}, invalidInput(fmt.Sprintf("%s takes no field called %s.", operation.OperationID, name), name)
		}
	}
	parts := requestParts{path: path, query: encodedQuery(query)}
	if operation.BodyKind == BodyKindJSON {
		encoded, err := jsonBytesOf(body)
		if err != nil {
			return requestParts{}, unencodableInput(operation, err)
		}
		parts.jsonBody = encoded
	}
	if operation.BodyKind == BodyKindFile {
		file, err := fileBodyOf(operation, content)
		if err != nil {
			return requestParts{}, err
		}
		parts.fileBody = file
	}
	return parts, nil
}

func readerOfContent(content any) (io.Reader, bool) {
	switch typed := content.(type) {
	case []byte:
		return bytes.NewReader(typed), true
	case io.Reader:
		if typed == nil {
			return nil, false
		}
		return typed, true
	}
	return nil, false
}
