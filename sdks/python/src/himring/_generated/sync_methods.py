from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Mapping, Sequence
from typing import Literal, cast

from himring._download import Download
from himring._file_content import FileContent
from himring._generated.types import (
    AcceptInvitationOutput,
    AddDatabaseMigrationOutput,
    AddMessagesInputItemsItemConversation,
    AddMessagesInputItemsItemDeletion,
    AddMessagesInputItemsItemMessage,
    AddMessagesInputItemsItemRecord,
    AddMessagesOutput,
    AnswerQuestionOutput,
    ApplyTableImportInputColumnsItem,
    ApplyTableImportInputNewTableColumnsItem,
    ApplyTableImportOutput,
    BeginSecondFactorSetupOutput,
    CancelUploadOutput,
    ChangeTableColumnsInputChangesItemAdd,
    ChangeTableColumnsInputChangesItemAlter,
    ChangeTableColumnsInputChangesItemDrop,
    ChangeTableColumnsInputChangesItemRename,
    ChangeTableColumnsOutput,
    CheckTableImportInputColumnsItem,
    CheckTableImportInputNewTableColumnsItem,
    CheckTableImportOutput,
    CompactDatabaseOutput,
    CompareIndexSearchInputBm25,
    CompareIndexSearchOutput,
    CompleteUploadOutput,
    ConfirmSecondFactorSetupOutput,
    CreateApiKeyInputPermissionsFull,
    CreateApiKeyInputPermissionsRestricted,
    CreateApiKeyOutput,
    CreateCorrectionInputSettingAgentDepth,
    CreateCorrectionInputSettingBm25,
    CreateCorrectionInputSettingChunking,
    CreateCorrectionInputSettingFieldBoost,
    CreateCorrectionInputSettingLanguage,
    CreateCorrectionInputSettingOption1,
    CreateCorrectionInputSettingOption2,
    CreateCorrectionInputSettingRebuild,
    CreateCorrectionInputSettingStopWords,
    CreateCorrectionInputSettingSynonyms,
    CreateCorrectionOutput,
    CreateDatabaseInputMigrationsItem,
    CreateDatabaseOutput,
    CreateIndexInputConfig,
    CreateIndexOutput,
    CreateKnowledgeBaseOutput,
    CreateMemorySourceOutput,
    CreateProjectOutput,
    CreateSourceOutput,
    CreateTableInputColumnsItem,
    CreateTableOutput,
    CreateUploadOutput,
    DeleteDatabaseOutput,
    DeleteFileOutput,
    DeleteIndexOutput,
    DeleteIndexRecordOutput,
    DeleteKnowledgeBaseOutput,
    DeleteMemoryOutput,
    DeleteMemorySavedQuestionOutput,
    DeleteMemorySourceOutput,
    DeleteProjectOutput,
    DeleteSavedQueryOutput,
    DeleteSavedQuestionOutput,
    DeleteSourceOutput,
    DeleteTableRowsInputKeysItemItemBlob,
    DeleteTableRowsInputKeysItemItemInteger,
    DeleteTableRowsOutput,
    DiscardCorrectionOutput,
    DiscardTableImportOutput,
    DismissFlaggedQuestionOutput,
    EnableMemoryInputAgentPermissions,
    EnableMemoryInputCueWeights,
    EnableMemoryInputSubjectsItem,
    EnableMemoryOutput,
    EraseEndUserOutput,
    ExportTableRowsInputFiltersItem,
    ExportTableRowsInputSortsItem,
    FinishSourceSignInOutput,
    ForgetMemoryOutput,
    GetCorrectionOutput,
    GetCorrectionPassOutput,
    GetDatabaseOutput,
    GetDownloadLinkOutput,
    GetFileOutput,
    GetFlaggedQuestionOutput,
    GetIndexOutput,
    GetIndexRecordOutput,
    GetIndexStatsOutput,
    GetKnowledgeBaseOutput,
    GetMemoryContextOutput,
    GetMemoryOutput,
    GetMemoryScoresOutput,
    GetMemorySourceOutput,
    GetMemoryWebhookOutput,
    GetMessageOutput,
    GetProjectOutput,
    GetQuestionSetOutput,
    GetSavedQuestionOutput,
    GetScorecardOutput,
    GetSessionOutput,
    GetSourceOutput,
    GetTableRowInputKeyItemBlob,
    GetTableRowInputKeyItemInteger,
    GetTableRowOutput,
    GetUploadOutput,
    ImportAnswerLogOutput,
    ImportIndexRecordsOutput,
    ImportSavedQuestionsOutput,
    IngestItemsInputItemsItemConversation,
    IngestItemsInputItemsItemDeletion,
    IngestItemsInputItemsItemMessage,
    IngestItemsInputItemsItemRecord,
    IngestItemsOutput,
    InsertTableRowInputValuesValueBlob,
    InsertTableRowInputValuesValueInteger,
    InsertTableRowOutput,
    InspectMemoryOutput,
    InviteMemberOutput,
    ListApiKeyPermissionChangesOutput,
    ListApiKeysOutput,
    ListCorrectionPassesOutput,
    ListCorrectionsOutput,
    ListDatabaseMigrationsOutput,
    ListDatabasesOutput,
    ListDatabaseTablesOutput,
    ListFilesOutput,
    ListFileVersionsOutput,
    ListFlaggedQuestionsOutput,
    ListFolderOutput,
    ListForgettingSuggestionsOutput,
    ListIndexesOutput,
    ListIndexRecordsOutput,
    ListInvitationsOutput,
    ListKnowledgeBasesOutput,
    ListLearnedChangesOutput,
    ListMembersOutput,
    ListMemoriesOutput,
    ListMemoryDecisionsOutput,
    ListMemoryOwnersOutput,
    ListMemoryReviewsOutput,
    ListMemorySavedQuestionsOutput,
    ListMemorySourcesOutput,
    ListMemoryWebhookDeliveriesOutput,
    ListMessagesOutput,
    ListMetadataKeysOutput,
    ListMetadataValuesOutput,
    ListOperationsOutput,
    ListProjectsOutput,
    ListQuestionsOutput,
    ListSavedQueriesOutput,
    ListSavedQuestionsOutput,
    ListScorecardResultsOutput,
    ListScorecardsOutput,
    ListSourceItemsOutput,
    ListSourcesOutput,
    ListSourceSyncsOutput,
    ListTableRowsInputAfterItemBlob,
    ListTableRowsInputAfterItemInteger,
    ListTableRowsInputBeforeItemBlob,
    ListTableRowsInputBeforeItemInteger,
    ListTableRowsInputFiltersItem,
    ListTableRowsInputSortsItem,
    ListTableRowsOutput,
    ListVersionBlocksOutput,
    PreviewCreateTableInputColumnsItem,
    PreviewCreateTableOutput,
    PreviewIndexSearchInputFacetRangesValueItem,
    PreviewIndexSearchInputPinnedItem,
    PreviewIndexSearchOutput,
    PreviewTableColumnChangesInputChangesItemAdd,
    PreviewTableColumnChangesInputChangesItemAlter,
    PreviewTableColumnChangesInputChangesItemDrop,
    PreviewTableColumnChangesInputChangesItemRename,
    PreviewTableColumnChangesOutput,
    PromoteCorrectionOutput,
    PromoteMemoryOutput,
    ProposeCorrectionsOutput,
    ProposeDatabaseChangeOutput,
    RecallMemoriesOutput,
    RecordAnswerEventsInputEventsItem,
    RecordAnswerEventsOutput,
    RecoverMemoryOutput,
    RemoveMemberOutput,
    RemoveMemoryWebhookOutput,
    RestoreDatabaseOutput,
    RestoreFileOutput,
    RestoreIndexOutput,
    RestoreIndexSnapshotOutput,
    RestoreKnowledgeBaseOutput,
    RestoreMemoryOutput,
    RestoreProjectOutput,
    ReviewFlaggedQuestionsOutput,
    RevokeApiKeyOutput,
    RevokeInvitationOutput,
    RunDatabaseSqlOutput,
    SaveIndexRecordOutput,
    SaveMemoryQuestionOutput,
    SaveQueryOutput,
    SaveQuestionOutput,
    ScoreQuestionSetOutput,
    SearchFoldersOutput,
    SearchKnowledgeBaseOutput,
    SendMemoryFeedbackOutput,
    SetMemoryWebhookOutput,
    SettleFlaggedQuestionOutput,
    SettleMemoryOutput,
    SettleMemoryReviewOutput,
    SignInOutput,
    SignOutOutput,
    SignUploadPartsInputPartsItem,
    SignUploadPartsOutput,
    SignUpOutput,
    SortMessageOutput,
    StartMemorySourceSignInOutput,
    StartSourceSignInOutput,
    SuggestIndexTermsOutput,
    SyncMemorySourceOutput,
    SyncSourceOutput,
    TryCorrectionsOutput,
    TuneMemoryOutput,
    UndoLearnedChangeOutput,
    UpdateApiKeyInputPermissionsFull,
    UpdateApiKeyInputPermissionsRestricted,
    UpdateApiKeyOutput,
    UpdateDatabaseOutput,
    UpdateIndexInputBm25,
    UpdateIndexInputSearchDefaults,
    UpdateIndexInputSynonymsItemOption1,
    UpdateIndexInputSynonymsItemOption2,
    UpdateIndexOutput,
    UpdateKnowledgeBaseOutput,
    UpdateMemoryInputAgentPermissions,
    UpdateMemoryInputCueWeights,
    UpdateMemoryInputSubjectsItem,
    UpdateMemoryOutput,
    UpdateMemorySourceOutput,
    UpdateSavedQuestionOutput,
    UpdateSourceOutput,
    UpdateTableRowInputExpectedValueBlob,
    UpdateTableRowInputExpectedValueInteger,
    UpdateTableRowInputKeyItemBlob,
    UpdateTableRowInputKeyItemInteger,
    UpdateTableRowInputValuesValueBlob,
    UpdateTableRowInputValuesValueInteger,
    UpdateTableRowOutput,
    UploadTableImportOutput,
    VerifySecondFactorOutput,
)
from himring._omitted import OMITTED, Omitted


