<template>
  <span :class="$style.box">
    <span v-if="loading" :class="$style.dot" />
    <span v-else-if="playing" :class="$style.bars">
      <span />
      <span />
      <span />
    </span>
    <span v-else :class="$style.num">{{ index }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  playing: boolean
  loading: boolean
  index: number
}>()
</script>

<style module lang="scss">
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.num {
  font-size: 11px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.dot {
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  animation: dotPulse 0.6s ease-in-out infinite alternate;
}

@keyframes dotPulse {
  0% {
    opacity: 0.3;
    transform: scale(0.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.bars {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.5px;
  height: 14px;
  width: 14px;
}

.bars span {
  display: block;
  width: 2px;
  border-radius: 1px;
  background: currentColor;
  transform-origin: bottom;
  will-change: transform;
  animation: barBounce 0.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
}

.bars span:nth-child(1) {
  height: 10px;
}
.bars span:nth-child(2) {
  height: 14px;
  animation-delay: 0.12s;
}
.bars span:nth-child(3) {
  height: 11px;
  animation-delay: 0.24s;
}

@keyframes barBounce {
  0% {
    transform: scaleY(0.15);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
