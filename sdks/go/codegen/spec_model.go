package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"sort"
	"strings"
)

const (
	jsonMediaType        = "application/json"
	fileMediaType        = "application/octet-stream"
	fileKindsKeyword     = "x-himring-file-kinds"
	maximumBytesKeyword  = "x-himring-maximum-bytes"
	fileExtensionKeyword = "x-himring-file-extension"
	errorCodesKeyword    = "x-himring-error-codes"
)

var (
	documentNames          = []string{"api", "session"}
	documentFiles          = map[string]string{"api": "openapi.json", "session": "openapi-session.json"}
	operationIDPattern     = regexp.MustCompile(`^[a-z][a-z0-9]*(_[a-z0-9]+)*$`)
	successStatusPattern   = regexp.MustCompile(`^2[0-9][0-9]$`)
	pathTemplatePattern    = regexp.MustCompile(`\{([^}]+)\}`)
	listedExtensionPattern = regexp.MustCompile(`^\.[a-z0-9]+$`)
	methodsByKey           = map[string]string{"get": "GET", "post": "POST", "delete": "DELETE"}
)

type specModelError struct {
	message string
}

func (problem specModelError) Error() string {
	return problem.message
}

func failf(format string, arguments ...any) specModelError {
	return specModelError{message: fmt.Sprintf(format, arguments...)}
}

type parameterModel struct {
	name     string
	required bool
	schema   *jsonObject
}

type bodyModel struct {
	kind         string
	schema       *jsonObject
	maximumBytes int64
}

type responseModel struct {
	status        int
	schema        *jsonObject
	contentTypes  []string
	fileExtension string
	isDownload    bool
}

type operationModel struct {
	id              string
	document        string
	method          string
	path            string
	pathParameters  []parameterModel
	queryParameters []parameterModel
	body            bodyModel
	response        responseModel
}

type errorCodeModel struct {
	code    string
	status  int
	message string
}

type fileKindModel struct {
	kind       string
	extensions []string
}

type specModel struct {
	operations []operationModel
	errorCodes []errorCodeModel
	components map[string]*jsonObject
	fileKinds  []fileKindModel
	serverURL  string
}

func recordAt(value any, place string) (*jsonObject, error) {
	record, isRecord := value.(*jsonObject)
	if !isRecord {
		return nil, failf("%s is not a JSON object.", place)
	}
	return record, nil
}

func optionalRecord(value any) *jsonObject {
	record, _ := value.(*jsonObject)
	return record
}

func listAt(value any) []any {
	list, _ := value.([]any)
	return list
}

func textAt(value any, place string) (string, error) {
	text, isText := value.(string)
	if !isText || text == "" {
		return "", failf("%s is not a text value.", place)
	}
	return text, nil
}

func wholeNumberAt(value any) (int64, bool) {
	number, isNumber := value.(json.Number)
	if !isNumber {
		return 0, false
	}
	whole, err := number.Int64()
	return whole, err == nil
}

func parameterOf(raw any, place string) (string, parameterModel, error) {
	parameter, err := recordAt(raw, place)
	if err != nil {
		return "", parameterModel{}, err
	}
	name, err := textAt(parameter.value("name"), place+" name")
	if err != nil {
		return "", parameterModel{}, err
	}
	location, err := textAt(parameter.value("in"), place+" in")
	if err != nil {
		return "", parameterModel{}, err
	}
	if location != "path" && location != "query" {
		return "", parameterModel{}, failf("%s is in %s.", place, location)
	}
	if location == "query" && (parameter.value("style") != "form" || parameter.value("explode") != false) {
		return "", parameterModel{}, failf("%s is not a form parameter without explode.", place)
	}
	schema, err := recordAt(parameter.value("schema"), place+" schema")
	if err != nil {
		return "", parameterModel{}, err
	}
	return location, parameterModel{name: name, required: parameter.value("required") == true, schema: schema}, nil
}

