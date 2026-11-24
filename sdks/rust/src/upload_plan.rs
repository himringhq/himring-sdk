use std::time::{Duration, SystemTime};

use crate::generated_operations::SIGNABLE_PART_NUMBER_MAXIMUM;
use reqwest::Url;
use time::OffsetDateTime;
use time::format_description::well_known::Rfc3339;

use crate::errors::{
    ErrorDetails, HimringApiError, HimringApiErrorKind, documented_status_of, invalid_input,
    invalid_response,
};
use crate::types::{
    GetUploadOutput, GetUploadOutputFile, GetUploadOutputMethod, GetUploadOutputOutcome,
    GetUploadOutputState, SignUploadPartsOutputPartsItem,
};

pub(crate) const PARTS_IN_FLIGHT: usize = 4;
pub(crate) const SEND_ATTEMPTS: u32 = 3;
pub(crate) const RESIGNED_STATUSES: [u16; 7] = [403, 408, 429, 500, 502, 503, 504];
pub(crate) const HTTP_FORBIDDEN: u16 = 403;
pub(crate) const CHECK_POLL_FIRST: Duration = Duration::from_millis(200);
pub(crate) const CHECK_POLL_MAXIMUM: Duration = Duration::from_secs(2);
const CHECK_WAIT_PAST_DEADLINE: Duration = Duration::from_secs(30 * 60);
const MINIMUM_SEND_BYTES_PER_SECOND: u64 = 64 * 1024;
const STORAGE_URL_SCHEMES: [&str; 2] = ["http", "https"];
const LARGEST_EXACT_WHOLE_NUMBER: f64 = 9_007_199_254_740_992.0;

pub type UploadRecord = GetUploadOutput;
pub type SignedPart = SignUploadPartsOutputPartsItem;

#[derive(Clone, Debug, PartialEq)]
#[non_exhaustive]
pub struct AddedFile {
    pub outcome: GetUploadOutputOutcome,
    pub file: GetUploadOutputFile,
}

#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
pub(crate) fn whole_number(value: f64) -> Option<u64> {
    if value.is_finite()
        && value >= 0.0
        && value.fract() == 0.0
        && value <= LARGEST_EXACT_WHOLE_NUMBER
    {
        Some(value as u64)
    } else {
        None
    }
}

pub(crate) fn checked_sha256(value: Option<String>) -> Result<Option<String>, HimringApiError> {
    match value {
        Some(digest)
            if digest.len() != 64
                || !digest
                    .bytes()
                    .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte)) =>
        {
            Err(invalid_input(
                "Send content_sha256 as 64 lowercase hexadecimal characters.",
                Some("content_sha256"),
            ))
        }
        other => Ok(other),
    }
}

pub(crate) fn checked_record(
    upload: UploadRecord,
    size_bytes: u64,
    sha256: &str,
) -> Result<UploadRecord, HimringApiError> {
    if whole_number(upload.size_bytes) == Some(size_bytes) && upload.content_sha256 == sha256 {
        return Ok(upload);
    }
    Err(invalid_response(format!(
        "The API answered with the upload {} for other content than the file that the client sent.",
        upload.id
    )))
}

pub(crate) fn checked_layout(
    upload: &UploadRecord,
    size_bytes: u64,
) -> Result<(u64, u64), HimringApiError> {
    let count = whole_number(upload.part_count);
    let part_bytes = whole_number(upload.part_bytes);
    let fits = match (count, part_bytes, upload.method) {
        (Some(count), Some(part_bytes), GetUploadOutputMethod::Single) => {
            count == 1 && part_bytes == size_bytes
        }
        (Some(count), Some(part_bytes), _) => {
            part_bytes >= 1
                && count == size_bytes.div_ceil(part_bytes)
                && count <= SIGNABLE_PART_NUMBER_MAXIMUM
        }
        _ => false,
    };
    match (count, part_bytes) {
        (Some(count), Some(part_bytes))
            if fits && whole_number(upload.size_bytes) == Some(size_bytes) =>
        {
            Ok((part_bytes, count))
        }
        _ => Err(invalid_response(format!(
            "The API planned the upload {} with parts that do not fit the file.",
            upload.id
        ))),
    }
}

pub(crate) fn expected_part_bytes(size_bytes: u64, part_bytes: u64, part_number: u64) -> u64 {
    let start = (part_number - 1) * part_bytes;
    size_bytes.min(start + part_bytes) - start
}

pub(crate) fn checked_signed_part(
    part: SignedPart,
    number: u64,
    size_bytes: u64,
) -> Result<SignedPart, HimringApiError> {
    if whole_number(part.part_number) == Some(number)
        && whole_number(part.size_bytes) == Some(size_bytes)
    {
        return Ok(part);
    }
    Err(invalid_response(format!(
        "The API signed a part that does not match part {number} of {size_bytes} bytes."
    )))
}

