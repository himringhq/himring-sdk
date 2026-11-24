use std::collections::HashMap;
use std::fmt::Write as _;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use tokio::io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::{TcpListener, TcpStream};
use tokio::task::JoinHandle;

#[derive(Clone, Debug, Default)]
pub struct RawReply {
    pub status: u16,
    pub body: Vec<u8>,
    pub headers: Vec<(String, String)>,
    pub delay: Duration,
    pub drip: Duration,
    pub cut_after_bytes: Option<usize>,
    pub hang_after_body: bool,
}

impl RawReply {
    pub fn status(status: u16) -> Self {
        Self {
            status,
            ..Self::default()
        }
    }

    pub fn with_body(status: u16, body: impl Into<Vec<u8>>) -> Self {
        Self {
            status,
            body: body.into(),
            ..Self::default()
        }
    }

    pub fn header(mut self, name: &str, value: &str) -> Self {
        self.headers.push((name.to_owned(), value.to_owned()));
        self
    }

    pub fn delayed(mut self, delay: Duration) -> Self {
        self.delay = delay;
        self
    }

    pub fn dripped(mut self, drip: Duration) -> Self {
        self.drip = drip;
        self
    }

    pub fn cut_after(mut self, bytes: usize) -> Self {
        self.cut_after_bytes = Some(bytes);
        self
    }

    pub fn hanging(mut self) -> Self {
        self.hang_after_body = true;
        self
    }
}

#[derive(Clone, Debug)]
pub struct ArrivedRequest {
    pub method: String,
    pub path: String,
    pub headers: HashMap<String, String>,
    pub body: Vec<u8>,
}

#[derive(Default)]
struct StandInState {
    replies: HashMap<(String, String), Vec<RawReply>>,
    arrived: Vec<ArrivedRequest>,
    in_flight: usize,
    most_in_flight: usize,
    closed_early: usize,
}

pub struct StandInServer {
    pub base_url: String,
    state: Arc<Mutex<StandInState>>,
    task: JoinHandle<()>,
}

async fn read_request(reader: &mut BufReader<TcpStream>) -> Option<ArrivedRequest> {
    let mut line = String::new();
    if reader.read_line(&mut line).await.ok()? == 0 {
        return None;
    }
    let mut parts = line.split_whitespace();
    let method = parts.next()?.to_owned();
    let path = parts.next()?.to_owned();
    let mut headers = HashMap::new();
    loop {
        let mut header = String::new();
        reader.read_line(&mut header).await.ok()?;
        let header = header.trim_end();
        if header.is_empty() {
            break;
        }
        let (name, value) = header.split_once(':')?;
        headers.insert(name.trim().to_ascii_lowercase(), value.trim().to_owned());
    }
    let mut body = Vec::new();
    if headers
        .get("transfer-encoding")
        .is_some_and(|value| value.eq_ignore_ascii_case("chunked"))
    {
        loop {
            let mut size_line = String::new();
            reader.read_line(&mut size_line).await.ok()?;
            let size = usize::from_str_radix(size_line.trim().split(';').next()?, 16).ok()?;
            let mut chunk = vec![0; size + 2];
            reader.read_exact(&mut chunk).await.ok()?;
            if size == 0 {
                break;
            }
            body.extend_from_slice(&chunk[..size]);
        }
    } else if let Some(length) = headers
        .get("content-length")
        .and_then(|value| value.parse::<usize>().ok())
    {
        body.resize(length, 0);
        reader.read_exact(&mut body).await.ok()?;
    }
    Some(ArrivedRequest {
        method,
        path,
        headers,
        body,
    })
}

fn next_reply(state: &Mutex<StandInState>, method: &str, path: &str) -> RawReply {
    let mut state = state.lock().expect("the stand-in state is not poisoned");
    if let Some(queue) = state.replies.get_mut(&(method.to_owned(), path.to_owned()))
        && !queue.is_empty()
    {
        return if queue.len() > 1 {
            queue.remove(0)
        } else {
            queue[0].clone()
        };
    }
    RawReply::status(if method == "PUT" { 200 } else { 404 })
}

async fn answer(stream: TcpStream, state: Arc<Mutex<StandInState>>) {
    let mut reader = BufReader::new(stream);
    while let Some(request) = read_request(&mut reader).await {
        {
            let mut state = state.lock().expect("the stand-in state is not poisoned");
            state.in_flight += 1;
            state.most_in_flight = state.most_in_flight.max(state.in_flight);
            state.arrived.push(request.clone());
        }
        let reply = next_reply(&state, &request.method, &request.path);
        tokio::time::sleep(reply.delay).await;
        let stream = reader.get_mut();
        let mut head = format!(
            "HTTP/1.1 {} Stand-in\r\ncontent-length: {}\r\n",
            reply.status,
            reply.body.len()
        );
        for (name, value) in &reply.headers {
            write!(head, "{name}: {value}\r\n").expect("writing to a String succeeds");
        }
        head.push_str("\r\n");
        let mut finished = stream.write_all(head.as_bytes()).await.is_ok();
        let sent = reply
            .cut_after_bytes
            .unwrap_or(reply.body.len())
            .min(reply.body.len());
        if reply.drip.is_zero() {
            finished &= stream.write_all(&reply.body[..sent]).await.is_ok();
        } else {
            for byte in &reply.body[..sent] {
                if stream.write_all(std::slice::from_ref(byte)).await.is_err() {
                    finished = false;
                    break;
                }
                let _ = stream.flush().await;
                tokio::time::sleep(reply.drip).await;
            }
        }
        let _ = stream.flush().await;
        {
            let mut state = state.lock().expect("the stand-in state is not poisoned");
            state.in_flight -= 1;
        }
        if reply.hang_after_body {
            let mut sink = [0_u8; 1];
            let closed = matches!(reader.read(&mut sink).await, Ok(0) | Err(_));
            if closed {
                state
                    .lock()
                    .expect("the stand-in state is not poisoned")
                    .closed_early += 1;
            }
            return;
        }
        if !finished || reply.cut_after_bytes.is_some() {
            return;
        }
    }
}

impl StandInServer {
    pub async fn start() -> Self {
        let listener = TcpListener::bind("127.0.0.1:0")
            .await
            .expect("the stand-in binds a loopback port");
        let address = listener.local_addr().expect("the stand-in has an address");
        let state = Arc::new(Mutex::new(StandInState::default()));
        let shared = Arc::clone(&state);
        let task = tokio::spawn(async move {
            while let Ok((stream, _)) = listener.accept().await {
                tokio::spawn(answer(stream, Arc::clone(&shared)));
            }
        });
        Self {
            base_url: format!("http://{address}"),
            state,
            task,
        }
    }

    pub fn answer(&self, method: &str, path: &str, replies: Vec<RawReply>) {
        self.state
            .lock()
            .expect("the stand-in state is not poisoned")
            .replies
            .insert((method.to_owned(), path.to_owned()), replies);
    }

    pub fn arrived(&self, method: Option<&str>) -> Vec<ArrivedRequest> {
        let state = self
            .state
            .lock()
            .expect("the stand-in state is not poisoned");
        state
            .arrived
            .iter()
            .filter(|request| method.is_none_or(|method| request.method == method))
            .cloned()
            .collect()
    }

    pub fn most_in_flight(&self) -> usize {
        self.state
            .lock()
            .expect("the stand-in state is not poisoned")
            .most_in_flight
    }

    pub fn closed_early(&self) -> usize {
        self.state
            .lock()
            .expect("the stand-in state is not poisoned")
            .closed_early
    }
}

impl Drop for StandInServer {
    fn drop(&mut self) {
        self.task.abort();
    }
}
