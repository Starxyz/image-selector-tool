import React, { useState } from 'react';

interface KeyboardShortcut {
  keys: string[];
  description: string;
}

const shortcuts: KeyboardShortcut[] = [
  { keys: ['←', 'A'], description: '上一张图片' },
  { keys: ['→', 'D'], description: '下一张图片' },
  { keys: ['空格'], description: '标记/取消标记当前图片' },
  { keys: ['Home'], description: '跳转到第一张' },
  { keys: ['End'], description: '跳转到最后一张' },
  { keys: ['Esc'], description: '退出浏览模式' },
];

export const KeyboardHandler: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {/* 帮助按钮 */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        title="快捷键帮助"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* 快捷键帮助弹窗 */}
      {showHelp && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-background-secondary p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">快捷键帮助</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{shortcut.description}</span>
                  <div className="flex space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <span
                        key={keyIndex}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-600">
              <p className="text-sm text-gray-400">
                提示：在图片浏览模式下，这些快捷键会自动生效
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
