import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export const useKeyboardShortcuts = () => {
  const {
    nextImage,
    prevImage,
    goToFirst,
    goToLast,
    toggleMark,
    currentIndex,
    setViewerMode,
    isViewerMode,
  } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只在查看器模式下处理快捷键
      if (!isViewerMode) return;

      // 阻止默认行为
      event.preventDefault();

      switch (event.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          nextImage();
          break;

        case 'ArrowLeft':
        case 'a':
        case 'A':
          prevImage();
          break;

        case ' ': // 空格键
          toggleMark(currentIndex);
          break;

        case 'Home':
          goToFirst();
          break;

        case 'End':
          goToLast();
          break;

        case 'Escape':
          setViewerMode(false);
          break;

        default:
          // 对于其他按键，不阻止默认行为
          event.preventDefault = () => {};
          break;
      }
    };

    // 添加事件监听器
    document.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isViewerMode,
    nextImage,
    prevImage,
    goToFirst,
    goToLast,
    toggleMark,
    currentIndex,
    setViewerMode,
  ]);
};
