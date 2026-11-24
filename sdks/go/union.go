package himring

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"
)

type unionMemberKind int

const (
	unionString unionMemberKind = iota
	unionInteger
	unionNumber
	unionBoolean
	unionList
	unionMap
	unionObject
)

type unionMember struct {
	kind       unionMemberKind
	required   []string
	properties []string
	constants  map[string]any
}

func marshalUnion(value any, typeName string) ([]byte, error) {
	reflected := reflect.ValueOf(value)
	var chosen reflect.Value
	count := 0
	for index := 0; index < reflected.NumField(); index++ {
		field := reflected.Field(index)
		if field.Kind() == reflect.Pointer && !field.IsNil() {
			chosen = field
			count++
		}
	}
	if count != 1 {
		return nil, fmt.Errorf("set exactly one form of %s, not %d", typeName, count)
	}
	return json.Marshal(chosen.Interface())
}

func jsonKindOf(data []byte) byte {
	trimmed := bytes.TrimSpace(data)
	if len(trimmed) == 0 {
		return 0
	}
	return trimmed[0]
}

func isIntegerText(data []byte) bool {
	return !bytes.ContainsAny(bytes.TrimSpace(data), ".eE")
}

func constantMatches(raw json.RawMessage, constant any) bool {
	var value any
	if err := json.Unmarshal(raw, &value); err != nil {
		return false
	}
	return value == constant
}

func objectScore(member unionMember, object map[string]json.RawMessage) int {
	for _, name := range member.required {
		if _, present := object[name]; !present {
			return -1
		}
	}
	for name, constant := range member.constants {
		if raw, present := object[name]; present && !constantMatches(raw, constant) {
			return -1
		}
	}
	score := 0
	for _, name := range member.properties {
		if _, present := object[name]; present {
			score++
		}
	}
	return score
}

func chosenMember(data []byte, members []unionMember) int {
	kind := jsonKindOf(data)
	best, bestScore := -1, -1
	var object map[string]json.RawMessage
	if kind == '{' {
		if err := json.Unmarshal(data, &object); err != nil {
			return -1
		}
	}
	for index, member := range members {
		score := -1
		switch {
		case kind == '"' && member.kind == unionString:
			score = 0
		case (kind == 't' || kind == 'f') && member.kind == unionBoolean:
			score = 0
		case kind == '[' && member.kind == unionList:
			score = 0
		case (kind == '-' || kind >= '0' && kind <= '9') && member.kind == unionInteger && isIntegerText(data):
			score = 1
		case (kind == '-' || kind >= '0' && kind <= '9') && member.kind == unionNumber:
			score = 0
		case kind == '{' && member.kind == unionMap:
			score = 0
		case kind == '{' && member.kind == unionObject:
			score = objectScore(member, object)
		}
		if score > bestScore {
			best, bestScore = index, score
		}
	}
	return best
}

func unmarshalUnion(data []byte, target any, members []unionMember, typeName string) error {
	reflected := reflect.ValueOf(target).Elem()
	chosen := chosenMember(data, members)
	if chosen < 0 {
		return fmt.Errorf("the value %s matches none of the documented forms of %s", strings.TrimSpace(firstBytes(data)), typeName)
	}
	field := reflected.Field(chosen)
	value := reflect.New(field.Type().Elem())
	if err := json.Unmarshal(data, value.Interface()); err != nil {
		return err
	}
	reflected.SetZero()
	field.Set(value)
	return nil
}

func firstBytes(data []byte) string {
	const shownBytes = 80
	if len(data) > shownBytes {
		return string(data[:shownBytes]) + "..."
	}
	return string(data)
}
