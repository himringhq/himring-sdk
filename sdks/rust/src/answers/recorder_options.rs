use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use serde_json::Value;

use crate::answers::delivery::DEFAULT_ANSWER_DELIVERY_ATTEMPTS;
use crate::client::Himring;

pub const DEFAULT_ANSWER_FLUSH_INTERVAL: Duration = Duration::from_secs(5);
pub const DEFAULT_ANSWER_BUFFER_MAXIMUM: usize = 10_000;
pub const DEFAULT_ANSWER_CLOSE_TIMEOUT: Duration = Duration::from_secs(10);
pub const ANSWER_RECOVERY_INTERVAL: Duration = Duration::from_secs(60);
pub const ANSWER_SPOOL_HEARTBEAT: Duration = Duration::from_secs(30);

pub trait AnswerRecorderLogger: Send + Sync {
    fn warn(&self, message: &str, details: &Value);
}

pub(crate) struct StandardErrorLogger;

impl AnswerRecorderLogger for StandardErrorLogger {
    fn warn(&self, message: &str, details: &Value) {
        eprintln!("[himring] {message} {details}");
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
#[non_exhaustive]
pub enum SpoolDirectory {
    Default,
    At(PathBuf),
    Disabled,
}

#[must_use]
#[non_exhaustive]
pub struct AnswerRecorderOptions {
    pub client: Himring,
    pub project_id: String,
    pub knowledge_base_id: String,
    pub spool_directory: SpoolDirectory,
    pub flush_interval: Duration,
    pub maximum_buffered_events: usize,
    pub maximum_attempts: u32,
    pub close_timeout: Duration,
    pub logger: Option<Arc<dyn AnswerRecorderLogger>>,
}

impl AnswerRecorderOptions {
    pub fn new(
        client: Himring,
        project_id: impl Into<String>,
        knowledge_base_id: impl Into<String>,
    ) -> Self {
        Self {
            client,
            project_id: project_id.into(),
            knowledge_base_id: knowledge_base_id.into(),
            spool_directory: SpoolDirectory::Default,
            flush_interval: DEFAULT_ANSWER_FLUSH_INTERVAL,
            maximum_buffered_events: DEFAULT_ANSWER_BUFFER_MAXIMUM,
            maximum_attempts: DEFAULT_ANSWER_DELIVERY_ATTEMPTS,
            close_timeout: DEFAULT_ANSWER_CLOSE_TIMEOUT,
            logger: None,
        }
    }

    pub fn spool_directory(mut self, spool_directory: SpoolDirectory) -> Self {
        self.spool_directory = spool_directory;
        self
    }

    pub fn flush_interval(mut self, flush_interval: Duration) -> Self {
        self.flush_interval = flush_interval;
        self
    }

    pub fn maximum_buffered_events(mut self, maximum: usize) -> Self {
        self.maximum_buffered_events = maximum;
        self
    }

    pub fn maximum_attempts(mut self, maximum: u32) -> Self {
        self.maximum_attempts = maximum;
        self
    }

    pub fn close_timeout(mut self, close_timeout: Duration) -> Self {
        self.close_timeout = close_timeout;
        self
    }

    pub fn logger(mut self, logger: Arc<dyn AnswerRecorderLogger>) -> Self {
        self.logger = Some(logger);
        self
    }
}
