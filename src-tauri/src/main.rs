#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use tauri::utils::config::BundleConfig;
use utils::filesystem::*;

mod utils;
//use utils;

pub fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let identifier = BundleConfig::default().identifier.to_string();
            let cfg = confy::load(&*identifier, None)?;
            Ok(())
        })
        // .manage(AppDataDir(app_happ_data_dir().unwrap()))
        .invoke_handler(tauri::generate_handler![
            directory_content,
            is_directory,
            optimise_image,
            read_file,
            retrieve_item,
            send_item,
            send_file,
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