class SyncOperationMethods(ABC):
    @abstractmethod
    def _call_operation(
        self,
        operation_id: str,
        fields: Mapping[str, object],
        timeout_seconds: float | None,
    ) -> object: ...

    def accept_invitation(
        self,
        *,
        token: str,
        timeout_seconds: float | None = None,
    ) -> AcceptInvitationOutput:
        return cast(
            "AcceptInvitationOutput",
            self._call_operation("accept_invitation", {"token": token}, timeout_seconds),
        )

    def add_database_migration(
        self,
        *,
        project_id: str,
        database_id: str,
        name: str,
        sql: str,
        expected_migration_version: int | str | None = None,
        timeout_seconds: float | None = None,
    ) -> AddDatabaseMigrationOutput:
        return cast(
            "AddDatabaseMigrationOutput",
            self._call_operation(
                "add_database_migration",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "name": name,
                    "sql": sql,
                    "expected_migration_version": expected_migration_version,
                },
                timeout_seconds,
            ),
        )

    def add_messages(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        items: Sequence[
            AddMessagesInputItemsItemConversation
            | AddMessagesInputItemsItemMessage
            | AddMessagesInputItemsItemRecord
            | AddMessagesInputItemsItemDeletion
        ],
        timeout_seconds: float | None = None,
    ) -> AddMessagesOutput:
        return cast(
            "AddMessagesOutput",
            self._call_operation(
                "add_messages",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "source_id": source_id,
                    "items": items,
                },
                timeout_seconds,
            ),
        )

    def answer_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question: str,
        limit: int | str | None = None,
        folder: str | None = None,
        metadata: Mapping[str, str | Sequence[str]] | None = None,
        end_user_id: str | None = None,
        call_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> AnswerQuestionOutput:
        return cast(
            "AnswerQuestionOutput",
            self._call_operation(
                "answer_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question": question,
                    "limit": limit,
                    "folder": folder,
                    "metadata": metadata,
                    "end_user_id": end_user_id,
                    "call_id": call_id,
                },
                timeout_seconds,
            ),
        )

    def apply_table_import(
        self,
        *,
        project_id: str,
        database_id: str,
        import_id: str,
        table_name: str,
        columns: Sequence[ApplyTableImportInputColumnsItem],
        expected_failed: int | str,
        expected_migration_version: int | str,
        new_table_columns: Sequence[ApplyTableImportInputNewTableColumnsItem]
        | Omitted
        | None = OMITTED,
        timeout_seconds: float | None = None,
    ) -> ApplyTableImportOutput:
        return cast(
            "ApplyTableImportOutput",
            self._call_operation(
                "apply_table_import",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "import_id": import_id,
                    "table_name": table_name,
                    "columns": columns,
                    "expected_failed": expected_failed,
                    "expected_migration_version": expected_migration_version,
                    "new_table_columns": new_table_columns,
                },
                timeout_seconds,
            ),
        )

    def begin_second_factor_setup(
        self,
        *,
        password: str,
        timeout_seconds: float | None = None,
    ) -> BeginSecondFactorSetupOutput:
        return cast(
            "BeginSecondFactorSetupOutput",
            self._call_operation(
                "begin_second_factor_setup", {"password": password}, timeout_seconds
            ),
        )

    def cancel_upload(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        upload_id: str,
        timeout_seconds: float | None = None,
    ) -> CancelUploadOutput:
        return cast(
            "CancelUploadOutput",
            self._call_operation(
                "cancel_upload",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "upload_id": upload_id,
                },
                timeout_seconds,
            ),
        )

    def change_table_columns(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        changes: Sequence[
            ChangeTableColumnsInputChangesItemAdd
            | ChangeTableColumnsInputChangesItemRename
            | ChangeTableColumnsInputChangesItemAlter
            | ChangeTableColumnsInputChangesItemDrop
        ],
        expected_migration_version: int | str,
        timeout_seconds: float | None = None,
    ) -> ChangeTableColumnsOutput:
        return cast(
            "ChangeTableColumnsOutput",
            self._call_operation(
                "change_table_columns",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "changes": changes,
                    "expected_migration_version": expected_migration_version,
                },
                timeout_seconds,
            ),
        )

    def check_table_import(
        self,
        *,
        project_id: str,
        database_id: str,
        import_id: str,
        table_name: str,
        columns: Sequence[CheckTableImportInputColumnsItem],
        new_table_columns: Sequence[CheckTableImportInputNewTableColumnsItem]
        | Omitted
        | None = OMITTED,
        timeout_seconds: float | None = None,
    ) -> CheckTableImportOutput:
        return cast(
            "CheckTableImportOutput",
            self._call_operation(
                "check_table_import",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "import_id": import_id,
                    "table_name": table_name,
                    "columns": columns,
                    "new_table_columns": new_table_columns,
                },
                timeout_seconds,
            ),
        )

    def compact_database(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> CompactDatabaseOutput:
        return cast(
            "CompactDatabaseOutput",
            self._call_operation(
                "compact_database",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def compare_index_search(
        self,
        *,
        project_id: str,
        index_id: str,
        query: str,
        filters: str | None = None,
        mode: Literal["keyword", "vector", "hybrid"] | None = None,
        vector_field: str | None = None,
        fields: str | Sequence[str] | None = None,
        boosts: str | Mapping[str, object] | None = None,
        term_match: int | str | None = None,
        tolerance: int | str | None = None,
        prefix_length: int | str | None = None,
        exact: bool | None = None,
        prefix: bool | None = None,
        partial_words: bool | None = None,
        minimum_score: float | str | None = None,
        fusion: Literal["rrf", "linear"] | None = None,
        fusion_constant: int | str | None = None,
        vector_weight: float | str | None = None,
        minimum_similarity: float | str | None = None,
        vector_candidates: int | str | None = None,
        bm25: CompareIndexSearchInputBm25 | None = None,
        limit: int | str | None = None,
        timeout_seconds: float | None = None,
    ) -> CompareIndexSearchOutput:
        return cast(
            "CompareIndexSearchOutput",
            self._call_operation(
                "compare_index_search",
                {
                    "project_id": project_id,
                    "index_id": index_id,
                    "query": query,
                    "filters": filters,
                    "mode": mode,
                    "vector_field": vector_field,
                    "fields": fields,
                    "boosts": boosts,
                    "term_match": term_match,
                    "tolerance": tolerance,
                    "prefix_length": prefix_length,
                    "exact": exact,
                    "prefix": prefix,
                    "partial_words": partial_words,
                    "minimum_score": minimum_score,
                    "fusion": fusion,
                    "fusion_constant": fusion_constant,
                    "vector_weight": vector_weight,
                    "minimum_similarity": minimum_similarity,
                    "vector_candidates": vector_candidates,
                    "bm25": bm25,
                    "limit": limit,
                },
                timeout_seconds,
            ),
        )

    def complete_upload(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        upload_id: str,
        timeout_seconds: float | None = None,
    ) -> CompleteUploadOutput:
        return cast(
            "CompleteUploadOutput",
            self._call_operation(
                "complete_upload",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "upload_id": upload_id,
                },
                timeout_seconds,
            ),
        )

    def confirm_second_factor_setup(
        self,
        *,
        code: str,
        timeout_seconds: float | None = None,
    ) -> ConfirmSecondFactorSetupOutput:
        return cast(
            "ConfirmSecondFactorSetupOutput",
            self._call_operation("confirm_second_factor_setup", {"code": code}, timeout_seconds),
        )

    def create_api_key(
        self,
        *,
        project_id: str,
        name: str,
        permissions: CreateApiKeyInputPermissionsFull | CreateApiKeyInputPermissionsRestricted,
        expires_at: str | Omitted | None = OMITTED,
        timeout_seconds: float | None = None,
    ) -> CreateApiKeyOutput:
        return cast(
            "CreateApiKeyOutput",
            self._call_operation(
                "create_api_key",
                {
                    "project_id": project_id,
                    "name": name,
                    "permissions": permissions,
                    "expires_at": expires_at,
                },
                timeout_seconds,
            ),
        )

    def create_correction(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        setting: CreateCorrectionInputSettingFieldBoost
        | CreateCorrectionInputSettingOption1
        | CreateCorrectionInputSettingOption2
        | CreateCorrectionInputSettingBm25
        | CreateCorrectionInputSettingStopWords
        | CreateCorrectionInputSettingSynonyms
        | CreateCorrectionInputSettingLanguage
        | CreateCorrectionInputSettingChunking
        | CreateCorrectionInputSettingRebuild
        | CreateCorrectionInputSettingAgentDepth,
        target_ids: Sequence[str] | None = None,
        timeout_seconds: float | None = None,
    ) -> CreateCorrectionOutput:
        return cast(
            "CreateCorrectionOutput",
            self._call_operation(
                "create_correction",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "setting": setting,
                    "target_ids": target_ids,
                },
                timeout_seconds,
            ),
        )

    def create_database(
        self,
        *,
        project_id: str,
        name: str,
        migrations: Sequence[CreateDatabaseInputMigrationsItem] | None = None,
        sql_write_preview: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> CreateDatabaseOutput:
        return cast(
            "CreateDatabaseOutput",
            self._call_operation(
                "create_database",
                {
                    "project_id": project_id,
                    "name": name,
                    "migrations": migrations,
                    "sql_write_preview": sql_write_preview,
                },
                timeout_seconds,
            ),
        )

    def create_index(
        self,
        *,
        project_id: str,
        name: str,
        config: CreateIndexInputConfig,
        timeout_seconds: float | None = None,
    ) -> CreateIndexOutput:
        return cast(
            "CreateIndexOutput",
            self._call_operation(
                "create_index",
                {"project_id": project_id, "name": name, "config": config},
                timeout_seconds,
            ),
        )

    def create_knowledge_base(
        self,
        *,
        project_id: str,
        name: str,
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
        | None = None,
        chunk_tokens: int | str | None = None,
        question_log_retention_days: int | str | Omitted | None = OMITTED,
        timeout_seconds: float | None = None,
    ) -> CreateKnowledgeBaseOutput:
        return cast(
            "CreateKnowledgeBaseOutput",
            self._call_operation(
                "create_knowledge_base",
                {
                    "project_id": project_id,
                    "name": name,
                    "language": language,
                    "chunk_tokens": chunk_tokens,
                    "question_log_retention_days": question_log_retention_days,
                },
                timeout_seconds,
            ),
        )

    def create_memory_source(
        self,
        *,
        project_id: str,
        memory_id: str,
        name: str,
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
        ],
        sorting: Literal["full", "rules_only", "as_given"] | None = None,
        settings: Mapping[str, object] | None = None,
        credentials: Mapping[str, object] | None = None,
        timeout_seconds: float | None = None,
    ) -> CreateMemorySourceOutput:
        return cast(
            "CreateMemorySourceOutput",
            self._call_operation(
                "create_memory_source",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "name": name,
                    "kind": kind,
                    "sorting": sorting,
                    "settings": settings,
                    "credentials": credentials,
                },
                timeout_seconds,
            ),
        )

    def create_project(
        self,
        *,
        name: str,
        timeout_seconds: float | None = None,
    ) -> CreateProjectOutput:
        return cast(
            "CreateProjectOutput",
            self._call_operation("create_project", {"name": name}, timeout_seconds),
        )

    def create_source(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        name: str,
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
        ],
        settings: Mapping[str, object] | None = None,
        credentials: Mapping[str, object] | None = None,
        timeout_seconds: float | None = None,
    ) -> CreateSourceOutput:
        return cast(
            "CreateSourceOutput",
            self._call_operation(
                "create_source",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "name": name,
                    "kind": kind,
                    "settings": settings,
                    "credentials": credentials,
                },
                timeout_seconds,
            ),
        )

    def create_table(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        columns: Sequence[CreateTableInputColumnsItem],
        expected_migration_version: int | str,
        timeout_seconds: float | None = None,
    ) -> CreateTableOutput:
        return cast(
            "CreateTableOutput",
            self._call_operation(
                "create_table",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "columns": columns,
                    "expected_migration_version": expected_migration_version,
                },
                timeout_seconds,
            ),
        )

    def create_upload(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        path: str,
        size_bytes: int,
        content_sha256: str,
        address: str | None = None,
        metadata: Mapping[str, str] | str | None = None,
        timeout_seconds: float | None = None,
    ) -> CreateUploadOutput:
        return cast(
            "CreateUploadOutput",
            self._call_operation(
                "create_upload",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "path": path,
                    "size_bytes": size_bytes,
                    "content_sha256": content_sha256,
                    "address": address,
                    "metadata": metadata,
                },
                timeout_seconds,
            ),
        )

    def delete_database(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteDatabaseOutput:
        return cast(
            "DeleteDatabaseOutput",
            self._call_operation(
                "delete_database",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def delete_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteFileOutput:
        return cast(
            "DeleteFileOutput",
            self._call_operation(
                "delete_file",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "file_id": file_id,
                },
                timeout_seconds,
            ),
        )

    def delete_index(
        self,
        *,
        project_id: str,
        index_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteIndexOutput:
        return cast(
            "DeleteIndexOutput",
            self._call_operation(
                "delete_index", {"project_id": project_id, "index_id": index_id}, timeout_seconds
            ),
        )

    def delete_index_record(
        self,
        *,
        project_id: str,
        index_id: str,
        record_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteIndexRecordOutput:
        return cast(
            "DeleteIndexRecordOutput",
            self._call_operation(
                "delete_index_record",
                {"project_id": project_id, "index_id": index_id, "record_id": record_id},
                timeout_seconds,
            ),
        )

    def delete_knowledge_base(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteKnowledgeBaseOutput:
        return cast(
            "DeleteKnowledgeBaseOutput",
            self._call_operation(
                "delete_knowledge_base",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def delete_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteMemoryOutput:
        return cast(
            "DeleteMemoryOutput",
            self._call_operation(
                "delete_memory", {"project_id": project_id, "memory_id": memory_id}, timeout_seconds
            ),
        )

    def delete_memory_saved_question(
        self,
        *,
        project_id: str,
        memory_id: str,
        saved_question_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteMemorySavedQuestionOutput:
        return cast(
            "DeleteMemorySavedQuestionOutput",
            self._call_operation(
                "delete_memory_saved_question",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "saved_question_id": saved_question_id,
                },
                timeout_seconds,
            ),
        )

    def delete_memory_source(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteMemorySourceOutput:
        return cast(
            "DeleteMemorySourceOutput",
            self._call_operation(
                "delete_memory_source",
                {"project_id": project_id, "memory_id": memory_id, "source_id": source_id},
                timeout_seconds,
            ),
        )

    def delete_project(
        self,
        *,
        project_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteProjectOutput:
        return cast(
            "DeleteProjectOutput",
            self._call_operation("delete_project", {"project_id": project_id}, timeout_seconds),
        )

    def delete_saved_query(
        self,
        *,
        project_id: str,
        database_id: str,
        saved_query_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteSavedQueryOutput:
        return cast(
            "DeleteSavedQueryOutput",
            self._call_operation(
                "delete_saved_query",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "saved_query_id": saved_query_id,
                },
                timeout_seconds,
            ),
        )

    def delete_saved_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        saved_question_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteSavedQuestionOutput:
        return cast(
            "DeleteSavedQuestionOutput",
            self._call_operation(
                "delete_saved_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "saved_question_id": saved_question_id,
                },
                timeout_seconds,
            ),
        )

    def delete_source(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> DeleteSourceOutput:
        return cast(
            "DeleteSourceOutput",
            self._call_operation(
                "delete_source",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                },
                timeout_seconds,
            ),
        )

    def delete_table_rows(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        keys: Sequence[
            Sequence[
                float
                | str
                | DeleteTableRowsInputKeysItemItemInteger
                | DeleteTableRowsInputKeysItemItemBlob
                | None
            ]
        ],
        timeout_seconds: float | None = None,
    ) -> DeleteTableRowsOutput:
        return cast(
            "DeleteTableRowsOutput",
            self._call_operation(
                "delete_table_rows",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "keys": keys,
                },
                timeout_seconds,
            ),
        )

    def discard_correction(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        correction_id: str,
        note: str | None = None,
        timeout_seconds: float | None = None,
    ) -> DiscardCorrectionOutput:
        return cast(
            "DiscardCorrectionOutput",
            self._call_operation(
                "discard_correction",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "correction_id": correction_id,
                    "note": note,
                },
                timeout_seconds,
            ),
        )

    def discard_table_import(
        self,
        *,
        project_id: str,
        database_id: str,
        import_id: str,
        timeout_seconds: float | None = None,
    ) -> DiscardTableImportOutput:
        return cast(
            "DiscardTableImportOutput",
            self._call_operation(
                "discard_table_import",
                {"project_id": project_id, "database_id": database_id, "import_id": import_id},
                timeout_seconds,
            ),
        )

    def dismiss_flagged_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question_id: str,
        timeout_seconds: float | None = None,
    ) -> DismissFlaggedQuestionOutput:
        return cast(
            "DismissFlaggedQuestionOutput",
            self._call_operation(
                "dismiss_flagged_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question_id": question_id,
                },
                timeout_seconds,
            ),
        )

    def download_index(
        self,
        *,
        project_id: str,
        index_id: str,
        timeout_seconds: float | None = None,
    ) -> Download:
        return cast(
            "Download",
            self._call_operation(
                "download_index", {"project_id": project_id, "index_id": index_id}, timeout_seconds
            ),
        )

    def enable_memory(
        self,
        *,
        project_id: str,
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
        | None = None,
        knowledge_base_choice: Literal["every", "listed"] | None = None,
        checked_knowledge_base_ids: Sequence[str] | None = None,
        duplicate_threshold: float | str | None = None,
        confidence_threshold: float | str | None = None,
        agreeing_authors_for_confirmed: int | str | None = None,
        first_pack_tokens: int | str | None = None,
        recall_fade_days: float | str | None = None,
        subjects: Sequence[EnableMemoryInputSubjectsItem] | None = None,
        sources_for_likely: int | str | None = None,
        agent_permissions: EnableMemoryInputAgentPermissions | None = None,
        dropped_list_days: int | str | Omitted | None = OMITTED,
        replaced_retention_days: int | str | Omitted | None = OMITTED,
        message_retention_days: int | str | Omitted | None = OMITTED,
        personal_retention_days: int | str | Omitted | None = OMITTED,
        recall_log_retention_days: int | str | Omitted | None = OMITTED,
        ready_set_size: int | str | None = None,
        recall_depth: int | str | None = None,
        cue_weights: EnableMemoryInputCueWeights | None = None,
        timeout_seconds: float | None = None,
    ) -> EnableMemoryOutput:
        return cast(
            "EnableMemoryOutput",
            self._call_operation(
                "enable_memory",
                {
                    "project_id": project_id,
                    "language": language,
                    "knowledge_base_choice": knowledge_base_choice,
                    "checked_knowledge_base_ids": checked_knowledge_base_ids,
                    "duplicate_threshold": duplicate_threshold,
                    "confidence_threshold": confidence_threshold,
                    "agreeing_authors_for_confirmed": agreeing_authors_for_confirmed,
                    "first_pack_tokens": first_pack_tokens,
                    "recall_fade_days": recall_fade_days,
                    "subjects": subjects,
                    "sources_for_likely": sources_for_likely,
                    "agent_permissions": agent_permissions,
                    "dropped_list_days": dropped_list_days,
                    "replaced_retention_days": replaced_retention_days,
                    "message_retention_days": message_retention_days,
                    "personal_retention_days": personal_retention_days,
                    "recall_log_retention_days": recall_log_retention_days,
                    "ready_set_size": ready_set_size,
                    "recall_depth": recall_depth,
                    "cue_weights": cue_weights,
                },
                timeout_seconds,
            ),
        )

    def erase_end_user(
        self,
        *,
        project_id: str,
        end_user_id: str,
        timeout_seconds: float | None = None,
    ) -> EraseEndUserOutput:
        return cast(
            "EraseEndUserOutput",
            self._call_operation(
                "erase_end_user",
                {"project_id": project_id, "end_user_id": end_user_id},
                timeout_seconds,
            ),
        )

    def export_index_records(
        self,
        *,
        project_id: str,
        index_id: str,
        timeout_seconds: float | None = None,
    ) -> Download:
        return cast(
            "Download",
            self._call_operation(
                "export_index_records",
                {"project_id": project_id, "index_id": index_id},
                timeout_seconds,
            ),
        )

    def export_memories(
        self,
        *,
        project_id: str,
        memory_id: str,
        end_user_id: str | None = None,
        after: str | None = None,
        timeout_seconds: float | None = None,
    ) -> Download:
        return cast(
            "Download",
            self._call_operation(
                "export_memories",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "end_user_id": end_user_id,
                    "after": after,
                },
                timeout_seconds,
            ),
        )

    def export_table_rows(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        format: Literal["csv", "json", "sql"],
        filters: Sequence[ExportTableRowsInputFiltersItem] | None = None,
        sorts: Sequence[ExportTableRowsInputSortsItem] | None = None,
        timeout_seconds: float | None = None,
    ) -> Download:
        return cast(
            "Download",
            self._call_operation(
                "export_table_rows",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "format": format,
                    "filters": filters,
                    "sorts": sorts,
                },
                timeout_seconds,
            ),
        )

    def finish_source_sign_in(
        self,
        *,
        state: str,
        code: str,
        timeout_seconds: float | None = None,
    ) -> FinishSourceSignInOutput:
        return cast(
            "FinishSourceSignInOutput",
            self._call_operation(
                "finish_source_sign_in", {"state": state, "code": code}, timeout_seconds
            ),
        )

    def forget_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        stored_memory_id: str,
        timeout_seconds: float | None = None,
    ) -> ForgetMemoryOutput:
        return cast(
            "ForgetMemoryOutput",
            self._call_operation(
                "forget_memory",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "stored_memory_id": stored_memory_id,
                },
                timeout_seconds,
            ),
        )

    def get_correction(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        correction_id: str,
        timeout_seconds: float | None = None,
    ) -> GetCorrectionOutput:
        return cast(
            "GetCorrectionOutput",
            self._call_operation(
                "get_correction",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "correction_id": correction_id,
                },
                timeout_seconds,
            ),
        )

    def get_correction_pass(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        pass_id: str,
        timeout_seconds: float | None = None,
    ) -> GetCorrectionPassOutput:
        return cast(
            "GetCorrectionPassOutput",
            self._call_operation(
                "get_correction_pass",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "pass_id": pass_id,
                },
                timeout_seconds,
            ),
        )

    def get_database(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> GetDatabaseOutput:
        return cast(
            "GetDatabaseOutput",
            self._call_operation(
                "get_database",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def get_download_link(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        version: str,
        rendition: Literal["pdf"] | None = None,
        disposition: Literal["inline", "attachment"] | None = None,
        timeout_seconds: float | None = None,
    ) -> GetDownloadLinkOutput:
        return cast(
            "GetDownloadLinkOutput",
            self._call_operation(
                "get_download_link",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "file_id": file_id,
                    "version": version,
                    "rendition": rendition,
                    "disposition": disposition,
                },
                timeout_seconds,
            ),
        )

    def get_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        timeout_seconds: float | None = None,
    ) -> GetFileOutput:
        return cast(
            "GetFileOutput",
            self._call_operation(
                "get_file",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "file_id": file_id,
                },
                timeout_seconds,
            ),
        )

    def get_flagged_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question_id: str,
        timeout_seconds: float | None = None,
    ) -> GetFlaggedQuestionOutput:
        return cast(
            "GetFlaggedQuestionOutput",
            self._call_operation(
                "get_flagged_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question_id": question_id,
                },
                timeout_seconds,
            ),
        )

    def get_index(
        self,
        *,
        project_id: str,
        index_id: str,
        timeout_seconds: float | None = None,
    ) -> GetIndexOutput:
        return cast(
            "GetIndexOutput",
            self._call_operation(
                "get_index", {"project_id": project_id, "index_id": index_id}, timeout_seconds
            ),
        )

    def get_index_record(
        self,
        *,
        project_id: str,
        index_id: str,
        record_id: str,
        timeout_seconds: float | None = None,
    ) -> GetIndexRecordOutput:
        return cast(
            "GetIndexRecordOutput",
            self._call_operation(
                "get_index_record",
                {"project_id": project_id, "index_id": index_id, "record_id": record_id},
                timeout_seconds,
            ),
        )

    def get_index_stats(
        self,
        *,
        project_id: str,
        index_id: str,
        timeout_seconds: float | None = None,
    ) -> GetIndexStatsOutput:
        return cast(
            "GetIndexStatsOutput",
            self._call_operation(
                "get_index_stats", {"project_id": project_id, "index_id": index_id}, timeout_seconds
            ),
        )

    def get_knowledge_base(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> GetKnowledgeBaseOutput:
        return cast(
            "GetKnowledgeBaseOutput",
            self._call_operation(
                "get_knowledge_base",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def get_memory(
        self,
        *,
        project_id: str,
        state: Literal["live", "deleted"] | None = None,
        timeout_seconds: float | None = None,
    ) -> GetMemoryOutput:
        return cast(
            "GetMemoryOutput",
            self._call_operation(
                "get_memory", {"project_id": project_id, "state": state}, timeout_seconds
            ),
        )

    def get_memory_context(
        self,
        *,
        project_id: str,
        memory_id: str,
        end_user_id: str | None = None,
        team_id: str | None = None,
        agent_id: str | None = None,
        as_of: str | None = None,
        timeout_seconds: float | None = None,
    ) -> GetMemoryContextOutput:
        return cast(
            "GetMemoryContextOutput",
            self._call_operation(
                "get_memory_context",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "end_user_id": end_user_id,
                    "team_id": team_id,
                    "agent_id": agent_id,
                    "as_of": as_of,
                },
                timeout_seconds,
            ),
        )

    def get_memory_scores(
        self,
        *,
        project_id: str,
        memory_id: str,
        timeout_seconds: float | None = None,
    ) -> GetMemoryScoresOutput:
        return cast(
            "GetMemoryScoresOutput",
            self._call_operation(
                "get_memory_scores",
                {"project_id": project_id, "memory_id": memory_id},
                timeout_seconds,
            ),
        )

    def get_memory_source(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> GetMemorySourceOutput:
        return cast(
            "GetMemorySourceOutput",
            self._call_operation(
                "get_memory_source",
                {"project_id": project_id, "memory_id": memory_id, "source_id": source_id},
                timeout_seconds,
            ),
        )

    def get_memory_webhook(
        self,
        *,
        project_id: str,
        memory_id: str,
        timeout_seconds: float | None = None,
    ) -> GetMemoryWebhookOutput:
        return cast(
            "GetMemoryWebhookOutput",
            self._call_operation(
                "get_memory_webhook",
                {"project_id": project_id, "memory_id": memory_id},
                timeout_seconds,
            ),
        )

    def get_message(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        external_id: str,
        version: str | None = None,
        timeout_seconds: float | None = None,
    ) -> GetMessageOutput:
        return cast(
            "GetMessageOutput",
            self._call_operation(
                "get_message",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "source_id": source_id,
                    "external_id": external_id,
                    "version": version,
                },
                timeout_seconds,
            ),
        )

    def get_project(
        self,
        *,
        project_id: str,
        timeout_seconds: float | None = None,
    ) -> GetProjectOutput:
        return cast(
            "GetProjectOutput",
            self._call_operation("get_project", {"project_id": project_id}, timeout_seconds),
        )

    def get_question_set(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> GetQuestionSetOutput:
        return cast(
            "GetQuestionSetOutput",
            self._call_operation(
                "get_question_set",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def get_saved_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        saved_question_id: str,
        timeout_seconds: float | None = None,
    ) -> GetSavedQuestionOutput:
        return cast(
            "GetSavedQuestionOutput",
            self._call_operation(
                "get_saved_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "saved_question_id": saved_question_id,
                },
                timeout_seconds,
            ),
        )

    def get_scorecard(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        scorecard_id: str,
        timeout_seconds: float | None = None,
    ) -> GetScorecardOutput:
        return cast(
            "GetScorecardOutput",
            self._call_operation(
                "get_scorecard",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "scorecard_id": scorecard_id,
                },
                timeout_seconds,
            ),
        )

    def get_session(
        self,
        *,
        timeout_seconds: float | None = None,
    ) -> GetSessionOutput:
        return cast("GetSessionOutput", self._call_operation("get_session", {}, timeout_seconds))

    def get_source(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> GetSourceOutput:
        return cast(
            "GetSourceOutput",
            self._call_operation(
                "get_source",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                },
                timeout_seconds,
            ),
        )

    def get_table_row(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        key: Sequence[
            float | str | GetTableRowInputKeyItemInteger | GetTableRowInputKeyItemBlob | None
        ],
        timeout_seconds: float | None = None,
    ) -> GetTableRowOutput:
        return cast(
            "GetTableRowOutput",
            self._call_operation(
                "get_table_row",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "key": key,
                },
                timeout_seconds,
            ),
        )

    def get_upload(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        upload_id: str,
        timeout_seconds: float | None = None,
    ) -> GetUploadOutput:
        return cast(
            "GetUploadOutput",
            self._call_operation(
                "get_upload",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "upload_id": upload_id,
                },
                timeout_seconds,
            ),
        )

    def import_answer_log(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        content: FileContent,
        timeout_seconds: float | None = None,
    ) -> ImportAnswerLogOutput:
        return cast(
            "ImportAnswerLogOutput",
            self._call_operation(
                "import_answer_log",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "content": content,
                },
                timeout_seconds,
            ),
        )

    def import_index_records(
        self,
        *,
        project_id: str,
        index_id: str,
        format: Literal["json", "ndjson", "csv"],
        content: FileContent,
        timeout_seconds: float | None = None,
    ) -> ImportIndexRecordsOutput:
        return cast(
            "ImportIndexRecordsOutput",
            self._call_operation(
                "import_index_records",
                {
                    "project_id": project_id,
                    "index_id": index_id,
                    "format": format,
                    "content": content,
                },
                timeout_seconds,
            ),
        )

    def import_saved_questions(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        content: FileContent,
        format: Literal["jsonl", "csv"] | None = None,
        timeout_seconds: float | None = None,
    ) -> ImportSavedQuestionsOutput:
        return cast(
            "ImportSavedQuestionsOutput",
            self._call_operation(
                "import_saved_questions",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "content": content,
                    "format": format,
                },
                timeout_seconds,
            ),
        )

    def ingest_items(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        items: Sequence[
            IngestItemsInputItemsItemConversation
            | IngestItemsInputItemsItemMessage
            | IngestItemsInputItemsItemRecord
            | IngestItemsInputItemsItemDeletion
        ],
        timeout_seconds: float | None = None,
    ) -> IngestItemsOutput:
        return cast(
            "IngestItemsOutput",
            self._call_operation(
                "ingest_items",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                    "items": items,
                },
                timeout_seconds,
            ),
        )

    def insert_table_row(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        values: Mapping[
            str,
            float
            | str
            | InsertTableRowInputValuesValueInteger
            | InsertTableRowInputValuesValueBlob
            | None,
        ],
        timeout_seconds: float | None = None,
    ) -> InsertTableRowOutput:
        return cast(
            "InsertTableRowOutput",
            self._call_operation(
                "insert_table_row",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "values": values,
                },
                timeout_seconds,
            ),
        )

    def inspect_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        stored_memory_id: str,
        timeout_seconds: float | None = None,
    ) -> InspectMemoryOutput:
        return cast(
            "InspectMemoryOutput",
            self._call_operation(
                "inspect_memory",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "stored_memory_id": stored_memory_id,
                },
                timeout_seconds,
            ),
        )

    def invite_member(
        self,
        *,
        project_id: str,
        email: str,
        role: Literal["owner", "member"] | None = None,
        timeout_seconds: float | None = None,
    ) -> InviteMemberOutput:
        return cast(
            "InviteMemberOutput",
            self._call_operation(
                "invite_member",
                {"project_id": project_id, "email": email, "role": role},
                timeout_seconds,
            ),
        )

    def list_api_key_permission_changes(
        self,
        *,
        project_id: str,
        key_id: str,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListApiKeyPermissionChangesOutput:
        return cast(
            "ListApiKeyPermissionChangesOutput",
            self._call_operation(
                "list_api_key_permission_changes",
                {"project_id": project_id, "key_id": key_id, "limit": limit, "offset": offset},
                timeout_seconds,
            ),
        )

    def list_api_keys(
        self,
        *,
        project_id: str,
        status: str | None = None,
        created_from: str | None = None,
        created_to: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "name"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListApiKeysOutput:
        return cast(
            "ListApiKeysOutput",
            self._call_operation(
                "list_api_keys",
                {
                    "project_id": project_id,
                    "status": status,
                    "created_from": created_from,
                    "created_to": created_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_correction_passes(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListCorrectionPassesOutput:
        return cast(
            "ListCorrectionPassesOutput",
            self._call_operation(
                "list_correction_passes",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_corrections(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        pass_id: str | None = None,
        status: str | None = None,
        kind: str | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListCorrectionsOutput:
        return cast(
            "ListCorrectionsOutput",
            self._call_operation(
                "list_corrections",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "pass_id": pass_id,
                    "status": status,
                    "kind": kind,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_database_migrations(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> ListDatabaseMigrationsOutput:
        return cast(
            "ListDatabaseMigrationsOutput",
            self._call_operation(
                "list_database_migrations",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def list_database_tables(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> ListDatabaseTablesOutput:
        return cast(
            "ListDatabaseTablesOutput",
            self._call_operation(
                "list_database_tables",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def list_databases(
        self,
        *,
        project_id: str,
        state: Literal["live", "deleted"] | None = None,
        creator: str | None = None,
        created_from: str | None = None,
        created_to: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "name", "purge_after"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListDatabasesOutput:
        return cast(
            "ListDatabasesOutput",
            self._call_operation(
                "list_databases",
                {
                    "project_id": project_id,
                    "state": state,
                    "creator": creator,
                    "created_from": created_from,
                    "created_to": created_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_file_versions(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListFileVersionsOutput:
        return cast(
            "ListFileVersionsOutput",
            self._call_operation(
                "list_file_versions",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "file_id": file_id,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_files(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        state: Literal["live", "deleted"] | None = None,
        kind: str | None = None,
        status: str | None = None,
        search: str | None = None,
        sort: Literal["updated_at", "path", "created_at", "size_bytes", "purge_after"]
        | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListFilesOutput:
        return cast(
            "ListFilesOutput",
            self._call_operation(
                "list_files",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "state": state,
                    "kind": kind,
                    "status": status,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_flagged_questions(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        status: str | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListFlaggedQuestionsOutput:
        return cast(
            "ListFlaggedQuestionsOutput",
            self._call_operation(
                "list_flagged_questions",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "status": status,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_folder(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        folder: str | None = None,
        sort: Literal["name", "updated_at", "size_bytes"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListFolderOutput:
        return cast(
            "ListFolderOutput",
            self._call_operation(
                "list_folder",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "folder": folder,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_forgetting_suggestions(
        self,
        *,
        project_id: str,
        memory_id: str,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListForgettingSuggestionsOutput:
        return cast(
            "ListForgettingSuggestionsOutput",
            self._call_operation(
                "list_forgetting_suggestions",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_index_records(
        self,
        *,
        project_id: str,
        index_id: str,
        search: str | None = None,
        sort: str | None = None,
        filters: str | None = None,
        cursor: str | None = None,
        limit: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListIndexRecordsOutput:
        return cast(
            "ListIndexRecordsOutput",
            self._call_operation(
                "list_index_records",
                {
                    "project_id": project_id,
                    "index_id": index_id,
                    "search": search,
                    "sort": sort,
                    "filters": filters,
                    "cursor": cursor,
                    "limit": limit,
                },
                timeout_seconds,
            ),
        )

    def list_indexes(
        self,
        *,
        project_id: str,
        state: Literal["live", "deleted"] | None = None,
        creator: str | None = None,
        created_from: str | None = None,
        created_to: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "name", "purge_after"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListIndexesOutput:
        return cast(
            "ListIndexesOutput",
            self._call_operation(
                "list_indexes",
                {
                    "project_id": project_id,
                    "state": state,
                    "creator": creator,
                    "created_from": created_from,
                    "created_to": created_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_invitations(
        self,
        *,
        project_id: str,
        role: str | None = None,
        status: str | None = None,
        created_from: str | None = None,
        created_to: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "expires_at", "email"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListInvitationsOutput:
        return cast(
            "ListInvitationsOutput",
            self._call_operation(
                "list_invitations",
                {
                    "project_id": project_id,
                    "role": role,
                    "status": status,
                    "created_from": created_from,
                    "created_to": created_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_knowledge_bases(
        self,
        *,
        project_id: str,
        state: Literal["live", "deleted"] | None = None,
        creator: str | None = None,
        created_from: str | None = None,
        created_to: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "name", "purge_after"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListKnowledgeBasesOutput:
        return cast(
            "ListKnowledgeBasesOutput",
            self._call_operation(
                "list_knowledge_bases",
                {
                    "project_id": project_id,
                    "state": state,
                    "creator": creator,
                    "created_from": created_from,
                    "created_to": created_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_learned_changes(
        self,
        *,
        project_id: str,
        memory_id: str,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListLearnedChangesOutput:
        return cast(
            "ListLearnedChangesOutput",
            self._call_operation(
                "list_learned_changes",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_members(
        self,
        *,
        project_id: str,
        role: str | None = None,
        added_from: str | None = None,
        added_to: str | None = None,
        search: str | None = None,
        sort: Literal["name", "email", "role", "added_at"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMembersOutput:
        return cast(
            "ListMembersOutput",
            self._call_operation(
                "list_members",
                {
                    "project_id": project_id,
                    "role": role,
                    "added_from": added_from,
                    "added_to": added_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memories(
        self,
        *,
        project_id: str,
        memory_id: str,
        query: str | None = None,
        end_user_id: str | None = None,
        team_id: str | None = None,
        owner_id: str | None = None,
        scope: str | None = None,
        type: str | None = None,
        trust_level: str | None = None,
        plan_state: str | None = None,
        include_replaced: Literal["true", "false"] | None = None,
        forgotten: Literal["true", "false"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemoriesOutput:
        return cast(
            "ListMemoriesOutput",
            self._call_operation(
                "list_memories",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "query": query,
                    "end_user_id": end_user_id,
                    "team_id": team_id,
                    "owner_id": owner_id,
                    "scope": scope,
                    "type": type,
                    "trust_level": trust_level,
                    "plan_state": plan_state,
                    "include_replaced": include_replaced,
                    "forgotten": forgotten,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memory_decisions(
        self,
        *,
        project_id: str,
        memory_id: str,
        kind: str | None = None,
        stored_memory_id: str | None = None,
        subject_owner_id: str | None = None,
        by_person: Literal["true", "false"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemoryDecisionsOutput:
        return cast(
            "ListMemoryDecisionsOutput",
            self._call_operation(
                "list_memory_decisions",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "kind": kind,
                    "stored_memory_id": stored_memory_id,
                    "subject_owner_id": subject_owner_id,
                    "by_person": by_person,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memory_owners(
        self,
        *,
        project_id: str,
        memory_id: str,
        query: str | None = None,
        scope: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemoryOwnersOutput:
        return cast(
            "ListMemoryOwnersOutput",
            self._call_operation(
                "list_memory_owners",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "query": query,
                    "scope": scope,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memory_reviews(
        self,
        *,
        project_id: str,
        memory_id: str,
        state: Literal["open", "settled"] | None = None,
        reason: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemoryReviewsOutput:
        return cast(
            "ListMemoryReviewsOutput",
            self._call_operation(
                "list_memory_reviews",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "state": state,
                    "reason": reason,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memory_saved_questions(
        self,
        *,
        project_id: str,
        memory_id: str,
        flagged: Literal["true", "false"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemorySavedQuestionsOutput:
        return cast(
            "ListMemorySavedQuestionsOutput",
            self._call_operation(
                "list_memory_saved_questions",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "flagged": flagged,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memory_sources(
        self,
        *,
        project_id: str,
        memory_id: str,
        kind: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemorySourcesOutput:
        return cast(
            "ListMemorySourcesOutput",
            self._call_operation(
                "list_memory_sources",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "kind": kind,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_memory_webhook_deliveries(
        self,
        *,
        project_id: str,
        memory_id: str,
        state: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMemoryWebhookDeliveriesOutput:
        return cast(
            "ListMemoryWebhookDeliveriesOutput",
            self._call_operation(
                "list_memory_webhook_deliveries",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "state": state,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_messages(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str | None = None,
        conversation_id: str | None = None,
        state: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMessagesOutput:
        return cast(
            "ListMessagesOutput",
            self._call_operation(
                "list_messages",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "source_id": source_id,
                    "conversation_id": conversation_id,
                    "state": state,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_metadata_keys(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        search: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMetadataKeysOutput:
        return cast(
            "ListMetadataKeysOutput",
            self._call_operation(
                "list_metadata_keys",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "search": search,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_metadata_values(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        key: str,
        search: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListMetadataValuesOutput:
        return cast(
            "ListMetadataValuesOutput",
            self._call_operation(
                "list_metadata_values",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "key": key,
                    "search": search,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_operations(
        self,
        *,
        timeout_seconds: float | None = None,
    ) -> ListOperationsOutput:
        return cast(
            "ListOperationsOutput", self._call_operation("list_operations", {}, timeout_seconds)
        )

    def list_projects(
        self,
        *,
        state: Literal["live", "deleted"] | None = None,
        role: str | None = None,
        created_from: str | None = None,
        created_to: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "name", "purge_after", "last_changed_at"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListProjectsOutput:
        return cast(
            "ListProjectsOutput",
            self._call_operation(
                "list_projects",
                {
                    "state": state,
                    "role": role,
                    "created_from": created_from,
                    "created_to": created_to,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_questions(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        end_user_id: str | None = None,
        search: str | None = None,
        sort: Literal["asked_at"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListQuestionsOutput:
        return cast(
            "ListQuestionsOutput",
            self._call_operation(
                "list_questions",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "end_user_id": end_user_id,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_saved_queries(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> ListSavedQueriesOutput:
        return cast(
            "ListSavedQueriesOutput",
            self._call_operation(
                "list_saved_queries",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def list_saved_questions(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        state: str | None = None,
        split: str | None = None,
        search: str | None = None,
        sort: Literal["created_at", "question"] | None = None,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListSavedQuestionsOutput:
        return cast(
            "ListSavedQuestionsOutput",
            self._call_operation(
                "list_saved_questions",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "state": state,
                    "split": split,
                    "search": search,
                    "sort": sort,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_scorecard_results(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        scorecard_id: str,
        compare_to: str | None = None,
        outcome: str | None = None,
        change: str | None = None,
        split: str | None = None,
        cause: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListScorecardResultsOutput:
        return cast(
            "ListScorecardResultsOutput",
            self._call_operation(
                "list_scorecard_results",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "scorecard_id": scorecard_id,
                    "compare_to": compare_to,
                    "outcome": outcome,
                    "change": change,
                    "split": split,
                    "cause": cause,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_scorecards(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        direction: Literal["asc", "desc"] | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListScorecardsOutput:
        return cast(
            "ListScorecardsOutput",
            self._call_operation(
                "list_scorecards",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "direction": direction,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_source_items(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        external_id: str | None = None,
        state: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListSourceItemsOutput:
        return cast(
            "ListSourceItemsOutput",
            self._call_operation(
                "list_source_items",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                    "external_id": external_id,
                    "state": state,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_source_syncs(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListSourceSyncsOutput:
        return cast(
            "ListSourceSyncsOutput",
            self._call_operation(
                "list_source_syncs",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_sources(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        kind: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListSourcesOutput:
        return cast(
            "ListSourcesOutput",
            self._call_operation(
                "list_sources",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "kind": kind,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def list_table_rows(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        filters: Sequence[ListTableRowsInputFiltersItem] | None = None,
        sorts: Sequence[ListTableRowsInputSortsItem] | None = None,
        page_size: int | str | None = None,
        offset: int | str | None = None,
        after: Sequence[
            float
            | str
            | ListTableRowsInputAfterItemInteger
            | ListTableRowsInputAfterItemBlob
            | None
        ]
        | None = None,
        before: Sequence[
            float
            | str
            | ListTableRowsInputBeforeItemInteger
            | ListTableRowsInputBeforeItemBlob
            | None
        ]
        | None = None,
        last_page: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> ListTableRowsOutput:
        return cast(
            "ListTableRowsOutput",
            self._call_operation(
                "list_table_rows",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "filters": filters,
                    "sorts": sorts,
                    "page_size": page_size,
                    "offset": offset,
                    "after": after,
                    "before": before,
                    "last_page": last_page,
                },
                timeout_seconds,
            ),
        )

    def list_version_blocks(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        version: str,
        sheet: str | None = None,
        from_row: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> ListVersionBlocksOutput:
        return cast(
            "ListVersionBlocksOutput",
            self._call_operation(
                "list_version_blocks",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "file_id": file_id,
                    "version": version,
                    "sheet": sheet,
                    "from_row": from_row,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def preview_create_table(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        columns: Sequence[PreviewCreateTableInputColumnsItem],
        timeout_seconds: float | None = None,
    ) -> PreviewCreateTableOutput:
        return cast(
            "PreviewCreateTableOutput",
            self._call_operation(
                "preview_create_table",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "columns": columns,
                },
                timeout_seconds,
            ),
        )

    def preview_index_search(
        self,
        *,
        project_id: str,
        index_id: str,
        query: str,
        filters: str | None = None,
        mode: Literal["keyword", "vector", "hybrid"] | None = None,
        vector_field: str | None = None,
        fields: str | Sequence[str] | None = None,
        boosts: str | Mapping[str, object] | None = None,
        term_match: int | str | None = None,
        tolerance: int | str | None = None,
        prefix_length: int | str | None = None,
        exact: bool | None = None,
        prefix: bool | None = None,
        partial_words: bool | None = None,
        minimum_score: float | str | None = None,
        fusion: Literal["rrf", "linear"] | None = None,
        fusion_constant: int | str | None = None,
        vector_weight: float | str | None = None,
        minimum_similarity: float | str | None = None,
        vector_candidates: int | str | None = None,
        sort: str | None = None,
        direction: Literal["asc", "desc"] | None = None,
        pinned: Sequence[PreviewIndexSearchInputPinnedItem] | None = None,
        group_by: str | Sequence[str] | None = None,
        group_size: int | str | None = None,
        facets: str | Sequence[str] | None = None,
        facet_limit: int | str | None = None,
        facet_filters: str | None = None,
        facet_ranges: Mapping[str, Sequence[PreviewIndexSearchInputFacetRangesValueItem]]
        | None = None,
        offset: int | str | None = None,
        limit: int | str | None = None,
        timeout_seconds: float | None = None,
    ) -> PreviewIndexSearchOutput:
        return cast(
            "PreviewIndexSearchOutput",
            self._call_operation(
                "preview_index_search",
                {
                    "project_id": project_id,
                    "index_id": index_id,
                    "query": query,
                    "filters": filters,
                    "mode": mode,
                    "vector_field": vector_field,
                    "fields": fields,
                    "boosts": boosts,
                    "term_match": term_match,
                    "tolerance": tolerance,
                    "prefix_length": prefix_length,
                    "exact": exact,
                    "prefix": prefix,
                    "partial_words": partial_words,
                    "minimum_score": minimum_score,
                    "fusion": fusion,
                    "fusion_constant": fusion_constant,
                    "vector_weight": vector_weight,
                    "minimum_similarity": minimum_similarity,
                    "vector_candidates": vector_candidates,
                    "sort": sort,
                    "direction": direction,
                    "pinned": pinned,
                    "group_by": group_by,
                    "group_size": group_size,
                    "facets": facets,
                    "facet_limit": facet_limit,
                    "facet_filters": facet_filters,
                    "facet_ranges": facet_ranges,
                    "offset": offset,
                    "limit": limit,
                },
                timeout_seconds,
            ),
        )

    def preview_table_column_changes(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        changes: Sequence[
            PreviewTableColumnChangesInputChangesItemAdd
            | PreviewTableColumnChangesInputChangesItemRename
            | PreviewTableColumnChangesInputChangesItemAlter
            | PreviewTableColumnChangesInputChangesItemDrop
        ],
        timeout_seconds: float | None = None,
    ) -> PreviewTableColumnChangesOutput:
        return cast(
            "PreviewTableColumnChangesOutput",
            self._call_operation(
                "preview_table_column_changes",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "changes": changes,
                },
                timeout_seconds,
            ),
        )

    def promote_correction(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        correction_id: str,
        note: str | None = None,
        timeout_seconds: float | None = None,
    ) -> PromoteCorrectionOutput:
        return cast(
            "PromoteCorrectionOutput",
            self._call_operation(
                "promote_correction",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "correction_id": correction_id,
                    "note": note,
                },
                timeout_seconds,
            ),
        )

    def promote_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        stored_memory_id: str,
        scope: Literal["team", "company"],
        team_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> PromoteMemoryOutput:
        return cast(
            "PromoteMemoryOutput",
            self._call_operation(
                "promote_memory",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "stored_memory_id": stored_memory_id,
                    "scope": scope,
                    "team_id": team_id,
                },
                timeout_seconds,
            ),
        )

    def propose_corrections(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> ProposeCorrectionsOutput:
        return cast(
            "ProposeCorrectionsOutput",
            self._call_operation(
                "propose_corrections",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def propose_database_change(
        self,
        *,
        project_id: str,
        database_id: str,
        request: str,
        timeout_seconds: float | None = None,
    ) -> ProposeDatabaseChangeOutput:
        return cast(
            "ProposeDatabaseChangeOutput",
            self._call_operation(
                "propose_database_change",
                {"project_id": project_id, "database_id": database_id, "request": request},
                timeout_seconds,
            ),
        )

    def recall_memories(
        self,
        *,
        project_id: str,
        memory_id: str,
        query: str,
        end_user_id: str | None = None,
        team_id: str | None = None,
        agent_id: str | None = None,
        as_of: str | None = None,
        type: str | Sequence[str] | None = None,
        limit: int | str | None = None,
        trial: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> RecallMemoriesOutput:
        return cast(
            "RecallMemoriesOutput",
            self._call_operation(
                "recall_memories",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "query": query,
                    "end_user_id": end_user_id,
                    "team_id": team_id,
                    "agent_id": agent_id,
                    "as_of": as_of,
                    "type": type,
                    "limit": limit,
                    "trial": trial,
                },
                timeout_seconds,
            ),
        )

    def record_answer_events(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        events: Sequence[RecordAnswerEventsInputEventsItem],
        origin: Literal["event", "sdk"] | None = None,
        timeout_seconds: float | None = None,
    ) -> RecordAnswerEventsOutput:
        return cast(
            "RecordAnswerEventsOutput",
            self._call_operation(
                "record_answer_events",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "events": events,
                    "origin": origin,
                },
                timeout_seconds,
            ),
        )

    def recover_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        stored_memory_id: str,
        timeout_seconds: float | None = None,
    ) -> RecoverMemoryOutput:
        return cast(
            "RecoverMemoryOutput",
            self._call_operation(
                "recover_memory",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "stored_memory_id": stored_memory_id,
                },
                timeout_seconds,
            ),
        )

    def remove_member(
        self,
        *,
        project_id: str,
        account_id: str,
        timeout_seconds: float | None = None,
    ) -> RemoveMemberOutput:
        return cast(
            "RemoveMemberOutput",
            self._call_operation(
                "remove_member",
                {"project_id": project_id, "account_id": account_id},
                timeout_seconds,
            ),
        )

    def remove_memory_webhook(
        self,
        *,
        project_id: str,
        memory_id: str,
        timeout_seconds: float | None = None,
    ) -> RemoveMemoryWebhookOutput:
        return cast(
            "RemoveMemoryWebhookOutput",
            self._call_operation(
                "remove_memory_webhook",
                {"project_id": project_id, "memory_id": memory_id},
                timeout_seconds,
            ),
        )

    def restore_database(
        self,
        *,
        project_id: str,
        database_id: str,
        timeout_seconds: float | None = None,
    ) -> RestoreDatabaseOutput:
        return cast(
            "RestoreDatabaseOutput",
            self._call_operation(
                "restore_database",
                {"project_id": project_id, "database_id": database_id},
                timeout_seconds,
            ),
        )

    def restore_file(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        file_id: str,
        timeout_seconds: float | None = None,
    ) -> RestoreFileOutput:
        return cast(
            "RestoreFileOutput",
            self._call_operation(
                "restore_file",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "file_id": file_id,
                },
                timeout_seconds,
            ),
        )

    def restore_index(
        self,
        *,
        project_id: str,
        index_id: str,
        timeout_seconds: float | None = None,
    ) -> RestoreIndexOutput:
        return cast(
            "RestoreIndexOutput",
            self._call_operation(
                "restore_index", {"project_id": project_id, "index_id": index_id}, timeout_seconds
            ),
        )

    def restore_index_snapshot(
        self,
        *,
        project_id: str,
        index_id: str,
        content: FileContent,
        timeout_seconds: float | None = None,
    ) -> RestoreIndexSnapshotOutput:
        return cast(
            "RestoreIndexSnapshotOutput",
            self._call_operation(
                "restore_index_snapshot",
                {"project_id": project_id, "index_id": index_id, "content": content},
                timeout_seconds,
            ),
        )

    def restore_knowledge_base(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> RestoreKnowledgeBaseOutput:
        return cast(
            "RestoreKnowledgeBaseOutput",
            self._call_operation(
                "restore_knowledge_base",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def restore_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        timeout_seconds: float | None = None,
    ) -> RestoreMemoryOutput:
        return cast(
            "RestoreMemoryOutput",
            self._call_operation(
                "restore_memory",
                {"project_id": project_id, "memory_id": memory_id},
                timeout_seconds,
            ),
        )

    def restore_project(
        self,
        *,
        project_id: str,
        timeout_seconds: float | None = None,
    ) -> RestoreProjectOutput:
        return cast(
            "RestoreProjectOutput",
            self._call_operation("restore_project", {"project_id": project_id}, timeout_seconds),
        )

    def review_flagged_questions(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> ReviewFlaggedQuestionsOutput:
        return cast(
            "ReviewFlaggedQuestionsOutput",
            self._call_operation(
                "review_flagged_questions",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def revoke_api_key(
        self,
        *,
        project_id: str,
        key_id: str,
        timeout_seconds: float | None = None,
    ) -> RevokeApiKeyOutput:
        return cast(
            "RevokeApiKeyOutput",
            self._call_operation(
                "revoke_api_key", {"project_id": project_id, "key_id": key_id}, timeout_seconds
            ),
        )

    def revoke_invitation(
        self,
        *,
        project_id: str,
        invitation_id: str,
        timeout_seconds: float | None = None,
    ) -> RevokeInvitationOutput:
        return cast(
            "RevokeInvitationOutput",
            self._call_operation(
                "revoke_invitation",
                {"project_id": project_id, "invitation_id": invitation_id},
                timeout_seconds,
            ),
        )

    def run_database_sql(
        self,
        *,
        project_id: str,
        database_id: str,
        sql: str,
        confirmation_token: str | None = None,
        timeout_seconds: float | None = None,
    ) -> RunDatabaseSqlOutput:
        return cast(
            "RunDatabaseSqlOutput",
            self._call_operation(
                "run_database_sql",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "sql": sql,
                    "confirmation_token": confirmation_token,
                },
                timeout_seconds,
            ),
        )

    def save_index_record(
        self,
        *,
        project_id: str,
        index_id: str,
        record_id: str,
        record: Mapping[str, object],
        timeout_seconds: float | None = None,
    ) -> SaveIndexRecordOutput:
        return cast(
            "SaveIndexRecordOutput",
            self._call_operation(
                "save_index_record",
                {
                    "project_id": project_id,
                    "index_id": index_id,
                    "record_id": record_id,
                    "record": record,
                },
                timeout_seconds,
            ),
        )

    def save_memory_question(
        self,
        *,
        project_id: str,
        memory_id: str,
        question: str,
        stored_memory_id: str,
        end_user_id: str | None = None,
        team_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SaveMemoryQuestionOutput:
        return cast(
            "SaveMemoryQuestionOutput",
            self._call_operation(
                "save_memory_question",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "question": question,
                    "stored_memory_id": stored_memory_id,
                    "end_user_id": end_user_id,
                    "team_id": team_id,
                },
                timeout_seconds,
            ),
        )

    def save_query(
        self,
        *,
        project_id: str,
        database_id: str,
        name: str,
        sql: str,
        saved_query_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SaveQueryOutput:
        return cast(
            "SaveQueryOutput",
            self._call_operation(
                "save_query",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "name": name,
                    "sql": sql,
                    "saved_query_id": saved_query_id,
                },
                timeout_seconds,
            ),
        )

    def save_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question: str,
        chunk_id: str | None = None,
        file_id: str | None = None,
        version: int | str | None = None,
        first_position: int | str | None = None,
        last_position: int | str | None = None,
        question_log_id: str | None = None,
        end_user_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SaveQuestionOutput:
        return cast(
            "SaveQuestionOutput",
            self._call_operation(
                "save_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question": question,
                    "chunk_id": chunk_id,
                    "file_id": file_id,
                    "version": version,
                    "first_position": first_position,
                    "last_position": last_position,
                    "question_log_id": question_log_id,
                    "end_user_id": end_user_id,
                },
                timeout_seconds,
            ),
        )

    def score_question_set(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        timeout_seconds: float | None = None,
    ) -> ScoreQuestionSetOutput:
        return cast(
            "ScoreQuestionSetOutput",
            self._call_operation(
                "score_question_set",
                {"project_id": project_id, "knowledge_base_id": knowledge_base_id},
                timeout_seconds,
            ),
        )

    def search_folders(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        search: str | None = None,
        limit: str | None = None,
        offset: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SearchFoldersOutput:
        return cast(
            "SearchFoldersOutput",
            self._call_operation(
                "search_folders",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "search": search,
                    "limit": limit,
                    "offset": offset,
                },
                timeout_seconds,
            ),
        )

    def search_knowledge_base(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question: str,
        limit: int | str | None = None,
        folder: str | None = None,
        metadata: Mapping[str, str | Sequence[str]] | None = None,
        end_user_id: str | None = None,
        call_id: str | None = None,
        with_memories: bool | None = None,
        team_id: str | None = None,
        agent_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SearchKnowledgeBaseOutput:
        return cast(
            "SearchKnowledgeBaseOutput",
            self._call_operation(
                "search_knowledge_base",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question": question,
                    "limit": limit,
                    "folder": folder,
                    "metadata": metadata,
                    "end_user_id": end_user_id,
                    "call_id": call_id,
                    "with_memories": with_memories,
                    "team_id": team_id,
                    "agent_id": agent_id,
                },
                timeout_seconds,
            ),
        )

    def send_memory_feedback(
        self,
        *,
        project_id: str,
        memory_id: str,
        stored_memory_id: str,
        verdict: Literal["right", "wrong"],
        recall_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SendMemoryFeedbackOutput:
        return cast(
            "SendMemoryFeedbackOutput",
            self._call_operation(
                "send_memory_feedback",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "stored_memory_id": stored_memory_id,
                    "verdict": verdict,
                    "recall_id": recall_id,
                },
                timeout_seconds,
            ),
        )

    def set_memory_webhook(
        self,
        *,
        project_id: str,
        memory_id: str,
        url: str,
        timeout_seconds: float | None = None,
    ) -> SetMemoryWebhookOutput:
        return cast(
            "SetMemoryWebhookOutput",
            self._call_operation(
                "set_memory_webhook",
                {"project_id": project_id, "memory_id": memory_id, "url": url},
                timeout_seconds,
            ),
        )

    def settle_flagged_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question_id: str,
        chunk_id: str | None = None,
        file_id: str | None = None,
        version: int | str | None = None,
        first_position: int | str | None = None,
        last_position: int | str | None = None,
        timeout_seconds: float | None = None,
    ) -> SettleFlaggedQuestionOutput:
        return cast(
            "SettleFlaggedQuestionOutput",
            self._call_operation(
                "settle_flagged_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question_id": question_id,
                    "chunk_id": chunk_id,
                    "file_id": file_id,
                    "version": version,
                    "first_position": first_position,
                    "last_position": last_position,
                },
                timeout_seconds,
            ),
        )

    def settle_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        stored_memory_id: str,
        trust_level: Literal["confirmed", "likely", "disputed", "not_kept"],
        type: Literal["event", "fact", "plan", "procedure"] | None = None,
        scope: Literal["end_user", "team", "company"] | None = None,
        owner_id: str | None = None,
        expires_at: str | Omitted | None = OMITTED,
        over_file: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> SettleMemoryOutput:
        return cast(
            "SettleMemoryOutput",
            self._call_operation(
                "settle_memory",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "stored_memory_id": stored_memory_id,
                    "trust_level": trust_level,
                    "type": type,
                    "scope": scope,
                    "owner_id": owner_id,
                    "expires_at": expires_at,
                    "over_file": over_file,
                },
                timeout_seconds,
            ),
        )

    def settle_memory_review(
        self,
        *,
        project_id: str,
        memory_id: str,
        review_id: str,
        trust_level: Literal["confirmed", "likely", "disputed", "not_kept"],
        type: Literal["event", "fact", "plan", "procedure"] | None = None,
        scope: Literal["end_user", "team", "company"] | None = None,
        owner_id: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SettleMemoryReviewOutput:
        return cast(
            "SettleMemoryReviewOutput",
            self._call_operation(
                "settle_memory_review",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "review_id": review_id,
                    "trust_level": trust_level,
                    "type": type,
                    "scope": scope,
                    "owner_id": owner_id,
                },
                timeout_seconds,
            ),
        )

    def sign_in(
        self,
        *,
        email: str,
        password: str,
        known_device_token: str | None = None,
        timeout_seconds: float | None = None,
    ) -> SignInOutput:
        return cast(
            "SignInOutput",
            self._call_operation(
                "sign_in",
                {"email": email, "password": password, "known_device_token": known_device_token},
                timeout_seconds,
            ),
        )

    def sign_out(
        self,
        *,
        timeout_seconds: float | None = None,
    ) -> SignOutOutput:
        return cast("SignOutOutput", self._call_operation("sign_out", {}, timeout_seconds))

    def sign_up(
        self,
        *,
        email: str,
        password: str,
        name: str,
        timeout_seconds: float | None = None,
    ) -> SignUpOutput:
        return cast(
            "SignUpOutput",
            self._call_operation(
                "sign_up", {"email": email, "password": password, "name": name}, timeout_seconds
            ),
        )

    def sign_upload_parts(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        upload_id: str,
        parts: Sequence[SignUploadPartsInputPartsItem],
        timeout_seconds: float | None = None,
    ) -> SignUploadPartsOutput:
        return cast(
            "SignUploadPartsOutput",
            self._call_operation(
                "sign_upload_parts",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "upload_id": upload_id,
                    "parts": parts,
                },
                timeout_seconds,
            ),
        )

    def sort_message(
        self,
        *,
        project_id: str,
        memory_id: str,
        text: str,
        author: str,
        author_kind: Literal["staff", "agent", "end_user", "outsider"],
        sent_at: str | None = None,
        conversation_id: str | None = None,
        end_user_id: str | None = None,
        team_id: str | None = None,
        private: bool | None = None,
        sorting: Literal["full", "rules_only", "as_given"] | None = None,
        timeout_seconds: float | None = None,
    ) -> SortMessageOutput:
        return cast(
            "SortMessageOutput",
            self._call_operation(
                "sort_message",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "text": text,
                    "author": author,
                    "author_kind": author_kind,
                    "sent_at": sent_at,
                    "conversation_id": conversation_id,
                    "end_user_id": end_user_id,
                    "team_id": team_id,
                    "private": private,
                    "sorting": sorting,
                },
                timeout_seconds,
            ),
        )

    def start_memory_source_sign_in(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> StartMemorySourceSignInOutput:
        return cast(
            "StartMemorySourceSignInOutput",
            self._call_operation(
                "start_memory_source_sign_in",
                {"project_id": project_id, "memory_id": memory_id, "source_id": source_id},
                timeout_seconds,
            ),
        )

    def start_source_sign_in(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> StartSourceSignInOutput:
        return cast(
            "StartSourceSignInOutput",
            self._call_operation(
                "start_source_sign_in",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                },
                timeout_seconds,
            ),
        )

    def suggest_index_terms(
        self,
        *,
        project_id: str,
        index_id: str,
        prefix: str,
        limit: int | str | None = None,
        timeout_seconds: float | None = None,
    ) -> SuggestIndexTermsOutput:
        return cast(
            "SuggestIndexTermsOutput",
            self._call_operation(
                "suggest_index_terms",
                {"project_id": project_id, "index_id": index_id, "prefix": prefix, "limit": limit},
                timeout_seconds,
            ),
        )

    def sync_memory_source(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> SyncMemorySourceOutput:
        return cast(
            "SyncMemorySourceOutput",
            self._call_operation(
                "sync_memory_source",
                {"project_id": project_id, "memory_id": memory_id, "source_id": source_id},
                timeout_seconds,
            ),
        )

    def sync_source(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        timeout_seconds: float | None = None,
    ) -> SyncSourceOutput:
        return cast(
            "SyncSourceOutput",
            self._call_operation(
                "sync_source",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                },
                timeout_seconds,
            ),
        )

    def try_corrections(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        correction_ids: Sequence[str],
        complete_index: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> TryCorrectionsOutput:
        return cast(
            "TryCorrectionsOutput",
            self._call_operation(
                "try_corrections",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "correction_ids": correction_ids,
                    "complete_index": complete_index,
                },
                timeout_seconds,
            ),
        )

    def tune_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        timeout_seconds: float | None = None,
    ) -> TuneMemoryOutput:
        return cast(
            "TuneMemoryOutput",
            self._call_operation(
                "tune_memory", {"project_id": project_id, "memory_id": memory_id}, timeout_seconds
            ),
        )

    def undo_learned_change(
        self,
        *,
        project_id: str,
        memory_id: str,
        change_id: str,
        timeout_seconds: float | None = None,
    ) -> UndoLearnedChangeOutput:
        return cast(
            "UndoLearnedChangeOutput",
            self._call_operation(
                "undo_learned_change",
                {"project_id": project_id, "memory_id": memory_id, "change_id": change_id},
                timeout_seconds,
            ),
        )

    def update_api_key(
        self,
        *,
        project_id: str,
        key_id: str,
        permissions: UpdateApiKeyInputPermissionsFull | UpdateApiKeyInputPermissionsRestricted,
        timeout_seconds: float | None = None,
    ) -> UpdateApiKeyOutput:
        return cast(
            "UpdateApiKeyOutput",
            self._call_operation(
                "update_api_key",
                {"project_id": project_id, "key_id": key_id, "permissions": permissions},
                timeout_seconds,
            ),
        )

    def update_database(
        self,
        *,
        project_id: str,
        database_id: str,
        sql_write_preview: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> UpdateDatabaseOutput:
        return cast(
            "UpdateDatabaseOutput",
            self._call_operation(
                "update_database",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "sql_write_preview": sql_write_preview,
                },
                timeout_seconds,
            ),
        )

    def update_index(
        self,
        *,
        project_id: str,
        index_id: str,
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
        | None = None,
        bm25: UpdateIndexInputBm25 | Omitted | None = OMITTED,
        synonyms: Sequence[
            UpdateIndexInputSynonymsItemOption1 | UpdateIndexInputSynonymsItemOption2
        ]
        | None = None,
        stop_words: Sequence[str] | Omitted | None = OMITTED,
        search_defaults: UpdateIndexInputSearchDefaults | Omitted | None = OMITTED,
        timeout_seconds: float | None = None,
    ) -> UpdateIndexOutput:
        return cast(
            "UpdateIndexOutput",
            self._call_operation(
                "update_index",
                {
                    "project_id": project_id,
                    "index_id": index_id,
                    "language": language,
                    "bm25": bm25,
                    "synonyms": synonyms,
                    "stop_words": stop_words,
                    "search_defaults": search_defaults,
                },
                timeout_seconds,
            ),
        )

    def update_knowledge_base(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        question_log_retention_days: int | str | Omitted | None = OMITTED,
        agent_depth: int | str | None = None,
        automatic_corrections: bool | None = None,
        judge_passages: int | str | None = None,
        judge_threshold: float | str | None = None,
        timeout_seconds: float | None = None,
    ) -> UpdateKnowledgeBaseOutput:
        return cast(
            "UpdateKnowledgeBaseOutput",
            self._call_operation(
                "update_knowledge_base",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "question_log_retention_days": question_log_retention_days,
                    "agent_depth": agent_depth,
                    "automatic_corrections": automatic_corrections,
                    "judge_passages": judge_passages,
                    "judge_threshold": judge_threshold,
                },
                timeout_seconds,
            ),
        )

    def update_memory(
        self,
        *,
        project_id: str,
        memory_id: str,
        knowledge_base_choice: Literal["every", "listed"] | None = None,
        checked_knowledge_base_ids: Sequence[str] | None = None,
        duplicate_threshold: float | str | None = None,
        confidence_threshold: float | str | None = None,
        agreeing_authors_for_confirmed: int | str | None = None,
        first_pack_tokens: int | str | None = None,
        recall_fade_days: float | str | None = None,
        subjects: Sequence[UpdateMemoryInputSubjectsItem] | None = None,
        sources_for_likely: int | str | None = None,
        agent_permissions: UpdateMemoryInputAgentPermissions | None = None,
        dropped_list_days: int | str | Omitted | None = OMITTED,
        replaced_retention_days: int | str | Omitted | None = OMITTED,
        message_retention_days: int | str | Omitted | None = OMITTED,
        personal_retention_days: int | str | Omitted | None = OMITTED,
        recall_log_retention_days: int | str | Omitted | None = OMITTED,
        ready_set_size: int | str | None = None,
        recall_depth: int | str | None = None,
        cue_weights: UpdateMemoryInputCueWeights | None = None,
        timeout_seconds: float | None = None,
    ) -> UpdateMemoryOutput:
        return cast(
            "UpdateMemoryOutput",
            self._call_operation(
                "update_memory",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "knowledge_base_choice": knowledge_base_choice,
                    "checked_knowledge_base_ids": checked_knowledge_base_ids,
                    "duplicate_threshold": duplicate_threshold,
                    "confidence_threshold": confidence_threshold,
                    "agreeing_authors_for_confirmed": agreeing_authors_for_confirmed,
                    "first_pack_tokens": first_pack_tokens,
                    "recall_fade_days": recall_fade_days,
                    "subjects": subjects,
                    "sources_for_likely": sources_for_likely,
                    "agent_permissions": agent_permissions,
                    "dropped_list_days": dropped_list_days,
                    "replaced_retention_days": replaced_retention_days,
                    "message_retention_days": message_retention_days,
                    "personal_retention_days": personal_retention_days,
                    "recall_log_retention_days": recall_log_retention_days,
                    "ready_set_size": ready_set_size,
                    "recall_depth": recall_depth,
                    "cue_weights": cue_weights,
                },
                timeout_seconds,
            ),
        )

    def update_memory_source(
        self,
        *,
        project_id: str,
        memory_id: str,
        source_id: str,
        name: str | None = None,
        sorting: Literal["full", "rules_only", "as_given"] | None = None,
        settings: Mapping[str, object] | None = None,
        credentials: Mapping[str, object] | None = None,
        rotate_webhook_secret: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> UpdateMemorySourceOutput:
        return cast(
            "UpdateMemorySourceOutput",
            self._call_operation(
                "update_memory_source",
                {
                    "project_id": project_id,
                    "memory_id": memory_id,
                    "source_id": source_id,
                    "name": name,
                    "sorting": sorting,
                    "settings": settings,
                    "credentials": credentials,
                    "rotate_webhook_secret": rotate_webhook_secret,
                },
                timeout_seconds,
            ),
        )

    def update_saved_question(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        saved_question_id: str,
        chunk_id: str | None = None,
        file_id: str | None = None,
        version: int | str | None = None,
        first_position: int | str | None = None,
        last_position: int | str | None = None,
        confirm: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> UpdateSavedQuestionOutput:
        return cast(
            "UpdateSavedQuestionOutput",
            self._call_operation(
                "update_saved_question",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "saved_question_id": saved_question_id,
                    "chunk_id": chunk_id,
                    "file_id": file_id,
                    "version": version,
                    "first_position": first_position,
                    "last_position": last_position,
                    "confirm": confirm,
                },
                timeout_seconds,
            ),
        )

    def update_source(
        self,
        *,
        project_id: str,
        knowledge_base_id: str,
        source_id: str,
        name: str | None = None,
        settings: Mapping[str, object] | None = None,
        credentials: Mapping[str, object] | None = None,
        rotate_webhook_secret: bool | None = None,
        timeout_seconds: float | None = None,
    ) -> UpdateSourceOutput:
        return cast(
            "UpdateSourceOutput",
            self._call_operation(
                "update_source",
                {
                    "project_id": project_id,
                    "knowledge_base_id": knowledge_base_id,
                    "source_id": source_id,
                    "name": name,
                    "settings": settings,
                    "credentials": credentials,
                    "rotate_webhook_secret": rotate_webhook_secret,
                },
                timeout_seconds,
            ),
        )

    def update_table_row(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        key: Sequence[
            float | str | UpdateTableRowInputKeyItemInteger | UpdateTableRowInputKeyItemBlob | None
        ],
        values: Mapping[
            str,
            float
            | str
            | UpdateTableRowInputValuesValueInteger
            | UpdateTableRowInputValuesValueBlob
            | None,
        ],
        expected: Mapping[
            str,
            float
            | str
            | UpdateTableRowInputExpectedValueInteger
            | UpdateTableRowInputExpectedValueBlob
            | None,
        ],
        timeout_seconds: float | None = None,
    ) -> UpdateTableRowOutput:
        return cast(
            "UpdateTableRowOutput",
            self._call_operation(
                "update_table_row",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "key": key,
                    "values": values,
                    "expected": expected,
                },
                timeout_seconds,
            ),
        )

    def upload_table_import(
        self,
        *,
        project_id: str,
        database_id: str,
        table_name: str,
        content: FileContent,
        timeout_seconds: float | None = None,
    ) -> UploadTableImportOutput:
        return cast(
            "UploadTableImportOutput",
            self._call_operation(
                "upload_table_import",
                {
                    "project_id": project_id,
                    "database_id": database_id,
                    "table_name": table_name,
                    "content": content,
                },
                timeout_seconds,
            ),
        )

    def verify_second_factor(
        self,
        *,
        challenge_token: str,
        code: str,
        method: Literal["totp", "backup_code"] | None = None,
        timeout_seconds: float | None = None,
    ) -> VerifySecondFactorOutput:
        return cast(
            "VerifySecondFactorOutput",
            self._call_operation(
                "verify_second_factor",
                {"challenge_token": challenge_token, "code": code, "method": method},
                timeout_seconds,
            ),
        )
