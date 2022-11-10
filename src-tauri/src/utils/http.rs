#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tide::{Request, Server};
use tide::prelude::*;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn login(passcode: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", passcode)
}

#[tauri::command]
pub fn connect_to_ip(ip: &str) -> String {
    format!("This is working")
}

#[derive(Debug, Deserialize)]
struct Item {
    name: String,
    legs: u16,
}

#[tauri::command]
pub async fn start() -> tide::Result<()> {
    let mut app: Server<()> = tide::new();
    app.at("/receive").put(receive_files);
    app.listen("127.0.0.1:7878").await?;
    Ok(())
}

async fn receive_files(mut req: Request<()>) -> tide::Result {
    let Item { name, legs } = req.body_json().await?;
    Ok(format!("Hello, {}! I've put in an order for {} shoes", name, legs).into())
}