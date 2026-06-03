# Sicmu — Bilibili 音乐播放器

注入油猴脚本到 Bilibili 页面，利用 B 站 API 和用户登录态，实现一个独立的、优雅的音乐播放器。

## 安装

1. 确保已安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. [通过 unpkg 安装](https://unpkg.com/sicmu/dist/data.user.js)（推荐）

> 安装后 Tampermonkey 会自动通过 unpkg 检查更新。

### 本地开发

```bash
# 安装依赖
pnpm install

# 监听构建
pnpm watch

# 浏览器安装 public/data.user.js（指向本地 dist/data.user.js）
```

## 构建

```bash
pnpm build          # 构建发布版本
pnpm publish        # 发布到 npm（需 npm login）
```
