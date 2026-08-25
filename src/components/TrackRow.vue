<template>
  <div
    :class="
      [$style.row, active && $style.rowActive, indent && $style.rowIndent].filter(Boolean).join(' ')
    "
    :title="artist ? `${title} — ${artist}` : title"
    @click="$emit('click')"
  >
    <!-- 索引列 -->
    <div :class="$style.index">
      <template v-if="mode === 'folder'">
        <span v-if="loading" :class="$style.spinner" />
        <IconChevronDown v-else-if="expanded" :size="14" />
        <IconChevronRight v-else :size="14" />
      </template>
      <PlayingIndicator
        v-else
        :playing="playing ?? false"
        :loading="isLoading ?? false"
        :index="index"
      />
    </div>

    <!-- 标题 -->
    <span :class="[$style.title, active && $style.titleActive].filter(Boolean).join(' ')">
      {{ title }}
    </span>

    <!-- 元信息（仅 folder） -->
    <span v-if="mode === 'folder' && pageCount != null" :class="$style.meta">
      {{ pageCount }} 首
    </span>

    <!-- 时长 -->
    <span :class="$style.duration">{{ duration }}</span>
  </div>
</template>

<script setup lang="ts">
import { IconChevronDown, IconChevronRight } from '@tabler/icons-vue'

import PlayingIndicator from './PlayingIndicator.vue'

type RowMode = 'folder' | 'leaf'

defineProps<{
  mode: RowMode
  title: string
  duration: string
  index: number
  active: boolean
  pageCount?: number
  expanded?: boolean
  loading?: boolean
  playing?: boolean
  isLoading?: boolean
  artist?: string
  indent?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style module lang="scss">
/* ════════════════════════════════════════
   统一行样式
   ════════════════════════════════════════ */

.row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.rowActive {
  background: rgba(0, 0, 0, 0.05);
}

/* 子级缩进 */
.rowIndent {
  padding-left: 36px;
}

/* 索引/图标列（16px 固定） */
.index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.3);
}

/* 标题 */
.title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.titleActive {
  color: #000;
  font-weight: 600;
}

/* 副标题/元信息 */
.meta {
  font-size: 10px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
}

/* 时长 */
.duration {
  font-size: 11px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

/* 展开箭头加载圈 */
.spinner {
  display: block;
  width: 8px;
  height: 8px;
  border: 1.5px solid rgba(0, 0, 0, 0.15);
  border-top-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
