#[allow(dead_code, unused_imports)]
mod support;

use himring::types::{
    DownloadIndexInput, ExportIndexRecordsInput, ImportSavedQuestionsInput,
    ImportSavedQuestionsInputFormat,
};
use himring::{FileContent, HimringApiErrorKind, safe_download_name};
use serde_json::{Value, json};
use support::records::random_bytes;
use support::{ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, client_for, refusal};
use tokio::io::AsyncReadExt;

const SAVED_QUESTIONS_LIMIT_BYTES: usize = 4 * 1024 * 1024;
const INDEX_ID: &str = "ix_33333333333333333333333333333333";
const EXPORTED_LINES: &str = "{\"id\": \"rec_1\", \"text\": \"Refunds take 5 days.\"}\n";

fn import_answer() -> Value {
    json!({ "added": 0, "refused_count": 0, "refused": [], "saved_questions": [] })
}

fn saved_questions_input() -> ImportSavedQuestionsInput {
    ImportSavedQuestionsInput::new(PROJECT_ID, KNOWLEDGE_BASE_ID)
        .format(ImportSavedQuestionsInputFormat::Jsonl)
}

#[tokio::test]
async fn sends_a_file_of_exactly_the_documented_limit_as_octet_stream() {
    let contract = ContractApi::start().await;
    contract
        .stub("import_saved_questions", 201, import_answer())
        .await;
    let himring = client_for(&contract.base_url);

    let imported = himring
        .import_saved_questions(
            saved_questions_input(),
            FileContent::from_bytes(random_bytes(SAVED_QUESTIONS_LIMIT_BYTES)),
        )
        .await
        .expect("the import succeeds");

    assert_eq!(imported.refused, []);
    let requests = contract.assert_clean().await;
    let [request] = requests.as_slice() else {
        panic!("one request arrived")
    };
    assert_eq!(request.raw_body_bytes, SAVED_QUESTIONS_LIMIT_BYTES as u64);
    assert_eq!(
        request.header("content-type"),
        Some("application/octet-stream")
    );
    assert_eq!(
        request.header("content-length"),
        Some(SAVED_QUESTIONS_LIMIT_BYTES.to_string().as_str())
    );
    assert_eq!(request.query, json!({ "format": "jsonl" }));
}

#[tokio::test]
async fn streams_a_reader_of_exactly_the_limit_and_refuses_one_byte_past_it_before_sending() {
    let contract = ContractApi::start().await;
    contract
        .stub("import_saved_questions", 201, import_answer())
        .await;
    let himring = client_for(&contract.base_url);
    let content = random_bytes(SAVED_QUESTIONS_LIMIT_BYTES);
    let mut oversized = content.clone();
    oversized.push(b'q');

    himring
        .import_saved_questions(
            saved_questions_input(),
            FileContent::from_reader(std::io::Cursor::new(content)),
        )
        .await
        .expect("the import succeeds");
    let error = refusal(
        himring
            .import_saved_questions(saved_questions_input(), FileContent::from_bytes(oversized))
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    let requests = contract.assert_clean().await;
    let [request] = requests.as_slice() else {
        panic!("only the file within the limit arrived")
    };
    assert_eq!(request.raw_body_bytes, SAVED_QUESTIONS_LIMIT_BYTES as u64);
}

#[tokio::test]
async fn refuses_a_file_on_disk_one_byte_past_the_limit_before_sending() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);
    let folder = std::env::temp_dir().join(format!(
        "himring-sdk-rust-{}",
        support::identifier("bodies")
    ));
    std::fs::create_dir_all(&folder).expect("the test folder is created");
    let path = folder.join("questions.jsonl");
    std::fs::write(&path, vec![b'q'; SAVED_QUESTIONS_LIMIT_BYTES + 1])
        .expect("the file is written");
    let file = tokio::fs::File::open(&path).await.expect("the file opens");

    let content = FileContent::from_file(file)
        .await
        .expect("the file is measured");
    let error = refusal(
        himring
            .import_saved_questions(saved_questions_input(), content)
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    contract.assert_untouched().await;
    std::fs::remove_dir_all(&folder).expect("the test folder is removed");
}

