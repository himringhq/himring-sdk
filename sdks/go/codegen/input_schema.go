package main

import "sort"

const fileContentField = "content"

type inputField struct {
	name     string
	schema   *jsonObject
	required bool
	location string
}

func requiredNamesOf(schema *jsonObject) map[string]bool {
	required := map[string]bool{}
	for _, name := range listAt(schema.value("required")) {
		if text, isText := name.(string); isText {
			required[text] = true
		}
	}
	return required
}

func inputFieldsOf(operation operationModel) ([]inputField, error) {
	var fields []inputField
	seen := map[string]bool{}
	add := func(name string, schema *jsonObject, required bool, location string) error {
		if seen[name] {
			return failf("%s takes %s in more than one part of the request.", operation.id, name)
		}
		if schema == nil {
			return failf("%s %s %s has no schema.", operation.id, location, name)
		}
		seen[name] = true
		fields = append(fields, inputField{name: name, schema: schema, required: required, location: location})
		return nil
	}
	for _, parameter := range operation.pathParameters {
		if err := add(parameter.name, parameter.schema, true, "path parameter"); err != nil {
			return nil, err
		}
	}
	for _, parameter := range operation.queryParameters {
		if err := add(parameter.name, parameter.schema, parameter.required, "query parameter"); err != nil {
			return nil, err
		}
	}
	if operation.body.kind == "json" && operation.body.schema != nil {
		body := operation.body.schema
		properties := optionalRecord(body.value("properties"))
		if properties == nil {
			properties = &jsonObject{values: map[string]any{}}
		}
		required := requiredNamesOf(body)
		var missing []string
		for name := range required {
			if !properties.has(name) {
				missing = append(missing, name)
			}
		}
		if len(missing) > 0 {
			sort.Strings(missing)
			return nil, failf("%s requires the undocumented %v.", operation.id, missing)
		}
		for _, name := range properties.keys {
			if err := add(name, optionalRecord(properties.value(name)), required[name], "body field"); err != nil {
				return nil, err
			}
		}
	}
	if operation.body.kind == "file" && seen[fileContentField] {
		return nil, failf("%s takes a field called %s beside its file.", operation.id, fileContentField)
	}
	return fields, nil
}
