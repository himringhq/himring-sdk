export interface paths {
    "/v1/auth/second-factor/setup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["begin_second_factor_setup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/second-factor/setup/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["confirm_second_factor_setup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_session"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/sign-out": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sign_out"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/invitations/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["accept_invitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_projects"];
        put?: never;
        post: operations["create_project"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["delete_project"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/api-keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_api_keys"];
        put?: never;
        post: operations["create_api_key"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/api-keys/{key_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["update_api_key"];
        delete: operations["revoke_api_key"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/api-keys/{key_id}/permission-changes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_api_key_permission_changes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_index_snapshot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_invitations"];
        put?: never;
        post: operations["invite_member"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/invitations/{invitation_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["revoke_invitation"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_members"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/members/{account_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["remove_member"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_project"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/source-sign-ins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["finish_source_sign_in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        error_code: ("validation_failed" | "invalid_json" | "invalid_path_parameter" | "payload_too_large" | "unsupported_media_type" | "not_found" | "method_not_allowed" | "rate_limited" | "handler_timeout" | "internal_error" | "credential_required" | "credential_invalid" | "api_key_expired" | "session_required" | "second_factor_setup_required" | "account_pending_approval" | "account_rejected" | "not_an_operator" | "sign_in_failed" | "password_wrong" | "account_locked" | "challenge_invalid" | "second_factor_invalid" | "second_factor_already_enabled" | "second_factor_setup_not_started" | "account_not_found" | "account_already_decided" | "project_not_found" | "project_deleted" | "not_a_project_owner" | "no_cell_accepts_projects" | "last_owner" | "member_not_found" | "already_a_member" | "invitation_not_found" | "invitation_already_open" | "invitation_closed" | "invitation_expired" | "invitation_email_failed" | "invitation_for_another_email" | "api_key_not_found" | "api_key_permission_missing" | "database_not_found" | "database_name_taken" | "database_deleted" | "database_migration_refused" | "database_migration_failed" | "database_migration_conflict" | "database_migration_pending" | "index_not_found" | "index_name_taken" | "index_deleted" | "index_config_invalid" | "knowledge_base_not_found" | "knowledge_base_name_taken" | "knowledge_base_deleted" | "knowledge_base_not_ready" | "file_not_found" | "file_deleted" | "file_path_taken" | "file_too_large" | "file_empty" | "file_version_not_found" | "file_rendition_missing" | "storage_unavailable" | "embedding_unavailable" | "usage_log_unavailable" | "search_timed_out" | "search_filters_rebuilding" | "saved_question_not_found" | "question_already_saved" | "question_set_full" | "question_set_empty" | "passage_not_found" | "passage_choice_invalid" | "question_file_invalid" | "scorecard_not_found" | "correction_not_found" | "correction_pass_not_found" | "correction_decided" | "correction_not_tried" | "correction_lowers_held_back" | "no_held_back_questions" | "correction_kinds_clash" | "correction_pass_running" | "correction_passes_exhausted" | "correction_settings_moved" | "flagged_question_not_found" | "flagged_question_saved" | "answer_log_invalid" | "passage_already_confirmed" | "api_key_already_revoked" | "account_identity_fixed" | "record_fixed" | "migration_fixed" | "cell_mismatch" | "purge_not_due" | "erasure_unfinished" | "cell_unavailable" | "control_database_unavailable" | "index_record_not_found" | "index_record_invalid" | "index_filters_invalid" | "index_cursor_invalid" | "index_records_file_invalid" | "index_settings_invalid" | "index_synonym_stop_word" | "index_settings_changed" | "index_embedding_model_unknown" | "index_settings_pending" | "index_restore_running" | "index_snapshot_invalid" | "index_snapshot_schema_mismatch" | "index_snapshot_model_mismatch" | "source_not_found" | "source_limit_reached" | "source_settings_invalid" | "source_credentials_refused" | "source_credentials_unreadable" | "source_unreachable" | "source_endpoint_refused" | "source_not_pushable" | "source_not_syncable" | "source_has_no_webhook_secret" | "source_changed" | "source_deleting" | "source_sign_in_not_used" | "source_platform_not_configured" | "source_sign_in_invalid" | "source_sign_in_refused" | "source_workspace_in_another_project" | "file_path_reserved" | "webhook_signature_invalid" | "webhook_timestamp_invalid" | "webhook_too_large" | "webhook_not_understood" | "webhook_not_expected" | "memory_not_found" | "memory_not_enabled" | "memory_already_enabled" | "memory_deleted" | "memory_not_ready" | "stored_memory_not_found" | "memory_message_not_found" | "memory_review_not_found" | "memory_review_settled" | "memory_replaced" | "memory_not_personal" | "memory_forgotten" | "memory_not_forgotten" | "memory_decision_not_found" | "memory_webhook_not_set" | "memory_webhook_url_refused" | "learned_change_not_found" | "learned_change_undone" | "memory_tuning_has_no_new_input" | "memory_saved_question_not_found" | "memory_saved_questions_over_limit" | "recall_reader_missing" | "recall_date_in_future" | "memory_scope_invalid" | "memory_owner_scope_missing" | "memory_export_record_too_large" | "source_kind_memory_only" | "source_kind_knowledge_base_only" | "checked_knowledge_bases_over_limit" | "knowledge_base_in_another_cell" | "sorting_not_offered" | "source_table_unreadable" | "sorting_unavailable" | "database_access_denied" | "table_not_found" | "column_not_found" | "table_read_only" | "table_row_not_found" | "table_row_changed" | "table_row_invalid" | "database_sql_refused" | "database_sql_failed" | "database_schema_change_needs_migration" | "database_query_timed_out" | "database_result_too_large" | "database_change_too_large" | "database_confirmation_invalid" | "database_workspace_busy" | "database_writes_busy" | "saved_query_not_found" | "saved_queries_full" | "database_changed_since_proposal" | "database_assistant_unavailable" | "database_assistant_declined" | "table_columns_fixed" | "column_change_invalid" | "column_name_taken" | "column_change_refused" | "table_too_large_to_rebuild" | "column_change_rows_fail" | "database_schema_changed" | "table_definition_invalid" | "table_name_taken" | "table_name_reserved" | "table_export_value_too_large" | "table_import_file_invalid" | "table_import_too_large" | "table_import_database_full" | "table_import_not_found" | "table_import_pending" | "table_import_not_checked" | "table_import_changed" | "table_import_check_failed" | "table_import_too_many_failures" | "database_size_limit_reached" | "database_compaction_too_soon" | "database_compaction_disk_short" | "database_server_disk_full" | "upload_not_found" | "upload_closed" | "upload_expired" | "upload_incomplete" | "upload_part_out_of_range" | "upload_part_mismatch" | "upload_size_mismatch" | "upload_checksum_mismatch" | "upload_cancelled" | "uploads_busy" | "storage_events_not_expected" | "storage_event_signature_invalid" | "storage_event_timestamp_invalid" | "storage_event_too_large" | "storage_event_not_understood") | string;
        error_envelope: {
            error: {
                code: components["schemas"]["error_code"];
                details?: string;
                issues?: {
                    message: string;
                    path: (string | number)[];
                }[];
                message: string;
                missing_permission?: {
                    level: string;
                    resource_id: string | null;
                    resource_kind: string;
                };
                request_id?: string;
            };
        };
    };
    responses: {
        error: {
            headers: {
                "retry-after": components["headers"]["retry_after"];
                "x-request-id": components["headers"]["request_id"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["error_envelope"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: {
        request_id: string;
        retry_after: number;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    begin_second_factor_setup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    password: string;
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        backup_codes: string[];
                        totp_uri: string;
                    };
                };
            };
        };
    };
    confirm_second_factor_setup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    code: string;
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        session: {
                            account: {
                                created_at: string;
                                decided_at: string | null;
                                email: string;
                                id: string;
                                is_operator: boolean;
                                name: string;
                                status: "pending" | "approved" | "rejected";
                            };
                            expires_at: string;
                            second_factor_enabled: boolean;
                        };
                        session_token: string;
                    };
                };
            };
        };
    };
    get_session: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        account: {
                            created_at: string;
                            decided_at: string | null;
                            email: string;
                            id: string;
                            is_operator: boolean;
                            name: string;
                            status: "pending" | "approved" | "rejected";
                        };
                        expires_at: string;
                        second_factor_enabled: boolean;
                    };
                };
            };
        };
    };
    sign_out: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        signed_out: true;
                    };
                };
            };
        };
    };
    accept_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    token: string;
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        deleted_at: string | null;
                        id: string;
                        name: string;
                        narsil_url: string;
                        purge_after: string | null;
                        region: string;
                        role: ("owner" | "member") | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    list_projects: {
        parameters: {
            query?: {
                created_from?: string;
                created_to?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                role?: string;
                search?: string;
                sort?: "created_at" | "name" | "purge_after" | "last_changed_at";
                state?: "live" | "deleted";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        limit: number;
                        offset: number;
                        projects: {
                            created_at: string;
                            database_count: number;
                            deleted_at: string | null;
                            id: string;
                            index_count: number;
                            knowledge_base_count: number;
                            last_changed_at: string;
                            member_count: number;
                            memory_enabled: boolean;
                            name: string;
                            narsil_url: string;
                            purge_after: string | null;
                            region: string;
                            role: ("owner" | "member") | null;
                            sirannon_url: string;
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    create_project: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    name: string;
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            201: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        deleted_at: string | null;
                        id: string;
                        name: string;
                        narsil_url: string;
                        purge_after: string | null;
                        region: string;
                        role: ("owner" | "member") | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    delete_project: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        deleted_at: string | null;
                        id: string;
                        name: string;
                        narsil_url: string;
                        purge_after: string | null;
                        region: string;
                        role: ("owner" | "member") | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    list_api_keys: {
        parameters: {
            query?: {
                created_from?: string;
                created_to?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "created_at" | "name";
                status?: string;
            };
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        api_keys: {
                            created_at: string;
                            created_by: string;
                            created_by_name: string;
                            display_prefix: string;
                            expires_at: string | null;
                            id: string;
                            last_used_at: string | null;
                            name: string;
                            permissions: {
                                access: "full" | "restricted";
                                databases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                indexes: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                knowledge_bases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                memory: {
                                    level: "none" | "read" | "write";
                                };
                            };
                            permissions_changed_at: string | null;
                            permissions_changed_by_name: string | null;
                            project_id: string;
                            revoked_at: string | null;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    create_api_key: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    expires_at?: string | null;
                    name: string;
                    permissions: {
                        access: "full";
                    } | {
                        access: "restricted";
                        databases?: {
                            level: "none" | "read" | "write";
                            resource_ids?: string[] | null;
                        };
                        indexes?: {
                            level: "none" | "read" | "write";
                            resource_ids?: string[] | null;
                        };
                        knowledge_bases?: {
                            level: "none" | "read" | "write";
                            resource_ids?: string[] | null;
                        };
                        memory?: {
                            level: "none" | "read" | "write";
                        };
                    };
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            201: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        api_key: {
                            created_at: string;
                            created_by: string;
                            created_by_name: string;
                            display_prefix: string;
                            expires_at: string | null;
                            id: string;
                            last_used_at: string | null;
                            name: string;
                            permissions: {
                                access: "full" | "restricted";
                                databases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                indexes: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                knowledge_bases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                memory: {
                                    level: "none" | "read" | "write";
                                };
                            };
                            permissions_changed_at: string | null;
                            permissions_changed_by_name: string | null;
                            project_id: string;
                            revoked_at: string | null;
                        };
                        secret: string;
                    };
                };
            };
        };
    };
    update_api_key: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    permissions: {
                        access: "full";
                    } | {
                        access: "restricted";
                        databases?: {
                            level: "none" | "read" | "write";
                            resource_ids?: string[] | null;
                        };
                        indexes?: {
                            level: "none" | "read" | "write";
                            resource_ids?: string[] | null;
                        };
                        knowledge_bases?: {
                            level: "none" | "read" | "write";
                            resource_ids?: string[] | null;
                        };
                        memory?: {
                            level: "none" | "read" | "write";
                        };
                    };
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        created_by: string;
                        created_by_name: string;
                        display_prefix: string;
                        expires_at: string | null;
                        id: string;
                        last_used_at: string | null;
                        name: string;
                        permissions: {
                            access: "full" | "restricted";
                            databases: {
                                level: "none" | "read" | "write";
                                resource_ids: string[] | null;
                            };
                            indexes: {
                                level: "none" | "read" | "write";
                                resource_ids: string[] | null;
                            };
                            knowledge_bases: {
                                level: "none" | "read" | "write";
                                resource_ids: string[] | null;
                            };
                            memory: {
                                level: "none" | "read" | "write";
                            };
                        };
                        permissions_changed_at: string | null;
                        permissions_changed_by_name: string | null;
                        project_id: string;
                        revoked_at: string | null;
                    };
                };
            };
        };
    };
    revoke_api_key: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        created_by: string;
                        created_by_name: string;
                        display_prefix: string;
                        expires_at: string | null;
                        id: string;
                        last_used_at: string | null;
                        name: string;
                        permissions: {
                            access: "full" | "restricted";
                            databases: {
                                level: "none" | "read" | "write";
                                resource_ids: string[] | null;
                            };
                            indexes: {
                                level: "none" | "read" | "write";
                                resource_ids: string[] | null;
                            };
                            knowledge_bases: {
                                level: "none" | "read" | "write";
                                resource_ids: string[] | null;
                            };
                            memory: {
                                level: "none" | "read" | "write";
                            };
                        };
                        permissions_changed_at: string | null;
                        permissions_changed_by_name: string | null;
                        project_id: string;
                        revoked_at: string | null;
                    };
                };
            };
        };
    };
    list_api_key_permission_changes: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                key_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        changes: {
                            changed_at: string;
                            changed_by: string;
                            changed_by_name: string;
                            id: string;
                            key_id: string;
                            permissions_after: {
                                access: "full" | "restricted";
                                databases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                indexes: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                knowledge_bases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                memory: {
                                    level: "none" | "read" | "write";
                                };
                            };
                            permissions_before: {
                                access: "full" | "restricted";
                                databases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                indexes: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                knowledge_bases: {
                                    level: "none" | "read" | "write";
                                    resource_ids: string[] | null;
                                };
                                memory: {
                                    level: "none" | "read" | "write";
                                };
                            } | null;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    restore_index_snapshot: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        index: {
                            config: {
                                [key: string]: unknown;
                            };
                            created_at: string;
                            created_by: {
                                id: string;
                                kind: "account" | "key";
                                name: string;
                            };
                            deleted_at: string | null;
                            id: string;
                            name: string;
                            narsil_url: string;
                            project_id: string;
                            purge_after: string | null;
                        };
                        record_count: number;
                    };
                };
            };
        };
    };
    list_invitations: {
        parameters: {
            query?: {
                created_from?: string;
                created_to?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                role?: string;
                search?: string;
                sort?: "created_at" | "expires_at" | "email";
                status?: string;
            };
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        invitations: {
                            accepted_at: string | null;
                            created_at: string;
                            email: string;
                            expires_at: string;
                            id: string;
                            project_id: string;
                            project_name: string;
                            revoked_at: string | null;
                            role: "owner" | "member";
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    invite_member: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email: string;
                    role?: "owner" | "member";
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            201: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        invitation: {
                            accepted_at: string | null;
                            created_at: string;
                            email: string;
                            expires_at: string;
                            id: string;
                            project_id: string;
                            project_name: string;
                            revoked_at: string | null;
                            role: "owner" | "member";
                        };
                    };
                };
            };
        };
    };
    revoke_invitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invitation_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        accepted_at: string | null;
                        created_at: string;
                        email: string;
                        expires_at: string;
                        id: string;
                        project_id: string;
                        project_name: string;
                        revoked_at: string | null;
                        role: "owner" | "member";
                    };
                };
            };
        };
    };
    list_members: {
        parameters: {
            query?: {
                added_from?: string;
                added_to?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                role?: string;
                search?: string;
                sort?: "name" | "email" | "role" | "added_at";
            };
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        limit: number;
                        members: {
                            account_id: string;
                            added_at: string;
                            email: string;
                            name: string;
                            role: "owner" | "member";
                        }[];
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    remove_member: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                account_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        removed: true;
                    };
                };
            };
        };
    };
    restore_project: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        deleted_at: string | null;
                        id: string;
                        name: string;
                        narsil_url: string;
                        purge_after: string | null;
                        region: string;
                        role: ("owner" | "member") | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    finish_source_sign_in: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    code: string;
                    state: string;
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        credential_names: string[];
                        id: string;
                        kind: "push" | "vapi" | "retell" | "elevenlabs" | "zendesk" | "s3" | "slack" | "notion" | "confluence" | "zendesk_help_center" | "google_drive" | "agent" | "database";
                        knowledge_base_id: string | null;
                        last_error: {
                            at: string;
                            code: string;
                            message: string;
                        } | null;
                        last_synced_at: string | null;
                        memory_id: string | null;
                        name: string;
                        next_sync_at: string | null;
                        project_id: string;
                        settings: {
                            [key: string]: unknown;
                        };
                        sign_in: {
                            account: string | null;
                            status: "waiting" | "signed_in" | "expired";
                        } | null;
                        sorting: ("full" | "rules_only" | "as_given") | null;
                        status: "active" | "failing" | "deleting";
                        webhook_url: string | null;
                    };
                };
            };
        };
    };
}
