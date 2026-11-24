export interface paths {
    "/v1/auth/second-factor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["verify_second_factor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sign_in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/sign-up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sign_up"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_operations"];
        put?: never;
        post?: never;
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
        get: operations["get_project"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_databases"];
        put?: never;
        post: operations["create_database"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_database"];
        put?: never;
        post: operations["update_database"];
        delete: operations["delete_database"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/change-proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["propose_database_change"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/compact": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["compact_database"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/imports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["upload_table_import"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/imports/{import_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["discard_table_import"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/imports/{import_id}/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["apply_table_import"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/imports/{import_id}/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["check_table_import"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/migrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_database_migrations"];
        put?: never;
        post: operations["add_database_migration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_database"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/saved-queries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_saved_queries"];
        put?: never;
        post: operations["save_query"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/saved-queries/{saved_query_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["delete_saved_query"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/sql": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["run_database_sql"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_database_tables"];
        put?: never;
        post: operations["create_table"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/columns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["change_table_columns"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/columns/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["preview_table_column_changes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/rows": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["insert_table_row"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/rows/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["delete_table_rows"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/rows/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["export_table_rows"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/rows/get": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["get_table_row"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/rows/query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["list_table_rows"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/{table_name}/rows/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["update_table_row"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/databases/{database_id}/tables/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["preview_create_table"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/end-users/erase": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["erase_end_user"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_indexes"];
        put?: never;
        post: operations["create_index"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_index"];
        put?: never;
        post: operations["update_index"];
        delete: operations["delete_index"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["download_index"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["export_index_records"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["import_index_records"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_index_records"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/records/{record_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_index_record"];
        put?: never;
        post: operations["save_index_record"];
        delete: operations["delete_index_record"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_index"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/search-comparison": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["compare_index_search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/search-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["preview_index_search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_index_stats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/indexes/{index_id}/suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["suggest_index_terms"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_knowledge_bases"];
        put?: never;
        post: operations["create_knowledge_base"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_knowledge_base"];
        put?: never;
        post: operations["update_knowledge_base"];
        delete: operations["delete_knowledge_base"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/answer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["answer_question"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/answer-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["record_answer_events"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/answer-events/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["import_answer_log"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/correction-passes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_correction_passes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/correction-passes/{pass_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_correction_pass"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/corrections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_corrections"];
        put?: never;
        post: operations["create_correction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/corrections/{correction_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_correction"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/corrections/{correction_id}/discard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["discard_correction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/corrections/{correction_id}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["promote_correction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/corrections/propose": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["propose_corrections"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/corrections/try": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["try_corrections"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_files"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/files/{file_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_file"];
        put?: never;
        post?: never;
        delete: operations["delete_file"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/files/{file_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_file"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/files/{file_id}/versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_file_versions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/files/{file_id}/versions/{version}/blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_version_blocks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/files/{file_id}/versions/{version}/link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_download_link"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/flagged-questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_flagged_questions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/flagged-questions/{question_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_flagged_question"];
        put?: never;
        post: operations["settle_flagged_question"];
        delete: operations["dismiss_flagged_question"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/flagged-questions/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["review_flagged_questions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/folder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_folder"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/folders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["search_folders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/metadata-keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_metadata_keys"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/metadata-values": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_metadata_values"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/question-set": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_question_set"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_questions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_knowledge_base"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/saved-questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_saved_questions"];
        put?: never;
        post: operations["save_question"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/saved-questions/{saved_question_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_saved_question"];
        put?: never;
        post: operations["update_saved_question"];
        delete: operations["delete_saved_question"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/saved-questions/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["import_saved_questions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/scorecards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_scorecards"];
        put?: never;
        post: operations["score_question_set"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/scorecards/{scorecard_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_scorecard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/scorecards/{scorecard_id}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_scorecard_results"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["search_knowledge_base"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/sources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_sources"];
        put?: never;
        post: operations["create_source"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/sources/{source_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_source"];
        put?: never;
        post: operations["update_source"];
        delete: operations["delete_source"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/sources/{source_id}/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_source_items"];
        put?: never;
        post: operations["ingest_items"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/sources/{source_id}/sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["start_source_sign_in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/sources/{source_id}/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sync_source"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/sources/{source_id}/syncs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_source_syncs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/uploads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["create_upload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/uploads/{upload_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_upload"];
        put?: never;
        post?: never;
        delete: operations["cancel_upload"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/uploads/{upload_id}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["complete_upload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/knowledge-bases/{knowledge_base_id}/uploads/{upload_id}/parts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sign_upload_parts"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_memory"];
        put?: never;
        post: operations["enable_memory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["update_memory"];
        delete: operations["delete_memory"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/context": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["get_memory_context"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/decisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memory_decisions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["export_memories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/forgetting-suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_forgetting_suggestions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/learned-changes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_learned_changes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/learned-changes/{change_id}/undo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["undo_learned_change"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/memories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/memories/{stored_memory_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["inspect_memory"];
        put?: never;
        post?: never;
        delete: operations["forget_memory"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/memories/{stored_memory_id}/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["send_memory_feedback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/memories/{stored_memory_id}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["promote_memory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/memories/{stored_memory_id}/recover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["recover_memory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/memories/{stored_memory_id}/settle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["settle_memory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_messages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/owners": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memory_owners"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/recall": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["recall_memories"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restore_memory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memory_reviews"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/reviews/{review_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["settle_memory_review"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/saved-questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memory_saved_questions"];
        put?: never;
        post: operations["save_memory_question"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/saved-questions/{saved_question_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["delete_memory_saved_question"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/scores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_memory_scores"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sort": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sort_message"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memory_sources"];
        put?: never;
        post: operations["create_memory_source"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sources/{source_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_memory_source"];
        put?: never;
        post: operations["update_memory_source"];
        delete: operations["delete_memory_source"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sources/{source_id}/message": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_message"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sources/{source_id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["add_messages"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sources/{source_id}/sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["start_memory_source_sign_in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/sources/{source_id}/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["sync_memory_source"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/tuning": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["tune_memory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get_memory_webhook"];
        put?: never;
        post: operations["set_memory_webhook"];
        delete: operations["remove_memory_webhook"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/projects/{project_id}/memory/{memory_id}/webhook/deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["list_memory_webhook_deliveries"];
        put?: never;
        post?: never;
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
    verify_second_factor: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    challenge_token: string;
                    code: string;
                    method?: "totp" | "backup_code";
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
    sign_in: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email: string;
                    known_device_token?: string;
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
                        challenge_token: string;
                        known_device_token: string;
                        state: "second_factor_required";
                    } | {
                        known_device_token: string;
                        session_token: string;
                        state: "second_factor_setup_required";
                    };
                };
            };
        };
    };
    sign_up: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email: string;
                    name: string;
                    password: string;
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
                        email: string;
                        next_step: "sign_in";
                    };
                };
            };
        };
    };
    list_operations: {
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
                        operations: {
                            access: string;
                            id: string;
                            key_permissions: {
                                level: "read" | "write";
                                only_with_field: string | null;
                                resource_id_field: ("database_id" | "index_id" | "knowledge_base_id") | null;
                                resource_kind: "databases" | "indexes" | "knowledge_bases" | "memory";
                                target: "resource" | "every" | "any";
                            }[] | null;
                            method: "GET" | "POST" | "DELETE";
                            path: string;
                            summary: string;
                        }[];
                    };
                };
            };
        };
    };
    get_project: {
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
    list_databases: {
        parameters: {
            query?: {
                created_from?: string;
                created_to?: string;
                creator?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "created_at" | "name" | "purge_after";
                state?: "live" | "deleted";
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
                        databases: {
                            compaction: {
                                failure_code: ("interrupted" | "disk_full" | "failed") | null;
                                file_bytes_after: number | null;
                                file_bytes_before: number;
                                finished_at: string | null;
                                started_at: string;
                                state: "running" | "finished" | "failed";
                            } | null;
                            created_at: string;
                            created_by: {
                                id: string;
                                kind: "account" | "key";
                                name: string;
                            };
                            deleted_at: string | null;
                            id: string;
                            migration_version: number;
                            name: string;
                            project_id: string;
                            purge_after: string | null;
                            sirannon_url: string;
                            size: {
                                file_bytes: number;
                                limit_bytes: number;
                                measured_at: string;
                                state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                                used_bytes: number;
                            } | null;
                            sql_write_preview: boolean;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    create_database: {
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
                    migrations?: {
                        name: string;
                        sql: string;
                    }[];
                    name: string;
                    sql_write_preview?: boolean;
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
                        compaction: {
                            failure_code: ("interrupted" | "disk_full" | "failed") | null;
                            file_bytes_after: number | null;
                            file_bytes_before: number;
                            finished_at: string | null;
                            started_at: string;
                            state: "running" | "finished" | "failed";
                        } | null;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        migration_version: number;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        sirannon_url: string;
                        size: {
                            file_bytes: number;
                            limit_bytes: number;
                            measured_at: string;
                            state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                            used_bytes: number;
                        } | null;
                        sql_write_preview: boolean;
                    };
                };
            };
        };
    };
    get_database: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        compaction: {
                            failure_code: ("interrupted" | "disk_full" | "failed") | null;
                            file_bytes_after: number | null;
                            file_bytes_before: number;
                            finished_at: string | null;
                            started_at: string;
                            state: "running" | "finished" | "failed";
                        } | null;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        migration_version: number;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        sirannon_url: string;
                        size: {
                            file_bytes: number;
                            limit_bytes: number;
                            measured_at: string;
                            state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                            used_bytes: number;
                        } | null;
                        sql_write_preview: boolean;
                    };
                };
            };
        };
    };
    update_database: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    sql_write_preview?: boolean;
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
                        compaction: {
                            failure_code: ("interrupted" | "disk_full" | "failed") | null;
                            file_bytes_after: number | null;
                            file_bytes_before: number;
                            finished_at: string | null;
                            started_at: string;
                            state: "running" | "finished" | "failed";
                        } | null;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        migration_version: number;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        sirannon_url: string;
                        size: {
                            file_bytes: number;
                            limit_bytes: number;
                            measured_at: string;
                            state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                            used_bytes: number;
                        } | null;
                        sql_write_preview: boolean;
                    };
                };
            };
        };
    };
    delete_database: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        compaction: {
                            failure_code: ("interrupted" | "disk_full" | "failed") | null;
                            file_bytes_after: number | null;
                            file_bytes_before: number;
                            finished_at: string | null;
                            started_at: string;
                            state: "running" | "finished" | "failed";
                        } | null;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        migration_version: number;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        sirannon_url: string;
                        size: {
                            file_bytes: number;
                            limit_bytes: number;
                            measured_at: string;
                            state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                            used_bytes: number;
                        } | null;
                        sql_write_preview: boolean;
                    };
                };
            };
        };
    };
    propose_database_change: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    request: string;
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
                        proposal: {
                            base_migration_version: number;
                            destructive: boolean;
                            migration_name: string;
                            sql: string;
                            summary: string;
                            tables: {
                                change: "created" | "changed" | "dropped";
                                columns_after: string[];
                                columns_before: string[];
                                name: string;
                            }[];
                            warnings: string[];
                        };
                    };
                };
            };
        };
    };
    compact_database: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        compaction: {
                            failure_code: ("interrupted" | "disk_full" | "failed") | null;
                            file_bytes_after: number | null;
                            file_bytes_before: number;
                            finished_at: string | null;
                            started_at: string;
                            state: "running" | "finished" | "failed";
                        } | null;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        migration_version: number;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        sirannon_url: string;
                        size: {
                            file_bytes: number;
                            limit_bytes: number;
                            measured_at: string;
                            state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                            used_bytes: number;
                        } | null;
                        sql_write_preview: boolean;
                    };
                };
            };
        };
    };
    upload_table_import: {
        parameters: {
            query: {
                table_name: string;
            };
            header?: never;
            path: {
                database_id: string;
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
            201: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        table_import: {
                            columns: {
                                header: string;
                                inferred_type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                                name: string;
                                source_index: number;
                            }[];
                            expires_at: string;
                            file_bytes: number;
                            format: "csv" | "xlsx";
                            id: string;
                            preview_rows: (null | number | string)[][];
                            row_count: number;
                            table_name: string;
                        };
                    };
                };
            };
        };
    };
    discard_table_import: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                import_id: string;
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
                        discarded: true;
                    };
                };
            };
        };
    };
    apply_table_import: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                import_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    columns: {
                        column_name: string;
                        source_index: number | string;
                    }[];
                    expected_failed: number | string;
                    expected_migration_version: number | string;
                    new_table_columns?: {
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        name: string;
                        not_null?: boolean;
                        primary_key?: boolean;
                        references?: {
                            column: string;
                            on_delete?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            on_update?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            table: string;
                        } | null;
                        type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                        unique?: boolean;
                    }[] | null;
                    table_name: string;
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
                        imported: {
                            inserted: number;
                            migration: {
                                added_at: string;
                                name: string;
                                sql: string;
                                version: number;
                            } | null;
                            table_name: string;
                        };
                    };
                };
            };
        };
    };
    check_table_import: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                import_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    columns: {
                        column_name: string;
                        source_index: number | string;
                    }[];
                    new_table_columns?: {
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        name: string;
                        not_null?: boolean;
                        primary_key?: boolean;
                        references?: {
                            column: string;
                            on_delete?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            on_update?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            table: string;
                        } | null;
                        type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                        unique?: boolean;
                    }[] | null;
                    table_name: string;
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
                        check: {
                            base_migration_version: number;
                            failed_total: number;
                            failures: {
                                message: string;
                                row: number;
                            }[];
                            failures_capped: boolean;
                            import_id: string;
                            importable_rows: number;
                            staged_rows: number;
                            table_name: string;
                            table_sql: string | null;
                        };
                    };
                };
            };
        };
    };
    list_database_migrations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        migrations: {
                            added_at: string;
                            name: string;
                            sql: string;
                            version: number;
                        }[];
                    };
                };
            };
        };
    };
    add_database_migration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    expected_migration_version?: number | string;
                    name: string;
                    sql: string;
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
                        added_at: string;
                        name: string;
                        sql: string;
                        version: number;
                    };
                };
            };
        };
    };
    restore_database: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        compaction: {
                            failure_code: ("interrupted" | "disk_full" | "failed") | null;
                            file_bytes_after: number | null;
                            file_bytes_before: number;
                            finished_at: string | null;
                            started_at: string;
                            state: "running" | "finished" | "failed";
                        } | null;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        migration_version: number;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        sirannon_url: string;
                        size: {
                            file_bytes: number;
                            limit_bytes: number;
                            measured_at: string;
                            state: "room" | "over_80_percent" | "over_95_percent" | "at_limit";
                            used_bytes: number;
                        } | null;
                        sql_write_preview: boolean;
                    };
                };
            };
        };
    };
    list_saved_queries: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        saved_queries: {
                            created_at: string;
                            created_by: {
                                id: string;
                                name: string;
                            };
                            database_id: string;
                            id: string;
                            name: string;
                            sql: string;
                            updated_at: string;
                        }[];
                    };
                };
            };
        };
    };
    save_query: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    name: string;
                    saved_query_id?: string;
                    sql: string;
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
                        saved_query: {
                            created_at: string;
                            created_by: {
                                id: string;
                                name: string;
                            };
                            database_id: string;
                            id: string;
                            name: string;
                            sql: string;
                            updated_at: string;
                        };
                    };
                };
            };
        };
    };
    delete_saved_query: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                saved_query_id: string;
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
                        deleted: true;
                    };
                };
            };
        };
    };
    run_database_sql: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    confirmation_token?: string;
                    sql: string;
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
                        elapsed_ms: number;
                        outcome: "rows";
                        results: {
                            changes: number;
                            columns: {
                                declared_type: string | null;
                                name: string;
                            }[];
                            rows: (null | number | string | {
                                size: number;
                                text: string;
                                truncated: boolean;
                                type: "integer" | "real" | "text" | "blob";
                            })[][];
                            truncated: boolean;
                            writes: boolean;
                        }[];
                    } | {
                        changes: number;
                        confirmation_token: string;
                        expires_at: string;
                        outcome: "needs_confirmation";
                        statement_count: number;
                    } | {
                        changes: number;
                        outcome: "applied";
                        statement_count: number;
                    };
                };
            };
        };
    };
    list_database_tables: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
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
                        tables: {
                            columns: {
                                declared_type: string;
                                default_sql: string | null;
                                generated: boolean;
                                name: string;
                                not_null: boolean;
                                primary_key_position: number;
                            }[];
                            foreign_keys: {
                                columns: string[];
                                on_delete: string;
                                on_update: string;
                                references_columns: string[];
                                references_table: string;
                            }[];
                            indexes: {
                                columns: string[];
                                name: string;
                                unique: boolean;
                            }[];
                            kind: "table" | "view";
                            name: string;
                            row_key: string[] | null;
                            sql: string | null;
                        }[];
                    };
                };
            };
        };
    };
    create_table: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    columns: {
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        name: string;
                        not_null?: boolean;
                        primary_key?: boolean;
                        references?: {
                            column: string;
                            on_delete?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            on_update?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            table: string;
                        } | null;
                        type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                        unique?: boolean;
                    }[];
                    expected_migration_version: number | string;
                    table_name: string;
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
                        migration: {
                            added_at: string;
                            name: string;
                            sql: string;
                            version: number;
                        };
                        preview: {
                            base_migration_version: number;
                            migration_name: string;
                            sql: string;
                            table_name: string;
                        };
                    };
                };
            };
        };
    };
    change_table_columns: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    changes: ({
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        kind: "add";
                        name: string;
                        not_null?: boolean;
                        position?: {
                            column: string;
                            side: "before";
                        } | {
                            column: string;
                            side: "after";
                        };
                        type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                    } | {
                        column: string;
                        kind: "rename";
                        new_name: string;
                    } | {
                        column: string;
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        kind: "alter";
                        not_null?: boolean;
                        type?: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                    } | {
                        column: string;
                        kind: "drop";
                    })[];
                    expected_migration_version: number | string;
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
                        migration: {
                            added_at: string;
                            name: string;
                            sql: string;
                            version: number;
                        };
                        preview: {
                            base_migration_version: number;
                            blocked: boolean;
                            changed_columns: string[];
                            columns_after: string[];
                            columns_before: string[];
                            destructive: boolean;
                            migration_name: string;
                            rebuilds_table: boolean;
                            row_checks: {
                                blocks_change: boolean;
                                check: "holds_nulls" | "values_do_not_convert" | "values_change_form" | "values_removed" | "rows_need_value";
                                column: string;
                                rows: number;
                                rows_capped: boolean;
                            }[];
                            row_count: number;
                            row_count_capped: boolean;
                            sql: string;
                            table_name: string;
                            warnings: string[];
                        };
                    };
                };
            };
        };
    };
    preview_table_column_changes: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    changes: ({
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        kind: "add";
                        name: string;
                        not_null?: boolean;
                        position?: {
                            column: string;
                            side: "before";
                        } | {
                            column: string;
                            side: "after";
                        };
                        type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                    } | {
                        column: string;
                        kind: "rename";
                        new_name: string;
                    } | {
                        column: string;
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        kind: "alter";
                        not_null?: boolean;
                        type?: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                    } | {
                        column: string;
                        kind: "drop";
                    })[];
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
                        preview: {
                            base_migration_version: number;
                            blocked: boolean;
                            changed_columns: string[];
                            columns_after: string[];
                            columns_before: string[];
                            destructive: boolean;
                            migration_name: string;
                            rebuilds_table: boolean;
                            row_checks: {
                                blocks_change: boolean;
                                check: "holds_nulls" | "values_do_not_convert" | "values_change_form" | "values_removed" | "rows_need_value";
                                column: string;
                                rows: number;
                                rows_capped: boolean;
                            }[];
                            row_count: number;
                            row_count_capped: boolean;
                            sql: string;
                            table_name: string;
                            warnings: string[];
                        };
                    };
                };
            };
        };
    };
    insert_table_row: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    values: {
                        [key: string]: null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
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
                        returned_key: (null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        })[] | null;
                        row: {
                            cells: (null | number | string | {
                                size: number;
                                text: string;
                                truncated: boolean;
                                type: "integer" | "real" | "text" | "blob";
                            })[];
                            key: (null | number | string | {
                                text: string;
                                type: "integer";
                            } | {
                                hex: string;
                                type: "blob";
                            })[] | null;
                        } | null;
                    };
                };
            };
        };
    };
    delete_table_rows: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    keys: (null | number | string | {
                        text: string;
                        type: "integer";
                    } | {
                        hex: string;
                        type: "blob";
                    })[][];
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
                        deleted: number;
                    };
                };
            };
        };
    };
    export_table_rows: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    filters?: {
                        column: string;
                        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "not_like" | "in" | "is_null" | "is_not_null";
                        value?: (null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        }) | (null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        })[];
                    }[];
                    format: "csv" | "json" | "sql";
                    sorts?: {
                        column: string;
                        direction?: "asc" | "desc";
                    }[];
                };
            };
        };
        responses: {
            "4XX": components["responses"]["error"];
            "5XX": components["responses"]["error"];
            200: {
                headers: {
                    "content-disposition"?: string;
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                    "application/sql": string;
                    "text/csv": string;
                };
            };
        };
    };
    get_table_row: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    key: (null | number | string | {
                        text: string;
                        type: "integer";
                    } | {
                        hex: string;
                        type: "blob";
                    })[];
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
                        row: {
                            cells: (null | number | string | {
                                size: number;
                                text: string;
                                truncated: boolean;
                                type: "integer" | "real" | "text" | "blob";
                            })[];
                            key: (null | number | string | {
                                text: string;
                                type: "integer";
                            } | {
                                hex: string;
                                type: "blob";
                            })[] | null;
                        };
                    };
                };
            };
        };
    };
    list_table_rows: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    after?: (null | number | string | {
                        text: string;
                        type: "integer";
                    } | {
                        hex: string;
                        type: "blob";
                    })[];
                    before?: (null | number | string | {
                        text: string;
                        type: "integer";
                    } | {
                        hex: string;
                        type: "blob";
                    })[];
                    filters?: {
                        column: string;
                        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "not_like" | "in" | "is_null" | "is_not_null";
                        value?: (null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        }) | (null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        })[];
                    }[];
                    last_page?: boolean;
                    offset?: number | string;
                    page_size?: number | string;
                    sorts?: {
                        column: string;
                        direction?: "asc" | "desc";
                    }[];
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
                        has_next_page: boolean;
                        has_previous_page: boolean;
                        offset: number;
                        page_size: number;
                        row_count: number;
                        row_count_capped: boolean;
                        rows: {
                            cells: (null | number | string | {
                                size: number;
                                text: string;
                                truncated: boolean;
                                type: "integer" | "real" | "text" | "blob";
                            })[];
                            key: (null | number | string | {
                                text: string;
                                type: "integer";
                            } | {
                                hex: string;
                                type: "blob";
                            })[] | null;
                        }[];
                        table: {
                            columns: {
                                declared_type: string;
                                default_sql: string | null;
                                generated: boolean;
                                name: string;
                                not_null: boolean;
                                primary_key_position: number;
                            }[];
                            foreign_keys: {
                                columns: string[];
                                on_delete: string;
                                on_update: string;
                                references_columns: string[];
                                references_table: string;
                            }[];
                            indexes: {
                                columns: string[];
                                name: string;
                                unique: boolean;
                            }[];
                            kind: "table" | "view";
                            name: string;
                            row_key: string[] | null;
                            sql: string | null;
                        };
                    };
                };
            };
        };
    };
    update_table_row: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    expected: {
                        [key: string]: null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        };
                    };
                    key: (null | number | string | {
                        text: string;
                        type: "integer";
                    } | {
                        hex: string;
                        type: "blob";
                    })[];
                    values: {
                        [key: string]: null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
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
                        returned_key: (null | number | string | {
                            text: string;
                            type: "integer";
                        } | {
                            hex: string;
                            type: "blob";
                        })[] | null;
                        row: {
                            cells: (null | number | string | {
                                size: number;
                                text: string;
                                truncated: boolean;
                                type: "integer" | "real" | "text" | "blob";
                            })[];
                            key: (null | number | string | {
                                text: string;
                                type: "integer";
                            } | {
                                hex: string;
                                type: "blob";
                            })[] | null;
                        } | null;
                    };
                };
            };
        };
    };
    preview_create_table: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                database_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    columns: {
                        default?: ({
                            kind: "value";
                            value: number | string;
                        } | {
                            kind: "current_timestamp";
                        } | {
                            kind: "current_date";
                        } | {
                            kind: "current_time";
                        }) | null;
                        name: string;
                        not_null?: boolean;
                        primary_key?: boolean;
                        references?: {
                            column: string;
                            on_delete?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            on_update?: "no_action" | "restrict" | "cascade" | "set_null" | "set_default";
                            table: string;
                        } | null;
                        type: "text" | "integer" | "real" | "numeric" | "blob" | "boolean" | "date" | "datetime" | "time";
                        unique?: boolean;
                    }[];
                    table_name: string;
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
                        preview: {
                            base_migration_version: number;
                            migration_name: string;
                            sql: string;
                            table_name: string;
                        };
                    };
                };
            };
        };
    };
    erase_end_user: {
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
                    end_user_id: string;
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
                        end_user_id: string;
                        erased_memories: number;
                        erased_messages: number;
                        erased_questions: number;
                        knowledge_bases: number;
                    };
                };
            };
        };
    };
    list_indexes: {
        parameters: {
            query?: {
                created_from?: string;
                created_to?: string;
                creator?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "created_at" | "name" | "purge_after";
                state?: "live" | "deleted";
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
                        indexes: {
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
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    create_index: {
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
                    config: {
                        bm25?: {
                            b?: number;
                            k1?: number;
                        };
                        defaultScoring?: "local" | "dfs" | "broadcast";
                        embedding?: {
                            fields: {
                                [key: string]: string | string[];
                            };
                        };
                        language?: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                        required?: string[];
                        schema: {
                            [key: string]: (("string" | "string:sortable" | "number" | "boolean" | "enum" | "geopoint" | "string[]" | "number[]" | "boolean[]" | "enum[]") | ("verbatim" | "verbatim:sortable" | "verbatim[]" | "verbatim[]:sortable") | string) | {
                                [key: string]: (("string" | "string:sortable" | "number" | "boolean" | "enum" | "geopoint" | "string[]" | "number[]" | "boolean[]" | "enum[]") | ("verbatim" | "verbatim:sortable" | "verbatim[]" | "verbatim[]:sortable") | string) | {
                                    [key: string]: (("string" | "string:sortable" | "number" | "boolean" | "enum" | "geopoint" | "string[]" | "number[]" | "boolean[]" | "enum[]") | ("verbatim" | "verbatim:sortable" | "verbatim[]" | "verbatim[]:sortable") | string) | {
                                        [key: string]: ("string" | "string:sortable" | "number" | "boolean" | "enum" | "geopoint" | "string[]" | "number[]" | "boolean[]" | "enum[]") | ("verbatim" | "verbatim:sortable" | "verbatim[]" | "verbatim[]:sortable") | string;
                                    };
                                };
                            };
                        };
                        stopWords?: string[];
                        strict?: boolean;
                        synonyms?: ({
                            synonyms: string[];
                            word: string;
                        } | {
                            words: string[];
                        })[];
                        trackPositions?: boolean;
                    };
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
                };
            };
        };
    };
    get_index: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
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
                };
            };
        };
    };
    update_index: {
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
                "application/json": {
                    bm25?: {
                        b?: number;
                        k1?: number;
                    } | null;
                    language?: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                    search_defaults?: {
                        boosts?: string | {
                            [key: string]: unknown;
                        };
                        exact?: boolean;
                        fields?: string | string[];
                        fusion?: "rrf" | "linear";
                        fusion_constant?: number | string;
                        minimum_score?: number | string;
                        minimum_similarity?: number | string;
                        partial_words?: boolean;
                        prefix?: boolean;
                        prefix_length?: number | string;
                        term_match?: ("all" | "any") | (number | string);
                        tolerance?: number | string;
                        vector_candidates?: number | string;
                        vector_weight?: number | string;
                    } | null;
                    stop_words?: string[] | null;
                    synonyms?: ({
                        synonyms: string[];
                        word: string;
                    } | {
                        words: string[];
                    })[];
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
                };
            };
        };
    };
    delete_index: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
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
                };
            };
        };
    };
    download_index: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
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
                    "content-disposition"?: string;
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
        };
    };
    export_index_records: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
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
                    "content-disposition"?: string;
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/x-ndjson": string;
                };
            };
        };
    };
    import_index_records: {
        parameters: {
            query: {
                format: "json" | "ndjson" | "csv";
            };
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
            201: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        added: number;
                        failed_count: number;
                        failures: {
                            line: number | null;
                            position: number;
                            reason: string;
                            record_id: string | null;
                        }[];
                        failures_truncated: boolean;
                        received: number;
                        replaced: number;
                    };
                };
            };
        };
    };
    list_index_records: {
        parameters: {
            query?: {
                cursor?: string;
                filters?: string;
                limit?: string;
                search?: string;
                sort?: string;
            };
            header?: never;
            path: {
                index_id: string;
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
                        next_cursor: string | null;
                        records: {
                            id: string;
                            record: {
                                [key: string]: unknown;
                            };
                        }[];
                        total_count: number;
                        total_is_exact: boolean;
                    };
                };
            };
        };
    };
    get_index_record: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
                project_id: string;
                record_id: string;
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
                        id: string;
                        record: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
        };
    };
    save_index_record: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
                project_id: string;
                record_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    record: {
                        [key: string]: unknown;
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
                        created: boolean;
                        id: string;
                        record: {
                            [key: string]: unknown;
                        };
                    };
                };
            };
        };
    };
    delete_index_record: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
                project_id: string;
                record_id: string;
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
                        id: string;
                    };
                };
            };
        };
    };
    restore_index: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
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
                };
            };
        };
    };
    compare_index_search: {
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
                "application/json": {
                    bm25?: {
                        b?: number;
                        k1?: number;
                    };
                    boosts?: string | {
                        [key: string]: unknown;
                    };
                    exact?: boolean;
                    fields?: string | string[];
                    filters?: string;
                    fusion?: "rrf" | "linear";
                    fusion_constant?: number | string;
                    limit?: number | string;
                    minimum_score?: number | string;
                    minimum_similarity?: number | string;
                    mode?: "keyword" | "vector" | "hybrid";
                    partial_words?: boolean;
                    prefix?: boolean;
                    prefix_length?: number | string;
                    query: string;
                    term_match?: ("all" | "any") | (number | string);
                    tolerance?: number | string;
                    vector_candidates?: number | string;
                    vector_field?: string;
                    vector_weight?: number | string;
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
                        saved: {
                            bm25: {
                                b: number;
                                k1: number;
                            };
                            preview: {
                                duration_ms: number;
                                facets: {
                                    counted: "matches" | "result_window";
                                    error_bound: number;
                                    field: string;
                                    values: {
                                        count: number;
                                        from: number | null;
                                        to: number | null;
                                        value: string;
                                    }[];
                                }[];
                                fusion: ("rrf" | "linear") | null;
                                fusion_constant: number | null;
                                group_count: number | null;
                                groups: {
                                    count: number | null;
                                    values: {
                                        [key: string]: unknown;
                                    };
                                }[] | null;
                                mode: "keyword" | "vector" | "hybrid";
                                next_offset: number | null;
                                offset: number;
                                results: {
                                    group: number | null;
                                    highlights: {
                                        field: string;
                                        marks: {
                                            end: number;
                                            start: number;
                                        }[];
                                    }[];
                                    id: string;
                                    keyword: {
                                        field_scores: {
                                            field: string;
                                            score: number;
                                        }[] | null;
                                        rank: number | null;
                                        score: number | null;
                                        terms: {
                                            fields: {
                                                count: number;
                                                field: string;
                                                field_length: number;
                                            }[];
                                            term: string;
                                            weight: number;
                                        }[];
                                    };
                                    pinned: boolean;
                                    rank: number;
                                    record: {
                                        [key: string]: unknown;
                                    };
                                    score: number;
                                    vector: {
                                        rank: number | null;
                                        similarity: number | null;
                                    } | null;
                                }[];
                                sort: {
                                    direction: "asc" | "desc";
                                    field: string;
                                } | null;
                                total_count: number;
                                total_is_exact: boolean;
                                tuning: {
                                    boosts?: {
                                        [key: string]: number;
                                    };
                                    exact?: boolean;
                                    fields?: string[];
                                    fusion?: "rrf" | "linear";
                                    fusion_constant?: number;
                                    minimum_score?: number;
                                    minimum_similarity?: number;
                                    partial_words?: boolean;
                                    prefix?: boolean;
                                    prefix_length?: number;
                                    term_match?: ("all" | "any") | (number);
                                    tolerance?: number;
                                    vector_candidates?: number;
                                    vector_weight?: number;
                                };
                                vector_field: string | null;
                                vector_weight: number | null;
                            };
                        };
                        tuned: {
                            bm25: {
                                b: number;
                                k1: number;
                            };
                            preview: {
                                duration_ms: number;
                                facets: {
                                    counted: "matches" | "result_window";
                                    error_bound: number;
                                    field: string;
                                    values: {
                                        count: number;
                                        from: number | null;
                                        to: number | null;
                                        value: string;
                                    }[];
                                }[];
                                fusion: ("rrf" | "linear") | null;
                                fusion_constant: number | null;
                                group_count: number | null;
                                groups: {
                                    count: number | null;
                                    values: {
                                        [key: string]: unknown;
                                    };
                                }[] | null;
                                mode: "keyword" | "vector" | "hybrid";
                                next_offset: number | null;
                                offset: number;
                                results: {
                                    group: number | null;
                                    highlights: {
                                        field: string;
                                        marks: {
                                            end: number;
                                            start: number;
                                        }[];
                                    }[];
                                    id: string;
                                    keyword: {
                                        field_scores: {
                                            field: string;
                                            score: number;
                                        }[] | null;
                                        rank: number | null;
                                        score: number | null;
                                        terms: {
                                            fields: {
                                                count: number;
                                                field: string;
                                                field_length: number;
                                            }[];
                                            term: string;
                                            weight: number;
                                        }[];
                                    };
                                    pinned: boolean;
                                    rank: number;
                                    record: {
                                        [key: string]: unknown;
                                    };
                                    score: number;
                                    vector: {
                                        rank: number | null;
                                        similarity: number | null;
                                    } | null;
                                }[];
                                sort: {
                                    direction: "asc" | "desc";
                                    field: string;
                                } | null;
                                total_count: number;
                                total_is_exact: boolean;
                                tuning: {
                                    boosts?: {
                                        [key: string]: number;
                                    };
                                    exact?: boolean;
                                    fields?: string[];
                                    fusion?: "rrf" | "linear";
                                    fusion_constant?: number;
                                    minimum_score?: number;
                                    minimum_similarity?: number;
                                    partial_words?: boolean;
                                    prefix?: boolean;
                                    prefix_length?: number;
                                    term_match?: ("all" | "any") | (number);
                                    tolerance?: number;
                                    vector_candidates?: number;
                                    vector_weight?: number;
                                };
                                vector_field: string | null;
                                vector_weight: number | null;
                            };
                        };
                    };
                };
            };
        };
    };
    preview_index_search: {
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
                "application/json": {
                    boosts?: string | {
                        [key: string]: unknown;
                    };
                    direction?: "asc" | "desc";
                    exact?: boolean;
                    facet_filters?: string;
                    facet_limit?: number | string;
                    facet_ranges?: {
                        [key: string]: {
                            from: number;
                            to: number;
                        }[];
                    };
                    facets?: string | string[];
                    fields?: string | string[];
                    filters?: string;
                    fusion?: "rrf" | "linear";
                    fusion_constant?: number | string;
                    group_by?: string | string[];
                    group_size?: number | string;
                    limit?: number | string;
                    minimum_score?: number | string;
                    minimum_similarity?: number | string;
                    mode?: "keyword" | "vector" | "hybrid";
                    offset?: number | string;
                    partial_words?: boolean;
                    pinned?: {
                        rank: number | string;
                        record_id: string;
                    }[];
                    prefix?: boolean;
                    prefix_length?: number | string;
                    query: string;
                    sort?: string;
                    term_match?: ("all" | "any") | (number | string);
                    tolerance?: number | string;
                    vector_candidates?: number | string;
                    vector_field?: string;
                    vector_weight?: number | string;
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
                        duration_ms: number;
                        facets: {
                            counted: "matches" | "result_window";
                            error_bound: number;
                            field: string;
                            values: {
                                count: number;
                                from: number | null;
                                to: number | null;
                                value: string;
                            }[];
                        }[];
                        fusion: ("rrf" | "linear") | null;
                        fusion_constant: number | null;
                        group_count: number | null;
                        groups: {
                            count: number | null;
                            values: {
                                [key: string]: unknown;
                            };
                        }[] | null;
                        mode: "keyword" | "vector" | "hybrid";
                        next_offset: number | null;
                        offset: number;
                        results: {
                            group: number | null;
                            highlights: {
                                field: string;
                                marks: {
                                    end: number;
                                    start: number;
                                }[];
                            }[];
                            id: string;
                            keyword: {
                                field_scores: {
                                    field: string;
                                    score: number;
                                }[] | null;
                                rank: number | null;
                                score: number | null;
                                terms: {
                                    fields: {
                                        count: number;
                                        field: string;
                                        field_length: number;
                                    }[];
                                    term: string;
                                    weight: number;
                                }[];
                            };
                            pinned: boolean;
                            rank: number;
                            record: {
                                [key: string]: unknown;
                            };
                            score: number;
                            vector: {
                                rank: number | null;
                                similarity: number | null;
                            } | null;
                        }[];
                        sort: {
                            direction: "asc" | "desc";
                            field: string;
                        } | null;
                        total_count: number;
                        total_is_exact: boolean;
                        tuning: {
                            boosts?: {
                                [key: string]: number;
                            };
                            exact?: boolean;
                            fields?: string[];
                            fusion?: "rrf" | "linear";
                            fusion_constant?: number;
                            minimum_score?: number;
                            minimum_similarity?: number;
                            partial_words?: boolean;
                            prefix?: boolean;
                            prefix_length?: number;
                            term_match?: ("all" | "any") | (number);
                            tolerance?: number;
                            vector_candidates?: number;
                            vector_weight?: number;
                        };
                        vector_field: string | null;
                        vector_weight: number | null;
                    };
                };
            };
        };
    };
    get_index_stats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                index_id: string;
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
                        estimated_memory_bytes: number | null;
                        fields: {
                            path: string;
                            type: string;
                        }[];
                        language: string;
                        partition_count: number;
                        record_count: number;
                        stop_words: string[] | null;
                        vector_fields: {
                            dimensions: number;
                            embedding_model: string | null;
                            path: string;
                            source_fields: string[];
                        }[];
                    };
                };
            };
        };
    };
    suggest_index_terms: {
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
                "application/json": {
                    limit?: number | string;
                    prefix: string;
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
                        duration_ms: number;
                        terms: {
                            record_count: number;
                            term: string;
                        }[];
                    };
                };
            };
        };
    };
    list_knowledge_bases: {
        parameters: {
            query?: {
                created_from?: string;
                created_to?: string;
                creator?: string;
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "created_at" | "name" | "purge_after";
                state?: "live" | "deleted";
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
                        knowledge_bases: {
                            chunk_tokens: number;
                            created_at: string;
                            created_by: {
                                id: string;
                                kind: "account" | "key";
                                name: string;
                            };
                            database_id: string;
                            deleted_at: string | null;
                            id: string;
                            language: string;
                            live_index_id: string;
                            name: string;
                            project_id: string;
                            purge_after: string | null;
                            question_log_retention_days: number | null;
                            search_pending_since: string | null;
                            sirannon_url: string;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    create_knowledge_base: {
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
                    chunk_tokens?: number | string;
                    language?: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                    name: string;
                    question_log_retention_days?: (number | string) | null | "unlimited";
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
                        chunk_tokens: number;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        database_id: string;
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        live_index_id: string;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        question_log_retention_days: number | null;
                        search_pending_since: string | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    get_knowledge_base: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        chunk_tokens: number;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        database_id: string;
                        deleted_at: string | null;
                        file_progress: {
                            failed_count: number;
                            file_count: number;
                            last_read_at: string | null;
                            processing_count: number;
                            queued_count: number;
                            ready_count: number;
                        } | null;
                        id: string;
                        language: string;
                        live_index_id: string;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        question_log_retention_days: number | null;
                        search_pending_since: string | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    update_knowledge_base: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    agent_depth?: number | string;
                    automatic_corrections?: boolean;
                    judge_passages?: number | string;
                    judge_threshold?: number | string;
                    question_log_retention_days?: (number | string) | null | "unlimited";
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
                        chunk_tokens: number;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        database_id: string;
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        live_index_id: string;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        question_log_retention_days: number | null;
                        search_pending_since: string | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    delete_knowledge_base: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        chunk_tokens: number;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        database_id: string;
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        live_index_id: string;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        question_log_retention_days: number | null;
                        search_pending_since: string | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    answer_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    call_id?: string;
                    end_user_id?: string;
                    folder?: string;
                    limit?: number | string;
                    metadata?: {
                        [key: string]: string | string[];
                    };
                    question: string;
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
                        answer: {
                            passages_read: number;
                            statements: {
                                passages: number[];
                                text: string;
                            }[];
                            status: "answered" | "not_in_passages" | "no_passages" | "unavailable";
                        };
                        duration_ms: number;
                        passages: {
                            chunk_id: string;
                            citation: {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            };
                            file_id: string;
                            file_kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                            file_path: string;
                            heading: string | null;
                            match: {
                                citation: {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    kind: "document";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                    pages: number[];
                                } | {
                                    first_row: number;
                                    kind: "spreadsheet";
                                    last_row: number;
                                    sheet: string | null;
                                } | {
                                    kind: "slides";
                                    slides: number[];
                                } | {
                                    address: string | null;
                                    heading: string | null;
                                    kind: "web_page";
                                } | {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    file_name: string;
                                    kind: "image";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                } | {
                                    end_second: number;
                                    frame: number | null;
                                    kind: "recording";
                                    start_second: number;
                                };
                                range: {
                                    end: number;
                                    start: number;
                                };
                                terms: {
                                    end: number;
                                    start: number;
                                }[];
                            };
                            score: number;
                            text: string;
                            truncated: boolean;
                            version: number;
                        }[];
                        question_id: string;
                    };
                };
            };
        };
    };
    record_answer_events: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    events: {
                        answer?: string;
                        cited_chunk_ids?: string[];
                        follow_up?: string;
                        handoff_reason?: string;
                        occurred_at?: string;
                        question_id: string;
                        thumbs_down?: boolean;
                    }[];
                    origin?: "event" | "sdk";
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
                        recorded_count: number;
                        results: {
                            outcome: "recorded" | "sent_to_person" | "follow_up_not_judged" | "question_not_found";
                            question_id: string;
                        }[];
                    };
                };
            };
        };
    };
    import_answer_log: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        recorded_count: number;
                        refused: {
                            line: number;
                            question_id: string | null;
                            reason: string;
                        }[];
                    };
                };
            };
        };
    };
    list_correction_passes: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        offset: number;
                        passes: {
                            after_scorecard_id: string | null;
                            before_scorecard_id: string | null;
                            complete_index: boolean;
                            correction_ids: string[];
                            failure_message: string | null;
                            finished_at: string | null;
                            id: string;
                            mode: "propose" | "try";
                            requested_at: string;
                            started_at: string | null;
                            status: "queued" | "running" | "done" | "failed";
                            trigger: "requested" | "automatic";
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    get_correction_pass: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                pass_id: string;
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
                        after_scorecard_id: string | null;
                        before_scorecard_id: string | null;
                        complete_index: boolean;
                        correction_ids: string[];
                        failure_message: string | null;
                        finished_at: string | null;
                        id: string;
                        mode: "propose" | "try";
                        requested_at: string;
                        started_at: string | null;
                        status: "queued" | "running" | "done" | "failed";
                        trigger: "requested" | "automatic";
                    };
                };
            };
        };
    };
    list_corrections: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                kind?: string;
                limit?: string;
                offset?: string;
                pass_id?: string;
                status?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        corrections: {
                            after: {
                                held_back: {
                                    count: number;
                                    mean_reciprocal_rank: number | null;
                                    passed: number;
                                };
                                scorecard_id: string | null;
                                tuning: {
                                    count: number;
                                    mean_reciprocal_rank: number | null;
                                    passed: number;
                                };
                            } | null;
                            before: {
                                held_back: {
                                    count: number;
                                    mean_reciprocal_rank: number | null;
                                    passed: number;
                                };
                                scorecard_id: string | null;
                                tuning: {
                                    count: number;
                                    mean_reciprocal_rank: number | null;
                                    passed: number;
                                };
                            } | null;
                            cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                            created_at: string;
                            decided_at: string | null;
                            decided_by: ("himring" | "engineer") | null;
                            decision_note: string | null;
                            estimate: {
                                chunks_to_index: number;
                                memory_bytes: number;
                                price_usd: number | null;
                                questions_to_score: number;
                                second_index: boolean;
                                seconds: number;
                            };
                            failure_message: string | null;
                            file_kinds: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video")[];
                            id: string;
                            kind: "field_boost" | "fusion" | "bm25" | "stop_words" | "synonyms" | "language" | "chunking" | "rebuild" | "agent_depth";
                            origin: "himring" | "engineer";
                            pass_id: string | null;
                            question_changes: {
                                moved_down: number;
                                moved_up: number;
                                now_fail: number;
                                now_pass: number;
                            } | null;
                            setting: {
                                heading: number;
                                kind: "field_boost";
                                text: number;
                            } | ({
                                kind: "fusion";
                                rank_constant: number;
                                strategy: "rrf";
                            } | {
                                kind: "fusion";
                                strategy: "linear";
                                vector_weight: number;
                            }) | {
                                b: number;
                                k1: number;
                                kind: "bm25";
                            } | {
                                added: string[];
                                kind: "stop_words";
                                removed: string[];
                            } | {
                                kind: "synonyms";
                                rules: ({
                                    synonyms: string[];
                                    word: string;
                                } | {
                                    words: string[];
                                })[];
                            } | {
                                kind: "language";
                                language: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                            } | {
                                chunk_tokens: number;
                                kind: "chunking";
                            } | {
                                kind: "rebuild";
                            } | {
                                depth: number;
                                kind: "agent_depth";
                            };
                            status: "proposed" | "trying" | "tried" | "promoting" | "promoted" | "discarded" | "failed";
                            target_ids: string[];
                            tried_at: string | null;
                            verdict: "untried" | "trying" | "promoted" | "waits_for_person" | "waits_for_held_back" | "lowers_held_back" | "no_gain" | "discarded" | "failed";
                            wait_reason: string | null;
                            waits_for_click: boolean;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    create_correction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    setting: {
                        heading: number;
                        kind: "field_boost";
                        text: number;
                    } | ({
                        kind: "fusion";
                        rank_constant: number;
                        strategy: "rrf";
                    } | {
                        kind: "fusion";
                        strategy: "linear";
                        vector_weight: number;
                    }) | {
                        b: number;
                        k1: number;
                        kind: "bm25";
                    } | {
                        added: string[];
                        kind: "stop_words";
                        removed: string[];
                    } | {
                        kind: "synonyms";
                        rules: ({
                            synonyms: string[];
                            word: string;
                        } | {
                            words: string[];
                        })[];
                    } | {
                        kind: "language";
                        language: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                    } | {
                        chunk_tokens: number;
                        kind: "chunking";
                    } | {
                        kind: "rebuild";
                    } | {
                        depth: number | string;
                        kind: "agent_depth";
                    };
                    target_ids?: string[];
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
                        after: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        before: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                        created_at: string;
                        decided_at: string | null;
                        decided_by: ("himring" | "engineer") | null;
                        decision_note: string | null;
                        estimate: {
                            chunks_to_index: number;
                            memory_bytes: number;
                            price_usd: number | null;
                            questions_to_score: number;
                            second_index: boolean;
                            seconds: number;
                        };
                        failure_message: string | null;
                        file_kinds: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video")[];
                        id: string;
                        kind: "field_boost" | "fusion" | "bm25" | "stop_words" | "synonyms" | "language" | "chunking" | "rebuild" | "agent_depth";
                        origin: "himring" | "engineer";
                        pass_id: string | null;
                        question_changes: {
                            moved_down: number;
                            moved_up: number;
                            now_fail: number;
                            now_pass: number;
                        } | null;
                        setting: {
                            heading: number;
                            kind: "field_boost";
                            text: number;
                        } | ({
                            kind: "fusion";
                            rank_constant: number;
                            strategy: "rrf";
                        } | {
                            kind: "fusion";
                            strategy: "linear";
                            vector_weight: number;
                        }) | {
                            b: number;
                            k1: number;
                            kind: "bm25";
                        } | {
                            added: string[];
                            kind: "stop_words";
                            removed: string[];
                        } | {
                            kind: "synonyms";
                            rules: ({
                                synonyms: string[];
                                word: string;
                            } | {
                                words: string[];
                            })[];
                        } | {
                            kind: "language";
                            language: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                        } | {
                            chunk_tokens: number;
                            kind: "chunking";
                        } | {
                            kind: "rebuild";
                        } | {
                            depth: number;
                            kind: "agent_depth";
                        };
                        status: "proposed" | "trying" | "tried" | "promoting" | "promoted" | "discarded" | "failed";
                        target_ids: string[];
                        tried_at: string | null;
                        verdict: "untried" | "trying" | "promoted" | "waits_for_person" | "waits_for_held_back" | "lowers_held_back" | "no_gain" | "discarded" | "failed";
                        wait_reason: string | null;
                        waits_for_click: boolean;
                    };
                };
            };
        };
    };
    get_correction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                correction_id: string;
                knowledge_base_id: string;
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
                        after: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        before: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                        created_at: string;
                        decided_at: string | null;
                        decided_by: ("himring" | "engineer") | null;
                        decision_note: string | null;
                        estimate: {
                            chunks_to_index: number;
                            memory_bytes: number;
                            price_usd: number | null;
                            questions_to_score: number;
                            second_index: boolean;
                            seconds: number;
                        };
                        failure_message: string | null;
                        file_kinds: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video")[];
                        id: string;
                        kind: "field_boost" | "fusion" | "bm25" | "stop_words" | "synonyms" | "language" | "chunking" | "rebuild" | "agent_depth";
                        origin: "himring" | "engineer";
                        pass_id: string | null;
                        question_changes: {
                            moved_down: number;
                            moved_up: number;
                            now_fail: number;
                            now_pass: number;
                        } | null;
                        setting: {
                            heading: number;
                            kind: "field_boost";
                            text: number;
                        } | ({
                            kind: "fusion";
                            rank_constant: number;
                            strategy: "rrf";
                        } | {
                            kind: "fusion";
                            strategy: "linear";
                            vector_weight: number;
                        }) | {
                            b: number;
                            k1: number;
                            kind: "bm25";
                        } | {
                            added: string[];
                            kind: "stop_words";
                            removed: string[];
                        } | {
                            kind: "synonyms";
                            rules: ({
                                synonyms: string[];
                                word: string;
                            } | {
                                words: string[];
                            })[];
                        } | {
                            kind: "language";
                            language: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                        } | {
                            chunk_tokens: number;
                            kind: "chunking";
                        } | {
                            kind: "rebuild";
                        } | {
                            depth: number;
                            kind: "agent_depth";
                        };
                        status: "proposed" | "trying" | "tried" | "promoting" | "promoted" | "discarded" | "failed";
                        target_ids: string[];
                        tried_at: string | null;
                        verdict: "untried" | "trying" | "promoted" | "waits_for_person" | "waits_for_held_back" | "lowers_held_back" | "no_gain" | "discarded" | "failed";
                        wait_reason: string | null;
                        waits_for_click: boolean;
                    };
                };
            };
        };
    };
    discard_correction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                correction_id: string;
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    note?: string;
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
                        after: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        before: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                        created_at: string;
                        decided_at: string | null;
                        decided_by: ("himring" | "engineer") | null;
                        decision_note: string | null;
                        estimate: {
                            chunks_to_index: number;
                            memory_bytes: number;
                            price_usd: number | null;
                            questions_to_score: number;
                            second_index: boolean;
                            seconds: number;
                        };
                        failure_message: string | null;
                        file_kinds: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video")[];
                        id: string;
                        kind: "field_boost" | "fusion" | "bm25" | "stop_words" | "synonyms" | "language" | "chunking" | "rebuild" | "agent_depth";
                        origin: "himring" | "engineer";
                        pass_id: string | null;
                        question_changes: {
                            moved_down: number;
                            moved_up: number;
                            now_fail: number;
                            now_pass: number;
                        } | null;
                        setting: {
                            heading: number;
                            kind: "field_boost";
                            text: number;
                        } | ({
                            kind: "fusion";
                            rank_constant: number;
                            strategy: "rrf";
                        } | {
                            kind: "fusion";
                            strategy: "linear";
                            vector_weight: number;
                        }) | {
                            b: number;
                            k1: number;
                            kind: "bm25";
                        } | {
                            added: string[];
                            kind: "stop_words";
                            removed: string[];
                        } | {
                            kind: "synonyms";
                            rules: ({
                                synonyms: string[];
                                word: string;
                            } | {
                                words: string[];
                            })[];
                        } | {
                            kind: "language";
                            language: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                        } | {
                            chunk_tokens: number;
                            kind: "chunking";
                        } | {
                            kind: "rebuild";
                        } | {
                            depth: number;
                            kind: "agent_depth";
                        };
                        status: "proposed" | "trying" | "tried" | "promoting" | "promoted" | "discarded" | "failed";
                        target_ids: string[];
                        tried_at: string | null;
                        verdict: "untried" | "trying" | "promoted" | "waits_for_person" | "waits_for_held_back" | "lowers_held_back" | "no_gain" | "discarded" | "failed";
                        wait_reason: string | null;
                        waits_for_click: boolean;
                    };
                };
            };
        };
    };
    promote_correction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                correction_id: string;
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    note?: string;
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
                        after: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        before: {
                            held_back: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                            scorecard_id: string | null;
                            tuning: {
                                count: number;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                            };
                        } | null;
                        cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                        created_at: string;
                        decided_at: string | null;
                        decided_by: ("himring" | "engineer") | null;
                        decision_note: string | null;
                        estimate: {
                            chunks_to_index: number;
                            memory_bytes: number;
                            price_usd: number | null;
                            questions_to_score: number;
                            second_index: boolean;
                            seconds: number;
                        };
                        failure_message: string | null;
                        file_kinds: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video")[];
                        id: string;
                        kind: "field_boost" | "fusion" | "bm25" | "stop_words" | "synonyms" | "language" | "chunking" | "rebuild" | "agent_depth";
                        origin: "himring" | "engineer";
                        pass_id: string | null;
                        question_changes: {
                            moved_down: number;
                            moved_up: number;
                            now_fail: number;
                            now_pass: number;
                        } | null;
                        setting: {
                            heading: number;
                            kind: "field_boost";
                            text: number;
                        } | ({
                            kind: "fusion";
                            rank_constant: number;
                            strategy: "rrf";
                        } | {
                            kind: "fusion";
                            strategy: "linear";
                            vector_weight: number;
                        }) | {
                            b: number;
                            k1: number;
                            kind: "bm25";
                        } | {
                            added: string[];
                            kind: "stop_words";
                            removed: string[];
                        } | {
                            kind: "synonyms";
                            rules: ({
                                synonyms: string[];
                                word: string;
                            } | {
                                words: string[];
                            })[];
                        } | {
                            kind: "language";
                            language: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                        } | {
                            chunk_tokens: number;
                            kind: "chunking";
                        } | {
                            kind: "rebuild";
                        } | {
                            depth: number;
                            kind: "agent_depth";
                        };
                        status: "proposed" | "trying" | "tried" | "promoting" | "promoted" | "discarded" | "failed";
                        target_ids: string[];
                        tried_at: string | null;
                        verdict: "untried" | "trying" | "promoted" | "waits_for_person" | "waits_for_held_back" | "lowers_held_back" | "no_gain" | "discarded" | "failed";
                        wait_reason: string | null;
                        waits_for_click: boolean;
                    };
                };
            };
        };
    };
    propose_corrections: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
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
                        after_scorecard_id: string | null;
                        before_scorecard_id: string | null;
                        complete_index: boolean;
                        correction_ids: string[];
                        failure_message: string | null;
                        finished_at: string | null;
                        id: string;
                        mode: "propose" | "try";
                        requested_at: string;
                        started_at: string | null;
                        status: "queued" | "running" | "done" | "failed";
                        trigger: "requested" | "automatic";
                    };
                };
            };
        };
    };
    try_corrections: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    complete_index?: boolean;
                    correction_ids: string[];
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
                        after_scorecard_id: string | null;
                        before_scorecard_id: string | null;
                        complete_index: boolean;
                        correction_ids: string[];
                        failure_message: string | null;
                        finished_at: string | null;
                        id: string;
                        mode: "propose" | "try";
                        requested_at: string;
                        started_at: string | null;
                        status: "queued" | "running" | "done" | "failed";
                        trigger: "requested" | "automatic";
                    };
                };
            };
        };
    };
    list_files: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                kind?: string;
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "updated_at" | "path" | "created_at" | "size_bytes" | "purge_after";
                state?: "live" | "deleted";
                status?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        files: {
                            address: string | null;
                            content_sha256: string;
                            created_at: string;
                            current_version: number | null;
                            deleted_at: string | null;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            id: string;
                            kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                            knowledge_base_id: string;
                            latest_version: number;
                            metadata: {
                                [key: string]: string;
                            };
                            path: string;
                            purge_after: string | null;
                            size_bytes: number;
                            status: "queued" | "processing" | "ready" | "failed";
                            unread_parts: {
                                end_second: number | null;
                                failure: {
                                    code: string;
                                    message: string;
                                };
                                first_page: number | null;
                                last_page: number | null;
                                start_second: number | null;
                            }[];
                            updated_at: string;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    get_file: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
                knowledge_base_id: string;
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
                        address: string | null;
                        content_sha256: string;
                        created_at: string;
                        current_version: number | null;
                        deleted_at: string | null;
                        failure: {
                            code: string;
                            message: string;
                        } | null;
                        id: string;
                        kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                        knowledge_base_id: string;
                        latest_version: number;
                        metadata: {
                            [key: string]: string;
                        };
                        path: string;
                        purge_after: string | null;
                        size_bytes: number;
                        status: "queued" | "processing" | "ready" | "failed";
                        unread_parts: {
                            end_second: number | null;
                            failure: {
                                code: string;
                                message: string;
                            };
                            first_page: number | null;
                            last_page: number | null;
                            start_second: number | null;
                        }[];
                        updated_at: string;
                        version_count: number;
                        versions: {
                            block_count: number;
                            chunk_count: number;
                            content_sha256: string;
                            conversion_seconds: number | null;
                            duration_seconds: number | null;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            ocr_page_count: number | null;
                            page_count: number | null;
                            processed_at: string | null;
                            received_at: string;
                            size_bytes: number;
                            status: "queued" | "processing" | "ready" | "failed" | "superseded";
                            unread_parts: {
                                end_second: number | null;
                                failure: {
                                    code: string;
                                    message: string;
                                };
                                first_page: number | null;
                                last_page: number | null;
                                start_second: number | null;
                            }[];
                            version: number;
                        }[];
                    };
                };
            };
        };
    };
    delete_file: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
                knowledge_base_id: string;
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
                        address: string | null;
                        content_sha256: string;
                        created_at: string;
                        current_version: number | null;
                        deleted_at: string | null;
                        failure: {
                            code: string;
                            message: string;
                        } | null;
                        id: string;
                        kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                        knowledge_base_id: string;
                        latest_version: number;
                        metadata: {
                            [key: string]: string;
                        };
                        path: string;
                        purge_after: string | null;
                        size_bytes: number;
                        status: "queued" | "processing" | "ready" | "failed";
                        unread_parts: {
                            end_second: number | null;
                            failure: {
                                code: string;
                                message: string;
                            };
                            first_page: number | null;
                            last_page: number | null;
                            start_second: number | null;
                        }[];
                        updated_at: string;
                    };
                };
            };
        };
    };
    restore_file: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
                knowledge_base_id: string;
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
                        address: string | null;
                        content_sha256: string;
                        created_at: string;
                        current_version: number | null;
                        deleted_at: string | null;
                        failure: {
                            code: string;
                            message: string;
                        } | null;
                        id: string;
                        kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                        knowledge_base_id: string;
                        latest_version: number;
                        metadata: {
                            [key: string]: string;
                        };
                        path: string;
                        purge_after: string | null;
                        size_bytes: number;
                        status: "queued" | "processing" | "ready" | "failed";
                        unread_parts: {
                            end_second: number | null;
                            failure: {
                                code: string;
                                message: string;
                            };
                            first_page: number | null;
                            last_page: number | null;
                            start_second: number | null;
                        }[];
                        updated_at: string;
                    };
                };
            };
        };
    };
    list_file_versions: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                file_id: string;
                knowledge_base_id: string;
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
                        offset: number;
                        total_count: number;
                        versions: {
                            block_count: number;
                            chunk_count: number;
                            content_sha256: string;
                            conversion_seconds: number | null;
                            duration_seconds: number | null;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            ocr_page_count: number | null;
                            page_count: number | null;
                            processed_at: string | null;
                            received_at: string;
                            size_bytes: number;
                            status: "queued" | "processing" | "ready" | "failed" | "superseded";
                            unread_parts: {
                                end_second: number | null;
                                failure: {
                                    code: string;
                                    message: string;
                                };
                                first_page: number | null;
                                last_page: number | null;
                                start_second: number | null;
                            }[];
                            version: number;
                        }[];
                    };
                };
            };
        };
    };
    list_version_blocks: {
        parameters: {
            query?: {
                from_row?: string;
                limit?: string;
                offset?: string;
                sheet?: string;
            };
            header?: never;
            path: {
                file_id: string;
                knowledge_base_id: string;
                project_id: string;
                version: string;
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
                        blocks: {
                            heading_level: number | null;
                            kind: "title" | "heading" | "paragraph" | "list_item" | "table_row" | "caption" | "code" | "formula" | "image_text" | "segment";
                            place: {
                                end_second: number | null;
                                page: number | null;
                                row: number | null;
                                sheet: string | null;
                                slide: number | null;
                                start_second: number | null;
                            };
                            position: number;
                            text: string;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    get_download_link: {
        parameters: {
            query?: {
                disposition?: "inline" | "attachment";
                rendition?: "pdf";
            };
            header?: never;
            path: {
                file_id: string;
                knowledge_base_id: string;
                project_id: string;
                version: string;
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
                        content_type: string;
                        disposition: "inline" | "attachment";
                        entity_tag: string;
                        expires_at: string;
                        file_name: string;
                        size_bytes: number;
                        url: string;
                    };
                };
            };
        };
    };
    list_flagged_questions: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                status?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        flagged_questions: {
                            chosen_rank: number | null;
                            end_user_id: string | null;
                            flagged_at: string;
                            judged_at: string | null;
                            probability: number | null;
                            question: string;
                            question_id: string;
                            saved_question_id: string | null;
                            settled_by: ("judge" | "person") | null;
                            signals: ("handoff" | "thumbs_down" | "verdict" | "unsupported_answer" | "repeated_question" | "near_saved_question" | "passage_changed" | "follow_ups_past_limit")[];
                            status: "waiting" | "saved" | "unsure" | "unanswerable";
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    get_flagged_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                question_id: string;
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
                        answer: {
                            answer: string | null;
                            answered_at: string;
                            answered_by: "event" | "log" | "sdk" | "transcript";
                            cited_chunk_ids: string[];
                            follow_up: string | null;
                        } | null;
                        answer_read: boolean;
                        candidates: {
                            chunk_id: string;
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            first_position: number;
                            heading: string | null;
                            last_position: number;
                            latest_version: number | null;
                            probability: number;
                            rank: number;
                            version: number;
                        }[];
                        chosen_rank: number | null;
                        end_user_id: string | null;
                        flagged_at: string;
                        judged_at: string | null;
                        none_probability: number | null;
                        probability: number | null;
                        question: string;
                        question_id: string;
                        returned_passages: {
                            chunk_id: string;
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            heading: string | null;
                            rank: number;
                            version: number;
                        }[];
                        saved_question_id: string | null;
                        settled_by: ("judge" | "person") | null;
                        signal_details: {
                            detail: {
                                [key: string]: unknown;
                            };
                            kind: "handoff" | "thumbs_down" | "verdict" | "unsupported_answer" | "repeated_question" | "near_saved_question" | "passage_changed" | "follow_ups_past_limit";
                            received_at: string;
                        }[];
                        signals: ("handoff" | "thumbs_down" | "verdict" | "unsupported_answer" | "repeated_question" | "near_saved_question" | "passage_changed" | "follow_ups_past_limit")[];
                        status: "waiting" | "saved" | "unsure" | "unanswerable";
                    };
                };
            };
        };
    };
    settle_flagged_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                question_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    chunk_id?: string;
                    file_id?: string;
                    first_position?: number | string;
                    last_position?: number | string;
                    version?: number | string;
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
                        answer: {
                            answer: string | null;
                            answered_at: string;
                            answered_by: "event" | "log" | "sdk" | "transcript";
                            cited_chunk_ids: string[];
                            follow_up: string | null;
                        } | null;
                        answer_read: boolean;
                        candidates: {
                            chunk_id: string;
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            first_position: number;
                            heading: string | null;
                            last_position: number;
                            latest_version: number | null;
                            probability: number;
                            rank: number;
                            version: number;
                        }[];
                        chosen_rank: number | null;
                        end_user_id: string | null;
                        flagged_at: string;
                        judged_at: string | null;
                        none_probability: number | null;
                        probability: number | null;
                        question: string;
                        question_id: string;
                        returned_passages: {
                            chunk_id: string;
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            heading: string | null;
                            rank: number;
                            version: number;
                        }[];
                        saved_question_id: string | null;
                        settled_by: ("judge" | "person") | null;
                        signal_details: {
                            detail: {
                                [key: string]: unknown;
                            };
                            kind: "handoff" | "thumbs_down" | "verdict" | "unsupported_answer" | "repeated_question" | "near_saved_question" | "passage_changed" | "follow_ups_past_limit";
                            received_at: string;
                        }[];
                        signals: ("handoff" | "thumbs_down" | "verdict" | "unsupported_answer" | "repeated_question" | "near_saved_question" | "passage_changed" | "follow_ups_past_limit")[];
                        status: "waiting" | "saved" | "unsure" | "unanswerable";
                    };
                };
            };
        };
    };
    dismiss_flagged_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                question_id: string;
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
                        chosen_rank: number | null;
                        end_user_id: string | null;
                        flagged_at: string;
                        judged_at: string | null;
                        probability: number | null;
                        question: string;
                        question_id: string;
                        saved_question_id: string | null;
                        settled_by: ("judge" | "person") | null;
                        signals: ("handoff" | "thumbs_down" | "verdict" | "unsupported_answer" | "repeated_question" | "near_saved_question" | "passage_changed" | "follow_ups_past_limit")[];
                        status: "waiting" | "saved" | "unsure" | "unanswerable";
                    };
                };
            };
        };
    };
    review_flagged_questions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        started: boolean;
                    };
                };
            };
        };
    };
    list_folder: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                folder?: string;
                limit?: string;
                offset?: string;
                sort?: "name" | "updated_at" | "size_bytes";
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        entries: ({
                            failed_count: number;
                            file_count: number;
                            name: string;
                            path: string;
                            processing_count: number;
                            queued_count: number;
                            ready_count: number;
                            size_bytes: number;
                            type: "folder";
                            updated_at: string;
                        } | {
                            file: {
                                address: string | null;
                                content_sha256: string;
                                created_at: string;
                                current_version: number | null;
                                deleted_at: string | null;
                                failure: {
                                    code: string;
                                    message: string;
                                } | null;
                                id: string;
                                kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                                knowledge_base_id: string;
                                latest_version: number;
                                metadata: {
                                    [key: string]: string;
                                };
                                path: string;
                                purge_after: string | null;
                                size_bytes: number;
                                status: "queued" | "processing" | "ready" | "failed";
                                unread_parts: {
                                    end_second: number | null;
                                    failure: {
                                        code: string;
                                        message: string;
                                    };
                                    first_page: number | null;
                                    last_page: number | null;
                                    start_second: number | null;
                                }[];
                                updated_at: string;
                            };
                            file_count: 1;
                            name: string;
                            path: string;
                            size_bytes: number;
                            type: "file";
                            updated_at: string;
                        })[];
                        folder: string;
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    search_folders: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
                search?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        folders: {
                            file_count: number;
                            path: string;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    list_metadata_keys: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
                search?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        keys: {
                            file_count: number;
                            key: string;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    list_metadata_values: {
        parameters: {
            query: {
                key: string;
                limit?: string;
                offset?: string;
                search?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        key: string;
                        limit: number;
                        offset: number;
                        total_count: number;
                        values: {
                            file_count: number;
                            value: string;
                        }[];
                    };
                };
            };
        };
    };
    get_question_set: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        agent_depth: number;
                        automatic_corrections: boolean;
                        broken: number;
                        flagged: {
                            saved: number;
                            unanswerable: number;
                            unsure: number;
                            waiting: number;
                        };
                        held_back: number;
                        held_back_percent: number;
                        judge_passages: number;
                        judge_threshold: number;
                        latest_pass: {
                            after_scorecard_id: string | null;
                            before_scorecard_id: string | null;
                            complete_index: boolean;
                            correction_ids: string[];
                            failure_message: string | null;
                            finished_at: string | null;
                            id: string;
                            mode: "propose" | "try";
                            requested_at: string;
                            started_at: string | null;
                            status: "queued" | "running" | "done" | "failed";
                            trigger: "requested" | "automatic";
                        } | null;
                        latest_scorecard: {
                            configuration: {
                                live_index_id: string;
                                settings: {
                                    bm25: {
                                        b: number;
                                        k1: number;
                                    };
                                    boost: {
                                        heading: number;
                                        text: number;
                                    };
                                    chunk_tokens: number;
                                    fusion: {
                                        rank_constant: number;
                                        strategy: "rrf";
                                    } | {
                                        strategy: "linear";
                                        vector_weight: number;
                                    };
                                    language: string;
                                    stop_words: {
                                        added: string[];
                                        removed: string[];
                                    };
                                    synonyms: ({
                                        synonyms: string[];
                                        word: string;
                                    } | {
                                        words: string[];
                                    })[];
                                };
                            } | null;
                            depth: number;
                            failure_message: string | null;
                            finished_at: string | null;
                            first_count: number | null;
                            held_back: {
                                count: number;
                                first: number | null;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                                score: number | null;
                            } | null;
                            id: string;
                            mean_reciprocal_rank: number | null;
                            pass_id: string | null;
                            passed_count: number | null;
                            purpose: "requested" | "before" | "after";
                            question_count: number | null;
                            requested_at: string;
                            score: number | null;
                            started_at: string | null;
                            status: "queued" | "running" | "done" | "failed";
                            tuning: {
                                count: number;
                                first: number | null;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                                score: number | null;
                            } | null;
                            waiting_for_search: boolean;
                        } | null;
                        open_pass: {
                            after_scorecard_id: string | null;
                            before_scorecard_id: string | null;
                            complete_index: boolean;
                            correction_ids: string[];
                            failure_message: string | null;
                            finished_at: string | null;
                            id: string;
                            mode: "propose" | "try";
                            requested_at: string;
                            started_at: string | null;
                            status: "queued" | "running" | "done" | "failed";
                            trigger: "requested" | "automatic";
                        } | null;
                        saved_questions: number;
                        settings: {
                            bm25: {
                                b: number;
                                k1: number;
                            };
                            boost: {
                                heading: number;
                                text: number;
                            };
                            chunk_tokens: number;
                            fusion: {
                                rank_constant: number;
                                strategy: "rrf";
                            } | {
                                strategy: "linear";
                                vector_weight: number;
                            };
                            language: string;
                            stop_words: {
                                added: string[];
                                removed: string[];
                            };
                            synonyms: ({
                                synonyms: string[];
                                word: string;
                            } | {
                                words: string[];
                            })[];
                        };
                        split_seed: string | null;
                        tuning: number;
                        unconfirmed: number;
                    };
                };
            };
        };
    };
    list_questions: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                end_user_id?: string;
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "asked_at";
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        offset: number;
                        questions: {
                            asked_at: string;
                            duration_ms: number;
                            end_user_id: string | null;
                            id: string;
                            live_index_id: string;
                            passages: {
                                chunk_id: string;
                                citation: ({
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    kind: "document";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                    pages: number[];
                                } | {
                                    first_row: number;
                                    kind: "spreadsheet";
                                    last_row: number;
                                    sheet: string | null;
                                } | {
                                    kind: "slides";
                                    slides: number[];
                                } | {
                                    address: string | null;
                                    heading: string | null;
                                    kind: "web_page";
                                } | {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    file_name: string;
                                    kind: "image";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                } | {
                                    end_second: number;
                                    frame: number | null;
                                    kind: "recording";
                                    start_second: number;
                                }) | null;
                                file_id: string;
                                file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                                file_path: string;
                                heading: string | null;
                                match_citation: ({
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    kind: "document";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                    pages: number[];
                                } | {
                                    first_row: number;
                                    kind: "spreadsheet";
                                    last_row: number;
                                    sheet: string | null;
                                } | {
                                    kind: "slides";
                                    slides: number[];
                                } | {
                                    address: string | null;
                                    heading: string | null;
                                    kind: "web_page";
                                } | {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    file_name: string;
                                    kind: "image";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                } | {
                                    end_second: number;
                                    frame: number | null;
                                    kind: "recording";
                                    start_second: number;
                                }) | null;
                                score: number;
                                version: number;
                            }[];
                            question: string;
                            saved_answer: {
                                passage: {
                                    citation: ({
                                        areas: {
                                            bottom: number;
                                            left: number;
                                            page: number;
                                            right: number;
                                            top: number;
                                        }[];
                                        kind: "document";
                                        page_sizes: {
                                            height: number;
                                            page: number;
                                            width: number;
                                        }[];
                                        pages: number[];
                                    } | {
                                        first_row: number;
                                        kind: "spreadsheet";
                                        last_row: number;
                                        sheet: string | null;
                                    } | {
                                        kind: "slides";
                                        slides: number[];
                                    } | {
                                        address: string | null;
                                        heading: string | null;
                                        kind: "web_page";
                                    } | {
                                        areas: {
                                            bottom: number;
                                            left: number;
                                            page: number;
                                            right: number;
                                            top: number;
                                        }[];
                                        file_name: string;
                                        kind: "image";
                                        page_sizes: {
                                            height: number;
                                            page: number;
                                            width: number;
                                        }[];
                                    } | {
                                        end_second: number;
                                        frame: number | null;
                                        kind: "recording";
                                        start_second: number;
                                    }) | null;
                                    file_id: string;
                                    file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                                    file_path: string | null;
                                    first_position: number;
                                    heading: string | null;
                                    last_position: number;
                                    state: "confirmed" | "unconfirmed";
                                    version: number;
                                };
                                passage_index: number | null;
                                saved_question_id: string;
                            } | null;
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    restore_knowledge_base: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        chunk_tokens: number;
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        database_id: string;
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        live_index_id: string;
                        name: string;
                        project_id: string;
                        purge_after: string | null;
                        question_log_retention_days: number | null;
                        search_pending_since: string | null;
                        sirannon_url: string;
                    };
                };
            };
        };
    };
    list_saved_questions: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
                search?: string;
                sort?: "created_at" | "question";
                split?: string;
                state?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        offset: number;
                        saved_questions: {
                            broken: {
                                change: "changed" | "moved" | "removed";
                                detected_at: string;
                                previous: {
                                    first_position: number;
                                    last_position: number;
                                    version: number;
                                } | null;
                                version: number | null;
                            } | null;
                            created_at: string;
                            end_user_id: string | null;
                            id: string;
                            passage: {
                                citation: ({
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    kind: "document";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                    pages: number[];
                                } | {
                                    first_row: number;
                                    kind: "spreadsheet";
                                    last_row: number;
                                    sheet: string | null;
                                } | {
                                    kind: "slides";
                                    slides: number[];
                                } | {
                                    address: string | null;
                                    heading: string | null;
                                    kind: "web_page";
                                } | {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    file_name: string;
                                    kind: "image";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                } | {
                                    end_second: number;
                                    frame: number | null;
                                    kind: "recording";
                                    start_second: number;
                                }) | null;
                                file_id: string;
                                file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                                file_path: string | null;
                                first_position: number;
                                heading: string | null;
                                last_position: number;
                                state: "confirmed" | "unconfirmed";
                                version: number;
                            };
                            question: string;
                            question_log_id: string | null;
                            source: "question_log" | "file" | "api" | "judge";
                            split: "tuning" | "held_back";
                            updated_at: string;
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    save_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    chunk_id?: string;
                    end_user_id?: string;
                    file_id?: string;
                    first_position?: number | string;
                    last_position?: number | string;
                    question: string;
                    question_log_id?: string;
                    version?: number | string;
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
                        broken: {
                            change: "changed" | "moved" | "removed";
                            detected_at: string;
                            previous: {
                                first_position: number;
                                last_position: number;
                                version: number;
                            } | null;
                            version: number | null;
                        } | null;
                        created_at: string;
                        end_user_id: string | null;
                        id: string;
                        passage: {
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            first_position: number;
                            heading: string | null;
                            last_position: number;
                            state: "confirmed" | "unconfirmed";
                            version: number;
                        };
                        question: string;
                        question_log_id: string | null;
                        source: "question_log" | "file" | "api" | "judge";
                        split: "tuning" | "held_back";
                        updated_at: string;
                    };
                };
            };
        };
    };
    get_saved_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                saved_question_id: string;
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
                        broken: {
                            change: "changed" | "moved" | "removed";
                            detected_at: string;
                            previous: {
                                first_position: number;
                                last_position: number;
                                version: number;
                            } | null;
                            version: number | null;
                        } | null;
                        created_at: string;
                        end_user_id: string | null;
                        id: string;
                        passage: {
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            first_position: number;
                            heading: string | null;
                            last_position: number;
                            state: "confirmed" | "unconfirmed";
                            version: number;
                        };
                        question: string;
                        question_log_id: string | null;
                        source: "question_log" | "file" | "api" | "judge";
                        split: "tuning" | "held_back";
                        updated_at: string;
                    };
                };
            };
        };
    };
    update_saved_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                saved_question_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    chunk_id?: string;
                    confirm?: boolean;
                    file_id?: string;
                    first_position?: number | string;
                    last_position?: number | string;
                    version?: number | string;
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
                        broken: {
                            change: "changed" | "moved" | "removed";
                            detected_at: string;
                            previous: {
                                first_position: number;
                                last_position: number;
                                version: number;
                            } | null;
                            version: number | null;
                        } | null;
                        created_at: string;
                        end_user_id: string | null;
                        id: string;
                        passage: {
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            first_position: number;
                            heading: string | null;
                            last_position: number;
                            state: "confirmed" | "unconfirmed";
                            version: number;
                        };
                        question: string;
                        question_log_id: string | null;
                        source: "question_log" | "file" | "api" | "judge";
                        split: "tuning" | "held_back";
                        updated_at: string;
                    };
                };
            };
        };
    };
    delete_saved_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                saved_question_id: string;
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
                        broken: {
                            change: "changed" | "moved" | "removed";
                            detected_at: string;
                            previous: {
                                first_position: number;
                                last_position: number;
                                version: number;
                            } | null;
                            version: number | null;
                        } | null;
                        created_at: string;
                        end_user_id: string | null;
                        id: string;
                        passage: {
                            citation: ({
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            }) | null;
                            file_id: string;
                            file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                            file_path: string | null;
                            first_position: number;
                            heading: string | null;
                            last_position: number;
                            state: "confirmed" | "unconfirmed";
                            version: number;
                        };
                        question: string;
                        question_log_id: string | null;
                        source: "question_log" | "file" | "api" | "judge";
                        split: "tuning" | "held_back";
                        updated_at: string;
                    };
                };
            };
        };
    };
    import_saved_questions: {
        parameters: {
            query?: {
                format?: "jsonl" | "csv";
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
            201: {
                headers: {
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        added: number;
                        refused: {
                            line: number;
                            reason: string;
                        }[];
                        refused_count: number;
                        saved_questions: {
                            broken: {
                                change: "changed" | "moved" | "removed";
                                detected_at: string;
                                previous: {
                                    first_position: number;
                                    last_position: number;
                                    version: number;
                                } | null;
                                version: number | null;
                            } | null;
                            created_at: string;
                            end_user_id: string | null;
                            id: string;
                            passage: {
                                citation: ({
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    kind: "document";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                    pages: number[];
                                } | {
                                    first_row: number;
                                    kind: "spreadsheet";
                                    last_row: number;
                                    sheet: string | null;
                                } | {
                                    kind: "slides";
                                    slides: number[];
                                } | {
                                    address: string | null;
                                    heading: string | null;
                                    kind: "web_page";
                                } | {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    file_name: string;
                                    kind: "image";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                } | {
                                    end_second: number;
                                    frame: number | null;
                                    kind: "recording";
                                    start_second: number;
                                }) | null;
                                file_id: string;
                                file_kind: ("pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video") | null;
                                file_path: string | null;
                                first_position: number;
                                heading: string | null;
                                last_position: number;
                                state: "confirmed" | "unconfirmed";
                                version: number;
                            };
                            question: string;
                            question_log_id: string | null;
                            source: "question_log" | "file" | "api" | "judge";
                            split: "tuning" | "held_back";
                            updated_at: string;
                        }[];
                    };
                };
            };
        };
    };
    list_scorecards: {
        parameters: {
            query?: {
                direction?: "asc" | "desc";
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        offset: number;
                        scorecards: {
                            configuration: {
                                live_index_id: string;
                                settings: {
                                    bm25: {
                                        b: number;
                                        k1: number;
                                    };
                                    boost: {
                                        heading: number;
                                        text: number;
                                    };
                                    chunk_tokens: number;
                                    fusion: {
                                        rank_constant: number;
                                        strategy: "rrf";
                                    } | {
                                        strategy: "linear";
                                        vector_weight: number;
                                    };
                                    language: string;
                                    stop_words: {
                                        added: string[];
                                        removed: string[];
                                    };
                                    synonyms: ({
                                        synonyms: string[];
                                        word: string;
                                    } | {
                                        words: string[];
                                    })[];
                                };
                            } | null;
                            depth: number;
                            failure_message: string | null;
                            finished_at: string | null;
                            first_count: number | null;
                            held_back: {
                                count: number;
                                first: number | null;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                                score: number | null;
                            } | null;
                            id: string;
                            mean_reciprocal_rank: number | null;
                            pass_id: string | null;
                            passed_count: number | null;
                            purpose: "requested" | "before" | "after";
                            question_count: number | null;
                            requested_at: string;
                            score: number | null;
                            started_at: string | null;
                            status: "queued" | "running" | "done" | "failed";
                            tuning: {
                                count: number;
                                first: number | null;
                                mean_reciprocal_rank: number | null;
                                passed: number;
                                score: number | null;
                            } | null;
                            waiting_for_search: boolean;
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    score_question_set: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
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
                        configuration: {
                            live_index_id: string;
                            settings: {
                                bm25: {
                                    b: number;
                                    k1: number;
                                };
                                boost: {
                                    heading: number;
                                    text: number;
                                };
                                chunk_tokens: number;
                                fusion: {
                                    rank_constant: number;
                                    strategy: "rrf";
                                } | {
                                    strategy: "linear";
                                    vector_weight: number;
                                };
                                language: string;
                                stop_words: {
                                    added: string[];
                                    removed: string[];
                                };
                                synonyms: ({
                                    synonyms: string[];
                                    word: string;
                                } | {
                                    words: string[];
                                })[];
                            };
                        } | null;
                        depth: number;
                        failure_message: string | null;
                        finished_at: string | null;
                        first_count: number | null;
                        held_back: {
                            count: number;
                            first: number | null;
                            mean_reciprocal_rank: number | null;
                            passed: number;
                            score: number | null;
                        } | null;
                        id: string;
                        mean_reciprocal_rank: number | null;
                        pass_id: string | null;
                        passed_count: number | null;
                        purpose: "requested" | "before" | "after";
                        question_count: number | null;
                        requested_at: string;
                        score: number | null;
                        started_at: string | null;
                        status: "queued" | "running" | "done" | "failed";
                        tuning: {
                            count: number;
                            first: number | null;
                            mean_reciprocal_rank: number | null;
                            passed: number;
                            score: number | null;
                        } | null;
                        waiting_for_search: boolean;
                    };
                };
            };
        };
    };
    get_scorecard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                scorecard_id: string;
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
                        configuration: {
                            live_index_id: string;
                            settings: {
                                bm25: {
                                    b: number;
                                    k1: number;
                                };
                                boost: {
                                    heading: number;
                                    text: number;
                                };
                                chunk_tokens: number;
                                fusion: {
                                    rank_constant: number;
                                    strategy: "rrf";
                                } | {
                                    strategy: "linear";
                                    vector_weight: number;
                                };
                                language: string;
                                stop_words: {
                                    added: string[];
                                    removed: string[];
                                };
                                synonyms: ({
                                    synonyms: string[];
                                    word: string;
                                } | {
                                    words: string[];
                                })[];
                            };
                        } | null;
                        depth: number;
                        failure_message: string | null;
                        finished_at: string | null;
                        first_count: number | null;
                        held_back: {
                            count: number;
                            first: number | null;
                            mean_reciprocal_rank: number | null;
                            passed: number;
                            score: number | null;
                        } | null;
                        id: string;
                        mean_reciprocal_rank: number | null;
                        pass_id: string | null;
                        passed_count: number | null;
                        purpose: "requested" | "before" | "after";
                        question_count: number | null;
                        requested_at: string;
                        score: number | null;
                        started_at: string | null;
                        status: "queued" | "running" | "done" | "failed";
                        tuning: {
                            count: number;
                            first: number | null;
                            mean_reciprocal_rank: number | null;
                            passed: number;
                            score: number | null;
                        } | null;
                        waiting_for_search: boolean;
                    };
                };
            };
        };
    };
    list_scorecard_results: {
        parameters: {
            query?: {
                cause?: string;
                change?: string;
                compare_to?: string;
                limit?: string;
                offset?: string;
                outcome?: string;
                split?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                scorecard_id: string;
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
                        offset: number;
                        results: {
                            cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                            cause_detail: {
                                chunks_in_passage: number | null;
                                deep_rank: number | null;
                                explanation: string;
                                keyword_rank: number | null;
                                missing_terms: string[] | null;
                                passage_language: string | null;
                                question_language: string | null;
                                vector_rank: number | null;
                            } | null;
                            compared: {
                                cause: ("ranked_lower" | "cut_across_chunks" | "different_language" | "different_word" | "old_version" | "passage_missing") | null;
                                passed: boolean;
                                rank: number | null;
                            } | null;
                            passage: {
                                file_id: string;
                                file_path: string | null;
                                heading: string | null;
                                version: number;
                            };
                            passage_state: "confirmed" | "unconfirmed";
                            passed: boolean;
                            question: string;
                            rank: number | null;
                            returned: {
                                chunk_id: string;
                                file_id: string;
                                file_path: string | null;
                                heading: string | null;
                                rank: number;
                                version: number;
                            }[];
                            saved_question_id: string;
                            split: "tuning" | "held_back";
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    search_knowledge_base: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    agent_id?: string;
                    call_id?: string;
                    end_user_id?: string;
                    folder?: string;
                    limit?: number | string;
                    metadata?: {
                        [key: string]: string | string[];
                    };
                    question: string;
                    team_id?: string;
                    with_memories?: boolean;
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
                        duration_ms: number;
                        memories: {
                            agent_may: "use" | "ask";
                            check: "current" | "pending";
                            conflicts_with: ({
                                held_from: string;
                                id: string;
                                kind: "memory";
                                sources: {
                                    author: string;
                                    author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                    conversation_id: string;
                                    external_id: string;
                                    sent_at: string;
                                    source_id: string;
                                    version: number;
                                }[];
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | {
                                file_id: string | null;
                                file_path: string | null;
                                kind: "file";
                                knowledge_base_id: string | null;
                                recorded_at: string;
                                resolution: "open" | "memory_replaces_file";
                                text: string;
                            } | {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                external_id: string;
                                kind: "waiting_message";
                                sent_at: string;
                                source_id: string;
                                text: string;
                            })[];
                            connection_strength: number;
                            holds: {
                                expires_at: string | null;
                                from: string;
                                until: string | null;
                            };
                            id: string;
                            last_checked_at: string | null;
                            memory_id: string;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            recall_strength: number;
                            replaced_by: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | null;
                            replaces: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            }[];
                            scope: "end_user" | "team" | "company";
                            sorted_by: "rules" | "model" | "as_given";
                            sorting_probability: number | null;
                            sources: {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                conversation_id: string;
                                external_id: string;
                                sent_at: string;
                                source_id: string;
                                version: number;
                            }[];
                            subject: string;
                            subject_owner_id: string | null;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            trust_reasons: ("from_records" | "said_by_staff" | "said_by_code" | "said_by_agent" | "said_by_end_user" | "said_by_outsider" | "said_by_subject_owner" | "people_agree" | "one_source" | "too_few_sources" | "contradicts_memory" | "contradicts_file" | "contradicts_waiting_message" | "replaces_file" | "instruction_like" | "held_secret" | "unsure" | "rechecked" | "settled_by_reply" | "settled_by_person")[];
                            type: "event" | "fact" | "plan" | "procedure";
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        }[];
                        passages: {
                            chunk_id: string;
                            citation: {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                kind: "document";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                                pages: number[];
                            } | {
                                first_row: number;
                                kind: "spreadsheet";
                                last_row: number;
                                sheet: string | null;
                            } | {
                                kind: "slides";
                                slides: number[];
                            } | {
                                address: string | null;
                                heading: string | null;
                                kind: "web_page";
                            } | {
                                areas: {
                                    bottom: number;
                                    left: number;
                                    page: number;
                                    right: number;
                                    top: number;
                                }[];
                                file_name: string;
                                kind: "image";
                                page_sizes: {
                                    height: number;
                                    page: number;
                                    width: number;
                                }[];
                            } | {
                                end_second: number;
                                frame: number | null;
                                kind: "recording";
                                start_second: number;
                            };
                            file_id: string;
                            file_kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                            file_path: string;
                            heading: string | null;
                            match: {
                                citation: {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    kind: "document";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                    pages: number[];
                                } | {
                                    first_row: number;
                                    kind: "spreadsheet";
                                    last_row: number;
                                    sheet: string | null;
                                } | {
                                    kind: "slides";
                                    slides: number[];
                                } | {
                                    address: string | null;
                                    heading: string | null;
                                    kind: "web_page";
                                } | {
                                    areas: {
                                        bottom: number;
                                        left: number;
                                        page: number;
                                        right: number;
                                        top: number;
                                    }[];
                                    file_name: string;
                                    kind: "image";
                                    page_sizes: {
                                        height: number;
                                        page: number;
                                        width: number;
                                    }[];
                                } | {
                                    end_second: number;
                                    frame: number | null;
                                    kind: "recording";
                                    start_second: number;
                                };
                                range: {
                                    end: number;
                                    start: number;
                                };
                                terms: {
                                    end: number;
                                    start: number;
                                }[];
                            };
                            score: number;
                            text: string;
                            truncated: boolean;
                            version: number;
                        }[];
                        question_id: string;
                        recall_id: string | null;
                    };
                };
            };
        };
    };
    list_sources: {
        parameters: {
            query?: {
                kind?: string;
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
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
                        offset: number;
                        sources: {
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
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    create_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    credentials?: {
                        [key: string]: unknown;
                    };
                    kind: "push" | "vapi" | "retell" | "elevenlabs" | "zendesk" | "s3" | "slack" | "notion" | "confluence" | "zendesk_help_center" | "google_drive" | "agent" | "database";
                    name: string;
                    settings?: {
                        [key: string]: unknown;
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
                        webhook_secret: string | null;
                        webhook_url: string | null;
                    };
                };
            };
        };
    };
    get_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
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
    update_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    credentials?: {
                        [key: string]: unknown;
                    };
                    name?: string;
                    rotate_webhook_secret?: boolean;
                    settings?: {
                        [key: string]: unknown;
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
                        webhook_secret: string | null;
                        webhook_url: string | null;
                    };
                };
            };
        };
    };
    delete_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
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
    list_source_items: {
        parameters: {
            query?: {
                external_id?: string;
                limit?: string;
                offset?: string;
                state?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
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
                        items: {
                            document_id: string;
                            external_id: string;
                            file_id: string | null;
                            kind: "conversation" | "message" | "record" | "deletion";
                            received_at: string;
                            state: "waiting" | "written" | "superseded";
                            version: number;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    ingest_items: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    items: ({
                        address?: string;
                        end_user_id?: string;
                        external_id: string;
                        kind: "conversation";
                        occurred_at?: string;
                        private?: boolean;
                        team_id?: string;
                        title?: string;
                        turns: {
                            at?: string;
                            end_second?: number;
                            speaker: string;
                            speaker_kind?: "staff" | "agent" | "end_user" | "outsider";
                            start_second?: number;
                            text: string;
                        }[];
                        version: number;
                    } | {
                        address?: string;
                        author: string;
                        author_kind?: "staff" | "agent" | "end_user" | "outsider";
                        conversation_id: string;
                        conversation_title?: string;
                        end_user_id?: string;
                        external_id: string;
                        kind: "message";
                        private?: boolean;
                        reactions?: number;
                        reply_to?: string;
                        sent_at: string;
                        team_id?: string;
                        text: string;
                        version: number;
                    } | {
                        address?: string;
                        end_user_id?: string;
                        external_id: string;
                        fields: {
                            [key: string]: string | number | boolean | null;
                        };
                        kind: "record";
                        title?: string;
                        version: number;
                    } | {
                        external_id: string;
                        kind: "deletion";
                        version: number;
                    })[];
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
                        results: {
                            external_id: string;
                            outcome: "stored" | "duplicate" | "stale" | "conflict";
                            version: number;
                        }[];
                    };
                };
            };
        };
    };
    start_source_sign_in: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
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
                        expires_at: string;
                        sign_in_url: string;
                    };
                };
            };
        };
    };
    sync_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
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
    list_source_syncs: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                source_id: string;
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
                        offset: number;
                        syncs: {
                            error: {
                                code: string;
                                message: string;
                            } | null;
                            files_added: number;
                            files_changed: number;
                            files_removed: number;
                            finished_at: string | null;
                            id: string;
                            started_at: string;
                            status: "syncing" | "finished" | "failed";
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    create_upload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    address?: string;
                    content_sha256: string;
                    metadata?: {
                        [key: string]: string;
                    } | string;
                    path: string;
                    size_bytes: number;
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
                        parts: {
                            expires_at: string;
                            headers: {
                                [key: string]: string;
                            };
                            method: "PUT";
                            part_number: number;
                            size_bytes: number;
                            url: string;
                        }[];
                        upload: {
                            address: string | null;
                            content_sha256: string;
                            created_at: string;
                            deadline_at: string;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            file: {
                                address: string | null;
                                content_sha256: string;
                                created_at: string;
                                current_version: number | null;
                                deleted_at: string | null;
                                failure: {
                                    code: string;
                                    message: string;
                                } | null;
                                id: string;
                                kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                                knowledge_base_id: string;
                                latest_version: number;
                                metadata: {
                                    [key: string]: string;
                                };
                                path: string;
                                purge_after: string | null;
                                size_bytes: number;
                                status: "queued" | "processing" | "ready" | "failed";
                                unread_parts: {
                                    end_second: number | null;
                                    failure: {
                                        code: string;
                                        message: string;
                                    };
                                    first_page: number | null;
                                    last_page: number | null;
                                    start_second: number | null;
                                }[];
                                updated_at: string;
                            } | null;
                            id: string;
                            knowledge_base_id: string;
                            method: "single" | "multipart";
                            outcome: ("added" | "new_version" | "unchanged") | null;
                            part_bytes: number;
                            part_count: number;
                            path: string;
                            size_bytes: number;
                            state: "open" | "checking" | "completed" | "failed";
                        };
                    };
                };
            };
        };
    };
    get_upload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                upload_id: string;
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
                        address: string | null;
                        content_sha256: string;
                        created_at: string;
                        deadline_at: string;
                        failure: {
                            code: string;
                            message: string;
                        } | null;
                        file: {
                            address: string | null;
                            content_sha256: string;
                            created_at: string;
                            current_version: number | null;
                            deleted_at: string | null;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            id: string;
                            kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                            knowledge_base_id: string;
                            latest_version: number;
                            metadata: {
                                [key: string]: string;
                            };
                            path: string;
                            purge_after: string | null;
                            size_bytes: number;
                            status: "queued" | "processing" | "ready" | "failed";
                            unread_parts: {
                                end_second: number | null;
                                failure: {
                                    code: string;
                                    message: string;
                                };
                                first_page: number | null;
                                last_page: number | null;
                                start_second: number | null;
                            }[];
                            updated_at: string;
                        } | null;
                        id: string;
                        knowledge_base_id: string;
                        method: "single" | "multipart";
                        outcome: ("added" | "new_version" | "unchanged") | null;
                        part_bytes: number;
                        part_count: number;
                        path: string;
                        size_bytes: number;
                        state: "open" | "checking" | "completed" | "failed";
                    };
                };
            };
        };
    };
    cancel_upload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                upload_id: string;
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
                        address: string | null;
                        content_sha256: string;
                        created_at: string;
                        deadline_at: string;
                        failure: {
                            code: string;
                            message: string;
                        } | null;
                        file: {
                            address: string | null;
                            content_sha256: string;
                            created_at: string;
                            current_version: number | null;
                            deleted_at: string | null;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            id: string;
                            kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                            knowledge_base_id: string;
                            latest_version: number;
                            metadata: {
                                [key: string]: string;
                            };
                            path: string;
                            purge_after: string | null;
                            size_bytes: number;
                            status: "queued" | "processing" | "ready" | "failed";
                            unread_parts: {
                                end_second: number | null;
                                failure: {
                                    code: string;
                                    message: string;
                                };
                                first_page: number | null;
                                last_page: number | null;
                                start_second: number | null;
                            }[];
                            updated_at: string;
                        } | null;
                        id: string;
                        knowledge_base_id: string;
                        method: "single" | "multipart";
                        outcome: ("added" | "new_version" | "unchanged") | null;
                        part_bytes: number;
                        part_count: number;
                        path: string;
                        size_bytes: number;
                        state: "open" | "checking" | "completed" | "failed";
                    };
                };
            };
        };
    };
    complete_upload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                upload_id: string;
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
                        address: string | null;
                        content_sha256: string;
                        created_at: string;
                        deadline_at: string;
                        failure: {
                            code: string;
                            message: string;
                        } | null;
                        file: {
                            address: string | null;
                            content_sha256: string;
                            created_at: string;
                            current_version: number | null;
                            deleted_at: string | null;
                            failure: {
                                code: string;
                                message: string;
                            } | null;
                            id: string;
                            kind: "pdf" | "word" | "slides" | "spreadsheet" | "web_page" | "image" | "audio" | "video";
                            knowledge_base_id: string;
                            latest_version: number;
                            metadata: {
                                [key: string]: string;
                            };
                            path: string;
                            purge_after: string | null;
                            size_bytes: number;
                            status: "queued" | "processing" | "ready" | "failed";
                            unread_parts: {
                                end_second: number | null;
                                failure: {
                                    code: string;
                                    message: string;
                                };
                                first_page: number | null;
                                last_page: number | null;
                                start_second: number | null;
                            }[];
                            updated_at: string;
                        } | null;
                        id: string;
                        knowledge_base_id: string;
                        method: "single" | "multipart";
                        outcome: ("added" | "new_version" | "unchanged") | null;
                        part_bytes: number;
                        part_count: number;
                        path: string;
                        size_bytes: number;
                        state: "open" | "checking" | "completed" | "failed";
                    };
                };
            };
        };
    };
    sign_upload_parts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                knowledge_base_id: string;
                project_id: string;
                upload_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    parts: {
                        part_number: number;
                        sha256: string;
                    }[];
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
                        parts: {
                            expires_at: string;
                            headers: {
                                [key: string]: string;
                            };
                            method: "PUT";
                            part_number: number;
                            size_bytes: number;
                            url: string;
                        }[];
                    };
                };
            };
        };
    };
    get_memory: {
        parameters: {
            query?: {
                state?: "live" | "deleted";
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
                        checked_knowledge_bases: {
                            knowledge_base_ids: string[];
                            left_out: {
                                knowledge_base_id: string;
                                reason: "over_limit" | "deleted" | "not_found" | "not_ready" | "in_another_cell";
                            }[];
                            left_out_count: number;
                            limit: number;
                        };
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        progress: {
                            failed_count: number;
                            memory_count: number;
                            open_review_count: number;
                            sorted_count: number;
                            waiting_count: number;
                        } | null;
                        project_id: string;
                        purge_after: string | null;
                        settings: {
                            agent_permissions: {
                                confirmed: "use" | "ask" | "withhold";
                                disputed: "use" | "ask" | "withhold";
                                likely: "use" | "ask" | "withhold";
                            };
                            agreeing_authors_for_confirmed: number;
                            checked_knowledge_base_ids: string[] | null;
                            confidence_threshold: number;
                            cue_weights: {
                                author_kind: {
                                    agent: number;
                                    code: number;
                                    end_user: number;
                                    outsider: number;
                                    records: number;
                                    staff: number;
                                };
                                private_channel: number;
                                reactions_for_second_voice: number;
                                statement_kind: {
                                    event: number;
                                    instruction: number;
                                    procedure: number;
                                    promise: number;
                                    statement: number;
                                };
                                subject_owner: number;
                            };
                            dropped_list_days: number | null;
                            duplicate_threshold: number;
                            first_pack_tokens: number;
                            knowledge_base_choice: "every" | "listed";
                            message_retention_days: number | null;
                            personal_retention_days: number | null;
                            ready_set_size: number;
                            recall_checked_memories: number;
                            recall_depth: number;
                            recall_fade_days: number;
                            recall_log_retention_days: number | null;
                            replaced_retention_days: number | null;
                            sources_for_likely: number;
                            subjects: {
                                owner_id: string | null;
                                sensitive: boolean;
                                subject: string;
                            }[];
                        };
                        sorting_pending_since: string | null;
                    };
                };
            };
        };
    };
    enable_memory: {
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
                    agent_permissions?: {
                        confirmed?: "use" | "ask" | "withhold";
                        disputed?: "use" | "ask" | "withhold";
                        likely?: "use" | "ask" | "withhold";
                    };
                    agreeing_authors_for_confirmed?: number | string;
                    checked_knowledge_base_ids?: string[];
                    confidence_threshold?: number | string;
                    cue_weights?: {
                        author_kind?: {
                            agent?: number | string;
                            code?: number | string;
                            end_user?: number | string;
                            outsider?: number | string;
                            records?: number | string;
                            staff?: number | string;
                        };
                        private_channel?: number | string;
                        reactions_for_second_voice?: number | string;
                        statement_kind?: {
                            event?: number | string;
                            instruction?: number | string;
                            procedure?: number | string;
                            promise?: number | string;
                            statement?: number | string;
                        };
                        subject_owner?: number | string;
                    };
                    dropped_list_days?: (number | string) | null | "unlimited";
                    duplicate_threshold?: number | string;
                    first_pack_tokens?: number | string;
                    knowledge_base_choice?: "every" | "listed";
                    language?: "albanian" | "amharic" | "arabic" | "armenian" | "azerbaijani" | "bambara" | "basque" | "belarusian" | "bengali" | "bosnian" | "breton" | "bulgarian" | "burmese" | "catalan" | "chinese" | "croatian" | "czech" | "dagbani" | "danish" | "dutch" | "english" | "esperanto" | "estonian" | "ewe" | "faroese" | "fijian" | "finnish" | "french" | "ga" | "galician" | "georgian" | "german" | "greek" | "guarani" | "gujarati" | "haitian-creole" | "hausa" | "hawaiian" | "hebrew" | "hindi" | "hungarian" | "icelandic" | "igbo" | "indonesian" | "irish" | "italian" | "japanese" | "kannada" | "kazakh" | "khmer" | "kinyarwanda" | "kirundi" | "korean" | "kurmanji" | "kyrgyz" | "lao" | "latin" | "latvian" | "lingala" | "lithuanian" | "luxembourgish" | "macedonian" | "malagasy" | "malay" | "malayalam" | "maltese" | "maori" | "marathi" | "nepali" | "norwegian" | "oromo" | "persian" | "polish" | "portuguese" | "punjabi" | "romanian" | "russian" | "samoan" | "sanskrit" | "scottish-gaelic" | "serbian" | "shona" | "sinhala" | "slovak" | "slovenian" | "sorani" | "spanish" | "swahili" | "swedish" | "tagalog" | "tamil" | "tatar" | "telugu" | "thai" | "tibetan" | "tigrinya" | "tongan" | "turkish" | "twi" | "ukrainian" | "urdu" | "vietnamese" | "welsh" | "wolof" | "xhosa" | "yoruba" | "zulu";
                    message_retention_days?: (number | string) | null | "unlimited";
                    personal_retention_days?: (number | string) | null | "unlimited";
                    ready_set_size?: number | string;
                    recall_depth?: number | string;
                    recall_fade_days?: number | string;
                    recall_log_retention_days?: (number | string) | null | "unlimited";
                    replaced_retention_days?: (number | string) | null | "unlimited";
                    sources_for_likely?: number | string;
                    subjects?: {
                        owner_id?: string | null;
                        sensitive?: boolean;
                        subject: string;
                    }[];
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
                        checked_knowledge_bases: {
                            knowledge_base_ids: string[];
                            left_out: {
                                knowledge_base_id: string;
                                reason: "over_limit" | "deleted" | "not_found" | "not_ready" | "in_another_cell";
                            }[];
                            left_out_count: number;
                            limit: number;
                        };
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        project_id: string;
                        purge_after: string | null;
                        settings: {
                            agent_permissions: {
                                confirmed: "use" | "ask" | "withhold";
                                disputed: "use" | "ask" | "withhold";
                                likely: "use" | "ask" | "withhold";
                            };
                            agreeing_authors_for_confirmed: number;
                            checked_knowledge_base_ids: string[] | null;
                            confidence_threshold: number;
                            cue_weights: {
                                author_kind: {
                                    agent: number;
                                    code: number;
                                    end_user: number;
                                    outsider: number;
                                    records: number;
                                    staff: number;
                                };
                                private_channel: number;
                                reactions_for_second_voice: number;
                                statement_kind: {
                                    event: number;
                                    instruction: number;
                                    procedure: number;
                                    promise: number;
                                    statement: number;
                                };
                                subject_owner: number;
                            };
                            dropped_list_days: number | null;
                            duplicate_threshold: number;
                            first_pack_tokens: number;
                            knowledge_base_choice: "every" | "listed";
                            message_retention_days: number | null;
                            personal_retention_days: number | null;
                            ready_set_size: number;
                            recall_checked_memories: number;
                            recall_depth: number;
                            recall_fade_days: number;
                            recall_log_retention_days: number | null;
                            replaced_retention_days: number | null;
                            sources_for_likely: number;
                            subjects: {
                                owner_id: string | null;
                                sensitive: boolean;
                                subject: string;
                            }[];
                        };
                        sorting_pending_since: string | null;
                    };
                };
            };
        };
    };
    update_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    agent_permissions?: {
                        confirmed?: "use" | "ask" | "withhold";
                        disputed?: "use" | "ask" | "withhold";
                        likely?: "use" | "ask" | "withhold";
                    };
                    agreeing_authors_for_confirmed?: number | string;
                    checked_knowledge_base_ids?: string[];
                    confidence_threshold?: number | string;
                    cue_weights?: {
                        author_kind?: {
                            agent?: number | string;
                            code?: number | string;
                            end_user?: number | string;
                            outsider?: number | string;
                            records?: number | string;
                            staff?: number | string;
                        };
                        private_channel?: number | string;
                        reactions_for_second_voice?: number | string;
                        statement_kind?: {
                            event?: number | string;
                            instruction?: number | string;
                            procedure?: number | string;
                            promise?: number | string;
                            statement?: number | string;
                        };
                        subject_owner?: number | string;
                    };
                    dropped_list_days?: (number | string) | null | "unlimited";
                    duplicate_threshold?: number | string;
                    first_pack_tokens?: number | string;
                    knowledge_base_choice?: "every" | "listed";
                    message_retention_days?: (number | string) | null | "unlimited";
                    personal_retention_days?: (number | string) | null | "unlimited";
                    ready_set_size?: number | string;
                    recall_depth?: number | string;
                    recall_fade_days?: number | string;
                    recall_log_retention_days?: (number | string) | null | "unlimited";
                    replaced_retention_days?: (number | string) | null | "unlimited";
                    sources_for_likely?: number | string;
                    subjects?: {
                        owner_id?: string | null;
                        sensitive?: boolean;
                        subject: string;
                    }[];
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
                        checked_knowledge_bases: {
                            knowledge_base_ids: string[];
                            left_out: {
                                knowledge_base_id: string;
                                reason: "over_limit" | "deleted" | "not_found" | "not_ready" | "in_another_cell";
                            }[];
                            left_out_count: number;
                            limit: number;
                        };
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        project_id: string;
                        purge_after: string | null;
                        settings: {
                            agent_permissions: {
                                confirmed: "use" | "ask" | "withhold";
                                disputed: "use" | "ask" | "withhold";
                                likely: "use" | "ask" | "withhold";
                            };
                            agreeing_authors_for_confirmed: number;
                            checked_knowledge_base_ids: string[] | null;
                            confidence_threshold: number;
                            cue_weights: {
                                author_kind: {
                                    agent: number;
                                    code: number;
                                    end_user: number;
                                    outsider: number;
                                    records: number;
                                    staff: number;
                                };
                                private_channel: number;
                                reactions_for_second_voice: number;
                                statement_kind: {
                                    event: number;
                                    instruction: number;
                                    procedure: number;
                                    promise: number;
                                    statement: number;
                                };
                                subject_owner: number;
                            };
                            dropped_list_days: number | null;
                            duplicate_threshold: number;
                            first_pack_tokens: number;
                            knowledge_base_choice: "every" | "listed";
                            message_retention_days: number | null;
                            personal_retention_days: number | null;
                            ready_set_size: number;
                            recall_checked_memories: number;
                            recall_depth: number;
                            recall_fade_days: number;
                            recall_log_retention_days: number | null;
                            replaced_retention_days: number | null;
                            sources_for_likely: number;
                            subjects: {
                                owner_id: string | null;
                                sensitive: boolean;
                                subject: string;
                            }[];
                        };
                        sorting_pending_since: string | null;
                    };
                };
            };
        };
    };
    delete_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
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
                        checked_knowledge_bases: {
                            knowledge_base_ids: string[];
                            left_out: {
                                knowledge_base_id: string;
                                reason: "over_limit" | "deleted" | "not_found" | "not_ready" | "in_another_cell";
                            }[];
                            left_out_count: number;
                            limit: number;
                        };
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        project_id: string;
                        purge_after: string | null;
                        settings: {
                            agent_permissions: {
                                confirmed: "use" | "ask" | "withhold";
                                disputed: "use" | "ask" | "withhold";
                                likely: "use" | "ask" | "withhold";
                            };
                            agreeing_authors_for_confirmed: number;
                            checked_knowledge_base_ids: string[] | null;
                            confidence_threshold: number;
                            cue_weights: {
                                author_kind: {
                                    agent: number;
                                    code: number;
                                    end_user: number;
                                    outsider: number;
                                    records: number;
                                    staff: number;
                                };
                                private_channel: number;
                                reactions_for_second_voice: number;
                                statement_kind: {
                                    event: number;
                                    instruction: number;
                                    procedure: number;
                                    promise: number;
                                    statement: number;
                                };
                                subject_owner: number;
                            };
                            dropped_list_days: number | null;
                            duplicate_threshold: number;
                            first_pack_tokens: number;
                            knowledge_base_choice: "every" | "listed";
                            message_retention_days: number | null;
                            personal_retention_days: number | null;
                            ready_set_size: number;
                            recall_checked_memories: number;
                            recall_depth: number;
                            recall_fade_days: number;
                            recall_log_retention_days: number | null;
                            replaced_retention_days: number | null;
                            sources_for_likely: number;
                            subjects: {
                                owner_id: string | null;
                                sensitive: boolean;
                                subject: string;
                            }[];
                        };
                        sorting_pending_since: string | null;
                    };
                };
            };
        };
    };
    get_memory_context: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    agent_id?: string;
                    as_of?: string;
                    end_user_id?: string;
                    team_id?: string;
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
                        duration_ms: number;
                        memories: {
                            agent_may: "use" | "ask";
                            check: "current" | "pending";
                            conflicts_with: ({
                                held_from: string;
                                id: string;
                                kind: "memory";
                                sources: {
                                    author: string;
                                    author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                    conversation_id: string;
                                    external_id: string;
                                    sent_at: string;
                                    source_id: string;
                                    version: number;
                                }[];
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | {
                                file_id: string | null;
                                file_path: string | null;
                                kind: "file";
                                knowledge_base_id: string | null;
                                recorded_at: string;
                                resolution: "open" | "memory_replaces_file";
                                text: string;
                            } | {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                external_id: string;
                                kind: "waiting_message";
                                sent_at: string;
                                source_id: string;
                                text: string;
                            })[];
                            connection_strength: number;
                            holds: {
                                expires_at: string | null;
                                from: string;
                                until: string | null;
                            };
                            id: string;
                            last_checked_at: string | null;
                            memory_id: string;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            recall_strength: number;
                            replaced_by: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | null;
                            replaces: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            }[];
                            scope: "end_user" | "team" | "company";
                            sorted_by: "rules" | "model" | "as_given";
                            sorting_probability: number | null;
                            sources: {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                conversation_id: string;
                                external_id: string;
                                sent_at: string;
                                source_id: string;
                                version: number;
                            }[];
                            subject: string;
                            subject_owner_id: string | null;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            trust_reasons: ("from_records" | "said_by_staff" | "said_by_code" | "said_by_agent" | "said_by_end_user" | "said_by_outsider" | "said_by_subject_owner" | "people_agree" | "one_source" | "too_few_sources" | "contradicts_memory" | "contradicts_file" | "contradicts_waiting_message" | "replaces_file" | "instruction_like" | "held_secret" | "unsure" | "rechecked" | "settled_by_reply" | "settled_by_person")[];
                            type: "event" | "fact" | "plan" | "procedure";
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        }[];
                        recall_id: string | null;
                    };
                };
            };
        };
    };
    list_memory_decisions: {
        parameters: {
            query?: {
                by_person?: "true" | "false";
                kind?: string;
                limit?: string;
                offset?: string;
                stored_memory_id?: string;
                subject_owner_id?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        decisions: {
                            created_at: string;
                            decided_by: "rules" | "model" | "writer" | "recheck" | "person";
                            file: {
                                file_id: string | null;
                                file_path: string | null;
                                knowledge_base_id: string | null;
                                recorded_at: string;
                                text: string;
                            } | null;
                            id: string;
                            kind: "kept" | "merged" | "replaced" | "disputed" | "dropped" | "rechecked" | "flagged" | "file_conflict" | "settled" | "forgotten" | "recovered";
                            memory: {
                                connection_strength: number;
                                created_at: string;
                                expires_at: string | null;
                                forgotten_at: string | null;
                                held_until: string | null;
                                id: string;
                                instruction_like: boolean;
                                last_checked_at: string | null;
                                memory_id: string;
                                occurred_at: string;
                                owner_id: string | null;
                                personal: boolean;
                                plan: {
                                    due_at: string | null;
                                    state: "open" | "done" | "cancelled" | "overdue";
                                } | null;
                                purge_after: string | null;
                                recall_strength: number;
                                replaced_by: string | null;
                                scope: "end_user" | "team" | "company";
                                sensitive: boolean;
                                sorted_by: "rules" | "model" | "as_given";
                                sources: {
                                    author: string;
                                    author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                    conversation_id: string;
                                    external_id: string;
                                    sent_at: string;
                                    source_id: string;
                                    version: number;
                                }[];
                                subject: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                                type: "event" | "fact" | "plan" | "procedure";
                                updated_at: string;
                                values: {
                                    [key: string]: string | number | boolean | null;
                                };
                            };
                            memory_id: string;
                            other_memory: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | null;
                            overridden_at: string | null;
                            probability: number | null;
                            reason: string | null;
                            stored_memory_id: string;
                            subject: string;
                            subject_owner_id: string | null;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    export_memories: {
        parameters: {
            query?: {
                after?: string;
                end_user_id?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                    "content-disposition"?: string;
                    "x-request-id": components["headers"]["request_id"];
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    list_forgetting_suggestions: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        memories: {
                            connection_strength: number;
                            created_at: string;
                            expires_at: string | null;
                            forgotten_at: string | null;
                            held_until: string | null;
                            id: string;
                            instruction_like: boolean;
                            last_checked_at: string | null;
                            memory_id: string;
                            occurred_at: string;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            purge_after: string | null;
                            recall_strength: number;
                            replaced_by: string | null;
                            scope: "end_user" | "team" | "company";
                            sensitive: boolean;
                            sorted_by: "rules" | "model" | "as_given";
                            sources: {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                conversation_id: string;
                                external_id: string;
                                sent_at: string;
                                source_id: string;
                                version: number;
                            }[];
                            subject: string;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            type: "event" | "fact" | "plan" | "procedure";
                            updated_at: string;
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        }[];
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    list_learned_changes: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        learned_changes: {
                            created_at: string;
                            from_value: number;
                            held_back_decisions: number;
                            held_back_right_after: number;
                            held_back_right_before: number;
                            id: string;
                            setting: string;
                            to_value: number;
                            tuning_decisions: number;
                            undone_at: string | null;
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    undo_learned_change: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                change_id: string;
                memory_id: string;
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
                        from_value: number;
                        held_back_decisions: number;
                        held_back_right_after: number;
                        held_back_right_before: number;
                        id: string;
                        setting: string;
                        to_value: number;
                        tuning_decisions: number;
                        undone_at: string | null;
                    };
                };
            };
        };
    };
    list_memories: {
        parameters: {
            query?: {
                end_user_id?: string;
                forgotten?: "true" | "false";
                include_replaced?: "true" | "false";
                limit?: string;
                offset?: string;
                owner_id?: string;
                plan_state?: string;
                query?: string;
                scope?: string;
                team_id?: string;
                trust_level?: string;
                type?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        memories: {
                            connection_strength: number;
                            created_at: string;
                            expires_at: string | null;
                            forgotten_at: string | null;
                            held_until: string | null;
                            id: string;
                            instruction_like: boolean;
                            last_checked_at: string | null;
                            memory_id: string;
                            occurred_at: string;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            purge_after: string | null;
                            recall_strength: number;
                            replaced_by: string | null;
                            scope: "end_user" | "team" | "company";
                            sensitive: boolean;
                            sorted_by: "rules" | "model" | "as_given";
                            sources: {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                conversation_id: string;
                                external_id: string;
                                sent_at: string;
                                source_id: string;
                                version: number;
                            }[];
                            subject: string;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            type: "event" | "fact" | "plan" | "procedure";
                            updated_at: string;
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        }[];
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    inspect_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                stored_memory_id: string;
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
                        connection_strength: number;
                        created_at: string;
                        decisions: {
                            choice: string;
                            created_at: string;
                            decided_by: "rules" | "model" | "writer" | "recheck" | "person";
                            memory: {
                                id: string;
                                replaced: boolean;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | null;
                            probability: number | null;
                            step: string;
                        }[];
                        expires_at: string | null;
                        forgotten_at: string | null;
                        held_until: string | null;
                        id: string;
                        instruction_like: boolean;
                        last_checked_at: string | null;
                        links: {
                            direction: "outgoing" | "incoming";
                            memory: {
                                id: string;
                                replaced: boolean;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            };
                            relation: "replaces" | "contradicts" | "agrees";
                        }[];
                        memory_id: string;
                        mentions: string[];
                        occurred_at: string;
                        owner_id: string | null;
                        personal: boolean;
                        plan: {
                            due_at: string | null;
                            state: "open" | "done" | "cancelled" | "overdue";
                        } | null;
                        purge_after: string | null;
                        recall_strength: number;
                        replaced_by: string | null;
                        reviews: {
                            created_at: string;
                            evidence: {
                                [key: string]: unknown;
                            };
                            id: string;
                            memory_id: string;
                            reason: "instruction_like" | "sensitive" | "disputed" | "hard_case" | "recheck_unsure" | "contradicts_file";
                            settled_at: string | null;
                            settled_by: string | null;
                            settled_trust_level: ("confirmed" | "likely" | "disputed" | "not_kept") | null;
                            state: "open" | "settled";
                            stored_memory_id: string;
                        }[];
                        scope: "end_user" | "team" | "company";
                        sensitive: boolean;
                        sorted_by: "rules" | "model" | "as_given";
                        sources: {
                            author: string;
                            author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                            conversation_id: string;
                            external_id: string;
                            sent_at: string;
                            source_id: string;
                            version: number;
                        }[];
                        subject: string;
                        text: string;
                        trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        type: "event" | "fact" | "plan" | "procedure";
                        updated_at: string;
                        values: {
                            [key: string]: string | number | boolean | null;
                        };
                    };
                };
            };
        };
    };
    forget_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                stored_memory_id: string;
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
                        connection_strength: number;
                        created_at: string;
                        expires_at: string | null;
                        forgotten_at: string | null;
                        held_until: string | null;
                        id: string;
                        instruction_like: boolean;
                        last_checked_at: string | null;
                        memory_id: string;
                        occurred_at: string;
                        owner_id: string | null;
                        personal: boolean;
                        plan: {
                            due_at: string | null;
                            state: "open" | "done" | "cancelled" | "overdue";
                        } | null;
                        purge_after: string | null;
                        recall_strength: number;
                        replaced_by: string | null;
                        scope: "end_user" | "team" | "company";
                        sensitive: boolean;
                        sorted_by: "rules" | "model" | "as_given";
                        sources: {
                            author: string;
                            author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                            conversation_id: string;
                            external_id: string;
                            sent_at: string;
                            source_id: string;
                            version: number;
                        }[];
                        subject: string;
                        text: string;
                        trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        type: "event" | "fact" | "plan" | "procedure";
                        updated_at: string;
                        values: {
                            [key: string]: string | number | boolean | null;
                        };
                    };
                };
            };
        };
    };
    send_memory_feedback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                stored_memory_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    recall_id?: string;
                    verdict: "right" | "wrong";
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
                        id: string;
                        stored_memory_id: string;
                        verdict: "right" | "wrong";
                    };
                };
            };
        };
    };
    promote_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                stored_memory_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    scope: "team" | "company";
                    team_id?: string;
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
                        connection_strength: number;
                        created_at: string;
                        expires_at: string | null;
                        forgotten_at: string | null;
                        held_until: string | null;
                        id: string;
                        instruction_like: boolean;
                        last_checked_at: string | null;
                        memory_id: string;
                        occurred_at: string;
                        owner_id: string | null;
                        personal: boolean;
                        plan: {
                            due_at: string | null;
                            state: "open" | "done" | "cancelled" | "overdue";
                        } | null;
                        purge_after: string | null;
                        recall_strength: number;
                        replaced_by: string | null;
                        scope: "end_user" | "team" | "company";
                        sensitive: boolean;
                        sorted_by: "rules" | "model" | "as_given";
                        sources: {
                            author: string;
                            author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                            conversation_id: string;
                            external_id: string;
                            sent_at: string;
                            source_id: string;
                            version: number;
                        }[];
                        subject: string;
                        text: string;
                        trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        type: "event" | "fact" | "plan" | "procedure";
                        updated_at: string;
                        values: {
                            [key: string]: string | number | boolean | null;
                        };
                    };
                };
            };
        };
    };
    recover_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                stored_memory_id: string;
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
                        connection_strength: number;
                        created_at: string;
                        expires_at: string | null;
                        forgotten_at: string | null;
                        held_until: string | null;
                        id: string;
                        instruction_like: boolean;
                        last_checked_at: string | null;
                        memory_id: string;
                        occurred_at: string;
                        owner_id: string | null;
                        personal: boolean;
                        plan: {
                            due_at: string | null;
                            state: "open" | "done" | "cancelled" | "overdue";
                        } | null;
                        purge_after: string | null;
                        recall_strength: number;
                        replaced_by: string | null;
                        scope: "end_user" | "team" | "company";
                        sensitive: boolean;
                        sorted_by: "rules" | "model" | "as_given";
                        sources: {
                            author: string;
                            author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                            conversation_id: string;
                            external_id: string;
                            sent_at: string;
                            source_id: string;
                            version: number;
                        }[];
                        subject: string;
                        text: string;
                        trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        type: "event" | "fact" | "plan" | "procedure";
                        updated_at: string;
                        values: {
                            [key: string]: string | number | boolean | null;
                        };
                    };
                };
            };
        };
    };
    settle_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                stored_memory_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    expires_at?: string | null;
                    over_file?: boolean;
                    owner_id?: string;
                    scope?: "end_user" | "team" | "company";
                    trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                    type?: "event" | "fact" | "plan" | "procedure";
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
                        connection_strength: number;
                        created_at: string;
                        expires_at: string | null;
                        forgotten_at: string | null;
                        held_until: string | null;
                        id: string;
                        instruction_like: boolean;
                        last_checked_at: string | null;
                        memory_id: string;
                        occurred_at: string;
                        owner_id: string | null;
                        personal: boolean;
                        plan: {
                            due_at: string | null;
                            state: "open" | "done" | "cancelled" | "overdue";
                        } | null;
                        purge_after: string | null;
                        recall_strength: number;
                        replaced_by: string | null;
                        scope: "end_user" | "team" | "company";
                        sensitive: boolean;
                        sorted_by: "rules" | "model" | "as_given";
                        sources: {
                            author: string;
                            author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                            conversation_id: string;
                            external_id: string;
                            sent_at: string;
                            source_id: string;
                            version: number;
                        }[];
                        subject: string;
                        text: string;
                        trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        type: "event" | "fact" | "plan" | "procedure";
                        updated_at: string;
                        values: {
                            [key: string]: string | number | boolean | null;
                        };
                    };
                };
            };
        };
    };
    list_messages: {
        parameters: {
            query?: {
                conversation_id?: string;
                limit?: string;
                offset?: string;
                source_id?: string;
                state?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        messages: {
                            attempts: number;
                            conversation_id: string;
                            external_id: string;
                            failure_code: string | null;
                            finished_at: string | null;
                            memories_written: number;
                            received_at: string;
                            source_id: string;
                            state: "waiting" | "sorted" | "superseded" | "cancelled" | "failed";
                            text_start: string;
                            version: number;
                        }[];
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
    list_memory_owners: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
                query?: string;
                scope?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        offset: number;
                        owners: {
                            last_occurred_at: string;
                            memory_count: number;
                            owner_id: string;
                            scope: "end_user" | "team";
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    recall_memories: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    agent_id?: string;
                    as_of?: string;
                    end_user_id?: string;
                    limit?: number | string;
                    query: string;
                    team_id?: string;
                    trial?: boolean;
                    type?: string | string[];
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
                        duration_ms: number;
                        memories: {
                            agent_may: "use" | "ask";
                            check: "current" | "pending";
                            conflicts_with: ({
                                held_from: string;
                                id: string;
                                kind: "memory";
                                sources: {
                                    author: string;
                                    author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                    conversation_id: string;
                                    external_id: string;
                                    sent_at: string;
                                    source_id: string;
                                    version: number;
                                }[];
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | {
                                file_id: string | null;
                                file_path: string | null;
                                kind: "file";
                                knowledge_base_id: string | null;
                                recorded_at: string;
                                resolution: "open" | "memory_replaces_file";
                                text: string;
                            } | {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                external_id: string;
                                kind: "waiting_message";
                                sent_at: string;
                                source_id: string;
                                text: string;
                            })[];
                            connection_strength: number;
                            holds: {
                                expires_at: string | null;
                                from: string;
                                until: string | null;
                            };
                            id: string;
                            last_checked_at: string | null;
                            memory_id: string;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            recall_strength: number;
                            replaced_by: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            } | null;
                            replaces: {
                                held_from: string;
                                held_until: string | null;
                                id: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            }[];
                            scope: "end_user" | "team" | "company";
                            sorted_by: "rules" | "model" | "as_given";
                            sorting_probability: number | null;
                            sources: {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                conversation_id: string;
                                external_id: string;
                                sent_at: string;
                                source_id: string;
                                version: number;
                            }[];
                            subject: string;
                            subject_owner_id: string | null;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            trust_reasons: ("from_records" | "said_by_staff" | "said_by_code" | "said_by_agent" | "said_by_end_user" | "said_by_outsider" | "said_by_subject_owner" | "people_agree" | "one_source" | "too_few_sources" | "contradicts_memory" | "contradicts_file" | "contradicts_waiting_message" | "replaces_file" | "instruction_like" | "held_secret" | "unsure" | "rechecked" | "settled_by_reply" | "settled_by_person")[];
                            type: "event" | "fact" | "plan" | "procedure";
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        }[];
                        recall_id: string | null;
                    };
                };
            };
        };
    };
    restore_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
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
                        checked_knowledge_bases: {
                            knowledge_base_ids: string[];
                            left_out: {
                                knowledge_base_id: string;
                                reason: "over_limit" | "deleted" | "not_found" | "not_ready" | "in_another_cell";
                            }[];
                            left_out_count: number;
                            limit: number;
                        };
                        created_at: string;
                        created_by: {
                            id: string;
                            kind: "account" | "key";
                            name: string;
                        };
                        deleted_at: string | null;
                        id: string;
                        language: string;
                        project_id: string;
                        purge_after: string | null;
                        settings: {
                            agent_permissions: {
                                confirmed: "use" | "ask" | "withhold";
                                disputed: "use" | "ask" | "withhold";
                                likely: "use" | "ask" | "withhold";
                            };
                            agreeing_authors_for_confirmed: number;
                            checked_knowledge_base_ids: string[] | null;
                            confidence_threshold: number;
                            cue_weights: {
                                author_kind: {
                                    agent: number;
                                    code: number;
                                    end_user: number;
                                    outsider: number;
                                    records: number;
                                    staff: number;
                                };
                                private_channel: number;
                                reactions_for_second_voice: number;
                                statement_kind: {
                                    event: number;
                                    instruction: number;
                                    procedure: number;
                                    promise: number;
                                    statement: number;
                                };
                                subject_owner: number;
                            };
                            dropped_list_days: number | null;
                            duplicate_threshold: number;
                            first_pack_tokens: number;
                            knowledge_base_choice: "every" | "listed";
                            message_retention_days: number | null;
                            personal_retention_days: number | null;
                            ready_set_size: number;
                            recall_checked_memories: number;
                            recall_depth: number;
                            recall_fade_days: number;
                            recall_log_retention_days: number | null;
                            replaced_retention_days: number | null;
                            sources_for_likely: number;
                            subjects: {
                                owner_id: string | null;
                                sensitive: boolean;
                                subject: string;
                            }[];
                        };
                        sorting_pending_since: string | null;
                    };
                };
            };
        };
    };
    list_memory_reviews: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
                reason?: string;
                state?: "open" | "settled";
            };
            header?: never;
            path: {
                memory_id: string;
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
                        offset: number;
                        reviews: {
                            contradicted_memories: {
                                id: string;
                                replaced: boolean;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            }[];
                            contradicting_records: {
                                file_id: string | null;
                                file_path: string | null;
                                knowledge_base_id: string | null;
                                recorded_at: string;
                                text: string;
                            }[];
                            created_at: string;
                            evidence: {
                                [key: string]: unknown;
                            };
                            id: string;
                            memory: {
                                connection_strength: number;
                                created_at: string;
                                expires_at: string | null;
                                forgotten_at: string | null;
                                held_until: string | null;
                                id: string;
                                instruction_like: boolean;
                                last_checked_at: string | null;
                                memory_id: string;
                                occurred_at: string;
                                owner_id: string | null;
                                personal: boolean;
                                plan: {
                                    due_at: string | null;
                                    state: "open" | "done" | "cancelled" | "overdue";
                                } | null;
                                purge_after: string | null;
                                recall_strength: number;
                                replaced_by: string | null;
                                scope: "end_user" | "team" | "company";
                                sensitive: boolean;
                                sorted_by: "rules" | "model" | "as_given";
                                sources: {
                                    author: string;
                                    author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                    conversation_id: string;
                                    external_id: string;
                                    sent_at: string;
                                    source_id: string;
                                    version: number;
                                }[];
                                subject: string;
                                text: string;
                                trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                                type: "event" | "fact" | "plan" | "procedure";
                                updated_at: string;
                                values: {
                                    [key: string]: string | number | boolean | null;
                                };
                            };
                            memory_id: string;
                            reason: "instruction_like" | "sensitive" | "disputed" | "hard_case" | "recheck_unsure" | "contradicts_file";
                            settled_at: string | null;
                            settled_by: string | null;
                            settled_trust_level: ("confirmed" | "likely" | "disputed" | "not_kept") | null;
                            state: "open" | "settled";
                            stored_memory_id: string;
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    settle_memory_review: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                review_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    owner_id?: string;
                    scope?: "end_user" | "team" | "company";
                    trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                    type?: "event" | "fact" | "plan" | "procedure";
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
                        contradicted_memories: {
                            id: string;
                            replaced: boolean;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                        }[];
                        contradicting_records: {
                            file_id: string | null;
                            file_path: string | null;
                            knowledge_base_id: string | null;
                            recorded_at: string;
                            text: string;
                        }[];
                        created_at: string;
                        evidence: {
                            [key: string]: unknown;
                        };
                        id: string;
                        memory: {
                            connection_strength: number;
                            created_at: string;
                            expires_at: string | null;
                            forgotten_at: string | null;
                            held_until: string | null;
                            id: string;
                            instruction_like: boolean;
                            last_checked_at: string | null;
                            memory_id: string;
                            occurred_at: string;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            purge_after: string | null;
                            recall_strength: number;
                            replaced_by: string | null;
                            scope: "end_user" | "team" | "company";
                            sensitive: boolean;
                            sorted_by: "rules" | "model" | "as_given";
                            sources: {
                                author: string;
                                author_kind: "staff" | "agent" | "end_user" | "outsider" | "records" | "code";
                                conversation_id: string;
                                external_id: string;
                                sent_at: string;
                                source_id: string;
                                version: number;
                            }[];
                            subject: string;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            type: "event" | "fact" | "plan" | "procedure";
                            updated_at: string;
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        };
                        memory_id: string;
                        reason: "instruction_like" | "sensitive" | "disputed" | "hard_case" | "recheck_unsure" | "contradicts_file";
                        settled_at: string | null;
                        settled_by: string | null;
                        settled_trust_level: ("confirmed" | "likely" | "disputed" | "not_kept") | null;
                        state: "open" | "settled";
                        stored_memory_id: string;
                    };
                };
            };
        };
    };
    list_memory_saved_questions: {
        parameters: {
            query?: {
                flagged?: "true" | "false";
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        offset: number;
                        saved_questions: {
                            created_at: string;
                            end_user_id: string | null;
                            flag: ("memory_replaced" | "memory_forgotten") | null;
                            id: string;
                            memory_text: string | null;
                            question: string;
                            rank: number | null;
                            replaced_by: string | null;
                            stored_memory_id: string;
                            team_id: string | null;
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    save_memory_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    end_user_id?: string;
                    question: string;
                    stored_memory_id: string;
                    team_id?: string;
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
                        end_user_id: string | null;
                        flag: ("memory_replaced" | "memory_forgotten") | null;
                        id: string;
                        memory_text: string | null;
                        question: string;
                        rank: number | null;
                        replaced_by: string | null;
                        stored_memory_id: string;
                        team_id: string | null;
                    };
                };
            };
        };
    };
    delete_memory_saved_question: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                saved_question_id: string;
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
                        end_user_id: string | null;
                        flag: ("memory_replaced" | "memory_forgotten") | null;
                        id: string;
                        memory_text: string | null;
                        question: string;
                        rank: number | null;
                        replaced_by: string | null;
                        stored_memory_id: string;
                        team_id: string | null;
                    };
                };
            };
        };
    };
    get_memory_scores: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
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
                        flagged_question_count: number;
                        judgement: {
                            decision_count: number;
                            right_count: number;
                            score: number;
                            scored_at: string;
                        } | null;
                        labelled_decisions: {
                            held_back_count: number;
                            tuning_count: number;
                        };
                        recall: {
                            depth: number;
                            mean_reciprocal_rank: number;
                            question_count: number;
                            score: number;
                            scored_at: string;
                        } | null;
                        scoring: boolean;
                        tuning: {
                            labelled_decisions_per_tuning: number;
                            labelled_decisions_since_tuning: number;
                            memory_changes_since_scoring: number | null;
                            saved_questions_changed: boolean;
                            started_at: string | null;
                            state: "up_to_date" | "new_input" | "queued" | "working";
                            tuned_at: string | null;
                        };
                    };
                };
            };
        };
    };
    sort_message: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    author: string;
                    author_kind: "staff" | "agent" | "end_user" | "outsider";
                    conversation_id?: string;
                    end_user_id?: string;
                    private?: boolean;
                    sent_at?: string;
                    sorting?: "full" | "rules_only" | "as_given";
                    team_id?: string;
                    text: string;
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
                        memories: {
                            agrees_with: string[];
                            conflicts_with: string[];
                            duplicate_of: string | null;
                            instruction_like: boolean;
                            owner_id: string | null;
                            personal: boolean;
                            plan: {
                                due_at: string | null;
                                state: "open" | "done" | "cancelled" | "overdue";
                            } | null;
                            review_reason: ("instruction_like" | "sensitive" | "disputed" | "hard_case" | "recheck_unsure" | "contradicts_file") | null;
                            scope: "end_user" | "team" | "company";
                            sensitive: boolean;
                            sorted_by: "rules" | "model" | "as_given";
                            subject: string;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            type: "event" | "fact" | "plan" | "procedure";
                            values: {
                                [key: string]: string | number | boolean | null;
                            };
                        }[];
                    };
                };
            };
        };
    };
    list_memory_sources: {
        parameters: {
            query?: {
                kind?: string;
                limit?: string;
                offset?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        offset: number;
                        sources: {
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
                        }[];
                        total_count: number;
                    };
                };
            };
        };
    };
    create_memory_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    credentials?: {
                        [key: string]: unknown;
                    };
                    kind: "push" | "vapi" | "retell" | "elevenlabs" | "zendesk" | "s3" | "slack" | "notion" | "confluence" | "zendesk_help_center" | "google_drive" | "agent" | "database";
                    name: string;
                    settings?: {
                        [key: string]: unknown;
                    };
                    sorting?: "full" | "rules_only" | "as_given";
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
                        webhook_secret: string | null;
                        webhook_url: string | null;
                    };
                };
            };
        };
    };
    get_memory_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
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
    update_memory_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    credentials?: {
                        [key: string]: unknown;
                    };
                    name?: string;
                    rotate_webhook_secret?: boolean;
                    settings?: {
                        [key: string]: unknown;
                    };
                    sorting?: "full" | "rules_only" | "as_given";
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
                        webhook_secret: string | null;
                        webhook_url: string | null;
                    };
                };
            };
        };
    };
    delete_memory_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
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
    get_message: {
        parameters: {
            query: {
                external_id: string;
                version?: string;
            };
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
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
                        attempts: number;
                        conversation_id: string;
                        end_user_id: string | null;
                        external_id: string;
                        failure_code: string | null;
                        finished_at: string | null;
                        kind: "conversation" | "message" | "record" | "deletion";
                        memories: {
                            id: string;
                            replaced_by: string | null;
                            text: string;
                            trust_level: "confirmed" | "likely" | "disputed" | "not_kept";
                            type: "event" | "fact" | "plan" | "procedure";
                        }[];
                        memories_written: number;
                        memory_count: number;
                        private: boolean;
                        received_at: string;
                        source_id: string;
                        state: "waiting" | "sorted" | "superseded" | "cancelled" | "failed";
                        team_id: string | null;
                        text_start: string;
                        title: string | null;
                        turns: {
                            author: string;
                            author_kind: ("staff" | "agent" | "end_user" | "outsider") | null;
                            sent_at: string | null;
                            text: string;
                        }[];
                        version: number;
                    };
                };
            };
        };
    };
    add_messages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    items: ({
                        address?: string;
                        end_user_id?: string;
                        external_id: string;
                        kind: "conversation";
                        occurred_at?: string;
                        private?: boolean;
                        team_id?: string;
                        title?: string;
                        turns: {
                            at?: string;
                            end_second?: number;
                            speaker: string;
                            speaker_kind?: "staff" | "agent" | "end_user" | "outsider";
                            start_second?: number;
                            text: string;
                        }[];
                        version: number;
                    } | {
                        address?: string;
                        author: string;
                        author_kind?: "staff" | "agent" | "end_user" | "outsider";
                        conversation_id: string;
                        conversation_title?: string;
                        end_user_id?: string;
                        external_id: string;
                        kind: "message";
                        private?: boolean;
                        reactions?: number;
                        reply_to?: string;
                        sent_at: string;
                        team_id?: string;
                        text: string;
                        version: number;
                    } | {
                        address?: string;
                        end_user_id?: string;
                        external_id: string;
                        fields: {
                            [key: string]: string | number | boolean | null;
                        };
                        kind: "record";
                        title?: string;
                        version: number;
                    } | {
                        external_id: string;
                        kind: "deletion";
                        version: number;
                    })[];
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
                        results: {
                            external_id: string;
                            outcome: "stored" | "duplicate" | "stale" | "conflict";
                            version: number;
                        }[];
                    };
                };
            };
        };
    };
    start_memory_source_sign_in: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
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
                        expires_at: string;
                        sign_in_url: string;
                    };
                };
            };
        };
    };
    sync_memory_source: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
                source_id: string;
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
    tune_memory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
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
                        flagged_question_count: number;
                        judgement: {
                            decision_count: number;
                            right_count: number;
                            score: number;
                            scored_at: string;
                        } | null;
                        labelled_decisions: {
                            held_back_count: number;
                            tuning_count: number;
                        };
                        recall: {
                            depth: number;
                            mean_reciprocal_rank: number;
                            question_count: number;
                            score: number;
                            scored_at: string;
                        } | null;
                        scoring: boolean;
                        tuning: {
                            labelled_decisions_per_tuning: number;
                            labelled_decisions_since_tuning: number;
                            memory_changes_since_scoring: number | null;
                            saved_questions_changed: boolean;
                            started_at: string | null;
                            state: "up_to_date" | "new_input" | "queued" | "working";
                            tuned_at: string | null;
                        };
                    };
                };
            };
        };
    };
    get_memory_webhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
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
                        updated_at: string;
                        url: string;
                    };
                };
            };
        };
    };
    set_memory_webhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
                project_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    url: string;
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
                        signing_secret: string;
                        updated_at: string;
                        url: string;
                    };
                };
            };
        };
    };
    remove_memory_webhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                memory_id: string;
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
                        updated_at: string;
                        url: string;
                    };
                };
            };
        };
    };
    list_memory_webhook_deliveries: {
        parameters: {
            query?: {
                limit?: string;
                offset?: string;
                state?: string;
            };
            header?: never;
            path: {
                memory_id: string;
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
                        deliveries: {
                            attempts: number;
                            created_at: string;
                            decision_id: string;
                            delivered_at: string | null;
                            failure: string | null;
                            id: string;
                            next_attempt_at: string | null;
                            response_status: number | null;
                            state: "waiting" | "delivered" | "failed";
                            type: "decision_applied";
                        }[];
                        limit: number;
                        offset: number;
                        total_count: number;
                    };
                };
            };
        };
    };
}
