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
      // 使用Tauri的convertFileSrc函数
      const convertedPath = convertFileSrc(filePath);
      console.log('ConvertFileSrc结果:', convertedPath);
      return convertedPath;
    } catch (error) {
      console.error('ConvertFileSrc失败:', error);

      // 降级方案：使用data URL通过后端读取文件
      console.log('尝试通过后端读取文件...');
      return `tauri://localhost/read-image?path=${encodeURIComponent(filePath)}`;
    }
  }

  /**
   * 通过后端读取图片文件并返回base64数据
   */
  static async getImageAsBase64(filePath: string): Promise<string> {
    try {
      const result = await invoke<string>('read_image_as_base64', { path: filePath });
      return `data:image/jpeg;base64,${result}`;
    } catch (error) {
      console.error('读取图片文件失败:', error);
      throw error;
    }
  }
}
