use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageFile {
    pub id: String,
    pub name: String,
    pub path: String,
    pub size: u64,
    pub modified: u64, // Unix timestamp
    pub extension: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageMetadata {
    pub width: u32,
    pub height: u32,
    pub format: String,
    pub color_type: String,
    pub file_size: u64,
}

#[derive(Debug, Clone)]
pub enum FileOperation {
    Copy { source: String, target: String },
    Move { source: String, target: String },
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessResult {
    pub success_count: usize,
    pub failed_count: usize,
    pub errors: Vec<String>,
}

/// 支持的图片格式
pub const SUPPORTED_EXTENSIONS: &[&str] = &[
    "jpg", "jpeg", "png", "bmp", "gif", "webp", "tiff", "tif"
];

/// 检查文件扩展名是否为支持的图片格式
pub fn is_supported_image(extension: &str) -> bool {
    let ext = extension.to_lowercase();
    SUPPORTED_EXTENSIONS.contains(&ext.as_str())
}
