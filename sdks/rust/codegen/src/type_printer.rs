use std::collections::{BTreeSet, HashMap};

use serde_json::Value;

use crate::names::{field_identifier_of, pascal_of, variant_name_of};
use crate::schema_keywords::{checked_keywords, resolved};
use crate::spec_model::{JsonObject, SpecResult, list_at, optional_record, spec_error};
use crate::type_model::{
    Definition, LiteralEnumModel, RustType, StructField, StructModel, TypeDirection, TypeUnion,
    UnionEnumModel, deduplicated,
};
use crate::union_shapes::{literal_union, option_names, ordered_members};

const EXTENSION_PREFIX: &str = "x-";

#[derive(Clone)]
pub struct PrintContext<'a> {
    pub direction: TypeDirection,
    pub components: &'a JsonObject,
    pub place: String,
    pub name: String,
}

impl PrintContext<'_> {
    fn child(&self, place_suffix: &str, name_suffix: &str) -> Self {
        PrintContext {
            direction: self.direction,
            components: self.components,
            place: format!("{}{place_suffix}", self.place),
            name: format!("{}{name_suffix}", self.name),
        }
    }

    fn renamed(&self, place_suffix: &str, name: String) -> Self {
        PrintContext {
            direction: self.direction,
            components: self.components,
            place: format!("{}{place_suffix}", self.place),
            name,
        }
    }
}

#[derive(Default)]
pub struct TypeCollector {
    pub definitions: Vec<Definition>,
    positions: HashMap<String, usize>,
}

impl TypeCollector {
    pub fn register(&mut self, definition: Definition, place: &str) -> SpecResult<String> {
        let name = definition.name().to_owned();
        if let Some(position) = self.positions.get(&name) {
            if self.definitions[*position] != definition {
                return spec_error(format!(
                    "{place} needs the type name {name}, which another shape holds."
                ));
            }
            return Ok(name);
        }
        self.positions.insert(name.clone(), self.definitions.len());
        self.definitions.push(definition);
        Ok(name)
    }

    pub fn definition(&self, name: &str) -> Option<&Definition> {
        self.positions
            .get(name)
            .map(|position| &self.definitions[*position])
    }

    pub fn rendered(
        &mut self,
        schema: &JsonObject,
        context: &PrintContext,
    ) -> SpecResult<RustType> {
        let union = self.union_of(schema, context)?;
        self.render(&union, context)
    }

    pub fn union_of(&mut self, raw: &JsonObject, context: &PrintContext) -> SpecResult<TypeUnion> {
        let schema = resolved(raw, context.components, &context.place)?;
        checked_keywords(schema, &context.place)?;
        if let Some(constant) = schema.get("const") {
            return literal_union(std::slice::from_ref(constant), &context.place);
        }
        if let Some(values) = schema.get("enum") {
            return literal_union(list_at(Some(values)), &context.place);
        }
        if schema.contains_key("anyOf") {
            return self.any_of(schema, context);
        }
        match schema.get("type") {
            Some(Value::Array(kinds)) => {
                let mut unions = Vec::new();
                for kind in kinds {
                    let Some(kind) = kind.as_str() else {
                        return spec_error(format!(
                            "{} lists a type that is not text.",
                            context.place
                        ));
                    };
                    unions.push(self.of_type(kind, schema, context)?);
                }
                Ok(TypeUnion::merged(unions))
            }
            Some(Value::String(kind)) => self.of_type(kind, schema, context),
            _ => Ok(TypeUnion::of(RustType::Json)),
        }
    }

    pub fn struct_of(
        &mut self,
        fields: &[(String, JsonObject, bool)],
        context: &PrintContext,
    ) -> SpecResult<String> {
        let mut built = Vec::new();
        let mut identifiers = BTreeSet::new();
        for (name, schema, required) in fields {
            let identifier = field_identifier_of(name, &context.place)?;
            if !identifiers.insert(identifier.clone()) {
                return spec_error(format!(
                    "{} takes two fields that share the Rust name {identifier}.",
                    context.place
                ));
            }
            let child = context.child(&format!(".{name}"), &pascal_of(name));
            built.push(StructField {
                json_name: name.clone(),
                identifier,
                value_type: self.rendered(schema, &child)?,
                required: *required,
                constant: resolved(schema, context.components, &child.place)?
                    .get("const")
                    .cloned(),
            });
        }
        let model = StructModel {
            name: context.name.clone(),
            direction: context.direction,
            fields: built,
        };
        self.register(Definition::Struct(model), &context.place)
    }

    pub fn render(&mut self, union: &TypeUnion, context: &PrintContext) -> SpecResult<RustType> {
        let mut members = deduplicated(&union.members);
        if members.contains(&RustType::Json) {
            return Ok(RustType::Json);
        }
        if members.contains(&RustType::Number) {
            members.retain(|member| member != &RustType::Integer);
        }
        let literals: Vec<String> = deduplicated(&union.literals)
            .into_iter()
            .filter(|_| !members.contains(&RustType::Text))
            .collect();
        if !literals.is_empty() {
            let name = if members.is_empty() {
                context.name.clone()
            } else {
                format!("{}Choice", context.name)
            };
            members.push(RustType::Named(
                self.literal_enum(name, &literals, context)?,
            ));
        }
        let base = match members.len() {
            0 if union.nullable => return Ok(RustType::Json),
            0 => return spec_error(format!("{} allows no value at all.", context.place)),
            1 => members.remove(0),
            _ => RustType::Named(self.union_enum(members, context)?),
        };
        Ok(if union.nullable {
            RustType::Optional(Box::new(base))
        } else {
            base
        })
    }

