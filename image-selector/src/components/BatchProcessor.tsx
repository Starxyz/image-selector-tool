import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { useFileOperations } from '../hooks/useFileOperations';
import { TauriAPI } from '../utils/tauriApi';
import { BatchOperationType } from '../types';

export const BatchProcessor: React.FC = () => {
  const {
    showBatchDialog,
    setShowBatchDialog,
    isProcessing,
    processProgress
  } = useAppStore();

  const { batchProcessFiles, markedImages } = useFileOperations();

  const [operationType, setOperationType] = useState<BatchOperationType>('copy');
  const [targetPath, setTargetPath] = useState('');
  const [keepStructure, setKeepStructure] = useState(true);
  const [processResult, setProcessResult] = useState<any>(null);

  const handleSelectTargetFolder = async () => {
    try {
      const folderPath = await TauriAPI.openFolderDialog();
      if (folderPath) {
        setTargetPath(folderPath);
      }
    } catch (error) {
      console.error('选择目标文件夹失败:', error);
    }
  };

  const handleStartProcess = async () => {
    if (!targetPath || markedImages.length === 0) {
      return;
    }

    try {
      const result = await batchProcessFiles(targetPath, operationType);
      setProcessResult(result);
    } catch (error) {
      console.error('批量处理失败:', error);
    }
  };

  const handleClose = () => {
    setShowBatchDialog(false);
    setProcessResult(null);
    setTargetPath('');
  };

  if (!showBatchDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-background-secondary p-6 rounded-lg max-w-lg w-full mx-4">
        {!processResult ? (
          <>
            {/* 标题 */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">批量处理</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 选中的文件信息 */}
            <div className="mb-6 p-4 bg-background-primary rounded-lg">
              <p className="text-white mb-2">
                已选择 <span className="font-bold text-blue-400">{markedImages.length}</span> 张图片进行处理
              </p>
              <div className="text-sm text-gray-400 max-h-32 overflow-y-auto">
                {markedImages.slice(0, 5).map((image, index) => (
                  <div key={image.id} className="truncate">
                    {index + 1}. {image.name}
                  </div>
                ))}
                {markedImages.length > 5 && (
                  <div className="text-gray-500">
                    ... 还有 {markedImages.length - 5} 个文件
                  </div>
                )}
              </div>
            </div>

            {/* 操作类型选择 */}
            <div className="mb-6">
              <label className="block text-white mb-3 font-medium">目标操作:</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="copy"
                    checked={operationType === 'copy'}
                    onChange={(e) => setOperationType(e.target.value as BatchOperationType)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">复制到新文件夹</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="move"
                    checked={operationType === 'move'}
                    onChange={(e) => setOperationType(e.target.value as BatchOperationType)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">移动到新文件夹</span>
                </label>
              </div>
            </div>

            {/* 目标文件夹选择 */}
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">目标文件夹:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="选择目标文件夹..."
                  className="flex-1 bg-background-primary text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none"
                  readOnly
                />
                <button
                  onClick={handleSelectTargetFolder}
                  className="btn-secondary whitespace-nowrap"
                >
                  选择文件夹
                </button>
              </div>
            </div>

            {/* 选项 */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={keepStructure}
                  onChange={(e) => setKeepStructure(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-gray-300">保持原文件夹结构</span>
              </label>
            </div>

            {/* 处理进度 */}
            {isProcessing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>处理进度</span>
                  <span>{processProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 btn-secondary"
                disabled={isProcessing}
              >
                取消
              </button>
              <button
                onClick={handleStartProcess}
                disabled={!targetPath || markedImages.length === 0 || isProcessing}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? '处理中...' : '开始处理'}
              </button>
            </div>
          </>
        ) : (
          /* 处理结果显示 */
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">处理完成</h3>
            
            <div className="mb-6 p-4 bg-background-primary rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">成功处理:</span>
                  <span className="text-green-400 font-bold">{processResult.success_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">失败:</span>
                  <span className="text-red-400 font-bold">{processResult.failed_count}</span>
                </div>
              </div>
              
              {processResult.errors && processResult.errors.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-red-400 text-sm mb-2">错误信息:</p>
                  <div className="text-xs text-gray-400 max-h-32 overflow-y-auto">
                    {processResult.errors.map((error: string, index: number) => (
                      <div key={index} className="mb-1">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleClose}
              className="btn-primary"
            >
              确定
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
