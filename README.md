# Sicmu — B 站音乐播放器

将 B 站页面变成纯音乐播放器，利用收藏夹和订阅列表播歌。

<div>
  <img src="public/image.png" width="360" alt="预览" />
</div>

## 功能

- 收藏夹 / 订阅一键导入歌单
- 自动连播，多分P 视频支持展开逐P 播放
- 纯音频播放，省流量（DASH 音频流）
- 无感注入 B 站动态页侧边栏，不干扰原页面

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 打开 [unpkg 安装链接](https://unpkg.com/sicmu/dist/data.user.js)

安装后会自动更新。

## 使用

进入 [B 站动态页](https://t.bilibili.com)，页面右侧会浮现播放器界面。

- 需要登录 B 站（脚本直调官方 API）
- 点击底部文件夹按钮，从你的收藏夹或订阅中导入歌单
- hover 封面区域显示控制条；点击列表按钮展开/收起歌单
