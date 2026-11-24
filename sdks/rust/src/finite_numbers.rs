use std::fmt;

use serde::ser::{
    self, Serialize, SerializeMap, SerializeSeq, SerializeStruct, SerializeStructVariant,
    SerializeTuple, SerializeTupleStruct, SerializeTupleVariant,
};

#[derive(Debug)]
pub(crate) struct NonFiniteNumber;

impl fmt::Display for NonFiniteNumber {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str("the value holds a number that is not finite")
    }
}

impl std::error::Error for NonFiniteNumber {}

impl ser::Error for NonFiniteNumber {
    fn custom<T: fmt::Display>(_message: T) -> Self {
        NonFiniteNumber
    }
}

pub(crate) fn holds_only_finite_numbers<T: Serialize + ?Sized>(value: &T) -> bool {
    value.serialize(FiniteCheck).is_ok()
}

struct FiniteCheck;

type CheckResult = Result<(), NonFiniteNumber>;

fn checked_float(value: f64) -> CheckResult {
    if value.is_finite() {
        Ok(())
    } else {
        Err(NonFiniteNumber)
    }
}

impl ser::Serializer for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;
    type SerializeSeq = Self;
    type SerializeTuple = Self;
    type SerializeTupleStruct = Self;
    type SerializeTupleVariant = Self;
    type SerializeMap = Self;
    type SerializeStruct = Self;
    type SerializeStructVariant = Self;

    fn serialize_bool(self, _value: bool) -> CheckResult {
        Ok(())
    }
    fn serialize_i8(self, _value: i8) -> CheckResult {
        Ok(())
    }
    fn serialize_i16(self, _value: i16) -> CheckResult {
        Ok(())
    }
    fn serialize_i32(self, _value: i32) -> CheckResult {
        Ok(())
    }
    fn serialize_i64(self, _value: i64) -> CheckResult {
        Ok(())
    }
    fn serialize_u8(self, _value: u8) -> CheckResult {
        Ok(())
    }
    fn serialize_u16(self, _value: u16) -> CheckResult {
        Ok(())
    }
    fn serialize_u32(self, _value: u32) -> CheckResult {
        Ok(())
    }
    fn serialize_u64(self, _value: u64) -> CheckResult {
        Ok(())
    }
    fn serialize_f32(self, value: f32) -> CheckResult {
        checked_float(f64::from(value))
    }
    fn serialize_f64(self, value: f64) -> CheckResult {
        checked_float(value)
    }
    fn serialize_char(self, _value: char) -> CheckResult {
        Ok(())
    }
    fn serialize_str(self, _value: &str) -> CheckResult {
        Ok(())
    }
    fn serialize_bytes(self, _value: &[u8]) -> CheckResult {
        Ok(())
    }
    fn serialize_none(self) -> CheckResult {
        Ok(())
    }
    fn serialize_some<T: Serialize + ?Sized>(self, value: &T) -> CheckResult {
        value.serialize(self)
    }
    fn serialize_unit(self) -> CheckResult {
        Ok(())
    }
    fn serialize_unit_struct(self, _name: &'static str) -> CheckResult {
        Ok(())
    }

    fn serialize_unit_variant(
        self,
        _name: &'static str,
        _index: u32,
        _variant: &'static str,
    ) -> CheckResult {
        Ok(())
    }

    fn serialize_newtype_struct<T: Serialize + ?Sized>(
        self,
        _name: &'static str,
        value: &T,
    ) -> CheckResult {
        value.serialize(self)
    }

    fn serialize_newtype_variant<T: Serialize + ?Sized>(
        self,
        _name: &'static str,
        _index: u32,
        _variant: &'static str,
        value: &T,
    ) -> CheckResult {
        value.serialize(self)
    }

    fn serialize_seq(self, _length: Option<usize>) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }
    fn serialize_tuple(self, _length: usize) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }

    fn serialize_tuple_struct(
        self,
        _name: &'static str,
        _length: usize,
    ) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }

    fn serialize_tuple_variant(
        self,
        _name: &'static str,
        _index: u32,
        _variant: &'static str,
        _length: usize,
    ) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }

    fn serialize_map(self, _length: Option<usize>) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }

    fn serialize_struct(
        self,
        _name: &'static str,
        _length: usize,
    ) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }

    fn serialize_struct_variant(
        self,
        _name: &'static str,
        _index: u32,
        _variant: &'static str,
        _length: usize,
    ) -> Result<Self, NonFiniteNumber> {
        Ok(self)
    }
}

impl SerializeSeq for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;
    fn serialize_element<T: Serialize + ?Sized>(&mut self, value: &T) -> CheckResult {
        value.serialize(FiniteCheck)
    }
    fn end(self) -> CheckResult {
        Ok(())
    }
}

impl SerializeTuple for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;
    fn serialize_element<T: Serialize + ?Sized>(&mut self, value: &T) -> CheckResult {
        value.serialize(FiniteCheck)
    }
    fn end(self) -> CheckResult {
        Ok(())
    }
}

impl SerializeTupleStruct for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;
    fn serialize_field<T: Serialize + ?Sized>(&mut self, value: &T) -> CheckResult {
        value.serialize(FiniteCheck)
    }
    fn end(self) -> CheckResult {
        Ok(())
    }
}

impl SerializeTupleVariant for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;
    fn serialize_field<T: Serialize + ?Sized>(&mut self, value: &T) -> CheckResult {
        value.serialize(FiniteCheck)
    }
    fn end(self) -> CheckResult {
        Ok(())
    }
}

impl SerializeMap for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;
    fn serialize_key<T: Serialize + ?Sized>(&mut self, key: &T) -> CheckResult {
        key.serialize(FiniteCheck)
    }
    fn serialize_value<T: Serialize + ?Sized>(&mut self, value: &T) -> CheckResult {
        value.serialize(FiniteCheck)
    }
    fn end(self) -> CheckResult {
        Ok(())
    }
}

impl SerializeStruct for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;

    fn serialize_field<T: Serialize + ?Sized>(
        &mut self,
        _key: &'static str,
        value: &T,
    ) -> CheckResult {
        value.serialize(FiniteCheck)
    }

    fn end(self) -> CheckResult {
        Ok(())
    }
}

impl SerializeStructVariant for FiniteCheck {
    type Ok = ();
    type Error = NonFiniteNumber;

    fn serialize_field<T: Serialize + ?Sized>(
        &mut self,
        _key: &'static str,
        value: &T,
    ) -> CheckResult {
        value.serialize(FiniteCheck)
    }

    fn end(self) -> CheckResult {
        Ok(())
    }
}
