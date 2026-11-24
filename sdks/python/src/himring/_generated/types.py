from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Literal, TypeAlias, TypedDict

from himring._file_content import FileContent

__all__ = [
    "AcceptInvitationInput",
    "AcceptInvitationOutput",
    "AddDatabaseMigrationInput",
    "AddDatabaseMigrationOutput",
    "AddMessagesInput",
    "AddMessagesInputItemsItemConversation",
    "AddMessagesInputItemsItemConversationTurnsItem",
    "AddMessagesInputItemsItemDeletion",
    "AddMessagesInputItemsItemMessage",
    "AddMessagesInputItemsItemRecord",
    "AddMessagesOutput",
    "AddMessagesOutputResultsItem",
    "AnswerQuestionInput",
    "AnswerQuestionOutput",
    "AnswerQuestionOutputAnswer",
    "AnswerQuestionOutputAnswerStatementsItem",
    "AnswerQuestionOutputPassagesItem",
    "AnswerQuestionOutputPassagesItemCitationDocument",
    "AnswerQuestionOutputPassagesItemCitationDocumentAreasItem",
    "AnswerQuestionOutputPassagesItemCitationDocumentPageSizesItem",
    "AnswerQuestionOutputPassagesItemCitationImage",
    "AnswerQuestionOutputPassagesItemCitationImageAreasItem",
    "AnswerQuestionOutputPassagesItemCitationImagePageSizesItem",
    "AnswerQuestionOutputPassagesItemCitationRecording",
    "AnswerQuestionOutputPassagesItemCitationSlides",
    "AnswerQuestionOutputPassagesItemCitationSpreadsheet",
    "AnswerQuestionOutputPassagesItemCitationWebPage",
    "AnswerQuestionOutputPassagesItemMatch",
    "AnswerQuestionOutputPassagesItemMatchCitationDocument",
    "AnswerQuestionOutputPassagesItemMatchCitationDocumentAreasItem",
    "AnswerQuestionOutputPassagesItemMatchCitationDocumentPageSizesItem",
    "AnswerQuestionOutputPassagesItemMatchCitationImage",
    "AnswerQuestionOutputPassagesItemMatchCitationImageAreasItem",
    "AnswerQuestionOutputPassagesItemMatchCitationImagePageSizesItem",
    "AnswerQuestionOutputPassagesItemMatchCitationRecording",
    "AnswerQuestionOutputPassagesItemMatchCitationSlides",
    "AnswerQuestionOutputPassagesItemMatchCitationSpreadsheet",
    "AnswerQuestionOutputPassagesItemMatchCitationWebPage",
    "AnswerQuestionOutputPassagesItemMatchRange",
    "AnswerQuestionOutputPassagesItemMatchTermsItem",
    "ApplyTableImportInput",
    "ApplyTableImportInputColumnsItem",
    "ApplyTableImportInputNewTableColumnsItem",
    "ApplyTableImportInputNewTableColumnsItemDefaultCurrentDate",
    "ApplyTableImportInputNewTableColumnsItemDefaultCurrentTime",
    "ApplyTableImportInputNewTableColumnsItemDefaultCurrentTimestamp",
    "ApplyTableImportInputNewTableColumnsItemDefaultValue",
    "ApplyTableImportInputNewTableColumnsItemReferences",
    "ApplyTableImportOutput",
    "ApplyTableImportOutputImported",
    "ApplyTableImportOutputImportedMigration",
    "BeginSecondFactorSetupInput",
    "BeginSecondFactorSetupOutput",
    "CancelUploadInput",
    "CancelUploadOutput",
    "CancelUploadOutputFailure",
    "CancelUploadOutputFile",
    "CancelUploadOutputFileFailure",
    "CancelUploadOutputFileUnreadPartsItem",
    "CancelUploadOutputFileUnreadPartsItemFailure",
    "ChangeTableColumnsInput",
    "ChangeTableColumnsInputChangesItemAdd",
    "ChangeTableColumnsInputChangesItemAddDefaultCurrentDate",
    "ChangeTableColumnsInputChangesItemAddDefaultCurrentTime",
    "ChangeTableColumnsInputChangesItemAddDefaultCurrentTimestamp",
    "ChangeTableColumnsInputChangesItemAddDefaultValue",
    "ChangeTableColumnsInputChangesItemAddPositionAfter",
    "ChangeTableColumnsInputChangesItemAddPositionBefore",
    "ChangeTableColumnsInputChangesItemAlter",
    "ChangeTableColumnsInputChangesItemAlterDefaultCurrentDate",
    "ChangeTableColumnsInputChangesItemAlterDefaultCurrentTime",
    "ChangeTableColumnsInputChangesItemAlterDefaultCurrentTimestamp",
    "ChangeTableColumnsInputChangesItemAlterDefaultValue",
    "ChangeTableColumnsInputChangesItemDrop",
    "ChangeTableColumnsInputChangesItemRename",
    "ChangeTableColumnsOutput",
    "ChangeTableColumnsOutputMigration",
    "ChangeTableColumnsOutputPreview",
    "ChangeTableColumnsOutputPreviewRowChecksItem",
    "CheckTableImportInput",
    "CheckTableImportInputColumnsItem",
    "CheckTableImportInputNewTableColumnsItem",
    "CheckTableImportInputNewTableColumnsItemDefaultCurrentDate",
    "CheckTableImportInputNewTableColumnsItemDefaultCurrentTime",
    "CheckTableImportInputNewTableColumnsItemDefaultCurrentTimestamp",
    "CheckTableImportInputNewTableColumnsItemDefaultValue",
    "CheckTableImportInputNewTableColumnsItemReferences",
    "CheckTableImportOutput",
    "CheckTableImportOutputCheck",
    "CheckTableImportOutputCheckFailuresItem",
    "CompactDatabaseInput",
    "CompactDatabaseOutput",
    "CompactDatabaseOutputCompaction",
    "CompactDatabaseOutputCreatedBy",
    "CompactDatabaseOutputSize",
    "CompareIndexSearchInput",
    "CompareIndexSearchInputBm25",
    "CompareIndexSearchOutput",
    "CompareIndexSearchOutputSaved",
    "CompareIndexSearchOutputSavedBm25",
    "CompareIndexSearchOutputSavedPreview",
    "CompareIndexSearchOutputSavedPreviewFacetsItem",
    "CompareIndexSearchOutputSavedPreviewFacetsItemValuesItem",
    "CompareIndexSearchOutputSavedPreviewGroupsItem",
    "CompareIndexSearchOutputSavedPreviewResultsItem",
    "CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItem",
    "CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItemMarksItem",
    "CompareIndexSearchOutputSavedPreviewResultsItemKeyword",
    "CompareIndexSearchOutputSavedPreviewResultsItemKeywordFieldScoresItem",
    "CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItem",
    "CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItemFieldsItem",
    "CompareIndexSearchOutputSavedPreviewResultsItemVector",
    "CompareIndexSearchOutputSavedPreviewSort",
    "CompareIndexSearchOutputSavedPreviewTuning",
    "CompareIndexSearchOutputTuned",
    "CompareIndexSearchOutputTunedBm25",
    "CompareIndexSearchOutputTunedPreview",
    "CompareIndexSearchOutputTunedPreviewFacetsItem",
    "CompareIndexSearchOutputTunedPreviewFacetsItemValuesItem",
    "CompareIndexSearchOutputTunedPreviewGroupsItem",
    "CompareIndexSearchOutputTunedPreviewResultsItem",
    "CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItem",
    "CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItemMarksItem",
    "CompareIndexSearchOutputTunedPreviewResultsItemKeyword",
    "CompareIndexSearchOutputTunedPreviewResultsItemKeywordFieldScoresItem",
    "CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItem",
    "CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItemFieldsItem",
    "CompareIndexSearchOutputTunedPreviewResultsItemVector",
    "CompareIndexSearchOutputTunedPreviewSort",
    "CompareIndexSearchOutputTunedPreviewTuning",
    "CompleteUploadInput",
    "CompleteUploadOutput",
    "CompleteUploadOutputFailure",
    "CompleteUploadOutputFile",
    "CompleteUploadOutputFileFailure",
    "CompleteUploadOutputFileUnreadPartsItem",
    "CompleteUploadOutputFileUnreadPartsItemFailure",
    "ConfirmSecondFactorSetupInput",
    "ConfirmSecondFactorSetupOutput",
    "ConfirmSecondFactorSetupOutputSession",
    "ConfirmSecondFactorSetupOutputSessionAccount",
    "CreateApiKeyInput",
    "CreateApiKeyInputPermissionsFull",
    "CreateApiKeyInputPermissionsRestricted",
    "CreateApiKeyInputPermissionsRestrictedDatabases",
    "CreateApiKeyInputPermissionsRestrictedIndexes",
    "CreateApiKeyInputPermissionsRestrictedKnowledgeBases",
    "CreateApiKeyInputPermissionsRestrictedMemory",
    "CreateApiKeyOutput",
    "CreateApiKeyOutputApiKey",
    "CreateApiKeyOutputApiKeyPermissions",
    "CreateApiKeyOutputApiKeyPermissionsDatabases",
    "CreateApiKeyOutputApiKeyPermissionsIndexes",
    "CreateApiKeyOutputApiKeyPermissionsKnowledgeBases",
    "CreateApiKeyOutputApiKeyPermissionsMemory",
    "CreateCorrectionInput",
    "CreateCorrectionInputSettingAgentDepth",
    "CreateCorrectionInputSettingBm25",
    "CreateCorrectionInputSettingChunking",
    "CreateCorrectionInputSettingFieldBoost",
    "CreateCorrectionInputSettingLanguage",
    "CreateCorrectionInputSettingOption1",
    "CreateCorrectionInputSettingOption2",
    "CreateCorrectionInputSettingRebuild",
    "CreateCorrectionInputSettingStopWords",
    "CreateCorrectionInputSettingSynonyms",
    "CreateCorrectionInputSettingSynonymsRulesItemOption1",
    "CreateCorrectionInputSettingSynonymsRulesItemOption2",
    "CreateCorrectionOutput",
    "CreateCorrectionOutputAfter",
    "CreateCorrectionOutputAfterHeldBack",
    "CreateCorrectionOutputAfterTuning",
    "CreateCorrectionOutputBefore",
    "CreateCorrectionOutputBeforeHeldBack",
    "CreateCorrectionOutputBeforeTuning",
    "CreateCorrectionOutputEstimate",
    "CreateCorrectionOutputQuestionChanges",
    "CreateCorrectionOutputSettingAgentDepth",
    "CreateCorrectionOutputSettingBm25",
    "CreateCorrectionOutputSettingChunking",
    "CreateCorrectionOutputSettingFieldBoost",
    "CreateCorrectionOutputSettingLanguage",
    "CreateCorrectionOutputSettingOption1",
    "CreateCorrectionOutputSettingOption2",
    "CreateCorrectionOutputSettingRebuild",
    "CreateCorrectionOutputSettingStopWords",
    "CreateCorrectionOutputSettingSynonyms",
    "CreateCorrectionOutputSettingSynonymsRulesItemOption1",
    "CreateCorrectionOutputSettingSynonymsRulesItemOption2",
    "CreateDatabaseInput",
    "CreateDatabaseInputMigrationsItem",
    "CreateDatabaseOutput",
    "CreateDatabaseOutputCompaction",
    "CreateDatabaseOutputCreatedBy",
    "CreateDatabaseOutputSize",
    "CreateIndexInput",
    "CreateIndexInputConfig",
    "CreateIndexInputConfigBm25",
    "CreateIndexInputConfigEmbedding",
    "CreateIndexInputConfigSynonymsItemOption1",
    "CreateIndexInputConfigSynonymsItemOption2",
    "CreateIndexOutput",
    "CreateIndexOutputCreatedBy",
    "CreateKnowledgeBaseInput",
    "CreateKnowledgeBaseOutput",
    "CreateKnowledgeBaseOutputCreatedBy",
    "CreateMemorySourceInput",
    "CreateMemorySourceOutput",
    "CreateMemorySourceOutputCreatedBy",
    "CreateMemorySourceOutputLastError",
    "CreateMemorySourceOutputSignIn",
    "CreateProjectInput",
    "CreateProjectOutput",
    "CreateSourceInput",
    "CreateSourceOutput",
    "CreateSourceOutputCreatedBy",
    "CreateSourceOutputLastError",
    "CreateSourceOutputSignIn",
    "CreateTableInput",
    "CreateTableInputColumnsItem",
    "CreateTableInputColumnsItemDefaultCurrentDate",
    "CreateTableInputColumnsItemDefaultCurrentTime",
    "CreateTableInputColumnsItemDefaultCurrentTimestamp",
    "CreateTableInputColumnsItemDefaultValue",
    "CreateTableInputColumnsItemReferences",
    "CreateTableOutput",
    "CreateTableOutputMigration",
    "CreateTableOutputPreview",
    "CreateUploadInput",
    "CreateUploadOutput",
    "CreateUploadOutputPartsItem",
    "CreateUploadOutputUpload",
    "CreateUploadOutputUploadFailure",
    "CreateUploadOutputUploadFile",
    "CreateUploadOutputUploadFileFailure",
    "CreateUploadOutputUploadFileUnreadPartsItem",
    "CreateUploadOutputUploadFileUnreadPartsItemFailure",
    "DeleteDatabaseInput",
    "DeleteDatabaseOutput",
    "DeleteDatabaseOutputCompaction",
    "DeleteDatabaseOutputCreatedBy",
    "DeleteDatabaseOutputSize",
    "DeleteFileInput",
    "DeleteFileOutput",
    "DeleteFileOutputFailure",
    "DeleteFileOutputUnreadPartsItem",
    "DeleteFileOutputUnreadPartsItemFailure",
    "DeleteIndexInput",
    "DeleteIndexOutput",
    "DeleteIndexOutputCreatedBy",
    "DeleteIndexRecordInput",
    "DeleteIndexRecordOutput",
    "DeleteKnowledgeBaseInput",
    "DeleteKnowledgeBaseOutput",
    "DeleteKnowledgeBaseOutputCreatedBy",
    "DeleteMemoryInput",
    "DeleteMemoryOutput",
    "DeleteMemoryOutputCheckedKnowledgeBases",
    "DeleteMemoryOutputCheckedKnowledgeBasesLeftOutItem",
    "DeleteMemoryOutputCreatedBy",
    "DeleteMemoryOutputSettings",
    "DeleteMemoryOutputSettingsAgentPermissions",
    "DeleteMemoryOutputSettingsCueWeights",
    "DeleteMemoryOutputSettingsCueWeightsAuthorKind",
    "DeleteMemoryOutputSettingsCueWeightsStatementKind",
    "DeleteMemoryOutputSettingsSubjectsItem",
    "DeleteMemorySavedQuestionInput",
    "DeleteMemorySavedQuestionOutput",
    "DeleteMemorySourceInput",
    "DeleteMemorySourceOutput",
    "DeleteMemorySourceOutputCreatedBy",
    "DeleteMemorySourceOutputLastError",
    "DeleteMemorySourceOutputSignIn",
    "DeleteProjectInput",
    "DeleteProjectOutput",
    "DeleteSavedQueryInput",
    "DeleteSavedQueryOutput",
    "DeleteSavedQuestionInput",
    "DeleteSavedQuestionOutput",
    "DeleteSavedQuestionOutputBroken",
    "DeleteSavedQuestionOutputBrokenPrevious",
    "DeleteSavedQuestionOutputPassage",
    "DeleteSavedQuestionOutputPassageCitationDocument",
    "DeleteSavedQuestionOutputPassageCitationDocumentAreasItem",
    "DeleteSavedQuestionOutputPassageCitationDocumentPageSizesItem",
    "DeleteSavedQuestionOutputPassageCitationImage",
    "DeleteSavedQuestionOutputPassageCitationImageAreasItem",
    "DeleteSavedQuestionOutputPassageCitationImagePageSizesItem",
    "DeleteSavedQuestionOutputPassageCitationRecording",
    "DeleteSavedQuestionOutputPassageCitationSlides",
    "DeleteSavedQuestionOutputPassageCitationSpreadsheet",
    "DeleteSavedQuestionOutputPassageCitationWebPage",
    "DeleteSourceInput",
    "DeleteSourceOutput",
    "DeleteSourceOutputCreatedBy",
    "DeleteSourceOutputLastError",
    "DeleteSourceOutputSignIn",
    "DeleteTableRowsInput",
    "DeleteTableRowsInputKeysItemItemBlob",
    "DeleteTableRowsInputKeysItemItemInteger",
    "DeleteTableRowsOutput",
    "DiscardCorrectionInput",
    "DiscardCorrectionOutput",
    "DiscardCorrectionOutputAfter",
    "DiscardCorrectionOutputAfterHeldBack",
    "DiscardCorrectionOutputAfterTuning",
    "DiscardCorrectionOutputBefore",
    "DiscardCorrectionOutputBeforeHeldBack",
    "DiscardCorrectionOutputBeforeTuning",
    "DiscardCorrectionOutputEstimate",
    "DiscardCorrectionOutputQuestionChanges",
    "DiscardCorrectionOutputSettingAgentDepth",
    "DiscardCorrectionOutputSettingBm25",
    "DiscardCorrectionOutputSettingChunking",
    "DiscardCorrectionOutputSettingFieldBoost",
    "DiscardCorrectionOutputSettingLanguage",
    "DiscardCorrectionOutputSettingOption1",
    "DiscardCorrectionOutputSettingOption2",
    "DiscardCorrectionOutputSettingRebuild",
    "DiscardCorrectionOutputSettingStopWords",
    "DiscardCorrectionOutputSettingSynonyms",
    "DiscardCorrectionOutputSettingSynonymsRulesItemOption1",
    "DiscardCorrectionOutputSettingSynonymsRulesItemOption2",
    "DiscardTableImportInput",
    "DiscardTableImportOutput",
    "DismissFlaggedQuestionInput",
    "DismissFlaggedQuestionOutput",
    "DownloadIndexInput",
    "EnableMemoryInput",
    "EnableMemoryInputAgentPermissions",
    "EnableMemoryInputCueWeights",
    "EnableMemoryInputCueWeightsAuthorKind",
    "EnableMemoryInputCueWeightsStatementKind",
    "EnableMemoryInputSubjectsItem",
    "EnableMemoryOutput",
    "EnableMemoryOutputCheckedKnowledgeBases",
    "EnableMemoryOutputCheckedKnowledgeBasesLeftOutItem",
    "EnableMemoryOutputCreatedBy",
    "EnableMemoryOutputSettings",
    "EnableMemoryOutputSettingsAgentPermissions",
    "EnableMemoryOutputSettingsCueWeights",
    "EnableMemoryOutputSettingsCueWeightsAuthorKind",
    "EnableMemoryOutputSettingsCueWeightsStatementKind",
    "EnableMemoryOutputSettingsSubjectsItem",
    "EraseEndUserInput",
    "EraseEndUserOutput",
    "ExportIndexRecordsInput",
    "ExportMemoriesInput",
    "ExportTableRowsInput",
    "ExportTableRowsInputFiltersItem",
    "ExportTableRowsInputFiltersItemValueBlob",
    "ExportTableRowsInputFiltersItemValueInteger",
    "ExportTableRowsInputFiltersItemValueItemBlob",
    "ExportTableRowsInputFiltersItemValueItemInteger",
    "ExportTableRowsInputSortsItem",
    "FinishSourceSignInInput",
    "FinishSourceSignInOutput",
    "FinishSourceSignInOutputCreatedBy",
    "FinishSourceSignInOutputLastError",
    "FinishSourceSignInOutputSignIn",
    "ForgetMemoryInput",
    "ForgetMemoryOutput",
    "ForgetMemoryOutputPlan",
    "ForgetMemoryOutputSourcesItem",
    "GetCorrectionInput",
    "GetCorrectionOutput",
    "GetCorrectionOutputAfter",
    "GetCorrectionOutputAfterHeldBack",
    "GetCorrectionOutputAfterTuning",
    "GetCorrectionOutputBefore",
    "GetCorrectionOutputBeforeHeldBack",
    "GetCorrectionOutputBeforeTuning",
    "GetCorrectionOutputEstimate",
    "GetCorrectionOutputQuestionChanges",
    "GetCorrectionOutputSettingAgentDepth",
    "GetCorrectionOutputSettingBm25",
    "GetCorrectionOutputSettingChunking",
    "GetCorrectionOutputSettingFieldBoost",
    "GetCorrectionOutputSettingLanguage",
    "GetCorrectionOutputSettingOption1",
    "GetCorrectionOutputSettingOption2",
    "GetCorrectionOutputSettingRebuild",
    "GetCorrectionOutputSettingStopWords",
    "GetCorrectionOutputSettingSynonyms",
    "GetCorrectionOutputSettingSynonymsRulesItemOption1",
    "GetCorrectionOutputSettingSynonymsRulesItemOption2",
    "GetCorrectionPassInput",
    "GetCorrectionPassOutput",
    "GetDatabaseInput",
    "GetDatabaseOutput",
    "GetDatabaseOutputCompaction",
    "GetDatabaseOutputCreatedBy",
    "GetDatabaseOutputSize",
    "GetDownloadLinkInput",
    "GetDownloadLinkOutput",
    "GetFileInput",
    "GetFileOutput",
    "GetFileOutputFailure",
    "GetFileOutputUnreadPartsItem",
    "GetFileOutputUnreadPartsItemFailure",
    "GetFileOutputVersionsItem",
    "GetFileOutputVersionsItemFailure",
    "GetFileOutputVersionsItemUnreadPartsItem",
    "GetFileOutputVersionsItemUnreadPartsItemFailure",
    "GetFlaggedQuestionInput",
    "GetFlaggedQuestionOutput",
    "GetFlaggedQuestionOutputAnswer",
    "GetFlaggedQuestionOutputCandidatesItem",
    "GetFlaggedQuestionOutputCandidatesItemCitationDocument",
    "GetFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem",
    "GetFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem",
    "GetFlaggedQuestionOutputCandidatesItemCitationImage",
    "GetFlaggedQuestionOutputCandidatesItemCitationImageAreasItem",
    "GetFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem",
    "GetFlaggedQuestionOutputCandidatesItemCitationRecording",
    "GetFlaggedQuestionOutputCandidatesItemCitationSlides",
    "GetFlaggedQuestionOutputCandidatesItemCitationSpreadsheet",
    "GetFlaggedQuestionOutputCandidatesItemCitationWebPage",
    "GetFlaggedQuestionOutputReturnedPassagesItem",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationDocument",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationImage",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationRecording",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationSlides",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet",
    "GetFlaggedQuestionOutputReturnedPassagesItemCitationWebPage",
    "GetFlaggedQuestionOutputSignalDetailsItem",
    "GetIndexInput",
    "GetIndexOutput",
    "GetIndexOutputCreatedBy",
    "GetIndexRecordInput",
    "GetIndexRecordOutput",
    "GetIndexStatsInput",
    "GetIndexStatsOutput",
    "GetIndexStatsOutputFieldsItem",
    "GetIndexStatsOutputVectorFieldsItem",
    "GetKnowledgeBaseInput",
    "GetKnowledgeBaseOutput",
    "GetKnowledgeBaseOutputCreatedBy",
    "GetKnowledgeBaseOutputFileProgress",
    "GetMemoryContextInput",
    "GetMemoryContextOutput",
    "GetMemoryContextOutputMemoriesItem",
    "GetMemoryContextOutputMemoriesItemConflictsWithItemFile",
    "GetMemoryContextOutputMemoriesItemConflictsWithItemMemory",
    "GetMemoryContextOutputMemoriesItemConflictsWithItemMemorySourcesItem",
    "GetMemoryContextOutputMemoriesItemConflictsWithItemWaitingMessage",
    "GetMemoryContextOutputMemoriesItemHolds",
    "GetMemoryContextOutputMemoriesItemPlan",
    "GetMemoryContextOutputMemoriesItemReplacedBy",
    "GetMemoryContextOutputMemoriesItemReplacesItem",
    "GetMemoryContextOutputMemoriesItemSourcesItem",
    "GetMemoryInput",
    "GetMemoryOutput",
    "GetMemoryOutputCheckedKnowledgeBases",
    "GetMemoryOutputCheckedKnowledgeBasesLeftOutItem",
    "GetMemoryOutputCreatedBy",
    "GetMemoryOutputProgress",
    "GetMemoryOutputSettings",
    "GetMemoryOutputSettingsAgentPermissions",
    "GetMemoryOutputSettingsCueWeights",
    "GetMemoryOutputSettingsCueWeightsAuthorKind",
    "GetMemoryOutputSettingsCueWeightsStatementKind",
    "GetMemoryOutputSettingsSubjectsItem",
    "GetMemoryScoresInput",
    "GetMemoryScoresOutput",
    "GetMemoryScoresOutputJudgement",
    "GetMemoryScoresOutputLabelledDecisions",
    "GetMemoryScoresOutputRecall",
    "GetMemoryScoresOutputTuning",
    "GetMemorySourceInput",
    "GetMemorySourceOutput",
    "GetMemorySourceOutputCreatedBy",
    "GetMemorySourceOutputLastError",
    "GetMemorySourceOutputSignIn",
    "GetMemoryWebhookInput",
    "GetMemoryWebhookOutput",
    "GetMessageInput",
    "GetMessageOutput",
    "GetMessageOutputMemoriesItem",
    "GetMessageOutputTurnsItem",
    "GetProjectInput",
    "GetProjectOutput",
    "GetQuestionSetInput",
    "GetQuestionSetOutput",
    "GetQuestionSetOutputFlagged",
    "GetQuestionSetOutputLatestPass",
    "GetQuestionSetOutputLatestScorecard",
    "GetQuestionSetOutputLatestScorecardConfiguration",
    "GetQuestionSetOutputLatestScorecardConfigurationSettings",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsBm25",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsBoost",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionLinear",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionRrf",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsStopWords",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption1",
    "GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption2",
    "GetQuestionSetOutputLatestScorecardHeldBack",
    "GetQuestionSetOutputLatestScorecardTuning",
    "GetQuestionSetOutputOpenPass",
    "GetQuestionSetOutputSettings",
    "GetQuestionSetOutputSettingsBm25",
    "GetQuestionSetOutputSettingsBoost",
    "GetQuestionSetOutputSettingsFusionLinear",
    "GetQuestionSetOutputSettingsFusionRrf",
    "GetQuestionSetOutputSettingsStopWords",
    "GetQuestionSetOutputSettingsSynonymsItemOption1",
    "GetQuestionSetOutputSettingsSynonymsItemOption2",
    "GetSavedQuestionInput",
    "GetSavedQuestionOutput",
    "GetSavedQuestionOutputBroken",
    "GetSavedQuestionOutputBrokenPrevious",
    "GetSavedQuestionOutputPassage",
    "GetSavedQuestionOutputPassageCitationDocument",
    "GetSavedQuestionOutputPassageCitationDocumentAreasItem",
    "GetSavedQuestionOutputPassageCitationDocumentPageSizesItem",
    "GetSavedQuestionOutputPassageCitationImage",
    "GetSavedQuestionOutputPassageCitationImageAreasItem",
    "GetSavedQuestionOutputPassageCitationImagePageSizesItem",
    "GetSavedQuestionOutputPassageCitationRecording",
    "GetSavedQuestionOutputPassageCitationSlides",
    "GetSavedQuestionOutputPassageCitationSpreadsheet",
    "GetSavedQuestionOutputPassageCitationWebPage",
    "GetScorecardInput",
    "GetScorecardOutput",
    "GetScorecardOutputConfiguration",
    "GetScorecardOutputConfigurationSettings",
    "GetScorecardOutputConfigurationSettingsBm25",
    "GetScorecardOutputConfigurationSettingsBoost",
    "GetScorecardOutputConfigurationSettingsFusionLinear",
    "GetScorecardOutputConfigurationSettingsFusionRrf",
    "GetScorecardOutputConfigurationSettingsStopWords",
    "GetScorecardOutputConfigurationSettingsSynonymsItemOption1",
    "GetScorecardOutputConfigurationSettingsSynonymsItemOption2",
    "GetScorecardOutputHeldBack",
    "GetScorecardOutputTuning",
    "GetSessionInput",
    "GetSessionOutput",
    "GetSessionOutputAccount",
    "GetSourceInput",
    "GetSourceOutput",
    "GetSourceOutputCreatedBy",
    "GetSourceOutputLastError",
    "GetSourceOutputSignIn",
    "GetTableRowInput",
    "GetTableRowInputKeyItemBlob",
    "GetTableRowInputKeyItemInteger",
    "GetTableRowOutput",
    "GetTableRowOutputRow",
    "GetTableRowOutputRowCellsItem",
    "GetTableRowOutputRowKeyItemBlob",
    "GetTableRowOutputRowKeyItemInteger",
    "GetUploadInput",
    "GetUploadOutput",
    "GetUploadOutputFailure",
    "GetUploadOutputFile",
    "GetUploadOutputFileFailure",
    "GetUploadOutputFileUnreadPartsItem",
    "GetUploadOutputFileUnreadPartsItemFailure",
    "ImportAnswerLogInput",
    "ImportAnswerLogOutput",
    "ImportAnswerLogOutputRefusedItem",
    "ImportIndexRecordsInput",
    "ImportIndexRecordsOutput",
    "ImportIndexRecordsOutputFailuresItem",
    "ImportSavedQuestionsInput",
    "ImportSavedQuestionsOutput",
    "ImportSavedQuestionsOutputRefusedItem",
    "ImportSavedQuestionsOutputSavedQuestionsItem",
    "ImportSavedQuestionsOutputSavedQuestionsItemBroken",
    "ImportSavedQuestionsOutputSavedQuestionsItemBrokenPrevious",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassage",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImage",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet",
    "ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage",
    "IngestItemsInput",
    "IngestItemsInputItemsItemConversation",
    "IngestItemsInputItemsItemConversationTurnsItem",
    "IngestItemsInputItemsItemDeletion",
    "IngestItemsInputItemsItemMessage",
    "IngestItemsInputItemsItemRecord",
    "IngestItemsOutput",
    "IngestItemsOutputResultsItem",
    "InsertTableRowInput",
    "InsertTableRowInputValuesValueBlob",
    "InsertTableRowInputValuesValueInteger",
    "InsertTableRowOutput",
    "InsertTableRowOutputReturnedKeyItemBlob",
    "InsertTableRowOutputReturnedKeyItemInteger",
    "InsertTableRowOutputRow",
    "InsertTableRowOutputRowCellsItem",
    "InsertTableRowOutputRowKeyItemBlob",
    "InsertTableRowOutputRowKeyItemInteger",
    "InspectMemoryInput",
    "InspectMemoryOutput",
    "InspectMemoryOutputDecisionsItem",
    "InspectMemoryOutputDecisionsItemMemory",
    "InspectMemoryOutputLinksItem",
    "InspectMemoryOutputLinksItemMemory",
    "InspectMemoryOutputPlan",
    "InspectMemoryOutputReviewsItem",
    "InspectMemoryOutputSourcesItem",
    "InviteMemberInput",
    "InviteMemberOutput",
    "InviteMemberOutputInvitation",
    "ListApiKeyPermissionChangesInput",
    "ListApiKeyPermissionChangesOutput",
    "ListApiKeyPermissionChangesOutputChangesItem",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsAfter",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterDatabases",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterIndexes",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterKnowledgeBases",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterMemory",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsBefore",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeDatabases",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeIndexes",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeKnowledgeBases",
    "ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeMemory",
    "ListApiKeysInput",
    "ListApiKeysOutput",
    "ListApiKeysOutputApiKeysItem",
    "ListApiKeysOutputApiKeysItemPermissions",
    "ListApiKeysOutputApiKeysItemPermissionsDatabases",
    "ListApiKeysOutputApiKeysItemPermissionsIndexes",
    "ListApiKeysOutputApiKeysItemPermissionsKnowledgeBases",
    "ListApiKeysOutputApiKeysItemPermissionsMemory",
    "ListCorrectionPassesInput",
    "ListCorrectionPassesOutput",
    "ListCorrectionPassesOutputPassesItem",
    "ListCorrectionsInput",
    "ListCorrectionsOutput",
    "ListCorrectionsOutputCorrectionsItem",
    "ListCorrectionsOutputCorrectionsItemAfter",
    "ListCorrectionsOutputCorrectionsItemAfterHeldBack",
    "ListCorrectionsOutputCorrectionsItemAfterTuning",
    "ListCorrectionsOutputCorrectionsItemBefore",
    "ListCorrectionsOutputCorrectionsItemBeforeHeldBack",
    "ListCorrectionsOutputCorrectionsItemBeforeTuning",
    "ListCorrectionsOutputCorrectionsItemEstimate",
    "ListCorrectionsOutputCorrectionsItemQuestionChanges",
    "ListCorrectionsOutputCorrectionsItemSettingAgentDepth",
    "ListCorrectionsOutputCorrectionsItemSettingBm25",
    "ListCorrectionsOutputCorrectionsItemSettingChunking",
    "ListCorrectionsOutputCorrectionsItemSettingFieldBoost",
    "ListCorrectionsOutputCorrectionsItemSettingLanguage",
    "ListCorrectionsOutputCorrectionsItemSettingOption1",
    "ListCorrectionsOutputCorrectionsItemSettingOption2",
    "ListCorrectionsOutputCorrectionsItemSettingRebuild",
    "ListCorrectionsOutputCorrectionsItemSettingStopWords",
    "ListCorrectionsOutputCorrectionsItemSettingSynonyms",
    "ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption1",
    "ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption2",
    "ListDatabaseMigrationsInput",
    "ListDatabaseMigrationsOutput",
    "ListDatabaseMigrationsOutputMigrationsItem",
    "ListDatabaseTablesInput",
    "ListDatabaseTablesOutput",
    "ListDatabaseTablesOutputTablesItem",
    "ListDatabaseTablesOutputTablesItemColumnsItem",
    "ListDatabaseTablesOutputTablesItemForeignKeysItem",
    "ListDatabaseTablesOutputTablesItemIndexesItem",
    "ListDatabasesInput",
    "ListDatabasesOutput",
    "ListDatabasesOutputDatabasesItem",
    "ListDatabasesOutputDatabasesItemCompaction",
    "ListDatabasesOutputDatabasesItemCreatedBy",
    "ListDatabasesOutputDatabasesItemSize",
    "ListFileVersionsInput",
    "ListFileVersionsOutput",
    "ListFileVersionsOutputVersionsItem",
    "ListFileVersionsOutputVersionsItemFailure",
    "ListFileVersionsOutputVersionsItemUnreadPartsItem",
    "ListFileVersionsOutputVersionsItemUnreadPartsItemFailure",
    "ListFilesInput",
    "ListFilesOutput",
    "ListFilesOutputFilesItem",
    "ListFilesOutputFilesItemFailure",
    "ListFilesOutputFilesItemUnreadPartsItem",
    "ListFilesOutputFilesItemUnreadPartsItemFailure",
    "ListFlaggedQuestionsInput",
    "ListFlaggedQuestionsOutput",
    "ListFlaggedQuestionsOutputFlaggedQuestionsItem",
    "ListFolderInput",
    "ListFolderOutput",
    "ListFolderOutputEntriesItemFile",
    "ListFolderOutputEntriesItemFileFile",
    "ListFolderOutputEntriesItemFileFileFailure",
    "ListFolderOutputEntriesItemFileFileUnreadPartsItem",
    "ListFolderOutputEntriesItemFileFileUnreadPartsItemFailure",
    "ListFolderOutputEntriesItemFolder",
    "ListForgettingSuggestionsInput",
    "ListForgettingSuggestionsOutput",
    "ListForgettingSuggestionsOutputMemoriesItem",
    "ListForgettingSuggestionsOutputMemoriesItemPlan",
    "ListForgettingSuggestionsOutputMemoriesItemSourcesItem",
    "ListIndexRecordsInput",
    "ListIndexRecordsOutput",
    "ListIndexRecordsOutputRecordsItem",
    "ListIndexesInput",
    "ListIndexesOutput",
    "ListIndexesOutputIndexesItem",
    "ListIndexesOutputIndexesItemCreatedBy",
    "ListInvitationsInput",
    "ListInvitationsOutput",
    "ListInvitationsOutputInvitationsItem",
    "ListKnowledgeBasesInput",
    "ListKnowledgeBasesOutput",
    "ListKnowledgeBasesOutputKnowledgeBasesItem",
    "ListKnowledgeBasesOutputKnowledgeBasesItemCreatedBy",
    "ListLearnedChangesInput",
    "ListLearnedChangesOutput",
    "ListLearnedChangesOutputLearnedChangesItem",
    "ListMembersInput",
    "ListMembersOutput",
    "ListMembersOutputMembersItem",
    "ListMemoriesInput",
    "ListMemoriesOutput",
    "ListMemoriesOutputMemoriesItem",
    "ListMemoriesOutputMemoriesItemPlan",
    "ListMemoriesOutputMemoriesItemSourcesItem",
    "ListMemoryDecisionsInput",
    "ListMemoryDecisionsOutput",
    "ListMemoryDecisionsOutputDecisionsItem",
    "ListMemoryDecisionsOutputDecisionsItemFile",
    "ListMemoryDecisionsOutputDecisionsItemMemory",
    "ListMemoryDecisionsOutputDecisionsItemMemoryPlan",
    "ListMemoryDecisionsOutputDecisionsItemMemorySourcesItem",
    "ListMemoryDecisionsOutputDecisionsItemOtherMemory",
    "ListMemoryOwnersInput",
    "ListMemoryOwnersOutput",
    "ListMemoryOwnersOutputOwnersItem",
    "ListMemoryReviewsInput",
    "ListMemoryReviewsOutput",
    "ListMemoryReviewsOutputReviewsItem",
    "ListMemoryReviewsOutputReviewsItemContradictedMemoriesItem",
    "ListMemoryReviewsOutputReviewsItemContradictingRecordsItem",
    "ListMemoryReviewsOutputReviewsItemMemory",
    "ListMemoryReviewsOutputReviewsItemMemoryPlan",
    "ListMemoryReviewsOutputReviewsItemMemorySourcesItem",
    "ListMemorySavedQuestionsInput",
    "ListMemorySavedQuestionsOutput",
    "ListMemorySavedQuestionsOutputSavedQuestionsItem",
    "ListMemorySourcesInput",
    "ListMemorySourcesOutput",
    "ListMemorySourcesOutputSourcesItem",
    "ListMemorySourcesOutputSourcesItemCreatedBy",
    "ListMemorySourcesOutputSourcesItemLastError",
    "ListMemorySourcesOutputSourcesItemSignIn",
    "ListMemoryWebhookDeliveriesInput",
    "ListMemoryWebhookDeliveriesOutput",
    "ListMemoryWebhookDeliveriesOutputDeliveriesItem",
    "ListMessagesInput",
    "ListMessagesOutput",
    "ListMessagesOutputMessagesItem",
    "ListMetadataKeysInput",
    "ListMetadataKeysOutput",
    "ListMetadataKeysOutputKeysItem",
    "ListMetadataValuesInput",
    "ListMetadataValuesOutput",
    "ListMetadataValuesOutputValuesItem",
    "ListOperationsInput",
    "ListOperationsOutput",
    "ListOperationsOutputOperationsItem",
    "ListOperationsOutputOperationsItemKeyPermissionsItem",
    "ListProjectsInput",
    "ListProjectsOutput",
    "ListProjectsOutputProjectsItem",
    "ListQuestionsInput",
    "ListQuestionsOutput",
    "ListQuestionsOutputQuestionsItem",
    "ListQuestionsOutputQuestionsItemPassagesItem",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationDocument",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentAreasItem",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentPageSizesItem",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationImage",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationImageAreasItem",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationImagePageSizesItem",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationRecording",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationSlides",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationSpreadsheet",
    "ListQuestionsOutputQuestionsItemPassagesItemCitationWebPage",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocument",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentAreasItem",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentPageSizesItem",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImage",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImageAreasItem",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImagePageSizesItem",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationRecording",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSlides",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSpreadsheet",
    "ListQuestionsOutputQuestionsItemPassagesItemMatchCitationWebPage",
    "ListQuestionsOutputQuestionsItemSavedAnswer",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassage",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocument",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentAreasItem",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentPageSizesItem",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImage",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImageAreasItem",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImagePageSizesItem",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationRecording",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSlides",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSpreadsheet",
    "ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationWebPage",
    "ListSavedQueriesInput",
    "ListSavedQueriesOutput",
    "ListSavedQueriesOutputSavedQueriesItem",
    "ListSavedQueriesOutputSavedQueriesItemCreatedBy",
    "ListSavedQuestionsInput",
    "ListSavedQuestionsOutput",
    "ListSavedQuestionsOutputSavedQuestionsItem",
    "ListSavedQuestionsOutputSavedQuestionsItemBroken",
    "ListSavedQuestionsOutputSavedQuestionsItemBrokenPrevious",
    "ListSavedQuestionsOutputSavedQuestionsItemPassage",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImage",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet",
    "ListSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage",
    "ListScorecardResultsInput",
    "ListScorecardResultsOutput",
    "ListScorecardResultsOutputResultsItem",
    "ListScorecardResultsOutputResultsItemCauseDetail",
    "ListScorecardResultsOutputResultsItemCompared",
    "ListScorecardResultsOutputResultsItemPassage",
    "ListScorecardResultsOutputResultsItemReturnedItem",
    "ListScorecardsInput",
    "ListScorecardsOutput",
    "ListScorecardsOutputScorecardsItem",
    "ListScorecardsOutputScorecardsItemConfiguration",
    "ListScorecardsOutputScorecardsItemConfigurationSettings",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsBm25",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsBoost",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsFusionLinear",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsFusionRrf",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsStopWords",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption1",
    "ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption2",
    "ListScorecardsOutputScorecardsItemHeldBack",
    "ListScorecardsOutputScorecardsItemTuning",
    "ListSourceItemsInput",
    "ListSourceItemsOutput",
    "ListSourceItemsOutputItemsItem",
    "ListSourceSyncsInput",
    "ListSourceSyncsOutput",
    "ListSourceSyncsOutputSyncsItem",
    "ListSourceSyncsOutputSyncsItemError",
    "ListSourcesInput",
    "ListSourcesOutput",
    "ListSourcesOutputSourcesItem",
    "ListSourcesOutputSourcesItemCreatedBy",
    "ListSourcesOutputSourcesItemLastError",
    "ListSourcesOutputSourcesItemSignIn",
    "ListTableRowsInput",
    "ListTableRowsInputAfterItemBlob",
    "ListTableRowsInputAfterItemInteger",
    "ListTableRowsInputBeforeItemBlob",
    "ListTableRowsInputBeforeItemInteger",
    "ListTableRowsInputFiltersItem",
    "ListTableRowsInputFiltersItemValueBlob",
    "ListTableRowsInputFiltersItemValueInteger",
    "ListTableRowsInputFiltersItemValueItemBlob",
    "ListTableRowsInputFiltersItemValueItemInteger",
    "ListTableRowsInputSortsItem",
    "ListTableRowsOutput",
    "ListTableRowsOutputRowsItem",
    "ListTableRowsOutputRowsItemCellsItem",
    "ListTableRowsOutputRowsItemKeyItemBlob",
    "ListTableRowsOutputRowsItemKeyItemInteger",
    "ListTableRowsOutputTable",
    "ListTableRowsOutputTableColumnsItem",
    "ListTableRowsOutputTableForeignKeysItem",
    "ListTableRowsOutputTableIndexesItem",
    "ListVersionBlocksInput",
    "ListVersionBlocksOutput",
    "ListVersionBlocksOutputBlocksItem",
    "ListVersionBlocksOutputBlocksItemPlace",
    "PreviewCreateTableInput",
    "PreviewCreateTableInputColumnsItem",
    "PreviewCreateTableInputColumnsItemDefaultCurrentDate",
    "PreviewCreateTableInputColumnsItemDefaultCurrentTime",
    "PreviewCreateTableInputColumnsItemDefaultCurrentTimestamp",
    "PreviewCreateTableInputColumnsItemDefaultValue",
    "PreviewCreateTableInputColumnsItemReferences",
    "PreviewCreateTableOutput",
    "PreviewCreateTableOutputPreview",
    "PreviewIndexSearchInput",
    "PreviewIndexSearchInputFacetRangesValueItem",
    "PreviewIndexSearchInputPinnedItem",
    "PreviewIndexSearchOutput",
    "PreviewIndexSearchOutputFacetsItem",
    "PreviewIndexSearchOutputFacetsItemValuesItem",
    "PreviewIndexSearchOutputGroupsItem",
    "PreviewIndexSearchOutputResultsItem",
    "PreviewIndexSearchOutputResultsItemHighlightsItem",
    "PreviewIndexSearchOutputResultsItemHighlightsItemMarksItem",
    "PreviewIndexSearchOutputResultsItemKeyword",
    "PreviewIndexSearchOutputResultsItemKeywordFieldScoresItem",
    "PreviewIndexSearchOutputResultsItemKeywordTermsItem",
    "PreviewIndexSearchOutputResultsItemKeywordTermsItemFieldsItem",
    "PreviewIndexSearchOutputResultsItemVector",
    "PreviewIndexSearchOutputSort",
    "PreviewIndexSearchOutputTuning",
    "PreviewTableColumnChangesInput",
    "PreviewTableColumnChangesInputChangesItemAdd",
    "PreviewTableColumnChangesInputChangesItemAddDefaultCurrentDate",
    "PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTime",
    "PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTimestamp",
    "PreviewTableColumnChangesInputChangesItemAddDefaultValue",
    "PreviewTableColumnChangesInputChangesItemAddPositionAfter",
    "PreviewTableColumnChangesInputChangesItemAddPositionBefore",
    "PreviewTableColumnChangesInputChangesItemAlter",
    "PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentDate",
    "PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTime",
    "PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTimestamp",
    "PreviewTableColumnChangesInputChangesItemAlterDefaultValue",
    "PreviewTableColumnChangesInputChangesItemDrop",
    "PreviewTableColumnChangesInputChangesItemRename",
    "PreviewTableColumnChangesOutput",
    "PreviewTableColumnChangesOutputPreview",
    "PreviewTableColumnChangesOutputPreviewRowChecksItem",
    "PromoteCorrectionInput",
    "PromoteCorrectionOutput",
    "PromoteCorrectionOutputAfter",
    "PromoteCorrectionOutputAfterHeldBack",
    "PromoteCorrectionOutputAfterTuning",
    "PromoteCorrectionOutputBefore",
    "PromoteCorrectionOutputBeforeHeldBack",
    "PromoteCorrectionOutputBeforeTuning",
    "PromoteCorrectionOutputEstimate",
    "PromoteCorrectionOutputQuestionChanges",
    "PromoteCorrectionOutputSettingAgentDepth",
    "PromoteCorrectionOutputSettingBm25",
    "PromoteCorrectionOutputSettingChunking",
    "PromoteCorrectionOutputSettingFieldBoost",
    "PromoteCorrectionOutputSettingLanguage",
    "PromoteCorrectionOutputSettingOption1",
    "PromoteCorrectionOutputSettingOption2",
    "PromoteCorrectionOutputSettingRebuild",
    "PromoteCorrectionOutputSettingStopWords",
    "PromoteCorrectionOutputSettingSynonyms",
    "PromoteCorrectionOutputSettingSynonymsRulesItemOption1",
    "PromoteCorrectionOutputSettingSynonymsRulesItemOption2",
    "PromoteMemoryInput",
    "PromoteMemoryOutput",
    "PromoteMemoryOutputPlan",
    "PromoteMemoryOutputSourcesItem",
    "ProposeCorrectionsInput",
    "ProposeCorrectionsOutput",
    "ProposeDatabaseChangeInput",
    "ProposeDatabaseChangeOutput",
    "ProposeDatabaseChangeOutputProposal",
    "ProposeDatabaseChangeOutputProposalTablesItem",
    "RecallMemoriesInput",
    "RecallMemoriesOutput",
    "RecallMemoriesOutputMemoriesItem",
    "RecallMemoriesOutputMemoriesItemConflictsWithItemFile",
    "RecallMemoriesOutputMemoriesItemConflictsWithItemMemory",
    "RecallMemoriesOutputMemoriesItemConflictsWithItemMemorySourcesItem",
    "RecallMemoriesOutputMemoriesItemConflictsWithItemWaitingMessage",
    "RecallMemoriesOutputMemoriesItemHolds",
    "RecallMemoriesOutputMemoriesItemPlan",
    "RecallMemoriesOutputMemoriesItemReplacedBy",
    "RecallMemoriesOutputMemoriesItemReplacesItem",
    "RecallMemoriesOutputMemoriesItemSourcesItem",
    "RecordAnswerEventsInput",
    "RecordAnswerEventsInputEventsItem",
    "RecordAnswerEventsOutput",
    "RecordAnswerEventsOutputResultsItem",
    "RecoverMemoryInput",
    "RecoverMemoryOutput",
    "RecoverMemoryOutputPlan",
    "RecoverMemoryOutputSourcesItem",
    "RemoveMemberInput",
    "RemoveMemberOutput",
    "RemoveMemoryWebhookInput",
    "RemoveMemoryWebhookOutput",
    "RestoreDatabaseInput",
    "RestoreDatabaseOutput",
    "RestoreDatabaseOutputCompaction",
    "RestoreDatabaseOutputCreatedBy",
    "RestoreDatabaseOutputSize",
    "RestoreFileInput",
    "RestoreFileOutput",
    "RestoreFileOutputFailure",
    "RestoreFileOutputUnreadPartsItem",
    "RestoreFileOutputUnreadPartsItemFailure",
    "RestoreIndexInput",
    "RestoreIndexOutput",
    "RestoreIndexOutputCreatedBy",
    "RestoreIndexSnapshotInput",
    "RestoreIndexSnapshotOutput",
    "RestoreIndexSnapshotOutputIndex",
    "RestoreIndexSnapshotOutputIndexCreatedBy",
    "RestoreKnowledgeBaseInput",
    "RestoreKnowledgeBaseOutput",
    "RestoreKnowledgeBaseOutputCreatedBy",
    "RestoreMemoryInput",
    "RestoreMemoryOutput",
    "RestoreMemoryOutputCheckedKnowledgeBases",
    "RestoreMemoryOutputCheckedKnowledgeBasesLeftOutItem",
    "RestoreMemoryOutputCreatedBy",
    "RestoreMemoryOutputSettings",
    "RestoreMemoryOutputSettingsAgentPermissions",
    "RestoreMemoryOutputSettingsCueWeights",
    "RestoreMemoryOutputSettingsCueWeightsAuthorKind",
    "RestoreMemoryOutputSettingsCueWeightsStatementKind",
    "RestoreMemoryOutputSettingsSubjectsItem",
    "RestoreProjectInput",
    "RestoreProjectOutput",
    "ReviewFlaggedQuestionsInput",
    "ReviewFlaggedQuestionsOutput",
    "RevokeApiKeyInput",
    "RevokeApiKeyOutput",
    "RevokeApiKeyOutputPermissions",
    "RevokeApiKeyOutputPermissionsDatabases",
    "RevokeApiKeyOutputPermissionsIndexes",
    "RevokeApiKeyOutputPermissionsKnowledgeBases",
    "RevokeApiKeyOutputPermissionsMemory",
    "RevokeInvitationInput",
    "RevokeInvitationOutput",
    "RunDatabaseSqlInput",
    "RunDatabaseSqlOutput",
    "RunDatabaseSqlOutputApplied",
    "RunDatabaseSqlOutputNeedsConfirmation",
    "RunDatabaseSqlOutputRows",
    "RunDatabaseSqlOutputRowsResultsItem",
    "RunDatabaseSqlOutputRowsResultsItemColumnsItem",
    "RunDatabaseSqlOutputRowsResultsItemRowsItemItem",
    "SaveIndexRecordInput",
    "SaveIndexRecordOutput",
    "SaveMemoryQuestionInput",
    "SaveMemoryQuestionOutput",
    "SaveQueryInput",
    "SaveQueryOutput",
    "SaveQueryOutputSavedQuery",
    "SaveQueryOutputSavedQueryCreatedBy",
    "SaveQuestionInput",
    "SaveQuestionOutput",
    "SaveQuestionOutputBroken",
    "SaveQuestionOutputBrokenPrevious",
    "SaveQuestionOutputPassage",
    "SaveQuestionOutputPassageCitationDocument",
    "SaveQuestionOutputPassageCitationDocumentAreasItem",
    "SaveQuestionOutputPassageCitationDocumentPageSizesItem",
    "SaveQuestionOutputPassageCitationImage",
    "SaveQuestionOutputPassageCitationImageAreasItem",
    "SaveQuestionOutputPassageCitationImagePageSizesItem",
    "SaveQuestionOutputPassageCitationRecording",
    "SaveQuestionOutputPassageCitationSlides",
    "SaveQuestionOutputPassageCitationSpreadsheet",
    "SaveQuestionOutputPassageCitationWebPage",
    "ScoreQuestionSetInput",
    "ScoreQuestionSetOutput",
    "ScoreQuestionSetOutputConfiguration",
    "ScoreQuestionSetOutputConfigurationSettings",
    "ScoreQuestionSetOutputConfigurationSettingsBm25",
    "ScoreQuestionSetOutputConfigurationSettingsBoost",
    "ScoreQuestionSetOutputConfigurationSettingsFusionLinear",
    "ScoreQuestionSetOutputConfigurationSettingsFusionRrf",
    "ScoreQuestionSetOutputConfigurationSettingsStopWords",
    "ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption1",
    "ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption2",
    "ScoreQuestionSetOutputHeldBack",
    "ScoreQuestionSetOutputTuning",
    "SearchFoldersInput",
    "SearchFoldersOutput",
    "SearchFoldersOutputFoldersItem",
    "SearchKnowledgeBaseInput",
    "SearchKnowledgeBaseOutput",
    "SearchKnowledgeBaseOutputMemoriesItem",
    "SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemFile",
    "SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemory",
    "SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemorySourcesItem",
    "SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemWaitingMessage",
    "SearchKnowledgeBaseOutputMemoriesItemHolds",
    "SearchKnowledgeBaseOutputMemoriesItemPlan",
    "SearchKnowledgeBaseOutputMemoriesItemReplacedBy",
    "SearchKnowledgeBaseOutputMemoriesItemReplacesItem",
    "SearchKnowledgeBaseOutputMemoriesItemSourcesItem",
    "SearchKnowledgeBaseOutputPassagesItem",
    "SearchKnowledgeBaseOutputPassagesItemCitationDocument",
    "SearchKnowledgeBaseOutputPassagesItemCitationDocumentAreasItem",
    "SearchKnowledgeBaseOutputPassagesItemCitationDocumentPageSizesItem",
    "SearchKnowledgeBaseOutputPassagesItemCitationImage",
    "SearchKnowledgeBaseOutputPassagesItemCitationImageAreasItem",
    "SearchKnowledgeBaseOutputPassagesItemCitationImagePageSizesItem",
    "SearchKnowledgeBaseOutputPassagesItemCitationRecording",
    "SearchKnowledgeBaseOutputPassagesItemCitationSlides",
    "SearchKnowledgeBaseOutputPassagesItemCitationSpreadsheet",
    "SearchKnowledgeBaseOutputPassagesItemCitationWebPage",
    "SearchKnowledgeBaseOutputPassagesItemMatch",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationDocument",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentAreasItem",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentPageSizesItem",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationImage",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationImageAreasItem",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationImagePageSizesItem",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationRecording",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationSlides",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationSpreadsheet",
    "SearchKnowledgeBaseOutputPassagesItemMatchCitationWebPage",
    "SearchKnowledgeBaseOutputPassagesItemMatchRange",
    "SearchKnowledgeBaseOutputPassagesItemMatchTermsItem",
    "SendMemoryFeedbackInput",
    "SendMemoryFeedbackOutput",
    "SetMemoryWebhookInput",
    "SetMemoryWebhookOutput",
    "SettleFlaggedQuestionInput",
    "SettleFlaggedQuestionOutput",
    "SettleFlaggedQuestionOutputAnswer",
    "SettleFlaggedQuestionOutputCandidatesItem",
    "SettleFlaggedQuestionOutputCandidatesItemCitationDocument",
    "SettleFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem",
    "SettleFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem",
    "SettleFlaggedQuestionOutputCandidatesItemCitationImage",
    "SettleFlaggedQuestionOutputCandidatesItemCitationImageAreasItem",
    "SettleFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem",
    "SettleFlaggedQuestionOutputCandidatesItemCitationRecording",
    "SettleFlaggedQuestionOutputCandidatesItemCitationSlides",
    "SettleFlaggedQuestionOutputCandidatesItemCitationSpreadsheet",
    "SettleFlaggedQuestionOutputCandidatesItemCitationWebPage",
    "SettleFlaggedQuestionOutputReturnedPassagesItem",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocument",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationImage",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationRecording",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationSlides",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet",
    "SettleFlaggedQuestionOutputReturnedPassagesItemCitationWebPage",
    "SettleFlaggedQuestionOutputSignalDetailsItem",
    "SettleMemoryInput",
    "SettleMemoryOutput",
    "SettleMemoryOutputPlan",
    "SettleMemoryOutputSourcesItem",
    "SettleMemoryReviewInput",
    "SettleMemoryReviewOutput",
    "SettleMemoryReviewOutputContradictedMemoriesItem",
    "SettleMemoryReviewOutputContradictingRecordsItem",
    "SettleMemoryReviewOutputMemory",
    "SettleMemoryReviewOutputMemoryPlan",
    "SettleMemoryReviewOutputMemorySourcesItem",
    "SignInInput",
    "SignInOutput",
    "SignInOutputSecondFactorRequired",
    "SignInOutputSecondFactorSetupRequired",
    "SignOutInput",
    "SignOutOutput",
    "SignUpInput",
    "SignUpOutput",
    "SignUploadPartsInput",
    "SignUploadPartsInputPartsItem",
    "SignUploadPartsOutput",
    "SignUploadPartsOutputPartsItem",
    "SortMessageInput",
    "SortMessageOutput",
    "SortMessageOutputMemoriesItem",
    "SortMessageOutputMemoriesItemPlan",
    "StartMemorySourceSignInInput",
    "StartMemorySourceSignInOutput",
    "StartSourceSignInInput",
    "StartSourceSignInOutput",
    "SuggestIndexTermsInput",
    "SuggestIndexTermsOutput",
    "SuggestIndexTermsOutputTermsItem",
    "SyncMemorySourceInput",
    "SyncMemorySourceOutput",
    "SyncMemorySourceOutputCreatedBy",
    "SyncMemorySourceOutputLastError",
    "SyncMemorySourceOutputSignIn",
    "SyncSourceInput",
    "SyncSourceOutput",
    "SyncSourceOutputCreatedBy",
    "SyncSourceOutputLastError",
    "SyncSourceOutputSignIn",
    "TryCorrectionsInput",
    "TryCorrectionsOutput",
    "TuneMemoryInput",
    "TuneMemoryOutput",
    "TuneMemoryOutputJudgement",
    "TuneMemoryOutputLabelledDecisions",
    "TuneMemoryOutputRecall",
    "TuneMemoryOutputTuning",
    "UndoLearnedChangeInput",
    "UndoLearnedChangeOutput",
    "UpdateApiKeyInput",
    "UpdateApiKeyInputPermissionsFull",
    "UpdateApiKeyInputPermissionsRestricted",
    "UpdateApiKeyInputPermissionsRestrictedDatabases",
    "UpdateApiKeyInputPermissionsRestrictedIndexes",
    "UpdateApiKeyInputPermissionsRestrictedKnowledgeBases",
    "UpdateApiKeyInputPermissionsRestrictedMemory",
    "UpdateApiKeyOutput",
    "UpdateApiKeyOutputPermissions",
    "UpdateApiKeyOutputPermissionsDatabases",
    "UpdateApiKeyOutputPermissionsIndexes",
    "UpdateApiKeyOutputPermissionsKnowledgeBases",
    "UpdateApiKeyOutputPermissionsMemory",
    "UpdateDatabaseInput",
    "UpdateDatabaseOutput",
    "UpdateDatabaseOutputCompaction",
    "UpdateDatabaseOutputCreatedBy",
    "UpdateDatabaseOutputSize",
    "UpdateIndexInput",
    "UpdateIndexInputBm25",
    "UpdateIndexInputSearchDefaults",
    "UpdateIndexInputSynonymsItemOption1",
    "UpdateIndexInputSynonymsItemOption2",
    "UpdateIndexOutput",
    "UpdateIndexOutputCreatedBy",
    "UpdateKnowledgeBaseInput",
    "UpdateKnowledgeBaseOutput",
    "UpdateKnowledgeBaseOutputCreatedBy",
    "UpdateMemoryInput",
    "UpdateMemoryInputAgentPermissions",
    "UpdateMemoryInputCueWeights",
    "UpdateMemoryInputCueWeightsAuthorKind",
    "UpdateMemoryInputCueWeightsStatementKind",
    "UpdateMemoryInputSubjectsItem",
    "UpdateMemoryOutput",
    "UpdateMemoryOutputCheckedKnowledgeBases",
    "UpdateMemoryOutputCheckedKnowledgeBasesLeftOutItem",
    "UpdateMemoryOutputCreatedBy",
    "UpdateMemoryOutputSettings",
    "UpdateMemoryOutputSettingsAgentPermissions",
    "UpdateMemoryOutputSettingsCueWeights",
    "UpdateMemoryOutputSettingsCueWeightsAuthorKind",
    "UpdateMemoryOutputSettingsCueWeightsStatementKind",
    "UpdateMemoryOutputSettingsSubjectsItem",
    "UpdateMemorySourceInput",
    "UpdateMemorySourceOutput",
    "UpdateMemorySourceOutputCreatedBy",
    "UpdateMemorySourceOutputLastError",
    "UpdateMemorySourceOutputSignIn",
    "UpdateSavedQuestionInput",
    "UpdateSavedQuestionOutput",
    "UpdateSavedQuestionOutputBroken",
    "UpdateSavedQuestionOutputBrokenPrevious",
    "UpdateSavedQuestionOutputPassage",
    "UpdateSavedQuestionOutputPassageCitationDocument",
    "UpdateSavedQuestionOutputPassageCitationDocumentAreasItem",
    "UpdateSavedQuestionOutputPassageCitationDocumentPageSizesItem",
    "UpdateSavedQuestionOutputPassageCitationImage",
    "UpdateSavedQuestionOutputPassageCitationImageAreasItem",
    "UpdateSavedQuestionOutputPassageCitationImagePageSizesItem",
    "UpdateSavedQuestionOutputPassageCitationRecording",
    "UpdateSavedQuestionOutputPassageCitationSlides",
    "UpdateSavedQuestionOutputPassageCitationSpreadsheet",
    "UpdateSavedQuestionOutputPassageCitationWebPage",
    "UpdateSourceInput",
    "UpdateSourceOutput",
    "UpdateSourceOutputCreatedBy",
    "UpdateSourceOutputLastError",
    "UpdateSourceOutputSignIn",
    "UpdateTableRowInput",
    "UpdateTableRowInputExpectedValueBlob",
    "UpdateTableRowInputExpectedValueInteger",
    "UpdateTableRowInputKeyItemBlob",
    "UpdateTableRowInputKeyItemInteger",
    "UpdateTableRowInputValuesValueBlob",
    "UpdateTableRowInputValuesValueInteger",
    "UpdateTableRowOutput",
    "UpdateTableRowOutputReturnedKeyItemBlob",
    "UpdateTableRowOutputReturnedKeyItemInteger",
    "UpdateTableRowOutputRow",
    "UpdateTableRowOutputRowCellsItem",
    "UpdateTableRowOutputRowKeyItemBlob",
    "UpdateTableRowOutputRowKeyItemInteger",
    "UploadTableImportInput",
    "UploadTableImportOutput",
    "UploadTableImportOutputTableImport",
    "UploadTableImportOutputTableImportColumnsItem",
    "VerifySecondFactorInput",
    "VerifySecondFactorOutput",
    "VerifySecondFactorOutputSession",
    "VerifySecondFactorOutputSessionAccount",
]


