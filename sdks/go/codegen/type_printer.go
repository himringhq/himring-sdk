package main

import (
	"encoding/json"
	"fmt"
	"strings"
)

const (
	componentReferencePrefix = "#/components/"
	extensionPrefix          = "x-"
	unknownType              = "any"
)

var (
	shapeKeywords      = setOf("type", "anyOf", "enum", "const", "properties", "required", "additionalProperties", "items", "$ref")
	validationKeywords = setOf("description", "default", "format", "pattern", "minLength", "maxLength", "minimum", "maximum",
		"exclusiveMinimum", "exclusiveMaximum", "multipleOf", "minItems", "maxItems", "uniqueItems", "minProperties",
		"maxProperties", "propertyNames", "title", "examples", "deprecated", "readOnly", "writeOnly")
)

func setOf(values ...string) map[string]bool {
	set := map[string]bool{}
	for _, value := range values {
		set[value] = true
	}
	return set
}

type printContext struct {
	direction  string
	components *jsonObject
	place      string
	name       string
}

func (context printContext) child(place string, name string) printContext {
	context.place, context.name = place, name
	return context
}

type memberModel struct {
	goType     string
	kind       string
	fieldName  string
	required   []string
	properties []string
	constants  []constantModel
}

type constantModel struct {
	property string
	value    any
}

type typeUnion struct {
	members  []memberModel
	nullable bool
}

func merged(unions []typeUnion) typeUnion {
	var result typeUnion
	for _, union := range unions {
		result.members = append(result.members, union.members...)
		result.nullable = result.nullable || union.nullable
	}
	return result
}

func (collector *typeCollector) unionOf(raw *jsonObject, context printContext) (typeUnion, error) {
	schema, err := resolved(raw, context)
	if err != nil {
		return typeUnion{}, err
	}
	if err := checkKeywords(schema, context.place); err != nil {
		return typeUnion{}, err
	}
	if constant, present := schema.get("const"); present {
		return literalUnion([]any{constant}, context.place)
	}
	if enum, present := schema.get("enum"); present {
		return literalUnion(listAt(enum), context.place)
	}
	if schema.has("anyOf") {
		return collector.anyOfUnion(schema, context)
	}
	switch kind := schema.value("type").(type) {
	case []any:
		var unions []typeUnion
		for _, member := range kind {
			union, err := collector.ofType(fmt.Sprint(member), schema, context)
			if err != nil {
				return typeUnion{}, err
			}
			unions = append(unions, union)
		}
		return merged(unions), nil
	case string:
		return collector.ofType(kind, schema, context)
	}
	return typeUnion{members: []memberModel{{goType: unknownType, kind: "any"}}}, nil
}

func literalUnion(values []any, place string) (typeUnion, error) {
	var union typeUnion
	for _, value := range values {
		switch typed := value.(type) {
		case nil:
			union.nullable = true
		case bool:
			union.members = append(union.members, memberModel{goType: "bool", kind: "boolean"})
		case string:
			union.members = append(union.members, memberModel{goType: "string", kind: "string"})
		case json.Number:
			if _, err := typed.Int64(); err != nil {
				return typeUnion{}, failf("%s holds the literal %v, which the SDK cannot carry.", place, value)
			}
			union.members = append(union.members, memberModel{goType: "int64", kind: "integer"})
		default:
			return typeUnion{}, failf("%s holds the literal %v, which the SDK cannot carry.", place, value)
		}
	}
	if len(union.members) == 0 && !union.nullable {
		return typeUnion{}, failf("%s lists no allowed value.", place)
	}
	return union, nil
}

func (collector *typeCollector) anyOfUnion(schema *jsonObject, context printContext) (typeUnion, error) {
	base := schema.without(func(key string) bool {
		return key == "anyOf" || key == "description" || key == "default" || strings.HasPrefix(key, extensionPrefix)
	})
	var options []*jsonObject
	for index, option := range listAt(schema.value("anyOf")) {
		record := optionalRecord(option)
		if record == nil {
			return typeUnion{}, failf("%s anyOf %d is not a schema.", context.place, index)
		}
		target, err := resolved(record, context)
		if err != nil {
			return typeUnion{}, err
		}
		options = append(options, base.merged(target))
	}
	names := optionNames(options, context.name, needsUnionStruct(options, context))
	var unions []typeUnion
	for index, option := range options {
		union, err := collector.unionOf(option, context.child(fmt.Sprintf("%s|%d", context.place, index), names[index]))
		if err != nil {
			return typeUnion{}, err
		}
		unions = append(unions, union)
	}
	return merged(unions), nil
}

