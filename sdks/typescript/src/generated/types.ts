import type { OperationInput, OperationOutput } from '../core/operation-types.js'
import type { Download, FileContent } from '../core/types.js'
import type { operations as ApiOperations } from './api-document.js'
import type { operations as SessionOperations } from './session-document.js'

export type AcceptInvitationInput = OperationInput<SessionOperations["accept_invitation"]>

export type AcceptInvitationOutput = OperationOutput<SessionOperations["accept_invitation"], 200>

export type AddDatabaseMigrationInput = OperationInput<ApiOperations["add_database_migration"]>

export type AddDatabaseMigrationOutput = OperationOutput<ApiOperations["add_database_migration"], 201>

export type AddMessagesInput = OperationInput<ApiOperations["add_messages"]>

export type AddMessagesOutput = OperationOutput<ApiOperations["add_messages"], 200>

export type AnswerQuestionInput = OperationInput<ApiOperations["answer_question"]>

export type AnswerQuestionOutput = OperationOutput<ApiOperations["answer_question"], 200>

export type ApplyTableImportInput = OperationInput<ApiOperations["apply_table_import"]>

export type ApplyTableImportOutput = OperationOutput<ApiOperations["apply_table_import"], 201>

export type BeginSecondFactorSetupInput = OperationInput<SessionOperations["begin_second_factor_setup"]>

export type BeginSecondFactorSetupOutput = OperationOutput<SessionOperations["begin_second_factor_setup"], 200>

export type CancelUploadInput = OperationInput<ApiOperations["cancel_upload"]>

export type CancelUploadOutput = OperationOutput<ApiOperations["cancel_upload"], 200>

export type ChangeTableColumnsInput = OperationInput<ApiOperations["change_table_columns"]>

export type ChangeTableColumnsOutput = OperationOutput<ApiOperations["change_table_columns"], 201>

export type CheckTableImportInput = OperationInput<ApiOperations["check_table_import"]>

export type CheckTableImportOutput = OperationOutput<ApiOperations["check_table_import"], 200>

export type CompactDatabaseInput = OperationInput<ApiOperations["compact_database"]>

export type CompactDatabaseOutput = OperationOutput<ApiOperations["compact_database"], 200>

export type CompareIndexSearchInput = OperationInput<ApiOperations["compare_index_search"]>

export type CompareIndexSearchOutput = OperationOutput<ApiOperations["compare_index_search"], 200>

export type CompleteUploadInput = OperationInput<ApiOperations["complete_upload"]>

export type CompleteUploadOutput = OperationOutput<ApiOperations["complete_upload"], 200>

export type ConfirmSecondFactorSetupInput = OperationInput<SessionOperations["confirm_second_factor_setup"]>

export type ConfirmSecondFactorSetupOutput = OperationOutput<SessionOperations["confirm_second_factor_setup"], 200>

export type CreateApiKeyInput = OperationInput<SessionOperations["create_api_key"]>

export type CreateApiKeyOutput = OperationOutput<SessionOperations["create_api_key"], 201>

export type CreateCorrectionInput = OperationInput<ApiOperations["create_correction"]>

export type CreateCorrectionOutput = OperationOutput<ApiOperations["create_correction"], 201>

export type CreateDatabaseInput = OperationInput<ApiOperations["create_database"]>

export type CreateDatabaseOutput = OperationOutput<ApiOperations["create_database"], 201>

export type CreateIndexInput = OperationInput<ApiOperations["create_index"]>

export type CreateIndexOutput = OperationOutput<ApiOperations["create_index"], 201>

export type CreateKnowledgeBaseInput = OperationInput<ApiOperations["create_knowledge_base"]>

export type CreateKnowledgeBaseOutput = OperationOutput<ApiOperations["create_knowledge_base"], 201>

export type CreateMemorySourceInput = OperationInput<ApiOperations["create_memory_source"]>

export type CreateMemorySourceOutput = OperationOutput<ApiOperations["create_memory_source"], 201>

export type CreateProjectInput = OperationInput<SessionOperations["create_project"]>

export type CreateProjectOutput = OperationOutput<SessionOperations["create_project"], 201>

export type CreateSourceInput = OperationInput<ApiOperations["create_source"]>

export type CreateSourceOutput = OperationOutput<ApiOperations["create_source"], 201>

export type CreateTableInput = OperationInput<ApiOperations["create_table"]>

export type CreateTableOutput = OperationOutput<ApiOperations["create_table"], 201>

export type CreateUploadInput = OperationInput<ApiOperations["create_upload"]>

export type CreateUploadOutput = OperationOutput<ApiOperations["create_upload"], 201>

export type DeleteDatabaseInput = OperationInput<ApiOperations["delete_database"]>

export type DeleteDatabaseOutput = OperationOutput<ApiOperations["delete_database"], 200>

export type DeleteFileInput = OperationInput<ApiOperations["delete_file"]>

export type DeleteFileOutput = OperationOutput<ApiOperations["delete_file"], 200>

export type DeleteIndexInput = OperationInput<ApiOperations["delete_index"]>

export type DeleteIndexOutput = OperationOutput<ApiOperations["delete_index"], 200>

export type DeleteIndexRecordInput = OperationInput<ApiOperations["delete_index_record"]>

export type DeleteIndexRecordOutput = OperationOutput<ApiOperations["delete_index_record"], 200>

export type DeleteKnowledgeBaseInput = OperationInput<ApiOperations["delete_knowledge_base"]>

export type DeleteKnowledgeBaseOutput = OperationOutput<ApiOperations["delete_knowledge_base"], 200>

export type DeleteMemoryInput = OperationInput<ApiOperations["delete_memory"]>

export type DeleteMemoryOutput = OperationOutput<ApiOperations["delete_memory"], 200>

export type DeleteMemorySavedQuestionInput = OperationInput<ApiOperations["delete_memory_saved_question"]>

export type DeleteMemorySavedQuestionOutput = OperationOutput<ApiOperations["delete_memory_saved_question"], 200>

export type DeleteMemorySourceInput = OperationInput<ApiOperations["delete_memory_source"]>

export type DeleteMemorySourceOutput = OperationOutput<ApiOperations["delete_memory_source"], 200>

export type DeleteProjectInput = OperationInput<SessionOperations["delete_project"]>

export type DeleteProjectOutput = OperationOutput<SessionOperations["delete_project"], 200>

export type DeleteSavedQueryInput = OperationInput<ApiOperations["delete_saved_query"]>

