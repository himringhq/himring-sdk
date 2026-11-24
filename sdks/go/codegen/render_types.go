package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

const fileContentType = "FileContent"

var reservedTypeNames = setOf("Client", "Error", "ErrorKind", "Issue", "MissingPermission", "Download", "Nullable", "Option",
	"RequestOption", "OperationDescription", "ResponseDescription", "BodyKind", "ResponseKind", "FileContent", "FileKind",
	"AddFileInput", "AddedFile", "DownloadFileInput", "UploadSource", "TransferOption", "MemoryWebhook", "MemoryWebhookEvent",
	"MemoryWebhookRejected", "MemoryWebhookRejection")

type definition interface {
	typeName() string
	text() string
}

type fieldSchema struct {
	name     string
	schema   *jsonObject
	required bool
}

type structField struct {
	goName string
	goType string
	tag    string
}

type structDefinition struct {
	name   string
	fields []structField
}

func (model *structDefinition) typeName() string {
	return model.name
}

func (model *structDefinition) text() string {
	if len(model.fields) == 0 {
		return fmt.Sprintf("type %s struct{}\n", model.name)
	}
	lines := []string{fmt.Sprintf("type %s struct {", model.name)}
	for _, field := range model.fields {
		lines = append(lines, fmt.Sprintf("\t%s %s `%s`", field.goName, field.goType, field.tag))
	}
	return strings.Join(append(lines, "}"), "\n") + "\n"
}

type unionDefinition struct {
	name    string
	members []memberModel
}

func (model *unionDefinition) typeName() string {
	return model.name
}

func goLiteral(value any) string {
	switch typed := value.(type) {
	case string:
		return strconv.Quote(typed)
	case bool:
		return strconv.FormatBool(typed)
	case json.Number:
		number, _ := typed.Float64()
		return "float64(" + strconv.FormatFloat(number, 'g', -1, 64) + ")"
	}
	return "nil"
}

func quotedList(values []string) string {
	quoted := make([]string, 0, len(values))
	for _, value := range values {
		quoted = append(quoted, strconv.Quote(value))
	}
	return "[]string{" + strings.Join(quoted, ", ") + "}"
}

func (model *unionDefinition) text() string {
	membersName := unexportedNameOf(model.name) + "Members"
	lines := []string{fmt.Sprintf("type %s struct {", model.name)}
	for _, member := range model.members {
		lines = append(lines, fmt.Sprintf("\t%s *%s", member.fieldName, member.goType))
	}
	lines = append(lines, "}", "", fmt.Sprintf("var %s = []unionMember{", membersName))
	kinds := map[string]string{"string": "unionString", "integer": "unionInteger", "number": "unionNumber", "boolean": "unionBoolean", "list": "unionList", "map": "unionMap", "object": "unionObject"}
	for _, member := range model.members {
		entry := []string{"kind: " + kinds[member.kind]}
		if member.kind == "object" {
			entry = append(entry, "required: "+quotedList(member.required), "properties: "+quotedList(member.properties))
			if len(member.constants) > 0 {
				var constants []string
				for _, constant := range member.constants {
					constants = append(constants, strconv.Quote(constant.property)+": "+goLiteral(constant.value))
				}
				entry = append(entry, "constants: map[string]any{"+strings.Join(constants, ", ")+"}")
			}
		}
		lines = append(lines, "\t{"+strings.Join(entry, ", ")+"},")
	}
	lines = append(lines, "}", "",
		fmt.Sprintf("func (union %s) MarshalJSON() ([]byte, error) {", model.name),
		fmt.Sprintf("\treturn marshalUnion(union, %q)", model.name),
		"}", "",
		fmt.Sprintf("func (union *%s) UnmarshalJSON(data []byte) error {", model.name),
		fmt.Sprintf("\treturn unmarshalUnion(data, union, %s, %q)", membersName, model.name),
		"}")
	return strings.Join(lines, "\n") + "\n"
}

type aliasDefinition struct {
	name   string
	goType string
}

func (model *aliasDefinition) typeName() string {
	return model.name
}

func (model *aliasDefinition) text() string {
	return fmt.Sprintf("type %s %s\n", model.name, model.goType)
}

