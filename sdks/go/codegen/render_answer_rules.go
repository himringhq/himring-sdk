package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

const answerEventsOperation = "record_answer_events"

var (
	atMostExpectation        = regexp.MustCompile(`^<=(\d+)$`)
	regularExpressionLiteral = regexp.MustCompile(`(?s)^/(.+)/([a-z]*)$`)
)

type ruleReader struct {
	place string
}

func (reader ruleReader) schemaAt(root *jsonObject, keys ...string) (*jsonObject, error) {
	current := root
	for _, key := range keys {
		current = optionalRecord(current.value(key))
	}
	if current == nil {
		return nil, failf("The spec of %s has no schema at %s.", reader.place, strings.Join(keys, "."))
	}
	return current, nil
}

func (reader ruleReader) wholeNumberAt(schema *jsonObject, keyword string, place string) (int64, error) {
	value, isWhole := wholeNumberAt(schema.value(keyword))
	if !isWhole || value <= 0 {
		return 0, failf("The spec of %s has no %s for %s.", reader.place, keyword, place)
	}
	return value, nil
}

func (reader ruleReader) patternAt(schema *jsonObject, place string) (string, error) {
	pattern, isText := schema.value("pattern").(string)
	if !isText {
		return "", failf("The spec of %s has no pattern for %s.", reader.place, place)
	}
	if _, err := regexp.Compile(pattern); err != nil {
		return "", failf("The spec of %s gives %s a pattern that Go cannot compile: %v", reader.place, place, err)
	}
	return pattern, nil
}

func (reader ruleReader) ruleExpectation(schema *jsonObject, kind string, place string) (string, error) {
	for _, candidate := range listAt(schema.value("x-himring-rules")) {
		rule := optionalRecord(candidate)
		if rule.value("kind") != kind {
			continue
		}
		if expects, isText := rule.value("expects").(string); isText {
			return expects, nil
		}
	}
	return "", failf("The spec of %s has no %s rule for %s.", reader.place, kind, place)
}

func goPatternOf(literal string, place string) (string, error) {
	found := regularExpressionLiteral.FindStringSubmatch(literal)
	if found == nil {
		return "", failf("The spec of %s describes its time rule in an unknown way.", place)
	}
	flags := ""
	for _, flag := range found[2] {
		switch flag {
		case 'u':
		case 'i', 's', 'm':
			flags += string(flag)
		default:
			return "", failf("The spec of %s gives its time rule the flag %c.", place, flag)
		}
	}
	pattern := found[1]
	if flags != "" {
		pattern = "(?" + flags + ")" + pattern
	}
	if _, err := regexp.Compile(pattern); err != nil {
		return "", failf("The spec of %s gives a time rule that Go cannot compile: %v", place, err)
	}
	return pattern, nil
}

func renderAnswerRules(model *specModel) (string, error) {
	var operation *operationModel
	for index := range model.operations {
		if model.operations[index].id == answerEventsOperation {
			operation = &model.operations[index]
		}
	}
	if operation == nil || operation.body.schema == nil {
		return "", failf("The documents hold no %s operation with a JSON body.", answerEventsOperation)
	}
	reader := ruleReader{place: answerEventsOperation}
	events, err := reader.schemaAt(operation.body.schema, "properties", "events")
	if err != nil {
		return "", err
	}
	item, err := reader.schemaAt(events, "items")
	if err != nil {
		return "", err
	}
	cited, err := reader.schemaAt(item, "properties", "cited_chunk_ids")
	if err != nil {
		return "", err
	}
	eventsPerRequest, err := reader.wholeNumberAt(events, "maxItems", "events")
	if err != nil {
		return "", err
	}
	citedMaximum, err := reader.wholeNumberAt(cited, "maxItems", "cited_chunk_ids")
	if err != nil {
		return "", err
	}
	questionSchema, err := reader.schemaAt(item, "properties", "question_id")
	if err != nil {
		return "", err
	}
	questionPattern, err := reader.patternAt(questionSchema, "question_id")
	if err != nil {
		return "", err
	}
	chunkSchema, err := reader.schemaAt(cited, "items")
	if err != nil {
		return "", err
	}
	chunkPattern, err := reader.patternAt(chunkSchema, "cited_chunk_ids")
	if err != nil {
		return "", err
	}
	handoff, err := reader.schemaAt(item, "properties", "handoff_reason")
	if err != nil {
		return "", err
	}
	handoffExpectation, err := reader.ruleExpectation(handoff, "max_length", "handoff_reason")
	if err != nil {
		return "", err
	}
	bound := atMostExpectation.FindStringSubmatch(handoffExpectation)
	if bound == nil {
		return "", failf("The spec of %s gives handoff_reason a bound of %s, which is not a whole number.", answerEventsOperation, handoffExpectation)
	}
	handoffMaximum, err := strconv.ParseInt(bound[1], 10, 64)
	if err != nil {
		return "", failf("The spec of %s gives handoff_reason a bound of %s, which is not a whole number.", answerEventsOperation, handoffExpectation)
	}
	occurredAt, err := reader.schemaAt(item, "properties", "occurred_at")
	if err != nil {
		return "", err
	}
	timestampLiteral, err := reader.ruleExpectation(occurredAt, "iso_timestamp", "occurred_at")
	if err != nil {
		return "", err
	}
	timestampPattern, err := goPatternOf(timestampLiteral, answerEventsOperation)
	if err != nil {
		return "", err
	}
	return strings.Join([]string{
		"package answers",
		"",
		`import "regexp"`,
		"",
		"const (",
		fmt.Sprintf("\tanswerEventsPerRequest = %d", eventsPerRequest),
		fmt.Sprintf("\tcitedChunksMaximum = %d", citedMaximum),
		fmt.Sprintf("\thandoffReasonMaximum = %d", handoffMaximum),
		")",
		"",
		"var (",
		fmt.Sprintf("\tquestionIDPattern = regexp.MustCompile(%s)", strconv.Quote(questionPattern)),
		fmt.Sprintf("\tchunkIDPattern = regexp.MustCompile(%s)", strconv.Quote(chunkPattern)),
		fmt.Sprintf("\toccurredAtPattern = regexp.MustCompile(%s)", strconv.Quote(timestampPattern)),
		")",
		"",
	}, "\n"), nil
}
