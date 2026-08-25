import { getVideoInfo } from '../api/index.ts'
import type { Song } from './types.ts'

/** 确保歌曲元数据已加载，未加载则从 API 获取并更新 song 对象 */
export async function ensureMeta(song: Song): Promise<boolean> {
  if (song.metaLoaded) return true
  try {
    const info = await getVideoInfo(song.bvid)
    song.title = info.title
    song.artist = info.artist
    song.duration = info.duration
    song.pic = info.pic
    song.pages = info.pages
    song.metaLoaded = true
    return true
  } catch (e) {
    console.error('获取视频信息失败:', e)
    return false
  }
}