class AcceptInvitationInput(TypedDict):
    token: str


class AcceptInvitationOutput(TypedDict):
    id: str
    name: str
    region: str
    role: Literal["owner", "member"] | None
    created_at: str
    deleted_at: str | None
    purge_after: str | None
    sirannon_url: str
    narsil_url: str


class _AddDatabaseMigrationInputRequired(TypedDict):
    project_id: str
    database_id: str
    name: str
    sql: str


class AddDatabaseMigrationInput(_AddDatabaseMigrationInputRequired, total=False):
    expected_migration_version: int | str


class AddDatabaseMigrationOutput(TypedDict):
    version: float
    name: str
    sql: str
    added_at: str


class _AddMessagesInputItemsItemConversationTurnsItemRequired(TypedDict):
    speaker: str
    text: str


class AddMessagesInputItemsItemConversationTurnsItem(
    _AddMessagesInputItemsItemConversationTurnsItemRequired, total=False
):
    speaker_kind: Literal["staff", "agent", "end_user", "outsider"]
    at: str
    start_second: float
    end_second: float


class _AddMessagesInputItemsItemConversationRequired(TypedDict):
    kind: Literal["conversation"]
    external_id: str
    version: int
    turns: Sequence[AddMessagesInputItemsItemConversationTurnsItem]


class AddMessagesInputItemsItemConversation(
    _AddMessagesInputItemsItemConversationRequired, total=False
):
    title: str
    address: str
    occurred_at: str
    end_user_id: str
    team_id: str
    private: bool


class _AddMessagesInputItemsItemMessageRequired(TypedDict):
    kind: Literal["message"]
    external_id: str
    version: int
    conversation_id: str
    author: str
    text: str
    sent_at: str


class AddMessagesInputItemsItemMessage(_AddMessagesInputItemsItemMessageRequired, total=False):
    conversation_title: str
    address: str
    author_kind: Literal["staff", "agent", "end_user", "outsider"]
    reply_to: str
    reactions: int
    end_user_id: str
    team_id: str
    private: bool


class _AddMessagesInputItemsItemRecordRequired(TypedDict):
    kind: Literal["record"]
    external_id: str
    version: int
    fields: Mapping[str, str | float | bool | None]


class AddMessagesInputItemsItemRecord(_AddMessagesInputItemsItemRecordRequired, total=False):
    title: str
    address: str
    end_user_id: str


class AddMessagesInputItemsItemDeletion(TypedDict):
    kind: Literal["deletion"]
    external_id: str
    version: int


class AddMessagesInput(TypedDict):
    project_id: str
    memory_id: str
    source_id: str
    items: Sequence[
        AddMessagesInputItemsItemConversation
        | AddMessagesInputItemsItemMessage
        | AddMessagesInputItemsItemRecord
        | AddMessagesInputItemsItemDeletion
    ]


class AddMessagesOutputResultsItem(TypedDict):
    external_id: str
    version: float
    outcome: Literal["stored", "duplicate", "stale", "conflict"]


class AddMessagesOutput(TypedDict):
    results: list[AddMessagesOutputResultsItem]


class _AnswerQuestionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    question: str


class AnswerQuestionInput(_AnswerQuestionInputRequired, total=False):
    limit: int | str
    folder: str
    metadata: Mapping[str, str | Sequence[str]]
    end_user_id: str
    call_id: str


class AnswerQuestionOutputPassagesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class AnswerQuestionOutputPassagesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class AnswerQuestionOutputPassagesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[AnswerQuestionOutputPassagesItemCitationDocumentAreasItem]
    page_sizes: list[AnswerQuestionOutputPassagesItemCitationDocumentPageSizesItem]


class AnswerQuestionOutputPassagesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class AnswerQuestionOutputPassagesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class AnswerQuestionOutputPassagesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class AnswerQuestionOutputPassagesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class AnswerQuestionOutputPassagesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class AnswerQuestionOutputPassagesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[AnswerQuestionOutputPassagesItemCitationImageAreasItem]
    page_sizes: list[AnswerQuestionOutputPassagesItemCitationImagePageSizesItem]


class AnswerQuestionOutputPassagesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class AnswerQuestionOutputPassagesItemMatchCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class AnswerQuestionOutputPassagesItemMatchCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class AnswerQuestionOutputPassagesItemMatchCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[AnswerQuestionOutputPassagesItemMatchCitationDocumentAreasItem]
    page_sizes: list[AnswerQuestionOutputPassagesItemMatchCitationDocumentPageSizesItem]


class AnswerQuestionOutputPassagesItemMatchCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class AnswerQuestionOutputPassagesItemMatchCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class AnswerQuestionOutputPassagesItemMatchCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class AnswerQuestionOutputPassagesItemMatchCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class AnswerQuestionOutputPassagesItemMatchCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class AnswerQuestionOutputPassagesItemMatchCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[AnswerQuestionOutputPassagesItemMatchCitationImageAreasItem]
    page_sizes: list[AnswerQuestionOutputPassagesItemMatchCitationImagePageSizesItem]


class AnswerQuestionOutputPassagesItemMatchCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class AnswerQuestionOutputPassagesItemMatchRange(TypedDict):
    start: float
    end: float


class AnswerQuestionOutputPassagesItemMatchTermsItem(TypedDict):
    start: float
    end: float


class AnswerQuestionOutputPassagesItemMatch(TypedDict):
    citation: (
        AnswerQuestionOutputPassagesItemMatchCitationDocument
        | AnswerQuestionOutputPassagesItemMatchCitationSpreadsheet
        | AnswerQuestionOutputPassagesItemMatchCitationSlides
        | AnswerQuestionOutputPassagesItemMatchCitationWebPage
        | AnswerQuestionOutputPassagesItemMatchCitationImage
        | AnswerQuestionOutputPassagesItemMatchCitationRecording
    )
    range: AnswerQuestionOutputPassagesItemMatchRange
    terms: list[AnswerQuestionOutputPassagesItemMatchTermsItem]


class AnswerQuestionOutputPassagesItem(TypedDict):
    chunk_id: str
    file_id: str
    file_path: str
    file_kind: Literal[
        "pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"
    ]
    version: float
    heading: str | None
    text: str
    truncated: bool
    score: float
    citation: (
        AnswerQuestionOutputPassagesItemCitationDocument
        | AnswerQuestionOutputPassagesItemCitationSpreadsheet
        | AnswerQuestionOutputPassagesItemCitationSlides
        | AnswerQuestionOutputPassagesItemCitationWebPage
        | AnswerQuestionOutputPassagesItemCitationImage
        | AnswerQuestionOutputPassagesItemCitationRecording
    )
    match: AnswerQuestionOutputPassagesItemMatch


class AnswerQuestionOutputAnswerStatementsItem(TypedDict):
    text: str
    passages: list[float]


class AnswerQuestionOutputAnswer(TypedDict):
    status: Literal["answered", "not_in_passages", "no_passages", "unavailable"]
    statements: list[AnswerQuestionOutputAnswerStatementsItem]
    passages_read: float


class AnswerQuestionOutput(TypedDict):
    question_id: str
    duration_ms: float
    passages: list[AnswerQuestionOutputPassagesItem]
    answer: AnswerQuestionOutputAnswer


class ApplyTableImportInputColumnsItem(TypedDict):
    source_index: int | str
    column_name: str


class ApplyTableImportInputNewTableColumnsItemDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class ApplyTableImportInputNewTableColumnsItemDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class ApplyTableImportInputNewTableColumnsItemDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class ApplyTableImportInputNewTableColumnsItemDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class _ApplyTableImportInputNewTableColumnsItemReferencesRequired(TypedDict):
    table: str
    column: str


class ApplyTableImportInputNewTableColumnsItemReferences(
    _ApplyTableImportInputNewTableColumnsItemReferencesRequired, total=False
):
    on_delete: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]
    on_update: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]


class _ApplyTableImportInputNewTableColumnsItemRequired(TypedDict):
    name: str
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class ApplyTableImportInputNewTableColumnsItem(
    _ApplyTableImportInputNewTableColumnsItemRequired, total=False
):
    not_null: bool
    default: (
        ApplyTableImportInputNewTableColumnsItemDefaultValue
        | ApplyTableImportInputNewTableColumnsItemDefaultCurrentTimestamp
        | ApplyTableImportInputNewTableColumnsItemDefaultCurrentDate
        | ApplyTableImportInputNewTableColumnsItemDefaultCurrentTime
        | None
    )
    primary_key: bool
    unique: bool
    references: ApplyTableImportInputNewTableColumnsItemReferences | None


class _ApplyTableImportInputRequired(TypedDict):
    project_id: str
    database_id: str
    import_id: str
    table_name: str
    columns: Sequence[ApplyTableImportInputColumnsItem]
    expected_failed: int | str
    expected_migration_version: int | str


