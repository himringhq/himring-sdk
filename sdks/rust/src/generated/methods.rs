use crate::client::Himring;
use crate::download::Download;
use crate::file_content::FileContent;
use crate::operation_call::OperationCall;
use crate::types::{
    AcceptInvitationInput, AcceptInvitationOutput, AddDatabaseMigrationInput,
    AddDatabaseMigrationOutput, AddMessagesInput, AddMessagesOutput, AnswerQuestionInput,
    AnswerQuestionOutput, ApplyTableImportInput, ApplyTableImportOutput,
    BeginSecondFactorSetupInput, BeginSecondFactorSetupOutput, CancelUploadInput,
    CancelUploadOutput, ChangeTableColumnsInput, ChangeTableColumnsOutput, CheckTableImportInput,
    CheckTableImportOutput, CompactDatabaseInput, CompactDatabaseOutput, CompareIndexSearchInput,
    CompareIndexSearchOutput, CompleteUploadInput, CompleteUploadOutput,
    ConfirmSecondFactorSetupInput, ConfirmSecondFactorSetupOutput, CreateApiKeyInput,
    CreateApiKeyOutput, CreateCorrectionInput, CreateCorrectionOutput, CreateDatabaseInput,
    CreateDatabaseOutput, CreateIndexInput, CreateIndexOutput, CreateKnowledgeBaseInput,
    CreateKnowledgeBaseOutput, CreateMemorySourceInput, CreateMemorySourceOutput,
    CreateProjectInput, CreateProjectOutput, CreateSourceInput, CreateSourceOutput,
    CreateTableInput, CreateTableOutput, CreateUploadInput, CreateUploadOutput,
    DeleteDatabaseInput, DeleteDatabaseOutput, DeleteFileInput, DeleteFileOutput, DeleteIndexInput,
    DeleteIndexOutput, DeleteIndexRecordInput, DeleteIndexRecordOutput, DeleteKnowledgeBaseInput,
    DeleteKnowledgeBaseOutput, DeleteMemoryInput, DeleteMemoryOutput,
    DeleteMemorySavedQuestionInput, DeleteMemorySavedQuestionOutput, DeleteMemorySourceInput,
    DeleteMemorySourceOutput, DeleteProjectInput, DeleteProjectOutput, DeleteSavedQueryInput,
    DeleteSavedQueryOutput, DeleteSavedQuestionInput, DeleteSavedQuestionOutput, DeleteSourceInput,
    DeleteSourceOutput, DeleteTableRowsInput, DeleteTableRowsOutput, DiscardCorrectionInput,
    DiscardCorrectionOutput, DiscardTableImportInput, DiscardTableImportOutput,
    DismissFlaggedQuestionInput, DismissFlaggedQuestionOutput, DownloadIndexInput,
    EnableMemoryInput, EnableMemoryOutput, EraseEndUserInput, EraseEndUserOutput,
    ExportIndexRecordsInput, ExportMemoriesInput, ExportTableRowsInput, FinishSourceSignInInput,
    FinishSourceSignInOutput, ForgetMemoryInput, ForgetMemoryOutput, GetCorrectionInput,
    GetCorrectionOutput, GetCorrectionPassInput, GetCorrectionPassOutput, GetDatabaseInput,
    GetDatabaseOutput, GetDownloadLinkInput, GetDownloadLinkOutput, GetFileInput, GetFileOutput,
    GetFlaggedQuestionInput, GetFlaggedQuestionOutput, GetIndexInput, GetIndexOutput,
    GetIndexRecordInput, GetIndexRecordOutput, GetIndexStatsInput, GetIndexStatsOutput,
    GetKnowledgeBaseInput, GetKnowledgeBaseOutput, GetMemoryContextInput, GetMemoryContextOutput,
    GetMemoryInput, GetMemoryOutput, GetMemoryScoresInput, GetMemoryScoresOutput,
    GetMemorySourceInput, GetMemorySourceOutput, GetMemoryWebhookInput, GetMemoryWebhookOutput,
    GetMessageInput, GetMessageOutput, GetProjectInput, GetProjectOutput, GetQuestionSetInput,
    GetQuestionSetOutput, GetSavedQuestionInput, GetSavedQuestionOutput, GetScorecardInput,
    GetScorecardOutput, GetSessionInput, GetSessionOutput, GetSourceInput, GetSourceOutput,
    GetTableRowInput, GetTableRowOutput, GetUploadInput, GetUploadOutput, ImportAnswerLogInput,
    ImportAnswerLogOutput, ImportIndexRecordsInput, ImportIndexRecordsOutput,
    ImportSavedQuestionsInput, ImportSavedQuestionsOutput, IngestItemsInput, IngestItemsOutput,
    InsertTableRowInput, InsertTableRowOutput, InspectMemoryInput, InspectMemoryOutput,
    InviteMemberInput, InviteMemberOutput, ListApiKeyPermissionChangesInput,
    ListApiKeyPermissionChangesOutput, ListApiKeysInput, ListApiKeysOutput,
    ListCorrectionPassesInput, ListCorrectionPassesOutput, ListCorrectionsInput,
    ListCorrectionsOutput, ListDatabaseMigrationsInput, ListDatabaseMigrationsOutput,
    ListDatabaseTablesInput, ListDatabaseTablesOutput, ListDatabasesInput, ListDatabasesOutput,
    ListFileVersionsInput, ListFileVersionsOutput, ListFilesInput, ListFilesOutput,
    ListFlaggedQuestionsInput, ListFlaggedQuestionsOutput, ListFolderInput, ListFolderOutput,
    ListForgettingSuggestionsInput, ListForgettingSuggestionsOutput, ListIndexRecordsInput,
    ListIndexRecordsOutput, ListIndexesInput, ListIndexesOutput, ListInvitationsInput,
    ListInvitationsOutput, ListKnowledgeBasesInput, ListKnowledgeBasesOutput,
    ListLearnedChangesInput, ListLearnedChangesOutput, ListMembersInput, ListMembersOutput,
    ListMemoriesInput, ListMemoriesOutput, ListMemoryDecisionsInput, ListMemoryDecisionsOutput,
    ListMemoryOwnersInput, ListMemoryOwnersOutput, ListMemoryReviewsInput, ListMemoryReviewsOutput,
    ListMemorySavedQuestionsInput, ListMemorySavedQuestionsOutput, ListMemorySourcesInput,
    ListMemorySourcesOutput, ListMemoryWebhookDeliveriesInput, ListMemoryWebhookDeliveriesOutput,
    ListMessagesInput, ListMessagesOutput, ListMetadataKeysInput, ListMetadataKeysOutput,
    ListMetadataValuesInput, ListMetadataValuesOutput, ListOperationsInput, ListOperationsOutput,
    ListProjectsInput, ListProjectsOutput, ListQuestionsInput, ListQuestionsOutput,
    ListSavedQueriesInput, ListSavedQueriesOutput, ListSavedQuestionsInput,
    ListSavedQuestionsOutput, ListScorecardResultsInput, ListScorecardResultsOutput,
    ListScorecardsInput, ListScorecardsOutput, ListSourceItemsInput, ListSourceItemsOutput,
    ListSourceSyncsInput, ListSourceSyncsOutput, ListSourcesInput, ListSourcesOutput,
    ListTableRowsInput, ListTableRowsOutput, ListVersionBlocksInput, ListVersionBlocksOutput,
    PreviewCreateTableInput, PreviewCreateTableOutput, PreviewIndexSearchInput,
    PreviewIndexSearchOutput, PreviewTableColumnChangesInput, PreviewTableColumnChangesOutput,
    PromoteCorrectionInput, PromoteCorrectionOutput, PromoteMemoryInput, PromoteMemoryOutput,
    ProposeCorrectionsInput, ProposeCorrectionsOutput, ProposeDatabaseChangeInput,
    ProposeDatabaseChangeOutput, RecallMemoriesInput, RecallMemoriesOutput,
    RecordAnswerEventsInput, RecordAnswerEventsOutput, RecoverMemoryInput, RecoverMemoryOutput,
    RemoveMemberInput, RemoveMemberOutput, RemoveMemoryWebhookInput, RemoveMemoryWebhookOutput,
    RestoreDatabaseInput, RestoreDatabaseOutput, RestoreFileInput, RestoreFileOutput,
    RestoreIndexInput, RestoreIndexOutput, RestoreIndexSnapshotInput, RestoreIndexSnapshotOutput,
    RestoreKnowledgeBaseInput, RestoreKnowledgeBaseOutput, RestoreMemoryInput, RestoreMemoryOutput,
    RestoreProjectInput, RestoreProjectOutput, ReviewFlaggedQuestionsInput,
    ReviewFlaggedQuestionsOutput, RevokeApiKeyInput, RevokeApiKeyOutput, RevokeInvitationInput,
    RevokeInvitationOutput, RunDatabaseSqlInput, RunDatabaseSqlOutput, SaveIndexRecordInput,
    SaveIndexRecordOutput, SaveMemoryQuestionInput, SaveMemoryQuestionOutput, SaveQueryInput,
    SaveQueryOutput, SaveQuestionInput, SaveQuestionOutput, ScoreQuestionSetInput,
    ScoreQuestionSetOutput, SearchFoldersInput, SearchFoldersOutput, SearchKnowledgeBaseInput,
    SearchKnowledgeBaseOutput, SendMemoryFeedbackInput, SendMemoryFeedbackOutput,
    SetMemoryWebhookInput, SetMemoryWebhookOutput, SettleFlaggedQuestionInput,
    SettleFlaggedQuestionOutput, SettleMemoryInput, SettleMemoryOutput, SettleMemoryReviewInput,
    SettleMemoryReviewOutput, SignInInput, SignInOutput, SignOutInput, SignOutOutput, SignUpInput,
    SignUpOutput, SignUploadPartsInput, SignUploadPartsOutput, SortMessageInput, SortMessageOutput,
    StartMemorySourceSignInInput, StartMemorySourceSignInOutput, StartSourceSignInInput,
    StartSourceSignInOutput, SuggestIndexTermsInput, SuggestIndexTermsOutput,
    SyncMemorySourceInput, SyncMemorySourceOutput, SyncSourceInput, SyncSourceOutput,
    TryCorrectionsInput, TryCorrectionsOutput, TuneMemoryInput, TuneMemoryOutput,
    UndoLearnedChangeInput, UndoLearnedChangeOutput, UpdateApiKeyInput, UpdateApiKeyOutput,
    UpdateDatabaseInput, UpdateDatabaseOutput, UpdateIndexInput, UpdateIndexOutput,
    UpdateKnowledgeBaseInput, UpdateKnowledgeBaseOutput, UpdateMemoryInput, UpdateMemoryOutput,
    UpdateMemorySourceInput, UpdateMemorySourceOutput, UpdateSavedQuestionInput,
    UpdateSavedQuestionOutput, UpdateSourceInput, UpdateSourceOutput, UpdateTableRowInput,
    UpdateTableRowOutput, UploadTableImportInput, UploadTableImportOutput, VerifySecondFactorInput,
    VerifySecondFactorOutput,
};