    fn literal_enum(
        &mut self,
        name: String,
        literals: &[String],
        context: &PrintContext,
    ) -> SpecResult<String> {
        let mut values = Vec::new();
        for literal in literals {
            let variant = variant_name_of(literal, &context.place)?;
            if values
                .iter()
                .any(|(known, _): &(String, String)| known == &variant)
            {
                return spec_error(format!(
                    "{} allows two values with the Rust name {variant}.",
                    context.place
                ));
            }
            values.push((variant, literal.clone()));
        }
        self.register(
            Definition::Literals(LiteralEnumModel { name, values }),
            &context.place,
        )
    }

    fn union_enum(&mut self, members: Vec<RustType>, context: &PrintContext) -> SpecResult<String> {
        let ordered = ordered_members(members);
        let name = if ordered.iter().all(RustType::is_scalar) {
            ordered
                .iter()
                .map(RustType::scalar_word)
                .collect::<Vec<_>>()
                .join("Or")
        } else {
            context.name.clone()
        };
        let mut variants: Vec<(String, RustType)> = Vec::new();
        for member in ordered {
            let variant = match &member {
                RustType::Named(named) => {
                    if let Some(Definition::Literals(_)) = self.definition(named) {
                        "Choice".to_owned()
                    } else {
                        let suffix = named.strip_prefix(&context.name).unwrap_or(named);
                        if suffix.is_empty() {
                            "Object".to_owned()
                        } else {
                            suffix.to_owned()
                        }
                    }
                }
                other => other.scalar_word().to_owned(),
            };
            if variants.iter().any(|(known, _)| known == &variant) {
                return spec_error(format!(
                    "{} holds two options with the Rust name {variant}.",
                    context.place
                ));
            }
            variants.push((variant, member));
        }
        self.register(
            Definition::Union(UnionEnumModel { name, variants }),
            &context.place,
        )
    }

    fn any_of(&mut self, schema: &JsonObject, context: &PrintContext) -> SpecResult<TypeUnion> {
        let base: JsonObject = schema
            .iter()
            .filter(|(key, _)| {
                !matches!(key.as_str(), "anyOf" | "description" | "default")
                    && !key.starts_with(EXTENSION_PREFIX)
            })
            .map(|(key, value)| (key.clone(), value.clone()))
            .collect();
        let mut options = Vec::new();
        for (index, option) in list_at(schema.get("anyOf")).iter().enumerate() {
            let Some(record) = optional_record(Some(option)) else {
                return spec_error(format!("{} anyOf {index} is not a schema.", context.place));
            };
            let mut merged = base.clone();
            for (key, value) in resolved(record, context.components, &context.place)? {
                merged.insert(key.clone(), value.clone());
            }
            options.push(merged);
        }
        let names = option_names(&options, &context.name);
        let mut unions = Vec::new();
        for (index, option) in options.iter().enumerate() {
            let child = context.renamed(&format!("|{index}"), names[index].clone());
            unions.push(self.union_of(option, &child)?);
        }
        Ok(TypeUnion::merged(unions))
    }

    fn of_type(
        &mut self,
        kind: &str,
        schema: &JsonObject,
        context: &PrintContext,
    ) -> SpecResult<TypeUnion> {
        Ok(match kind {
            "string" => TypeUnion::of(RustType::Text),
            "integer" => TypeUnion::of(RustType::Integer),
            "number" => TypeUnion::of(RustType::Number),
            "boolean" => TypeUnion::of(RustType::Boolean),
            "null" => TypeUnion::null(),
            "array" => {
                let item = match optional_record(schema.get("items")) {
                    None => RustType::Json,
                    Some(items) => self.rendered(items, &context.child("[]", "Item"))?,
                };
                TypeUnion::of(RustType::List(Box::new(item)))
            }
            "object" => TypeUnion::of(self.object_of(schema, context)?),
            _ => {
                return spec_error(format!(
                    "{} has the type {kind}, which the SDK cannot carry.",
                    context.place
                ));
            }
        })
    }

    fn object_of(&mut self, schema: &JsonObject, context: &PrintContext) -> SpecResult<RustType> {
        let empty = JsonObject::new();
        let properties = optional_record(schema.get("properties")).unwrap_or(&empty);
        let required: BTreeSet<&str> = list_at(schema.get("required"))
            .iter()
            .filter_map(Value::as_str)
            .collect();
        let missing: Vec<&str> = required
            .iter()
            .copied()
            .filter(|name| !properties.contains_key(*name))
            .collect();
        if !missing.is_empty() {
            return spec_error(format!(
                "{} requires the undocumented {}.",
                context.place,
                missing.join(", ")
            ));
        }
        if !properties.is_empty() {
            let mut fields = Vec::new();
            for (name, value) in properties {
                let Some(record) = optional_record(Some(value)) else {
                    return spec_error(format!("{}.{name} has no schema.", context.place));
                };
                fields.push((
                    name.clone(),
                    record.clone(),
                    required.contains(name.as_str()),
                ));
            }
            return Ok(RustType::Named(self.struct_of(&fields, context)?));
        }
        let Some(additional) = optional_record(schema.get("additionalProperties")) else {
            return Ok(RustType::JsonObject);
        };
        match self.rendered(additional, &context.child("[key]", "Value"))? {
            RustType::Json => Ok(RustType::JsonObject),
            value => Ok(RustType::Map(Box::new(value))),
        }
    }
}
