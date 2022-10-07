#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn login(passcode: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", passcode)
}
