import { reactive, computed } from 'vue'

export interface Song {
  id: number
  bvid: string
  title: string
  artist: string
  duration: number
}

const defaultPlaylist: Song[] = [
  { id: 1, bvid: 'BV1xx411c7mD', title: '午夜旋律', artist: 'Sicmu', duration: 230 },
  { id: 2, bvid: 'BV1xx411c7mD', title: '城市之光', artist: 'Sicmu', duration: 252 },
  { id: 3, bvid: 'BV1xx411c7mD', title: '星河', artist: 'Sicmu', duration: 208 },
  { id: 4, bvid: 'BV1xx411c7mD', title: '雨后', artist: 'Sicmu', duration: 301 },
  { id: 5, bvid: 'BV1xx411c7mD', title: '晨曦', artist: 'Sicmu', duration: 235 },
]

export interface PlayerState {
  playlist: Song[]
  currentIndex: number
  playing: boolean
  currentTime: number
}

export const state = reactive<PlayerState>({
  playlist: defaultPlaylist,
  currentIndex: 1,
  playing: false,
  currentTime: 0,
})

let timer: ReturnType<typeof setInterval> | null = null

export const currentSong = computed(() => state.playlist[state.currentIndex])

export const duration = computed(() => state.playlist[state.currentIndex].duration)

export const progress = computed(() =>
  duration.value > 0 ? (state.currentTime / duration.value) * 100 : 0,
)

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function startTimer() {
  stopTimer()
  timer = setInterval(() => {
    if (state.currentTime >= duration.value) {
      next()
    } else {
      state.currentTime++
    }
  }, 1000)
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

export function play(index: number) {
  if (index === state.currentIndex && state.playing) {
    return
  }
  state.currentIndex = index
  state.playing = true
  state.currentTime = 0
  startTimer()
}

export function togglePlay() {
  if (state.playing) {
    state.playing = false
    stopTimer()
  } else {
    state.playing = true
    startTimer()
  }
}

export function next() {
  play((state.currentIndex + 1) % state.playlist.length)
}

export function prev() {
  play((state.currentIndex - 1 + state.playlist.length) % state.playlist.length)
}
