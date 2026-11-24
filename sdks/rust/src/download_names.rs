use unicode_normalization::UnicodeNormalization;
use unicode_properties::{GeneralCategoryGroup, UnicodeGeneralCategory};

const SAFE_NAME_MAXIMUM_LENGTH: usize = 200;

fn is_safe_character(character: char) -> bool {
    character.is_ascii_alphanumeric() || matches!(character, '.' | '_' | '-')
}

pub fn safe_download_name(name: &str, fallback: &str) -> String {
    let last_segment = name.rsplit(['/', '\\']).next().unwrap_or_default();
    let mut safe = String::new();
    let mut in_unsafe_run = false;
    for character in last_segment.nfkd() {
        if character.general_category_group() == GeneralCategoryGroup::Mark {
            continue;
        }
        if is_safe_character(character) {
            safe.push(character);
            in_unsafe_run = false;
        } else if !in_unsafe_run {
            safe.push('_');
            in_unsafe_run = true;
        }
    }
    let trimmed = safe.trim_start_matches(['.', '_', '-']);
    let kept: String = {
        let characters: Vec<char> = trimmed.chars().collect();
        let start = characters.len().saturating_sub(SAFE_NAME_MAXIMUM_LENGTH);
        characters[start..].iter().collect()
    };
    if kept.is_empty() {
        fallback.to_owned()
    } else {
        kept
    }
}