export type DeleteSavedQueryOutput = OperationOutput<ApiOperations["delete_saved_query"], 200>

export type DeleteSavedQuestionInput = OperationInput<ApiOperations["delete_saved_question"]>

export type DeleteSavedQuestionOutput = OperationOutput<ApiOperations["delete_saved_question"], 200>

export type DeleteSourceInput = OperationInput<ApiOperations["delete_source"]>

export type DeleteSourceOutput = OperationOutput<ApiOperations["delete_source"], 200>

export type DeleteTableRowsInput = OperationInput<ApiOperations["delete_table_rows"]>

export type DeleteTableRowsOutput = OperationOutput<ApiOperations["delete_table_rows"], 200>

export type DiscardCorrectionInput = OperationInput<ApiOperations["discard_correction"]>

export type DiscardCorrectionOutput = OperationOutput<ApiOperations["discard_correction"], 200>

export type DiscardTableImportInput = OperationInput<ApiOperations["discard_table_import"]>

export type DiscardTableImportOutput = OperationOutput<ApiOperations["discard_table_import"], 200>

export type DismissFlaggedQuestionInput = OperationInput<ApiOperations["dismiss_flagged_question"]>

export type DismissFlaggedQuestionOutput = OperationOutput<ApiOperations["dismiss_flagged_question"], 200>

export type DownloadIndexInput = OperationInput<ApiOperations["download_index"]>

export type DownloadIndexOutput = Download

export type EnableMemoryInput = OperationInput<ApiOperations["enable_memory"]>

export type EnableMemoryOutput = OperationOutput<ApiOperations["enable_memory"], 201>

export type EraseEndUserInput = OperationInput<ApiOperations["erase_end_user"]>

export type EraseEndUserOutput = OperationOutput<ApiOperations["erase_end_user"], 200>

export type ExportIndexRecordsInput = OperationInput<ApiOperations["export_index_records"]>

export type ExportIndexRecordsOutput = Download

export type ExportMemoriesInput = OperationInput<ApiOperations["export_memories"]>

export type ExportMemoriesOutput = Download

export type ExportTableRowsInput = OperationInput<ApiOperations["export_table_rows"]>

export type ExportTableRowsOutput = Download

export type FinishSourceSignInInput = OperationInput<SessionOperations["finish_source_sign_in"]>

export type FinishSourceSignInOutput = OperationOutput<SessionOperations["finish_source_sign_in"], 200>

export type ForgetMemoryInput = OperationInput<ApiOperations["forget_memory"]>

export type ForgetMemoryOutput = OperationOutput<ApiOperations["forget_memory"], 200>

export type GetCorrectionInput = OperationInput<ApiOperations["get_correction"]>

export type GetCorrectionOutput = OperationOutput<ApiOperations["get_correction"], 200>

export type GetCorrectionPassInput = OperationInput<ApiOperations["get_correction_pass"]>

export type GetCorrectionPassOutput = OperationOutput<ApiOperations["get_correction_pass"], 200>

export type GetDatabaseInput = OperationInput<ApiOperations["get_database"]>

export type GetDatabaseOutput = OperationOutput<ApiOperations["get_database"], 200>

export type GetDownloadLinkInput = OperationInput<ApiOperations["get_download_link"]>

export type GetDownloadLinkOutput = OperationOutput<ApiOperations["get_download_link"], 200>

export type GetFileInput = OperationInput<ApiOperations["get_file"]>

export type GetFileOutput = OperationOutput<ApiOperations["get_file"], 200>

export type GetFlaggedQuestionInput = OperationInput<ApiOperations["get_flagged_question"]>

export type GetFlaggedQuestionOutput = OperationOutput<ApiOperations["get_flagged_question"], 200>

export type GetIndexInput = OperationInput<ApiOperations["get_index"]>

export type GetIndexOutput = OperationOutput<ApiOperations["get_index"], 200>

export type GetIndexRecordInput = OperationInput<ApiOperations["get_index_record"]>

export type GetIndexRecordOutput = OperationOutput<ApiOperations["get_index_record"], 200>

export type GetIndexStatsInput = OperationInput<ApiOperations["get_index_stats"]>

export type GetIndexStatsOutput = OperationOutput<ApiOperations["get_index_stats"], 200>

export type GetKnowledgeBaseInput = OperationInput<ApiOperations["get_knowledge_base"]>

export type GetKnowledgeBaseOutput = OperationOutput<ApiOperations["get_knowledge_base"], 200>

export type GetMemoryInput = OperationInput<ApiOperations["get_memory"]>

export type GetMemoryOutput = OperationOutput<ApiOperations["get_memory"], 200>

export type GetMemoryContextInput = OperationInput<ApiOperations["get_memory_context"]>

export type GetMemoryContextOutput = OperationOutput<ApiOperations["get_memory_context"], 200>

export type GetMemoryScoresInput = OperationInput<ApiOperations["get_memory_scores"]>

export type GetMemoryScoresOutput = OperationOutput<ApiOperations["get_memory_scores"], 200>

export type GetMemorySourceInput = OperationInput<ApiOperations["get_memory_source"]>

export type GetMemorySourceOutput = OperationOutput<ApiOperations["get_memory_source"], 200>

export type GetMemoryWebhookInput = OperationInput<ApiOperations["get_memory_webhook"]>

export type GetMemoryWebhookOutput = OperationOutput<ApiOperations["get_memory_webhook"], 200>

export type GetMessageInput = OperationInput<ApiOperations["get_message"]>

export type GetMessageOutput = OperationOutput<ApiOperations["get_message"], 200>

export type GetProjectInput = OperationInput<ApiOperations["get_project"]>

export type GetProjectOutput = OperationOutput<ApiOperations["get_project"], 200>

export type GetQuestionSetInput = OperationInput<ApiOperations["get_question_set"]>

export type GetQuestionSetOutput = OperationOutput<ApiOperations["get_question_set"], 200>

export type GetSavedQuestionInput = OperationInput<ApiOperations["get_saved_question"]>

export type GetSavedQuestionOutput = OperationOutput<ApiOperations["get_saved_question"], 200>

export type GetScorecardInput = OperationInput<ApiOperations["get_scorecard"]>

export type GetScorecardOutput = OperationOutput<ApiOperations["get_scorecard"], 200>

export type GetSessionInput = OperationInput<SessionOperations["get_session"]>

export type GetSessionOutput = OperationOutput<SessionOperations["get_session"], 200>

