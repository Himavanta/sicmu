<template>
  <div :class="[$style.shell, showPlaylist && $style.shellExpanded].filter(Boolean).join(' ')">
    <div :class="$style.banner">
      <PlayerArtwork />
      <div :class="$style.overlay">
        <PlayerInfo :title="currentTitle" />
        <div ref="progRef" :class="$style.progTrack" @mousedown="handleSeekStart">
          <div :class="$style.progFill" :style="{ width: `${pct}%` }" />
          <div :class="$style.progThumb" :style="{ left: `${pct}%` }" />
        </div>
        <div :class="$style.midRow">
          <PlayerControls
            :show-playlist="showPlaylist"
            @toggle-playlist="togglePlaylist"
            @open-dialog="showDialog = true"
          />
          <PlayerProgress />
        </div>
      </div>
    </div>

    <div
      :class="[$style.playlistWrap, showPlaylist && $style.playlistOpen].filter(Boolean).join(' ')"
    >
      <Playlist />
    </div>
  </div>

  <Teleport to="body">
    <FavDialog
      v-if="showDialog"
      @close="showDialog = false"
      @playlist-updated="showPlaylist = true"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

import { state, currentTitle, duration, seek, previewSeek } from '../stores/index.ts'
import FavDialog from './FavDialog.vue'
import PlayerArtwork from './PlayerArtwork.vue'
import PlayerControls from './PlayerControls.vue'
import PlayerInfo from './PlayerInfo.vue'
import PlayerProgress from './PlayerProgress.vue'
import Playlist from './Playlist.vue'

const showPlaylist = ref(false)
const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value
}

const showDialog = ref(false)

const progRef = ref<HTMLElement | null>(null)
const isSeeking = ref(false)

const pct = computed(() => (duration.value > 0 ? (state.currentTime / duration.value) * 100 : 0))

function calcTime(e: MouseEvent): number {
  if (!progRef.value || duration.value === 0) return 0
  const rect = progRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1))
  return ratio * duration.value
}

function handleSeekStart(e: MouseEvent) {
  isSeeking.value = true
  seek(calcTime(e))
}

function handleSeekMove(e: MouseEvent) {
  if (!isSeeking.value) return
  previewSeek(calcTime(e))
}

function handleSeekEnd(e: MouseEvent) {
  if (!isSeeking.value) return
  isSeeking.value = false
  seek(calcTime(e))
}

onMounted(() => {
  document.addEventListener('mousemove', handleSeekMove)
  document.addEventListener('mouseup', handleSeekEnd)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleSeekMove)
  document.removeEventListener('mouseup', handleSeekEnd)
})
</script>

<style module lang="scss">
.shell {
  background: #fff;
  border-radius: 6px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.06),
    0 12px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
  color: #000;
  margin-bottom: 10px;
}

.banner {
  position: relative;
  height: 100px;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
  padding: 10px 12px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.2) 40%,
    transparent 55%
  );
  opacity: 0.3;
  transition: opacity 0.2s ease;
  pointer-events: none;

  .shell:hover & {
    opacity: 1;
    pointer-events: auto;
  }
}

/* 进度条：视觉 2px 细线，点击区域 16px */
.progTrack {
  position: relative;
  height: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* 背景轨道线 */
.progTrack::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
}

.progFill {
  position: absolute;
  left: 0;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border-radius: 1px;
  pointer-events: none;
}

.progThumb {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  pointer-events: none;

  .progTrack:hover & {
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 底行：控制 + 时间 */
.midRow {
  display: flex;
  align-items: center;
}

.midRow > :last-child {
  margin-left: auto;
}

.playlistWrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);

  > * {
    overflow: hidden;
  }
}

.playlistOpen {
  grid-template-rows: 1fr;
}
</style>
