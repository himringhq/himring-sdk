use std::collections::BTreeMap;

use crate::input_schema::input_fields_of;
use crate::names::{bare_identifier, input_type_name_of, output_type_name_of, setter_name_of};
use crate::spec_model::{JsonObject, OperationModel, SpecModel, SpecResult, spec_error};
use crate::type_model::{
    Definition, LiteralEnumModel, RustType, StructField, StructModel, TypeDirection, UnionEnumModel,
};
use crate::type_printer::{PrintContext, TypeCollector};

pub struct OperationTypes {
    pub input_name: String,
    pub output_type: Option<String>,
    pub nullable_fields: Vec<String>,
}

pub struct RenderedTypes {
    pub text: String,
    pub by_operation: BTreeMap<String, OperationTypes>,
}

fn operation_types(
    operation: &OperationModel,
    components: &JsonObject,
    collector: &mut TypeCollector,
    aliases: &mut Vec<(String, String)>,
) -> SpecResult<OperationTypes> {
    let input_name = input_type_name_of(&operation.id);
    let context = PrintContext {
        direction: TypeDirection::Input,
        components,
        place: format!("{} input", operation.id),
        name: input_name.clone(),
    };
    let fields: Vec<(String, JsonObject, bool)> = input_fields_of(operation)?
        .into_iter()
        .map(|field| (field.name, field.schema, field.required))
        .collect();
    collector.struct_of(&fields, &context)?;
    let nullable_fields = match collector.definition(&input_name) {
        Some(Definition::Struct(model)) => model
            .fields
            .iter()
            .filter(|field| field.nullable())
            .map(|field| field.json_name.clone())
            .collect(),
        _ => return spec_error(format!("{} has no input struct.", operation.id)),
    };
    let output_type = match &operation.response.schema {
        Some(schema) if !operation.response.is_download() => {
            let output_name = output_type_name_of(&operation.id);
            let output_context = PrintContext {
                direction: TypeDirection::Output,
                components,
                place: format!("{} output", operation.id),
                name: output_name.clone(),
            };
            let rendered = collector.rendered(schema, &output_context)?;
            if rendered != RustType::Named(output_name.clone()) {
                aliases.push((output_name.clone(), rendered.render()));
            }
            Some(output_name)
        }
        _ => None,
    };
    Ok(OperationTypes {
        input_name,
        output_type,
        nullable_fields,
    })
}

fn field_attributes(field: &StructField, direction: TypeDirection) -> Vec<String> {
    let mut attributes = Vec::new();
    if bare_identifier(&field.identifier) != field.json_name {
        attributes.push(format!("#[serde(rename = {:?})]", field.json_name));
    }
    let declared = field.declared_type(direction);
    if field.is_double_option(direction) {
        attributes.push(
            "#[serde(default, skip_serializing_if = \"Option::is_none\", deserialize_with = \"crate::serde_fields::double_option\")]".to_owned(),
        );
    } else if !field.required && declared == RustType::Json {
        attributes.push(
            "#[serde(default, skip_serializing_if = \"serde_json::Value::is_null\")]".to_owned(),
        );
    } else if !field.required {
        attributes.push("#[serde(default, skip_serializing_if = \"Option::is_none\")]".to_owned());
    }
    attributes
}

fn parameter_of(value: &RustType, collector: &TypeCollector) -> (String, &'static str) {
    match value {
        RustType::Text => ("impl Into<String>".to_owned(), ".into()"),
        RustType::Named(name)
            if matches!(collector.definition(name), Some(Definition::Union(_))) =>
        {
            (format!("impl Into<{name}>"), ".into()")
        }
        other => (other.render(), ""),
    }
}

