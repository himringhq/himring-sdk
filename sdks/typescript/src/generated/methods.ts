import type { OperationCaller, RequestOptions } from '../core/operation-caller.js'
import type * as Types from './types.js'

export interface HimringOperationMethods {
  acceptInvitation(input: Types.AcceptInvitationInput, options?: RequestOptions): Promise<Types.AcceptInvitationOutput>
  addDatabaseMigration(input: Types.AddDatabaseMigrationInput, options?: RequestOptions): Promise<Types.AddDatabaseMigrationOutput>
  addMessages(input: Types.AddMessagesInput, options?: RequestOptions): Promise<Types.AddMessagesOutput>
  answerQuestion(input: Types.AnswerQuestionInput, options?: RequestOptions): Promise<Types.AnswerQuestionOutput>
  applyTableImport(input: Types.ApplyTableImportInput, options?: RequestOptions): Promise<Types.ApplyTableImportOutput>
  beginSecondFactorSetup(input: Types.BeginSecondFactorSetupInput, options?: RequestOptions): Promise<Types.BeginSecondFactorSetupOutput>
  cancelUpload(input: Types.CancelUploadInput, options?: RequestOptions): Promise<Types.CancelUploadOutput>
  changeTableColumns(input: Types.ChangeTableColumnsInput, options?: RequestOptions): Promise<Types.ChangeTableColumnsOutput>
  checkTableImport(input: Types.CheckTableImportInput, options?: RequestOptions): Promise<Types.CheckTableImportOutput>
  compactDatabase(input: Types.CompactDatabaseInput, options?: RequestOptions): Promise<Types.CompactDatabaseOutput>
  compareIndexSearch(input: Types.CompareIndexSearchInput, options?: RequestOptions): Promise<Types.CompareIndexSearchOutput>
  completeUpload(input: Types.CompleteUploadInput, options?: RequestOptions): Promise<Types.CompleteUploadOutput>
  confirmSecondFactorSetup(input: Types.ConfirmSecondFactorSetupInput, options?: RequestOptions): Promise<Types.ConfirmSecondFactorSetupOutput>
  createApiKey(input: Types.CreateApiKeyInput, options?: RequestOptions): Promise<Types.CreateApiKeyOutput>
  createCorrection(input: Types.CreateCorrectionInput, options?: RequestOptions): Promise<Types.CreateCorrectionOutput>
  createDatabase(input: Types.CreateDatabaseInput, options?: RequestOptions): Promise<Types.CreateDatabaseOutput>
  createIndex(input: Types.CreateIndexInput, options?: RequestOptions): Promise<Types.CreateIndexOutput>
  createKnowledgeBase(input: Types.CreateKnowledgeBaseInput, options?: RequestOptions): Promise<Types.CreateKnowledgeBaseOutput>
  createMemorySource(input: Types.CreateMemorySourceInput, options?: RequestOptions): Promise<Types.CreateMemorySourceOutput>
  createProject(input: Types.CreateProjectInput, options?: RequestOptions): Promise<Types.CreateProjectOutput>
  createSource(input: Types.CreateSourceInput, options?: RequestOptions): Promise<Types.CreateSourceOutput>
  createTable(input: Types.CreateTableInput, options?: RequestOptions): Promise<Types.CreateTableOutput>
  createUpload(input: Types.CreateUploadInput, options?: RequestOptions): Promise<Types.CreateUploadOutput>
  deleteDatabase(input: Types.DeleteDatabaseInput, options?: RequestOptions): Promise<Types.DeleteDatabaseOutput>
  deleteFile(input: Types.DeleteFileInput, options?: RequestOptions): Promise<Types.DeleteFileOutput>
  deleteIndex(input: Types.DeleteIndexInput, options?: RequestOptions): Promise<Types.DeleteIndexOutput>
  deleteIndexRecord(input: Types.DeleteIndexRecordInput, options?: RequestOptions): Promise<Types.DeleteIndexRecordOutput>
  deleteKnowledgeBase(input: Types.DeleteKnowledgeBaseInput, options?: RequestOptions): Promise<Types.DeleteKnowledgeBaseOutput>
  deleteMemory(input: Types.DeleteMemoryInput, options?: RequestOptions): Promise<Types.DeleteMemoryOutput>
  deleteMemorySavedQuestion(input: Types.DeleteMemorySavedQuestionInput, options?: RequestOptions): Promise<Types.DeleteMemorySavedQuestionOutput>
  deleteMemorySource(input: Types.DeleteMemorySourceInput, options?: RequestOptions): Promise<Types.DeleteMemorySourceOutput>
  deleteProject(input: Types.DeleteProjectInput, options?: RequestOptions): Promise<Types.DeleteProjectOutput>
  deleteSavedQuery(input: Types.DeleteSavedQueryInput, options?: RequestOptions): Promise<Types.DeleteSavedQueryOutput>
  deleteSavedQuestion(input: Types.DeleteSavedQuestionInput, options?: RequestOptions): Promise<Types.DeleteSavedQuestionOutput>
  deleteSource(input: Types.DeleteSourceInput, options?: RequestOptions): Promise<Types.DeleteSourceOutput>
  deleteTableRows(input: Types.DeleteTableRowsInput, options?: RequestOptions): Promise<Types.DeleteTableRowsOutput>
  discardCorrection(input: Types.DiscardCorrectionInput, options?: RequestOptions): Promise<Types.DiscardCorrectionOutput>
  discardTableImport(input: Types.DiscardTableImportInput, options?: RequestOptions): Promise<Types.DiscardTableImportOutput>
  dismissFlaggedQuestion(input: Types.DismissFlaggedQuestionInput, options?: RequestOptions): Promise<Types.DismissFlaggedQuestionOutput>
  downloadIndex(input: Types.DownloadIndexInput, options?: RequestOptions): Promise<Types.DownloadIndexOutput>
  enableMemory(input: Types.EnableMemoryInput, options?: RequestOptions): Promise<Types.EnableMemoryOutput>
  eraseEndUser(input: Types.EraseEndUserInput, options?: RequestOptions): Promise<Types.EraseEndUserOutput>
  exportIndexRecords(input: Types.ExportIndexRecordsInput, options?: RequestOptions): Promise<Types.ExportIndexRecordsOutput>
  exportMemories(input: Types.ExportMemoriesInput, options?: RequestOptions): Promise<Types.ExportMemoriesOutput>
  exportTableRows(input: Types.ExportTableRowsInput, options?: RequestOptions): Promise<Types.ExportTableRowsOutput>
  finishSourceSignIn(input: Types.FinishSourceSignInInput, options?: RequestOptions): Promise<Types.FinishSourceSignInOutput>
  forgetMemory(input: Types.ForgetMemoryInput, options?: RequestOptions): Promise<Types.ForgetMemoryOutput>
  getCorrection(input: Types.GetCorrectionInput, options?: RequestOptions): Promise<Types.GetCorrectionOutput>
  getCorrectionPass(input: Types.GetCorrectionPassInput, options?: RequestOptions): Promise<Types.GetCorrectionPassOutput>
  getDatabase(input: Types.GetDatabaseInput, options?: RequestOptions): Promise<Types.GetDatabaseOutput>
  getDownloadLink(input: Types.GetDownloadLinkInput, options?: RequestOptions): Promise<Types.GetDownloadLinkOutput>
  getFile(input: Types.GetFileInput, options?: RequestOptions): Promise<Types.GetFileOutput>
  getFlaggedQuestion(input: Types.GetFlaggedQuestionInput, options?: RequestOptions): Promise<Types.GetFlaggedQuestionOutput>
  getIndex(input: Types.GetIndexInput, options?: RequestOptions): Promise<Types.GetIndexOutput>
  getIndexRecord(input: Types.GetIndexRecordInput, options?: RequestOptions): Promise<Types.GetIndexRecordOutput>
  getIndexStats(input: Types.GetIndexStatsInput, options?: RequestOptions): Promise<Types.GetIndexStatsOutput>
  getKnowledgeBase(input: Types.GetKnowledgeBaseInput, options?: RequestOptions): Promise<Types.GetKnowledgeBaseOutput>
  getMemory(input: Types.GetMemoryInput, options?: RequestOptions): Promise<Types.GetMemoryOutput>
  getMemoryContext(input: Types.GetMemoryContextInput, options?: RequestOptions): Promise<Types.GetMemoryContextOutput>
  getMemoryScores(input: Types.GetMemoryScoresInput, options?: RequestOptions): Promise<Types.GetMemoryScoresOutput>
  getMemorySource(input: Types.GetMemorySourceInput, options?: RequestOptions): Promise<Types.GetMemorySourceOutput>
  getMemoryWebhook(input: Types.GetMemoryWebhookInput, options?: RequestOptions): Promise<Types.GetMemoryWebhookOutput>
  getMessage(input: Types.GetMessageInput, options?: RequestOptions): Promise<Types.GetMessageOutput>
  getProject(input: Types.GetProjectInput, options?: RequestOptions): Promise<Types.GetProjectOutput>
  getQuestionSet(input: Types.GetQuestionSetInput, options?: RequestOptions): Promise<Types.GetQuestionSetOutput>
  getSavedQuestion(input: Types.GetSavedQuestionInput, options?: RequestOptions): Promise<Types.GetSavedQuestionOutput>
  getScorecard(input: Types.GetScorecardInput, options?: RequestOptions): Promise<Types.GetScorecardOutput>
  getSession(input?: Types.GetSessionInput, options?: RequestOptions): Promise<Types.GetSessionOutput>
  getSource(input: Types.GetSourceInput, options?: RequestOptions): Promise<Types.GetSourceOutput>
  getTableRow(input: Types.GetTableRowInput, options?: RequestOptions): Promise<Types.GetTableRowOutput>
  getUpload(input: Types.GetUploadInput, options?: RequestOptions): Promise<Types.GetUploadOutput>
  importAnswerLog(input: Types.ImportAnswerLogInput, options?: RequestOptions): Promise<Types.ImportAnswerLogOutput>
  importIndexRecords(input: Types.ImportIndexRecordsInput, options?: RequestOptions): Promise<Types.ImportIndexRecordsOutput>
  importSavedQuestions(input: Types.ImportSavedQuestionsInput, options?: RequestOptions): Promise<Types.ImportSavedQuestionsOutput>
  ingestItems(input: Types.IngestItemsInput, options?: RequestOptions): Promise<Types.IngestItemsOutput>
  insertTableRow(input: Types.InsertTableRowInput, options?: RequestOptions): Promise<Types.InsertTableRowOutput>
  inspectMemory(input: Types.InspectMemoryInput, options?: RequestOptions): Promise<Types.InspectMemoryOutput>
  inviteMember(input: Types.InviteMemberInput, options?: RequestOptions): Promise<Types.InviteMemberOutput>
  listApiKeyPermissionChanges(input: Types.ListApiKeyPermissionChangesInput, options?: RequestOptions): Promise<Types.ListApiKeyPermissionChangesOutput>
  listApiKeys(input: Types.ListApiKeysInput, options?: RequestOptions): Promise<Types.ListApiKeysOutput>
  listCorrectionPasses(input: Types.ListCorrectionPassesInput, options?: RequestOptions): Promise<Types.ListCorrectionPassesOutput>
  listCorrections(input: Types.ListCorrectionsInput, options?: RequestOptions): Promise<Types.ListCorrectionsOutput>
  listDatabaseMigrations(input: Types.ListDatabaseMigrationsInput, options?: RequestOptions): Promise<Types.ListDatabaseMigrationsOutput>
  listDatabaseTables(input: Types.ListDatabaseTablesInput, options?: RequestOptions): Promise<Types.ListDatabaseTablesOutput>
  listDatabases(input: Types.ListDatabasesInput, options?: RequestOptions): Promise<Types.ListDatabasesOutput>
  listFileVersions(input: Types.ListFileVersionsInput, options?: RequestOptions): Promise<Types.ListFileVersionsOutput>
  listFiles(input: Types.ListFilesInput, options?: RequestOptions): Promise<Types.ListFilesOutput>
  listFlaggedQuestions(input: Types.ListFlaggedQuestionsInput, options?: RequestOptions): Promise<Types.ListFlaggedQuestionsOutput>
  listFolder(input: Types.ListFolderInput, options?: RequestOptions): Promise<Types.ListFolderOutput>
  listForgettingSuggestions(input: Types.ListForgettingSuggestionsInput, options?: RequestOptions): Promise<Types.ListForgettingSuggestionsOutput>
  listIndexRecords(input: Types.ListIndexRecordsInput, options?: RequestOptions): Promise<Types.ListIndexRecordsOutput>
  listIndexes(input: Types.ListIndexesInput, options?: RequestOptions): Promise<Types.ListIndexesOutput>
  listInvitations(input: Types.ListInvitationsInput, options?: RequestOptions): Promise<Types.ListInvitationsOutput>
  listKnowledgeBases(input: Types.ListKnowledgeBasesInput, options?: RequestOptions): Promise<Types.ListKnowledgeBasesOutput>
  listLearnedChanges(input: Types.ListLearnedChangesInput, options?: RequestOptions): Promise<Types.ListLearnedChangesOutput>
  listMembers(input: Types.ListMembersInput, options?: RequestOptions): Promise<Types.ListMembersOutput>
  listMemories(input: Types.ListMemoriesInput, options?: RequestOptions): Promise<Types.ListMemoriesOutput>
  listMemoryDecisions(input: Types.ListMemoryDecisionsInput, options?: RequestOptions): Promise<Types.ListMemoryDecisionsOutput>
  listMemoryOwners(input: Types.ListMemoryOwnersInput, options?: RequestOptions): Promise<Types.ListMemoryOwnersOutput>
  listMemoryReviews(input: Types.ListMemoryReviewsInput, options?: RequestOptions): Promise<Types.ListMemoryReviewsOutput>
  listMemorySavedQuestions(input: Types.ListMemorySavedQuestionsInput, options?: RequestOptions): Promise<Types.ListMemorySavedQuestionsOutput>
  listMemorySources(input: Types.ListMemorySourcesInput, options?: RequestOptions): Promise<Types.ListMemorySourcesOutput>
  listMemoryWebhookDeliveries(input: Types.ListMemoryWebhookDeliveriesInput, options?: RequestOptions): Promise<Types.ListMemoryWebhookDeliveriesOutput>
  listMessages(input: Types.ListMessagesInput, options?: RequestOptions): Promise<Types.ListMessagesOutput>
  listMetadataKeys(input: Types.ListMetadataKeysInput, options?: RequestOptions): Promise<Types.ListMetadataKeysOutput>
  listMetadataValues(input: Types.ListMetadataValuesInput, options?: RequestOptions): Promise<Types.ListMetadataValuesOutput>
  listOperations(input?: Types.ListOperationsInput, options?: RequestOptions): Promise<Types.ListOperationsOutput>
  listProjects(input?: Types.ListProjectsInput, options?: RequestOptions): Promise<Types.ListProjectsOutput>
  listQuestions(input: Types.ListQuestionsInput, options?: RequestOptions): Promise<Types.ListQuestionsOutput>
  listSavedQueries(input: Types.ListSavedQueriesInput, options?: RequestOptions): Promise<Types.ListSavedQueriesOutput>
  listSavedQuestions(input: Types.ListSavedQuestionsInput, options?: RequestOptions): Promise<Types.ListSavedQuestionsOutput>
  listScorecardResults(input: Types.ListScorecardResultsInput, options?: RequestOptions): Promise<Types.ListScorecardResultsOutput>
  listScorecards(input: Types.ListScorecardsInput, options?: RequestOptions): Promise<Types.ListScorecardsOutput>
  listSourceItems(input: Types.ListSourceItemsInput, options?: RequestOptions): Promise<Types.ListSourceItemsOutput>
  listSourceSyncs(input: Types.ListSourceSyncsInput, options?: RequestOptions): Promise<Types.ListSourceSyncsOutput>
  listSources(input: Types.ListSourcesInput, options?: RequestOptions): Promise<Types.ListSourcesOutput>
  listTableRows(input: Types.ListTableRowsInput, options?: RequestOptions): Promise<Types.ListTableRowsOutput>
  listVersionBlocks(input: Types.ListVersionBlocksInput, options?: RequestOptions): Promise<Types.ListVersionBlocksOutput>
  previewCreateTable(input: Types.PreviewCreateTableInput, options?: RequestOptions): Promise<Types.PreviewCreateTableOutput>
  previewIndexSearch(input: Types.PreviewIndexSearchInput, options?: RequestOptions): Promise<Types.PreviewIndexSearchOutput>
  previewTableColumnChanges(input: Types.PreviewTableColumnChangesInput, options?: RequestOptions): Promise<Types.PreviewTableColumnChangesOutput>
  promoteCorrection(input: Types.PromoteCorrectionInput, options?: RequestOptions): Promise<Types.PromoteCorrectionOutput>
  promoteMemory(input: Types.PromoteMemoryInput, options?: RequestOptions): Promise<Types.PromoteMemoryOutput>
  proposeCorrections(input: Types.ProposeCorrectionsInput, options?: RequestOptions): Promise<Types.ProposeCorrectionsOutput>
  proposeDatabaseChange(input: Types.ProposeDatabaseChangeInput, options?: RequestOptions): Promise<Types.ProposeDatabaseChangeOutput>
  recallMemories(input: Types.RecallMemoriesInput, options?: RequestOptions): Promise<Types.RecallMemoriesOutput>
  recordAnswerEvents(input: Types.RecordAnswerEventsInput, options?: RequestOptions): Promise<Types.RecordAnswerEventsOutput>
  recoverMemory(input: Types.RecoverMemoryInput, options?: RequestOptions): Promise<Types.RecoverMemoryOutput>
  removeMember(input: Types.RemoveMemberInput, options?: RequestOptions): Promise<Types.RemoveMemberOutput>
  removeMemoryWebhook(input: Types.RemoveMemoryWebhookInput, options?: RequestOptions): Promise<Types.RemoveMemoryWebhookOutput>
  restoreDatabase(input: Types.RestoreDatabaseInput, options?: RequestOptions): Promise<Types.RestoreDatabaseOutput>
  restoreFile(input: Types.RestoreFileInput, options?: RequestOptions): Promise<Types.RestoreFileOutput>
  restoreIndex(input: Types.RestoreIndexInput, options?: RequestOptions): Promise<Types.RestoreIndexOutput>
  restoreIndexSnapshot(input: Types.RestoreIndexSnapshotInput, options?: RequestOptions): Promise<Types.RestoreIndexSnapshotOutput>
  restoreKnowledgeBase(input: Types.RestoreKnowledgeBaseInput, options?: RequestOptions): Promise<Types.RestoreKnowledgeBaseOutput>
  restoreMemory(input: Types.RestoreMemoryInput, options?: RequestOptions): Promise<Types.RestoreMemoryOutput>
  restoreProject(input: Types.RestoreProjectInput, options?: RequestOptions): Promise<Types.RestoreProjectOutput>
  reviewFlaggedQuestions(input: Types.ReviewFlaggedQuestionsInput, options?: RequestOptions): Promise<Types.ReviewFlaggedQuestionsOutput>
  revokeApiKey(input: Types.RevokeApiKeyInput, options?: RequestOptions): Promise<Types.RevokeApiKeyOutput>
  revokeInvitation(input: Types.RevokeInvitationInput, options?: RequestOptions): Promise<Types.RevokeInvitationOutput>
  runDatabaseSql(input: Types.RunDatabaseSqlInput, options?: RequestOptions): Promise<Types.RunDatabaseSqlOutput>
  saveIndexRecord(input: Types.SaveIndexRecordInput, options?: RequestOptions): Promise<Types.SaveIndexRecordOutput>
  saveMemoryQuestion(input: Types.SaveMemoryQuestionInput, options?: RequestOptions): Promise<Types.SaveMemoryQuestionOutput>
  saveQuery(input: Types.SaveQueryInput, options?: RequestOptions): Promise<Types.SaveQueryOutput>
  saveQuestion(input: Types.SaveQuestionInput, options?: RequestOptions): Promise<Types.SaveQuestionOutput>
  scoreQuestionSet(input: Types.ScoreQuestionSetInput, options?: RequestOptions): Promise<Types.ScoreQuestionSetOutput>
  searchFolders(input: Types.SearchFoldersInput, options?: RequestOptions): Promise<Types.SearchFoldersOutput>
  searchKnowledgeBase(input: Types.SearchKnowledgeBaseInput, options?: RequestOptions): Promise<Types.SearchKnowledgeBaseOutput>
  sendMemoryFeedback(input: Types.SendMemoryFeedbackInput, options?: RequestOptions): Promise<Types.SendMemoryFeedbackOutput>
  setMemoryWebhook(input: Types.SetMemoryWebhookInput, options?: RequestOptions): Promise<Types.SetMemoryWebhookOutput>
  settleFlaggedQuestion(input: Types.SettleFlaggedQuestionInput, options?: RequestOptions): Promise<Types.SettleFlaggedQuestionOutput>
  settleMemory(input: Types.SettleMemoryInput, options?: RequestOptions): Promise<Types.SettleMemoryOutput>
  settleMemoryReview(input: Types.SettleMemoryReviewInput, options?: RequestOptions): Promise<Types.SettleMemoryReviewOutput>
  signIn(input: Types.SignInInput, options?: RequestOptions): Promise<Types.SignInOutput>
  signOut(input?: Types.SignOutInput, options?: RequestOptions): Promise<Types.SignOutOutput>
  signUp(input: Types.SignUpInput, options?: RequestOptions): Promise<Types.SignUpOutput>
  signUploadParts(input: Types.SignUploadPartsInput, options?: RequestOptions): Promise<Types.SignUploadPartsOutput>
  sortMessage(input: Types.SortMessageInput, options?: RequestOptions): Promise<Types.SortMessageOutput>
  startMemorySourceSignIn(input: Types.StartMemorySourceSignInInput, options?: RequestOptions): Promise<Types.StartMemorySourceSignInOutput>
  startSourceSignIn(input: Types.StartSourceSignInInput, options?: RequestOptions): Promise<Types.StartSourceSignInOutput>
  suggestIndexTerms(input: Types.SuggestIndexTermsInput, options?: RequestOptions): Promise<Types.SuggestIndexTermsOutput>
  syncMemorySource(input: Types.SyncMemorySourceInput, options?: RequestOptions): Promise<Types.SyncMemorySourceOutput>
  syncSource(input: Types.SyncSourceInput, options?: RequestOptions): Promise<Types.SyncSourceOutput>
  tryCorrections(input: Types.TryCorrectionsInput, options?: RequestOptions): Promise<Types.TryCorrectionsOutput>
  tuneMemory(input: Types.TuneMemoryInput, options?: RequestOptions): Promise<Types.TuneMemoryOutput>
  undoLearnedChange(input: Types.UndoLearnedChangeInput, options?: RequestOptions): Promise<Types.UndoLearnedChangeOutput>
  updateApiKey(input: Types.UpdateApiKeyInput, options?: RequestOptions): Promise<Types.UpdateApiKeyOutput>
  updateDatabase(input: Types.UpdateDatabaseInput, options?: RequestOptions): Promise<Types.UpdateDatabaseOutput>
  updateIndex(input: Types.UpdateIndexInput, options?: RequestOptions): Promise<Types.UpdateIndexOutput>
  updateKnowledgeBase(input: Types.UpdateKnowledgeBaseInput, options?: RequestOptions): Promise<Types.UpdateKnowledgeBaseOutput>
  updateMemory(input: Types.UpdateMemoryInput, options?: RequestOptions): Promise<Types.UpdateMemoryOutput>
  updateMemorySource(input: Types.UpdateMemorySourceInput, options?: RequestOptions): Promise<Types.UpdateMemorySourceOutput>
  updateSavedQuestion(input: Types.UpdateSavedQuestionInput, options?: RequestOptions): Promise<Types.UpdateSavedQuestionOutput>
  updateSource(input: Types.UpdateSourceInput, options?: RequestOptions): Promise<Types.UpdateSourceOutput>
  updateTableRow(input: Types.UpdateTableRowInput, options?: RequestOptions): Promise<Types.UpdateTableRowOutput>
  uploadTableImport(input: Types.UploadTableImportInput, options?: RequestOptions): Promise<Types.UploadTableImportOutput>
  verifySecondFactor(input: Types.VerifySecondFactorInput, options?: RequestOptions): Promise<Types.VerifySecondFactorOutput>
}

