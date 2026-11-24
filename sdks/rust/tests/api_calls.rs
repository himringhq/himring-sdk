#[allow(dead_code, unused_imports)]
mod support;

use himring::types::{
    GetDatabaseInput, ListDatabasesInput, ListDatabasesInputDirection, ListDatabasesInputSort,
    ListDatabasesInputState, SearchKnowledgeBaseInput,
};
use himring::{Himring, HimringApiErrorKind, IssuePathPart};
use serde_json::{Map, Value, json};
use support::{API_KEY, ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, client_for, refusal};

fn empty_database_page() -> Value {
    json!({ "databases": [], "total_count": 0, "limit": 20, "offset": 0 })
}

fn search_answer() -> Value {
    json!({ "question_id": "qst_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "duration_ms": 4, "passages": [], "memories": [], "recall_id": null })
}

fn fields(value: Value) -> Map<String, Value> {
    match value {
        Value::Object(fields) => fields,
        _ => panic!("the test passes an object"),
    }
}

#[tokio::test]
async fn sends_the_api_key_the_path_and_the_query_that_the_document_describes() {
    let contract = ContractApi::start().await;
    contract
        .stub("list_databases", 200, empty_database_page())
        .await;
    let himring = client_for(&contract.base_url);

    let page = himring
        .list_databases(
            ListDatabasesInput::new(PROJECT_ID)
                .state(ListDatabasesInputState::Deleted)
                .sort(ListDatabasesInputSort::Name)
                .limit("5"),
        )
        .await
        .expect("the listing succeeds");

    assert_eq!(page.databases, []);
    assert_eq!(
        [page.total_count, page.limit, page.offset].map(f64::to_bits),
        [0.0, 20.0, 0.0].map(f64::to_bits)
    );
    let requests = contract.assert_clean().await;
    let [request] = requests.as_slice() else {
        panic!("one request arrived: {requests:?}")
    };
    assert_eq!(request.operation_id.as_deref(), Some("list_databases"));
    assert_eq!(
        request.header("authorization"),
        Some(format!("Bearer {API_KEY}").as_str())
    );
    assert_eq!(request.path_parameters, json!({ "project_id": PROJECT_ID }));
    assert_eq!(
        request.query,
        json!({ "state": "deleted", "sort": "name", "limit": "5" })
    );
    assert_eq!(request.raw_body_bytes, 0);
}

#[tokio::test]
async fn sends_the_json_body_fields_and_leaves_out_the_ones_not_given() {
    let contract = ContractApi::start().await;
    contract
        .stub("search_knowledge_base", 200, search_answer())
        .await;
    let himring = client_for(&contract.base_url);
    let question = "When do you open on Sunday? — \u{1f600}";

    let found = himring
        .search_knowledge_base(
            SearchKnowledgeBaseInput::new(PROJECT_ID, KNOWLEDGE_BASE_ID, question).limit(3_i64),
        )
        .await
        .expect("the search succeeds");

    assert_eq!(found.question_id, search_answer()["question_id"]);
    let requests = contract.assert_clean().await;
    let [request] = requests.as_slice() else {
        panic!("one request arrived")
    };
    assert_eq!(request.header("content-type"), Some("application/json"));
    assert_eq!(request.body, json!({ "question": question, "limit": 3 }));
}

#[tokio::test]
async fn a_hostile_path_value_reaches_the_api_as_one_literal_segment() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);
    for hostile in [
        "%2F",
        "a/b",
        "../../v1/projects",
        "..%2F..%2F",
        "?state=deleted",
        "#fragment",
        "café ☃",
        " ",
        "...",
    ] {
        let error = refusal(
            himring
                .get_database(GetDatabaseInput::new(PROJECT_ID, hostile))
                .await,
        );

        assert_eq!(
            (error.kind(), error.code()),
            (HimringApiErrorKind::Refused, Some("validation_failed")),
            "{hostile}"
        );
        let requests = contract.requests_for("get_database").await;
        let request = requests.last().expect("the request reached get_database");
        assert_eq!(
            request.path_parameters,
            json!({ "project_id": PROJECT_ID, "database_id": hostile })
        );
    }
    assert_eq!(contract.recorded().await.0.len(), 9);
}

#[tokio::test]
async fn refuses_an_empty_or_dot_path_value_before_sending() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);
    for hostile in ["", ".", ".."] {
        let error = refusal(
            himring
                .get_database(GetDatabaseInput::new(PROJECT_ID, hostile))
                .await,
        );

        assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
        let paths: Vec<Vec<IssuePathPart>> = error
            .issues()
            .iter()
            .map(|issue| issue.path.clone())
            .collect();
        assert_eq!(
            paths,
            vec![vec![IssuePathPart::Field("database_id".to_owned())]]
        );
    }
    contract.assert_untouched().await;
}