fn struct_lines(model: &StructModel, collector: &TypeCollector) -> SpecResult<Vec<String>> {
    let defaultable =
        model.direction == TypeDirection::Input && model.fields.iter().all(|field| !field.required);
    let derives = if defaultable {
        "#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]"
    } else {
        "#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]"
    };
    let mut lines = vec![
        derives.to_owned(),
        "#[non_exhaustive]".to_owned(),
        format!("pub struct {} {{", model.name),
    ];
    for field in &model.fields {
        lines.extend(field_attributes(field, model.direction));
        lines.push(format!(
            "pub {}: {},",
            field.identifier,
            field.declared_type(model.direction).render()
        ));
    }
    lines.push("}".to_owned());
    if model.direction == TypeDirection::Output {
        return Ok(lines);
    }
    let mut parameters = Vec::new();
    let mut assignments = Vec::new();
    let mut setters = Vec::new();
    for field in &model.fields {
        if field.required {
            let (parameter, conversion) = parameter_of(&field.value_type, collector);
            parameters.push(format!("{}: {parameter}", field.identifier));
            assignments.push(format!(
                "{}: {}{conversion},",
                field.identifier, field.identifier
            ));
            continue;
        }
        assignments.push(format!("{}: None,", field.identifier));
        let setter = setter_name_of(&field.identifier, &model.name)?;
        let (parameter, conversion) = if field.is_double_option(model.direction) {
            (field.value_type.render(), "")
        } else {
            parameter_of(&field.value_type, collector)
        };
        setters.extend([
            "#[must_use]".to_owned(),
            format!("pub fn {setter}(mut self, value: {parameter}) -> Self {{"),
            format!("self.{} = Some(value{conversion});", field.identifier),
            "self".to_owned(),
            "}".to_owned(),
        ]);
    }
    lines.push(format!("impl {} {{", model.name));
    lines.push("#[must_use]".to_owned());
    lines.push(format!("pub fn new({}) -> Self {{", parameters.join(", ")));
    lines.push("Self {".to_owned());
    lines.extend(assignments);
    lines.extend(["}".to_owned(), "}".to_owned()]);
    lines.extend(setters);
    lines.push("}".to_owned());
    Ok(lines)
}

fn literal_lines(model: &LiteralEnumModel) -> Vec<String> {
    let single = model.values.len() == 1;
    let derives = if single {
        "#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash, Serialize, Deserialize)]"
    } else {
        "#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]"
    };
    let mut lines = vec![
        derives.to_owned(),
        "#[non_exhaustive]".to_owned(),
        format!("pub enum {} {{", model.name),
    ];
    for (variant, value) in &model.values {
        if single {
            lines.push("#[default]".to_owned());
        }
        lines.push(format!("#[serde(rename = {value:?})]"));
        lines.push(format!("{variant},"));
    }
    lines.push("}".to_owned());
    lines.push(format!("impl {} {{", model.name));
    lines.push("#[must_use]".to_owned());
    lines.push("pub fn as_str(self) -> &'static str {".to_owned());
    lines.push("match self {".to_owned());
    for (variant, value) in &model.values {
        lines.push(format!("Self::{variant} => {value:?},"));
    }
    lines.extend(["}".to_owned(), "}".to_owned(), "}".to_owned()]);
    lines
}

fn union_lines(model: &UnionEnumModel) -> Vec<String> {
    let mut lines = vec![
        "#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]".to_owned(),
        "#[serde(untagged)]".to_owned(),
        "#[non_exhaustive]".to_owned(),
        format!("pub enum {} {{", model.name),
    ];
    for (variant, member) in &model.variants {
        lines.push(format!("{variant}({}),", member.render()));
    }
    lines.push("}".to_owned());
    for (variant, member) in &model.variants {
        lines.push(format!(
            "impl From<{}> for {} {{",
            member.render(),
            model.name
        ));
        lines.push(format!("fn from(value: {}) -> Self {{", member.render()));
        lines.push(format!("Self::{variant}(value)"));
        lines.extend(["}".to_owned(), "}".to_owned()]);
        if member == &RustType::Text {
            lines.push(format!("impl From<&str> for {} {{", model.name));
            lines.push("fn from(value: &str) -> Self {".to_owned());
            lines.push(format!("Self::{variant}(value.to_owned())"));
            lines.extend(["}".to_owned(), "}".to_owned()]);
        }
    }
    lines
}

pub fn render_types(model: &SpecModel) -> SpecResult<RenderedTypes> {
    let mut collector = TypeCollector::default();
    let mut aliases = Vec::new();
    let mut by_operation = BTreeMap::new();
    for operation in &model.operations {
        let Some(components) = model.components.get(&operation.document) else {
            return spec_error(format!("{} has no components.", operation.id));
        };
        let types = operation_types(operation, components, &mut collector, &mut aliases)?;
        by_operation.insert(operation.id.clone(), types);
    }
    let mut blocks: Vec<Vec<String>> = Vec::new();
    for definition in &collector.definitions {
        blocks.push(match definition {
            Definition::Struct(model) => struct_lines(model, &collector)?,
            Definition::Literals(model) => literal_lines(model),
            Definition::Union(model) => union_lines(model),
        });
    }
    for (name, target) in aliases {
        blocks.push(vec![format!("pub type {name} = {target};")]);
    }
    let body = blocks
        .iter()
        .map(|block| block.join("\n"))
        .collect::<Vec<_>>()
        .join("\n\n");
    let mut header = Vec::new();
    if body.contains("BTreeMap<") {
        header.push("use std::collections::BTreeMap;");
    }
    header.push("use serde::{Deserialize, Serialize};");
    let text = format!("{}\n\n{body}\n", header.join("\n"));
    Ok(RenderedTypes { text, by_operation })
}