class ApplyTableImportInput(_ApplyTableImportInputRequired, total=False):
    new_table_columns: Sequence[ApplyTableImportInputNewTableColumnsItem] | None


class ApplyTableImportOutputImportedMigration(TypedDict):
    version: float
    name: str
    sql: str
    added_at: str


class ApplyTableImportOutputImported(TypedDict):
    table_name: str
    inserted: float
    migration: ApplyTableImportOutputImportedMigration | None


class ApplyTableImportOutput(TypedDict):
    imported: ApplyTableImportOutputImported


class BeginSecondFactorSetupInput(TypedDict):
    password: str


class BeginSecondFactorSetupOutput(TypedDict):
    totp_uri: str
    backup_codes: list[str]


class CancelUploadInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    upload_id: str


class CancelUploadOutputFileFailure(TypedDict):
    code: str
    message: str


class CancelUploadOutputFileUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class CancelUploadOutputFileUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: CancelUploadOutputFileUnreadPartsItemFailure


class CancelUploadOutputFile(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: CancelUploadOutputFileFailure | None
    unread_parts: list[CancelUploadOutputFileUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class CancelUploadOutputFailure(TypedDict):
    code: str
    message: str


class CancelUploadOutput(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    address: str | None
    size_bytes: float
    content_sha256: str
    method: Literal["single", "multipart"]
    part_bytes: float
    part_count: float
    state: Literal["open", "checking", "completed", "failed"]
    outcome: Literal["added", "new_version", "unchanged"] | None
    file: CancelUploadOutputFile | None
    failure: CancelUploadOutputFailure | None
    created_at: str
    deadline_at: str


class ChangeTableColumnsInputChangesItemAddDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class ChangeTableColumnsInputChangesItemAddDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class ChangeTableColumnsInputChangesItemAddDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class ChangeTableColumnsInputChangesItemAddDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class ChangeTableColumnsInputChangesItemAddPositionBefore(TypedDict):
    side: Literal["before"]
    column: str


class ChangeTableColumnsInputChangesItemAddPositionAfter(TypedDict):
    side: Literal["after"]
    column: str


class _ChangeTableColumnsInputChangesItemAddRequired(TypedDict):
    kind: Literal["add"]
    name: str
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class ChangeTableColumnsInputChangesItemAdd(
    _ChangeTableColumnsInputChangesItemAddRequired, total=False
):
    not_null: bool
    default: (
        ChangeTableColumnsInputChangesItemAddDefaultValue
        | ChangeTableColumnsInputChangesItemAddDefaultCurrentTimestamp
        | ChangeTableColumnsInputChangesItemAddDefaultCurrentDate
        | ChangeTableColumnsInputChangesItemAddDefaultCurrentTime
        | None
    )
    position: (
        ChangeTableColumnsInputChangesItemAddPositionBefore
        | ChangeTableColumnsInputChangesItemAddPositionAfter
    )


class ChangeTableColumnsInputChangesItemRename(TypedDict):
    kind: Literal["rename"]
    column: str
    new_name: str


class ChangeTableColumnsInputChangesItemAlterDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class ChangeTableColumnsInputChangesItemAlterDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class ChangeTableColumnsInputChangesItemAlterDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class ChangeTableColumnsInputChangesItemAlterDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class _ChangeTableColumnsInputChangesItemAlterRequired(TypedDict):
    kind: Literal["alter"]
    column: str


class ChangeTableColumnsInputChangesItemAlter(
    _ChangeTableColumnsInputChangesItemAlterRequired, total=False
):
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]
    not_null: bool
    default: (
        ChangeTableColumnsInputChangesItemAlterDefaultValue
        | ChangeTableColumnsInputChangesItemAlterDefaultCurrentTimestamp
        | ChangeTableColumnsInputChangesItemAlterDefaultCurrentDate
        | ChangeTableColumnsInputChangesItemAlterDefaultCurrentTime
        | None
    )


class ChangeTableColumnsInputChangesItemDrop(TypedDict):
    kind: Literal["drop"]
    column: str


class ChangeTableColumnsInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    changes: Sequence[
        ChangeTableColumnsInputChangesItemAdd
        | ChangeTableColumnsInputChangesItemRename
        | ChangeTableColumnsInputChangesItemAlter
        | ChangeTableColumnsInputChangesItemDrop
    ]
    expected_migration_version: int | str


class ChangeTableColumnsOutputMigration(TypedDict):
    version: float
    name: str
    sql: str
    added_at: str


class ChangeTableColumnsOutputPreviewRowChecksItem(TypedDict):
    column: str
    check: Literal[
        "holds_nulls",
        "values_do_not_convert",
        "values_change_form",
        "values_removed",
        "rows_need_value",
    ]
    rows: float
    rows_capped: bool
    blocks_change: bool


class ChangeTableColumnsOutputPreview(TypedDict):
    table_name: str
    migration_name: str
    sql: str
    base_migration_version: float
    rebuilds_table: bool
    destructive: bool
    blocked: bool
    warnings: list[str]
    row_count: float
    row_count_capped: bool
    row_checks: list[ChangeTableColumnsOutputPreviewRowChecksItem]
    columns_before: list[str]
    columns_after: list[str]
    changed_columns: list[str]


class ChangeTableColumnsOutput(TypedDict):
    migration: ChangeTableColumnsOutputMigration
    preview: ChangeTableColumnsOutputPreview


class CheckTableImportInputColumnsItem(TypedDict):
    source_index: int | str
    column_name: str


class CheckTableImportInputNewTableColumnsItemDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class CheckTableImportInputNewTableColumnsItemDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class CheckTableImportInputNewTableColumnsItemDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class CheckTableImportInputNewTableColumnsItemDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class _CheckTableImportInputNewTableColumnsItemReferencesRequired(TypedDict):
    table: str
    column: str


class CheckTableImportInputNewTableColumnsItemReferences(
    _CheckTableImportInputNewTableColumnsItemReferencesRequired, total=False
):
    on_delete: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]
    on_update: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]


class _CheckTableImportInputNewTableColumnsItemRequired(TypedDict):
    name: str
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class CheckTableImportInputNewTableColumnsItem(
    _CheckTableImportInputNewTableColumnsItemRequired, total=False
):
    not_null: bool
    default: (
        CheckTableImportInputNewTableColumnsItemDefaultValue
        | CheckTableImportInputNewTableColumnsItemDefaultCurrentTimestamp
        | CheckTableImportInputNewTableColumnsItemDefaultCurrentDate
        | CheckTableImportInputNewTableColumnsItemDefaultCurrentTime
        | None
    )
    primary_key: bool
    unique: bool
    references: CheckTableImportInputNewTableColumnsItemReferences | None


class _CheckTableImportInputRequired(TypedDict):
    project_id: str
    database_id: str
    import_id: str
    table_name: str
    columns: Sequence[CheckTableImportInputColumnsItem]


class CheckTableImportInput(_CheckTableImportInputRequired, total=False):
    new_table_columns: Sequence[CheckTableImportInputNewTableColumnsItem] | None


class CheckTableImportOutputCheckFailuresItem(TypedDict):
    row: float
    message: str


class CheckTableImportOutputCheck(TypedDict):
    import_id: str
    table_name: str
    staged_rows: float
    importable_rows: float
    failed_total: float
    failures_capped: bool
    failures: list[CheckTableImportOutputCheckFailuresItem]
    base_migration_version: float
    table_sql: str | None


class CheckTableImportOutput(TypedDict):
    check: CheckTableImportOutputCheck


class CompactDatabaseInput(TypedDict):
    project_id: str
    database_id: str


class CompactDatabaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class CompactDatabaseOutputSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class CompactDatabaseOutputCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class CompactDatabaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: CompactDatabaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: CompactDatabaseOutputSize | None
    compaction: CompactDatabaseOutputCompaction | None
    sql_write_preview: bool


class CompareIndexSearchInputBm25(TypedDict, total=False):
    k1: float
    b: float


class _CompareIndexSearchInputRequired(TypedDict):
    project_id: str
    index_id: str
    query: str


class CompareIndexSearchInput(_CompareIndexSearchInputRequired, total=False):
    filters: str
    mode: Literal["keyword", "vector", "hybrid"]
    vector_field: str
    fields: str | Sequence[str]
    boosts: str | Mapping[str, object]
    term_match: int | str
    tolerance: int | str
    prefix_length: int | str
    exact: bool
    prefix: bool
    partial_words: bool
    minimum_score: float | str
    fusion: Literal["rrf", "linear"]
    fusion_constant: int | str
    vector_weight: float | str
    minimum_similarity: float | str
    vector_candidates: int | str
    bm25: CompareIndexSearchInputBm25
    limit: int | str


class CompareIndexSearchOutputSavedBm25(TypedDict):
    k1: float
    b: float


class CompareIndexSearchOutputSavedPreviewSort(TypedDict):
    field: str
    direction: Literal["asc", "desc"]


class CompareIndexSearchOutputSavedPreviewTuning(TypedDict, total=False):
    fields: list[str]
    boosts: dict[str, float]
    term_match: float | Literal["all", "any"]
    tolerance: float
    prefix_length: float
    exact: bool
    prefix: bool
    partial_words: bool
    minimum_score: float
    fusion: Literal["rrf", "linear"]
    fusion_constant: float
    vector_weight: float
    minimum_similarity: float
    vector_candidates: float


_CompareIndexSearchOutputSavedPreviewFacetsItemValuesItemRequired = TypedDict(
    "_CompareIndexSearchOutputSavedPreviewFacetsItemValuesItemRequired",
    {"value": str, "count": float, "from": float | None, "to": float | None},
)


class _CompareIndexSearchOutputSavedPreviewFacetsItemValuesItemOptional(TypedDict, total=False):
    pass


class CompareIndexSearchOutputSavedPreviewFacetsItemValuesItem(
    _CompareIndexSearchOutputSavedPreviewFacetsItemValuesItemRequired,
    _CompareIndexSearchOutputSavedPreviewFacetsItemValuesItemOptional,
):
    pass


class CompareIndexSearchOutputSavedPreviewFacetsItem(TypedDict):
    field: str
    counted: Literal["matches", "result_window"]
    values: list[CompareIndexSearchOutputSavedPreviewFacetsItemValuesItem]
    error_bound: float


class CompareIndexSearchOutputSavedPreviewGroupsItem(TypedDict):
    values: dict[str, object]
    count: float | None


class CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItemFieldsItem(TypedDict):
    field: str
    count: float
    field_length: float


class CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItem(TypedDict):
    term: str
    weight: float
    fields: list[CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItemFieldsItem]


class CompareIndexSearchOutputSavedPreviewResultsItemKeywordFieldScoresItem(TypedDict):
    field: str
    score: float


class CompareIndexSearchOutputSavedPreviewResultsItemKeyword(TypedDict):
    rank: float | None
    score: float | None
    terms: list[CompareIndexSearchOutputSavedPreviewResultsItemKeywordTermsItem]
    field_scores: list[CompareIndexSearchOutputSavedPreviewResultsItemKeywordFieldScoresItem] | None


class CompareIndexSearchOutputSavedPreviewResultsItemVector(TypedDict):
    rank: float | None
    similarity: float | None


class CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItemMarksItem(TypedDict):
    start: float
    end: float


class CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItem(TypedDict):
    field: str
    marks: list[CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItemMarksItem]


class CompareIndexSearchOutputSavedPreviewResultsItem(TypedDict):
    rank: float
    id: str
    score: float
    record: dict[str, object]
    keyword: CompareIndexSearchOutputSavedPreviewResultsItemKeyword
    vector: CompareIndexSearchOutputSavedPreviewResultsItemVector | None
    highlights: list[CompareIndexSearchOutputSavedPreviewResultsItemHighlightsItem]
    pinned: bool
    group: float | None


class CompareIndexSearchOutputSavedPreview(TypedDict):
    mode: Literal["keyword", "vector", "hybrid"]
    vector_field: str | None
    fusion: Literal["rrf", "linear"] | None
    fusion_constant: float | None
    vector_weight: float | None
    sort: CompareIndexSearchOutputSavedPreviewSort | None
    tuning: CompareIndexSearchOutputSavedPreviewTuning
    facets: list[CompareIndexSearchOutputSavedPreviewFacetsItem]
    groups: list[CompareIndexSearchOutputSavedPreviewGroupsItem] | None
    group_count: float | None
    total_count: float
    total_is_exact: bool
    offset: float
    next_offset: float | None
    duration_ms: float
    results: list[CompareIndexSearchOutputSavedPreviewResultsItem]


class CompareIndexSearchOutputSaved(TypedDict):
    bm25: CompareIndexSearchOutputSavedBm25
    preview: CompareIndexSearchOutputSavedPreview


class CompareIndexSearchOutputTunedBm25(TypedDict):
    k1: float
    b: float


class CompareIndexSearchOutputTunedPreviewSort(TypedDict):
    field: str
    direction: Literal["asc", "desc"]


class CompareIndexSearchOutputTunedPreviewTuning(TypedDict, total=False):
    fields: list[str]
    boosts: dict[str, float]
    term_match: float | Literal["all", "any"]
    tolerance: float
    prefix_length: float
    exact: bool
    prefix: bool
    partial_words: bool
    minimum_score: float
    fusion: Literal["rrf", "linear"]
    fusion_constant: float
    vector_weight: float
    minimum_similarity: float
    vector_candidates: float


_CompareIndexSearchOutputTunedPreviewFacetsItemValuesItemRequired = TypedDict(
    "_CompareIndexSearchOutputTunedPreviewFacetsItemValuesItemRequired",
    {"value": str, "count": float, "from": float | None, "to": float | None},
)


class _CompareIndexSearchOutputTunedPreviewFacetsItemValuesItemOptional(TypedDict, total=False):
    pass


class CompareIndexSearchOutputTunedPreviewFacetsItemValuesItem(
    _CompareIndexSearchOutputTunedPreviewFacetsItemValuesItemRequired,
    _CompareIndexSearchOutputTunedPreviewFacetsItemValuesItemOptional,
):
    pass


class CompareIndexSearchOutputTunedPreviewFacetsItem(TypedDict):
    field: str
    counted: Literal["matches", "result_window"]
    values: list[CompareIndexSearchOutputTunedPreviewFacetsItemValuesItem]
    error_bound: float


class CompareIndexSearchOutputTunedPreviewGroupsItem(TypedDict):
    values: dict[str, object]
    count: float | None


class CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItemFieldsItem(TypedDict):
    field: str
    count: float
    field_length: float


class CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItem(TypedDict):
    term: str
    weight: float
    fields: list[CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItemFieldsItem]


class CompareIndexSearchOutputTunedPreviewResultsItemKeywordFieldScoresItem(TypedDict):
    field: str
    score: float


class CompareIndexSearchOutputTunedPreviewResultsItemKeyword(TypedDict):
    rank: float | None
    score: float | None
    terms: list[CompareIndexSearchOutputTunedPreviewResultsItemKeywordTermsItem]
    field_scores: list[CompareIndexSearchOutputTunedPreviewResultsItemKeywordFieldScoresItem] | None


class CompareIndexSearchOutputTunedPreviewResultsItemVector(TypedDict):
    rank: float | None
    similarity: float | None


class CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItemMarksItem(TypedDict):
    start: float
    end: float


class CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItem(TypedDict):
    field: str
    marks: list[CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItemMarksItem]


class CompareIndexSearchOutputTunedPreviewResultsItem(TypedDict):
    rank: float
    id: str
    score: float
    record: dict[str, object]
    keyword: CompareIndexSearchOutputTunedPreviewResultsItemKeyword
    vector: CompareIndexSearchOutputTunedPreviewResultsItemVector | None
    highlights: list[CompareIndexSearchOutputTunedPreviewResultsItemHighlightsItem]
    pinned: bool
    group: float | None


class CompareIndexSearchOutputTunedPreview(TypedDict):
    mode: Literal["keyword", "vector", "hybrid"]
    vector_field: str | None
    fusion: Literal["rrf", "linear"] | None
    fusion_constant: float | None
    vector_weight: float | None
    sort: CompareIndexSearchOutputTunedPreviewSort | None
    tuning: CompareIndexSearchOutputTunedPreviewTuning
    facets: list[CompareIndexSearchOutputTunedPreviewFacetsItem]
    groups: list[CompareIndexSearchOutputTunedPreviewGroupsItem] | None
    group_count: float | None
    total_count: float
    total_is_exact: bool
    offset: float
    next_offset: float | None
    duration_ms: float
    results: list[CompareIndexSearchOutputTunedPreviewResultsItem]


class CompareIndexSearchOutputTuned(TypedDict):
    bm25: CompareIndexSearchOutputTunedBm25
    preview: CompareIndexSearchOutputTunedPreview


class CompareIndexSearchOutput(TypedDict):
    saved: CompareIndexSearchOutputSaved
    tuned: CompareIndexSearchOutputTuned


class CompleteUploadInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    upload_id: str


class CompleteUploadOutputFileFailure(TypedDict):
    code: str
    message: str


class CompleteUploadOutputFileUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class CompleteUploadOutputFileUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: CompleteUploadOutputFileUnreadPartsItemFailure


class CompleteUploadOutputFile(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: CompleteUploadOutputFileFailure | None
    unread_parts: list[CompleteUploadOutputFileUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class CompleteUploadOutputFailure(TypedDict):
    code: str
    message: str


class CompleteUploadOutput(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    address: str | None
    size_bytes: float
    content_sha256: str
    method: Literal["single", "multipart"]
    part_bytes: float
    part_count: float
    state: Literal["open", "checking", "completed", "failed"]
    outcome: Literal["added", "new_version", "unchanged"] | None
    file: CompleteUploadOutputFile | None
    failure: CompleteUploadOutputFailure | None
    created_at: str
    deadline_at: str


class ConfirmSecondFactorSetupInput(TypedDict):
    code: str


class ConfirmSecondFactorSetupOutputSessionAccount(TypedDict):
    id: str
    email: str
    name: str
    status: Literal["pending", "approved", "rejected"]
    created_at: str
    decided_at: str | None
    is_operator: bool


class ConfirmSecondFactorSetupOutputSession(TypedDict):
    account: ConfirmSecondFactorSetupOutputSessionAccount
    second_factor_enabled: bool
    expires_at: str


class ConfirmSecondFactorSetupOutput(TypedDict):
    session_token: str
    session: ConfirmSecondFactorSetupOutputSession


class CreateApiKeyInputPermissionsFull(TypedDict):
    access: Literal["full"]


class _CreateApiKeyInputPermissionsRestrictedDatabasesRequired(TypedDict):
    level: Literal["none", "read", "write"]


class CreateApiKeyInputPermissionsRestrictedDatabases(
    _CreateApiKeyInputPermissionsRestrictedDatabasesRequired, total=False
):
    resource_ids: Sequence[str] | None


class _CreateApiKeyInputPermissionsRestrictedIndexesRequired(TypedDict):
    level: Literal["none", "read", "write"]


class CreateApiKeyInputPermissionsRestrictedIndexes(
    _CreateApiKeyInputPermissionsRestrictedIndexesRequired, total=False
):
    resource_ids: Sequence[str] | None


class _CreateApiKeyInputPermissionsRestrictedKnowledgeBasesRequired(TypedDict):
    level: Literal["none", "read", "write"]


class CreateApiKeyInputPermissionsRestrictedKnowledgeBases(
    _CreateApiKeyInputPermissionsRestrictedKnowledgeBasesRequired, total=False
):
    resource_ids: Sequence[str] | None


class CreateApiKeyInputPermissionsRestrictedMemory(TypedDict):
    level: Literal["none", "read", "write"]


class _CreateApiKeyInputPermissionsRestrictedRequired(TypedDict):
    access: Literal["restricted"]


class CreateApiKeyInputPermissionsRestricted(
    _CreateApiKeyInputPermissionsRestrictedRequired, total=False
):
    databases: CreateApiKeyInputPermissionsRestrictedDatabases
    indexes: CreateApiKeyInputPermissionsRestrictedIndexes
    knowledge_bases: CreateApiKeyInputPermissionsRestrictedKnowledgeBases
    memory: CreateApiKeyInputPermissionsRestrictedMemory


class _CreateApiKeyInputRequired(TypedDict):
    project_id: str
    name: str
    permissions: CreateApiKeyInputPermissionsFull | CreateApiKeyInputPermissionsRestricted


class CreateApiKeyInput(_CreateApiKeyInputRequired, total=False):
    expires_at: str | None


class CreateApiKeyOutputApiKeyPermissionsDatabases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class CreateApiKeyOutputApiKeyPermissionsIndexes(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class CreateApiKeyOutputApiKeyPermissionsKnowledgeBases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class CreateApiKeyOutputApiKeyPermissionsMemory(TypedDict):
    level: Literal["none", "read", "write"]


class CreateApiKeyOutputApiKeyPermissions(TypedDict):
    access: Literal["full", "restricted"]
    databases: CreateApiKeyOutputApiKeyPermissionsDatabases
    indexes: CreateApiKeyOutputApiKeyPermissionsIndexes
    knowledge_bases: CreateApiKeyOutputApiKeyPermissionsKnowledgeBases
    memory: CreateApiKeyOutputApiKeyPermissionsMemory


class CreateApiKeyOutputApiKey(TypedDict):
    id: str
    project_id: str
    name: str
    display_prefix: str
    permissions: CreateApiKeyOutputApiKeyPermissions
    permissions_changed_at: str | None
    permissions_changed_by_name: str | None
    created_by: str
    created_by_name: str
    created_at: str
    expires_at: str | None
    last_used_at: str | None
    revoked_at: str | None


class CreateApiKeyOutput(TypedDict):
    api_key: CreateApiKeyOutputApiKey
    secret: str


class CreateCorrectionInputSettingFieldBoost(TypedDict):
    kind: Literal["field_boost"]
    text: float
    heading: float


class CreateCorrectionInputSettingOption1(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["rrf"]
    rank_constant: int


class CreateCorrectionInputSettingOption2(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["linear"]
    vector_weight: float


class CreateCorrectionInputSettingBm25(TypedDict):
    kind: Literal["bm25"]
    k1: float
    b: float


class CreateCorrectionInputSettingStopWords(TypedDict):
    kind: Literal["stop_words"]
    added: Sequence[str]
    removed: Sequence[str]


class CreateCorrectionInputSettingSynonymsRulesItemOption1(TypedDict):
    word: str
    synonyms: Sequence[str]


class CreateCorrectionInputSettingSynonymsRulesItemOption2(TypedDict):
    words: Sequence[str]


class CreateCorrectionInputSettingSynonyms(TypedDict):
    kind: Literal["synonyms"]
    rules: Sequence[
        CreateCorrectionInputSettingSynonymsRulesItemOption1
        | CreateCorrectionInputSettingSynonymsRulesItemOption2
    ]


class CreateCorrectionInputSettingLanguage(TypedDict):
    kind: Literal["language"]
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]


class CreateCorrectionInputSettingChunking(TypedDict):
    kind: Literal["chunking"]
    chunk_tokens: int


class CreateCorrectionInputSettingRebuild(TypedDict):
    kind: Literal["rebuild"]


class CreateCorrectionInputSettingAgentDepth(TypedDict):
    kind: Literal["agent_depth"]
    depth: int | str


class _CreateCorrectionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    setting: (
        CreateCorrectionInputSettingFieldBoost
        | CreateCorrectionInputSettingOption1
        | CreateCorrectionInputSettingOption2
        | CreateCorrectionInputSettingBm25
        | CreateCorrectionInputSettingStopWords
        | CreateCorrectionInputSettingSynonyms
        | CreateCorrectionInputSettingLanguage
        | CreateCorrectionInputSettingChunking
        | CreateCorrectionInputSettingRebuild
        | CreateCorrectionInputSettingAgentDepth
    )


class CreateCorrectionInput(_CreateCorrectionInputRequired, total=False):
    target_ids: Sequence[str]


class CreateCorrectionOutputSettingFieldBoost(TypedDict):
    kind: Literal["field_boost"]
    text: float
    heading: float


class CreateCorrectionOutputSettingOption1(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["rrf"]
    rank_constant: int


class CreateCorrectionOutputSettingOption2(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["linear"]
    vector_weight: float


class CreateCorrectionOutputSettingBm25(TypedDict):
    kind: Literal["bm25"]
    k1: float
    b: float


class CreateCorrectionOutputSettingStopWords(TypedDict):
    kind: Literal["stop_words"]
    added: list[str]
    removed: list[str]


class CreateCorrectionOutputSettingSynonymsRulesItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class CreateCorrectionOutputSettingSynonymsRulesItemOption2(TypedDict):
    words: list[str]


class CreateCorrectionOutputSettingSynonyms(TypedDict):
    kind: Literal["synonyms"]
    rules: list[
        CreateCorrectionOutputSettingSynonymsRulesItemOption1
        | CreateCorrectionOutputSettingSynonymsRulesItemOption2
    ]


class CreateCorrectionOutputSettingLanguage(TypedDict):
    kind: Literal["language"]
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]


class CreateCorrectionOutputSettingChunking(TypedDict):
    kind: Literal["chunking"]
    chunk_tokens: int


class CreateCorrectionOutputSettingRebuild(TypedDict):
    kind: Literal["rebuild"]


class CreateCorrectionOutputSettingAgentDepth(TypedDict):
    kind: Literal["agent_depth"]
    depth: float


class CreateCorrectionOutputEstimate(TypedDict):
    seconds: float
    memory_bytes: float
    second_index: bool
    chunks_to_index: float
    questions_to_score: float
    price_usd: float | None


class CreateCorrectionOutputBeforeTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class CreateCorrectionOutputBeforeHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class CreateCorrectionOutputBefore(TypedDict):
    scorecard_id: str | None
    tuning: CreateCorrectionOutputBeforeTuning
    held_back: CreateCorrectionOutputBeforeHeldBack


class CreateCorrectionOutputAfterTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class CreateCorrectionOutputAfterHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class CreateCorrectionOutputAfter(TypedDict):
    scorecard_id: str | None
    tuning: CreateCorrectionOutputAfterTuning
    held_back: CreateCorrectionOutputAfterHeldBack


class CreateCorrectionOutputQuestionChanges(TypedDict):
    now_pass: float
    now_fail: float
    moved_up: float
    moved_down: float


class CreateCorrectionOutput(TypedDict):
    id: str
    origin: Literal["himring", "engineer"]
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )
    kind: Literal[
        "field_boost",
        "fusion",
        "bm25",
        "stop_words",
        "synonyms",
        "language",
        "chunking",
        "rebuild",
        "agent_depth",
    ]
    setting: (
        CreateCorrectionOutputSettingFieldBoost
        | CreateCorrectionOutputSettingOption1
        | CreateCorrectionOutputSettingOption2
        | CreateCorrectionOutputSettingBm25
        | CreateCorrectionOutputSettingStopWords
        | CreateCorrectionOutputSettingSynonyms
        | CreateCorrectionOutputSettingLanguage
        | CreateCorrectionOutputSettingChunking
        | CreateCorrectionOutputSettingRebuild
        | CreateCorrectionOutputSettingAgentDepth
    )
    target_ids: list[str]
    file_kinds: list[
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    ]
    status: Literal["proposed", "trying", "tried", "promoting", "promoted", "discarded", "failed"]
    pass_id: str | None
    estimate: CreateCorrectionOutputEstimate
    before: CreateCorrectionOutputBefore | None
    after: CreateCorrectionOutputAfter | None
    verdict: Literal[
        "untried",
        "trying",
        "promoted",
        "waits_for_person",
        "waits_for_held_back",
        "lowers_held_back",
        "no_gain",
        "discarded",
        "failed",
    ]
    question_changes: CreateCorrectionOutputQuestionChanges | None
    waits_for_click: bool
    wait_reason: str | None
    decided_by: Literal["himring", "engineer"] | None
    decision_note: str | None
    failure_message: str | None
    created_at: str
    tried_at: str | None
    decided_at: str | None


class CreateDatabaseInputMigrationsItem(TypedDict):
    name: str
    sql: str


class _CreateDatabaseInputRequired(TypedDict):
    project_id: str
    name: str


class CreateDatabaseInput(_CreateDatabaseInputRequired, total=False):
    migrations: Sequence[CreateDatabaseInputMigrationsItem]
    sql_write_preview: bool


class CreateDatabaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class CreateDatabaseOutputSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class CreateDatabaseOutputCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class CreateDatabaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: CreateDatabaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: CreateDatabaseOutputSize | None
    compaction: CreateDatabaseOutputCompaction | None
    sql_write_preview: bool


class CreateIndexInputConfigEmbedding(TypedDict):
    fields: Mapping[str, str | Sequence[str]]


class CreateIndexInputConfigBm25(TypedDict, total=False):
    k1: float
    b: float


class CreateIndexInputConfigSynonymsItemOption1(TypedDict):
    word: str
    synonyms: Sequence[str]


class CreateIndexInputConfigSynonymsItemOption2(TypedDict):
    words: Sequence[str]


class _CreateIndexInputConfigRequired(TypedDict):
    schema: Mapping[str, str | Mapping[str, str | Mapping[str, str | Mapping[str, str]]]]


class CreateIndexInputConfig(_CreateIndexInputConfigRequired, total=False):
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]
    embedding: CreateIndexInputConfigEmbedding
    required: Sequence[str]
    strict: bool
    trackPositions: bool
    defaultScoring: Literal["local", "dfs", "broadcast"]
    bm25: CreateIndexInputConfigBm25
    synonyms: Sequence[
        CreateIndexInputConfigSynonymsItemOption1 | CreateIndexInputConfigSynonymsItemOption2
    ]
    stopWords: Sequence[str]


class CreateIndexInput(TypedDict):
    project_id: str
    name: str
    config: CreateIndexInputConfig


class CreateIndexOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class CreateIndexOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: CreateIndexOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class _CreateKnowledgeBaseInputRequired(TypedDict):
    project_id: str
    name: str


class CreateKnowledgeBaseInput(_CreateKnowledgeBaseInputRequired, total=False):
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]
    chunk_tokens: int | str
    question_log_retention_days: int | str | None


class CreateKnowledgeBaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class CreateKnowledgeBaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    language: str
    chunk_tokens: float
    question_log_retention_days: float | None
    created_at: str
    created_by: CreateKnowledgeBaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    database_id: str
    live_index_id: str
    sirannon_url: str
    search_pending_since: str | None


class _CreateMemorySourceInputRequired(TypedDict):
    project_id: str
    memory_id: str
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]


class CreateMemorySourceInput(_CreateMemorySourceInputRequired, total=False):
    sorting: Literal["full", "rules_only", "as_given"]
    settings: Mapping[str, object]
    credentials: Mapping[str, object]


class CreateMemorySourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class CreateMemorySourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class CreateMemorySourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class CreateMemorySourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: CreateMemorySourceOutputSignIn | None
    created_at: str
    created_by: CreateMemorySourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: CreateMemorySourceOutputLastError | None
    webhook_secret: str | None


class CreateProjectInput(TypedDict):
    name: str


class CreateProjectOutput(TypedDict):
    id: str
    name: str
    region: str
    role: Literal["owner", "member"] | None
    created_at: str
    deleted_at: str | None
    purge_after: str | None
    sirannon_url: str
    narsil_url: str


class _CreateSourceInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]


class CreateSourceInput(_CreateSourceInputRequired, total=False):
    settings: Mapping[str, object]
    credentials: Mapping[str, object]


class CreateSourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class CreateSourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class CreateSourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class CreateSourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: CreateSourceOutputSignIn | None
    created_at: str
    created_by: CreateSourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: CreateSourceOutputLastError | None
    webhook_secret: str | None


class CreateTableInputColumnsItemDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class CreateTableInputColumnsItemDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class CreateTableInputColumnsItemDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class CreateTableInputColumnsItemDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class _CreateTableInputColumnsItemReferencesRequired(TypedDict):
    table: str
    column: str


class CreateTableInputColumnsItemReferences(
    _CreateTableInputColumnsItemReferencesRequired, total=False
):
    on_delete: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]
    on_update: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]


class _CreateTableInputColumnsItemRequired(TypedDict):
    name: str
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class CreateTableInputColumnsItem(_CreateTableInputColumnsItemRequired, total=False):
    not_null: bool
    default: (
        CreateTableInputColumnsItemDefaultValue
        | CreateTableInputColumnsItemDefaultCurrentTimestamp
        | CreateTableInputColumnsItemDefaultCurrentDate
        | CreateTableInputColumnsItemDefaultCurrentTime
        | None
    )
    primary_key: bool
    unique: bool
    references: CreateTableInputColumnsItemReferences | None


class CreateTableInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    columns: Sequence[CreateTableInputColumnsItem]
    expected_migration_version: int | str


class CreateTableOutputMigration(TypedDict):
    version: float
    name: str
    sql: str
    added_at: str


class CreateTableOutputPreview(TypedDict):
    table_name: str
    migration_name: str
    sql: str
    base_migration_version: float


class CreateTableOutput(TypedDict):
    migration: CreateTableOutputMigration
    preview: CreateTableOutputPreview


class _CreateUploadInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    path: str
    size_bytes: int
    content_sha256: str


class CreateUploadInput(_CreateUploadInputRequired, total=False):
    address: str
    metadata: Mapping[str, str] | str


class CreateUploadOutputUploadFileFailure(TypedDict):
    code: str
    message: str


class CreateUploadOutputUploadFileUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class CreateUploadOutputUploadFileUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: CreateUploadOutputUploadFileUnreadPartsItemFailure


