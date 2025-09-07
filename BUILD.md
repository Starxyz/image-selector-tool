# 构建说明

本项目使用GitHub Actions自动构建Windows可执行文件。

## 🚀 自动构建

### 触发构建的方式

1. **推送到主分支**: 每次推送代码到 `main` 或 `master` 分支时自动构建
2. **创建标签**: 创建以 `v` 开头的标签时自动构建并发布
3. **手动触发**: 在GitHub Actions页面手动运行工作流

### 构建产物

构建完成后，你可以在以下位置找到可执行文件：

- **GitHub Actions Artifacts**: 每次构建的产物
- **GitHub Releases**: 标签构建的正式发布版本

## 📦 发布新版本

要发布新版本，请按照以下步骤：

1. **更新版本号**:
   ```bash
   cd image-selector
   npm version patch  # 或 minor, major
   ```

2. **推送更改**:
   ```bash
   git add .
   git commit -m "发布版本 v0.1.1"
   git push
   ```

3. **创建标签**:
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```

4. **等待构建**: GitHub Actions会自动构建并创建Release

## 🛠️ 本地构建

如果需要在本地构建：

```bash
cd image-selector
npm install
npm run tauri build
```

构建产物位置：
- **可执行文件**: `src-tauri/target/release/image-selector.exe`
- **安装包**: `src-tauri/target/release/bundle/msi/`

## 📋 构建要求

- Node.js 18+
- Rust (最新稳定版)
- Windows 10/11 (用于Windows构建)

## 🔧 故障排除

### 常见问题

1. **构建失败**: 检查依赖是否正确安装
2. **权限错误**: 确保GitHub仓库有正确的权限设置
3. **图标缺失**: 确保 `src-tauri/icons/` 目录包含所需图标

### 检查构建状态

- 访问仓库的 "Actions" 标签页查看构建状态
- 点击具体的工作流查看详细日志

## 📁 构建配置文件

- `.github/workflows/build-windows.yml`: 基础构建工作流
- `.github/workflows/release.yml`: 发布工作流
- `image-selector/src-tauri/tauri.conf.json`: Tauri配置
