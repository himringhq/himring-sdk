package main

import (
	"fmt"
	"strings"
)

func methodLines(operation operationModel, types operationTypes) ([]string, error) {
	name := goNameOf(operation.id)
	if handWrittenMethods[name] {
		return nil, failf("%s has the name of a method that the client writes by hand.", operation.id)
	}
	signature := fmt.Sprintf("func (c *Client) %s(ctx context.Context, input %s, options ...RequestOption)", name, types.inputName)
	if operation.response.isDownload {
		return []string{
			signature + " (*Download, error) {",
			fmt.Sprintf("\treturn c.downloadOperation(ctx, %q, input, options)", operation.id),
			"}",
		}, nil
	}
	content := "nil"
	if operation.body.kind == "file" {
		content = "input.Content"
	}
	return []string{
		signature + fmt.Sprintf(" (*%s, error) {", types.outputName),
		fmt.Sprintf("\tvar output %s", types.outputName),
		fmt.Sprintf("\tif err := c.callOperation(ctx, %q, input, %s, &output, options); err != nil {", operation.id, content),
		"\t\treturn nil, err",
		"\t}",
		"\treturn &output, nil",
		"}",
	}, nil
}

func renderMethods(model *specModel, rendered renderedTypes) (string, error) {
	lines := []string{"package himring", "", `import "context"`}
	for _, operation := range model.operations {
		method, err := methodLines(operation, rendered.byOperation[operation.id])
		if err != nil {
			return "", err
		}
		lines = append(lines, "")
		lines = append(lines, method...)
	}
	return strings.Join(lines, "\n") + "\n", nil
}
