<template>
  <div :class="$style.backdrop" @click="emit('close')">
    <div :class="$style.dialog" @click.stop>
      <div :class="$style.header">
        <span>添加来源</span>
        <button :class="$style.closeBtn" @click="emit('close')">
          <IconX :size="16" />
        </button>
      </div>

      <div :class="$style.content">
        <div v-if="loading" :class="$style.loading">
          <span :class="$style.loadingDot" />
          加载中
        </div>
        <template v-else>
          <div :class="$style.section">
            <div :class="$style.sectionLabel">我的收藏夹</div>
            <div v-if="createdFolders.length === 0" :class="$style.empty">暂无收藏夹</div>
            <template v-else>
              <div
                v-for="f in createdFolders"
                :key="f.id"
                :class="$style.folder"
                @click="handleFolderClick(f)"
              >
                <div :class="$style.folderIcon">
                  <IconFolder :size="18" />
                </div>
                <div :class="$style.folderInfo">
                  <div :class="$style.folderTitle">{{ f.title }}</div>
                  <div :class="$style.folderMeta">{{ f.mediaCount }} 项</div>
                </div>
              </div>
            </template>
          </div>

          <div :class="$style.section">
            <div :class="$style.sectionLabel">订阅</div>
            <div v-if="collectedFolders.length === 0" :class="$style.empty">暂无订阅</div>
            <template v-else>
              <div
                v-for="f in collectedFolders"
                :key="f.id"
                :class="$style.folder"
                @click="handleFolderClick(f)"
              >
                <img
                  v-if="f.cover"
                  :class="$style.folderCover"
                  :src="f.cover"
                  :alt="f.title"
                  referrerpolicy="origin"
                />
                <div v-else :class="$style.folderIcon">
                  <IconFolder :size="18" />
                </div>
                <div :class="$style.folderInfo">
                  <div :class="$style.folderTitle">{{ f.title }}</div>
                  <div :class="$style.folderMeta">
                    {{ f.mediaCount }} 项{{ f.upperName ? ` · ${f.upperName}` : '' }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFolder, IconX } from '@tabler/icons-vue'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import {
  getCurrentUserMid,
  getCreatedFavFolders,
  getCollectedFavFolders,
  getFavResources,
  getSeasonResources,
} from '../api/index.ts'
import type { FavFolder, FavResource } from '../api/index.ts'
import { state, play } from '../stores/index.ts'
import type { Song } from '../stores/types.ts'

const emit = defineEmits<{
  close: []
  playlistUpdated: []
}>()

const midQuery = useQuery({
  queryKey: ['user-mid'],
  queryFn: getCurrentUserMid,
})

const createdQuery = useQuery({
  queryKey: ['fav-folders', 'created', midQuery.data.value],
  queryFn: () => getCreatedFavFolders(midQuery.data.value!),
  enabled: computed(() => !!midQuery.data.value),
  retry: 1,
})

const collectedQuery = useQuery({
  queryKey: ['fav-folders', 'collected', midQuery.data.value],
  queryFn: () => getCollectedFavFolders(midQuery.data.value!),
  enabled: computed(() => !!midQuery.data.value),
  retry: 1,
})

const loading = computed(
  () => midQuery.isLoading.value || createdQuery.isLoading.value || collectedQuery.isLoading.value,
)

const createdFolders = computed(() => createdQuery.data.value ?? [])
const collectedFolders = computed(() => collectedQuery.data.value ?? [])

async function handleFolderClick(folder: FavFolder) {
  let items: FavResource[]
  try {
    const result =
      folder.type === 21 && folder.ownerMid
        ? await getSeasonResources(folder.id, folder.ownerMid)
        : await getFavResources(folder.id)
    items = result.items
  } catch (e) {
    console.error('获取内容失败:', e)
    return
  }
  if (items.length === 0) return

  const songs: Song[] = items.map((r) => {
    const pages =
      r.pageCount > 1
        ? Array.from({ length: r.pageCount }, () => ({
            cid: 0,
            title: '加载中…',
            duration: 0,
          }))
        : []
    return {
      bvid: r.bvid,
      title: r.title,
      artist: r.upperName,
      duration: r.duration,
      pic: '',
      cid: 0,
      pages,
      currentPageIndex: 0,
      metaLoaded: false,
    }
  })

  state.playlist.splice(0, state.playlist.length, ...songs)

  emit('playlistUpdated')
  emit('close')

  // 直接播第一首（不等待，让对话框立即关闭）
  void play(0)
}
</script>

<style module lang="scss">
/* ── 遮罩 ── */

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
}

/* ── 弹窗 ── */

.dialog {
  width: 380px;
  max-height: 70vh;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  flex-shrink: 0;
}

.closeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: -4px;
  border: none;
  background: none;
  color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border-radius: 50%;
  transition: color 0.15s;

  &:hover {
    color: rgba(0, 0, 0, 0.5);
  }
}

/* ── 内容区域 ── */

.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0 8px;
  overscroll-behavior: contain;
}

.content::-webkit-scrollbar {
  width: 4px;
}

.content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}

/* ── 分组 ── */

.section {
  padding: 0 16px;

  & + & {
    margin-top: 4px;
  }
}

.sectionLabel {
  padding: 8px 8px 6px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.25);
  letter-spacing: 0.3px;
}

/* ── 收藏夹项 ── */

.folder {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.035);
  }
}

.folderCover {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.04);
}

.folderIcon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.15);
}

.folderInfo {
  flex: 1;
  min-width: 0;
}

.folderTitle {
  font-size: 13px;
  font-weight: 450;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folderMeta {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.3);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── 加载/空状态 ── */

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.25);
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
    opacity: 0.25;
    transform: scale(0.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.empty {
  padding: 12px 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.2);
}
</style>
