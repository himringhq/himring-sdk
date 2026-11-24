package himring

type AcceptInvitationInput struct {
	Token string `json:"token"`
}

type AcceptInvitationOutput struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Region      string  `json:"region"`
	Role        *string `json:"role"`
	CreatedAt   string  `json:"created_at"`
	DeletedAt   *string `json:"deleted_at"`
	PurgeAfter  *string `json:"purge_after"`
	SirannonURL string  `json:"sirannon_url"`
	NarsilURL   string  `json:"narsil_url"`
}

type AddDatabaseMigrationInputExpectedMigrationVersion struct {
	Integer *int64
	String  *string
}

var addDatabaseMigrationInputExpectedMigrationVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union AddDatabaseMigrationInputExpectedMigrationVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AddDatabaseMigrationInputExpectedMigrationVersion")
}

func (union *AddDatabaseMigrationInputExpectedMigrationVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, addDatabaseMigrationInputExpectedMigrationVersionMembers, "AddDatabaseMigrationInputExpectedMigrationVersion")
}

type AddDatabaseMigrationInput struct {
	ProjectID                string                                             `json:"project_id"`
	DatabaseID               string                                             `json:"database_id"`
	Name                     string                                             `json:"name"`
	SQL                      string                                             `json:"sql"`
	ExpectedMigrationVersion *AddDatabaseMigrationInputExpectedMigrationVersion `json:"expected_migration_version,omitzero"`
}

type AddDatabaseMigrationOutput struct {
	Version float64 `json:"version"`
	Name    string  `json:"name"`
	SQL     string  `json:"sql"`
	AddedAt string  `json:"added_at"`
}

type AddMessagesInputItemsItemConversationTurnsItem struct {
	Speaker     string   `json:"speaker"`
	SpeakerKind *string  `json:"speaker_kind,omitzero"`
	Text        string   `json:"text"`
	At          *string  `json:"at,omitzero"`
	StartSecond *float64 `json:"start_second,omitzero"`
	EndSecond   *float64 `json:"end_second,omitzero"`
}

type AddMessagesInputItemsItemConversation struct {
	Kind       string                                           `json:"kind"`
	ExternalID string                                           `json:"external_id"`
	Version    int64                                            `json:"version"`
	Title      *string                                          `json:"title,omitzero"`
	Address    *string                                          `json:"address,omitzero"`
	OccurredAt *string                                          `json:"occurred_at,omitzero"`
	EndUserID  *string                                          `json:"end_user_id,omitzero"`
	TeamID     *string                                          `json:"team_id,omitzero"`
	Private    *bool                                            `json:"private,omitzero"`
	Turns      []AddMessagesInputItemsItemConversationTurnsItem `json:"turns"`
}

type AddMessagesInputItemsItemMessage struct {
	Kind              string  `json:"kind"`
	ExternalID        string  `json:"external_id"`
	Version           int64   `json:"version"`
	ConversationID    string  `json:"conversation_id"`
	ConversationTitle *string `json:"conversation_title,omitzero"`
	Address           *string `json:"address,omitzero"`
	Author            string  `json:"author"`
	AuthorKind        *string `json:"author_kind,omitzero"`
	Text              string  `json:"text"`
	SentAt            string  `json:"sent_at"`
	ReplyTo           *string `json:"reply_to,omitzero"`
	Reactions         *int64  `json:"reactions,omitzero"`
	EndUserID         *string `json:"end_user_id,omitzero"`
	TeamID            *string `json:"team_id,omitzero"`
	Private           *bool   `json:"private,omitzero"`
}

type AddMessagesInputItemsItemRecordFieldsValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var addMessagesInputItemsItemRecordFieldsValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union AddMessagesInputItemsItemRecordFieldsValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AddMessagesInputItemsItemRecordFieldsValue")
}

func (union *AddMessagesInputItemsItemRecordFieldsValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, addMessagesInputItemsItemRecordFieldsValueMembers, "AddMessagesInputItemsItemRecordFieldsValue")
}

type AddMessagesInputItemsItemRecord struct {
	Kind       string                                                          `json:"kind"`
	ExternalID string                                                          `json:"external_id"`
	Version    int64                                                           `json:"version"`
	Title      *string                                                         `json:"title,omitzero"`
	Address    *string                                                         `json:"address,omitzero"`
	EndUserID  *string                                                         `json:"end_user_id,omitzero"`
	Fields     map[string]Nullable[AddMessagesInputItemsItemRecordFieldsValue] `json:"fields"`
}

type AddMessagesInputItemsItemDeletion struct {
	Kind       string `json:"kind"`
	ExternalID string `json:"external_id"`
	Version    int64  `json:"version"`
}

type AddMessagesInputItemsItem struct {
	Conversation *AddMessagesInputItemsItemConversation
	Message      *AddMessagesInputItemsItemMessage
	Record       *AddMessagesInputItemsItemRecord
	Deletion     *AddMessagesInputItemsItemDeletion
}

var addMessagesInputItemsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "external_id", "version", "turns"}, properties: []string{"kind", "external_id", "version", "title", "address", "occurred_at", "end_user_id", "team_id", "private", "turns"}, constants: map[string]any{"kind": "conversation"}},
	{kind: unionObject, required: []string{"kind", "external_id", "version", "conversation_id", "author", "text", "sent_at"}, properties: []string{"kind", "external_id", "version", "conversation_id", "conversation_title", "address", "author", "author_kind", "text", "sent_at", "reply_to", "reactions", "end_user_id", "team_id", "private"}, constants: map[string]any{"kind": "message"}},
	{kind: unionObject, required: []string{"kind", "external_id", "version", "fields"}, properties: []string{"kind", "external_id", "version", "title", "address", "end_user_id", "fields"}, constants: map[string]any{"kind": "record"}},
	{kind: unionObject, required: []string{"kind", "external_id", "version"}, properties: []string{"kind", "external_id", "version"}, constants: map[string]any{"kind": "deletion"}},
}

func (union AddMessagesInputItemsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AddMessagesInputItemsItem")
}

func (union *AddMessagesInputItemsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, addMessagesInputItemsItemMembers, "AddMessagesInputItemsItem")
}

type AddMessagesInput struct {
	ProjectID string                      `json:"project_id"`
	MemoryID  string                      `json:"memory_id"`
	SourceID  string                      `json:"source_id"`
	Items     []AddMessagesInputItemsItem `json:"items"`
}

type AddMessagesOutputResultsItem struct {
	ExternalID string  `json:"external_id"`
	Version    float64 `json:"version"`
	Outcome    string  `json:"outcome"`
}

type AddMessagesOutput struct {
	Results []AddMessagesOutputResultsItem `json:"results"`
}

type AnswerQuestionInputMetadataValue struct {
	String *string
	List   *[]string
}

var answerQuestionInputMetadataValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union AnswerQuestionInputMetadataValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AnswerQuestionInputMetadataValue")
}

func (union *AnswerQuestionInputMetadataValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, answerQuestionInputMetadataValueMembers, "AnswerQuestionInputMetadataValue")
}

type AnswerQuestionInputLimit struct {
	Integer *int64
	String  *string
}

var answerQuestionInputLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union AnswerQuestionInputLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AnswerQuestionInputLimit")
}

func (union *AnswerQuestionInputLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, answerQuestionInputLimitMembers, "AnswerQuestionInputLimit")
}

type AnswerQuestionInput struct {
	ProjectID       string                                      `json:"project_id"`
	KnowledgeBaseID string                                      `json:"knowledge_base_id"`
	Question        string                                      `json:"question"`
	Limit           *AnswerQuestionInputLimit                   `json:"limit,omitzero"`
	Folder          *string                                     `json:"folder,omitzero"`
	Metadata        map[string]AnswerQuestionInputMetadataValue `json:"metadata,omitzero"`
	EndUserID       *string                                     `json:"end_user_id,omitzero"`
	CallID          *string                                     `json:"call_id,omitzero"`
}

type AnswerQuestionOutputPassagesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type AnswerQuestionOutputPassagesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type AnswerQuestionOutputPassagesItemCitationDocument struct {
	Kind      string                                                          `json:"kind"`
	Pages     []float64                                                       `json:"pages"`
	Areas     []AnswerQuestionOutputPassagesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []AnswerQuestionOutputPassagesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type AnswerQuestionOutputPassagesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type AnswerQuestionOutputPassagesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type AnswerQuestionOutputPassagesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type AnswerQuestionOutputPassagesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type AnswerQuestionOutputPassagesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type AnswerQuestionOutputPassagesItemCitationImage struct {
	Kind      string                                                       `json:"kind"`
	FileName  string                                                       `json:"file_name"`
	Areas     []AnswerQuestionOutputPassagesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []AnswerQuestionOutputPassagesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type AnswerQuestionOutputPassagesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type AnswerQuestionOutputPassagesItemCitation struct {
	Document    *AnswerQuestionOutputPassagesItemCitationDocument
	Spreadsheet *AnswerQuestionOutputPassagesItemCitationSpreadsheet
	Slides      *AnswerQuestionOutputPassagesItemCitationSlides
	WebPage     *AnswerQuestionOutputPassagesItemCitationWebPage
	Image       *AnswerQuestionOutputPassagesItemCitationImage
	Recording   *AnswerQuestionOutputPassagesItemCitationRecording
}

var answerQuestionOutputPassagesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union AnswerQuestionOutputPassagesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AnswerQuestionOutputPassagesItemCitation")
}

func (union *AnswerQuestionOutputPassagesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, answerQuestionOutputPassagesItemCitationMembers, "AnswerQuestionOutputPassagesItemCitation")
}

type AnswerQuestionOutputPassagesItemMatchCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type AnswerQuestionOutputPassagesItemMatchCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type AnswerQuestionOutputPassagesItemMatchCitationDocument struct {
	Kind      string                                                               `json:"kind"`
	Pages     []float64                                                            `json:"pages"`
	Areas     []AnswerQuestionOutputPassagesItemMatchCitationDocumentAreasItem     `json:"areas"`
	PageSizes []AnswerQuestionOutputPassagesItemMatchCitationDocumentPageSizesItem `json:"page_sizes"`
}

type AnswerQuestionOutputPassagesItemMatchCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type AnswerQuestionOutputPassagesItemMatchCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type AnswerQuestionOutputPassagesItemMatchCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type AnswerQuestionOutputPassagesItemMatchCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type AnswerQuestionOutputPassagesItemMatchCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type AnswerQuestionOutputPassagesItemMatchCitationImage struct {
	Kind      string                                                            `json:"kind"`
	FileName  string                                                            `json:"file_name"`
	Areas     []AnswerQuestionOutputPassagesItemMatchCitationImageAreasItem     `json:"areas"`
	PageSizes []AnswerQuestionOutputPassagesItemMatchCitationImagePageSizesItem `json:"page_sizes"`
}

type AnswerQuestionOutputPassagesItemMatchCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type AnswerQuestionOutputPassagesItemMatchCitation struct {
	Document    *AnswerQuestionOutputPassagesItemMatchCitationDocument
	Spreadsheet *AnswerQuestionOutputPassagesItemMatchCitationSpreadsheet
	Slides      *AnswerQuestionOutputPassagesItemMatchCitationSlides
	WebPage     *AnswerQuestionOutputPassagesItemMatchCitationWebPage
	Image       *AnswerQuestionOutputPassagesItemMatchCitationImage
	Recording   *AnswerQuestionOutputPassagesItemMatchCitationRecording
}

var answerQuestionOutputPassagesItemMatchCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union AnswerQuestionOutputPassagesItemMatchCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "AnswerQuestionOutputPassagesItemMatchCitation")
}

func (union *AnswerQuestionOutputPassagesItemMatchCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, answerQuestionOutputPassagesItemMatchCitationMembers, "AnswerQuestionOutputPassagesItemMatchCitation")
}

type AnswerQuestionOutputPassagesItemMatchRange struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type AnswerQuestionOutputPassagesItemMatchTermsItem struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type AnswerQuestionOutputPassagesItemMatch struct {
	Citation AnswerQuestionOutputPassagesItemMatchCitation    `json:"citation"`
	Range    AnswerQuestionOutputPassagesItemMatchRange       `json:"range"`
	Terms    []AnswerQuestionOutputPassagesItemMatchTermsItem `json:"terms"`
}

type AnswerQuestionOutputPassagesItem struct {
	ChunkID   string                                   `json:"chunk_id"`
	FileID    string                                   `json:"file_id"`
	FilePath  string                                   `json:"file_path"`
	FileKind  string                                   `json:"file_kind"`
	Version   float64                                  `json:"version"`
	Heading   *string                                  `json:"heading"`
	Text      string                                   `json:"text"`
	Truncated bool                                     `json:"truncated"`
	Score     float64                                  `json:"score"`
	Citation  AnswerQuestionOutputPassagesItemCitation `json:"citation"`
	Match     AnswerQuestionOutputPassagesItemMatch    `json:"match"`
}

type AnswerQuestionOutputAnswerStatementsItem struct {
	Text     string    `json:"text"`
	Passages []float64 `json:"passages"`
}

type AnswerQuestionOutputAnswer struct {
	Status       string                                     `json:"status"`
	Statements   []AnswerQuestionOutputAnswerStatementsItem `json:"statements"`
	PassagesRead float64                                    `json:"passages_read"`
}

type AnswerQuestionOutput struct {
	QuestionID string                             `json:"question_id"`
	DurationMs float64                            `json:"duration_ms"`
	Passages   []AnswerQuestionOutputPassagesItem `json:"passages"`
	Answer     AnswerQuestionOutputAnswer         `json:"answer"`
}

type ApplyTableImportInputColumnsItemSourceIndex struct {
	Integer *int64
	String  *string
}

var applyTableImportInputColumnsItemSourceIndexMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union ApplyTableImportInputColumnsItemSourceIndex) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ApplyTableImportInputColumnsItemSourceIndex")
}

func (union *ApplyTableImportInputColumnsItemSourceIndex) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, applyTableImportInputColumnsItemSourceIndexMembers, "ApplyTableImportInputColumnsItemSourceIndex")
}

type ApplyTableImportInputColumnsItem struct {
	SourceIndex ApplyTableImportInputColumnsItemSourceIndex `json:"source_index"`
	ColumnName  string                                      `json:"column_name"`
}

type ApplyTableImportInputNewTableColumnsItemDefaultValueValue struct {
	Number *float64
	String *string
}

var applyTableImportInputNewTableColumnsItemDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union ApplyTableImportInputNewTableColumnsItemDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ApplyTableImportInputNewTableColumnsItemDefaultValueValue")
}

func (union *ApplyTableImportInputNewTableColumnsItemDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, applyTableImportInputNewTableColumnsItemDefaultValueValueMembers, "ApplyTableImportInputNewTableColumnsItemDefaultValueValue")
}

type ApplyTableImportInputNewTableColumnsItemDefaultValue struct {
	Kind  string                                                    `json:"kind"`
	Value ApplyTableImportInputNewTableColumnsItemDefaultValueValue `json:"value"`
}

type ApplyTableImportInputNewTableColumnsItemDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type ApplyTableImportInputNewTableColumnsItemDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type ApplyTableImportInputNewTableColumnsItemDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type ApplyTableImportInputNewTableColumnsItemDefault struct {
	Value            *ApplyTableImportInputNewTableColumnsItemDefaultValue
	CurrentTimestamp *ApplyTableImportInputNewTableColumnsItemDefaultCurrentTimestamp
	CurrentDate      *ApplyTableImportInputNewTableColumnsItemDefaultCurrentDate
	CurrentTime      *ApplyTableImportInputNewTableColumnsItemDefaultCurrentTime
}

var applyTableImportInputNewTableColumnsItemDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union ApplyTableImportInputNewTableColumnsItemDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ApplyTableImportInputNewTableColumnsItemDefault")
}

func (union *ApplyTableImportInputNewTableColumnsItemDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, applyTableImportInputNewTableColumnsItemDefaultMembers, "ApplyTableImportInputNewTableColumnsItemDefault")
}

type ApplyTableImportInputNewTableColumnsItemReferences struct {
	Table    string  `json:"table"`
	Column   string  `json:"column"`
	OnDelete *string `json:"on_delete,omitzero"`
	OnUpdate *string `json:"on_update,omitzero"`
}

type ApplyTableImportInputNewTableColumnsItem struct {
	Name       string                                                       `json:"name"`
	Type       string                                                       `json:"type"`
	NotNull    *bool                                                        `json:"not_null,omitzero"`
	Default    Nullable[ApplyTableImportInputNewTableColumnsItemDefault]    `json:"default,omitzero"`
	PrimaryKey *bool                                                        `json:"primary_key,omitzero"`
	Unique     *bool                                                        `json:"unique,omitzero"`
	References Nullable[ApplyTableImportInputNewTableColumnsItemReferences] `json:"references,omitzero"`
}

type ApplyTableImportInputExpectedFailed struct {
	Integer *int64
	String  *string
}

var applyTableImportInputExpectedFailedMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union ApplyTableImportInputExpectedFailed) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ApplyTableImportInputExpectedFailed")
}

func (union *ApplyTableImportInputExpectedFailed) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, applyTableImportInputExpectedFailedMembers, "ApplyTableImportInputExpectedFailed")
}

type ApplyTableImportInputExpectedMigrationVersion struct {
	Integer *int64
	String  *string
}

var applyTableImportInputExpectedMigrationVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union ApplyTableImportInputExpectedMigrationVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ApplyTableImportInputExpectedMigrationVersion")
}

func (union *ApplyTableImportInputExpectedMigrationVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, applyTableImportInputExpectedMigrationVersionMembers, "ApplyTableImportInputExpectedMigrationVersion")
}

type ApplyTableImportInput struct {
	ProjectID                string                                               `json:"project_id"`
	DatabaseID               string                                               `json:"database_id"`
	ImportID                 string                                               `json:"import_id"`
	TableName                string                                               `json:"table_name"`
	Columns                  []ApplyTableImportInputColumnsItem                   `json:"columns"`
	NewTableColumns          Nullable[[]ApplyTableImportInputNewTableColumnsItem] `json:"new_table_columns,omitzero"`
	ExpectedFailed           ApplyTableImportInputExpectedFailed                  `json:"expected_failed"`
	ExpectedMigrationVersion ApplyTableImportInputExpectedMigrationVersion        `json:"expected_migration_version"`
}

type ApplyTableImportOutputImportedMigration struct {
	Version float64 `json:"version"`
	Name    string  `json:"name"`
	SQL     string  `json:"sql"`
	AddedAt string  `json:"added_at"`
}

type ApplyTableImportOutputImported struct {
	TableName string                                   `json:"table_name"`
	Inserted  float64                                  `json:"inserted"`
	Migration *ApplyTableImportOutputImportedMigration `json:"migration"`
}

type ApplyTableImportOutput struct {
	Imported ApplyTableImportOutputImported `json:"imported"`
}

type BeginSecondFactorSetupInput struct {
	Password string `json:"password"`
}

type BeginSecondFactorSetupOutput struct {
	TotpURI     string   `json:"totp_uri"`
	BackupCodes []string `json:"backup_codes"`
}

type CancelUploadInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	UploadID        string `json:"upload_id"`
}

type CancelUploadOutputFileFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CancelUploadOutputFileUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CancelUploadOutputFileUnreadPartsItem struct {
	FirstPage   *float64                                     `json:"first_page"`
	LastPage    *float64                                     `json:"last_page"`
	StartSecond *float64                                     `json:"start_second"`
	EndSecond   *float64                                     `json:"end_second"`
	Failure     CancelUploadOutputFileUnreadPartsItemFailure `json:"failure"`
}

type CancelUploadOutputFile struct {
	ID              string                                  `json:"id"`
	KnowledgeBaseID string                                  `json:"knowledge_base_id"`
	Path            string                                  `json:"path"`
	Kind            string                                  `json:"kind"`
	Address         *string                                 `json:"address"`
	Status          string                                  `json:"status"`
	CurrentVersion  *float64                                `json:"current_version"`
	LatestVersion   float64                                 `json:"latest_version"`
	SizeBytes       float64                                 `json:"size_bytes"`
	ContentSHA256   string                                  `json:"content_sha256"`
	Failure         *CancelUploadOutputFileFailure          `json:"failure"`
	UnreadParts     []CancelUploadOutputFileUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                       `json:"metadata"`
	CreatedAt       string                                  `json:"created_at"`
	UpdatedAt       string                                  `json:"updated_at"`
	DeletedAt       *string                                 `json:"deleted_at"`
	PurgeAfter      *string                                 `json:"purge_after"`
}

type CancelUploadOutputFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CancelUploadOutput struct {
	ID              string                     `json:"id"`
	KnowledgeBaseID string                     `json:"knowledge_base_id"`
	Path            string                     `json:"path"`
	Address         *string                    `json:"address"`
	SizeBytes       float64                    `json:"size_bytes"`
	ContentSHA256   string                     `json:"content_sha256"`
	Method          string                     `json:"method"`
	PartBytes       float64                    `json:"part_bytes"`
	PartCount       float64                    `json:"part_count"`
	State           string                     `json:"state"`
	Outcome         *string                    `json:"outcome"`
	File            *CancelUploadOutputFile    `json:"file"`
	Failure         *CancelUploadOutputFailure `json:"failure"`
	CreatedAt       string                     `json:"created_at"`
	DeadlineAt      string                     `json:"deadline_at"`
}

type ChangeTableColumnsInputChangesItemAddDefaultValueValue struct {
	Number *float64
	String *string
}

var changeTableColumnsInputChangesItemAddDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union ChangeTableColumnsInputChangesItemAddDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputChangesItemAddDefaultValueValue")
}

func (union *ChangeTableColumnsInputChangesItemAddDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputChangesItemAddDefaultValueValueMembers, "ChangeTableColumnsInputChangesItemAddDefaultValueValue")
}

type ChangeTableColumnsInputChangesItemAddDefaultValue struct {
	Kind  string                                                 `json:"kind"`
	Value ChangeTableColumnsInputChangesItemAddDefaultValueValue `json:"value"`
}

type ChangeTableColumnsInputChangesItemAddDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type ChangeTableColumnsInputChangesItemAddDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type ChangeTableColumnsInputChangesItemAddDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type ChangeTableColumnsInputChangesItemAddDefault struct {
	Value            *ChangeTableColumnsInputChangesItemAddDefaultValue
	CurrentTimestamp *ChangeTableColumnsInputChangesItemAddDefaultCurrentTimestamp
	CurrentDate      *ChangeTableColumnsInputChangesItemAddDefaultCurrentDate
	CurrentTime      *ChangeTableColumnsInputChangesItemAddDefaultCurrentTime
}

var changeTableColumnsInputChangesItemAddDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union ChangeTableColumnsInputChangesItemAddDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputChangesItemAddDefault")
}

func (union *ChangeTableColumnsInputChangesItemAddDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputChangesItemAddDefaultMembers, "ChangeTableColumnsInputChangesItemAddDefault")
}

type ChangeTableColumnsInputChangesItemAddPositionBefore struct {
	Side   string `json:"side"`
	Column string `json:"column"`
}

type ChangeTableColumnsInputChangesItemAddPositionAfter struct {
	Side   string `json:"side"`
	Column string `json:"column"`
}

type ChangeTableColumnsInputChangesItemAddPosition struct {
	Before *ChangeTableColumnsInputChangesItemAddPositionBefore
	After  *ChangeTableColumnsInputChangesItemAddPositionAfter
}

var changeTableColumnsInputChangesItemAddPositionMembers = []unionMember{
	{kind: unionObject, required: []string{"side", "column"}, properties: []string{"side", "column"}, constants: map[string]any{"side": "before"}},
	{kind: unionObject, required: []string{"side", "column"}, properties: []string{"side", "column"}, constants: map[string]any{"side": "after"}},
}

func (union ChangeTableColumnsInputChangesItemAddPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputChangesItemAddPosition")
}

func (union *ChangeTableColumnsInputChangesItemAddPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputChangesItemAddPositionMembers, "ChangeTableColumnsInputChangesItemAddPosition")
}

type ChangeTableColumnsInputChangesItemAdd struct {
	Kind     string                                                 `json:"kind"`
	Name     string                                                 `json:"name"`
	Type     string                                                 `json:"type"`
	NotNull  *bool                                                  `json:"not_null,omitzero"`
	Default  Nullable[ChangeTableColumnsInputChangesItemAddDefault] `json:"default,omitzero"`
	Position *ChangeTableColumnsInputChangesItemAddPosition         `json:"position,omitzero"`
}

type ChangeTableColumnsInputChangesItemRename struct {
	Kind    string `json:"kind"`
	Column  string `json:"column"`
	NewName string `json:"new_name"`
}

type ChangeTableColumnsInputChangesItemAlterDefaultValueValue struct {
	Number *float64
	String *string
}

var changeTableColumnsInputChangesItemAlterDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union ChangeTableColumnsInputChangesItemAlterDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputChangesItemAlterDefaultValueValue")
}

func (union *ChangeTableColumnsInputChangesItemAlterDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputChangesItemAlterDefaultValueValueMembers, "ChangeTableColumnsInputChangesItemAlterDefaultValueValue")
}

type ChangeTableColumnsInputChangesItemAlterDefaultValue struct {
	Kind  string                                                   `json:"kind"`
	Value ChangeTableColumnsInputChangesItemAlterDefaultValueValue `json:"value"`
}

type ChangeTableColumnsInputChangesItemAlterDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type ChangeTableColumnsInputChangesItemAlterDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type ChangeTableColumnsInputChangesItemAlterDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type ChangeTableColumnsInputChangesItemAlterDefault struct {
	Value            *ChangeTableColumnsInputChangesItemAlterDefaultValue
	CurrentTimestamp *ChangeTableColumnsInputChangesItemAlterDefaultCurrentTimestamp
	CurrentDate      *ChangeTableColumnsInputChangesItemAlterDefaultCurrentDate
	CurrentTime      *ChangeTableColumnsInputChangesItemAlterDefaultCurrentTime
}

var changeTableColumnsInputChangesItemAlterDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union ChangeTableColumnsInputChangesItemAlterDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputChangesItemAlterDefault")
}

func (union *ChangeTableColumnsInputChangesItemAlterDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputChangesItemAlterDefaultMembers, "ChangeTableColumnsInputChangesItemAlterDefault")
}

type ChangeTableColumnsInputChangesItemAlter struct {
	Kind    string                                                   `json:"kind"`
	Column  string                                                   `json:"column"`
	Type    *string                                                  `json:"type,omitzero"`
	NotNull *bool                                                    `json:"not_null,omitzero"`
	Default Nullable[ChangeTableColumnsInputChangesItemAlterDefault] `json:"default,omitzero"`
}

type ChangeTableColumnsInputChangesItemDrop struct {
	Kind   string `json:"kind"`
	Column string `json:"column"`
}

type ChangeTableColumnsInputChangesItem struct {
	Add    *ChangeTableColumnsInputChangesItemAdd
	Rename *ChangeTableColumnsInputChangesItemRename
	Alter  *ChangeTableColumnsInputChangesItemAlter
	Drop   *ChangeTableColumnsInputChangesItemDrop
}

var changeTableColumnsInputChangesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "name", "type"}, properties: []string{"kind", "name", "type", "not_null", "default", "position"}, constants: map[string]any{"kind": "add"}},
	{kind: unionObject, required: []string{"kind", "column", "new_name"}, properties: []string{"kind", "column", "new_name"}, constants: map[string]any{"kind": "rename"}},
	{kind: unionObject, required: []string{"kind", "column"}, properties: []string{"kind", "column", "type", "not_null", "default"}, constants: map[string]any{"kind": "alter"}},
	{kind: unionObject, required: []string{"kind", "column"}, properties: []string{"kind", "column"}, constants: map[string]any{"kind": "drop"}},
}

func (union ChangeTableColumnsInputChangesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputChangesItem")
}

func (union *ChangeTableColumnsInputChangesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputChangesItemMembers, "ChangeTableColumnsInputChangesItem")
}

type ChangeTableColumnsInputExpectedMigrationVersion struct {
	Integer *int64
	String  *string
}

var changeTableColumnsInputExpectedMigrationVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union ChangeTableColumnsInputExpectedMigrationVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ChangeTableColumnsInputExpectedMigrationVersion")
}

func (union *ChangeTableColumnsInputExpectedMigrationVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, changeTableColumnsInputExpectedMigrationVersionMembers, "ChangeTableColumnsInputExpectedMigrationVersion")
}

type ChangeTableColumnsInput struct {
	ProjectID                string                                          `json:"project_id"`
	DatabaseID               string                                          `json:"database_id"`
	TableName                string                                          `json:"table_name"`
	Changes                  []ChangeTableColumnsInputChangesItem            `json:"changes"`
	ExpectedMigrationVersion ChangeTableColumnsInputExpectedMigrationVersion `json:"expected_migration_version"`
}

type ChangeTableColumnsOutputMigration struct {
	Version float64 `json:"version"`
	Name    string  `json:"name"`
	SQL     string  `json:"sql"`
	AddedAt string  `json:"added_at"`
}

type ChangeTableColumnsOutputPreviewRowChecksItem struct {
	Column       string  `json:"column"`
	Check        string  `json:"check"`
	Rows         float64 `json:"rows"`
	RowsCapped   bool    `json:"rows_capped"`
	BlocksChange bool    `json:"blocks_change"`
}

type ChangeTableColumnsOutputPreview struct {
	TableName            string                                         `json:"table_name"`
	MigrationName        string                                         `json:"migration_name"`
	SQL                  string                                         `json:"sql"`
	BaseMigrationVersion float64                                        `json:"base_migration_version"`
	RebuildsTable        bool                                           `json:"rebuilds_table"`
	Destructive          bool                                           `json:"destructive"`
	Blocked              bool                                           `json:"blocked"`
	Warnings             []string                                       `json:"warnings"`
	RowCount             float64                                        `json:"row_count"`
	RowCountCapped       bool                                           `json:"row_count_capped"`
	RowChecks            []ChangeTableColumnsOutputPreviewRowChecksItem `json:"row_checks"`
	ColumnsBefore        []string                                       `json:"columns_before"`
	ColumnsAfter         []string                                       `json:"columns_after"`
	ChangedColumns       []string                                       `json:"changed_columns"`
}

type ChangeTableColumnsOutput struct {
	Migration ChangeTableColumnsOutputMigration `json:"migration"`
	Preview   ChangeTableColumnsOutputPreview   `json:"preview"`
}

type CheckTableImportInputColumnsItemSourceIndex struct {
	Integer *int64
	String  *string
}

var checkTableImportInputColumnsItemSourceIndexMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CheckTableImportInputColumnsItemSourceIndex) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CheckTableImportInputColumnsItemSourceIndex")
}

func (union *CheckTableImportInputColumnsItemSourceIndex) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, checkTableImportInputColumnsItemSourceIndexMembers, "CheckTableImportInputColumnsItemSourceIndex")
}

type CheckTableImportInputColumnsItem struct {
	SourceIndex CheckTableImportInputColumnsItemSourceIndex `json:"source_index"`
	ColumnName  string                                      `json:"column_name"`
}

type CheckTableImportInputNewTableColumnsItemDefaultValueValue struct {
	Number *float64
	String *string
}

var checkTableImportInputNewTableColumnsItemDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union CheckTableImportInputNewTableColumnsItemDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CheckTableImportInputNewTableColumnsItemDefaultValueValue")
}

func (union *CheckTableImportInputNewTableColumnsItemDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, checkTableImportInputNewTableColumnsItemDefaultValueValueMembers, "CheckTableImportInputNewTableColumnsItemDefaultValueValue")
}

type CheckTableImportInputNewTableColumnsItemDefaultValue struct {
	Kind  string                                                    `json:"kind"`
	Value CheckTableImportInputNewTableColumnsItemDefaultValueValue `json:"value"`
}

type CheckTableImportInputNewTableColumnsItemDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type CheckTableImportInputNewTableColumnsItemDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type CheckTableImportInputNewTableColumnsItemDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type CheckTableImportInputNewTableColumnsItemDefault struct {
	Value            *CheckTableImportInputNewTableColumnsItemDefaultValue
	CurrentTimestamp *CheckTableImportInputNewTableColumnsItemDefaultCurrentTimestamp
	CurrentDate      *CheckTableImportInputNewTableColumnsItemDefaultCurrentDate
	CurrentTime      *CheckTableImportInputNewTableColumnsItemDefaultCurrentTime
}

var checkTableImportInputNewTableColumnsItemDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union CheckTableImportInputNewTableColumnsItemDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CheckTableImportInputNewTableColumnsItemDefault")
}

func (union *CheckTableImportInputNewTableColumnsItemDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, checkTableImportInputNewTableColumnsItemDefaultMembers, "CheckTableImportInputNewTableColumnsItemDefault")
}

type CheckTableImportInputNewTableColumnsItemReferences struct {
	Table    string  `json:"table"`
	Column   string  `json:"column"`
	OnDelete *string `json:"on_delete,omitzero"`
	OnUpdate *string `json:"on_update,omitzero"`
}

type CheckTableImportInputNewTableColumnsItem struct {
	Name       string                                                       `json:"name"`
	Type       string                                                       `json:"type"`
	NotNull    *bool                                                        `json:"not_null,omitzero"`
	Default    Nullable[CheckTableImportInputNewTableColumnsItemDefault]    `json:"default,omitzero"`
	PrimaryKey *bool                                                        `json:"primary_key,omitzero"`
	Unique     *bool                                                        `json:"unique,omitzero"`
	References Nullable[CheckTableImportInputNewTableColumnsItemReferences] `json:"references,omitzero"`
}

type CheckTableImportInput struct {
	ProjectID       string                                               `json:"project_id"`
	DatabaseID      string                                               `json:"database_id"`
	ImportID        string                                               `json:"import_id"`
	TableName       string                                               `json:"table_name"`
	Columns         []CheckTableImportInputColumnsItem                   `json:"columns"`
	NewTableColumns Nullable[[]CheckTableImportInputNewTableColumnsItem] `json:"new_table_columns,omitzero"`
}

type CheckTableImportOutputCheckFailuresItem struct {
	Row     float64 `json:"row"`
	Message string  `json:"message"`
}

type CheckTableImportOutputCheck struct {
	ImportID             string                                    `json:"import_id"`
	TableName            string                                    `json:"table_name"`
	StagedRows           float64                                   `json:"staged_rows"`
	ImportableRows       float64                                   `json:"importable_rows"`
	FailedTotal          float64                                   `json:"failed_total"`
	FailuresCapped       bool                                      `json:"failures_capped"`
	Failures             []CheckTableImportOutputCheckFailuresItem `json:"failures"`
	BaseMigrationVersion float64                                   `json:"base_migration_version"`
	TableSQL             *string                                   `json:"table_sql"`
}

type CheckTableImportOutput struct {
	Check CheckTableImportOutputCheck `json:"check"`
}

type CompactDatabaseInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type CompactDatabaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CompactDatabaseOutputSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type CompactDatabaseOutputCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type CompactDatabaseOutput struct {
	ID               string                           `json:"id"`
	ProjectID        string                           `json:"project_id"`
	Name             string                           `json:"name"`
	CreatedAt        string                           `json:"created_at"`
	CreatedBy        CompactDatabaseOutputCreatedBy   `json:"created_by"`
	DeletedAt        *string                          `json:"deleted_at"`
	PurgeAfter       *string                          `json:"purge_after"`
	MigrationVersion float64                          `json:"migration_version"`
	SirannonURL      string                           `json:"sirannon_url"`
	Size             *CompactDatabaseOutputSize       `json:"size"`
	Compaction       *CompactDatabaseOutputCompaction `json:"compaction"`
	SQLWritePreview  bool                             `json:"sql_write_preview"`
}

type CompareIndexSearchInputBm25 struct {
	K1 *float64 `json:"k1,omitzero"`
	B  *float64 `json:"b,omitzero"`
}

type CompareIndexSearchInputFields struct {
	String *string
	List   *[]string
}

var compareIndexSearchInputFieldsMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union CompareIndexSearchInputFields) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputFields")
}

func (union *CompareIndexSearchInputFields) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputFieldsMembers, "CompareIndexSearchInputFields")
}

type CompareIndexSearchInputBoosts struct {
	String *string
	Map    *map[string]any
}

var compareIndexSearchInputBoostsMembers = []unionMember{
	{kind: unionString},
	{kind: unionMap},
}

func (union CompareIndexSearchInputBoosts) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputBoosts")
}

func (union *CompareIndexSearchInputBoosts) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputBoostsMembers, "CompareIndexSearchInputBoosts")
}

type CompareIndexSearchInputTermMatch struct {
	String  *string
	Integer *int64
}

var compareIndexSearchInputTermMatchMembers = []unionMember{
	{kind: unionString},
	{kind: unionInteger},
}

func (union CompareIndexSearchInputTermMatch) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputTermMatch")
}

func (union *CompareIndexSearchInputTermMatch) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputTermMatchMembers, "CompareIndexSearchInputTermMatch")
}

type CompareIndexSearchInputTolerance struct {
	Integer *int64
	String  *string
}

var compareIndexSearchInputToleranceMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CompareIndexSearchInputTolerance) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputTolerance")
}

func (union *CompareIndexSearchInputTolerance) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputToleranceMembers, "CompareIndexSearchInputTolerance")
}

type CompareIndexSearchInputPrefixLength struct {
	Integer *int64
	String  *string
}

var compareIndexSearchInputPrefixLengthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CompareIndexSearchInputPrefixLength) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputPrefixLength")
}

func (union *CompareIndexSearchInputPrefixLength) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputPrefixLengthMembers, "CompareIndexSearchInputPrefixLength")
}

type CompareIndexSearchInputMinimumScore struct {
	Number *float64
	String *string
}

var compareIndexSearchInputMinimumScoreMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union CompareIndexSearchInputMinimumScore) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputMinimumScore")
}

func (union *CompareIndexSearchInputMinimumScore) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputMinimumScoreMembers, "CompareIndexSearchInputMinimumScore")
}

type CompareIndexSearchInputFusionConstant struct {
	Integer *int64
	String  *string
}

var compareIndexSearchInputFusionConstantMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CompareIndexSearchInputFusionConstant) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputFusionConstant")
}

func (union *CompareIndexSearchInputFusionConstant) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputFusionConstantMembers, "CompareIndexSearchInputFusionConstant")
}

type CompareIndexSearchInputVectorWeight struct {
	Number *float64
	String *string
}

var compareIndexSearchInputVectorWeightMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union CompareIndexSearchInputVectorWeight) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputVectorWeight")
}

func (union *CompareIndexSearchInputVectorWeight) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputVectorWeightMembers, "CompareIndexSearchInputVectorWeight")
}

type CompareIndexSearchInputMinimumSimilarity struct {
	Number *float64
	String *string
}

var compareIndexSearchInputMinimumSimilarityMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union CompareIndexSearchInputMinimumSimilarity) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputMinimumSimilarity")
}

func (union *CompareIndexSearchInputMinimumSimilarity) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputMinimumSimilarityMembers, "CompareIndexSearchInputMinimumSimilarity")
}

type CompareIndexSearchInputVectorCandidates struct {
	Integer *int64
	String  *string
}

var compareIndexSearchInputVectorCandidatesMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CompareIndexSearchInputVectorCandidates) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputVectorCandidates")
}

func (union *CompareIndexSearchInputVectorCandidates) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputVectorCandidatesMembers, "CompareIndexSearchInputVectorCandidates")
}

type CompareIndexSearchInputLimit struct {
	Integer *int64
	String  *string
}

var compareIndexSearchInputLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CompareIndexSearchInputLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchInputLimit")
}

func (union *CompareIndexSearchInputLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchInputLimitMembers, "CompareIndexSearchInputLimit")
}

type CompareIndexSearchInput struct {
	ProjectID         string                                    `json:"project_id"`
	IndexID           string                                    `json:"index_id"`
	Query             string                                    `json:"query"`
	Filters           *string                                   `json:"filters,omitzero"`
	Mode              *string                                   `json:"mode,omitzero"`
	VectorField       *string                                   `json:"vector_field,omitzero"`
	Fields            *CompareIndexSearchInputFields            `json:"fields,omitzero"`
	Boosts            *CompareIndexSearchInputBoosts            `json:"boosts,omitzero"`
	TermMatch         *CompareIndexSearchInputTermMatch         `json:"term_match,omitzero"`
	Tolerance         *CompareIndexSearchInputTolerance         `json:"tolerance,omitzero"`
	PrefixLength      *CompareIndexSearchInputPrefixLength      `json:"prefix_length,omitzero"`
	Exact             *bool                                     `json:"exact,omitzero"`
	Prefix            *bool                                     `json:"prefix,omitzero"`
	PartialWords      *bool                                     `json:"partial_words,omitzero"`
	MinimumScore      *CompareIndexSearchInputMinimumScore      `json:"minimum_score,omitzero"`
	Fusion            *string                                   `json:"fusion,omitzero"`
	FusionConstant    *CompareIndexSearchInputFusionConstant    `json:"fusion_constant,omitzero"`
	VectorWeight      *CompareIndexSearchInputVectorWeight      `json:"vector_weight,omitzero"`
	MinimumSimilarity *CompareIndexSearchInputMinimumSimilarity `json:"minimum_similarity,omitzero"`
	VectorCandidates  *CompareIndexSearchInputVectorCandidates  `json:"vector_candidates,omitzero"`
	Bm25              *CompareIndexSearchInputBm25              `json:"bm25,omitzero"`
	Limit             *CompareIndexSearchInputLimit             `json:"limit,omitzero"`
}

type CompareIndexSearchOutputSavedBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type CompareIndexSearchOutputSavedPreviewSort struct {
	Field     string `json:"field"`
	Direction string `json:"direction"`
}

type CompareIndexSearchOutputSavedPreviewTuningTermMatch struct {
	String *string
	Number *float64
}

var compareIndexSearchOutputSavedPreviewTuningTermMatchMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
}

func (union CompareIndexSearchOutputSavedPreviewTuningTermMatch) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchOutputSavedPreviewTuningTermMatch")
}

func (union *CompareIndexSearchOutputSavedPreviewTuningTermMatch) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchOutputSavedPreviewTuningTermMatchMembers, "CompareIndexSearchOutputSavedPreviewTuningTermMatch")
}

type CompareIndexSearchOutputSavedPreviewTuning struct {
	Fields            []string                                             `json:"fields,omitzero"`
	Boosts            map[string]float64                                   `json:"boosts,omitzero"`
	TermMatch         *CompareIndexSearchOutputSavedPreviewTuningTermMatch `json:"term_match,omitzero"`
	Tolerance         *float64                                             `json:"tolerance,omitzero"`
	PrefixLength      *float64                                             `json:"prefix_length,omitzero"`
	Exact             *bool                                                `json:"exact,omitzero"`
	Prefix            *bool                                                `json:"prefix,omitzero"`
	PartialWords      *bool                                                `json:"partial_words,omitzero"`
	MinimumScore      *float64                                             `json:"minimum_score,omitzero"`
	Fusion            *string                                              `json:"fusion,omitzero"`
	FusionConstant    *float64                                             `json:"fusion_constant,omitzero"`
	VectorWeight      *float64                                             `json:"vector_weight,omitzero"`
	MinimumSimilarity *float64                                             `json:"minimum_similarity,omitzero"`
	VectorCandidates  *float64                                             `json:"vector_candidates,omitzero"`
}

type CompareIndexSearchOutputSavedPreviewFacetsItemValuesItem struct {
	Value string   `json:"value"`
	Count float64  `json:"count"`
	From  *float64 `json:"from"`
	To    *float64 `json:"to"`
}

type CompareIndexSearchOutputSavedPreviewFacetsItem struct {
	Field      string                                                     `json:"field"`
	Counted    string                                                     `json:"counted"`
	Values     []CompareIndexSearchOutputSavedPreviewFacetsItemValuesItem `json:"values"`
	ErrorBound float64                                                    `json:"error_bound"`
}

type CompareIndexSearchOutputSavedPreviewGroupsItem struct {
	Values map[string]any `json:"values"`
	Count  *float64       `json:"count"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItemFieldsItem struct {
	Field       string  `json:"field"`
	Count       float64 `json:"count"`
	FieldLength float64 `json:"field_length"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItem struct {
	Term   string                                                                      `json:"term"`
	Weight float64                                                                     `json:"weight"`
	Fields []CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItemFieldsItem `json:"fields"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemKeywordFieldScoresItem struct {
	Field string  `json:"field"`
	Score float64 `json:"score"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemKeyword struct {
	Rank        *float64                                                                `json:"rank"`
	Score       *float64                                                                `json:"score"`
	Terms       []CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItem       `json:"terms"`
	FieldScores []CompareIndexSearchOutputSavedPreviewResultsItemKeywordFieldScoresItem `json:"field_scores"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemVector struct {
	Rank       *float64 `json:"rank"`
	Similarity *float64 `json:"similarity"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItemMarksItem struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItem struct {
	Field string                                                                   `json:"field"`
	Marks []CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItemMarksItem `json:"marks"`
}

type CompareIndexSearchOutputSavedPreviewResultsItem struct {
	Rank       float64                                                         `json:"rank"`
	ID         string                                                          `json:"id"`
	Score      float64                                                         `json:"score"`
	Record     map[string]any                                                  `json:"record"`
	Keyword    CompareIndexSearchOutputSavedPreviewResultsItemKeyword          `json:"keyword"`
	Vector     *CompareIndexSearchOutputSavedPreviewResultsItemVector          `json:"vector"`
	Highlights []CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItem `json:"highlights"`
	Pinned     bool                                                            `json:"pinned"`
	Group      *float64                                                        `json:"group"`
}

type CompareIndexSearchOutputSavedPreview struct {
	Mode           string                                            `json:"mode"`
	VectorField    *string                                           `json:"vector_field"`
	Fusion         *string                                           `json:"fusion"`
	FusionConstant *float64                                          `json:"fusion_constant"`
	VectorWeight   *float64                                          `json:"vector_weight"`
	Sort           *CompareIndexSearchOutputSavedPreviewSort         `json:"sort"`
	Tuning         CompareIndexSearchOutputSavedPreviewTuning        `json:"tuning"`
	Facets         []CompareIndexSearchOutputSavedPreviewFacetsItem  `json:"facets"`
	Groups         []CompareIndexSearchOutputSavedPreviewGroupsItem  `json:"groups"`
	GroupCount     *float64                                          `json:"group_count"`
	TotalCount     float64                                           `json:"total_count"`
	TotalIsExact   bool                                              `json:"total_is_exact"`
	Offset         float64                                           `json:"offset"`
	NextOffset     *float64                                          `json:"next_offset"`
	DurationMs     float64                                           `json:"duration_ms"`
	Results        []CompareIndexSearchOutputSavedPreviewResultsItem `json:"results"`
}

type CompareIndexSearchOutputSaved struct {
	Bm25    CompareIndexSearchOutputSavedBm25    `json:"bm25"`
	Preview CompareIndexSearchOutputSavedPreview `json:"preview"`
}

type CompareIndexSearchOutputTunedBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type CompareIndexSearchOutputTunedPreviewSort struct {
	Field     string `json:"field"`
	Direction string `json:"direction"`
}

type CompareIndexSearchOutputTunedPreviewTuningTermMatch struct {
	String *string
	Number *float64
}

var compareIndexSearchOutputTunedPreviewTuningTermMatchMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
}

func (union CompareIndexSearchOutputTunedPreviewTuningTermMatch) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CompareIndexSearchOutputTunedPreviewTuningTermMatch")
}

func (union *CompareIndexSearchOutputTunedPreviewTuningTermMatch) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, compareIndexSearchOutputTunedPreviewTuningTermMatchMembers, "CompareIndexSearchOutputTunedPreviewTuningTermMatch")
}

type CompareIndexSearchOutputTunedPreviewTuning struct {
	Fields            []string                                             `json:"fields,omitzero"`
	Boosts            map[string]float64                                   `json:"boosts,omitzero"`
	TermMatch         *CompareIndexSearchOutputTunedPreviewTuningTermMatch `json:"term_match,omitzero"`
	Tolerance         *float64                                             `json:"tolerance,omitzero"`
	PrefixLength      *float64                                             `json:"prefix_length,omitzero"`
	Exact             *bool                                                `json:"exact,omitzero"`
	Prefix            *bool                                                `json:"prefix,omitzero"`
	PartialWords      *bool                                                `json:"partial_words,omitzero"`
	MinimumScore      *float64                                             `json:"minimum_score,omitzero"`
	Fusion            *string                                              `json:"fusion,omitzero"`
	FusionConstant    *float64                                             `json:"fusion_constant,omitzero"`
	VectorWeight      *float64                                             `json:"vector_weight,omitzero"`
	MinimumSimilarity *float64                                             `json:"minimum_similarity,omitzero"`
	VectorCandidates  *float64                                             `json:"vector_candidates,omitzero"`
}

type CompareIndexSearchOutputTunedPreviewFacetsItemValuesItem struct {
	Value string   `json:"value"`
	Count float64  `json:"count"`
	From  *float64 `json:"from"`
	To    *float64 `json:"to"`
}

type CompareIndexSearchOutputTunedPreviewFacetsItem struct {
	Field      string                                                     `json:"field"`
	Counted    string                                                     `json:"counted"`
	Values     []CompareIndexSearchOutputTunedPreviewFacetsItemValuesItem `json:"values"`
	ErrorBound float64                                                    `json:"error_bound"`
}

type CompareIndexSearchOutputTunedPreviewGroupsItem struct {
	Values map[string]any `json:"values"`
	Count  *float64       `json:"count"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItemFieldsItem struct {
	Field       string  `json:"field"`
	Count       float64 `json:"count"`
	FieldLength float64 `json:"field_length"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItem struct {
	Term   string                                                                      `json:"term"`
	Weight float64                                                                     `json:"weight"`
	Fields []CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItemFieldsItem `json:"fields"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemKeywordFieldScoresItem struct {
	Field string  `json:"field"`
	Score float64 `json:"score"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemKeyword struct {
	Rank        *float64                                                                `json:"rank"`
	Score       *float64                                                                `json:"score"`
	Terms       []CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItem       `json:"terms"`
	FieldScores []CompareIndexSearchOutputTunedPreviewResultsItemKeywordFieldScoresItem `json:"field_scores"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemVector struct {
	Rank       *float64 `json:"rank"`
	Similarity *float64 `json:"similarity"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItemMarksItem struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItem struct {
	Field string                                                                   `json:"field"`
	Marks []CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItemMarksItem `json:"marks"`
}

type CompareIndexSearchOutputTunedPreviewResultsItem struct {
	Rank       float64                                                         `json:"rank"`
	ID         string                                                          `json:"id"`
	Score      float64                                                         `json:"score"`
	Record     map[string]any                                                  `json:"record"`
	Keyword    CompareIndexSearchOutputTunedPreviewResultsItemKeyword          `json:"keyword"`
	Vector     *CompareIndexSearchOutputTunedPreviewResultsItemVector          `json:"vector"`
	Highlights []CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItem `json:"highlights"`
	Pinned     bool                                                            `json:"pinned"`
	Group      *float64                                                        `json:"group"`
}

type CompareIndexSearchOutputTunedPreview struct {
	Mode           string                                            `json:"mode"`
	VectorField    *string                                           `json:"vector_field"`
	Fusion         *string                                           `json:"fusion"`
	FusionConstant *float64                                          `json:"fusion_constant"`
	VectorWeight   *float64                                          `json:"vector_weight"`
	Sort           *CompareIndexSearchOutputTunedPreviewSort         `json:"sort"`
	Tuning         CompareIndexSearchOutputTunedPreviewTuning        `json:"tuning"`
	Facets         []CompareIndexSearchOutputTunedPreviewFacetsItem  `json:"facets"`
	Groups         []CompareIndexSearchOutputTunedPreviewGroupsItem  `json:"groups"`
	GroupCount     *float64                                          `json:"group_count"`
	TotalCount     float64                                           `json:"total_count"`
	TotalIsExact   bool                                              `json:"total_is_exact"`
	Offset         float64                                           `json:"offset"`
	NextOffset     *float64                                          `json:"next_offset"`
	DurationMs     float64                                           `json:"duration_ms"`
	Results        []CompareIndexSearchOutputTunedPreviewResultsItem `json:"results"`
}

type CompareIndexSearchOutputTuned struct {
	Bm25    CompareIndexSearchOutputTunedBm25    `json:"bm25"`
	Preview CompareIndexSearchOutputTunedPreview `json:"preview"`
}

type CompareIndexSearchOutput struct {
	Saved CompareIndexSearchOutputSaved `json:"saved"`
	Tuned CompareIndexSearchOutputTuned `json:"tuned"`
}

type CompleteUploadInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	UploadID        string `json:"upload_id"`
}

type CompleteUploadOutputFileFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CompleteUploadOutputFileUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CompleteUploadOutputFileUnreadPartsItem struct {
	FirstPage   *float64                                       `json:"first_page"`
	LastPage    *float64                                       `json:"last_page"`
	StartSecond *float64                                       `json:"start_second"`
	EndSecond   *float64                                       `json:"end_second"`
	Failure     CompleteUploadOutputFileUnreadPartsItemFailure `json:"failure"`
}

type CompleteUploadOutputFile struct {
	ID              string                                    `json:"id"`
	KnowledgeBaseID string                                    `json:"knowledge_base_id"`
	Path            string                                    `json:"path"`
	Kind            string                                    `json:"kind"`
	Address         *string                                   `json:"address"`
	Status          string                                    `json:"status"`
	CurrentVersion  *float64                                  `json:"current_version"`
	LatestVersion   float64                                   `json:"latest_version"`
	SizeBytes       float64                                   `json:"size_bytes"`
	ContentSHA256   string                                    `json:"content_sha256"`
	Failure         *CompleteUploadOutputFileFailure          `json:"failure"`
	UnreadParts     []CompleteUploadOutputFileUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                         `json:"metadata"`
	CreatedAt       string                                    `json:"created_at"`
	UpdatedAt       string                                    `json:"updated_at"`
	DeletedAt       *string                                   `json:"deleted_at"`
	PurgeAfter      *string                                   `json:"purge_after"`
}

type CompleteUploadOutputFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CompleteUploadOutput struct {
	ID              string                       `json:"id"`
	KnowledgeBaseID string                       `json:"knowledge_base_id"`
	Path            string                       `json:"path"`
	Address         *string                      `json:"address"`
	SizeBytes       float64                      `json:"size_bytes"`
	ContentSHA256   string                       `json:"content_sha256"`
	Method          string                       `json:"method"`
	PartBytes       float64                      `json:"part_bytes"`
	PartCount       float64                      `json:"part_count"`
	State           string                       `json:"state"`
	Outcome         *string                      `json:"outcome"`
	File            *CompleteUploadOutputFile    `json:"file"`
	Failure         *CompleteUploadOutputFailure `json:"failure"`
	CreatedAt       string                       `json:"created_at"`
	DeadlineAt      string                       `json:"deadline_at"`
}

type ConfirmSecondFactorSetupInput struct {
	Code string `json:"code"`
}

type ConfirmSecondFactorSetupOutputSessionAccount struct {
	ID         string  `json:"id"`
	Email      string  `json:"email"`
	Name       string  `json:"name"`
	Status     string  `json:"status"`
	CreatedAt  string  `json:"created_at"`
	DecidedAt  *string `json:"decided_at"`
	IsOperator bool    `json:"is_operator"`
}

type ConfirmSecondFactorSetupOutputSession struct {
	Account             ConfirmSecondFactorSetupOutputSessionAccount `json:"account"`
	SecondFactorEnabled bool                                         `json:"second_factor_enabled"`
	ExpiresAt           string                                       `json:"expires_at"`
}

type ConfirmSecondFactorSetupOutput struct {
	SessionToken string                                `json:"session_token"`
	Session      ConfirmSecondFactorSetupOutputSession `json:"session"`
}

type CreateAPIKeyInputPermissionsFull struct {
	Access string `json:"access"`
}

type CreateAPIKeyInputPermissionsRestrictedDatabases struct {
	Level       string             `json:"level"`
	ResourceIDs Nullable[[]string] `json:"resource_ids,omitzero"`
}

type CreateAPIKeyInputPermissionsRestrictedIndexes struct {
	Level       string             `json:"level"`
	ResourceIDs Nullable[[]string] `json:"resource_ids,omitzero"`
}

type CreateAPIKeyInputPermissionsRestrictedKnowledgeBases struct {
	Level       string             `json:"level"`
	ResourceIDs Nullable[[]string] `json:"resource_ids,omitzero"`
}

type CreateAPIKeyInputPermissionsRestrictedMemory struct {
	Level string `json:"level"`
}

type CreateAPIKeyInputPermissionsRestricted struct {
	Access         string                                                `json:"access"`
	Databases      *CreateAPIKeyInputPermissionsRestrictedDatabases      `json:"databases,omitzero"`
	Indexes        *CreateAPIKeyInputPermissionsRestrictedIndexes        `json:"indexes,omitzero"`
	KnowledgeBases *CreateAPIKeyInputPermissionsRestrictedKnowledgeBases `json:"knowledge_bases,omitzero"`
	Memory         *CreateAPIKeyInputPermissionsRestrictedMemory         `json:"memory,omitzero"`
}

type CreateAPIKeyInputPermissions struct {
	Full       *CreateAPIKeyInputPermissionsFull
	Restricted *CreateAPIKeyInputPermissionsRestricted
}

var createAPIKeyInputPermissionsMembers = []unionMember{
	{kind: unionObject, required: []string{"access"}, properties: []string{"access"}, constants: map[string]any{"access": "full"}},
	{kind: unionObject, required: []string{"access"}, properties: []string{"access", "databases", "indexes", "knowledge_bases", "memory"}, constants: map[string]any{"access": "restricted"}},
}

func (union CreateAPIKeyInputPermissions) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateAPIKeyInputPermissions")
}

func (union *CreateAPIKeyInputPermissions) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createAPIKeyInputPermissionsMembers, "CreateAPIKeyInputPermissions")
}

type CreateAPIKeyInput struct {
	ProjectID   string                       `json:"project_id"`
	Name        string                       `json:"name"`
	Permissions CreateAPIKeyInputPermissions `json:"permissions"`
	ExpiresAt   Nullable[string]             `json:"expires_at,omitzero"`
}

type CreateAPIKeyOutputAPIKeyPermissionsDatabases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type CreateAPIKeyOutputAPIKeyPermissionsIndexes struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type CreateAPIKeyOutputAPIKeyPermissionsKnowledgeBases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type CreateAPIKeyOutputAPIKeyPermissionsMemory struct {
	Level string `json:"level"`
}

type CreateAPIKeyOutputAPIKeyPermissions struct {
	Access         string                                            `json:"access"`
	Databases      CreateAPIKeyOutputAPIKeyPermissionsDatabases      `json:"databases"`
	Indexes        CreateAPIKeyOutputAPIKeyPermissionsIndexes        `json:"indexes"`
	KnowledgeBases CreateAPIKeyOutputAPIKeyPermissionsKnowledgeBases `json:"knowledge_bases"`
	Memory         CreateAPIKeyOutputAPIKeyPermissionsMemory         `json:"memory"`
}

type CreateAPIKeyOutputAPIKey struct {
	ID                       string                              `json:"id"`
	ProjectID                string                              `json:"project_id"`
	Name                     string                              `json:"name"`
	DisplayPrefix            string                              `json:"display_prefix"`
	Permissions              CreateAPIKeyOutputAPIKeyPermissions `json:"permissions"`
	PermissionsChangedAt     *string                             `json:"permissions_changed_at"`
	PermissionsChangedByName *string                             `json:"permissions_changed_by_name"`
	CreatedBy                string                              `json:"created_by"`
	CreatedByName            string                              `json:"created_by_name"`
	CreatedAt                string                              `json:"created_at"`
	ExpiresAt                *string                             `json:"expires_at"`
	LastUsedAt               *string                             `json:"last_used_at"`
	RevokedAt                *string                             `json:"revoked_at"`
}

type CreateAPIKeyOutput struct {
	APIKey CreateAPIKeyOutputAPIKey `json:"api_key"`
	Secret string                   `json:"secret"`
}

type CreateCorrectionInputSettingFieldBoost struct {
	Kind    string  `json:"kind"`
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type CreateCorrectionInputSettingOption1 struct {
	Kind         string `json:"kind"`
	Strategy     string `json:"strategy"`
	RankConstant int64  `json:"rank_constant"`
}

type CreateCorrectionInputSettingOption2 struct {
	Kind         string  `json:"kind"`
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type CreateCorrectionInputSettingBm25 struct {
	Kind string  `json:"kind"`
	K1   float64 `json:"k1"`
	B    float64 `json:"b"`
}

type CreateCorrectionInputSettingStopWords struct {
	Kind    string   `json:"kind"`
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type CreateCorrectionInputSettingSynonymsRulesItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type CreateCorrectionInputSettingSynonymsRulesItemOption2 struct {
	Words []string `json:"words"`
}

type CreateCorrectionInputSettingSynonymsRulesItem struct {
	Option1 *CreateCorrectionInputSettingSynonymsRulesItemOption1
	Option2 *CreateCorrectionInputSettingSynonymsRulesItemOption2
}

var createCorrectionInputSettingSynonymsRulesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union CreateCorrectionInputSettingSynonymsRulesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateCorrectionInputSettingSynonymsRulesItem")
}

func (union *CreateCorrectionInputSettingSynonymsRulesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createCorrectionInputSettingSynonymsRulesItemMembers, "CreateCorrectionInputSettingSynonymsRulesItem")
}

type CreateCorrectionInputSettingSynonyms struct {
	Kind  string                                          `json:"kind"`
	Rules []CreateCorrectionInputSettingSynonymsRulesItem `json:"rules"`
}

type CreateCorrectionInputSettingLanguage struct {
	Kind     string `json:"kind"`
	Language string `json:"language"`
}

type CreateCorrectionInputSettingChunking struct {
	Kind        string `json:"kind"`
	ChunkTokens int64  `json:"chunk_tokens"`
}

type CreateCorrectionInputSettingRebuild struct {
	Kind string `json:"kind"`
}

type CreateCorrectionInputSettingAgentDepthDepth struct {
	Integer *int64
	String  *string
}

var createCorrectionInputSettingAgentDepthDepthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CreateCorrectionInputSettingAgentDepthDepth) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateCorrectionInputSettingAgentDepthDepth")
}

func (union *CreateCorrectionInputSettingAgentDepthDepth) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createCorrectionInputSettingAgentDepthDepthMembers, "CreateCorrectionInputSettingAgentDepthDepth")
}

type CreateCorrectionInputSettingAgentDepth struct {
	Kind  string                                      `json:"kind"`
	Depth CreateCorrectionInputSettingAgentDepthDepth `json:"depth"`
}

type CreateCorrectionInputSetting struct {
	FieldBoost *CreateCorrectionInputSettingFieldBoost
	Option1    *CreateCorrectionInputSettingOption1
	Option2    *CreateCorrectionInputSettingOption2
	Bm25       *CreateCorrectionInputSettingBm25
	StopWords  *CreateCorrectionInputSettingStopWords
	Synonyms   *CreateCorrectionInputSettingSynonyms
	Language   *CreateCorrectionInputSettingLanguage
	Chunking   *CreateCorrectionInputSettingChunking
	Rebuild    *CreateCorrectionInputSettingRebuild
	AgentDepth *CreateCorrectionInputSettingAgentDepth
}

var createCorrectionInputSettingMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "text", "heading"}, properties: []string{"kind", "text", "heading"}, constants: map[string]any{"kind": "field_boost"}},
	{kind: unionObject, required: []string{"kind", "strategy", "rank_constant"}, properties: []string{"kind", "strategy", "rank_constant"}, constants: map[string]any{"kind": "fusion", "strategy": "rrf"}},
	{kind: unionObject, required: []string{"kind", "strategy", "vector_weight"}, properties: []string{"kind", "strategy", "vector_weight"}, constants: map[string]any{"kind": "fusion", "strategy": "linear"}},
	{kind: unionObject, required: []string{"kind", "k1", "b"}, properties: []string{"kind", "k1", "b"}, constants: map[string]any{"kind": "bm25"}},
	{kind: unionObject, required: []string{"kind", "added", "removed"}, properties: []string{"kind", "added", "removed"}, constants: map[string]any{"kind": "stop_words"}},
	{kind: unionObject, required: []string{"kind", "rules"}, properties: []string{"kind", "rules"}, constants: map[string]any{"kind": "synonyms"}},
	{kind: unionObject, required: []string{"kind", "language"}, properties: []string{"kind", "language"}, constants: map[string]any{"kind": "language"}},
	{kind: unionObject, required: []string{"kind", "chunk_tokens"}, properties: []string{"kind", "chunk_tokens"}, constants: map[string]any{"kind": "chunking"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "rebuild"}},
	{kind: unionObject, required: []string{"kind", "depth"}, properties: []string{"kind", "depth"}, constants: map[string]any{"kind": "agent_depth"}},
}

func (union CreateCorrectionInputSetting) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateCorrectionInputSetting")
}

func (union *CreateCorrectionInputSetting) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createCorrectionInputSettingMembers, "CreateCorrectionInputSetting")
}

type CreateCorrectionInput struct {
	ProjectID       string                       `json:"project_id"`
	KnowledgeBaseID string                       `json:"knowledge_base_id"`
	Setting         CreateCorrectionInputSetting `json:"setting"`
	TargetIDs       []string                     `json:"target_ids,omitzero"`
}

type CreateCorrectionOutputSettingFieldBoost struct {
	Kind    string  `json:"kind"`
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type CreateCorrectionOutputSettingOption1 struct {
	Kind         string `json:"kind"`
	Strategy     string `json:"strategy"`
	RankConstant int64  `json:"rank_constant"`
}

type CreateCorrectionOutputSettingOption2 struct {
	Kind         string  `json:"kind"`
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type CreateCorrectionOutputSettingBm25 struct {
	Kind string  `json:"kind"`
	K1   float64 `json:"k1"`
	B    float64 `json:"b"`
}

type CreateCorrectionOutputSettingStopWords struct {
	Kind    string   `json:"kind"`
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type CreateCorrectionOutputSettingSynonymsRulesItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type CreateCorrectionOutputSettingSynonymsRulesItemOption2 struct {
	Words []string `json:"words"`
}

type CreateCorrectionOutputSettingSynonymsRulesItem struct {
	Option1 *CreateCorrectionOutputSettingSynonymsRulesItemOption1
	Option2 *CreateCorrectionOutputSettingSynonymsRulesItemOption2
}

var createCorrectionOutputSettingSynonymsRulesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union CreateCorrectionOutputSettingSynonymsRulesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateCorrectionOutputSettingSynonymsRulesItem")
}

func (union *CreateCorrectionOutputSettingSynonymsRulesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createCorrectionOutputSettingSynonymsRulesItemMembers, "CreateCorrectionOutputSettingSynonymsRulesItem")
}

type CreateCorrectionOutputSettingSynonyms struct {
	Kind  string                                           `json:"kind"`
	Rules []CreateCorrectionOutputSettingSynonymsRulesItem `json:"rules"`
}

type CreateCorrectionOutputSettingLanguage struct {
	Kind     string `json:"kind"`
	Language string `json:"language"`
}

type CreateCorrectionOutputSettingChunking struct {
	Kind        string `json:"kind"`
	ChunkTokens int64  `json:"chunk_tokens"`
}

type CreateCorrectionOutputSettingRebuild struct {
	Kind string `json:"kind"`
}

type CreateCorrectionOutputSettingAgentDepth struct {
	Kind  string  `json:"kind"`
	Depth float64 `json:"depth"`
}

type CreateCorrectionOutputSetting struct {
	FieldBoost *CreateCorrectionOutputSettingFieldBoost
	Option1    *CreateCorrectionOutputSettingOption1
	Option2    *CreateCorrectionOutputSettingOption2
	Bm25       *CreateCorrectionOutputSettingBm25
	StopWords  *CreateCorrectionOutputSettingStopWords
	Synonyms   *CreateCorrectionOutputSettingSynonyms
	Language   *CreateCorrectionOutputSettingLanguage
	Chunking   *CreateCorrectionOutputSettingChunking
	Rebuild    *CreateCorrectionOutputSettingRebuild
	AgentDepth *CreateCorrectionOutputSettingAgentDepth
}

var createCorrectionOutputSettingMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "text", "heading"}, properties: []string{"kind", "text", "heading"}, constants: map[string]any{"kind": "field_boost"}},
	{kind: unionObject, required: []string{"kind", "strategy", "rank_constant"}, properties: []string{"kind", "strategy", "rank_constant"}, constants: map[string]any{"kind": "fusion", "strategy": "rrf"}},
	{kind: unionObject, required: []string{"kind", "strategy", "vector_weight"}, properties: []string{"kind", "strategy", "vector_weight"}, constants: map[string]any{"kind": "fusion", "strategy": "linear"}},
	{kind: unionObject, required: []string{"kind", "k1", "b"}, properties: []string{"kind", "k1", "b"}, constants: map[string]any{"kind": "bm25"}},
	{kind: unionObject, required: []string{"kind", "added", "removed"}, properties: []string{"kind", "added", "removed"}, constants: map[string]any{"kind": "stop_words"}},
	{kind: unionObject, required: []string{"kind", "rules"}, properties: []string{"kind", "rules"}, constants: map[string]any{"kind": "synonyms"}},
	{kind: unionObject, required: []string{"kind", "language"}, properties: []string{"kind", "language"}, constants: map[string]any{"kind": "language"}},
	{kind: unionObject, required: []string{"kind", "chunk_tokens"}, properties: []string{"kind", "chunk_tokens"}, constants: map[string]any{"kind": "chunking"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "rebuild"}},
	{kind: unionObject, required: []string{"kind", "depth"}, properties: []string{"kind", "depth"}, constants: map[string]any{"kind": "agent_depth"}},
}

func (union CreateCorrectionOutputSetting) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateCorrectionOutputSetting")
}

func (union *CreateCorrectionOutputSetting) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createCorrectionOutputSettingMembers, "CreateCorrectionOutputSetting")
}

type CreateCorrectionOutputEstimate struct {
	Seconds          float64  `json:"seconds"`
	MemoryBytes      float64  `json:"memory_bytes"`
	SecondIndex      bool     `json:"second_index"`
	ChunksToIndex    float64  `json:"chunks_to_index"`
	QuestionsToScore float64  `json:"questions_to_score"`
	PriceUsd         *float64 `json:"price_usd"`
}

type CreateCorrectionOutputBeforeTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type CreateCorrectionOutputBeforeHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type CreateCorrectionOutputBefore struct {
	ScorecardID *string                              `json:"scorecard_id"`
	Tuning      CreateCorrectionOutputBeforeTuning   `json:"tuning"`
	HeldBack    CreateCorrectionOutputBeforeHeldBack `json:"held_back"`
}

type CreateCorrectionOutputAfterTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type CreateCorrectionOutputAfterHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type CreateCorrectionOutputAfter struct {
	ScorecardID *string                             `json:"scorecard_id"`
	Tuning      CreateCorrectionOutputAfterTuning   `json:"tuning"`
	HeldBack    CreateCorrectionOutputAfterHeldBack `json:"held_back"`
}

type CreateCorrectionOutputQuestionChanges struct {
	NowPass   float64 `json:"now_pass"`
	NowFail   float64 `json:"now_fail"`
	MovedUp   float64 `json:"moved_up"`
	MovedDown float64 `json:"moved_down"`
}

type CreateCorrectionOutput struct {
	ID              string                                 `json:"id"`
	Origin          string                                 `json:"origin"`
	Cause           *string                                `json:"cause"`
	Kind            string                                 `json:"kind"`
	Setting         CreateCorrectionOutputSetting          `json:"setting"`
	TargetIDs       []string                               `json:"target_ids"`
	FileKinds       []string                               `json:"file_kinds"`
	Status          string                                 `json:"status"`
	PassID          *string                                `json:"pass_id"`
	Estimate        CreateCorrectionOutputEstimate         `json:"estimate"`
	Before          *CreateCorrectionOutputBefore          `json:"before"`
	After           *CreateCorrectionOutputAfter           `json:"after"`
	Verdict         string                                 `json:"verdict"`
	QuestionChanges *CreateCorrectionOutputQuestionChanges `json:"question_changes"`
	WaitsForClick   bool                                   `json:"waits_for_click"`
	WaitReason      *string                                `json:"wait_reason"`
	DecidedBy       *string                                `json:"decided_by"`
	DecisionNote    *string                                `json:"decision_note"`
	FailureMessage  *string                                `json:"failure_message"`
	CreatedAt       string                                 `json:"created_at"`
	TriedAt         *string                                `json:"tried_at"`
	DecidedAt       *string                                `json:"decided_at"`
}

type CreateDatabaseInputMigrationsItem struct {
	Name string `json:"name"`
	SQL  string `json:"sql"`
}

type CreateDatabaseInput struct {
	ProjectID       string                              `json:"project_id"`
	Name            string                              `json:"name"`
	Migrations      []CreateDatabaseInputMigrationsItem `json:"migrations,omitzero"`
	SQLWritePreview *bool                               `json:"sql_write_preview,omitzero"`
}

type CreateDatabaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateDatabaseOutputSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type CreateDatabaseOutputCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type CreateDatabaseOutput struct {
	ID               string                          `json:"id"`
	ProjectID        string                          `json:"project_id"`
	Name             string                          `json:"name"`
	CreatedAt        string                          `json:"created_at"`
	CreatedBy        CreateDatabaseOutputCreatedBy   `json:"created_by"`
	DeletedAt        *string                         `json:"deleted_at"`
	PurgeAfter       *string                         `json:"purge_after"`
	MigrationVersion float64                         `json:"migration_version"`
	SirannonURL      string                          `json:"sirannon_url"`
	Size             *CreateDatabaseOutputSize       `json:"size"`
	Compaction       *CreateDatabaseOutputCompaction `json:"compaction"`
	SQLWritePreview  bool                            `json:"sql_write_preview"`
}

type CreateIndexInputConfigSchemaValueValueValue struct {
	String *string
	Map    *map[string]string
}

var createIndexInputConfigSchemaValueValueValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionMap},
}

func (union CreateIndexInputConfigSchemaValueValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateIndexInputConfigSchemaValueValueValue")
}

func (union *CreateIndexInputConfigSchemaValueValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createIndexInputConfigSchemaValueValueValueMembers, "CreateIndexInputConfigSchemaValueValueValue")
}

type CreateIndexInputConfigSchemaValueValue struct {
	String *string
	Map    *map[string]CreateIndexInputConfigSchemaValueValueValue
}

var createIndexInputConfigSchemaValueValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionMap},
}

func (union CreateIndexInputConfigSchemaValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateIndexInputConfigSchemaValueValue")
}

func (union *CreateIndexInputConfigSchemaValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createIndexInputConfigSchemaValueValueMembers, "CreateIndexInputConfigSchemaValueValue")
}

type CreateIndexInputConfigSchemaValue struct {
	String *string
	Map    *map[string]CreateIndexInputConfigSchemaValueValue
}

var createIndexInputConfigSchemaValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionMap},
}

func (union CreateIndexInputConfigSchemaValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateIndexInputConfigSchemaValue")
}

func (union *CreateIndexInputConfigSchemaValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createIndexInputConfigSchemaValueMembers, "CreateIndexInputConfigSchemaValue")
}

type CreateIndexInputConfigEmbeddingFieldsValue struct {
	String *string
	List   *[]string
}

var createIndexInputConfigEmbeddingFieldsValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union CreateIndexInputConfigEmbeddingFieldsValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateIndexInputConfigEmbeddingFieldsValue")
}

func (union *CreateIndexInputConfigEmbeddingFieldsValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createIndexInputConfigEmbeddingFieldsValueMembers, "CreateIndexInputConfigEmbeddingFieldsValue")
}

type CreateIndexInputConfigEmbedding struct {
	Fields map[string]CreateIndexInputConfigEmbeddingFieldsValue `json:"fields"`
}

type CreateIndexInputConfigBm25 struct {
	K1 *float64 `json:"k1,omitzero"`
	B  *float64 `json:"b,omitzero"`
}

type CreateIndexInputConfigSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type CreateIndexInputConfigSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type CreateIndexInputConfigSynonymsItem struct {
	Option1 *CreateIndexInputConfigSynonymsItemOption1
	Option2 *CreateIndexInputConfigSynonymsItemOption2
}

var createIndexInputConfigSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union CreateIndexInputConfigSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateIndexInputConfigSynonymsItem")
}

func (union *CreateIndexInputConfigSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createIndexInputConfigSynonymsItemMembers, "CreateIndexInputConfigSynonymsItem")
}

type CreateIndexInputConfig struct {
	Schema         map[string]CreateIndexInputConfigSchemaValue `json:"schema"`
	Language       *string                                      `json:"language,omitzero"`
	Embedding      *CreateIndexInputConfigEmbedding             `json:"embedding,omitzero"`
	Required       []string                                     `json:"required,omitzero"`
	Strict         *bool                                        `json:"strict,omitzero"`
	TrackPositions *bool                                        `json:"trackPositions,omitzero"`
	DefaultScoring *string                                      `json:"defaultScoring,omitzero"`
	Bm25           *CreateIndexInputConfigBm25                  `json:"bm25,omitzero"`
	Synonyms       []CreateIndexInputConfigSynonymsItem         `json:"synonyms,omitzero"`
	StopWords      []string                                     `json:"stopWords,omitzero"`
}

type CreateIndexInput struct {
	ProjectID string                 `json:"project_id"`
	Name      string                 `json:"name"`
	Config    CreateIndexInputConfig `json:"config"`
}

type CreateIndexOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateIndexOutput struct {
	ID         string                     `json:"id"`
	ProjectID  string                     `json:"project_id"`
	Name       string                     `json:"name"`
	CreatedAt  string                     `json:"created_at"`
	CreatedBy  CreateIndexOutputCreatedBy `json:"created_by"`
	DeletedAt  *string                    `json:"deleted_at"`
	PurgeAfter *string                    `json:"purge_after"`
	Config     map[string]any             `json:"config"`
	NarsilURL  string                     `json:"narsil_url"`
}

type CreateKnowledgeBaseInputChunkTokens struct {
	Integer *int64
	String  *string
}

var createKnowledgeBaseInputChunkTokensMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CreateKnowledgeBaseInputChunkTokens) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateKnowledgeBaseInputChunkTokens")
}

func (union *CreateKnowledgeBaseInputChunkTokens) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createKnowledgeBaseInputChunkTokensMembers, "CreateKnowledgeBaseInputChunkTokens")
}

type CreateKnowledgeBaseInputQuestionLogRetentionDays struct {
	Integer *int64
	String  *string
}

var createKnowledgeBaseInputQuestionLogRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CreateKnowledgeBaseInputQuestionLogRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateKnowledgeBaseInputQuestionLogRetentionDays")
}

func (union *CreateKnowledgeBaseInputQuestionLogRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createKnowledgeBaseInputQuestionLogRetentionDaysMembers, "CreateKnowledgeBaseInputQuestionLogRetentionDays")
}

type CreateKnowledgeBaseInput struct {
	ProjectID                string                                                     `json:"project_id"`
	Name                     string                                                     `json:"name"`
	Language                 *string                                                    `json:"language,omitzero"`
	ChunkTokens              *CreateKnowledgeBaseInputChunkTokens                       `json:"chunk_tokens,omitzero"`
	QuestionLogRetentionDays Nullable[CreateKnowledgeBaseInputQuestionLogRetentionDays] `json:"question_log_retention_days,omitzero"`
}

type CreateKnowledgeBaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateKnowledgeBaseOutput struct {
	ID                       string                             `json:"id"`
	ProjectID                string                             `json:"project_id"`
	Name                     string                             `json:"name"`
	Language                 string                             `json:"language"`
	ChunkTokens              float64                            `json:"chunk_tokens"`
	QuestionLogRetentionDays *float64                           `json:"question_log_retention_days"`
	CreatedAt                string                             `json:"created_at"`
	CreatedBy                CreateKnowledgeBaseOutputCreatedBy `json:"created_by"`
	DeletedAt                *string                            `json:"deleted_at"`
	PurgeAfter               *string                            `json:"purge_after"`
	DatabaseID               string                             `json:"database_id"`
	LiveIndexID              string                             `json:"live_index_id"`
	SirannonURL              string                             `json:"sirannon_url"`
	SearchPendingSince       *string                            `json:"search_pending_since"`
}

type CreateMemorySourceInput struct {
	ProjectID   string         `json:"project_id"`
	MemoryID    string         `json:"memory_id"`
	Name        string         `json:"name"`
	Kind        string         `json:"kind"`
	Sorting     *string        `json:"sorting,omitzero"`
	Settings    map[string]any `json:"settings,omitzero"`
	Credentials map[string]any `json:"credentials,omitzero"`
}

type CreateMemorySourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type CreateMemorySourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateMemorySourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type CreateMemorySourceOutput struct {
	ID              string                             `json:"id"`
	ProjectID       string                             `json:"project_id"`
	KnowledgeBaseID *string                            `json:"knowledge_base_id"`
	MemoryID        *string                            `json:"memory_id"`
	Name            string                             `json:"name"`
	Kind            string                             `json:"kind"`
	Sorting         *string                            `json:"sorting"`
	Status          string                             `json:"status"`
	Settings        map[string]any                     `json:"settings"`
	CredentialNames []string                           `json:"credential_names"`
	WebhookURL      *string                            `json:"webhook_url"`
	SignIn          *CreateMemorySourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                             `json:"created_at"`
	CreatedBy       CreateMemorySourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                            `json:"last_synced_at"`
	NextSyncAt      *string                            `json:"next_sync_at"`
	LastError       *CreateMemorySourceOutputLastError `json:"last_error"`
	WebhookSecret   *string                            `json:"webhook_secret"`
}

type CreateProjectInput struct {
	Name string `json:"name"`
}

type CreateProjectOutput struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Region      string  `json:"region"`
	Role        *string `json:"role"`
	CreatedAt   string  `json:"created_at"`
	DeletedAt   *string `json:"deleted_at"`
	PurgeAfter  *string `json:"purge_after"`
	SirannonURL string  `json:"sirannon_url"`
	NarsilURL   string  `json:"narsil_url"`
}

type CreateSourceInput struct {
	ProjectID       string         `json:"project_id"`
	KnowledgeBaseID string         `json:"knowledge_base_id"`
	Name            string         `json:"name"`
	Kind            string         `json:"kind"`
	Settings        map[string]any `json:"settings,omitzero"`
	Credentials     map[string]any `json:"credentials,omitzero"`
}

type CreateSourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type CreateSourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateSourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type CreateSourceOutput struct {
	ID              string                       `json:"id"`
	ProjectID       string                       `json:"project_id"`
	KnowledgeBaseID *string                      `json:"knowledge_base_id"`
	MemoryID        *string                      `json:"memory_id"`
	Name            string                       `json:"name"`
	Kind            string                       `json:"kind"`
	Sorting         *string                      `json:"sorting"`
	Status          string                       `json:"status"`
	Settings        map[string]any               `json:"settings"`
	CredentialNames []string                     `json:"credential_names"`
	WebhookURL      *string                      `json:"webhook_url"`
	SignIn          *CreateSourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                       `json:"created_at"`
	CreatedBy       CreateSourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                      `json:"last_synced_at"`
	NextSyncAt      *string                      `json:"next_sync_at"`
	LastError       *CreateSourceOutputLastError `json:"last_error"`
	WebhookSecret   *string                      `json:"webhook_secret"`
}

type CreateTableInputColumnsItemDefaultValueValue struct {
	Number *float64
	String *string
}

var createTableInputColumnsItemDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union CreateTableInputColumnsItemDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateTableInputColumnsItemDefaultValueValue")
}

func (union *CreateTableInputColumnsItemDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createTableInputColumnsItemDefaultValueValueMembers, "CreateTableInputColumnsItemDefaultValueValue")
}

type CreateTableInputColumnsItemDefaultValue struct {
	Kind  string                                       `json:"kind"`
	Value CreateTableInputColumnsItemDefaultValueValue `json:"value"`
}

type CreateTableInputColumnsItemDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type CreateTableInputColumnsItemDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type CreateTableInputColumnsItemDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type CreateTableInputColumnsItemDefault struct {
	Value            *CreateTableInputColumnsItemDefaultValue
	CurrentTimestamp *CreateTableInputColumnsItemDefaultCurrentTimestamp
	CurrentDate      *CreateTableInputColumnsItemDefaultCurrentDate
	CurrentTime      *CreateTableInputColumnsItemDefaultCurrentTime
}

var createTableInputColumnsItemDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union CreateTableInputColumnsItemDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateTableInputColumnsItemDefault")
}

func (union *CreateTableInputColumnsItemDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createTableInputColumnsItemDefaultMembers, "CreateTableInputColumnsItemDefault")
}

type CreateTableInputColumnsItemReferences struct {
	Table    string  `json:"table"`
	Column   string  `json:"column"`
	OnDelete *string `json:"on_delete,omitzero"`
	OnUpdate *string `json:"on_update,omitzero"`
}

type CreateTableInputColumnsItem struct {
	Name       string                                          `json:"name"`
	Type       string                                          `json:"type"`
	NotNull    *bool                                           `json:"not_null,omitzero"`
	Default    Nullable[CreateTableInputColumnsItemDefault]    `json:"default,omitzero"`
	PrimaryKey *bool                                           `json:"primary_key,omitzero"`
	Unique     *bool                                           `json:"unique,omitzero"`
	References Nullable[CreateTableInputColumnsItemReferences] `json:"references,omitzero"`
}

type CreateTableInputExpectedMigrationVersion struct {
	Integer *int64
	String  *string
}

var createTableInputExpectedMigrationVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union CreateTableInputExpectedMigrationVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateTableInputExpectedMigrationVersion")
}

func (union *CreateTableInputExpectedMigrationVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createTableInputExpectedMigrationVersionMembers, "CreateTableInputExpectedMigrationVersion")
}

type CreateTableInput struct {
	ProjectID                string                                   `json:"project_id"`
	DatabaseID               string                                   `json:"database_id"`
	TableName                string                                   `json:"table_name"`
	Columns                  []CreateTableInputColumnsItem            `json:"columns"`
	ExpectedMigrationVersion CreateTableInputExpectedMigrationVersion `json:"expected_migration_version"`
}

type CreateTableOutputMigration struct {
	Version float64 `json:"version"`
	Name    string  `json:"name"`
	SQL     string  `json:"sql"`
	AddedAt string  `json:"added_at"`
}

type CreateTableOutputPreview struct {
	TableName            string  `json:"table_name"`
	MigrationName        string  `json:"migration_name"`
	SQL                  string  `json:"sql"`
	BaseMigrationVersion float64 `json:"base_migration_version"`
}

type CreateTableOutput struct {
	Migration CreateTableOutputMigration `json:"migration"`
	Preview   CreateTableOutputPreview   `json:"preview"`
}

type CreateUploadInputMetadata struct {
	Map    *map[string]string
	String *string
}

var createUploadInputMetadataMembers = []unionMember{
	{kind: unionMap},
	{kind: unionString},
}

func (union CreateUploadInputMetadata) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "CreateUploadInputMetadata")
}

func (union *CreateUploadInputMetadata) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, createUploadInputMetadataMembers, "CreateUploadInputMetadata")
}

type CreateUploadInput struct {
	ProjectID       string                     `json:"project_id"`
	KnowledgeBaseID string                     `json:"knowledge_base_id"`
	Path            string                     `json:"path"`
	Address         *string                    `json:"address,omitzero"`
	SizeBytes       int64                      `json:"size_bytes"`
	ContentSHA256   string                     `json:"content_sha256"`
	Metadata        *CreateUploadInputMetadata `json:"metadata,omitzero"`
}

type CreateUploadOutputUploadFileFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CreateUploadOutputUploadFileUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CreateUploadOutputUploadFileUnreadPartsItem struct {
	FirstPage   *float64                                           `json:"first_page"`
	LastPage    *float64                                           `json:"last_page"`
	StartSecond *float64                                           `json:"start_second"`
	EndSecond   *float64                                           `json:"end_second"`
	Failure     CreateUploadOutputUploadFileUnreadPartsItemFailure `json:"failure"`
}

type CreateUploadOutputUploadFile struct {
	ID              string                                        `json:"id"`
	KnowledgeBaseID string                                        `json:"knowledge_base_id"`
	Path            string                                        `json:"path"`
	Kind            string                                        `json:"kind"`
	Address         *string                                       `json:"address"`
	Status          string                                        `json:"status"`
	CurrentVersion  *float64                                      `json:"current_version"`
	LatestVersion   float64                                       `json:"latest_version"`
	SizeBytes       float64                                       `json:"size_bytes"`
	ContentSHA256   string                                        `json:"content_sha256"`
	Failure         *CreateUploadOutputUploadFileFailure          `json:"failure"`
	UnreadParts     []CreateUploadOutputUploadFileUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                             `json:"metadata"`
	CreatedAt       string                                        `json:"created_at"`
	UpdatedAt       string                                        `json:"updated_at"`
	DeletedAt       *string                                       `json:"deleted_at"`
	PurgeAfter      *string                                       `json:"purge_after"`
}

type CreateUploadOutputUploadFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type CreateUploadOutputUpload struct {
	ID              string                           `json:"id"`
	KnowledgeBaseID string                           `json:"knowledge_base_id"`
	Path            string                           `json:"path"`
	Address         *string                          `json:"address"`
	SizeBytes       float64                          `json:"size_bytes"`
	ContentSHA256   string                           `json:"content_sha256"`
	Method          string                           `json:"method"`
	PartBytes       float64                          `json:"part_bytes"`
	PartCount       float64                          `json:"part_count"`
	State           string                           `json:"state"`
	Outcome         *string                          `json:"outcome"`
	File            *CreateUploadOutputUploadFile    `json:"file"`
	Failure         *CreateUploadOutputUploadFailure `json:"failure"`
	CreatedAt       string                           `json:"created_at"`
	DeadlineAt      string                           `json:"deadline_at"`
}

type CreateUploadOutputPartsItem struct {
	PartNumber float64           `json:"part_number"`
	SizeBytes  float64           `json:"size_bytes"`
	Method     string            `json:"method"`
	URL        string            `json:"url"`
	Headers    map[string]string `json:"headers"`
	ExpiresAt  string            `json:"expires_at"`
}

type CreateUploadOutput struct {
	Upload CreateUploadOutputUpload      `json:"upload"`
	Parts  []CreateUploadOutputPartsItem `json:"parts"`
}

type DeleteDatabaseInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type DeleteDatabaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DeleteDatabaseOutputSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type DeleteDatabaseOutputCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type DeleteDatabaseOutput struct {
	ID               string                          `json:"id"`
	ProjectID        string                          `json:"project_id"`
	Name             string                          `json:"name"`
	CreatedAt        string                          `json:"created_at"`
	CreatedBy        DeleteDatabaseOutputCreatedBy   `json:"created_by"`
	DeletedAt        *string                         `json:"deleted_at"`
	PurgeAfter       *string                         `json:"purge_after"`
	MigrationVersion float64                         `json:"migration_version"`
	SirannonURL      string                          `json:"sirannon_url"`
	Size             *DeleteDatabaseOutputSize       `json:"size"`
	Compaction       *DeleteDatabaseOutputCompaction `json:"compaction"`
	SQLWritePreview  bool                            `json:"sql_write_preview"`
}

type DeleteFileInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	FileID          string `json:"file_id"`
}

type DeleteFileOutputFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type DeleteFileOutputUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type DeleteFileOutputUnreadPartsItem struct {
	FirstPage   *float64                               `json:"first_page"`
	LastPage    *float64                               `json:"last_page"`
	StartSecond *float64                               `json:"start_second"`
	EndSecond   *float64                               `json:"end_second"`
	Failure     DeleteFileOutputUnreadPartsItemFailure `json:"failure"`
}

type DeleteFileOutput struct {
	ID              string                            `json:"id"`
	KnowledgeBaseID string                            `json:"knowledge_base_id"`
	Path            string                            `json:"path"`
	Kind            string                            `json:"kind"`
	Address         *string                           `json:"address"`
	Status          string                            `json:"status"`
	CurrentVersion  *float64                          `json:"current_version"`
	LatestVersion   float64                           `json:"latest_version"`
	SizeBytes       float64                           `json:"size_bytes"`
	ContentSHA256   string                            `json:"content_sha256"`
	Failure         *DeleteFileOutputFailure          `json:"failure"`
	UnreadParts     []DeleteFileOutputUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                 `json:"metadata"`
	CreatedAt       string                            `json:"created_at"`
	UpdatedAt       string                            `json:"updated_at"`
	DeletedAt       *string                           `json:"deleted_at"`
	PurgeAfter      *string                           `json:"purge_after"`
}

type DeleteIndexInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
}

type DeleteIndexOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DeleteIndexOutput struct {
	ID         string                     `json:"id"`
	ProjectID  string                     `json:"project_id"`
	Name       string                     `json:"name"`
	CreatedAt  string                     `json:"created_at"`
	CreatedBy  DeleteIndexOutputCreatedBy `json:"created_by"`
	DeletedAt  *string                    `json:"deleted_at"`
	PurgeAfter *string                    `json:"purge_after"`
	Config     map[string]any             `json:"config"`
	NarsilURL  string                     `json:"narsil_url"`
}

type DeleteIndexRecordInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
	RecordID  string `json:"record_id"`
}

type DeleteIndexRecordOutput struct {
	ID string `json:"id"`
}

type DeleteKnowledgeBaseInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type DeleteKnowledgeBaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DeleteKnowledgeBaseOutput struct {
	ID                       string                             `json:"id"`
	ProjectID                string                             `json:"project_id"`
	Name                     string                             `json:"name"`
	Language                 string                             `json:"language"`
	ChunkTokens              float64                            `json:"chunk_tokens"`
	QuestionLogRetentionDays *float64                           `json:"question_log_retention_days"`
	CreatedAt                string                             `json:"created_at"`
	CreatedBy                DeleteKnowledgeBaseOutputCreatedBy `json:"created_by"`
	DeletedAt                *string                            `json:"deleted_at"`
	PurgeAfter               *string                            `json:"purge_after"`
	DatabaseID               string                             `json:"database_id"`
	LiveIndexID              string                             `json:"live_index_id"`
	SirannonURL              string                             `json:"sirannon_url"`
	SearchPendingSince       *string                            `json:"search_pending_since"`
}

type DeleteMemoryInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
}

type DeleteMemoryOutputSettingsSubjectsItem struct {
	Subject   string  `json:"subject"`
	OwnerID   *string `json:"owner_id"`
	Sensitive bool    `json:"sensitive"`
}

type DeleteMemoryOutputSettingsAgentPermissions struct {
	Confirmed string `json:"confirmed"`
	Likely    string `json:"likely"`
	Disputed  string `json:"disputed"`
}

type DeleteMemoryOutputSettingsCueWeightsStatementKind struct {
	Statement   float64 `json:"statement"`
	Event       float64 `json:"event"`
	Promise     float64 `json:"promise"`
	Procedure   float64 `json:"procedure"`
	Instruction float64 `json:"instruction"`
}

type DeleteMemoryOutputSettingsCueWeightsAuthorKind struct {
	Staff    float64 `json:"staff"`
	Agent    float64 `json:"agent"`
	EndUser  float64 `json:"end_user"`
	Outsider float64 `json:"outsider"`
	Records  float64 `json:"records"`
	Code     float64 `json:"code"`
}

type DeleteMemoryOutputSettingsCueWeights struct {
	StatementKind           DeleteMemoryOutputSettingsCueWeightsStatementKind `json:"statement_kind"`
	AuthorKind              DeleteMemoryOutputSettingsCueWeightsAuthorKind    `json:"author_kind"`
	SubjectOwner            float64                                           `json:"subject_owner"`
	PrivateChannel          float64                                           `json:"private_channel"`
	ReactionsForSecondVoice float64                                           `json:"reactions_for_second_voice"`
}

type DeleteMemoryOutputSettings struct {
	DuplicateThreshold          float64                                    `json:"duplicate_threshold"`
	ConfidenceThreshold         float64                                    `json:"confidence_threshold"`
	AgreeingAuthorsForConfirmed float64                                    `json:"agreeing_authors_for_confirmed"`
	FirstPackTokens             float64                                    `json:"first_pack_tokens"`
	RecallFadeDays              float64                                    `json:"recall_fade_days"`
	KnowledgeBaseChoice         string                                     `json:"knowledge_base_choice"`
	CheckedKnowledgeBaseIDs     []string                                   `json:"checked_knowledge_base_ids"`
	Subjects                    []DeleteMemoryOutputSettingsSubjectsItem   `json:"subjects"`
	SourcesForLikely            float64                                    `json:"sources_for_likely"`
	AgentPermissions            DeleteMemoryOutputSettingsAgentPermissions `json:"agent_permissions"`
	DroppedListDays             *float64                                   `json:"dropped_list_days"`
	ReplacedRetentionDays       *float64                                   `json:"replaced_retention_days"`
	MessageRetentionDays        *float64                                   `json:"message_retention_days"`
	PersonalRetentionDays       *float64                                   `json:"personal_retention_days"`
	RecallLogRetentionDays      *float64                                   `json:"recall_log_retention_days"`
	ReadySetSize                float64                                    `json:"ready_set_size"`
	RecallDepth                 float64                                    `json:"recall_depth"`
	CueWeights                  DeleteMemoryOutputSettingsCueWeights       `json:"cue_weights"`
	RecallCheckedMemories       float64                                    `json:"recall_checked_memories"`
}

type DeleteMemoryOutputCheckedKnowledgeBasesLeftOutItem struct {
	KnowledgeBaseID string `json:"knowledge_base_id"`
	Reason          string `json:"reason"`
}

type DeleteMemoryOutputCheckedKnowledgeBases struct {
	KnowledgeBaseIDs []string                                             `json:"knowledge_base_ids"`
	LeftOut          []DeleteMemoryOutputCheckedKnowledgeBasesLeftOutItem `json:"left_out"`
	LeftOutCount     float64                                              `json:"left_out_count"`
	Limit            float64                                              `json:"limit"`
}

type DeleteMemoryOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DeleteMemoryOutput struct {
	ID                    string                                  `json:"id"`
	ProjectID             string                                  `json:"project_id"`
	Language              string                                  `json:"language"`
	Settings              DeleteMemoryOutputSettings              `json:"settings"`
	CheckedKnowledgeBases DeleteMemoryOutputCheckedKnowledgeBases `json:"checked_knowledge_bases"`
	CreatedAt             string                                  `json:"created_at"`
	CreatedBy             DeleteMemoryOutputCreatedBy             `json:"created_by"`
	DeletedAt             *string                                 `json:"deleted_at"`
	PurgeAfter            *string                                 `json:"purge_after"`
	SortingPendingSince   *string                                 `json:"sorting_pending_since"`
}

type DeleteMemorySavedQuestionInput struct {
	ProjectID       string `json:"project_id"`
	MemoryID        string `json:"memory_id"`
	SavedQuestionID string `json:"saved_question_id"`
}

type DeleteMemorySavedQuestionOutput struct {
	ID             string   `json:"id"`
	Question       string   `json:"question"`
	StoredMemoryID string   `json:"stored_memory_id"`
	MemoryText     *string  `json:"memory_text"`
	EndUserID      *string  `json:"end_user_id"`
	TeamID         *string  `json:"team_id"`
	Rank           *float64 `json:"rank"`
	Flag           *string  `json:"flag"`
	ReplacedBy     *string  `json:"replaced_by"`
	CreatedAt      string   `json:"created_at"`
}

type DeleteMemorySourceInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
	SourceID  string `json:"source_id"`
}

type DeleteMemorySourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type DeleteMemorySourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DeleteMemorySourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type DeleteMemorySourceOutput struct {
	ID              string                             `json:"id"`
	ProjectID       string                             `json:"project_id"`
	KnowledgeBaseID *string                            `json:"knowledge_base_id"`
	MemoryID        *string                            `json:"memory_id"`
	Name            string                             `json:"name"`
	Kind            string                             `json:"kind"`
	Sorting         *string                            `json:"sorting"`
	Status          string                             `json:"status"`
	Settings        map[string]any                     `json:"settings"`
	CredentialNames []string                           `json:"credential_names"`
	WebhookURL      *string                            `json:"webhook_url"`
	SignIn          *DeleteMemorySourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                             `json:"created_at"`
	CreatedBy       DeleteMemorySourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                            `json:"last_synced_at"`
	NextSyncAt      *string                            `json:"next_sync_at"`
	LastError       *DeleteMemorySourceOutputLastError `json:"last_error"`
}

type DeleteProjectInput struct {
	ProjectID string `json:"project_id"`
}

type DeleteProjectOutput struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Region      string  `json:"region"`
	Role        *string `json:"role"`
	CreatedAt   string  `json:"created_at"`
	DeletedAt   *string `json:"deleted_at"`
	PurgeAfter  *string `json:"purge_after"`
	SirannonURL string  `json:"sirannon_url"`
	NarsilURL   string  `json:"narsil_url"`
}

type DeleteSavedQueryInput struct {
	ProjectID    string `json:"project_id"`
	DatabaseID   string `json:"database_id"`
	SavedQueryID string `json:"saved_query_id"`
}

type DeleteSavedQueryOutput struct {
	Deleted bool `json:"deleted"`
}

type DeleteSavedQuestionInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	SavedQuestionID string `json:"saved_question_id"`
}

type DeleteSavedQuestionOutputPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type DeleteSavedQuestionOutputPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type DeleteSavedQuestionOutputPassageCitationDocument struct {
	Kind      string                                                          `json:"kind"`
	Pages     []float64                                                       `json:"pages"`
	Areas     []DeleteSavedQuestionOutputPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []DeleteSavedQuestionOutputPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type DeleteSavedQuestionOutputPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type DeleteSavedQuestionOutputPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type DeleteSavedQuestionOutputPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type DeleteSavedQuestionOutputPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type DeleteSavedQuestionOutputPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type DeleteSavedQuestionOutputPassageCitationImage struct {
	Kind      string                                                       `json:"kind"`
	FileName  string                                                       `json:"file_name"`
	Areas     []DeleteSavedQuestionOutputPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []DeleteSavedQuestionOutputPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type DeleteSavedQuestionOutputPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type DeleteSavedQuestionOutputPassageCitation struct {
	Document    *DeleteSavedQuestionOutputPassageCitationDocument
	Spreadsheet *DeleteSavedQuestionOutputPassageCitationSpreadsheet
	Slides      *DeleteSavedQuestionOutputPassageCitationSlides
	WebPage     *DeleteSavedQuestionOutputPassageCitationWebPage
	Image       *DeleteSavedQuestionOutputPassageCitationImage
	Recording   *DeleteSavedQuestionOutputPassageCitationRecording
}

var deleteSavedQuestionOutputPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union DeleteSavedQuestionOutputPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "DeleteSavedQuestionOutputPassageCitation")
}

func (union *DeleteSavedQuestionOutputPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, deleteSavedQuestionOutputPassageCitationMembers, "DeleteSavedQuestionOutputPassageCitation")
}

type DeleteSavedQuestionOutputPassage struct {
	FileID        string                                    `json:"file_id"`
	FilePath      *string                                   `json:"file_path"`
	FileKind      *string                                   `json:"file_kind"`
	Version       float64                                   `json:"version"`
	FirstPosition float64                                   `json:"first_position"`
	LastPosition  float64                                   `json:"last_position"`
	Heading       *string                                   `json:"heading"`
	State         string                                    `json:"state"`
	Citation      *DeleteSavedQuestionOutputPassageCitation `json:"citation"`
}

type DeleteSavedQuestionOutputBrokenPrevious struct {
	Version       float64 `json:"version"`
	FirstPosition float64 `json:"first_position"`
	LastPosition  float64 `json:"last_position"`
}

type DeleteSavedQuestionOutputBroken struct {
	Change     string                                   `json:"change"`
	Version    *float64                                 `json:"version"`
	DetectedAt string                                   `json:"detected_at"`
	Previous   *DeleteSavedQuestionOutputBrokenPrevious `json:"previous"`
}

type DeleteSavedQuestionOutput struct {
	ID            string                           `json:"id"`
	Question      string                           `json:"question"`
	Split         string                           `json:"split"`
	Source        string                           `json:"source"`
	QuestionLogID *string                          `json:"question_log_id"`
	EndUserID     *string                          `json:"end_user_id"`
	Passage       DeleteSavedQuestionOutputPassage `json:"passage"`
	Broken        *DeleteSavedQuestionOutputBroken `json:"broken"`
	CreatedAt     string                           `json:"created_at"`
	UpdatedAt     string                           `json:"updated_at"`
}

type DeleteSourceInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	SourceID        string `json:"source_id"`
}

type DeleteSourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type DeleteSourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DeleteSourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type DeleteSourceOutput struct {
	ID              string                       `json:"id"`
	ProjectID       string                       `json:"project_id"`
	KnowledgeBaseID *string                      `json:"knowledge_base_id"`
	MemoryID        *string                      `json:"memory_id"`
	Name            string                       `json:"name"`
	Kind            string                       `json:"kind"`
	Sorting         *string                      `json:"sorting"`
	Status          string                       `json:"status"`
	Settings        map[string]any               `json:"settings"`
	CredentialNames []string                     `json:"credential_names"`
	WebhookURL      *string                      `json:"webhook_url"`
	SignIn          *DeleteSourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                       `json:"created_at"`
	CreatedBy       DeleteSourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                      `json:"last_synced_at"`
	NextSyncAt      *string                      `json:"next_sync_at"`
	LastError       *DeleteSourceOutputLastError `json:"last_error"`
}

type DeleteTableRowsInputKeysItemItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type DeleteTableRowsInputKeysItemItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type DeleteTableRowsInputKeysItemItem struct {
	Number  *float64
	String  *string
	Integer *DeleteTableRowsInputKeysItemItemInteger
	Blob    *DeleteTableRowsInputKeysItemItemBlob
}

var deleteTableRowsInputKeysItemItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union DeleteTableRowsInputKeysItemItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "DeleteTableRowsInputKeysItemItem")
}

func (union *DeleteTableRowsInputKeysItemItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, deleteTableRowsInputKeysItemItemMembers, "DeleteTableRowsInputKeysItemItem")
}

type DeleteTableRowsInput struct {
	ProjectID  string                                         `json:"project_id"`
	DatabaseID string                                         `json:"database_id"`
	TableName  string                                         `json:"table_name"`
	Keys       [][]Nullable[DeleteTableRowsInputKeysItemItem] `json:"keys"`
}

type DeleteTableRowsOutput struct {
	Deleted float64 `json:"deleted"`
}

type DiscardCorrectionInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	CorrectionID    string  `json:"correction_id"`
	Note            *string `json:"note,omitzero"`
}

type DiscardCorrectionOutputSettingFieldBoost struct {
	Kind    string  `json:"kind"`
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type DiscardCorrectionOutputSettingOption1 struct {
	Kind         string `json:"kind"`
	Strategy     string `json:"strategy"`
	RankConstant int64  `json:"rank_constant"`
}

type DiscardCorrectionOutputSettingOption2 struct {
	Kind         string  `json:"kind"`
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type DiscardCorrectionOutputSettingBm25 struct {
	Kind string  `json:"kind"`
	K1   float64 `json:"k1"`
	B    float64 `json:"b"`
}

type DiscardCorrectionOutputSettingStopWords struct {
	Kind    string   `json:"kind"`
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type DiscardCorrectionOutputSettingSynonymsRulesItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type DiscardCorrectionOutputSettingSynonymsRulesItemOption2 struct {
	Words []string `json:"words"`
}

type DiscardCorrectionOutputSettingSynonymsRulesItem struct {
	Option1 *DiscardCorrectionOutputSettingSynonymsRulesItemOption1
	Option2 *DiscardCorrectionOutputSettingSynonymsRulesItemOption2
}

var discardCorrectionOutputSettingSynonymsRulesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union DiscardCorrectionOutputSettingSynonymsRulesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "DiscardCorrectionOutputSettingSynonymsRulesItem")
}

func (union *DiscardCorrectionOutputSettingSynonymsRulesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, discardCorrectionOutputSettingSynonymsRulesItemMembers, "DiscardCorrectionOutputSettingSynonymsRulesItem")
}

type DiscardCorrectionOutputSettingSynonyms struct {
	Kind  string                                            `json:"kind"`
	Rules []DiscardCorrectionOutputSettingSynonymsRulesItem `json:"rules"`
}

type DiscardCorrectionOutputSettingLanguage struct {
	Kind     string `json:"kind"`
	Language string `json:"language"`
}

type DiscardCorrectionOutputSettingChunking struct {
	Kind        string `json:"kind"`
	ChunkTokens int64  `json:"chunk_tokens"`
}

type DiscardCorrectionOutputSettingRebuild struct {
	Kind string `json:"kind"`
}

type DiscardCorrectionOutputSettingAgentDepth struct {
	Kind  string  `json:"kind"`
	Depth float64 `json:"depth"`
}

type DiscardCorrectionOutputSetting struct {
	FieldBoost *DiscardCorrectionOutputSettingFieldBoost
	Option1    *DiscardCorrectionOutputSettingOption1
	Option2    *DiscardCorrectionOutputSettingOption2
	Bm25       *DiscardCorrectionOutputSettingBm25
	StopWords  *DiscardCorrectionOutputSettingStopWords
	Synonyms   *DiscardCorrectionOutputSettingSynonyms
	Language   *DiscardCorrectionOutputSettingLanguage
	Chunking   *DiscardCorrectionOutputSettingChunking
	Rebuild    *DiscardCorrectionOutputSettingRebuild
	AgentDepth *DiscardCorrectionOutputSettingAgentDepth
}

var discardCorrectionOutputSettingMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "text", "heading"}, properties: []string{"kind", "text", "heading"}, constants: map[string]any{"kind": "field_boost"}},
	{kind: unionObject, required: []string{"kind", "strategy", "rank_constant"}, properties: []string{"kind", "strategy", "rank_constant"}, constants: map[string]any{"kind": "fusion", "strategy": "rrf"}},
	{kind: unionObject, required: []string{"kind", "strategy", "vector_weight"}, properties: []string{"kind", "strategy", "vector_weight"}, constants: map[string]any{"kind": "fusion", "strategy": "linear"}},
	{kind: unionObject, required: []string{"kind", "k1", "b"}, properties: []string{"kind", "k1", "b"}, constants: map[string]any{"kind": "bm25"}},
	{kind: unionObject, required: []string{"kind", "added", "removed"}, properties: []string{"kind", "added", "removed"}, constants: map[string]any{"kind": "stop_words"}},
	{kind: unionObject, required: []string{"kind", "rules"}, properties: []string{"kind", "rules"}, constants: map[string]any{"kind": "synonyms"}},
	{kind: unionObject, required: []string{"kind", "language"}, properties: []string{"kind", "language"}, constants: map[string]any{"kind": "language"}},
	{kind: unionObject, required: []string{"kind", "chunk_tokens"}, properties: []string{"kind", "chunk_tokens"}, constants: map[string]any{"kind": "chunking"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "rebuild"}},
	{kind: unionObject, required: []string{"kind", "depth"}, properties: []string{"kind", "depth"}, constants: map[string]any{"kind": "agent_depth"}},
}

func (union DiscardCorrectionOutputSetting) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "DiscardCorrectionOutputSetting")
}

func (union *DiscardCorrectionOutputSetting) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, discardCorrectionOutputSettingMembers, "DiscardCorrectionOutputSetting")
}

type DiscardCorrectionOutputEstimate struct {
	Seconds          float64  `json:"seconds"`
	MemoryBytes      float64  `json:"memory_bytes"`
	SecondIndex      bool     `json:"second_index"`
	ChunksToIndex    float64  `json:"chunks_to_index"`
	QuestionsToScore float64  `json:"questions_to_score"`
	PriceUsd         *float64 `json:"price_usd"`
}

type DiscardCorrectionOutputBeforeTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type DiscardCorrectionOutputBeforeHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type DiscardCorrectionOutputBefore struct {
	ScorecardID *string                               `json:"scorecard_id"`
	Tuning      DiscardCorrectionOutputBeforeTuning   `json:"tuning"`
	HeldBack    DiscardCorrectionOutputBeforeHeldBack `json:"held_back"`
}

type DiscardCorrectionOutputAfterTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type DiscardCorrectionOutputAfterHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type DiscardCorrectionOutputAfter struct {
	ScorecardID *string                              `json:"scorecard_id"`
	Tuning      DiscardCorrectionOutputAfterTuning   `json:"tuning"`
	HeldBack    DiscardCorrectionOutputAfterHeldBack `json:"held_back"`
}

type DiscardCorrectionOutputQuestionChanges struct {
	NowPass   float64 `json:"now_pass"`
	NowFail   float64 `json:"now_fail"`
	MovedUp   float64 `json:"moved_up"`
	MovedDown float64 `json:"moved_down"`
}

type DiscardCorrectionOutput struct {
	ID              string                                  `json:"id"`
	Origin          string                                  `json:"origin"`
	Cause           *string                                 `json:"cause"`
	Kind            string                                  `json:"kind"`
	Setting         DiscardCorrectionOutputSetting          `json:"setting"`
	TargetIDs       []string                                `json:"target_ids"`
	FileKinds       []string                                `json:"file_kinds"`
	Status          string                                  `json:"status"`
	PassID          *string                                 `json:"pass_id"`
	Estimate        DiscardCorrectionOutputEstimate         `json:"estimate"`
	Before          *DiscardCorrectionOutputBefore          `json:"before"`
	After           *DiscardCorrectionOutputAfter           `json:"after"`
	Verdict         string                                  `json:"verdict"`
	QuestionChanges *DiscardCorrectionOutputQuestionChanges `json:"question_changes"`
	WaitsForClick   bool                                    `json:"waits_for_click"`
	WaitReason      *string                                 `json:"wait_reason"`
	DecidedBy       *string                                 `json:"decided_by"`
	DecisionNote    *string                                 `json:"decision_note"`
	FailureMessage  *string                                 `json:"failure_message"`
	CreatedAt       string                                  `json:"created_at"`
	TriedAt         *string                                 `json:"tried_at"`
	DecidedAt       *string                                 `json:"decided_at"`
}

type DiscardTableImportInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
	ImportID   string `json:"import_id"`
}

type DiscardTableImportOutput struct {
	Discarded bool `json:"discarded"`
}

type DismissFlaggedQuestionInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	QuestionID      string `json:"question_id"`
}

type DismissFlaggedQuestionOutput struct {
	QuestionID      string   `json:"question_id"`
	Question        string   `json:"question"`
	EndUserID       *string  `json:"end_user_id"`
	Status          string   `json:"status"`
	Signals         []string `json:"signals"`
	FlaggedAt       string   `json:"flagged_at"`
	JudgedAt        *string  `json:"judged_at"`
	Probability     *float64 `json:"probability"`
	ChosenRank      *float64 `json:"chosen_rank"`
	SavedQuestionID *string  `json:"saved_question_id"`
	SettledBy       *string  `json:"settled_by"`
}

type DownloadIndexInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
}

type EnableMemoryInputSubjectsItem struct {
	Subject   string           `json:"subject"`
	OwnerID   Nullable[string] `json:"owner_id,omitzero"`
	Sensitive *bool            `json:"sensitive,omitzero"`
}

type EnableMemoryInputAgentPermissions struct {
	Confirmed *string `json:"confirmed,omitzero"`
	Likely    *string `json:"likely,omitzero"`
	Disputed  *string `json:"disputed,omitzero"`
}

type EnableMemoryInputCueWeightsStatementKindStatement struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsStatementKindStatementMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsStatementKindStatement) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsStatementKindStatement")
}

func (union *EnableMemoryInputCueWeightsStatementKindStatement) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsStatementKindStatementMembers, "EnableMemoryInputCueWeightsStatementKindStatement")
}

type EnableMemoryInputCueWeightsStatementKindEvent struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsStatementKindEventMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsStatementKindEvent) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsStatementKindEvent")
}

func (union *EnableMemoryInputCueWeightsStatementKindEvent) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsStatementKindEventMembers, "EnableMemoryInputCueWeightsStatementKindEvent")
}

type EnableMemoryInputCueWeightsStatementKindPromise struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsStatementKindPromiseMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsStatementKindPromise) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsStatementKindPromise")
}

func (union *EnableMemoryInputCueWeightsStatementKindPromise) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsStatementKindPromiseMembers, "EnableMemoryInputCueWeightsStatementKindPromise")
}

type EnableMemoryInputCueWeightsStatementKindProcedure struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsStatementKindProcedureMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsStatementKindProcedure) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsStatementKindProcedure")
}

func (union *EnableMemoryInputCueWeightsStatementKindProcedure) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsStatementKindProcedureMembers, "EnableMemoryInputCueWeightsStatementKindProcedure")
}

type EnableMemoryInputCueWeightsStatementKindInstruction struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsStatementKindInstructionMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsStatementKindInstruction) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsStatementKindInstruction")
}

func (union *EnableMemoryInputCueWeightsStatementKindInstruction) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsStatementKindInstructionMembers, "EnableMemoryInputCueWeightsStatementKindInstruction")
}

type EnableMemoryInputCueWeightsStatementKind struct {
	Statement   *EnableMemoryInputCueWeightsStatementKindStatement   `json:"statement,omitzero"`
	Event       *EnableMemoryInputCueWeightsStatementKindEvent       `json:"event,omitzero"`
	Promise     *EnableMemoryInputCueWeightsStatementKindPromise     `json:"promise,omitzero"`
	Procedure   *EnableMemoryInputCueWeightsStatementKindProcedure   `json:"procedure,omitzero"`
	Instruction *EnableMemoryInputCueWeightsStatementKindInstruction `json:"instruction,omitzero"`
}

type EnableMemoryInputCueWeightsAuthorKindStaff struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsAuthorKindStaffMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsAuthorKindStaff) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsAuthorKindStaff")
}

func (union *EnableMemoryInputCueWeightsAuthorKindStaff) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsAuthorKindStaffMembers, "EnableMemoryInputCueWeightsAuthorKindStaff")
}

type EnableMemoryInputCueWeightsAuthorKindAgent struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsAuthorKindAgentMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsAuthorKindAgent) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsAuthorKindAgent")
}

func (union *EnableMemoryInputCueWeightsAuthorKindAgent) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsAuthorKindAgentMembers, "EnableMemoryInputCueWeightsAuthorKindAgent")
}

type EnableMemoryInputCueWeightsAuthorKindEndUser struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsAuthorKindEndUserMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsAuthorKindEndUser) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsAuthorKindEndUser")
}

func (union *EnableMemoryInputCueWeightsAuthorKindEndUser) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsAuthorKindEndUserMembers, "EnableMemoryInputCueWeightsAuthorKindEndUser")
}

type EnableMemoryInputCueWeightsAuthorKindOutsider struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsAuthorKindOutsiderMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsAuthorKindOutsider) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsAuthorKindOutsider")
}

func (union *EnableMemoryInputCueWeightsAuthorKindOutsider) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsAuthorKindOutsiderMembers, "EnableMemoryInputCueWeightsAuthorKindOutsider")
}

type EnableMemoryInputCueWeightsAuthorKindRecords struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsAuthorKindRecordsMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsAuthorKindRecords) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsAuthorKindRecords")
}

func (union *EnableMemoryInputCueWeightsAuthorKindRecords) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsAuthorKindRecordsMembers, "EnableMemoryInputCueWeightsAuthorKindRecords")
}

type EnableMemoryInputCueWeightsAuthorKindCode struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsAuthorKindCodeMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsAuthorKindCode) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsAuthorKindCode")
}

func (union *EnableMemoryInputCueWeightsAuthorKindCode) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsAuthorKindCodeMembers, "EnableMemoryInputCueWeightsAuthorKindCode")
}

type EnableMemoryInputCueWeightsAuthorKind struct {
	Staff    *EnableMemoryInputCueWeightsAuthorKindStaff    `json:"staff,omitzero"`
	Agent    *EnableMemoryInputCueWeightsAuthorKindAgent    `json:"agent,omitzero"`
	EndUser  *EnableMemoryInputCueWeightsAuthorKindEndUser  `json:"end_user,omitzero"`
	Outsider *EnableMemoryInputCueWeightsAuthorKindOutsider `json:"outsider,omitzero"`
	Records  *EnableMemoryInputCueWeightsAuthorKindRecords  `json:"records,omitzero"`
	Code     *EnableMemoryInputCueWeightsAuthorKindCode     `json:"code,omitzero"`
}

type EnableMemoryInputCueWeightsSubjectOwner struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsSubjectOwnerMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsSubjectOwner) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsSubjectOwner")
}

func (union *EnableMemoryInputCueWeightsSubjectOwner) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsSubjectOwnerMembers, "EnableMemoryInputCueWeightsSubjectOwner")
}

type EnableMemoryInputCueWeightsPrivateChannel struct {
	Number *float64
	String *string
}

var enableMemoryInputCueWeightsPrivateChannelMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsPrivateChannel) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsPrivateChannel")
}

func (union *EnableMemoryInputCueWeightsPrivateChannel) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsPrivateChannelMembers, "EnableMemoryInputCueWeightsPrivateChannel")
}

type EnableMemoryInputCueWeightsReactionsForSecondVoice struct {
	Integer *int64
	String  *string
}

var enableMemoryInputCueWeightsReactionsForSecondVoiceMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputCueWeightsReactionsForSecondVoice) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputCueWeightsReactionsForSecondVoice")
}

func (union *EnableMemoryInputCueWeightsReactionsForSecondVoice) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputCueWeightsReactionsForSecondVoiceMembers, "EnableMemoryInputCueWeightsReactionsForSecondVoice")
}

type EnableMemoryInputCueWeights struct {
	StatementKind           *EnableMemoryInputCueWeightsStatementKind           `json:"statement_kind,omitzero"`
	AuthorKind              *EnableMemoryInputCueWeightsAuthorKind              `json:"author_kind,omitzero"`
	SubjectOwner            *EnableMemoryInputCueWeightsSubjectOwner            `json:"subject_owner,omitzero"`
	PrivateChannel          *EnableMemoryInputCueWeightsPrivateChannel          `json:"private_channel,omitzero"`
	ReactionsForSecondVoice *EnableMemoryInputCueWeightsReactionsForSecondVoice `json:"reactions_for_second_voice,omitzero"`
}

type EnableMemoryInputDuplicateThreshold struct {
	Number *float64
	String *string
}

var enableMemoryInputDuplicateThresholdMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputDuplicateThreshold) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputDuplicateThreshold")
}

func (union *EnableMemoryInputDuplicateThreshold) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputDuplicateThresholdMembers, "EnableMemoryInputDuplicateThreshold")
}

type EnableMemoryInputConfidenceThreshold struct {
	Number *float64
	String *string
}

var enableMemoryInputConfidenceThresholdMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputConfidenceThreshold) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputConfidenceThreshold")
}

func (union *EnableMemoryInputConfidenceThreshold) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputConfidenceThresholdMembers, "EnableMemoryInputConfidenceThreshold")
}

type EnableMemoryInputAgreeingAuthorsForConfirmed struct {
	Integer *int64
	String  *string
}

var enableMemoryInputAgreeingAuthorsForConfirmedMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputAgreeingAuthorsForConfirmed) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputAgreeingAuthorsForConfirmed")
}

func (union *EnableMemoryInputAgreeingAuthorsForConfirmed) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputAgreeingAuthorsForConfirmedMembers, "EnableMemoryInputAgreeingAuthorsForConfirmed")
}

type EnableMemoryInputFirstPackTokens struct {
	Integer *int64
	String  *string
}

var enableMemoryInputFirstPackTokensMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputFirstPackTokens) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputFirstPackTokens")
}

func (union *EnableMemoryInputFirstPackTokens) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputFirstPackTokensMembers, "EnableMemoryInputFirstPackTokens")
}

type EnableMemoryInputRecallFadeDays struct {
	Number *float64
	String *string
}

var enableMemoryInputRecallFadeDaysMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union EnableMemoryInputRecallFadeDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputRecallFadeDays")
}

func (union *EnableMemoryInputRecallFadeDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputRecallFadeDaysMembers, "EnableMemoryInputRecallFadeDays")
}

type EnableMemoryInputSourcesForLikely struct {
	Integer *int64
	String  *string
}

var enableMemoryInputSourcesForLikelyMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputSourcesForLikely) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputSourcesForLikely")
}

func (union *EnableMemoryInputSourcesForLikely) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputSourcesForLikelyMembers, "EnableMemoryInputSourcesForLikely")
}

type EnableMemoryInputDroppedListDays struct {
	Integer *int64
	String  *string
}

var enableMemoryInputDroppedListDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputDroppedListDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputDroppedListDays")
}

func (union *EnableMemoryInputDroppedListDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputDroppedListDaysMembers, "EnableMemoryInputDroppedListDays")
}

type EnableMemoryInputReplacedRetentionDays struct {
	Integer *int64
	String  *string
}

var enableMemoryInputReplacedRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputReplacedRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputReplacedRetentionDays")
}

func (union *EnableMemoryInputReplacedRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputReplacedRetentionDaysMembers, "EnableMemoryInputReplacedRetentionDays")
}

type EnableMemoryInputMessageRetentionDays struct {
	Integer *int64
	String  *string
}

var enableMemoryInputMessageRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputMessageRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputMessageRetentionDays")
}

func (union *EnableMemoryInputMessageRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputMessageRetentionDaysMembers, "EnableMemoryInputMessageRetentionDays")
}

type EnableMemoryInputPersonalRetentionDays struct {
	Integer *int64
	String  *string
}

var enableMemoryInputPersonalRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputPersonalRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputPersonalRetentionDays")
}

func (union *EnableMemoryInputPersonalRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputPersonalRetentionDaysMembers, "EnableMemoryInputPersonalRetentionDays")
}

type EnableMemoryInputRecallLogRetentionDays struct {
	Integer *int64
	String  *string
}

var enableMemoryInputRecallLogRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputRecallLogRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputRecallLogRetentionDays")
}

func (union *EnableMemoryInputRecallLogRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputRecallLogRetentionDaysMembers, "EnableMemoryInputRecallLogRetentionDays")
}

type EnableMemoryInputReadySetSize struct {
	Integer *int64
	String  *string
}

var enableMemoryInputReadySetSizeMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputReadySetSize) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputReadySetSize")
}

func (union *EnableMemoryInputReadySetSize) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputReadySetSizeMembers, "EnableMemoryInputReadySetSize")
}

type EnableMemoryInputRecallDepth struct {
	Integer *int64
	String  *string
}

var enableMemoryInputRecallDepthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union EnableMemoryInputRecallDepth) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "EnableMemoryInputRecallDepth")
}

func (union *EnableMemoryInputRecallDepth) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, enableMemoryInputRecallDepthMembers, "EnableMemoryInputRecallDepth")
}

type EnableMemoryInput struct {
	ProjectID                   string                                            `json:"project_id"`
	Language                    *string                                           `json:"language,omitzero"`
	KnowledgeBaseChoice         *string                                           `json:"knowledge_base_choice,omitzero"`
	CheckedKnowledgeBaseIDs     []string                                          `json:"checked_knowledge_base_ids,omitzero"`
	DuplicateThreshold          *EnableMemoryInputDuplicateThreshold              `json:"duplicate_threshold,omitzero"`
	ConfidenceThreshold         *EnableMemoryInputConfidenceThreshold             `json:"confidence_threshold,omitzero"`
	AgreeingAuthorsForConfirmed *EnableMemoryInputAgreeingAuthorsForConfirmed     `json:"agreeing_authors_for_confirmed,omitzero"`
	FirstPackTokens             *EnableMemoryInputFirstPackTokens                 `json:"first_pack_tokens,omitzero"`
	RecallFadeDays              *EnableMemoryInputRecallFadeDays                  `json:"recall_fade_days,omitzero"`
	Subjects                    []EnableMemoryInputSubjectsItem                   `json:"subjects,omitzero"`
	SourcesForLikely            *EnableMemoryInputSourcesForLikely                `json:"sources_for_likely,omitzero"`
	AgentPermissions            *EnableMemoryInputAgentPermissions                `json:"agent_permissions,omitzero"`
	DroppedListDays             Nullable[EnableMemoryInputDroppedListDays]        `json:"dropped_list_days,omitzero"`
	ReplacedRetentionDays       Nullable[EnableMemoryInputReplacedRetentionDays]  `json:"replaced_retention_days,omitzero"`
	MessageRetentionDays        Nullable[EnableMemoryInputMessageRetentionDays]   `json:"message_retention_days,omitzero"`
	PersonalRetentionDays       Nullable[EnableMemoryInputPersonalRetentionDays]  `json:"personal_retention_days,omitzero"`
	RecallLogRetentionDays      Nullable[EnableMemoryInputRecallLogRetentionDays] `json:"recall_log_retention_days,omitzero"`
	ReadySetSize                *EnableMemoryInputReadySetSize                    `json:"ready_set_size,omitzero"`
	RecallDepth                 *EnableMemoryInputRecallDepth                     `json:"recall_depth,omitzero"`
	CueWeights                  *EnableMemoryInputCueWeights                      `json:"cue_weights,omitzero"`
}

type EnableMemoryOutputSettingsSubjectsItem struct {
	Subject   string  `json:"subject"`
	OwnerID   *string `json:"owner_id"`
	Sensitive bool    `json:"sensitive"`
}

type EnableMemoryOutputSettingsAgentPermissions struct {
	Confirmed string `json:"confirmed"`
	Likely    string `json:"likely"`
	Disputed  string `json:"disputed"`
}

type EnableMemoryOutputSettingsCueWeightsStatementKind struct {
	Statement   float64 `json:"statement"`
	Event       float64 `json:"event"`
	Promise     float64 `json:"promise"`
	Procedure   float64 `json:"procedure"`
	Instruction float64 `json:"instruction"`
}

type EnableMemoryOutputSettingsCueWeightsAuthorKind struct {
	Staff    float64 `json:"staff"`
	Agent    float64 `json:"agent"`
	EndUser  float64 `json:"end_user"`
	Outsider float64 `json:"outsider"`
	Records  float64 `json:"records"`
	Code     float64 `json:"code"`
}

type EnableMemoryOutputSettingsCueWeights struct {
	StatementKind           EnableMemoryOutputSettingsCueWeightsStatementKind `json:"statement_kind"`
	AuthorKind              EnableMemoryOutputSettingsCueWeightsAuthorKind    `json:"author_kind"`
	SubjectOwner            float64                                           `json:"subject_owner"`
	PrivateChannel          float64                                           `json:"private_channel"`
	ReactionsForSecondVoice float64                                           `json:"reactions_for_second_voice"`
}

type EnableMemoryOutputSettings struct {
	DuplicateThreshold          float64                                    `json:"duplicate_threshold"`
	ConfidenceThreshold         float64                                    `json:"confidence_threshold"`
	AgreeingAuthorsForConfirmed float64                                    `json:"agreeing_authors_for_confirmed"`
	FirstPackTokens             float64                                    `json:"first_pack_tokens"`
	RecallFadeDays              float64                                    `json:"recall_fade_days"`
	KnowledgeBaseChoice         string                                     `json:"knowledge_base_choice"`
	CheckedKnowledgeBaseIDs     []string                                   `json:"checked_knowledge_base_ids"`
	Subjects                    []EnableMemoryOutputSettingsSubjectsItem   `json:"subjects"`
	SourcesForLikely            float64                                    `json:"sources_for_likely"`
	AgentPermissions            EnableMemoryOutputSettingsAgentPermissions `json:"agent_permissions"`
	DroppedListDays             *float64                                   `json:"dropped_list_days"`
	ReplacedRetentionDays       *float64                                   `json:"replaced_retention_days"`
	MessageRetentionDays        *float64                                   `json:"message_retention_days"`
	PersonalRetentionDays       *float64                                   `json:"personal_retention_days"`
	RecallLogRetentionDays      *float64                                   `json:"recall_log_retention_days"`
	ReadySetSize                float64                                    `json:"ready_set_size"`
	RecallDepth                 float64                                    `json:"recall_depth"`
	CueWeights                  EnableMemoryOutputSettingsCueWeights       `json:"cue_weights"`
	RecallCheckedMemories       float64                                    `json:"recall_checked_memories"`
}

type EnableMemoryOutputCheckedKnowledgeBasesLeftOutItem struct {
	KnowledgeBaseID string `json:"knowledge_base_id"`
	Reason          string `json:"reason"`
}

type EnableMemoryOutputCheckedKnowledgeBases struct {
	KnowledgeBaseIDs []string                                             `json:"knowledge_base_ids"`
	LeftOut          []EnableMemoryOutputCheckedKnowledgeBasesLeftOutItem `json:"left_out"`
	LeftOutCount     float64                                              `json:"left_out_count"`
	Limit            float64                                              `json:"limit"`
}

type EnableMemoryOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type EnableMemoryOutput struct {
	ID                    string                                  `json:"id"`
	ProjectID             string                                  `json:"project_id"`
	Language              string                                  `json:"language"`
	Settings              EnableMemoryOutputSettings              `json:"settings"`
	CheckedKnowledgeBases EnableMemoryOutputCheckedKnowledgeBases `json:"checked_knowledge_bases"`
	CreatedAt             string                                  `json:"created_at"`
	CreatedBy             EnableMemoryOutputCreatedBy             `json:"created_by"`
	DeletedAt             *string                                 `json:"deleted_at"`
	PurgeAfter            *string                                 `json:"purge_after"`
	SortingPendingSince   *string                                 `json:"sorting_pending_since"`
}

type EraseEndUserInput struct {
	ProjectID string `json:"project_id"`
	EndUserID string `json:"end_user_id"`
}

type EraseEndUserOutput struct {
	EndUserID       string  `json:"end_user_id"`
	ErasedQuestions float64 `json:"erased_questions"`
	KnowledgeBases  float64 `json:"knowledge_bases"`
	ErasedMemories  float64 `json:"erased_memories"`
	ErasedMessages  float64 `json:"erased_messages"`
}

type ExportIndexRecordsInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
}

type ExportMemoriesInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	EndUserID *string `json:"end_user_id,omitzero"`
	After     *string `json:"after,omitzero"`
}

type ExportTableRowsInputFiltersItemValueInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ExportTableRowsInputFiltersItemValueBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ExportTableRowsInputFiltersItemValueItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ExportTableRowsInputFiltersItemValueItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ExportTableRowsInputFiltersItemValueItem struct {
	Number  *float64
	String  *string
	Integer *ExportTableRowsInputFiltersItemValueItemInteger
	Blob    *ExportTableRowsInputFiltersItemValueItemBlob
}

var exportTableRowsInputFiltersItemValueItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union ExportTableRowsInputFiltersItemValueItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ExportTableRowsInputFiltersItemValueItem")
}

func (union *ExportTableRowsInputFiltersItemValueItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, exportTableRowsInputFiltersItemValueItemMembers, "ExportTableRowsInputFiltersItemValueItem")
}

type ExportTableRowsInputFiltersItemValue struct {
	Number  *float64
	String  *string
	Integer *ExportTableRowsInputFiltersItemValueInteger
	Blob    *ExportTableRowsInputFiltersItemValueBlob
	List    *[]Nullable[ExportTableRowsInputFiltersItemValueItem]
}

var exportTableRowsInputFiltersItemValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
	{kind: unionList},
}

func (union ExportTableRowsInputFiltersItemValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ExportTableRowsInputFiltersItemValue")
}

func (union *ExportTableRowsInputFiltersItemValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, exportTableRowsInputFiltersItemValueMembers, "ExportTableRowsInputFiltersItemValue")
}

type ExportTableRowsInputFiltersItem struct {
	Column   string                                         `json:"column"`
	Operator string                                         `json:"operator"`
	Value    Nullable[ExportTableRowsInputFiltersItemValue] `json:"value,omitzero"`
}

type ExportTableRowsInputSortsItem struct {
	Column    string  `json:"column"`
	Direction *string `json:"direction,omitzero"`
}

type ExportTableRowsInput struct {
	ProjectID  string                            `json:"project_id"`
	DatabaseID string                            `json:"database_id"`
	TableName  string                            `json:"table_name"`
	Format     string                            `json:"format"`
	Filters    []ExportTableRowsInputFiltersItem `json:"filters,omitzero"`
	Sorts      []ExportTableRowsInputSortsItem   `json:"sorts,omitzero"`
}

type FinishSourceSignInInput struct {
	State string `json:"state"`
	Code  string `json:"code"`
}

type FinishSourceSignInOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type FinishSourceSignInOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type FinishSourceSignInOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type FinishSourceSignInOutput struct {
	ID              string                             `json:"id"`
	ProjectID       string                             `json:"project_id"`
	KnowledgeBaseID *string                            `json:"knowledge_base_id"`
	MemoryID        *string                            `json:"memory_id"`
	Name            string                             `json:"name"`
	Kind            string                             `json:"kind"`
	Sorting         *string                            `json:"sorting"`
	Status          string                             `json:"status"`
	Settings        map[string]any                     `json:"settings"`
	CredentialNames []string                           `json:"credential_names"`
	WebhookURL      *string                            `json:"webhook_url"`
	SignIn          *FinishSourceSignInOutputSignIn    `json:"sign_in"`
	CreatedAt       string                             `json:"created_at"`
	CreatedBy       FinishSourceSignInOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                            `json:"last_synced_at"`
	NextSyncAt      *string                            `json:"next_sync_at"`
	LastError       *FinishSourceSignInOutputLastError `json:"last_error"`
}

type ForgetMemoryInput struct {
	ProjectID      string `json:"project_id"`
	MemoryID       string `json:"memory_id"`
	StoredMemoryID string `json:"stored_memory_id"`
}

type ForgetMemoryOutputValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var forgetMemoryOutputValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union ForgetMemoryOutputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ForgetMemoryOutputValuesValue")
}

func (union *ForgetMemoryOutputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, forgetMemoryOutputValuesValueMembers, "ForgetMemoryOutputValuesValue")
}

type ForgetMemoryOutputPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type ForgetMemoryOutputSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type ForgetMemoryOutput struct {
	ID                 string                                    `json:"id"`
	MemoryID           string                                    `json:"memory_id"`
	Type               string                                    `json:"type"`
	Scope              string                                    `json:"scope"`
	OwnerID            *string                                   `json:"owner_id"`
	Personal           bool                                      `json:"personal"`
	TrustLevel         string                                    `json:"trust_level"`
	Text               string                                    `json:"text"`
	Subject            string                                    `json:"subject"`
	Values             map[string]*ForgetMemoryOutputValuesValue `json:"values"`
	Plan               *ForgetMemoryOutputPlan                   `json:"plan"`
	Sensitive          bool                                      `json:"sensitive"`
	InstructionLike    bool                                      `json:"instruction_like"`
	SortedBy           string                                    `json:"sorted_by"`
	ConnectionStrength float64                                   `json:"connection_strength"`
	RecallStrength     float64                                   `json:"recall_strength"`
	Sources            []ForgetMemoryOutputSourcesItem           `json:"sources"`
	ReplacedBy         *string                                   `json:"replaced_by"`
	HeldUntil          *string                                   `json:"held_until"`
	ExpiresAt          *string                                   `json:"expires_at"`
	LastCheckedAt      *string                                   `json:"last_checked_at"`
	ForgottenAt        *string                                   `json:"forgotten_at"`
	PurgeAfter         *string                                   `json:"purge_after"`
	OccurredAt         string                                    `json:"occurred_at"`
	CreatedAt          string                                    `json:"created_at"`
	UpdatedAt          string                                    `json:"updated_at"`
}

type GetCorrectionInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	CorrectionID    string `json:"correction_id"`
}

type GetCorrectionOutputSettingFieldBoost struct {
	Kind    string  `json:"kind"`
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type GetCorrectionOutputSettingOption1 struct {
	Kind         string `json:"kind"`
	Strategy     string `json:"strategy"`
	RankConstant int64  `json:"rank_constant"`
}

type GetCorrectionOutputSettingOption2 struct {
	Kind         string  `json:"kind"`
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type GetCorrectionOutputSettingBm25 struct {
	Kind string  `json:"kind"`
	K1   float64 `json:"k1"`
	B    float64 `json:"b"`
}

type GetCorrectionOutputSettingStopWords struct {
	Kind    string   `json:"kind"`
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type GetCorrectionOutputSettingSynonymsRulesItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type GetCorrectionOutputSettingSynonymsRulesItemOption2 struct {
	Words []string `json:"words"`
}

type GetCorrectionOutputSettingSynonymsRulesItem struct {
	Option1 *GetCorrectionOutputSettingSynonymsRulesItemOption1
	Option2 *GetCorrectionOutputSettingSynonymsRulesItemOption2
}

var getCorrectionOutputSettingSynonymsRulesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union GetCorrectionOutputSettingSynonymsRulesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetCorrectionOutputSettingSynonymsRulesItem")
}

func (union *GetCorrectionOutputSettingSynonymsRulesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getCorrectionOutputSettingSynonymsRulesItemMembers, "GetCorrectionOutputSettingSynonymsRulesItem")
}

type GetCorrectionOutputSettingSynonyms struct {
	Kind  string                                        `json:"kind"`
	Rules []GetCorrectionOutputSettingSynonymsRulesItem `json:"rules"`
}

type GetCorrectionOutputSettingLanguage struct {
	Kind     string `json:"kind"`
	Language string `json:"language"`
}

type GetCorrectionOutputSettingChunking struct {
	Kind        string `json:"kind"`
	ChunkTokens int64  `json:"chunk_tokens"`
}

type GetCorrectionOutputSettingRebuild struct {
	Kind string `json:"kind"`
}

type GetCorrectionOutputSettingAgentDepth struct {
	Kind  string  `json:"kind"`
	Depth float64 `json:"depth"`
}

type GetCorrectionOutputSetting struct {
	FieldBoost *GetCorrectionOutputSettingFieldBoost
	Option1    *GetCorrectionOutputSettingOption1
	Option2    *GetCorrectionOutputSettingOption2
	Bm25       *GetCorrectionOutputSettingBm25
	StopWords  *GetCorrectionOutputSettingStopWords
	Synonyms   *GetCorrectionOutputSettingSynonyms
	Language   *GetCorrectionOutputSettingLanguage
	Chunking   *GetCorrectionOutputSettingChunking
	Rebuild    *GetCorrectionOutputSettingRebuild
	AgentDepth *GetCorrectionOutputSettingAgentDepth
}

var getCorrectionOutputSettingMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "text", "heading"}, properties: []string{"kind", "text", "heading"}, constants: map[string]any{"kind": "field_boost"}},
	{kind: unionObject, required: []string{"kind", "strategy", "rank_constant"}, properties: []string{"kind", "strategy", "rank_constant"}, constants: map[string]any{"kind": "fusion", "strategy": "rrf"}},
	{kind: unionObject, required: []string{"kind", "strategy", "vector_weight"}, properties: []string{"kind", "strategy", "vector_weight"}, constants: map[string]any{"kind": "fusion", "strategy": "linear"}},
	{kind: unionObject, required: []string{"kind", "k1", "b"}, properties: []string{"kind", "k1", "b"}, constants: map[string]any{"kind": "bm25"}},
	{kind: unionObject, required: []string{"kind", "added", "removed"}, properties: []string{"kind", "added", "removed"}, constants: map[string]any{"kind": "stop_words"}},
	{kind: unionObject, required: []string{"kind", "rules"}, properties: []string{"kind", "rules"}, constants: map[string]any{"kind": "synonyms"}},
	{kind: unionObject, required: []string{"kind", "language"}, properties: []string{"kind", "language"}, constants: map[string]any{"kind": "language"}},
	{kind: unionObject, required: []string{"kind", "chunk_tokens"}, properties: []string{"kind", "chunk_tokens"}, constants: map[string]any{"kind": "chunking"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "rebuild"}},
	{kind: unionObject, required: []string{"kind", "depth"}, properties: []string{"kind", "depth"}, constants: map[string]any{"kind": "agent_depth"}},
}

func (union GetCorrectionOutputSetting) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetCorrectionOutputSetting")
}

func (union *GetCorrectionOutputSetting) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getCorrectionOutputSettingMembers, "GetCorrectionOutputSetting")
}

type GetCorrectionOutputEstimate struct {
	Seconds          float64  `json:"seconds"`
	MemoryBytes      float64  `json:"memory_bytes"`
	SecondIndex      bool     `json:"second_index"`
	ChunksToIndex    float64  `json:"chunks_to_index"`
	QuestionsToScore float64  `json:"questions_to_score"`
	PriceUsd         *float64 `json:"price_usd"`
}

type GetCorrectionOutputBeforeTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetCorrectionOutputBeforeHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetCorrectionOutputBefore struct {
	ScorecardID *string                           `json:"scorecard_id"`
	Tuning      GetCorrectionOutputBeforeTuning   `json:"tuning"`
	HeldBack    GetCorrectionOutputBeforeHeldBack `json:"held_back"`
}

type GetCorrectionOutputAfterTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetCorrectionOutputAfterHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetCorrectionOutputAfter struct {
	ScorecardID *string                          `json:"scorecard_id"`
	Tuning      GetCorrectionOutputAfterTuning   `json:"tuning"`
	HeldBack    GetCorrectionOutputAfterHeldBack `json:"held_back"`
}

type GetCorrectionOutputQuestionChanges struct {
	NowPass   float64 `json:"now_pass"`
	NowFail   float64 `json:"now_fail"`
	MovedUp   float64 `json:"moved_up"`
	MovedDown float64 `json:"moved_down"`
}

type GetCorrectionOutput struct {
	ID              string                              `json:"id"`
	Origin          string                              `json:"origin"`
	Cause           *string                             `json:"cause"`
	Kind            string                              `json:"kind"`
	Setting         GetCorrectionOutputSetting          `json:"setting"`
	TargetIDs       []string                            `json:"target_ids"`
	FileKinds       []string                            `json:"file_kinds"`
	Status          string                              `json:"status"`
	PassID          *string                             `json:"pass_id"`
	Estimate        GetCorrectionOutputEstimate         `json:"estimate"`
	Before          *GetCorrectionOutputBefore          `json:"before"`
	After           *GetCorrectionOutputAfter           `json:"after"`
	Verdict         string                              `json:"verdict"`
	QuestionChanges *GetCorrectionOutputQuestionChanges `json:"question_changes"`
	WaitsForClick   bool                                `json:"waits_for_click"`
	WaitReason      *string                             `json:"wait_reason"`
	DecidedBy       *string                             `json:"decided_by"`
	DecisionNote    *string                             `json:"decision_note"`
	FailureMessage  *string                             `json:"failure_message"`
	CreatedAt       string                              `json:"created_at"`
	TriedAt         *string                             `json:"tried_at"`
	DecidedAt       *string                             `json:"decided_at"`
}

type GetCorrectionPassInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	PassID          string `json:"pass_id"`
}

type GetCorrectionPassOutput struct {
	ID                string   `json:"id"`
	Trigger           string   `json:"trigger"`
	Mode              string   `json:"mode"`
	Status            string   `json:"status"`
	CompleteIndex     bool     `json:"complete_index"`
	BeforeScorecardID *string  `json:"before_scorecard_id"`
	AfterScorecardID  *string  `json:"after_scorecard_id"`
	CorrectionIDs     []string `json:"correction_ids"`
	FailureMessage    *string  `json:"failure_message"`
	RequestedAt       string   `json:"requested_at"`
	StartedAt         *string  `json:"started_at"`
	FinishedAt        *string  `json:"finished_at"`
}

type GetDatabaseInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type GetDatabaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GetDatabaseOutputSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type GetDatabaseOutputCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type GetDatabaseOutput struct {
	ID               string                       `json:"id"`
	ProjectID        string                       `json:"project_id"`
	Name             string                       `json:"name"`
	CreatedAt        string                       `json:"created_at"`
	CreatedBy        GetDatabaseOutputCreatedBy   `json:"created_by"`
	DeletedAt        *string                      `json:"deleted_at"`
	PurgeAfter       *string                      `json:"purge_after"`
	MigrationVersion float64                      `json:"migration_version"`
	SirannonURL      string                       `json:"sirannon_url"`
	Size             *GetDatabaseOutputSize       `json:"size"`
	Compaction       *GetDatabaseOutputCompaction `json:"compaction"`
	SQLWritePreview  bool                         `json:"sql_write_preview"`
}

type GetDownloadLinkInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	FileID          string  `json:"file_id"`
	Version         string  `json:"version"`
	Rendition       *string `json:"rendition,omitzero"`
	Disposition     *string `json:"disposition,omitzero"`
}

type GetDownloadLinkOutput struct {
	URL         string  `json:"url"`
	ExpiresAt   string  `json:"expires_at"`
	FileName    string  `json:"file_name"`
	ContentType string  `json:"content_type"`
	Disposition string  `json:"disposition"`
	SizeBytes   float64 `json:"size_bytes"`
	EntityTag   string  `json:"entity_tag"`
}

type GetFileInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	FileID          string `json:"file_id"`
}

type GetFileOutputFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetFileOutputUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetFileOutputUnreadPartsItem struct {
	FirstPage   *float64                            `json:"first_page"`
	LastPage    *float64                            `json:"last_page"`
	StartSecond *float64                            `json:"start_second"`
	EndSecond   *float64                            `json:"end_second"`
	Failure     GetFileOutputUnreadPartsItemFailure `json:"failure"`
}

type GetFileOutputVersionsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetFileOutputVersionsItemUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetFileOutputVersionsItemUnreadPartsItem struct {
	FirstPage   *float64                                        `json:"first_page"`
	LastPage    *float64                                        `json:"last_page"`
	StartSecond *float64                                        `json:"start_second"`
	EndSecond   *float64                                        `json:"end_second"`
	Failure     GetFileOutputVersionsItemUnreadPartsItemFailure `json:"failure"`
}

type GetFileOutputVersionsItem struct {
	Version           float64                                    `json:"version"`
	ContentSHA256     string                                     `json:"content_sha256"`
	SizeBytes         float64                                    `json:"size_bytes"`
	Status            string                                     `json:"status"`
	Failure           *GetFileOutputVersionsItemFailure          `json:"failure"`
	ReceivedAt        string                                     `json:"received_at"`
	ProcessedAt       *string                                    `json:"processed_at"`
	PageCount         *float64                                   `json:"page_count"`
	DurationSeconds   *float64                                   `json:"duration_seconds"`
	ConversionSeconds *float64                                   `json:"conversion_seconds"`
	OcrPageCount      *float64                                   `json:"ocr_page_count"`
	UnreadParts       []GetFileOutputVersionsItemUnreadPartsItem `json:"unread_parts"`
	BlockCount        float64                                    `json:"block_count"`
	ChunkCount        float64                                    `json:"chunk_count"`
}

type GetFileOutput struct {
	ID              string                         `json:"id"`
	KnowledgeBaseID string                         `json:"knowledge_base_id"`
	Path            string                         `json:"path"`
	Kind            string                         `json:"kind"`
	Address         *string                        `json:"address"`
	Status          string                         `json:"status"`
	CurrentVersion  *float64                       `json:"current_version"`
	LatestVersion   float64                        `json:"latest_version"`
	SizeBytes       float64                        `json:"size_bytes"`
	ContentSHA256   string                         `json:"content_sha256"`
	Failure         *GetFileOutputFailure          `json:"failure"`
	UnreadParts     []GetFileOutputUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string              `json:"metadata"`
	CreatedAt       string                         `json:"created_at"`
	UpdatedAt       string                         `json:"updated_at"`
	DeletedAt       *string                        `json:"deleted_at"`
	PurgeAfter      *string                        `json:"purge_after"`
	Versions        []GetFileOutputVersionsItem    `json:"versions"`
	VersionCount    float64                        `json:"version_count"`
}

type GetFlaggedQuestionInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	QuestionID      string `json:"question_id"`
}

type GetFlaggedQuestionOutputSignalDetailsItem struct {
	Kind       string         `json:"kind"`
	Detail     map[string]any `json:"detail"`
	ReceivedAt string         `json:"received_at"`
}

type GetFlaggedQuestionOutputAnswer struct {
	Answer        *string  `json:"answer"`
	FollowUp      *string  `json:"follow_up"`
	CitedChunkIDs []string `json:"cited_chunk_ids"`
	AnsweredBy    string   `json:"answered_by"`
	AnsweredAt    string   `json:"answered_at"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationDocument struct {
	Kind      string                                                                      `json:"kind"`
	Pages     []float64                                                                   `json:"pages"`
	Areas     []GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationImage struct {
	Kind      string                                                                   `json:"kind"`
	FileName  string                                                                   `json:"file_name"`
	Areas     []GetFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []GetFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type GetFlaggedQuestionOutputReturnedPassagesItemCitation struct {
	Document    *GetFlaggedQuestionOutputReturnedPassagesItemCitationDocument
	Spreadsheet *GetFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet
	Slides      *GetFlaggedQuestionOutputReturnedPassagesItemCitationSlides
	WebPage     *GetFlaggedQuestionOutputReturnedPassagesItemCitationWebPage
	Image       *GetFlaggedQuestionOutputReturnedPassagesItemCitationImage
	Recording   *GetFlaggedQuestionOutputReturnedPassagesItemCitationRecording
}

var getFlaggedQuestionOutputReturnedPassagesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union GetFlaggedQuestionOutputReturnedPassagesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetFlaggedQuestionOutputReturnedPassagesItemCitation")
}

func (union *GetFlaggedQuestionOutputReturnedPassagesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getFlaggedQuestionOutputReturnedPassagesItemCitationMembers, "GetFlaggedQuestionOutputReturnedPassagesItemCitation")
}

type GetFlaggedQuestionOutputReturnedPassagesItem struct {
	Rank     float64                                               `json:"rank"`
	ChunkID  string                                                `json:"chunk_id"`
	FileID   string                                                `json:"file_id"`
	FilePath *string                                               `json:"file_path"`
	FileKind *string                                               `json:"file_kind"`
	Version  float64                                               `json:"version"`
	Heading  *string                                               `json:"heading"`
	Citation *GetFlaggedQuestionOutputReturnedPassagesItemCitation `json:"citation"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationDocument struct {
	Kind      string                                                                `json:"kind"`
	Pages     []float64                                                             `json:"pages"`
	Areas     []GetFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []GetFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationImage struct {
	Kind      string                                                             `json:"kind"`
	FileName  string                                                             `json:"file_name"`
	Areas     []GetFlaggedQuestionOutputCandidatesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []GetFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type GetFlaggedQuestionOutputCandidatesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type GetFlaggedQuestionOutputCandidatesItemCitation struct {
	Document    *GetFlaggedQuestionOutputCandidatesItemCitationDocument
	Spreadsheet *GetFlaggedQuestionOutputCandidatesItemCitationSpreadsheet
	Slides      *GetFlaggedQuestionOutputCandidatesItemCitationSlides
	WebPage     *GetFlaggedQuestionOutputCandidatesItemCitationWebPage
	Image       *GetFlaggedQuestionOutputCandidatesItemCitationImage
	Recording   *GetFlaggedQuestionOutputCandidatesItemCitationRecording
}

var getFlaggedQuestionOutputCandidatesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union GetFlaggedQuestionOutputCandidatesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetFlaggedQuestionOutputCandidatesItemCitation")
}

func (union *GetFlaggedQuestionOutputCandidatesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getFlaggedQuestionOutputCandidatesItemCitationMembers, "GetFlaggedQuestionOutputCandidatesItemCitation")
}

type GetFlaggedQuestionOutputCandidatesItem struct {
	Rank          float64                                         `json:"rank"`
	ChunkID       string                                          `json:"chunk_id"`
	FileID        string                                          `json:"file_id"`
	Version       float64                                         `json:"version"`
	FirstPosition float64                                         `json:"first_position"`
	LastPosition  float64                                         `json:"last_position"`
	Heading       *string                                         `json:"heading"`
	Probability   float64                                         `json:"probability"`
	FilePath      *string                                         `json:"file_path"`
	FileKind      *string                                         `json:"file_kind"`
	LatestVersion *float64                                        `json:"latest_version"`
	Citation      *GetFlaggedQuestionOutputCandidatesItemCitation `json:"citation"`
}

type GetFlaggedQuestionOutput struct {
	QuestionID       string                                         `json:"question_id"`
	Question         string                                         `json:"question"`
	EndUserID        *string                                        `json:"end_user_id"`
	Status           string                                         `json:"status"`
	Signals          []string                                       `json:"signals"`
	FlaggedAt        string                                         `json:"flagged_at"`
	JudgedAt         *string                                        `json:"judged_at"`
	Probability      *float64                                       `json:"probability"`
	ChosenRank       *float64                                       `json:"chosen_rank"`
	SavedQuestionID  *string                                        `json:"saved_question_id"`
	SettledBy        *string                                        `json:"settled_by"`
	SignalDetails    []GetFlaggedQuestionOutputSignalDetailsItem    `json:"signal_details"`
	Answer           *GetFlaggedQuestionOutputAnswer                `json:"answer"`
	ReturnedPassages []GetFlaggedQuestionOutputReturnedPassagesItem `json:"returned_passages"`
	Candidates       []GetFlaggedQuestionOutputCandidatesItem       `json:"candidates"`
	NoneProbability  *float64                                       `json:"none_probability"`
	AnswerRead       bool                                           `json:"answer_read"`
}

type GetIndexInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
}

type GetIndexOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GetIndexOutput struct {
	ID         string                  `json:"id"`
	ProjectID  string                  `json:"project_id"`
	Name       string                  `json:"name"`
	CreatedAt  string                  `json:"created_at"`
	CreatedBy  GetIndexOutputCreatedBy `json:"created_by"`
	DeletedAt  *string                 `json:"deleted_at"`
	PurgeAfter *string                 `json:"purge_after"`
	Config     map[string]any          `json:"config"`
	NarsilURL  string                  `json:"narsil_url"`
}

type GetIndexRecordInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
	RecordID  string `json:"record_id"`
}

type GetIndexRecordOutput struct {
	ID     string         `json:"id"`
	Record map[string]any `json:"record"`
}

type GetIndexStatsInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
}

type GetIndexStatsOutputFieldsItem struct {
	Path string `json:"path"`
	Type string `json:"type"`
}

type GetIndexStatsOutputVectorFieldsItem struct {
	Path           string   `json:"path"`
	Dimensions     float64  `json:"dimensions"`
	EmbeddingModel *string  `json:"embedding_model"`
	SourceFields   []string `json:"source_fields"`
}

type GetIndexStatsOutput struct {
	RecordCount          float64                               `json:"record_count"`
	PartitionCount       float64                               `json:"partition_count"`
	EstimatedMemoryBytes *float64                              `json:"estimated_memory_bytes"`
	Language             string                                `json:"language"`
	StopWords            []string                              `json:"stop_words"`
	Fields               []GetIndexStatsOutputFieldsItem       `json:"fields"`
	VectorFields         []GetIndexStatsOutputVectorFieldsItem `json:"vector_fields"`
}

type GetKnowledgeBaseInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type GetKnowledgeBaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GetKnowledgeBaseOutputFileProgress struct {
	FileCount       float64 `json:"file_count"`
	QueuedCount     float64 `json:"queued_count"`
	ProcessingCount float64 `json:"processing_count"`
	ReadyCount      float64 `json:"ready_count"`
	FailedCount     float64 `json:"failed_count"`
	LastReadAt      *string `json:"last_read_at"`
}

type GetKnowledgeBaseOutput struct {
	ID                       string                              `json:"id"`
	ProjectID                string                              `json:"project_id"`
	Name                     string                              `json:"name"`
	Language                 string                              `json:"language"`
	ChunkTokens              float64                             `json:"chunk_tokens"`
	QuestionLogRetentionDays *float64                            `json:"question_log_retention_days"`
	CreatedAt                string                              `json:"created_at"`
	CreatedBy                GetKnowledgeBaseOutputCreatedBy     `json:"created_by"`
	DeletedAt                *string                             `json:"deleted_at"`
	PurgeAfter               *string                             `json:"purge_after"`
	DatabaseID               string                              `json:"database_id"`
	LiveIndexID              string                              `json:"live_index_id"`
	SirannonURL              string                              `json:"sirannon_url"`
	SearchPendingSince       *string                             `json:"search_pending_since"`
	FileProgress             *GetKnowledgeBaseOutputFileProgress `json:"file_progress"`
}

type GetMemoryInput struct {
	ProjectID string  `json:"project_id"`
	State     *string `json:"state,omitzero"`
}

type GetMemoryOutputSettingsSubjectsItem struct {
	Subject   string  `json:"subject"`
	OwnerID   *string `json:"owner_id"`
	Sensitive bool    `json:"sensitive"`
}

type GetMemoryOutputSettingsAgentPermissions struct {
	Confirmed string `json:"confirmed"`
	Likely    string `json:"likely"`
	Disputed  string `json:"disputed"`
}

type GetMemoryOutputSettingsCueWeightsStatementKind struct {
	Statement   float64 `json:"statement"`
	Event       float64 `json:"event"`
	Promise     float64 `json:"promise"`
	Procedure   float64 `json:"procedure"`
	Instruction float64 `json:"instruction"`
}

type GetMemoryOutputSettingsCueWeightsAuthorKind struct {
	Staff    float64 `json:"staff"`
	Agent    float64 `json:"agent"`
	EndUser  float64 `json:"end_user"`
	Outsider float64 `json:"outsider"`
	Records  float64 `json:"records"`
	Code     float64 `json:"code"`
}

type GetMemoryOutputSettingsCueWeights struct {
	StatementKind           GetMemoryOutputSettingsCueWeightsStatementKind `json:"statement_kind"`
	AuthorKind              GetMemoryOutputSettingsCueWeightsAuthorKind    `json:"author_kind"`
	SubjectOwner            float64                                        `json:"subject_owner"`
	PrivateChannel          float64                                        `json:"private_channel"`
	ReactionsForSecondVoice float64                                        `json:"reactions_for_second_voice"`
}

type GetMemoryOutputSettings struct {
	DuplicateThreshold          float64                                 `json:"duplicate_threshold"`
	ConfidenceThreshold         float64                                 `json:"confidence_threshold"`
	AgreeingAuthorsForConfirmed float64                                 `json:"agreeing_authors_for_confirmed"`
	FirstPackTokens             float64                                 `json:"first_pack_tokens"`
	RecallFadeDays              float64                                 `json:"recall_fade_days"`
	KnowledgeBaseChoice         string                                  `json:"knowledge_base_choice"`
	CheckedKnowledgeBaseIDs     []string                                `json:"checked_knowledge_base_ids"`
	Subjects                    []GetMemoryOutputSettingsSubjectsItem   `json:"subjects"`
	SourcesForLikely            float64                                 `json:"sources_for_likely"`
	AgentPermissions            GetMemoryOutputSettingsAgentPermissions `json:"agent_permissions"`
	DroppedListDays             *float64                                `json:"dropped_list_days"`
	ReplacedRetentionDays       *float64                                `json:"replaced_retention_days"`
	MessageRetentionDays        *float64                                `json:"message_retention_days"`
	PersonalRetentionDays       *float64                                `json:"personal_retention_days"`
	RecallLogRetentionDays      *float64                                `json:"recall_log_retention_days"`
	ReadySetSize                float64                                 `json:"ready_set_size"`
	RecallDepth                 float64                                 `json:"recall_depth"`
	CueWeights                  GetMemoryOutputSettingsCueWeights       `json:"cue_weights"`
	RecallCheckedMemories       float64                                 `json:"recall_checked_memories"`
}

type GetMemoryOutputCheckedKnowledgeBasesLeftOutItem struct {
	KnowledgeBaseID string `json:"knowledge_base_id"`
	Reason          string `json:"reason"`
}

type GetMemoryOutputCheckedKnowledgeBases struct {
	KnowledgeBaseIDs []string                                          `json:"knowledge_base_ids"`
	LeftOut          []GetMemoryOutputCheckedKnowledgeBasesLeftOutItem `json:"left_out"`
	LeftOutCount     float64                                           `json:"left_out_count"`
	Limit            float64                                           `json:"limit"`
}

type GetMemoryOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GetMemoryOutputProgress struct {
	WaitingCount    float64 `json:"waiting_count"`
	SortedCount     float64 `json:"sorted_count"`
	FailedCount     float64 `json:"failed_count"`
	MemoryCount     float64 `json:"memory_count"`
	OpenReviewCount float64 `json:"open_review_count"`
}

type GetMemoryOutput struct {
	ID                    string                               `json:"id"`
	ProjectID             string                               `json:"project_id"`
	Language              string                               `json:"language"`
	Settings              GetMemoryOutputSettings              `json:"settings"`
	CheckedKnowledgeBases GetMemoryOutputCheckedKnowledgeBases `json:"checked_knowledge_bases"`
	CreatedAt             string                               `json:"created_at"`
	CreatedBy             GetMemoryOutputCreatedBy             `json:"created_by"`
	DeletedAt             *string                              `json:"deleted_at"`
	PurgeAfter            *string                              `json:"purge_after"`
	SortingPendingSince   *string                              `json:"sorting_pending_since"`
	Progress              *GetMemoryOutputProgress             `json:"progress"`
}

type GetMemoryContextInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	EndUserID *string `json:"end_user_id,omitzero"`
	TeamID    *string `json:"team_id,omitzero"`
	AgentID   *string `json:"agent_id,omitzero"`
	AsOf      *string `json:"as_of,omitzero"`
}

type GetMemoryContextOutputMemoriesItemValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var getMemoryContextOutputMemoriesItemValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union GetMemoryContextOutputMemoriesItemValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetMemoryContextOutputMemoriesItemValuesValue")
}

func (union *GetMemoryContextOutputMemoriesItemValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getMemoryContextOutputMemoriesItemValuesValueMembers, "GetMemoryContextOutputMemoriesItemValuesValue")
}

type GetMemoryContextOutputMemoriesItemPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type GetMemoryContextOutputMemoriesItemSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type GetMemoryContextOutputMemoriesItemHolds struct {
	From      string  `json:"from"`
	Until     *string `json:"until"`
	ExpiresAt *string `json:"expires_at"`
}

type GetMemoryContextOutputMemoriesItemReplacesItem struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type GetMemoryContextOutputMemoriesItemReplacedBy struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type GetMemoryContextOutputMemoriesItemConflictsWithItemMemorySourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type GetMemoryContextOutputMemoriesItemConflictsWithItemMemory struct {
	Kind       string                                                                 `json:"kind"`
	ID         string                                                                 `json:"id"`
	Text       string                                                                 `json:"text"`
	TrustLevel string                                                                 `json:"trust_level"`
	HeldFrom   string                                                                 `json:"held_from"`
	Sources    []GetMemoryContextOutputMemoriesItemConflictsWithItemMemorySourcesItem `json:"sources"`
}

type GetMemoryContextOutputMemoriesItemConflictsWithItemFile struct {
	Kind            string  `json:"kind"`
	Text            string  `json:"text"`
	RecordedAt      string  `json:"recorded_at"`
	KnowledgeBaseID *string `json:"knowledge_base_id"`
	FileID          *string `json:"file_id"`
	FilePath        *string `json:"file_path"`
	Resolution      string  `json:"resolution"`
}

type GetMemoryContextOutputMemoriesItemConflictsWithItemWaitingMessage struct {
	Kind       string `json:"kind"`
	Text       string `json:"text"`
	SentAt     string `json:"sent_at"`
	SourceID   string `json:"source_id"`
	ExternalID string `json:"external_id"`
	Author     string `json:"author"`
	AuthorKind string `json:"author_kind"`
}

type GetMemoryContextOutputMemoriesItemConflictsWithItem struct {
	Memory         *GetMemoryContextOutputMemoriesItemConflictsWithItemMemory
	File           *GetMemoryContextOutputMemoriesItemConflictsWithItemFile
	WaitingMessage *GetMemoryContextOutputMemoriesItemConflictsWithItemWaitingMessage
}

var getMemoryContextOutputMemoriesItemConflictsWithItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "id", "text", "trust_level", "held_from", "sources"}, properties: []string{"kind", "id", "text", "trust_level", "held_from", "sources"}, constants: map[string]any{"kind": "memory"}},
	{kind: unionObject, required: []string{"kind", "text", "recorded_at", "knowledge_base_id", "file_id", "file_path", "resolution"}, properties: []string{"kind", "text", "recorded_at", "knowledge_base_id", "file_id", "file_path", "resolution"}, constants: map[string]any{"kind": "file"}},
	{kind: unionObject, required: []string{"kind", "text", "sent_at", "source_id", "external_id", "author", "author_kind"}, properties: []string{"kind", "text", "sent_at", "source_id", "external_id", "author", "author_kind"}, constants: map[string]any{"kind": "waiting_message"}},
}

func (union GetMemoryContextOutputMemoriesItemConflictsWithItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetMemoryContextOutputMemoriesItemConflictsWithItem")
}

func (union *GetMemoryContextOutputMemoriesItemConflictsWithItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getMemoryContextOutputMemoriesItemConflictsWithItemMembers, "GetMemoryContextOutputMemoriesItemConflictsWithItem")
}

type GetMemoryContextOutputMemoriesItem struct {
	ID                 string                                                    `json:"id"`
	MemoryID           string                                                    `json:"memory_id"`
	Type               string                                                    `json:"type"`
	Scope              string                                                    `json:"scope"`
	OwnerID            *string                                                   `json:"owner_id"`
	Personal           bool                                                      `json:"personal"`
	Subject            string                                                    `json:"subject"`
	SubjectOwnerID     *string                                                   `json:"subject_owner_id"`
	Text               string                                                    `json:"text"`
	Values             map[string]*GetMemoryContextOutputMemoriesItemValuesValue `json:"values"`
	Plan               *GetMemoryContextOutputMemoriesItemPlan                   `json:"plan"`
	TrustLevel         string                                                    `json:"trust_level"`
	TrustReasons       []string                                                  `json:"trust_reasons"`
	AgentMay           string                                                    `json:"agent_may"`
	Sources            []GetMemoryContextOutputMemoriesItemSourcesItem           `json:"sources"`
	Holds              GetMemoryContextOutputMemoriesItemHolds                   `json:"holds"`
	Replaces           []GetMemoryContextOutputMemoriesItemReplacesItem          `json:"replaces"`
	ReplacedBy         *GetMemoryContextOutputMemoriesItemReplacedBy             `json:"replaced_by"`
	ConflictsWith      []GetMemoryContextOutputMemoriesItemConflictsWithItem     `json:"conflicts_with"`
	ConnectionStrength float64                                                   `json:"connection_strength"`
	RecallStrength     float64                                                   `json:"recall_strength"`
	LastCheckedAt      *string                                                   `json:"last_checked_at"`
	Check              string                                                    `json:"check"`
	SortedBy           string                                                    `json:"sorted_by"`
	SortingProbability *float64                                                  `json:"sorting_probability"`
}

type GetMemoryContextOutput struct {
	RecallID   *string                              `json:"recall_id"`
	DurationMs float64                              `json:"duration_ms"`
	Memories   []GetMemoryContextOutputMemoriesItem `json:"memories"`
}

type GetMemoryScoresInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
}

type GetMemoryScoresOutputRecall struct {
	Score              float64 `json:"score"`
	MeanReciprocalRank float64 `json:"mean_reciprocal_rank"`
	Depth              float64 `json:"depth"`
	QuestionCount      float64 `json:"question_count"`
	ScoredAt           string  `json:"scored_at"`
}

type GetMemoryScoresOutputJudgement struct {
	Score         float64 `json:"score"`
	RightCount    float64 `json:"right_count"`
	DecisionCount float64 `json:"decision_count"`
	ScoredAt      string  `json:"scored_at"`
}

type GetMemoryScoresOutputLabelledDecisions struct {
	TuningCount   float64 `json:"tuning_count"`
	HeldBackCount float64 `json:"held_back_count"`
}

type GetMemoryScoresOutputTuning struct {
	State                        string   `json:"state"`
	LabelledDecisionsSinceTuning float64  `json:"labelled_decisions_since_tuning"`
	LabelledDecisionsPerTuning   float64  `json:"labelled_decisions_per_tuning"`
	SavedQuestionsChanged        bool     `json:"saved_questions_changed"`
	MemoryChangesSinceScoring    *float64 `json:"memory_changes_since_scoring"`
	StartedAt                    *string  `json:"started_at"`
	TunedAt                      *string  `json:"tuned_at"`
}

type GetMemoryScoresOutput struct {
	Recall               *GetMemoryScoresOutputRecall           `json:"recall"`
	Judgement            *GetMemoryScoresOutputJudgement        `json:"judgement"`
	LabelledDecisions    GetMemoryScoresOutputLabelledDecisions `json:"labelled_decisions"`
	FlaggedQuestionCount float64                                `json:"flagged_question_count"`
	Scoring              bool                                   `json:"scoring"`
	Tuning               GetMemoryScoresOutputTuning            `json:"tuning"`
}

type GetMemorySourceInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
	SourceID  string `json:"source_id"`
}

type GetMemorySourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type GetMemorySourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GetMemorySourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type GetMemorySourceOutput struct {
	ID              string                          `json:"id"`
	ProjectID       string                          `json:"project_id"`
	KnowledgeBaseID *string                         `json:"knowledge_base_id"`
	MemoryID        *string                         `json:"memory_id"`
	Name            string                          `json:"name"`
	Kind            string                          `json:"kind"`
	Sorting         *string                         `json:"sorting"`
	Status          string                          `json:"status"`
	Settings        map[string]any                  `json:"settings"`
	CredentialNames []string                        `json:"credential_names"`
	WebhookURL      *string                         `json:"webhook_url"`
	SignIn          *GetMemorySourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                          `json:"created_at"`
	CreatedBy       GetMemorySourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                         `json:"last_synced_at"`
	NextSyncAt      *string                         `json:"next_sync_at"`
	LastError       *GetMemorySourceOutputLastError `json:"last_error"`
}

type GetMemoryWebhookInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
}

type GetMemoryWebhookOutput struct {
	URL       string `json:"url"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type GetMessageInput struct {
	ProjectID  string  `json:"project_id"`
	MemoryID   string  `json:"memory_id"`
	SourceID   string  `json:"source_id"`
	ExternalID string  `json:"external_id"`
	Version    *string `json:"version,omitzero"`
}

type GetMessageOutputTurnsItem struct {
	Author     string  `json:"author"`
	AuthorKind *string `json:"author_kind"`
	Text       string  `json:"text"`
	SentAt     *string `json:"sent_at"`
}

type GetMessageOutputMemoriesItem struct {
	ID         string  `json:"id"`
	Type       string  `json:"type"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	ReplacedBy *string `json:"replaced_by"`
}

type GetMessageOutput struct {
	SourceID        string                         `json:"source_id"`
	ExternalID      string                         `json:"external_id"`
	Version         float64                        `json:"version"`
	ConversationID  string                         `json:"conversation_id"`
	TextStart       string                         `json:"text_start"`
	State           string                         `json:"state"`
	Attempts        float64                        `json:"attempts"`
	MemoriesWritten float64                        `json:"memories_written"`
	FailureCode     *string                        `json:"failure_code"`
	ReceivedAt      string                         `json:"received_at"`
	FinishedAt      *string                        `json:"finished_at"`
	Kind            string                         `json:"kind"`
	Title           *string                        `json:"title"`
	Turns           []GetMessageOutputTurnsItem    `json:"turns"`
	EndUserID       *string                        `json:"end_user_id"`
	TeamID          *string                        `json:"team_id"`
	Private         bool                           `json:"private"`
	Memories        []GetMessageOutputMemoriesItem `json:"memories"`
	MemoryCount     float64                        `json:"memory_count"`
}

type GetProjectInput struct {
	ProjectID string `json:"project_id"`
}

type GetProjectOutput struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Region      string  `json:"region"`
	Role        *string `json:"role"`
	CreatedAt   string  `json:"created_at"`
	DeletedAt   *string `json:"deleted_at"`
	PurgeAfter  *string `json:"purge_after"`
	SirannonURL string  `json:"sirannon_url"`
	NarsilURL   string  `json:"narsil_url"`
}

type GetQuestionSetInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type GetQuestionSetOutputFlagged struct {
	Waiting      float64 `json:"waiting"`
	Saved        float64 `json:"saved"`
	Unsure       float64 `json:"unsure"`
	Unanswerable float64 `json:"unanswerable"`
}

type GetQuestionSetOutputSettingsBoost struct {
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type GetQuestionSetOutputSettingsFusionRrf struct {
	Strategy     string  `json:"strategy"`
	RankConstant float64 `json:"rank_constant"`
}

type GetQuestionSetOutputSettingsFusionLinear struct {
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type GetQuestionSetOutputSettingsFusion struct {
	Rrf    *GetQuestionSetOutputSettingsFusionRrf
	Linear *GetQuestionSetOutputSettingsFusionLinear
}

var getQuestionSetOutputSettingsFusionMembers = []unionMember{
	{kind: unionObject, required: []string{"strategy", "rank_constant"}, properties: []string{"strategy", "rank_constant"}, constants: map[string]any{"strategy": "rrf"}},
	{kind: unionObject, required: []string{"strategy", "vector_weight"}, properties: []string{"strategy", "vector_weight"}, constants: map[string]any{"strategy": "linear"}},
}

func (union GetQuestionSetOutputSettingsFusion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetQuestionSetOutputSettingsFusion")
}

func (union *GetQuestionSetOutputSettingsFusion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getQuestionSetOutputSettingsFusionMembers, "GetQuestionSetOutputSettingsFusion")
}

type GetQuestionSetOutputSettingsBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type GetQuestionSetOutputSettingsStopWords struct {
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type GetQuestionSetOutputSettingsSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type GetQuestionSetOutputSettingsSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type GetQuestionSetOutputSettingsSynonymsItem struct {
	Option1 *GetQuestionSetOutputSettingsSynonymsItemOption1
	Option2 *GetQuestionSetOutputSettingsSynonymsItemOption2
}

var getQuestionSetOutputSettingsSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union GetQuestionSetOutputSettingsSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetQuestionSetOutputSettingsSynonymsItem")
}

func (union *GetQuestionSetOutputSettingsSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getQuestionSetOutputSettingsSynonymsItemMembers, "GetQuestionSetOutputSettingsSynonymsItem")
}

type GetQuestionSetOutputSettings struct {
	Boost       GetQuestionSetOutputSettingsBoost          `json:"boost"`
	Fusion      GetQuestionSetOutputSettingsFusion         `json:"fusion"`
	Bm25        GetQuestionSetOutputSettingsBm25           `json:"bm25"`
	StopWords   GetQuestionSetOutputSettingsStopWords      `json:"stop_words"`
	Synonyms    []GetQuestionSetOutputSettingsSynonymsItem `json:"synonyms"`
	Language    string                                     `json:"language"`
	ChunkTokens float64                                    `json:"chunk_tokens"`
}

type GetQuestionSetOutputLatestScorecardTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetQuestionSetOutputLatestScorecardHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsBoost struct {
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionRrf struct {
	Strategy     string  `json:"strategy"`
	RankConstant float64 `json:"rank_constant"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionLinear struct {
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsFusion struct {
	Rrf    *GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionRrf
	Linear *GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionLinear
}

var getQuestionSetOutputLatestScorecardConfigurationSettingsFusionMembers = []unionMember{
	{kind: unionObject, required: []string{"strategy", "rank_constant"}, properties: []string{"strategy", "rank_constant"}, constants: map[string]any{"strategy": "rrf"}},
	{kind: unionObject, required: []string{"strategy", "vector_weight"}, properties: []string{"strategy", "vector_weight"}, constants: map[string]any{"strategy": "linear"}},
}

func (union GetQuestionSetOutputLatestScorecardConfigurationSettingsFusion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetQuestionSetOutputLatestScorecardConfigurationSettingsFusion")
}

func (union *GetQuestionSetOutputLatestScorecardConfigurationSettingsFusion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getQuestionSetOutputLatestScorecardConfigurationSettingsFusionMembers, "GetQuestionSetOutputLatestScorecardConfigurationSettingsFusion")
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsStopWords struct {
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItem struct {
	Option1 *GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption1
	Option2 *GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption2
}

var getQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItem")
}

func (union *GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemMembers, "GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItem")
}

type GetQuestionSetOutputLatestScorecardConfigurationSettings struct {
	Boost       GetQuestionSetOutputLatestScorecardConfigurationSettingsBoost          `json:"boost"`
	Fusion      GetQuestionSetOutputLatestScorecardConfigurationSettingsFusion         `json:"fusion"`
	Bm25        GetQuestionSetOutputLatestScorecardConfigurationSettingsBm25           `json:"bm25"`
	StopWords   GetQuestionSetOutputLatestScorecardConfigurationSettingsStopWords      `json:"stop_words"`
	Synonyms    []GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItem `json:"synonyms"`
	Language    string                                                                 `json:"language"`
	ChunkTokens float64                                                                `json:"chunk_tokens"`
}

type GetQuestionSetOutputLatestScorecardConfiguration struct {
	LiveIndexID string                                                   `json:"live_index_id"`
	Settings    GetQuestionSetOutputLatestScorecardConfigurationSettings `json:"settings"`
}

type GetQuestionSetOutputLatestScorecard struct {
	ID                 string                                            `json:"id"`
	Purpose            string                                            `json:"purpose"`
	Status             string                                            `json:"status"`
	WaitingForSearch   bool                                              `json:"waiting_for_search"`
	PassID             *string                                           `json:"pass_id"`
	Depth              float64                                           `json:"depth"`
	Score              *float64                                          `json:"score"`
	QuestionCount      *float64                                          `json:"question_count"`
	PassedCount        *float64                                          `json:"passed_count"`
	FirstCount         *float64                                          `json:"first_count"`
	MeanReciprocalRank *float64                                          `json:"mean_reciprocal_rank"`
	Tuning             *GetQuestionSetOutputLatestScorecardTuning        `json:"tuning"`
	HeldBack           *GetQuestionSetOutputLatestScorecardHeldBack      `json:"held_back"`
	Configuration      *GetQuestionSetOutputLatestScorecardConfiguration `json:"configuration"`
	FailureMessage     *string                                           `json:"failure_message"`
	RequestedAt        string                                            `json:"requested_at"`
	StartedAt          *string                                           `json:"started_at"`
	FinishedAt         *string                                           `json:"finished_at"`
}

type GetQuestionSetOutputOpenPass struct {
	ID                string   `json:"id"`
	Trigger           string   `json:"trigger"`
	Mode              string   `json:"mode"`
	Status            string   `json:"status"`
	CompleteIndex     bool     `json:"complete_index"`
	BeforeScorecardID *string  `json:"before_scorecard_id"`
	AfterScorecardID  *string  `json:"after_scorecard_id"`
	CorrectionIDs     []string `json:"correction_ids"`
	FailureMessage    *string  `json:"failure_message"`
	RequestedAt       string   `json:"requested_at"`
	StartedAt         *string  `json:"started_at"`
	FinishedAt        *string  `json:"finished_at"`
}

type GetQuestionSetOutputLatestPass struct {
	ID                string   `json:"id"`
	Trigger           string   `json:"trigger"`
	Mode              string   `json:"mode"`
	Status            string   `json:"status"`
	CompleteIndex     bool     `json:"complete_index"`
	BeforeScorecardID *string  `json:"before_scorecard_id"`
	AfterScorecardID  *string  `json:"after_scorecard_id"`
	CorrectionIDs     []string `json:"correction_ids"`
	FailureMessage    *string  `json:"failure_message"`
	RequestedAt       string   `json:"requested_at"`
	StartedAt         *string  `json:"started_at"`
	FinishedAt        *string  `json:"finished_at"`
}

type GetQuestionSetOutput struct {
	SavedQuestions       float64                              `json:"saved_questions"`
	Tuning               float64                              `json:"tuning"`
	HeldBack             float64                              `json:"held_back"`
	Broken               float64                              `json:"broken"`
	Unconfirmed          float64                              `json:"unconfirmed"`
	SplitSeed            *string                              `json:"split_seed"`
	HeldBackPercent      float64                              `json:"held_back_percent"`
	AgentDepth           float64                              `json:"agent_depth"`
	AutomaticCorrections bool                                 `json:"automatic_corrections"`
	JudgePassages        float64                              `json:"judge_passages"`
	JudgeThreshold       float64                              `json:"judge_threshold"`
	Flagged              GetQuestionSetOutputFlagged          `json:"flagged"`
	Settings             GetQuestionSetOutputSettings         `json:"settings"`
	LatestScorecard      *GetQuestionSetOutputLatestScorecard `json:"latest_scorecard"`
	OpenPass             *GetQuestionSetOutputOpenPass        `json:"open_pass"`
	LatestPass           *GetQuestionSetOutputLatestPass      `json:"latest_pass"`
}

type GetSavedQuestionInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	SavedQuestionID string `json:"saved_question_id"`
}

type GetSavedQuestionOutputPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type GetSavedQuestionOutputPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type GetSavedQuestionOutputPassageCitationDocument struct {
	Kind      string                                                       `json:"kind"`
	Pages     []float64                                                    `json:"pages"`
	Areas     []GetSavedQuestionOutputPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []GetSavedQuestionOutputPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type GetSavedQuestionOutputPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type GetSavedQuestionOutputPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type GetSavedQuestionOutputPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type GetSavedQuestionOutputPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type GetSavedQuestionOutputPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type GetSavedQuestionOutputPassageCitationImage struct {
	Kind      string                                                    `json:"kind"`
	FileName  string                                                    `json:"file_name"`
	Areas     []GetSavedQuestionOutputPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []GetSavedQuestionOutputPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type GetSavedQuestionOutputPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type GetSavedQuestionOutputPassageCitation struct {
	Document    *GetSavedQuestionOutputPassageCitationDocument
	Spreadsheet *GetSavedQuestionOutputPassageCitationSpreadsheet
	Slides      *GetSavedQuestionOutputPassageCitationSlides
	WebPage     *GetSavedQuestionOutputPassageCitationWebPage
	Image       *GetSavedQuestionOutputPassageCitationImage
	Recording   *GetSavedQuestionOutputPassageCitationRecording
}

var getSavedQuestionOutputPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union GetSavedQuestionOutputPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetSavedQuestionOutputPassageCitation")
}

func (union *GetSavedQuestionOutputPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getSavedQuestionOutputPassageCitationMembers, "GetSavedQuestionOutputPassageCitation")
}

type GetSavedQuestionOutputPassage struct {
	FileID        string                                 `json:"file_id"`
	FilePath      *string                                `json:"file_path"`
	FileKind      *string                                `json:"file_kind"`
	Version       float64                                `json:"version"`
	FirstPosition float64                                `json:"first_position"`
	LastPosition  float64                                `json:"last_position"`
	Heading       *string                                `json:"heading"`
	State         string                                 `json:"state"`
	Citation      *GetSavedQuestionOutputPassageCitation `json:"citation"`
}

type GetSavedQuestionOutputBrokenPrevious struct {
	Version       float64 `json:"version"`
	FirstPosition float64 `json:"first_position"`
	LastPosition  float64 `json:"last_position"`
}

type GetSavedQuestionOutputBroken struct {
	Change     string                                `json:"change"`
	Version    *float64                              `json:"version"`
	DetectedAt string                                `json:"detected_at"`
	Previous   *GetSavedQuestionOutputBrokenPrevious `json:"previous"`
}

type GetSavedQuestionOutput struct {
	ID            string                        `json:"id"`
	Question      string                        `json:"question"`
	Split         string                        `json:"split"`
	Source        string                        `json:"source"`
	QuestionLogID *string                       `json:"question_log_id"`
	EndUserID     *string                       `json:"end_user_id"`
	Passage       GetSavedQuestionOutputPassage `json:"passage"`
	Broken        *GetSavedQuestionOutputBroken `json:"broken"`
	CreatedAt     string                        `json:"created_at"`
	UpdatedAt     string                        `json:"updated_at"`
}

type GetScorecardInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	ScorecardID     string `json:"scorecard_id"`
}

type GetScorecardOutputTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetScorecardOutputHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type GetScorecardOutputConfigurationSettingsBoost struct {
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type GetScorecardOutputConfigurationSettingsFusionRrf struct {
	Strategy     string  `json:"strategy"`
	RankConstant float64 `json:"rank_constant"`
}

type GetScorecardOutputConfigurationSettingsFusionLinear struct {
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type GetScorecardOutputConfigurationSettingsFusion struct {
	Rrf    *GetScorecardOutputConfigurationSettingsFusionRrf
	Linear *GetScorecardOutputConfigurationSettingsFusionLinear
}

var getScorecardOutputConfigurationSettingsFusionMembers = []unionMember{
	{kind: unionObject, required: []string{"strategy", "rank_constant"}, properties: []string{"strategy", "rank_constant"}, constants: map[string]any{"strategy": "rrf"}},
	{kind: unionObject, required: []string{"strategy", "vector_weight"}, properties: []string{"strategy", "vector_weight"}, constants: map[string]any{"strategy": "linear"}},
}

func (union GetScorecardOutputConfigurationSettingsFusion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetScorecardOutputConfigurationSettingsFusion")
}

func (union *GetScorecardOutputConfigurationSettingsFusion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getScorecardOutputConfigurationSettingsFusionMembers, "GetScorecardOutputConfigurationSettingsFusion")
}

type GetScorecardOutputConfigurationSettingsBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type GetScorecardOutputConfigurationSettingsStopWords struct {
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type GetScorecardOutputConfigurationSettingsSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type GetScorecardOutputConfigurationSettingsSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type GetScorecardOutputConfigurationSettingsSynonymsItem struct {
	Option1 *GetScorecardOutputConfigurationSettingsSynonymsItemOption1
	Option2 *GetScorecardOutputConfigurationSettingsSynonymsItemOption2
}

var getScorecardOutputConfigurationSettingsSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union GetScorecardOutputConfigurationSettingsSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetScorecardOutputConfigurationSettingsSynonymsItem")
}

func (union *GetScorecardOutputConfigurationSettingsSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getScorecardOutputConfigurationSettingsSynonymsItemMembers, "GetScorecardOutputConfigurationSettingsSynonymsItem")
}

type GetScorecardOutputConfigurationSettings struct {
	Boost       GetScorecardOutputConfigurationSettingsBoost          `json:"boost"`
	Fusion      GetScorecardOutputConfigurationSettingsFusion         `json:"fusion"`
	Bm25        GetScorecardOutputConfigurationSettingsBm25           `json:"bm25"`
	StopWords   GetScorecardOutputConfigurationSettingsStopWords      `json:"stop_words"`
	Synonyms    []GetScorecardOutputConfigurationSettingsSynonymsItem `json:"synonyms"`
	Language    string                                                `json:"language"`
	ChunkTokens float64                                               `json:"chunk_tokens"`
}

type GetScorecardOutputConfiguration struct {
	LiveIndexID string                                  `json:"live_index_id"`
	Settings    GetScorecardOutputConfigurationSettings `json:"settings"`
}

type GetScorecardOutput struct {
	ID                 string                           `json:"id"`
	Purpose            string                           `json:"purpose"`
	Status             string                           `json:"status"`
	WaitingForSearch   bool                             `json:"waiting_for_search"`
	PassID             *string                          `json:"pass_id"`
	Depth              float64                          `json:"depth"`
	Score              *float64                         `json:"score"`
	QuestionCount      *float64                         `json:"question_count"`
	PassedCount        *float64                         `json:"passed_count"`
	FirstCount         *float64                         `json:"first_count"`
	MeanReciprocalRank *float64                         `json:"mean_reciprocal_rank"`
	Tuning             *GetScorecardOutputTuning        `json:"tuning"`
	HeldBack           *GetScorecardOutputHeldBack      `json:"held_back"`
	Configuration      *GetScorecardOutputConfiguration `json:"configuration"`
	FailureMessage     *string                          `json:"failure_message"`
	RequestedAt        string                           `json:"requested_at"`
	StartedAt          *string                          `json:"started_at"`
	FinishedAt         *string                          `json:"finished_at"`
}

type GetSessionInput struct{}

type GetSessionOutputAccount struct {
	ID         string  `json:"id"`
	Email      string  `json:"email"`
	Name       string  `json:"name"`
	Status     string  `json:"status"`
	CreatedAt  string  `json:"created_at"`
	DecidedAt  *string `json:"decided_at"`
	IsOperator bool    `json:"is_operator"`
}

type GetSessionOutput struct {
	Account             GetSessionOutputAccount `json:"account"`
	SecondFactorEnabled bool                    `json:"second_factor_enabled"`
	ExpiresAt           string                  `json:"expires_at"`
}

type GetSourceInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	SourceID        string `json:"source_id"`
}

type GetSourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type GetSourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type GetSourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type GetSourceOutput struct {
	ID              string                    `json:"id"`
	ProjectID       string                    `json:"project_id"`
	KnowledgeBaseID *string                   `json:"knowledge_base_id"`
	MemoryID        *string                   `json:"memory_id"`
	Name            string                    `json:"name"`
	Kind            string                    `json:"kind"`
	Sorting         *string                   `json:"sorting"`
	Status          string                    `json:"status"`
	Settings        map[string]any            `json:"settings"`
	CredentialNames []string                  `json:"credential_names"`
	WebhookURL      *string                   `json:"webhook_url"`
	SignIn          *GetSourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                    `json:"created_at"`
	CreatedBy       GetSourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                   `json:"last_synced_at"`
	NextSyncAt      *string                   `json:"next_sync_at"`
	LastError       *GetSourceOutputLastError `json:"last_error"`
}

type GetTableRowInputKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type GetTableRowInputKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type GetTableRowInputKeyItem struct {
	Number  *float64
	String  *string
	Integer *GetTableRowInputKeyItemInteger
	Blob    *GetTableRowInputKeyItemBlob
}

var getTableRowInputKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union GetTableRowInputKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetTableRowInputKeyItem")
}

func (union *GetTableRowInputKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getTableRowInputKeyItemMembers, "GetTableRowInputKeyItem")
}

type GetTableRowInput struct {
	ProjectID  string                              `json:"project_id"`
	DatabaseID string                              `json:"database_id"`
	TableName  string                              `json:"table_name"`
	Key        []Nullable[GetTableRowInputKeyItem] `json:"key"`
}

type GetTableRowOutputRowKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type GetTableRowOutputRowKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type GetTableRowOutputRowKeyItem struct {
	Number  *float64
	String  *string
	Integer *GetTableRowOutputRowKeyItemInteger
	Blob    *GetTableRowOutputRowKeyItemBlob
}

var getTableRowOutputRowKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union GetTableRowOutputRowKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetTableRowOutputRowKeyItem")
}

func (union *GetTableRowOutputRowKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getTableRowOutputRowKeyItemMembers, "GetTableRowOutputRowKeyItem")
}

type GetTableRowOutputRowCellsItemObject struct {
	Type      string  `json:"type"`
	Text      string  `json:"text"`
	Size      float64 `json:"size"`
	Truncated bool    `json:"truncated"`
}

type GetTableRowOutputRowCellsItem struct {
	Number *float64
	String *string
	Object *GetTableRowOutputRowCellsItemObject
}

var getTableRowOutputRowCellsItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text", "size", "truncated"}, properties: []string{"type", "text", "size", "truncated"}},
}

func (union GetTableRowOutputRowCellsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "GetTableRowOutputRowCellsItem")
}

func (union *GetTableRowOutputRowCellsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, getTableRowOutputRowCellsItemMembers, "GetTableRowOutputRowCellsItem")
}

type GetTableRowOutputRow struct {
	Key   []*GetTableRowOutputRowKeyItem   `json:"key"`
	Cells []*GetTableRowOutputRowCellsItem `json:"cells"`
}

type GetTableRowOutput struct {
	Row GetTableRowOutputRow `json:"row"`
}

type GetUploadInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	UploadID        string `json:"upload_id"`
}

type GetUploadOutputFileFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetUploadOutputFileUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetUploadOutputFileUnreadPartsItem struct {
	FirstPage   *float64                                  `json:"first_page"`
	LastPage    *float64                                  `json:"last_page"`
	StartSecond *float64                                  `json:"start_second"`
	EndSecond   *float64                                  `json:"end_second"`
	Failure     GetUploadOutputFileUnreadPartsItemFailure `json:"failure"`
}

type GetUploadOutputFile struct {
	ID              string                               `json:"id"`
	KnowledgeBaseID string                               `json:"knowledge_base_id"`
	Path            string                               `json:"path"`
	Kind            string                               `json:"kind"`
	Address         *string                              `json:"address"`
	Status          string                               `json:"status"`
	CurrentVersion  *float64                             `json:"current_version"`
	LatestVersion   float64                              `json:"latest_version"`
	SizeBytes       float64                              `json:"size_bytes"`
	ContentSHA256   string                               `json:"content_sha256"`
	Failure         *GetUploadOutputFileFailure          `json:"failure"`
	UnreadParts     []GetUploadOutputFileUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                    `json:"metadata"`
	CreatedAt       string                               `json:"created_at"`
	UpdatedAt       string                               `json:"updated_at"`
	DeletedAt       *string                              `json:"deleted_at"`
	PurgeAfter      *string                              `json:"purge_after"`
}

type GetUploadOutputFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type GetUploadOutput struct {
	ID              string                  `json:"id"`
	KnowledgeBaseID string                  `json:"knowledge_base_id"`
	Path            string                  `json:"path"`
	Address         *string                 `json:"address"`
	SizeBytes       float64                 `json:"size_bytes"`
	ContentSHA256   string                  `json:"content_sha256"`
	Method          string                  `json:"method"`
	PartBytes       float64                 `json:"part_bytes"`
	PartCount       float64                 `json:"part_count"`
	State           string                  `json:"state"`
	Outcome         *string                 `json:"outcome"`
	File            *GetUploadOutputFile    `json:"file"`
	Failure         *GetUploadOutputFailure `json:"failure"`
	CreatedAt       string                  `json:"created_at"`
	DeadlineAt      string                  `json:"deadline_at"`
}

type ImportAnswerLogInput struct {
	ProjectID       string      `json:"project_id"`
	KnowledgeBaseID string      `json:"knowledge_base_id"`
	Content         FileContent `json:"-"`
}

type ImportAnswerLogOutputRefusedItem struct {
	Line       float64 `json:"line"`
	QuestionID *string `json:"question_id"`
	Reason     string  `json:"reason"`
}

type ImportAnswerLogOutput struct {
	RecordedCount float64                            `json:"recorded_count"`
	Refused       []ImportAnswerLogOutputRefusedItem `json:"refused"`
}

type ImportIndexRecordsInput struct {
	ProjectID string      `json:"project_id"`
	IndexID   string      `json:"index_id"`
	Format    string      `json:"format"`
	Content   FileContent `json:"-"`
}

type ImportIndexRecordsOutputFailuresItem struct {
	Position float64  `json:"position"`
	Line     *float64 `json:"line"`
	RecordID *string  `json:"record_id"`
	Reason   string   `json:"reason"`
}

type ImportIndexRecordsOutput struct {
	Received          float64                                `json:"received"`
	Added             float64                                `json:"added"`
	Replaced          float64                                `json:"replaced"`
	FailedCount       float64                                `json:"failed_count"`
	Failures          []ImportIndexRecordsOutputFailuresItem `json:"failures"`
	FailuresTruncated bool                                   `json:"failures_truncated"`
}

type ImportSavedQuestionsInput struct {
	ProjectID       string      `json:"project_id"`
	KnowledgeBaseID string      `json:"knowledge_base_id"`
	Format          *string     `json:"format,omitzero"`
	Content         FileContent `json:"-"`
}

type ImportSavedQuestionsOutputRefusedItem struct {
	Line   float64 `json:"line"`
	Reason string  `json:"reason"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument struct {
	Kind      string                                                                             `json:"kind"`
	Pages     []float64                                                                          `json:"pages"`
	Areas     []ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImage struct {
	Kind      string                                                                          `json:"kind"`
	FileName  string                                                                          `json:"file_name"`
	Areas     []ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassageCitation struct {
	Document    *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument
	Spreadsheet *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet
	Slides      *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides
	WebPage     *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage
	Image       *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImage
	Recording   *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording
}

var importSavedQuestionsOutputSavedQuestionsItemPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union ImportSavedQuestionsOutputSavedQuestionsItemPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitation")
}

func (union *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, importSavedQuestionsOutputSavedQuestionsItemPassageCitationMembers, "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitation")
}

type ImportSavedQuestionsOutputSavedQuestionsItemPassage struct {
	FileID        string                                                       `json:"file_id"`
	FilePath      *string                                                      `json:"file_path"`
	FileKind      *string                                                      `json:"file_kind"`
	Version       float64                                                      `json:"version"`
	FirstPosition float64                                                      `json:"first_position"`
	LastPosition  float64                                                      `json:"last_position"`
	Heading       *string                                                      `json:"heading"`
	State         string                                                       `json:"state"`
	Citation      *ImportSavedQuestionsOutputSavedQuestionsItemPassageCitation `json:"citation"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemBrokenPrevious struct {
	Version       float64 `json:"version"`
	FirstPosition float64 `json:"first_position"`
	LastPosition  float64 `json:"last_position"`
}

type ImportSavedQuestionsOutputSavedQuestionsItemBroken struct {
	Change     string                                                      `json:"change"`
	Version    *float64                                                    `json:"version"`
	DetectedAt string                                                      `json:"detected_at"`
	Previous   *ImportSavedQuestionsOutputSavedQuestionsItemBrokenPrevious `json:"previous"`
}

type ImportSavedQuestionsOutputSavedQuestionsItem struct {
	ID            string                                              `json:"id"`
	Question      string                                              `json:"question"`
	Split         string                                              `json:"split"`
	Source        string                                              `json:"source"`
	QuestionLogID *string                                             `json:"question_log_id"`
	EndUserID     *string                                             `json:"end_user_id"`
	Passage       ImportSavedQuestionsOutputSavedQuestionsItemPassage `json:"passage"`
	Broken        *ImportSavedQuestionsOutputSavedQuestionsItemBroken `json:"broken"`
	CreatedAt     string                                              `json:"created_at"`
	UpdatedAt     string                                              `json:"updated_at"`
}

type ImportSavedQuestionsOutput struct {
	Added          float64                                        `json:"added"`
	RefusedCount   float64                                        `json:"refused_count"`
	Refused        []ImportSavedQuestionsOutputRefusedItem        `json:"refused"`
	SavedQuestions []ImportSavedQuestionsOutputSavedQuestionsItem `json:"saved_questions"`
}

type IngestItemsInputItemsItemConversationTurnsItem struct {
	Speaker     string   `json:"speaker"`
	SpeakerKind *string  `json:"speaker_kind,omitzero"`
	Text        string   `json:"text"`
	At          *string  `json:"at,omitzero"`
	StartSecond *float64 `json:"start_second,omitzero"`
	EndSecond   *float64 `json:"end_second,omitzero"`
}

type IngestItemsInputItemsItemConversation struct {
	Kind       string                                           `json:"kind"`
	ExternalID string                                           `json:"external_id"`
	Version    int64                                            `json:"version"`
	Title      *string                                          `json:"title,omitzero"`
	Address    *string                                          `json:"address,omitzero"`
	OccurredAt *string                                          `json:"occurred_at,omitzero"`
	EndUserID  *string                                          `json:"end_user_id,omitzero"`
	TeamID     *string                                          `json:"team_id,omitzero"`
	Private    *bool                                            `json:"private,omitzero"`
	Turns      []IngestItemsInputItemsItemConversationTurnsItem `json:"turns"`
}

type IngestItemsInputItemsItemMessage struct {
	Kind              string  `json:"kind"`
	ExternalID        string  `json:"external_id"`
	Version           int64   `json:"version"`
	ConversationID    string  `json:"conversation_id"`
	ConversationTitle *string `json:"conversation_title,omitzero"`
	Address           *string `json:"address,omitzero"`
	Author            string  `json:"author"`
	AuthorKind        *string `json:"author_kind,omitzero"`
	Text              string  `json:"text"`
	SentAt            string  `json:"sent_at"`
	ReplyTo           *string `json:"reply_to,omitzero"`
	Reactions         *int64  `json:"reactions,omitzero"`
	EndUserID         *string `json:"end_user_id,omitzero"`
	TeamID            *string `json:"team_id,omitzero"`
	Private           *bool   `json:"private,omitzero"`
}

type IngestItemsInputItemsItemRecordFieldsValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var ingestItemsInputItemsItemRecordFieldsValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union IngestItemsInputItemsItemRecordFieldsValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "IngestItemsInputItemsItemRecordFieldsValue")
}

func (union *IngestItemsInputItemsItemRecordFieldsValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, ingestItemsInputItemsItemRecordFieldsValueMembers, "IngestItemsInputItemsItemRecordFieldsValue")
}

type IngestItemsInputItemsItemRecord struct {
	Kind       string                                                          `json:"kind"`
	ExternalID string                                                          `json:"external_id"`
	Version    int64                                                           `json:"version"`
	Title      *string                                                         `json:"title,omitzero"`
	Address    *string                                                         `json:"address,omitzero"`
	EndUserID  *string                                                         `json:"end_user_id,omitzero"`
	Fields     map[string]Nullable[IngestItemsInputItemsItemRecordFieldsValue] `json:"fields"`
}

type IngestItemsInputItemsItemDeletion struct {
	Kind       string `json:"kind"`
	ExternalID string `json:"external_id"`
	Version    int64  `json:"version"`
}

type IngestItemsInputItemsItem struct {
	Conversation *IngestItemsInputItemsItemConversation
	Message      *IngestItemsInputItemsItemMessage
	Record       *IngestItemsInputItemsItemRecord
	Deletion     *IngestItemsInputItemsItemDeletion
}

var ingestItemsInputItemsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "external_id", "version", "turns"}, properties: []string{"kind", "external_id", "version", "title", "address", "occurred_at", "end_user_id", "team_id", "private", "turns"}, constants: map[string]any{"kind": "conversation"}},
	{kind: unionObject, required: []string{"kind", "external_id", "version", "conversation_id", "author", "text", "sent_at"}, properties: []string{"kind", "external_id", "version", "conversation_id", "conversation_title", "address", "author", "author_kind", "text", "sent_at", "reply_to", "reactions", "end_user_id", "team_id", "private"}, constants: map[string]any{"kind": "message"}},
	{kind: unionObject, required: []string{"kind", "external_id", "version", "fields"}, properties: []string{"kind", "external_id", "version", "title", "address", "end_user_id", "fields"}, constants: map[string]any{"kind": "record"}},
	{kind: unionObject, required: []string{"kind", "external_id", "version"}, properties: []string{"kind", "external_id", "version"}, constants: map[string]any{"kind": "deletion"}},
}

func (union IngestItemsInputItemsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "IngestItemsInputItemsItem")
}

func (union *IngestItemsInputItemsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, ingestItemsInputItemsItemMembers, "IngestItemsInputItemsItem")
}

type IngestItemsInput struct {
	ProjectID       string                      `json:"project_id"`
	KnowledgeBaseID string                      `json:"knowledge_base_id"`
	SourceID        string                      `json:"source_id"`
	Items           []IngestItemsInputItemsItem `json:"items"`
}

type IngestItemsOutputResultsItem struct {
	ExternalID string  `json:"external_id"`
	Version    float64 `json:"version"`
	Outcome    string  `json:"outcome"`
}

type IngestItemsOutput struct {
	Results []IngestItemsOutputResultsItem `json:"results"`
}

type InsertTableRowInputValuesValueInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type InsertTableRowInputValuesValueBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type InsertTableRowInputValuesValue struct {
	Number  *float64
	String  *string
	Integer *InsertTableRowInputValuesValueInteger
	Blob    *InsertTableRowInputValuesValueBlob
}

var insertTableRowInputValuesValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union InsertTableRowInputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "InsertTableRowInputValuesValue")
}

func (union *InsertTableRowInputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, insertTableRowInputValuesValueMembers, "InsertTableRowInputValuesValue")
}

type InsertTableRowInput struct {
	ProjectID  string                                              `json:"project_id"`
	DatabaseID string                                              `json:"database_id"`
	TableName  string                                              `json:"table_name"`
	Values     map[string]Nullable[InsertTableRowInputValuesValue] `json:"values"`
}

type InsertTableRowOutputRowKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type InsertTableRowOutputRowKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type InsertTableRowOutputRowKeyItem struct {
	Number  *float64
	String  *string
	Integer *InsertTableRowOutputRowKeyItemInteger
	Blob    *InsertTableRowOutputRowKeyItemBlob
}

var insertTableRowOutputRowKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union InsertTableRowOutputRowKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "InsertTableRowOutputRowKeyItem")
}

func (union *InsertTableRowOutputRowKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, insertTableRowOutputRowKeyItemMembers, "InsertTableRowOutputRowKeyItem")
}

type InsertTableRowOutputRowCellsItemObject struct {
	Type      string  `json:"type"`
	Text      string  `json:"text"`
	Size      float64 `json:"size"`
	Truncated bool    `json:"truncated"`
}

type InsertTableRowOutputRowCellsItem struct {
	Number *float64
	String *string
	Object *InsertTableRowOutputRowCellsItemObject
}

var insertTableRowOutputRowCellsItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text", "size", "truncated"}, properties: []string{"type", "text", "size", "truncated"}},
}

func (union InsertTableRowOutputRowCellsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "InsertTableRowOutputRowCellsItem")
}

func (union *InsertTableRowOutputRowCellsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, insertTableRowOutputRowCellsItemMembers, "InsertTableRowOutputRowCellsItem")
}

type InsertTableRowOutputRow struct {
	Key   []*InsertTableRowOutputRowKeyItem   `json:"key"`
	Cells []*InsertTableRowOutputRowCellsItem `json:"cells"`
}

type InsertTableRowOutputReturnedKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type InsertTableRowOutputReturnedKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type InsertTableRowOutputReturnedKeyItem struct {
	Number  *float64
	String  *string
	Integer *InsertTableRowOutputReturnedKeyItemInteger
	Blob    *InsertTableRowOutputReturnedKeyItemBlob
}

var insertTableRowOutputReturnedKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union InsertTableRowOutputReturnedKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "InsertTableRowOutputReturnedKeyItem")
}

func (union *InsertTableRowOutputReturnedKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, insertTableRowOutputReturnedKeyItemMembers, "InsertTableRowOutputReturnedKeyItem")
}

type InsertTableRowOutput struct {
	Row         *InsertTableRowOutputRow               `json:"row"`
	ReturnedKey []*InsertTableRowOutputReturnedKeyItem `json:"returned_key"`
}

type InspectMemoryInput struct {
	ProjectID      string `json:"project_id"`
	MemoryID       string `json:"memory_id"`
	StoredMemoryID string `json:"stored_memory_id"`
}

type InspectMemoryOutputValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var inspectMemoryOutputValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union InspectMemoryOutputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "InspectMemoryOutputValuesValue")
}

func (union *InspectMemoryOutputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, inspectMemoryOutputValuesValueMembers, "InspectMemoryOutputValuesValue")
}

type InspectMemoryOutputPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type InspectMemoryOutputSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type InspectMemoryOutputLinksItemMemory struct {
	ID         string `json:"id"`
	Text       string `json:"text"`
	TrustLevel string `json:"trust_level"`
	Replaced   bool   `json:"replaced"`
}

type InspectMemoryOutputLinksItem struct {
	Relation  string                             `json:"relation"`
	Direction string                             `json:"direction"`
	Memory    InspectMemoryOutputLinksItemMemory `json:"memory"`
}

type InspectMemoryOutputDecisionsItemMemory struct {
	ID         string `json:"id"`
	Text       string `json:"text"`
	TrustLevel string `json:"trust_level"`
	Replaced   bool   `json:"replaced"`
}

type InspectMemoryOutputDecisionsItem struct {
	Step        string                                  `json:"step"`
	DecidedBy   string                                  `json:"decided_by"`
	Choice      string                                  `json:"choice"`
	Probability *float64                                `json:"probability"`
	Memory      *InspectMemoryOutputDecisionsItemMemory `json:"memory"`
	CreatedAt   string                                  `json:"created_at"`
}

type InspectMemoryOutputReviewsItem struct {
	ID                string         `json:"id"`
	MemoryID          string         `json:"memory_id"`
	StoredMemoryID    string         `json:"stored_memory_id"`
	Reason            string         `json:"reason"`
	State             string         `json:"state"`
	Evidence          map[string]any `json:"evidence"`
	SettledTrustLevel *string        `json:"settled_trust_level"`
	SettledBy         *string        `json:"settled_by"`
	CreatedAt         string         `json:"created_at"`
	SettledAt         *string        `json:"settled_at"`
}

type InspectMemoryOutput struct {
	ID                 string                                     `json:"id"`
	MemoryID           string                                     `json:"memory_id"`
	Type               string                                     `json:"type"`
	Scope              string                                     `json:"scope"`
	OwnerID            *string                                    `json:"owner_id"`
	Personal           bool                                       `json:"personal"`
	TrustLevel         string                                     `json:"trust_level"`
	Text               string                                     `json:"text"`
	Subject            string                                     `json:"subject"`
	Values             map[string]*InspectMemoryOutputValuesValue `json:"values"`
	Plan               *InspectMemoryOutputPlan                   `json:"plan"`
	Sensitive          bool                                       `json:"sensitive"`
	InstructionLike    bool                                       `json:"instruction_like"`
	SortedBy           string                                     `json:"sorted_by"`
	ConnectionStrength float64                                    `json:"connection_strength"`
	RecallStrength     float64                                    `json:"recall_strength"`
	Sources            []InspectMemoryOutputSourcesItem           `json:"sources"`
	ReplacedBy         *string                                    `json:"replaced_by"`
	HeldUntil          *string                                    `json:"held_until"`
	ExpiresAt          *string                                    `json:"expires_at"`
	LastCheckedAt      *string                                    `json:"last_checked_at"`
	ForgottenAt        *string                                    `json:"forgotten_at"`
	PurgeAfter         *string                                    `json:"purge_after"`
	OccurredAt         string                                     `json:"occurred_at"`
	CreatedAt          string                                     `json:"created_at"`
	UpdatedAt          string                                     `json:"updated_at"`
	Mentions           []string                                   `json:"mentions"`
	Links              []InspectMemoryOutputLinksItem             `json:"links"`
	Decisions          []InspectMemoryOutputDecisionsItem         `json:"decisions"`
	Reviews            []InspectMemoryOutputReviewsItem           `json:"reviews"`
}

type InviteMemberInput struct {
	ProjectID string  `json:"project_id"`
	Email     string  `json:"email"`
	Role      *string `json:"role,omitzero"`
}

type InviteMemberOutputInvitation struct {
	ID          string  `json:"id"`
	ProjectID   string  `json:"project_id"`
	ProjectName string  `json:"project_name"`
	Email       string  `json:"email"`
	Role        string  `json:"role"`
	CreatedAt   string  `json:"created_at"`
	ExpiresAt   string  `json:"expires_at"`
	AcceptedAt  *string `json:"accepted_at"`
	RevokedAt   *string `json:"revoked_at"`
}

type InviteMemberOutput struct {
	Invitation InviteMemberOutputInvitation `json:"invitation"`
}

type ListAPIKeyPermissionChangesInput struct {
	ProjectID string  `json:"project_id"`
	KeyID     string  `json:"key_id"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeDatabases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeIndexes struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeKnowledgeBases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeMemory struct {
	Level string `json:"level"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsBefore struct {
	Access         string                                                                      `json:"access"`
	Databases      ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeDatabases      `json:"databases"`
	Indexes        ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeIndexes        `json:"indexes"`
	KnowledgeBases ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeKnowledgeBases `json:"knowledge_bases"`
	Memory         ListAPIKeyPermissionChangesOutputChangesItemPermissionsBeforeMemory         `json:"memory"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterDatabases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterIndexes struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterKnowledgeBases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterMemory struct {
	Level string `json:"level"`
}

type ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfter struct {
	Access         string                                                                     `json:"access"`
	Databases      ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterDatabases      `json:"databases"`
	Indexes        ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterIndexes        `json:"indexes"`
	KnowledgeBases ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterKnowledgeBases `json:"knowledge_bases"`
	Memory         ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfterMemory         `json:"memory"`
}

type ListAPIKeyPermissionChangesOutputChangesItem struct {
	ID                string                                                         `json:"id"`
	KeyID             string                                                         `json:"key_id"`
	ChangedBy         string                                                         `json:"changed_by"`
	ChangedByName     string                                                         `json:"changed_by_name"`
	ChangedAt         string                                                         `json:"changed_at"`
	PermissionsBefore *ListAPIKeyPermissionChangesOutputChangesItemPermissionsBefore `json:"permissions_before"`
	PermissionsAfter  ListAPIKeyPermissionChangesOutputChangesItemPermissionsAfter   `json:"permissions_after"`
}

type ListAPIKeyPermissionChangesOutput struct {
	Changes    []ListAPIKeyPermissionChangesOutputChangesItem `json:"changes"`
	TotalCount float64                                        `json:"total_count"`
	Limit      float64                                        `json:"limit"`
	Offset     float64                                        `json:"offset"`
}

type ListAPIKeysInput struct {
	ProjectID   string  `json:"project_id"`
	Status      *string `json:"status,omitzero"`
	CreatedFrom *string `json:"created_from,omitzero"`
	CreatedTo   *string `json:"created_to,omitzero"`
	Search      *string `json:"search,omitzero"`
	Sort        *string `json:"sort,omitzero"`
	Direction   *string `json:"direction,omitzero"`
	Limit       *string `json:"limit,omitzero"`
	Offset      *string `json:"offset,omitzero"`
}

type ListAPIKeysOutputAPIKeysItemPermissionsDatabases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeysOutputAPIKeysItemPermissionsIndexes struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeysOutputAPIKeysItemPermissionsKnowledgeBases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type ListAPIKeysOutputAPIKeysItemPermissionsMemory struct {
	Level string `json:"level"`
}

type ListAPIKeysOutputAPIKeysItemPermissions struct {
	Access         string                                                `json:"access"`
	Databases      ListAPIKeysOutputAPIKeysItemPermissionsDatabases      `json:"databases"`
	Indexes        ListAPIKeysOutputAPIKeysItemPermissionsIndexes        `json:"indexes"`
	KnowledgeBases ListAPIKeysOutputAPIKeysItemPermissionsKnowledgeBases `json:"knowledge_bases"`
	Memory         ListAPIKeysOutputAPIKeysItemPermissionsMemory         `json:"memory"`
}

type ListAPIKeysOutputAPIKeysItem struct {
	ID                       string                                  `json:"id"`
	ProjectID                string                                  `json:"project_id"`
	Name                     string                                  `json:"name"`
	DisplayPrefix            string                                  `json:"display_prefix"`
	Permissions              ListAPIKeysOutputAPIKeysItemPermissions `json:"permissions"`
	PermissionsChangedAt     *string                                 `json:"permissions_changed_at"`
	PermissionsChangedByName *string                                 `json:"permissions_changed_by_name"`
	CreatedBy                string                                  `json:"created_by"`
	CreatedByName            string                                  `json:"created_by_name"`
	CreatedAt                string                                  `json:"created_at"`
	ExpiresAt                *string                                 `json:"expires_at"`
	LastUsedAt               *string                                 `json:"last_used_at"`
	RevokedAt                *string                                 `json:"revoked_at"`
}

type ListAPIKeysOutput struct {
	APIKeys    []ListAPIKeysOutputAPIKeysItem `json:"api_keys"`
	TotalCount float64                        `json:"total_count"`
	Limit      float64                        `json:"limit"`
	Offset     float64                        `json:"offset"`
}

type ListCorrectionPassesInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListCorrectionPassesOutputPassesItem struct {
	ID                string   `json:"id"`
	Trigger           string   `json:"trigger"`
	Mode              string   `json:"mode"`
	Status            string   `json:"status"`
	CompleteIndex     bool     `json:"complete_index"`
	BeforeScorecardID *string  `json:"before_scorecard_id"`
	AfterScorecardID  *string  `json:"after_scorecard_id"`
	CorrectionIDs     []string `json:"correction_ids"`
	FailureMessage    *string  `json:"failure_message"`
	RequestedAt       string   `json:"requested_at"`
	StartedAt         *string  `json:"started_at"`
	FinishedAt        *string  `json:"finished_at"`
}

type ListCorrectionPassesOutput struct {
	Passes     []ListCorrectionPassesOutputPassesItem `json:"passes"`
	TotalCount float64                                `json:"total_count"`
	Limit      float64                                `json:"limit"`
	Offset     float64                                `json:"offset"`
}

type ListCorrectionsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	PassID          *string `json:"pass_id,omitzero"`
	Status          *string `json:"status,omitzero"`
	Kind            *string `json:"kind,omitzero"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListCorrectionsOutputCorrectionsItemSettingFieldBoost struct {
	Kind    string  `json:"kind"`
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type ListCorrectionsOutputCorrectionsItemSettingOption1 struct {
	Kind         string `json:"kind"`
	Strategy     string `json:"strategy"`
	RankConstant int64  `json:"rank_constant"`
}

type ListCorrectionsOutputCorrectionsItemSettingOption2 struct {
	Kind         string  `json:"kind"`
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type ListCorrectionsOutputCorrectionsItemSettingBm25 struct {
	Kind string  `json:"kind"`
	K1   float64 `json:"k1"`
	B    float64 `json:"b"`
}

type ListCorrectionsOutputCorrectionsItemSettingStopWords struct {
	Kind    string   `json:"kind"`
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption2 struct {
	Words []string `json:"words"`
}

type ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItem struct {
	Option1 *ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption1
	Option2 *ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption2
}

var listCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItem")
}

func (union *ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemMembers, "ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItem")
}

type ListCorrectionsOutputCorrectionsItemSettingSynonyms struct {
	Kind  string                                                         `json:"kind"`
	Rules []ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItem `json:"rules"`
}

type ListCorrectionsOutputCorrectionsItemSettingLanguage struct {
	Kind     string `json:"kind"`
	Language string `json:"language"`
}

type ListCorrectionsOutputCorrectionsItemSettingChunking struct {
	Kind        string `json:"kind"`
	ChunkTokens int64  `json:"chunk_tokens"`
}

type ListCorrectionsOutputCorrectionsItemSettingRebuild struct {
	Kind string `json:"kind"`
}

type ListCorrectionsOutputCorrectionsItemSettingAgentDepth struct {
	Kind  string  `json:"kind"`
	Depth float64 `json:"depth"`
}

type ListCorrectionsOutputCorrectionsItemSetting struct {
	FieldBoost *ListCorrectionsOutputCorrectionsItemSettingFieldBoost
	Option1    *ListCorrectionsOutputCorrectionsItemSettingOption1
	Option2    *ListCorrectionsOutputCorrectionsItemSettingOption2
	Bm25       *ListCorrectionsOutputCorrectionsItemSettingBm25
	StopWords  *ListCorrectionsOutputCorrectionsItemSettingStopWords
	Synonyms   *ListCorrectionsOutputCorrectionsItemSettingSynonyms
	Language   *ListCorrectionsOutputCorrectionsItemSettingLanguage
	Chunking   *ListCorrectionsOutputCorrectionsItemSettingChunking
	Rebuild    *ListCorrectionsOutputCorrectionsItemSettingRebuild
	AgentDepth *ListCorrectionsOutputCorrectionsItemSettingAgentDepth
}

var listCorrectionsOutputCorrectionsItemSettingMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "text", "heading"}, properties: []string{"kind", "text", "heading"}, constants: map[string]any{"kind": "field_boost"}},
	{kind: unionObject, required: []string{"kind", "strategy", "rank_constant"}, properties: []string{"kind", "strategy", "rank_constant"}, constants: map[string]any{"kind": "fusion", "strategy": "rrf"}},
	{kind: unionObject, required: []string{"kind", "strategy", "vector_weight"}, properties: []string{"kind", "strategy", "vector_weight"}, constants: map[string]any{"kind": "fusion", "strategy": "linear"}},
	{kind: unionObject, required: []string{"kind", "k1", "b"}, properties: []string{"kind", "k1", "b"}, constants: map[string]any{"kind": "bm25"}},
	{kind: unionObject, required: []string{"kind", "added", "removed"}, properties: []string{"kind", "added", "removed"}, constants: map[string]any{"kind": "stop_words"}},
	{kind: unionObject, required: []string{"kind", "rules"}, properties: []string{"kind", "rules"}, constants: map[string]any{"kind": "synonyms"}},
	{kind: unionObject, required: []string{"kind", "language"}, properties: []string{"kind", "language"}, constants: map[string]any{"kind": "language"}},
	{kind: unionObject, required: []string{"kind", "chunk_tokens"}, properties: []string{"kind", "chunk_tokens"}, constants: map[string]any{"kind": "chunking"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "rebuild"}},
	{kind: unionObject, required: []string{"kind", "depth"}, properties: []string{"kind", "depth"}, constants: map[string]any{"kind": "agent_depth"}},
}

func (union ListCorrectionsOutputCorrectionsItemSetting) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListCorrectionsOutputCorrectionsItemSetting")
}

func (union *ListCorrectionsOutputCorrectionsItemSetting) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listCorrectionsOutputCorrectionsItemSettingMembers, "ListCorrectionsOutputCorrectionsItemSetting")
}

type ListCorrectionsOutputCorrectionsItemEstimate struct {
	Seconds          float64  `json:"seconds"`
	MemoryBytes      float64  `json:"memory_bytes"`
	SecondIndex      bool     `json:"second_index"`
	ChunksToIndex    float64  `json:"chunks_to_index"`
	QuestionsToScore float64  `json:"questions_to_score"`
	PriceUsd         *float64 `json:"price_usd"`
}

type ListCorrectionsOutputCorrectionsItemBeforeTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ListCorrectionsOutputCorrectionsItemBeforeHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ListCorrectionsOutputCorrectionsItemBefore struct {
	ScorecardID *string                                            `json:"scorecard_id"`
	Tuning      ListCorrectionsOutputCorrectionsItemBeforeTuning   `json:"tuning"`
	HeldBack    ListCorrectionsOutputCorrectionsItemBeforeHeldBack `json:"held_back"`
}

type ListCorrectionsOutputCorrectionsItemAfterTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ListCorrectionsOutputCorrectionsItemAfterHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ListCorrectionsOutputCorrectionsItemAfter struct {
	ScorecardID *string                                           `json:"scorecard_id"`
	Tuning      ListCorrectionsOutputCorrectionsItemAfterTuning   `json:"tuning"`
	HeldBack    ListCorrectionsOutputCorrectionsItemAfterHeldBack `json:"held_back"`
}

type ListCorrectionsOutputCorrectionsItemQuestionChanges struct {
	NowPass   float64 `json:"now_pass"`
	NowFail   float64 `json:"now_fail"`
	MovedUp   float64 `json:"moved_up"`
	MovedDown float64 `json:"moved_down"`
}

type ListCorrectionsOutputCorrectionsItem struct {
	ID              string                                               `json:"id"`
	Origin          string                                               `json:"origin"`
	Cause           *string                                              `json:"cause"`
	Kind            string                                               `json:"kind"`
	Setting         ListCorrectionsOutputCorrectionsItemSetting          `json:"setting"`
	TargetIDs       []string                                             `json:"target_ids"`
	FileKinds       []string                                             `json:"file_kinds"`
	Status          string                                               `json:"status"`
	PassID          *string                                              `json:"pass_id"`
	Estimate        ListCorrectionsOutputCorrectionsItemEstimate         `json:"estimate"`
	Before          *ListCorrectionsOutputCorrectionsItemBefore          `json:"before"`
	After           *ListCorrectionsOutputCorrectionsItemAfter           `json:"after"`
	Verdict         string                                               `json:"verdict"`
	QuestionChanges *ListCorrectionsOutputCorrectionsItemQuestionChanges `json:"question_changes"`
	WaitsForClick   bool                                                 `json:"waits_for_click"`
	WaitReason      *string                                              `json:"wait_reason"`
	DecidedBy       *string                                              `json:"decided_by"`
	DecisionNote    *string                                              `json:"decision_note"`
	FailureMessage  *string                                              `json:"failure_message"`
	CreatedAt       string                                               `json:"created_at"`
	TriedAt         *string                                              `json:"tried_at"`
	DecidedAt       *string                                              `json:"decided_at"`
}

type ListCorrectionsOutput struct {
	Corrections []ListCorrectionsOutputCorrectionsItem `json:"corrections"`
	TotalCount  float64                                `json:"total_count"`
	Limit       float64                                `json:"limit"`
	Offset      float64                                `json:"offset"`
}

type ListDatabaseMigrationsInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type ListDatabaseMigrationsOutputMigrationsItem struct {
	Version float64 `json:"version"`
	Name    string  `json:"name"`
	SQL     string  `json:"sql"`
	AddedAt string  `json:"added_at"`
}

type ListDatabaseMigrationsOutput struct {
	Migrations []ListDatabaseMigrationsOutputMigrationsItem `json:"migrations"`
}

type ListDatabaseTablesInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type ListDatabaseTablesOutputTablesItemColumnsItem struct {
	Name               string  `json:"name"`
	DeclaredType       string  `json:"declared_type"`
	NotNull            bool    `json:"not_null"`
	DefaultSQL         *string `json:"default_sql"`
	PrimaryKeyPosition float64 `json:"primary_key_position"`
	Generated          bool    `json:"generated"`
}

type ListDatabaseTablesOutputTablesItemForeignKeysItem struct {
	Columns           []string `json:"columns"`
	ReferencesTable   string   `json:"references_table"`
	ReferencesColumns []string `json:"references_columns"`
	OnDelete          string   `json:"on_delete"`
	OnUpdate          string   `json:"on_update"`
}

type ListDatabaseTablesOutputTablesItemIndexesItem struct {
	Name    string   `json:"name"`
	Unique  bool     `json:"unique"`
	Columns []string `json:"columns"`
}

type ListDatabaseTablesOutputTablesItem struct {
	Name        string                                              `json:"name"`
	Kind        string                                              `json:"kind"`
	SQL         *string                                             `json:"sql"`
	Columns     []ListDatabaseTablesOutputTablesItemColumnsItem     `json:"columns"`
	RowKey      []string                                            `json:"row_key"`
	ForeignKeys []ListDatabaseTablesOutputTablesItemForeignKeysItem `json:"foreign_keys"`
	Indexes     []ListDatabaseTablesOutputTablesItemIndexesItem     `json:"indexes"`
}

type ListDatabaseTablesOutput struct {
	Tables []ListDatabaseTablesOutputTablesItem `json:"tables"`
}

type ListDatabasesInput struct {
	ProjectID   string  `json:"project_id"`
	State       *string `json:"state,omitzero"`
	Creator     *string `json:"creator,omitzero"`
	CreatedFrom *string `json:"created_from,omitzero"`
	CreatedTo   *string `json:"created_to,omitzero"`
	Search      *string `json:"search,omitzero"`
	Sort        *string `json:"sort,omitzero"`
	Direction   *string `json:"direction,omitzero"`
	Limit       *string `json:"limit,omitzero"`
	Offset      *string `json:"offset,omitzero"`
}

type ListDatabasesOutputDatabasesItemCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ListDatabasesOutputDatabasesItemSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type ListDatabasesOutputDatabasesItemCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type ListDatabasesOutputDatabasesItem struct {
	ID               string                                      `json:"id"`
	ProjectID        string                                      `json:"project_id"`
	Name             string                                      `json:"name"`
	CreatedAt        string                                      `json:"created_at"`
	CreatedBy        ListDatabasesOutputDatabasesItemCreatedBy   `json:"created_by"`
	DeletedAt        *string                                     `json:"deleted_at"`
	PurgeAfter       *string                                     `json:"purge_after"`
	MigrationVersion float64                                     `json:"migration_version"`
	SirannonURL      string                                      `json:"sirannon_url"`
	Size             *ListDatabasesOutputDatabasesItemSize       `json:"size"`
	Compaction       *ListDatabasesOutputDatabasesItemCompaction `json:"compaction"`
	SQLWritePreview  bool                                        `json:"sql_write_preview"`
}

type ListDatabasesOutput struct {
	Databases  []ListDatabasesOutputDatabasesItem `json:"databases"`
	TotalCount float64                            `json:"total_count"`
	Limit      float64                            `json:"limit"`
	Offset     float64                            `json:"offset"`
}

type ListFileVersionsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	FileID          string  `json:"file_id"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListFileVersionsOutputVersionsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListFileVersionsOutputVersionsItemUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListFileVersionsOutputVersionsItemUnreadPartsItem struct {
	FirstPage   *float64                                                 `json:"first_page"`
	LastPage    *float64                                                 `json:"last_page"`
	StartSecond *float64                                                 `json:"start_second"`
	EndSecond   *float64                                                 `json:"end_second"`
	Failure     ListFileVersionsOutputVersionsItemUnreadPartsItemFailure `json:"failure"`
}

type ListFileVersionsOutputVersionsItem struct {
	Version           float64                                             `json:"version"`
	ContentSHA256     string                                              `json:"content_sha256"`
	SizeBytes         float64                                             `json:"size_bytes"`
	Status            string                                              `json:"status"`
	Failure           *ListFileVersionsOutputVersionsItemFailure          `json:"failure"`
	ReceivedAt        string                                              `json:"received_at"`
	ProcessedAt       *string                                             `json:"processed_at"`
	PageCount         *float64                                            `json:"page_count"`
	DurationSeconds   *float64                                            `json:"duration_seconds"`
	ConversionSeconds *float64                                            `json:"conversion_seconds"`
	OcrPageCount      *float64                                            `json:"ocr_page_count"`
	UnreadParts       []ListFileVersionsOutputVersionsItemUnreadPartsItem `json:"unread_parts"`
	BlockCount        float64                                             `json:"block_count"`
	ChunkCount        float64                                             `json:"chunk_count"`
}

type ListFileVersionsOutput struct {
	Versions   []ListFileVersionsOutputVersionsItem `json:"versions"`
	TotalCount float64                              `json:"total_count"`
	Limit      float64                              `json:"limit"`
	Offset     float64                              `json:"offset"`
}

type ListFilesInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	State           *string `json:"state,omitzero"`
	Kind            *string `json:"kind,omitzero"`
	Status          *string `json:"status,omitzero"`
	Search          *string `json:"search,omitzero"`
	Sort            *string `json:"sort,omitzero"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListFilesOutputFilesItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListFilesOutputFilesItemUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListFilesOutputFilesItemUnreadPartsItem struct {
	FirstPage   *float64                                       `json:"first_page"`
	LastPage    *float64                                       `json:"last_page"`
	StartSecond *float64                                       `json:"start_second"`
	EndSecond   *float64                                       `json:"end_second"`
	Failure     ListFilesOutputFilesItemUnreadPartsItemFailure `json:"failure"`
}

type ListFilesOutputFilesItem struct {
	ID              string                                    `json:"id"`
	KnowledgeBaseID string                                    `json:"knowledge_base_id"`
	Path            string                                    `json:"path"`
	Kind            string                                    `json:"kind"`
	Address         *string                                   `json:"address"`
	Status          string                                    `json:"status"`
	CurrentVersion  *float64                                  `json:"current_version"`
	LatestVersion   float64                                   `json:"latest_version"`
	SizeBytes       float64                                   `json:"size_bytes"`
	ContentSHA256   string                                    `json:"content_sha256"`
	Failure         *ListFilesOutputFilesItemFailure          `json:"failure"`
	UnreadParts     []ListFilesOutputFilesItemUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                         `json:"metadata"`
	CreatedAt       string                                    `json:"created_at"`
	UpdatedAt       string                                    `json:"updated_at"`
	DeletedAt       *string                                   `json:"deleted_at"`
	PurgeAfter      *string                                   `json:"purge_after"`
}

type ListFilesOutput struct {
	Files      []ListFilesOutputFilesItem `json:"files"`
	TotalCount float64                    `json:"total_count"`
	Limit      float64                    `json:"limit"`
	Offset     float64                    `json:"offset"`
}

type ListFlaggedQuestionsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Status          *string `json:"status,omitzero"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListFlaggedQuestionsOutputFlaggedQuestionsItem struct {
	QuestionID      string   `json:"question_id"`
	Question        string   `json:"question"`
	EndUserID       *string  `json:"end_user_id"`
	Status          string   `json:"status"`
	Signals         []string `json:"signals"`
	FlaggedAt       string   `json:"flagged_at"`
	JudgedAt        *string  `json:"judged_at"`
	Probability     *float64 `json:"probability"`
	ChosenRank      *float64 `json:"chosen_rank"`
	SavedQuestionID *string  `json:"saved_question_id"`
	SettledBy       *string  `json:"settled_by"`
}

type ListFlaggedQuestionsOutput struct {
	FlaggedQuestions []ListFlaggedQuestionsOutputFlaggedQuestionsItem `json:"flagged_questions"`
	TotalCount       float64                                          `json:"total_count"`
	Limit            float64                                          `json:"limit"`
	Offset           float64                                          `json:"offset"`
}

type ListFolderInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Folder          *string `json:"folder,omitzero"`
	Sort            *string `json:"sort,omitzero"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListFolderOutputEntriesItemFolder struct {
	Type            string  `json:"type"`
	Name            string  `json:"name"`
	Path            string  `json:"path"`
	FileCount       float64 `json:"file_count"`
	QueuedCount     float64 `json:"queued_count"`
	ProcessingCount float64 `json:"processing_count"`
	ReadyCount      float64 `json:"ready_count"`
	FailedCount     float64 `json:"failed_count"`
	SizeBytes       float64 `json:"size_bytes"`
	UpdatedAt       string  `json:"updated_at"`
}

type ListFolderOutputEntriesItemFileFileFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListFolderOutputEntriesItemFileFileUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListFolderOutputEntriesItemFileFileUnreadPartsItem struct {
	FirstPage   *float64                                                  `json:"first_page"`
	LastPage    *float64                                                  `json:"last_page"`
	StartSecond *float64                                                  `json:"start_second"`
	EndSecond   *float64                                                  `json:"end_second"`
	Failure     ListFolderOutputEntriesItemFileFileUnreadPartsItemFailure `json:"failure"`
}

type ListFolderOutputEntriesItemFileFile struct {
	ID              string                                               `json:"id"`
	KnowledgeBaseID string                                               `json:"knowledge_base_id"`
	Path            string                                               `json:"path"`
	Kind            string                                               `json:"kind"`
	Address         *string                                              `json:"address"`
	Status          string                                               `json:"status"`
	CurrentVersion  *float64                                             `json:"current_version"`
	LatestVersion   float64                                              `json:"latest_version"`
	SizeBytes       float64                                              `json:"size_bytes"`
	ContentSHA256   string                                               `json:"content_sha256"`
	Failure         *ListFolderOutputEntriesItemFileFileFailure          `json:"failure"`
	UnreadParts     []ListFolderOutputEntriesItemFileFileUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                                    `json:"metadata"`
	CreatedAt       string                                               `json:"created_at"`
	UpdatedAt       string                                               `json:"updated_at"`
	DeletedAt       *string                                              `json:"deleted_at"`
	PurgeAfter      *string                                              `json:"purge_after"`
}

type ListFolderOutputEntriesItemFile struct {
	Type      string                              `json:"type"`
	Name      string                              `json:"name"`
	Path      string                              `json:"path"`
	FileCount int64                               `json:"file_count"`
	SizeBytes float64                             `json:"size_bytes"`
	UpdatedAt string                              `json:"updated_at"`
	File      ListFolderOutputEntriesItemFileFile `json:"file"`
}

type ListFolderOutputEntriesItem struct {
	Folder *ListFolderOutputEntriesItemFolder
	File   *ListFolderOutputEntriesItemFile
}

var listFolderOutputEntriesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"type", "name", "path", "file_count", "queued_count", "processing_count", "ready_count", "failed_count", "size_bytes", "updated_at"}, properties: []string{"type", "name", "path", "file_count", "queued_count", "processing_count", "ready_count", "failed_count", "size_bytes", "updated_at"}, constants: map[string]any{"type": "folder"}},
	{kind: unionObject, required: []string{"type", "name", "path", "file_count", "size_bytes", "updated_at", "file"}, properties: []string{"type", "name", "path", "file_count", "size_bytes", "updated_at", "file"}, constants: map[string]any{"type": "file", "file_count": float64(1)}},
}

func (union ListFolderOutputEntriesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListFolderOutputEntriesItem")
}

func (union *ListFolderOutputEntriesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listFolderOutputEntriesItemMembers, "ListFolderOutputEntriesItem")
}

type ListFolderOutput struct {
	Folder     string                        `json:"folder"`
	Entries    []ListFolderOutputEntriesItem `json:"entries"`
	TotalCount float64                       `json:"total_count"`
	Limit      float64                       `json:"limit"`
	Offset     float64                       `json:"offset"`
}

type ListForgettingSuggestionsInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListForgettingSuggestionsOutputMemoriesItemValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var listForgettingSuggestionsOutputMemoriesItemValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union ListForgettingSuggestionsOutputMemoriesItemValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListForgettingSuggestionsOutputMemoriesItemValuesValue")
}

func (union *ListForgettingSuggestionsOutputMemoriesItemValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listForgettingSuggestionsOutputMemoriesItemValuesValueMembers, "ListForgettingSuggestionsOutputMemoriesItemValuesValue")
}

type ListForgettingSuggestionsOutputMemoriesItemPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type ListForgettingSuggestionsOutputMemoriesItemSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type ListForgettingSuggestionsOutputMemoriesItem struct {
	ID                 string                                                             `json:"id"`
	MemoryID           string                                                             `json:"memory_id"`
	Type               string                                                             `json:"type"`
	Scope              string                                                             `json:"scope"`
	OwnerID            *string                                                            `json:"owner_id"`
	Personal           bool                                                               `json:"personal"`
	TrustLevel         string                                                             `json:"trust_level"`
	Text               string                                                             `json:"text"`
	Subject            string                                                             `json:"subject"`
	Values             map[string]*ListForgettingSuggestionsOutputMemoriesItemValuesValue `json:"values"`
	Plan               *ListForgettingSuggestionsOutputMemoriesItemPlan                   `json:"plan"`
	Sensitive          bool                                                               `json:"sensitive"`
	InstructionLike    bool                                                               `json:"instruction_like"`
	SortedBy           string                                                             `json:"sorted_by"`
	ConnectionStrength float64                                                            `json:"connection_strength"`
	RecallStrength     float64                                                            `json:"recall_strength"`
	Sources            []ListForgettingSuggestionsOutputMemoriesItemSourcesItem           `json:"sources"`
	ReplacedBy         *string                                                            `json:"replaced_by"`
	HeldUntil          *string                                                            `json:"held_until"`
	ExpiresAt          *string                                                            `json:"expires_at"`
	LastCheckedAt      *string                                                            `json:"last_checked_at"`
	ForgottenAt        *string                                                            `json:"forgotten_at"`
	PurgeAfter         *string                                                            `json:"purge_after"`
	OccurredAt         string                                                             `json:"occurred_at"`
	CreatedAt          string                                                             `json:"created_at"`
	UpdatedAt          string                                                             `json:"updated_at"`
}

type ListForgettingSuggestionsOutput struct {
	Memories   []ListForgettingSuggestionsOutputMemoriesItem `json:"memories"`
	TotalCount float64                                       `json:"total_count"`
	Limit      float64                                       `json:"limit"`
	Offset     float64                                       `json:"offset"`
}

type ListIndexRecordsInput struct {
	ProjectID string  `json:"project_id"`
	IndexID   string  `json:"index_id"`
	Search    *string `json:"search,omitzero"`
	Sort      *string `json:"sort,omitzero"`
	Filters   *string `json:"filters,omitzero"`
	Cursor    *string `json:"cursor,omitzero"`
	Limit     *string `json:"limit,omitzero"`
}

type ListIndexRecordsOutputRecordsItem struct {
	ID     string         `json:"id"`
	Record map[string]any `json:"record"`
}

type ListIndexRecordsOutput struct {
	Records      []ListIndexRecordsOutputRecordsItem `json:"records"`
	TotalCount   float64                             `json:"total_count"`
	TotalIsExact bool                                `json:"total_is_exact"`
	NextCursor   *string                             `json:"next_cursor"`
}

type ListIndexesInput struct {
	ProjectID   string  `json:"project_id"`
	State       *string `json:"state,omitzero"`
	Creator     *string `json:"creator,omitzero"`
	CreatedFrom *string `json:"created_from,omitzero"`
	CreatedTo   *string `json:"created_to,omitzero"`
	Search      *string `json:"search,omitzero"`
	Sort        *string `json:"sort,omitzero"`
	Direction   *string `json:"direction,omitzero"`
	Limit       *string `json:"limit,omitzero"`
	Offset      *string `json:"offset,omitzero"`
}

type ListIndexesOutputIndexesItemCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ListIndexesOutputIndexesItem struct {
	ID         string                                `json:"id"`
	ProjectID  string                                `json:"project_id"`
	Name       string                                `json:"name"`
	CreatedAt  string                                `json:"created_at"`
	CreatedBy  ListIndexesOutputIndexesItemCreatedBy `json:"created_by"`
	DeletedAt  *string                               `json:"deleted_at"`
	PurgeAfter *string                               `json:"purge_after"`
	Config     map[string]any                        `json:"config"`
	NarsilURL  string                                `json:"narsil_url"`
}

type ListIndexesOutput struct {
	Indexes    []ListIndexesOutputIndexesItem `json:"indexes"`
	TotalCount float64                        `json:"total_count"`
	Limit      float64                        `json:"limit"`
	Offset     float64                        `json:"offset"`
}

type ListInvitationsInput struct {
	ProjectID   string  `json:"project_id"`
	Role        *string `json:"role,omitzero"`
	Status      *string `json:"status,omitzero"`
	CreatedFrom *string `json:"created_from,omitzero"`
	CreatedTo   *string `json:"created_to,omitzero"`
	Search      *string `json:"search,omitzero"`
	Sort        *string `json:"sort,omitzero"`
	Direction   *string `json:"direction,omitzero"`
	Limit       *string `json:"limit,omitzero"`
	Offset      *string `json:"offset,omitzero"`
}

type ListInvitationsOutputInvitationsItem struct {
	ID          string  `json:"id"`
	ProjectID   string  `json:"project_id"`
	ProjectName string  `json:"project_name"`
	Email       string  `json:"email"`
	Role        string  `json:"role"`
	CreatedAt   string  `json:"created_at"`
	ExpiresAt   string  `json:"expires_at"`
	AcceptedAt  *string `json:"accepted_at"`
	RevokedAt   *string `json:"revoked_at"`
}

type ListInvitationsOutput struct {
	Invitations []ListInvitationsOutputInvitationsItem `json:"invitations"`
	TotalCount  float64                                `json:"total_count"`
	Limit       float64                                `json:"limit"`
	Offset      float64                                `json:"offset"`
}

type ListKnowledgeBasesInput struct {
	ProjectID   string  `json:"project_id"`
	State       *string `json:"state,omitzero"`
	Creator     *string `json:"creator,omitzero"`
	CreatedFrom *string `json:"created_from,omitzero"`
	CreatedTo   *string `json:"created_to,omitzero"`
	Search      *string `json:"search,omitzero"`
	Sort        *string `json:"sort,omitzero"`
	Direction   *string `json:"direction,omitzero"`
	Limit       *string `json:"limit,omitzero"`
	Offset      *string `json:"offset,omitzero"`
}

type ListKnowledgeBasesOutputKnowledgeBasesItemCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ListKnowledgeBasesOutputKnowledgeBasesItem struct {
	ID                       string                                              `json:"id"`
	ProjectID                string                                              `json:"project_id"`
	Name                     string                                              `json:"name"`
	Language                 string                                              `json:"language"`
	ChunkTokens              float64                                             `json:"chunk_tokens"`
	QuestionLogRetentionDays *float64                                            `json:"question_log_retention_days"`
	CreatedAt                string                                              `json:"created_at"`
	CreatedBy                ListKnowledgeBasesOutputKnowledgeBasesItemCreatedBy `json:"created_by"`
	DeletedAt                *string                                             `json:"deleted_at"`
	PurgeAfter               *string                                             `json:"purge_after"`
	DatabaseID               string                                              `json:"database_id"`
	LiveIndexID              string                                              `json:"live_index_id"`
	SirannonURL              string                                              `json:"sirannon_url"`
	SearchPendingSince       *string                                             `json:"search_pending_since"`
}

type ListKnowledgeBasesOutput struct {
	KnowledgeBases []ListKnowledgeBasesOutputKnowledgeBasesItem `json:"knowledge_bases"`
	TotalCount     float64                                      `json:"total_count"`
	Limit          float64                                      `json:"limit"`
	Offset         float64                                      `json:"offset"`
}

type ListLearnedChangesInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListLearnedChangesOutputLearnedChangesItem struct {
	ID                  string  `json:"id"`
	Setting             string  `json:"setting"`
	FromValue           float64 `json:"from_value"`
	ToValue             float64 `json:"to_value"`
	TuningDecisions     float64 `json:"tuning_decisions"`
	HeldBackDecisions   float64 `json:"held_back_decisions"`
	HeldBackRightBefore float64 `json:"held_back_right_before"`
	HeldBackRightAfter  float64 `json:"held_back_right_after"`
	CreatedAt           string  `json:"created_at"`
	UndoneAt            *string `json:"undone_at"`
}

type ListLearnedChangesOutput struct {
	LearnedChanges []ListLearnedChangesOutputLearnedChangesItem `json:"learned_changes"`
	TotalCount     float64                                      `json:"total_count"`
	Limit          float64                                      `json:"limit"`
	Offset         float64                                      `json:"offset"`
}

type ListMembersInput struct {
	ProjectID string  `json:"project_id"`
	Role      *string `json:"role,omitzero"`
	AddedFrom *string `json:"added_from,omitzero"`
	AddedTo   *string `json:"added_to,omitzero"`
	Search    *string `json:"search,omitzero"`
	Sort      *string `json:"sort,omitzero"`
	Direction *string `json:"direction,omitzero"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListMembersOutputMembersItem struct {
	AccountID string `json:"account_id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	AddedAt   string `json:"added_at"`
}

type ListMembersOutput struct {
	Members    []ListMembersOutputMembersItem `json:"members"`
	TotalCount float64                        `json:"total_count"`
	Limit      float64                        `json:"limit"`
	Offset     float64                        `json:"offset"`
}

type ListMemoriesInput struct {
	ProjectID       string  `json:"project_id"`
	MemoryID        string  `json:"memory_id"`
	Query           *string `json:"query,omitzero"`
	EndUserID       *string `json:"end_user_id,omitzero"`
	TeamID          *string `json:"team_id,omitzero"`
	OwnerID         *string `json:"owner_id,omitzero"`
	Scope           *string `json:"scope,omitzero"`
	Type            *string `json:"type,omitzero"`
	TrustLevel      *string `json:"trust_level,omitzero"`
	PlanState       *string `json:"plan_state,omitzero"`
	IncludeReplaced *string `json:"include_replaced,omitzero"`
	Forgotten       *string `json:"forgotten,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListMemoriesOutputMemoriesItemValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var listMemoriesOutputMemoriesItemValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union ListMemoriesOutputMemoriesItemValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListMemoriesOutputMemoriesItemValuesValue")
}

func (union *ListMemoriesOutputMemoriesItemValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listMemoriesOutputMemoriesItemValuesValueMembers, "ListMemoriesOutputMemoriesItemValuesValue")
}

type ListMemoriesOutputMemoriesItemPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type ListMemoriesOutputMemoriesItemSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type ListMemoriesOutputMemoriesItem struct {
	ID                 string                                                `json:"id"`
	MemoryID           string                                                `json:"memory_id"`
	Type               string                                                `json:"type"`
	Scope              string                                                `json:"scope"`
	OwnerID            *string                                               `json:"owner_id"`
	Personal           bool                                                  `json:"personal"`
	TrustLevel         string                                                `json:"trust_level"`
	Text               string                                                `json:"text"`
	Subject            string                                                `json:"subject"`
	Values             map[string]*ListMemoriesOutputMemoriesItemValuesValue `json:"values"`
	Plan               *ListMemoriesOutputMemoriesItemPlan                   `json:"plan"`
	Sensitive          bool                                                  `json:"sensitive"`
	InstructionLike    bool                                                  `json:"instruction_like"`
	SortedBy           string                                                `json:"sorted_by"`
	ConnectionStrength float64                                               `json:"connection_strength"`
	RecallStrength     float64                                               `json:"recall_strength"`
	Sources            []ListMemoriesOutputMemoriesItemSourcesItem           `json:"sources"`
	ReplacedBy         *string                                               `json:"replaced_by"`
	HeldUntil          *string                                               `json:"held_until"`
	ExpiresAt          *string                                               `json:"expires_at"`
	LastCheckedAt      *string                                               `json:"last_checked_at"`
	ForgottenAt        *string                                               `json:"forgotten_at"`
	PurgeAfter         *string                                               `json:"purge_after"`
	OccurredAt         string                                                `json:"occurred_at"`
	CreatedAt          string                                                `json:"created_at"`
	UpdatedAt          string                                                `json:"updated_at"`
}

type ListMemoriesOutput struct {
	Memories   []ListMemoriesOutputMemoriesItem `json:"memories"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type ListMemoryDecisionsInput struct {
	ProjectID      string  `json:"project_id"`
	MemoryID       string  `json:"memory_id"`
	Kind           *string `json:"kind,omitzero"`
	StoredMemoryID *string `json:"stored_memory_id,omitzero"`
	SubjectOwnerID *string `json:"subject_owner_id,omitzero"`
	ByPerson       *string `json:"by_person,omitzero"`
	Limit          *string `json:"limit,omitzero"`
	Offset         *string `json:"offset,omitzero"`
}

type ListMemoryDecisionsOutputDecisionsItemMemoryValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var listMemoryDecisionsOutputDecisionsItemMemoryValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union ListMemoryDecisionsOutputDecisionsItemMemoryValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListMemoryDecisionsOutputDecisionsItemMemoryValuesValue")
}

func (union *ListMemoryDecisionsOutputDecisionsItemMemoryValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listMemoryDecisionsOutputDecisionsItemMemoryValuesValueMembers, "ListMemoryDecisionsOutputDecisionsItemMemoryValuesValue")
}

type ListMemoryDecisionsOutputDecisionsItemMemoryPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type ListMemoryDecisionsOutputDecisionsItemMemorySourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type ListMemoryDecisionsOutputDecisionsItemMemory struct {
	ID                 string                                                              `json:"id"`
	MemoryID           string                                                              `json:"memory_id"`
	Type               string                                                              `json:"type"`
	Scope              string                                                              `json:"scope"`
	OwnerID            *string                                                             `json:"owner_id"`
	Personal           bool                                                                `json:"personal"`
	TrustLevel         string                                                              `json:"trust_level"`
	Text               string                                                              `json:"text"`
	Subject            string                                                              `json:"subject"`
	Values             map[string]*ListMemoryDecisionsOutputDecisionsItemMemoryValuesValue `json:"values"`
	Plan               *ListMemoryDecisionsOutputDecisionsItemMemoryPlan                   `json:"plan"`
	Sensitive          bool                                                                `json:"sensitive"`
	InstructionLike    bool                                                                `json:"instruction_like"`
	SortedBy           string                                                              `json:"sorted_by"`
	ConnectionStrength float64                                                             `json:"connection_strength"`
	RecallStrength     float64                                                             `json:"recall_strength"`
	Sources            []ListMemoryDecisionsOutputDecisionsItemMemorySourcesItem           `json:"sources"`
	ReplacedBy         *string                                                             `json:"replaced_by"`
	HeldUntil          *string                                                             `json:"held_until"`
	ExpiresAt          *string                                                             `json:"expires_at"`
	LastCheckedAt      *string                                                             `json:"last_checked_at"`
	ForgottenAt        *string                                                             `json:"forgotten_at"`
	PurgeAfter         *string                                                             `json:"purge_after"`
	OccurredAt         string                                                              `json:"occurred_at"`
	CreatedAt          string                                                              `json:"created_at"`
	UpdatedAt          string                                                              `json:"updated_at"`
}

type ListMemoryDecisionsOutputDecisionsItemOtherMemory struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type ListMemoryDecisionsOutputDecisionsItemFile struct {
	Text            string  `json:"text"`
	RecordedAt      string  `json:"recorded_at"`
	KnowledgeBaseID *string `json:"knowledge_base_id"`
	FileID          *string `json:"file_id"`
	FilePath        *string `json:"file_path"`
}

type ListMemoryDecisionsOutputDecisionsItem struct {
	ID             string                                             `json:"id"`
	MemoryID       string                                             `json:"memory_id"`
	StoredMemoryID string                                             `json:"stored_memory_id"`
	Kind           string                                             `json:"kind"`
	DecidedBy      string                                             `json:"decided_by"`
	TrustLevel     string                                             `json:"trust_level"`
	Probability    *float64                                           `json:"probability"`
	Reason         *string                                            `json:"reason"`
	Subject        string                                             `json:"subject"`
	SubjectOwnerID *string                                            `json:"subject_owner_id"`
	Memory         ListMemoryDecisionsOutputDecisionsItemMemory       `json:"memory"`
	OtherMemory    *ListMemoryDecisionsOutputDecisionsItemOtherMemory `json:"other_memory"`
	File           *ListMemoryDecisionsOutputDecisionsItemFile        `json:"file"`
	OverriddenAt   *string                                            `json:"overridden_at"`
	CreatedAt      string                                             `json:"created_at"`
}

type ListMemoryDecisionsOutput struct {
	Decisions  []ListMemoryDecisionsOutputDecisionsItem `json:"decisions"`
	TotalCount float64                                  `json:"total_count"`
	Limit      float64                                  `json:"limit"`
	Offset     float64                                  `json:"offset"`
}

type ListMemoryOwnersInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	Query     *string `json:"query,omitzero"`
	Scope     *string `json:"scope,omitzero"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListMemoryOwnersOutputOwnersItem struct {
	Scope          string  `json:"scope"`
	OwnerID        string  `json:"owner_id"`
	MemoryCount    float64 `json:"memory_count"`
	LastOccurredAt string  `json:"last_occurred_at"`
}

type ListMemoryOwnersOutput struct {
	Owners     []ListMemoryOwnersOutputOwnersItem `json:"owners"`
	TotalCount float64                            `json:"total_count"`
	Limit      float64                            `json:"limit"`
	Offset     float64                            `json:"offset"`
}

type ListMemoryReviewsInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	State     *string `json:"state,omitzero"`
	Reason    *string `json:"reason,omitzero"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListMemoryReviewsOutputReviewsItemContradictingRecordsItem struct {
	Text            string  `json:"text"`
	RecordedAt      string  `json:"recorded_at"`
	KnowledgeBaseID *string `json:"knowledge_base_id"`
	FilePath        *string `json:"file_path"`
	FileID          *string `json:"file_id"`
}

type ListMemoryReviewsOutputReviewsItemContradictedMemoriesItem struct {
	ID         string `json:"id"`
	Text       string `json:"text"`
	TrustLevel string `json:"trust_level"`
	Replaced   bool   `json:"replaced"`
}

type ListMemoryReviewsOutputReviewsItemMemoryValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var listMemoryReviewsOutputReviewsItemMemoryValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union ListMemoryReviewsOutputReviewsItemMemoryValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListMemoryReviewsOutputReviewsItemMemoryValuesValue")
}

func (union *ListMemoryReviewsOutputReviewsItemMemoryValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listMemoryReviewsOutputReviewsItemMemoryValuesValueMembers, "ListMemoryReviewsOutputReviewsItemMemoryValuesValue")
}

type ListMemoryReviewsOutputReviewsItemMemoryPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type ListMemoryReviewsOutputReviewsItemMemorySourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type ListMemoryReviewsOutputReviewsItemMemory struct {
	ID                 string                                                          `json:"id"`
	MemoryID           string                                                          `json:"memory_id"`
	Type               string                                                          `json:"type"`
	Scope              string                                                          `json:"scope"`
	OwnerID            *string                                                         `json:"owner_id"`
	Personal           bool                                                            `json:"personal"`
	TrustLevel         string                                                          `json:"trust_level"`
	Text               string                                                          `json:"text"`
	Subject            string                                                          `json:"subject"`
	Values             map[string]*ListMemoryReviewsOutputReviewsItemMemoryValuesValue `json:"values"`
	Plan               *ListMemoryReviewsOutputReviewsItemMemoryPlan                   `json:"plan"`
	Sensitive          bool                                                            `json:"sensitive"`
	InstructionLike    bool                                                            `json:"instruction_like"`
	SortedBy           string                                                          `json:"sorted_by"`
	ConnectionStrength float64                                                         `json:"connection_strength"`
	RecallStrength     float64                                                         `json:"recall_strength"`
	Sources            []ListMemoryReviewsOutputReviewsItemMemorySourcesItem           `json:"sources"`
	ReplacedBy         *string                                                         `json:"replaced_by"`
	HeldUntil          *string                                                         `json:"held_until"`
	ExpiresAt          *string                                                         `json:"expires_at"`
	LastCheckedAt      *string                                                         `json:"last_checked_at"`
	ForgottenAt        *string                                                         `json:"forgotten_at"`
	PurgeAfter         *string                                                         `json:"purge_after"`
	OccurredAt         string                                                          `json:"occurred_at"`
	CreatedAt          string                                                          `json:"created_at"`
	UpdatedAt          string                                                          `json:"updated_at"`
}

type ListMemoryReviewsOutputReviewsItem struct {
	ID                   string                                                       `json:"id"`
	MemoryID             string                                                       `json:"memory_id"`
	StoredMemoryID       string                                                       `json:"stored_memory_id"`
	Reason               string                                                       `json:"reason"`
	State                string                                                       `json:"state"`
	Evidence             map[string]any                                               `json:"evidence"`
	ContradictingRecords []ListMemoryReviewsOutputReviewsItemContradictingRecordsItem `json:"contradicting_records"`
	ContradictedMemories []ListMemoryReviewsOutputReviewsItemContradictedMemoriesItem `json:"contradicted_memories"`
	SettledTrustLevel    *string                                                      `json:"settled_trust_level"`
	SettledBy            *string                                                      `json:"settled_by"`
	CreatedAt            string                                                       `json:"created_at"`
	SettledAt            *string                                                      `json:"settled_at"`
	Memory               ListMemoryReviewsOutputReviewsItemMemory                     `json:"memory"`
}

type ListMemoryReviewsOutput struct {
	Reviews    []ListMemoryReviewsOutputReviewsItem `json:"reviews"`
	TotalCount float64                              `json:"total_count"`
	Limit      float64                              `json:"limit"`
	Offset     float64                              `json:"offset"`
}

type ListMemorySavedQuestionsInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	Flagged   *string `json:"flagged,omitzero"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListMemorySavedQuestionsOutputSavedQuestionsItem struct {
	ID             string   `json:"id"`
	Question       string   `json:"question"`
	StoredMemoryID string   `json:"stored_memory_id"`
	MemoryText     *string  `json:"memory_text"`
	EndUserID      *string  `json:"end_user_id"`
	TeamID         *string  `json:"team_id"`
	Rank           *float64 `json:"rank"`
	Flag           *string  `json:"flag"`
	ReplacedBy     *string  `json:"replaced_by"`
	CreatedAt      string   `json:"created_at"`
}

type ListMemorySavedQuestionsOutput struct {
	SavedQuestions []ListMemorySavedQuestionsOutputSavedQuestionsItem `json:"saved_questions"`
	TotalCount     float64                                            `json:"total_count"`
	Limit          float64                                            `json:"limit"`
	Offset         float64                                            `json:"offset"`
}

type ListMemorySourcesInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	Kind      *string `json:"kind,omitzero"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListMemorySourcesOutputSourcesItemSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type ListMemorySourcesOutputSourcesItemCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ListMemorySourcesOutputSourcesItemLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type ListMemorySourcesOutputSourcesItem struct {
	ID              string                                       `json:"id"`
	ProjectID       string                                       `json:"project_id"`
	KnowledgeBaseID *string                                      `json:"knowledge_base_id"`
	MemoryID        *string                                      `json:"memory_id"`
	Name            string                                       `json:"name"`
	Kind            string                                       `json:"kind"`
	Sorting         *string                                      `json:"sorting"`
	Status          string                                       `json:"status"`
	Settings        map[string]any                               `json:"settings"`
	CredentialNames []string                                     `json:"credential_names"`
	WebhookURL      *string                                      `json:"webhook_url"`
	SignIn          *ListMemorySourcesOutputSourcesItemSignIn    `json:"sign_in"`
	CreatedAt       string                                       `json:"created_at"`
	CreatedBy       ListMemorySourcesOutputSourcesItemCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                                      `json:"last_synced_at"`
	NextSyncAt      *string                                      `json:"next_sync_at"`
	LastError       *ListMemorySourcesOutputSourcesItemLastError `json:"last_error"`
}

type ListMemorySourcesOutput struct {
	Sources    []ListMemorySourcesOutputSourcesItem `json:"sources"`
	TotalCount float64                              `json:"total_count"`
	Limit      float64                              `json:"limit"`
	Offset     float64                              `json:"offset"`
}

type ListMemoryWebhookDeliveriesInput struct {
	ProjectID string  `json:"project_id"`
	MemoryID  string  `json:"memory_id"`
	State     *string `json:"state,omitzero"`
	Limit     *string `json:"limit,omitzero"`
	Offset    *string `json:"offset,omitzero"`
}

type ListMemoryWebhookDeliveriesOutputDeliveriesItem struct {
	ID             string   `json:"id"`
	Type           string   `json:"type"`
	DecisionID     string   `json:"decision_id"`
	State          string   `json:"state"`
	Attempts       float64  `json:"attempts"`
	ResponseStatus *float64 `json:"response_status"`
	Failure        *string  `json:"failure"`
	NextAttemptAt  *string  `json:"next_attempt_at"`
	CreatedAt      string   `json:"created_at"`
	DeliveredAt    *string  `json:"delivered_at"`
}

type ListMemoryWebhookDeliveriesOutput struct {
	Deliveries []ListMemoryWebhookDeliveriesOutputDeliveriesItem `json:"deliveries"`
	TotalCount float64                                           `json:"total_count"`
	Limit      float64                                           `json:"limit"`
	Offset     float64                                           `json:"offset"`
}

type ListMessagesInput struct {
	ProjectID      string  `json:"project_id"`
	MemoryID       string  `json:"memory_id"`
	SourceID       *string `json:"source_id,omitzero"`
	ConversationID *string `json:"conversation_id,omitzero"`
	State          *string `json:"state,omitzero"`
	Limit          *string `json:"limit,omitzero"`
	Offset         *string `json:"offset,omitzero"`
}

type ListMessagesOutputMessagesItem struct {
	SourceID        string  `json:"source_id"`
	ExternalID      string  `json:"external_id"`
	Version         float64 `json:"version"`
	ConversationID  string  `json:"conversation_id"`
	TextStart       string  `json:"text_start"`
	State           string  `json:"state"`
	Attempts        float64 `json:"attempts"`
	MemoriesWritten float64 `json:"memories_written"`
	FailureCode     *string `json:"failure_code"`
	ReceivedAt      string  `json:"received_at"`
	FinishedAt      *string `json:"finished_at"`
}

type ListMessagesOutput struct {
	Messages   []ListMessagesOutputMessagesItem `json:"messages"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type ListMetadataKeysInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Search          *string `json:"search,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListMetadataKeysOutputKeysItem struct {
	Key       string  `json:"key"`
	FileCount float64 `json:"file_count"`
}

type ListMetadataKeysOutput struct {
	Keys       []ListMetadataKeysOutputKeysItem `json:"keys"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type ListMetadataValuesInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Search          *string `json:"search,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
	Key             string  `json:"key"`
}

type ListMetadataValuesOutputValuesItem struct {
	Value     string  `json:"value"`
	FileCount float64 `json:"file_count"`
}

type ListMetadataValuesOutput struct {
	Key        string                               `json:"key"`
	Values     []ListMetadataValuesOutputValuesItem `json:"values"`
	TotalCount float64                              `json:"total_count"`
	Limit      float64                              `json:"limit"`
	Offset     float64                              `json:"offset"`
}

type ListOperationsInput struct{}

type ListOperationsOutputOperationsItemKeyPermissionsItem struct {
	ResourceKind    string  `json:"resource_kind"`
	Level           string  `json:"level"`
	Target          string  `json:"target"`
	ResourceIDField *string `json:"resource_id_field"`
	OnlyWithField   *string `json:"only_with_field"`
}

type ListOperationsOutputOperationsItem struct {
	ID             string                                                 `json:"id"`
	Method         string                                                 `json:"method"`
	Path           string                                                 `json:"path"`
	Access         string                                                 `json:"access"`
	KeyPermissions []ListOperationsOutputOperationsItemKeyPermissionsItem `json:"key_permissions"`
	Summary        string                                                 `json:"summary"`
}

type ListOperationsOutput struct {
	Operations []ListOperationsOutputOperationsItem `json:"operations"`
}

type ListProjectsInput struct {
	State       *string `json:"state,omitzero"`
	Role        *string `json:"role,omitzero"`
	CreatedFrom *string `json:"created_from,omitzero"`
	CreatedTo   *string `json:"created_to,omitzero"`
	Search      *string `json:"search,omitzero"`
	Sort        *string `json:"sort,omitzero"`
	Direction   *string `json:"direction,omitzero"`
	Limit       *string `json:"limit,omitzero"`
	Offset      *string `json:"offset,omitzero"`
}

type ListProjectsOutputProjectsItem struct {
	ID                 string  `json:"id"`
	Name               string  `json:"name"`
	Region             string  `json:"region"`
	Role               *string `json:"role"`
	CreatedAt          string  `json:"created_at"`
	DeletedAt          *string `json:"deleted_at"`
	PurgeAfter         *string `json:"purge_after"`
	SirannonURL        string  `json:"sirannon_url"`
	NarsilURL          string  `json:"narsil_url"`
	DatabaseCount      float64 `json:"database_count"`
	IndexCount         float64 `json:"index_count"`
	KnowledgeBaseCount float64 `json:"knowledge_base_count"`
	MemoryEnabled      bool    `json:"memory_enabled"`
	MemberCount        float64 `json:"member_count"`
	LastChangedAt      string  `json:"last_changed_at"`
}

type ListProjectsOutput struct {
	Projects   []ListProjectsOutputProjectsItem `json:"projects"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type ListQuestionsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	EndUserID       *string `json:"end_user_id,omitzero"`
	Search          *string `json:"search,omitzero"`
	Sort            *string `json:"sort,omitzero"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationDocument struct {
	Kind      string                                                                      `json:"kind"`
	Pages     []float64                                                                   `json:"pages"`
	Areas     []ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationImage struct {
	Kind      string                                                                   `json:"kind"`
	FileName  string                                                                   `json:"file_name"`
	Areas     []ListQuestionsOutputQuestionsItemPassagesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []ListQuestionsOutputQuestionsItemPassagesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type ListQuestionsOutputQuestionsItemPassagesItemCitation struct {
	Document    *ListQuestionsOutputQuestionsItemPassagesItemCitationDocument
	Spreadsheet *ListQuestionsOutputQuestionsItemPassagesItemCitationSpreadsheet
	Slides      *ListQuestionsOutputQuestionsItemPassagesItemCitationSlides
	WebPage     *ListQuestionsOutputQuestionsItemPassagesItemCitationWebPage
	Image       *ListQuestionsOutputQuestionsItemPassagesItemCitationImage
	Recording   *ListQuestionsOutputQuestionsItemPassagesItemCitationRecording
}

var listQuestionsOutputQuestionsItemPassagesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union ListQuestionsOutputQuestionsItemPassagesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListQuestionsOutputQuestionsItemPassagesItemCitation")
}

func (union *ListQuestionsOutputQuestionsItemPassagesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listQuestionsOutputQuestionsItemPassagesItemCitationMembers, "ListQuestionsOutputQuestionsItemPassagesItemCitation")
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocument struct {
	Kind      string                                                                           `json:"kind"`
	Pages     []float64                                                                        `json:"pages"`
	Areas     []ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentAreasItem     `json:"areas"`
	PageSizes []ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentPageSizesItem `json:"page_sizes"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImage struct {
	Kind      string                                                                        `json:"kind"`
	FileName  string                                                                        `json:"file_name"`
	Areas     []ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImageAreasItem     `json:"areas"`
	PageSizes []ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImagePageSizesItem `json:"page_sizes"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type ListQuestionsOutputQuestionsItemPassagesItemMatchCitation struct {
	Document    *ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocument
	Spreadsheet *ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSpreadsheet
	Slides      *ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSlides
	WebPage     *ListQuestionsOutputQuestionsItemPassagesItemMatchCitationWebPage
	Image       *ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImage
	Recording   *ListQuestionsOutputQuestionsItemPassagesItemMatchCitationRecording
}

var listQuestionsOutputQuestionsItemPassagesItemMatchCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union ListQuestionsOutputQuestionsItemPassagesItemMatchCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListQuestionsOutputQuestionsItemPassagesItemMatchCitation")
}

func (union *ListQuestionsOutputQuestionsItemPassagesItemMatchCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listQuestionsOutputQuestionsItemPassagesItemMatchCitationMembers, "ListQuestionsOutputQuestionsItemPassagesItemMatchCitation")
}

type ListQuestionsOutputQuestionsItemPassagesItem struct {
	ChunkID       string                                                     `json:"chunk_id"`
	FileID        string                                                     `json:"file_id"`
	FilePath      string                                                     `json:"file_path"`
	Version       float64                                                    `json:"version"`
	FileKind      *string                                                    `json:"file_kind"`
	Heading       *string                                                    `json:"heading"`
	Score         float64                                                    `json:"score"`
	Citation      *ListQuestionsOutputQuestionsItemPassagesItemCitation      `json:"citation"`
	MatchCitation *ListQuestionsOutputQuestionsItemPassagesItemMatchCitation `json:"match_citation"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocument struct {
	Kind      string                                                                            `json:"kind"`
	Pages     []float64                                                                         `json:"pages"`
	Areas     []ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImage struct {
	Kind      string                                                                         `json:"kind"`
	FileName  string                                                                         `json:"file_name"`
	Areas     []ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassageCitation struct {
	Document    *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocument
	Spreadsheet *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSpreadsheet
	Slides      *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSlides
	WebPage     *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationWebPage
	Image       *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImage
	Recording   *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationRecording
}

var listQuestionsOutputQuestionsItemSavedAnswerPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union ListQuestionsOutputQuestionsItemSavedAnswerPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitation")
}

func (union *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listQuestionsOutputQuestionsItemSavedAnswerPassageCitationMembers, "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitation")
}

type ListQuestionsOutputQuestionsItemSavedAnswerPassage struct {
	FileID        string                                                      `json:"file_id"`
	FilePath      *string                                                     `json:"file_path"`
	FileKind      *string                                                     `json:"file_kind"`
	Version       float64                                                     `json:"version"`
	FirstPosition float64                                                     `json:"first_position"`
	LastPosition  float64                                                     `json:"last_position"`
	Heading       *string                                                     `json:"heading"`
	State         string                                                      `json:"state"`
	Citation      *ListQuestionsOutputQuestionsItemSavedAnswerPassageCitation `json:"citation"`
}

type ListQuestionsOutputQuestionsItemSavedAnswer struct {
	SavedQuestionID string                                             `json:"saved_question_id"`
	PassageIndex    *float64                                           `json:"passage_index"`
	Passage         ListQuestionsOutputQuestionsItemSavedAnswerPassage `json:"passage"`
}

type ListQuestionsOutputQuestionsItem struct {
	ID          string                                         `json:"id"`
	AskedAt     string                                         `json:"asked_at"`
	Question    string                                         `json:"question"`
	EndUserID   *string                                        `json:"end_user_id"`
	LiveIndexID string                                         `json:"live_index_id"`
	DurationMs  float64                                        `json:"duration_ms"`
	Passages    []ListQuestionsOutputQuestionsItemPassagesItem `json:"passages"`
	SavedAnswer *ListQuestionsOutputQuestionsItemSavedAnswer   `json:"saved_answer"`
}

type ListQuestionsOutput struct {
	Questions  []ListQuestionsOutputQuestionsItem `json:"questions"`
	TotalCount float64                            `json:"total_count"`
	Limit      float64                            `json:"limit"`
	Offset     float64                            `json:"offset"`
}

type ListSavedQueriesInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type ListSavedQueriesOutputSavedQueriesItemCreatedBy struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ListSavedQueriesOutputSavedQueriesItem struct {
	ID         string                                          `json:"id"`
	DatabaseID string                                          `json:"database_id"`
	Name       string                                          `json:"name"`
	SQL        string                                          `json:"sql"`
	CreatedBy  ListSavedQueriesOutputSavedQueriesItemCreatedBy `json:"created_by"`
	CreatedAt  string                                          `json:"created_at"`
	UpdatedAt  string                                          `json:"updated_at"`
}

type ListSavedQueriesOutput struct {
	SavedQueries []ListSavedQueriesOutputSavedQueriesItem `json:"saved_queries"`
}

type ListSavedQuestionsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	State           *string `json:"state,omitzero"`
	Split           *string `json:"split,omitzero"`
	Search          *string `json:"search,omitzero"`
	Sort            *string `json:"sort,omitzero"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument struct {
	Kind      string                                                                           `json:"kind"`
	Pages     []float64                                                                        `json:"pages"`
	Areas     []ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImage struct {
	Kind      string                                                                        `json:"kind"`
	FileName  string                                                                        `json:"file_name"`
	Areas     []ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type ListSavedQuestionsOutputSavedQuestionsItemPassageCitation struct {
	Document    *ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument
	Spreadsheet *ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet
	Slides      *ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides
	WebPage     *ListSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage
	Image       *ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImage
	Recording   *ListSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording
}

var listSavedQuestionsOutputSavedQuestionsItemPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union ListSavedQuestionsOutputSavedQuestionsItemPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListSavedQuestionsOutputSavedQuestionsItemPassageCitation")
}

func (union *ListSavedQuestionsOutputSavedQuestionsItemPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listSavedQuestionsOutputSavedQuestionsItemPassageCitationMembers, "ListSavedQuestionsOutputSavedQuestionsItemPassageCitation")
}

type ListSavedQuestionsOutputSavedQuestionsItemPassage struct {
	FileID        string                                                     `json:"file_id"`
	FilePath      *string                                                    `json:"file_path"`
	FileKind      *string                                                    `json:"file_kind"`
	Version       float64                                                    `json:"version"`
	FirstPosition float64                                                    `json:"first_position"`
	LastPosition  float64                                                    `json:"last_position"`
	Heading       *string                                                    `json:"heading"`
	State         string                                                     `json:"state"`
	Citation      *ListSavedQuestionsOutputSavedQuestionsItemPassageCitation `json:"citation"`
}

type ListSavedQuestionsOutputSavedQuestionsItemBrokenPrevious struct {
	Version       float64 `json:"version"`
	FirstPosition float64 `json:"first_position"`
	LastPosition  float64 `json:"last_position"`
}

type ListSavedQuestionsOutputSavedQuestionsItemBroken struct {
	Change     string                                                    `json:"change"`
	Version    *float64                                                  `json:"version"`
	DetectedAt string                                                    `json:"detected_at"`
	Previous   *ListSavedQuestionsOutputSavedQuestionsItemBrokenPrevious `json:"previous"`
}

type ListSavedQuestionsOutputSavedQuestionsItem struct {
	ID            string                                            `json:"id"`
	Question      string                                            `json:"question"`
	Split         string                                            `json:"split"`
	Source        string                                            `json:"source"`
	QuestionLogID *string                                           `json:"question_log_id"`
	EndUserID     *string                                           `json:"end_user_id"`
	Passage       ListSavedQuestionsOutputSavedQuestionsItemPassage `json:"passage"`
	Broken        *ListSavedQuestionsOutputSavedQuestionsItemBroken `json:"broken"`
	CreatedAt     string                                            `json:"created_at"`
	UpdatedAt     string                                            `json:"updated_at"`
}

type ListSavedQuestionsOutput struct {
	SavedQuestions []ListSavedQuestionsOutputSavedQuestionsItem `json:"saved_questions"`
	TotalCount     float64                                      `json:"total_count"`
	Limit          float64                                      `json:"limit"`
	Offset         float64                                      `json:"offset"`
}

type ListScorecardResultsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	ScorecardID     string  `json:"scorecard_id"`
	CompareTo       *string `json:"compare_to,omitzero"`
	Outcome         *string `json:"outcome,omitzero"`
	Change          *string `json:"change,omitzero"`
	Split           *string `json:"split,omitzero"`
	Cause           *string `json:"cause,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListScorecardResultsOutputResultsItemCauseDetail struct {
	Explanation      string   `json:"explanation"`
	DeepRank         *float64 `json:"deep_rank"`
	KeywordRank      *float64 `json:"keyword_rank"`
	VectorRank       *float64 `json:"vector_rank"`
	QuestionLanguage *string  `json:"question_language"`
	PassageLanguage  *string  `json:"passage_language"`
	ChunksInPassage  *float64 `json:"chunks_in_passage"`
	MissingTerms     []string `json:"missing_terms"`
}

type ListScorecardResultsOutputResultsItemPassage struct {
	FileID   string  `json:"file_id"`
	FilePath *string `json:"file_path"`
	Version  float64 `json:"version"`
	Heading  *string `json:"heading"`
}

type ListScorecardResultsOutputResultsItemReturnedItem struct {
	Rank     float64 `json:"rank"`
	ChunkID  string  `json:"chunk_id"`
	FileID   string  `json:"file_id"`
	FilePath *string `json:"file_path"`
	Version  float64 `json:"version"`
	Heading  *string `json:"heading"`
}

type ListScorecardResultsOutputResultsItemCompared struct {
	Rank   *float64 `json:"rank"`
	Passed bool     `json:"passed"`
	Cause  *string  `json:"cause"`
}

type ListScorecardResultsOutputResultsItem struct {
	SavedQuestionID string                                              `json:"saved_question_id"`
	Question        string                                              `json:"question"`
	Split           string                                              `json:"split"`
	PassageState    string                                              `json:"passage_state"`
	Rank            *float64                                            `json:"rank"`
	Passed          bool                                                `json:"passed"`
	Cause           *string                                             `json:"cause"`
	CauseDetail     *ListScorecardResultsOutputResultsItemCauseDetail   `json:"cause_detail"`
	Passage         ListScorecardResultsOutputResultsItemPassage        `json:"passage"`
	Returned        []ListScorecardResultsOutputResultsItemReturnedItem `json:"returned"`
	Compared        *ListScorecardResultsOutputResultsItemCompared      `json:"compared"`
}

type ListScorecardResultsOutput struct {
	Results    []ListScorecardResultsOutputResultsItem `json:"results"`
	TotalCount float64                                 `json:"total_count"`
	Limit      float64                                 `json:"limit"`
	Offset     float64                                 `json:"offset"`
}

type ListScorecardsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Direction       *string `json:"direction,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListScorecardsOutputScorecardsItemTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ListScorecardsOutputScorecardsItemHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsBoost struct {
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsFusionRrf struct {
	Strategy     string  `json:"strategy"`
	RankConstant float64 `json:"rank_constant"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsFusionLinear struct {
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsFusion struct {
	Rrf    *ListScorecardsOutputScorecardsItemConfigurationSettingsFusionRrf
	Linear *ListScorecardsOutputScorecardsItemConfigurationSettingsFusionLinear
}

var listScorecardsOutputScorecardsItemConfigurationSettingsFusionMembers = []unionMember{
	{kind: unionObject, required: []string{"strategy", "rank_constant"}, properties: []string{"strategy", "rank_constant"}, constants: map[string]any{"strategy": "rrf"}},
	{kind: unionObject, required: []string{"strategy", "vector_weight"}, properties: []string{"strategy", "vector_weight"}, constants: map[string]any{"strategy": "linear"}},
}

func (union ListScorecardsOutputScorecardsItemConfigurationSettingsFusion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListScorecardsOutputScorecardsItemConfigurationSettingsFusion")
}

func (union *ListScorecardsOutputScorecardsItemConfigurationSettingsFusion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listScorecardsOutputScorecardsItemConfigurationSettingsFusionMembers, "ListScorecardsOutputScorecardsItemConfigurationSettingsFusion")
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsStopWords struct {
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItem struct {
	Option1 *ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption1
	Option2 *ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption2
}

var listScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItem")
}

func (union *ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemMembers, "ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItem")
}

type ListScorecardsOutputScorecardsItemConfigurationSettings struct {
	Boost       ListScorecardsOutputScorecardsItemConfigurationSettingsBoost          `json:"boost"`
	Fusion      ListScorecardsOutputScorecardsItemConfigurationSettingsFusion         `json:"fusion"`
	Bm25        ListScorecardsOutputScorecardsItemConfigurationSettingsBm25           `json:"bm25"`
	StopWords   ListScorecardsOutputScorecardsItemConfigurationSettingsStopWords      `json:"stop_words"`
	Synonyms    []ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItem `json:"synonyms"`
	Language    string                                                                `json:"language"`
	ChunkTokens float64                                                               `json:"chunk_tokens"`
}

type ListScorecardsOutputScorecardsItemConfiguration struct {
	LiveIndexID string                                                  `json:"live_index_id"`
	Settings    ListScorecardsOutputScorecardsItemConfigurationSettings `json:"settings"`
}

type ListScorecardsOutputScorecardsItem struct {
	ID                 string                                           `json:"id"`
	Purpose            string                                           `json:"purpose"`
	Status             string                                           `json:"status"`
	WaitingForSearch   bool                                             `json:"waiting_for_search"`
	PassID             *string                                          `json:"pass_id"`
	Depth              float64                                          `json:"depth"`
	Score              *float64                                         `json:"score"`
	QuestionCount      *float64                                         `json:"question_count"`
	PassedCount        *float64                                         `json:"passed_count"`
	FirstCount         *float64                                         `json:"first_count"`
	MeanReciprocalRank *float64                                         `json:"mean_reciprocal_rank"`
	Tuning             *ListScorecardsOutputScorecardsItemTuning        `json:"tuning"`
	HeldBack           *ListScorecardsOutputScorecardsItemHeldBack      `json:"held_back"`
	Configuration      *ListScorecardsOutputScorecardsItemConfiguration `json:"configuration"`
	FailureMessage     *string                                          `json:"failure_message"`
	RequestedAt        string                                           `json:"requested_at"`
	StartedAt          *string                                          `json:"started_at"`
	FinishedAt         *string                                          `json:"finished_at"`
}

type ListScorecardsOutput struct {
	Scorecards []ListScorecardsOutputScorecardsItem `json:"scorecards"`
	TotalCount float64                              `json:"total_count"`
	Limit      float64                              `json:"limit"`
	Offset     float64                              `json:"offset"`
}

type ListSourceItemsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	SourceID        string  `json:"source_id"`
	ExternalID      *string `json:"external_id,omitzero"`
	State           *string `json:"state,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListSourceItemsOutputItemsItem struct {
	ExternalID string  `json:"external_id"`
	Version    float64 `json:"version"`
	Kind       string  `json:"kind"`
	DocumentID string  `json:"document_id"`
	State      string  `json:"state"`
	ReceivedAt string  `json:"received_at"`
	FileID     *string `json:"file_id"`
}

type ListSourceItemsOutput struct {
	Items      []ListSourceItemsOutputItemsItem `json:"items"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type ListSourceSyncsInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	SourceID        string  `json:"source_id"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListSourceSyncsOutputSyncsItemError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ListSourceSyncsOutputSyncsItem struct {
	ID           string                               `json:"id"`
	Status       string                               `json:"status"`
	StartedAt    string                               `json:"started_at"`
	FinishedAt   *string                              `json:"finished_at"`
	FilesAdded   float64                              `json:"files_added"`
	FilesChanged float64                              `json:"files_changed"`
	FilesRemoved float64                              `json:"files_removed"`
	Error        *ListSourceSyncsOutputSyncsItemError `json:"error"`
}

type ListSourceSyncsOutput struct {
	Syncs      []ListSourceSyncsOutputSyncsItem `json:"syncs"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type ListSourcesInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Kind            *string `json:"kind,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListSourcesOutputSourcesItemSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type ListSourcesOutputSourcesItemCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ListSourcesOutputSourcesItemLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type ListSourcesOutputSourcesItem struct {
	ID              string                                 `json:"id"`
	ProjectID       string                                 `json:"project_id"`
	KnowledgeBaseID *string                                `json:"knowledge_base_id"`
	MemoryID        *string                                `json:"memory_id"`
	Name            string                                 `json:"name"`
	Kind            string                                 `json:"kind"`
	Sorting         *string                                `json:"sorting"`
	Status          string                                 `json:"status"`
	Settings        map[string]any                         `json:"settings"`
	CredentialNames []string                               `json:"credential_names"`
	WebhookURL      *string                                `json:"webhook_url"`
	SignIn          *ListSourcesOutputSourcesItemSignIn    `json:"sign_in"`
	CreatedAt       string                                 `json:"created_at"`
	CreatedBy       ListSourcesOutputSourcesItemCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                                `json:"last_synced_at"`
	NextSyncAt      *string                                `json:"next_sync_at"`
	LastError       *ListSourcesOutputSourcesItemLastError `json:"last_error"`
}

type ListSourcesOutput struct {
	Sources    []ListSourcesOutputSourcesItem `json:"sources"`
	TotalCount float64                        `json:"total_count"`
	Limit      float64                        `json:"limit"`
	Offset     float64                        `json:"offset"`
}

type ListTableRowsInputFiltersItemValueInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ListTableRowsInputFiltersItemValueBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ListTableRowsInputFiltersItemValueItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ListTableRowsInputFiltersItemValueItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ListTableRowsInputFiltersItemValueItem struct {
	Number  *float64
	String  *string
	Integer *ListTableRowsInputFiltersItemValueItemInteger
	Blob    *ListTableRowsInputFiltersItemValueItemBlob
}

var listTableRowsInputFiltersItemValueItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union ListTableRowsInputFiltersItemValueItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsInputFiltersItemValueItem")
}

func (union *ListTableRowsInputFiltersItemValueItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsInputFiltersItemValueItemMembers, "ListTableRowsInputFiltersItemValueItem")
}

type ListTableRowsInputFiltersItemValue struct {
	Number  *float64
	String  *string
	Integer *ListTableRowsInputFiltersItemValueInteger
	Blob    *ListTableRowsInputFiltersItemValueBlob
	List    *[]Nullable[ListTableRowsInputFiltersItemValueItem]
}

var listTableRowsInputFiltersItemValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
	{kind: unionList},
}

func (union ListTableRowsInputFiltersItemValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsInputFiltersItemValue")
}

func (union *ListTableRowsInputFiltersItemValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsInputFiltersItemValueMembers, "ListTableRowsInputFiltersItemValue")
}

type ListTableRowsInputFiltersItem struct {
	Column   string                                       `json:"column"`
	Operator string                                       `json:"operator"`
	Value    Nullable[ListTableRowsInputFiltersItemValue] `json:"value,omitzero"`
}

type ListTableRowsInputSortsItem struct {
	Column    string  `json:"column"`
	Direction *string `json:"direction,omitzero"`
}

type ListTableRowsInputAfterItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ListTableRowsInputAfterItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ListTableRowsInputAfterItem struct {
	Number  *float64
	String  *string
	Integer *ListTableRowsInputAfterItemInteger
	Blob    *ListTableRowsInputAfterItemBlob
}

var listTableRowsInputAfterItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union ListTableRowsInputAfterItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsInputAfterItem")
}

func (union *ListTableRowsInputAfterItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsInputAfterItemMembers, "ListTableRowsInputAfterItem")
}

type ListTableRowsInputBeforeItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ListTableRowsInputBeforeItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ListTableRowsInputBeforeItem struct {
	Number  *float64
	String  *string
	Integer *ListTableRowsInputBeforeItemInteger
	Blob    *ListTableRowsInputBeforeItemBlob
}

var listTableRowsInputBeforeItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union ListTableRowsInputBeforeItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsInputBeforeItem")
}

func (union *ListTableRowsInputBeforeItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsInputBeforeItemMembers, "ListTableRowsInputBeforeItem")
}

type ListTableRowsInputPageSize struct {
	Integer *int64
	String  *string
}

var listTableRowsInputPageSizeMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union ListTableRowsInputPageSize) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsInputPageSize")
}

func (union *ListTableRowsInputPageSize) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsInputPageSizeMembers, "ListTableRowsInputPageSize")
}

type ListTableRowsInputOffset struct {
	Integer *int64
	String  *string
}

var listTableRowsInputOffsetMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union ListTableRowsInputOffset) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsInputOffset")
}

func (union *ListTableRowsInputOffset) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsInputOffsetMembers, "ListTableRowsInputOffset")
}

type ListTableRowsInput struct {
	ProjectID  string                                   `json:"project_id"`
	DatabaseID string                                   `json:"database_id"`
	TableName  string                                   `json:"table_name"`
	Filters    []ListTableRowsInputFiltersItem          `json:"filters,omitzero"`
	Sorts      []ListTableRowsInputSortsItem            `json:"sorts,omitzero"`
	PageSize   *ListTableRowsInputPageSize              `json:"page_size,omitzero"`
	Offset     *ListTableRowsInputOffset                `json:"offset,omitzero"`
	After      []Nullable[ListTableRowsInputAfterItem]  `json:"after,omitzero"`
	Before     []Nullable[ListTableRowsInputBeforeItem] `json:"before,omitzero"`
	LastPage   *bool                                    `json:"last_page,omitzero"`
}

type ListTableRowsOutputTableColumnsItem struct {
	Name               string  `json:"name"`
	DeclaredType       string  `json:"declared_type"`
	NotNull            bool    `json:"not_null"`
	DefaultSQL         *string `json:"default_sql"`
	PrimaryKeyPosition float64 `json:"primary_key_position"`
	Generated          bool    `json:"generated"`
}

type ListTableRowsOutputTableForeignKeysItem struct {
	Columns           []string `json:"columns"`
	ReferencesTable   string   `json:"references_table"`
	ReferencesColumns []string `json:"references_columns"`
	OnDelete          string   `json:"on_delete"`
	OnUpdate          string   `json:"on_update"`
}

type ListTableRowsOutputTableIndexesItem struct {
	Name    string   `json:"name"`
	Unique  bool     `json:"unique"`
	Columns []string `json:"columns"`
}

type ListTableRowsOutputTable struct {
	Name        string                                    `json:"name"`
	Kind        string                                    `json:"kind"`
	SQL         *string                                   `json:"sql"`
	Columns     []ListTableRowsOutputTableColumnsItem     `json:"columns"`
	RowKey      []string                                  `json:"row_key"`
	ForeignKeys []ListTableRowsOutputTableForeignKeysItem `json:"foreign_keys"`
	Indexes     []ListTableRowsOutputTableIndexesItem     `json:"indexes"`
}

type ListTableRowsOutputRowsItemKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ListTableRowsOutputRowsItemKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type ListTableRowsOutputRowsItemKeyItem struct {
	Number  *float64
	String  *string
	Integer *ListTableRowsOutputRowsItemKeyItemInteger
	Blob    *ListTableRowsOutputRowsItemKeyItemBlob
}

var listTableRowsOutputRowsItemKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union ListTableRowsOutputRowsItemKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsOutputRowsItemKeyItem")
}

func (union *ListTableRowsOutputRowsItemKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsOutputRowsItemKeyItemMembers, "ListTableRowsOutputRowsItemKeyItem")
}

type ListTableRowsOutputRowsItemCellsItemObject struct {
	Type      string  `json:"type"`
	Text      string  `json:"text"`
	Size      float64 `json:"size"`
	Truncated bool    `json:"truncated"`
}

type ListTableRowsOutputRowsItemCellsItem struct {
	Number *float64
	String *string
	Object *ListTableRowsOutputRowsItemCellsItemObject
}

var listTableRowsOutputRowsItemCellsItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text", "size", "truncated"}, properties: []string{"type", "text", "size", "truncated"}},
}

func (union ListTableRowsOutputRowsItemCellsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ListTableRowsOutputRowsItemCellsItem")
}

func (union *ListTableRowsOutputRowsItemCellsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, listTableRowsOutputRowsItemCellsItemMembers, "ListTableRowsOutputRowsItemCellsItem")
}

type ListTableRowsOutputRowsItem struct {
	Key   []*ListTableRowsOutputRowsItemKeyItem   `json:"key"`
	Cells []*ListTableRowsOutputRowsItemCellsItem `json:"cells"`
}

type ListTableRowsOutput struct {
	Table           ListTableRowsOutputTable      `json:"table"`
	Rows            []ListTableRowsOutputRowsItem `json:"rows"`
	Offset          float64                       `json:"offset"`
	PageSize        float64                       `json:"page_size"`
	RowCount        float64                       `json:"row_count"`
	RowCountCapped  bool                          `json:"row_count_capped"`
	HasPreviousPage bool                          `json:"has_previous_page"`
	HasNextPage     bool                          `json:"has_next_page"`
}

type ListVersionBlocksInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	FileID          string  `json:"file_id"`
	Version         string  `json:"version"`
	Sheet           *string `json:"sheet,omitzero"`
	FromRow         *string `json:"from_row,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type ListVersionBlocksOutputBlocksItemPlace struct {
	Page        *float64 `json:"page"`
	Sheet       *string  `json:"sheet"`
	Row         *float64 `json:"row"`
	Slide       *float64 `json:"slide"`
	StartSecond *float64 `json:"start_second"`
	EndSecond   *float64 `json:"end_second"`
}

type ListVersionBlocksOutputBlocksItem struct {
	Position     float64                                `json:"position"`
	Kind         string                                 `json:"kind"`
	HeadingLevel *float64                               `json:"heading_level"`
	Text         string                                 `json:"text"`
	Place        ListVersionBlocksOutputBlocksItemPlace `json:"place"`
}

type ListVersionBlocksOutput struct {
	Blocks     []ListVersionBlocksOutputBlocksItem `json:"blocks"`
	TotalCount float64                             `json:"total_count"`
	Limit      float64                             `json:"limit"`
	Offset     float64                             `json:"offset"`
}

type PreviewCreateTableInputColumnsItemDefaultValueValue struct {
	Number *float64
	String *string
}

var previewCreateTableInputColumnsItemDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union PreviewCreateTableInputColumnsItemDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewCreateTableInputColumnsItemDefaultValueValue")
}

func (union *PreviewCreateTableInputColumnsItemDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewCreateTableInputColumnsItemDefaultValueValueMembers, "PreviewCreateTableInputColumnsItemDefaultValueValue")
}

type PreviewCreateTableInputColumnsItemDefaultValue struct {
	Kind  string                                              `json:"kind"`
	Value PreviewCreateTableInputColumnsItemDefaultValueValue `json:"value"`
}

type PreviewCreateTableInputColumnsItemDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type PreviewCreateTableInputColumnsItemDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type PreviewCreateTableInputColumnsItemDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type PreviewCreateTableInputColumnsItemDefault struct {
	Value            *PreviewCreateTableInputColumnsItemDefaultValue
	CurrentTimestamp *PreviewCreateTableInputColumnsItemDefaultCurrentTimestamp
	CurrentDate      *PreviewCreateTableInputColumnsItemDefaultCurrentDate
	CurrentTime      *PreviewCreateTableInputColumnsItemDefaultCurrentTime
}

var previewCreateTableInputColumnsItemDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union PreviewCreateTableInputColumnsItemDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewCreateTableInputColumnsItemDefault")
}

func (union *PreviewCreateTableInputColumnsItemDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewCreateTableInputColumnsItemDefaultMembers, "PreviewCreateTableInputColumnsItemDefault")
}

type PreviewCreateTableInputColumnsItemReferences struct {
	Table    string  `json:"table"`
	Column   string  `json:"column"`
	OnDelete *string `json:"on_delete,omitzero"`
	OnUpdate *string `json:"on_update,omitzero"`
}

type PreviewCreateTableInputColumnsItem struct {
	Name       string                                                 `json:"name"`
	Type       string                                                 `json:"type"`
	NotNull    *bool                                                  `json:"not_null,omitzero"`
	Default    Nullable[PreviewCreateTableInputColumnsItemDefault]    `json:"default,omitzero"`
	PrimaryKey *bool                                                  `json:"primary_key,omitzero"`
	Unique     *bool                                                  `json:"unique,omitzero"`
	References Nullable[PreviewCreateTableInputColumnsItemReferences] `json:"references,omitzero"`
}

type PreviewCreateTableInput struct {
	ProjectID  string                               `json:"project_id"`
	DatabaseID string                               `json:"database_id"`
	TableName  string                               `json:"table_name"`
	Columns    []PreviewCreateTableInputColumnsItem `json:"columns"`
}

type PreviewCreateTableOutputPreview struct {
	TableName            string  `json:"table_name"`
	MigrationName        string  `json:"migration_name"`
	SQL                  string  `json:"sql"`
	BaseMigrationVersion float64 `json:"base_migration_version"`
}

type PreviewCreateTableOutput struct {
	Preview PreviewCreateTableOutputPreview `json:"preview"`
}

type PreviewIndexSearchInputPinnedItemRank struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputPinnedItemRankMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputPinnedItemRank) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputPinnedItemRank")
}

func (union *PreviewIndexSearchInputPinnedItemRank) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputPinnedItemRankMembers, "PreviewIndexSearchInputPinnedItemRank")
}

type PreviewIndexSearchInputPinnedItem struct {
	RecordID string                                `json:"record_id"`
	Rank     PreviewIndexSearchInputPinnedItemRank `json:"rank"`
}

type PreviewIndexSearchInputFacetRangesValueItem struct {
	From float64 `json:"from"`
	To   float64 `json:"to"`
}

type PreviewIndexSearchInputFields struct {
	String *string
	List   *[]string
}

var previewIndexSearchInputFieldsMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union PreviewIndexSearchInputFields) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputFields")
}

func (union *PreviewIndexSearchInputFields) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputFieldsMembers, "PreviewIndexSearchInputFields")
}

type PreviewIndexSearchInputBoosts struct {
	String *string
	Map    *map[string]any
}

var previewIndexSearchInputBoostsMembers = []unionMember{
	{kind: unionString},
	{kind: unionMap},
}

func (union PreviewIndexSearchInputBoosts) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputBoosts")
}

func (union *PreviewIndexSearchInputBoosts) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputBoostsMembers, "PreviewIndexSearchInputBoosts")
}

type PreviewIndexSearchInputTermMatch struct {
	String  *string
	Integer *int64
}

var previewIndexSearchInputTermMatchMembers = []unionMember{
	{kind: unionString},
	{kind: unionInteger},
}

func (union PreviewIndexSearchInputTermMatch) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputTermMatch")
}

func (union *PreviewIndexSearchInputTermMatch) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputTermMatchMembers, "PreviewIndexSearchInputTermMatch")
}

type PreviewIndexSearchInputTolerance struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputToleranceMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputTolerance) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputTolerance")
}

func (union *PreviewIndexSearchInputTolerance) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputToleranceMembers, "PreviewIndexSearchInputTolerance")
}

type PreviewIndexSearchInputPrefixLength struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputPrefixLengthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputPrefixLength) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputPrefixLength")
}

func (union *PreviewIndexSearchInputPrefixLength) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputPrefixLengthMembers, "PreviewIndexSearchInputPrefixLength")
}

type PreviewIndexSearchInputMinimumScore struct {
	Number *float64
	String *string
}

var previewIndexSearchInputMinimumScoreMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union PreviewIndexSearchInputMinimumScore) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputMinimumScore")
}

func (union *PreviewIndexSearchInputMinimumScore) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputMinimumScoreMembers, "PreviewIndexSearchInputMinimumScore")
}

type PreviewIndexSearchInputFusionConstant struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputFusionConstantMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputFusionConstant) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputFusionConstant")
}

func (union *PreviewIndexSearchInputFusionConstant) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputFusionConstantMembers, "PreviewIndexSearchInputFusionConstant")
}

type PreviewIndexSearchInputVectorWeight struct {
	Number *float64
	String *string
}

var previewIndexSearchInputVectorWeightMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union PreviewIndexSearchInputVectorWeight) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputVectorWeight")
}

func (union *PreviewIndexSearchInputVectorWeight) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputVectorWeightMembers, "PreviewIndexSearchInputVectorWeight")
}

type PreviewIndexSearchInputMinimumSimilarity struct {
	Number *float64
	String *string
}

var previewIndexSearchInputMinimumSimilarityMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union PreviewIndexSearchInputMinimumSimilarity) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputMinimumSimilarity")
}

func (union *PreviewIndexSearchInputMinimumSimilarity) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputMinimumSimilarityMembers, "PreviewIndexSearchInputMinimumSimilarity")
}

type PreviewIndexSearchInputVectorCandidates struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputVectorCandidatesMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputVectorCandidates) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputVectorCandidates")
}

func (union *PreviewIndexSearchInputVectorCandidates) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputVectorCandidatesMembers, "PreviewIndexSearchInputVectorCandidates")
}

type PreviewIndexSearchInputGroupBy struct {
	String *string
	List   *[]string
}

var previewIndexSearchInputGroupByMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union PreviewIndexSearchInputGroupBy) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputGroupBy")
}

func (union *PreviewIndexSearchInputGroupBy) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputGroupByMembers, "PreviewIndexSearchInputGroupBy")
}

type PreviewIndexSearchInputGroupSize struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputGroupSizeMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputGroupSize) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputGroupSize")
}

func (union *PreviewIndexSearchInputGroupSize) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputGroupSizeMembers, "PreviewIndexSearchInputGroupSize")
}

type PreviewIndexSearchInputFacets struct {
	String *string
	List   *[]string
}

var previewIndexSearchInputFacetsMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union PreviewIndexSearchInputFacets) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputFacets")
}

func (union *PreviewIndexSearchInputFacets) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputFacetsMembers, "PreviewIndexSearchInputFacets")
}

type PreviewIndexSearchInputFacetLimit struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputFacetLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputFacetLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputFacetLimit")
}

func (union *PreviewIndexSearchInputFacetLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputFacetLimitMembers, "PreviewIndexSearchInputFacetLimit")
}

type PreviewIndexSearchInputOffset struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputOffsetMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputOffset) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputOffset")
}

func (union *PreviewIndexSearchInputOffset) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputOffsetMembers, "PreviewIndexSearchInputOffset")
}

type PreviewIndexSearchInputLimit struct {
	Integer *int64
	String  *string
}

var previewIndexSearchInputLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union PreviewIndexSearchInputLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchInputLimit")
}

func (union *PreviewIndexSearchInputLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchInputLimitMembers, "PreviewIndexSearchInputLimit")
}

type PreviewIndexSearchInput struct {
	ProjectID         string                                                   `json:"project_id"`
	IndexID           string                                                   `json:"index_id"`
	Query             string                                                   `json:"query"`
	Filters           *string                                                  `json:"filters,omitzero"`
	Mode              *string                                                  `json:"mode,omitzero"`
	VectorField       *string                                                  `json:"vector_field,omitzero"`
	Fields            *PreviewIndexSearchInputFields                           `json:"fields,omitzero"`
	Boosts            *PreviewIndexSearchInputBoosts                           `json:"boosts,omitzero"`
	TermMatch         *PreviewIndexSearchInputTermMatch                        `json:"term_match,omitzero"`
	Tolerance         *PreviewIndexSearchInputTolerance                        `json:"tolerance,omitzero"`
	PrefixLength      *PreviewIndexSearchInputPrefixLength                     `json:"prefix_length,omitzero"`
	Exact             *bool                                                    `json:"exact,omitzero"`
	Prefix            *bool                                                    `json:"prefix,omitzero"`
	PartialWords      *bool                                                    `json:"partial_words,omitzero"`
	MinimumScore      *PreviewIndexSearchInputMinimumScore                     `json:"minimum_score,omitzero"`
	Fusion            *string                                                  `json:"fusion,omitzero"`
	FusionConstant    *PreviewIndexSearchInputFusionConstant                   `json:"fusion_constant,omitzero"`
	VectorWeight      *PreviewIndexSearchInputVectorWeight                     `json:"vector_weight,omitzero"`
	MinimumSimilarity *PreviewIndexSearchInputMinimumSimilarity                `json:"minimum_similarity,omitzero"`
	VectorCandidates  *PreviewIndexSearchInputVectorCandidates                 `json:"vector_candidates,omitzero"`
	Sort              *string                                                  `json:"sort,omitzero"`
	Direction         *string                                                  `json:"direction,omitzero"`
	Pinned            []PreviewIndexSearchInputPinnedItem                      `json:"pinned,omitzero"`
	GroupBy           *PreviewIndexSearchInputGroupBy                          `json:"group_by,omitzero"`
	GroupSize         *PreviewIndexSearchInputGroupSize                        `json:"group_size,omitzero"`
	Facets            *PreviewIndexSearchInputFacets                           `json:"facets,omitzero"`
	FacetLimit        *PreviewIndexSearchInputFacetLimit                       `json:"facet_limit,omitzero"`
	FacetFilters      *string                                                  `json:"facet_filters,omitzero"`
	FacetRanges       map[string][]PreviewIndexSearchInputFacetRangesValueItem `json:"facet_ranges,omitzero"`
	Offset            *PreviewIndexSearchInputOffset                           `json:"offset,omitzero"`
	Limit             *PreviewIndexSearchInputLimit                            `json:"limit,omitzero"`
}

type PreviewIndexSearchOutputSort struct {
	Field     string `json:"field"`
	Direction string `json:"direction"`
}

type PreviewIndexSearchOutputTuningTermMatch struct {
	String *string
	Number *float64
}

var previewIndexSearchOutputTuningTermMatchMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
}

func (union PreviewIndexSearchOutputTuningTermMatch) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewIndexSearchOutputTuningTermMatch")
}

func (union *PreviewIndexSearchOutputTuningTermMatch) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewIndexSearchOutputTuningTermMatchMembers, "PreviewIndexSearchOutputTuningTermMatch")
}

type PreviewIndexSearchOutputTuning struct {
	Fields            []string                                 `json:"fields,omitzero"`
	Boosts            map[string]float64                       `json:"boosts,omitzero"`
	TermMatch         *PreviewIndexSearchOutputTuningTermMatch `json:"term_match,omitzero"`
	Tolerance         *float64                                 `json:"tolerance,omitzero"`
	PrefixLength      *float64                                 `json:"prefix_length,omitzero"`
	Exact             *bool                                    `json:"exact,omitzero"`
	Prefix            *bool                                    `json:"prefix,omitzero"`
	PartialWords      *bool                                    `json:"partial_words,omitzero"`
	MinimumScore      *float64                                 `json:"minimum_score,omitzero"`
	Fusion            *string                                  `json:"fusion,omitzero"`
	FusionConstant    *float64                                 `json:"fusion_constant,omitzero"`
	VectorWeight      *float64                                 `json:"vector_weight,omitzero"`
	MinimumSimilarity *float64                                 `json:"minimum_similarity,omitzero"`
	VectorCandidates  *float64                                 `json:"vector_candidates,omitzero"`
}

type PreviewIndexSearchOutputFacetsItemValuesItem struct {
	Value string   `json:"value"`
	Count float64  `json:"count"`
	From  *float64 `json:"from"`
	To    *float64 `json:"to"`
}

type PreviewIndexSearchOutputFacetsItem struct {
	Field      string                                         `json:"field"`
	Counted    string                                         `json:"counted"`
	Values     []PreviewIndexSearchOutputFacetsItemValuesItem `json:"values"`
	ErrorBound float64                                        `json:"error_bound"`
}

type PreviewIndexSearchOutputGroupsItem struct {
	Values map[string]any `json:"values"`
	Count  *float64       `json:"count"`
}

type PreviewIndexSearchOutputResultsItemKeywordTermsItemFieldsItem struct {
	Field       string  `json:"field"`
	Count       float64 `json:"count"`
	FieldLength float64 `json:"field_length"`
}

type PreviewIndexSearchOutputResultsItemKeywordTermsItem struct {
	Term   string                                                          `json:"term"`
	Weight float64                                                         `json:"weight"`
	Fields []PreviewIndexSearchOutputResultsItemKeywordTermsItemFieldsItem `json:"fields"`
}

type PreviewIndexSearchOutputResultsItemKeywordFieldScoresItem struct {
	Field string  `json:"field"`
	Score float64 `json:"score"`
}

type PreviewIndexSearchOutputResultsItemKeyword struct {
	Rank        *float64                                                    `json:"rank"`
	Score       *float64                                                    `json:"score"`
	Terms       []PreviewIndexSearchOutputResultsItemKeywordTermsItem       `json:"terms"`
	FieldScores []PreviewIndexSearchOutputResultsItemKeywordFieldScoresItem `json:"field_scores"`
}

type PreviewIndexSearchOutputResultsItemVector struct {
	Rank       *float64 `json:"rank"`
	Similarity *float64 `json:"similarity"`
}

type PreviewIndexSearchOutputResultsItemHighlightsItemMarksItem struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type PreviewIndexSearchOutputResultsItemHighlightsItem struct {
	Field string                                                       `json:"field"`
	Marks []PreviewIndexSearchOutputResultsItemHighlightsItemMarksItem `json:"marks"`
}

type PreviewIndexSearchOutputResultsItem struct {
	Rank       float64                                             `json:"rank"`
	ID         string                                              `json:"id"`
	Score      float64                                             `json:"score"`
	Record     map[string]any                                      `json:"record"`
	Keyword    PreviewIndexSearchOutputResultsItemKeyword          `json:"keyword"`
	Vector     *PreviewIndexSearchOutputResultsItemVector          `json:"vector"`
	Highlights []PreviewIndexSearchOutputResultsItemHighlightsItem `json:"highlights"`
	Pinned     bool                                                `json:"pinned"`
	Group      *float64                                            `json:"group"`
}

type PreviewIndexSearchOutput struct {
	Mode           string                                `json:"mode"`
	VectorField    *string                               `json:"vector_field"`
	Fusion         *string                               `json:"fusion"`
	FusionConstant *float64                              `json:"fusion_constant"`
	VectorWeight   *float64                              `json:"vector_weight"`
	Sort           *PreviewIndexSearchOutputSort         `json:"sort"`
	Tuning         PreviewIndexSearchOutputTuning        `json:"tuning"`
	Facets         []PreviewIndexSearchOutputFacetsItem  `json:"facets"`
	Groups         []PreviewIndexSearchOutputGroupsItem  `json:"groups"`
	GroupCount     *float64                              `json:"group_count"`
	TotalCount     float64                               `json:"total_count"`
	TotalIsExact   bool                                  `json:"total_is_exact"`
	Offset         float64                               `json:"offset"`
	NextOffset     *float64                              `json:"next_offset"`
	DurationMs     float64                               `json:"duration_ms"`
	Results        []PreviewIndexSearchOutputResultsItem `json:"results"`
}

type PreviewTableColumnChangesInputChangesItemAddDefaultValueValue struct {
	Number *float64
	String *string
}

var previewTableColumnChangesInputChangesItemAddDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union PreviewTableColumnChangesInputChangesItemAddDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewTableColumnChangesInputChangesItemAddDefaultValueValue")
}

func (union *PreviewTableColumnChangesInputChangesItemAddDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewTableColumnChangesInputChangesItemAddDefaultValueValueMembers, "PreviewTableColumnChangesInputChangesItemAddDefaultValueValue")
}

type PreviewTableColumnChangesInputChangesItemAddDefaultValue struct {
	Kind  string                                                        `json:"kind"`
	Value PreviewTableColumnChangesInputChangesItemAddDefaultValueValue `json:"value"`
}

type PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type PreviewTableColumnChangesInputChangesItemAddDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type PreviewTableColumnChangesInputChangesItemAddDefault struct {
	Value            *PreviewTableColumnChangesInputChangesItemAddDefaultValue
	CurrentTimestamp *PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTimestamp
	CurrentDate      *PreviewTableColumnChangesInputChangesItemAddDefaultCurrentDate
	CurrentTime      *PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTime
}

var previewTableColumnChangesInputChangesItemAddDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union PreviewTableColumnChangesInputChangesItemAddDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewTableColumnChangesInputChangesItemAddDefault")
}

func (union *PreviewTableColumnChangesInputChangesItemAddDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewTableColumnChangesInputChangesItemAddDefaultMembers, "PreviewTableColumnChangesInputChangesItemAddDefault")
}

type PreviewTableColumnChangesInputChangesItemAddPositionBefore struct {
	Side   string `json:"side"`
	Column string `json:"column"`
}

type PreviewTableColumnChangesInputChangesItemAddPositionAfter struct {
	Side   string `json:"side"`
	Column string `json:"column"`
}

type PreviewTableColumnChangesInputChangesItemAddPosition struct {
	Before *PreviewTableColumnChangesInputChangesItemAddPositionBefore
	After  *PreviewTableColumnChangesInputChangesItemAddPositionAfter
}

var previewTableColumnChangesInputChangesItemAddPositionMembers = []unionMember{
	{kind: unionObject, required: []string{"side", "column"}, properties: []string{"side", "column"}, constants: map[string]any{"side": "before"}},
	{kind: unionObject, required: []string{"side", "column"}, properties: []string{"side", "column"}, constants: map[string]any{"side": "after"}},
}

func (union PreviewTableColumnChangesInputChangesItemAddPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewTableColumnChangesInputChangesItemAddPosition")
}

func (union *PreviewTableColumnChangesInputChangesItemAddPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewTableColumnChangesInputChangesItemAddPositionMembers, "PreviewTableColumnChangesInputChangesItemAddPosition")
}

type PreviewTableColumnChangesInputChangesItemAdd struct {
	Kind     string                                                        `json:"kind"`
	Name     string                                                        `json:"name"`
	Type     string                                                        `json:"type"`
	NotNull  *bool                                                         `json:"not_null,omitzero"`
	Default  Nullable[PreviewTableColumnChangesInputChangesItemAddDefault] `json:"default,omitzero"`
	Position *PreviewTableColumnChangesInputChangesItemAddPosition         `json:"position,omitzero"`
}

type PreviewTableColumnChangesInputChangesItemRename struct {
	Kind    string `json:"kind"`
	Column  string `json:"column"`
	NewName string `json:"new_name"`
}

type PreviewTableColumnChangesInputChangesItemAlterDefaultValueValue struct {
	Number *float64
	String *string
}

var previewTableColumnChangesInputChangesItemAlterDefaultValueValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union PreviewTableColumnChangesInputChangesItemAlterDefaultValueValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewTableColumnChangesInputChangesItemAlterDefaultValueValue")
}

func (union *PreviewTableColumnChangesInputChangesItemAlterDefaultValueValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewTableColumnChangesInputChangesItemAlterDefaultValueValueMembers, "PreviewTableColumnChangesInputChangesItemAlterDefaultValueValue")
}

type PreviewTableColumnChangesInputChangesItemAlterDefaultValue struct {
	Kind  string                                                          `json:"kind"`
	Value PreviewTableColumnChangesInputChangesItemAlterDefaultValueValue `json:"value"`
}

type PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTimestamp struct {
	Kind string `json:"kind"`
}

type PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentDate struct {
	Kind string `json:"kind"`
}

type PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTime struct {
	Kind string `json:"kind"`
}

type PreviewTableColumnChangesInputChangesItemAlterDefault struct {
	Value            *PreviewTableColumnChangesInputChangesItemAlterDefaultValue
	CurrentTimestamp *PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTimestamp
	CurrentDate      *PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentDate
	CurrentTime      *PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTime
}

var previewTableColumnChangesInputChangesItemAlterDefaultMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "value"}, properties: []string{"kind", "value"}, constants: map[string]any{"kind": "value"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_timestamp"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_date"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "current_time"}},
}

func (union PreviewTableColumnChangesInputChangesItemAlterDefault) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewTableColumnChangesInputChangesItemAlterDefault")
}

func (union *PreviewTableColumnChangesInputChangesItemAlterDefault) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewTableColumnChangesInputChangesItemAlterDefaultMembers, "PreviewTableColumnChangesInputChangesItemAlterDefault")
}

type PreviewTableColumnChangesInputChangesItemAlter struct {
	Kind    string                                                          `json:"kind"`
	Column  string                                                          `json:"column"`
	Type    *string                                                         `json:"type,omitzero"`
	NotNull *bool                                                           `json:"not_null,omitzero"`
	Default Nullable[PreviewTableColumnChangesInputChangesItemAlterDefault] `json:"default,omitzero"`
}

type PreviewTableColumnChangesInputChangesItemDrop struct {
	Kind   string `json:"kind"`
	Column string `json:"column"`
}

type PreviewTableColumnChangesInputChangesItem struct {
	Add    *PreviewTableColumnChangesInputChangesItemAdd
	Rename *PreviewTableColumnChangesInputChangesItemRename
	Alter  *PreviewTableColumnChangesInputChangesItemAlter
	Drop   *PreviewTableColumnChangesInputChangesItemDrop
}

var previewTableColumnChangesInputChangesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "name", "type"}, properties: []string{"kind", "name", "type", "not_null", "default", "position"}, constants: map[string]any{"kind": "add"}},
	{kind: unionObject, required: []string{"kind", "column", "new_name"}, properties: []string{"kind", "column", "new_name"}, constants: map[string]any{"kind": "rename"}},
	{kind: unionObject, required: []string{"kind", "column"}, properties: []string{"kind", "column", "type", "not_null", "default"}, constants: map[string]any{"kind": "alter"}},
	{kind: unionObject, required: []string{"kind", "column"}, properties: []string{"kind", "column"}, constants: map[string]any{"kind": "drop"}},
}

func (union PreviewTableColumnChangesInputChangesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PreviewTableColumnChangesInputChangesItem")
}

func (union *PreviewTableColumnChangesInputChangesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, previewTableColumnChangesInputChangesItemMembers, "PreviewTableColumnChangesInputChangesItem")
}

type PreviewTableColumnChangesInput struct {
	ProjectID  string                                      `json:"project_id"`
	DatabaseID string                                      `json:"database_id"`
	TableName  string                                      `json:"table_name"`
	Changes    []PreviewTableColumnChangesInputChangesItem `json:"changes"`
}

type PreviewTableColumnChangesOutputPreviewRowChecksItem struct {
	Column       string  `json:"column"`
	Check        string  `json:"check"`
	Rows         float64 `json:"rows"`
	RowsCapped   bool    `json:"rows_capped"`
	BlocksChange bool    `json:"blocks_change"`
}

type PreviewTableColumnChangesOutputPreview struct {
	TableName            string                                                `json:"table_name"`
	MigrationName        string                                                `json:"migration_name"`
	SQL                  string                                                `json:"sql"`
	BaseMigrationVersion float64                                               `json:"base_migration_version"`
	RebuildsTable        bool                                                  `json:"rebuilds_table"`
	Destructive          bool                                                  `json:"destructive"`
	Blocked              bool                                                  `json:"blocked"`
	Warnings             []string                                              `json:"warnings"`
	RowCount             float64                                               `json:"row_count"`
	RowCountCapped       bool                                                  `json:"row_count_capped"`
	RowChecks            []PreviewTableColumnChangesOutputPreviewRowChecksItem `json:"row_checks"`
	ColumnsBefore        []string                                              `json:"columns_before"`
	ColumnsAfter         []string                                              `json:"columns_after"`
	ChangedColumns       []string                                              `json:"changed_columns"`
}

type PreviewTableColumnChangesOutput struct {
	Preview PreviewTableColumnChangesOutputPreview `json:"preview"`
}

type PromoteCorrectionInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	CorrectionID    string  `json:"correction_id"`
	Note            *string `json:"note,omitzero"`
}

type PromoteCorrectionOutputSettingFieldBoost struct {
	Kind    string  `json:"kind"`
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type PromoteCorrectionOutputSettingOption1 struct {
	Kind         string `json:"kind"`
	Strategy     string `json:"strategy"`
	RankConstant int64  `json:"rank_constant"`
}

type PromoteCorrectionOutputSettingOption2 struct {
	Kind         string  `json:"kind"`
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type PromoteCorrectionOutputSettingBm25 struct {
	Kind string  `json:"kind"`
	K1   float64 `json:"k1"`
	B    float64 `json:"b"`
}

type PromoteCorrectionOutputSettingStopWords struct {
	Kind    string   `json:"kind"`
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type PromoteCorrectionOutputSettingSynonymsRulesItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type PromoteCorrectionOutputSettingSynonymsRulesItemOption2 struct {
	Words []string `json:"words"`
}

type PromoteCorrectionOutputSettingSynonymsRulesItem struct {
	Option1 *PromoteCorrectionOutputSettingSynonymsRulesItemOption1
	Option2 *PromoteCorrectionOutputSettingSynonymsRulesItemOption2
}

var promoteCorrectionOutputSettingSynonymsRulesItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union PromoteCorrectionOutputSettingSynonymsRulesItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PromoteCorrectionOutputSettingSynonymsRulesItem")
}

func (union *PromoteCorrectionOutputSettingSynonymsRulesItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, promoteCorrectionOutputSettingSynonymsRulesItemMembers, "PromoteCorrectionOutputSettingSynonymsRulesItem")
}

type PromoteCorrectionOutputSettingSynonyms struct {
	Kind  string                                            `json:"kind"`
	Rules []PromoteCorrectionOutputSettingSynonymsRulesItem `json:"rules"`
}

type PromoteCorrectionOutputSettingLanguage struct {
	Kind     string `json:"kind"`
	Language string `json:"language"`
}

type PromoteCorrectionOutputSettingChunking struct {
	Kind        string `json:"kind"`
	ChunkTokens int64  `json:"chunk_tokens"`
}

type PromoteCorrectionOutputSettingRebuild struct {
	Kind string `json:"kind"`
}

type PromoteCorrectionOutputSettingAgentDepth struct {
	Kind  string  `json:"kind"`
	Depth float64 `json:"depth"`
}

type PromoteCorrectionOutputSetting struct {
	FieldBoost *PromoteCorrectionOutputSettingFieldBoost
	Option1    *PromoteCorrectionOutputSettingOption1
	Option2    *PromoteCorrectionOutputSettingOption2
	Bm25       *PromoteCorrectionOutputSettingBm25
	StopWords  *PromoteCorrectionOutputSettingStopWords
	Synonyms   *PromoteCorrectionOutputSettingSynonyms
	Language   *PromoteCorrectionOutputSettingLanguage
	Chunking   *PromoteCorrectionOutputSettingChunking
	Rebuild    *PromoteCorrectionOutputSettingRebuild
	AgentDepth *PromoteCorrectionOutputSettingAgentDepth
}

var promoteCorrectionOutputSettingMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "text", "heading"}, properties: []string{"kind", "text", "heading"}, constants: map[string]any{"kind": "field_boost"}},
	{kind: unionObject, required: []string{"kind", "strategy", "rank_constant"}, properties: []string{"kind", "strategy", "rank_constant"}, constants: map[string]any{"kind": "fusion", "strategy": "rrf"}},
	{kind: unionObject, required: []string{"kind", "strategy", "vector_weight"}, properties: []string{"kind", "strategy", "vector_weight"}, constants: map[string]any{"kind": "fusion", "strategy": "linear"}},
	{kind: unionObject, required: []string{"kind", "k1", "b"}, properties: []string{"kind", "k1", "b"}, constants: map[string]any{"kind": "bm25"}},
	{kind: unionObject, required: []string{"kind", "added", "removed"}, properties: []string{"kind", "added", "removed"}, constants: map[string]any{"kind": "stop_words"}},
	{kind: unionObject, required: []string{"kind", "rules"}, properties: []string{"kind", "rules"}, constants: map[string]any{"kind": "synonyms"}},
	{kind: unionObject, required: []string{"kind", "language"}, properties: []string{"kind", "language"}, constants: map[string]any{"kind": "language"}},
	{kind: unionObject, required: []string{"kind", "chunk_tokens"}, properties: []string{"kind", "chunk_tokens"}, constants: map[string]any{"kind": "chunking"}},
	{kind: unionObject, required: []string{"kind"}, properties: []string{"kind"}, constants: map[string]any{"kind": "rebuild"}},
	{kind: unionObject, required: []string{"kind", "depth"}, properties: []string{"kind", "depth"}, constants: map[string]any{"kind": "agent_depth"}},
}

func (union PromoteCorrectionOutputSetting) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PromoteCorrectionOutputSetting")
}

func (union *PromoteCorrectionOutputSetting) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, promoteCorrectionOutputSettingMembers, "PromoteCorrectionOutputSetting")
}

type PromoteCorrectionOutputEstimate struct {
	Seconds          float64  `json:"seconds"`
	MemoryBytes      float64  `json:"memory_bytes"`
	SecondIndex      bool     `json:"second_index"`
	ChunksToIndex    float64  `json:"chunks_to_index"`
	QuestionsToScore float64  `json:"questions_to_score"`
	PriceUsd         *float64 `json:"price_usd"`
}

type PromoteCorrectionOutputBeforeTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type PromoteCorrectionOutputBeforeHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type PromoteCorrectionOutputBefore struct {
	ScorecardID *string                               `json:"scorecard_id"`
	Tuning      PromoteCorrectionOutputBeforeTuning   `json:"tuning"`
	HeldBack    PromoteCorrectionOutputBeforeHeldBack `json:"held_back"`
}

type PromoteCorrectionOutputAfterTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type PromoteCorrectionOutputAfterHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type PromoteCorrectionOutputAfter struct {
	ScorecardID *string                              `json:"scorecard_id"`
	Tuning      PromoteCorrectionOutputAfterTuning   `json:"tuning"`
	HeldBack    PromoteCorrectionOutputAfterHeldBack `json:"held_back"`
}

type PromoteCorrectionOutputQuestionChanges struct {
	NowPass   float64 `json:"now_pass"`
	NowFail   float64 `json:"now_fail"`
	MovedUp   float64 `json:"moved_up"`
	MovedDown float64 `json:"moved_down"`
}

type PromoteCorrectionOutput struct {
	ID              string                                  `json:"id"`
	Origin          string                                  `json:"origin"`
	Cause           *string                                 `json:"cause"`
	Kind            string                                  `json:"kind"`
	Setting         PromoteCorrectionOutputSetting          `json:"setting"`
	TargetIDs       []string                                `json:"target_ids"`
	FileKinds       []string                                `json:"file_kinds"`
	Status          string                                  `json:"status"`
	PassID          *string                                 `json:"pass_id"`
	Estimate        PromoteCorrectionOutputEstimate         `json:"estimate"`
	Before          *PromoteCorrectionOutputBefore          `json:"before"`
	After           *PromoteCorrectionOutputAfter           `json:"after"`
	Verdict         string                                  `json:"verdict"`
	QuestionChanges *PromoteCorrectionOutputQuestionChanges `json:"question_changes"`
	WaitsForClick   bool                                    `json:"waits_for_click"`
	WaitReason      *string                                 `json:"wait_reason"`
	DecidedBy       *string                                 `json:"decided_by"`
	DecisionNote    *string                                 `json:"decision_note"`
	FailureMessage  *string                                 `json:"failure_message"`
	CreatedAt       string                                  `json:"created_at"`
	TriedAt         *string                                 `json:"tried_at"`
	DecidedAt       *string                                 `json:"decided_at"`
}

type PromoteMemoryInput struct {
	ProjectID      string  `json:"project_id"`
	MemoryID       string  `json:"memory_id"`
	StoredMemoryID string  `json:"stored_memory_id"`
	Scope          string  `json:"scope"`
	TeamID         *string `json:"team_id,omitzero"`
}

type PromoteMemoryOutputValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var promoteMemoryOutputValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union PromoteMemoryOutputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "PromoteMemoryOutputValuesValue")
}

func (union *PromoteMemoryOutputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, promoteMemoryOutputValuesValueMembers, "PromoteMemoryOutputValuesValue")
}

type PromoteMemoryOutputPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type PromoteMemoryOutputSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type PromoteMemoryOutput struct {
	ID                 string                                     `json:"id"`
	MemoryID           string                                     `json:"memory_id"`
	Type               string                                     `json:"type"`
	Scope              string                                     `json:"scope"`
	OwnerID            *string                                    `json:"owner_id"`
	Personal           bool                                       `json:"personal"`
	TrustLevel         string                                     `json:"trust_level"`
	Text               string                                     `json:"text"`
	Subject            string                                     `json:"subject"`
	Values             map[string]*PromoteMemoryOutputValuesValue `json:"values"`
	Plan               *PromoteMemoryOutputPlan                   `json:"plan"`
	Sensitive          bool                                       `json:"sensitive"`
	InstructionLike    bool                                       `json:"instruction_like"`
	SortedBy           string                                     `json:"sorted_by"`
	ConnectionStrength float64                                    `json:"connection_strength"`
	RecallStrength     float64                                    `json:"recall_strength"`
	Sources            []PromoteMemoryOutputSourcesItem           `json:"sources"`
	ReplacedBy         *string                                    `json:"replaced_by"`
	HeldUntil          *string                                    `json:"held_until"`
	ExpiresAt          *string                                    `json:"expires_at"`
	LastCheckedAt      *string                                    `json:"last_checked_at"`
	ForgottenAt        *string                                    `json:"forgotten_at"`
	PurgeAfter         *string                                    `json:"purge_after"`
	OccurredAt         string                                     `json:"occurred_at"`
	CreatedAt          string                                     `json:"created_at"`
	UpdatedAt          string                                     `json:"updated_at"`
}

type ProposeCorrectionsInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type ProposeCorrectionsOutput struct {
	ID                string   `json:"id"`
	Trigger           string   `json:"trigger"`
	Mode              string   `json:"mode"`
	Status            string   `json:"status"`
	CompleteIndex     bool     `json:"complete_index"`
	BeforeScorecardID *string  `json:"before_scorecard_id"`
	AfterScorecardID  *string  `json:"after_scorecard_id"`
	CorrectionIDs     []string `json:"correction_ids"`
	FailureMessage    *string  `json:"failure_message"`
	RequestedAt       string   `json:"requested_at"`
	StartedAt         *string  `json:"started_at"`
	FinishedAt        *string  `json:"finished_at"`
}

type ProposeDatabaseChangeInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
	Request    string `json:"request"`
}

type ProposeDatabaseChangeOutputProposalTablesItem struct {
	Name          string   `json:"name"`
	Change        string   `json:"change"`
	ColumnsBefore []string `json:"columns_before"`
	ColumnsAfter  []string `json:"columns_after"`
}

type ProposeDatabaseChangeOutputProposal struct {
	Summary              string                                          `json:"summary"`
	MigrationName        string                                          `json:"migration_name"`
	SQL                  string                                          `json:"sql"`
	Destructive          bool                                            `json:"destructive"`
	Warnings             []string                                        `json:"warnings"`
	BaseMigrationVersion float64                                         `json:"base_migration_version"`
	Tables               []ProposeDatabaseChangeOutputProposalTablesItem `json:"tables"`
}

type ProposeDatabaseChangeOutput struct {
	Proposal ProposeDatabaseChangeOutputProposal `json:"proposal"`
}

type RecallMemoriesInputType struct {
	String *string
	List   *[]string
}

var recallMemoriesInputTypeMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union RecallMemoriesInputType) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RecallMemoriesInputType")
}

func (union *RecallMemoriesInputType) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, recallMemoriesInputTypeMembers, "RecallMemoriesInputType")
}

type RecallMemoriesInputLimit struct {
	Integer *int64
	String  *string
}

var recallMemoriesInputLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union RecallMemoriesInputLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RecallMemoriesInputLimit")
}

func (union *RecallMemoriesInputLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, recallMemoriesInputLimitMembers, "RecallMemoriesInputLimit")
}

type RecallMemoriesInput struct {
	ProjectID string                    `json:"project_id"`
	MemoryID  string                    `json:"memory_id"`
	Query     string                    `json:"query"`
	EndUserID *string                   `json:"end_user_id,omitzero"`
	TeamID    *string                   `json:"team_id,omitzero"`
	AgentID   *string                   `json:"agent_id,omitzero"`
	AsOf      *string                   `json:"as_of,omitzero"`
	Type      *RecallMemoriesInputType  `json:"type,omitzero"`
	Limit     *RecallMemoriesInputLimit `json:"limit,omitzero"`
	Trial     *bool                     `json:"trial,omitzero"`
}

type RecallMemoriesOutputMemoriesItemValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var recallMemoriesOutputMemoriesItemValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union RecallMemoriesOutputMemoriesItemValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RecallMemoriesOutputMemoriesItemValuesValue")
}

func (union *RecallMemoriesOutputMemoriesItemValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, recallMemoriesOutputMemoriesItemValuesValueMembers, "RecallMemoriesOutputMemoriesItemValuesValue")
}

type RecallMemoriesOutputMemoriesItemPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type RecallMemoriesOutputMemoriesItemSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type RecallMemoriesOutputMemoriesItemHolds struct {
	From      string  `json:"from"`
	Until     *string `json:"until"`
	ExpiresAt *string `json:"expires_at"`
}

type RecallMemoriesOutputMemoriesItemReplacesItem struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type RecallMemoriesOutputMemoriesItemReplacedBy struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type RecallMemoriesOutputMemoriesItemConflictsWithItemMemorySourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type RecallMemoriesOutputMemoriesItemConflictsWithItemMemory struct {
	Kind       string                                                               `json:"kind"`
	ID         string                                                               `json:"id"`
	Text       string                                                               `json:"text"`
	TrustLevel string                                                               `json:"trust_level"`
	HeldFrom   string                                                               `json:"held_from"`
	Sources    []RecallMemoriesOutputMemoriesItemConflictsWithItemMemorySourcesItem `json:"sources"`
}

type RecallMemoriesOutputMemoriesItemConflictsWithItemFile struct {
	Kind            string  `json:"kind"`
	Text            string  `json:"text"`
	RecordedAt      string  `json:"recorded_at"`
	KnowledgeBaseID *string `json:"knowledge_base_id"`
	FileID          *string `json:"file_id"`
	FilePath        *string `json:"file_path"`
	Resolution      string  `json:"resolution"`
}

type RecallMemoriesOutputMemoriesItemConflictsWithItemWaitingMessage struct {
	Kind       string `json:"kind"`
	Text       string `json:"text"`
	SentAt     string `json:"sent_at"`
	SourceID   string `json:"source_id"`
	ExternalID string `json:"external_id"`
	Author     string `json:"author"`
	AuthorKind string `json:"author_kind"`
}

type RecallMemoriesOutputMemoriesItemConflictsWithItem struct {
	Memory         *RecallMemoriesOutputMemoriesItemConflictsWithItemMemory
	File           *RecallMemoriesOutputMemoriesItemConflictsWithItemFile
	WaitingMessage *RecallMemoriesOutputMemoriesItemConflictsWithItemWaitingMessage
}

var recallMemoriesOutputMemoriesItemConflictsWithItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "id", "text", "trust_level", "held_from", "sources"}, properties: []string{"kind", "id", "text", "trust_level", "held_from", "sources"}, constants: map[string]any{"kind": "memory"}},
	{kind: unionObject, required: []string{"kind", "text", "recorded_at", "knowledge_base_id", "file_id", "file_path", "resolution"}, properties: []string{"kind", "text", "recorded_at", "knowledge_base_id", "file_id", "file_path", "resolution"}, constants: map[string]any{"kind": "file"}},
	{kind: unionObject, required: []string{"kind", "text", "sent_at", "source_id", "external_id", "author", "author_kind"}, properties: []string{"kind", "text", "sent_at", "source_id", "external_id", "author", "author_kind"}, constants: map[string]any{"kind": "waiting_message"}},
}

func (union RecallMemoriesOutputMemoriesItemConflictsWithItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RecallMemoriesOutputMemoriesItemConflictsWithItem")
}

func (union *RecallMemoriesOutputMemoriesItemConflictsWithItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, recallMemoriesOutputMemoriesItemConflictsWithItemMembers, "RecallMemoriesOutputMemoriesItemConflictsWithItem")
}

type RecallMemoriesOutputMemoriesItem struct {
	ID                 string                                                  `json:"id"`
	MemoryID           string                                                  `json:"memory_id"`
	Type               string                                                  `json:"type"`
	Scope              string                                                  `json:"scope"`
	OwnerID            *string                                                 `json:"owner_id"`
	Personal           bool                                                    `json:"personal"`
	Subject            string                                                  `json:"subject"`
	SubjectOwnerID     *string                                                 `json:"subject_owner_id"`
	Text               string                                                  `json:"text"`
	Values             map[string]*RecallMemoriesOutputMemoriesItemValuesValue `json:"values"`
	Plan               *RecallMemoriesOutputMemoriesItemPlan                   `json:"plan"`
	TrustLevel         string                                                  `json:"trust_level"`
	TrustReasons       []string                                                `json:"trust_reasons"`
	AgentMay           string                                                  `json:"agent_may"`
	Sources            []RecallMemoriesOutputMemoriesItemSourcesItem           `json:"sources"`
	Holds              RecallMemoriesOutputMemoriesItemHolds                   `json:"holds"`
	Replaces           []RecallMemoriesOutputMemoriesItemReplacesItem          `json:"replaces"`
	ReplacedBy         *RecallMemoriesOutputMemoriesItemReplacedBy             `json:"replaced_by"`
	ConflictsWith      []RecallMemoriesOutputMemoriesItemConflictsWithItem     `json:"conflicts_with"`
	ConnectionStrength float64                                                 `json:"connection_strength"`
	RecallStrength     float64                                                 `json:"recall_strength"`
	LastCheckedAt      *string                                                 `json:"last_checked_at"`
	Check              string                                                  `json:"check"`
	SortedBy           string                                                  `json:"sorted_by"`
	SortingProbability *float64                                                `json:"sorting_probability"`
}

type RecallMemoriesOutput struct {
	RecallID   *string                            `json:"recall_id"`
	DurationMs float64                            `json:"duration_ms"`
	Memories   []RecallMemoriesOutputMemoriesItem `json:"memories"`
}

type RecordAnswerEventsInputEventsItem struct {
	QuestionID    string   `json:"question_id"`
	Answer        *string  `json:"answer,omitzero"`
	FollowUp      *string  `json:"follow_up,omitzero"`
	CitedChunkIDs []string `json:"cited_chunk_ids,omitzero"`
	ThumbsDown    *bool    `json:"thumbs_down,omitzero"`
	HandoffReason *string  `json:"handoff_reason,omitzero"`
	OccurredAt    *string  `json:"occurred_at,omitzero"`
}

type RecordAnswerEventsInput struct {
	ProjectID       string                              `json:"project_id"`
	KnowledgeBaseID string                              `json:"knowledge_base_id"`
	Origin          *string                             `json:"origin,omitzero"`
	Events          []RecordAnswerEventsInputEventsItem `json:"events"`
}

type RecordAnswerEventsOutputResultsItem struct {
	QuestionID string `json:"question_id"`
	Outcome    string `json:"outcome"`
}

type RecordAnswerEventsOutput struct {
	Results       []RecordAnswerEventsOutputResultsItem `json:"results"`
	RecordedCount float64                               `json:"recorded_count"`
}

type RecoverMemoryInput struct {
	ProjectID      string `json:"project_id"`
	MemoryID       string `json:"memory_id"`
	StoredMemoryID string `json:"stored_memory_id"`
}

type RecoverMemoryOutputValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var recoverMemoryOutputValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union RecoverMemoryOutputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RecoverMemoryOutputValuesValue")
}

func (union *RecoverMemoryOutputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, recoverMemoryOutputValuesValueMembers, "RecoverMemoryOutputValuesValue")
}

type RecoverMemoryOutputPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type RecoverMemoryOutputSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type RecoverMemoryOutput struct {
	ID                 string                                     `json:"id"`
	MemoryID           string                                     `json:"memory_id"`
	Type               string                                     `json:"type"`
	Scope              string                                     `json:"scope"`
	OwnerID            *string                                    `json:"owner_id"`
	Personal           bool                                       `json:"personal"`
	TrustLevel         string                                     `json:"trust_level"`
	Text               string                                     `json:"text"`
	Subject            string                                     `json:"subject"`
	Values             map[string]*RecoverMemoryOutputValuesValue `json:"values"`
	Plan               *RecoverMemoryOutputPlan                   `json:"plan"`
	Sensitive          bool                                       `json:"sensitive"`
	InstructionLike    bool                                       `json:"instruction_like"`
	SortedBy           string                                     `json:"sorted_by"`
	ConnectionStrength float64                                    `json:"connection_strength"`
	RecallStrength     float64                                    `json:"recall_strength"`
	Sources            []RecoverMemoryOutputSourcesItem           `json:"sources"`
	ReplacedBy         *string                                    `json:"replaced_by"`
	HeldUntil          *string                                    `json:"held_until"`
	ExpiresAt          *string                                    `json:"expires_at"`
	LastCheckedAt      *string                                    `json:"last_checked_at"`
	ForgottenAt        *string                                    `json:"forgotten_at"`
	PurgeAfter         *string                                    `json:"purge_after"`
	OccurredAt         string                                     `json:"occurred_at"`
	CreatedAt          string                                     `json:"created_at"`
	UpdatedAt          string                                     `json:"updated_at"`
}

type RemoveMemberInput struct {
	ProjectID string `json:"project_id"`
	AccountID string `json:"account_id"`
}

type RemoveMemberOutput struct {
	Removed bool `json:"removed"`
}

type RemoveMemoryWebhookInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
}

type RemoveMemoryWebhookOutput struct {
	URL       string `json:"url"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type RestoreDatabaseInput struct {
	ProjectID  string `json:"project_id"`
	DatabaseID string `json:"database_id"`
}

type RestoreDatabaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RestoreDatabaseOutputSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type RestoreDatabaseOutputCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type RestoreDatabaseOutput struct {
	ID               string                           `json:"id"`
	ProjectID        string                           `json:"project_id"`
	Name             string                           `json:"name"`
	CreatedAt        string                           `json:"created_at"`
	CreatedBy        RestoreDatabaseOutputCreatedBy   `json:"created_by"`
	DeletedAt        *string                          `json:"deleted_at"`
	PurgeAfter       *string                          `json:"purge_after"`
	MigrationVersion float64                          `json:"migration_version"`
	SirannonURL      string                           `json:"sirannon_url"`
	Size             *RestoreDatabaseOutputSize       `json:"size"`
	Compaction       *RestoreDatabaseOutputCompaction `json:"compaction"`
	SQLWritePreview  bool                             `json:"sql_write_preview"`
}

type RestoreFileInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	FileID          string `json:"file_id"`
}

type RestoreFileOutputFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type RestoreFileOutputUnreadPartsItemFailure struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type RestoreFileOutputUnreadPartsItem struct {
	FirstPage   *float64                                `json:"first_page"`
	LastPage    *float64                                `json:"last_page"`
	StartSecond *float64                                `json:"start_second"`
	EndSecond   *float64                                `json:"end_second"`
	Failure     RestoreFileOutputUnreadPartsItemFailure `json:"failure"`
}

type RestoreFileOutput struct {
	ID              string                             `json:"id"`
	KnowledgeBaseID string                             `json:"knowledge_base_id"`
	Path            string                             `json:"path"`
	Kind            string                             `json:"kind"`
	Address         *string                            `json:"address"`
	Status          string                             `json:"status"`
	CurrentVersion  *float64                           `json:"current_version"`
	LatestVersion   float64                            `json:"latest_version"`
	SizeBytes       float64                            `json:"size_bytes"`
	ContentSHA256   string                             `json:"content_sha256"`
	Failure         *RestoreFileOutputFailure          `json:"failure"`
	UnreadParts     []RestoreFileOutputUnreadPartsItem `json:"unread_parts"`
	Metadata        map[string]string                  `json:"metadata"`
	CreatedAt       string                             `json:"created_at"`
	UpdatedAt       string                             `json:"updated_at"`
	DeletedAt       *string                            `json:"deleted_at"`
	PurgeAfter      *string                            `json:"purge_after"`
}

type RestoreIndexInput struct {
	ProjectID string `json:"project_id"`
	IndexID   string `json:"index_id"`
}

type RestoreIndexOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RestoreIndexOutput struct {
	ID         string                      `json:"id"`
	ProjectID  string                      `json:"project_id"`
	Name       string                      `json:"name"`
	CreatedAt  string                      `json:"created_at"`
	CreatedBy  RestoreIndexOutputCreatedBy `json:"created_by"`
	DeletedAt  *string                     `json:"deleted_at"`
	PurgeAfter *string                     `json:"purge_after"`
	Config     map[string]any              `json:"config"`
	NarsilURL  string                      `json:"narsil_url"`
}

type RestoreIndexSnapshotInput struct {
	ProjectID string      `json:"project_id"`
	IndexID   string      `json:"index_id"`
	Content   FileContent `json:"-"`
}

type RestoreIndexSnapshotOutputIndexCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RestoreIndexSnapshotOutputIndex struct {
	ID         string                                   `json:"id"`
	ProjectID  string                                   `json:"project_id"`
	Name       string                                   `json:"name"`
	CreatedAt  string                                   `json:"created_at"`
	CreatedBy  RestoreIndexSnapshotOutputIndexCreatedBy `json:"created_by"`
	DeletedAt  *string                                  `json:"deleted_at"`
	PurgeAfter *string                                  `json:"purge_after"`
	Config     map[string]any                           `json:"config"`
	NarsilURL  string                                   `json:"narsil_url"`
}

type RestoreIndexSnapshotOutput struct {
	Index       RestoreIndexSnapshotOutputIndex `json:"index"`
	RecordCount float64                         `json:"record_count"`
}

type RestoreKnowledgeBaseInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type RestoreKnowledgeBaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RestoreKnowledgeBaseOutput struct {
	ID                       string                              `json:"id"`
	ProjectID                string                              `json:"project_id"`
	Name                     string                              `json:"name"`
	Language                 string                              `json:"language"`
	ChunkTokens              float64                             `json:"chunk_tokens"`
	QuestionLogRetentionDays *float64                            `json:"question_log_retention_days"`
	CreatedAt                string                              `json:"created_at"`
	CreatedBy                RestoreKnowledgeBaseOutputCreatedBy `json:"created_by"`
	DeletedAt                *string                             `json:"deleted_at"`
	PurgeAfter               *string                             `json:"purge_after"`
	DatabaseID               string                              `json:"database_id"`
	LiveIndexID              string                              `json:"live_index_id"`
	SirannonURL              string                              `json:"sirannon_url"`
	SearchPendingSince       *string                             `json:"search_pending_since"`
}

type RestoreMemoryInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
}

type RestoreMemoryOutputSettingsSubjectsItem struct {
	Subject   string  `json:"subject"`
	OwnerID   *string `json:"owner_id"`
	Sensitive bool    `json:"sensitive"`
}

type RestoreMemoryOutputSettingsAgentPermissions struct {
	Confirmed string `json:"confirmed"`
	Likely    string `json:"likely"`
	Disputed  string `json:"disputed"`
}

type RestoreMemoryOutputSettingsCueWeightsStatementKind struct {
	Statement   float64 `json:"statement"`
	Event       float64 `json:"event"`
	Promise     float64 `json:"promise"`
	Procedure   float64 `json:"procedure"`
	Instruction float64 `json:"instruction"`
}

type RestoreMemoryOutputSettingsCueWeightsAuthorKind struct {
	Staff    float64 `json:"staff"`
	Agent    float64 `json:"agent"`
	EndUser  float64 `json:"end_user"`
	Outsider float64 `json:"outsider"`
	Records  float64 `json:"records"`
	Code     float64 `json:"code"`
}

type RestoreMemoryOutputSettingsCueWeights struct {
	StatementKind           RestoreMemoryOutputSettingsCueWeightsStatementKind `json:"statement_kind"`
	AuthorKind              RestoreMemoryOutputSettingsCueWeightsAuthorKind    `json:"author_kind"`
	SubjectOwner            float64                                            `json:"subject_owner"`
	PrivateChannel          float64                                            `json:"private_channel"`
	ReactionsForSecondVoice float64                                            `json:"reactions_for_second_voice"`
}

type RestoreMemoryOutputSettings struct {
	DuplicateThreshold          float64                                     `json:"duplicate_threshold"`
	ConfidenceThreshold         float64                                     `json:"confidence_threshold"`
	AgreeingAuthorsForConfirmed float64                                     `json:"agreeing_authors_for_confirmed"`
	FirstPackTokens             float64                                     `json:"first_pack_tokens"`
	RecallFadeDays              float64                                     `json:"recall_fade_days"`
	KnowledgeBaseChoice         string                                      `json:"knowledge_base_choice"`
	CheckedKnowledgeBaseIDs     []string                                    `json:"checked_knowledge_base_ids"`
	Subjects                    []RestoreMemoryOutputSettingsSubjectsItem   `json:"subjects"`
	SourcesForLikely            float64                                     `json:"sources_for_likely"`
	AgentPermissions            RestoreMemoryOutputSettingsAgentPermissions `json:"agent_permissions"`
	DroppedListDays             *float64                                    `json:"dropped_list_days"`
	ReplacedRetentionDays       *float64                                    `json:"replaced_retention_days"`
	MessageRetentionDays        *float64                                    `json:"message_retention_days"`
	PersonalRetentionDays       *float64                                    `json:"personal_retention_days"`
	RecallLogRetentionDays      *float64                                    `json:"recall_log_retention_days"`
	ReadySetSize                float64                                     `json:"ready_set_size"`
	RecallDepth                 float64                                     `json:"recall_depth"`
	CueWeights                  RestoreMemoryOutputSettingsCueWeights       `json:"cue_weights"`
	RecallCheckedMemories       float64                                     `json:"recall_checked_memories"`
}

type RestoreMemoryOutputCheckedKnowledgeBasesLeftOutItem struct {
	KnowledgeBaseID string `json:"knowledge_base_id"`
	Reason          string `json:"reason"`
}

type RestoreMemoryOutputCheckedKnowledgeBases struct {
	KnowledgeBaseIDs []string                                              `json:"knowledge_base_ids"`
	LeftOut          []RestoreMemoryOutputCheckedKnowledgeBasesLeftOutItem `json:"left_out"`
	LeftOutCount     float64                                               `json:"left_out_count"`
	Limit            float64                                               `json:"limit"`
}

type RestoreMemoryOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RestoreMemoryOutput struct {
	ID                    string                                   `json:"id"`
	ProjectID             string                                   `json:"project_id"`
	Language              string                                   `json:"language"`
	Settings              RestoreMemoryOutputSettings              `json:"settings"`
	CheckedKnowledgeBases RestoreMemoryOutputCheckedKnowledgeBases `json:"checked_knowledge_bases"`
	CreatedAt             string                                   `json:"created_at"`
	CreatedBy             RestoreMemoryOutputCreatedBy             `json:"created_by"`
	DeletedAt             *string                                  `json:"deleted_at"`
	PurgeAfter            *string                                  `json:"purge_after"`
	SortingPendingSince   *string                                  `json:"sorting_pending_since"`
}

type RestoreProjectInput struct {
	ProjectID string `json:"project_id"`
}

type RestoreProjectOutput struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Region      string  `json:"region"`
	Role        *string `json:"role"`
	CreatedAt   string  `json:"created_at"`
	DeletedAt   *string `json:"deleted_at"`
	PurgeAfter  *string `json:"purge_after"`
	SirannonURL string  `json:"sirannon_url"`
	NarsilURL   string  `json:"narsil_url"`
}

type ReviewFlaggedQuestionsInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type ReviewFlaggedQuestionsOutput struct {
	Started bool `json:"started"`
}

type RevokeAPIKeyInput struct {
	ProjectID string `json:"project_id"`
	KeyID     string `json:"key_id"`
}

type RevokeAPIKeyOutputPermissionsDatabases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type RevokeAPIKeyOutputPermissionsIndexes struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type RevokeAPIKeyOutputPermissionsKnowledgeBases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type RevokeAPIKeyOutputPermissionsMemory struct {
	Level string `json:"level"`
}

type RevokeAPIKeyOutputPermissions struct {
	Access         string                                      `json:"access"`
	Databases      RevokeAPIKeyOutputPermissionsDatabases      `json:"databases"`
	Indexes        RevokeAPIKeyOutputPermissionsIndexes        `json:"indexes"`
	KnowledgeBases RevokeAPIKeyOutputPermissionsKnowledgeBases `json:"knowledge_bases"`
	Memory         RevokeAPIKeyOutputPermissionsMemory         `json:"memory"`
}

type RevokeAPIKeyOutput struct {
	ID                       string                        `json:"id"`
	ProjectID                string                        `json:"project_id"`
	Name                     string                        `json:"name"`
	DisplayPrefix            string                        `json:"display_prefix"`
	Permissions              RevokeAPIKeyOutputPermissions `json:"permissions"`
	PermissionsChangedAt     *string                       `json:"permissions_changed_at"`
	PermissionsChangedByName *string                       `json:"permissions_changed_by_name"`
	CreatedBy                string                        `json:"created_by"`
	CreatedByName            string                        `json:"created_by_name"`
	CreatedAt                string                        `json:"created_at"`
	ExpiresAt                *string                       `json:"expires_at"`
	LastUsedAt               *string                       `json:"last_used_at"`
	RevokedAt                *string                       `json:"revoked_at"`
}

type RevokeInvitationInput struct {
	ProjectID    string `json:"project_id"`
	InvitationID string `json:"invitation_id"`
}

type RevokeInvitationOutput struct {
	ID          string  `json:"id"`
	ProjectID   string  `json:"project_id"`
	ProjectName string  `json:"project_name"`
	Email       string  `json:"email"`
	Role        string  `json:"role"`
	CreatedAt   string  `json:"created_at"`
	ExpiresAt   string  `json:"expires_at"`
	AcceptedAt  *string `json:"accepted_at"`
	RevokedAt   *string `json:"revoked_at"`
}

type RunDatabaseSQLInput struct {
	ProjectID         string  `json:"project_id"`
	DatabaseID        string  `json:"database_id"`
	SQL               string  `json:"sql"`
	ConfirmationToken *string `json:"confirmation_token,omitzero"`
}

type RunDatabaseSQLOutputRowsResultsItemColumnsItem struct {
	Name         string  `json:"name"`
	DeclaredType *string `json:"declared_type"`
}

type RunDatabaseSQLOutputRowsResultsItemRowsItemItemObject struct {
	Type      string  `json:"type"`
	Text      string  `json:"text"`
	Size      float64 `json:"size"`
	Truncated bool    `json:"truncated"`
}

type RunDatabaseSQLOutputRowsResultsItemRowsItemItem struct {
	Number *float64
	String *string
	Object *RunDatabaseSQLOutputRowsResultsItemRowsItemItemObject
}

var runDatabaseSQLOutputRowsResultsItemRowsItemItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text", "size", "truncated"}, properties: []string{"type", "text", "size", "truncated"}},
}

func (union RunDatabaseSQLOutputRowsResultsItemRowsItemItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RunDatabaseSQLOutputRowsResultsItemRowsItemItem")
}

func (union *RunDatabaseSQLOutputRowsResultsItemRowsItemItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, runDatabaseSQLOutputRowsResultsItemRowsItemItemMembers, "RunDatabaseSQLOutputRowsResultsItemRowsItemItem")
}

type RunDatabaseSQLOutputRowsResultsItem struct {
	Columns   []RunDatabaseSQLOutputRowsResultsItemColumnsItem     `json:"columns"`
	Rows      [][]*RunDatabaseSQLOutputRowsResultsItemRowsItemItem `json:"rows"`
	Truncated bool                                                 `json:"truncated"`
	Changes   float64                                              `json:"changes"`
	Writes    bool                                                 `json:"writes"`
}

type RunDatabaseSQLOutputRows struct {
	Outcome   string                                `json:"outcome"`
	Results   []RunDatabaseSQLOutputRowsResultsItem `json:"results"`
	ElapsedMs float64                               `json:"elapsed_ms"`
}

type RunDatabaseSQLOutputNeedsConfirmation struct {
	Outcome           string  `json:"outcome"`
	Changes           float64 `json:"changes"`
	StatementCount    float64 `json:"statement_count"`
	ConfirmationToken string  `json:"confirmation_token"`
	ExpiresAt         string  `json:"expires_at"`
}

type RunDatabaseSQLOutputApplied struct {
	Outcome        string  `json:"outcome"`
	Changes        float64 `json:"changes"`
	StatementCount float64 `json:"statement_count"`
}

type RunDatabaseSQLOutput struct {
	Rows              *RunDatabaseSQLOutputRows
	NeedsConfirmation *RunDatabaseSQLOutputNeedsConfirmation
	Applied           *RunDatabaseSQLOutputApplied
}

var runDatabaseSQLOutputMembers = []unionMember{
	{kind: unionObject, required: []string{"outcome", "results", "elapsed_ms"}, properties: []string{"outcome", "results", "elapsed_ms"}, constants: map[string]any{"outcome": "rows"}},
	{kind: unionObject, required: []string{"outcome", "changes", "statement_count", "confirmation_token", "expires_at"}, properties: []string{"outcome", "changes", "statement_count", "confirmation_token", "expires_at"}, constants: map[string]any{"outcome": "needs_confirmation"}},
	{kind: unionObject, required: []string{"outcome", "changes", "statement_count"}, properties: []string{"outcome", "changes", "statement_count"}, constants: map[string]any{"outcome": "applied"}},
}

func (union RunDatabaseSQLOutput) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "RunDatabaseSQLOutput")
}

func (union *RunDatabaseSQLOutput) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, runDatabaseSQLOutputMembers, "RunDatabaseSQLOutput")
}

type SaveIndexRecordInput struct {
	ProjectID string         `json:"project_id"`
	IndexID   string         `json:"index_id"`
	RecordID  string         `json:"record_id"`
	Record    map[string]any `json:"record"`
}

type SaveIndexRecordOutput struct {
	ID      string         `json:"id"`
	Record  map[string]any `json:"record"`
	Created bool           `json:"created"`
}

type SaveMemoryQuestionInput struct {
	ProjectID      string  `json:"project_id"`
	MemoryID       string  `json:"memory_id"`
	Question       string  `json:"question"`
	StoredMemoryID string  `json:"stored_memory_id"`
	EndUserID      *string `json:"end_user_id,omitzero"`
	TeamID         *string `json:"team_id,omitzero"`
}

type SaveMemoryQuestionOutput struct {
	ID             string   `json:"id"`
	Question       string   `json:"question"`
	StoredMemoryID string   `json:"stored_memory_id"`
	MemoryText     *string  `json:"memory_text"`
	EndUserID      *string  `json:"end_user_id"`
	TeamID         *string  `json:"team_id"`
	Rank           *float64 `json:"rank"`
	Flag           *string  `json:"flag"`
	ReplacedBy     *string  `json:"replaced_by"`
	CreatedAt      string   `json:"created_at"`
}

type SaveQueryInput struct {
	ProjectID    string  `json:"project_id"`
	DatabaseID   string  `json:"database_id"`
	SavedQueryID *string `json:"saved_query_id,omitzero"`
	Name         string  `json:"name"`
	SQL          string  `json:"sql"`
}

type SaveQueryOutputSavedQueryCreatedBy struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SaveQueryOutputSavedQuery struct {
	ID         string                             `json:"id"`
	DatabaseID string                             `json:"database_id"`
	Name       string                             `json:"name"`
	SQL        string                             `json:"sql"`
	CreatedBy  SaveQueryOutputSavedQueryCreatedBy `json:"created_by"`
	CreatedAt  string                             `json:"created_at"`
	UpdatedAt  string                             `json:"updated_at"`
}

type SaveQueryOutput struct {
	SavedQuery SaveQueryOutputSavedQuery `json:"saved_query"`
}

type SaveQuestionInputVersion struct {
	Integer *int64
	String  *string
}

var saveQuestionInputVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SaveQuestionInputVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SaveQuestionInputVersion")
}

func (union *SaveQuestionInputVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, saveQuestionInputVersionMembers, "SaveQuestionInputVersion")
}

type SaveQuestionInputFirstPosition struct {
	Integer *int64
	String  *string
}

var saveQuestionInputFirstPositionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SaveQuestionInputFirstPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SaveQuestionInputFirstPosition")
}

func (union *SaveQuestionInputFirstPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, saveQuestionInputFirstPositionMembers, "SaveQuestionInputFirstPosition")
}

type SaveQuestionInputLastPosition struct {
	Integer *int64
	String  *string
}

var saveQuestionInputLastPositionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SaveQuestionInputLastPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SaveQuestionInputLastPosition")
}

func (union *SaveQuestionInputLastPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, saveQuestionInputLastPositionMembers, "SaveQuestionInputLastPosition")
}

type SaveQuestionInput struct {
	ProjectID       string                          `json:"project_id"`
	KnowledgeBaseID string                          `json:"knowledge_base_id"`
	Question        string                          `json:"question"`
	ChunkID         *string                         `json:"chunk_id,omitzero"`
	FileID          *string                         `json:"file_id,omitzero"`
	Version         *SaveQuestionInputVersion       `json:"version,omitzero"`
	FirstPosition   *SaveQuestionInputFirstPosition `json:"first_position,omitzero"`
	LastPosition    *SaveQuestionInputLastPosition  `json:"last_position,omitzero"`
	QuestionLogID   *string                         `json:"question_log_id,omitzero"`
	EndUserID       *string                         `json:"end_user_id,omitzero"`
}

type SaveQuestionOutputPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SaveQuestionOutputPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SaveQuestionOutputPassageCitationDocument struct {
	Kind      string                                                   `json:"kind"`
	Pages     []float64                                                `json:"pages"`
	Areas     []SaveQuestionOutputPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []SaveQuestionOutputPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type SaveQuestionOutputPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type SaveQuestionOutputPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type SaveQuestionOutputPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type SaveQuestionOutputPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SaveQuestionOutputPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SaveQuestionOutputPassageCitationImage struct {
	Kind      string                                                `json:"kind"`
	FileName  string                                                `json:"file_name"`
	Areas     []SaveQuestionOutputPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []SaveQuestionOutputPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type SaveQuestionOutputPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type SaveQuestionOutputPassageCitation struct {
	Document    *SaveQuestionOutputPassageCitationDocument
	Spreadsheet *SaveQuestionOutputPassageCitationSpreadsheet
	Slides      *SaveQuestionOutputPassageCitationSlides
	WebPage     *SaveQuestionOutputPassageCitationWebPage
	Image       *SaveQuestionOutputPassageCitationImage
	Recording   *SaveQuestionOutputPassageCitationRecording
}

var saveQuestionOutputPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union SaveQuestionOutputPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SaveQuestionOutputPassageCitation")
}

func (union *SaveQuestionOutputPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, saveQuestionOutputPassageCitationMembers, "SaveQuestionOutputPassageCitation")
}

type SaveQuestionOutputPassage struct {
	FileID        string                             `json:"file_id"`
	FilePath      *string                            `json:"file_path"`
	FileKind      *string                            `json:"file_kind"`
	Version       float64                            `json:"version"`
	FirstPosition float64                            `json:"first_position"`
	LastPosition  float64                            `json:"last_position"`
	Heading       *string                            `json:"heading"`
	State         string                             `json:"state"`
	Citation      *SaveQuestionOutputPassageCitation `json:"citation"`
}

type SaveQuestionOutputBrokenPrevious struct {
	Version       float64 `json:"version"`
	FirstPosition float64 `json:"first_position"`
	LastPosition  float64 `json:"last_position"`
}

type SaveQuestionOutputBroken struct {
	Change     string                            `json:"change"`
	Version    *float64                          `json:"version"`
	DetectedAt string                            `json:"detected_at"`
	Previous   *SaveQuestionOutputBrokenPrevious `json:"previous"`
}

type SaveQuestionOutput struct {
	ID            string                    `json:"id"`
	Question      string                    `json:"question"`
	Split         string                    `json:"split"`
	Source        string                    `json:"source"`
	QuestionLogID *string                   `json:"question_log_id"`
	EndUserID     *string                   `json:"end_user_id"`
	Passage       SaveQuestionOutputPassage `json:"passage"`
	Broken        *SaveQuestionOutputBroken `json:"broken"`
	CreatedAt     string                    `json:"created_at"`
	UpdatedAt     string                    `json:"updated_at"`
}

type ScoreQuestionSetInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
}

type ScoreQuestionSetOutputTuning struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ScoreQuestionSetOutputHeldBack struct {
	Count              float64  `json:"count"`
	Passed             float64  `json:"passed"`
	Score              *float64 `json:"score"`
	First              *float64 `json:"first"`
	MeanReciprocalRank *float64 `json:"mean_reciprocal_rank"`
}

type ScoreQuestionSetOutputConfigurationSettingsBoost struct {
	Text    float64 `json:"text"`
	Heading float64 `json:"heading"`
}

type ScoreQuestionSetOutputConfigurationSettingsFusionRrf struct {
	Strategy     string  `json:"strategy"`
	RankConstant float64 `json:"rank_constant"`
}

type ScoreQuestionSetOutputConfigurationSettingsFusionLinear struct {
	Strategy     string  `json:"strategy"`
	VectorWeight float64 `json:"vector_weight"`
}

type ScoreQuestionSetOutputConfigurationSettingsFusion struct {
	Rrf    *ScoreQuestionSetOutputConfigurationSettingsFusionRrf
	Linear *ScoreQuestionSetOutputConfigurationSettingsFusionLinear
}

var scoreQuestionSetOutputConfigurationSettingsFusionMembers = []unionMember{
	{kind: unionObject, required: []string{"strategy", "rank_constant"}, properties: []string{"strategy", "rank_constant"}, constants: map[string]any{"strategy": "rrf"}},
	{kind: unionObject, required: []string{"strategy", "vector_weight"}, properties: []string{"strategy", "vector_weight"}, constants: map[string]any{"strategy": "linear"}},
}

func (union ScoreQuestionSetOutputConfigurationSettingsFusion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ScoreQuestionSetOutputConfigurationSettingsFusion")
}

func (union *ScoreQuestionSetOutputConfigurationSettingsFusion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, scoreQuestionSetOutputConfigurationSettingsFusionMembers, "ScoreQuestionSetOutputConfigurationSettingsFusion")
}

type ScoreQuestionSetOutputConfigurationSettingsBm25 struct {
	K1 float64 `json:"k1"`
	B  float64 `json:"b"`
}

type ScoreQuestionSetOutputConfigurationSettingsStopWords struct {
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

type ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type ScoreQuestionSetOutputConfigurationSettingsSynonymsItem struct {
	Option1 *ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption1
	Option2 *ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption2
}

var scoreQuestionSetOutputConfigurationSettingsSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union ScoreQuestionSetOutputConfigurationSettingsSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "ScoreQuestionSetOutputConfigurationSettingsSynonymsItem")
}

func (union *ScoreQuestionSetOutputConfigurationSettingsSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, scoreQuestionSetOutputConfigurationSettingsSynonymsItemMembers, "ScoreQuestionSetOutputConfigurationSettingsSynonymsItem")
}

type ScoreQuestionSetOutputConfigurationSettings struct {
	Boost       ScoreQuestionSetOutputConfigurationSettingsBoost          `json:"boost"`
	Fusion      ScoreQuestionSetOutputConfigurationSettingsFusion         `json:"fusion"`
	Bm25        ScoreQuestionSetOutputConfigurationSettingsBm25           `json:"bm25"`
	StopWords   ScoreQuestionSetOutputConfigurationSettingsStopWords      `json:"stop_words"`
	Synonyms    []ScoreQuestionSetOutputConfigurationSettingsSynonymsItem `json:"synonyms"`
	Language    string                                                    `json:"language"`
	ChunkTokens float64                                                   `json:"chunk_tokens"`
}

type ScoreQuestionSetOutputConfiguration struct {
	LiveIndexID string                                      `json:"live_index_id"`
	Settings    ScoreQuestionSetOutputConfigurationSettings `json:"settings"`
}

type ScoreQuestionSetOutput struct {
	ID                 string                               `json:"id"`
	Purpose            string                               `json:"purpose"`
	Status             string                               `json:"status"`
	WaitingForSearch   bool                                 `json:"waiting_for_search"`
	PassID             *string                              `json:"pass_id"`
	Depth              float64                              `json:"depth"`
	Score              *float64                             `json:"score"`
	QuestionCount      *float64                             `json:"question_count"`
	PassedCount        *float64                             `json:"passed_count"`
	FirstCount         *float64                             `json:"first_count"`
	MeanReciprocalRank *float64                             `json:"mean_reciprocal_rank"`
	Tuning             *ScoreQuestionSetOutputTuning        `json:"tuning"`
	HeldBack           *ScoreQuestionSetOutputHeldBack      `json:"held_back"`
	Configuration      *ScoreQuestionSetOutputConfiguration `json:"configuration"`
	FailureMessage     *string                              `json:"failure_message"`
	RequestedAt        string                               `json:"requested_at"`
	StartedAt          *string                              `json:"started_at"`
	FinishedAt         *string                              `json:"finished_at"`
}

type SearchFoldersInput struct {
	ProjectID       string  `json:"project_id"`
	KnowledgeBaseID string  `json:"knowledge_base_id"`
	Search          *string `json:"search,omitzero"`
	Limit           *string `json:"limit,omitzero"`
	Offset          *string `json:"offset,omitzero"`
}

type SearchFoldersOutputFoldersItem struct {
	Path      string  `json:"path"`
	FileCount float64 `json:"file_count"`
}

type SearchFoldersOutput struct {
	Folders    []SearchFoldersOutputFoldersItem `json:"folders"`
	TotalCount float64                          `json:"total_count"`
	Limit      float64                          `json:"limit"`
	Offset     float64                          `json:"offset"`
}

type SearchKnowledgeBaseInputMetadataValue struct {
	String *string
	List   *[]string
}

var searchKnowledgeBaseInputMetadataValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union SearchKnowledgeBaseInputMetadataValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SearchKnowledgeBaseInputMetadataValue")
}

func (union *SearchKnowledgeBaseInputMetadataValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, searchKnowledgeBaseInputMetadataValueMembers, "SearchKnowledgeBaseInputMetadataValue")
}

type SearchKnowledgeBaseInputLimit struct {
	Integer *int64
	String  *string
}

var searchKnowledgeBaseInputLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SearchKnowledgeBaseInputLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SearchKnowledgeBaseInputLimit")
}

func (union *SearchKnowledgeBaseInputLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, searchKnowledgeBaseInputLimitMembers, "SearchKnowledgeBaseInputLimit")
}

type SearchKnowledgeBaseInput struct {
	ProjectID       string                                           `json:"project_id"`
	KnowledgeBaseID string                                           `json:"knowledge_base_id"`
	Question        string                                           `json:"question"`
	Limit           *SearchKnowledgeBaseInputLimit                   `json:"limit,omitzero"`
	Folder          *string                                          `json:"folder,omitzero"`
	Metadata        map[string]SearchKnowledgeBaseInputMetadataValue `json:"metadata,omitzero"`
	EndUserID       *string                                          `json:"end_user_id,omitzero"`
	CallID          *string                                          `json:"call_id,omitzero"`
	WithMemories    *bool                                            `json:"with_memories,omitzero"`
	TeamID          *string                                          `json:"team_id,omitzero"`
	AgentID         *string                                          `json:"agent_id,omitzero"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationDocument struct {
	Kind      string                                                               `json:"kind"`
	Pages     []float64                                                            `json:"pages"`
	Areas     []SearchKnowledgeBaseOutputPassagesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []SearchKnowledgeBaseOutputPassagesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationImage struct {
	Kind      string                                                            `json:"kind"`
	FileName  string                                                            `json:"file_name"`
	Areas     []SearchKnowledgeBaseOutputPassagesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []SearchKnowledgeBaseOutputPassagesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type SearchKnowledgeBaseOutputPassagesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type SearchKnowledgeBaseOutputPassagesItemCitation struct {
	Document    *SearchKnowledgeBaseOutputPassagesItemCitationDocument
	Spreadsheet *SearchKnowledgeBaseOutputPassagesItemCitationSpreadsheet
	Slides      *SearchKnowledgeBaseOutputPassagesItemCitationSlides
	WebPage     *SearchKnowledgeBaseOutputPassagesItemCitationWebPage
	Image       *SearchKnowledgeBaseOutputPassagesItemCitationImage
	Recording   *SearchKnowledgeBaseOutputPassagesItemCitationRecording
}

var searchKnowledgeBaseOutputPassagesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union SearchKnowledgeBaseOutputPassagesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SearchKnowledgeBaseOutputPassagesItemCitation")
}

func (union *SearchKnowledgeBaseOutputPassagesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, searchKnowledgeBaseOutputPassagesItemCitationMembers, "SearchKnowledgeBaseOutputPassagesItemCitation")
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationDocument struct {
	Kind      string                                                                    `json:"kind"`
	Pages     []float64                                                                 `json:"pages"`
	Areas     []SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentAreasItem     `json:"areas"`
	PageSizes []SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentPageSizesItem `json:"page_sizes"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationImage struct {
	Kind      string                                                                 `json:"kind"`
	FileName  string                                                                 `json:"file_name"`
	Areas     []SearchKnowledgeBaseOutputPassagesItemMatchCitationImageAreasItem     `json:"areas"`
	PageSizes []SearchKnowledgeBaseOutputPassagesItemMatchCitationImagePageSizesItem `json:"page_sizes"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchCitation struct {
	Document    *SearchKnowledgeBaseOutputPassagesItemMatchCitationDocument
	Spreadsheet *SearchKnowledgeBaseOutputPassagesItemMatchCitationSpreadsheet
	Slides      *SearchKnowledgeBaseOutputPassagesItemMatchCitationSlides
	WebPage     *SearchKnowledgeBaseOutputPassagesItemMatchCitationWebPage
	Image       *SearchKnowledgeBaseOutputPassagesItemMatchCitationImage
	Recording   *SearchKnowledgeBaseOutputPassagesItemMatchCitationRecording
}

var searchKnowledgeBaseOutputPassagesItemMatchCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union SearchKnowledgeBaseOutputPassagesItemMatchCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SearchKnowledgeBaseOutputPassagesItemMatchCitation")
}

func (union *SearchKnowledgeBaseOutputPassagesItemMatchCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, searchKnowledgeBaseOutputPassagesItemMatchCitationMembers, "SearchKnowledgeBaseOutputPassagesItemMatchCitation")
}

type SearchKnowledgeBaseOutputPassagesItemMatchRange struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type SearchKnowledgeBaseOutputPassagesItemMatchTermsItem struct {
	Start float64 `json:"start"`
	End   float64 `json:"end"`
}

type SearchKnowledgeBaseOutputPassagesItemMatch struct {
	Citation SearchKnowledgeBaseOutputPassagesItemMatchCitation    `json:"citation"`
	Range    SearchKnowledgeBaseOutputPassagesItemMatchRange       `json:"range"`
	Terms    []SearchKnowledgeBaseOutputPassagesItemMatchTermsItem `json:"terms"`
}

type SearchKnowledgeBaseOutputPassagesItem struct {
	ChunkID   string                                        `json:"chunk_id"`
	FileID    string                                        `json:"file_id"`
	FilePath  string                                        `json:"file_path"`
	FileKind  string                                        `json:"file_kind"`
	Version   float64                                       `json:"version"`
	Heading   *string                                       `json:"heading"`
	Text      string                                        `json:"text"`
	Truncated bool                                          `json:"truncated"`
	Score     float64                                       `json:"score"`
	Citation  SearchKnowledgeBaseOutputPassagesItemCitation `json:"citation"`
	Match     SearchKnowledgeBaseOutputPassagesItemMatch    `json:"match"`
}

type SearchKnowledgeBaseOutputMemoriesItemValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var searchKnowledgeBaseOutputMemoriesItemValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union SearchKnowledgeBaseOutputMemoriesItemValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SearchKnowledgeBaseOutputMemoriesItemValuesValue")
}

func (union *SearchKnowledgeBaseOutputMemoriesItemValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, searchKnowledgeBaseOutputMemoriesItemValuesValueMembers, "SearchKnowledgeBaseOutputMemoriesItemValuesValue")
}

type SearchKnowledgeBaseOutputMemoriesItemPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type SearchKnowledgeBaseOutputMemoriesItemSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type SearchKnowledgeBaseOutputMemoriesItemHolds struct {
	From      string  `json:"from"`
	Until     *string `json:"until"`
	ExpiresAt *string `json:"expires_at"`
}

type SearchKnowledgeBaseOutputMemoriesItemReplacesItem struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type SearchKnowledgeBaseOutputMemoriesItemReplacedBy struct {
	ID         string  `json:"id"`
	Text       string  `json:"text"`
	TrustLevel string  `json:"trust_level"`
	HeldFrom   string  `json:"held_from"`
	HeldUntil  *string `json:"held_until"`
}

type SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemorySourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemory struct {
	Kind       string                                                                    `json:"kind"`
	ID         string                                                                    `json:"id"`
	Text       string                                                                    `json:"text"`
	TrustLevel string                                                                    `json:"trust_level"`
	HeldFrom   string                                                                    `json:"held_from"`
	Sources    []SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemorySourcesItem `json:"sources"`
}

type SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemFile struct {
	Kind            string  `json:"kind"`
	Text            string  `json:"text"`
	RecordedAt      string  `json:"recorded_at"`
	KnowledgeBaseID *string `json:"knowledge_base_id"`
	FileID          *string `json:"file_id"`
	FilePath        *string `json:"file_path"`
	Resolution      string  `json:"resolution"`
}

type SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemWaitingMessage struct {
	Kind       string `json:"kind"`
	Text       string `json:"text"`
	SentAt     string `json:"sent_at"`
	SourceID   string `json:"source_id"`
	ExternalID string `json:"external_id"`
	Author     string `json:"author"`
	AuthorKind string `json:"author_kind"`
}

type SearchKnowledgeBaseOutputMemoriesItemConflictsWithItem struct {
	Memory         *SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemory
	File           *SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemFile
	WaitingMessage *SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemWaitingMessage
}

var searchKnowledgeBaseOutputMemoriesItemConflictsWithItemMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "id", "text", "trust_level", "held_from", "sources"}, properties: []string{"kind", "id", "text", "trust_level", "held_from", "sources"}, constants: map[string]any{"kind": "memory"}},
	{kind: unionObject, required: []string{"kind", "text", "recorded_at", "knowledge_base_id", "file_id", "file_path", "resolution"}, properties: []string{"kind", "text", "recorded_at", "knowledge_base_id", "file_id", "file_path", "resolution"}, constants: map[string]any{"kind": "file"}},
	{kind: unionObject, required: []string{"kind", "text", "sent_at", "source_id", "external_id", "author", "author_kind"}, properties: []string{"kind", "text", "sent_at", "source_id", "external_id", "author", "author_kind"}, constants: map[string]any{"kind": "waiting_message"}},
}

func (union SearchKnowledgeBaseOutputMemoriesItemConflictsWithItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SearchKnowledgeBaseOutputMemoriesItemConflictsWithItem")
}

func (union *SearchKnowledgeBaseOutputMemoriesItemConflictsWithItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, searchKnowledgeBaseOutputMemoriesItemConflictsWithItemMembers, "SearchKnowledgeBaseOutputMemoriesItemConflictsWithItem")
}

type SearchKnowledgeBaseOutputMemoriesItem struct {
	ID                 string                                                       `json:"id"`
	MemoryID           string                                                       `json:"memory_id"`
	Type               string                                                       `json:"type"`
	Scope              string                                                       `json:"scope"`
	OwnerID            *string                                                      `json:"owner_id"`
	Personal           bool                                                         `json:"personal"`
	Subject            string                                                       `json:"subject"`
	SubjectOwnerID     *string                                                      `json:"subject_owner_id"`
	Text               string                                                       `json:"text"`
	Values             map[string]*SearchKnowledgeBaseOutputMemoriesItemValuesValue `json:"values"`
	Plan               *SearchKnowledgeBaseOutputMemoriesItemPlan                   `json:"plan"`
	TrustLevel         string                                                       `json:"trust_level"`
	TrustReasons       []string                                                     `json:"trust_reasons"`
	AgentMay           string                                                       `json:"agent_may"`
	Sources            []SearchKnowledgeBaseOutputMemoriesItemSourcesItem           `json:"sources"`
	Holds              SearchKnowledgeBaseOutputMemoriesItemHolds                   `json:"holds"`
	Replaces           []SearchKnowledgeBaseOutputMemoriesItemReplacesItem          `json:"replaces"`
	ReplacedBy         *SearchKnowledgeBaseOutputMemoriesItemReplacedBy             `json:"replaced_by"`
	ConflictsWith      []SearchKnowledgeBaseOutputMemoriesItemConflictsWithItem     `json:"conflicts_with"`
	ConnectionStrength float64                                                      `json:"connection_strength"`
	RecallStrength     float64                                                      `json:"recall_strength"`
	LastCheckedAt      *string                                                      `json:"last_checked_at"`
	Check              string                                                       `json:"check"`
	SortedBy           string                                                       `json:"sorted_by"`
	SortingProbability *float64                                                     `json:"sorting_probability"`
}

type SearchKnowledgeBaseOutput struct {
	QuestionID string                                  `json:"question_id"`
	DurationMs float64                                 `json:"duration_ms"`
	Passages   []SearchKnowledgeBaseOutputPassagesItem `json:"passages"`
	Memories   []SearchKnowledgeBaseOutputMemoriesItem `json:"memories"`
	RecallID   *string                                 `json:"recall_id"`
}

type SendMemoryFeedbackInput struct {
	ProjectID      string  `json:"project_id"`
	MemoryID       string  `json:"memory_id"`
	StoredMemoryID string  `json:"stored_memory_id"`
	Verdict        string  `json:"verdict"`
	RecallID       *string `json:"recall_id,omitzero"`
}

type SendMemoryFeedbackOutput struct {
	ID             string `json:"id"`
	StoredMemoryID string `json:"stored_memory_id"`
	Verdict        string `json:"verdict"`
	CreatedAt      string `json:"created_at"`
}

type SetMemoryWebhookInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
	URL       string `json:"url"`
}

type SetMemoryWebhookOutput struct {
	URL           string `json:"url"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	SigningSecret string `json:"signing_secret"`
}

type SettleFlaggedQuestionInputVersion struct {
	Integer *int64
	String  *string
}

var settleFlaggedQuestionInputVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SettleFlaggedQuestionInputVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleFlaggedQuestionInputVersion")
}

func (union *SettleFlaggedQuestionInputVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleFlaggedQuestionInputVersionMembers, "SettleFlaggedQuestionInputVersion")
}

type SettleFlaggedQuestionInputFirstPosition struct {
	Integer *int64
	String  *string
}

var settleFlaggedQuestionInputFirstPositionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SettleFlaggedQuestionInputFirstPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleFlaggedQuestionInputFirstPosition")
}

func (union *SettleFlaggedQuestionInputFirstPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleFlaggedQuestionInputFirstPositionMembers, "SettleFlaggedQuestionInputFirstPosition")
}

type SettleFlaggedQuestionInputLastPosition struct {
	Integer *int64
	String  *string
}

var settleFlaggedQuestionInputLastPositionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SettleFlaggedQuestionInputLastPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleFlaggedQuestionInputLastPosition")
}

func (union *SettleFlaggedQuestionInputLastPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleFlaggedQuestionInputLastPositionMembers, "SettleFlaggedQuestionInputLastPosition")
}

type SettleFlaggedQuestionInput struct {
	ProjectID       string                                   `json:"project_id"`
	KnowledgeBaseID string                                   `json:"knowledge_base_id"`
	QuestionID      string                                   `json:"question_id"`
	ChunkID         *string                                  `json:"chunk_id,omitzero"`
	FileID          *string                                  `json:"file_id,omitzero"`
	Version         *SettleFlaggedQuestionInputVersion       `json:"version,omitzero"`
	FirstPosition   *SettleFlaggedQuestionInputFirstPosition `json:"first_position,omitzero"`
	LastPosition    *SettleFlaggedQuestionInputLastPosition  `json:"last_position,omitzero"`
}

type SettleFlaggedQuestionOutputSignalDetailsItem struct {
	Kind       string         `json:"kind"`
	Detail     map[string]any `json:"detail"`
	ReceivedAt string         `json:"received_at"`
}

type SettleFlaggedQuestionOutputAnswer struct {
	Answer        *string  `json:"answer"`
	FollowUp      *string  `json:"follow_up"`
	CitedChunkIDs []string `json:"cited_chunk_ids"`
	AnsweredBy    string   `json:"answered_by"`
	AnsweredAt    string   `json:"answered_at"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocument struct {
	Kind      string                                                                         `json:"kind"`
	Pages     []float64                                                                      `json:"pages"`
	Areas     []SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationImage struct {
	Kind      string                                                                      `json:"kind"`
	FileName  string                                                                      `json:"file_name"`
	Areas     []SettleFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []SettleFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type SettleFlaggedQuestionOutputReturnedPassagesItemCitation struct {
	Document    *SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocument
	Spreadsheet *SettleFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet
	Slides      *SettleFlaggedQuestionOutputReturnedPassagesItemCitationSlides
	WebPage     *SettleFlaggedQuestionOutputReturnedPassagesItemCitationWebPage
	Image       *SettleFlaggedQuestionOutputReturnedPassagesItemCitationImage
	Recording   *SettleFlaggedQuestionOutputReturnedPassagesItemCitationRecording
}

var settleFlaggedQuestionOutputReturnedPassagesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union SettleFlaggedQuestionOutputReturnedPassagesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleFlaggedQuestionOutputReturnedPassagesItemCitation")
}

func (union *SettleFlaggedQuestionOutputReturnedPassagesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleFlaggedQuestionOutputReturnedPassagesItemCitationMembers, "SettleFlaggedQuestionOutputReturnedPassagesItemCitation")
}

type SettleFlaggedQuestionOutputReturnedPassagesItem struct {
	Rank     float64                                                  `json:"rank"`
	ChunkID  string                                                   `json:"chunk_id"`
	FileID   string                                                   `json:"file_id"`
	FilePath *string                                                  `json:"file_path"`
	FileKind *string                                                  `json:"file_kind"`
	Version  float64                                                  `json:"version"`
	Heading  *string                                                  `json:"heading"`
	Citation *SettleFlaggedQuestionOutputReturnedPassagesItemCitation `json:"citation"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationDocument struct {
	Kind      string                                                                   `json:"kind"`
	Pages     []float64                                                                `json:"pages"`
	Areas     []SettleFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem     `json:"areas"`
	PageSizes []SettleFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem `json:"page_sizes"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationImage struct {
	Kind      string                                                                `json:"kind"`
	FileName  string                                                                `json:"file_name"`
	Areas     []SettleFlaggedQuestionOutputCandidatesItemCitationImageAreasItem     `json:"areas"`
	PageSizes []SettleFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem `json:"page_sizes"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type SettleFlaggedQuestionOutputCandidatesItemCitation struct {
	Document    *SettleFlaggedQuestionOutputCandidatesItemCitationDocument
	Spreadsheet *SettleFlaggedQuestionOutputCandidatesItemCitationSpreadsheet
	Slides      *SettleFlaggedQuestionOutputCandidatesItemCitationSlides
	WebPage     *SettleFlaggedQuestionOutputCandidatesItemCitationWebPage
	Image       *SettleFlaggedQuestionOutputCandidatesItemCitationImage
	Recording   *SettleFlaggedQuestionOutputCandidatesItemCitationRecording
}

var settleFlaggedQuestionOutputCandidatesItemCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union SettleFlaggedQuestionOutputCandidatesItemCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleFlaggedQuestionOutputCandidatesItemCitation")
}

func (union *SettleFlaggedQuestionOutputCandidatesItemCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleFlaggedQuestionOutputCandidatesItemCitationMembers, "SettleFlaggedQuestionOutputCandidatesItemCitation")
}

type SettleFlaggedQuestionOutputCandidatesItem struct {
	Rank          float64                                            `json:"rank"`
	ChunkID       string                                             `json:"chunk_id"`
	FileID        string                                             `json:"file_id"`
	Version       float64                                            `json:"version"`
	FirstPosition float64                                            `json:"first_position"`
	LastPosition  float64                                            `json:"last_position"`
	Heading       *string                                            `json:"heading"`
	Probability   float64                                            `json:"probability"`
	FilePath      *string                                            `json:"file_path"`
	FileKind      *string                                            `json:"file_kind"`
	LatestVersion *float64                                           `json:"latest_version"`
	Citation      *SettleFlaggedQuestionOutputCandidatesItemCitation `json:"citation"`
}

type SettleFlaggedQuestionOutput struct {
	QuestionID       string                                            `json:"question_id"`
	Question         string                                            `json:"question"`
	EndUserID        *string                                           `json:"end_user_id"`
	Status           string                                            `json:"status"`
	Signals          []string                                          `json:"signals"`
	FlaggedAt        string                                            `json:"flagged_at"`
	JudgedAt         *string                                           `json:"judged_at"`
	Probability      *float64                                          `json:"probability"`
	ChosenRank       *float64                                          `json:"chosen_rank"`
	SavedQuestionID  *string                                           `json:"saved_question_id"`
	SettledBy        *string                                           `json:"settled_by"`
	SignalDetails    []SettleFlaggedQuestionOutputSignalDetailsItem    `json:"signal_details"`
	Answer           *SettleFlaggedQuestionOutputAnswer                `json:"answer"`
	ReturnedPassages []SettleFlaggedQuestionOutputReturnedPassagesItem `json:"returned_passages"`
	Candidates       []SettleFlaggedQuestionOutputCandidatesItem       `json:"candidates"`
	NoneProbability  *float64                                          `json:"none_probability"`
	AnswerRead       bool                                              `json:"answer_read"`
}

type SettleMemoryInput struct {
	ProjectID      string           `json:"project_id"`
	MemoryID       string           `json:"memory_id"`
	StoredMemoryID string           `json:"stored_memory_id"`
	TrustLevel     string           `json:"trust_level"`
	Type           *string          `json:"type,omitzero"`
	Scope          *string          `json:"scope,omitzero"`
	OwnerID        *string          `json:"owner_id,omitzero"`
	ExpiresAt      Nullable[string] `json:"expires_at,omitzero"`
	OverFile       *bool            `json:"over_file,omitzero"`
}

type SettleMemoryOutputValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var settleMemoryOutputValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union SettleMemoryOutputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleMemoryOutputValuesValue")
}

func (union *SettleMemoryOutputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleMemoryOutputValuesValueMembers, "SettleMemoryOutputValuesValue")
}

type SettleMemoryOutputPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type SettleMemoryOutputSourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type SettleMemoryOutput struct {
	ID                 string                                    `json:"id"`
	MemoryID           string                                    `json:"memory_id"`
	Type               string                                    `json:"type"`
	Scope              string                                    `json:"scope"`
	OwnerID            *string                                   `json:"owner_id"`
	Personal           bool                                      `json:"personal"`
	TrustLevel         string                                    `json:"trust_level"`
	Text               string                                    `json:"text"`
	Subject            string                                    `json:"subject"`
	Values             map[string]*SettleMemoryOutputValuesValue `json:"values"`
	Plan               *SettleMemoryOutputPlan                   `json:"plan"`
	Sensitive          bool                                      `json:"sensitive"`
	InstructionLike    bool                                      `json:"instruction_like"`
	SortedBy           string                                    `json:"sorted_by"`
	ConnectionStrength float64                                   `json:"connection_strength"`
	RecallStrength     float64                                   `json:"recall_strength"`
	Sources            []SettleMemoryOutputSourcesItem           `json:"sources"`
	ReplacedBy         *string                                   `json:"replaced_by"`
	HeldUntil          *string                                   `json:"held_until"`
	ExpiresAt          *string                                   `json:"expires_at"`
	LastCheckedAt      *string                                   `json:"last_checked_at"`
	ForgottenAt        *string                                   `json:"forgotten_at"`
	PurgeAfter         *string                                   `json:"purge_after"`
	OccurredAt         string                                    `json:"occurred_at"`
	CreatedAt          string                                    `json:"created_at"`
	UpdatedAt          string                                    `json:"updated_at"`
}

type SettleMemoryReviewInput struct {
	ProjectID  string  `json:"project_id"`
	MemoryID   string  `json:"memory_id"`
	ReviewID   string  `json:"review_id"`
	TrustLevel string  `json:"trust_level"`
	Type       *string `json:"type,omitzero"`
	Scope      *string `json:"scope,omitzero"`
	OwnerID    *string `json:"owner_id,omitzero"`
}

type SettleMemoryReviewOutputContradictingRecordsItem struct {
	Text            string  `json:"text"`
	RecordedAt      string  `json:"recorded_at"`
	KnowledgeBaseID *string `json:"knowledge_base_id"`
	FilePath        *string `json:"file_path"`
	FileID          *string `json:"file_id"`
}

type SettleMemoryReviewOutputContradictedMemoriesItem struct {
	ID         string `json:"id"`
	Text       string `json:"text"`
	TrustLevel string `json:"trust_level"`
	Replaced   bool   `json:"replaced"`
}

type SettleMemoryReviewOutputMemoryValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var settleMemoryReviewOutputMemoryValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union SettleMemoryReviewOutputMemoryValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SettleMemoryReviewOutputMemoryValuesValue")
}

func (union *SettleMemoryReviewOutputMemoryValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, settleMemoryReviewOutputMemoryValuesValueMembers, "SettleMemoryReviewOutputMemoryValuesValue")
}

type SettleMemoryReviewOutputMemoryPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type SettleMemoryReviewOutputMemorySourcesItem struct {
	SourceID       string  `json:"source_id"`
	ExternalID     string  `json:"external_id"`
	Version        float64 `json:"version"`
	ConversationID string  `json:"conversation_id"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         string  `json:"sent_at"`
}

type SettleMemoryReviewOutputMemory struct {
	ID                 string                                                `json:"id"`
	MemoryID           string                                                `json:"memory_id"`
	Type               string                                                `json:"type"`
	Scope              string                                                `json:"scope"`
	OwnerID            *string                                               `json:"owner_id"`
	Personal           bool                                                  `json:"personal"`
	TrustLevel         string                                                `json:"trust_level"`
	Text               string                                                `json:"text"`
	Subject            string                                                `json:"subject"`
	Values             map[string]*SettleMemoryReviewOutputMemoryValuesValue `json:"values"`
	Plan               *SettleMemoryReviewOutputMemoryPlan                   `json:"plan"`
	Sensitive          bool                                                  `json:"sensitive"`
	InstructionLike    bool                                                  `json:"instruction_like"`
	SortedBy           string                                                `json:"sorted_by"`
	ConnectionStrength float64                                               `json:"connection_strength"`
	RecallStrength     float64                                               `json:"recall_strength"`
	Sources            []SettleMemoryReviewOutputMemorySourcesItem           `json:"sources"`
	ReplacedBy         *string                                               `json:"replaced_by"`
	HeldUntil          *string                                               `json:"held_until"`
	ExpiresAt          *string                                               `json:"expires_at"`
	LastCheckedAt      *string                                               `json:"last_checked_at"`
	ForgottenAt        *string                                               `json:"forgotten_at"`
	PurgeAfter         *string                                               `json:"purge_after"`
	OccurredAt         string                                                `json:"occurred_at"`
	CreatedAt          string                                                `json:"created_at"`
	UpdatedAt          string                                                `json:"updated_at"`
}

type SettleMemoryReviewOutput struct {
	ID                   string                                             `json:"id"`
	MemoryID             string                                             `json:"memory_id"`
	StoredMemoryID       string                                             `json:"stored_memory_id"`
	Reason               string                                             `json:"reason"`
	State                string                                             `json:"state"`
	Evidence             map[string]any                                     `json:"evidence"`
	ContradictingRecords []SettleMemoryReviewOutputContradictingRecordsItem `json:"contradicting_records"`
	ContradictedMemories []SettleMemoryReviewOutputContradictedMemoriesItem `json:"contradicted_memories"`
	SettledTrustLevel    *string                                            `json:"settled_trust_level"`
	SettledBy            *string                                            `json:"settled_by"`
	CreatedAt            string                                             `json:"created_at"`
	SettledAt            *string                                            `json:"settled_at"`
	Memory               SettleMemoryReviewOutputMemory                     `json:"memory"`
}

type SignInInput struct {
	Email            string  `json:"email"`
	Password         string  `json:"password"`
	KnownDeviceToken *string `json:"known_device_token,omitzero"`
}

type SignInOutputSecondFactorRequired struct {
	State            string `json:"state"`
	ChallengeToken   string `json:"challenge_token"`
	KnownDeviceToken string `json:"known_device_token"`
}

type SignInOutputSecondFactorSetupRequired struct {
	State            string `json:"state"`
	SessionToken     string `json:"session_token"`
	KnownDeviceToken string `json:"known_device_token"`
}

type SignInOutput struct {
	SecondFactorRequired      *SignInOutputSecondFactorRequired
	SecondFactorSetupRequired *SignInOutputSecondFactorSetupRequired
}

var signInOutputMembers = []unionMember{
	{kind: unionObject, required: []string{"state", "challenge_token", "known_device_token"}, properties: []string{"state", "challenge_token", "known_device_token"}, constants: map[string]any{"state": "second_factor_required"}},
	{kind: unionObject, required: []string{"state", "session_token", "known_device_token"}, properties: []string{"state", "session_token", "known_device_token"}, constants: map[string]any{"state": "second_factor_setup_required"}},
}

func (union SignInOutput) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SignInOutput")
}

func (union *SignInOutput) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, signInOutputMembers, "SignInOutput")
}

type SignOutInput struct{}

type SignOutOutput struct {
	SignedOut bool `json:"signed_out"`
}

type SignUpInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type SignUpOutput struct {
	Email    string `json:"email"`
	NextStep string `json:"next_step"`
}

type SignUploadPartsInputPartsItem struct {
	PartNumber int64  `json:"part_number"`
	SHA256     string `json:"sha256"`
}

type SignUploadPartsInput struct {
	ProjectID       string                          `json:"project_id"`
	KnowledgeBaseID string                          `json:"knowledge_base_id"`
	UploadID        string                          `json:"upload_id"`
	Parts           []SignUploadPartsInputPartsItem `json:"parts"`
}

type SignUploadPartsOutputPartsItem struct {
	PartNumber float64           `json:"part_number"`
	SizeBytes  float64           `json:"size_bytes"`
	Method     string            `json:"method"`
	URL        string            `json:"url"`
	Headers    map[string]string `json:"headers"`
	ExpiresAt  string            `json:"expires_at"`
}

type SignUploadPartsOutput struct {
	Parts []SignUploadPartsOutputPartsItem `json:"parts"`
}

type SortMessageInput struct {
	ProjectID      string  `json:"project_id"`
	MemoryID       string  `json:"memory_id"`
	Text           string  `json:"text"`
	Author         string  `json:"author"`
	AuthorKind     string  `json:"author_kind"`
	SentAt         *string `json:"sent_at,omitzero"`
	ConversationID *string `json:"conversation_id,omitzero"`
	EndUserID      *string `json:"end_user_id,omitzero"`
	TeamID         *string `json:"team_id,omitzero"`
	Private        *bool   `json:"private,omitzero"`
	Sorting        *string `json:"sorting,omitzero"`
}

type SortMessageOutputMemoriesItemValuesValue struct {
	String  *string
	Number  *float64
	Boolean *bool
}

var sortMessageOutputMemoriesItemValuesValueMembers = []unionMember{
	{kind: unionString},
	{kind: unionNumber},
	{kind: unionBoolean},
}

func (union SortMessageOutputMemoriesItemValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SortMessageOutputMemoriesItemValuesValue")
}

func (union *SortMessageOutputMemoriesItemValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, sortMessageOutputMemoriesItemValuesValueMembers, "SortMessageOutputMemoriesItemValuesValue")
}

type SortMessageOutputMemoriesItemPlan struct {
	DueAt *string `json:"due_at"`
	State string  `json:"state"`
}

type SortMessageOutputMemoriesItem struct {
	Type            string                                               `json:"type"`
	Scope           string                                               `json:"scope"`
	OwnerID         *string                                              `json:"owner_id"`
	Personal        bool                                                 `json:"personal"`
	TrustLevel      string                                               `json:"trust_level"`
	Text            string                                               `json:"text"`
	Subject         string                                               `json:"subject"`
	Values          map[string]*SortMessageOutputMemoriesItemValuesValue `json:"values"`
	Plan            *SortMessageOutputMemoriesItemPlan                   `json:"plan"`
	Sensitive       bool                                                 `json:"sensitive"`
	InstructionLike bool                                                 `json:"instruction_like"`
	SortedBy        string                                               `json:"sorted_by"`
	ReviewReason    *string                                              `json:"review_reason"`
	DuplicateOf     *string                                              `json:"duplicate_of"`
	ConflictsWith   []string                                             `json:"conflicts_with"`
	AgreesWith      []string                                             `json:"agrees_with"`
}

type SortMessageOutput struct {
	Memories []SortMessageOutputMemoriesItem `json:"memories"`
}

type StartMemorySourceSignInInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
	SourceID  string `json:"source_id"`
}

type StartMemorySourceSignInOutput struct {
	SignInURL string `json:"sign_in_url"`
	ExpiresAt string `json:"expires_at"`
}

type StartSourceSignInInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	SourceID        string `json:"source_id"`
}

type StartSourceSignInOutput struct {
	SignInURL string `json:"sign_in_url"`
	ExpiresAt string `json:"expires_at"`
}

type SuggestIndexTermsInputLimit struct {
	Integer *int64
	String  *string
}

var suggestIndexTermsInputLimitMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union SuggestIndexTermsInputLimit) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "SuggestIndexTermsInputLimit")
}

func (union *SuggestIndexTermsInputLimit) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, suggestIndexTermsInputLimitMembers, "SuggestIndexTermsInputLimit")
}

type SuggestIndexTermsInput struct {
	ProjectID string                       `json:"project_id"`
	IndexID   string                       `json:"index_id"`
	Prefix    string                       `json:"prefix"`
	Limit     *SuggestIndexTermsInputLimit `json:"limit,omitzero"`
}

type SuggestIndexTermsOutputTermsItem struct {
	Term        string  `json:"term"`
	RecordCount float64 `json:"record_count"`
}

type SuggestIndexTermsOutput struct {
	Terms      []SuggestIndexTermsOutputTermsItem `json:"terms"`
	DurationMs float64                            `json:"duration_ms"`
}

type SyncMemorySourceInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
	SourceID  string `json:"source_id"`
}

type SyncMemorySourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type SyncMemorySourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SyncMemorySourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type SyncMemorySourceOutput struct {
	ID              string                           `json:"id"`
	ProjectID       string                           `json:"project_id"`
	KnowledgeBaseID *string                          `json:"knowledge_base_id"`
	MemoryID        *string                          `json:"memory_id"`
	Name            string                           `json:"name"`
	Kind            string                           `json:"kind"`
	Sorting         *string                          `json:"sorting"`
	Status          string                           `json:"status"`
	Settings        map[string]any                   `json:"settings"`
	CredentialNames []string                         `json:"credential_names"`
	WebhookURL      *string                          `json:"webhook_url"`
	SignIn          *SyncMemorySourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                           `json:"created_at"`
	CreatedBy       SyncMemorySourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                          `json:"last_synced_at"`
	NextSyncAt      *string                          `json:"next_sync_at"`
	LastError       *SyncMemorySourceOutputLastError `json:"last_error"`
}

type SyncSourceInput struct {
	ProjectID       string `json:"project_id"`
	KnowledgeBaseID string `json:"knowledge_base_id"`
	SourceID        string `json:"source_id"`
}

type SyncSourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type SyncSourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type SyncSourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type SyncSourceOutput struct {
	ID              string                     `json:"id"`
	ProjectID       string                     `json:"project_id"`
	KnowledgeBaseID *string                    `json:"knowledge_base_id"`
	MemoryID        *string                    `json:"memory_id"`
	Name            string                     `json:"name"`
	Kind            string                     `json:"kind"`
	Sorting         *string                    `json:"sorting"`
	Status          string                     `json:"status"`
	Settings        map[string]any             `json:"settings"`
	CredentialNames []string                   `json:"credential_names"`
	WebhookURL      *string                    `json:"webhook_url"`
	SignIn          *SyncSourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                     `json:"created_at"`
	CreatedBy       SyncSourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                    `json:"last_synced_at"`
	NextSyncAt      *string                    `json:"next_sync_at"`
	LastError       *SyncSourceOutputLastError `json:"last_error"`
}

type TryCorrectionsInput struct {
	ProjectID       string   `json:"project_id"`
	KnowledgeBaseID string   `json:"knowledge_base_id"`
	CorrectionIDs   []string `json:"correction_ids"`
	CompleteIndex   *bool    `json:"complete_index,omitzero"`
}

type TryCorrectionsOutput struct {
	ID                string   `json:"id"`
	Trigger           string   `json:"trigger"`
	Mode              string   `json:"mode"`
	Status            string   `json:"status"`
	CompleteIndex     bool     `json:"complete_index"`
	BeforeScorecardID *string  `json:"before_scorecard_id"`
	AfterScorecardID  *string  `json:"after_scorecard_id"`
	CorrectionIDs     []string `json:"correction_ids"`
	FailureMessage    *string  `json:"failure_message"`
	RequestedAt       string   `json:"requested_at"`
	StartedAt         *string  `json:"started_at"`
	FinishedAt        *string  `json:"finished_at"`
}

type TuneMemoryInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
}

type TuneMemoryOutputRecall struct {
	Score              float64 `json:"score"`
	MeanReciprocalRank float64 `json:"mean_reciprocal_rank"`
	Depth              float64 `json:"depth"`
	QuestionCount      float64 `json:"question_count"`
	ScoredAt           string  `json:"scored_at"`
}

type TuneMemoryOutputJudgement struct {
	Score         float64 `json:"score"`
	RightCount    float64 `json:"right_count"`
	DecisionCount float64 `json:"decision_count"`
	ScoredAt      string  `json:"scored_at"`
}

type TuneMemoryOutputLabelledDecisions struct {
	TuningCount   float64 `json:"tuning_count"`
	HeldBackCount float64 `json:"held_back_count"`
}

type TuneMemoryOutputTuning struct {
	State                        string   `json:"state"`
	LabelledDecisionsSinceTuning float64  `json:"labelled_decisions_since_tuning"`
	LabelledDecisionsPerTuning   float64  `json:"labelled_decisions_per_tuning"`
	SavedQuestionsChanged        bool     `json:"saved_questions_changed"`
	MemoryChangesSinceScoring    *float64 `json:"memory_changes_since_scoring"`
	StartedAt                    *string  `json:"started_at"`
	TunedAt                      *string  `json:"tuned_at"`
}

type TuneMemoryOutput struct {
	Recall               *TuneMemoryOutputRecall           `json:"recall"`
	Judgement            *TuneMemoryOutputJudgement        `json:"judgement"`
	LabelledDecisions    TuneMemoryOutputLabelledDecisions `json:"labelled_decisions"`
	FlaggedQuestionCount float64                           `json:"flagged_question_count"`
	Scoring              bool                              `json:"scoring"`
	Tuning               TuneMemoryOutputTuning            `json:"tuning"`
}

type UndoLearnedChangeInput struct {
	ProjectID string `json:"project_id"`
	MemoryID  string `json:"memory_id"`
	ChangeID  string `json:"change_id"`
}

type UndoLearnedChangeOutput struct {
	ID                  string  `json:"id"`
	Setting             string  `json:"setting"`
	FromValue           float64 `json:"from_value"`
	ToValue             float64 `json:"to_value"`
	TuningDecisions     float64 `json:"tuning_decisions"`
	HeldBackDecisions   float64 `json:"held_back_decisions"`
	HeldBackRightBefore float64 `json:"held_back_right_before"`
	HeldBackRightAfter  float64 `json:"held_back_right_after"`
	CreatedAt           string  `json:"created_at"`
	UndoneAt            *string `json:"undone_at"`
}

type UpdateAPIKeyInputPermissionsFull struct {
	Access string `json:"access"`
}

type UpdateAPIKeyInputPermissionsRestrictedDatabases struct {
	Level       string             `json:"level"`
	ResourceIDs Nullable[[]string] `json:"resource_ids,omitzero"`
}

type UpdateAPIKeyInputPermissionsRestrictedIndexes struct {
	Level       string             `json:"level"`
	ResourceIDs Nullable[[]string] `json:"resource_ids,omitzero"`
}

type UpdateAPIKeyInputPermissionsRestrictedKnowledgeBases struct {
	Level       string             `json:"level"`
	ResourceIDs Nullable[[]string] `json:"resource_ids,omitzero"`
}

type UpdateAPIKeyInputPermissionsRestrictedMemory struct {
	Level string `json:"level"`
}

type UpdateAPIKeyInputPermissionsRestricted struct {
	Access         string                                                `json:"access"`
	Databases      *UpdateAPIKeyInputPermissionsRestrictedDatabases      `json:"databases,omitzero"`
	Indexes        *UpdateAPIKeyInputPermissionsRestrictedIndexes        `json:"indexes,omitzero"`
	KnowledgeBases *UpdateAPIKeyInputPermissionsRestrictedKnowledgeBases `json:"knowledge_bases,omitzero"`
	Memory         *UpdateAPIKeyInputPermissionsRestrictedMemory         `json:"memory,omitzero"`
}

type UpdateAPIKeyInputPermissions struct {
	Full       *UpdateAPIKeyInputPermissionsFull
	Restricted *UpdateAPIKeyInputPermissionsRestricted
}

var updateAPIKeyInputPermissionsMembers = []unionMember{
	{kind: unionObject, required: []string{"access"}, properties: []string{"access"}, constants: map[string]any{"access": "full"}},
	{kind: unionObject, required: []string{"access"}, properties: []string{"access", "databases", "indexes", "knowledge_bases", "memory"}, constants: map[string]any{"access": "restricted"}},
}

func (union UpdateAPIKeyInputPermissions) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateAPIKeyInputPermissions")
}

func (union *UpdateAPIKeyInputPermissions) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateAPIKeyInputPermissionsMembers, "UpdateAPIKeyInputPermissions")
}

type UpdateAPIKeyInput struct {
	ProjectID   string                       `json:"project_id"`
	KeyID       string                       `json:"key_id"`
	Permissions UpdateAPIKeyInputPermissions `json:"permissions"`
}

type UpdateAPIKeyOutputPermissionsDatabases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type UpdateAPIKeyOutputPermissionsIndexes struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type UpdateAPIKeyOutputPermissionsKnowledgeBases struct {
	Level       string   `json:"level"`
	ResourceIDs []string `json:"resource_ids"`
}

type UpdateAPIKeyOutputPermissionsMemory struct {
	Level string `json:"level"`
}

type UpdateAPIKeyOutputPermissions struct {
	Access         string                                      `json:"access"`
	Databases      UpdateAPIKeyOutputPermissionsDatabases      `json:"databases"`
	Indexes        UpdateAPIKeyOutputPermissionsIndexes        `json:"indexes"`
	KnowledgeBases UpdateAPIKeyOutputPermissionsKnowledgeBases `json:"knowledge_bases"`
	Memory         UpdateAPIKeyOutputPermissionsMemory         `json:"memory"`
}

type UpdateAPIKeyOutput struct {
	ID                       string                        `json:"id"`
	ProjectID                string                        `json:"project_id"`
	Name                     string                        `json:"name"`
	DisplayPrefix            string                        `json:"display_prefix"`
	Permissions              UpdateAPIKeyOutputPermissions `json:"permissions"`
	PermissionsChangedAt     *string                       `json:"permissions_changed_at"`
	PermissionsChangedByName *string                       `json:"permissions_changed_by_name"`
	CreatedBy                string                        `json:"created_by"`
	CreatedByName            string                        `json:"created_by_name"`
	CreatedAt                string                        `json:"created_at"`
	ExpiresAt                *string                       `json:"expires_at"`
	LastUsedAt               *string                       `json:"last_used_at"`
	RevokedAt                *string                       `json:"revoked_at"`
}

type UpdateDatabaseInput struct {
	ProjectID       string `json:"project_id"`
	DatabaseID      string `json:"database_id"`
	SQLWritePreview *bool  `json:"sql_write_preview,omitzero"`
}

type UpdateDatabaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateDatabaseOutputSize struct {
	UsedBytes  int64  `json:"used_bytes"`
	FileBytes  int64  `json:"file_bytes"`
	LimitBytes int64  `json:"limit_bytes"`
	State      string `json:"state"`
	MeasuredAt string `json:"measured_at"`
}

type UpdateDatabaseOutputCompaction struct {
	State           string  `json:"state"`
	StartedAt       string  `json:"started_at"`
	FinishedAt      *string `json:"finished_at"`
	FileBytesBefore int64   `json:"file_bytes_before"`
	FileBytesAfter  *int64  `json:"file_bytes_after"`
	FailureCode     *string `json:"failure_code"`
}

type UpdateDatabaseOutput struct {
	ID               string                          `json:"id"`
	ProjectID        string                          `json:"project_id"`
	Name             string                          `json:"name"`
	CreatedAt        string                          `json:"created_at"`
	CreatedBy        UpdateDatabaseOutputCreatedBy   `json:"created_by"`
	DeletedAt        *string                         `json:"deleted_at"`
	PurgeAfter       *string                         `json:"purge_after"`
	MigrationVersion float64                         `json:"migration_version"`
	SirannonURL      string                          `json:"sirannon_url"`
	Size             *UpdateDatabaseOutputSize       `json:"size"`
	Compaction       *UpdateDatabaseOutputCompaction `json:"compaction"`
	SQLWritePreview  bool                            `json:"sql_write_preview"`
}

type UpdateIndexInputBm25 struct {
	K1 *float64 `json:"k1,omitzero"`
	B  *float64 `json:"b,omitzero"`
}

type UpdateIndexInputSynonymsItemOption1 struct {
	Word     string   `json:"word"`
	Synonyms []string `json:"synonyms"`
}

type UpdateIndexInputSynonymsItemOption2 struct {
	Words []string `json:"words"`
}

type UpdateIndexInputSynonymsItem struct {
	Option1 *UpdateIndexInputSynonymsItemOption1
	Option2 *UpdateIndexInputSynonymsItemOption2
}

var updateIndexInputSynonymsItemMembers = []unionMember{
	{kind: unionObject, required: []string{"word", "synonyms"}, properties: []string{"word", "synonyms"}},
	{kind: unionObject, required: []string{"words"}, properties: []string{"words"}},
}

func (union UpdateIndexInputSynonymsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSynonymsItem")
}

func (union *UpdateIndexInputSynonymsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSynonymsItemMembers, "UpdateIndexInputSynonymsItem")
}

type UpdateIndexInputSearchDefaultsFields struct {
	String *string
	List   *[]string
}

var updateIndexInputSearchDefaultsFieldsMembers = []unionMember{
	{kind: unionString},
	{kind: unionList},
}

func (union UpdateIndexInputSearchDefaultsFields) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsFields")
}

func (union *UpdateIndexInputSearchDefaultsFields) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsFieldsMembers, "UpdateIndexInputSearchDefaultsFields")
}

type UpdateIndexInputSearchDefaultsBoosts struct {
	String *string
	Map    *map[string]any
}

var updateIndexInputSearchDefaultsBoostsMembers = []unionMember{
	{kind: unionString},
	{kind: unionMap},
}

func (union UpdateIndexInputSearchDefaultsBoosts) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsBoosts")
}

func (union *UpdateIndexInputSearchDefaultsBoosts) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsBoostsMembers, "UpdateIndexInputSearchDefaultsBoosts")
}

type UpdateIndexInputSearchDefaultsTermMatch struct {
	String  *string
	Integer *int64
}

var updateIndexInputSearchDefaultsTermMatchMembers = []unionMember{
	{kind: unionString},
	{kind: unionInteger},
}

func (union UpdateIndexInputSearchDefaultsTermMatch) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsTermMatch")
}

func (union *UpdateIndexInputSearchDefaultsTermMatch) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsTermMatchMembers, "UpdateIndexInputSearchDefaultsTermMatch")
}

type UpdateIndexInputSearchDefaultsTolerance struct {
	Integer *int64
	String  *string
}

var updateIndexInputSearchDefaultsToleranceMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsTolerance) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsTolerance")
}

func (union *UpdateIndexInputSearchDefaultsTolerance) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsToleranceMembers, "UpdateIndexInputSearchDefaultsTolerance")
}

type UpdateIndexInputSearchDefaultsPrefixLength struct {
	Integer *int64
	String  *string
}

var updateIndexInputSearchDefaultsPrefixLengthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsPrefixLength) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsPrefixLength")
}

func (union *UpdateIndexInputSearchDefaultsPrefixLength) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsPrefixLengthMembers, "UpdateIndexInputSearchDefaultsPrefixLength")
}

type UpdateIndexInputSearchDefaultsMinimumScore struct {
	Number *float64
	String *string
}

var updateIndexInputSearchDefaultsMinimumScoreMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsMinimumScore) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsMinimumScore")
}

func (union *UpdateIndexInputSearchDefaultsMinimumScore) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsMinimumScoreMembers, "UpdateIndexInputSearchDefaultsMinimumScore")
}

type UpdateIndexInputSearchDefaultsFusionConstant struct {
	Integer *int64
	String  *string
}

var updateIndexInputSearchDefaultsFusionConstantMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsFusionConstant) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsFusionConstant")
}

func (union *UpdateIndexInputSearchDefaultsFusionConstant) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsFusionConstantMembers, "UpdateIndexInputSearchDefaultsFusionConstant")
}

type UpdateIndexInputSearchDefaultsVectorWeight struct {
	Number *float64
	String *string
}

var updateIndexInputSearchDefaultsVectorWeightMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsVectorWeight) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsVectorWeight")
}

func (union *UpdateIndexInputSearchDefaultsVectorWeight) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsVectorWeightMembers, "UpdateIndexInputSearchDefaultsVectorWeight")
}

type UpdateIndexInputSearchDefaultsMinimumSimilarity struct {
	Number *float64
	String *string
}

var updateIndexInputSearchDefaultsMinimumSimilarityMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsMinimumSimilarity) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsMinimumSimilarity")
}

func (union *UpdateIndexInputSearchDefaultsMinimumSimilarity) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsMinimumSimilarityMembers, "UpdateIndexInputSearchDefaultsMinimumSimilarity")
}

type UpdateIndexInputSearchDefaultsVectorCandidates struct {
	Integer *int64
	String  *string
}

var updateIndexInputSearchDefaultsVectorCandidatesMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateIndexInputSearchDefaultsVectorCandidates) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateIndexInputSearchDefaultsVectorCandidates")
}

func (union *UpdateIndexInputSearchDefaultsVectorCandidates) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateIndexInputSearchDefaultsVectorCandidatesMembers, "UpdateIndexInputSearchDefaultsVectorCandidates")
}

type UpdateIndexInputSearchDefaults struct {
	Fields            *UpdateIndexInputSearchDefaultsFields            `json:"fields,omitzero"`
	Boosts            *UpdateIndexInputSearchDefaultsBoosts            `json:"boosts,omitzero"`
	TermMatch         *UpdateIndexInputSearchDefaultsTermMatch         `json:"term_match,omitzero"`
	Tolerance         *UpdateIndexInputSearchDefaultsTolerance         `json:"tolerance,omitzero"`
	PrefixLength      *UpdateIndexInputSearchDefaultsPrefixLength      `json:"prefix_length,omitzero"`
	Exact             *bool                                            `json:"exact,omitzero"`
	Prefix            *bool                                            `json:"prefix,omitzero"`
	PartialWords      *bool                                            `json:"partial_words,omitzero"`
	MinimumScore      *UpdateIndexInputSearchDefaultsMinimumScore      `json:"minimum_score,omitzero"`
	Fusion            *string                                          `json:"fusion,omitzero"`
	FusionConstant    *UpdateIndexInputSearchDefaultsFusionConstant    `json:"fusion_constant,omitzero"`
	VectorWeight      *UpdateIndexInputSearchDefaultsVectorWeight      `json:"vector_weight,omitzero"`
	MinimumSimilarity *UpdateIndexInputSearchDefaultsMinimumSimilarity `json:"minimum_similarity,omitzero"`
	VectorCandidates  *UpdateIndexInputSearchDefaultsVectorCandidates  `json:"vector_candidates,omitzero"`
}

type UpdateIndexInput struct {
	ProjectID      string                                   `json:"project_id"`
	IndexID        string                                   `json:"index_id"`
	Language       *string                                  `json:"language,omitzero"`
	Bm25           Nullable[UpdateIndexInputBm25]           `json:"bm25,omitzero"`
	Synonyms       []UpdateIndexInputSynonymsItem           `json:"synonyms,omitzero"`
	StopWords      Nullable[[]string]                       `json:"stop_words,omitzero"`
	SearchDefaults Nullable[UpdateIndexInputSearchDefaults] `json:"search_defaults,omitzero"`
}

type UpdateIndexOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateIndexOutput struct {
	ID         string                     `json:"id"`
	ProjectID  string                     `json:"project_id"`
	Name       string                     `json:"name"`
	CreatedAt  string                     `json:"created_at"`
	CreatedBy  UpdateIndexOutputCreatedBy `json:"created_by"`
	DeletedAt  *string                    `json:"deleted_at"`
	PurgeAfter *string                    `json:"purge_after"`
	Config     map[string]any             `json:"config"`
	NarsilURL  string                     `json:"narsil_url"`
}

type UpdateKnowledgeBaseInputQuestionLogRetentionDays struct {
	Integer *int64
	String  *string
}

var updateKnowledgeBaseInputQuestionLogRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateKnowledgeBaseInputQuestionLogRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateKnowledgeBaseInputQuestionLogRetentionDays")
}

func (union *UpdateKnowledgeBaseInputQuestionLogRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateKnowledgeBaseInputQuestionLogRetentionDaysMembers, "UpdateKnowledgeBaseInputQuestionLogRetentionDays")
}

type UpdateKnowledgeBaseInputAgentDepth struct {
	Integer *int64
	String  *string
}

var updateKnowledgeBaseInputAgentDepthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateKnowledgeBaseInputAgentDepth) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateKnowledgeBaseInputAgentDepth")
}

func (union *UpdateKnowledgeBaseInputAgentDepth) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateKnowledgeBaseInputAgentDepthMembers, "UpdateKnowledgeBaseInputAgentDepth")
}

type UpdateKnowledgeBaseInputJudgePassages struct {
	Integer *int64
	String  *string
}

var updateKnowledgeBaseInputJudgePassagesMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateKnowledgeBaseInputJudgePassages) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateKnowledgeBaseInputJudgePassages")
}

func (union *UpdateKnowledgeBaseInputJudgePassages) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateKnowledgeBaseInputJudgePassagesMembers, "UpdateKnowledgeBaseInputJudgePassages")
}

type UpdateKnowledgeBaseInputJudgeThreshold struct {
	Number *float64
	String *string
}

var updateKnowledgeBaseInputJudgeThresholdMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateKnowledgeBaseInputJudgeThreshold) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateKnowledgeBaseInputJudgeThreshold")
}

func (union *UpdateKnowledgeBaseInputJudgeThreshold) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateKnowledgeBaseInputJudgeThresholdMembers, "UpdateKnowledgeBaseInputJudgeThreshold")
}

type UpdateKnowledgeBaseInput struct {
	ProjectID                string                                                     `json:"project_id"`
	KnowledgeBaseID          string                                                     `json:"knowledge_base_id"`
	QuestionLogRetentionDays Nullable[UpdateKnowledgeBaseInputQuestionLogRetentionDays] `json:"question_log_retention_days,omitzero"`
	AgentDepth               *UpdateKnowledgeBaseInputAgentDepth                        `json:"agent_depth,omitzero"`
	AutomaticCorrections     *bool                                                      `json:"automatic_corrections,omitzero"`
	JudgePassages            *UpdateKnowledgeBaseInputJudgePassages                     `json:"judge_passages,omitzero"`
	JudgeThreshold           *UpdateKnowledgeBaseInputJudgeThreshold                    `json:"judge_threshold,omitzero"`
}

type UpdateKnowledgeBaseOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateKnowledgeBaseOutput struct {
	ID                       string                             `json:"id"`
	ProjectID                string                             `json:"project_id"`
	Name                     string                             `json:"name"`
	Language                 string                             `json:"language"`
	ChunkTokens              float64                            `json:"chunk_tokens"`
	QuestionLogRetentionDays *float64                           `json:"question_log_retention_days"`
	CreatedAt                string                             `json:"created_at"`
	CreatedBy                UpdateKnowledgeBaseOutputCreatedBy `json:"created_by"`
	DeletedAt                *string                            `json:"deleted_at"`
	PurgeAfter               *string                            `json:"purge_after"`
	DatabaseID               string                             `json:"database_id"`
	LiveIndexID              string                             `json:"live_index_id"`
	SirannonURL              string                             `json:"sirannon_url"`
	SearchPendingSince       *string                            `json:"search_pending_since"`
}

type UpdateMemoryInputSubjectsItem struct {
	Subject   string           `json:"subject"`
	OwnerID   Nullable[string] `json:"owner_id,omitzero"`
	Sensitive *bool            `json:"sensitive,omitzero"`
}

type UpdateMemoryInputAgentPermissions struct {
	Confirmed *string `json:"confirmed,omitzero"`
	Likely    *string `json:"likely,omitzero"`
	Disputed  *string `json:"disputed,omitzero"`
}

type UpdateMemoryInputCueWeightsStatementKindStatement struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsStatementKindStatementMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsStatementKindStatement) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsStatementKindStatement")
}

func (union *UpdateMemoryInputCueWeightsStatementKindStatement) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsStatementKindStatementMembers, "UpdateMemoryInputCueWeightsStatementKindStatement")
}

type UpdateMemoryInputCueWeightsStatementKindEvent struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsStatementKindEventMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsStatementKindEvent) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsStatementKindEvent")
}

func (union *UpdateMemoryInputCueWeightsStatementKindEvent) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsStatementKindEventMembers, "UpdateMemoryInputCueWeightsStatementKindEvent")
}

type UpdateMemoryInputCueWeightsStatementKindPromise struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsStatementKindPromiseMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsStatementKindPromise) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsStatementKindPromise")
}

func (union *UpdateMemoryInputCueWeightsStatementKindPromise) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsStatementKindPromiseMembers, "UpdateMemoryInputCueWeightsStatementKindPromise")
}

type UpdateMemoryInputCueWeightsStatementKindProcedure struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsStatementKindProcedureMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsStatementKindProcedure) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsStatementKindProcedure")
}

func (union *UpdateMemoryInputCueWeightsStatementKindProcedure) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsStatementKindProcedureMembers, "UpdateMemoryInputCueWeightsStatementKindProcedure")
}

type UpdateMemoryInputCueWeightsStatementKindInstruction struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsStatementKindInstructionMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsStatementKindInstruction) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsStatementKindInstruction")
}

func (union *UpdateMemoryInputCueWeightsStatementKindInstruction) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsStatementKindInstructionMembers, "UpdateMemoryInputCueWeightsStatementKindInstruction")
}

type UpdateMemoryInputCueWeightsStatementKind struct {
	Statement   *UpdateMemoryInputCueWeightsStatementKindStatement   `json:"statement,omitzero"`
	Event       *UpdateMemoryInputCueWeightsStatementKindEvent       `json:"event,omitzero"`
	Promise     *UpdateMemoryInputCueWeightsStatementKindPromise     `json:"promise,omitzero"`
	Procedure   *UpdateMemoryInputCueWeightsStatementKindProcedure   `json:"procedure,omitzero"`
	Instruction *UpdateMemoryInputCueWeightsStatementKindInstruction `json:"instruction,omitzero"`
}

type UpdateMemoryInputCueWeightsAuthorKindStaff struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsAuthorKindStaffMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsAuthorKindStaff) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsAuthorKindStaff")
}

func (union *UpdateMemoryInputCueWeightsAuthorKindStaff) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsAuthorKindStaffMembers, "UpdateMemoryInputCueWeightsAuthorKindStaff")
}

type UpdateMemoryInputCueWeightsAuthorKindAgent struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsAuthorKindAgentMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsAuthorKindAgent) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsAuthorKindAgent")
}

func (union *UpdateMemoryInputCueWeightsAuthorKindAgent) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsAuthorKindAgentMembers, "UpdateMemoryInputCueWeightsAuthorKindAgent")
}

type UpdateMemoryInputCueWeightsAuthorKindEndUser struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsAuthorKindEndUserMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsAuthorKindEndUser) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsAuthorKindEndUser")
}

func (union *UpdateMemoryInputCueWeightsAuthorKindEndUser) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsAuthorKindEndUserMembers, "UpdateMemoryInputCueWeightsAuthorKindEndUser")
}

type UpdateMemoryInputCueWeightsAuthorKindOutsider struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsAuthorKindOutsiderMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsAuthorKindOutsider) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsAuthorKindOutsider")
}

func (union *UpdateMemoryInputCueWeightsAuthorKindOutsider) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsAuthorKindOutsiderMembers, "UpdateMemoryInputCueWeightsAuthorKindOutsider")
}

type UpdateMemoryInputCueWeightsAuthorKindRecords struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsAuthorKindRecordsMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsAuthorKindRecords) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsAuthorKindRecords")
}

func (union *UpdateMemoryInputCueWeightsAuthorKindRecords) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsAuthorKindRecordsMembers, "UpdateMemoryInputCueWeightsAuthorKindRecords")
}

type UpdateMemoryInputCueWeightsAuthorKindCode struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsAuthorKindCodeMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsAuthorKindCode) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsAuthorKindCode")
}

func (union *UpdateMemoryInputCueWeightsAuthorKindCode) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsAuthorKindCodeMembers, "UpdateMemoryInputCueWeightsAuthorKindCode")
}

type UpdateMemoryInputCueWeightsAuthorKind struct {
	Staff    *UpdateMemoryInputCueWeightsAuthorKindStaff    `json:"staff,omitzero"`
	Agent    *UpdateMemoryInputCueWeightsAuthorKindAgent    `json:"agent,omitzero"`
	EndUser  *UpdateMemoryInputCueWeightsAuthorKindEndUser  `json:"end_user,omitzero"`
	Outsider *UpdateMemoryInputCueWeightsAuthorKindOutsider `json:"outsider,omitzero"`
	Records  *UpdateMemoryInputCueWeightsAuthorKindRecords  `json:"records,omitzero"`
	Code     *UpdateMemoryInputCueWeightsAuthorKindCode     `json:"code,omitzero"`
}

type UpdateMemoryInputCueWeightsSubjectOwner struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsSubjectOwnerMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsSubjectOwner) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsSubjectOwner")
}

func (union *UpdateMemoryInputCueWeightsSubjectOwner) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsSubjectOwnerMembers, "UpdateMemoryInputCueWeightsSubjectOwner")
}

type UpdateMemoryInputCueWeightsPrivateChannel struct {
	Number *float64
	String *string
}

var updateMemoryInputCueWeightsPrivateChannelMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsPrivateChannel) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsPrivateChannel")
}

func (union *UpdateMemoryInputCueWeightsPrivateChannel) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsPrivateChannelMembers, "UpdateMemoryInputCueWeightsPrivateChannel")
}

type UpdateMemoryInputCueWeightsReactionsForSecondVoice struct {
	Integer *int64
	String  *string
}

var updateMemoryInputCueWeightsReactionsForSecondVoiceMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputCueWeightsReactionsForSecondVoice) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputCueWeightsReactionsForSecondVoice")
}

func (union *UpdateMemoryInputCueWeightsReactionsForSecondVoice) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputCueWeightsReactionsForSecondVoiceMembers, "UpdateMemoryInputCueWeightsReactionsForSecondVoice")
}

type UpdateMemoryInputCueWeights struct {
	StatementKind           *UpdateMemoryInputCueWeightsStatementKind           `json:"statement_kind,omitzero"`
	AuthorKind              *UpdateMemoryInputCueWeightsAuthorKind              `json:"author_kind,omitzero"`
	SubjectOwner            *UpdateMemoryInputCueWeightsSubjectOwner            `json:"subject_owner,omitzero"`
	PrivateChannel          *UpdateMemoryInputCueWeightsPrivateChannel          `json:"private_channel,omitzero"`
	ReactionsForSecondVoice *UpdateMemoryInputCueWeightsReactionsForSecondVoice `json:"reactions_for_second_voice,omitzero"`
}

type UpdateMemoryInputDuplicateThreshold struct {
	Number *float64
	String *string
}

var updateMemoryInputDuplicateThresholdMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputDuplicateThreshold) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputDuplicateThreshold")
}

func (union *UpdateMemoryInputDuplicateThreshold) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputDuplicateThresholdMembers, "UpdateMemoryInputDuplicateThreshold")
}

type UpdateMemoryInputConfidenceThreshold struct {
	Number *float64
	String *string
}

var updateMemoryInputConfidenceThresholdMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputConfidenceThreshold) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputConfidenceThreshold")
}

func (union *UpdateMemoryInputConfidenceThreshold) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputConfidenceThresholdMembers, "UpdateMemoryInputConfidenceThreshold")
}

type UpdateMemoryInputAgreeingAuthorsForConfirmed struct {
	Integer *int64
	String  *string
}

var updateMemoryInputAgreeingAuthorsForConfirmedMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputAgreeingAuthorsForConfirmed) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputAgreeingAuthorsForConfirmed")
}

func (union *UpdateMemoryInputAgreeingAuthorsForConfirmed) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputAgreeingAuthorsForConfirmedMembers, "UpdateMemoryInputAgreeingAuthorsForConfirmed")
}

type UpdateMemoryInputFirstPackTokens struct {
	Integer *int64
	String  *string
}

var updateMemoryInputFirstPackTokensMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputFirstPackTokens) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputFirstPackTokens")
}

func (union *UpdateMemoryInputFirstPackTokens) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputFirstPackTokensMembers, "UpdateMemoryInputFirstPackTokens")
}

type UpdateMemoryInputRecallFadeDays struct {
	Number *float64
	String *string
}

var updateMemoryInputRecallFadeDaysMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UpdateMemoryInputRecallFadeDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputRecallFadeDays")
}

func (union *UpdateMemoryInputRecallFadeDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputRecallFadeDaysMembers, "UpdateMemoryInputRecallFadeDays")
}

type UpdateMemoryInputSourcesForLikely struct {
	Integer *int64
	String  *string
}

var updateMemoryInputSourcesForLikelyMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputSourcesForLikely) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputSourcesForLikely")
}

func (union *UpdateMemoryInputSourcesForLikely) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputSourcesForLikelyMembers, "UpdateMemoryInputSourcesForLikely")
}

type UpdateMemoryInputDroppedListDays struct {
	Integer *int64
	String  *string
}

var updateMemoryInputDroppedListDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputDroppedListDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputDroppedListDays")
}

func (union *UpdateMemoryInputDroppedListDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputDroppedListDaysMembers, "UpdateMemoryInputDroppedListDays")
}

type UpdateMemoryInputReplacedRetentionDays struct {
	Integer *int64
	String  *string
}

var updateMemoryInputReplacedRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputReplacedRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputReplacedRetentionDays")
}

func (union *UpdateMemoryInputReplacedRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputReplacedRetentionDaysMembers, "UpdateMemoryInputReplacedRetentionDays")
}

type UpdateMemoryInputMessageRetentionDays struct {
	Integer *int64
	String  *string
}

var updateMemoryInputMessageRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputMessageRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputMessageRetentionDays")
}

func (union *UpdateMemoryInputMessageRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputMessageRetentionDaysMembers, "UpdateMemoryInputMessageRetentionDays")
}

type UpdateMemoryInputPersonalRetentionDays struct {
	Integer *int64
	String  *string
}

var updateMemoryInputPersonalRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputPersonalRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputPersonalRetentionDays")
}

func (union *UpdateMemoryInputPersonalRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputPersonalRetentionDaysMembers, "UpdateMemoryInputPersonalRetentionDays")
}

type UpdateMemoryInputRecallLogRetentionDays struct {
	Integer *int64
	String  *string
}

var updateMemoryInputRecallLogRetentionDaysMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputRecallLogRetentionDays) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputRecallLogRetentionDays")
}

func (union *UpdateMemoryInputRecallLogRetentionDays) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputRecallLogRetentionDaysMembers, "UpdateMemoryInputRecallLogRetentionDays")
}

type UpdateMemoryInputReadySetSize struct {
	Integer *int64
	String  *string
}

var updateMemoryInputReadySetSizeMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputReadySetSize) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputReadySetSize")
}

func (union *UpdateMemoryInputReadySetSize) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputReadySetSizeMembers, "UpdateMemoryInputReadySetSize")
}

type UpdateMemoryInputRecallDepth struct {
	Integer *int64
	String  *string
}

var updateMemoryInputRecallDepthMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateMemoryInputRecallDepth) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateMemoryInputRecallDepth")
}

func (union *UpdateMemoryInputRecallDepth) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateMemoryInputRecallDepthMembers, "UpdateMemoryInputRecallDepth")
}

type UpdateMemoryInput struct {
	ProjectID                   string                                            `json:"project_id"`
	MemoryID                    string                                            `json:"memory_id"`
	KnowledgeBaseChoice         *string                                           `json:"knowledge_base_choice,omitzero"`
	CheckedKnowledgeBaseIDs     []string                                          `json:"checked_knowledge_base_ids,omitzero"`
	DuplicateThreshold          *UpdateMemoryInputDuplicateThreshold              `json:"duplicate_threshold,omitzero"`
	ConfidenceThreshold         *UpdateMemoryInputConfidenceThreshold             `json:"confidence_threshold,omitzero"`
	AgreeingAuthorsForConfirmed *UpdateMemoryInputAgreeingAuthorsForConfirmed     `json:"agreeing_authors_for_confirmed,omitzero"`
	FirstPackTokens             *UpdateMemoryInputFirstPackTokens                 `json:"first_pack_tokens,omitzero"`
	RecallFadeDays              *UpdateMemoryInputRecallFadeDays                  `json:"recall_fade_days,omitzero"`
	Subjects                    []UpdateMemoryInputSubjectsItem                   `json:"subjects,omitzero"`
	SourcesForLikely            *UpdateMemoryInputSourcesForLikely                `json:"sources_for_likely,omitzero"`
	AgentPermissions            *UpdateMemoryInputAgentPermissions                `json:"agent_permissions,omitzero"`
	DroppedListDays             Nullable[UpdateMemoryInputDroppedListDays]        `json:"dropped_list_days,omitzero"`
	ReplacedRetentionDays       Nullable[UpdateMemoryInputReplacedRetentionDays]  `json:"replaced_retention_days,omitzero"`
	MessageRetentionDays        Nullable[UpdateMemoryInputMessageRetentionDays]   `json:"message_retention_days,omitzero"`
	PersonalRetentionDays       Nullable[UpdateMemoryInputPersonalRetentionDays]  `json:"personal_retention_days,omitzero"`
	RecallLogRetentionDays      Nullable[UpdateMemoryInputRecallLogRetentionDays] `json:"recall_log_retention_days,omitzero"`
	ReadySetSize                *UpdateMemoryInputReadySetSize                    `json:"ready_set_size,omitzero"`
	RecallDepth                 *UpdateMemoryInputRecallDepth                     `json:"recall_depth,omitzero"`
	CueWeights                  *UpdateMemoryInputCueWeights                      `json:"cue_weights,omitzero"`
}

type UpdateMemoryOutputSettingsSubjectsItem struct {
	Subject   string  `json:"subject"`
	OwnerID   *string `json:"owner_id"`
	Sensitive bool    `json:"sensitive"`
}

type UpdateMemoryOutputSettingsAgentPermissions struct {
	Confirmed string `json:"confirmed"`
	Likely    string `json:"likely"`
	Disputed  string `json:"disputed"`
}

type UpdateMemoryOutputSettingsCueWeightsStatementKind struct {
	Statement   float64 `json:"statement"`
	Event       float64 `json:"event"`
	Promise     float64 `json:"promise"`
	Procedure   float64 `json:"procedure"`
	Instruction float64 `json:"instruction"`
}

type UpdateMemoryOutputSettingsCueWeightsAuthorKind struct {
	Staff    float64 `json:"staff"`
	Agent    float64 `json:"agent"`
	EndUser  float64 `json:"end_user"`
	Outsider float64 `json:"outsider"`
	Records  float64 `json:"records"`
	Code     float64 `json:"code"`
}

type UpdateMemoryOutputSettingsCueWeights struct {
	StatementKind           UpdateMemoryOutputSettingsCueWeightsStatementKind `json:"statement_kind"`
	AuthorKind              UpdateMemoryOutputSettingsCueWeightsAuthorKind    `json:"author_kind"`
	SubjectOwner            float64                                           `json:"subject_owner"`
	PrivateChannel          float64                                           `json:"private_channel"`
	ReactionsForSecondVoice float64                                           `json:"reactions_for_second_voice"`
}

type UpdateMemoryOutputSettings struct {
	DuplicateThreshold          float64                                    `json:"duplicate_threshold"`
	ConfidenceThreshold         float64                                    `json:"confidence_threshold"`
	AgreeingAuthorsForConfirmed float64                                    `json:"agreeing_authors_for_confirmed"`
	FirstPackTokens             float64                                    `json:"first_pack_tokens"`
	RecallFadeDays              float64                                    `json:"recall_fade_days"`
	KnowledgeBaseChoice         string                                     `json:"knowledge_base_choice"`
	CheckedKnowledgeBaseIDs     []string                                   `json:"checked_knowledge_base_ids"`
	Subjects                    []UpdateMemoryOutputSettingsSubjectsItem   `json:"subjects"`
	SourcesForLikely            float64                                    `json:"sources_for_likely"`
	AgentPermissions            UpdateMemoryOutputSettingsAgentPermissions `json:"agent_permissions"`
	DroppedListDays             *float64                                   `json:"dropped_list_days"`
	ReplacedRetentionDays       *float64                                   `json:"replaced_retention_days"`
	MessageRetentionDays        *float64                                   `json:"message_retention_days"`
	PersonalRetentionDays       *float64                                   `json:"personal_retention_days"`
	RecallLogRetentionDays      *float64                                   `json:"recall_log_retention_days"`
	ReadySetSize                float64                                    `json:"ready_set_size"`
	RecallDepth                 float64                                    `json:"recall_depth"`
	CueWeights                  UpdateMemoryOutputSettingsCueWeights       `json:"cue_weights"`
	RecallCheckedMemories       float64                                    `json:"recall_checked_memories"`
}

type UpdateMemoryOutputCheckedKnowledgeBasesLeftOutItem struct {
	KnowledgeBaseID string `json:"knowledge_base_id"`
	Reason          string `json:"reason"`
}

type UpdateMemoryOutputCheckedKnowledgeBases struct {
	KnowledgeBaseIDs []string                                             `json:"knowledge_base_ids"`
	LeftOut          []UpdateMemoryOutputCheckedKnowledgeBasesLeftOutItem `json:"left_out"`
	LeftOutCount     float64                                              `json:"left_out_count"`
	Limit            float64                                              `json:"limit"`
}

type UpdateMemoryOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateMemoryOutput struct {
	ID                    string                                  `json:"id"`
	ProjectID             string                                  `json:"project_id"`
	Language              string                                  `json:"language"`
	Settings              UpdateMemoryOutputSettings              `json:"settings"`
	CheckedKnowledgeBases UpdateMemoryOutputCheckedKnowledgeBases `json:"checked_knowledge_bases"`
	CreatedAt             string                                  `json:"created_at"`
	CreatedBy             UpdateMemoryOutputCreatedBy             `json:"created_by"`
	DeletedAt             *string                                 `json:"deleted_at"`
	PurgeAfter            *string                                 `json:"purge_after"`
	SortingPendingSince   *string                                 `json:"sorting_pending_since"`
}

type UpdateMemorySourceInput struct {
	ProjectID           string         `json:"project_id"`
	MemoryID            string         `json:"memory_id"`
	SourceID            string         `json:"source_id"`
	Name                *string        `json:"name,omitzero"`
	Sorting             *string        `json:"sorting,omitzero"`
	Settings            map[string]any `json:"settings,omitzero"`
	Credentials         map[string]any `json:"credentials,omitzero"`
	RotateWebhookSecret *bool          `json:"rotate_webhook_secret,omitzero"`
}

type UpdateMemorySourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type UpdateMemorySourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateMemorySourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type UpdateMemorySourceOutput struct {
	ID              string                             `json:"id"`
	ProjectID       string                             `json:"project_id"`
	KnowledgeBaseID *string                            `json:"knowledge_base_id"`
	MemoryID        *string                            `json:"memory_id"`
	Name            string                             `json:"name"`
	Kind            string                             `json:"kind"`
	Sorting         *string                            `json:"sorting"`
	Status          string                             `json:"status"`
	Settings        map[string]any                     `json:"settings"`
	CredentialNames []string                           `json:"credential_names"`
	WebhookURL      *string                            `json:"webhook_url"`
	SignIn          *UpdateMemorySourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                             `json:"created_at"`
	CreatedBy       UpdateMemorySourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                            `json:"last_synced_at"`
	NextSyncAt      *string                            `json:"next_sync_at"`
	LastError       *UpdateMemorySourceOutputLastError `json:"last_error"`
	WebhookSecret   *string                            `json:"webhook_secret"`
}

type UpdateSavedQuestionInputVersion struct {
	Integer *int64
	String  *string
}

var updateSavedQuestionInputVersionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateSavedQuestionInputVersion) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateSavedQuestionInputVersion")
}

func (union *UpdateSavedQuestionInputVersion) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateSavedQuestionInputVersionMembers, "UpdateSavedQuestionInputVersion")
}

type UpdateSavedQuestionInputFirstPosition struct {
	Integer *int64
	String  *string
}

var updateSavedQuestionInputFirstPositionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateSavedQuestionInputFirstPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateSavedQuestionInputFirstPosition")
}

func (union *UpdateSavedQuestionInputFirstPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateSavedQuestionInputFirstPositionMembers, "UpdateSavedQuestionInputFirstPosition")
}

type UpdateSavedQuestionInputLastPosition struct {
	Integer *int64
	String  *string
}

var updateSavedQuestionInputLastPositionMembers = []unionMember{
	{kind: unionInteger},
	{kind: unionString},
}

func (union UpdateSavedQuestionInputLastPosition) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateSavedQuestionInputLastPosition")
}

func (union *UpdateSavedQuestionInputLastPosition) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateSavedQuestionInputLastPositionMembers, "UpdateSavedQuestionInputLastPosition")
}

type UpdateSavedQuestionInput struct {
	ProjectID       string                                 `json:"project_id"`
	KnowledgeBaseID string                                 `json:"knowledge_base_id"`
	SavedQuestionID string                                 `json:"saved_question_id"`
	ChunkID         *string                                `json:"chunk_id,omitzero"`
	FileID          *string                                `json:"file_id,omitzero"`
	Version         *UpdateSavedQuestionInputVersion       `json:"version,omitzero"`
	FirstPosition   *UpdateSavedQuestionInputFirstPosition `json:"first_position,omitzero"`
	LastPosition    *UpdateSavedQuestionInputLastPosition  `json:"last_position,omitzero"`
	Confirm         *bool                                  `json:"confirm,omitzero"`
}

type UpdateSavedQuestionOutputPassageCitationDocumentAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type UpdateSavedQuestionOutputPassageCitationDocumentPageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type UpdateSavedQuestionOutputPassageCitationDocument struct {
	Kind      string                                                          `json:"kind"`
	Pages     []float64                                                       `json:"pages"`
	Areas     []UpdateSavedQuestionOutputPassageCitationDocumentAreasItem     `json:"areas"`
	PageSizes []UpdateSavedQuestionOutputPassageCitationDocumentPageSizesItem `json:"page_sizes"`
}

type UpdateSavedQuestionOutputPassageCitationSpreadsheet struct {
	Kind     string  `json:"kind"`
	Sheet    *string `json:"sheet"`
	FirstRow float64 `json:"first_row"`
	LastRow  float64 `json:"last_row"`
}

type UpdateSavedQuestionOutputPassageCitationSlides struct {
	Kind   string    `json:"kind"`
	Slides []float64 `json:"slides"`
}

type UpdateSavedQuestionOutputPassageCitationWebPage struct {
	Kind    string  `json:"kind"`
	Address *string `json:"address"`
	Heading *string `json:"heading"`
}

type UpdateSavedQuestionOutputPassageCitationImageAreasItem struct {
	Page   float64 `json:"page"`
	Left   float64 `json:"left"`
	Top    float64 `json:"top"`
	Right  float64 `json:"right"`
	Bottom float64 `json:"bottom"`
}

type UpdateSavedQuestionOutputPassageCitationImagePageSizesItem struct {
	Page   float64 `json:"page"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type UpdateSavedQuestionOutputPassageCitationImage struct {
	Kind      string                                                       `json:"kind"`
	FileName  string                                                       `json:"file_name"`
	Areas     []UpdateSavedQuestionOutputPassageCitationImageAreasItem     `json:"areas"`
	PageSizes []UpdateSavedQuestionOutputPassageCitationImagePageSizesItem `json:"page_sizes"`
}

type UpdateSavedQuestionOutputPassageCitationRecording struct {
	Kind        string   `json:"kind"`
	StartSecond float64  `json:"start_second"`
	EndSecond   float64  `json:"end_second"`
	Frame       *float64 `json:"frame"`
}

type UpdateSavedQuestionOutputPassageCitation struct {
	Document    *UpdateSavedQuestionOutputPassageCitationDocument
	Spreadsheet *UpdateSavedQuestionOutputPassageCitationSpreadsheet
	Slides      *UpdateSavedQuestionOutputPassageCitationSlides
	WebPage     *UpdateSavedQuestionOutputPassageCitationWebPage
	Image       *UpdateSavedQuestionOutputPassageCitationImage
	Recording   *UpdateSavedQuestionOutputPassageCitationRecording
}

var updateSavedQuestionOutputPassageCitationMembers = []unionMember{
	{kind: unionObject, required: []string{"kind", "pages", "areas", "page_sizes"}, properties: []string{"kind", "pages", "areas", "page_sizes"}, constants: map[string]any{"kind": "document"}},
	{kind: unionObject, required: []string{"kind", "sheet", "first_row", "last_row"}, properties: []string{"kind", "sheet", "first_row", "last_row"}, constants: map[string]any{"kind": "spreadsheet"}},
	{kind: unionObject, required: []string{"kind", "slides"}, properties: []string{"kind", "slides"}, constants: map[string]any{"kind": "slides"}},
	{kind: unionObject, required: []string{"kind", "address", "heading"}, properties: []string{"kind", "address", "heading"}, constants: map[string]any{"kind": "web_page"}},
	{kind: unionObject, required: []string{"kind", "file_name", "areas", "page_sizes"}, properties: []string{"kind", "file_name", "areas", "page_sizes"}, constants: map[string]any{"kind": "image"}},
	{kind: unionObject, required: []string{"kind", "start_second", "end_second", "frame"}, properties: []string{"kind", "start_second", "end_second", "frame"}, constants: map[string]any{"kind": "recording"}},
}

func (union UpdateSavedQuestionOutputPassageCitation) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateSavedQuestionOutputPassageCitation")
}

func (union *UpdateSavedQuestionOutputPassageCitation) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateSavedQuestionOutputPassageCitationMembers, "UpdateSavedQuestionOutputPassageCitation")
}

type UpdateSavedQuestionOutputPassage struct {
	FileID        string                                    `json:"file_id"`
	FilePath      *string                                   `json:"file_path"`
	FileKind      *string                                   `json:"file_kind"`
	Version       float64                                   `json:"version"`
	FirstPosition float64                                   `json:"first_position"`
	LastPosition  float64                                   `json:"last_position"`
	Heading       *string                                   `json:"heading"`
	State         string                                    `json:"state"`
	Citation      *UpdateSavedQuestionOutputPassageCitation `json:"citation"`
}

type UpdateSavedQuestionOutputBrokenPrevious struct {
	Version       float64 `json:"version"`
	FirstPosition float64 `json:"first_position"`
	LastPosition  float64 `json:"last_position"`
}

type UpdateSavedQuestionOutputBroken struct {
	Change     string                                   `json:"change"`
	Version    *float64                                 `json:"version"`
	DetectedAt string                                   `json:"detected_at"`
	Previous   *UpdateSavedQuestionOutputBrokenPrevious `json:"previous"`
}

type UpdateSavedQuestionOutput struct {
	ID            string                           `json:"id"`
	Question      string                           `json:"question"`
	Split         string                           `json:"split"`
	Source        string                           `json:"source"`
	QuestionLogID *string                          `json:"question_log_id"`
	EndUserID     *string                          `json:"end_user_id"`
	Passage       UpdateSavedQuestionOutputPassage `json:"passage"`
	Broken        *UpdateSavedQuestionOutputBroken `json:"broken"`
	CreatedAt     string                           `json:"created_at"`
	UpdatedAt     string                           `json:"updated_at"`
}

type UpdateSourceInput struct {
	ProjectID           string         `json:"project_id"`
	KnowledgeBaseID     string         `json:"knowledge_base_id"`
	SourceID            string         `json:"source_id"`
	Name                *string        `json:"name,omitzero"`
	Settings            map[string]any `json:"settings,omitzero"`
	Credentials         map[string]any `json:"credentials,omitzero"`
	RotateWebhookSecret *bool          `json:"rotate_webhook_secret,omitzero"`
}

type UpdateSourceOutputSignIn struct {
	Status  string  `json:"status"`
	Account *string `json:"account"`
}

type UpdateSourceOutputCreatedBy struct {
	Kind string `json:"kind"`
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateSourceOutputLastError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	At      string `json:"at"`
}

type UpdateSourceOutput struct {
	ID              string                       `json:"id"`
	ProjectID       string                       `json:"project_id"`
	KnowledgeBaseID *string                      `json:"knowledge_base_id"`
	MemoryID        *string                      `json:"memory_id"`
	Name            string                       `json:"name"`
	Kind            string                       `json:"kind"`
	Sorting         *string                      `json:"sorting"`
	Status          string                       `json:"status"`
	Settings        map[string]any               `json:"settings"`
	CredentialNames []string                     `json:"credential_names"`
	WebhookURL      *string                      `json:"webhook_url"`
	SignIn          *UpdateSourceOutputSignIn    `json:"sign_in"`
	CreatedAt       string                       `json:"created_at"`
	CreatedBy       UpdateSourceOutputCreatedBy  `json:"created_by"`
	LastSyncedAt    *string                      `json:"last_synced_at"`
	NextSyncAt      *string                      `json:"next_sync_at"`
	LastError       *UpdateSourceOutputLastError `json:"last_error"`
	WebhookSecret   *string                      `json:"webhook_secret"`
}

type UpdateTableRowInputKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type UpdateTableRowInputKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type UpdateTableRowInputKeyItem struct {
	Number  *float64
	String  *string
	Integer *UpdateTableRowInputKeyItemInteger
	Blob    *UpdateTableRowInputKeyItemBlob
}

var updateTableRowInputKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union UpdateTableRowInputKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateTableRowInputKeyItem")
}

func (union *UpdateTableRowInputKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateTableRowInputKeyItemMembers, "UpdateTableRowInputKeyItem")
}

type UpdateTableRowInputValuesValueInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type UpdateTableRowInputValuesValueBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type UpdateTableRowInputValuesValue struct {
	Number  *float64
	String  *string
	Integer *UpdateTableRowInputValuesValueInteger
	Blob    *UpdateTableRowInputValuesValueBlob
}

var updateTableRowInputValuesValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union UpdateTableRowInputValuesValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateTableRowInputValuesValue")
}

func (union *UpdateTableRowInputValuesValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateTableRowInputValuesValueMembers, "UpdateTableRowInputValuesValue")
}

type UpdateTableRowInputExpectedValueInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type UpdateTableRowInputExpectedValueBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type UpdateTableRowInputExpectedValue struct {
	Number  *float64
	String  *string
	Integer *UpdateTableRowInputExpectedValueInteger
	Blob    *UpdateTableRowInputExpectedValueBlob
}

var updateTableRowInputExpectedValueMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union UpdateTableRowInputExpectedValue) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateTableRowInputExpectedValue")
}

func (union *UpdateTableRowInputExpectedValue) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateTableRowInputExpectedValueMembers, "UpdateTableRowInputExpectedValue")
}

type UpdateTableRowInput struct {
	ProjectID  string                                                `json:"project_id"`
	DatabaseID string                                                `json:"database_id"`
	TableName  string                                                `json:"table_name"`
	Key        []Nullable[UpdateTableRowInputKeyItem]                `json:"key"`
	Values     map[string]Nullable[UpdateTableRowInputValuesValue]   `json:"values"`
	Expected   map[string]Nullable[UpdateTableRowInputExpectedValue] `json:"expected"`
}

type UpdateTableRowOutputRowKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type UpdateTableRowOutputRowKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type UpdateTableRowOutputRowKeyItem struct {
	Number  *float64
	String  *string
	Integer *UpdateTableRowOutputRowKeyItemInteger
	Blob    *UpdateTableRowOutputRowKeyItemBlob
}

var updateTableRowOutputRowKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union UpdateTableRowOutputRowKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateTableRowOutputRowKeyItem")
}

func (union *UpdateTableRowOutputRowKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateTableRowOutputRowKeyItemMembers, "UpdateTableRowOutputRowKeyItem")
}

type UpdateTableRowOutputRowCellsItemObject struct {
	Type      string  `json:"type"`
	Text      string  `json:"text"`
	Size      float64 `json:"size"`
	Truncated bool    `json:"truncated"`
}

type UpdateTableRowOutputRowCellsItem struct {
	Number *float64
	String *string
	Object *UpdateTableRowOutputRowCellsItemObject
}

var updateTableRowOutputRowCellsItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text", "size", "truncated"}, properties: []string{"type", "text", "size", "truncated"}},
}

func (union UpdateTableRowOutputRowCellsItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateTableRowOutputRowCellsItem")
}

func (union *UpdateTableRowOutputRowCellsItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateTableRowOutputRowCellsItemMembers, "UpdateTableRowOutputRowCellsItem")
}

type UpdateTableRowOutputRow struct {
	Key   []*UpdateTableRowOutputRowKeyItem   `json:"key"`
	Cells []*UpdateTableRowOutputRowCellsItem `json:"cells"`
}

type UpdateTableRowOutputReturnedKeyItemInteger struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type UpdateTableRowOutputReturnedKeyItemBlob struct {
	Type string `json:"type"`
	Hex  string `json:"hex"`
}

type UpdateTableRowOutputReturnedKeyItem struct {
	Number  *float64
	String  *string
	Integer *UpdateTableRowOutputReturnedKeyItemInteger
	Blob    *UpdateTableRowOutputReturnedKeyItemBlob
}

var updateTableRowOutputReturnedKeyItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
	{kind: unionObject, required: []string{"type", "text"}, properties: []string{"type", "text"}, constants: map[string]any{"type": "integer"}},
	{kind: unionObject, required: []string{"type", "hex"}, properties: []string{"type", "hex"}, constants: map[string]any{"type": "blob"}},
}

func (union UpdateTableRowOutputReturnedKeyItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UpdateTableRowOutputReturnedKeyItem")
}

func (union *UpdateTableRowOutputReturnedKeyItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, updateTableRowOutputReturnedKeyItemMembers, "UpdateTableRowOutputReturnedKeyItem")
}

type UpdateTableRowOutput struct {
	Row         *UpdateTableRowOutputRow               `json:"row"`
	ReturnedKey []*UpdateTableRowOutputReturnedKeyItem `json:"returned_key"`
}

type UploadTableImportInput struct {
	ProjectID  string      `json:"project_id"`
	DatabaseID string      `json:"database_id"`
	TableName  string      `json:"table_name"`
	Content    FileContent `json:"-"`
}

type UploadTableImportOutputTableImportColumnsItem struct {
	SourceIndex  float64 `json:"source_index"`
	Header       string  `json:"header"`
	Name         string  `json:"name"`
	InferredType string  `json:"inferred_type"`
}

type UploadTableImportOutputTableImportPreviewRowsItemItem struct {
	Number *float64
	String *string
}

var uploadTableImportOutputTableImportPreviewRowsItemItemMembers = []unionMember{
	{kind: unionNumber},
	{kind: unionString},
}

func (union UploadTableImportOutputTableImportPreviewRowsItemItem) MarshalJSON() ([]byte, error) {
	return marshalUnion(union, "UploadTableImportOutputTableImportPreviewRowsItemItem")
}

func (union *UploadTableImportOutputTableImportPreviewRowsItemItem) UnmarshalJSON(data []byte) error {
	return unmarshalUnion(data, union, uploadTableImportOutputTableImportPreviewRowsItemItemMembers, "UploadTableImportOutputTableImportPreviewRowsItemItem")
}

type UploadTableImportOutputTableImport struct {
	ID          string                                                     `json:"id"`
	TableName   string                                                     `json:"table_name"`
	Format      string                                                     `json:"format"`
	FileBytes   float64                                                    `json:"file_bytes"`
	RowCount    float64                                                    `json:"row_count"`
	ExpiresAt   string                                                     `json:"expires_at"`
	Columns     []UploadTableImportOutputTableImportColumnsItem            `json:"columns"`
	PreviewRows [][]*UploadTableImportOutputTableImportPreviewRowsItemItem `json:"preview_rows"`
}

type UploadTableImportOutput struct {
	TableImport UploadTableImportOutputTableImport `json:"table_import"`
}

type VerifySecondFactorInput struct {
	ChallengeToken string  `json:"challenge_token"`
	Method         *string `json:"method,omitzero"`
	Code           string  `json:"code"`
}

type VerifySecondFactorOutputSessionAccount struct {
	ID         string  `json:"id"`
	Email      string  `json:"email"`
	Name       string  `json:"name"`
	Status     string  `json:"status"`
	CreatedAt  string  `json:"created_at"`
	DecidedAt  *string `json:"decided_at"`
	IsOperator bool    `json:"is_operator"`
}

type VerifySecondFactorOutputSession struct {
	Account             VerifySecondFactorOutputSessionAccount `json:"account"`
	SecondFactorEnabled bool                                   `json:"second_factor_enabled"`
	ExpiresAt           string                                 `json:"expires_at"`
}

type VerifySecondFactorOutput struct {
	SessionToken string                          `json:"session_token"`
	Session      VerifySecondFactorOutputSession `json:"session"`
}
