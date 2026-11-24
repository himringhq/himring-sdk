use std::fs::{self, File, OpenOptions};
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::time::SystemTime;

use serde_json::{Value, json};

use crate::answers::delivery::PendingAnswerEvent;
use crate::answers::spool_files::{
    ANSWER_SPOOL_FILE_PREFIX, ANSWER_SPOOL_FILE_SUFFIX, SpoolOwner, SpooledAnswerEvent,
    current_pid, done_line, event_line, host_name, is_orphaned, is_own_regular_file,
    is_private_directory, is_spool_file_name, live_instances, owner_line, owner_of, unsent_events,
};

const SPOOL_COMPACT_AFTER_BYTES: u64 = 16 * 1024 * 1024;
const RECOVERED_FILE_MAXIMUM_BYTES: u64 = 64 * 1024 * 1024;

pub(crate) struct SpoolWarning {
    pub message: String,
    pub details: Value,
}

pub(crate) type Warnings = Vec<SpoolWarning>;

fn warn(warnings: &mut Warnings, message: &str, details: Value) {
    warnings.push(SpoolWarning {
        message: message.to_owned(),
        details,
    });
}

pub(crate) struct AnswerSpool {
    instance: String,
    host: String,
    directory: PathBuf,
    destination: String,
    file: Option<File>,
    file_path: Option<PathBuf>,
    written_bytes: u64,
    line_break_owed: bool,
}

#[cfg(unix)]
fn private_directory(directory: &Path) -> io::Result<()> {
    use std::os::unix::fs::DirBuilderExt;
    fs::DirBuilder::new()
        .recursive(true)
        .mode(0o700)
        .create(directory)
}

#[cfg(not(unix))]
fn private_directory(directory: &Path) -> io::Result<()> {
    fs::create_dir_all(directory)
}

#[cfg(unix)]
fn new_private_file(path: &Path) -> io::Result<File> {
    use std::os::unix::fs::OpenOptionsExt;
    OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(0o600)
        .open(path)
}

#[cfg(not(unix))]
fn new_private_file(path: &Path) -> io::Result<File> {
    OpenOptions::new().write(true).create_new(true).open(path)
}

fn spooled(pending: &[PendingAnswerEvent]) -> Vec<SpooledAnswerEvent> {
    pending
        .iter()
        .map(|item| SpooledAnswerEvent {
            id: item.id.clone(),
            event: item.event.clone(),
        })
        .collect()
}

impl AnswerSpool {
    pub fn open(directory: &Path, destination: String, warnings: &mut Warnings) -> Option<Self> {
        let shown = json!({ "directory": directory.display().to_string() });
        let checked = private_directory(directory).and_then(|()| is_private_directory(directory));
        match checked {
            Ok(true) => {}
            Ok(false) => {
                warn(
                    warnings,
                    "The answer spool directory is shared with other users, so answers are kept in memory only",
                    shown,
                );
                return None;
            }
            Err(error) => {
                warn(
                    warnings,
                    "The answer spool directory is unusable, so answers are kept in memory only",
                    json!({ "directory": directory.display().to_string(), "error": error.to_string() }),
                );
                return None;
            }
        }
        let instance = uuid::Uuid::new_v4().to_string();
        if let Ok(mut live) = live_instances().lock() {
            live.insert(instance.clone());
        }
        Some(Self {
            instance,
            host: host_name(),
            directory: directory.to_path_buf(),
            destination,
            file: None,
            file_path: None,
            written_bytes: 0,
            line_break_owed: false,
        })
    }

    pub fn append(&mut self, items: &[SpooledAnswerEvent], warnings: &mut Warnings) -> bool {
        if items.is_empty() {
            return true;
        }
        let text: String = items.iter().map(event_line).collect();
        self.write(&text, warnings)
    }

    pub fn mark_done(&mut self, ids: &[String], warnings: &mut Warnings) {
        if ids.is_empty() || self.file.is_none() {
            return;
        }
        self.write(&done_line(ids), warnings);
    }

    pub fn settle(&mut self, pending: &[PendingAnswerEvent], warnings: &mut Warnings) {
        if self.file.is_none() {
            return;
        }
        if pending.is_empty() {
            self.discard_file();
        } else if self.written_bytes > SPOOL_COMPACT_AFTER_BYTES {
            self.replace_file(pending, warnings);
        }
    }

    pub fn close(&mut self, keep_unsent: bool, pending: &[PendingAnswerEvent]) {
        if keep_unsent && !pending.is_empty() {
            self.file = None;
            self.file_path = None;
        } else {
            self.discard_file();
        }
        if let Ok(mut live) = live_instances().lock() {
            live.remove(&self.instance);
        }
    }

    pub fn touch(&mut self, pending: &[PendingAnswerEvent], warnings: &mut Warnings) {
        let Some(path) = self.file_path.clone() else {
            return;
        };
        match fs::symlink_metadata(&path) {
            Ok(_) => {
                if let Some(file) = &self.file {
                    let _ = file.set_modified(SystemTime::now());
                }
            }
            Err(error) if error.kind() == io::ErrorKind::NotFound => {
                self.replace_file(pending, warnings);
            }
            Err(_) => {}
        }
    }