class CreateUploadOutputUploadFile(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: CreateUploadOutputUploadFileFailure | None
    unread_parts: list[CreateUploadOutputUploadFileUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class CreateUploadOutputUploadFailure(TypedDict):
    code: str
    message: str


class CreateUploadOutputUpload(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    address: str | None
    size_bytes: float
    content_sha256: str
    method: Literal["single", "multipart"]
    part_bytes: float
    part_count: float
    state: Literal["open", "checking", "completed", "failed"]
    outcome: Literal["added", "new_version", "unchanged"] | None
    file: CreateUploadOutputUploadFile | None
    failure: CreateUploadOutputUploadFailure | None
    created_at: str
    deadline_at: str


class CreateUploadOutputPartsItem(TypedDict):
    part_number: float
    size_bytes: float
    method: Literal["PUT"]
    url: str
    headers: dict[str, str]
    expires_at: str


class CreateUploadOutput(TypedDict):
    upload: CreateUploadOutputUpload
    parts: list[CreateUploadOutputPartsItem]


class DeleteDatabaseInput(TypedDict):
    project_id: str
    database_id: str


class DeleteDatabaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class DeleteDatabaseOutputSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class DeleteDatabaseOutputCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class DeleteDatabaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: DeleteDatabaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: DeleteDatabaseOutputSize | None
    compaction: DeleteDatabaseOutputCompaction | None
    sql_write_preview: bool


class DeleteFileInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    file_id: str


class DeleteFileOutputFailure(TypedDict):
    code: str
    message: str


class DeleteFileOutputUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class DeleteFileOutputUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: DeleteFileOutputUnreadPartsItemFailure


class DeleteFileOutput(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: DeleteFileOutputFailure | None
    unread_parts: list[DeleteFileOutputUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class DeleteIndexInput(TypedDict):
    project_id: str
    index_id: str


class DeleteIndexOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class DeleteIndexOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: DeleteIndexOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class DeleteIndexRecordInput(TypedDict):
    project_id: str
    index_id: str
    record_id: str


class DeleteIndexRecordOutput(TypedDict):
    id: str


class DeleteKnowledgeBaseInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class DeleteKnowledgeBaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class DeleteKnowledgeBaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    language: str
    chunk_tokens: float
    question_log_retention_days: float | None
    created_at: str
    created_by: DeleteKnowledgeBaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    database_id: str
    live_index_id: str
    sirannon_url: str
    search_pending_since: str | None


class DeleteMemoryInput(TypedDict):
    project_id: str
    memory_id: str


class DeleteMemoryOutputSettingsSubjectsItem(TypedDict):
    subject: str
    owner_id: str | None
    sensitive: bool


class DeleteMemoryOutputSettingsAgentPermissions(TypedDict):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class DeleteMemoryOutputSettingsCueWeightsStatementKind(TypedDict):
    statement: float
    event: float
    promise: float
    procedure: float
    instruction: float


class DeleteMemoryOutputSettingsCueWeightsAuthorKind(TypedDict):
    staff: float
    agent: float
    end_user: float
    outsider: float
    records: float
    code: float


class DeleteMemoryOutputSettingsCueWeights(TypedDict):
    statement_kind: DeleteMemoryOutputSettingsCueWeightsStatementKind
    author_kind: DeleteMemoryOutputSettingsCueWeightsAuthorKind
    subject_owner: float
    private_channel: float
    reactions_for_second_voice: float


class DeleteMemoryOutputSettings(TypedDict):
    duplicate_threshold: float
    confidence_threshold: float
    agreeing_authors_for_confirmed: float
    first_pack_tokens: float
    recall_fade_days: float
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: list[str] | None
    subjects: list[DeleteMemoryOutputSettingsSubjectsItem]
    sources_for_likely: float
    agent_permissions: DeleteMemoryOutputSettingsAgentPermissions
    dropped_list_days: float | None
    replaced_retention_days: float | None
    message_retention_days: float | None
    personal_retention_days: float | None
    recall_log_retention_days: float | None
    ready_set_size: float
    recall_depth: float
    cue_weights: DeleteMemoryOutputSettingsCueWeights
    recall_checked_memories: float


class DeleteMemoryOutputCheckedKnowledgeBasesLeftOutItem(TypedDict):
    knowledge_base_id: str
    reason: Literal["over_limit", "deleted", "not_found", "not_ready", "in_another_cell"]


class DeleteMemoryOutputCheckedKnowledgeBases(TypedDict):
    knowledge_base_ids: list[str]
    left_out: list[DeleteMemoryOutputCheckedKnowledgeBasesLeftOutItem]
    left_out_count: float
    limit: float


class DeleteMemoryOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class DeleteMemoryOutput(TypedDict):
    id: str
    project_id: str
    language: str
    settings: DeleteMemoryOutputSettings
    checked_knowledge_bases: DeleteMemoryOutputCheckedKnowledgeBases
    created_at: str
    created_by: DeleteMemoryOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    sorting_pending_since: str | None


class DeleteMemorySavedQuestionInput(TypedDict):
    project_id: str
    memory_id: str
    saved_question_id: str


class DeleteMemorySavedQuestionOutput(TypedDict):
    id: str
    question: str
    stored_memory_id: str
    memory_text: str | None
    end_user_id: str | None
    team_id: str | None
    rank: float | None
    flag: Literal["memory_replaced", "memory_forgotten"] | None
    replaced_by: str | None
    created_at: str


class DeleteMemorySourceInput(TypedDict):
    project_id: str
    memory_id: str
    source_id: str


class DeleteMemorySourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class DeleteMemorySourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class DeleteMemorySourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class DeleteMemorySourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: DeleteMemorySourceOutputSignIn | None
    created_at: str
    created_by: DeleteMemorySourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: DeleteMemorySourceOutputLastError | None


class DeleteProjectInput(TypedDict):
    project_id: str


class DeleteProjectOutput(TypedDict):
    id: str
    name: str
    region: str
    role: Literal["owner", "member"] | None
    created_at: str
    deleted_at: str | None
    purge_after: str | None
    sirannon_url: str
    narsil_url: str


class DeleteSavedQueryInput(TypedDict):
    project_id: str
    database_id: str
    saved_query_id: str


class DeleteSavedQueryOutput(TypedDict):
    deleted: Literal[True]


class DeleteSavedQuestionInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    saved_question_id: str


class DeleteSavedQuestionOutputPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class DeleteSavedQuestionOutputPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class DeleteSavedQuestionOutputPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[DeleteSavedQuestionOutputPassageCitationDocumentAreasItem]
    page_sizes: list[DeleteSavedQuestionOutputPassageCitationDocumentPageSizesItem]


class DeleteSavedQuestionOutputPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class DeleteSavedQuestionOutputPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class DeleteSavedQuestionOutputPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class DeleteSavedQuestionOutputPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class DeleteSavedQuestionOutputPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class DeleteSavedQuestionOutputPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[DeleteSavedQuestionOutputPassageCitationImageAreasItem]
    page_sizes: list[DeleteSavedQuestionOutputPassageCitationImagePageSizesItem]


class DeleteSavedQuestionOutputPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class DeleteSavedQuestionOutputPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        DeleteSavedQuestionOutputPassageCitationDocument
        | DeleteSavedQuestionOutputPassageCitationSpreadsheet
        | DeleteSavedQuestionOutputPassageCitationSlides
        | DeleteSavedQuestionOutputPassageCitationWebPage
        | DeleteSavedQuestionOutputPassageCitationImage
        | DeleteSavedQuestionOutputPassageCitationRecording
        | None
    )


class DeleteSavedQuestionOutputBrokenPrevious(TypedDict):
    version: float
    first_position: float
    last_position: float


class DeleteSavedQuestionOutputBroken(TypedDict):
    change: Literal["changed", "moved", "removed"]
    version: float | None
    detected_at: str
    previous: DeleteSavedQuestionOutputBrokenPrevious | None


class DeleteSavedQuestionOutput(TypedDict):
    id: str
    question: str
    split: Literal["tuning", "held_back"]
    source: Literal["question_log", "file", "api", "judge"]
    question_log_id: str | None
    end_user_id: str | None
    passage: DeleteSavedQuestionOutputPassage
    broken: DeleteSavedQuestionOutputBroken | None
    created_at: str
    updated_at: str


class DeleteSourceInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class DeleteSourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class DeleteSourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class DeleteSourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class DeleteSourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: DeleteSourceOutputSignIn | None
    created_at: str
    created_by: DeleteSourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: DeleteSourceOutputLastError | None


class DeleteTableRowsInputKeysItemItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class DeleteTableRowsInputKeysItemItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class DeleteTableRowsInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    keys: Sequence[
        Sequence[
            float
            | str
            | DeleteTableRowsInputKeysItemItemInteger
            | DeleteTableRowsInputKeysItemItemBlob
            | None
        ]
    ]


class DeleteTableRowsOutput(TypedDict):
    deleted: float


class _DiscardCorrectionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    correction_id: str


class DiscardCorrectionInput(_DiscardCorrectionInputRequired, total=False):
    note: str


class DiscardCorrectionOutputSettingFieldBoost(TypedDict):
    kind: Literal["field_boost"]
    text: float
    heading: float


class DiscardCorrectionOutputSettingOption1(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["rrf"]
    rank_constant: int


class DiscardCorrectionOutputSettingOption2(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["linear"]
    vector_weight: float


class DiscardCorrectionOutputSettingBm25(TypedDict):
    kind: Literal["bm25"]
    k1: float
    b: float


class DiscardCorrectionOutputSettingStopWords(TypedDict):
    kind: Literal["stop_words"]
    added: list[str]
    removed: list[str]


class DiscardCorrectionOutputSettingSynonymsRulesItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class DiscardCorrectionOutputSettingSynonymsRulesItemOption2(TypedDict):
    words: list[str]


class DiscardCorrectionOutputSettingSynonyms(TypedDict):
    kind: Literal["synonyms"]
    rules: list[
        DiscardCorrectionOutputSettingSynonymsRulesItemOption1
        | DiscardCorrectionOutputSettingSynonymsRulesItemOption2
    ]


class DiscardCorrectionOutputSettingLanguage(TypedDict):
    kind: Literal["language"]
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]


class DiscardCorrectionOutputSettingChunking(TypedDict):
    kind: Literal["chunking"]
    chunk_tokens: int


class DiscardCorrectionOutputSettingRebuild(TypedDict):
    kind: Literal["rebuild"]


class DiscardCorrectionOutputSettingAgentDepth(TypedDict):
    kind: Literal["agent_depth"]
    depth: float


class DiscardCorrectionOutputEstimate(TypedDict):
    seconds: float
    memory_bytes: float
    second_index: bool
    chunks_to_index: float
    questions_to_score: float
    price_usd: float | None


class DiscardCorrectionOutputBeforeTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class DiscardCorrectionOutputBeforeHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class DiscardCorrectionOutputBefore(TypedDict):
    scorecard_id: str | None
    tuning: DiscardCorrectionOutputBeforeTuning
    held_back: DiscardCorrectionOutputBeforeHeldBack


class DiscardCorrectionOutputAfterTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class DiscardCorrectionOutputAfterHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class DiscardCorrectionOutputAfter(TypedDict):
    scorecard_id: str | None
    tuning: DiscardCorrectionOutputAfterTuning
    held_back: DiscardCorrectionOutputAfterHeldBack


class DiscardCorrectionOutputQuestionChanges(TypedDict):
    now_pass: float
    now_fail: float
    moved_up: float
    moved_down: float


class DiscardCorrectionOutput(TypedDict):
    id: str
    origin: Literal["himring", "engineer"]
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )
    kind: Literal[
        "field_boost",
        "fusion",
        "bm25",
        "stop_words",
        "synonyms",
        "language",
        "chunking",
        "rebuild",
        "agent_depth",
    ]
    setting: (
        DiscardCorrectionOutputSettingFieldBoost
        | DiscardCorrectionOutputSettingOption1
        | DiscardCorrectionOutputSettingOption2
        | DiscardCorrectionOutputSettingBm25
        | DiscardCorrectionOutputSettingStopWords
        | DiscardCorrectionOutputSettingSynonyms
        | DiscardCorrectionOutputSettingLanguage
        | DiscardCorrectionOutputSettingChunking
        | DiscardCorrectionOutputSettingRebuild
        | DiscardCorrectionOutputSettingAgentDepth
    )
    target_ids: list[str]
    file_kinds: list[
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    ]
    status: Literal["proposed", "trying", "tried", "promoting", "promoted", "discarded", "failed"]
    pass_id: str | None
    estimate: DiscardCorrectionOutputEstimate
    before: DiscardCorrectionOutputBefore | None
    after: DiscardCorrectionOutputAfter | None
    verdict: Literal[
        "untried",
        "trying",
        "promoted",
        "waits_for_person",
        "waits_for_held_back",
        "lowers_held_back",
        "no_gain",
        "discarded",
        "failed",
    ]
    question_changes: DiscardCorrectionOutputQuestionChanges | None
    waits_for_click: bool
    wait_reason: str | None
    decided_by: Literal["himring", "engineer"] | None
    decision_note: str | None
    failure_message: str | None
    created_at: str
    tried_at: str | None
    decided_at: str | None


class DiscardTableImportInput(TypedDict):
    project_id: str
    database_id: str
    import_id: str


class DiscardTableImportOutput(TypedDict):
    discarded: Literal[True]


class DismissFlaggedQuestionInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    question_id: str


class DismissFlaggedQuestionOutput(TypedDict):
    question_id: str
    question: str
    end_user_id: str | None
    status: Literal["waiting", "saved", "unsure", "unanswerable"]
    signals: list[
        Literal[
            "handoff",
            "thumbs_down",
            "verdict",
            "unsupported_answer",
            "repeated_question",
            "near_saved_question",
            "passage_changed",
            "follow_ups_past_limit",
        ]
    ]
    flagged_at: str
    judged_at: str | None
    probability: float | None
    chosen_rank: float | None
    saved_question_id: str | None
    settled_by: Literal["judge", "person"] | None


class DownloadIndexInput(TypedDict):
    project_id: str
    index_id: str


class _EnableMemoryInputSubjectsItemRequired(TypedDict):
    subject: str


class EnableMemoryInputSubjectsItem(_EnableMemoryInputSubjectsItemRequired, total=False):
    owner_id: str | None
    sensitive: bool


class EnableMemoryInputAgentPermissions(TypedDict, total=False):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class EnableMemoryInputCueWeightsStatementKind(TypedDict, total=False):
    statement: float | str
    event: float | str
    promise: float | str
    procedure: float | str
    instruction: float | str


class EnableMemoryInputCueWeightsAuthorKind(TypedDict, total=False):
    staff: float | str
    agent: float | str
    end_user: float | str
    outsider: float | str
    records: float | str
    code: float | str


class EnableMemoryInputCueWeights(TypedDict, total=False):
    statement_kind: EnableMemoryInputCueWeightsStatementKind
    author_kind: EnableMemoryInputCueWeightsAuthorKind
    subject_owner: float | str
    private_channel: float | str
    reactions_for_second_voice: int | str


class _EnableMemoryInputRequired(TypedDict):
    project_id: str


class EnableMemoryInput(_EnableMemoryInputRequired, total=False):
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: Sequence[str]
    duplicate_threshold: float | str
    confidence_threshold: float | str
    agreeing_authors_for_confirmed: int | str
    first_pack_tokens: int | str
    recall_fade_days: float | str
    subjects: Sequence[EnableMemoryInputSubjectsItem]
    sources_for_likely: int | str
    agent_permissions: EnableMemoryInputAgentPermissions
    dropped_list_days: int | str | None
    replaced_retention_days: int | str | None
    message_retention_days: int | str | None
    personal_retention_days: int | str | None
    recall_log_retention_days: int | str | None
    ready_set_size: int | str
    recall_depth: int | str
    cue_weights: EnableMemoryInputCueWeights


class EnableMemoryOutputSettingsSubjectsItem(TypedDict):
    subject: str
    owner_id: str | None
    sensitive: bool


class EnableMemoryOutputSettingsAgentPermissions(TypedDict):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class EnableMemoryOutputSettingsCueWeightsStatementKind(TypedDict):
    statement: float
    event: float
    promise: float
    procedure: float
    instruction: float


class EnableMemoryOutputSettingsCueWeightsAuthorKind(TypedDict):
    staff: float
    agent: float
    end_user: float
    outsider: float
    records: float
    code: float


class EnableMemoryOutputSettingsCueWeights(TypedDict):
    statement_kind: EnableMemoryOutputSettingsCueWeightsStatementKind
    author_kind: EnableMemoryOutputSettingsCueWeightsAuthorKind
    subject_owner: float
    private_channel: float
    reactions_for_second_voice: float


class EnableMemoryOutputSettings(TypedDict):
    duplicate_threshold: float
    confidence_threshold: float
    agreeing_authors_for_confirmed: float
    first_pack_tokens: float
    recall_fade_days: float
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: list[str] | None
    subjects: list[EnableMemoryOutputSettingsSubjectsItem]
    sources_for_likely: float
    agent_permissions: EnableMemoryOutputSettingsAgentPermissions
    dropped_list_days: float | None
    replaced_retention_days: float | None
    message_retention_days: float | None
    personal_retention_days: float | None
    recall_log_retention_days: float | None
    ready_set_size: float
    recall_depth: float
    cue_weights: EnableMemoryOutputSettingsCueWeights
    recall_checked_memories: float


class EnableMemoryOutputCheckedKnowledgeBasesLeftOutItem(TypedDict):
    knowledge_base_id: str
    reason: Literal["over_limit", "deleted", "not_found", "not_ready", "in_another_cell"]


class EnableMemoryOutputCheckedKnowledgeBases(TypedDict):
    knowledge_base_ids: list[str]
    left_out: list[EnableMemoryOutputCheckedKnowledgeBasesLeftOutItem]
    left_out_count: float
    limit: float


class EnableMemoryOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class EnableMemoryOutput(TypedDict):
    id: str
    project_id: str
    language: str
    settings: EnableMemoryOutputSettings
    checked_knowledge_bases: EnableMemoryOutputCheckedKnowledgeBases
    created_at: str
    created_by: EnableMemoryOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    sorting_pending_since: str | None


class EraseEndUserInput(TypedDict):
    project_id: str
    end_user_id: str


class EraseEndUserOutput(TypedDict):
    end_user_id: str
    erased_questions: float
    knowledge_bases: float
    erased_memories: float
    erased_messages: float


class ExportIndexRecordsInput(TypedDict):
    project_id: str
    index_id: str


class _ExportMemoriesInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ExportMemoriesInput(_ExportMemoriesInputRequired, total=False):
    end_user_id: str
    after: str


class ExportTableRowsInputFiltersItemValueInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ExportTableRowsInputFiltersItemValueBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class ExportTableRowsInputFiltersItemValueItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ExportTableRowsInputFiltersItemValueItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class _ExportTableRowsInputFiltersItemRequired(TypedDict):
    column: str
    operator: Literal[
        "eq", "neq", "gt", "gte", "lt", "lte", "like", "not_like", "in", "is_null", "is_not_null"
    ]


class ExportTableRowsInputFiltersItem(_ExportTableRowsInputFiltersItemRequired, total=False):
    value: (
        float
        | str
        | ExportTableRowsInputFiltersItemValueInteger
        | ExportTableRowsInputFiltersItemValueBlob
        | Sequence[
            float
            | str
            | ExportTableRowsInputFiltersItemValueItemInteger
            | ExportTableRowsInputFiltersItemValueItemBlob
            | None
        ]
        | None
    )


class _ExportTableRowsInputSortsItemRequired(TypedDict):
    column: str


class ExportTableRowsInputSortsItem(_ExportTableRowsInputSortsItemRequired, total=False):
    direction: Literal["asc", "desc"]


class _ExportTableRowsInputRequired(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    format: Literal["csv", "json", "sql"]


class ExportTableRowsInput(_ExportTableRowsInputRequired, total=False):
    filters: Sequence[ExportTableRowsInputFiltersItem]
    sorts: Sequence[ExportTableRowsInputSortsItem]


class FinishSourceSignInInput(TypedDict):
    state: str
    code: str


class FinishSourceSignInOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class FinishSourceSignInOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class FinishSourceSignInOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class FinishSourceSignInOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: FinishSourceSignInOutputSignIn | None
    created_at: str
    created_by: FinishSourceSignInOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: FinishSourceSignInOutputLastError | None


class ForgetMemoryInput(TypedDict):
    project_id: str
    memory_id: str
    stored_memory_id: str


class ForgetMemoryOutputPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class ForgetMemoryOutputSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class ForgetMemoryOutput(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: ForgetMemoryOutputPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[ForgetMemoryOutputSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class GetCorrectionInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    correction_id: str


class GetCorrectionOutputSettingFieldBoost(TypedDict):
    kind: Literal["field_boost"]
    text: float
    heading: float


class GetCorrectionOutputSettingOption1(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["rrf"]
    rank_constant: int


class GetCorrectionOutputSettingOption2(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["linear"]
    vector_weight: float


class GetCorrectionOutputSettingBm25(TypedDict):
    kind: Literal["bm25"]
    k1: float
    b: float


class GetCorrectionOutputSettingStopWords(TypedDict):
    kind: Literal["stop_words"]
    added: list[str]
    removed: list[str]


class GetCorrectionOutputSettingSynonymsRulesItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class GetCorrectionOutputSettingSynonymsRulesItemOption2(TypedDict):
    words: list[str]


class GetCorrectionOutputSettingSynonyms(TypedDict):
    kind: Literal["synonyms"]
    rules: list[
        GetCorrectionOutputSettingSynonymsRulesItemOption1
        | GetCorrectionOutputSettingSynonymsRulesItemOption2
    ]


class GetCorrectionOutputSettingLanguage(TypedDict):
    kind: Literal["language"]
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]


class GetCorrectionOutputSettingChunking(TypedDict):
    kind: Literal["chunking"]
    chunk_tokens: int


class GetCorrectionOutputSettingRebuild(TypedDict):
    kind: Literal["rebuild"]


class GetCorrectionOutputSettingAgentDepth(TypedDict):
    kind: Literal["agent_depth"]
    depth: float


class GetCorrectionOutputEstimate(TypedDict):
    seconds: float
    memory_bytes: float
    second_index: bool
    chunks_to_index: float
    questions_to_score: float
    price_usd: float | None


class GetCorrectionOutputBeforeTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class GetCorrectionOutputBeforeHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class GetCorrectionOutputBefore(TypedDict):
    scorecard_id: str | None
    tuning: GetCorrectionOutputBeforeTuning
    held_back: GetCorrectionOutputBeforeHeldBack


class GetCorrectionOutputAfterTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class GetCorrectionOutputAfterHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class GetCorrectionOutputAfter(TypedDict):
    scorecard_id: str | None
    tuning: GetCorrectionOutputAfterTuning
    held_back: GetCorrectionOutputAfterHeldBack


class GetCorrectionOutputQuestionChanges(TypedDict):
    now_pass: float
    now_fail: float
    moved_up: float
    moved_down: float


class GetCorrectionOutput(TypedDict):
    id: str
    origin: Literal["himring", "engineer"]
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )
    kind: Literal[
        "field_boost",
        "fusion",
        "bm25",
        "stop_words",
        "synonyms",
        "language",
        "chunking",
        "rebuild",
        "agent_depth",
    ]
    setting: (
        GetCorrectionOutputSettingFieldBoost
        | GetCorrectionOutputSettingOption1
        | GetCorrectionOutputSettingOption2
        | GetCorrectionOutputSettingBm25
        | GetCorrectionOutputSettingStopWords
        | GetCorrectionOutputSettingSynonyms
        | GetCorrectionOutputSettingLanguage
        | GetCorrectionOutputSettingChunking
        | GetCorrectionOutputSettingRebuild
        | GetCorrectionOutputSettingAgentDepth
    )
    target_ids: list[str]
    file_kinds: list[
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    ]
    status: Literal["proposed", "trying", "tried", "promoting", "promoted", "discarded", "failed"]
    pass_id: str | None
    estimate: GetCorrectionOutputEstimate
    before: GetCorrectionOutputBefore | None
    after: GetCorrectionOutputAfter | None
    verdict: Literal[
        "untried",
        "trying",
        "promoted",
        "waits_for_person",
        "waits_for_held_back",
        "lowers_held_back",
        "no_gain",
        "discarded",
        "failed",
    ]
    question_changes: GetCorrectionOutputQuestionChanges | None
    waits_for_click: bool
    wait_reason: str | None
    decided_by: Literal["himring", "engineer"] | None
    decision_note: str | None
    failure_message: str | None
    created_at: str
    tried_at: str | None
    decided_at: str | None


class GetCorrectionPassInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    pass_id: str


class GetCorrectionPassOutput(TypedDict):
    id: str
    trigger: Literal["requested", "automatic"]
    mode: Literal["propose", "try"]
    status: Literal["queued", "running", "done", "failed"]
    complete_index: bool
    before_scorecard_id: str | None
    after_scorecard_id: str | None
    correction_ids: list[str]
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class GetDatabaseInput(TypedDict):
    project_id: str
    database_id: str


class GetDatabaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class GetDatabaseOutputSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class GetDatabaseOutputCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class GetDatabaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: GetDatabaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: GetDatabaseOutputSize | None
    compaction: GetDatabaseOutputCompaction | None
    sql_write_preview: bool


class _GetDownloadLinkInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    file_id: str
    version: str


class GetDownloadLinkInput(_GetDownloadLinkInputRequired, total=False):
    rendition: Literal["pdf"]
    disposition: Literal["inline", "attachment"]


class GetDownloadLinkOutput(TypedDict):
    url: str
    expires_at: str
    file_name: str
    content_type: str
    disposition: Literal["inline", "attachment"]
    size_bytes: float
    entity_tag: str


class GetFileInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    file_id: str


class GetFileOutputFailure(TypedDict):
    code: str
    message: str


class GetFileOutputUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class GetFileOutputUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: GetFileOutputUnreadPartsItemFailure


class GetFileOutputVersionsItemFailure(TypedDict):
    code: str
    message: str


class GetFileOutputVersionsItemUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class GetFileOutputVersionsItemUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: GetFileOutputVersionsItemUnreadPartsItemFailure


class GetFileOutputVersionsItem(TypedDict):
    version: float
    content_sha256: str
    size_bytes: float
    status: Literal["queued", "processing", "ready", "failed", "superseded"]
    failure: GetFileOutputVersionsItemFailure | None
    received_at: str
    processed_at: str | None
    page_count: float | None
    duration_seconds: float | None
    conversion_seconds: float | None
    ocr_page_count: float | None
    unread_parts: list[GetFileOutputVersionsItemUnreadPartsItem]
    block_count: float
    chunk_count: float


class GetFileOutput(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: GetFileOutputFailure | None
    unread_parts: list[GetFileOutputUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None
    versions: list[GetFileOutputVersionsItem]
    version_count: float


class GetFlaggedQuestionInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    question_id: str


class GetFlaggedQuestionOutputSignalDetailsItem(TypedDict):
    kind: Literal[
        "handoff",
        "thumbs_down",
        "verdict",
        "unsupported_answer",
        "repeated_question",
        "near_saved_question",
        "passage_changed",
        "follow_ups_past_limit",
    ]
    detail: dict[str, object]
    received_at: str


class GetFlaggedQuestionOutputAnswer(TypedDict):
    answer: str | None
    follow_up: str | None
    cited_chunk_ids: list[str]
    answered_by: Literal["event", "log", "sdk", "transcript"]
    answered_at: str


class GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class GetFlaggedQuestionOutputReturnedPassagesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem]
    page_sizes: list[GetFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem]


class GetFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class GetFlaggedQuestionOutputReturnedPassagesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class GetFlaggedQuestionOutputReturnedPassagesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class GetFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class GetFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class GetFlaggedQuestionOutputReturnedPassagesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[GetFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem]
    page_sizes: list[GetFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem]


class GetFlaggedQuestionOutputReturnedPassagesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class GetFlaggedQuestionOutputReturnedPassagesItem(TypedDict):
    rank: float
    chunk_id: str
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    heading: str | None
    citation: (
        GetFlaggedQuestionOutputReturnedPassagesItemCitationDocument
        | GetFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet
        | GetFlaggedQuestionOutputReturnedPassagesItemCitationSlides
        | GetFlaggedQuestionOutputReturnedPassagesItemCitationWebPage
        | GetFlaggedQuestionOutputReturnedPassagesItemCitationImage
        | GetFlaggedQuestionOutputReturnedPassagesItemCitationRecording
        | None
    )


class GetFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class GetFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class GetFlaggedQuestionOutputCandidatesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[GetFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem]
    page_sizes: list[GetFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem]


class GetFlaggedQuestionOutputCandidatesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class GetFlaggedQuestionOutputCandidatesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class GetFlaggedQuestionOutputCandidatesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class GetFlaggedQuestionOutputCandidatesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class GetFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class GetFlaggedQuestionOutputCandidatesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[GetFlaggedQuestionOutputCandidatesItemCitationImageAreasItem]
    page_sizes: list[GetFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem]


class GetFlaggedQuestionOutputCandidatesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class GetFlaggedQuestionOutputCandidatesItem(TypedDict):
    rank: float
    chunk_id: str
    file_id: str
    version: float
    first_position: float
    last_position: float
    heading: str | None
    probability: float
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    latest_version: float | None
    citation: (
        GetFlaggedQuestionOutputCandidatesItemCitationDocument
        | GetFlaggedQuestionOutputCandidatesItemCitationSpreadsheet
        | GetFlaggedQuestionOutputCandidatesItemCitationSlides
        | GetFlaggedQuestionOutputCandidatesItemCitationWebPage
        | GetFlaggedQuestionOutputCandidatesItemCitationImage
        | GetFlaggedQuestionOutputCandidatesItemCitationRecording
        | None
    )


class GetFlaggedQuestionOutput(TypedDict):
    question_id: str
    question: str
    end_user_id: str | None
    status: Literal["waiting", "saved", "unsure", "unanswerable"]
    signals: list[
        Literal[
            "handoff",
            "thumbs_down",
            "verdict",
            "unsupported_answer",
            "repeated_question",
            "near_saved_question",
            "passage_changed",
            "follow_ups_past_limit",
        ]
    ]
    flagged_at: str
    judged_at: str | None
    probability: float | None
    chosen_rank: float | None
    saved_question_id: str | None
    settled_by: Literal["judge", "person"] | None
    signal_details: list[GetFlaggedQuestionOutputSignalDetailsItem]
    answer: GetFlaggedQuestionOutputAnswer | None
    returned_passages: list[GetFlaggedQuestionOutputReturnedPassagesItem]
    candidates: list[GetFlaggedQuestionOutputCandidatesItem]
    none_probability: float | None
    answer_read: bool


class GetIndexInput(TypedDict):
    project_id: str
    index_id: str


class GetIndexOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class GetIndexOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: GetIndexOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class GetIndexRecordInput(TypedDict):
    project_id: str
    index_id: str
    record_id: str


class GetIndexRecordOutput(TypedDict):
    id: str
    record: dict[str, object]


class GetIndexStatsInput(TypedDict):
    project_id: str
    index_id: str


class GetIndexStatsOutputFieldsItem(TypedDict):
    path: str
    type: str


class GetIndexStatsOutputVectorFieldsItem(TypedDict):
    path: str
    dimensions: float
    embedding_model: str | None
    source_fields: list[str]


class GetIndexStatsOutput(TypedDict):
    record_count: float
    partition_count: float
    estimated_memory_bytes: float | None
    language: str
    stop_words: list[str] | None
    fields: list[GetIndexStatsOutputFieldsItem]
    vector_fields: list[GetIndexStatsOutputVectorFieldsItem]


class GetKnowledgeBaseInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class GetKnowledgeBaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class GetKnowledgeBaseOutputFileProgress(TypedDict):
    file_count: float
    queued_count: float
    processing_count: float
    ready_count: float
    failed_count: float
    last_read_at: str | None


class GetKnowledgeBaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    language: str
    chunk_tokens: float
    question_log_retention_days: float | None
    created_at: str
    created_by: GetKnowledgeBaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    database_id: str
    live_index_id: str
    sirannon_url: str
    search_pending_since: str | None
    file_progress: GetKnowledgeBaseOutputFileProgress | None


class _GetMemoryInputRequired(TypedDict):
    project_id: str


class GetMemoryInput(_GetMemoryInputRequired, total=False):
    state: Literal["live", "deleted"]


class GetMemoryOutputSettingsSubjectsItem(TypedDict):
    subject: str
    owner_id: str | None
    sensitive: bool


class GetMemoryOutputSettingsAgentPermissions(TypedDict):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class GetMemoryOutputSettingsCueWeightsStatementKind(TypedDict):
    statement: float
    event: float
    promise: float
    procedure: float
    instruction: float


class GetMemoryOutputSettingsCueWeightsAuthorKind(TypedDict):
    staff: float
    agent: float
    end_user: float
    outsider: float
    records: float
    code: float


class GetMemoryOutputSettingsCueWeights(TypedDict):
    statement_kind: GetMemoryOutputSettingsCueWeightsStatementKind
    author_kind: GetMemoryOutputSettingsCueWeightsAuthorKind
    subject_owner: float
    private_channel: float
    reactions_for_second_voice: float


class GetMemoryOutputSettings(TypedDict):
    duplicate_threshold: float
    confidence_threshold: float
    agreeing_authors_for_confirmed: float
    first_pack_tokens: float
    recall_fade_days: float
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: list[str] | None
    subjects: list[GetMemoryOutputSettingsSubjectsItem]
    sources_for_likely: float
    agent_permissions: GetMemoryOutputSettingsAgentPermissions
    dropped_list_days: float | None
    replaced_retention_days: float | None
    message_retention_days: float | None
    personal_retention_days: float | None
    recall_log_retention_days: float | None
    ready_set_size: float
    recall_depth: float
    cue_weights: GetMemoryOutputSettingsCueWeights
    recall_checked_memories: float


class GetMemoryOutputCheckedKnowledgeBasesLeftOutItem(TypedDict):
    knowledge_base_id: str
    reason: Literal["over_limit", "deleted", "not_found", "not_ready", "in_another_cell"]


class GetMemoryOutputCheckedKnowledgeBases(TypedDict):
    knowledge_base_ids: list[str]
    left_out: list[GetMemoryOutputCheckedKnowledgeBasesLeftOutItem]
    left_out_count: float
    limit: float


class GetMemoryOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class GetMemoryOutputProgress(TypedDict):
    waiting_count: float
    sorted_count: float
    failed_count: float
    memory_count: float
    open_review_count: float


class GetMemoryOutput(TypedDict):
    id: str
    project_id: str
    language: str
    settings: GetMemoryOutputSettings
    checked_knowledge_bases: GetMemoryOutputCheckedKnowledgeBases
    created_at: str
    created_by: GetMemoryOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    sorting_pending_since: str | None
    progress: GetMemoryOutputProgress | None


class _GetMemoryContextInputRequired(TypedDict):
    project_id: str
    memory_id: str


class GetMemoryContextInput(_GetMemoryContextInputRequired, total=False):
    end_user_id: str
    team_id: str
    agent_id: str
    as_of: str


class GetMemoryContextOutputMemoriesItemPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class GetMemoryContextOutputMemoriesItemSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


_GetMemoryContextOutputMemoriesItemHoldsRequired = TypedDict(
    "_GetMemoryContextOutputMemoriesItemHoldsRequired",
    {"from": str, "until": str | None, "expires_at": str | None},
)


class _GetMemoryContextOutputMemoriesItemHoldsOptional(TypedDict, total=False):
    pass


class GetMemoryContextOutputMemoriesItemHolds(
    _GetMemoryContextOutputMemoriesItemHoldsRequired,
    _GetMemoryContextOutputMemoriesItemHoldsOptional,
):
    pass


class GetMemoryContextOutputMemoriesItemReplacesItem(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class GetMemoryContextOutputMemoriesItemReplacedBy(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class GetMemoryContextOutputMemoriesItemConflictsWithItemMemorySourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class GetMemoryContextOutputMemoriesItemConflictsWithItemMemory(TypedDict):
    kind: Literal["memory"]
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    sources: list[GetMemoryContextOutputMemoriesItemConflictsWithItemMemorySourcesItem]


class GetMemoryContextOutputMemoriesItemConflictsWithItemFile(TypedDict):
    kind: Literal["file"]
    text: str
    recorded_at: str
    knowledge_base_id: str | None
    file_id: str | None
    file_path: str | None
    resolution: Literal["open", "memory_replaces_file"]


class GetMemoryContextOutputMemoriesItemConflictsWithItemWaitingMessage(TypedDict):
    kind: Literal["waiting_message"]
    text: str
    sent_at: str
    source_id: str
    external_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]


class GetMemoryContextOutputMemoriesItem(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    subject: str
    subject_owner_id: str | None
    text: str
    values: dict[str, str | float | bool | None]
    plan: GetMemoryContextOutputMemoriesItemPlan | None
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    trust_reasons: list[
        Literal[
            "from_records",
            "said_by_staff",
            "said_by_code",
            "said_by_agent",
            "said_by_end_user",
            "said_by_outsider",
            "said_by_subject_owner",
            "people_agree",
            "one_source",
            "too_few_sources",
            "contradicts_memory",
            "contradicts_file",
            "contradicts_waiting_message",
            "replaces_file",
            "instruction_like",
            "held_secret",
            "unsure",
            "rechecked",
            "settled_by_reply",
            "settled_by_person",
        ]
    ]
    agent_may: Literal["use", "ask"]
    sources: list[GetMemoryContextOutputMemoriesItemSourcesItem]
    holds: GetMemoryContextOutputMemoriesItemHolds
    replaces: list[GetMemoryContextOutputMemoriesItemReplacesItem]
    replaced_by: GetMemoryContextOutputMemoriesItemReplacedBy | None
    conflicts_with: list[
        GetMemoryContextOutputMemoriesItemConflictsWithItemMemory
        | GetMemoryContextOutputMemoriesItemConflictsWithItemFile
        | GetMemoryContextOutputMemoriesItemConflictsWithItemWaitingMessage
    ]
    connection_strength: float
    recall_strength: float
    last_checked_at: str | None
    check: Literal["current", "pending"]
    sorted_by: Literal["rules", "model", "as_given"]
    sorting_probability: float | None


class GetMemoryContextOutput(TypedDict):
    recall_id: str | None
    duration_ms: float
    memories: list[GetMemoryContextOutputMemoriesItem]


class GetMemoryScoresInput(TypedDict):
    project_id: str
    memory_id: str


class GetMemoryScoresOutputRecall(TypedDict):
    score: float
    mean_reciprocal_rank: float
    depth: float
    question_count: float
    scored_at: str


class GetMemoryScoresOutputJudgement(TypedDict):
    score: float
    right_count: float
    decision_count: float
    scored_at: str


class GetMemoryScoresOutputLabelledDecisions(TypedDict):
    tuning_count: float
    held_back_count: float


class GetMemoryScoresOutputTuning(TypedDict):
    state: Literal["up_to_date", "new_input", "queued", "working"]
    labelled_decisions_since_tuning: float
    labelled_decisions_per_tuning: float
    saved_questions_changed: bool
    memory_changes_since_scoring: float | None
    started_at: str | None
    tuned_at: str | None


class GetMemoryScoresOutput(TypedDict):
    recall: GetMemoryScoresOutputRecall | None
    judgement: GetMemoryScoresOutputJudgement | None
    labelled_decisions: GetMemoryScoresOutputLabelledDecisions
    flagged_question_count: float
    scoring: bool
    tuning: GetMemoryScoresOutputTuning


class GetMemorySourceInput(TypedDict):
    project_id: str
    memory_id: str
    source_id: str


class GetMemorySourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class GetMemorySourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class GetMemorySourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class GetMemorySourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: GetMemorySourceOutputSignIn | None
    created_at: str
    created_by: GetMemorySourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: GetMemorySourceOutputLastError | None


class GetMemoryWebhookInput(TypedDict):
    project_id: str
    memory_id: str


class GetMemoryWebhookOutput(TypedDict):
    url: str
    created_at: str
    updated_at: str


class _GetMessageInputRequired(TypedDict):
    project_id: str
    memory_id: str
    source_id: str
    external_id: str


class GetMessageInput(_GetMessageInputRequired, total=False):
    version: str


class GetMessageOutputTurnsItem(TypedDict):
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider"] | None
    text: str
    sent_at: str | None


class GetMessageOutputMemoriesItem(TypedDict):
    id: str
    type: Literal["event", "fact", "plan", "procedure"]
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    replaced_by: str | None


class GetMessageOutput(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    text_start: str
    state: Literal["waiting", "sorted", "superseded", "cancelled", "failed"]
    attempts: float
    memories_written: float
    failure_code: str | None
    received_at: str
    finished_at: str | None
    kind: Literal["conversation", "message", "record", "deletion"]
    title: str | None
    turns: list[GetMessageOutputTurnsItem]
    end_user_id: str | None
    team_id: str | None
    private: bool
    memories: list[GetMessageOutputMemoriesItem]
    memory_count: float


class GetProjectInput(TypedDict):
    project_id: str


class GetProjectOutput(TypedDict):
    id: str
    name: str
    region: str
    role: Literal["owner", "member"] | None
    created_at: str
    deleted_at: str | None
    purge_after: str | None
    sirannon_url: str
    narsil_url: str


class GetQuestionSetInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class GetQuestionSetOutputFlagged(TypedDict):
    waiting: float
    saved: float
    unsure: float
    unanswerable: float


class GetQuestionSetOutputSettingsBoost(TypedDict):
    text: float
    heading: float


class GetQuestionSetOutputSettingsFusionRrf(TypedDict):
    strategy: Literal["rrf"]
    rank_constant: float


class GetQuestionSetOutputSettingsFusionLinear(TypedDict):
    strategy: Literal["linear"]
    vector_weight: float


class GetQuestionSetOutputSettingsBm25(TypedDict):
    k1: float
    b: float


class GetQuestionSetOutputSettingsStopWords(TypedDict):
    added: list[str]
    removed: list[str]


class GetQuestionSetOutputSettingsSynonymsItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class GetQuestionSetOutputSettingsSynonymsItemOption2(TypedDict):
    words: list[str]


class GetQuestionSetOutputSettings(TypedDict):
    boost: GetQuestionSetOutputSettingsBoost
    fusion: GetQuestionSetOutputSettingsFusionRrf | GetQuestionSetOutputSettingsFusionLinear
    bm25: GetQuestionSetOutputSettingsBm25
    stop_words: GetQuestionSetOutputSettingsStopWords
    synonyms: list[
        GetQuestionSetOutputSettingsSynonymsItemOption1
        | GetQuestionSetOutputSettingsSynonymsItemOption2
    ]
    language: str
    chunk_tokens: float


class GetQuestionSetOutputLatestScorecardTuning(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class GetQuestionSetOutputLatestScorecardHeldBack(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class GetQuestionSetOutputLatestScorecardConfigurationSettingsBoost(TypedDict):
    text: float
    heading: float


class GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionRrf(TypedDict):
    strategy: Literal["rrf"]
    rank_constant: float


class GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionLinear(TypedDict):
    strategy: Literal["linear"]
    vector_weight: float


class GetQuestionSetOutputLatestScorecardConfigurationSettingsBm25(TypedDict):
    k1: float
    b: float


class GetQuestionSetOutputLatestScorecardConfigurationSettingsStopWords(TypedDict):
    added: list[str]
    removed: list[str]


class GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption2(TypedDict):
    words: list[str]


class GetQuestionSetOutputLatestScorecardConfigurationSettings(TypedDict):
    boost: GetQuestionSetOutputLatestScorecardConfigurationSettingsBoost
    fusion: (
        GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionRrf
        | GetQuestionSetOutputLatestScorecardConfigurationSettingsFusionLinear
    )
    bm25: GetQuestionSetOutputLatestScorecardConfigurationSettingsBm25
    stop_words: GetQuestionSetOutputLatestScorecardConfigurationSettingsStopWords
    synonyms: list[
        GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption1
        | GetQuestionSetOutputLatestScorecardConfigurationSettingsSynonymsItemOption2
    ]
    language: str
    chunk_tokens: float


class GetQuestionSetOutputLatestScorecardConfiguration(TypedDict):
    live_index_id: str
    settings: GetQuestionSetOutputLatestScorecardConfigurationSettings


class GetQuestionSetOutputLatestScorecard(TypedDict):
    id: str
    purpose: Literal["requested", "before", "after"]
    status: Literal["queued", "running", "done", "failed"]
    waiting_for_search: bool
    pass_id: str | None
    depth: float
    score: float | None
    question_count: float | None
    passed_count: float | None
    first_count: float | None
    mean_reciprocal_rank: float | None
    tuning: GetQuestionSetOutputLatestScorecardTuning | None
    held_back: GetQuestionSetOutputLatestScorecardHeldBack | None
    configuration: GetQuestionSetOutputLatestScorecardConfiguration | None
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class GetQuestionSetOutputOpenPass(TypedDict):
    id: str
    trigger: Literal["requested", "automatic"]
    mode: Literal["propose", "try"]
    status: Literal["queued", "running", "done", "failed"]
    complete_index: bool
    before_scorecard_id: str | None
    after_scorecard_id: str | None
    correction_ids: list[str]
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class GetQuestionSetOutputLatestPass(TypedDict):
    id: str
    trigger: Literal["requested", "automatic"]
    mode: Literal["propose", "try"]
    status: Literal["queued", "running", "done", "failed"]
    complete_index: bool
    before_scorecard_id: str | None
    after_scorecard_id: str | None
    correction_ids: list[str]
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class GetQuestionSetOutput(TypedDict):
    saved_questions: float
    tuning: float
    held_back: float
    broken: float
    unconfirmed: float
    split_seed: str | None
    held_back_percent: float
    agent_depth: float
    automatic_corrections: bool
    judge_passages: float
    judge_threshold: float
    flagged: GetQuestionSetOutputFlagged
    settings: GetQuestionSetOutputSettings
    latest_scorecard: GetQuestionSetOutputLatestScorecard | None
    open_pass: GetQuestionSetOutputOpenPass | None
    latest_pass: GetQuestionSetOutputLatestPass | None


class GetSavedQuestionInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    saved_question_id: str


class GetSavedQuestionOutputPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class GetSavedQuestionOutputPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class GetSavedQuestionOutputPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[GetSavedQuestionOutputPassageCitationDocumentAreasItem]
    page_sizes: list[GetSavedQuestionOutputPassageCitationDocumentPageSizesItem]


class GetSavedQuestionOutputPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class GetSavedQuestionOutputPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class GetSavedQuestionOutputPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class GetSavedQuestionOutputPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class GetSavedQuestionOutputPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class GetSavedQuestionOutputPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[GetSavedQuestionOutputPassageCitationImageAreasItem]
    page_sizes: list[GetSavedQuestionOutputPassageCitationImagePageSizesItem]


class GetSavedQuestionOutputPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class GetSavedQuestionOutputPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        GetSavedQuestionOutputPassageCitationDocument
        | GetSavedQuestionOutputPassageCitationSpreadsheet
        | GetSavedQuestionOutputPassageCitationSlides
        | GetSavedQuestionOutputPassageCitationWebPage
        | GetSavedQuestionOutputPassageCitationImage
        | GetSavedQuestionOutputPassageCitationRecording
        | None
    )


class GetSavedQuestionOutputBrokenPrevious(TypedDict):
    version: float
    first_position: float
    last_position: float


class GetSavedQuestionOutputBroken(TypedDict):
    change: Literal["changed", "moved", "removed"]
    version: float | None
    detected_at: str
    previous: GetSavedQuestionOutputBrokenPrevious | None


class GetSavedQuestionOutput(TypedDict):
    id: str
    question: str
    split: Literal["tuning", "held_back"]
    source: Literal["question_log", "file", "api", "judge"]
    question_log_id: str | None
    end_user_id: str | None
    passage: GetSavedQuestionOutputPassage
    broken: GetSavedQuestionOutputBroken | None
    created_at: str
    updated_at: str


class GetScorecardInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    scorecard_id: str


class GetScorecardOutputTuning(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class GetScorecardOutputHeldBack(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class GetScorecardOutputConfigurationSettingsBoost(TypedDict):
    text: float
    heading: float


class GetScorecardOutputConfigurationSettingsFusionRrf(TypedDict):
    strategy: Literal["rrf"]
    rank_constant: float


class GetScorecardOutputConfigurationSettingsFusionLinear(TypedDict):
    strategy: Literal["linear"]
    vector_weight: float


class GetScorecardOutputConfigurationSettingsBm25(TypedDict):
    k1: float
    b: float


class GetScorecardOutputConfigurationSettingsStopWords(TypedDict):
    added: list[str]
    removed: list[str]


class GetScorecardOutputConfigurationSettingsSynonymsItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class GetScorecardOutputConfigurationSettingsSynonymsItemOption2(TypedDict):
    words: list[str]


class GetScorecardOutputConfigurationSettings(TypedDict):
    boost: GetScorecardOutputConfigurationSettingsBoost
    fusion: (
        GetScorecardOutputConfigurationSettingsFusionRrf
        | GetScorecardOutputConfigurationSettingsFusionLinear
    )
    bm25: GetScorecardOutputConfigurationSettingsBm25
    stop_words: GetScorecardOutputConfigurationSettingsStopWords
    synonyms: list[
        GetScorecardOutputConfigurationSettingsSynonymsItemOption1
        | GetScorecardOutputConfigurationSettingsSynonymsItemOption2
    ]
    language: str
    chunk_tokens: float


class GetScorecardOutputConfiguration(TypedDict):
    live_index_id: str
    settings: GetScorecardOutputConfigurationSettings


class GetScorecardOutput(TypedDict):
    id: str
    purpose: Literal["requested", "before", "after"]
    status: Literal["queued", "running", "done", "failed"]
    waiting_for_search: bool
    pass_id: str | None
    depth: float
    score: float | None
    question_count: float | None
    passed_count: float | None
    first_count: float | None
    mean_reciprocal_rank: float | None
    tuning: GetScorecardOutputTuning | None
    held_back: GetScorecardOutputHeldBack | None
    configuration: GetScorecardOutputConfiguration | None
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class GetSessionInput(TypedDict):
    pass


class GetSessionOutputAccount(TypedDict):
    id: str
    email: str
    name: str
    status: Literal["pending", "approved", "rejected"]
    created_at: str
    decided_at: str | None
    is_operator: bool


class GetSessionOutput(TypedDict):
    account: GetSessionOutputAccount
    second_factor_enabled: bool
    expires_at: str


class GetSourceInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class GetSourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class GetSourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class GetSourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class GetSourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: GetSourceOutputSignIn | None
    created_at: str
    created_by: GetSourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: GetSourceOutputLastError | None


class GetTableRowInputKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class GetTableRowInputKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class GetTableRowInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    key: Sequence[float | str | GetTableRowInputKeyItemInteger | GetTableRowInputKeyItemBlob | None]


class GetTableRowOutputRowKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class GetTableRowOutputRowKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class GetTableRowOutputRowCellsItem(TypedDict):
    type: Literal["integer", "real", "text", "blob"]
    text: str
    size: float
    truncated: bool


class GetTableRowOutputRow(TypedDict):
    key: (
        list[
            float
            | str
            | GetTableRowOutputRowKeyItemInteger
            | GetTableRowOutputRowKeyItemBlob
            | None
        ]
        | None
    )
    cells: list[float | str | GetTableRowOutputRowCellsItem | None]


class GetTableRowOutput(TypedDict):
    row: GetTableRowOutputRow


class GetUploadInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    upload_id: str


class GetUploadOutputFileFailure(TypedDict):
    code: str
    message: str


class GetUploadOutputFileUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class GetUploadOutputFileUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: GetUploadOutputFileUnreadPartsItemFailure


class GetUploadOutputFile(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: GetUploadOutputFileFailure | None
    unread_parts: list[GetUploadOutputFileUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class GetUploadOutputFailure(TypedDict):
    code: str
    message: str


class GetUploadOutput(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    address: str | None
    size_bytes: float
    content_sha256: str
    method: Literal["single", "multipart"]
    part_bytes: float
    part_count: float
    state: Literal["open", "checking", "completed", "failed"]
    outcome: Literal["added", "new_version", "unchanged"] | None
    file: GetUploadOutputFile | None
    failure: GetUploadOutputFailure | None
    created_at: str
    deadline_at: str


class ImportAnswerLogInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    content: FileContent


class ImportAnswerLogOutputRefusedItem(TypedDict):
    line: float
    question_id: str | None
    reason: str


class ImportAnswerLogOutput(TypedDict):
    recorded_count: float
    refused: list[ImportAnswerLogOutputRefusedItem]


class ImportIndexRecordsInput(TypedDict):
    project_id: str
    index_id: str
    format: Literal["json", "ndjson", "csv"]
    content: FileContent


class ImportIndexRecordsOutputFailuresItem(TypedDict):
    position: float
    line: float | None
    record_id: str | None
    reason: str


class ImportIndexRecordsOutput(TypedDict):
    received: float
    added: float
    replaced: float
    failed_count: float
    failures: list[ImportIndexRecordsOutputFailuresItem]
    failures_truncated: bool


class _ImportSavedQuestionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    content: FileContent


class ImportSavedQuestionsInput(_ImportSavedQuestionsInputRequired, total=False):
    format: Literal["jsonl", "csv"]


class ImportSavedQuestionsOutputRefusedItem(TypedDict):
    line: float
    reason: str


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem]
    page_sizes: list[
        ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem
    ]


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem]
    page_sizes: list[ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem]


class ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class ImportSavedQuestionsOutputSavedQuestionsItemPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument
        | ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet
        | ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides
        | ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage
        | ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationImage
        | ImportSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording
        | None
    )


class ImportSavedQuestionsOutputSavedQuestionsItemBrokenPrevious(TypedDict):
    version: float
    first_position: float
    last_position: float


class ImportSavedQuestionsOutputSavedQuestionsItemBroken(TypedDict):
    change: Literal["changed", "moved", "removed"]
    version: float | None
    detected_at: str
    previous: ImportSavedQuestionsOutputSavedQuestionsItemBrokenPrevious | None


class ImportSavedQuestionsOutputSavedQuestionsItem(TypedDict):
    id: str
    question: str
    split: Literal["tuning", "held_back"]
    source: Literal["question_log", "file", "api", "judge"]
    question_log_id: str | None
    end_user_id: str | None
    passage: ImportSavedQuestionsOutputSavedQuestionsItemPassage
    broken: ImportSavedQuestionsOutputSavedQuestionsItemBroken | None
    created_at: str
    updated_at: str


class ImportSavedQuestionsOutput(TypedDict):
    added: float
    refused_count: float
    refused: list[ImportSavedQuestionsOutputRefusedItem]
    saved_questions: list[ImportSavedQuestionsOutputSavedQuestionsItem]


class _IngestItemsInputItemsItemConversationTurnsItemRequired(TypedDict):
    speaker: str
    text: str


class IngestItemsInputItemsItemConversationTurnsItem(
    _IngestItemsInputItemsItemConversationTurnsItemRequired, total=False
):
    speaker_kind: Literal["staff", "agent", "end_user", "outsider"]
    at: str
    start_second: float
    end_second: float


class _IngestItemsInputItemsItemConversationRequired(TypedDict):
    kind: Literal["conversation"]
    external_id: str
    version: int
    turns: Sequence[IngestItemsInputItemsItemConversationTurnsItem]


class IngestItemsInputItemsItemConversation(
    _IngestItemsInputItemsItemConversationRequired, total=False
):
    title: str
    address: str
    occurred_at: str
    end_user_id: str
    team_id: str
    private: bool


class _IngestItemsInputItemsItemMessageRequired(TypedDict):
    kind: Literal["message"]
    external_id: str
    version: int
    conversation_id: str
    author: str
    text: str
    sent_at: str


class IngestItemsInputItemsItemMessage(_IngestItemsInputItemsItemMessageRequired, total=False):
    conversation_title: str
    address: str
    author_kind: Literal["staff", "agent", "end_user", "outsider"]
    reply_to: str
    reactions: int
    end_user_id: str
    team_id: str
    private: bool


class _IngestItemsInputItemsItemRecordRequired(TypedDict):
    kind: Literal["record"]
    external_id: str
    version: int
    fields: Mapping[str, str | float | bool | None]


class IngestItemsInputItemsItemRecord(_IngestItemsInputItemsItemRecordRequired, total=False):
    title: str
    address: str
    end_user_id: str


class IngestItemsInputItemsItemDeletion(TypedDict):
    kind: Literal["deletion"]
    external_id: str
    version: int


class IngestItemsInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str
    items: Sequence[
        IngestItemsInputItemsItemConversation
        | IngestItemsInputItemsItemMessage
        | IngestItemsInputItemsItemRecord
        | IngestItemsInputItemsItemDeletion
    ]


class IngestItemsOutputResultsItem(TypedDict):
    external_id: str
    version: float
    outcome: Literal["stored", "duplicate", "stale", "conflict"]


class IngestItemsOutput(TypedDict):
    results: list[IngestItemsOutputResultsItem]


class InsertTableRowInputValuesValueInteger(TypedDict):
    type: Literal["integer"]
    text: str


class InsertTableRowInputValuesValueBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class InsertTableRowInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    values: Mapping[
        str,
        float
        | str
        | InsertTableRowInputValuesValueInteger
        | InsertTableRowInputValuesValueBlob
        | None,
    ]


class InsertTableRowOutputRowKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class InsertTableRowOutputRowKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class InsertTableRowOutputRowCellsItem(TypedDict):
    type: Literal["integer", "real", "text", "blob"]
    text: str
    size: float
    truncated: bool


class InsertTableRowOutputRow(TypedDict):
    key: (
        list[
            float
            | str
            | InsertTableRowOutputRowKeyItemInteger
            | InsertTableRowOutputRowKeyItemBlob
            | None
        ]
        | None
    )
    cells: list[float | str | InsertTableRowOutputRowCellsItem | None]


class InsertTableRowOutputReturnedKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class InsertTableRowOutputReturnedKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class InsertTableRowOutput(TypedDict):
    row: InsertTableRowOutputRow | None
    returned_key: (
        list[
            float
            | str
            | InsertTableRowOutputReturnedKeyItemInteger
            | InsertTableRowOutputReturnedKeyItemBlob
            | None
        ]
        | None
    )


class InspectMemoryInput(TypedDict):
    project_id: str
    memory_id: str
    stored_memory_id: str


class InspectMemoryOutputPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class InspectMemoryOutputSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class InspectMemoryOutputLinksItemMemory(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    replaced: bool


class InspectMemoryOutputLinksItem(TypedDict):
    relation: Literal["replaces", "contradicts", "agrees"]
    direction: Literal["outgoing", "incoming"]
    memory: InspectMemoryOutputLinksItemMemory


class InspectMemoryOutputDecisionsItemMemory(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    replaced: bool


class InspectMemoryOutputDecisionsItem(TypedDict):
    step: str
    decided_by: Literal["rules", "model", "writer", "recheck", "person"]
    choice: str
    probability: float | None
    memory: InspectMemoryOutputDecisionsItemMemory | None
    created_at: str


class InspectMemoryOutputReviewsItem(TypedDict):
    id: str
    memory_id: str
    stored_memory_id: str
    reason: Literal[
        "instruction_like",
        "sensitive",
        "disputed",
        "hard_case",
        "recheck_unsure",
        "contradicts_file",
    ]
    state: Literal["open", "settled"]
    evidence: dict[str, object]
    settled_trust_level: Literal["confirmed", "likely", "disputed", "not_kept"] | None
    settled_by: str | None
    created_at: str
    settled_at: str | None


class InspectMemoryOutput(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: InspectMemoryOutputPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[InspectMemoryOutputSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str
    mentions: list[str]
    links: list[InspectMemoryOutputLinksItem]
    decisions: list[InspectMemoryOutputDecisionsItem]
    reviews: list[InspectMemoryOutputReviewsItem]


class _InviteMemberInputRequired(TypedDict):
    project_id: str
    email: str


class InviteMemberInput(_InviteMemberInputRequired, total=False):
    role: Literal["owner", "member"]


class InviteMemberOutputInvitation(TypedDict):
    id: str
    project_id: str
    project_name: str
    email: str
    role: Literal["owner", "member"]
    created_at: str
    expires_at: str
    accepted_at: str | None
    revoked_at: str | None


class InviteMemberOutput(TypedDict):
    invitation: InviteMemberOutputInvitation


class _ListApiKeyPermissionChangesInputRequired(TypedDict):
    project_id: str
    key_id: str


class ListApiKeyPermissionChangesInput(_ListApiKeyPermissionChangesInputRequired, total=False):
    limit: str
    offset: str


class ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeDatabases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeIndexes(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeKnowledgeBases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeMemory(TypedDict):
    level: Literal["none", "read", "write"]


class ListApiKeyPermissionChangesOutputChangesItemPermissionsBefore(TypedDict):
    access: Literal["full", "restricted"]
    databases: ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeDatabases
    indexes: ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeIndexes
    knowledge_bases: ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeKnowledgeBases
    memory: ListApiKeyPermissionChangesOutputChangesItemPermissionsBeforeMemory


class ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterDatabases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterIndexes(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterKnowledgeBases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterMemory(TypedDict):
    level: Literal["none", "read", "write"]


class ListApiKeyPermissionChangesOutputChangesItemPermissionsAfter(TypedDict):
    access: Literal["full", "restricted"]
    databases: ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterDatabases
    indexes: ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterIndexes
    knowledge_bases: ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterKnowledgeBases
    memory: ListApiKeyPermissionChangesOutputChangesItemPermissionsAfterMemory


class ListApiKeyPermissionChangesOutputChangesItem(TypedDict):
    id: str
    key_id: str
    changed_by: str
    changed_by_name: str
    changed_at: str
    permissions_before: ListApiKeyPermissionChangesOutputChangesItemPermissionsBefore | None
    permissions_after: ListApiKeyPermissionChangesOutputChangesItemPermissionsAfter


class ListApiKeyPermissionChangesOutput(TypedDict):
    changes: list[ListApiKeyPermissionChangesOutputChangesItem]
    total_count: float
    limit: float
    offset: float


class _ListApiKeysInputRequired(TypedDict):
    project_id: str


class ListApiKeysInput(_ListApiKeysInputRequired, total=False):
    status: str
    created_from: str
    created_to: str
    search: str
    sort: Literal["created_at", "name"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListApiKeysOutputApiKeysItemPermissionsDatabases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeysOutputApiKeysItemPermissionsIndexes(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeysOutputApiKeysItemPermissionsKnowledgeBases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class ListApiKeysOutputApiKeysItemPermissionsMemory(TypedDict):
    level: Literal["none", "read", "write"]


class ListApiKeysOutputApiKeysItemPermissions(TypedDict):
    access: Literal["full", "restricted"]
    databases: ListApiKeysOutputApiKeysItemPermissionsDatabases
    indexes: ListApiKeysOutputApiKeysItemPermissionsIndexes
    knowledge_bases: ListApiKeysOutputApiKeysItemPermissionsKnowledgeBases
    memory: ListApiKeysOutputApiKeysItemPermissionsMemory


class ListApiKeysOutputApiKeysItem(TypedDict):
    id: str
    project_id: str
    name: str
    display_prefix: str
    permissions: ListApiKeysOutputApiKeysItemPermissions
    permissions_changed_at: str | None
    permissions_changed_by_name: str | None
    created_by: str
    created_by_name: str
    created_at: str
    expires_at: str | None
    last_used_at: str | None
    revoked_at: str | None


class ListApiKeysOutput(TypedDict):
    api_keys: list[ListApiKeysOutputApiKeysItem]
    total_count: float
    limit: float
    offset: float


class _ListCorrectionPassesInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListCorrectionPassesInput(_ListCorrectionPassesInputRequired, total=False):
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListCorrectionPassesOutputPassesItem(TypedDict):
    id: str
    trigger: Literal["requested", "automatic"]
    mode: Literal["propose", "try"]
    status: Literal["queued", "running", "done", "failed"]
    complete_index: bool
    before_scorecard_id: str | None
    after_scorecard_id: str | None
    correction_ids: list[str]
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class ListCorrectionPassesOutput(TypedDict):
    passes: list[ListCorrectionPassesOutputPassesItem]
    total_count: float
    limit: float
    offset: float


class _ListCorrectionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListCorrectionsInput(_ListCorrectionsInputRequired, total=False):
    pass_id: str
    status: str
    kind: str
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListCorrectionsOutputCorrectionsItemSettingFieldBoost(TypedDict):
    kind: Literal["field_boost"]
    text: float
    heading: float


class ListCorrectionsOutputCorrectionsItemSettingOption1(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["rrf"]
    rank_constant: int


class ListCorrectionsOutputCorrectionsItemSettingOption2(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["linear"]
    vector_weight: float


class ListCorrectionsOutputCorrectionsItemSettingBm25(TypedDict):
    kind: Literal["bm25"]
    k1: float
    b: float


class ListCorrectionsOutputCorrectionsItemSettingStopWords(TypedDict):
    kind: Literal["stop_words"]
    added: list[str]
    removed: list[str]


class ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption2(TypedDict):
    words: list[str]


class ListCorrectionsOutputCorrectionsItemSettingSynonyms(TypedDict):
    kind: Literal["synonyms"]
    rules: list[
        ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption1
        | ListCorrectionsOutputCorrectionsItemSettingSynonymsRulesItemOption2
    ]


class ListCorrectionsOutputCorrectionsItemSettingLanguage(TypedDict):
    kind: Literal["language"]
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]


class ListCorrectionsOutputCorrectionsItemSettingChunking(TypedDict):
    kind: Literal["chunking"]
    chunk_tokens: int


class ListCorrectionsOutputCorrectionsItemSettingRebuild(TypedDict):
    kind: Literal["rebuild"]


class ListCorrectionsOutputCorrectionsItemSettingAgentDepth(TypedDict):
    kind: Literal["agent_depth"]
    depth: float


class ListCorrectionsOutputCorrectionsItemEstimate(TypedDict):
    seconds: float
    memory_bytes: float
    second_index: bool
    chunks_to_index: float
    questions_to_score: float
    price_usd: float | None


class ListCorrectionsOutputCorrectionsItemBeforeTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class ListCorrectionsOutputCorrectionsItemBeforeHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class ListCorrectionsOutputCorrectionsItemBefore(TypedDict):
    scorecard_id: str | None
    tuning: ListCorrectionsOutputCorrectionsItemBeforeTuning
    held_back: ListCorrectionsOutputCorrectionsItemBeforeHeldBack


class ListCorrectionsOutputCorrectionsItemAfterTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class ListCorrectionsOutputCorrectionsItemAfterHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class ListCorrectionsOutputCorrectionsItemAfter(TypedDict):
    scorecard_id: str | None
    tuning: ListCorrectionsOutputCorrectionsItemAfterTuning
    held_back: ListCorrectionsOutputCorrectionsItemAfterHeldBack


class ListCorrectionsOutputCorrectionsItemQuestionChanges(TypedDict):
    now_pass: float
    now_fail: float
    moved_up: float
    moved_down: float


class ListCorrectionsOutputCorrectionsItem(TypedDict):
    id: str
    origin: Literal["himring", "engineer"]
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )
    kind: Literal[
        "field_boost",
        "fusion",
        "bm25",
        "stop_words",
        "synonyms",
        "language",
        "chunking",
        "rebuild",
        "agent_depth",
    ]
    setting: (
        ListCorrectionsOutputCorrectionsItemSettingFieldBoost
        | ListCorrectionsOutputCorrectionsItemSettingOption1
        | ListCorrectionsOutputCorrectionsItemSettingOption2
        | ListCorrectionsOutputCorrectionsItemSettingBm25
        | ListCorrectionsOutputCorrectionsItemSettingStopWords
        | ListCorrectionsOutputCorrectionsItemSettingSynonyms
        | ListCorrectionsOutputCorrectionsItemSettingLanguage
        | ListCorrectionsOutputCorrectionsItemSettingChunking
        | ListCorrectionsOutputCorrectionsItemSettingRebuild
        | ListCorrectionsOutputCorrectionsItemSettingAgentDepth
    )
    target_ids: list[str]
    file_kinds: list[
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    ]
    status: Literal["proposed", "trying", "tried", "promoting", "promoted", "discarded", "failed"]
    pass_id: str | None
    estimate: ListCorrectionsOutputCorrectionsItemEstimate
    before: ListCorrectionsOutputCorrectionsItemBefore | None
    after: ListCorrectionsOutputCorrectionsItemAfter | None
    verdict: Literal[
        "untried",
        "trying",
        "promoted",
        "waits_for_person",
        "waits_for_held_back",
        "lowers_held_back",
        "no_gain",
        "discarded",
        "failed",
    ]
    question_changes: ListCorrectionsOutputCorrectionsItemQuestionChanges | None
    waits_for_click: bool
    wait_reason: str | None
    decided_by: Literal["himring", "engineer"] | None
    decision_note: str | None
    failure_message: str | None
    created_at: str
    tried_at: str | None
    decided_at: str | None


class ListCorrectionsOutput(TypedDict):
    corrections: list[ListCorrectionsOutputCorrectionsItem]
    total_count: float
    limit: float
    offset: float


class ListDatabaseMigrationsInput(TypedDict):
    project_id: str
    database_id: str


class ListDatabaseMigrationsOutputMigrationsItem(TypedDict):
    version: float
    name: str
    sql: str
    added_at: str


class ListDatabaseMigrationsOutput(TypedDict):
    migrations: list[ListDatabaseMigrationsOutputMigrationsItem]


class ListDatabaseTablesInput(TypedDict):
    project_id: str
    database_id: str


class ListDatabaseTablesOutputTablesItemColumnsItem(TypedDict):
    name: str
    declared_type: str
    not_null: bool
    default_sql: str | None
    primary_key_position: float
    generated: bool


class ListDatabaseTablesOutputTablesItemForeignKeysItem(TypedDict):
    columns: list[str]
    references_table: str
    references_columns: list[str]
    on_delete: str
    on_update: str


class ListDatabaseTablesOutputTablesItemIndexesItem(TypedDict):
    name: str
    unique: bool
    columns: list[str]


class ListDatabaseTablesOutputTablesItem(TypedDict):
    name: str
    kind: Literal["table", "view"]
    sql: str | None
    columns: list[ListDatabaseTablesOutputTablesItemColumnsItem]
    row_key: list[str] | None
    foreign_keys: list[ListDatabaseTablesOutputTablesItemForeignKeysItem]
    indexes: list[ListDatabaseTablesOutputTablesItemIndexesItem]


class ListDatabaseTablesOutput(TypedDict):
    tables: list[ListDatabaseTablesOutputTablesItem]


class _ListDatabasesInputRequired(TypedDict):
    project_id: str


class ListDatabasesInput(_ListDatabasesInputRequired, total=False):
    state: Literal["live", "deleted"]
    creator: str
    created_from: str
    created_to: str
    search: str
    sort: Literal["created_at", "name", "purge_after"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListDatabasesOutputDatabasesItemCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class ListDatabasesOutputDatabasesItemSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class ListDatabasesOutputDatabasesItemCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class ListDatabasesOutputDatabasesItem(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: ListDatabasesOutputDatabasesItemCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: ListDatabasesOutputDatabasesItemSize | None
    compaction: ListDatabasesOutputDatabasesItemCompaction | None
    sql_write_preview: bool


class ListDatabasesOutput(TypedDict):
    databases: list[ListDatabasesOutputDatabasesItem]
    total_count: float
    limit: float
    offset: float


class _ListFileVersionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    file_id: str


class ListFileVersionsInput(_ListFileVersionsInputRequired, total=False):
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListFileVersionsOutputVersionsItemFailure(TypedDict):
    code: str
    message: str


class ListFileVersionsOutputVersionsItemUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class ListFileVersionsOutputVersionsItemUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: ListFileVersionsOutputVersionsItemUnreadPartsItemFailure


class ListFileVersionsOutputVersionsItem(TypedDict):
    version: float
    content_sha256: str
    size_bytes: float
    status: Literal["queued", "processing", "ready", "failed", "superseded"]
    failure: ListFileVersionsOutputVersionsItemFailure | None
    received_at: str
    processed_at: str | None
    page_count: float | None
    duration_seconds: float | None
    conversion_seconds: float | None
    ocr_page_count: float | None
    unread_parts: list[ListFileVersionsOutputVersionsItemUnreadPartsItem]
    block_count: float
    chunk_count: float


class ListFileVersionsOutput(TypedDict):
    versions: list[ListFileVersionsOutputVersionsItem]
    total_count: float
    limit: float
    offset: float


class _ListFilesInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListFilesInput(_ListFilesInputRequired, total=False):
    state: Literal["live", "deleted"]
    kind: str
    status: str
    search: str
    sort: Literal["updated_at", "path", "created_at", "size_bytes", "purge_after"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListFilesOutputFilesItemFailure(TypedDict):
    code: str
    message: str


class ListFilesOutputFilesItemUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class ListFilesOutputFilesItemUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: ListFilesOutputFilesItemUnreadPartsItemFailure


class ListFilesOutputFilesItem(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: ListFilesOutputFilesItemFailure | None
    unread_parts: list[ListFilesOutputFilesItemUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class ListFilesOutput(TypedDict):
    files: list[ListFilesOutputFilesItem]
    total_count: float
    limit: float
    offset: float


class _ListFlaggedQuestionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListFlaggedQuestionsInput(_ListFlaggedQuestionsInputRequired, total=False):
    status: str
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListFlaggedQuestionsOutputFlaggedQuestionsItem(TypedDict):
    question_id: str
    question: str
    end_user_id: str | None
    status: Literal["waiting", "saved", "unsure", "unanswerable"]
    signals: list[
        Literal[
            "handoff",
            "thumbs_down",
            "verdict",
            "unsupported_answer",
            "repeated_question",
            "near_saved_question",
            "passage_changed",
            "follow_ups_past_limit",
        ]
    ]
    flagged_at: str
    judged_at: str | None
    probability: float | None
    chosen_rank: float | None
    saved_question_id: str | None
    settled_by: Literal["judge", "person"] | None


class ListFlaggedQuestionsOutput(TypedDict):
    flagged_questions: list[ListFlaggedQuestionsOutputFlaggedQuestionsItem]
    total_count: float
    limit: float
    offset: float


class _ListFolderInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListFolderInput(_ListFolderInputRequired, total=False):
    folder: str
    sort: Literal["name", "updated_at", "size_bytes"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListFolderOutputEntriesItemFolder(TypedDict):
    type: Literal["folder"]
    name: str
    path: str
    file_count: float
    queued_count: float
    processing_count: float
    ready_count: float
    failed_count: float
    size_bytes: float
    updated_at: str


class ListFolderOutputEntriesItemFileFileFailure(TypedDict):
    code: str
    message: str


class ListFolderOutputEntriesItemFileFileUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class ListFolderOutputEntriesItemFileFileUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: ListFolderOutputEntriesItemFileFileUnreadPartsItemFailure


class ListFolderOutputEntriesItemFileFile(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: ListFolderOutputEntriesItemFileFileFailure | None
    unread_parts: list[ListFolderOutputEntriesItemFileFileUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class ListFolderOutputEntriesItemFile(TypedDict):
    type: Literal["file"]
    name: str
    path: str
    file_count: Literal[1]
    size_bytes: float
    updated_at: str
    file: ListFolderOutputEntriesItemFileFile


class ListFolderOutput(TypedDict):
    folder: str
    entries: list[ListFolderOutputEntriesItemFolder | ListFolderOutputEntriesItemFile]
    total_count: float
    limit: float
    offset: float


class _ListForgettingSuggestionsInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListForgettingSuggestionsInput(_ListForgettingSuggestionsInputRequired, total=False):
    limit: str
    offset: str


class ListForgettingSuggestionsOutputMemoriesItemPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class ListForgettingSuggestionsOutputMemoriesItemSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class ListForgettingSuggestionsOutputMemoriesItem(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: ListForgettingSuggestionsOutputMemoriesItemPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[ListForgettingSuggestionsOutputMemoriesItemSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class ListForgettingSuggestionsOutput(TypedDict):
    memories: list[ListForgettingSuggestionsOutputMemoriesItem]
    total_count: float
    limit: float
    offset: float


class _ListIndexRecordsInputRequired(TypedDict):
    project_id: str
    index_id: str


class ListIndexRecordsInput(_ListIndexRecordsInputRequired, total=False):
    search: str
    sort: str
    filters: str
    cursor: str
    limit: str


class ListIndexRecordsOutputRecordsItem(TypedDict):
    id: str
    record: dict[str, object]


class ListIndexRecordsOutput(TypedDict):
    records: list[ListIndexRecordsOutputRecordsItem]
    total_count: float
    total_is_exact: bool
    next_cursor: str | None


class _ListIndexesInputRequired(TypedDict):
    project_id: str


class ListIndexesInput(_ListIndexesInputRequired, total=False):
    state: Literal["live", "deleted"]
    creator: str
    created_from: str
    created_to: str
    search: str
    sort: Literal["created_at", "name", "purge_after"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListIndexesOutputIndexesItemCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class ListIndexesOutputIndexesItem(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: ListIndexesOutputIndexesItemCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class ListIndexesOutput(TypedDict):
    indexes: list[ListIndexesOutputIndexesItem]
    total_count: float
    limit: float
    offset: float


class _ListInvitationsInputRequired(TypedDict):
    project_id: str


class ListInvitationsInput(_ListInvitationsInputRequired, total=False):
    role: str
    status: str
    created_from: str
    created_to: str
    search: str
    sort: Literal["created_at", "expires_at", "email"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListInvitationsOutputInvitationsItem(TypedDict):
    id: str
    project_id: str
    project_name: str
    email: str
    role: Literal["owner", "member"]
    created_at: str
    expires_at: str
    accepted_at: str | None
    revoked_at: str | None


class ListInvitationsOutput(TypedDict):
    invitations: list[ListInvitationsOutputInvitationsItem]
    total_count: float
    limit: float
    offset: float


class _ListKnowledgeBasesInputRequired(TypedDict):
    project_id: str


class ListKnowledgeBasesInput(_ListKnowledgeBasesInputRequired, total=False):
    state: Literal["live", "deleted"]
    creator: str
    created_from: str
    created_to: str
    search: str
    sort: Literal["created_at", "name", "purge_after"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListKnowledgeBasesOutputKnowledgeBasesItemCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class ListKnowledgeBasesOutputKnowledgeBasesItem(TypedDict):
    id: str
    project_id: str
    name: str
    language: str
    chunk_tokens: float
    question_log_retention_days: float | None
    created_at: str
    created_by: ListKnowledgeBasesOutputKnowledgeBasesItemCreatedBy
    deleted_at: str | None
    purge_after: str | None
    database_id: str
    live_index_id: str
    sirannon_url: str
    search_pending_since: str | None


class ListKnowledgeBasesOutput(TypedDict):
    knowledge_bases: list[ListKnowledgeBasesOutputKnowledgeBasesItem]
    total_count: float
    limit: float
    offset: float


class _ListLearnedChangesInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListLearnedChangesInput(_ListLearnedChangesInputRequired, total=False):
    limit: str
    offset: str


class ListLearnedChangesOutputLearnedChangesItem(TypedDict):
    id: str
    setting: str
    from_value: float
    to_value: float
    tuning_decisions: float
    held_back_decisions: float
    held_back_right_before: float
    held_back_right_after: float
    created_at: str
    undone_at: str | None


class ListLearnedChangesOutput(TypedDict):
    learned_changes: list[ListLearnedChangesOutputLearnedChangesItem]
    total_count: float
    limit: float
    offset: float


class _ListMembersInputRequired(TypedDict):
    project_id: str


class ListMembersInput(_ListMembersInputRequired, total=False):
    role: str
    added_from: str
    added_to: str
    search: str
    sort: Literal["name", "email", "role", "added_at"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListMembersOutputMembersItem(TypedDict):
    account_id: str
    email: str
    name: str
    role: Literal["owner", "member"]
    added_at: str


class ListMembersOutput(TypedDict):
    members: list[ListMembersOutputMembersItem]
    total_count: float
    limit: float
    offset: float


class _ListMemoriesInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemoriesInput(_ListMemoriesInputRequired, total=False):
    query: str
    end_user_id: str
    team_id: str
    owner_id: str
    scope: str
    type: str
    trust_level: str
    plan_state: str
    include_replaced: Literal["true", "false"]
    forgotten: Literal["true", "false"]
    limit: str
    offset: str


class ListMemoriesOutputMemoriesItemPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class ListMemoriesOutputMemoriesItemSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class ListMemoriesOutputMemoriesItem(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: ListMemoriesOutputMemoriesItemPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[ListMemoriesOutputMemoriesItemSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class ListMemoriesOutput(TypedDict):
    memories: list[ListMemoriesOutputMemoriesItem]
    total_count: float
    limit: float
    offset: float


class _ListMemoryDecisionsInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemoryDecisionsInput(_ListMemoryDecisionsInputRequired, total=False):
    kind: str
    stored_memory_id: str
    subject_owner_id: str
    by_person: Literal["true", "false"]
    limit: str
    offset: str


class ListMemoryDecisionsOutputDecisionsItemMemoryPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class ListMemoryDecisionsOutputDecisionsItemMemorySourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class ListMemoryDecisionsOutputDecisionsItemMemory(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: ListMemoryDecisionsOutputDecisionsItemMemoryPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[ListMemoryDecisionsOutputDecisionsItemMemorySourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class ListMemoryDecisionsOutputDecisionsItemOtherMemory(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class ListMemoryDecisionsOutputDecisionsItemFile(TypedDict):
    text: str
    recorded_at: str
    knowledge_base_id: str | None
    file_id: str | None
    file_path: str | None


class ListMemoryDecisionsOutputDecisionsItem(TypedDict):
    id: str
    memory_id: str
    stored_memory_id: str
    kind: Literal[
        "kept",
        "merged",
        "replaced",
        "disputed",
        "dropped",
        "rechecked",
        "flagged",
        "file_conflict",
        "settled",
        "forgotten",
        "recovered",
    ]
    decided_by: Literal["rules", "model", "writer", "recheck", "person"]
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    probability: float | None
    reason: str | None
    subject: str
    subject_owner_id: str | None
    memory: ListMemoryDecisionsOutputDecisionsItemMemory
    other_memory: ListMemoryDecisionsOutputDecisionsItemOtherMemory | None
    file: ListMemoryDecisionsOutputDecisionsItemFile | None
    overridden_at: str | None
    created_at: str


class ListMemoryDecisionsOutput(TypedDict):
    decisions: list[ListMemoryDecisionsOutputDecisionsItem]
    total_count: float
    limit: float
    offset: float


class _ListMemoryOwnersInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemoryOwnersInput(_ListMemoryOwnersInputRequired, total=False):
    query: str
    scope: str
    limit: str
    offset: str


class ListMemoryOwnersOutputOwnersItem(TypedDict):
    scope: Literal["end_user", "team"]
    owner_id: str
    memory_count: float
    last_occurred_at: str


class ListMemoryOwnersOutput(TypedDict):
    owners: list[ListMemoryOwnersOutputOwnersItem]
    total_count: float
    limit: float
    offset: float


class _ListMemoryReviewsInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemoryReviewsInput(_ListMemoryReviewsInputRequired, total=False):
    state: Literal["open", "settled"]
    reason: str
    limit: str
    offset: str


class ListMemoryReviewsOutputReviewsItemContradictingRecordsItem(TypedDict):
    text: str
    recorded_at: str
    knowledge_base_id: str | None
    file_path: str | None
    file_id: str | None


class ListMemoryReviewsOutputReviewsItemContradictedMemoriesItem(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    replaced: bool


class ListMemoryReviewsOutputReviewsItemMemoryPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class ListMemoryReviewsOutputReviewsItemMemorySourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class ListMemoryReviewsOutputReviewsItemMemory(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: ListMemoryReviewsOutputReviewsItemMemoryPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[ListMemoryReviewsOutputReviewsItemMemorySourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class ListMemoryReviewsOutputReviewsItem(TypedDict):
    id: str
    memory_id: str
    stored_memory_id: str
    reason: Literal[
        "instruction_like",
        "sensitive",
        "disputed",
        "hard_case",
        "recheck_unsure",
        "contradicts_file",
    ]
    state: Literal["open", "settled"]
    evidence: dict[str, object]
    contradicting_records: list[ListMemoryReviewsOutputReviewsItemContradictingRecordsItem]
    contradicted_memories: list[ListMemoryReviewsOutputReviewsItemContradictedMemoriesItem]
    settled_trust_level: Literal["confirmed", "likely", "disputed", "not_kept"] | None
    settled_by: str | None
    created_at: str
    settled_at: str | None
    memory: ListMemoryReviewsOutputReviewsItemMemory


class ListMemoryReviewsOutput(TypedDict):
    reviews: list[ListMemoryReviewsOutputReviewsItem]
    total_count: float
    limit: float
    offset: float


class _ListMemorySavedQuestionsInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemorySavedQuestionsInput(_ListMemorySavedQuestionsInputRequired, total=False):
    flagged: Literal["true", "false"]
    limit: str
    offset: str


class ListMemorySavedQuestionsOutputSavedQuestionsItem(TypedDict):
    id: str
    question: str
    stored_memory_id: str
    memory_text: str | None
    end_user_id: str | None
    team_id: str | None
    rank: float | None
    flag: Literal["memory_replaced", "memory_forgotten"] | None
    replaced_by: str | None
    created_at: str


class ListMemorySavedQuestionsOutput(TypedDict):
    saved_questions: list[ListMemorySavedQuestionsOutputSavedQuestionsItem]
    total_count: float
    limit: float
    offset: float


class _ListMemorySourcesInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemorySourcesInput(_ListMemorySourcesInputRequired, total=False):
    kind: str
    limit: str
    offset: str


class ListMemorySourcesOutputSourcesItemSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class ListMemorySourcesOutputSourcesItemCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class ListMemorySourcesOutputSourcesItemLastError(TypedDict):
    code: str
    message: str
    at: str


class ListMemorySourcesOutputSourcesItem(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: ListMemorySourcesOutputSourcesItemSignIn | None
    created_at: str
    created_by: ListMemorySourcesOutputSourcesItemCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: ListMemorySourcesOutputSourcesItemLastError | None


class ListMemorySourcesOutput(TypedDict):
    sources: list[ListMemorySourcesOutputSourcesItem]
    total_count: float
    limit: float
    offset: float


class _ListMemoryWebhookDeliveriesInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMemoryWebhookDeliveriesInput(_ListMemoryWebhookDeliveriesInputRequired, total=False):
    state: str
    limit: str
    offset: str


class ListMemoryWebhookDeliveriesOutputDeliveriesItem(TypedDict):
    id: str
    type: Literal["decision_applied"]
    decision_id: str
    state: Literal["waiting", "delivered", "failed"]
    attempts: float
    response_status: float | None
    failure: str | None
    next_attempt_at: str | None
    created_at: str
    delivered_at: str | None


class ListMemoryWebhookDeliveriesOutput(TypedDict):
    deliveries: list[ListMemoryWebhookDeliveriesOutputDeliveriesItem]
    total_count: float
    limit: float
    offset: float


class _ListMessagesInputRequired(TypedDict):
    project_id: str
    memory_id: str


class ListMessagesInput(_ListMessagesInputRequired, total=False):
    source_id: str
    conversation_id: str
    state: str
    limit: str
    offset: str


class ListMessagesOutputMessagesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    text_start: str
    state: Literal["waiting", "sorted", "superseded", "cancelled", "failed"]
    attempts: float
    memories_written: float
    failure_code: str | None
    received_at: str
    finished_at: str | None


class ListMessagesOutput(TypedDict):
    messages: list[ListMessagesOutputMessagesItem]
    total_count: float
    limit: float
    offset: float


class _ListMetadataKeysInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListMetadataKeysInput(_ListMetadataKeysInputRequired, total=False):
    search: str
    limit: str
    offset: str


class ListMetadataKeysOutputKeysItem(TypedDict):
    key: str
    file_count: float


class ListMetadataKeysOutput(TypedDict):
    keys: list[ListMetadataKeysOutputKeysItem]
    total_count: float
    limit: float
    offset: float


class _ListMetadataValuesInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    key: str


class ListMetadataValuesInput(_ListMetadataValuesInputRequired, total=False):
    search: str
    limit: str
    offset: str


class ListMetadataValuesOutputValuesItem(TypedDict):
    value: str
    file_count: float


class ListMetadataValuesOutput(TypedDict):
    key: str
    values: list[ListMetadataValuesOutputValuesItem]
    total_count: float
    limit: float
    offset: float


class ListOperationsInput(TypedDict):
    pass


class ListOperationsOutputOperationsItemKeyPermissionsItem(TypedDict):
    resource_kind: Literal["databases", "indexes", "knowledge_bases", "memory"]
    level: Literal["read", "write"]
    target: Literal["resource", "every", "any"]
    resource_id_field: Literal["database_id", "index_id", "knowledge_base_id"] | None
    only_with_field: str | None


class ListOperationsOutputOperationsItem(TypedDict):
    id: str
    method: Literal["GET", "POST", "DELETE"]
    path: str
    access: str
    key_permissions: list[ListOperationsOutputOperationsItemKeyPermissionsItem] | None
    summary: str


class ListOperationsOutput(TypedDict):
    operations: list[ListOperationsOutputOperationsItem]


class ListProjectsInput(TypedDict, total=False):
    state: Literal["live", "deleted"]
    role: str
    created_from: str
    created_to: str
    search: str
    sort: Literal["created_at", "name", "purge_after", "last_changed_at"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListProjectsOutputProjectsItem(TypedDict):
    id: str
    name: str
    region: str
    role: Literal["owner", "member"] | None
    created_at: str
    deleted_at: str | None
    purge_after: str | None
    sirannon_url: str
    narsil_url: str
    database_count: float
    index_count: float
    knowledge_base_count: float
    memory_enabled: bool
    member_count: float
    last_changed_at: str


class ListProjectsOutput(TypedDict):
    projects: list[ListProjectsOutputProjectsItem]
    total_count: float
    limit: float
    offset: float


class _ListQuestionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListQuestionsInput(_ListQuestionsInputRequired, total=False):
    end_user_id: str
    search: str
    sort: Literal["asked_at"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListQuestionsOutputQuestionsItemPassagesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentAreasItem]
    page_sizes: list[ListQuestionsOutputQuestionsItemPassagesItemCitationDocumentPageSizesItem]


class ListQuestionsOutputQuestionsItemPassagesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class ListQuestionsOutputQuestionsItemPassagesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class ListQuestionsOutputQuestionsItemPassagesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class ListQuestionsOutputQuestionsItemPassagesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListQuestionsOutputQuestionsItemPassagesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListQuestionsOutputQuestionsItemPassagesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[ListQuestionsOutputQuestionsItemPassagesItemCitationImageAreasItem]
    page_sizes: list[ListQuestionsOutputQuestionsItemPassagesItemCitationImagePageSizesItem]


class ListQuestionsOutputQuestionsItemPassagesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentAreasItem]
    page_sizes: list[ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocumentPageSizesItem]


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImageAreasItem]
    page_sizes: list[ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImagePageSizesItem]


class ListQuestionsOutputQuestionsItemPassagesItemMatchCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class ListQuestionsOutputQuestionsItemPassagesItem(TypedDict):
    chunk_id: str
    file_id: str
    file_path: str
    version: float
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    heading: str | None
    score: float
    citation: (
        ListQuestionsOutputQuestionsItemPassagesItemCitationDocument
        | ListQuestionsOutputQuestionsItemPassagesItemCitationSpreadsheet
        | ListQuestionsOutputQuestionsItemPassagesItemCitationSlides
        | ListQuestionsOutputQuestionsItemPassagesItemCitationWebPage
        | ListQuestionsOutputQuestionsItemPassagesItemCitationImage
        | ListQuestionsOutputQuestionsItemPassagesItemCitationRecording
        | None
    )
    match_citation: (
        ListQuestionsOutputQuestionsItemPassagesItemMatchCitationDocument
        | ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSpreadsheet
        | ListQuestionsOutputQuestionsItemPassagesItemMatchCitationSlides
        | ListQuestionsOutputQuestionsItemPassagesItemMatchCitationWebPage
        | ListQuestionsOutputQuestionsItemPassagesItemMatchCitationImage
        | ListQuestionsOutputQuestionsItemPassagesItemMatchCitationRecording
        | None
    )


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentAreasItem]
    page_sizes: list[
        ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocumentPageSizesItem
    ]


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImageAreasItem]
    page_sizes: list[ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImagePageSizesItem]


class ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class ListQuestionsOutputQuestionsItemSavedAnswerPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationDocument
        | ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSpreadsheet
        | ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationSlides
        | ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationWebPage
        | ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationImage
        | ListQuestionsOutputQuestionsItemSavedAnswerPassageCitationRecording
        | None
    )


class ListQuestionsOutputQuestionsItemSavedAnswer(TypedDict):
    saved_question_id: str
    passage_index: float | None
    passage: ListQuestionsOutputQuestionsItemSavedAnswerPassage


class ListQuestionsOutputQuestionsItem(TypedDict):
    id: str
    asked_at: str
    question: str
    end_user_id: str | None
    live_index_id: str
    duration_ms: float
    passages: list[ListQuestionsOutputQuestionsItemPassagesItem]
    saved_answer: ListQuestionsOutputQuestionsItemSavedAnswer | None


class ListQuestionsOutput(TypedDict):
    questions: list[ListQuestionsOutputQuestionsItem]
    total_count: float
    limit: float
    offset: float


class ListSavedQueriesInput(TypedDict):
    project_id: str
    database_id: str


class ListSavedQueriesOutputSavedQueriesItemCreatedBy(TypedDict):
    id: str
    name: str


class ListSavedQueriesOutputSavedQueriesItem(TypedDict):
    id: str
    database_id: str
    name: str
    sql: str
    created_by: ListSavedQueriesOutputSavedQueriesItemCreatedBy
    created_at: str
    updated_at: str


class ListSavedQueriesOutput(TypedDict):
    saved_queries: list[ListSavedQueriesOutputSavedQueriesItem]


class _ListSavedQuestionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListSavedQuestionsInput(_ListSavedQuestionsInputRequired, total=False):
    state: str
    split: str
    search: str
    sort: Literal["created_at", "question"]
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentAreasItem]
    page_sizes: list[ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocumentPageSizesItem]


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImageAreasItem]
    page_sizes: list[ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImagePageSizesItem]


class ListSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class ListSavedQuestionsOutputSavedQuestionsItemPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        ListSavedQuestionsOutputSavedQuestionsItemPassageCitationDocument
        | ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSpreadsheet
        | ListSavedQuestionsOutputSavedQuestionsItemPassageCitationSlides
        | ListSavedQuestionsOutputSavedQuestionsItemPassageCitationWebPage
        | ListSavedQuestionsOutputSavedQuestionsItemPassageCitationImage
        | ListSavedQuestionsOutputSavedQuestionsItemPassageCitationRecording
        | None
    )


class ListSavedQuestionsOutputSavedQuestionsItemBrokenPrevious(TypedDict):
    version: float
    first_position: float
    last_position: float


class ListSavedQuestionsOutputSavedQuestionsItemBroken(TypedDict):
    change: Literal["changed", "moved", "removed"]
    version: float | None
    detected_at: str
    previous: ListSavedQuestionsOutputSavedQuestionsItemBrokenPrevious | None


class ListSavedQuestionsOutputSavedQuestionsItem(TypedDict):
    id: str
    question: str
    split: Literal["tuning", "held_back"]
    source: Literal["question_log", "file", "api", "judge"]
    question_log_id: str | None
    end_user_id: str | None
    passage: ListSavedQuestionsOutputSavedQuestionsItemPassage
    broken: ListSavedQuestionsOutputSavedQuestionsItemBroken | None
    created_at: str
    updated_at: str


class ListSavedQuestionsOutput(TypedDict):
    saved_questions: list[ListSavedQuestionsOutputSavedQuestionsItem]
    total_count: float
    limit: float
    offset: float


class _ListScorecardResultsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    scorecard_id: str


class ListScorecardResultsInput(_ListScorecardResultsInputRequired, total=False):
    compare_to: str
    outcome: str
    change: str
    split: str
    cause: str
    limit: str
    offset: str


class ListScorecardResultsOutputResultsItemCauseDetail(TypedDict):
    explanation: str
    deep_rank: float | None
    keyword_rank: float | None
    vector_rank: float | None
    question_language: str | None
    passage_language: str | None
    chunks_in_passage: float | None
    missing_terms: list[str] | None


class ListScorecardResultsOutputResultsItemPassage(TypedDict):
    file_id: str
    file_path: str | None
    version: float
    heading: str | None


class ListScorecardResultsOutputResultsItemReturnedItem(TypedDict):
    rank: float
    chunk_id: str
    file_id: str
    file_path: str | None
    version: float
    heading: str | None


class ListScorecardResultsOutputResultsItemCompared(TypedDict):
    rank: float | None
    passed: bool
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )


class ListScorecardResultsOutputResultsItem(TypedDict):
    saved_question_id: str
    question: str
    split: Literal["tuning", "held_back"]
    passage_state: Literal["confirmed", "unconfirmed"]
    rank: float | None
    passed: bool
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )
    cause_detail: ListScorecardResultsOutputResultsItemCauseDetail | None
    passage: ListScorecardResultsOutputResultsItemPassage
    returned: list[ListScorecardResultsOutputResultsItemReturnedItem]
    compared: ListScorecardResultsOutputResultsItemCompared | None


class ListScorecardResultsOutput(TypedDict):
    results: list[ListScorecardResultsOutputResultsItem]
    total_count: float
    limit: float
    offset: float


class _ListScorecardsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListScorecardsInput(_ListScorecardsInputRequired, total=False):
    direction: Literal["asc", "desc"]
    limit: str
    offset: str


class ListScorecardsOutputScorecardsItemTuning(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class ListScorecardsOutputScorecardsItemHeldBack(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class ListScorecardsOutputScorecardsItemConfigurationSettingsBoost(TypedDict):
    text: float
    heading: float


class ListScorecardsOutputScorecardsItemConfigurationSettingsFusionRrf(TypedDict):
    strategy: Literal["rrf"]
    rank_constant: float


class ListScorecardsOutputScorecardsItemConfigurationSettingsFusionLinear(TypedDict):
    strategy: Literal["linear"]
    vector_weight: float


class ListScorecardsOutputScorecardsItemConfigurationSettingsBm25(TypedDict):
    k1: float
    b: float


class ListScorecardsOutputScorecardsItemConfigurationSettingsStopWords(TypedDict):
    added: list[str]
    removed: list[str]


class ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption2(TypedDict):
    words: list[str]


class ListScorecardsOutputScorecardsItemConfigurationSettings(TypedDict):
    boost: ListScorecardsOutputScorecardsItemConfigurationSettingsBoost
    fusion: (
        ListScorecardsOutputScorecardsItemConfigurationSettingsFusionRrf
        | ListScorecardsOutputScorecardsItemConfigurationSettingsFusionLinear
    )
    bm25: ListScorecardsOutputScorecardsItemConfigurationSettingsBm25
    stop_words: ListScorecardsOutputScorecardsItemConfigurationSettingsStopWords
    synonyms: list[
        ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption1
        | ListScorecardsOutputScorecardsItemConfigurationSettingsSynonymsItemOption2
    ]
    language: str
    chunk_tokens: float


class ListScorecardsOutputScorecardsItemConfiguration(TypedDict):
    live_index_id: str
    settings: ListScorecardsOutputScorecardsItemConfigurationSettings


class ListScorecardsOutputScorecardsItem(TypedDict):
    id: str
    purpose: Literal["requested", "before", "after"]
    status: Literal["queued", "running", "done", "failed"]
    waiting_for_search: bool
    pass_id: str | None
    depth: float
    score: float | None
    question_count: float | None
    passed_count: float | None
    first_count: float | None
    mean_reciprocal_rank: float | None
    tuning: ListScorecardsOutputScorecardsItemTuning | None
    held_back: ListScorecardsOutputScorecardsItemHeldBack | None
    configuration: ListScorecardsOutputScorecardsItemConfiguration | None
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class ListScorecardsOutput(TypedDict):
    scorecards: list[ListScorecardsOutputScorecardsItem]
    total_count: float
    limit: float
    offset: float


class _ListSourceItemsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class ListSourceItemsInput(_ListSourceItemsInputRequired, total=False):
    external_id: str
    state: str
    limit: str
    offset: str


class ListSourceItemsOutputItemsItem(TypedDict):
    external_id: str
    version: float
    kind: Literal["conversation", "message", "record", "deletion"]
    document_id: str
    state: Literal["waiting", "written", "superseded"]
    received_at: str
    file_id: str | None


class ListSourceItemsOutput(TypedDict):
    items: list[ListSourceItemsOutputItemsItem]
    total_count: float
    limit: float
    offset: float


class _ListSourceSyncsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class ListSourceSyncsInput(_ListSourceSyncsInputRequired, total=False):
    limit: str
    offset: str


class ListSourceSyncsOutputSyncsItemError(TypedDict):
    code: str
    message: str


class ListSourceSyncsOutputSyncsItem(TypedDict):
    id: str
    status: Literal["syncing", "finished", "failed"]
    started_at: str
    finished_at: str | None
    files_added: float
    files_changed: float
    files_removed: float
    error: ListSourceSyncsOutputSyncsItemError | None


class ListSourceSyncsOutput(TypedDict):
    syncs: list[ListSourceSyncsOutputSyncsItem]
    total_count: float
    limit: float
    offset: float


class _ListSourcesInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class ListSourcesInput(_ListSourcesInputRequired, total=False):
    kind: str
    limit: str
    offset: str


class ListSourcesOutputSourcesItemSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class ListSourcesOutputSourcesItemCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class ListSourcesOutputSourcesItemLastError(TypedDict):
    code: str
    message: str
    at: str


class ListSourcesOutputSourcesItem(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: ListSourcesOutputSourcesItemSignIn | None
    created_at: str
    created_by: ListSourcesOutputSourcesItemCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: ListSourcesOutputSourcesItemLastError | None


class ListSourcesOutput(TypedDict):
    sources: list[ListSourcesOutputSourcesItem]
    total_count: float
    limit: float
    offset: float


class ListTableRowsInputFiltersItemValueInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ListTableRowsInputFiltersItemValueBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class ListTableRowsInputFiltersItemValueItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ListTableRowsInputFiltersItemValueItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class _ListTableRowsInputFiltersItemRequired(TypedDict):
    column: str
    operator: Literal[
        "eq", "neq", "gt", "gte", "lt", "lte", "like", "not_like", "in", "is_null", "is_not_null"
    ]


class ListTableRowsInputFiltersItem(_ListTableRowsInputFiltersItemRequired, total=False):
    value: (
        float
        | str
        | ListTableRowsInputFiltersItemValueInteger
        | ListTableRowsInputFiltersItemValueBlob
        | Sequence[
            float
            | str
            | ListTableRowsInputFiltersItemValueItemInteger
            | ListTableRowsInputFiltersItemValueItemBlob
            | None
        ]
        | None
    )


class _ListTableRowsInputSortsItemRequired(TypedDict):
    column: str


class ListTableRowsInputSortsItem(_ListTableRowsInputSortsItemRequired, total=False):
    direction: Literal["asc", "desc"]


class ListTableRowsInputAfterItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ListTableRowsInputAfterItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class ListTableRowsInputBeforeItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ListTableRowsInputBeforeItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class _ListTableRowsInputRequired(TypedDict):
    project_id: str
    database_id: str
    table_name: str


class ListTableRowsInput(_ListTableRowsInputRequired, total=False):
    filters: Sequence[ListTableRowsInputFiltersItem]
    sorts: Sequence[ListTableRowsInputSortsItem]
    page_size: int | str
    offset: int | str
    after: Sequence[
        float | str | ListTableRowsInputAfterItemInteger | ListTableRowsInputAfterItemBlob | None
    ]
    before: Sequence[
        float | str | ListTableRowsInputBeforeItemInteger | ListTableRowsInputBeforeItemBlob | None
    ]
    last_page: bool


class ListTableRowsOutputTableColumnsItem(TypedDict):
    name: str
    declared_type: str
    not_null: bool
    default_sql: str | None
    primary_key_position: float
    generated: bool


class ListTableRowsOutputTableForeignKeysItem(TypedDict):
    columns: list[str]
    references_table: str
    references_columns: list[str]
    on_delete: str
    on_update: str


class ListTableRowsOutputTableIndexesItem(TypedDict):
    name: str
    unique: bool
    columns: list[str]


class ListTableRowsOutputTable(TypedDict):
    name: str
    kind: Literal["table", "view"]
    sql: str | None
    columns: list[ListTableRowsOutputTableColumnsItem]
    row_key: list[str] | None
    foreign_keys: list[ListTableRowsOutputTableForeignKeysItem]
    indexes: list[ListTableRowsOutputTableIndexesItem]


class ListTableRowsOutputRowsItemKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class ListTableRowsOutputRowsItemKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class ListTableRowsOutputRowsItemCellsItem(TypedDict):
    type: Literal["integer", "real", "text", "blob"]
    text: str
    size: float
    truncated: bool


class ListTableRowsOutputRowsItem(TypedDict):
    key: (
        list[
            float
            | str
            | ListTableRowsOutputRowsItemKeyItemInteger
            | ListTableRowsOutputRowsItemKeyItemBlob
            | None
        ]
        | None
    )
    cells: list[float | str | ListTableRowsOutputRowsItemCellsItem | None]


class ListTableRowsOutput(TypedDict):
    table: ListTableRowsOutputTable
    rows: list[ListTableRowsOutputRowsItem]
    offset: float
    page_size: float
    row_count: float
    row_count_capped: bool
    has_previous_page: bool
    has_next_page: bool


class _ListVersionBlocksInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    file_id: str
    version: str


class ListVersionBlocksInput(_ListVersionBlocksInputRequired, total=False):
    sheet: str
    from_row: str
    limit: str
    offset: str


class ListVersionBlocksOutputBlocksItemPlace(TypedDict):
    page: float | None
    sheet: str | None
    row: float | None
    slide: float | None
    start_second: float | None
    end_second: float | None


class ListVersionBlocksOutputBlocksItem(TypedDict):
    position: float
    kind: Literal[
        "title",
        "heading",
        "paragraph",
        "list_item",
        "table_row",
        "caption",
        "code",
        "formula",
        "image_text",
        "segment",
    ]
    heading_level: float | None
    text: str
    place: ListVersionBlocksOutputBlocksItemPlace


class ListVersionBlocksOutput(TypedDict):
    blocks: list[ListVersionBlocksOutputBlocksItem]
    total_count: float
    limit: float
    offset: float


class PreviewCreateTableInputColumnsItemDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class PreviewCreateTableInputColumnsItemDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class PreviewCreateTableInputColumnsItemDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class PreviewCreateTableInputColumnsItemDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class _PreviewCreateTableInputColumnsItemReferencesRequired(TypedDict):
    table: str
    column: str


class PreviewCreateTableInputColumnsItemReferences(
    _PreviewCreateTableInputColumnsItemReferencesRequired, total=False
):
    on_delete: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]
    on_update: Literal["no_action", "restrict", "cascade", "set_null", "set_default"]


class _PreviewCreateTableInputColumnsItemRequired(TypedDict):
    name: str
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class PreviewCreateTableInputColumnsItem(_PreviewCreateTableInputColumnsItemRequired, total=False):
    not_null: bool
    default: (
        PreviewCreateTableInputColumnsItemDefaultValue
        | PreviewCreateTableInputColumnsItemDefaultCurrentTimestamp
        | PreviewCreateTableInputColumnsItemDefaultCurrentDate
        | PreviewCreateTableInputColumnsItemDefaultCurrentTime
        | None
    )
    primary_key: bool
    unique: bool
    references: PreviewCreateTableInputColumnsItemReferences | None


class PreviewCreateTableInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    columns: Sequence[PreviewCreateTableInputColumnsItem]


class PreviewCreateTableOutputPreview(TypedDict):
    table_name: str
    migration_name: str
    sql: str
    base_migration_version: float


class PreviewCreateTableOutput(TypedDict):
    preview: PreviewCreateTableOutputPreview


class PreviewIndexSearchInputPinnedItem(TypedDict):
    record_id: str
    rank: int | str


_PreviewIndexSearchInputFacetRangesValueItemRequired = TypedDict(
    "_PreviewIndexSearchInputFacetRangesValueItemRequired", {"from": float, "to": float}
)


class _PreviewIndexSearchInputFacetRangesValueItemOptional(TypedDict, total=False):
    pass


class PreviewIndexSearchInputFacetRangesValueItem(
    _PreviewIndexSearchInputFacetRangesValueItemRequired,
    _PreviewIndexSearchInputFacetRangesValueItemOptional,
):
    pass


class _PreviewIndexSearchInputRequired(TypedDict):
    project_id: str
    index_id: str
    query: str


class PreviewIndexSearchInput(_PreviewIndexSearchInputRequired, total=False):
    filters: str
    mode: Literal["keyword", "vector", "hybrid"]
    vector_field: str
    fields: str | Sequence[str]
    boosts: str | Mapping[str, object]
    term_match: int | str
    tolerance: int | str
    prefix_length: int | str
    exact: bool
    prefix: bool
    partial_words: bool
    minimum_score: float | str
    fusion: Literal["rrf", "linear"]
    fusion_constant: int | str
    vector_weight: float | str
    minimum_similarity: float | str
    vector_candidates: int | str
    sort: str
    direction: Literal["asc", "desc"]
    pinned: Sequence[PreviewIndexSearchInputPinnedItem]
    group_by: str | Sequence[str]
    group_size: int | str
    facets: str | Sequence[str]
    facet_limit: int | str
    facet_filters: str
    facet_ranges: Mapping[str, Sequence[PreviewIndexSearchInputFacetRangesValueItem]]
    offset: int | str
    limit: int | str


class PreviewIndexSearchOutputSort(TypedDict):
    field: str
    direction: Literal["asc", "desc"]


class PreviewIndexSearchOutputTuning(TypedDict, total=False):
    fields: list[str]
    boosts: dict[str, float]
    term_match: float | Literal["all", "any"]
    tolerance: float
    prefix_length: float
    exact: bool
    prefix: bool
    partial_words: bool
    minimum_score: float
    fusion: Literal["rrf", "linear"]
    fusion_constant: float
    vector_weight: float
    minimum_similarity: float
    vector_candidates: float


_PreviewIndexSearchOutputFacetsItemValuesItemRequired = TypedDict(
    "_PreviewIndexSearchOutputFacetsItemValuesItemRequired",
    {"value": str, "count": float, "from": float | None, "to": float | None},
)


class _PreviewIndexSearchOutputFacetsItemValuesItemOptional(TypedDict, total=False):
    pass


class PreviewIndexSearchOutputFacetsItemValuesItem(
    _PreviewIndexSearchOutputFacetsItemValuesItemRequired,
    _PreviewIndexSearchOutputFacetsItemValuesItemOptional,
):
    pass


class PreviewIndexSearchOutputFacetsItem(TypedDict):
    field: str
    counted: Literal["matches", "result_window"]
    values: list[PreviewIndexSearchOutputFacetsItemValuesItem]
    error_bound: float


class PreviewIndexSearchOutputGroupsItem(TypedDict):
    values: dict[str, object]
    count: float | None


class PreviewIndexSearchOutputResultsItemKeywordTermsItemFieldsItem(TypedDict):
    field: str
    count: float
    field_length: float


class PreviewIndexSearchOutputResultsItemKeywordTermsItem(TypedDict):
    term: str
    weight: float
    fields: list[PreviewIndexSearchOutputResultsItemKeywordTermsItemFieldsItem]


class PreviewIndexSearchOutputResultsItemKeywordFieldScoresItem(TypedDict):
    field: str
    score: float


class PreviewIndexSearchOutputResultsItemKeyword(TypedDict):
    rank: float | None
    score: float | None
    terms: list[PreviewIndexSearchOutputResultsItemKeywordTermsItem]
    field_scores: list[PreviewIndexSearchOutputResultsItemKeywordFieldScoresItem] | None


class PreviewIndexSearchOutputResultsItemVector(TypedDict):
    rank: float | None
    similarity: float | None


class PreviewIndexSearchOutputResultsItemHighlightsItemMarksItem(TypedDict):
    start: float
    end: float


class PreviewIndexSearchOutputResultsItemHighlightsItem(TypedDict):
    field: str
    marks: list[PreviewIndexSearchOutputResultsItemHighlightsItemMarksItem]


class PreviewIndexSearchOutputResultsItem(TypedDict):
    rank: float
    id: str
    score: float
    record: dict[str, object]
    keyword: PreviewIndexSearchOutputResultsItemKeyword
    vector: PreviewIndexSearchOutputResultsItemVector | None
    highlights: list[PreviewIndexSearchOutputResultsItemHighlightsItem]
    pinned: bool
    group: float | None


class PreviewIndexSearchOutput(TypedDict):
    mode: Literal["keyword", "vector", "hybrid"]
    vector_field: str | None
    fusion: Literal["rrf", "linear"] | None
    fusion_constant: float | None
    vector_weight: float | None
    sort: PreviewIndexSearchOutputSort | None
    tuning: PreviewIndexSearchOutputTuning
    facets: list[PreviewIndexSearchOutputFacetsItem]
    groups: list[PreviewIndexSearchOutputGroupsItem] | None
    group_count: float | None
    total_count: float
    total_is_exact: bool
    offset: float
    next_offset: float | None
    duration_ms: float
    results: list[PreviewIndexSearchOutputResultsItem]


class PreviewTableColumnChangesInputChangesItemAddDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class PreviewTableColumnChangesInputChangesItemAddDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class PreviewTableColumnChangesInputChangesItemAddPositionBefore(TypedDict):
    side: Literal["before"]
    column: str


class PreviewTableColumnChangesInputChangesItemAddPositionAfter(TypedDict):
    side: Literal["after"]
    column: str


class _PreviewTableColumnChangesInputChangesItemAddRequired(TypedDict):
    kind: Literal["add"]
    name: str
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class PreviewTableColumnChangesInputChangesItemAdd(
    _PreviewTableColumnChangesInputChangesItemAddRequired, total=False
):
    not_null: bool
    default: (
        PreviewTableColumnChangesInputChangesItemAddDefaultValue
        | PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTimestamp
        | PreviewTableColumnChangesInputChangesItemAddDefaultCurrentDate
        | PreviewTableColumnChangesInputChangesItemAddDefaultCurrentTime
        | None
    )
    position: (
        PreviewTableColumnChangesInputChangesItemAddPositionBefore
        | PreviewTableColumnChangesInputChangesItemAddPositionAfter
    )


class PreviewTableColumnChangesInputChangesItemRename(TypedDict):
    kind: Literal["rename"]
    column: str
    new_name: str


class PreviewTableColumnChangesInputChangesItemAlterDefaultValue(TypedDict):
    kind: Literal["value"]
    value: float | str


class PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTimestamp(TypedDict):
    kind: Literal["current_timestamp"]


class PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentDate(TypedDict):
    kind: Literal["current_date"]


class PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTime(TypedDict):
    kind: Literal["current_time"]


class _PreviewTableColumnChangesInputChangesItemAlterRequired(TypedDict):
    kind: Literal["alter"]
    column: str


class PreviewTableColumnChangesInputChangesItemAlter(
    _PreviewTableColumnChangesInputChangesItemAlterRequired, total=False
):
    type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]
    not_null: bool
    default: (
        PreviewTableColumnChangesInputChangesItemAlterDefaultValue
        | PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTimestamp
        | PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentDate
        | PreviewTableColumnChangesInputChangesItemAlterDefaultCurrentTime
        | None
    )


class PreviewTableColumnChangesInputChangesItemDrop(TypedDict):
    kind: Literal["drop"]
    column: str


class PreviewTableColumnChangesInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    changes: Sequence[
        PreviewTableColumnChangesInputChangesItemAdd
        | PreviewTableColumnChangesInputChangesItemRename
        | PreviewTableColumnChangesInputChangesItemAlter
        | PreviewTableColumnChangesInputChangesItemDrop
    ]


class PreviewTableColumnChangesOutputPreviewRowChecksItem(TypedDict):
    column: str
    check: Literal[
        "holds_nulls",
        "values_do_not_convert",
        "values_change_form",
        "values_removed",
        "rows_need_value",
    ]
    rows: float
    rows_capped: bool
    blocks_change: bool


class PreviewTableColumnChangesOutputPreview(TypedDict):
    table_name: str
    migration_name: str
    sql: str
    base_migration_version: float
    rebuilds_table: bool
    destructive: bool
    blocked: bool
    warnings: list[str]
    row_count: float
    row_count_capped: bool
    row_checks: list[PreviewTableColumnChangesOutputPreviewRowChecksItem]
    columns_before: list[str]
    columns_after: list[str]
    changed_columns: list[str]


class PreviewTableColumnChangesOutput(TypedDict):
    preview: PreviewTableColumnChangesOutputPreview


class _PromoteCorrectionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    correction_id: str


class PromoteCorrectionInput(_PromoteCorrectionInputRequired, total=False):
    note: str


class PromoteCorrectionOutputSettingFieldBoost(TypedDict):
    kind: Literal["field_boost"]
    text: float
    heading: float


class PromoteCorrectionOutputSettingOption1(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["rrf"]
    rank_constant: int


class PromoteCorrectionOutputSettingOption2(TypedDict):
    kind: Literal["fusion"]
    strategy: Literal["linear"]
    vector_weight: float


class PromoteCorrectionOutputSettingBm25(TypedDict):
    kind: Literal["bm25"]
    k1: float
    b: float


class PromoteCorrectionOutputSettingStopWords(TypedDict):
    kind: Literal["stop_words"]
    added: list[str]
    removed: list[str]


class PromoteCorrectionOutputSettingSynonymsRulesItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class PromoteCorrectionOutputSettingSynonymsRulesItemOption2(TypedDict):
    words: list[str]


class PromoteCorrectionOutputSettingSynonyms(TypedDict):
    kind: Literal["synonyms"]
    rules: list[
        PromoteCorrectionOutputSettingSynonymsRulesItemOption1
        | PromoteCorrectionOutputSettingSynonymsRulesItemOption2
    ]


class PromoteCorrectionOutputSettingLanguage(TypedDict):
    kind: Literal["language"]
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]


class PromoteCorrectionOutputSettingChunking(TypedDict):
    kind: Literal["chunking"]
    chunk_tokens: int


class PromoteCorrectionOutputSettingRebuild(TypedDict):
    kind: Literal["rebuild"]


class PromoteCorrectionOutputSettingAgentDepth(TypedDict):
    kind: Literal["agent_depth"]
    depth: float


class PromoteCorrectionOutputEstimate(TypedDict):
    seconds: float
    memory_bytes: float
    second_index: bool
    chunks_to_index: float
    questions_to_score: float
    price_usd: float | None


class PromoteCorrectionOutputBeforeTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class PromoteCorrectionOutputBeforeHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class PromoteCorrectionOutputBefore(TypedDict):
    scorecard_id: str | None
    tuning: PromoteCorrectionOutputBeforeTuning
    held_back: PromoteCorrectionOutputBeforeHeldBack


class PromoteCorrectionOutputAfterTuning(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class PromoteCorrectionOutputAfterHeldBack(TypedDict):
    count: float
    passed: float
    mean_reciprocal_rank: float | None


class PromoteCorrectionOutputAfter(TypedDict):
    scorecard_id: str | None
    tuning: PromoteCorrectionOutputAfterTuning
    held_back: PromoteCorrectionOutputAfterHeldBack


class PromoteCorrectionOutputQuestionChanges(TypedDict):
    now_pass: float
    now_fail: float
    moved_up: float
    moved_down: float


class PromoteCorrectionOutput(TypedDict):
    id: str
    origin: Literal["himring", "engineer"]
    cause: (
        Literal[
            "ranked_lower",
            "cut_across_chunks",
            "different_language",
            "different_word",
            "old_version",
            "passage_missing",
        ]
        | None
    )
    kind: Literal[
        "field_boost",
        "fusion",
        "bm25",
        "stop_words",
        "synonyms",
        "language",
        "chunking",
        "rebuild",
        "agent_depth",
    ]
    setting: (
        PromoteCorrectionOutputSettingFieldBoost
        | PromoteCorrectionOutputSettingOption1
        | PromoteCorrectionOutputSettingOption2
        | PromoteCorrectionOutputSettingBm25
        | PromoteCorrectionOutputSettingStopWords
        | PromoteCorrectionOutputSettingSynonyms
        | PromoteCorrectionOutputSettingLanguage
        | PromoteCorrectionOutputSettingChunking
        | PromoteCorrectionOutputSettingRebuild
        | PromoteCorrectionOutputSettingAgentDepth
    )
    target_ids: list[str]
    file_kinds: list[
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    ]
    status: Literal["proposed", "trying", "tried", "promoting", "promoted", "discarded", "failed"]
    pass_id: str | None
    estimate: PromoteCorrectionOutputEstimate
    before: PromoteCorrectionOutputBefore | None
    after: PromoteCorrectionOutputAfter | None
    verdict: Literal[
        "untried",
        "trying",
        "promoted",
        "waits_for_person",
        "waits_for_held_back",
        "lowers_held_back",
        "no_gain",
        "discarded",
        "failed",
    ]
    question_changes: PromoteCorrectionOutputQuestionChanges | None
    waits_for_click: bool
    wait_reason: str | None
    decided_by: Literal["himring", "engineer"] | None
    decision_note: str | None
    failure_message: str | None
    created_at: str
    tried_at: str | None
    decided_at: str | None


class _PromoteMemoryInputRequired(TypedDict):
    project_id: str
    memory_id: str
    stored_memory_id: str
    scope: Literal["team", "company"]


class PromoteMemoryInput(_PromoteMemoryInputRequired, total=False):
    team_id: str


class PromoteMemoryOutputPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class PromoteMemoryOutputSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class PromoteMemoryOutput(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: PromoteMemoryOutputPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[PromoteMemoryOutputSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class ProposeCorrectionsInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class ProposeCorrectionsOutput(TypedDict):
    id: str
    trigger: Literal["requested", "automatic"]
    mode: Literal["propose", "try"]
    status: Literal["queued", "running", "done", "failed"]
    complete_index: bool
    before_scorecard_id: str | None
    after_scorecard_id: str | None
    correction_ids: list[str]
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class ProposeDatabaseChangeInput(TypedDict):
    project_id: str
    database_id: str
    request: str


class ProposeDatabaseChangeOutputProposalTablesItem(TypedDict):
    name: str
    change: Literal["created", "changed", "dropped"]
    columns_before: list[str]
    columns_after: list[str]


class ProposeDatabaseChangeOutputProposal(TypedDict):
    summary: str
    migration_name: str
    sql: str
    destructive: bool
    warnings: list[str]
    base_migration_version: float
    tables: list[ProposeDatabaseChangeOutputProposalTablesItem]


class ProposeDatabaseChangeOutput(TypedDict):
    proposal: ProposeDatabaseChangeOutputProposal


class _RecallMemoriesInputRequired(TypedDict):
    project_id: str
    memory_id: str
    query: str


class RecallMemoriesInput(_RecallMemoriesInputRequired, total=False):
    end_user_id: str
    team_id: str
    agent_id: str
    as_of: str
    type: str | Sequence[str]
    limit: int | str
    trial: bool


class RecallMemoriesOutputMemoriesItemPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class RecallMemoriesOutputMemoriesItemSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


_RecallMemoriesOutputMemoriesItemHoldsRequired = TypedDict(
    "_RecallMemoriesOutputMemoriesItemHoldsRequired",
    {"from": str, "until": str | None, "expires_at": str | None},
)


class _RecallMemoriesOutputMemoriesItemHoldsOptional(TypedDict, total=False):
    pass


class RecallMemoriesOutputMemoriesItemHolds(
    _RecallMemoriesOutputMemoriesItemHoldsRequired, _RecallMemoriesOutputMemoriesItemHoldsOptional
):
    pass


class RecallMemoriesOutputMemoriesItemReplacesItem(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class RecallMemoriesOutputMemoriesItemReplacedBy(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class RecallMemoriesOutputMemoriesItemConflictsWithItemMemorySourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class RecallMemoriesOutputMemoriesItemConflictsWithItemMemory(TypedDict):
    kind: Literal["memory"]
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    sources: list[RecallMemoriesOutputMemoriesItemConflictsWithItemMemorySourcesItem]


class RecallMemoriesOutputMemoriesItemConflictsWithItemFile(TypedDict):
    kind: Literal["file"]
    text: str
    recorded_at: str
    knowledge_base_id: str | None
    file_id: str | None
    file_path: str | None
    resolution: Literal["open", "memory_replaces_file"]


class RecallMemoriesOutputMemoriesItemConflictsWithItemWaitingMessage(TypedDict):
    kind: Literal["waiting_message"]
    text: str
    sent_at: str
    source_id: str
    external_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]


class RecallMemoriesOutputMemoriesItem(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    subject: str
    subject_owner_id: str | None
    text: str
    values: dict[str, str | float | bool | None]
    plan: RecallMemoriesOutputMemoriesItemPlan | None
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    trust_reasons: list[
        Literal[
            "from_records",
            "said_by_staff",
            "said_by_code",
            "said_by_agent",
            "said_by_end_user",
            "said_by_outsider",
            "said_by_subject_owner",
            "people_agree",
            "one_source",
            "too_few_sources",
            "contradicts_memory",
            "contradicts_file",
            "contradicts_waiting_message",
            "replaces_file",
            "instruction_like",
            "held_secret",
            "unsure",
            "rechecked",
            "settled_by_reply",
            "settled_by_person",
        ]
    ]
    agent_may: Literal["use", "ask"]
    sources: list[RecallMemoriesOutputMemoriesItemSourcesItem]
    holds: RecallMemoriesOutputMemoriesItemHolds
    replaces: list[RecallMemoriesOutputMemoriesItemReplacesItem]
    replaced_by: RecallMemoriesOutputMemoriesItemReplacedBy | None
    conflicts_with: list[
        RecallMemoriesOutputMemoriesItemConflictsWithItemMemory
        | RecallMemoriesOutputMemoriesItemConflictsWithItemFile
        | RecallMemoriesOutputMemoriesItemConflictsWithItemWaitingMessage
    ]
    connection_strength: float
    recall_strength: float
    last_checked_at: str | None
    check: Literal["current", "pending"]
    sorted_by: Literal["rules", "model", "as_given"]
    sorting_probability: float | None


class RecallMemoriesOutput(TypedDict):
    recall_id: str | None
    duration_ms: float
    memories: list[RecallMemoriesOutputMemoriesItem]


class _RecordAnswerEventsInputEventsItemRequired(TypedDict):
    question_id: str


class RecordAnswerEventsInputEventsItem(_RecordAnswerEventsInputEventsItemRequired, total=False):
    answer: str
    follow_up: str
    cited_chunk_ids: Sequence[str]
    thumbs_down: bool
    handoff_reason: str
    occurred_at: str


class _RecordAnswerEventsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    events: Sequence[RecordAnswerEventsInputEventsItem]


class RecordAnswerEventsInput(_RecordAnswerEventsInputRequired, total=False):
    origin: Literal["event", "sdk"]


class RecordAnswerEventsOutputResultsItem(TypedDict):
    question_id: str
    outcome: Literal["recorded", "sent_to_person", "follow_up_not_judged", "question_not_found"]


class RecordAnswerEventsOutput(TypedDict):
    results: list[RecordAnswerEventsOutputResultsItem]
    recorded_count: float


class RecoverMemoryInput(TypedDict):
    project_id: str
    memory_id: str
    stored_memory_id: str


class RecoverMemoryOutputPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class RecoverMemoryOutputSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class RecoverMemoryOutput(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: RecoverMemoryOutputPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[RecoverMemoryOutputSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class RemoveMemberInput(TypedDict):
    project_id: str
    account_id: str


class RemoveMemberOutput(TypedDict):
    removed: Literal[True]


class RemoveMemoryWebhookInput(TypedDict):
    project_id: str
    memory_id: str


class RemoveMemoryWebhookOutput(TypedDict):
    url: str
    created_at: str
    updated_at: str


class RestoreDatabaseInput(TypedDict):
    project_id: str
    database_id: str


class RestoreDatabaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class RestoreDatabaseOutputSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class RestoreDatabaseOutputCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class RestoreDatabaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: RestoreDatabaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: RestoreDatabaseOutputSize | None
    compaction: RestoreDatabaseOutputCompaction | None
    sql_write_preview: bool


class RestoreFileInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    file_id: str


class RestoreFileOutputFailure(TypedDict):
    code: str
    message: str


class RestoreFileOutputUnreadPartsItemFailure(TypedDict):
    code: str
    message: str


class RestoreFileOutputUnreadPartsItem(TypedDict):
    first_page: float | None
    last_page: float | None
    start_second: float | None
    end_second: float | None
    failure: RestoreFileOutputUnreadPartsItemFailure


class RestoreFileOutput(TypedDict):
    id: str
    knowledge_base_id: str
    path: str
    kind: Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
    address: str | None
    status: Literal["queued", "processing", "ready", "failed"]
    current_version: float | None
    latest_version: float
    size_bytes: float
    content_sha256: str
    failure: RestoreFileOutputFailure | None
    unread_parts: list[RestoreFileOutputUnreadPartsItem]
    metadata: dict[str, str]
    created_at: str
    updated_at: str
    deleted_at: str | None
    purge_after: str | None


class RestoreIndexInput(TypedDict):
    project_id: str
    index_id: str


class RestoreIndexOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class RestoreIndexOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: RestoreIndexOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class RestoreIndexSnapshotInput(TypedDict):
    project_id: str
    index_id: str
    content: FileContent


class RestoreIndexSnapshotOutputIndexCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class RestoreIndexSnapshotOutputIndex(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: RestoreIndexSnapshotOutputIndexCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class RestoreIndexSnapshotOutput(TypedDict):
    index: RestoreIndexSnapshotOutputIndex
    record_count: float


class RestoreKnowledgeBaseInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class RestoreKnowledgeBaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class RestoreKnowledgeBaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    language: str
    chunk_tokens: float
    question_log_retention_days: float | None
    created_at: str
    created_by: RestoreKnowledgeBaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    database_id: str
    live_index_id: str
    sirannon_url: str
    search_pending_since: str | None


class RestoreMemoryInput(TypedDict):
    project_id: str
    memory_id: str


class RestoreMemoryOutputSettingsSubjectsItem(TypedDict):
    subject: str
    owner_id: str | None
    sensitive: bool


class RestoreMemoryOutputSettingsAgentPermissions(TypedDict):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class RestoreMemoryOutputSettingsCueWeightsStatementKind(TypedDict):
    statement: float
    event: float
    promise: float
    procedure: float
    instruction: float


class RestoreMemoryOutputSettingsCueWeightsAuthorKind(TypedDict):
    staff: float
    agent: float
    end_user: float
    outsider: float
    records: float
    code: float


class RestoreMemoryOutputSettingsCueWeights(TypedDict):
    statement_kind: RestoreMemoryOutputSettingsCueWeightsStatementKind
    author_kind: RestoreMemoryOutputSettingsCueWeightsAuthorKind
    subject_owner: float
    private_channel: float
    reactions_for_second_voice: float


class RestoreMemoryOutputSettings(TypedDict):
    duplicate_threshold: float
    confidence_threshold: float
    agreeing_authors_for_confirmed: float
    first_pack_tokens: float
    recall_fade_days: float
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: list[str] | None
    subjects: list[RestoreMemoryOutputSettingsSubjectsItem]
    sources_for_likely: float
    agent_permissions: RestoreMemoryOutputSettingsAgentPermissions
    dropped_list_days: float | None
    replaced_retention_days: float | None
    message_retention_days: float | None
    personal_retention_days: float | None
    recall_log_retention_days: float | None
    ready_set_size: float
    recall_depth: float
    cue_weights: RestoreMemoryOutputSettingsCueWeights
    recall_checked_memories: float


class RestoreMemoryOutputCheckedKnowledgeBasesLeftOutItem(TypedDict):
    knowledge_base_id: str
    reason: Literal["over_limit", "deleted", "not_found", "not_ready", "in_another_cell"]


class RestoreMemoryOutputCheckedKnowledgeBases(TypedDict):
    knowledge_base_ids: list[str]
    left_out: list[RestoreMemoryOutputCheckedKnowledgeBasesLeftOutItem]
    left_out_count: float
    limit: float


class RestoreMemoryOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class RestoreMemoryOutput(TypedDict):
    id: str
    project_id: str
    language: str
    settings: RestoreMemoryOutputSettings
    checked_knowledge_bases: RestoreMemoryOutputCheckedKnowledgeBases
    created_at: str
    created_by: RestoreMemoryOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    sorting_pending_since: str | None


class RestoreProjectInput(TypedDict):
    project_id: str


class RestoreProjectOutput(TypedDict):
    id: str
    name: str
    region: str
    role: Literal["owner", "member"] | None
    created_at: str
    deleted_at: str | None
    purge_after: str | None
    sirannon_url: str
    narsil_url: str


class ReviewFlaggedQuestionsInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class ReviewFlaggedQuestionsOutput(TypedDict):
    started: bool


class RevokeApiKeyInput(TypedDict):
    project_id: str
    key_id: str


class RevokeApiKeyOutputPermissionsDatabases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class RevokeApiKeyOutputPermissionsIndexes(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class RevokeApiKeyOutputPermissionsKnowledgeBases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class RevokeApiKeyOutputPermissionsMemory(TypedDict):
    level: Literal["none", "read", "write"]


class RevokeApiKeyOutputPermissions(TypedDict):
    access: Literal["full", "restricted"]
    databases: RevokeApiKeyOutputPermissionsDatabases
    indexes: RevokeApiKeyOutputPermissionsIndexes
    knowledge_bases: RevokeApiKeyOutputPermissionsKnowledgeBases
    memory: RevokeApiKeyOutputPermissionsMemory


class RevokeApiKeyOutput(TypedDict):
    id: str
    project_id: str
    name: str
    display_prefix: str
    permissions: RevokeApiKeyOutputPermissions
    permissions_changed_at: str | None
    permissions_changed_by_name: str | None
    created_by: str
    created_by_name: str
    created_at: str
    expires_at: str | None
    last_used_at: str | None
    revoked_at: str | None


class RevokeInvitationInput(TypedDict):
    project_id: str
    invitation_id: str


class RevokeInvitationOutput(TypedDict):
    id: str
    project_id: str
    project_name: str
    email: str
    role: Literal["owner", "member"]
    created_at: str
    expires_at: str
    accepted_at: str | None
    revoked_at: str | None


class _RunDatabaseSqlInputRequired(TypedDict):
    project_id: str
    database_id: str
    sql: str


class RunDatabaseSqlInput(_RunDatabaseSqlInputRequired, total=False):
    confirmation_token: str


class RunDatabaseSqlOutputRowsResultsItemColumnsItem(TypedDict):
    name: str
    declared_type: str | None


class RunDatabaseSqlOutputRowsResultsItemRowsItemItem(TypedDict):
    type: Literal["integer", "real", "text", "blob"]
    text: str
    size: float
    truncated: bool


class RunDatabaseSqlOutputRowsResultsItem(TypedDict):
    columns: list[RunDatabaseSqlOutputRowsResultsItemColumnsItem]
    rows: list[list[float | str | RunDatabaseSqlOutputRowsResultsItemRowsItemItem | None]]
    truncated: bool
    changes: float
    writes: bool


class RunDatabaseSqlOutputRows(TypedDict):
    outcome: Literal["rows"]
    results: list[RunDatabaseSqlOutputRowsResultsItem]
    elapsed_ms: float


class RunDatabaseSqlOutputNeedsConfirmation(TypedDict):
    outcome: Literal["needs_confirmation"]
    changes: float
    statement_count: float
    confirmation_token: str
    expires_at: str


class RunDatabaseSqlOutputApplied(TypedDict):
    outcome: Literal["applied"]
    changes: float
    statement_count: float


RunDatabaseSqlOutput: TypeAlias = (
    RunDatabaseSqlOutputRows | RunDatabaseSqlOutputNeedsConfirmation | RunDatabaseSqlOutputApplied
)


class SaveIndexRecordInput(TypedDict):
    project_id: str
    index_id: str
    record_id: str
    record: Mapping[str, object]


class SaveIndexRecordOutput(TypedDict):
    id: str
    record: dict[str, object]
    created: bool


class _SaveMemoryQuestionInputRequired(TypedDict):
    project_id: str
    memory_id: str
    question: str
    stored_memory_id: str


class SaveMemoryQuestionInput(_SaveMemoryQuestionInputRequired, total=False):
    end_user_id: str
    team_id: str


class SaveMemoryQuestionOutput(TypedDict):
    id: str
    question: str
    stored_memory_id: str
    memory_text: str | None
    end_user_id: str | None
    team_id: str | None
    rank: float | None
    flag: Literal["memory_replaced", "memory_forgotten"] | None
    replaced_by: str | None
    created_at: str


class _SaveQueryInputRequired(TypedDict):
    project_id: str
    database_id: str
    name: str
    sql: str


class SaveQueryInput(_SaveQueryInputRequired, total=False):
    saved_query_id: str


class SaveQueryOutputSavedQueryCreatedBy(TypedDict):
    id: str
    name: str


class SaveQueryOutputSavedQuery(TypedDict):
    id: str
    database_id: str
    name: str
    sql: str
    created_by: SaveQueryOutputSavedQueryCreatedBy
    created_at: str
    updated_at: str


class SaveQueryOutput(TypedDict):
    saved_query: SaveQueryOutputSavedQuery


class _SaveQuestionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    question: str


class SaveQuestionInput(_SaveQuestionInputRequired, total=False):
    chunk_id: str
    file_id: str
    version: int | str
    first_position: int | str
    last_position: int | str
    question_log_id: str
    end_user_id: str


class SaveQuestionOutputPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SaveQuestionOutputPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SaveQuestionOutputPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[SaveQuestionOutputPassageCitationDocumentAreasItem]
    page_sizes: list[SaveQuestionOutputPassageCitationDocumentPageSizesItem]


class SaveQuestionOutputPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class SaveQuestionOutputPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class SaveQuestionOutputPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class SaveQuestionOutputPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SaveQuestionOutputPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SaveQuestionOutputPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[SaveQuestionOutputPassageCitationImageAreasItem]
    page_sizes: list[SaveQuestionOutputPassageCitationImagePageSizesItem]


class SaveQuestionOutputPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class SaveQuestionOutputPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        SaveQuestionOutputPassageCitationDocument
        | SaveQuestionOutputPassageCitationSpreadsheet
        | SaveQuestionOutputPassageCitationSlides
        | SaveQuestionOutputPassageCitationWebPage
        | SaveQuestionOutputPassageCitationImage
        | SaveQuestionOutputPassageCitationRecording
        | None
    )


class SaveQuestionOutputBrokenPrevious(TypedDict):
    version: float
    first_position: float
    last_position: float


class SaveQuestionOutputBroken(TypedDict):
    change: Literal["changed", "moved", "removed"]
    version: float | None
    detected_at: str
    previous: SaveQuestionOutputBrokenPrevious | None


class SaveQuestionOutput(TypedDict):
    id: str
    question: str
    split: Literal["tuning", "held_back"]
    source: Literal["question_log", "file", "api", "judge"]
    question_log_id: str | None
    end_user_id: str | None
    passage: SaveQuestionOutputPassage
    broken: SaveQuestionOutputBroken | None
    created_at: str
    updated_at: str


class ScoreQuestionSetInput(TypedDict):
    project_id: str
    knowledge_base_id: str


class ScoreQuestionSetOutputTuning(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class ScoreQuestionSetOutputHeldBack(TypedDict):
    count: float
    passed: float
    score: float | None
    first: float | None
    mean_reciprocal_rank: float | None


class ScoreQuestionSetOutputConfigurationSettingsBoost(TypedDict):
    text: float
    heading: float


class ScoreQuestionSetOutputConfigurationSettingsFusionRrf(TypedDict):
    strategy: Literal["rrf"]
    rank_constant: float


class ScoreQuestionSetOutputConfigurationSettingsFusionLinear(TypedDict):
    strategy: Literal["linear"]
    vector_weight: float


class ScoreQuestionSetOutputConfigurationSettingsBm25(TypedDict):
    k1: float
    b: float


class ScoreQuestionSetOutputConfigurationSettingsStopWords(TypedDict):
    added: list[str]
    removed: list[str]


class ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption1(TypedDict):
    word: str
    synonyms: list[str]


class ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption2(TypedDict):
    words: list[str]


class ScoreQuestionSetOutputConfigurationSettings(TypedDict):
    boost: ScoreQuestionSetOutputConfigurationSettingsBoost
    fusion: (
        ScoreQuestionSetOutputConfigurationSettingsFusionRrf
        | ScoreQuestionSetOutputConfigurationSettingsFusionLinear
    )
    bm25: ScoreQuestionSetOutputConfigurationSettingsBm25
    stop_words: ScoreQuestionSetOutputConfigurationSettingsStopWords
    synonyms: list[
        ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption1
        | ScoreQuestionSetOutputConfigurationSettingsSynonymsItemOption2
    ]
    language: str
    chunk_tokens: float


class ScoreQuestionSetOutputConfiguration(TypedDict):
    live_index_id: str
    settings: ScoreQuestionSetOutputConfigurationSettings


class ScoreQuestionSetOutput(TypedDict):
    id: str
    purpose: Literal["requested", "before", "after"]
    status: Literal["queued", "running", "done", "failed"]
    waiting_for_search: bool
    pass_id: str | None
    depth: float
    score: float | None
    question_count: float | None
    passed_count: float | None
    first_count: float | None
    mean_reciprocal_rank: float | None
    tuning: ScoreQuestionSetOutputTuning | None
    held_back: ScoreQuestionSetOutputHeldBack | None
    configuration: ScoreQuestionSetOutputConfiguration | None
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class _SearchFoldersInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class SearchFoldersInput(_SearchFoldersInputRequired, total=False):
    search: str
    limit: str
    offset: str


class SearchFoldersOutputFoldersItem(TypedDict):
    path: str
    file_count: float


class SearchFoldersOutput(TypedDict):
    folders: list[SearchFoldersOutputFoldersItem]
    total_count: float
    limit: float
    offset: float


class _SearchKnowledgeBaseInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    question: str


class SearchKnowledgeBaseInput(_SearchKnowledgeBaseInputRequired, total=False):
    limit: int | str
    folder: str
    metadata: Mapping[str, str | Sequence[str]]
    end_user_id: str
    call_id: str
    with_memories: bool
    team_id: str
    agent_id: str


class SearchKnowledgeBaseOutputPassagesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SearchKnowledgeBaseOutputPassagesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SearchKnowledgeBaseOutputPassagesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[SearchKnowledgeBaseOutputPassagesItemCitationDocumentAreasItem]
    page_sizes: list[SearchKnowledgeBaseOutputPassagesItemCitationDocumentPageSizesItem]


class SearchKnowledgeBaseOutputPassagesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class SearchKnowledgeBaseOutputPassagesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class SearchKnowledgeBaseOutputPassagesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class SearchKnowledgeBaseOutputPassagesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SearchKnowledgeBaseOutputPassagesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SearchKnowledgeBaseOutputPassagesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[SearchKnowledgeBaseOutputPassagesItemCitationImageAreasItem]
    page_sizes: list[SearchKnowledgeBaseOutputPassagesItemCitationImagePageSizesItem]


class SearchKnowledgeBaseOutputPassagesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SearchKnowledgeBaseOutputPassagesItemMatchCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentAreasItem]
    page_sizes: list[SearchKnowledgeBaseOutputPassagesItemMatchCitationDocumentPageSizesItem]


class SearchKnowledgeBaseOutputPassagesItemMatchCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class SearchKnowledgeBaseOutputPassagesItemMatchCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class SearchKnowledgeBaseOutputPassagesItemMatchCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class SearchKnowledgeBaseOutputPassagesItemMatchCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SearchKnowledgeBaseOutputPassagesItemMatchCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SearchKnowledgeBaseOutputPassagesItemMatchCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[SearchKnowledgeBaseOutputPassagesItemMatchCitationImageAreasItem]
    page_sizes: list[SearchKnowledgeBaseOutputPassagesItemMatchCitationImagePageSizesItem]


class SearchKnowledgeBaseOutputPassagesItemMatchCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class SearchKnowledgeBaseOutputPassagesItemMatchRange(TypedDict):
    start: float
    end: float


class SearchKnowledgeBaseOutputPassagesItemMatchTermsItem(TypedDict):
    start: float
    end: float


class SearchKnowledgeBaseOutputPassagesItemMatch(TypedDict):
    citation: (
        SearchKnowledgeBaseOutputPassagesItemMatchCitationDocument
        | SearchKnowledgeBaseOutputPassagesItemMatchCitationSpreadsheet
        | SearchKnowledgeBaseOutputPassagesItemMatchCitationSlides
        | SearchKnowledgeBaseOutputPassagesItemMatchCitationWebPage
        | SearchKnowledgeBaseOutputPassagesItemMatchCitationImage
        | SearchKnowledgeBaseOutputPassagesItemMatchCitationRecording
    )
    range: SearchKnowledgeBaseOutputPassagesItemMatchRange
    terms: list[SearchKnowledgeBaseOutputPassagesItemMatchTermsItem]


class SearchKnowledgeBaseOutputPassagesItem(TypedDict):
    chunk_id: str
    file_id: str
    file_path: str
    file_kind: Literal[
        "pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"
    ]
    version: float
    heading: str | None
    text: str
    truncated: bool
    score: float
    citation: (
        SearchKnowledgeBaseOutputPassagesItemCitationDocument
        | SearchKnowledgeBaseOutputPassagesItemCitationSpreadsheet
        | SearchKnowledgeBaseOutputPassagesItemCitationSlides
        | SearchKnowledgeBaseOutputPassagesItemCitationWebPage
        | SearchKnowledgeBaseOutputPassagesItemCitationImage
        | SearchKnowledgeBaseOutputPassagesItemCitationRecording
    )
    match: SearchKnowledgeBaseOutputPassagesItemMatch


class SearchKnowledgeBaseOutputMemoriesItemPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class SearchKnowledgeBaseOutputMemoriesItemSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


_SearchKnowledgeBaseOutputMemoriesItemHoldsRequired = TypedDict(
    "_SearchKnowledgeBaseOutputMemoriesItemHoldsRequired",
    {"from": str, "until": str | None, "expires_at": str | None},
)


class _SearchKnowledgeBaseOutputMemoriesItemHoldsOptional(TypedDict, total=False):
    pass


class SearchKnowledgeBaseOutputMemoriesItemHolds(
    _SearchKnowledgeBaseOutputMemoriesItemHoldsRequired,
    _SearchKnowledgeBaseOutputMemoriesItemHoldsOptional,
):
    pass


class SearchKnowledgeBaseOutputMemoriesItemReplacesItem(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class SearchKnowledgeBaseOutputMemoriesItemReplacedBy(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    held_until: str | None


class SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemorySourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemory(TypedDict):
    kind: Literal["memory"]
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    held_from: str
    sources: list[SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemorySourcesItem]


class SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemFile(TypedDict):
    kind: Literal["file"]
    text: str
    recorded_at: str
    knowledge_base_id: str | None
    file_id: str | None
    file_path: str | None
    resolution: Literal["open", "memory_replaces_file"]


class SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemWaitingMessage(TypedDict):
    kind: Literal["waiting_message"]
    text: str
    sent_at: str
    source_id: str
    external_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]


class SearchKnowledgeBaseOutputMemoriesItem(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    subject: str
    subject_owner_id: str | None
    text: str
    values: dict[str, str | float | bool | None]
    plan: SearchKnowledgeBaseOutputMemoriesItemPlan | None
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    trust_reasons: list[
        Literal[
            "from_records",
            "said_by_staff",
            "said_by_code",
            "said_by_agent",
            "said_by_end_user",
            "said_by_outsider",
            "said_by_subject_owner",
            "people_agree",
            "one_source",
            "too_few_sources",
            "contradicts_memory",
            "contradicts_file",
            "contradicts_waiting_message",
            "replaces_file",
            "instruction_like",
            "held_secret",
            "unsure",
            "rechecked",
            "settled_by_reply",
            "settled_by_person",
        ]
    ]
    agent_may: Literal["use", "ask"]
    sources: list[SearchKnowledgeBaseOutputMemoriesItemSourcesItem]
    holds: SearchKnowledgeBaseOutputMemoriesItemHolds
    replaces: list[SearchKnowledgeBaseOutputMemoriesItemReplacesItem]
    replaced_by: SearchKnowledgeBaseOutputMemoriesItemReplacedBy | None
    conflicts_with: list[
        SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemMemory
        | SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemFile
        | SearchKnowledgeBaseOutputMemoriesItemConflictsWithItemWaitingMessage
    ]
    connection_strength: float
    recall_strength: float
    last_checked_at: str | None
    check: Literal["current", "pending"]
    sorted_by: Literal["rules", "model", "as_given"]
    sorting_probability: float | None


class SearchKnowledgeBaseOutput(TypedDict):
    question_id: str
    duration_ms: float
    passages: list[SearchKnowledgeBaseOutputPassagesItem]
    memories: list[SearchKnowledgeBaseOutputMemoriesItem]
    recall_id: str | None


class _SendMemoryFeedbackInputRequired(TypedDict):
    project_id: str
    memory_id: str
    stored_memory_id: str
    verdict: Literal["right", "wrong"]


class SendMemoryFeedbackInput(_SendMemoryFeedbackInputRequired, total=False):
    recall_id: str


class SendMemoryFeedbackOutput(TypedDict):
    id: str
    stored_memory_id: str
    verdict: Literal["right", "wrong"]
    created_at: str


class SetMemoryWebhookInput(TypedDict):
    project_id: str
    memory_id: str
    url: str


class SetMemoryWebhookOutput(TypedDict):
    url: str
    created_at: str
    updated_at: str
    signing_secret: str


class _SettleFlaggedQuestionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    question_id: str


class SettleFlaggedQuestionInput(_SettleFlaggedQuestionInputRequired, total=False):
    chunk_id: str
    file_id: str
    version: int | str
    first_position: int | str
    last_position: int | str


class SettleFlaggedQuestionOutputSignalDetailsItem(TypedDict):
    kind: Literal[
        "handoff",
        "thumbs_down",
        "verdict",
        "unsupported_answer",
        "repeated_question",
        "near_saved_question",
        "passage_changed",
        "follow_ups_past_limit",
    ]
    detail: dict[str, object]
    received_at: str


class SettleFlaggedQuestionOutputAnswer(TypedDict):
    answer: str | None
    follow_up: str | None
    cited_chunk_ids: list[str]
    answered_by: Literal["event", "log", "sdk", "transcript"]
    answered_at: str


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentAreasItem]
    page_sizes: list[SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocumentPageSizesItem]


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[SettleFlaggedQuestionOutputReturnedPassagesItemCitationImageAreasItem]
    page_sizes: list[SettleFlaggedQuestionOutputReturnedPassagesItemCitationImagePageSizesItem]


class SettleFlaggedQuestionOutputReturnedPassagesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class SettleFlaggedQuestionOutputReturnedPassagesItem(TypedDict):
    rank: float
    chunk_id: str
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    heading: str | None
    citation: (
        SettleFlaggedQuestionOutputReturnedPassagesItemCitationDocument
        | SettleFlaggedQuestionOutputReturnedPassagesItemCitationSpreadsheet
        | SettleFlaggedQuestionOutputReturnedPassagesItemCitationSlides
        | SettleFlaggedQuestionOutputReturnedPassagesItemCitationWebPage
        | SettleFlaggedQuestionOutputReturnedPassagesItemCitationImage
        | SettleFlaggedQuestionOutputReturnedPassagesItemCitationRecording
        | None
    )


class SettleFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SettleFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SettleFlaggedQuestionOutputCandidatesItemCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[SettleFlaggedQuestionOutputCandidatesItemCitationDocumentAreasItem]
    page_sizes: list[SettleFlaggedQuestionOutputCandidatesItemCitationDocumentPageSizesItem]


class SettleFlaggedQuestionOutputCandidatesItemCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class SettleFlaggedQuestionOutputCandidatesItemCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class SettleFlaggedQuestionOutputCandidatesItemCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class SettleFlaggedQuestionOutputCandidatesItemCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class SettleFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class SettleFlaggedQuestionOutputCandidatesItemCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[SettleFlaggedQuestionOutputCandidatesItemCitationImageAreasItem]
    page_sizes: list[SettleFlaggedQuestionOutputCandidatesItemCitationImagePageSizesItem]


class SettleFlaggedQuestionOutputCandidatesItemCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class SettleFlaggedQuestionOutputCandidatesItem(TypedDict):
    rank: float
    chunk_id: str
    file_id: str
    version: float
    first_position: float
    last_position: float
    heading: str | None
    probability: float
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    latest_version: float | None
    citation: (
        SettleFlaggedQuestionOutputCandidatesItemCitationDocument
        | SettleFlaggedQuestionOutputCandidatesItemCitationSpreadsheet
        | SettleFlaggedQuestionOutputCandidatesItemCitationSlides
        | SettleFlaggedQuestionOutputCandidatesItemCitationWebPage
        | SettleFlaggedQuestionOutputCandidatesItemCitationImage
        | SettleFlaggedQuestionOutputCandidatesItemCitationRecording
        | None
    )


class SettleFlaggedQuestionOutput(TypedDict):
    question_id: str
    question: str
    end_user_id: str | None
    status: Literal["waiting", "saved", "unsure", "unanswerable"]
    signals: list[
        Literal[
            "handoff",
            "thumbs_down",
            "verdict",
            "unsupported_answer",
            "repeated_question",
            "near_saved_question",
            "passage_changed",
            "follow_ups_past_limit",
        ]
    ]
    flagged_at: str
    judged_at: str | None
    probability: float | None
    chosen_rank: float | None
    saved_question_id: str | None
    settled_by: Literal["judge", "person"] | None
    signal_details: list[SettleFlaggedQuestionOutputSignalDetailsItem]
    answer: SettleFlaggedQuestionOutputAnswer | None
    returned_passages: list[SettleFlaggedQuestionOutputReturnedPassagesItem]
    candidates: list[SettleFlaggedQuestionOutputCandidatesItem]
    none_probability: float | None
    answer_read: bool


class _SettleMemoryInputRequired(TypedDict):
    project_id: str
    memory_id: str
    stored_memory_id: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]


class SettleMemoryInput(_SettleMemoryInputRequired, total=False):
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str
    expires_at: str | None
    over_file: bool


class SettleMemoryOutputPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class SettleMemoryOutputSourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class SettleMemoryOutput(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: SettleMemoryOutputPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[SettleMemoryOutputSourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class _SettleMemoryReviewInputRequired(TypedDict):
    project_id: str
    memory_id: str
    review_id: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]


class SettleMemoryReviewInput(_SettleMemoryReviewInputRequired, total=False):
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str


class SettleMemoryReviewOutputContradictingRecordsItem(TypedDict):
    text: str
    recorded_at: str
    knowledge_base_id: str | None
    file_path: str | None
    file_id: str | None


class SettleMemoryReviewOutputContradictedMemoriesItem(TypedDict):
    id: str
    text: str
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    replaced: bool


class SettleMemoryReviewOutputMemoryPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class SettleMemoryReviewOutputMemorySourcesItem(TypedDict):
    source_id: str
    external_id: str
    version: float
    conversation_id: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider", "records", "code"]
    sent_at: str


class SettleMemoryReviewOutputMemory(TypedDict):
    id: str
    memory_id: str
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: SettleMemoryReviewOutputMemoryPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    connection_strength: float
    recall_strength: float
    sources: list[SettleMemoryReviewOutputMemorySourcesItem]
    replaced_by: str | None
    held_until: str | None
    expires_at: str | None
    last_checked_at: str | None
    forgotten_at: str | None
    purge_after: str | None
    occurred_at: str
    created_at: str
    updated_at: str


class SettleMemoryReviewOutput(TypedDict):
    id: str
    memory_id: str
    stored_memory_id: str
    reason: Literal[
        "instruction_like",
        "sensitive",
        "disputed",
        "hard_case",
        "recheck_unsure",
        "contradicts_file",
    ]
    state: Literal["open", "settled"]
    evidence: dict[str, object]
    contradicting_records: list[SettleMemoryReviewOutputContradictingRecordsItem]
    contradicted_memories: list[SettleMemoryReviewOutputContradictedMemoriesItem]
    settled_trust_level: Literal["confirmed", "likely", "disputed", "not_kept"] | None
    settled_by: str | None
    created_at: str
    settled_at: str | None
    memory: SettleMemoryReviewOutputMemory


class _SignInInputRequired(TypedDict):
    email: str
    password: str


class SignInInput(_SignInInputRequired, total=False):
    known_device_token: str


class SignInOutputSecondFactorRequired(TypedDict):
    state: Literal["second_factor_required"]
    challenge_token: str
    known_device_token: str


class SignInOutputSecondFactorSetupRequired(TypedDict):
    state: Literal["second_factor_setup_required"]
    session_token: str
    known_device_token: str


SignInOutput: TypeAlias = SignInOutputSecondFactorRequired | SignInOutputSecondFactorSetupRequired


class SignOutInput(TypedDict):
    pass


class SignOutOutput(TypedDict):
    signed_out: Literal[True]


class SignUpInput(TypedDict):
    email: str
    password: str
    name: str


class SignUpOutput(TypedDict):
    email: str
    next_step: Literal["sign_in"]


class SignUploadPartsInputPartsItem(TypedDict):
    part_number: int
    sha256: str


class SignUploadPartsInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    upload_id: str
    parts: Sequence[SignUploadPartsInputPartsItem]


class SignUploadPartsOutputPartsItem(TypedDict):
    part_number: float
    size_bytes: float
    method: Literal["PUT"]
    url: str
    headers: dict[str, str]
    expires_at: str


class SignUploadPartsOutput(TypedDict):
    parts: list[SignUploadPartsOutputPartsItem]


class _SortMessageInputRequired(TypedDict):
    project_id: str
    memory_id: str
    text: str
    author: str
    author_kind: Literal["staff", "agent", "end_user", "outsider"]


class SortMessageInput(_SortMessageInputRequired, total=False):
    sent_at: str
    conversation_id: str
    end_user_id: str
    team_id: str
    private: bool
    sorting: Literal["full", "rules_only", "as_given"]


class SortMessageOutputMemoriesItemPlan(TypedDict):
    due_at: str | None
    state: Literal["open", "done", "cancelled", "overdue"]


class SortMessageOutputMemoriesItem(TypedDict):
    type: Literal["event", "fact", "plan", "procedure"]
    scope: Literal["end_user", "team", "company"]
    owner_id: str | None
    personal: bool
    trust_level: Literal["confirmed", "likely", "disputed", "not_kept"]
    text: str
    subject: str
    values: dict[str, str | float | bool | None]
    plan: SortMessageOutputMemoriesItemPlan | None
    sensitive: bool
    instruction_like: bool
    sorted_by: Literal["rules", "model", "as_given"]
    review_reason: (
        Literal[
            "instruction_like",
            "sensitive",
            "disputed",
            "hard_case",
            "recheck_unsure",
            "contradicts_file",
        ]
        | None
    )
    duplicate_of: str | None
    conflicts_with: list[str]
    agrees_with: list[str]


class SortMessageOutput(TypedDict):
    memories: list[SortMessageOutputMemoriesItem]


class StartMemorySourceSignInInput(TypedDict):
    project_id: str
    memory_id: str
    source_id: str


class StartMemorySourceSignInOutput(TypedDict):
    sign_in_url: str
    expires_at: str


class StartSourceSignInInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class StartSourceSignInOutput(TypedDict):
    sign_in_url: str
    expires_at: str


class _SuggestIndexTermsInputRequired(TypedDict):
    project_id: str
    index_id: str
    prefix: str


class SuggestIndexTermsInput(_SuggestIndexTermsInputRequired, total=False):
    limit: int | str


class SuggestIndexTermsOutputTermsItem(TypedDict):
    term: str
    record_count: float


class SuggestIndexTermsOutput(TypedDict):
    terms: list[SuggestIndexTermsOutputTermsItem]
    duration_ms: float


class SyncMemorySourceInput(TypedDict):
    project_id: str
    memory_id: str
    source_id: str


class SyncMemorySourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class SyncMemorySourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class SyncMemorySourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class SyncMemorySourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: SyncMemorySourceOutputSignIn | None
    created_at: str
    created_by: SyncMemorySourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: SyncMemorySourceOutputLastError | None


class SyncSourceInput(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class SyncSourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class SyncSourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class SyncSourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class SyncSourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: SyncSourceOutputSignIn | None
    created_at: str
    created_by: SyncSourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: SyncSourceOutputLastError | None


class _TryCorrectionsInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    correction_ids: Sequence[str]


class TryCorrectionsInput(_TryCorrectionsInputRequired, total=False):
    complete_index: bool


class TryCorrectionsOutput(TypedDict):
    id: str
    trigger: Literal["requested", "automatic"]
    mode: Literal["propose", "try"]
    status: Literal["queued", "running", "done", "failed"]
    complete_index: bool
    before_scorecard_id: str | None
    after_scorecard_id: str | None
    correction_ids: list[str]
    failure_message: str | None
    requested_at: str
    started_at: str | None
    finished_at: str | None


class TuneMemoryInput(TypedDict):
    project_id: str
    memory_id: str


class TuneMemoryOutputRecall(TypedDict):
    score: float
    mean_reciprocal_rank: float
    depth: float
    question_count: float
    scored_at: str


class TuneMemoryOutputJudgement(TypedDict):
    score: float
    right_count: float
    decision_count: float
    scored_at: str


class TuneMemoryOutputLabelledDecisions(TypedDict):
    tuning_count: float
    held_back_count: float


class TuneMemoryOutputTuning(TypedDict):
    state: Literal["up_to_date", "new_input", "queued", "working"]
    labelled_decisions_since_tuning: float
    labelled_decisions_per_tuning: float
    saved_questions_changed: bool
    memory_changes_since_scoring: float | None
    started_at: str | None
    tuned_at: str | None


class TuneMemoryOutput(TypedDict):
    recall: TuneMemoryOutputRecall | None
    judgement: TuneMemoryOutputJudgement | None
    labelled_decisions: TuneMemoryOutputLabelledDecisions
    flagged_question_count: float
    scoring: bool
    tuning: TuneMemoryOutputTuning


class UndoLearnedChangeInput(TypedDict):
    project_id: str
    memory_id: str
    change_id: str


class UndoLearnedChangeOutput(TypedDict):
    id: str
    setting: str
    from_value: float
    to_value: float
    tuning_decisions: float
    held_back_decisions: float
    held_back_right_before: float
    held_back_right_after: float
    created_at: str
    undone_at: str | None


class UpdateApiKeyInputPermissionsFull(TypedDict):
    access: Literal["full"]


class _UpdateApiKeyInputPermissionsRestrictedDatabasesRequired(TypedDict):
    level: Literal["none", "read", "write"]


class UpdateApiKeyInputPermissionsRestrictedDatabases(
    _UpdateApiKeyInputPermissionsRestrictedDatabasesRequired, total=False
):
    resource_ids: Sequence[str] | None


class _UpdateApiKeyInputPermissionsRestrictedIndexesRequired(TypedDict):
    level: Literal["none", "read", "write"]


class UpdateApiKeyInputPermissionsRestrictedIndexes(
    _UpdateApiKeyInputPermissionsRestrictedIndexesRequired, total=False
):
    resource_ids: Sequence[str] | None


class _UpdateApiKeyInputPermissionsRestrictedKnowledgeBasesRequired(TypedDict):
    level: Literal["none", "read", "write"]


class UpdateApiKeyInputPermissionsRestrictedKnowledgeBases(
    _UpdateApiKeyInputPermissionsRestrictedKnowledgeBasesRequired, total=False
):
    resource_ids: Sequence[str] | None


class UpdateApiKeyInputPermissionsRestrictedMemory(TypedDict):
    level: Literal["none", "read", "write"]


class _UpdateApiKeyInputPermissionsRestrictedRequired(TypedDict):
    access: Literal["restricted"]


class UpdateApiKeyInputPermissionsRestricted(
    _UpdateApiKeyInputPermissionsRestrictedRequired, total=False
):
    databases: UpdateApiKeyInputPermissionsRestrictedDatabases
    indexes: UpdateApiKeyInputPermissionsRestrictedIndexes
    knowledge_bases: UpdateApiKeyInputPermissionsRestrictedKnowledgeBases
    memory: UpdateApiKeyInputPermissionsRestrictedMemory


class UpdateApiKeyInput(TypedDict):
    project_id: str
    key_id: str
    permissions: UpdateApiKeyInputPermissionsFull | UpdateApiKeyInputPermissionsRestricted


class UpdateApiKeyOutputPermissionsDatabases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class UpdateApiKeyOutputPermissionsIndexes(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class UpdateApiKeyOutputPermissionsKnowledgeBases(TypedDict):
    level: Literal["none", "read", "write"]
    resource_ids: list[str] | None


class UpdateApiKeyOutputPermissionsMemory(TypedDict):
    level: Literal["none", "read", "write"]


class UpdateApiKeyOutputPermissions(TypedDict):
    access: Literal["full", "restricted"]
    databases: UpdateApiKeyOutputPermissionsDatabases
    indexes: UpdateApiKeyOutputPermissionsIndexes
    knowledge_bases: UpdateApiKeyOutputPermissionsKnowledgeBases
    memory: UpdateApiKeyOutputPermissionsMemory


class UpdateApiKeyOutput(TypedDict):
    id: str
    project_id: str
    name: str
    display_prefix: str
    permissions: UpdateApiKeyOutputPermissions
    permissions_changed_at: str | None
    permissions_changed_by_name: str | None
    created_by: str
    created_by_name: str
    created_at: str
    expires_at: str | None
    last_used_at: str | None
    revoked_at: str | None


class _UpdateDatabaseInputRequired(TypedDict):
    project_id: str
    database_id: str


class UpdateDatabaseInput(_UpdateDatabaseInputRequired, total=False):
    sql_write_preview: bool


class UpdateDatabaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class UpdateDatabaseOutputSize(TypedDict):
    used_bytes: int
    file_bytes: int
    limit_bytes: int
    state: Literal["room", "over_80_percent", "over_95_percent", "at_limit"]
    measured_at: str


class UpdateDatabaseOutputCompaction(TypedDict):
    state: Literal["running", "finished", "failed"]
    started_at: str
    finished_at: str | None
    file_bytes_before: int
    file_bytes_after: int | None
    failure_code: Literal["interrupted", "disk_full", "failed"] | None


class UpdateDatabaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: UpdateDatabaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    migration_version: float
    sirannon_url: str
    size: UpdateDatabaseOutputSize | None
    compaction: UpdateDatabaseOutputCompaction | None
    sql_write_preview: bool


class UpdateIndexInputBm25(TypedDict, total=False):
    k1: float
    b: float


class UpdateIndexInputSynonymsItemOption1(TypedDict):
    word: str
    synonyms: Sequence[str]


class UpdateIndexInputSynonymsItemOption2(TypedDict):
    words: Sequence[str]


class UpdateIndexInputSearchDefaults(TypedDict, total=False):
    fields: str | Sequence[str]
    boosts: str | Mapping[str, object]
    term_match: int | str
    tolerance: int | str
    prefix_length: int | str
    exact: bool
    prefix: bool
    partial_words: bool
    minimum_score: float | str
    fusion: Literal["rrf", "linear"]
    fusion_constant: int | str
    vector_weight: float | str
    minimum_similarity: float | str
    vector_candidates: int | str


class _UpdateIndexInputRequired(TypedDict):
    project_id: str
    index_id: str


class UpdateIndexInput(_UpdateIndexInputRequired, total=False):
    language: Literal[
        "albanian",
        "amharic",
        "arabic",
        "armenian",
        "azerbaijani",
        "bambara",
        "basque",
        "belarusian",
        "bengali",
        "bosnian",
        "breton",
        "bulgarian",
        "burmese",
        "catalan",
        "chinese",
        "croatian",
        "czech",
        "dagbani",
        "danish",
        "dutch",
        "english",
        "esperanto",
        "estonian",
        "ewe",
        "faroese",
        "fijian",
        "finnish",
        "french",
        "ga",
        "galician",
        "georgian",
        "german",
        "greek",
        "guarani",
        "gujarati",
        "haitian-creole",
        "hausa",
        "hawaiian",
        "hebrew",
        "hindi",
        "hungarian",
        "icelandic",
        "igbo",
        "indonesian",
        "irish",
        "italian",
        "japanese",
        "kannada",
        "kazakh",
        "khmer",
        "kinyarwanda",
        "kirundi",
        "korean",
        "kurmanji",
        "kyrgyz",
        "lao",
        "latin",
        "latvian",
        "lingala",
        "lithuanian",
        "luxembourgish",
        "macedonian",
        "malagasy",
        "malay",
        "malayalam",
        "maltese",
        "maori",
        "marathi",
        "nepali",
        "norwegian",
        "oromo",
        "persian",
        "polish",
        "portuguese",
        "punjabi",
        "romanian",
        "russian",
        "samoan",
        "sanskrit",
        "scottish-gaelic",
        "serbian",
        "shona",
        "sinhala",
        "slovak",
        "slovenian",
        "sorani",
        "spanish",
        "swahili",
        "swedish",
        "tagalog",
        "tamil",
        "tatar",
        "telugu",
        "thai",
        "tibetan",
        "tigrinya",
        "tongan",
        "turkish",
        "twi",
        "ukrainian",
        "urdu",
        "vietnamese",
        "welsh",
        "wolof",
        "xhosa",
        "yoruba",
        "zulu",
    ]
    bm25: UpdateIndexInputBm25 | None
    synonyms: Sequence[UpdateIndexInputSynonymsItemOption1 | UpdateIndexInputSynonymsItemOption2]
    stop_words: Sequence[str] | None
    search_defaults: UpdateIndexInputSearchDefaults | None


class UpdateIndexOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class UpdateIndexOutput(TypedDict):
    id: str
    project_id: str
    name: str
    created_at: str
    created_by: UpdateIndexOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    config: dict[str, object]
    narsil_url: str


class _UpdateKnowledgeBaseInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str


class UpdateKnowledgeBaseInput(_UpdateKnowledgeBaseInputRequired, total=False):
    question_log_retention_days: int | str | None
    agent_depth: int | str
    automatic_corrections: bool
    judge_passages: int | str
    judge_threshold: float | str


class UpdateKnowledgeBaseOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class UpdateKnowledgeBaseOutput(TypedDict):
    id: str
    project_id: str
    name: str
    language: str
    chunk_tokens: float
    question_log_retention_days: float | None
    created_at: str
    created_by: UpdateKnowledgeBaseOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    database_id: str
    live_index_id: str
    sirannon_url: str
    search_pending_since: str | None


class _UpdateMemoryInputSubjectsItemRequired(TypedDict):
    subject: str


class UpdateMemoryInputSubjectsItem(_UpdateMemoryInputSubjectsItemRequired, total=False):
    owner_id: str | None
    sensitive: bool


class UpdateMemoryInputAgentPermissions(TypedDict, total=False):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class UpdateMemoryInputCueWeightsStatementKind(TypedDict, total=False):
    statement: float | str
    event: float | str
    promise: float | str
    procedure: float | str
    instruction: float | str


class UpdateMemoryInputCueWeightsAuthorKind(TypedDict, total=False):
    staff: float | str
    agent: float | str
    end_user: float | str
    outsider: float | str
    records: float | str
    code: float | str


class UpdateMemoryInputCueWeights(TypedDict, total=False):
    statement_kind: UpdateMemoryInputCueWeightsStatementKind
    author_kind: UpdateMemoryInputCueWeightsAuthorKind
    subject_owner: float | str
    private_channel: float | str
    reactions_for_second_voice: int | str


class _UpdateMemoryInputRequired(TypedDict):
    project_id: str
    memory_id: str


class UpdateMemoryInput(_UpdateMemoryInputRequired, total=False):
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: Sequence[str]
    duplicate_threshold: float | str
    confidence_threshold: float | str
    agreeing_authors_for_confirmed: int | str
    first_pack_tokens: int | str
    recall_fade_days: float | str
    subjects: Sequence[UpdateMemoryInputSubjectsItem]
    sources_for_likely: int | str
    agent_permissions: UpdateMemoryInputAgentPermissions
    dropped_list_days: int | str | None
    replaced_retention_days: int | str | None
    message_retention_days: int | str | None
    personal_retention_days: int | str | None
    recall_log_retention_days: int | str | None
    ready_set_size: int | str
    recall_depth: int | str
    cue_weights: UpdateMemoryInputCueWeights


class UpdateMemoryOutputSettingsSubjectsItem(TypedDict):
    subject: str
    owner_id: str | None
    sensitive: bool


class UpdateMemoryOutputSettingsAgentPermissions(TypedDict):
    confirmed: Literal["use", "ask", "withhold"]
    likely: Literal["use", "ask", "withhold"]
    disputed: Literal["use", "ask", "withhold"]


class UpdateMemoryOutputSettingsCueWeightsStatementKind(TypedDict):
    statement: float
    event: float
    promise: float
    procedure: float
    instruction: float


class UpdateMemoryOutputSettingsCueWeightsAuthorKind(TypedDict):
    staff: float
    agent: float
    end_user: float
    outsider: float
    records: float
    code: float


class UpdateMemoryOutputSettingsCueWeights(TypedDict):
    statement_kind: UpdateMemoryOutputSettingsCueWeightsStatementKind
    author_kind: UpdateMemoryOutputSettingsCueWeightsAuthorKind
    subject_owner: float
    private_channel: float
    reactions_for_second_voice: float


class UpdateMemoryOutputSettings(TypedDict):
    duplicate_threshold: float
    confidence_threshold: float
    agreeing_authors_for_confirmed: float
    first_pack_tokens: float
    recall_fade_days: float
    knowledge_base_choice: Literal["every", "listed"]
    checked_knowledge_base_ids: list[str] | None
    subjects: list[UpdateMemoryOutputSettingsSubjectsItem]
    sources_for_likely: float
    agent_permissions: UpdateMemoryOutputSettingsAgentPermissions
    dropped_list_days: float | None
    replaced_retention_days: float | None
    message_retention_days: float | None
    personal_retention_days: float | None
    recall_log_retention_days: float | None
    ready_set_size: float
    recall_depth: float
    cue_weights: UpdateMemoryOutputSettingsCueWeights
    recall_checked_memories: float


class UpdateMemoryOutputCheckedKnowledgeBasesLeftOutItem(TypedDict):
    knowledge_base_id: str
    reason: Literal["over_limit", "deleted", "not_found", "not_ready", "in_another_cell"]


class UpdateMemoryOutputCheckedKnowledgeBases(TypedDict):
    knowledge_base_ids: list[str]
    left_out: list[UpdateMemoryOutputCheckedKnowledgeBasesLeftOutItem]
    left_out_count: float
    limit: float


class UpdateMemoryOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class UpdateMemoryOutput(TypedDict):
    id: str
    project_id: str
    language: str
    settings: UpdateMemoryOutputSettings
    checked_knowledge_bases: UpdateMemoryOutputCheckedKnowledgeBases
    created_at: str
    created_by: UpdateMemoryOutputCreatedBy
    deleted_at: str | None
    purge_after: str | None
    sorting_pending_since: str | None


class _UpdateMemorySourceInputRequired(TypedDict):
    project_id: str
    memory_id: str
    source_id: str


class UpdateMemorySourceInput(_UpdateMemorySourceInputRequired, total=False):
    name: str
    sorting: Literal["full", "rules_only", "as_given"]
    settings: Mapping[str, object]
    credentials: Mapping[str, object]
    rotate_webhook_secret: bool


class UpdateMemorySourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class UpdateMemorySourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class UpdateMemorySourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class UpdateMemorySourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: UpdateMemorySourceOutputSignIn | None
    created_at: str
    created_by: UpdateMemorySourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: UpdateMemorySourceOutputLastError | None
    webhook_secret: str | None


class _UpdateSavedQuestionInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    saved_question_id: str


class UpdateSavedQuestionInput(_UpdateSavedQuestionInputRequired, total=False):
    chunk_id: str
    file_id: str
    version: int | str
    first_position: int | str
    last_position: int | str
    confirm: bool


class UpdateSavedQuestionOutputPassageCitationDocumentAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class UpdateSavedQuestionOutputPassageCitationDocumentPageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class UpdateSavedQuestionOutputPassageCitationDocument(TypedDict):
    kind: Literal["document"]
    pages: list[float]
    areas: list[UpdateSavedQuestionOutputPassageCitationDocumentAreasItem]
    page_sizes: list[UpdateSavedQuestionOutputPassageCitationDocumentPageSizesItem]


class UpdateSavedQuestionOutputPassageCitationSpreadsheet(TypedDict):
    kind: Literal["spreadsheet"]
    sheet: str | None
    first_row: float
    last_row: float


class UpdateSavedQuestionOutputPassageCitationSlides(TypedDict):
    kind: Literal["slides"]
    slides: list[float]


class UpdateSavedQuestionOutputPassageCitationWebPage(TypedDict):
    kind: Literal["web_page"]
    address: str | None
    heading: str | None


class UpdateSavedQuestionOutputPassageCitationImageAreasItem(TypedDict):
    page: float
    left: float
    top: float
    right: float
    bottom: float


class UpdateSavedQuestionOutputPassageCitationImagePageSizesItem(TypedDict):
    page: float
    width: float
    height: float


class UpdateSavedQuestionOutputPassageCitationImage(TypedDict):
    kind: Literal["image"]
    file_name: str
    areas: list[UpdateSavedQuestionOutputPassageCitationImageAreasItem]
    page_sizes: list[UpdateSavedQuestionOutputPassageCitationImagePageSizesItem]


class UpdateSavedQuestionOutputPassageCitationRecording(TypedDict):
    kind: Literal["recording"]
    start_second: float
    end_second: float
    frame: float | None


class UpdateSavedQuestionOutputPassage(TypedDict):
    file_id: str
    file_path: str | None
    file_kind: (
        Literal["pdf", "word", "slides", "spreadsheet", "web_page", "image", "audio", "video"]
        | None
    )
    version: float
    first_position: float
    last_position: float
    heading: str | None
    state: Literal["confirmed", "unconfirmed"]
    citation: (
        UpdateSavedQuestionOutputPassageCitationDocument
        | UpdateSavedQuestionOutputPassageCitationSpreadsheet
        | UpdateSavedQuestionOutputPassageCitationSlides
        | UpdateSavedQuestionOutputPassageCitationWebPage
        | UpdateSavedQuestionOutputPassageCitationImage
        | UpdateSavedQuestionOutputPassageCitationRecording
        | None
    )


class UpdateSavedQuestionOutputBrokenPrevious(TypedDict):
    version: float
    first_position: float
    last_position: float


class UpdateSavedQuestionOutputBroken(TypedDict):
    change: Literal["changed", "moved", "removed"]
    version: float | None
    detected_at: str
    previous: UpdateSavedQuestionOutputBrokenPrevious | None


class UpdateSavedQuestionOutput(TypedDict):
    id: str
    question: str
    split: Literal["tuning", "held_back"]
    source: Literal["question_log", "file", "api", "judge"]
    question_log_id: str | None
    end_user_id: str | None
    passage: UpdateSavedQuestionOutputPassage
    broken: UpdateSavedQuestionOutputBroken | None
    created_at: str
    updated_at: str


class _UpdateSourceInputRequired(TypedDict):
    project_id: str
    knowledge_base_id: str
    source_id: str


class UpdateSourceInput(_UpdateSourceInputRequired, total=False):
    name: str
    settings: Mapping[str, object]
    credentials: Mapping[str, object]
    rotate_webhook_secret: bool


class UpdateSourceOutputSignIn(TypedDict):
    status: Literal["waiting", "signed_in", "expired"]
    account: str | None


class UpdateSourceOutputCreatedBy(TypedDict):
    kind: Literal["account", "key"]
    id: str
    name: str


class UpdateSourceOutputLastError(TypedDict):
    code: str
    message: str
    at: str


class UpdateSourceOutput(TypedDict):
    id: str
    project_id: str
    knowledge_base_id: str | None
    memory_id: str | None
    name: str
    kind: Literal[
        "push",
        "vapi",
        "retell",
        "elevenlabs",
        "zendesk",
        "s3",
        "slack",
        "notion",
        "confluence",
        "zendesk_help_center",
        "google_drive",
        "agent",
        "database",
    ]
    sorting: Literal["full", "rules_only", "as_given"] | None
    status: Literal["active", "failing", "deleting"]
    settings: dict[str, object]
    credential_names: list[str]
    webhook_url: str | None
    sign_in: UpdateSourceOutputSignIn | None
    created_at: str
    created_by: UpdateSourceOutputCreatedBy
    last_synced_at: str | None
    next_sync_at: str | None
    last_error: UpdateSourceOutputLastError | None
    webhook_secret: str | None


class UpdateTableRowInputKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class UpdateTableRowInputKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class UpdateTableRowInputValuesValueInteger(TypedDict):
    type: Literal["integer"]
    text: str


class UpdateTableRowInputValuesValueBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class UpdateTableRowInputExpectedValueInteger(TypedDict):
    type: Literal["integer"]
    text: str


class UpdateTableRowInputExpectedValueBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class UpdateTableRowInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    key: Sequence[
        float | str | UpdateTableRowInputKeyItemInteger | UpdateTableRowInputKeyItemBlob | None
    ]
    values: Mapping[
        str,
        float
        | str
        | UpdateTableRowInputValuesValueInteger
        | UpdateTableRowInputValuesValueBlob
        | None,
    ]
    expected: Mapping[
        str,
        float
        | str
        | UpdateTableRowInputExpectedValueInteger
        | UpdateTableRowInputExpectedValueBlob
        | None,
    ]


class UpdateTableRowOutputRowKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class UpdateTableRowOutputRowKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class UpdateTableRowOutputRowCellsItem(TypedDict):
    type: Literal["integer", "real", "text", "blob"]
    text: str
    size: float
    truncated: bool


class UpdateTableRowOutputRow(TypedDict):
    key: (
        list[
            float
            | str
            | UpdateTableRowOutputRowKeyItemInteger
            | UpdateTableRowOutputRowKeyItemBlob
            | None
        ]
        | None
    )
    cells: list[float | str | UpdateTableRowOutputRowCellsItem | None]


class UpdateTableRowOutputReturnedKeyItemInteger(TypedDict):
    type: Literal["integer"]
    text: str


class UpdateTableRowOutputReturnedKeyItemBlob(TypedDict):
    type: Literal["blob"]
    hex: str


class UpdateTableRowOutput(TypedDict):
    row: UpdateTableRowOutputRow | None
    returned_key: (
        list[
            float
            | str
            | UpdateTableRowOutputReturnedKeyItemInteger
            | UpdateTableRowOutputReturnedKeyItemBlob
            | None
        ]
        | None
    )


class UploadTableImportInput(TypedDict):
    project_id: str
    database_id: str
    table_name: str
    content: FileContent


class UploadTableImportOutputTableImportColumnsItem(TypedDict):
    source_index: float
    header: str
    name: str
    inferred_type: Literal[
        "text", "integer", "real", "numeric", "blob", "boolean", "date", "datetime", "time"
    ]


class UploadTableImportOutputTableImport(TypedDict):
    id: str
    table_name: str
    format: Literal["csv", "xlsx"]
    file_bytes: float
    row_count: float
    expires_at: str
    columns: list[UploadTableImportOutputTableImportColumnsItem]
    preview_rows: list[list[float | str | None]]


class UploadTableImportOutput(TypedDict):
    table_import: UploadTableImportOutputTableImport


class _VerifySecondFactorInputRequired(TypedDict):
    challenge_token: str
    code: str


class VerifySecondFactorInput(_VerifySecondFactorInputRequired, total=False):
    method: Literal["totp", "backup_code"]


class VerifySecondFactorOutputSessionAccount(TypedDict):
    id: str
    email: str
    name: str
    status: Literal["pending", "approved", "rejected"]
    created_at: str
    decided_at: str | None
    is_operator: bool


class VerifySecondFactorOutputSession(TypedDict):
    account: VerifySecondFactorOutputSessionAccount
    second_factor_enabled: bool
    expires_at: str


class VerifySecondFactorOutput(TypedDict):
    session_token: str
    session: VerifySecondFactorOutputSession