impl Himring {
    pub fn accept_invitation(
        &self,
        input: AcceptInvitationInput,
    ) -> OperationCall<'_, AcceptInvitationOutput> {
        OperationCall::new(self, "accept_invitation", &input)
    }

    pub fn add_database_migration(
        &self,
        input: AddDatabaseMigrationInput,
    ) -> OperationCall<'_, AddDatabaseMigrationOutput> {
        OperationCall::new(self, "add_database_migration", &input)
    }

    pub fn add_messages(&self, input: AddMessagesInput) -> OperationCall<'_, AddMessagesOutput> {
        OperationCall::new(self, "add_messages", &input)
    }

    pub fn answer_question(
        &self,
        input: AnswerQuestionInput,
    ) -> OperationCall<'_, AnswerQuestionOutput> {
        OperationCall::new(self, "answer_question", &input)
    }

    pub fn apply_table_import(
        &self,
        input: ApplyTableImportInput,
    ) -> OperationCall<'_, ApplyTableImportOutput> {
        OperationCall::new(self, "apply_table_import", &input)
    }

    pub fn begin_second_factor_setup(
        &self,
        input: BeginSecondFactorSetupInput,
    ) -> OperationCall<'_, BeginSecondFactorSetupOutput> {
        OperationCall::new(self, "begin_second_factor_setup", &input)
    }

    pub fn cancel_upload(&self, input: CancelUploadInput) -> OperationCall<'_, CancelUploadOutput> {
        OperationCall::new(self, "cancel_upload", &input)
    }

    pub fn change_table_columns(
        &self,
        input: ChangeTableColumnsInput,
    ) -> OperationCall<'_, ChangeTableColumnsOutput> {
        OperationCall::new(self, "change_table_columns", &input)
    }

    pub fn check_table_import(
        &self,
        input: CheckTableImportInput,
    ) -> OperationCall<'_, CheckTableImportOutput> {
        OperationCall::new(self, "check_table_import", &input)
    }

    pub fn compact_database(
        &self,
        input: CompactDatabaseInput,
    ) -> OperationCall<'_, CompactDatabaseOutput> {
        OperationCall::new(self, "compact_database", &input)
    }

    pub fn compare_index_search(
        &self,
        input: CompareIndexSearchInput,
    ) -> OperationCall<'_, CompareIndexSearchOutput> {
        OperationCall::new(self, "compare_index_search", &input)
    }

    pub fn complete_upload(
        &self,
        input: CompleteUploadInput,
    ) -> OperationCall<'_, CompleteUploadOutput> {
        OperationCall::new(self, "complete_upload", &input)
    }

    pub fn confirm_second_factor_setup(
        &self,
        input: ConfirmSecondFactorSetupInput,
    ) -> OperationCall<'_, ConfirmSecondFactorSetupOutput> {
        OperationCall::new(self, "confirm_second_factor_setup", &input)
    }

    pub fn create_api_key(
        &self,
        input: CreateApiKeyInput,
    ) -> OperationCall<'_, CreateApiKeyOutput> {
        OperationCall::new(self, "create_api_key", &input)
    }

    pub fn create_correction(
        &self,
        input: CreateCorrectionInput,
    ) -> OperationCall<'_, CreateCorrectionOutput> {
        OperationCall::new(self, "create_correction", &input)
    }

    pub fn create_database(
        &self,
        input: CreateDatabaseInput,
    ) -> OperationCall<'_, CreateDatabaseOutput> {
        OperationCall::new(self, "create_database", &input)
    }

    pub fn create_index(&self, input: CreateIndexInput) -> OperationCall<'_, CreateIndexOutput> {
        OperationCall::new(self, "create_index", &input)
    }

    pub fn create_knowledge_base(
        &self,
        input: CreateKnowledgeBaseInput,
    ) -> OperationCall<'_, CreateKnowledgeBaseOutput> {
        OperationCall::new(self, "create_knowledge_base", &input)
    }

    pub fn create_memory_source(
        &self,
        input: CreateMemorySourceInput,
    ) -> OperationCall<'_, CreateMemorySourceOutput> {
        OperationCall::new(self, "create_memory_source", &input)
    }

    pub fn create_project(
        &self,
        input: CreateProjectInput,
    ) -> OperationCall<'_, CreateProjectOutput> {
        OperationCall::new(self, "create_project", &input)
    }

    pub fn create_source(&self, input: CreateSourceInput) -> OperationCall<'_, CreateSourceOutput> {
        OperationCall::new(self, "create_source", &input)
    }

    pub fn create_table(&self, input: CreateTableInput) -> OperationCall<'_, CreateTableOutput> {
        OperationCall::new(self, "create_table", &input)
    }

    pub fn create_upload(&self, input: CreateUploadInput) -> OperationCall<'_, CreateUploadOutput> {
        OperationCall::new(self, "create_upload", &input)
    }

    pub fn delete_database(
        &self,
        input: DeleteDatabaseInput,
    ) -> OperationCall<'_, DeleteDatabaseOutput> {
        OperationCall::new(self, "delete_database", &input)
    }

    pub fn delete_file(&self, input: DeleteFileInput) -> OperationCall<'_, DeleteFileOutput> {
        OperationCall::new(self, "delete_file", &input)
    }

    pub fn delete_index(&self, input: DeleteIndexInput) -> OperationCall<'_, DeleteIndexOutput> {
        OperationCall::new(self, "delete_index", &input)
    }

    pub fn delete_index_record(
        &self,
        input: DeleteIndexRecordInput,
    ) -> OperationCall<'_, DeleteIndexRecordOutput> {
        OperationCall::new(self, "delete_index_record", &input)
    }

    pub fn delete_knowledge_base(
        &self,
        input: DeleteKnowledgeBaseInput,
    ) -> OperationCall<'_, DeleteKnowledgeBaseOutput> {
        OperationCall::new(self, "delete_knowledge_base", &input)
    }

    pub fn delete_memory(&self, input: DeleteMemoryInput) -> OperationCall<'_, DeleteMemoryOutput> {
        OperationCall::new(self, "delete_memory", &input)
    }

    pub fn delete_memory_saved_question(
        &self,
        input: DeleteMemorySavedQuestionInput,
    ) -> OperationCall<'_, DeleteMemorySavedQuestionOutput> {
        OperationCall::new(self, "delete_memory_saved_question", &input)
    }

    pub fn delete_memory_source(
        &self,
        input: DeleteMemorySourceInput,
    ) -> OperationCall<'_, DeleteMemorySourceOutput> {
        OperationCall::new(self, "delete_memory_source", &input)
    }

    pub fn delete_project(
        &self,
        input: DeleteProjectInput,
    ) -> OperationCall<'_, DeleteProjectOutput> {
        OperationCall::new(self, "delete_project", &input)
    }

    pub fn delete_saved_query(
        &self,
        input: DeleteSavedQueryInput,
    ) -> OperationCall<'_, DeleteSavedQueryOutput> {
        OperationCall::new(self, "delete_saved_query", &input)
    }

    pub fn delete_saved_question(
        &self,
        input: DeleteSavedQuestionInput,
    ) -> OperationCall<'_, DeleteSavedQuestionOutput> {
        OperationCall::new(self, "delete_saved_question", &input)
    }

    pub fn delete_source(&self, input: DeleteSourceInput) -> OperationCall<'_, DeleteSourceOutput> {
        OperationCall::new(self, "delete_source", &input)
    }

    pub fn delete_table_rows(
        &self,
        input: DeleteTableRowsInput,
    ) -> OperationCall<'_, DeleteTableRowsOutput> {
        OperationCall::new(self, "delete_table_rows", &input)
    }

    pub fn discard_correction(
        &self,
        input: DiscardCorrectionInput,
    ) -> OperationCall<'_, DiscardCorrectionOutput> {
        OperationCall::new(self, "discard_correction", &input)
    }

    pub fn discard_table_import(
        &self,
        input: DiscardTableImportInput,
    ) -> OperationCall<'_, DiscardTableImportOutput> {
        OperationCall::new(self, "discard_table_import", &input)
    }

    pub fn dismiss_flagged_question(
        &self,
        input: DismissFlaggedQuestionInput,
    ) -> OperationCall<'_, DismissFlaggedQuestionOutput> {
        OperationCall::new(self, "dismiss_flagged_question", &input)
    }

    pub fn download_index(&self, input: DownloadIndexInput) -> OperationCall<'_, Download> {
        OperationCall::download(self, "download_index", &input)
    }

    pub fn enable_memory(&self, input: EnableMemoryInput) -> OperationCall<'_, EnableMemoryOutput> {
        OperationCall::new(self, "enable_memory", &input)
    }

    pub fn erase_end_user(
        &self,
        input: EraseEndUserInput,
    ) -> OperationCall<'_, EraseEndUserOutput> {
        OperationCall::new(self, "erase_end_user", &input)
    }

    pub fn export_index_records(
        &self,
        input: ExportIndexRecordsInput,
    ) -> OperationCall<'_, Download> {
        OperationCall::download(self, "export_index_records", &input)
    }

    pub fn export_memories(&self, input: ExportMemoriesInput) -> OperationCall<'_, Download> {
        OperationCall::download(self, "export_memories", &input)
    }

    pub fn export_table_rows(&self, input: ExportTableRowsInput) -> OperationCall<'_, Download> {
        OperationCall::download(self, "export_table_rows", &input)
    }

    pub fn finish_source_sign_in(
        &self,
        input: FinishSourceSignInInput,
    ) -> OperationCall<'_, FinishSourceSignInOutput> {
        OperationCall::new(self, "finish_source_sign_in", &input)
    }

    pub fn forget_memory(&self, input: ForgetMemoryInput) -> OperationCall<'_, ForgetMemoryOutput> {
        OperationCall::new(self, "forget_memory", &input)
    }

    pub fn get_correction(
        &self,
        input: GetCorrectionInput,
    ) -> OperationCall<'_, GetCorrectionOutput> {
        OperationCall::new(self, "get_correction", &input)
    }

    pub fn get_correction_pass(
        &self,
        input: GetCorrectionPassInput,
    ) -> OperationCall<'_, GetCorrectionPassOutput> {
        OperationCall::new(self, "get_correction_pass", &input)
    }

    pub fn get_database(&self, input: GetDatabaseInput) -> OperationCall<'_, GetDatabaseOutput> {
        OperationCall::new(self, "get_database", &input)
    }

    pub fn get_download_link(
        &self,
        input: GetDownloadLinkInput,
    ) -> OperationCall<'_, GetDownloadLinkOutput> {
        OperationCall::new(self, "get_download_link", &input)
    }

    pub fn get_file(&self, input: GetFileInput) -> OperationCall<'_, GetFileOutput> {
        OperationCall::new(self, "get_file", &input)
    }

    pub fn get_flagged_question(
        &self,
        input: GetFlaggedQuestionInput,
    ) -> OperationCall<'_, GetFlaggedQuestionOutput> {
        OperationCall::new(self, "get_flagged_question", &input)
    }

    pub fn get_index(&self, input: GetIndexInput) -> OperationCall<'_, GetIndexOutput> {
        OperationCall::new(self, "get_index", &input)
    }

    pub fn get_index_record(
        &self,
        input: GetIndexRecordInput,
    ) -> OperationCall<'_, GetIndexRecordOutput> {
        OperationCall::new(self, "get_index_record", &input)
    }

    pub fn get_index_stats(
        &self,
        input: GetIndexStatsInput,
    ) -> OperationCall<'_, GetIndexStatsOutput> {
        OperationCall::new(self, "get_index_stats", &input)
    }

    pub fn get_knowledge_base(
        &self,
        input: GetKnowledgeBaseInput,
    ) -> OperationCall<'_, GetKnowledgeBaseOutput> {
        OperationCall::new(self, "get_knowledge_base", &input)
    }

    pub fn get_memory(&self, input: GetMemoryInput) -> OperationCall<'_, GetMemoryOutput> {
        OperationCall::new(self, "get_memory", &input)
    }

    pub fn get_memory_context(
        &self,
        input: GetMemoryContextInput,
    ) -> OperationCall<'_, GetMemoryContextOutput> {
        OperationCall::new(self, "get_memory_context", &input)
    }

    pub fn get_memory_scores(
        &self,
        input: GetMemoryScoresInput,
    ) -> OperationCall<'_, GetMemoryScoresOutput> {
        OperationCall::new(self, "get_memory_scores", &input)
    }

    pub fn get_memory_source(
        &self,
        input: GetMemorySourceInput,
    ) -> OperationCall<'_, GetMemorySourceOutput> {
        OperationCall::new(self, "get_memory_source", &input)
    }

    pub fn get_memory_webhook(
        &self,
        input: GetMemoryWebhookInput,
    ) -> OperationCall<'_, GetMemoryWebhookOutput> {
        OperationCall::new(self, "get_memory_webhook", &input)
    }

    pub fn get_message(&self, input: GetMessageInput) -> OperationCall<'_, GetMessageOutput> {
        OperationCall::new(self, "get_message", &input)
    }

    pub fn get_project(&self, input: GetProjectInput) -> OperationCall<'_, GetProjectOutput> {
        OperationCall::new(self, "get_project", &input)
    }

    pub fn get_question_set(
        &self,
        input: GetQuestionSetInput,
    ) -> OperationCall<'_, GetQuestionSetOutput> {
        OperationCall::new(self, "get_question_set", &input)
    }

    pub fn get_saved_question(
        &self,
        input: GetSavedQuestionInput,
    ) -> OperationCall<'_, GetSavedQuestionOutput> {
        OperationCall::new(self, "get_saved_question", &input)
    }

    pub fn get_scorecard(&self, input: GetScorecardInput) -> OperationCall<'_, GetScorecardOutput> {
        OperationCall::new(self, "get_scorecard", &input)
    }

    pub fn get_session(&self, input: GetSessionInput) -> OperationCall<'_, GetSessionOutput> {
        OperationCall::new(self, "get_session", &input)
    }

    pub fn get_source(&self, input: GetSourceInput) -> OperationCall<'_, GetSourceOutput> {
        OperationCall::new(self, "get_source", &input)
    }

    pub fn get_table_row(&self, input: GetTableRowInput) -> OperationCall<'_, GetTableRowOutput> {
        OperationCall::new(self, "get_table_row", &input)
    }

    pub fn get_upload(&self, input: GetUploadInput) -> OperationCall<'_, GetUploadOutput> {
        OperationCall::new(self, "get_upload", &input)
    }

    pub fn import_answer_log(
        &self,
        input: ImportAnswerLogInput,
        content: FileContent,
    ) -> OperationCall<'_, ImportAnswerLogOutput> {
        OperationCall::with_file(self, "import_answer_log", &input, content)
    }

    pub fn import_index_records(
        &self,
        input: ImportIndexRecordsInput,
        content: FileContent,
    ) -> OperationCall<'_, ImportIndexRecordsOutput> {
        OperationCall::with_file(self, "import_index_records", &input, content)
    }

    pub fn import_saved_questions(
        &self,
        input: ImportSavedQuestionsInput,
        content: FileContent,
    ) -> OperationCall<'_, ImportSavedQuestionsOutput> {
        OperationCall::with_file(self, "import_saved_questions", &input, content)
    }

    pub fn ingest_items(&self, input: IngestItemsInput) -> OperationCall<'_, IngestItemsOutput> {
        OperationCall::new(self, "ingest_items", &input)
    }

    pub fn insert_table_row(
        &self,
        input: InsertTableRowInput,
    ) -> OperationCall<'_, InsertTableRowOutput> {
        OperationCall::new(self, "insert_table_row", &input)
    }

    pub fn inspect_memory(
        &self,
        input: InspectMemoryInput,
    ) -> OperationCall<'_, InspectMemoryOutput> {
        OperationCall::new(self, "inspect_memory", &input)
    }

    pub fn invite_member(&self, input: InviteMemberInput) -> OperationCall<'_, InviteMemberOutput> {
        OperationCall::new(self, "invite_member", &input)
    }

    pub fn list_api_key_permission_changes(
        &self,
        input: ListApiKeyPermissionChangesInput,
    ) -> OperationCall<'_, ListApiKeyPermissionChangesOutput> {
        OperationCall::new(self, "list_api_key_permission_changes", &input)
    }

    pub fn list_api_keys(&self, input: ListApiKeysInput) -> OperationCall<'_, ListApiKeysOutput> {
        OperationCall::new(self, "list_api_keys", &input)
    }

    pub fn list_correction_passes(
        &self,
        input: ListCorrectionPassesInput,
    ) -> OperationCall<'_, ListCorrectionPassesOutput> {
        OperationCall::new(self, "list_correction_passes", &input)
    }

    pub fn list_corrections(
        &self,
        input: ListCorrectionsInput,
    ) -> OperationCall<'_, ListCorrectionsOutput> {
        OperationCall::new(self, "list_corrections", &input)
    }

    pub fn list_database_migrations(
        &self,
        input: ListDatabaseMigrationsInput,
    ) -> OperationCall<'_, ListDatabaseMigrationsOutput> {
        OperationCall::new(self, "list_database_migrations", &input)
    }

    pub fn list_database_tables(
        &self,
        input: ListDatabaseTablesInput,
    ) -> OperationCall<'_, ListDatabaseTablesOutput> {
        OperationCall::new(self, "list_database_tables", &input)
    }

    pub fn list_databases(
        &self,
        input: ListDatabasesInput,
    ) -> OperationCall<'_, ListDatabasesOutput> {
        OperationCall::new(self, "list_databases", &input)
    }

    pub fn list_file_versions(
        &self,
        input: ListFileVersionsInput,
    ) -> OperationCall<'_, ListFileVersionsOutput> {
        OperationCall::new(self, "list_file_versions", &input)
    }

    pub fn list_files(&self, input: ListFilesInput) -> OperationCall<'_, ListFilesOutput> {
        OperationCall::new(self, "list_files", &input)
    }

    pub fn list_flagged_questions(
        &self,
        input: ListFlaggedQuestionsInput,
    ) -> OperationCall<'_, ListFlaggedQuestionsOutput> {
        OperationCall::new(self, "list_flagged_questions", &input)
    }

    pub fn list_folder(&self, input: ListFolderInput) -> OperationCall<'_, ListFolderOutput> {
        OperationCall::new(self, "list_folder", &input)
    }

    pub fn list_forgetting_suggestions(
        &self,
        input: ListForgettingSuggestionsInput,
    ) -> OperationCall<'_, ListForgettingSuggestionsOutput> {
        OperationCall::new(self, "list_forgetting_suggestions", &input)
    }

    pub fn list_index_records(
        &self,
        input: ListIndexRecordsInput,
    ) -> OperationCall<'_, ListIndexRecordsOutput> {
        OperationCall::new(self, "list_index_records", &input)
    }

    pub fn list_indexes(&self, input: ListIndexesInput) -> OperationCall<'_, ListIndexesOutput> {
        OperationCall::new(self, "list_indexes", &input)
    }

    pub fn list_invitations(
        &self,
        input: ListInvitationsInput,
    ) -> OperationCall<'_, ListInvitationsOutput> {
        OperationCall::new(self, "list_invitations", &input)
    }

    pub fn list_knowledge_bases(
        &self,
        input: ListKnowledgeBasesInput,
    ) -> OperationCall<'_, ListKnowledgeBasesOutput> {
        OperationCall::new(self, "list_knowledge_bases", &input)
    }

    pub fn list_learned_changes(
        &self,
        input: ListLearnedChangesInput,
    ) -> OperationCall<'_, ListLearnedChangesOutput> {
        OperationCall::new(self, "list_learned_changes", &input)
    }

    pub fn list_members(&self, input: ListMembersInput) -> OperationCall<'_, ListMembersOutput> {
        OperationCall::new(self, "list_members", &input)
    }

    pub fn list_memories(&self, input: ListMemoriesInput) -> OperationCall<'_, ListMemoriesOutput> {
        OperationCall::new(self, "list_memories", &input)
    }

    pub fn list_memory_decisions(
        &self,
        input: ListMemoryDecisionsInput,
    ) -> OperationCall<'_, ListMemoryDecisionsOutput> {
        OperationCall::new(self, "list_memory_decisions", &input)
    }

    pub fn list_memory_owners(
        &self,
        input: ListMemoryOwnersInput,
    ) -> OperationCall<'_, ListMemoryOwnersOutput> {
        OperationCall::new(self, "list_memory_owners", &input)
    }

    pub fn list_memory_reviews(
        &self,
        input: ListMemoryReviewsInput,
    ) -> OperationCall<'_, ListMemoryReviewsOutput> {
        OperationCall::new(self, "list_memory_reviews", &input)
    }

    pub fn list_memory_saved_questions(
        &self,
        input: ListMemorySavedQuestionsInput,
    ) -> OperationCall<'_, ListMemorySavedQuestionsOutput> {
        OperationCall::new(self, "list_memory_saved_questions", &input)
    }

    pub fn list_memory_sources(
        &self,
        input: ListMemorySourcesInput,
    ) -> OperationCall<'_, ListMemorySourcesOutput> {
        OperationCall::new(self, "list_memory_sources", &input)
    }

    pub fn list_memory_webhook_deliveries(
        &self,
        input: ListMemoryWebhookDeliveriesInput,
    ) -> OperationCall<'_, ListMemoryWebhookDeliveriesOutput> {
        OperationCall::new(self, "list_memory_webhook_deliveries", &input)
    }

    pub fn list_messages(&self, input: ListMessagesInput) -> OperationCall<'_, ListMessagesOutput> {
        OperationCall::new(self, "list_messages", &input)
    }

    pub fn list_metadata_keys(
        &self,
        input: ListMetadataKeysInput,
    ) -> OperationCall<'_, ListMetadataKeysOutput> {
        OperationCall::new(self, "list_metadata_keys", &input)
    }

    pub fn list_metadata_values(
        &self,
        input: ListMetadataValuesInput,
    ) -> OperationCall<'_, ListMetadataValuesOutput> {
        OperationCall::new(self, "list_metadata_values", &input)
    }

    pub fn list_operations(
        &self,
        input: ListOperationsInput,
    ) -> OperationCall<'_, ListOperationsOutput> {
        OperationCall::new(self, "list_operations", &input)
    }

    pub fn list_projects(&self, input: ListProjectsInput) -> OperationCall<'_, ListProjectsOutput> {
        OperationCall::new(self, "list_projects", &input)
    }

    pub fn list_questions(
        &self,
        input: ListQuestionsInput,
    ) -> OperationCall<'_, ListQuestionsOutput> {
        OperationCall::new(self, "list_questions", &input)
    }

    pub fn list_saved_queries(
        &self,
        input: ListSavedQueriesInput,
    ) -> OperationCall<'_, ListSavedQueriesOutput> {
        OperationCall::new(self, "list_saved_queries", &input)
    }

    pub fn list_saved_questions(
        &self,
        input: ListSavedQuestionsInput,
    ) -> OperationCall<'_, ListSavedQuestionsOutput> {
        OperationCall::new(self, "list_saved_questions", &input)
    }

    pub fn list_scorecard_results(
        &self,
        input: ListScorecardResultsInput,
    ) -> OperationCall<'_, ListScorecardResultsOutput> {
        OperationCall::new(self, "list_scorecard_results", &input)
    }

    pub fn list_scorecards(
        &self,
        input: ListScorecardsInput,
    ) -> OperationCall<'_, ListScorecardsOutput> {
        OperationCall::new(self, "list_scorecards", &input)
    }

    pub fn list_source_items(
        &self,
        input: ListSourceItemsInput,
    ) -> OperationCall<'_, ListSourceItemsOutput> {
        OperationCall::new(self, "list_source_items", &input)
    }

    pub fn list_source_syncs(
        &self,
        input: ListSourceSyncsInput,
    ) -> OperationCall<'_, ListSourceSyncsOutput> {
        OperationCall::new(self, "list_source_syncs", &input)
    }

    pub fn list_sources(&self, input: ListSourcesInput) -> OperationCall<'_, ListSourcesOutput> {
        OperationCall::new(self, "list_sources", &input)
    }

    pub fn list_table_rows(
        &self,
        input: ListTableRowsInput,
    ) -> OperationCall<'_, ListTableRowsOutput> {
        OperationCall::new(self, "list_table_rows", &input)
    }

    pub fn list_version_blocks(
        &self,
        input: ListVersionBlocksInput,
    ) -> OperationCall<'_, ListVersionBlocksOutput> {
        OperationCall::new(self, "list_version_blocks", &input)
    }

    pub fn preview_create_table(
        &self,
        input: PreviewCreateTableInput,
    ) -> OperationCall<'_, PreviewCreateTableOutput> {
        OperationCall::new(self, "preview_create_table", &input)
    }

    pub fn preview_index_search(
        &self,
        input: PreviewIndexSearchInput,
    ) -> OperationCall<'_, PreviewIndexSearchOutput> {
        OperationCall::new(self, "preview_index_search", &input)
    }

    pub fn preview_table_column_changes(
        &self,
        input: PreviewTableColumnChangesInput,
    ) -> OperationCall<'_, PreviewTableColumnChangesOutput> {
        OperationCall::new(self, "preview_table_column_changes", &input)
    }

    pub fn promote_correction(
        &self,
        input: PromoteCorrectionInput,
    ) -> OperationCall<'_, PromoteCorrectionOutput> {
        OperationCall::new(self, "promote_correction", &input)
    }

    pub fn promote_memory(
        &self,
        input: PromoteMemoryInput,
    ) -> OperationCall<'_, PromoteMemoryOutput> {
        OperationCall::new(self, "promote_memory", &input)
    }

    pub fn propose_corrections(
        &self,
        input: ProposeCorrectionsInput,
    ) -> OperationCall<'_, ProposeCorrectionsOutput> {
        OperationCall::new(self, "propose_corrections", &input)
    }

    pub fn propose_database_change(
        &self,
        input: ProposeDatabaseChangeInput,
    ) -> OperationCall<'_, ProposeDatabaseChangeOutput> {
        OperationCall::new(self, "propose_database_change", &input)
    }

    pub fn recall_memories(
        &self,
        input: RecallMemoriesInput,
    ) -> OperationCall<'_, RecallMemoriesOutput> {
        OperationCall::new(self, "recall_memories", &input)
    }

    pub fn record_answer_events(
        &self,
        input: RecordAnswerEventsInput,
    ) -> OperationCall<'_, RecordAnswerEventsOutput> {
        OperationCall::new(self, "record_answer_events", &input)
    }

    pub fn recover_memory(
        &self,
        input: RecoverMemoryInput,
    ) -> OperationCall<'_, RecoverMemoryOutput> {
        OperationCall::new(self, "recover_memory", &input)
    }

    pub fn remove_member(&self, input: RemoveMemberInput) -> OperationCall<'_, RemoveMemberOutput> {
        OperationCall::new(self, "remove_member", &input)
    }

    pub fn remove_memory_webhook(
        &self,
        input: RemoveMemoryWebhookInput,
    ) -> OperationCall<'_, RemoveMemoryWebhookOutput> {
        OperationCall::new(self, "remove_memory_webhook", &input)
    }

    pub fn restore_database(
        &self,
        input: RestoreDatabaseInput,
    ) -> OperationCall<'_, RestoreDatabaseOutput> {
        OperationCall::new(self, "restore_database", &input)
    }

    pub fn restore_file(&self, input: RestoreFileInput) -> OperationCall<'_, RestoreFileOutput> {
        OperationCall::new(self, "restore_file", &input)
    }

    pub fn restore_index(&self, input: RestoreIndexInput) -> OperationCall<'_, RestoreIndexOutput> {
        OperationCall::new(self, "restore_index", &input)
    }

    pub fn restore_index_snapshot(
        &self,
        input: RestoreIndexSnapshotInput,
        content: FileContent,
    ) -> OperationCall<'_, RestoreIndexSnapshotOutput> {
        OperationCall::with_file(self, "restore_index_snapshot", &input, content)
    }

    pub fn restore_knowledge_base(
        &self,
        input: RestoreKnowledgeBaseInput,
    ) -> OperationCall<'_, RestoreKnowledgeBaseOutput> {
        OperationCall::new(self, "restore_knowledge_base", &input)
    }

    pub fn restore_memory(
        &self,
        input: RestoreMemoryInput,
    ) -> OperationCall<'_, RestoreMemoryOutput> {
        OperationCall::new(self, "restore_memory", &input)
    }

    pub fn restore_project(
        &self,
        input: RestoreProjectInput,
    ) -> OperationCall<'_, RestoreProjectOutput> {
        OperationCall::new(self, "restore_project", &input)
    }

    pub fn review_flagged_questions(
        &self,
        input: ReviewFlaggedQuestionsInput,
    ) -> OperationCall<'_, ReviewFlaggedQuestionsOutput> {
        OperationCall::new(self, "review_flagged_questions", &input)
    }

    pub fn revoke_api_key(
        &self,
        input: RevokeApiKeyInput,
    ) -> OperationCall<'_, RevokeApiKeyOutput> {
        OperationCall::new(self, "revoke_api_key", &input)
    }

    pub fn revoke_invitation(
        &self,
        input: RevokeInvitationInput,
    ) -> OperationCall<'_, RevokeInvitationOutput> {
        OperationCall::new(self, "revoke_invitation", &input)
    }

    pub fn run_database_sql(
        &self,
        input: RunDatabaseSqlInput,
    ) -> OperationCall<'_, RunDatabaseSqlOutput> {
        OperationCall::new(self, "run_database_sql", &input)
    }

    pub fn save_index_record(
        &self,
        input: SaveIndexRecordInput,
    ) -> OperationCall<'_, SaveIndexRecordOutput> {
        OperationCall::new(self, "save_index_record", &input)
    }

    pub fn save_memory_question(
        &self,
        input: SaveMemoryQuestionInput,
    ) -> OperationCall<'_, SaveMemoryQuestionOutput> {
        OperationCall::new(self, "save_memory_question", &input)
    }

    pub fn save_query(&self, input: SaveQueryInput) -> OperationCall<'_, SaveQueryOutput> {
        OperationCall::new(self, "save_query", &input)
    }

    pub fn save_question(&self, input: SaveQuestionInput) -> OperationCall<'_, SaveQuestionOutput> {
        OperationCall::new(self, "save_question", &input)
    }

    pub fn score_question_set(
        &self,
        input: ScoreQuestionSetInput,
    ) -> OperationCall<'_, ScoreQuestionSetOutput> {
        OperationCall::new(self, "score_question_set", &input)
    }

    pub fn search_folders(
        &self,
        input: SearchFoldersInput,
    ) -> OperationCall<'_, SearchFoldersOutput> {
        OperationCall::new(self, "search_folders", &input)
    }

    pub fn search_knowledge_base(
        &self,
        input: SearchKnowledgeBaseInput,
    ) -> OperationCall<'_, SearchKnowledgeBaseOutput> {
        OperationCall::new(self, "search_knowledge_base", &input)
    }

    pub fn send_memory_feedback(
        &self,
        input: SendMemoryFeedbackInput,
    ) -> OperationCall<'_, SendMemoryFeedbackOutput> {
        OperationCall::new(self, "send_memory_feedback", &input)
    }

    pub fn set_memory_webhook(
        &self,
        input: SetMemoryWebhookInput,
    ) -> OperationCall<'_, SetMemoryWebhookOutput> {
        OperationCall::new(self, "set_memory_webhook", &input)
    }

    pub fn settle_flagged_question(
        &self,
        input: SettleFlaggedQuestionInput,
    ) -> OperationCall<'_, SettleFlaggedQuestionOutput> {
        OperationCall::new(self, "settle_flagged_question", &input)
    }

    pub fn settle_memory(&self, input: SettleMemoryInput) -> OperationCall<'_, SettleMemoryOutput> {
        OperationCall::new(self, "settle_memory", &input)
    }

    pub fn settle_memory_review(
        &self,
        input: SettleMemoryReviewInput,
    ) -> OperationCall<'_, SettleMemoryReviewOutput> {
        OperationCall::new(self, "settle_memory_review", &input)
    }

    pub fn sign_in(&self, input: SignInInput) -> OperationCall<'_, SignInOutput> {
        OperationCall::new(self, "sign_in", &input)
    }

    pub fn sign_out(&self, input: SignOutInput) -> OperationCall<'_, SignOutOutput> {
        OperationCall::new(self, "sign_out", &input)
    }

    pub fn sign_up(&self, input: SignUpInput) -> OperationCall<'_, SignUpOutput> {
        OperationCall::new(self, "sign_up", &input)
    }

    pub fn sign_upload_parts(
        &self,
        input: SignUploadPartsInput,
    ) -> OperationCall<'_, SignUploadPartsOutput> {
        OperationCall::new(self, "sign_upload_parts", &input)
    }

    pub fn sort_message(&self, input: SortMessageInput) -> OperationCall<'_, SortMessageOutput> {
        OperationCall::new(self, "sort_message", &input)
    }

    pub fn start_memory_source_sign_in(
        &self,
        input: StartMemorySourceSignInInput,
    ) -> OperationCall<'_, StartMemorySourceSignInOutput> {
        OperationCall::new(self, "start_memory_source_sign_in", &input)
    }

    pub fn start_source_sign_in(
        &self,
        input: StartSourceSignInInput,
    ) -> OperationCall<'_, StartSourceSignInOutput> {
        OperationCall::new(self, "start_source_sign_in", &input)
    }

    pub fn suggest_index_terms(
        &self,
        input: SuggestIndexTermsInput,
    ) -> OperationCall<'_, SuggestIndexTermsOutput> {
        OperationCall::new(self, "suggest_index_terms", &input)
    }

    pub fn sync_memory_source(
        &self,
        input: SyncMemorySourceInput,
    ) -> OperationCall<'_, SyncMemorySourceOutput> {
        OperationCall::new(self, "sync_memory_source", &input)
    }

    pub fn sync_source(&self, input: SyncSourceInput) -> OperationCall<'_, SyncSourceOutput> {
        OperationCall::new(self, "sync_source", &input)
    }

    pub fn try_corrections(
        &self,
        input: TryCorrectionsInput,
    ) -> OperationCall<'_, TryCorrectionsOutput> {
        OperationCall::new(self, "try_corrections", &input)
    }

    pub fn tune_memory(&self, input: TuneMemoryInput) -> OperationCall<'_, TuneMemoryOutput> {
        OperationCall::new(self, "tune_memory", &input)
    }

    pub fn undo_learned_change(
        &self,
        input: UndoLearnedChangeInput,
    ) -> OperationCall<'_, UndoLearnedChangeOutput> {
        OperationCall::new(self, "undo_learned_change", &input)
    }

    pub fn update_api_key(
        &self,
        input: UpdateApiKeyInput,
    ) -> OperationCall<'_, UpdateApiKeyOutput> {
        OperationCall::new(self, "update_api_key", &input)
    }

    pub fn update_database(
        &self,
        input: UpdateDatabaseInput,
    ) -> OperationCall<'_, UpdateDatabaseOutput> {
        OperationCall::new(self, "update_database", &input)
    }

    pub fn update_index(&self, input: UpdateIndexInput) -> OperationCall<'_, UpdateIndexOutput> {
        OperationCall::new(self, "update_index", &input)
    }

    pub fn update_knowledge_base(
        &self,
        input: UpdateKnowledgeBaseInput,
    ) -> OperationCall<'_, UpdateKnowledgeBaseOutput> {
        OperationCall::new(self, "update_knowledge_base", &input)
    }

    pub fn update_memory(&self, input: UpdateMemoryInput) -> OperationCall<'_, UpdateMemoryOutput> {
        OperationCall::new(self, "update_memory", &input)
    }

    pub fn update_memory_source(
        &self,
        input: UpdateMemorySourceInput,
    ) -> OperationCall<'_, UpdateMemorySourceOutput> {
        OperationCall::new(self, "update_memory_source", &input)
    }

    pub fn update_saved_question(
        &self,
        input: UpdateSavedQuestionInput,
    ) -> OperationCall<'_, UpdateSavedQuestionOutput> {
        OperationCall::new(self, "update_saved_question", &input)
    }

    pub fn update_source(&self, input: UpdateSourceInput) -> OperationCall<'_, UpdateSourceOutput> {
        OperationCall::new(self, "update_source", &input)
    }

    pub fn update_table_row(
        &self,
        input: UpdateTableRowInput,
    ) -> OperationCall<'_, UpdateTableRowOutput> {
        OperationCall::new(self, "update_table_row", &input)
    }

    pub fn upload_table_import(
        &self,
        input: UploadTableImportInput,
        content: FileContent,
    ) -> OperationCall<'_, UploadTableImportOutput> {
        OperationCall::with_file(self, "upload_table_import", &input, content)
    }

    pub fn verify_second_factor(
        &self,
        input: VerifySecondFactorInput,
    ) -> OperationCall<'_, VerifySecondFactorOutput> {
        OperationCall::new(self, "verify_second_factor", &input)
    }
}