export type GetSourceInput = OperationInput<ApiOperations["get_source"]>

export type GetSourceOutput = OperationOutput<ApiOperations["get_source"], 200>

export type GetTableRowInput = OperationInput<ApiOperations["get_table_row"]>

export type GetTableRowOutput = OperationOutput<ApiOperations["get_table_row"], 200>

export type GetUploadInput = OperationInput<ApiOperations["get_upload"]>

export type GetUploadOutput = OperationOutput<ApiOperations["get_upload"], 200>

export type ImportAnswerLogInput = OperationInput<ApiOperations["import_answer_log"]> & { content: FileContent }

export type ImportAnswerLogOutput = OperationOutput<ApiOperations["import_answer_log"], 200>

export type ImportIndexRecordsInput = OperationInput<ApiOperations["import_index_records"]> & { content: FileContent }

export type ImportIndexRecordsOutput = OperationOutput<ApiOperations["import_index_records"], 201>

export type ImportSavedQuestionsInput = OperationInput<ApiOperations["import_saved_questions"]> & { content: FileContent }

export type ImportSavedQuestionsOutput = OperationOutput<ApiOperations["import_saved_questions"], 201>

export type IngestItemsInput = OperationInput<ApiOperations["ingest_items"]>

export type IngestItemsOutput = OperationOutput<ApiOperations["ingest_items"], 200>

export type InsertTableRowInput = OperationInput<ApiOperations["insert_table_row"]>

export type InsertTableRowOutput = OperationOutput<ApiOperations["insert_table_row"], 201>

export type InspectMemoryInput = OperationInput<ApiOperations["inspect_memory"]>

export type InspectMemoryOutput = OperationOutput<ApiOperations["inspect_memory"], 200>

export type InviteMemberInput = OperationInput<SessionOperations["invite_member"]>

export type InviteMemberOutput = OperationOutput<SessionOperations["invite_member"], 201>

export type ListApiKeyPermissionChangesInput = OperationInput<SessionOperations["list_api_key_permission_changes"]>

export type ListApiKeyPermissionChangesOutput = OperationOutput<SessionOperations["list_api_key_permission_changes"], 200>

export type ListApiKeysInput = OperationInput<SessionOperations["list_api_keys"]>

export type ListApiKeysOutput = OperationOutput<SessionOperations["list_api_keys"], 200>

export type ListCorrectionPassesInput = OperationInput<ApiOperations["list_correction_passes"]>

export type ListCorrectionPassesOutput = OperationOutput<ApiOperations["list_correction_passes"], 200>

export type ListCorrectionsInput = OperationInput<ApiOperations["list_corrections"]>

export type ListCorrectionsOutput = OperationOutput<ApiOperations["list_corrections"], 200>

export type ListDatabaseMigrationsInput = OperationInput<ApiOperations["list_database_migrations"]>

export type ListDatabaseMigrationsOutput = OperationOutput<ApiOperations["list_database_migrations"], 200>

export type ListDatabaseTablesInput = OperationInput<ApiOperations["list_database_tables"]>

export type ListDatabaseTablesOutput = OperationOutput<ApiOperations["list_database_tables"], 200>

export type ListDatabasesInput = OperationInput<ApiOperations["list_databases"]>

export type ListDatabasesOutput = OperationOutput<ApiOperations["list_databases"], 200>

export type ListFileVersionsInput = OperationInput<ApiOperations["list_file_versions"]>

export type ListFileVersionsOutput = OperationOutput<ApiOperations["list_file_versions"], 200>

export type ListFilesInput = OperationInput<ApiOperations["list_files"]>

export type ListFilesOutput = OperationOutput<ApiOperations["list_files"], 200>

export type ListFlaggedQuestionsInput = OperationInput<ApiOperations["list_flagged_questions"]>

export type ListFlaggedQuestionsOutput = OperationOutput<ApiOperations["list_flagged_questions"], 200>

export type ListFolderInput = OperationInput<ApiOperations["list_folder"]>

export type ListFolderOutput = OperationOutput<ApiOperations["list_folder"], 200>

export type ListForgettingSuggestionsInput = OperationInput<ApiOperations["list_forgetting_suggestions"]>

export type ListForgettingSuggestionsOutput = OperationOutput<ApiOperations["list_forgetting_suggestions"], 200>

export type ListIndexRecordsInput = OperationInput<ApiOperations["list_index_records"]>

export type ListIndexRecordsOutput = OperationOutput<ApiOperations["list_index_records"], 200>

export type ListIndexesInput = OperationInput<ApiOperations["list_indexes"]>

export type ListIndexesOutput = OperationOutput<ApiOperations["list_indexes"], 200>

export type ListInvitationsInput = OperationInput<SessionOperations["list_invitations"]>

export type ListInvitationsOutput = OperationOutput<SessionOperations["list_invitations"], 200>

export type ListKnowledgeBasesInput = OperationInput<ApiOperations["list_knowledge_bases"]>

export type ListKnowledgeBasesOutput = OperationOutput<ApiOperations["list_knowledge_bases"], 200>

export type ListLearnedChangesInput = OperationInput<ApiOperations["list_learned_changes"]>

export type ListLearnedChangesOutput = OperationOutput<ApiOperations["list_learned_changes"], 200>

export type ListMembersInput = OperationInput<SessionOperations["list_members"]>

export type ListMembersOutput = OperationOutput<SessionOperations["list_members"], 200>

export type ListMemoriesInput = OperationInput<ApiOperations["list_memories"]>

export type ListMemoriesOutput = OperationOutput<ApiOperations["list_memories"], 200>

export type ListMemoryDecisionsInput = OperationInput<ApiOperations["list_memory_decisions"]>

export type ListMemoryDecisionsOutput = OperationOutput<ApiOperations["list_memory_decisions"], 200>

export type ListMemoryOwnersInput = OperationInput<ApiOperations["list_memory_owners"]>

export type ListMemoryOwnersOutput = OperationOutput<ApiOperations["list_memory_owners"], 200>

export type ListMemoryReviewsInput = OperationInput<ApiOperations["list_memory_reviews"]>

export type ListMemoryReviewsOutput = OperationOutput<ApiOperations["list_memory_reviews"], 200>

export type ListMemorySavedQuestionsInput = OperationInput<ApiOperations["list_memory_saved_questions"]>

export type ListMemorySavedQuestionsOutput = OperationOutput<ApiOperations["list_memory_saved_questions"], 200>

export type ListMemorySourcesInput = OperationInput<ApiOperations["list_memory_sources"]>

