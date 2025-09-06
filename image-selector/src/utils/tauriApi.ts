import { invoke } from '@tauri-apps/api/tauri';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { ImageFile, ScanResult, ProcessResult, ImageMetadata } from '../types';

export class TauriAPI {
  /**
   * 打开文件夹选择对话框
   */
  static async openFolderDialog(): Promise<string | null> {
    try {
      const result = await invoke<string | null>('open_folder_dialog');
      return result;
    } catch (error) {
      console.error('打开文件夹对话框失败:', error);
      throw new Error(`打开文件夹对话框失败: ${error}`);
    }
  }

  /**
   * 扫描文件夹中的图片
   */
  static async scanFolder(path: string): Promise<ScanResult> {
    try {
      const result = await invoke<ScanResult>('scan_folder', { path });
      return result;
    } catch (error) {
      console.error('扫描文件夹失败:', error);
      throw new Error(`扫描文件夹失败: ${error}`);
    }
  }

  /**
   * 获取图片元数据
   */
  static async getImageMetadata(path: string): Promise<ImageMetadata> {
    try {
      const result = await invoke<ImageMetadata>('get_image_metadata', { path });
      return result;
    } catch (error) {
      console.error('获取图片元数据失败:', error);
      throw new Error(`获取图片元数据失败: ${error}`);
    }
  }

  /**
   * 批量复制文件
   */
  static async batchCopyFiles(files: ImageFile[], targetPath: string): Promise<ProcessResult> {
    try {
      const result = await invoke<ProcessResult>('batch_copy_files', {
        files,
        targetPath,
      });
      return result;
    } catch (error) {
      console.error('批量复制文件失败:', error);
      throw new Error(`批量复制文件失败: ${error}`);
    }
  }

  /**
   * 批量移动文件
   */
  static async batchMoveFiles(files: ImageFile[], targetPath: string): Promise<ProcessResult> {
    try {
      const result = await invoke<ProcessResult>('batch_move_files', {
        files,
        targetPath,
      });
      return result;
    } catch (error) {
      console.error('批量移动文件失败:', error);
      throw new Error(`批量移动文件失败: ${error}`);
    }
  }

  /**
   * 创建目录
   */
  static async createDirectory(path: string): Promise<void> {
    try {
      await invoke('create_directory', { path });
    } catch (error) {
      console.error('创建目录失败:', error);
      throw new Error(`创建目录失败: ${error}`);
    }
  }

  /**
   * 将文件路径转换为可在前端显示的URL
   */
  static convertFileSrc(filePath: string): string {
    console.log('原始文件路径:', filePath);

    try {
      // 在Tauri 1.x中，convertFileSrc可能需要特殊处理
      const convertedPath = convertFileSrc(filePath);
      console.log('Tauri转换后路径:', convertedPath);
      return convertedPath;
    } catch (error) {
      console.error('Tauri转换失败，尝试其他方法:', error);

      // 降级方法：直接构造本地文件URL
      // 确保路径格式正确
      let normalizedPath = filePath;

      // Windows路径处理
      if (normalizedPath.includes('\\')) {
        normalizedPath = normalizedPath.replace(/\\/g, '/');
      }

      // 确保路径以盘符开头（Windows）
      if (normalizedPath.match(/^[A-Za-z]:/)) {
        normalizedPath = '/' + normalizedPath;
      }

      const fileUrl = `file://${normalizedPath}`;
      console.log('降级处理后的URL:', fileUrl);

      return fileUrl;
    }
  }
}
