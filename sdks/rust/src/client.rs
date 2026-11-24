use std::fmt;
use std::sync::Arc;
use std::time::Duration;

use serde_json::{Map, Value};

use crate::errors::HimringApiError;
use crate::operation_call::{Invoked, OperationCall};
use crate::settings::{
    ClientSettings, DEFAULT_HIMRING_API_URL, DEFAULT_TIMEOUT, DEFAULT_UPLOAD_IDLE_TIMEOUT,
    api_url_of, credential_of, custom_headers_of, positive_duration, setting_error,
};

pub(crate) struct ClientInner {
    pub settings: ClientSettings,
    pub http: reqwest::Client,
}

#[derive(Clone)]
pub struct Himring {
    pub(crate) inner: Arc<ClientInner>,
}

#[must_use]
pub struct HimringBuilder {
    api_key: Option<String>,
    session_token: Option<String>,
    base_url: String,
    timeout: Option<Duration>,
    upload_idle_timeout: Option<Duration>,
    headers: Vec<(String, String)>,
    http_client_builder: Option<reqwest::ClientBuilder>,
}

impl HimringBuilder {
    pub fn api_key(mut self, api_key: impl Into<String>) -> Self {
        self.api_key = Some(api_key.into());
        self
    }

    pub fn session_token(mut self, session_token: impl Into<String>) -> Self {
        self.session_token = Some(session_token.into());
        self
    }

    pub fn base_url(mut self, base_url: impl Into<String>) -> Self {
        self.base_url = base_url.into();
        self
    }

    pub fn timeout(mut self, timeout: Duration) -> Self {
        self.timeout = Some(timeout);
        self
    }

    pub fn upload_idle_timeout(mut self, upload_idle_timeout: Duration) -> Self {
        self.upload_idle_timeout = Some(upload_idle_timeout);
        self
    }

    pub fn header(mut self, name: impl Into<String>, value: impl Into<String>) -> Self {
        self.headers.push((name.into(), value.into()));
        self
    }

    pub fn http_client_builder(mut self, builder: reqwest::ClientBuilder) -> Self {
        self.http_client_builder = Some(builder);
        self
    }

    pub fn build(self) -> Result<Himring, HimringApiError> {
        let settings = ClientSettings {
            base_url: api_url_of(&self.base_url)?,
            timeout: positive_duration(self.timeout, DEFAULT_TIMEOUT, "timeout")?,
            upload_idle_timeout: positive_duration(
                self.upload_idle_timeout,
                DEFAULT_UPLOAD_IDLE_TIMEOUT,
                "upload_idle_timeout",
            )?,
            credential: credential_of(self.api_key, self.session_token)?,
            headers: custom_headers_of(self.headers)?,
        };
        let http = self
            .http_client_builder
            .unwrap_or_default()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .map_err(|error| {
                setting_error("The client could not build its HTTP client.").caused_by(error)
            })?;
        Ok(Himring {
            inner: Arc::new(ClientInner { settings, http }),
        })
    }
}

impl Himring {
    pub fn builder() -> HimringBuilder {
        HimringBuilder {
            api_key: None,
            session_token: None,
            base_url: DEFAULT_HIMRING_API_URL.to_owned(),
            timeout: None,
            upload_idle_timeout: None,
            headers: Vec::new(),
            http_client_builder: None,
        }
    }

    pub fn base_url(&self) -> &str {
        self.inner.settings.base_url.as_str()
    }

    pub fn invoke(
        &self,
        operation_id: &str,
        fields: Map<String, Value>,
    ) -> OperationCall<'_, Invoked> {
        OperationCall::invoked(self, operation_id, fields)
    }
}

impl fmt::Debug for Himring {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("Himring")
            .field("base_url", &self.base_url())
            .finish_non_exhaustive()
    }
}