export type ListMemorySourcesOutput = OperationOutput<ApiOperations["list_memory_sources"], 200>

export type ListMemoryWebhookDeliveriesInput = OperationInput<ApiOperations["list_memory_webhook_deliveries"]>

export type ListMemoryWebhookDeliveriesOutput = OperationOutput<ApiOperations["list_memory_webhook_deliveries"], 200>

export type ListMessagesInput = OperationInput<ApiOperations["list_messages"]>

export type ListMessagesOutput = OperationOutput<ApiOperations["list_messages"], 200>

export type ListMetadataKeysInput = OperationInput<ApiOperations["list_metadata_keys"]>

export type ListMetadataKeysOutput = OperationOutput<ApiOperations["list_metadata_keys"], 200>

export type ListMetadataValuesInput = OperationInput<ApiOperations["list_metadata_values"]>

export type ListMetadataValuesOutput = OperationOutput<ApiOperations["list_metadata_values"], 200>

export type ListOperationsInput = OperationInput<ApiOperations["list_operations"]>

export type ListOperationsOutput = OperationOutput<ApiOperations["list_operations"], 200>

export type ListProjectsInput = OperationInput<SessionOperations["list_projects"]>

export type ListProjectsOutput = OperationOutput<SessionOperations["list_projects"], 200>

export type ListQuestionsInput = OperationInput<ApiOperations["list_questions"]>

export type ListQuestionsOutput = OperationOutput<ApiOperations["list_questions"], 200>

export type ListSavedQueriesInput = OperationInput<ApiOperations["list_saved_queries"]>

export type ListSavedQueriesOutput = OperationOutput<ApiOperations["list_saved_queries"], 200>

export type ListSavedQuestionsInput = OperationInput<ApiOperations["list_saved_questions"]>

export type ListSavedQuestionsOutput = OperationOutput<ApiOperations["list_saved_questions"], 200>

export type ListScorecardResultsInput = OperationInput<ApiOperations["list_scorecard_results"]>

export type ListScorecardResultsOutput = OperationOutput<ApiOperations["list_scorecard_results"], 200>

export type ListScorecardsInput = OperationInput<ApiOperations["list_scorecards"]>

export type ListScorecardsOutput = OperationOutput<ApiOperations["list_scorecards"], 200>

export type ListSourceItemsInput = OperationInput<ApiOperations["list_source_items"]>

export type ListSourceItemsOutput = OperationOutput<ApiOperations["list_source_items"], 200>

export type ListSourceSyncsInput = OperationInput<ApiOperations["list_source_syncs"]>

export type ListSourceSyncsOutput = OperationOutput<ApiOperations["list_source_syncs"], 200>

export type ListSourcesInput = OperationInput<ApiOperations["list_sources"]>

export type ListSourcesOutput = OperationOutput<ApiOperations["list_sources"], 200>

export type ListTableRowsInput = OperationInput<ApiOperations["list_table_rows"]>

export type ListTableRowsOutput = OperationOutput<ApiOperations["list_table_rows"], 200>

export type ListVersionBlocksInput = OperationInput<ApiOperations["list_version_blocks"]>

export type ListVersionBlocksOutput = OperationOutput<ApiOperations["list_version_blocks"], 200>

export type PreviewCreateTableInput = OperationInput<ApiOperations["preview_create_table"]>

export type PreviewCreateTableOutput = OperationOutput<ApiOperations["preview_create_table"], 200>

export type PreviewIndexSearchInput = OperationInput<ApiOperations["preview_index_search"]>

export type PreviewIndexSearchOutput = OperationOutput<ApiOperations["preview_index_search"], 200>

export type PreviewTableColumnChangesInput = OperationInput<ApiOperations["preview_table_column_changes"]>

export type PreviewTableColumnChangesOutput = OperationOutput<ApiOperations["preview_table_column_changes"], 200>

export type PromoteCorrectionInput = OperationInput<ApiOperations["promote_correction"]>

export type PromoteCorrectionOutput = OperationOutput<ApiOperations["promote_correction"], 200>

export type PromoteMemoryInput = OperationInput<ApiOperations["promote_memory"]>

export type PromoteMemoryOutput = OperationOutput<ApiOperations["promote_memory"], 200>

export type ProposeCorrectionsInput = OperationInput<ApiOperations["propose_corrections"]>

export type ProposeCorrectionsOutput = OperationOutput<ApiOperations["propose_corrections"], 201>

export type ProposeDatabaseChangeInput = OperationInput<ApiOperations["propose_database_change"]>

export type ProposeDatabaseChangeOutput = OperationOutput<ApiOperations["propose_database_change"], 200>

export type RecallMemoriesInput = OperationInput<ApiOperations["recall_memories"]>

export type RecallMemoriesOutput = OperationOutput<ApiOperations["recall_memories"], 200>

export type RecordAnswerEventsInput = OperationInput<ApiOperations["record_answer_events"]>

export type RecordAnswerEventsOutput = OperationOutput<ApiOperations["record_answer_events"], 200>

export type RecoverMemoryInput = OperationInput<ApiOperations["recover_memory"]>

export type RecoverMemoryOutput = OperationOutput<ApiOperations["recover_memory"], 200>

export type RemoveMemberInput = OperationInput<SessionOperations["remove_member"]>

export type RemoveMemberOutput = OperationOutput<SessionOperations["remove_member"], 200>

export type RemoveMemoryWebhookInput = OperationInput<ApiOperations["remove_memory_webhook"]>

export type RemoveMemoryWebhookOutput = OperationOutput<ApiOperations["remove_memory_webhook"], 200>

export type RestoreDatabaseInput = OperationInput<ApiOperations["restore_database"]>

export type RestoreDatabaseOutput = OperationOutput<ApiOperations["restore_database"], 200>

export type RestoreFileInput = OperationInput<ApiOperations["restore_file"]>

export type RestoreFileOutput = OperationOutput<ApiOperations["restore_file"], 200>

export type RestoreIndexInput = OperationInput<ApiOperations["restore_index"]>

export type RestoreIndexOutput = OperationOutput<ApiOperations["restore_index"], 200>

export type RestoreIndexSnapshotInput = OperationInput<SessionOperations["restore_index_snapshot"]> & { content: FileContent }

export type RestoreIndexSnapshotOutput = OperationOutput<SessionOperations["restore_index_snapshot"], 200>

export type RestoreKnowledgeBaseInput = OperationInput<ApiOperations["restore_knowledge_base"]>

