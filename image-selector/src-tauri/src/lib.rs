mod commands;
mod file_manager;
mod types;

use commands::*;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            scan_folder,
            open_folder_dialog,
            get_image_metadata,
            batch_copy_files,
            batch_move_files,
            create_directory,
            read_image_as_base64
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