    pub fn recover_orphans(&mut self, warnings: &mut Warnings) -> Vec<SpooledAnswerEvent> {
        let mut recovered = Vec::new();
        let names = match fs::read_dir(&self.directory) {
            Ok(entries) => entries
                .filter_map(Result::ok)
                .filter_map(|entry| entry.file_name().into_string().ok())
                .collect::<Vec<_>>(),
            Err(error) => {
                warn(
                    warnings,
                    "The answer spool directory could not be read",
                    json!({ "directory": self.directory.display().to_string(), "error": error.to_string() }),
                );
                return recovered;
            }
        };
        let own_name = self
            .file_path
            .as_ref()
            .and_then(|path| path.file_name())
            .map(|name| name.to_string_lossy().into_owned());
        for name in names {
            if !is_spool_file_name(&name) || own_name.as_deref() == Some(name.as_str()) {
                continue;
            }
            let path = self.directory.join(&name);
            match self.recover_file(&path, warnings) {
                Ok(events) => recovered.extend(events),
                Err(error) if error.kind() == io::ErrorKind::NotFound => {}
                Err(error) => warn(
                    warnings,
                    "An answer spool file left by an earlier process could not be read",
                    json!({ "file_path": path.display().to_string(), "error": error.to_string() }),
                ),
            }
        }
        recovered
    }

    fn recover_file(
        &mut self,
        path: &Path,
        warnings: &mut Warnings,
    ) -> io::Result<Vec<SpooledAnswerEvent>> {
        let metadata = fs::symlink_metadata(path)?;
        if !is_own_regular_file(&metadata) {
            return Ok(Vec::new());
        }
        let owner = owner_of(path);
        if owner.as_ref().map(|owner| owner.destination.as_str()) != Some(self.destination.as_str())
        {
            return Ok(Vec::new());
        }
        if !is_orphaned(
            owner.as_ref(),
            metadata.modified()?,
            &self.host,
            SystemTime::now(),
        ) {
            return Ok(Vec::new());
        }
        if metadata.len() > RECOVERED_FILE_MAXIMUM_BYTES {
            warn(
                warnings,
                "An answer spool file left by an earlier process is too large to send",
                json!({ "file_path": path.display().to_string() }),
            );
            return Ok(Vec::new());
        }
        let claimed_name = format!(
            "{ANSWER_SPOOL_FILE_PREFIX}claimed-{}{ANSWER_SPOOL_FILE_SUFFIX}",
            uuid::Uuid::new_v4()
        );
        let claimed = self.directory.join(claimed_name);
        fs::rename(path, &claimed)?;
        let claimed_metadata = fs::symlink_metadata(&claimed)?;
        if !is_own_regular_file(&claimed_metadata)
            || claimed_metadata.len() > RECOVERED_FILE_MAXIMUM_BYTES
        {
            fs::remove_file(&claimed)?;
            return Ok(Vec::new());
        }
        let bytes = fs::read(&claimed)?;
        let events = unsent_events(&String::from_utf8_lossy(&bytes));
        if !self.append(&events, warnings) {
            return Ok(Vec::new());
        }
        fs::remove_file(&claimed)?;
        Ok(events)
    }

    fn ensure_file(&mut self) -> io::Result<()> {
        if self.file.is_some() {
            return Ok(());
        }
        let name = format!(
            "{ANSWER_SPOOL_FILE_PREFIX}{}-{}{ANSWER_SPOOL_FILE_SUFFIX}",
            self.instance,
            uuid::Uuid::new_v4()
        );
        let path = self.directory.join(name);
        let mut file = new_private_file(&path)?;
        let owner = SpoolOwner {
            host: self.host.clone(),
            pid: current_pid(),
            instance: self.instance.clone(),
            destination: self.destination.clone(),
        };
        let header = owner_line(&owner);
        file.write_all(header.as_bytes())?;
        self.written_bytes = header.len() as u64;
        self.line_break_owed = false;
        self.file = Some(file);
        self.file_path = Some(path);
        Ok(())
    }

    fn write(&mut self, text: &str, warnings: &mut Warnings) -> bool {
        let written = self.ensure_file().and_then(|()| {
            let Some(file) = &mut self.file else {
                return Err(io::Error::other("The spool file closed."));
            };
            let line = if self.line_break_owed {
                format!("\n{text}")
            } else {
                text.to_owned()
            };
            file.write_all(line.as_bytes())?;
            file.sync_data()?;
            Ok(line.len() as u64)
        });
        match written {
            Ok(bytes) => {
                self.written_bytes += bytes;
                self.line_break_owed = false;
                true
            }
            Err(error) => {
                self.line_break_owed = true;
                warn(
                    warnings,
                    "An answer could not be written to the spool, so it is kept in memory only",
                    json!({ "error": error.to_string() }),
                );
                false
            }
        }
    }

    fn replace_file(&mut self, pending: &[PendingAnswerEvent], warnings: &mut Warnings) {
        let previous = self.file_path.take();
        self.file = None;
        if !self.append(&spooled(pending), warnings) {
            return;
        }
        if let Some(previous) = previous {
            let _ = fs::remove_file(previous);
        }
    }

    fn discard_file(&mut self) {
        self.file = None;
        if let Some(previous) = self.file_path.take() {
            let _ = fs::remove_file(previous);
        }
    }
}

impl Drop for AnswerSpool {
    fn drop(&mut self) {
        if let Ok(mut live) = live_instances().lock() {
            live.remove(&self.instance);
        }
    }
}