func (collector *typeCollector) ofType(kind string, schema *jsonObject, context printContext) (typeUnion, error) {
	simple := map[string][2]string{"string": {"string", "string"}, "integer": {"int64", "integer"}, "number": {"float64", "number"}, "boolean": {"bool", "boolean"}}
	if mapped, known := simple[kind]; known {
		return typeUnion{members: []memberModel{{goType: mapped[0], kind: mapped[1]}}}, nil
	}
	switch kind {
	case "null":
		return typeUnion{nullable: true}, nil
	case "array":
		item := unknownType
		if items := optionalRecord(schema.value("items")); items != nil {
			union, err := collector.unionOf(items, context.child(context.place+"[]", context.name+"Item"))
			if err != nil {
				return typeUnion{}, err
			}
			rendered, nullable, err := collector.render(union, context.child(context.place+"[]", context.name+"Item"))
			if err != nil {
				return typeUnion{}, err
			}
			item = elementType(rendered, nullable, context.direction)
		}
		return typeUnion{members: []memberModel{{goType: "[]" + item, kind: "list"}}}, nil
	case "object":
		member, err := collector.objectOf(schema, context)
		if err != nil {
			return typeUnion{}, err
		}
		return typeUnion{members: []memberModel{member}}, nil
	}
	return typeUnion{}, failf("%s has the type %s, which the SDK cannot carry.", context.place, kind)
}

func (collector *typeCollector) objectOf(schema *jsonObject, context printContext) (memberModel, error) {
	properties := optionalRecord(schema.value("properties"))
	required := requiredNamesOf(schema)
	for name := range required {
		if !properties.has(name) {
			return memberModel{}, failf("%s requires the undocumented %s.", context.place, name)
		}
	}
	if properties != nil && len(properties.keys) > 0 {
		var fields []fieldSchema
		member := memberModel{goType: context.name, kind: "object"}
		for _, name := range properties.keys {
			record := optionalRecord(properties.value(name))
			if record == nil {
				return memberModel{}, failf("%s.%s has no schema.", context.place, name)
			}
			fields = append(fields, fieldSchema{name: name, schema: record, required: required[name]})
			member.properties = append(member.properties, name)
			if required[name] {
				member.required = append(member.required, name)
			}
			if constant, present := record.get("const"); present {
				member.constants = append(member.constants, constantModel{property: name, value: constant})
			}
		}
		if err := collector.structOf(fields, context); err != nil {
			return memberModel{}, err
		}
		return member, nil
	}
	value := unknownType
	if additional := optionalRecord(schema.value("additionalProperties")); additional != nil {
		valueContext := context.child(context.place+"[key]", context.name+"Value")
		union, err := collector.unionOf(additional, valueContext)
		if err != nil {
			return memberModel{}, err
		}
		rendered, nullable, err := collector.render(union, valueContext)
		if err != nil {
			return memberModel{}, err
		}
		value = elementType(rendered, nullable, context.direction)
	}
	return memberModel{goType: "map[string]" + value, kind: "map"}, nil
}

func isReferenceLike(goType string) bool {
	return goType == unknownType || strings.HasPrefix(goType, "[]") || strings.HasPrefix(goType, "map[")
}

func elementType(goType string, nullable bool, direction string) string {
	if !nullable || isReferenceLike(goType) {
		return goType
	}
	if direction == "input" {
		return "Nullable[" + goType + "]"
	}
	return "*" + goType
}

func fieldType(goType string, nullable bool, required bool, direction string) string {
	if direction == "input" && nullable {
		return "Nullable[" + goType + "]"
	}
	if (required && !nullable) || isReferenceLike(goType) {
		return goType
	}
	return "*" + goType
}

func resolved(schema *jsonObject, context printContext) (*jsonObject, error) {
	raw, present := schema.get("$ref")
	if !present {
		return schema, nil
	}
	reference, isText := raw.(string)
	if !isText || !strings.HasPrefix(reference, componentReferencePrefix) {
		return nil, failf("%s holds the reference %v.", context.place, raw)
	}
	var current any = context.components
	for _, part := range strings.Split(strings.TrimPrefix(reference, componentReferencePrefix), "/") {
		current = optionalRecord(current).value(part)
	}
	target := optionalRecord(current)
	if target == nil {
		return nil, failf("%s holds the unknown reference %s.", context.place, reference)
	}
	for _, key := range schema.keys {
		if key != "$ref" && !strings.HasPrefix(key, extensionPrefix) && !validationKeywords[key] {
			return nil, failf("%s puts shape keywords beside its reference %s.", context.place, reference)
		}
	}
	return target, nil
}

func checkKeywords(schema *jsonObject, place string) error {
	for _, key := range schema.keys {
		if shapeKeywords[key] || validationKeywords[key] || strings.HasPrefix(key, extensionPrefix) {
			continue
		}
		return failf("%s uses the keyword %s, which the generator cannot convert.", place, key)
	}
	return nil
}
