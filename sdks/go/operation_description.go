package himring

type BodyKind string

const (
	BodyKindNone BodyKind = "none"
	BodyKindJSON BodyKind = "json"
	BodyKindFile BodyKind = "file"
)

type ResponseKind string

const (
	ResponseKindJSON     ResponseKind = "json"
	ResponseKindDownload ResponseKind = "download"
)

type ResponseDescription struct {
	Kind          ResponseKind
	Status        int
	ContentTypes  []string
	FileExtension string
}

type OperationDescription struct {
	OperationID      string
	Method           string
	Path             string
	PathParameters   []string
	QueryParameters  []string
	BodyKind         BodyKind
	BodyFields       []string
	MaximumBodyBytes int64
	NullableFields   []string
	Response         ResponseDescription
}

func (operation *OperationDescription) isNullable(field string) bool {
	for _, name := range operation.NullableFields {
		if name == field {
			return true
		}
	}
	return false
}

func (operation *OperationDescription) clone() OperationDescription {
	copied := *operation
	copied.PathParameters = append([]string(nil), operation.PathParameters...)
	copied.QueryParameters = append([]string(nil), operation.QueryParameters...)
	copied.BodyFields = append([]string(nil), operation.BodyFields...)
	copied.NullableFields = append([]string(nil), operation.NullableFields...)
	copied.Response.ContentTypes = append([]string(nil), operation.Response.ContentTypes...)
	return copied
}

func Operation(operationID string) (OperationDescription, bool) {
	operation, known := operations[operationID]
	if !known {
		return OperationDescription{}, false
	}
	return operation.clone(), true
}

func OperationIDs() []string {
	return append([]string(nil), operationIDList...)
}