#[tokio::test]
async fn refuses_an_unknown_query_field_an_unknown_operation_and_an_object_in_the_query_before_sending()
 {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);

    let unknown_field = refusal(
        himring
            .invoke(
                "list_databases",
                fields(json!({ "project_id": PROJECT_ID, "include_deleted": "true" })),
            )
            .await,
    );
    let unknown_operation = refusal(
        himring
            .invoke(
                "drop_every_database",
                fields(json!({ "project_id": PROJECT_ID })),
            )
            .await,
    );
    let object_in_query = refusal(
        himring
            .invoke(
                "list_databases",
                fields(json!({ "project_id": PROJECT_ID, "search": { "or": "1=1" } })),
            )
            .await,
    );

    assert_eq!(unknown_field.kind(), HimringApiErrorKind::InvalidInput);
    assert_eq!(
        unknown_field.issues()[0].path,
        vec![IssuePathPart::Field("include_deleted".to_owned())]
    );
    assert_eq!(unknown_operation.kind(), HimringApiErrorKind::InvalidInput);
    assert_eq!(object_in_query.kind(), HimringApiErrorKind::InvalidInput);
    assert_eq!(
        object_in_query.issues()[0].path,
        vec![IssuePathPart::Field("search".to_owned())]
    );
    contract.assert_untouched().await;
}

#[tokio::test]
async fn joins_list_query_values_with_commas_and_spells_booleans_in_lowercase() {
    let contract = ContractApi::start().await;
    contract
        .stub("list_databases", 200, empty_database_page())
        .await;
    let himring = client_for(&contract.base_url);

    himring
        .invoke(
            "list_databases",
            fields(json!({ "project_id": PROJECT_ID, "search": ["refund", "policy, 2026", true], "offset": 0, "state": null })),
        )
        .await
        .expect("the listing succeeds");

    let requests = contract.assert_clean().await;
    assert_eq!(
        requests[0].query,
        json!({ "search": "refund,policy, 2026,true", "offset": "0" })
    );
}

#[tokio::test]
async fn reads_every_field_of_a_documented_refusal() {
    let contract = ContractApi::start().await;
    let envelope = json!({
        "error": {
            "code": "api_key_permission_missing",
            "message": "The key may not read databases.",
            "details": "Ask an owner to add the permission.",
            "request_id": "req_body",
            "issues": [{ "message": "Not allowed.", "path": ["project_id", 0] }],
            "missing_permission": { "resource_kind": "database", "level": "read", "resource_id": null },
        }
    });
    contract
        .stub_with_headers(
            "list_databases",
            403,
            envelope,
            json!({ "retry-after": "7" }),
        )
        .await;
    let himring = client_for(&contract.base_url);

    let error = refusal(
        himring
            .list_databases(ListDatabasesInput::new(PROJECT_ID))
            .await,
    );

    contract.assert_clean().await;
    assert_eq!(
        (error.kind(), error.status(), error.code()),
        (
            HimringApiErrorKind::Refused,
            Some(403),
            Some("api_key_permission_missing")
        )
    );
    assert_eq!(error.message(), "The key may not read databases.");
    assert_eq!(error.details(), Some("Ask an owner to add the permission."));
    assert_eq!(error.request_id(), Some("req_body"));
    assert_eq!(error.retry_after_seconds(), Some(7));
    assert_eq!(error.issues()[0].message, "Not allowed.");
    assert_eq!(
        error.issues()[0].path,
        vec![
            IssuePathPart::Field("project_id".to_owned()),
            IssuePathPart::Index(serde_json::Number::from(0))
        ]
    );
    let missing = error
        .missing_permission()
        .expect("the refusal names the missing permission");
    assert_eq!(
        (
            missing.resource_kind.as_str(),
            missing.resource_id.as_deref()
        ),
        ("database", None)
    );
    assert!(error.is_documented_code());
}

#[tokio::test]
async fn a_session_token_reaches_the_api_and_a_rate_limit_comes_back_as_a_refusal() {
    let contract = ContractApi::start().await;
    contract
        .stub("list_databases", 200, empty_database_page())
        .await;
    contract
        .stub(
            "search_knowledge_base",
            429,
            json!({ "error": { "code": "rate_limited", "message": "Wait." } }),
        )
        .await;
    let himring = Himring::builder()
        .session_token("st_session")
        .base_url(&contract.base_url)
        .build()
        .expect("the client builds");

    himring
        .list_databases(
            ListDatabasesInput::new(PROJECT_ID).direction(ListDatabasesInputDirection::Asc),
        )
        .await
        .expect("the listing succeeds");
    let error = refusal(
        himring
            .search_knowledge_base(SearchKnowledgeBaseInput::new(
                PROJECT_ID,
                KNOWLEDGE_BASE_ID,
                "Hours?",
            ))
            .await,
    );

    assert_eq!(
        (error.kind(), error.status(), error.code()),
        (
            HimringApiErrorKind::Refused,
            Some(429),
            Some("rate_limited")
        )
    );
    let requests = contract.assert_clean().await;
    assert_eq!(
        requests[0].header("authorization"),
        Some("Bearer st_session")
    );
    assert_eq!(requests[0].query, json!({ "direction": "asc" }));
    assert_eq!(requests[1].body, json!({ "question": "Hours?" }));
}
