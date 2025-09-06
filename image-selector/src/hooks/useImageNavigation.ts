import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

export const useImageNavigation = () => {
  const {
    images,
    currentIndex,
    setCurrentIndex,
    nextImage,
    prevImage,
    goToFirst,
    goToLast,
  } = useAppStore();

  const canGoNext = currentIndex < images.length - 1;
  const canGoPrev = currentIndex > 0;

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length, setCurrentIndex]);

  const getCurrentImage = useCallback(() => {
    return images[currentIndex] || null;
  }, [images, currentIndex]);

  const getImageProgress = useCallback(() => {
    if (images.length === 0) return { current: 0, total: 0, percentage: 0 };
    
    return {
      current: currentIndex + 1,
      total: images.length,
      percentage: ((currentIndex + 1) / images.length) * 100,
    };
  }, [currentIndex, images.length]);

  return {
    // 状态
    canGoNext,
    canGoPrev,
    currentImage: getCurrentImage(),
    progress: getImageProgress(),
    
    // 方法
    goToIndex,
    nextImage,
    prevImage,
    goToFirst,
    goToLast,
  };
};
