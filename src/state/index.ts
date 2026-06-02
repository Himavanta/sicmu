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
} from './store.ts'

export {
  getVideoInfo,
  getPlayUrl,
  getCurrentUserMid,
  getCreatedFavFolders,
  getCollectedFavFolders,
} from './api.ts'
export type { FavFolder } from './api.ts'

export { play, playPage, togglePlay, next, prev, seek, previewSeek, getAudio } from './player.ts'
