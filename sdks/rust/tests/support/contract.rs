use std::path::PathBuf;
use std::process::Stdio;

use himring::reqwest;
use serde_json::{Value, json};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{Child, Command};

pub const API_KEY: &str = "hk_test_rust_sdk";

fn repository_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("..")
}

#[derive(Clone, Debug)]
pub struct RecordedRequest {
    pub operation_id: Option<String>,
    pub method: String,
    pub path: String,
    pub path_parameters: Value,
    pub query: Value,
    pub headers: Value,
    pub body: Value,
    pub raw_body_bytes: u64,
    pub problems: Vec<String>,
}

impl RecordedRequest {
    pub fn header(&self, name: &str) -> Option<&str> {
        self.headers.get(name).and_then(Value::as_str)
    }
}

pub struct ContractApi {
    process: Child,
    pub base_url: String,
    http: reqwest::Client,
}

impl ContractApi {
    pub async fn start() -> Self {
        let mut process = Command::new("node")
            .arg(repository_root().join("tools/contract-server/dist/serve.js"))
            .current_dir(repository_root())
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .kill_on_drop(true)
            .spawn()
            .expect("node starts the contract server");
        let output = process
            .stdout
            .take()
            .expect("the contract server has a stdout");
        let mut first_line = String::new();
        BufReader::new(output)
            .read_line(&mut first_line)
            .await
            .expect("the contract server prints its address");
        let started: Value = serde_json::from_str(&first_line).expect("the address line is JSON");
        let base_url = started["base_url"]
            .as_str()
            .expect("the line holds base_url")
            .to_owned();
        Self {
            process,
            base_url,
            http: reqwest::Client::new(),
        }
    }

    async fn control(&self, method: reqwest::Method, path: &str, body: Option<Value>) -> Value {
        let mut request = self
            .http
            .request(method, format!("{}/__contract/{path}", self.base_url));
        if let Some(body) = body {
            request = request
                .header(reqwest::header::CONTENT_TYPE, "application/json")
                .body(serde_json::to_vec(&body).expect("the control body serializes"));
        }
        let response = request
            .send()
            .await
            .expect("the contract server answers its control route");
        let text = response
            .text()
            .await
            .expect("the control answer has a body");
        if text.is_empty() {
            Value::Null
        } else {
            serde_json::from_str(&text).expect("the control answer is JSON")
        }
    }

    pub async fn stub(&self, operation_id: &str, status: u16, body: Value) {
        self.stub_with_headers(operation_id, status, body, json!({}))
            .await;
    }

    pub async fn stub_with_headers(
        &self,
        operation_id: &str,
        status: u16,
        body: Value,
        headers: Value,
    ) {
        let reply = json!({ "operation_id": operation_id, "status": status, "body": body, "headers": headers });
        self.control(reqwest::Method::POST, "stubs", Some(reply))
            .await;
    }

    pub async fn script(&self, operation_id: &str, replies: Vec<Value>) {
        let status = replies[0]["status"].clone();
        let stub = json!({ "operation_id": operation_id, "status": status, "replies": replies });
        self.control(reqwest::Method::POST, "stubs", Some(stub))
            .await;
    }

    pub async fn recorded(&self) -> (Vec<RecordedRequest>, Vec<String>) {
        let report = self.control(reqwest::Method::GET, "requests", None).await;
        let texts = |value: &Value| -> Vec<String> {
            value
                .as_array()
                .map(|items| {
                    items
                        .iter()
                        .map(|item| item.as_str().unwrap_or_default().to_owned())
                        .collect()
                })
                .unwrap_or_default()
        };
        let requests = report["requests"]
            .as_array()
            .map(|items| {
                items
                    .iter()
                    .map(|entry| RecordedRequest {
                        operation_id: entry["operation_id"].as_str().map(str::to_owned),
                        method: entry["method"].as_str().unwrap_or_default().to_owned(),
                        path: entry["path"].as_str().unwrap_or_default().to_owned(),
                        path_parameters: entry["path_parameters"].clone(),
                        query: entry["query"].clone(),
                        headers: entry["headers"].clone(),
                        body: entry.get("body").cloned().unwrap_or(Value::Null),
                        raw_body_bytes: entry["raw_body_bytes"].as_u64().unwrap_or_default(),
                        problems: texts(&entry["problems"]),
                    })
                    .collect()
            })
            .unwrap_or_default();
        (requests, texts(&report["problems"]))
    }

    pub async fn requests_for(&self, operation_id: &str) -> Vec<RecordedRequest> {
        let (requests, _) = self.recorded().await;
        requests
            .into_iter()
            .filter(|request| request.operation_id.as_deref() == Some(operation_id))
            .collect()
    }

    pub async fn operations_called(&self) -> Vec<String> {
        let (requests, _) = self.recorded().await;
        requests
            .into_iter()
            .filter_map(|request| request.operation_id)
            .collect()
    }

    pub async fn assert_clean(&self) -> Vec<RecordedRequest> {
        let (requests, problems) = self.recorded().await;
        assert_eq!(problems, Vec::<String>::new());
        let request_problems: Vec<Vec<String>> = requests
            .iter()
            .map(|request| request.problems.clone())
            .filter(|problems| !problems.is_empty())
            .collect();
        assert_eq!(request_problems, Vec::<Vec<String>>::new());
        requests
    }

    pub async fn assert_untouched(&self) {
        let (requests, problems) = self.recorded().await;
        assert!(requests.is_empty(), "the client sent {requests:?}");
        assert!(
            problems.is_empty(),
            "the contract server found {problems:?}"
        );
    }
}

impl Drop for ContractApi {
    fn drop(&mut self) {
        let _ = self.process.start_kill();
    }
}