#[tokio::test]
async fn stops_an_unmeasurable_stream_once_it_passes_the_limit() {
    let contract = ContractApi::start().await;
    contract
        .stub("import_saved_questions", 201, import_answer())
        .await;
    let himring = client_for(&contract.base_url);
    let endless = tokio::io::repeat(b'q').take(SAVED_QUESTIONS_LIMIT_BYTES as u64 * 4);

    let error = refusal(
        himring
            .import_saved_questions(saved_questions_input(), FileContent::from_reader(endless))
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    assert_eq!(
        error.issues()[0].path,
        vec![himring::IssuePathPart::Field("content".to_owned())]
    );
    assert!(
        contract
            .requests_for("import_saved_questions")
            .await
            .is_empty()
    );
}

#[tokio::test]
async fn a_reader_that_fails_midway_fails_the_call_and_never_completes_the_body() {
    let contract = ContractApi::start().await;
    contract
        .stub("import_saved_questions", 201, import_answer())
        .await;
    let himring = client_for(&contract.base_url);
    let failing = std::io::Cursor::new(vec![b'q'; 70_000]).chain(FailingReader);

    let error = refusal(
        himring
            .import_saved_questions(saved_questions_input(), FileContent::from_reader(failing))
            .await,
    );

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    let cause = std::error::Error::source(&error)
        .map(ToString::to_string)
        .unwrap_or_default();
    assert!(cause.contains("disk went away"), "{cause}");
    assert!(
        contract
            .requests_for("import_saved_questions")
            .await
            .is_empty()
    );
}

struct FailingReader;

impl tokio::io::AsyncRead for FailingReader {
    fn poll_read(
        self: std::pin::Pin<&mut Self>,
        _context: &mut std::task::Context<'_>,
        _buffer: &mut tokio::io::ReadBuf<'_>,
    ) -> std::task::Poll<std::io::Result<()>> {
        std::task::Poll::Ready(Err(std::io::Error::other("The disk went away.")))
    }
}

struct DownloadName {
    disposition: &'static str,
    expected: String,
    safe: String,
}

fn download_names() -> Vec<DownloadName> {
    let named = |disposition, expected: &str, safe: &str| DownloadName {
        disposition,
        expected: expected.to_owned(),
        safe: safe.to_owned(),
    };
    vec![
        named(
            "attachment; filename*=UTF-8''r%C3%A9sum%C3%A9%20%E2%82%AC.ndjson",
            "résumé €.ndjson",
            "resume_.ndjson",
        ),
        named(
            "attachment; filename=\"../../../etc/passwd\"",
            "../../../etc/passwd",
            "passwd",
        ),
        named(
            "attachment; filename*=UTF-8''%C3%28.ndjson; filename=\"plain.ndjson\"",
            "plain.ndjson",
            "plain.ndjson",
        ),
        named(
            "attachment; filename*=UTF-8''%E2%82.ndjson",
            &format!("{INDEX_ID}.ndjson"),
            &format!("{INDEX_ID}.ndjson"),
        ),
        named(
            "attachment; filename=\"..\\\\..\\\\boot.ini\"",
            "..\\\\..\\\\boot.ini",
            "boot.ini",
        ),
    ]
}

#[tokio::test]
async fn names_a_download_from_its_content_disposition_and_keeps_the_safe_name_safe() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);
    for case in download_names() {
        let headers = json!({ "content-type": "application/x-ndjson", "content-disposition": case.disposition });
        contract
            .stub_with_headers("export_index_records", 200, json!(EXPORTED_LINES), headers)
            .await;

        let download = himring
            .export_index_records(ExportIndexRecordsInput::new(PROJECT_ID, INDEX_ID))
            .await
            .expect("the export starts");
        let (file_name, content_type, content_length) = (
            download.file_name().to_owned(),
            download.content_type().to_owned(),
            download.content_length(),
        );
        let content = download.read().await.expect("the export reads to the end");

        assert_eq!(
            content,
            serde_json::to_vec(&json!(EXPORTED_LINES)).expect("the lines serialize")
        );
        assert_eq!(file_name, case.expected, "{}", case.disposition);
        assert_eq!(
            safe_download_name(&file_name, "export.ndjson"),
            case.safe,
            "{}",
            case.disposition
        );
        assert_eq!(content_type, "application/x-ndjson");
        assert_eq!(content_length, Some(content.len() as u64));
    }
    contract.assert_clean().await;
}

#[tokio::test]
async fn a_refused_download_returns_the_refusal_and_no_stream() {
    let contract = ContractApi::start().await;
    contract
        .stub(
            "download_index",
            404,
            json!({ "error": { "code": "index_not_found", "message": "Gone." } }),
        )
        .await;
    let himring = client_for(&contract.base_url);

    let error = refusal(
        himring
            .download_index(DownloadIndexInput::new(PROJECT_ID, INDEX_ID))
            .await,
    );

    assert_eq!(
        (error.kind(), error.code()),
        (HimringApiErrorKind::Refused, Some("index_not_found"))
    );
    contract.assert_clean().await;
}
