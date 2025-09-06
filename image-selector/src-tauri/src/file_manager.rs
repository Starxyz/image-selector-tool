use crate::types::{ImageFile, ImageMetadata, FileOperation, ProcessResult, is_supported_image};
use std::path::Path;
use std::time::SystemTime;
use tokio::fs;
use walkdir::WalkDir;
use uuid::Uuid;

pub struct FileManager;

impl FileManager {
    /// 扫描文件夹中的所有图片文件
    pub async fn scan_folder(folder_path: &str) -> Result<Vec<ImageFile>, Box<dyn std::error::Error + Send + Sync>> {
        let path = Path::new(folder_path);
        if !path.exists() {
            return Err("文件夹不存在".into());
        }

        let mut images = Vec::new();
        
        // 使用 walkdir 递归扫描文件夹
        for entry in WalkDir::new(path)
            .follow_links(false)
            .into_iter()
            .filter_map(|e| e.ok())
        {
            let file_path = entry.path();
            
            // 跳过目录
            if file_path.is_dir() {
                continue;
            }

            // 检查文件扩展名
            if let Some(extension) = file_path.extension() {
                let ext_str = extension.to_string_lossy().to_lowercase();
                if is_supported_image(&ext_str) {
                    match Self::create_image_file(file_path).await {
                        Ok(image_file) => images.push(image_file),
                        Err(e) => {
                            eprintln!("处理文件 {:?} 时出错: {}", file_path, e);
                            continue;
                        }
                    }
                }
            }
        }

        // 按文件名排序
        images.sort_by(|a, b| a.name.cmp(&b.name));
        
        Ok(images)
    }

    /// 创建 ImageFile 结构
    async fn create_image_file(file_path: &Path) -> Result<ImageFile, Box<dyn std::error::Error + Send + Sync>> {
        let metadata = fs::metadata(file_path).await?;
        let modified = metadata
            .modified()?
            .duration_since(SystemTime::UNIX_EPOCH)?
            .as_secs();

        let name = file_path
            .file_name()
            .ok_or("无法获取文件名")?
            .to_string_lossy()
            .to_string();

        let extension = file_path
            .extension()
            .unwrap_or_default()
            .to_string_lossy()
            .to_lowercase();

        Ok(ImageFile {
            id: Uuid::new_v4().to_string(),
            name,
            path: file_path.to_string_lossy().to_string(),
            size: metadata.len(),
            modified,
            extension,
        })
    }

    /// 获取图片元数据
    pub fn get_image_metadata(file_path: &str) -> Result<ImageMetadata, Box<dyn std::error::Error + Send + Sync>> {
        let img = image::open(file_path)?;
        let (width, height) = img.dimensions();
        
        let format = match image::ImageFormat::from_path(file_path) {
            Ok(fmt) => format!("{:?}", fmt),
            Err(_) => "Unknown".to_string(),
        };

        let color_type = format!("{:?}", img.color());
        
        let file_size = std::fs::metadata(file_path)?.len();

        Ok(ImageMetadata {
            width,
            height,
            format,
            color_type,
            file_size,
        })
    }

    /// 批量处理文件操作
    pub async fn batch_process(operations: Vec<FileOperation>) -> Result<ProcessResult, Box<dyn std::error::Error + Send + Sync>> {
        let mut success_count = 0;
        let mut failed_count = 0;
        let mut errors = Vec::new();

        for operation in operations {
            match operation {
                FileOperation::Copy { source, target } => {
                    match Self::copy_file(&source, &target).await {
                        Ok(_) => success_count += 1,
                        Err(e) => {
                            failed_count += 1;
                            errors.push(format!("复制 {} 到 {} 失败: {}", source, target, e));
                        }
                    }
                }
                FileOperation::Move { source, target } => {
                    match Self::move_file(&source, &target).await {
                        Ok(_) => success_count += 1,
                        Err(e) => {
                            failed_count += 1;
                            errors.push(format!("移动 {} 到 {} 失败: {}", source, target, e));
                        }
                    }
                }
            }
        }

        Ok(ProcessResult {
            success_count,
            failed_count,
            errors,
        })
    }

    /// 复制文件
    async fn copy_file(source: &str, target: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // 确保目标目录存在
        if let Some(parent) = Path::new(target).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        fs::copy(source, target).await?;
        Ok(())
    }

    /// 移动文件
    async fn move_file(source: &str, target: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // 确保目标目录存在
        if let Some(parent) = Path::new(target).parent() {
            fs::create_dir_all(parent).await?;
        }
        
        fs::rename(source, target).await?;
        Ok(())
    }
}
