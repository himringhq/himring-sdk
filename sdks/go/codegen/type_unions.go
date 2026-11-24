package main

import (
	"fmt"
	"strings"
)

var unionFieldOfKind = map[string]string{
	"string": "String", "integer": "Integer", "number": "Number", "boolean": "Boolean", "list": "List", "map": "Map",
}

func kindsOf(schema *jsonObject, context printContext) map[string]bool {
	kinds := map[string]bool{}
	target, err := resolved(schema, context)
	if err != nil {
		return map[string]bool{"any": true}
	}
	literals := listAt(target.value("enum"))
	if constant, present := target.get("const"); present {
		literals = []any{constant}
	}
	if target.has("const") || target.has("enum") {
		for _, literal := range literals {
			switch literal.(type) {
			case nil:
				kinds["null"] = true
			case bool:
				kinds["boolean"] = true
			case string:
				kinds["string"] = true
			default:
				kinds["integer"] = true
			}
		}
		return kinds
	}
	if target.has("anyOf") {
		base := target.without(func(key string) bool { return key == "anyOf" })
		for _, option := range listAt(target.value("anyOf")) {
			if record := optionalRecord(option); record != nil {
				for kind := range kindsOf(base.merged(record), context) {
					kinds[kind] = true
				}
			}
		}
		return kinds
	}
	var types []any
	switch kind := target.value("type").(type) {
	case []any:
		types = kind
	case string:
		types = []any{kind}
	default:
		return map[string]bool{"any": true}
	}
	for _, kind := range types {
		switch kind {
		case "array":
			kinds["list"] = true
		case "object":
			if properties := optionalRecord(target.value("properties")); properties != nil && len(properties.keys) > 0 {
				kinds["object"] = true
			} else {
				kinds["map"] = true
			}
		default:
			kinds[fmt.Sprint(kind)] = true
		}
	}
	return kinds
}

func needsUnionStruct(options []*jsonObject, context printContext) bool {
	kinds := map[string]bool{}
	for _, option := range options {
		for kind := range kindsOf(option, context) {
			kinds[kind] = true
		}
	}
	if kinds["any"] {
		return false
	}
	delete(kinds, "null")
	if kinds["number"] {
		delete(kinds, "integer")
	}
	return len(kinds) > 1
}

func discriminatorOf(option *jsonObject) (string, bool) {
	properties := optionalRecord(option.value("properties"))
	if properties == nil {
		return "", false
	}
	for _, name := range properties.keys {
		record := optionalRecord(properties.value(name))
		if constant, isText := record.value("const").(string); isText {
			return constant, goNameOf(constant) != ""
		}
	}
	return "", false
}

func optionNames(options []*jsonObject, name string, unionStruct bool) []string {
	names := make([]string, len(options))
	var shaped []int
	for index, option := range options {
		names[index] = name
		if properties := optionalRecord(option.value("properties")); properties != nil && len(properties.keys) > 0 {
			shaped = append(shaped, index)
		}
	}
	if len(shaped) == 1 && unionStruct {
		names[shaped[0]] = name + "Object"
	}
	if len(shaped) <= 1 {
		return names
	}
	discriminators := make([]string, len(shaped))
	distinct := true
	seen := map[string]bool{}
	for position, index := range shaped {
		value, found := discriminatorOf(options[index])
		if !found || seen[value] {
			distinct = false
		}
		seen[value] = true
		discriminators[position] = value
	}
	for position, index := range shaped {
		if distinct {
			names[index] = name + goNameOf(discriminators[position])
		} else {
			names[index] = fmt.Sprintf("%sOption%d", name, position+1)
		}
	}
	return names
}

func (collector *typeCollector) render(union typeUnion, context printContext) (string, bool, error) {
	var members []memberModel
	seen := map[string]bool{}
	hasNumber := false
	for _, member := range union.members {
		if member.kind == "any" {
			return unknownType, false, nil
		}
		hasNumber = hasNumber || member.kind == "number"
	}
	for _, member := range union.members {
		if seen[member.goType] || (hasNumber && member.kind == "integer") {
			continue
		}
		seen[member.goType] = true
		members = append(members, member)
	}
	switch len(members) {
	case 0:
		return unknownType, false, nil
	case 1:
		return members[0].goType, union.nullable, nil
	}
	used := map[string]bool{}
	for index := range members {
		field := unionFieldOfKind[members[index].kind]
		if members[index].kind == "object" {
			field = strings.TrimPrefix(members[index].goType, context.name)
			if field == "" || field == members[index].goType {
				field = "Object"
			}
		}
		candidate := field
		for suffix := 2; used[candidate]; suffix++ {
			candidate = fmt.Sprintf("%s%d", field, suffix)
		}
		used[candidate] = true
		members[index].fieldName = candidate
	}
	if err := collector.register(&unionDefinition{name: context.name, members: members}, context.place); err != nil {
		return "", false, err
	}
	return context.name, union.nullable, nil
}