type typeCollector struct {
	definitions map[string]definition
	order       []string
}

func (collector *typeCollector) register(model definition, place string) error {
	name := model.typeName()
	if reservedTypeNames[name] {
		return failf("%s needs the type name %s, which the SDK writes by hand.", place, name)
	}
	if known, seen := collector.definitions[name]; seen {
		if known.text() != model.text() {
			return failf("%s needs the type name %s, which another shape holds.", place, name)
		}
		return nil
	}
	collector.definitions[name] = model
	collector.order = append(collector.order, name)
	return nil
}

func (collector *typeCollector) structOf(fields []fieldSchema, context printContext) error {
	model := &structDefinition{name: context.name}
	used := map[string]bool{}
	for _, field := range fields {
		goName, err := exportedFieldName(field.name, context.place)
		if err != nil {
			return err
		}
		if used[goName] {
			return failf("%s takes two fields that share the Go name %s.", context.place, goName)
		}
		used[goName] = true
		child := context.child(context.place+"."+field.name, context.name+goName)
		union, err := collector.unionOf(field.schema, child)
		if err != nil {
			return err
		}
		rendered, nullable, err := collector.render(union, child)
		if err != nil {
			return err
		}
		tag := fmt.Sprintf(`json:"%s"`, field.name)
		if !field.required {
			tag = fmt.Sprintf(`json:"%s,omitzero"`, field.name)
		}
		model.fields = append(model.fields, structField{goName: goName, goType: fieldType(rendered, nullable, field.required, context.direction), tag: tag})
	}
	return collector.register(model, context.place)
}

type operationTypes struct {
	inputName      string
	outputName     string
	nullableFields []string
}

func operationTypesOf(operation operationModel, components *jsonObject, collector *typeCollector) (operationTypes, error) {
	types := operationTypes{inputName: inputTypeNameOf(operation.id)}
	fields, err := inputFieldsOf(operation)
	if err != nil {
		return types, err
	}
	context := printContext{direction: "input", components: components, place: operation.id + " input", name: types.inputName}
	var schemas []fieldSchema
	for _, field := range fields {
		schemas = append(schemas, fieldSchema{name: field.name, schema: field.schema, required: field.required})
		union, err := collector.unionOf(field.schema, context.child(context.place+"."+field.name, context.name+goNameOf(field.name)))
		if err != nil {
			return types, err
		}
		if union.nullable {
			types.nullableFields = append(types.nullableFields, field.name)
		}
	}
	if err := collector.structOf(schemas, context); err != nil {
		return types, err
	}
	if operation.body.kind == "file" {
		model, _ := collector.definitions[types.inputName].(*structDefinition)
		model.fields = append(model.fields, structField{goName: "Content", goType: fileContentType, tag: `json:"-"`})
	}
	if operation.response.isDownload {
		return types, nil
	}
	types.outputName = outputTypeNameOf(operation.id)
	outputContext := printContext{direction: "output", components: components, place: operation.id + " output", name: types.outputName}
	union, err := collector.unionOf(operation.response.schema, outputContext)
	if err != nil {
		return types, err
	}
	rendered, nullable, err := collector.render(union, outputContext)
	if err != nil {
		return types, err
	}
	if nullable {
		return types, failf("%s answers with a value that can be null.", operation.id)
	}
	if rendered != types.outputName {
		err = collector.register(&aliasDefinition{name: types.outputName, goType: rendered}, outputContext.place)
	}
	return types, err
}

type renderedTypes struct {
	text        string
	byOperation map[string]operationTypes
}

func renderTypes(model *specModel) (renderedTypes, error) {
	collector := &typeCollector{definitions: map[string]definition{}}
	byOperation := map[string]operationTypes{}
	for _, operation := range model.operations {
		types, err := operationTypesOf(operation, model.components[operation.document], collector)
		if err != nil {
			return renderedTypes{}, err
		}
		byOperation[operation.id] = types
	}
	var blocks []string
	for _, name := range collector.order {
		blocks = append(blocks, collector.definitions[name].text())
	}
	text := "package himring\n\n" + strings.Join(blocks, "\n")
	return renderedTypes{text: text, byOperation: byOperation}, nil
}
