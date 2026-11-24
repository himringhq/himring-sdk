use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::SystemTime;

use bytes::Bytes;
use futures_util::future::try_join_all;
use futures_util::stream;
use serde::Deserialize;
use serde::de::IgnoredAny;

use crate::backoff::backoff;
use crate::client::Himring;
use crate::download::Download;
use crate::errors::{HimringApiError, HimringApiErrorKind, invalid_input};
use crate::operation_call::OperationCall;
use crate::storage::{get_from_storage, put_to_storage};
use crate::transfer_inputs::{AddFileInput, DownloadFileInput, ProgressCallback};
use crate::types::{
    CancelUploadInput, CompleteUploadInput, CreateUploadInput, GetDownloadLinkInput,
    GetDownloadLinkInputDisposition, GetUploadInput, GetUploadOutputMethod, GetUploadOutputState,
    SignUploadPartsInput, SignUploadPartsInputPartsItem, SignUploadPartsOutput,
};
use crate::upload_plan::{
    AddedFile, CHECK_POLL_FIRST, CHECK_POLL_MAXIMUM, HTTP_FORBIDDEN, PARTS_IN_FLIGHT,
    RESIGNED_STATUSES, SEND_ATTEMPTS, SignedPart, UploadRecord, added_file_of, checked_layout,
    checked_range, checked_record, checked_sha256, checked_signed_part, expected_part_bytes,
    give_up_at, left_open_error, part_of, should_cancel, still_checking_error, storage_refusal,
};
use crate::upload_source::{LockedSource, STREAM_CHUNK_BYTES, content_sha256_of, sha256_hex_of};

#[derive(Deserialize)]
struct CreatedUpload {
    upload: UploadRecord,
    parts: Vec<SignedPart>,
}

#[derive(Clone)]
#[allow(clippy::struct_field_names)]
struct UploadIds {
    project_id: String,
    knowledge_base_id: String,
    upload_id: String,
}

struct CancelOnDrop {
    client: Himring,
    ids: UploadIds,
    armed: bool,
}

impl Drop for CancelOnDrop {
    fn drop(&mut self) {
        if !self.armed {
            return;
        }
        let Ok(runtime) = tokio::runtime::Handle::try_current() else {
            return;
        };
        let client = self.client.clone();
        let ids = self.ids.clone();
        runtime.spawn(async move { client.cancel_quietly(&ids).await });
    }
}

struct Upload<'a> {
    client: &'a Himring,
    ids: &'a UploadIds,
    source: Arc<LockedSource>,
    on_progress: Option<ProgressCallback>,
}

fn source_body(source: Arc<LockedSource>, end: u64) -> reqwest::Body {
    let windows = stream::try_unfold((source, 0_u64), move |(source, start)| async move {
        if start >= end {
            return Ok(None);
        }
        let stop = end.min(start + STREAM_CHUNK_BYTES);
        let window: Bytes = source.read(start, stop).await?;
        Ok::<_, HimringApiError>(Some((window, (source, stop))))
    });
    reqwest::Body::wrap_stream(windows)
}

fn is_unreachable(error: &HimringApiError) -> bool {
    matches!(
        error.kind(),
        HimringApiErrorKind::Network | HimringApiErrorKind::Timeout
    )
}

