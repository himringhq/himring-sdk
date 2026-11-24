use std::fmt;
use std::future::{Future, IntoFuture};
use std::pin::Pin;
use std::time::Duration;

use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::client::Himring;
use crate::download::Download;
use crate::errors::{HimringApiError, invalid_input};
use crate::file_content::FileContent;
use crate::operation_description::{OperationDescription, operation_of};
use crate::request_parts::{fields_of, request_parts_of};
use crate::responses::json_of;
use crate::settings::positive_duration;
use crate::transport::{Answer, execute};

type Decode<T> = fn(Answer, &'static OperationDescription) -> Result<T, HimringApiError>;

pub enum Invoked {
    Json(Value),
    Download(Download),
}

impl fmt::Debug for Invoked {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Json(value) => formatter.debug_tuple("Json").field(value).finish(),
            Self::Download(download) => formatter.debug_tuple("Download").field(download).finish(),
        }
    }
}

#[must_use = "an operation call does nothing until it is awaited"]
pub struct OperationCall<'a, T> {
    client: &'a Himring,
    operation_id: String,
    fields: Result<Map<String, Value>, HimringApiError>,
    content: Option<FileContent>,
    timeout: Option<Duration>,
    decode: Decode<T>,
}

fn decoded_json<T: DeserializeOwned>(
    answer: Answer,
    operation: &'static OperationDescription,
) -> Result<T, HimringApiError> {
    match answer {
        Answer::Body {
            status,
            headers,
            body,
        } => json_of(status, &headers, &body, operation),
        Answer::Download(_) => Err(invalid_input(
            format!(
                "{} answers with a file. Call it through its download method.",
                operation.operation_id
            ),
            None,
        )),
    }
}

fn decoded_download(
    answer: Answer,
    operation: &'static OperationDescription,
) -> Result<Download, HimringApiError> {
    match answer {
        Answer::Download(download) => Ok(download),
        Answer::Body { .. } => Err(invalid_input(
            format!("{} answers with JSON, not a file.", operation.operation_id),
            None,
        )),
    }
}

fn decoded_any(
    answer: Answer,
    operation: &'static OperationDescription,
) -> Result<Invoked, HimringApiError> {
    match answer {
        Answer::Download(download) => Ok(Invoked::Download(download)),
        Answer::Body { .. } => decoded_json(answer, operation).map(Invoked::Json),
    }
}

impl<'a, T: DeserializeOwned> OperationCall<'a, T> {
    pub(crate) fn new<I: Serialize>(
        client: &'a Himring,
        operation_id: &'static str,
        input: &I,
    ) -> Self {
        Self::built(client, operation_id, input, None, decoded_json::<T>)
    }

    pub(crate) fn with_file<I: Serialize>(
        client: &'a Himring,
        operation_id: &'static str,
        input: &I,
        content: FileContent,
    ) -> Self {
        Self::built(
            client,
            operation_id,
            input,
            Some(content),
            decoded_json::<T>,
        )
    }
}

impl<'a> OperationCall<'a, Download> {
    pub(crate) fn download<I: Serialize>(
        client: &'a Himring,
        operation_id: &'static str,
        input: &I,
    ) -> Self {
        Self::built(client, operation_id, input, None, decoded_download)
    }
}

impl<'a> OperationCall<'a, Invoked> {
    pub(crate) fn invoked(
        client: &'a Himring,
        operation_id: &str,
        fields: Map<String, Value>,
    ) -> Self {
        Self {
            client,
            operation_id: operation_id.to_owned(),
            fields: Ok(fields),
            content: None,
            timeout: None,
            decode: decoded_any,
        }
    }

    pub fn content(mut self, content: FileContent) -> Self {
        self.content = Some(content);
        self
    }
}

impl<'a, T> OperationCall<'a, T> {
    fn built<I: Serialize>(
        client: &'a Himring,
        operation_id: &'static str,
        input: &I,
        content: Option<FileContent>,
        decode: Decode<T>,
    ) -> Self {
        Self {
            client,
            operation_id: operation_id.to_owned(),
            fields: fields_of(operation_id, input),
            content,
            timeout: None,
            decode,
        }
    }

    pub fn timeout(mut self, timeout: Duration) -> Self {
        self.timeout = Some(timeout);
        self
    }

    async fn run(self) -> Result<T, HimringApiError> {
        let operation = operation_of(&self.operation_id)?;
        let fields = self.fields?;
        let timeout =
            positive_duration(self.timeout, self.client.inner.settings.timeout, "timeout")?;
        let parts = request_parts_of(operation, fields.clone(), self.content)?;
        let answer = execute(&self.client.inner, operation, parts, &fields, timeout).await?;
        (self.decode)(answer, operation)
    }
}

impl<'a, T: Send + 'a> IntoFuture for OperationCall<'a, T> {
    type Output = Result<T, HimringApiError>;
    type IntoFuture = Pin<Box<dyn Future<Output = Self::Output> + Send + 'a>>;

    fn into_future(self) -> Self::IntoFuture {
        Box::pin(self.run())
    }
}
