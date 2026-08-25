<template>
  <div :class="$style.controls">
    <button :class="$style.btn" aria-label="上一首" @click="prev">
      <IconPlayerSkipBack :size="14" />
    </button>

    <button
      :class="[$style.btn, $style.playBtn].join(' ')"
      :aria-label="state.playing ? '暂停' : '播放'"
      @click="togglePlay"
    >
      <span v-if="state.loading" :class="$style.loadingDot" />
      <IconPlayerPause v-else-if="state.playing" :size="15" />
      <IconPlayerPlay v-else :size="16" />
    </button>

    <button :class="$style.btn" aria-label="下一首" @click="next">
      <IconPlayerSkipForward :size="14" />
    </button>

    <button :class="$style.btn" aria-label="添加来源" @click="$emit('openDialog')">
      <IconFolderOpen :size="14" />
    </button>

    <button
      :class="[$style.btn, showPlaylist && $style.btnActive].filter(Boolean).join(' ')"
      aria-label="播放列表"
      @click="$emit('togglePlaylist')"
    >
      <IconPlaylist :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  IconFolderOpen,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlaylist,
} from '@tabler/icons-vue'

import { state, togglePlay, prev, next } from '../stores/index.ts'

defineProps<{
  showPlaylist: boolean
}>()

defineEmits<{
  togglePlaylist: []
  openDialog: []
}>()
</script>

<style module lang="scss">
.controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 50%;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: scale(0.88);
  }
}

.btnActive {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.playBtn {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.loadingDot {
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
</style>
