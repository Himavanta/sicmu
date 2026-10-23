<template>
  <div :class="$style.volume">
    <button
      :class="$style.button"
      :aria-label="muted ? '取消静音' : '静音'"
      :aria-pressed="muted"
      :title="muted ? '取消静音' : '静音'"
      @click="audio.muted = !audio.muted"
    >
      <IconVolumeOff v-if="muted || volume === 0" :size="14" />
      <IconVolume v-else :size="14" />
    </button>
    <div :class="$style.popover">
      <div :class="$style.panel">
        <input
          :class="$style.slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="muted ? 0 : volume"
          aria-label="音量"
          aria-orientation="vertical"
          :aria-valuetext="`${Math.round((muted ? 0 : volume) * 100)}%`"
          @input="setVolume"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconVolume, IconVolumeOff } from '@tabler/icons-vue'
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'

import { getAudio } from '../stores/index.ts'

const audio = getAudio()
const volume = ref(audio.volume)
const muted = ref(audio.muted)

useEventListener(audio, 'volumechange', () => {
  volume.value = audio.volume
  muted.value = audio.muted
})

function setVolume(event: Event) {
  audio.volume = (event.target as HTMLInputElement).valueAsNumber
  audio.muted = false
}
</script>

<style module lang="scss">
.volume {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  &:hover .popover,
  &:has(:focus-visible) .popover {
    visibility: visible;
  }
}

.popover {
  position: absolute;
  bottom: 100%;
  left: 50%;
  z-index: 1;
  padding-bottom: 6px;
  transform: translateX(-50%);
  visibility: hidden;
}

.panel {
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 4px;
  background: #20232b;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
}

.slider {
  appearance: none;
  writing-mode: vertical-lr;
  direction: rtl;
  width: 12px;
  height: 40px;
  margin: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 2px;
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.5);
  }

  &::-moz-range-track {
    width: 2px;
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.5);
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 6px;
    height: 6px;
    margin-left: -2px;
    border: none;
    border-radius: 50%;
    background: #fff;
  }

  &::-moz-range-thumb {
    width: 6px;
    height: 6px;
    border: none;
    border-radius: 50%;
    background: #fff;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
}
</style>
