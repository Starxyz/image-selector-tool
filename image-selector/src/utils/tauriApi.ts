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
    try {
      return convertFileSrc(filePath);
    } catch (error) {
      console.error('转换文件路径失败:', error);
      // 降级处理 - 直接使用文件路径
      return filePath;
    }
  }
}
