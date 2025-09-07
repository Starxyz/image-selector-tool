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

  // 缓存convertFileSrc的可用性测试结果
  private static convertFileSrcWorks: boolean | null = null;

  /**
   * 测试convertFileSrc是否可用
   */
  private static async testConvertFileSrc(testPath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const convertedUrl = convertFileSrc(testPath);

      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }, 1000); // 1秒超时

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = convertedUrl;
    });
  }

  /**
   * 智能选择最佳的图片加载方法
   */
  static async getBestImageSrc(filePath: string): Promise<string> {
    console.log('获取最佳图片源:', filePath);

    // 如果还没有测试过convertFileSrc，先测试一下
    if (this.convertFileSrcWorks === null) {
      console.log('首次测试convertFileSrc可用性...');
      this.convertFileSrcWorks = await this.testConvertFileSrc(filePath);
      console.log('ConvertFileSrc可用性:', this.convertFileSrcWorks);
    }

    // 如果convertFileSrc可用，直接使用
    if (this.convertFileSrcWorks) {
      const convertedPath = convertFileSrc(filePath);
      console.log('使用convertFileSrc:', convertedPath);
      return convertedPath;
    }

    // 否则使用base64方法
    console.log('使用base64方法加载图片...');
    return await this.getImageAsBase64(filePath);
  }

  /**
   * 将文件路径转换为可在前端显示的URL（保持向后兼容）
   */
  static convertFileSrc(filePath: string): string {
    try {
      return convertFileSrc(filePath);
    } catch (error) {
      console.error('ConvertFileSrc失败:', error);
      return filePath;
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
