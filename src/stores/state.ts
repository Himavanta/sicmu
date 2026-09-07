import { reactive, computed } from 'vue'

import type { Song, PlayerState, FlatTrack } from './types.ts'

/* ── 播放列表 ── */

const defaultPlaylist: Song[] = []

/* ── 状态 ── */

export const state = reactive<PlayerState>({
  playlist: defaultPlaylist,
  currentId: '',
  playing: false,
  currentTime: 0,
  loading: false,
  importing: false,
})

/* ── 计算属性 ── */

/** 当前歌曲在列表中的索引 */
export const currentIndex = computed(() =>
  state.playlist.findIndex((s) => s.bvid === state.currentId),
)

/** 当前 Song 对象 */
export const currentSong = computed(
  () => state.playlist.find((s) => s.bvid === state.currentId) ?? null,
)

/** 当前正在播放的标题 */
export const currentTitle = computed(() => {
  const song = currentSong.value
  if (!song) return ''
  // 单P 用视频标题（part 通常无意义）
  if (song.pages.length <= 1) return song.title
  // 多P 用分P 标题
  const page = song.pages[song.currentPageIndex]
  return page?.title ?? song.title
})

export const duration = computed(() => {
  const song = currentSong.value
  if (!song) return 0
  if (song.pages.length === 0) return 0
  // 占位分P（未加载）→ 用总时长
  if (song.pages.length > 1 && song.pages[0]?.cid === 0) return song.duration
  if (song.pages.length > 1) {
    return song.pages[song.currentPageIndex].duration
  }
  return song.duration
})

export const progress = computed(() =>
  duration.value > 0 ? (state.currentTime / duration.value) * 100 : 0,
)

/* ── 工具函数 ── */

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** 展平的播放列表：每首歌曲的每个分P 各占一行 */
export function getFlatPlaylist(): FlatTrack[] {
  const result: FlatTrack[] = []
  for (let si = 0; si < state.playlist.length; si++) {
    const song = state.playlist[si]
    const hasRealPages = song.pages.length > 1 && song.metaLoaded
    if (hasRealPages) {
      for (let pi = 0; pi < song.pages.length; pi++) {
        const page = song.pages[pi]
        result.push({
          songIndex: si,
          pageIndex: pi,
          title: page.title,
          duration: page.duration,
        })
      }
    } else {
      result.push({
        songIndex: si,
        pageIndex: 0,
        title: song.title,
        duration: song.duration,
      })
    }
  }
  return result
}

/** 当前在展平列表中的索引 */
export function getCurrentFlatIndex(): number {
  const ci = currentIndex.value
  if (ci < 0) return 0
  let idx = 0
  for (let si = 0; si < ci; si++) {
    const song = state.playlist[si]
    const hasRealPages = song.pages.length > 1 && song.metaLoaded
    idx += hasRealPages ? song.pages.length : 1
  }
  const song = currentSong.value
  if (song) idx += song.currentPageIndex
  return idx
}