export type RestoreKnowledgeBaseOutput = OperationOutput<ApiOperations["restore_knowledge_base"], 200>

export type RestoreMemoryInput = OperationInput<ApiOperations["restore_memory"]>

export type RestoreMemoryOutput = OperationOutput<ApiOperations["restore_memory"], 200>

export type RestoreProjectInput = OperationInput<SessionOperations["restore_project"]>

export type RestoreProjectOutput = OperationOutput<SessionOperations["restore_project"], 200>

export type ReviewFlaggedQuestionsInput = OperationInput<ApiOperations["review_flagged_questions"]>

export type ReviewFlaggedQuestionsOutput = OperationOutput<ApiOperations["review_flagged_questions"], 200>

export type RevokeApiKeyInput = OperationInput<SessionOperations["revoke_api_key"]>

export type RevokeApiKeyOutput = OperationOutput<SessionOperations["revoke_api_key"], 200>

export type RevokeInvitationInput = OperationInput<SessionOperations["revoke_invitation"]>

export type RevokeInvitationOutput = OperationOutput<SessionOperations["revoke_invitation"], 200>

export type RunDatabaseSqlInput = OperationInput<ApiOperations["run_database_sql"]>

export type RunDatabaseSqlOutput = OperationOutput<ApiOperations["run_database_sql"], 200>

export type SaveIndexRecordInput = OperationInput<ApiOperations["save_index_record"]>

export type SaveIndexRecordOutput = OperationOutput<ApiOperations["save_index_record"], 200>

export type SaveMemoryQuestionInput = OperationInput<ApiOperations["save_memory_question"]>

export type SaveMemoryQuestionOutput = OperationOutput<ApiOperations["save_memory_question"], 201>

export type SaveQueryInput = OperationInput<ApiOperations["save_query"]>

export type SaveQueryOutput = OperationOutput<ApiOperations["save_query"], 200>

export type SaveQuestionInput = OperationInput<ApiOperations["save_question"]>

export type SaveQuestionOutput = OperationOutput<ApiOperations["save_question"], 201>

export type ScoreQuestionSetInput = OperationInput<ApiOperations["score_question_set"]>

export type ScoreQuestionSetOutput = OperationOutput<ApiOperations["score_question_set"], 201>

export type SearchFoldersInput = OperationInput<ApiOperations["search_folders"]>

export type SearchFoldersOutput = OperationOutput<ApiOperations["search_folders"], 200>

export type SearchKnowledgeBaseInput = OperationInput<ApiOperations["search_knowledge_base"]>

export type SearchKnowledgeBaseOutput = OperationOutput<ApiOperations["search_knowledge_base"], 200>

export type SendMemoryFeedbackInput = OperationInput<ApiOperations["send_memory_feedback"]>

export type SendMemoryFeedbackOutput = OperationOutput<ApiOperations["send_memory_feedback"], 201>

export type SetMemoryWebhookInput = OperationInput<ApiOperations["set_memory_webhook"]>

export type SetMemoryWebhookOutput = OperationOutput<ApiOperations["set_memory_webhook"], 201>

export type SettleFlaggedQuestionInput = OperationInput<ApiOperations["settle_flagged_question"]>

export type SettleFlaggedQuestionOutput = OperationOutput<ApiOperations["settle_flagged_question"], 200>

export type SettleMemoryInput = OperationInput<ApiOperations["settle_memory"]>

export type SettleMemoryOutput = OperationOutput<ApiOperations["settle_memory"], 200>

export type SettleMemoryReviewInput = OperationInput<ApiOperations["settle_memory_review"]>

export type SettleMemoryReviewOutput = OperationOutput<ApiOperations["settle_memory_review"], 200>

export type SignInInput = OperationInput<ApiOperations["sign_in"]>

export type SignInOutput = OperationOutput<ApiOperations["sign_in"], 200>

export type SignOutInput = OperationInput<SessionOperations["sign_out"]>

export type SignOutOutput = OperationOutput<SessionOperations["sign_out"], 200>

export type SignUpInput = OperationInput<ApiOperations["sign_up"]>

export type SignUpOutput = OperationOutput<ApiOperations["sign_up"], 201>

export type SignUploadPartsInput = OperationInput<ApiOperations["sign_upload_parts"]>

export type SignUploadPartsOutput = OperationOutput<ApiOperations["sign_upload_parts"], 200>

export type SortMessageInput = OperationInput<ApiOperations["sort_message"]>

export type SortMessageOutput = OperationOutput<ApiOperations["sort_message"], 200>

export type StartMemorySourceSignInInput = OperationInput<ApiOperations["start_memory_source_sign_in"]>

export type StartMemorySourceSignInOutput = OperationOutput<ApiOperations["start_memory_source_sign_in"], 201>

export type StartSourceSignInInput = OperationInput<ApiOperations["start_source_sign_in"]>

export type StartSourceSignInOutput = OperationOutput<ApiOperations["start_source_sign_in"], 201>

export type SuggestIndexTermsInput = OperationInput<ApiOperations["suggest_index_terms"]>

export type SuggestIndexTermsOutput = OperationOutput<ApiOperations["suggest_index_terms"], 200>

export type SyncMemorySourceInput = OperationInput<ApiOperations["sync_memory_source"]>

export type SyncMemorySourceOutput = OperationOutput<ApiOperations["sync_memory_source"], 200>

export type SyncSourceInput = OperationInput<ApiOperations["sync_source"]>

export type SyncSourceOutput = OperationOutput<ApiOperations["sync_source"], 200>

export type TryCorrectionsInput = OperationInput<ApiOperations["try_corrections"]>

export type TryCorrectionsOutput = OperationOutput<ApiOperations["try_corrections"], 201>

export type TuneMemoryInput = OperationInput<ApiOperations["tune_memory"]>

export type TuneMemoryOutput = OperationOutput<ApiOperations["tune_memory"], 200>

export type UndoLearnedChangeInput = OperationInput<ApiOperations["undo_learned_change"]>

export type UndoLearnedChangeOutput = OperationOutput<ApiOperations["undo_learned_change"], 200>

export type UpdateApiKeyInput = OperationInput<SessionOperations["update_api_key"]>

export type UpdateApiKeyOutput = OperationOutput<SessionOperations["update_api_key"], 200>

export type UpdateDatabaseInput = OperationInput<ApiOperations["update_database"]>

export type UpdateDatabaseOutput = OperationOutput<ApiOperations["update_database"], 200>

