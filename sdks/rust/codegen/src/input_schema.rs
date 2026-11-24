use std::collections::BTreeSet;

use crate::spec_model::{
    BodyKind, JsonObject, OperationModel, SpecResult, list_at, optional_record, spec_error,
};

pub const FILE_CONTENT_FIELD: &str = "content";

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FieldLocation {
    Path,
    Query,
    Body,
}

impl FieldLocation {
    fn describe(self) -> &'static str {
        match self {
            FieldLocation::Path => "path parameter",
            FieldLocation::Query => "query parameter",
            FieldLocation::Body => "body field",
        }
    }
}

#[derive(Clone, Debug)]
pub struct InputField {
    pub name: String,
    pub schema: JsonObject,
    pub required: bool,
    pub location: FieldLocation,
}

pub fn input_fields_of(operation: &OperationModel) -> SpecResult<Vec<InputField>> {
    let mut fields: Vec<InputField> = Vec::new();
    let mut add = |name: &str, schema: &JsonObject, required: bool, location: FieldLocation| {
        if fields.iter().any(|field| field.name == name) {
            return spec_error(format!(
                "{} takes {name} in more than one part of the request.",
                operation.id
            ));
        }
        fields.push(InputField {
            name: name.to_owned(),
            schema: schema.clone(),
            required,
            location,
        });
        Ok(())
    };
    for parameter in &operation.path_parameters {
        add(
            &parameter.name,
            &parameter.schema,
            true,
            FieldLocation::Path,
        )?;
    }
    for parameter in &operation.query_parameters {
        add(
            &parameter.name,
            &parameter.schema,
            parameter.required,
            FieldLocation::Query,
        )?;
    }
    if operation.body.kind == BodyKind::Json
        && let Some(body) = &operation.body.schema
    {
        let empty = JsonObject::new();
        let properties = optional_record(body.get("properties")).unwrap_or(&empty);
        let required: BTreeSet<&str> = list_at(body.get("required"))
            .iter()
            .filter_map(serde_json::Value::as_str)
            .collect();
        let missing: Vec<&str> = required
            .iter()
            .copied()
            .filter(|name| !properties.contains_key(*name))
            .collect();
        if !missing.is_empty() {
            return spec_error(format!(
                "{} requires the undocumented {}.",
                operation.id,
                missing.join(", ")
            ));
        }
        for (name, schema) in properties {
            let Some(schema) = optional_record(Some(schema)) else {
                return spec_error(format!(
                    "{} {} {name} has no schema.",
                    operation.id,
                    FieldLocation::Body.describe()
                ));
            };
            add(
                name,
                schema,
                required.contains(name.as_str()),
                FieldLocation::Body,
            )?;
        }
    }
    if operation.body.kind == BodyKind::File
        && fields.iter().any(|field| field.name == FILE_CONTENT_FIELD)
    {
        return spec_error(format!(
            "{} takes a field called {FILE_CONTENT_FIELD} beside its file.",
            operation.id
        ));
    }
    Ok(fields)
}
