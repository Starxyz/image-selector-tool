import { useState, useCallback } from 'react';
import { TauriAPI } from '../utils/tauriApi';
import { useAppStore } from '../stores/appStore';
import { ImageFile, BatchOperationType } from '../types';

export const useFileOperations = () => {
  const {
    setImages,
    setFolderPath,
    setScanning,
    setScanProgress,
    setProcessing,
    setProcessProgress,
    images,
    markedIndices,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);

  // 选择文件夹
  const selectFolder = useCallback(async () => {
    try {
      setError(null);
      const folderPath = await TauriAPI.openFolderDialog();
      
      if (folderPath) {
        setFolderPath(folderPath);
        return folderPath;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '选择文件夹失败';
      setError(errorMessage);
      throw err;
    }
  }, [setFolderPath]);

  // 扫描文件夹
  const scanFolder = useCallback(async (folderPath: string) => {
    try {
      setError(null);
      setScanning(true);
      setScanProgress(0);

      const result = await TauriAPI.scanFolder(folderPath);
      
      setImages(result.images);
      setScanProgress(100);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '扫描文件夹失败';
      setError(errorMessage);
      throw err;
    } finally {
      setScanning(false);
    }
  }, [setImages, setScanning, setScanProgress]);

  // 选择并扫描文件夹
  const selectAndScanFolder = useCallback(async () => {
    try {
      const folderPath = await selectFolder();
      if (folderPath) {
        const result = await scanFolder(folderPath);
        return result;
      }
      return null;
    } catch (err) {
      console.error('选择并扫描文件夹失败:', err);
      throw err;
    }
  }, [selectFolder, scanFolder]);

  // 获取标记的图片
  const getMarkedImages = useCallback((): ImageFile[] => {
    return Array.from(markedIndices)
      .map(index => images[index])
      .filter(Boolean);
  }, [images, markedIndices]);

  // 批量处理文件
  const batchProcessFiles = useCallback(async (
    targetPath: string,
    operationType: BatchOperationType
  ) => {
    try {
      setError(null);
      setProcessing(true);
      setProcessProgress(0);

      const markedImages = getMarkedImages();
      
      if (markedImages.length === 0) {
        throw new Error('没有选择要处理的图片');
      }

      let result;
      if (operationType === 'copy') {
        result = await TauriAPI.batchCopyFiles(markedImages, targetPath);
      } else {
        result = await TauriAPI.batchMoveFiles(markedImages, targetPath);
      }

      setProcessProgress(100);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批量处理文件失败';
      setError(errorMessage);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [getMarkedImages, setProcessing, setProcessProgress]);

  // 创建目标文件夹
  const createTargetFolder = useCallback(async (path: string) => {
    try {
      await TauriAPI.createDirectory(path);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建文件夹失败';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    error,
    markedCount: markedIndices.size,
    markedImages: getMarkedImages(),
    
    // 方法
    selectFolder,
    scanFolder,
    selectAndScanFolder,
    batchProcessFiles,
    createTargetFolder,
    clearError,
  };
};
