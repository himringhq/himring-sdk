package himring

import (
	"fmt"
	"reflect"
	"strings"
	"unicode/utf8"
)

const deepestCheckedInput = 64

func jsonFieldName(field reflect.StructField) (string, bool) {
	tag := field.Tag.Get("json")
	if tag == "-" || !field.IsExported() {
		return "", false
	}
	name, _, _ := strings.Cut(tag, ",")
	if name == "" {
		name = field.Name
	}
	return name, true
}

func brokenTextPath(value reflect.Value, path []any, depth int) ([]any, bool) {
	if depth > deepestCheckedInput || !value.IsValid() {
		return nil, false
	}
	switch value.Kind() {
	case reflect.String:
		if !utf8.ValidString(value.String()) {
			return path, true
		}
	case reflect.Pointer, reflect.Interface:
		if !value.IsNil() {
			return brokenTextPath(value.Elem(), path, depth+1)
		}
	case reflect.Slice, reflect.Array:
		if value.Kind() == reflect.Slice && value.Type().Elem().Kind() == reflect.Uint8 {
			return nil, false
		}
		for index := 0; index < value.Len(); index++ {
			if found, broken := brokenTextPath(value.Index(index), appended(path, index), depth+1); broken {
				return found, true
			}
		}
	case reflect.Map:
		iterator := value.MapRange()
		for iterator.Next() {
			key := iterator.Key()
			name := ""
			if key.Kind() == reflect.String {
				name = key.String()
				if !utf8.ValidString(name) {
					return path, true
				}
			}
			if found, broken := brokenTextPath(iterator.Value(), appended(path, name), depth+1); broken {
				return found, true
			}
		}
	case reflect.Struct:
		for index := 0; index < value.NumField(); index++ {
			field := value.Type().Field(index)
			if field.Tag.Get("json") == "-" || (!field.IsExported() && field.Name != "value") {
				continue
			}
			fieldPath := path
			if name, tagged := jsonFieldName(field); tagged && field.Tag.Get("json") != "" {
				fieldPath = appended(path, name)
			}
			if found, broken := brokenTextPath(value.Field(index), fieldPath, depth+1); broken {
				return found, true
			}
		}
	}
	return nil, false
}

func appended(path []any, part any) []any {
	copied := make([]any, 0, len(path)+1)
	return append(append(copied, path...), part)
}

func checkedInputText(operation *OperationDescription, input any) error {
	path, broken := brokenTextPath(reflect.ValueOf(input), nil, 0)
	if !broken {
		return nil
	}
	field := ""
	if len(path) > 0 {
		field = fmt.Sprint(path[0])
	}
	problem := invalidInput(fmt.Sprintf("The input of %s holds text that is not valid Unicode.", operation.OperationID), field)
	problem.Issues[0].Path = append([]any{}, path...)
	return problem
}
