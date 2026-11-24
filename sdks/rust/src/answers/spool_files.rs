use std::collections::{HashMap, HashSet};
use std::fs::{self, File, Metadata};
use std::io::Read;
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};
use std::time::{Duration, SystemTime};

use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::answers::event_rules::{AnswerEventInput, parsed_wire_answer_event};

pub(crate) const ANSWER_SPOOL_FILE_PREFIX: &str = "answers-";
pub(crate) const ANSWER_SPOOL_FILE_SUFFIX: &str = ".jsonl";
pub const ANSWER_SPOOL_ORPHAN_AFTER: Duration = Duration::from_secs(5 * 60);
const SPOOL_HEADER_READ_BYTES: u64 = 4_096;

#[derive(Clone, Debug)]
pub(crate) struct SpooledAnswerEvent {
    pub id: String,
    pub event: AnswerEventInput,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub(crate) struct SpoolOwner {
    pub host: String,
    pub pid: i64,
    pub instance: String,
    pub destination: String,
}

#[derive(Serialize)]
struct OwnerLine<'a> {
    kind: &'static str,
    #[serde(flatten)]
    owner: &'a SpoolOwner,
}

#[derive(Deserialize)]
struct ParsedOwnerLine {
    kind: String,
    #[serde(flatten)]
    owner: SpoolOwner,
}

pub(crate) fn live_instances() -> &'static Mutex<HashSet<String>> {
    static LIVE: OnceLock<Mutex<HashSet<String>>> = OnceLock::new();
    LIVE.get_or_init(|| Mutex::new(HashSet::new()))
}

pub(crate) fn owner_line(owner: &SpoolOwner) -> String {
    let line = serde_json::to_string(&OwnerLine {
        kind: "owner",
        owner,
    })
    .unwrap_or_default();
    format!("{line}\n")
}

pub(crate) fn event_line(item: &SpooledAnswerEvent) -> String {
    let line = serde_json::json!({ "kind": "event", "id": item.id, "event": item.event });
    format!("{line}\n")
}

pub(crate) fn done_line(ids: &[String]) -> String {
    let line = serde_json::json!({ "kind": "done", "ids": ids });
    format!("{line}\n")
}

pub(crate) fn unsent_events(text: &str) -> Vec<SpooledAnswerEvent> {
    let mut events: Vec<(String, AnswerEventInput)> = Vec::new();
    let mut positions: HashMap<String, usize> = HashMap::new();
    let mut done = HashSet::new();
    for raw in text.split('\n') {
        if raw.trim().is_empty() {
            continue;
        }
        let Ok(Value::Object(line)) = serde_json::from_str::<Value>(raw) else {
            continue;
        };
        match (
            line.get("kind").and_then(Value::as_str),
            line.get("id"),
            line.get("ids"),
        ) {
            (Some("event"), Some(Value::String(id)), _) => {
                let Some(event) = line.get("event").and_then(parsed_wire_answer_event) else {
                    continue;
                };
                if let Some(position) = positions.get(id) {
                    events[*position].1 = event;
                } else {
                    positions.insert(id.clone(), events.len());
                    events.push((id.clone(), event));
                }
            }
            (Some("done"), _, Some(Value::Array(ids))) if ids.iter().all(Value::is_string) => {
                done.extend(ids.iter().filter_map(Value::as_str).map(str::to_owned));
            }
            _ => {}
        }
    }
    events
        .into_iter()
        .filter(|(id, _)| !done.contains(id))
        .map(|(id, event)| SpooledAnswerEvent { id, event })
        .collect()
}

#[cfg(unix)]
pub(crate) fn opened_without_following(path: &Path) -> std::io::Result<File> {
    use std::os::unix::fs::OpenOptionsExt;
    fs::OpenOptions::new()
        .read(true)
        .custom_flags(rustix::fs::OFlags::NOFOLLOW.bits().cast_signed())
        .open(path)
}

