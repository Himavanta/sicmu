/* ── 分P ── */

export interface Page {
  cid: number
  title: string
  duration: number
}

/* ── 歌曲 ── */

export interface Song {
  id: number
  bvid: string
  title: string
  artist: string
  duration: number
  pic: string
  cid: number
  pages: Page[]
  currentPageIndex: number
}

/* ── 播放器状态 ── */

export interface PlayerState {
  playlist: Song[]
  currentId: number
  playing: boolean
  currentTime: number
  loading: boolean
}

/* ── API 返回的视频信息 ── */

export interface VideoInfo {
  cid: number
  title: string
  artist: string
  duration: number
  pic: string
  pages: Page[]
}

/* ── 展平后的列表项 ── */

export interface FlatTrack {
  songIndex: number
  pageIndex: number
  title: string
  duration: number
}