func bodyOf(operation *jsonObject, place string) (bodyModel, error) {
	if !operation.has("requestBody") {
		return bodyModel{kind: "none"}, nil
	}
	body, err := recordAt(operation.value("requestBody"), place+" requestBody")
	if err != nil {
		return bodyModel{}, err
	}
	content, err := recordAt(body.value("content"), place+" requestBody content")
	if err != nil {
		return bodyModel{}, err
	}
	if body.value("required") != true || len(content.keys) != 1 {
		return bodyModel{}, failf("%s needs one required request body media type.", place)
	}
	mediaType := content.keys[0]
	if mediaType == fileMediaType {
		limit, isWhole := wholeNumberAt(body.value(maximumBytesKeyword))
		if !isWhole || limit <= 0 {
			return bodyModel{}, failf("%s takes a file without %s.", place, maximumBytesKeyword)
		}
		return bodyModel{kind: "file", maximumBytes: limit}, nil
	}
	if mediaType != jsonMediaType {
		return bodyModel{}, failf("%s takes %s.", place, mediaType)
	}
	media, err := recordAt(content.value(jsonMediaType), place)
	if err != nil {
		return bodyModel{}, err
	}
	schema, err := recordAt(media.value("schema"), place+" body schema")
	if err != nil {
		return bodyModel{}, err
	}
	if schema.value("type") != "object" || optionalRecord(schema.value("properties")) == nil {
		return bodyModel{}, failf("%s takes a JSON body that is not an object with properties.", place)
	}
	return bodyModel{kind: "json", schema: schema}, nil
}

func responseOf(operation *jsonObject, place string) (responseModel, error) {
	responses, err := recordAt(operation.value("responses"), place+" responses")
	if err != nil {
		return responseModel{}, err
	}
	var successes []string
	for _, status := range responses.keys {
		if successStatusPattern.MatchString(status) {
			successes = append(successes, status)
		}
	}
	if len(successes) != 1 {
		return responseModel{}, failf("%s has no single success response.", place)
	}
	statusText := successes[0]
	response, err := recordAt(responses.value(statusText), place+" "+statusText+" response")
	if err != nil {
		return responseModel{}, err
	}
	content, err := recordAt(response.value("content"), place+" "+statusText+" content")
	if err != nil {
		return responseModel{}, err
	}
	var status int
	fmt.Sscanf(statusText, "%d", &status)
	if extension, present := response.get(fileExtensionKeyword); present {
		text, isText := extension.(string)
		if !isText {
			return responseModel{}, failf("%s has a file extension that is not text.", place)
		}
		return responseModel{status: status, contentTypes: append([]string(nil), content.keys...), fileExtension: text, isDownload: true}, nil
	}
	media, err := recordAt(content.value(jsonMediaType), place+" JSON response")
	if err != nil {
		return responseModel{}, err
	}
	schema, err := recordAt(media.value("schema"), place+" response schema")
	if err != nil {
		return responseModel{}, err
	}
	return responseModel{status: status, schema: schema, contentTypes: []string{jsonMediaType}}, nil
}

