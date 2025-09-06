import { create } from 'zustand';
import { AppState, ImageFile } from '../types';

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  images: [],
  currentIndex: 0,
  markedIndices: new Set<number>(),
  folderPath: '',
  isScanning: false,
  scanProgress: 0,
  isProcessing: false,
  processProgress: 0,
  isViewerMode: false,
  showBatchDialog: false,

  // 图片相关操作
  setImages: (images: ImageFile[]) => set({ 
    images, 
    currentIndex: 0, 
    markedIndices: new Set() 
  }),

  setCurrentIndex: (index: number) => {
    const { images } = get();
    if (index >= 0 && index < images.length) {
      set({ currentIndex: index });
    }
  },

  toggleMark: (index: number) => {
    const { markedIndices } = get();
    const newMarkedIndices = new Set(markedIndices);
    
    if (newMarkedIndices.has(index)) {
      newMarkedIndices.delete(index);
    } else {
      newMarkedIndices.add(index);
    }
    
    set({ markedIndices: newMarkedIndices });
  },

  clearMarks: () => set({ markedIndices: new Set() }),

  // 文件夹相关操作
  setFolderPath: (path: string) => set({ folderPath: path }),
  setScanning: (scanning: boolean) => set({ isScanning: scanning }),
  setScanProgress: (progress: number) => set({ scanProgress: progress }),

  // 处理相关操作
  setProcessing: (processing: boolean) => set({ isProcessing: processing }),
  setProcessProgress: (progress: number) => set({ processProgress: progress }),

  // UI状态操作
  setViewerMode: (mode: boolean) => set({ isViewerMode: mode }),
  setShowBatchDialog: (show: boolean) => set({ showBatchDialog: show }),

  // 导航方法
  nextImage: () => {
    const { currentIndex, images } = get();
    if (currentIndex < images.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevImage: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToFirst: () => set({ currentIndex: 0 }),

  goToLast: () => {
    const { images } = get();
    if (images.length > 0) {
      set({ currentIndex: images.length - 1 });
    }
  },
}));
