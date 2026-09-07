<template>
  <div :class="$style.info">
    <h2 :class="$style.title">
      <span :class="[$style.seg, playing && $style.scrolling]">
        {{ title }}<span aria-hidden="true" :class="$style.copy">{{ title }}</span>
      </span>
    </h2>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    /** 播放中才滚动标题，暂停/无歌时静止 */
    playing?: boolean
  }>(),
  { playing: true },
)
</script>

<style module lang="scss">
.info {
  min-width: 0;
}

/* 视口：裁切 + 单行 */
.title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
}

/* 第一份标题盒子：宽 = max(文本宽, 视口宽)
   - 短标题：撑满视口，把副本推到右缘外（不可见，无双显）
   - 长标题：随文本变宽，副本起点 = 文本末尾（无缝不重叠）
   动画 -100% 相对自身盒宽，恰好移出一个文本长（或一个视口宽） */
.seg {
  position: relative;
  display: inline-block;
  min-width: 100%;
  white-space: nowrap;
}

/* 副本：定位在第一份盒子的右缘，默认隐藏 */
.copy {
  position: absolute;
  top: 0;
  left: 100%;
  display: none;
  white-space: nowrap;
}

/* 播放中：副本参与补位 + 无缝循环（首尾各停 10%） */
.scrolling {
  animation: titleScroll 15s linear infinite;

  .copy {
    display: inline-block;
  }
}

@keyframes titleScroll {
  0%,
  10% {
    transform: translateX(0);
  }
  90%,
  100% {
    transform: translateX(-100%);
  }
}
</style>
