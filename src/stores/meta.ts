import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'

import { getVideoInfo } from '../api/index.ts'
import { queryClient } from './query-client.ts'
import type { Song, VideoInfo } from './types.ts'

/** 响应式查询视频元数据（组件内使用） */
export function useVideoMeta(bvid: string): UseQueryReturnType<VideoInfo, Error> {
  return useQuery({
    queryKey: ['video-meta', bvid],
    queryFn: () => getVideoInfo(bvid),
  })
}

/** 确保歌曲元数据已加载，未加载则从 API 获取并更新 song 对象 */
export async function ensureMeta(song: Song): Promise<boolean> {
  if (song.metaLoaded) return true
  try {
    const info = await queryClient.fetchQuery({
      queryKey: ['video-meta', song.bvid],
      queryFn: () => getVideoInfo(song.bvid),
    })
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
