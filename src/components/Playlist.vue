<template>
  <div :class="$style.playlist">
    <div :class="$style.header">播放列表</div>
    <div :class="$style.list">
      <div v-if="state.playlist.length === 0" :class="$style.empty">暂无内容</div>

      <template v-for="(song, si) in state.playlist" :key="song.bvid">
        <!-- 多分P：文件夹行 + 展开的子行 -->
        <template v-if="song.pages.length > 1">
          <TrackRow
            mode="folder"
            :title="song.title"
            :artist="song.artist"
            :duration="fmt(song.duration)"
            :index="si + 1"
            :active="si === currentIndex"
            :page-count="song.pages.length"
            :expanded="expandedMap[si]"
            :loading="loadingMap[si]"
            :playing="false"
            :is-loading="false"
            :indent="false"
            @click="toggleExpand(si)"
          />

          <template v-if="expandedMap[si]">
            <TrackRow
              v-for="(page, pi) in song.pages"
              :key="pi"
              mode="leaf"
              :title="page.title"
              :artist="song.artist"
              :duration="fmt(page.duration)"
              :index="pi + 1"
              :active="si === currentIndex && song.currentPageIndex === pi"
              :playing="si === currentIndex && song.currentPageIndex === pi"
              :is-loading="state.loading && si === currentIndex && song.currentPageIndex === pi"
              :page-count="0"
              :expanded="false"
              :loading="false"
              indent
              @click="playPage(si, pi)"
            />
          </template>
        </template>

        <!-- 单P：叶子行 -->
        <TrackRow
          v-else
          mode="leaf"
          :title="song.title"
          :artist="song.artist"
          :duration="fmt(song.duration)"
          :index="si + 1"
          :active="si === currentIndex && song.currentPageIndex === 0"
          :playing="si === currentIndex && song.currentPageIndex === 0"
          :is-loading="state.loading && si === currentIndex && song.currentPageIndex === 0"
          :page-count="0"
          :expanded="false"
          :loading="false"
          :indent="false"
          @click="play(si)"
        />
      </template>
    </div>

    <!-- 后台续载指示 -->
    <div v-if="state.importing" :class="$style.importing">正在导入更多…</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { state, currentIndex, play, playPage, ensureMeta } from '../stores/index.ts'
import TrackRow from './TrackRow.vue'

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const expandedMap = ref<Record<number, boolean>>({})
const loadingMap = ref<Record<number, boolean>>({})

// 歌单被整体替换（切换来源）时清理展开/加载状态；
// 后台追加导入的新页不应打断用户正在进行的展开
watch(
  () => state.playlist[0]?.bvid ?? '',
  (first, prev) => {
    if (first !== prev) {
      expandedMap.value = {}
      loadingMap.value = {}
    }
  },
)

async function toggleExpand(si: number) {
  if (expandedMap.value[si]) {
    expandedMap.value = { ...expandedMap.value, [si]: false }
    return
  }
  const song = state.playlist[si]
  if (song.pages.length > 1 && !song.metaLoaded) {
    loadingMap.value = { ...loadingMap.value, [si]: true }
    const ok = await ensureMeta(song)
    loadingMap.value = { ...loadingMap.value, [si]: false }
    if (!ok) return
  }
  expandedMap.value = { ...expandedMap.value, [si]: true }
}
</script>

<style module lang="scss">
.playlist {
  background: rgba(255, 255, 255, 0.04);
  cursor: default;
}

.header {
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* ── 滚动列表 ── */

.list {
  max-height: 260px;
  overflow-y: scroll;
  overscroll-behavior: contain;
  padding: 0 0 6px;
  scrollbar-width: none;
}

.list::-webkit-scrollbar {
  display: none;
}

.empty {
  padding: 20px 14px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
}

/* 后台续载指示 */
.importing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
    animation: importingPulse 0.8s ease-in-out infinite;
  }
}

@keyframes importingPulse {
  50% {
    opacity: 0.2;
  }
}
</style>
