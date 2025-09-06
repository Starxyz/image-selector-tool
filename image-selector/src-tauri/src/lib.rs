mod commands;
mod file_manager;
mod types;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_folder,
            open_folder_dialog,
            get_image_metadata,
            batch_copy_files,
            batch_move_files,
            create_directory
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
