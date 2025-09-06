use crate::file_manager::FileManager;
use crate::types::{ImageFile, ImageMetadata, FileOperation, ProcessResult};
use serde::{Deserialize, Serialize};
use std::path::Path;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanResult {
    pub images: Vec<ImageFile>,
    pub total_count: usize,
    pub scan_time_ms: u64,
}



/// 扫描文件夹中的图片文件
#[command]
pub async fn scan_folder(path: String) -> Result<ScanResult, String> {
    let start_time = std::time::Instant::now();
    
    match FileManager::scan_folder(&path).await {
        Ok(images) => {
            let scan_time = start_time.elapsed().as_millis() as u64;
            Ok(ScanResult {
                total_count: images.len(),
                images,
                scan_time_ms: scan_time,
            })
        }
        Err(e) => Err(format!("扫描文件夹失败: {}", e)),
    }
}

/// 打开文件夹选择对话框
#[command]
pub async fn open_folder_dialog() -> Result<Option<String>, String> {
    use rfd::AsyncFileDialog;

    match AsyncFileDialog::new()
        .set_title("选择图片文件夹")
        .pick_folder()
        .await
    {
        Some(folder) => Ok(Some(folder.path().to_string_lossy().to_string())),
        None => Ok(None),
    }
}

/// 获取图片元数据
#[command]
pub async fn get_image_metadata(path: String) -> Result<ImageMetadata, String> {
    FileManager::get_image_metadata(&path)
        .map_err(|e| format!("获取图片元数据失败: {}", e))
}

/// 批量复制文件
#[command]
pub async fn batch_copy_files(files: Vec<ImageFile>, target_path: String) -> Result<ProcessResult, String> {
    let operations: Vec<FileOperation> = files
        .into_iter()
        .map(|file| FileOperation::Copy {
            source: file.path,
            target: Path::new(&target_path).join(&file.name).to_string_lossy().to_string(),
        })
        .collect();

    FileManager::batch_process(operations).await
        .map_err(|e| format!("批量复制失败: {}", e))
}

/// 批量移动文件
#[command]
pub async fn batch_move_files(files: Vec<ImageFile>, target_path: String) -> Result<ProcessResult, String> {
    let operations: Vec<FileOperation> = files
        .into_iter()
        .map(|file| FileOperation::Move {
            source: file.path,
            target: Path::new(&target_path).join(&file.name).to_string_lossy().to_string(),
        })
        .collect();

    FileManager::batch_process(operations).await
        .map_err(|e| format!("批量移动失败: {}", e))
}

/// 创建目标文件夹
#[command]
pub async fn create_directory(path: String) -> Result<(), String> {
    std::fs::create_dir_all(&path)
        .map_err(|e| format!("创建文件夹失败: {}", e))
}
