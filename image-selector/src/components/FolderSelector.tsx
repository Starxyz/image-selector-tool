import React from 'react';
import { useAppStore } from '../stores/appStore';
import { useFileOperations } from '../hooks/useFileOperations';

interface FolderSelectorProps {
  onFolderSelected?: (folderPath: string) => void;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({ onFolderSelected }) => {
  const { 
    folderPath, 
    isScanning, 
    scanProgress,
    images 
  } = useAppStore();
  
  const { 
    selectAndScanFolder, 
    error, 
    clearError 
  } = useFileOperations();

  const handleSelectFolder = async () => {
    try {
      clearError();
      const result = await selectAndScanFolder();

      if (result && result.images.length > 0 && onFolderSelected) {
        onFolderSelected(folderPath);
      }
    } catch (err) {
      console.error('选择文件夹失败:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary p-8">
      <div className="max-w-md w-full space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            图片筛选工具
          </h1>
          <p className="text-gray-400">
            选择包含图片的文件夹开始筛选
          </p>
        </div>

        {/* 选择文件夹按钮 */}
        <div className="space-y-4">
          <button
            onClick={handleSelectFolder}
            disabled={isScanning}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? '扫描中...' : '选择文件夹'}
          </button>

          {/* 当前文件夹路径 */}
          {folderPath && (
            <div className="bg-background-secondary p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">当前文件夹:</p>
              <p className="text-white text-sm break-all">{folderPath}</p>
            </div>
          )}
        </div>

        {/* 扫描进度 */}
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>扫描进度</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 扫描结果 */}
        {!isScanning && images.length > 0 && (
          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-medium">
                扫描完成
              </span>
            </div>
            <p className="text-gray-300 mt-2 mb-4">
              找到 <span className="font-bold text-white">{images.length}</span> 张图片
            </p>
            <button
              onClick={() => onFolderSelected && onFolderSelected(folderPath)}
              className="w-full btn-primary"
            >
              开始浏览图片
            </button>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-medium">错误</span>
            </div>
            <p className="text-gray-300 mt-2">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
            >
              清除错误
            </button>
          </div>
        )}

        {/* 支持的格式说明 */}
        <div className="text-center text-sm text-gray-500">
          <p>支持的图片格式:</p>
          <p>JPG, JPEG, PNG, BMP, GIF, WEBP, TIFF</p>
        </div>
      </div>
    </div>
  );
};
