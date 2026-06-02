import ky from 'ky'

import type { VideoInfo } from '../stores/types.ts'
import { encryptWbi } from './wbi.ts'

export async function getVideoInfo(bvid: string): Promise<VideoInfo> {
  const data: any = await ky
    .get('https://api.bilibili.com/x/web-interface/view', {
      credentials: 'include',
      searchParams: { bvid },
    })
    .json()
  return {
    cid: data.data.cid,
    title: data.data.title,
    artist: data.data.owner.name,
    duration: data.data.duration,
    pic: data.data.pic,
    pages: (data.data.pages ?? []).map((p: any) => ({
      cid: p.cid,
      title: p.part,
      duration: p.duration,
    })),
  }
}

export async function getPlayUrl(bvid: string, cid: number): Promise<string> {
  const params = await encryptWbi({ bvid, cid, fnval: 1, qn: 16 })
  const data: any = await ky
    .get('https://api.bilibili.com/x/player/wbi/playurl', {
      credentials: 'include',
      searchParams: params as Record<string, string | number>,
    })
    .json()
  return data.data.durl[0].url
}
