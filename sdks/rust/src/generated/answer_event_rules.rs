pub const EVENTS_PER_REQUEST: usize = 100;
pub const CITED_CHUNKS_MAXIMUM: usize = 50;
pub const QUESTION_ID_PATTERN: &str = "^qst_[0-9a-f]{32}$";
pub const CHUNK_ID_PATTERN: &str = "^chk_[0-9a-f]{32}$";
pub const HANDOFF_REASON_MAXIMUM: usize = 200;
pub const OCCURRED_AT_PATTERN: &str = "^\\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\\d|0[1-9]|3[01])[T ](?:0\\d|1\\d|2[0-3])(?::[0-5]\\d){2}(?:\\.\\d{1,9})?(?:Z| ?[+-](?:0\\d|1\\d|2[0-3])(?::?[0-5]\\d)?)$";
