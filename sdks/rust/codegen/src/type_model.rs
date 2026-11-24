#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TypeDirection {
    Input,
    Output,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RustType {
    Text,
    Integer,
    Number,
    Boolean,
    Json,
    JsonObject,
    Named(String),
    List(Box<RustType>),
    Map(Box<RustType>),
    Optional(Box<RustType>),
}

impl RustType {
    pub fn render(&self) -> String {
        match self {
            RustType::Text => "String".to_owned(),
            RustType::Integer => "i64".to_owned(),
            RustType::Number => "f64".to_owned(),
            RustType::Boolean => "bool".to_owned(),
            RustType::Json => "serde_json::Value".to_owned(),
            RustType::JsonObject => "serde_json::Map<String, serde_json::Value>".to_owned(),
            RustType::Named(name) => name.clone(),
            RustType::List(item) => format!("Vec<{}>", item.render()),
            RustType::Map(value) => format!("BTreeMap<String, {}>", value.render()),
            RustType::Optional(inner) => format!("Option<{}>", inner.render()),
        }
    }

    pub fn is_scalar(&self) -> bool {
        matches!(
            self,
            RustType::Text | RustType::Integer | RustType::Number | RustType::Boolean
        )
    }

    pub fn scalar_word(&self) -> &'static str {
        match self {
            RustType::Text => "Text",
            RustType::Integer => "Integer",
            RustType::Number => "Number",
            RustType::Boolean => "Boolean",
            RustType::List(_) => "List",
            RustType::Map(_) | RustType::JsonObject => "Map",
            _ => "Value",
        }
    }

    pub fn accepts_null(&self) -> bool {
        matches!(self, RustType::Json | RustType::Optional(_))
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct StructField {
    pub json_name: String,
    pub identifier: String,
    pub value_type: RustType,
    pub required: bool,
    pub constant: Option<serde_json::Value>,
}

impl StructField {
    pub fn nullable(&self) -> bool {
        self.value_type.accepts_null()
    }

    pub fn declared_type(&self, direction: TypeDirection) -> RustType {
        if self.required || (self.nullable() && direction == TypeDirection::Output) {
            return self.value_type.clone();
        }
        RustType::Optional(Box::new(self.value_type.clone()))
    }

    pub fn is_double_option(&self, direction: TypeDirection) -> bool {
        !self.required
            && direction == TypeDirection::Input
            && matches!(self.value_type, RustType::Optional(_))
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct StructModel {
    pub name: String,
    pub direction: TypeDirection,
    pub fields: Vec<StructField>,
}

#[derive(Clone, Debug, PartialEq)]
pub struct LiteralEnumModel {
    pub name: String,
    pub values: Vec<(String, String)>,
}

#[derive(Clone, Debug, PartialEq)]
pub struct UnionEnumModel {
    pub name: String,
    pub variants: Vec<(String, RustType)>,
}

#[derive(Clone, Debug, PartialEq)]
pub enum Definition {
    Struct(StructModel),
    Literals(LiteralEnumModel),
    Union(UnionEnumModel),
}

impl Definition {
    pub fn name(&self) -> &str {
        match self {
            Definition::Struct(model) => &model.name,
            Definition::Literals(model) => &model.name,
            Definition::Union(model) => &model.name,
        }
    }
}

#[derive(Clone, Debug, Default)]
pub struct TypeUnion {
    pub members: Vec<RustType>,
    pub literals: Vec<String>,
    pub nullable: bool,
}

impl TypeUnion {
    pub fn of(member: RustType) -> Self {
        TypeUnion {
            members: vec![member],
            ..TypeUnion::default()
        }
    }

    pub fn null() -> Self {
        TypeUnion {
            nullable: true,
            ..TypeUnion::default()
        }
    }

    pub fn merged(unions: Vec<TypeUnion>) -> Self {
        let mut merged = TypeUnion::default();
        for union in unions {
            merged.members.extend(union.members);
            merged.literals.extend(union.literals);
            merged.nullable |= union.nullable;
        }
        merged
    }
}

pub fn deduplicated<T: PartialEq + Clone>(items: &[T]) -> Vec<T> {
    let mut kept: Vec<T> = Vec::new();
    for item in items {
        if !kept.contains(item) {
            kept.push(item.clone());
        }
    }
    kept
}
