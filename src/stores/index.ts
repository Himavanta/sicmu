export type { Page, Song, PlayerState, VideoInfo, FlatTrack } from './types.ts'

export {
  state,
  currentIndex,
  currentSong,
  currentTitle,
  duration,
  progress,
  formatTime,
  getFlatPlaylist,
  getCurrentFlatIndex,
} from './state.ts'

export { play, playPage, togglePlay, next, prev, seek, previewSeek, getAudio } from './player.ts'

export { ensureMeta } from './meta.ts'
