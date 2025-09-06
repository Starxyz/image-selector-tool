# 图片筛选批量处理工具

一款专为质检人员设计的图片快速筛选和批量处理桌面工具，基于 Tauri + React + TypeScript 开发。

## 功能特性

- 🖼️ **图片浏览**: 全屏式图片查看器，支持缩放、拖拽
- ⌨️ **快捷键操作**: 键盘快捷键快速导航和标记
- 🏷️ **图片标记**: 快速标记需要处理的图片
- 📁 **批量处理**: 支持批量复制或移动标记的图片
- 🚀 **高性能**: 基于 Rust 后端，内存占用低，处理速度快
- 🎨 **深色主题**: 护眼的深色界面设计

## 技术栈

- **前端**: React 19 + TypeScript + Zustand
- **后端**: Rust + Tauri 2.0
- **样式**: 自定义 CSS（类 Tailwind 工具类）
- **构建**: Vite

## 快捷键

- `←` / `A`: 上一张图片
- `→` / `D`: 下一张图片
- `空格`: 标记/取消标记当前图片
- `Home`: 跳转到第一张
- `End`: 跳转到最后一张
- `Esc`: 退出浏览模式

## 开发环境要求

- Node.js 18+
- Rust 1.70+
- 操作系统: Windows 10/11, macOS 10.15+, Linux

## 安装和运行

1. 克隆项目
```bash
git clone <repository-url>
cd image-selector
```

2. 安装依赖
```bash
npm install
```

3. 开发模式运行
```bash
npm run tauri dev
```

4. 构建生产版本
```bash
npm run tauri build
```

## 项目结构

```
image-selector/
├── src/                    # React 前端
│   ├── components/         # React 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── stores/            # Zustand 状态管理
│   ├── types/             # TypeScript 类型定义
│   └── utils/             # 工具函数
├── src-tauri/             # Rust 后端
│   ├── src/
│   │   ├── commands.rs    # Tauri 命令
│   │   ├── file_manager.rs # 文件操作
│   │   └── types.rs       # Rust 类型定义
│   └── Cargo.toml         # Rust 依赖
└── package.json           # 前端依赖
```

## 支持的图片格式

JPG, JPEG, PNG, BMP, GIF, WEBP, TIFF

## 许可证

MIT License

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