#[cfg(not(unix))]
pub(crate) fn opened_without_following(path: &Path) -> std::io::Result<File> {
    File::open(path)
}

pub(crate) fn owner_of(file: &mut File) -> Option<SpoolOwner> {
    let mut header = String::new();
    let mut limited = file.take(SPOOL_HEADER_READ_BYTES);
    let mut bytes = Vec::new();
    limited.read_to_end(&mut bytes).ok()?;
    header.push_str(&String::from_utf8_lossy(&bytes));
    let first = header.split('\n').next()?;
    let parsed: ParsedOwnerLine = serde_json::from_str(first).ok()?;
    (parsed.kind == "owner").then_some(parsed.owner)
}

#[cfg(unix)]
fn process_is_alive(pid: i64) -> bool {
    let Some(pid) = i32::try_from(pid)
        .ok()
        .and_then(rustix::process::Pid::from_raw)
    else {
        return false;
    };
    !matches!(
        rustix::process::test_kill_process(pid),
        Err(rustix::io::Errno::SRCH)
    )
}

pub(crate) fn current_pid() -> i64 {
    i64::from(std::process::id())
}

fn is_stale(modified: SystemTime, now: SystemTime) -> bool {
    now.duration_since(modified)
        .is_ok_and(|age| age > ANSWER_SPOOL_ORPHAN_AFTER)
}

pub(crate) fn is_orphaned(
    owner: Option<&SpoolOwner>,
    modified: SystemTime,
    host: &str,
    now: SystemTime,
) -> bool {
    let Some(owner) = owner.filter(|owner| owner.host == host) else {
        return is_stale(modified, now);
    };
    if owner.pid == current_pid() {
        return live_instances()
            .lock()
            .is_ok_and(|live| !live.contains(&owner.instance));
    }
    #[cfg(unix)]
    {
        !process_is_alive(owner.pid)
    }
    #[cfg(not(unix))]
    {
        is_stale(modified, now)
    }
}

#[cfg(unix)]
fn owned_by_this_user(metadata: &Metadata) -> bool {
    use std::os::unix::fs::MetadataExt;
    metadata.uid() == rustix::process::getuid().as_raw()
}

#[cfg(not(unix))]
fn owned_by_this_user(_metadata: &Metadata) -> bool {
    true
}

#[cfg(unix)]
fn writable_by_others(metadata: &Metadata) -> bool {
    use std::os::unix::fs::PermissionsExt;
    metadata.permissions().mode() & 0o022 != 0
}

#[cfg(not(unix))]
fn writable_by_others(_metadata: &Metadata) -> bool {
    false
}

pub(crate) fn is_private_directory(directory: &Path) -> std::io::Result<bool> {
    let metadata = fs::symlink_metadata(directory)?;
    Ok(metadata.is_dir() && !writable_by_others(&metadata) && owned_by_this_user(&metadata))
}

pub(crate) fn is_own_regular_file(metadata: &Metadata) -> bool {
    metadata.is_file() && owned_by_this_user(metadata)
}

pub(crate) fn is_spool_file_name(name: &str) -> bool {
    name.starts_with(ANSWER_SPOOL_FILE_PREFIX) && name.ends_with(ANSWER_SPOOL_FILE_SUFFIX)
}

#[cfg(unix)]
pub(crate) fn host_name() -> String {
    rustix::system::uname()
        .nodename()
        .to_string_lossy()
        .into_owned()
}

#[cfg(not(unix))]
pub(crate) fn host_name() -> String {
    std::env::var("COMPUTERNAME").unwrap_or_default()
}

pub(crate) fn default_spool_directory() -> PathBuf {
    #[cfg(unix)]
    let user = format!("-{}", rustix::process::getuid().as_raw());
    #[cfg(not(unix))]
    let user = String::new();
    std::env::temp_dir().join(format!("himring-answer-spool{user}"))
}
