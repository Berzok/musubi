use std::fs::{metadata};
use std::fs::read_dir;
use std::path::PathBuf;
use crate::utils::error::{CommandResult};

#[tauri::command]
pub fn is_directory(path: &str) -> bool {
    let md = metadata(path).unwrap();
    println!("is dir: {}", md.is_dir());
    println!("is file: {}", md.is_file());
    md.is_dir()
}

#[tauri::command]
pub fn directory_content(path: &str) -> CommandResult<Vec<PathBuf>> {
    let mut entries = Vec::<PathBuf>::new();
    for entry_result in read_dir(path)? {
        let entry = entry_result;//.unwrap().map_err(|e| e.to_string());
        entries.push(entry.unwrap().path());
    }
    Ok(entries)
}