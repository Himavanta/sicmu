import { getVideoInfo, getPlayUrl } from '../api/index.ts'
import { state, currentIndex, currentSong, getFlatPlaylist, getCurrentFlatIndex } from './state.ts'

/* ══════════════════════════════════════════
   音频管理
   ══════════════════════════════════════════ */

let audio: HTMLAudioElement | null = null

function ensureAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.addEventListener('timeupdate', () => {
      if (audio && !audio.paused) {
        state.currentTime = Math.floor(audio.currentTime)
        state.playing = true
      }
    })
    audio.addEventListener('ended', () => {
      state.playing = false
      state.currentTime = 0

      const flat = getFlatPlaylist()
      const cur = getCurrentFlatIndex()
      if (cur < flat.length - 1) {
        const next = flat[cur + 1]
        void playPage(next.songIndex, next.pageIndex)
      }
    })
    audio.addEventListener('waiting', () => {
      state.loading = true
    })
    audio.addEventListener('canplay', () => {
      state.loading = false
    })
    audio.addEventListener('error', () => {
      state.loading = false
    })
  }
  return audio
}

/* ══════════════════════════════════════════
   播放控制
   ══════════════════════════════════════════ */

/** 播放指定歌曲（从第 0 个分P 开始） */
export async function play(index: number) {
  await playPage(index, 0)
}

/** 播放指定歌曲的指定分P */
export async function playPage(index: number, pageIndex: number) {
  const song = state.playlist[index]
  if (!song) return

  // 首次播放或占位分P：获取元数据
  if (song.pages.length === 0 || song.pages[0]?.cid === 0) {
    state.currentId = song.id
    state.currentTime = 0
    state.loading = true
    try {
      const info = await getVideoInfo(song.bvid)
      song.title = info.title
      song.artist = info.artist
      song.duration = info.duration
      song.pic = info.pic
      song.pages = info.pages
    } catch (e) {
      console.error('获取视频信息失败:', e)
      state.loading = false
      return
    }
  }

  const pi = Math.min(pageIndex, song.pages.length - 1)
  song.currentPageIndex = pi
  const page = song.pages[pi]
  song.cid = page.cid

  state.currentId = song.id
  state.currentTime = 0
  state.loading = true

  try {
    const el = ensureAudio()
    const url = await getPlayUrl(song.bvid, page.cid)
    el.src = url
    await el.play()
    state.playing = true
  } catch (e) {
    console.error('播放失败:', e)
    state.playing = false
    state.loading = false
  }
}

export function togglePlay() {
  const el = ensureAudio()
  if (state.playing) {
    el.pause()
    state.playing = false
  } else if (el.src) {
    void el.play()
    state.playing = true
  } else {
    void playPage(currentIndex.value, currentSong.value?.currentPageIndex ?? 0)
  }
}

export function next() {
  const flat = getFlatPlaylist()
  if (flat.length === 0) return
  const cur = getCurrentFlatIndex()
  const nextIdx = (cur + 1) % flat.length
  const track = flat[nextIdx]
  void playPage(track.songIndex, track.pageIndex)
}

export function prev() {
  const flat = getFlatPlaylist()
  if (flat.length === 0) return
  const cur = getCurrentFlatIndex()
  const prevIdx = (cur - 1 + flat.length) % flat.length
  const track = flat[prevIdx]
  void playPage(track.songIndex, track.pageIndex)
}

/* ══════════════════════════════════════════
   进度控制
   ══════════════════════════════════════════ */

export function seek(time: number) {
  const el = ensureAudio()
  el.currentTime = time
  state.currentTime = time
}

/** 仅同步进度，不触发 audio 跳转（拖拽中实时显示用） */
export function previewSeek(time: number) {
  state.currentTime = time
}

/** 获取内部 Audio 元素引用 */
export function getAudio(): HTMLAudioElement {
  return ensureAudio()
}
