import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../stores/appStore';
import { useImageNavigation } from '../hooks/useImageNavigation';
import { TauriAPI } from '../utils/tauriApi';
import { KeyboardHandler } from './KeyboardHandler';
import { MarkingStatus } from './MarkingStatus';

export const ImageViewer: React.FC = () => {
  const { 
    markedIndices, 
    toggleMark, 
    currentIndex,
    setViewerMode 
  } = useAppStore();
  
  const { 
    currentImage, 
    progress, 
    canGoNext, 
    canGoPrev,
    nextImage,
    prevImage 
  } = useImageNavigation();

  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMarked = markedIndices.has(currentIndex);

  // 重置图片状态
  const resetImageState = () => {
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
    setImageLoaded(false);
    setImageError(false);
    setImageSrc('');
  };

  // 当图片改变时重置状态并加载新图片
  useEffect(() => {
    if (currentImage) {
      resetImageState();
      loadImage();

      // 预加载下一张图片
      preloadNextImage();
    }
  }, [currentImage?.id]);

  // 预加载下一张图片以提升性能
  const preloadNextImage = async () => {
    const { images } = useAppStore.getState();
    const nextIndex = currentIndex + 1;

    if (nextIndex < images.length) {
      const nextImage = images[nextIndex];
      try {
        // 在后台预加载下一张图片
        await TauriAPI.getBestImageSrc(nextImage.path);
        console.log('预加载完成:', nextImage.name);
      } catch (error) {
        console.log('预加载失败:', nextImage.name, error);
      }
    }
  };

  // 加载图片
  const loadImage = async () => {
    if (!currentImage) return;

    try {
      console.log('开始智能加载图片:', currentImage.name);

      // 使用智能方法获取最佳图片源
      const bestSrc = await TauriAPI.getBestImageSrc(currentImage.path);
      setImageSrc(bestSrc);

    } catch (error) {
      console.error('加载图片失败:', error);
      setImageError(true);
    }
  };

  // 尝试使用base64方法加载图片
  const loadImageAsBase64 = async () => {
    if (!currentImage) return;

    try {
      console.log('尝试base64方法加载图片:', currentImage.name);
      const base64Src = await TauriAPI.getImageAsBase64(currentImage.path);
      setImageSrc(base64Src);
      setImageError(false);
    } catch (error) {
      console.error('Base64加载也失败了:', error);
      setImageError(true);
    }
  };

  // 处理图片加载
  const handleImageLoad = () => {
    console.log('图片加载成功:', currentImage?.name);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('图片加载失败:', currentImage?.name, e);
    console.error('图片路径:', currentImage?.path);
    console.error('当前图片URL:', imageSrc);

    setImageError(true);
    setImageLoaded(false);
  };

  // 处理鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.1, Math.min(5, imageScale + delta));
    setImageScale(newScale);
  };

  // 处理双击重置
  const handleDoubleClick = () => {
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // 处理鼠标拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageScale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageScale > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理标记切换
  const handleToggleMark = () => {
    toggleMark(currentIndex);
  };

  // 获取图片显示URL
  const getImageSrc = () => {
    return imageSrc;
  };

  if (!currentImage) {
    return (
      <div className="image-viewer flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">没有图片可显示</p>
          <button
            onClick={() => setViewerMode(false)}
            className="btn-secondary"
          >
            返回文件夹选择
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="image-viewer">
      {/* 键盘快捷键帮助 */}
      <KeyboardHandler />

      {/* 标记状态显示 */}
      <MarkingStatus />

      {/* 顶部信息栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{currentImage.name}</span>
            {isMarked && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                已标记
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>{progress.current} / {progress.total}</span>
            <span>已标记: {markedIndices.size}</span>
          </div>
        </div>
      </div>

      {/* 图片显示区域 */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        {imageError ? (
          <div className="text-white text-center">
            <p className="text-xl mb-2">图片加载失败</p>
            <p className="text-gray-400 mb-2">{currentImage.name}</p>
            <p className="text-xs text-gray-500 mb-4">路径: {currentImage.path}</p>
            <p className="text-xs text-gray-500 mb-4">URL: {getImageSrc()}</p>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setImageError(false);
                  setImageLoaded(false);
                  loadImage();
                }}
                className="btn-secondary text-sm"
              >
                重试加载
              </button>
              <button
                onClick={() => setViewerMode(false)}
                className="btn-secondary text-sm"
              >
                返回选择
              </button>
            </div>
          </div>
        ) : (
          <img
            ref={imageRef}
            src={getImageSrc()}
            alt={currentImage.name}
            className={`max-w-none transition-transform ${isMarked ? 'marked-image' : ''}`}
            style={{
              transform: `scale(${imageScale}) translate(${imagePosition.x / imageScale}px, ${imagePosition.y / imageScale}px)`,
              cursor: imageScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            draggable={false}
          />
        )}

        {/* 加载指示器 */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading-spinner w-8 h-8"></div>
          </div>
        )}
      </div>

      {/* 底部控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 text-white p-4">
        <div className="flex justify-center items-center space-x-6">
          <button
            onClick={prevImage}
            disabled={!canGoPrev}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ◀ 上一张
          </button>
          
          <button
            onClick={handleToggleMark}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isMarked 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {isMarked ? '取消标记' : '标记 (空格)'}
          </button>
          
          <button
            onClick={nextImage}
            disabled={!canGoNext}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一张 ▶
          </button>
        </div>
        
        {/* 缩放信息 */}
        <div className="text-center mt-2 text-sm text-gray-400">
          缩放: {Math.round(imageScale * 100)}% | 双击重置 | 滚轮缩放 | ESC退出
        </div>
      </div>
    </div>
  );
};