export function bindOperationMethods(call: OperationCaller): HimringOperationMethods {
  return {
    acceptInvitation: (input, options) => call('accept_invitation', input, options),
    addDatabaseMigration: (input, options) => call('add_database_migration', input, options),
    addMessages: (input, options) => call('add_messages', input, options),
    answerQuestion: (input, options) => call('answer_question', input, options),
    applyTableImport: (input, options) => call('apply_table_import', input, options),
    beginSecondFactorSetup: (input, options) => call('begin_second_factor_setup', input, options),
    cancelUpload: (input, options) => call('cancel_upload', input, options),
    changeTableColumns: (input, options) => call('change_table_columns', input, options),
    checkTableImport: (input, options) => call('check_table_import', input, options),
    compactDatabase: (input, options) => call('compact_database', input, options),
    compareIndexSearch: (input, options) => call('compare_index_search', input, options),
    completeUpload: (input, options) => call('complete_upload', input, options),
    confirmSecondFactorSetup: (input, options) => call('confirm_second_factor_setup', input, options),
    createApiKey: (input, options) => call('create_api_key', input, options),
    createCorrection: (input, options) => call('create_correction', input, options),
    createDatabase: (input, options) => call('create_database', input, options),
    createIndex: (input, options) => call('create_index', input, options),
    createKnowledgeBase: (input, options) => call('create_knowledge_base', input, options),
    createMemorySource: (input, options) => call('create_memory_source', input, options),
    createProject: (input, options) => call('create_project', input, options),
    createSource: (input, options) => call('create_source', input, options),
    createTable: (input, options) => call('create_table', input, options),
    createUpload: (input, options) => call('create_upload', input, options),
    deleteDatabase: (input, options) => call('delete_database', input, options),
    deleteFile: (input, options) => call('delete_file', input, options),
    deleteIndex: (input, options) => call('delete_index', input, options),
    deleteIndexRecord: (input, options) => call('delete_index_record', input, options),
    deleteKnowledgeBase: (input, options) => call('delete_knowledge_base', input, options),
    deleteMemory: (input, options) => call('delete_memory', input, options),
    deleteMemorySavedQuestion: (input, options) => call('delete_memory_saved_question', input, options),
    deleteMemorySource: (input, options) => call('delete_memory_source', input, options),
    deleteProject: (input, options) => call('delete_project', input, options),
    deleteSavedQuery: (input, options) => call('delete_saved_query', input, options),
    deleteSavedQuestion: (input, options) => call('delete_saved_question', input, options),
    deleteSource: (input, options) => call('delete_source', input, options),
    deleteTableRows: (input, options) => call('delete_table_rows', input, options),
    discardCorrection: (input, options) => call('discard_correction', input, options),
    discardTableImport: (input, options) => call('discard_table_import', input, options),
    dismissFlaggedQuestion: (input, options) => call('dismiss_flagged_question', input, options),
    downloadIndex: (input, options) => call('download_index', input, options),
    enableMemory: (input, options) => call('enable_memory', input, options),
    eraseEndUser: (input, options) => call('erase_end_user', input, options),
    exportIndexRecords: (input, options) => call('export_index_records', input, options),
    exportMemories: (input, options) => call('export_memories', input, options),
    exportTableRows: (input, options) => call('export_table_rows', input, options),
    finishSourceSignIn: (input, options) => call('finish_source_sign_in', input, options),
    forgetMemory: (input, options) => call('forget_memory', input, options),
    getCorrection: (input, options) => call('get_correction', input, options),
    getCorrectionPass: (input, options) => call('get_correction_pass', input, options),
    getDatabase: (input, options) => call('get_database', input, options),
    getDownloadLink: (input, options) => call('get_download_link', input, options),
    getFile: (input, options) => call('get_file', input, options),
    getFlaggedQuestion: (input, options) => call('get_flagged_question', input, options),
    getIndex: (input, options) => call('get_index', input, options),
    getIndexRecord: (input, options) => call('get_index_record', input, options),
    getIndexStats: (input, options) => call('get_index_stats', input, options),
    getKnowledgeBase: (input, options) => call('get_knowledge_base', input, options),
    getMemory: (input, options) => call('get_memory', input, options),
    getMemoryContext: (input, options) => call('get_memory_context', input, options),
    getMemoryScores: (input, options) => call('get_memory_scores', input, options),
    getMemorySource: (input, options) => call('get_memory_source', input, options),
    getMemoryWebhook: (input, options) => call('get_memory_webhook', input, options),
    getMessage: (input, options) => call('get_message', input, options),
    getProject: (input, options) => call('get_project', input, options),
    getQuestionSet: (input, options) => call('get_question_set', input, options),
    getSavedQuestion: (input, options) => call('get_saved_question', input, options),
    getScorecard: (input, options) => call('get_scorecard', input, options),
    getSession: (input, options) => call('get_session', input, options),
    getSource: (input, options) => call('get_source', input, options),
    getTableRow: (input, options) => call('get_table_row', input, options),
    getUpload: (input, options) => call('get_upload', input, options),
    importAnswerLog: (input, options) => call('import_answer_log', input, options),
    importIndexRecords: (input, options) => call('import_index_records', input, options),
    importSavedQuestions: (input, options) => call('import_saved_questions', input, options),
    ingestItems: (input, options) => call('ingest_items', input, options),
    insertTableRow: (input, options) => call('insert_table_row', input, options),
    inspectMemory: (input, options) => call('inspect_memory', input, options),
    inviteMember: (input, options) => call('invite_member', input, options),
    listApiKeyPermissionChanges: (input, options) => call('list_api_key_permission_changes', input, options),
    listApiKeys: (input, options) => call('list_api_keys', input, options),
    listCorrectionPasses: (input, options) => call('list_correction_passes', input, options),
    listCorrections: (input, options) => call('list_corrections', input, options),
    listDatabaseMigrations: (input, options) => call('list_database_migrations', input, options),
    listDatabaseTables: (input, options) => call('list_database_tables', input, options),
    listDatabases: (input, options) => call('list_databases', input, options),
    listFileVersions: (input, options) => call('list_file_versions', input, options),
    listFiles: (input, options) => call('list_files', input, options),
    listFlaggedQuestions: (input, options) => call('list_flagged_questions', input, options),
    listFolder: (input, options) => call('list_folder', input, options),
    listForgettingSuggestions: (input, options) => call('list_forgetting_suggestions', input, options),
    listIndexRecords: (input, options) => call('list_index_records', input, options),
    listIndexes: (input, options) => call('list_indexes', input, options),
    listInvitations: (input, options) => call('list_invitations', input, options),
    listKnowledgeBases: (input, options) => call('list_knowledge_bases', input, options),
    listLearnedChanges: (input, options) => call('list_learned_changes', input, options),
    listMembers: (input, options) => call('list_members', input, options),
    listMemories: (input, options) => call('list_memories', input, options),
    listMemoryDecisions: (input, options) => call('list_memory_decisions', input, options),
    listMemoryOwners: (input, options) => call('list_memory_owners', input, options),
    listMemoryReviews: (input, options) => call('list_memory_reviews', input, options),
    listMemorySavedQuestions: (input, options) => call('list_memory_saved_questions', input, options),
    listMemorySources: (input, options) => call('list_memory_sources', input, options),
    listMemoryWebhookDeliveries: (input, options) => call('list_memory_webhook_deliveries', input, options),
    listMessages: (input, options) => call('list_messages', input, options),
    listMetadataKeys: (input, options) => call('list_metadata_keys', input, options),
    listMetadataValues: (input, options) => call('list_metadata_values', input, options),
    listOperations: (input, options) => call('list_operations', input, options),
    listProjects: (input, options) => call('list_projects', input, options),
    listQuestions: (input, options) => call('list_questions', input, options),
    listSavedQueries: (input, options) => call('list_saved_queries', input, options),
    listSavedQuestions: (input, options) => call('list_saved_questions', input, options),
    listScorecardResults: (input, options) => call('list_scorecard_results', input, options),
    listScorecards: (input, options) => call('list_scorecards', input, options),
    listSourceItems: (input, options) => call('list_source_items', input, options),
    listSourceSyncs: (input, options) => call('list_source_syncs', input, options),
    listSources: (input, options) => call('list_sources', input, options),
    listTableRows: (input, options) => call('list_table_rows', input, options),
    listVersionBlocks: (input, options) => call('list_version_blocks', input, options),
    previewCreateTable: (input, options) => call('preview_create_table', input, options),
    previewIndexSearch: (input, options) => call('preview_index_search', input, options),
    previewTableColumnChanges: (input, options) => call('preview_table_column_changes', input, options),
    promoteCorrection: (input, options) => call('promote_correction', input, options),
    promoteMemory: (input, options) => call('promote_memory', input, options),
    proposeCorrections: (input, options) => call('propose_corrections', input, options),
    proposeDatabaseChange: (input, options) => call('propose_database_change', input, options),
    recallMemories: (input, options) => call('recall_memories', input, options),
    recordAnswerEvents: (input, options) => call('record_answer_events', input, options),
    recoverMemory: (input, options) => call('recover_memory', input, options),
    removeMember: (input, options) => call('remove_member', input, options),
    removeMemoryWebhook: (input, options) => call('remove_memory_webhook', input, options),
    restoreDatabase: (input, options) => call('restore_database', input, options),
    restoreFile: (input, options) => call('restore_file', input, options),
    restoreIndex: (input, options) => call('restore_index', input, options),
    restoreIndexSnapshot: (input, options) => call('restore_index_snapshot', input, options),
    restoreKnowledgeBase: (input, options) => call('restore_knowledge_base', input, options),
    restoreMemory: (input, options) => call('restore_memory', input, options),
    restoreProject: (input, options) => call('restore_project', input, options),
    reviewFlaggedQuestions: (input, options) => call('review_flagged_questions', input, options),
    revokeApiKey: (input, options) => call('revoke_api_key', input, options),
    revokeInvitation: (input, options) => call('revoke_invitation', input, options),
    runDatabaseSql: (input, options) => call('run_database_sql', input, options),
    saveIndexRecord: (input, options) => call('save_index_record', input, options),
    saveMemoryQuestion: (input, options) => call('save_memory_question', input, options),
    saveQuery: (input, options) => call('save_query', input, options),
    saveQuestion: (input, options) => call('save_question', input, options),
    scoreQuestionSet: (input, options) => call('score_question_set', input, options),
    searchFolders: (input, options) => call('search_folders', input, options),
    searchKnowledgeBase: (input, options) => call('search_knowledge_base', input, options),
    sendMemoryFeedback: (input, options) => call('send_memory_feedback', input, options),
    setMemoryWebhook: (input, options) => call('set_memory_webhook', input, options),
    settleFlaggedQuestion: (input, options) => call('settle_flagged_question', input, options),
    settleMemory: (input, options) => call('settle_memory', input, options),
    settleMemoryReview: (input, options) => call('settle_memory_review', input, options),
    signIn: (input, options) => call('sign_in', input, options),
    signOut: (input, options) => call('sign_out', input, options),
    signUp: (input, options) => call('sign_up', input, options),
    signUploadParts: (input, options) => call('sign_upload_parts', input, options),
    sortMessage: (input, options) => call('sort_message', input, options),
    startMemorySourceSignIn: (input, options) => call('start_memory_source_sign_in', input, options),
    startSourceSignIn: (input, options) => call('start_source_sign_in', input, options),
    suggestIndexTerms: (input, options) => call('suggest_index_terms', input, options),
    syncMemorySource: (input, options) => call('sync_memory_source', input, options),
    syncSource: (input, options) => call('sync_source', input, options),
    tryCorrections: (input, options) => call('try_corrections', input, options),
    tuneMemory: (input, options) => call('tune_memory', input, options),
    undoLearnedChange: (input, options) => call('undo_learned_change', input, options),
    updateApiKey: (input, options) => call('update_api_key', input, options),
    updateDatabase: (input, options) => call('update_database', input, options),
    updateIndex: (input, options) => call('update_index', input, options),
    updateKnowledgeBase: (input, options) => call('update_knowledge_base', input, options),
    updateMemory: (input, options) => call('update_memory', input, options),
    updateMemorySource: (input, options) => call('update_memory_source', input, options),
    updateSavedQuestion: (input, options) => call('update_saved_question', input, options),
    updateSource: (input, options) => call('update_source', input, options),
    updateTableRow: (input, options) => call('update_table_row', input, options),
    uploadTableImport: (input, options) => call('upload_table_import', input, options),
    verifySecondFactor: (input, options) => call('verify_second_factor', input, options),
  }
}
