use std::io;
use std::pin::Pin;
use std::sync::{Arc, Mutex};

use bytes::{Bytes, BytesMut};
use futures_util::stream;
use tokio::io::{AsyncRead, AsyncReadExt};

use crate::errors::{HimringApiError, invalid_input};
use crate::file_content::{FILE_CONTENT_FIELD, FileSource};
use crate::idle_clock::IdleClock;
use crate::request_parts::FileBody;

const FILE_CHUNK_BYTES: usize = 64 * 1024;
const MEMORY_CHUNK_BYTES: usize = 1024 * 1024;

#[derive(Clone, Default)]
pub(crate) struct AbortSlot(Arc<Mutex<Option<HimringApiError>>>);

impl AbortSlot {
    fn store(&self, error: HimringApiError) -> io::Error {
        let message = error.message().to_owned();
        if let Ok(mut slot) = self.0.lock() {
            slot.get_or_insert(error);
        }
        io::Error::other(message)
    }

    pub fn take(&self) -> Option<HimringApiError> {
        self.0.lock().ok().and_then(|mut slot| slot.take())
    }
}

fn too_large(body: &BodyState) -> HimringApiError {
    invalid_input(
        format!(
            "{} takes a file of at most {} bytes, and this one holds more.",
            body.operation_id, body.maximum_bytes
        ),
        Some(FILE_CONTENT_FIELD),
    )
}

fn changed_size() -> HimringApiError {
    invalid_input(
        "The file changed size while the client sent it. Send it again once nothing writes to it.",
        Some(FILE_CONTENT_FIELD),
    )
}

struct BodyState {
    operation_id: &'static str,
    maximum_bytes: u64,
    size_bytes: Option<u64>,
    reader: Option<Pin<Box<dyn AsyncRead + Send>>>,
    memory: Option<Bytes>,
    sent: u64,
    clock: Arc<IdleClock>,
    abort: AbortSlot,
    finished: bool,
}

impl BodyState {
    async fn next_chunk(&mut self) -> Result<Option<Bytes>, HimringApiError> {
        self.clock.touch();
        if let Some(memory) = &mut self.memory {
            if memory.is_empty() {
                return Ok(None);
            }
            let take = memory.len().min(MEMORY_CHUNK_BYTES);
            return Ok(Some(memory.split_to(take)));
        }
        let Some(reader) = &mut self.reader else {
            return Ok(None);
        };
        let mut buffer = BytesMut::zeroed(FILE_CHUNK_BYTES);
        let read = reader.read(&mut buffer).await.map_err(|error| {
            invalid_input(
                "The client could not read the file.",
                Some(FILE_CONTENT_FIELD),
            )
            .caused_by(error)
        })?;
        self.clock.touch();
        if read == 0 {
            if self.size_bytes.is_some_and(|size| size != self.sent) {
                return Err(changed_size());
            }
            return Ok(None);
        }
        let total = self.sent + read as u64;
        if total > self.maximum_bytes {
            return Err(too_large(self));
        }
        if self.size_bytes.is_some_and(|size| total > size) {
            return Err(changed_size());
        }
        self.sent = total;
        buffer.truncate(read);
        Ok(Some(buffer.freeze()))
    }
}

pub(crate) fn upload_body_of(
    body: FileBody,
    clock: Arc<IdleClock>,
    abort: AbortSlot,
) -> reqwest::Body {
    let (memory, reader) = match body.content.source {
        FileSource::Bytes(bytes) => (Some(bytes), None),
        FileSource::Reader(reader) => (None, Some(reader)),
    };
    let state = BodyState {
        operation_id: body.operation_id,
        maximum_bytes: body.maximum_bytes,
        size_bytes: body.content.size_bytes,
        reader,
        memory,
        sent: 0,
        clock,
        abort,
        finished: false,
    };
    let chunks = stream::unfold(state, |mut state| async move {
        if state.finished {
            return None;
        }
        match state.next_chunk().await {
            Ok(Some(chunk)) => Some((Ok::<Bytes, io::Error>(chunk), state)),
            Ok(None) => None,
            Err(error) => {
                state.finished = true;
                let failure = state.abort.store(error);
                Some((Err(failure), state))
            }
        }
    });
    reqwest::Body::wrap_stream(chunks)
}
