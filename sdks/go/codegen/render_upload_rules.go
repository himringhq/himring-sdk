package main

import (
	"fmt"
	"strconv"
	"strings"
)

func uploadInputSchema(model *specModel, id string) (*jsonObject, error) {
	for _, operation := range model.operations {
		if operation.id == id && operation.body.schema != nil {
			return operation.body.schema, nil
		}
	}
	return nil, failf("The documents hold no %s operation with a JSON body.", id)
}

func renderUploadRules(model *specModel) (string, error) {
	create, err := uploadInputSchema(model, "create_upload")
	if err != nil {
		return "", err
	}
	sign, err := uploadInputSchema(model, "sign_upload_parts")
	if err != nil {
		return "", err
	}
	reader := ruleReader{place: "create_upload"}
	size, err := reader.schemaAt(create, "properties", "size_bytes")
	if err != nil {
		return "", err
	}
	maximumSize, err := reader.wholeNumberAt(size, "maximum", "size_bytes")
	if err != nil {
		return "", err
	}
	digest, err := reader.schemaAt(create, "properties", "content_sha256")
	if err != nil {
		return "", err
	}
	pattern, err := reader.patternAt(digest, "content_sha256")
	if err != nil {
		return "", err
	}
	reader.place = "sign_upload_parts"
	part, err := reader.schemaAt(sign, "properties", "parts", "items", "properties", "part_number")
	if err != nil {
		return "", err
	}
	maximumPart, err := reader.wholeNumberAt(part, "maximum", "part_number")
	if err != nil {
		return "", err
	}
	return strings.Join([]string{
		"package himring", "", `import "regexp"`, "", "const (",
		fmt.Sprintf("\tuploadSizeMaximum = %d", maximumSize),
		fmt.Sprintf("\tsignablePartNumberMaximum = %d", maximumPart),
		")", "", "var sha256HexPattern = regexp.MustCompile(" + strconv.Quote(pattern) + ")", "",
	}, "\n"), nil
}
