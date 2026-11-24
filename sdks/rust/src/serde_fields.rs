use serde::de::Error as _;
use serde::{Deserialize, Deserializer};

pub(crate) fn boolean_constant<'de, D, T, const EXPECTED: bool>(
    deserializer: D,
) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: From<bool>,
{
    let value = bool::deserialize(deserializer)?;
    if value == EXPECTED {
        Ok(value.into())
    } else {
        Err(D::Error::custom(format!("expected {EXPECTED}")))
    }
}

pub(crate) fn integer_constant<'de, D, T, const EXPECTED: i64>(
    deserializer: D,
) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: From<i64>,
{
    let value = i64::deserialize(deserializer)?;
    if value == EXPECTED {
        Ok(value.into())
    } else {
        Err(D::Error::custom(format!("expected {EXPECTED}")))
    }
}

pub(crate) fn required<'de, T, D>(deserializer: D) -> Result<T, D::Error>
where
    T: Deserialize<'de>,
    D: Deserializer<'de>,
{
    T::deserialize(deserializer)
}

pub(crate) fn present<'de, T, D>(deserializer: D) -> Result<Option<T>, D::Error>
where
    T: Deserialize<'de>,
    D: Deserializer<'de>,
{
    T::deserialize(deserializer).map(Some)
}

#[allow(clippy::option_option)]
pub(crate) fn double_option<'de, T, D>(deserializer: D) -> Result<Option<Option<T>>, D::Error>
where
    T: Deserialize<'de>,
    D: Deserializer<'de>,
{
    Option::<T>::deserialize(deserializer).map(Some)
}
