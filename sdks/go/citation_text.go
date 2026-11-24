package himring

import (
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"
)

const (
	secondsPerMinute = 60
	secondsPerHour   = 3600
	otherCitation    = "Part of the file"
)

type citationFields struct {
	Kind        string    `json:"kind"`
	Pages       []float64 `json:"pages"`
	Sheet       *string   `json:"sheet"`
	FirstRow    float64   `json:"first_row"`
	LastRow     float64   `json:"last_row"`
	Slides      []float64 `json:"slides"`
	Heading     *string   `json:"heading"`
	Areas       []any     `json:"areas"`
	StartSecond float64   `json:"start_second"`
	EndSecond   float64   `json:"end_second"`
	Frame       *float64  `json:"frame"`
}

func FormatClock(totalSeconds float64) string {
	whole := int64(0)
	if !math.IsNaN(totalSeconds) && !math.IsInf(totalSeconds, 0) && totalSeconds > 0 {
		whole = int64(math.Floor(min(totalSeconds, math.MaxInt64/2)))
	}
	hours := whole / secondsPerHour
	minutes := whole % secondsPerHour / secondsPerMinute
	remainder := whole % secondsPerMinute
	if hours > 0 {
		return fmt.Sprintf("%d:%02d:%02d", hours, minutes, remainder)
	}
	return fmt.Sprintf("%d:%02d", minutes, remainder)
}

func numberText(value float64) string {
	return strconv.FormatFloat(value, 'f', -1, 64)
}

func numberRanges(numbers []float64) string {
	unique := map[float64]bool{}
	var sorted []float64
	for _, value := range numbers {
		if !unique[value] {
			unique[value] = true
			sorted = append(sorted, value)
		}
	}
	sort.Float64s(sorted)
	var runs [][2]float64
	for _, value := range sorted {
		if last := len(runs) - 1; last >= 0 && value == runs[last][1]+1 {
			runs[last][1] = value
		} else {
			runs = append(runs, [2]float64{value, value})
		}
	}
	texts := make([]string, 0, len(runs))
	for _, run := range runs {
		if run[0] == run[1] {
			texts = append(texts, numberText(run[0]))
		} else {
			texts = append(texts, numberText(run[0])+"–"+numberText(run[1]))
		}
	}
	return strings.Join(texts, ", ")
}

func numbered(numbers []float64, one string, many string) string {
	if len(numbers) == 0 {
		return "No " + strings.ToLower(one) + " number"
	}
	unique := map[float64]bool{}
	for _, value := range numbers {
		unique[value] = true
	}
	label := many
	if len(unique) == 1 {
		label = one
	}
	return label + " " + numberRanges(numbers)
}

func spreadsheetText(sheet *string, firstRow float64, lastRow float64) string {
	rows := "rows " + numberText(firstRow) + "–" + numberText(lastRow)
	if firstRow == lastRow {
		rows = "row " + numberText(firstRow)
	}
	if sheet == nil {
		return strings.ToUpper(rows[:1]) + rows[1:]
	}
	return "Sheet " + *sheet + ", " + rows
}

func CitationText(citation json.Marshaler) string {
	if isNilValue(citation) {
		return otherCitation
	}
	encoded, err := citation.MarshalJSON()
	if err != nil {
		return otherCitation
	}
	var fields citationFields
	if err := json.Unmarshal(encoded, &fields); err != nil {
		return otherCitation
	}
	switch fields.Kind {
	case "document":
		return numbered(fields.Pages, "Page", "Pages")
	case "spreadsheet":
		return spreadsheetText(fields.Sheet, fields.FirstRow, fields.LastRow)
	case "slides":
		return numbered(fields.Slides, "Slide", "Slides")
	case "web_page":
		if fields.Heading == nil {
			return "Web page"
		}
		return "Web page, section " + *fields.Heading
	case "image":
		if len(fields.Areas) == 0 {
			return "Whole image"
		}
		return "Part of the image"
	case "recording":
		span := "From " + FormatClock(fields.StartSecond) + " to " + FormatClock(fields.EndSecond)
		if fields.Frame == nil {
			return span
		}
		return span + ", frame " + numberText(*fields.Frame)
	}
	return otherCitation
}
