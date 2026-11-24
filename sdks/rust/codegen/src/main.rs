mod input_schema;
mod names;
mod render_methods;
mod render_operations;
mod render_rules;
mod render_types;
mod schema_keywords;
mod spec_documents;
mod spec_model;
mod type_model;
mod type_printer;
mod union_shapes;

use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, ExitCode, Stdio};

use crate::render_methods::render_methods;
use crate::render_operations::render_operations;
use crate::render_rules::render_rules;
use crate::render_types::render_types;
use crate::spec_documents::load_spec_model;
use crate::spec_model::{SpecModelError, SpecResult, spec_error};

const GENERATE_COMMAND: &str = "pnpm exec nx run sdk-rust:generate";
const GENERATED_FOLDER: &str = "src/generated";
const RUST_EDITION: &str = "2024";

fn package_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("..")
}

fn formatted(text: &str, name: &str) -> SpecResult<String> {
    let mut child = Command::new("rustfmt")
        .args(["--edition", RUST_EDITION, "--emit", "stdout", "--quiet"])
        .current_dir(package_root())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|error| SpecModelError(format!("rustfmt could not start: {error}.")))?;
    let Some(mut input) = child.stdin.take() else {
        return spec_error("rustfmt took no input.");
    };
    let source = text.to_owned();
    let writer = std::thread::spawn(move || input.write_all(source.as_bytes()));
    let output = child
        .wait_with_output()
        .map_err(|error| SpecModelError(format!("rustfmt did not finish: {error}.")))?;
    match writer.join() {
        Ok(Ok(())) => {}
        _ => return spec_error(format!("rustfmt did not read all of {name}.")),
    }
    if !output.status.success() {
        return spec_error(format!(
            "rustfmt could not tidy {name}: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        ));
    }
    String::from_utf8(output.stdout)
        .map_err(|_| SpecModelError(format!("rustfmt wrote {name} as text that is not UTF-8.")))
}

fn rendered_files(spec_directory: &Path) -> SpecResult<(Vec<(&'static str, String)>, usize)> {
    let model = load_spec_model(spec_directory)?;
    let types = render_types(&model)?;
    let sources = [
        ("types.rs", types.text.clone()),
        ("operations.rs", render_operations(&model, &types)?),
        ("methods.rs", render_methods(&model, &types)?),
        ("answer_event_rules.rs", render_rules(&model)?),
    ];
    let mut files = Vec::new();
    for (name, text) in sources {
        files.push((name, formatted(&text, name)?));
    }
    Ok((files, model.operations.len()))
}

fn check(files: &[(&str, String)], output_directory: &Path) -> SpecResult<()> {
    let stale: Vec<&str> = files
        .iter()
        .filter(|(name, text)| {
            fs::read_to_string(output_directory.join(name))
                .ok()
                .as_ref()
                != Some(text)
        })
        .map(|(name, _)| *name)
        .collect();
    if stale.is_empty() {
        return Ok(());
    }
    spec_error(format!(
        "{GENERATED_FOLDER}/{} differ from the spec. Run {GENERATE_COMMAND} and commit.",
        stale.join(", ")
    ))
}

fn write(files: &[(&str, String)], output_directory: &Path) -> SpecResult<()> {
    fs::create_dir_all(output_directory).map_err(|error| {
        SpecModelError(format!("{GENERATED_FOLDER} could not be made: {error}."))
    })?;
    for (name, text) in files {
        let path = output_directory.join(name);
        let pending = output_directory.join(format!("{name}.{}.pending", std::process::id()));
        let written = fs::write(&pending, text).and_then(|()| fs::rename(&pending, &path));
        if let Err(error) = written {
            let _ = fs::remove_file(&pending);
            return spec_error(format!("{name} could not be written: {error}."));
        }
    }
    Ok(())
}

fn option_value(arguments: &[String], flag: &str) -> Option<PathBuf> {
    arguments
        .iter()
        .position(|argument| argument == flag)
        .and_then(|index| arguments.get(index + 1))
        .map(PathBuf::from)
}

fn run(arguments: &[String]) -> SpecResult<String> {
    let mode = arguments.first().map(String::as_str);
    let spec_directory = option_value(arguments, "--spec-directory")
        .unwrap_or_else(|| package_root().join("..").join("..").join("spec"));
    let output_directory = option_value(arguments, "--output-directory")
        .unwrap_or_else(|| package_root().join(GENERATED_FOLDER));
    let (files, count) = rendered_files(&spec_directory)?;
    match mode {
        Some("check") => {
            check(&files, &output_directory)?;
            Ok(format!(
                "{GENERATED_FOLDER} matches the spec for {count} operations."
            ))
        }
        Some("write") => {
            write(&files, &output_directory)?;
            Ok(format!("Wrote {GENERATED_FOLDER} for {count} operations."))
        }
        _ => spec_error("Run the generator as himring-codegen write or himring-codegen check."),
    }
}

fn main() -> ExitCode {
    let arguments: Vec<String> = std::env::args().skip(1).collect();
    match run(&arguments) {
        Ok(message) => {
            println!("{message}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("{error}");
            ExitCode::FAILURE
        }
    }
}
