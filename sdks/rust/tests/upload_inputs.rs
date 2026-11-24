#[allow(dead_code, unused_imports)]
mod support;

use std::sync::{Arc, Mutex};

use himring::types::GetUploadInput;
use himring::{HimringApiErrorKind, ProgressError, UploadContent, UploadRead, UploadSource};
use support::records::{UPLOAD_ID, part_slices, random_bytes, sha256_of};
use support::uploads::{MULTIPART_CONTENT_BYTES, PART_BYTES, add_file_input, script_multipart};
use support::{ContractApi, KNOWLEDGE_BASE_ID, PROJECT_ID, StandInServer, client_for, refusal};

#[tokio::test]
async fn a_progress_callback_can_call_back_into_the_client() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    let himring = client_for(&contract.base_url);
    let states = Arc::new(Mutex::new(Vec::<String>::new()));
    let (reader, recorded) = (himring.clone(), Arc::clone(&states));
    let input = add_file_input(content.clone()).on_progress(move |sent| {
        let (reader, recorded) = (reader.clone(), Arc::clone(&recorded));
        async move {
            let upload = reader
                .get_upload(GetUploadInput::new(
                    PROJECT_ID,
                    KNOWLEDGE_BASE_ID,
                    UPLOAD_ID,
                ))
                .await?;
            recorded
                .lock()
                .expect("the state list is not poisoned")
                .push(format!("{}:{sent}", upload.state.as_str()));
            Ok::<(), ProgressError>(())
        }
    });

    himring.add_file(input).await.expect("the file is added");

    assert_eq!(
        states.lock().expect("the state list is not poisoned").len(),
        part_slices(&content, PART_BYTES).len()
    );
    assert_eq!(contract.requests_for("complete_upload").await.len(), 1);
    contract.assert_clean().await;
}

#[tokio::test]
async fn cancels_the_upload_when_the_progress_callback_fails() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = random_bytes(MULTIPART_CONTENT_BYTES);
    script_multipart(&contract, &storage, &content).await;
    let input = add_file_input(content).on_progress(|sent| async move {
        Err::<(), ProgressError>(format!("The caller gave up after {sent} bytes.").into())
    });

    let error = refusal(client_for(&contract.base_url).add_file(input).await);

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    assert!(
        error.message().contains("The caller gave up after"),
        "{}",
        error.message()
    );
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    assert!(contract.requests_for("complete_upload").await.is_empty());
}

struct ShrinkingSource;

impl UploadSource for ShrinkingSource {
    fn size_bytes(&self) -> u64 {
        MULTIPART_CONTENT_BYTES as u64
    }

    fn read(&self, start: u64, end: u64) -> UploadRead<'_> {
        let shorter =
            usize::try_from(end.saturating_sub(start).saturating_sub(1)).unwrap_or_default();
        Box::pin(async move { Ok(himring::Bytes::from(vec![b'x'; shorter])) })
    }
}

#[tokio::test]
async fn cancels_the_upload_when_the_file_shrinks_while_it_is_sent() {
    let (contract, storage) = (ContractApi::start().await, StandInServer::start().await);
    let content = vec![b'x'; MULTIPART_CONTENT_BYTES];
    script_multipart(&contract, &storage, &content).await;
    let input = add_file_input(UploadContent::Source(Arc::new(ShrinkingSource)))
        .content_sha256(sha256_of(&content));

    let error = refusal(client_for(&contract.base_url).add_file(input).await);

    assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput);
    assert_eq!(contract.requests_for("cancel_upload").await.len(), 1);
    assert!(storage.arrived(Some("PUT")).is_empty());
}

#[tokio::test]
async fn refuses_a_sha256_that_is_not_lowercase_hex_before_sending() {
    let contract = ContractApi::start().await;
    let himring = client_for(&contract.base_url);
    for digest in [
        "A".repeat(64),
        "0".repeat(63),
        "g".repeat(64),
        String::new(),
    ] {
        let error = refusal(
            himring
                .add_file(add_file_input(b"data".as_slice()).content_sha256(digest.clone()))
                .await,
        );

        assert_eq!(error.kind(), HimringApiErrorKind::InvalidInput, "{digest}");
    }
    contract.assert_untouched().await;
}
