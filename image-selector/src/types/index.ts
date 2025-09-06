// 图片文件类型
export interface ImageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  modified: number;
  extension: string;
}

// 图片元数据类型
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  color_type: string;
  file_size: number;
}

// 扫描结果类型
export interface ScanResult {
  images: ImageFile[];
  total_count: number;
  scan_time_ms: number;
}

// 处理结果类型
export interface ProcessResult {
  success_count: number;
  failed_count: number;
  errors: string[];
}

// 应用状态类型
export interface AppState {
  // 图片相关
  images: ImageFile[];
  currentIndex: number;
  markedIndices: Set<number>;
  
  // 文件夹相关
  folderPath: string;
  isScanning: boolean;
  scanProgress: number;
  
  // 处理相关
  isProcessing: boolean;
  processProgress: number;
  
  // UI状态
  isViewerMode: boolean;
  showBatchDialog: boolean;
  
  // 操作方法
  setImages: (images: ImageFile[]) => void;
  setCurrentIndex: (index: number) => void;
  toggleMark: (index: number) => void;
  clearMarks: () => void;
  setFolderPath: (path: string) => void;
  setScanning: (scanning: boolean) => void;
  setScanProgress: (progress: number) => void;
  setProcessing: (processing: boolean) => void;
  setProcessProgress: (progress: number) => void;
  setViewerMode: (mode: boolean) => void;
  setShowBatchDialog: (show: boolean) => void;
  
  // 导航方法
  nextImage: () => void;
  prevImage: () => void;
  goToFirst: () => void;
  goToLast: () => void;
}

// 批量操作类型
export type BatchOperationType = 'copy' | 'move';

// 快捷键映射
export interface KeyboardShortcuts {
  nextImage: string[];
  prevImage: string[];
  toggleMark: string[];
  goToFirst: string[];
  goToLast: string[];
  exitViewer: string[];
}
