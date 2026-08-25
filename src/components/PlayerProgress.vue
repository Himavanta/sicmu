<template>
  <span :class="$style.time">
    {{ formatTime(state.currentTime) }} / {{ formatTime(duration) }}
  </span>
</template>

<script setup lang="ts">
import { state, duration, formatTime } from '../stores/index.ts'
</script>

<style module lang="scss">
.time {
  font-size: 10px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
