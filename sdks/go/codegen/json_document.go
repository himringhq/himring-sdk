package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

type jsonObject struct {
	keys   []string
	values map[string]any
}

func (object *jsonObject) get(key string) (any, bool) {
	if object == nil {
		return nil, false
	}
	value, present := object.values[key]
	return value, present
}

func (object *jsonObject) value(key string) any {
	value, _ := object.get(key)
	return value
}

func (object *jsonObject) has(key string) bool {
	_, present := object.get(key)
	return present
}

func (object *jsonObject) without(skipped func(string) bool) *jsonObject {
	copied := &jsonObject{values: map[string]any{}}
	for _, key := range object.keys {
		if skipped(key) {
			continue
		}
		copied.keys = append(copied.keys, key)
		copied.values[key] = object.values[key]
	}
	return copied
}

func (object *jsonObject) merged(other *jsonObject) *jsonObject {
	copied := object.without(func(string) bool { return false })
	for _, key := range other.keys {
		if !copied.has(key) {
			copied.keys = append(copied.keys, key)
		}
		copied.values[key] = other.values[key]
	}
	return copied
}

func readJSONDocument(data []byte) (any, error) {
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.UseNumber()
	value, err := readJSONValue(decoder)
	if err != nil {
		return nil, err
	}
	if _, err := decoder.Token(); !errors.Is(err, io.EOF) {
		return nil, errors.New("the document holds more than one JSON value")
	}
	return value, nil
}

func readJSONValue(decoder *json.Decoder) (any, error) {
	token, err := decoder.Token()
	if err != nil {
		return nil, err
	}
	switch typed := token.(type) {
	case json.Delim:
		switch typed {
		case '{':
			return readJSONObject(decoder)
		case '[':
			return readJSONArray(decoder)
		}
		return nil, fmt.Errorf("the document holds an unexpected %q", typed)
	default:
		return typed, nil
	}
}

func readJSONObject(decoder *json.Decoder) (*jsonObject, error) {
	object := &jsonObject{values: map[string]any{}}
	for decoder.More() {
		token, err := decoder.Token()
		if err != nil {
			return nil, err
		}
		key, isText := token.(string)
		if !isText {
			return nil, errors.New("the document holds an object key that is not text")
		}
		value, err := readJSONValue(decoder)
		if err != nil {
			return nil, err
		}
		if object.has(key) {
			return nil, fmt.Errorf("the document holds the key %s twice in one object", key)
		}
		object.keys = append(object.keys, key)
		object.values[key] = value
	}
	if _, err := decoder.Token(); err != nil {
		return nil, err
	}
	return object, nil
}

func readJSONArray(decoder *json.Decoder) ([]any, error) {
	items := []any{}
	for decoder.More() {
		value, err := readJSONValue(decoder)
		if err != nil {
			return nil, err
		}
		items = append(items, value)
	}
	if _, err := decoder.Token(); err != nil {
		return nil, err
	}
	return items, nil
}
