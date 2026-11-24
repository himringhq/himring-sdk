package himring

import "context"

func (c *Client) AcceptInvitation(ctx context.Context, input AcceptInvitationInput, options ...RequestOption) (*AcceptInvitationOutput, error) {
	var output AcceptInvitationOutput
	if err := c.callOperation(ctx, "accept_invitation", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) AddDatabaseMigration(ctx context.Context, input AddDatabaseMigrationInput, options ...RequestOption) (*AddDatabaseMigrationOutput, error) {
	var output AddDatabaseMigrationOutput
	if err := c.callOperation(ctx, "add_database_migration", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) AddMessages(ctx context.Context, input AddMessagesInput, options ...RequestOption) (*AddMessagesOutput, error) {
	var output AddMessagesOutput
	if err := c.callOperation(ctx, "add_messages", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) AnswerQuestion(ctx context.Context, input AnswerQuestionInput, options ...RequestOption) (*AnswerQuestionOutput, error) {
	var output AnswerQuestionOutput
	if err := c.callOperation(ctx, "answer_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ApplyTableImport(ctx context.Context, input ApplyTableImportInput, options ...RequestOption) (*ApplyTableImportOutput, error) {
	var output ApplyTableImportOutput
	if err := c.callOperation(ctx, "apply_table_import", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) BeginSecondFactorSetup(ctx context.Context, input BeginSecondFactorSetupInput, options ...RequestOption) (*BeginSecondFactorSetupOutput, error) {
	var output BeginSecondFactorSetupOutput
	if err := c.callOperation(ctx, "begin_second_factor_setup", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CancelUpload(ctx context.Context, input CancelUploadInput, options ...RequestOption) (*CancelUploadOutput, error) {
	var output CancelUploadOutput
	if err := c.callOperation(ctx, "cancel_upload", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ChangeTableColumns(ctx context.Context, input ChangeTableColumnsInput, options ...RequestOption) (*ChangeTableColumnsOutput, error) {
	var output ChangeTableColumnsOutput
	if err := c.callOperation(ctx, "change_table_columns", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CheckTableImport(ctx context.Context, input CheckTableImportInput, options ...RequestOption) (*CheckTableImportOutput, error) {
	var output CheckTableImportOutput
	if err := c.callOperation(ctx, "check_table_import", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CompactDatabase(ctx context.Context, input CompactDatabaseInput, options ...RequestOption) (*CompactDatabaseOutput, error) {
	var output CompactDatabaseOutput
	if err := c.callOperation(ctx, "compact_database", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CompareIndexSearch(ctx context.Context, input CompareIndexSearchInput, options ...RequestOption) (*CompareIndexSearchOutput, error) {
	var output CompareIndexSearchOutput
	if err := c.callOperation(ctx, "compare_index_search", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CompleteUpload(ctx context.Context, input CompleteUploadInput, options ...RequestOption) (*CompleteUploadOutput, error) {
	var output CompleteUploadOutput
	if err := c.callOperation(ctx, "complete_upload", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ConfirmSecondFactorSetup(ctx context.Context, input ConfirmSecondFactorSetupInput, options ...RequestOption) (*ConfirmSecondFactorSetupOutput, error) {
	var output ConfirmSecondFactorSetupOutput
	if err := c.callOperation(ctx, "confirm_second_factor_setup", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateAPIKey(ctx context.Context, input CreateAPIKeyInput, options ...RequestOption) (*CreateAPIKeyOutput, error) {
	var output CreateAPIKeyOutput
	if err := c.callOperation(ctx, "create_api_key", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateCorrection(ctx context.Context, input CreateCorrectionInput, options ...RequestOption) (*CreateCorrectionOutput, error) {
	var output CreateCorrectionOutput
	if err := c.callOperation(ctx, "create_correction", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateDatabase(ctx context.Context, input CreateDatabaseInput, options ...RequestOption) (*CreateDatabaseOutput, error) {
	var output CreateDatabaseOutput
	if err := c.callOperation(ctx, "create_database", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateIndex(ctx context.Context, input CreateIndexInput, options ...RequestOption) (*CreateIndexOutput, error) {
	var output CreateIndexOutput
	if err := c.callOperation(ctx, "create_index", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateKnowledgeBase(ctx context.Context, input CreateKnowledgeBaseInput, options ...RequestOption) (*CreateKnowledgeBaseOutput, error) {
	var output CreateKnowledgeBaseOutput
	if err := c.callOperation(ctx, "create_knowledge_base", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateMemorySource(ctx context.Context, input CreateMemorySourceInput, options ...RequestOption) (*CreateMemorySourceOutput, error) {
	var output CreateMemorySourceOutput
	if err := c.callOperation(ctx, "create_memory_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateProject(ctx context.Context, input CreateProjectInput, options ...RequestOption) (*CreateProjectOutput, error) {
	var output CreateProjectOutput
	if err := c.callOperation(ctx, "create_project", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateSource(ctx context.Context, input CreateSourceInput, options ...RequestOption) (*CreateSourceOutput, error) {
	var output CreateSourceOutput
	if err := c.callOperation(ctx, "create_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateTable(ctx context.Context, input CreateTableInput, options ...RequestOption) (*CreateTableOutput, error) {
	var output CreateTableOutput
	if err := c.callOperation(ctx, "create_table", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) CreateUpload(ctx context.Context, input CreateUploadInput, options ...RequestOption) (*CreateUploadOutput, error) {
	var output CreateUploadOutput
	if err := c.callOperation(ctx, "create_upload", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteDatabase(ctx context.Context, input DeleteDatabaseInput, options ...RequestOption) (*DeleteDatabaseOutput, error) {
	var output DeleteDatabaseOutput
	if err := c.callOperation(ctx, "delete_database", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteFile(ctx context.Context, input DeleteFileInput, options ...RequestOption) (*DeleteFileOutput, error) {
	var output DeleteFileOutput
	if err := c.callOperation(ctx, "delete_file", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteIndex(ctx context.Context, input DeleteIndexInput, options ...RequestOption) (*DeleteIndexOutput, error) {
	var output DeleteIndexOutput
	if err := c.callOperation(ctx, "delete_index", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteIndexRecord(ctx context.Context, input DeleteIndexRecordInput, options ...RequestOption) (*DeleteIndexRecordOutput, error) {
	var output DeleteIndexRecordOutput
	if err := c.callOperation(ctx, "delete_index_record", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteKnowledgeBase(ctx context.Context, input DeleteKnowledgeBaseInput, options ...RequestOption) (*DeleteKnowledgeBaseOutput, error) {
	var output DeleteKnowledgeBaseOutput
	if err := c.callOperation(ctx, "delete_knowledge_base", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteMemory(ctx context.Context, input DeleteMemoryInput, options ...RequestOption) (*DeleteMemoryOutput, error) {
	var output DeleteMemoryOutput
	if err := c.callOperation(ctx, "delete_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteMemorySavedQuestion(ctx context.Context, input DeleteMemorySavedQuestionInput, options ...RequestOption) (*DeleteMemorySavedQuestionOutput, error) {
	var output DeleteMemorySavedQuestionOutput
	if err := c.callOperation(ctx, "delete_memory_saved_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteMemorySource(ctx context.Context, input DeleteMemorySourceInput, options ...RequestOption) (*DeleteMemorySourceOutput, error) {
	var output DeleteMemorySourceOutput
	if err := c.callOperation(ctx, "delete_memory_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteProject(ctx context.Context, input DeleteProjectInput, options ...RequestOption) (*DeleteProjectOutput, error) {
	var output DeleteProjectOutput
	if err := c.callOperation(ctx, "delete_project", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteSavedQuery(ctx context.Context, input DeleteSavedQueryInput, options ...RequestOption) (*DeleteSavedQueryOutput, error) {
	var output DeleteSavedQueryOutput
	if err := c.callOperation(ctx, "delete_saved_query", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteSavedQuestion(ctx context.Context, input DeleteSavedQuestionInput, options ...RequestOption) (*DeleteSavedQuestionOutput, error) {
	var output DeleteSavedQuestionOutput
	if err := c.callOperation(ctx, "delete_saved_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteSource(ctx context.Context, input DeleteSourceInput, options ...RequestOption) (*DeleteSourceOutput, error) {
	var output DeleteSourceOutput
	if err := c.callOperation(ctx, "delete_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DeleteTableRows(ctx context.Context, input DeleteTableRowsInput, options ...RequestOption) (*DeleteTableRowsOutput, error) {
	var output DeleteTableRowsOutput
	if err := c.callOperation(ctx, "delete_table_rows", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DiscardCorrection(ctx context.Context, input DiscardCorrectionInput, options ...RequestOption) (*DiscardCorrectionOutput, error) {
	var output DiscardCorrectionOutput
	if err := c.callOperation(ctx, "discard_correction", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DiscardTableImport(ctx context.Context, input DiscardTableImportInput, options ...RequestOption) (*DiscardTableImportOutput, error) {
	var output DiscardTableImportOutput
	if err := c.callOperation(ctx, "discard_table_import", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DismissFlaggedQuestion(ctx context.Context, input DismissFlaggedQuestionInput, options ...RequestOption) (*DismissFlaggedQuestionOutput, error) {
	var output DismissFlaggedQuestionOutput
	if err := c.callOperation(ctx, "dismiss_flagged_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) DownloadIndex(ctx context.Context, input DownloadIndexInput, options ...RequestOption) (*Download, error) {
	return c.downloadOperation(ctx, "download_index", input, options)
}

func (c *Client) EnableMemory(ctx context.Context, input EnableMemoryInput, options ...RequestOption) (*EnableMemoryOutput, error) {
	var output EnableMemoryOutput
	if err := c.callOperation(ctx, "enable_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) EraseEndUser(ctx context.Context, input EraseEndUserInput, options ...RequestOption) (*EraseEndUserOutput, error) {
	var output EraseEndUserOutput
	if err := c.callOperation(ctx, "erase_end_user", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ExportIndexRecords(ctx context.Context, input ExportIndexRecordsInput, options ...RequestOption) (*Download, error) {
	return c.downloadOperation(ctx, "export_index_records", input, options)
}

func (c *Client) ExportMemories(ctx context.Context, input ExportMemoriesInput, options ...RequestOption) (*Download, error) {
	return c.downloadOperation(ctx, "export_memories", input, options)
}

func (c *Client) ExportTableRows(ctx context.Context, input ExportTableRowsInput, options ...RequestOption) (*Download, error) {
	return c.downloadOperation(ctx, "export_table_rows", input, options)
}

func (c *Client) FinishSourceSignIn(ctx context.Context, input FinishSourceSignInInput, options ...RequestOption) (*FinishSourceSignInOutput, error) {
	var output FinishSourceSignInOutput
	if err := c.callOperation(ctx, "finish_source_sign_in", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ForgetMemory(ctx context.Context, input ForgetMemoryInput, options ...RequestOption) (*ForgetMemoryOutput, error) {
	var output ForgetMemoryOutput
	if err := c.callOperation(ctx, "forget_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetCorrection(ctx context.Context, input GetCorrectionInput, options ...RequestOption) (*GetCorrectionOutput, error) {
	var output GetCorrectionOutput
	if err := c.callOperation(ctx, "get_correction", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetCorrectionPass(ctx context.Context, input GetCorrectionPassInput, options ...RequestOption) (*GetCorrectionPassOutput, error) {
	var output GetCorrectionPassOutput
	if err := c.callOperation(ctx, "get_correction_pass", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetDatabase(ctx context.Context, input GetDatabaseInput, options ...RequestOption) (*GetDatabaseOutput, error) {
	var output GetDatabaseOutput
	if err := c.callOperation(ctx, "get_database", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetDownloadLink(ctx context.Context, input GetDownloadLinkInput, options ...RequestOption) (*GetDownloadLinkOutput, error) {
	var output GetDownloadLinkOutput
	if err := c.callOperation(ctx, "get_download_link", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetFile(ctx context.Context, input GetFileInput, options ...RequestOption) (*GetFileOutput, error) {
	var output GetFileOutput
	if err := c.callOperation(ctx, "get_file", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetFlaggedQuestion(ctx context.Context, input GetFlaggedQuestionInput, options ...RequestOption) (*GetFlaggedQuestionOutput, error) {
	var output GetFlaggedQuestionOutput
	if err := c.callOperation(ctx, "get_flagged_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetIndex(ctx context.Context, input GetIndexInput, options ...RequestOption) (*GetIndexOutput, error) {
	var output GetIndexOutput
	if err := c.callOperation(ctx, "get_index", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetIndexRecord(ctx context.Context, input GetIndexRecordInput, options ...RequestOption) (*GetIndexRecordOutput, error) {
	var output GetIndexRecordOutput
	if err := c.callOperation(ctx, "get_index_record", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetIndexStats(ctx context.Context, input GetIndexStatsInput, options ...RequestOption) (*GetIndexStatsOutput, error) {
	var output GetIndexStatsOutput
	if err := c.callOperation(ctx, "get_index_stats", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetKnowledgeBase(ctx context.Context, input GetKnowledgeBaseInput, options ...RequestOption) (*GetKnowledgeBaseOutput, error) {
	var output GetKnowledgeBaseOutput
	if err := c.callOperation(ctx, "get_knowledge_base", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetMemory(ctx context.Context, input GetMemoryInput, options ...RequestOption) (*GetMemoryOutput, error) {
	var output GetMemoryOutput
	if err := c.callOperation(ctx, "get_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetMemoryContext(ctx context.Context, input GetMemoryContextInput, options ...RequestOption) (*GetMemoryContextOutput, error) {
	var output GetMemoryContextOutput
	if err := c.callOperation(ctx, "get_memory_context", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetMemoryScores(ctx context.Context, input GetMemoryScoresInput, options ...RequestOption) (*GetMemoryScoresOutput, error) {
	var output GetMemoryScoresOutput
	if err := c.callOperation(ctx, "get_memory_scores", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetMemorySource(ctx context.Context, input GetMemorySourceInput, options ...RequestOption) (*GetMemorySourceOutput, error) {
	var output GetMemorySourceOutput
	if err := c.callOperation(ctx, "get_memory_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetMemoryWebhook(ctx context.Context, input GetMemoryWebhookInput, options ...RequestOption) (*GetMemoryWebhookOutput, error) {
	var output GetMemoryWebhookOutput
	if err := c.callOperation(ctx, "get_memory_webhook", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetMessage(ctx context.Context, input GetMessageInput, options ...RequestOption) (*GetMessageOutput, error) {
	var output GetMessageOutput
	if err := c.callOperation(ctx, "get_message", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetProject(ctx context.Context, input GetProjectInput, options ...RequestOption) (*GetProjectOutput, error) {
	var output GetProjectOutput
	if err := c.callOperation(ctx, "get_project", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetQuestionSet(ctx context.Context, input GetQuestionSetInput, options ...RequestOption) (*GetQuestionSetOutput, error) {
	var output GetQuestionSetOutput
	if err := c.callOperation(ctx, "get_question_set", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetSavedQuestion(ctx context.Context, input GetSavedQuestionInput, options ...RequestOption) (*GetSavedQuestionOutput, error) {
	var output GetSavedQuestionOutput
	if err := c.callOperation(ctx, "get_saved_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetScorecard(ctx context.Context, input GetScorecardInput, options ...RequestOption) (*GetScorecardOutput, error) {
	var output GetScorecardOutput
	if err := c.callOperation(ctx, "get_scorecard", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetSession(ctx context.Context, input GetSessionInput, options ...RequestOption) (*GetSessionOutput, error) {
	var output GetSessionOutput
	if err := c.callOperation(ctx, "get_session", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetSource(ctx context.Context, input GetSourceInput, options ...RequestOption) (*GetSourceOutput, error) {
	var output GetSourceOutput
	if err := c.callOperation(ctx, "get_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetTableRow(ctx context.Context, input GetTableRowInput, options ...RequestOption) (*GetTableRowOutput, error) {
	var output GetTableRowOutput
	if err := c.callOperation(ctx, "get_table_row", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) GetUpload(ctx context.Context, input GetUploadInput, options ...RequestOption) (*GetUploadOutput, error) {
	var output GetUploadOutput
	if err := c.callOperation(ctx, "get_upload", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ImportAnswerLog(ctx context.Context, input ImportAnswerLogInput, options ...RequestOption) (*ImportAnswerLogOutput, error) {
	var output ImportAnswerLogOutput
	if err := c.callOperation(ctx, "import_answer_log", input, input.Content, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ImportIndexRecords(ctx context.Context, input ImportIndexRecordsInput, options ...RequestOption) (*ImportIndexRecordsOutput, error) {
	var output ImportIndexRecordsOutput
	if err := c.callOperation(ctx, "import_index_records", input, input.Content, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ImportSavedQuestions(ctx context.Context, input ImportSavedQuestionsInput, options ...RequestOption) (*ImportSavedQuestionsOutput, error) {
	var output ImportSavedQuestionsOutput
	if err := c.callOperation(ctx, "import_saved_questions", input, input.Content, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) IngestItems(ctx context.Context, input IngestItemsInput, options ...RequestOption) (*IngestItemsOutput, error) {
	var output IngestItemsOutput
	if err := c.callOperation(ctx, "ingest_items", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) InsertTableRow(ctx context.Context, input InsertTableRowInput, options ...RequestOption) (*InsertTableRowOutput, error) {
	var output InsertTableRowOutput
	if err := c.callOperation(ctx, "insert_table_row", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) InspectMemory(ctx context.Context, input InspectMemoryInput, options ...RequestOption) (*InspectMemoryOutput, error) {
	var output InspectMemoryOutput
	if err := c.callOperation(ctx, "inspect_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) InviteMember(ctx context.Context, input InviteMemberInput, options ...RequestOption) (*InviteMemberOutput, error) {
	var output InviteMemberOutput
	if err := c.callOperation(ctx, "invite_member", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListAPIKeyPermissionChanges(ctx context.Context, input ListAPIKeyPermissionChangesInput, options ...RequestOption) (*ListAPIKeyPermissionChangesOutput, error) {
	var output ListAPIKeyPermissionChangesOutput
	if err := c.callOperation(ctx, "list_api_key_permission_changes", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListAPIKeys(ctx context.Context, input ListAPIKeysInput, options ...RequestOption) (*ListAPIKeysOutput, error) {
	var output ListAPIKeysOutput
	if err := c.callOperation(ctx, "list_api_keys", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListCorrectionPasses(ctx context.Context, input ListCorrectionPassesInput, options ...RequestOption) (*ListCorrectionPassesOutput, error) {
	var output ListCorrectionPassesOutput
	if err := c.callOperation(ctx, "list_correction_passes", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListCorrections(ctx context.Context, input ListCorrectionsInput, options ...RequestOption) (*ListCorrectionsOutput, error) {
	var output ListCorrectionsOutput
	if err := c.callOperation(ctx, "list_corrections", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListDatabaseMigrations(ctx context.Context, input ListDatabaseMigrationsInput, options ...RequestOption) (*ListDatabaseMigrationsOutput, error) {
	var output ListDatabaseMigrationsOutput
	if err := c.callOperation(ctx, "list_database_migrations", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListDatabaseTables(ctx context.Context, input ListDatabaseTablesInput, options ...RequestOption) (*ListDatabaseTablesOutput, error) {
	var output ListDatabaseTablesOutput
	if err := c.callOperation(ctx, "list_database_tables", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListDatabases(ctx context.Context, input ListDatabasesInput, options ...RequestOption) (*ListDatabasesOutput, error) {
	var output ListDatabasesOutput
	if err := c.callOperation(ctx, "list_databases", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListFileVersions(ctx context.Context, input ListFileVersionsInput, options ...RequestOption) (*ListFileVersionsOutput, error) {
	var output ListFileVersionsOutput
	if err := c.callOperation(ctx, "list_file_versions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListFiles(ctx context.Context, input ListFilesInput, options ...RequestOption) (*ListFilesOutput, error) {
	var output ListFilesOutput
	if err := c.callOperation(ctx, "list_files", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListFlaggedQuestions(ctx context.Context, input ListFlaggedQuestionsInput, options ...RequestOption) (*ListFlaggedQuestionsOutput, error) {
	var output ListFlaggedQuestionsOutput
	if err := c.callOperation(ctx, "list_flagged_questions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListFolder(ctx context.Context, input ListFolderInput, options ...RequestOption) (*ListFolderOutput, error) {
	var output ListFolderOutput
	if err := c.callOperation(ctx, "list_folder", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListForgettingSuggestions(ctx context.Context, input ListForgettingSuggestionsInput, options ...RequestOption) (*ListForgettingSuggestionsOutput, error) {
	var output ListForgettingSuggestionsOutput
	if err := c.callOperation(ctx, "list_forgetting_suggestions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListIndexRecords(ctx context.Context, input ListIndexRecordsInput, options ...RequestOption) (*ListIndexRecordsOutput, error) {
	var output ListIndexRecordsOutput
	if err := c.callOperation(ctx, "list_index_records", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListIndexes(ctx context.Context, input ListIndexesInput, options ...RequestOption) (*ListIndexesOutput, error) {
	var output ListIndexesOutput
	if err := c.callOperation(ctx, "list_indexes", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListInvitations(ctx context.Context, input ListInvitationsInput, options ...RequestOption) (*ListInvitationsOutput, error) {
	var output ListInvitationsOutput
	if err := c.callOperation(ctx, "list_invitations", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListKnowledgeBases(ctx context.Context, input ListKnowledgeBasesInput, options ...RequestOption) (*ListKnowledgeBasesOutput, error) {
	var output ListKnowledgeBasesOutput
	if err := c.callOperation(ctx, "list_knowledge_bases", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListLearnedChanges(ctx context.Context, input ListLearnedChangesInput, options ...RequestOption) (*ListLearnedChangesOutput, error) {
	var output ListLearnedChangesOutput
	if err := c.callOperation(ctx, "list_learned_changes", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMembers(ctx context.Context, input ListMembersInput, options ...RequestOption) (*ListMembersOutput, error) {
	var output ListMembersOutput
	if err := c.callOperation(ctx, "list_members", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemories(ctx context.Context, input ListMemoriesInput, options ...RequestOption) (*ListMemoriesOutput, error) {
	var output ListMemoriesOutput
	if err := c.callOperation(ctx, "list_memories", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemoryDecisions(ctx context.Context, input ListMemoryDecisionsInput, options ...RequestOption) (*ListMemoryDecisionsOutput, error) {
	var output ListMemoryDecisionsOutput
	if err := c.callOperation(ctx, "list_memory_decisions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemoryOwners(ctx context.Context, input ListMemoryOwnersInput, options ...RequestOption) (*ListMemoryOwnersOutput, error) {
	var output ListMemoryOwnersOutput
	if err := c.callOperation(ctx, "list_memory_owners", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemoryReviews(ctx context.Context, input ListMemoryReviewsInput, options ...RequestOption) (*ListMemoryReviewsOutput, error) {
	var output ListMemoryReviewsOutput
	if err := c.callOperation(ctx, "list_memory_reviews", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemorySavedQuestions(ctx context.Context, input ListMemorySavedQuestionsInput, options ...RequestOption) (*ListMemorySavedQuestionsOutput, error) {
	var output ListMemorySavedQuestionsOutput
	if err := c.callOperation(ctx, "list_memory_saved_questions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemorySources(ctx context.Context, input ListMemorySourcesInput, options ...RequestOption) (*ListMemorySourcesOutput, error) {
	var output ListMemorySourcesOutput
	if err := c.callOperation(ctx, "list_memory_sources", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMemoryWebhookDeliveries(ctx context.Context, input ListMemoryWebhookDeliveriesInput, options ...RequestOption) (*ListMemoryWebhookDeliveriesOutput, error) {
	var output ListMemoryWebhookDeliveriesOutput
	if err := c.callOperation(ctx, "list_memory_webhook_deliveries", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMessages(ctx context.Context, input ListMessagesInput, options ...RequestOption) (*ListMessagesOutput, error) {
	var output ListMessagesOutput
	if err := c.callOperation(ctx, "list_messages", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMetadataKeys(ctx context.Context, input ListMetadataKeysInput, options ...RequestOption) (*ListMetadataKeysOutput, error) {
	var output ListMetadataKeysOutput
	if err := c.callOperation(ctx, "list_metadata_keys", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListMetadataValues(ctx context.Context, input ListMetadataValuesInput, options ...RequestOption) (*ListMetadataValuesOutput, error) {
	var output ListMetadataValuesOutput
	if err := c.callOperation(ctx, "list_metadata_values", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListOperations(ctx context.Context, input ListOperationsInput, options ...RequestOption) (*ListOperationsOutput, error) {
	var output ListOperationsOutput
	if err := c.callOperation(ctx, "list_operations", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListProjects(ctx context.Context, input ListProjectsInput, options ...RequestOption) (*ListProjectsOutput, error) {
	var output ListProjectsOutput
	if err := c.callOperation(ctx, "list_projects", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListQuestions(ctx context.Context, input ListQuestionsInput, options ...RequestOption) (*ListQuestionsOutput, error) {
	var output ListQuestionsOutput
	if err := c.callOperation(ctx, "list_questions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListSavedQueries(ctx context.Context, input ListSavedQueriesInput, options ...RequestOption) (*ListSavedQueriesOutput, error) {
	var output ListSavedQueriesOutput
	if err := c.callOperation(ctx, "list_saved_queries", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListSavedQuestions(ctx context.Context, input ListSavedQuestionsInput, options ...RequestOption) (*ListSavedQuestionsOutput, error) {
	var output ListSavedQuestionsOutput
	if err := c.callOperation(ctx, "list_saved_questions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListScorecardResults(ctx context.Context, input ListScorecardResultsInput, options ...RequestOption) (*ListScorecardResultsOutput, error) {
	var output ListScorecardResultsOutput
	if err := c.callOperation(ctx, "list_scorecard_results", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListScorecards(ctx context.Context, input ListScorecardsInput, options ...RequestOption) (*ListScorecardsOutput, error) {
	var output ListScorecardsOutput
	if err := c.callOperation(ctx, "list_scorecards", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListSourceItems(ctx context.Context, input ListSourceItemsInput, options ...RequestOption) (*ListSourceItemsOutput, error) {
	var output ListSourceItemsOutput
	if err := c.callOperation(ctx, "list_source_items", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListSourceSyncs(ctx context.Context, input ListSourceSyncsInput, options ...RequestOption) (*ListSourceSyncsOutput, error) {
	var output ListSourceSyncsOutput
	if err := c.callOperation(ctx, "list_source_syncs", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListSources(ctx context.Context, input ListSourcesInput, options ...RequestOption) (*ListSourcesOutput, error) {
	var output ListSourcesOutput
	if err := c.callOperation(ctx, "list_sources", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListTableRows(ctx context.Context, input ListTableRowsInput, options ...RequestOption) (*ListTableRowsOutput, error) {
	var output ListTableRowsOutput
	if err := c.callOperation(ctx, "list_table_rows", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ListVersionBlocks(ctx context.Context, input ListVersionBlocksInput, options ...RequestOption) (*ListVersionBlocksOutput, error) {
	var output ListVersionBlocksOutput
	if err := c.callOperation(ctx, "list_version_blocks", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) PreviewCreateTable(ctx context.Context, input PreviewCreateTableInput, options ...RequestOption) (*PreviewCreateTableOutput, error) {
	var output PreviewCreateTableOutput
	if err := c.callOperation(ctx, "preview_create_table", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) PreviewIndexSearch(ctx context.Context, input PreviewIndexSearchInput, options ...RequestOption) (*PreviewIndexSearchOutput, error) {
	var output PreviewIndexSearchOutput
	if err := c.callOperation(ctx, "preview_index_search", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) PreviewTableColumnChanges(ctx context.Context, input PreviewTableColumnChangesInput, options ...RequestOption) (*PreviewTableColumnChangesOutput, error) {
	var output PreviewTableColumnChangesOutput
	if err := c.callOperation(ctx, "preview_table_column_changes", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) PromoteCorrection(ctx context.Context, input PromoteCorrectionInput, options ...RequestOption) (*PromoteCorrectionOutput, error) {
	var output PromoteCorrectionOutput
	if err := c.callOperation(ctx, "promote_correction", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) PromoteMemory(ctx context.Context, input PromoteMemoryInput, options ...RequestOption) (*PromoteMemoryOutput, error) {
	var output PromoteMemoryOutput
	if err := c.callOperation(ctx, "promote_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ProposeCorrections(ctx context.Context, input ProposeCorrectionsInput, options ...RequestOption) (*ProposeCorrectionsOutput, error) {
	var output ProposeCorrectionsOutput
	if err := c.callOperation(ctx, "propose_corrections", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ProposeDatabaseChange(ctx context.Context, input ProposeDatabaseChangeInput, options ...RequestOption) (*ProposeDatabaseChangeOutput, error) {
	var output ProposeDatabaseChangeOutput
	if err := c.callOperation(ctx, "propose_database_change", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RecallMemories(ctx context.Context, input RecallMemoriesInput, options ...RequestOption) (*RecallMemoriesOutput, error) {
	var output RecallMemoriesOutput
	if err := c.callOperation(ctx, "recall_memories", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RecordAnswerEvents(ctx context.Context, input RecordAnswerEventsInput, options ...RequestOption) (*RecordAnswerEventsOutput, error) {
	var output RecordAnswerEventsOutput
	if err := c.callOperation(ctx, "record_answer_events", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RecoverMemory(ctx context.Context, input RecoverMemoryInput, options ...RequestOption) (*RecoverMemoryOutput, error) {
	var output RecoverMemoryOutput
	if err := c.callOperation(ctx, "recover_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RemoveMember(ctx context.Context, input RemoveMemberInput, options ...RequestOption) (*RemoveMemberOutput, error) {
	var output RemoveMemberOutput
	if err := c.callOperation(ctx, "remove_member", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RemoveMemoryWebhook(ctx context.Context, input RemoveMemoryWebhookInput, options ...RequestOption) (*RemoveMemoryWebhookOutput, error) {
	var output RemoveMemoryWebhookOutput
	if err := c.callOperation(ctx, "remove_memory_webhook", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreDatabase(ctx context.Context, input RestoreDatabaseInput, options ...RequestOption) (*RestoreDatabaseOutput, error) {
	var output RestoreDatabaseOutput
	if err := c.callOperation(ctx, "restore_database", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreFile(ctx context.Context, input RestoreFileInput, options ...RequestOption) (*RestoreFileOutput, error) {
	var output RestoreFileOutput
	if err := c.callOperation(ctx, "restore_file", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreIndex(ctx context.Context, input RestoreIndexInput, options ...RequestOption) (*RestoreIndexOutput, error) {
	var output RestoreIndexOutput
	if err := c.callOperation(ctx, "restore_index", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreIndexSnapshot(ctx context.Context, input RestoreIndexSnapshotInput, options ...RequestOption) (*RestoreIndexSnapshotOutput, error) {
	var output RestoreIndexSnapshotOutput
	if err := c.callOperation(ctx, "restore_index_snapshot", input, input.Content, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreKnowledgeBase(ctx context.Context, input RestoreKnowledgeBaseInput, options ...RequestOption) (*RestoreKnowledgeBaseOutput, error) {
	var output RestoreKnowledgeBaseOutput
	if err := c.callOperation(ctx, "restore_knowledge_base", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreMemory(ctx context.Context, input RestoreMemoryInput, options ...RequestOption) (*RestoreMemoryOutput, error) {
	var output RestoreMemoryOutput
	if err := c.callOperation(ctx, "restore_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RestoreProject(ctx context.Context, input RestoreProjectInput, options ...RequestOption) (*RestoreProjectOutput, error) {
	var output RestoreProjectOutput
	if err := c.callOperation(ctx, "restore_project", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ReviewFlaggedQuestions(ctx context.Context, input ReviewFlaggedQuestionsInput, options ...RequestOption) (*ReviewFlaggedQuestionsOutput, error) {
	var output ReviewFlaggedQuestionsOutput
	if err := c.callOperation(ctx, "review_flagged_questions", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RevokeAPIKey(ctx context.Context, input RevokeAPIKeyInput, options ...RequestOption) (*RevokeAPIKeyOutput, error) {
	var output RevokeAPIKeyOutput
	if err := c.callOperation(ctx, "revoke_api_key", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RevokeInvitation(ctx context.Context, input RevokeInvitationInput, options ...RequestOption) (*RevokeInvitationOutput, error) {
	var output RevokeInvitationOutput
	if err := c.callOperation(ctx, "revoke_invitation", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) RunDatabaseSQL(ctx context.Context, input RunDatabaseSQLInput, options ...RequestOption) (*RunDatabaseSQLOutput, error) {
	var output RunDatabaseSQLOutput
	if err := c.callOperation(ctx, "run_database_sql", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SaveIndexRecord(ctx context.Context, input SaveIndexRecordInput, options ...RequestOption) (*SaveIndexRecordOutput, error) {
	var output SaveIndexRecordOutput
	if err := c.callOperation(ctx, "save_index_record", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SaveMemoryQuestion(ctx context.Context, input SaveMemoryQuestionInput, options ...RequestOption) (*SaveMemoryQuestionOutput, error) {
	var output SaveMemoryQuestionOutput
	if err := c.callOperation(ctx, "save_memory_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SaveQuery(ctx context.Context, input SaveQueryInput, options ...RequestOption) (*SaveQueryOutput, error) {
	var output SaveQueryOutput
	if err := c.callOperation(ctx, "save_query", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SaveQuestion(ctx context.Context, input SaveQuestionInput, options ...RequestOption) (*SaveQuestionOutput, error) {
	var output SaveQuestionOutput
	if err := c.callOperation(ctx, "save_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) ScoreQuestionSet(ctx context.Context, input ScoreQuestionSetInput, options ...RequestOption) (*ScoreQuestionSetOutput, error) {
	var output ScoreQuestionSetOutput
	if err := c.callOperation(ctx, "score_question_set", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SearchFolders(ctx context.Context, input SearchFoldersInput, options ...RequestOption) (*SearchFoldersOutput, error) {
	var output SearchFoldersOutput
	if err := c.callOperation(ctx, "search_folders", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SearchKnowledgeBase(ctx context.Context, input SearchKnowledgeBaseInput, options ...RequestOption) (*SearchKnowledgeBaseOutput, error) {
	var output SearchKnowledgeBaseOutput
	if err := c.callOperation(ctx, "search_knowledge_base", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SendMemoryFeedback(ctx context.Context, input SendMemoryFeedbackInput, options ...RequestOption) (*SendMemoryFeedbackOutput, error) {
	var output SendMemoryFeedbackOutput
	if err := c.callOperation(ctx, "send_memory_feedback", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SetMemoryWebhook(ctx context.Context, input SetMemoryWebhookInput, options ...RequestOption) (*SetMemoryWebhookOutput, error) {
	var output SetMemoryWebhookOutput
	if err := c.callOperation(ctx, "set_memory_webhook", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SettleFlaggedQuestion(ctx context.Context, input SettleFlaggedQuestionInput, options ...RequestOption) (*SettleFlaggedQuestionOutput, error) {
	var output SettleFlaggedQuestionOutput
	if err := c.callOperation(ctx, "settle_flagged_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SettleMemory(ctx context.Context, input SettleMemoryInput, options ...RequestOption) (*SettleMemoryOutput, error) {
	var output SettleMemoryOutput
	if err := c.callOperation(ctx, "settle_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SettleMemoryReview(ctx context.Context, input SettleMemoryReviewInput, options ...RequestOption) (*SettleMemoryReviewOutput, error) {
	var output SettleMemoryReviewOutput
	if err := c.callOperation(ctx, "settle_memory_review", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SignIn(ctx context.Context, input SignInInput, options ...RequestOption) (*SignInOutput, error) {
	var output SignInOutput
	if err := c.callOperation(ctx, "sign_in", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SignOut(ctx context.Context, input SignOutInput, options ...RequestOption) (*SignOutOutput, error) {
	var output SignOutOutput
	if err := c.callOperation(ctx, "sign_out", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SignUp(ctx context.Context, input SignUpInput, options ...RequestOption) (*SignUpOutput, error) {
	var output SignUpOutput
	if err := c.callOperation(ctx, "sign_up", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SignUploadParts(ctx context.Context, input SignUploadPartsInput, options ...RequestOption) (*SignUploadPartsOutput, error) {
	var output SignUploadPartsOutput
	if err := c.callOperation(ctx, "sign_upload_parts", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SortMessage(ctx context.Context, input SortMessageInput, options ...RequestOption) (*SortMessageOutput, error) {
	var output SortMessageOutput
	if err := c.callOperation(ctx, "sort_message", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) StartMemorySourceSignIn(ctx context.Context, input StartMemorySourceSignInInput, options ...RequestOption) (*StartMemorySourceSignInOutput, error) {
	var output StartMemorySourceSignInOutput
	if err := c.callOperation(ctx, "start_memory_source_sign_in", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) StartSourceSignIn(ctx context.Context, input StartSourceSignInInput, options ...RequestOption) (*StartSourceSignInOutput, error) {
	var output StartSourceSignInOutput
	if err := c.callOperation(ctx, "start_source_sign_in", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SuggestIndexTerms(ctx context.Context, input SuggestIndexTermsInput, options ...RequestOption) (*SuggestIndexTermsOutput, error) {
	var output SuggestIndexTermsOutput
	if err := c.callOperation(ctx, "suggest_index_terms", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SyncMemorySource(ctx context.Context, input SyncMemorySourceInput, options ...RequestOption) (*SyncMemorySourceOutput, error) {
	var output SyncMemorySourceOutput
	if err := c.callOperation(ctx, "sync_memory_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) SyncSource(ctx context.Context, input SyncSourceInput, options ...RequestOption) (*SyncSourceOutput, error) {
	var output SyncSourceOutput
	if err := c.callOperation(ctx, "sync_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) TryCorrections(ctx context.Context, input TryCorrectionsInput, options ...RequestOption) (*TryCorrectionsOutput, error) {
	var output TryCorrectionsOutput
	if err := c.callOperation(ctx, "try_corrections", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) TuneMemory(ctx context.Context, input TuneMemoryInput, options ...RequestOption) (*TuneMemoryOutput, error) {
	var output TuneMemoryOutput
	if err := c.callOperation(ctx, "tune_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UndoLearnedChange(ctx context.Context, input UndoLearnedChangeInput, options ...RequestOption) (*UndoLearnedChangeOutput, error) {
	var output UndoLearnedChangeOutput
	if err := c.callOperation(ctx, "undo_learned_change", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateAPIKey(ctx context.Context, input UpdateAPIKeyInput, options ...RequestOption) (*UpdateAPIKeyOutput, error) {
	var output UpdateAPIKeyOutput
	if err := c.callOperation(ctx, "update_api_key", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateDatabase(ctx context.Context, input UpdateDatabaseInput, options ...RequestOption) (*UpdateDatabaseOutput, error) {
	var output UpdateDatabaseOutput
	if err := c.callOperation(ctx, "update_database", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateIndex(ctx context.Context, input UpdateIndexInput, options ...RequestOption) (*UpdateIndexOutput, error) {
	var output UpdateIndexOutput
	if err := c.callOperation(ctx, "update_index", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateKnowledgeBase(ctx context.Context, input UpdateKnowledgeBaseInput, options ...RequestOption) (*UpdateKnowledgeBaseOutput, error) {
	var output UpdateKnowledgeBaseOutput
	if err := c.callOperation(ctx, "update_knowledge_base", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateMemory(ctx context.Context, input UpdateMemoryInput, options ...RequestOption) (*UpdateMemoryOutput, error) {
	var output UpdateMemoryOutput
	if err := c.callOperation(ctx, "update_memory", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateMemorySource(ctx context.Context, input UpdateMemorySourceInput, options ...RequestOption) (*UpdateMemorySourceOutput, error) {
	var output UpdateMemorySourceOutput
	if err := c.callOperation(ctx, "update_memory_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateSavedQuestion(ctx context.Context, input UpdateSavedQuestionInput, options ...RequestOption) (*UpdateSavedQuestionOutput, error) {
	var output UpdateSavedQuestionOutput
	if err := c.callOperation(ctx, "update_saved_question", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateSource(ctx context.Context, input UpdateSourceInput, options ...RequestOption) (*UpdateSourceOutput, error) {
	var output UpdateSourceOutput
	if err := c.callOperation(ctx, "update_source", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UpdateTableRow(ctx context.Context, input UpdateTableRowInput, options ...RequestOption) (*UpdateTableRowOutput, error) {
	var output UpdateTableRowOutput
	if err := c.callOperation(ctx, "update_table_row", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) UploadTableImport(ctx context.Context, input UploadTableImportInput, options ...RequestOption) (*UploadTableImportOutput, error) {
	var output UploadTableImportOutput
	if err := c.callOperation(ctx, "upload_table_import", input, input.Content, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}

func (c *Client) VerifySecondFactor(ctx context.Context, input VerifySecondFactorInput, options ...RequestOption) (*VerifySecondFactorOutput, error) {
	var output VerifySecondFactorOutput
	if err := c.callOperation(ctx, "verify_second_factor", input, nil, &output, options); err != nil {
		return nil, err
	}
	return &output, nil
}