impl Upload<'_> {
    async fn sign(
        &self,
        part_number: u64,
        sha256: &str,
        size_bytes: u64,
    ) -> Result<SignedPart, HimringApiError> {
        let number = i64::try_from(part_number)
            .map_err(|_| invalid_input("The file holds too many parts.", None))?;
        let input = SignUploadPartsInput::new(
            self.ids.project_id.clone(),
            self.ids.knowledge_base_id.clone(),
            self.ids.upload_id.clone(),
            vec![SignUploadPartsInputPartsItem::new(number, sha256)],
        );
        let signed: SignUploadPartsOutput = self.client.sign_upload_parts(input).await?;
        checked_signed_part(part_of(signed.parts, part_number)?, part_number, size_bytes)
    }

    async fn report(&self, bytes_sent: u64) -> Result<(), HimringApiError> {
        let Some(callback) = &self.on_progress else {
            return Ok(());
        };
        callback(bytes_sent).await.map_err(|error| {
            HimringApiError::new(
                HimringApiErrorKind::InvalidInput,
                format!(
                    "The progress callback stopped the upload after {bytes_sent} bytes: {error}"
                ),
            )
        })
    }

    async fn send_part(
        &self,
        first: SignedPart,
        sha256: &str,
        body: &(dyn Fn() -> reqwest::Body + Send + Sync),
    ) -> Result<(), HimringApiError> {
        let mut signed = first;
        let mut attempt = 1;
        loop {
            let size = expected_size_of(&signed)?;
            let number = expected_number_of(&signed)?;
            let idle = self.client.inner.settings.upload_idle_timeout;
            let answer =
                match put_to_storage(&self.client.inner.http, &signed, body(), size, idle).await {
                    Ok(answer) => answer,
                    Err(error) => {
                        if attempt >= SEND_ATTEMPTS || !is_unreachable(&error) {
                            return Err(error);
                        }
                        tokio::time::sleep(backoff(attempt, None).unwrap_or_default()).await;
                        attempt += 1;
                        signed = self.sign(number, sha256, size).await?;
                        continue;
                    }
                };
            if (200..300).contains(&answer.status) {
                return self.report(size).await;
            }
            let wait = if !RESIGNED_STATUSES.contains(&answer.status) {
                None
            } else if answer.status == HTTP_FORBIDDEN {
                Some(std::time::Duration::ZERO)
            } else {
                backoff(attempt, answer.retry_after_seconds)
            };
            let Some(wait) = wait.filter(|_| attempt < SEND_ATTEMPTS) else {
                return Err(storage_refusal(answer.status, number));
            };
            tokio::time::sleep(wait).await;
            attempt += 1;
            signed = self.sign(number, sha256, size).await?;
        }
    }

    async fn send_single(
        &self,
        first: Option<SignedPart>,
        sha256: &str,
    ) -> Result<(), HimringApiError> {
        let size = self.source.size_bytes;
        let signed = match first {
            Some(part) => checked_signed_part(part, 1, size)?,
            None => self.sign(1, sha256, size).await?,
        };
        let source = Arc::clone(&self.source);
        let body = move || source_body(Arc::clone(&source), size);
        self.send_part(signed, sha256, &body).await
    }

    async fn send_multipart(
        &self,
        part_bytes: u64,
        part_count: u64,
    ) -> Result<(), HimringApiError> {
        let next = AtomicU64::new(1);
        let lane = || async {
            loop {
                let part_number = next.fetch_add(1, Ordering::Relaxed);
                if part_number > part_count {
                    return Ok::<(), HimringApiError>(());
                }
                let size = expected_part_bytes(self.source.size_bytes, part_bytes, part_number);
                let start = (part_number - 1) * part_bytes;
                let data = self.source.read(start, start + size).await?;
                let sha256 = sha256_hex_of(data.clone()).await?;
                let first = self.sign(part_number, &sha256, size).await?;
                let body = move || reqwest::Body::from(data.clone());
                self.send_part(first, &sha256, &body).await?;
            }
        };
        let lanes =
            usize::try_from(part_count).map_or(PARTS_IN_FLIGHT, |count| count.min(PARTS_IN_FLIGHT));
        try_join_all((0..lanes).map(|_| lane())).await.map(|_| ())
    }

    async fn settled(&self, upload: UploadRecord) -> Result<UploadRecord, HimringApiError> {
        let mut current = upload;
        let mut wait = CHECK_POLL_FIRST;
        let limit = give_up_at(&current);
        let upload_id = current.id.clone();
        while current.state == GetUploadOutputState::Checking {
            if SystemTime::now() > limit {
                return Err(still_checking_error(&upload_id));
            }
            tokio::time::sleep(wait).await;
            wait = (wait * 2).min(CHECK_POLL_MAXIMUM);
            current = self.client.read_upload(self.ids).await?;
        }
        if current.state == GetUploadOutputState::Open {
            return Err(left_open_error(&upload_id));
        }
        Ok(current)
    }

    async fn sent_and_settled(
        &self,
        created: CreatedUpload,
        sha256: &str,
        layout: (u64, u64),
    ) -> Result<UploadRecord, HimringApiError> {
        let sent = if created.upload.method == GetUploadOutputMethod::Single {
            self.send_single(created.parts.into_iter().next(), sha256)
                .await
        } else {
            self.send_multipart(layout.0, layout.1).await
        };
        match sent {
            Ok(()) => {
                let input = CompleteUploadInput::new(
                    self.ids.project_id.clone(),
                    self.ids.knowledge_base_id.clone(),
                    self.ids.upload_id.clone(),
                );
                let completed: UploadRecord =
                    OperationCall::new(self.client, "complete_upload", &input).await?;
                self.settled(completed).await
            }
            Err(error) if error.is_refusal("upload_closed") => {
                self.settled(self.client.read_upload(self.ids).await?).await
            }
            Err(error) => Err(error),
        }
    }
}

