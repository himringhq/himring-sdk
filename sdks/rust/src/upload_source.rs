use std::fmt;
use std::future::Future;
use std::io::{self, SeekFrom};
use std::pin::Pin;
use std::sync::Arc;

use bytes::{Bytes, BytesMut};
use sha2::{Digest, Sha256};
use tokio::io::{AsyncReadExt, AsyncSeekExt};
use tokio::sync::Mutex;

use crate::errors::{HimringApiError, invalid_input};
use crate::file_content::FILE_CONTENT_FIELD;

const DIGEST_WINDOW_BYTES: u64 = 8 * 1024 * 1024;
pub(crate) const STREAM_CHUNK_BYTES: u64 = 1024 * 1024;

pub type UploadRead<'a> = Pin<Box<dyn Future<Output = io::Result<Bytes>> + Send + 'a>>;

pub trait UploadSource: Send + Sync {
    fn size_bytes(&self) -> u64;
    fn read(&self, start: u64, end: u64) -> UploadRead<'_>;
}

pub enum UploadContent {
    Bytes(Bytes),
    File(tokio::fs::File),
    Source(Arc<dyn UploadSource>),
}

impl fmt::Debug for UploadContent {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(match self {
            Self::Bytes(_) => "UploadContent::Bytes",
            Self::File(_) => "UploadContent::File",
            Self::Source(_) => "UploadContent::Source",
        })
    }
}

impl From<Bytes> for UploadContent {
    fn from(bytes: Bytes) -> Self {
        Self::Bytes(bytes)
    }
}

impl From<Vec<u8>> for UploadContent {
    fn from(bytes: Vec<u8>) -> Self {
        Self::Bytes(Bytes::from(bytes))
    }
}

impl From<&'static [u8]> for UploadContent {
    fn from(bytes: &'static [u8]) -> Self {
        Self::Bytes(Bytes::from_static(bytes))
    }
}

impl From<tokio::fs::File> for UploadContent {
    fn from(file: tokio::fs::File) -> Self {
        Self::File(file)
    }
}

enum Window {
    Bytes(Bytes),
    File {
        file: Mutex<tokio::fs::File>,
        base: u64,
    },
    Source(Arc<dyn UploadSource>),
}

pub(crate) struct LockedSource {
    window: Window,
    pub size_bytes: u64,
}

pub(crate) fn changed_size() -> HimringApiError {
    invalid_input(
        "The file changed size while the client read it. Send it again once nothing writes to it.",
        Some(FILE_CONTENT_FIELD),
    )
}

fn unreadable(error: io::Error) -> HimringApiError {
    invalid_input(
        "The client could not read the file.",
        Some(FILE_CONTENT_FIELD),
    )
    .caused_by(error)
}

impl LockedSource {
    pub async fn of(content: UploadContent) -> Result<Self, HimringApiError> {
        match content {
            UploadContent::Bytes(bytes) => Ok(Self {
                size_bytes: bytes.len() as u64,
                window: Window::Bytes(bytes),
            }),
            UploadContent::Source(source) => Ok(Self {
                size_bytes: source.size_bytes(),
                window: Window::Source(source),
            }),
            UploadContent::File(mut file) => {
                let measured = async {
                    let base = file.stream_position().await?;
                    let end = file.seek(SeekFrom::End(0)).await?;
                    file.seek(SeekFrom::Start(base)).await?;
                    Ok::<(u64, u64), io::Error>((base, end.saturating_sub(base)))
                }
                .await
                .map_err(|error| {
                    invalid_input(
                        "The client could not measure the file.",
                        Some(FILE_CONTENT_FIELD),
                    )
                    .caused_by(error)
                })?;
                Ok(Self {
                    window: Window::File {
                        file: Mutex::new(file),
                        base: measured.0,
                    },
                    size_bytes: measured.1,
                })
            }
        }
    }

    pub async fn read(&self, start: u64, end: u64) -> Result<Bytes, HimringApiError> {
        let wanted = end.saturating_sub(start);
        let data = match &self.window {
            Window::Bytes(bytes) => {
                let (Ok(from), Ok(to)) = (usize::try_from(start), usize::try_from(end)) else {
                    return Err(changed_size());
                };
                bytes
                    .get(from..to)
                    .map(|_| bytes.slice(from..to))
                    .ok_or_else(changed_size)?
            }
            Window::Source(source) => source.read(start, end).await.map_err(unreadable)?,
            Window::File { file, base } => {
                let mut file = file.lock().await;
                file.seek(SeekFrom::Start(base + start))
                    .await
                    .map_err(unreadable)?;
                let capacity = usize::try_from(wanted).map_err(|_| changed_size())?;
                let mut collected = BytesMut::with_capacity(capacity);
                while (collected.len() as u64) < wanted {
                    let read = (&mut *file)
                        .take(wanted - collected.len() as u64)
                        .read_buf(&mut collected)
                        .await
                        .map_err(unreadable)?;
                    if read == 0 {
                        break;
                    }
                }
                collected.freeze()
            }
        };
        if data.len() as u64 != wanted {
            return Err(changed_size());
        }
        Ok(data)
    }
}

async fn off_the_runtime<T: Send + 'static>(
    work: impl FnOnce() -> T + Send + 'static,
) -> Result<T, HimringApiError> {
    match tokio::task::spawn_blocking(work).await {
        Ok(value) => Ok(value),
        Err(error) if error.is_panic() => std::panic::resume_unwind(error.into_panic()),
        Err(error) => Err(invalid_input(
            "The runtime stopped before the client could hash the file.",
            Some(FILE_CONTENT_FIELD),
        )
        .caused_by(error)),
    }
}

pub(crate) async fn sha256_hex_of(data: Bytes) -> Result<String, HimringApiError> {
    off_the_runtime(move || hex_of(&Sha256::digest(&data))).await
}

pub(crate) fn hex_of(bytes: &[u8]) -> String {
    const DIGITS: &[u8; 16] = b"0123456789abcdef";
    let mut text = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        text.push(char::from(DIGITS[usize::from(byte >> 4)]));
        text.push(char::from(DIGITS[usize::from(byte & 0x0f)]));
    }
    text
}

pub(crate) async fn content_sha256_of(source: &LockedSource) -> Result<String, HimringApiError> {
    let mut hasher = Sha256::new();
    let mut start = 0;
    while start < source.size_bytes {
        let end = source.size_bytes.min(start + DIGEST_WINDOW_BYTES);
        let window = source.read(start, end).await?;
        hasher = off_the_runtime(move || {
            hasher.update(&window);
            hasher
        })
        .await?;
        start = end;
    }
    Ok(hex_of(&hasher.finalize()))
}