func operationOf(document string, path string, methodKey string, raw any) (operationModel, error) {
	place := fmt.Sprintf("%s %s %s", documentFiles[document], strings.ToUpper(methodKey), path)
	method, known := methodsByKey[methodKey]
	if !known {
		return operationModel{}, failf("%s uses a method that the SDK does not send.", place)
	}
	operation, err := recordAt(raw, place)
	if err != nil {
		return operationModel{}, err
	}
	id, err := textAt(operation.value("operationId"), place+" operationId")
	if err != nil {
		return operationModel{}, err
	}
	if !operationIDPattern.MatchString(id) {
		return operationModel{}, failf("%s has the operationId %s, not snake_case.", place, id)
	}
	model := operationModel{id: id, document: document, method: method, path: path}
	for index, item := range listAt(operation.value("parameters")) {
		location, parameter, err := parameterOf(item, fmt.Sprintf("%s parameter %d", place, index))
		if err != nil {
			return operationModel{}, err
		}
		if location == "path" {
			model.pathParameters = append(model.pathParameters, parameter)
		} else {
			model.queryParameters = append(model.queryParameters, parameter)
		}
	}
	var templated, documented []string
	for _, match := range pathTemplatePattern.FindAllStringSubmatch(path, -1) {
		templated = append(templated, match[1])
	}
	for _, parameter := range model.pathParameters {
		documented = append(documented, parameter.name)
		if !parameter.required {
			return operationModel{}, failf("%s has an optional path parameter.", place)
		}
	}
	if !reflect.DeepEqual(templated, documented) {
		return operationModel{}, failf("%s documents path parameters that differ from its path.", place)
	}
	if model.body, err = bodyOf(operation, place); err != nil {
		return operationModel{}, err
	}
	if model.response, err = responseOf(operation, place); err != nil {
		return operationModel{}, err
	}
	return model, nil
}

func loadSpecModel(directory string) (*specModel, error) {
	model := &specModel{components: map[string]*jsonObject{}}
	errorCodes := map[string]errorCodeModel{}
	var fileKinds [][]fileKindModel
	var serverURLs []string
	for _, document := range documentNames {
		file := documentFiles[document]
		data, err := os.ReadFile(filepath.Join(directory, file))
		if err != nil {
			return nil, err
		}
		raw, err := readJSONDocument(data)
		if err != nil {
			return nil, failf("%s is not JSON: %v", file, err)
		}
		parsed, err := recordAt(raw, file)
		if err != nil {
			return nil, err
		}
		components, err := recordAt(parsed.value("components"), file+" components")
		if err != nil {
			return nil, err
		}
		model.components[document] = components
		kinds, err := fileKindsOf(components, file)
		if err != nil {
			return nil, err
		}
		fileKinds = append(fileKinds, kinds)
		serverURL, err := serverURLOf(parsed, file)
		if err != nil {
			return nil, err
		}
		serverURLs = append(serverURLs, serverURL)
		paths, err := recordAt(parsed.value("paths"), file+" paths")
		if err != nil {
			return nil, err
		}
		for _, path := range paths.keys {
			item, err := recordAt(paths.value(path), file+" "+path)
			if err != nil {
				return nil, err
			}
			for _, methodKey := range item.keys {
				operation, err := operationOf(document, path, methodKey, item.value(methodKey))
				if err != nil {
					return nil, err
				}
				model.operations = append(model.operations, operation)
			}
		}
		codes, err := errorCodesOf(parsed, file)
		if err != nil {
			return nil, err
		}
		for _, code := range codes {
			if known, seen := errorCodes[code.code]; seen && known != code {
				return nil, failf("The documents describe the error code %s in two ways.", code.code)
			}
			errorCodes[code.code] = code
		}
	}
	seen := map[string]bool{}
	for _, operation := range model.operations {
		if seen[operation.id] {
			return nil, failf("The documents hold %s twice.", operation.id)
		}
		seen[operation.id] = true
	}
	sort.Slice(model.operations, func(left, right int) bool { return model.operations[left].id < model.operations[right].id })
	for _, code := range errorCodes {
		model.errorCodes = append(model.errorCodes, code)
	}
	sort.Slice(model.errorCodes, func(left, right int) bool { return model.errorCodes[left].code < model.errorCodes[right].code })
	for _, kinds := range fileKinds[1:] {
		if !reflect.DeepEqual(kinds, fileKinds[0]) {
			return nil, failf("The documents give different file kinds.")
		}
	}
	for _, serverURL := range serverURLs[1:] {
		if serverURL != serverURLs[0] {
			return nil, failf("The documents give different server URLs.")
		}
	}
	model.fileKinds, model.serverURL = fileKinds[0], serverURLs[0]
	return model, nil
}