fn expected_size_of(part: &SignedPart) -> Result<u64, HimringApiError> {
    crate::upload_plan::whole_number(part.size_bytes)
        .ok_or_else(|| crate::errors::invalid_response("The API signed a part with no whole size."))
}

fn expected_number_of(part: &SignedPart) -> Result<u64, HimringApiError> {
    crate::upload_plan::whole_number(part.part_number).ok_or_else(|| {
        crate::errors::invalid_response("The API signed a part with no whole number.")
    })
}

impl Himring {
    async fn read_upload(&self, ids: &UploadIds) -> Result<UploadRecord, HimringApiError> {
        let input = GetUploadInput::new(
            ids.project_id.clone(),
            ids.knowledge_base_id.clone(),
            ids.upload_id.clone(),
        );
        self.get_upload(input).await
    }

    async fn cancel_quietly(&self, ids: &UploadIds) {
        let input = CancelUploadInput::new(
            ids.project_id.clone(),
            ids.knowledge_base_id.clone(),
            ids.upload_id.clone(),
        );
        let _: Result<IgnoredAny, HimringApiError> =
            OperationCall::new(self, "cancel_upload", &input).await;
    }

    pub async fn add_file(&self, input: AddFileInput) -> Result<AddedFile, HimringApiError> {
        let given_sha256 = checked_sha256(input.content_sha256)?;
        let source = Arc::new(LockedSource::of(input.content).await?);
        let sha256 = match given_sha256 {
            Some(digest) => digest,
            None => content_sha256_of(&source).await?,
        };
        let size_bytes = i64::try_from(source.size_bytes).map_err(|_| {
            invalid_input("The file is larger than the API can take.", Some("content"))
        })?;
        let mut create = CreateUploadInput::new(
            input.project_id.clone(),
            input.knowledge_base_id.clone(),
            input.path,
            size_bytes,
            sha256.clone(),
        );
        create.address = input.address;
        create.metadata = input.metadata;
        let created: CreatedUpload = OperationCall::new(self, "create_upload", &create).await?;
        if created.upload.state != GetUploadOutputState::Open {
            return added_file_of(checked_record(created.upload, source.size_bytes, &sha256)?);
        }
        let ids = UploadIds {
            project_id: input.project_id,
            knowledge_base_id: input.knowledge_base_id,
            upload_id: created.upload.id.clone(),
        };
        let mut guard = CancelOnDrop {
            client: self.clone(),
            ids: ids.clone(),
            armed: true,
        };
        let upload = Upload {
            client: self,
            ids: &ids,
            source: Arc::clone(&source),
            on_progress: input.on_progress,
        };
        let outcome = async {
            let checked = checked_record(created.upload.clone(), source.size_bytes, &sha256)?;
            let layout = checked_layout(&checked, source.size_bytes)?;
            let settled = upload.sent_and_settled(created, &sha256, layout).await?;
            added_file_of(checked_record(settled, source.size_bytes, &sha256)?)
        }
        .await;
        guard.armed = false;
        if let Err(error) = &outcome
            && should_cancel(error)
        {
            self.cancel_quietly(&ids).await;
        }
        outcome
    }

    pub async fn download_file(
        &self,
        input: DownloadFileInput,
    ) -> Result<Download, HimringApiError> {
        let range = checked_range(input.range)?;
        let mut link_input = GetDownloadLinkInput::new(
            input.project_id,
            input.knowledge_base_id,
            input.file_id,
            input.version.to_string(),
        )
        .disposition(GetDownloadLinkInputDisposition::Attachment);
        link_input.rendition = input.rendition;
        let link = self.get_download_link(link_input).await?;
        get_from_storage(
            &self.inner.http,
            &link,
            range.as_deref(),
            self.inner.settings.timeout,
        )
        .await
    }
}