export type UpdateIndexInput = OperationInput<ApiOperations["update_index"]>

export type UpdateIndexOutput = OperationOutput<ApiOperations["update_index"], 200>

export type UpdateKnowledgeBaseInput = OperationInput<ApiOperations["update_knowledge_base"]>

export type UpdateKnowledgeBaseOutput = OperationOutput<ApiOperations["update_knowledge_base"], 200>

export type UpdateMemoryInput = OperationInput<ApiOperations["update_memory"]>

export type UpdateMemoryOutput = OperationOutput<ApiOperations["update_memory"], 200>

export type UpdateMemorySourceInput = OperationInput<ApiOperations["update_memory_source"]>

export type UpdateMemorySourceOutput = OperationOutput<ApiOperations["update_memory_source"], 200>

export type UpdateSavedQuestionInput = OperationInput<ApiOperations["update_saved_question"]>

export type UpdateSavedQuestionOutput = OperationOutput<ApiOperations["update_saved_question"], 200>

export type UpdateSourceInput = OperationInput<ApiOperations["update_source"]>

export type UpdateSourceOutput = OperationOutput<ApiOperations["update_source"], 200>

export type UpdateTableRowInput = OperationInput<ApiOperations["update_table_row"]>

export type UpdateTableRowOutput = OperationOutput<ApiOperations["update_table_row"], 200>

export type UploadTableImportInput = OperationInput<ApiOperations["upload_table_import"]> & { content: FileContent }

export type UploadTableImportOutput = OperationOutput<ApiOperations["upload_table_import"], 201>

export type VerifySecondFactorInput = OperationInput<ApiOperations["verify_second_factor"]>

export type VerifySecondFactorOutput = OperationOutput<ApiOperations["verify_second_factor"], 200>

export interface HimringOperationInputs {
  accept_invitation: AcceptInvitationInput
  add_database_migration: AddDatabaseMigrationInput
  add_messages: AddMessagesInput
  answer_question: AnswerQuestionInput
  apply_table_import: ApplyTableImportInput
  begin_second_factor_setup: BeginSecondFactorSetupInput
  cancel_upload: CancelUploadInput
  change_table_columns: ChangeTableColumnsInput
  check_table_import: CheckTableImportInput
  compact_database: CompactDatabaseInput
  compare_index_search: CompareIndexSearchInput
  complete_upload: CompleteUploadInput
  confirm_second_factor_setup: ConfirmSecondFactorSetupInput
  create_api_key: CreateApiKeyInput
  create_correction: CreateCorrectionInput
  create_database: CreateDatabaseInput
  create_index: CreateIndexInput
  create_knowledge_base: CreateKnowledgeBaseInput
  create_memory_source: CreateMemorySourceInput
  create_project: CreateProjectInput
  create_source: CreateSourceInput
  create_table: CreateTableInput
  create_upload: CreateUploadInput
  delete_database: DeleteDatabaseInput
  delete_file: DeleteFileInput
  delete_index: DeleteIndexInput
  delete_index_record: DeleteIndexRecordInput
  delete_knowledge_base: DeleteKnowledgeBaseInput
  delete_memory: DeleteMemoryInput
  delete_memory_saved_question: DeleteMemorySavedQuestionInput
  delete_memory_source: DeleteMemorySourceInput
  delete_project: DeleteProjectInput
  delete_saved_query: DeleteSavedQueryInput
  delete_saved_question: DeleteSavedQuestionInput
  delete_source: DeleteSourceInput
  delete_table_rows: DeleteTableRowsInput
  discard_correction: DiscardCorrectionInput
  discard_table_import: DiscardTableImportInput
  dismiss_flagged_question: DismissFlaggedQuestionInput
  download_index: DownloadIndexInput
  enable_memory: EnableMemoryInput
  erase_end_user: EraseEndUserInput
  export_index_records: ExportIndexRecordsInput
  export_memories: ExportMemoriesInput
  export_table_rows: ExportTableRowsInput
  finish_source_sign_in: FinishSourceSignInInput
  forget_memory: ForgetMemoryInput
  get_correction: GetCorrectionInput
  get_correction_pass: GetCorrectionPassInput
  get_database: GetDatabaseInput
  get_download_link: GetDownloadLinkInput
  get_file: GetFileInput
  get_flagged_question: GetFlaggedQuestionInput
  get_index: GetIndexInput
  get_index_record: GetIndexRecordInput
  get_index_stats: GetIndexStatsInput
  get_knowledge_base: GetKnowledgeBaseInput
  get_memory: GetMemoryInput
  get_memory_context: GetMemoryContextInput
  get_memory_scores: GetMemoryScoresInput
  get_memory_source: GetMemorySourceInput
  get_memory_webhook: GetMemoryWebhookInput
  get_message: GetMessageInput
  get_project: GetProjectInput
  get_question_set: GetQuestionSetInput
  get_saved_question: GetSavedQuestionInput
  get_scorecard: GetScorecardInput
  get_session: GetSessionInput
  get_source: GetSourceInput
  get_table_row: GetTableRowInput
  get_upload: GetUploadInput
  import_answer_log: ImportAnswerLogInput
  import_index_records: ImportIndexRecordsInput
  import_saved_questions: ImportSavedQuestionsInput
  ingest_items: IngestItemsInput
  insert_table_row: InsertTableRowInput
  inspect_memory: InspectMemoryInput
  invite_member: InviteMemberInput
  list_api_key_permission_changes: ListApiKeyPermissionChangesInput
  list_api_keys: ListApiKeysInput
  list_correction_passes: ListCorrectionPassesInput
  list_corrections: ListCorrectionsInput
  list_database_migrations: ListDatabaseMigrationsInput
  list_database_tables: ListDatabaseTablesInput
  list_databases: ListDatabasesInput
  list_file_versions: ListFileVersionsInput
  list_files: ListFilesInput
  list_flagged_questions: ListFlaggedQuestionsInput
  list_folder: ListFolderInput
  list_forgetting_suggestions: ListForgettingSuggestionsInput
  list_index_records: ListIndexRecordsInput
  list_indexes: ListIndexesInput
  list_invitations: ListInvitationsInput
  list_knowledge_bases: ListKnowledgeBasesInput
  list_learned_changes: ListLearnedChangesInput
  list_members: ListMembersInput
  list_memories: ListMemoriesInput
  list_memory_decisions: ListMemoryDecisionsInput
  list_memory_owners: ListMemoryOwnersInput
  list_memory_reviews: ListMemoryReviewsInput
  list_memory_saved_questions: ListMemorySavedQuestionsInput
  list_memory_sources: ListMemorySourcesInput
  list_memory_webhook_deliveries: ListMemoryWebhookDeliveriesInput
  list_messages: ListMessagesInput
  list_metadata_keys: ListMetadataKeysInput
  list_metadata_values: ListMetadataValuesInput
  list_operations: ListOperationsInput
  list_projects: ListProjectsInput
  list_questions: ListQuestionsInput
  list_saved_queries: ListSavedQueriesInput
  list_saved_questions: ListSavedQuestionsInput
  list_scorecard_results: ListScorecardResultsInput
  list_scorecards: ListScorecardsInput
  list_source_items: ListSourceItemsInput
  list_source_syncs: ListSourceSyncsInput
  list_sources: ListSourcesInput
  list_table_rows: ListTableRowsInput
  list_version_blocks: ListVersionBlocksInput
  preview_create_table: PreviewCreateTableInput
  preview_index_search: PreviewIndexSearchInput
  preview_table_column_changes: PreviewTableColumnChangesInput
  promote_correction: PromoteCorrectionInput
  promote_memory: PromoteMemoryInput
  propose_corrections: ProposeCorrectionsInput
  propose_database_change: ProposeDatabaseChangeInput
  recall_memories: RecallMemoriesInput
  record_answer_events: RecordAnswerEventsInput
  recover_memory: RecoverMemoryInput
  remove_member: RemoveMemberInput
  remove_memory_webhook: RemoveMemoryWebhookInput
  restore_database: RestoreDatabaseInput
  restore_file: RestoreFileInput
  restore_index: RestoreIndexInput
  restore_index_snapshot: RestoreIndexSnapshotInput
  restore_knowledge_base: RestoreKnowledgeBaseInput
  restore_memory: RestoreMemoryInput
  restore_project: RestoreProjectInput
  review_flagged_questions: ReviewFlaggedQuestionsInput
  revoke_api_key: RevokeApiKeyInput
  revoke_invitation: RevokeInvitationInput
  run_database_sql: RunDatabaseSqlInput
  save_index_record: SaveIndexRecordInput
  save_memory_question: SaveMemoryQuestionInput
  save_query: SaveQueryInput
  save_question: SaveQuestionInput
  score_question_set: ScoreQuestionSetInput
  search_folders: SearchFoldersInput
  search_knowledge_base: SearchKnowledgeBaseInput
  send_memory_feedback: SendMemoryFeedbackInput
  set_memory_webhook: SetMemoryWebhookInput
  settle_flagged_question: SettleFlaggedQuestionInput
  settle_memory: SettleMemoryInput
  settle_memory_review: SettleMemoryReviewInput
  sign_in: SignInInput
  sign_out: SignOutInput
  sign_up: SignUpInput
  sign_upload_parts: SignUploadPartsInput
  sort_message: SortMessageInput
  start_memory_source_sign_in: StartMemorySourceSignInInput
  start_source_sign_in: StartSourceSignInInput
  suggest_index_terms: SuggestIndexTermsInput
  sync_memory_source: SyncMemorySourceInput
  sync_source: SyncSourceInput
  try_corrections: TryCorrectionsInput
  tune_memory: TuneMemoryInput
  undo_learned_change: UndoLearnedChangeInput
  update_api_key: UpdateApiKeyInput
  update_database: UpdateDatabaseInput
  update_index: UpdateIndexInput
  update_knowledge_base: UpdateKnowledgeBaseInput
  update_memory: UpdateMemoryInput
  update_memory_source: UpdateMemorySourceInput
  update_saved_question: UpdateSavedQuestionInput
  update_source: UpdateSourceInput
  update_table_row: UpdateTableRowInput
  upload_table_import: UploadTableImportInput
  verify_second_factor: VerifySecondFactorInput
}

