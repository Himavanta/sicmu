<template>
  <div :class="$style.info">
    <h2 :class="$style.title">
      <span :class="[$style.scroller, playing && $style.scrolling].filter(Boolean).join(' ')">
        <span :class="$style.seg">{{ title }}</span>
        <span aria-hidden="true" :class="[$style.seg, $style.copy].filter(Boolean).join(' ')">{{
          title
        }}</span>
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

/* 视口：relative 作定位基准 + 裁切 + 单行 */
.title {
  position: relative;
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
}

/* 动画载体：占满视口宽，位移 -100% 恰好移出一个视口宽 */
.scroller {
  position: relative;
  display: block;
  width: 100%;
}

/* 双份同构标题：各占满一个视口宽，长文本从各自左侧开始溢出，
   副本 absolute 钉在视口右缘外 → 静止时永远不可见（无双显） */
.seg {
  display: block;
  width: 100%;
  white-space: nowrap;
}

.copy {
  position: absolute;
  top: 0;
  left: 100%;
}

/* 播放中：无缝循环（首尾各停 10%）；副本平移后精确补位 */
.scrolling {
  animation: titleScroll 15s linear infinite;
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
