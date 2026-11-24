use std::collections::BTreeSet;

use crate::render_types::RenderedTypes;
use crate::spec_model::{BodyKind, SpecModel, SpecResult, spec_error};

const HAND_WRITTEN_MEMBERS: [&str; 7] = [
    "add_file",
    "download_file",
    "invoke",
    "base_url",
    "builder",
    "answer_recorder",
    "operations",
];

pub fn render_methods(model: &SpecModel, rendered: &RenderedTypes) -> SpecResult<String> {
    let mut used_types = BTreeSet::new();
    let mut body = vec!["impl Himring {".to_owned()];
    let mut needs_download = false;
    let mut needs_file = false;
    for operation in &model.operations {
        if HAND_WRITTEN_MEMBERS.contains(&operation.id.as_str()) {
            return spec_error(format!(
                "{} has the name of a member that the client writes by hand.",
                operation.id
            ));
        }
        let Some(types) = rendered.by_operation.get(&operation.id) else {
            return spec_error(format!("{} has no rendered types.", operation.id));
        };
        used_types.insert(types.input_name.clone());
        let output = if let Some(name) = &types.output_type {
            used_types.insert(name.clone());
            name.clone()
        } else {
            needs_download = true;
            "Download".to_owned()
        };
        let file = operation.body.kind == BodyKind::File;
        if file && types.output_type.is_none() {
            return spec_error(format!(
                "{} takes a file and answers with a file, which the client cannot send.",
                operation.id
            ));
        }
        needs_file |= file;
        let parameters = if file {
            format!("input: {}, content: FileContent", types.input_name)
        } else {
            format!("input: {}", types.input_name)
        };
        let call = if file {
            format!(
                "OperationCall::with_file(self, {:?}, &input, content)",
                operation.id
            )
        } else if types.output_type.is_none() {
            format!("OperationCall::download(self, {:?}, &input)", operation.id)
        } else {
            format!("OperationCall::new(self, {:?}, &input)", operation.id)
        };
        body.extend([
            String::new(),
            format!(
                "pub fn {}(&self, {parameters}) -> OperationCall<'_, {output}> {{",
                operation.id
            ),
            call,
            "}".to_owned(),
        ]);
    }
    body.push("}".to_owned());
    let mut header = vec![
        "use crate::client::Himring;".to_owned(),
        "use crate::operation_call::OperationCall;".to_owned(),
    ];
    if needs_download {
        header.push("use crate::download::Download;".to_owned());
    }
    if needs_file {
        header.push("use crate::file_content::FileContent;".to_owned());
    }
    let names: Vec<String> = used_types.into_iter().collect();
    header.push(format!("use crate::types::{{{}}};", names.join(", ")));
    Ok(format!("{}\n\n{}\n", header.join("\n"), body.join("\n")))
}
