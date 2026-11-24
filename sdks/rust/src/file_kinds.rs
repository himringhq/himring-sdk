use crate::generated_operations::{FILE_KINDS, FileKind};

pub fn readable_file_extensions() -> impl Iterator<Item = &'static str> {
    FILE_KINDS
        .iter()
        .flat_map(|(_, extensions)| extensions.iter().copied())
}

pub fn file_extension_of(path: &str) -> String {
    let Some(dot) = path.rfind('.') else {
        return String::new();
    };
    let extension = &path[dot..];
    if extension.len() == 1 || extension[1..].contains('/') {
        return String::new();
    }
    extension.to_lowercase()
}

pub fn file_kind_of(path: &str) -> Option<FileKind> {
    let extension = file_extension_of(path);
    FILE_KINDS
        .iter()
        .find(|(_, extensions)| extensions.contains(&extension.as_str()))
        .map(|(kind, _)| *kind)
}
