#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{App, CustomMenuItem, Menu, MenuItem, Submenu};
use tauri::api::path::app_data_dir;
use tauri::utils::config::BundleConfig;
use utils::filesystem::*;
use utils::http::connect_to_ip;

mod utils;
//use utils;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let identifier = BundleConfig::default().identifier.to_string();
            let cfg = confy::load(&*identifier, None)?;
            Ok(())
        })
        // .manage(AppDataDir(app_happ_data_dir().unwrap()))
        .invoke_handler(tauri::generate_handler![
            connect_to_ip,
            directory_content,
            greet,
            is_directory,
            read_file,
            send_directory,
            write_file
        ])
        .menu(init_menu())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init_menu() -> Menu {
    // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let submenu = Submenu::new("File", Menu::new().add_item(open));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_submenu(submenu);
    return menu;
}