export interface HimringOperationOutputs {
  accept_invitation: AcceptInvitationOutput
  add_database_migration: AddDatabaseMigrationOutput
  add_messages: AddMessagesOutput
  answer_question: AnswerQuestionOutput
  apply_table_import: ApplyTableImportOutput
  begin_second_factor_setup: BeginSecondFactorSetupOutput
  cancel_upload: CancelUploadOutput
  change_table_columns: ChangeTableColumnsOutput
  check_table_import: CheckTableImportOutput
  compact_database: CompactDatabaseOutput
  compare_index_search: CompareIndexSearchOutput
  complete_upload: CompleteUploadOutput
  confirm_second_factor_setup: ConfirmSecondFactorSetupOutput
  create_api_key: CreateApiKeyOutput
  create_correction: CreateCorrectionOutput
  create_database: CreateDatabaseOutput
  create_index: CreateIndexOutput
  create_knowledge_base: CreateKnowledgeBaseOutput
  create_memory_source: CreateMemorySourceOutput
  create_project: CreateProjectOutput
  create_source: CreateSourceOutput
  create_table: CreateTableOutput
  create_upload: CreateUploadOutput
  delete_database: DeleteDatabaseOutput
  delete_file: DeleteFileOutput
  delete_index: DeleteIndexOutput
  delete_index_record: DeleteIndexRecordOutput
  delete_knowledge_base: DeleteKnowledgeBaseOutput
  delete_memory: DeleteMemoryOutput
  delete_memory_saved_question: DeleteMemorySavedQuestionOutput
  delete_memory_source: DeleteMemorySourceOutput
  delete_project: DeleteProjectOutput
  delete_saved_query: DeleteSavedQueryOutput
  delete_saved_question: DeleteSavedQuestionOutput
  delete_source: DeleteSourceOutput
  delete_table_rows: DeleteTableRowsOutput
  discard_correction: DiscardCorrectionOutput
  discard_table_import: DiscardTableImportOutput
  dismiss_flagged_question: DismissFlaggedQuestionOutput
  download_index: DownloadIndexOutput
  enable_memory: EnableMemoryOutput
  erase_end_user: EraseEndUserOutput
  export_index_records: ExportIndexRecordsOutput
  export_memories: ExportMemoriesOutput
  export_table_rows: ExportTableRowsOutput
  finish_source_sign_in: FinishSourceSignInOutput
  forget_memory: ForgetMemoryOutput
  get_correction: GetCorrectionOutput
  get_correction_pass: GetCorrectionPassOutput
  get_database: GetDatabaseOutput
  get_download_link: GetDownloadLinkOutput
  get_file: GetFileOutput
  get_flagged_question: GetFlaggedQuestionOutput
  get_index: GetIndexOutput
  get_index_record: GetIndexRecordOutput
  get_index_stats: GetIndexStatsOutput
  get_knowledge_base: GetKnowledgeBaseOutput
  get_memory: GetMemoryOutput
  get_memory_context: GetMemoryContextOutput
  get_memory_scores: GetMemoryScoresOutput
  get_memory_source: GetMemorySourceOutput
  get_memory_webhook: GetMemoryWebhookOutput
  get_message: GetMessageOutput
  get_project: GetProjectOutput
  get_question_set: GetQuestionSetOutput
  get_saved_question: GetSavedQuestionOutput
  get_scorecard: GetScorecardOutput
  get_session: GetSessionOutput
  get_source: GetSourceOutput
  get_table_row: GetTableRowOutput
  get_upload: GetUploadOutput
  import_answer_log: ImportAnswerLogOutput
  import_index_records: ImportIndexRecordsOutput
  import_saved_questions: ImportSavedQuestionsOutput
  ingest_items: IngestItemsOutput
  insert_table_row: InsertTableRowOutput
  inspect_memory: InspectMemoryOutput
  invite_member: InviteMemberOutput
  list_api_key_permission_changes: ListApiKeyPermissionChangesOutput
  list_api_keys: ListApiKeysOutput
  list_correction_passes: ListCorrectionPassesOutput
  list_corrections: ListCorrectionsOutput
  list_database_migrations: ListDatabaseMigrationsOutput
  list_database_tables: ListDatabaseTablesOutput
  list_databases: ListDatabasesOutput
  list_file_versions: ListFileVersionsOutput
  list_files: ListFilesOutput
  list_flagged_questions: ListFlaggedQuestionsOutput
  list_folder: ListFolderOutput
  list_forgetting_suggestions: ListForgettingSuggestionsOutput
  list_index_records: ListIndexRecordsOutput
  list_indexes: ListIndexesOutput
  list_invitations: ListInvitationsOutput
  list_knowledge_bases: ListKnowledgeBasesOutput
  list_learned_changes: ListLearnedChangesOutput
  list_members: ListMembersOutput
  list_memories: ListMemoriesOutput
  list_memory_decisions: ListMemoryDecisionsOutput
  list_memory_owners: ListMemoryOwnersOutput
  list_memory_reviews: ListMemoryReviewsOutput
  list_memory_saved_questions: ListMemorySavedQuestionsOutput
  list_memory_sources: ListMemorySourcesOutput
  list_memory_webhook_deliveries: ListMemoryWebhookDeliveriesOutput
  list_messages: ListMessagesOutput
  list_metadata_keys: ListMetadataKeysOutput
  list_metadata_values: ListMetadataValuesOutput
  list_operations: ListOperationsOutput
  list_projects: ListProjectsOutput
  list_questions: ListQuestionsOutput
  list_saved_queries: ListSavedQueriesOutput
  list_saved_questions: ListSavedQuestionsOutput
  list_scorecard_results: ListScorecardResultsOutput
  list_scorecards: ListScorecardsOutput
  list_source_items: ListSourceItemsOutput
  list_source_syncs: ListSourceSyncsOutput
  list_sources: ListSourcesOutput
  list_table_rows: ListTableRowsOutput
  list_version_blocks: ListVersionBlocksOutput
  preview_create_table: PreviewCreateTableOutput
  preview_index_search: PreviewIndexSearchOutput
  preview_table_column_changes: PreviewTableColumnChangesOutput
  promote_correction: PromoteCorrectionOutput
  promote_memory: PromoteMemoryOutput
  propose_corrections: ProposeCorrectionsOutput
  propose_database_change: ProposeDatabaseChangeOutput
  recall_memories: RecallMemoriesOutput
  record_answer_events: RecordAnswerEventsOutput
  recover_memory: RecoverMemoryOutput
  remove_member: RemoveMemberOutput
  remove_memory_webhook: RemoveMemoryWebhookOutput
  restore_database: RestoreDatabaseOutput
  restore_file: RestoreFileOutput
  restore_index: RestoreIndexOutput
  restore_index_snapshot: RestoreIndexSnapshotOutput
  restore_knowledge_base: RestoreKnowledgeBaseOutput
  restore_memory: RestoreMemoryOutput
  restore_project: RestoreProjectOutput
  review_flagged_questions: ReviewFlaggedQuestionsOutput
  revoke_api_key: RevokeApiKeyOutput
  revoke_invitation: RevokeInvitationOutput
  run_database_sql: RunDatabaseSqlOutput
  save_index_record: SaveIndexRecordOutput
  save_memory_question: SaveMemoryQuestionOutput
  save_query: SaveQueryOutput
  save_question: SaveQuestionOutput
  score_question_set: ScoreQuestionSetOutput
  search_folders: SearchFoldersOutput
  search_knowledge_base: SearchKnowledgeBaseOutput
  send_memory_feedback: SendMemoryFeedbackOutput
  set_memory_webhook: SetMemoryWebhookOutput
  settle_flagged_question: SettleFlaggedQuestionOutput
  settle_memory: SettleMemoryOutput
  settle_memory_review: SettleMemoryReviewOutput
  sign_in: SignInOutput
  sign_out: SignOutOutput
  sign_up: SignUpOutput
  sign_upload_parts: SignUploadPartsOutput
  sort_message: SortMessageOutput
  start_memory_source_sign_in: StartMemorySourceSignInOutput
  start_source_sign_in: StartSourceSignInOutput
  suggest_index_terms: SuggestIndexTermsOutput
  sync_memory_source: SyncMemorySourceOutput
  sync_source: SyncSourceOutput
  try_corrections: TryCorrectionsOutput
  tune_memory: TuneMemoryOutput
  undo_learned_change: UndoLearnedChangeOutput
  update_api_key: UpdateApiKeyOutput
  update_database: UpdateDatabaseOutput
  update_index: UpdateIndexOutput
  update_knowledge_base: UpdateKnowledgeBaseOutput
  update_memory: UpdateMemoryOutput
  update_memory_source: UpdateMemorySourceOutput
  update_saved_question: UpdateSavedQuestionOutput
  update_source: UpdateSourceOutput
  update_table_row: UpdateTableRowOutput
  upload_table_import: UploadTableImportOutput
  verify_second_factor: VerifySecondFactorOutput
}
