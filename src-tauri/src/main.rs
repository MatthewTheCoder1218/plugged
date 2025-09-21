#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod logic;

use logic::stacks::process_stacks;
use std::process::Command;

#[tauri::command]
fn open_folder(folder_path: String) -> Result<String, String> {
    println!("Opening folder: {}", folder_path);
    
    #[cfg(target_os = "windows")]
    {
        let result = Command::new("cmd")
            .args(["/C", "start", "", &folder_path])
            .spawn();
        if result.is_ok() {
            return Ok(format!("Opened folder: {}", folder_path));
        }
    }
    
    #[cfg(target_os = "macos")]
    {
        let result = Command::new("open")
            .arg(&folder_path)
            .spawn();
        if result.is_ok() {
            return Ok(format!("Opened folder: {}", folder_path));
        }
    }
    
    #[cfg(target_os = "linux")]
    {
        let result = Command::new("xdg-open")
            .arg(&folder_path)
            .spawn();
        if result.is_ok() {
            return Ok(format!("Opened folder: {}", folder_path));
        }
    }
    
    Err("Could not open folder".to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![process_stacks, open_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