pub(crate) fn part_of(
    parts: Vec<SignedPart>,
    part_number: u64,
) -> Result<SignedPart, HimringApiError> {
    parts
        .into_iter()
        .find(|part| whole_number(part.part_number) == Some(part_number))
        .ok_or_else(|| invalid_response(format!("The API signed no link for part {part_number}.")))
}

fn refusal_of_upload(upload: &UploadRecord) -> HimringApiError {
    match &upload.failure {
        None => HimringApiError::new(
            HimringApiErrorKind::Refused,
            "Himring closed the upload without the file.",
        ),
        Some(failure) => HimringApiError::with_details(
            HimringApiErrorKind::Refused,
            failure.message.clone(),
            ErrorDetails {
                code: Some(failure.code.clone()),
                status: documented_status_of(&failure.code),
                ..ErrorDetails::default()
            },
        ),
    }
}

pub(crate) fn added_file_of(upload: UploadRecord) -> Result<AddedFile, HimringApiError> {
    if upload.state == GetUploadOutputState::Failed {
        return Err(refusal_of_upload(&upload));
    }
    match (upload.outcome, upload.file) {
        (Some(outcome), Some(file)) => Ok(AddedFile { outcome, file }),
        _ => Err(invalid_response(format!(
            "The upload {} completed with no file.",
            upload.id
        ))),
    }
}

pub(crate) fn storage_refusal(status: u16, part_number: u64) -> HimringApiError {
    HimringApiError::with_status(
        HimringApiErrorKind::Refused,
        format!(
            "Storage refused part {part_number} of the file with status {status}. Check that nothing changed the file while it was sent, then send it again."
        ),
        status,
    )
}

pub(crate) fn storage_url_of(url: &str) -> Result<Url, HimringApiError> {
    let parsed = Url::parse(url).map_err(|error| {
        invalid_response("The API signed a storage link that is not a URL.").caused_by(error)
    })?;
    if !STORAGE_URL_SCHEMES.contains(&parsed.scheme())
        || parsed.host_str().is_none_or(str::is_empty)
    {
        return Err(invalid_response(format!(
            "The API signed a storage link with the scheme {}:.",
            parsed.scheme()
        )));
    }
    Ok(parsed)
}

pub(crate) fn send_timeout(idle_timeout: Duration, size_bytes: u64) -> Duration {
    idle_timeout + Duration::from_secs(size_bytes.div_ceil(MINIMUM_SEND_BYTES_PER_SECOND))
}

pub(crate) fn checked_range(byte_range: Option<String>) -> Result<Option<String>, HimringApiError> {
    let Some(text) = byte_range else {
        return Ok(None);
    };
    let ranges = text.strip_prefix("bytes=").unwrap_or_default();
    let valid = !ranges.is_empty()
        && text.starts_with("bytes=")
        && ranges.split(',').enumerate().all(|(index, range)| {
            let range = if index == 0 {
                range
            } else {
                range.trim_start_matches([' ', '\t'])
            };
            range.split_once('-').is_some_and(|(first, last)| {
                first.bytes().all(|byte| byte.is_ascii_digit())
                    && last.bytes().all(|byte| byte.is_ascii_digit())
            })
        });
    if valid {
        Ok(Some(text))
    } else {
        Err(invalid_input(
            "Send range as a byte range, such as bytes=0-1023.",
            Some("range"),
        ))
    }
}

pub(crate) fn give_up_at(upload: &UploadRecord) -> SystemTime {
    let deadline = OffsetDateTime::parse(&upload.deadline_at, &Rfc3339)
        .ok()
        .and_then(|moment| {
            let seconds = u64::try_from(moment.unix_timestamp()).ok()?;
            SystemTime::UNIX_EPOCH.checked_add(Duration::from_secs(seconds))
        })
        .unwrap_or_else(SystemTime::now);
    deadline + CHECK_WAIT_PAST_DEADLINE
}

pub(crate) fn still_checking_error(upload_id: &str) -> HimringApiError {
    HimringApiError::new(
        HimringApiErrorKind::Timeout,
        format!(
            "Himring was still checking the upload {upload_id} long after its deadline. Read it later with get_upload."
        ),
    )
}

pub(crate) fn left_open_error(upload_id: &str) -> HimringApiError {
    invalid_response(format!(
        "The API left the upload {upload_id} open after completing it."
    ))
}

pub(crate) fn should_cancel(error: &HimringApiError) -> bool {
    !(error.kind() == HimringApiErrorKind::Refused && error.code().is_some())
}
