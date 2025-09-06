import React from 'react';
import { useAppStore } from '../stores/appStore';

export const MarkingStatus: React.FC = () => {
  const { 
    images, 
    markedIndices, 
    clearMarks,
    setShowBatchDialog 
  } = useAppStore();

  const markedCount = markedIndices.size;
  const totalCount = images.length;
  const markedPercentage = totalCount > 0 ? (markedCount / totalCount) * 100 : 0;

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-20 bg-black bg-opacity-75 text-white p-4 rounded-lg min-w-64">
      <div className="space-y-3">
        {/* 标记统计 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">标记进度</span>
          <span className="text-sm font-medium">
            {markedCount} / {totalCount}
          </span>
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${markedPercentage}%` }}
          />
        </div>
        
        {/* 操作按钮 */}
        <div className="flex space-x-2">
          {markedCount > 0 && (
            <>
              <button
                onClick={() => setShowBatchDialog(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                批量处理
              </button>
              <button
                onClick={clearMarks}
                className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                清除
              </button>
            </>
          )}
        </div>
        
        {/* 提示信息 */}
        {markedCount === 0 && (
          <p className="text-xs text-gray-400 text-center">
            按空格键标记图片
          </p>
        )}
      </div>
    </div>
  );
};
