use crate::types::SearchKnowledgeBaseOutputPassagesItemCitation;

pub type Citation = SearchKnowledgeBaseOutputPassagesItemCitation;

const SECONDS_PER_MINUTE: u64 = 60;
const SECONDS_PER_HOUR: u64 = 3600;

fn number_text(value: f64) -> String {
    if value.fract() == 0.0 && value.abs() < 1e21 {
        format!("{value:.0}")
    } else {
        value.to_string()
    }
}

#[allow(clippy::cast_possible_truncation, clippy::cast_sign_loss)]
pub fn format_clock(total_seconds: f64) -> String {
    let whole = if total_seconds.is_finite() {
        total_seconds.floor().max(0.0) as u64
    } else {
        0
    };
    let hours = whole / SECONDS_PER_HOUR;
    let minutes = (whole % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE;
    let seconds = whole % SECONDS_PER_MINUTE;
    if hours > 0 {
        format!("{hours}:{minutes:02}:{seconds:02}")
    } else {
        format!("{minutes}:{seconds:02}")
    }
}

fn number_ranges(numbers: &[f64]) -> String {
    let mut sorted: Vec<f64> = numbers
        .iter()
        .copied()
        .filter(|value| !value.is_nan())
        .collect();
    sorted.sort_by(f64::total_cmp);
    sorted.dedup();
    let mut runs: Vec<(f64, f64)> = Vec::new();
    for value in sorted {
        match runs.last_mut() {
            Some(last) if value.total_cmp(&(last.1 + 1.0)).is_eq() => last.1 = value,
            _ => runs.push((value, value)),
        }
    }
    runs.iter()
        .map(|(start, end)| {
            if start.total_cmp(end).is_eq() {
                number_text(*start)
            } else {
                format!("{}–{}", number_text(*start), number_text(*end))
            }
        })
        .collect::<Vec<_>>()
        .join(", ")
}

fn numbered(numbers: &[f64], one: &str, many: &str) -> String {
    if numbers.is_empty() {
        return format!("No {} number", one.to_lowercase());
    }
    let mut distinct: Vec<f64> = numbers.to_vec();
    distinct.sort_by(f64::total_cmp);
    distinct.dedup();
    let label = if distinct.len() == 1 { one } else { many };
    format!("{label} {}", number_ranges(numbers))
}

fn spreadsheet_text(sheet: Option<&str>, first_row: f64, last_row: f64) -> String {
    let rows = if first_row.total_cmp(&last_row).is_eq() {
        format!("row {}", number_text(first_row))
    } else {
        format!("rows {}–{}", number_text(first_row), number_text(last_row))
    };
    match sheet {
        None => {
            let mut characters = rows.chars();
            characters.next().map_or_else(String::new, |first| {
                first.to_uppercase().collect::<String>() + characters.as_str()
            })
        }
        Some(sheet) => format!("Sheet {sheet}, {rows}"),
    }
}

pub fn citation_text(citation: &Citation) -> String {
    match citation {
        Citation::Document(document) => numbered(&document.pages, "Page", "Pages"),
        Citation::Spreadsheet(sheet) => {
            spreadsheet_text(sheet.sheet.as_deref(), sheet.first_row, sheet.last_row)
        }
        Citation::Slides(slides) => numbered(&slides.slides, "Slide", "Slides"),
        Citation::WebPage(page) => match &page.heading {
            None => "Web page".to_owned(),
            Some(heading) => format!("Web page, section {heading}"),
        },
        Citation::Image(image) => {
            if image.areas.is_empty() {
                "Whole image".to_owned()
            } else {
                "Part of the image".to_owned()
            }
        }
        Citation::Recording(recording) => {
            let span = format!(
                "From {} to {}",
                format_clock(recording.start_second),
                format_clock(recording.end_second)
            );
            match recording.frame {
                None => span,
                Some(frame) => format!("{span}, frame {}", number_text(frame)),
            }
        }
    }
}
