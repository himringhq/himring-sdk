use std::collections::BTreeMap;
use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use himring::Himring;
use himring::answers::{
    AnswerEventDraft, AnswerRecorder, AnswerRecorderLogger, AnswerRecorderOptions, SpoolDirectory,
};
use serde_json::{Value, json};
use tokio::io::{AsyncBufReadExt, BufReader};

use super::{API_KEY, RecordedRequest, identifier};

pub const NEVER_FLUSH_ON_A_TIMER: Duration = Duration::from_secs(3_600);
pub const CRASH_SETUP_VARIABLE: &str = "HIMRING_SDK_RUST_CRASHING_RECORDER";
pub const CRASHING_RECORDER_TEST: &str = "crashing_recorder_child";
const RECORDED_LINE: &str = "himring-sdk-rust-recorded";

#[derive(Default)]
pub struct CollectedWarnings(pub Mutex<Vec<String>>);

impl AnswerRecorderLogger for CollectedWarnings {
    fn warn(&self, message: &str, _details: &Value) {
        self.0
            .lock()
            .expect("the warning list is not poisoned")
            .push(message.to_owned());
    }
}

pub struct TemporaryFolder(pub PathBuf);

impl TemporaryFolder {
    pub fn new() -> Self {
        let path = std::env::temp_dir().join(format!("himring-sdk-rust-{}", identifier("answers")));
        std::fs::create_dir_all(&path).expect("the test folder is created");
        Self(path)
    }

    pub fn spool(&self) -> PathBuf {
        self.0.join("spool")
    }
}

impl Drop for TemporaryFolder {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

pub fn answer_drafts(count: usize) -> BTreeMap<String, String> {
    (1..=count)
        .map(|index| {
            (
                identifier("qst"),
                format!("Refunds arrive within {index} business days."),
            )
        })
        .collect()
}

pub fn drafts_of(answers: &BTreeMap<String, String>) -> Vec<AnswerEventDraft> {
    answers
        .iter()
        .map(|(question_id, answer)| AnswerEventDraft::new(question_id).answer(answer))
        .collect()
}

pub fn delivered_in(requests: &[RecordedRequest]) -> Vec<(String, String)> {
    let bodies: Vec<Value> = requests
        .iter()
        .map(|request| request.body.clone())
        .collect();
    delivered_in_bodies(&bodies)
}

pub fn delivered_in_bodies(bodies: &[Value]) -> Vec<(String, String)> {
    let mut delivered: Vec<(String, String)> = bodies
        .iter()
        .flat_map(|body| body["events"].as_array().cloned().unwrap_or_default())
        .map(|event| {
            let question_id = event["question_id"].as_str().unwrap_or_default().to_owned();
            (
                question_id,
                event["answer"].as_str().unwrap_or_default().to_owned(),
            )
        })
        .collect();
    delivered.sort();
    delivered
}

pub fn expected_of(answers: &BTreeMap<String, String>) -> Vec<(String, String)> {
    answers
        .iter()
        .map(|(question_id, answer)| (question_id.clone(), answer.clone()))
        .collect()
}

pub fn recorder_at(
    client: &Himring,
    spool: SpoolDirectory,
    project_id: &str,
    knowledge_base_id: &str,
) -> AnswerRecorder {
    let options = AnswerRecorderOptions::new(client.clone(), project_id, knowledge_base_id)
        .spool_directory(spool)
        .flush_interval(NEVER_FLUSH_ON_A_TIMER)
        .logger(Arc::new(CollectedWarnings::default()));
    AnswerRecorder::new(options).expect("the recorder starts inside a runtime")
}

pub fn accepted(events: usize) -> Value {
    json!({ "results": [], "recorded_count": events })
}

pub fn spool_names(spool: &Path) -> Vec<String> {
    let mut names: Vec<String> = std::fs::read_dir(spool)
        .map(|entries| {
            entries
                .filter_map(Result::ok)
                .map(|entry| entry.file_name().to_string_lossy().into_owned())
                .collect()
        })
        .unwrap_or_default();
    names.sort();
    names
}

pub async fn record_then_crash(
    base_url: &str,
    project_id: &str,
    knowledge_base_id: &str,
    spool: &Path,
    answers: &BTreeMap<String, String>,
) {
    let setup = json!({
        "base_url": base_url,
        "api_key": API_KEY,
        "project_id": project_id,
        "knowledge_base_id": knowledge_base_id,
        "spool_directory": spool,
        "answers": answers,
    });
    let setup_path = std::env::temp_dir().join(identifier("himring-recorder-setup"));
    std::fs::write(&setup_path, setup.to_string()).expect("the crash setup is written");
    let mut child =
        tokio::process::Command::new(std::env::current_exe().expect("the test binary has a path"))
            .args([
                "--ignored",
                "--exact",
                CRASHING_RECORDER_TEST,
                "--nocapture",
                "--test-threads=1",
            ])
            .env(CRASH_SETUP_VARIABLE, &setup_path)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .kill_on_drop(true)
            .spawn()
            .expect("the test binary starts again as the crashing recorder");
    let output = child.stdout.take().expect("the child has a stdout");
    let mut lines = BufReader::new(output).lines();
    let recorded = tokio::time::timeout(Duration::from_secs(30), async {
        while let Ok(Some(line)) = lines.next_line().await {
            if line.contains(RECORDED_LINE) {
                return true;
            }
        }
        false
    })
    .await;
    child.kill().await.expect("the crashing recorder is killed");
    let _ = std::fs::remove_file(&setup_path);
    assert_eq!(
        recorded.ok(),
        Some(true),
        "the crashing recorder exited before it recorded"
    );
}

pub fn act_as_crashing_recorder() {
    let Ok(setup_path) = std::env::var(CRASH_SETUP_VARIABLE) else {
        return;
    };
    let setup = std::fs::read_to_string(setup_path).expect("the crash setup is readable");
    let setup: Value = serde_json::from_str(&setup).expect("the setup is JSON");
    let text = |name: &str| {
        setup[name]
            .as_str()
            .expect("the setup holds the field")
            .to_owned()
    };
    let answers: BTreeMap<String, String> =
        serde_json::from_value(setup["answers"].clone()).expect("the setup holds answers");
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .expect("the runtime starts");
    runtime.block_on(async {
        let client = Himring::builder()
            .api_key(text("api_key"))
            .base_url(text("base_url"))
            .build()
            .expect("the client builds");
        let spool = SpoolDirectory::At(PathBuf::from(text("spool_directory")));
        let recorder = recorder_at(
            &client,
            spool,
            &text("project_id"),
            &text("knowledge_base_id"),
        );
        recorder.record(&drafts_of(&answers));
        println!("{RECORDED_LINE}");
        std::thread::sleep(Duration::from_secs(600));
    });
}
