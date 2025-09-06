
import { useAppStore } from './stores/appStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { FolderSelector } from './components/FolderSelector';
import { ImageViewer } from './components/ImageViewer';
import { BatchProcessor } from './components/BatchProcessor';
import './App.css';

function App() {
  const {
    images,
    isViewerMode,
    setViewerMode
  } = useAppStore();

  // 启用键盘快捷键
  useKeyboardShortcuts();

  const handleFolderSelected = () => {
    // 文件夹选择完成后，如果有图片则进入查看器模式
    if (images.length > 0) {
      setViewerMode(true);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {!isViewerMode || images.length === 0 ? (
        <FolderSelector onFolderSelected={handleFolderSelected} />
      ) : (
        <ImageViewer />
      )}

      {/* 批量处理对话框 */}
      <BatchProcessor />
    </div>
  );
}

export default App;
