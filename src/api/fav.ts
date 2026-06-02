import { biliApi } from './ky-config.ts'

export interface FavFolder {
  id: number
  title: string
  cover: string
  mediaCount: number
  upperName?: string
}

export async function getCreatedFavFolders(upMid: number): Promise<FavFolder[]> {
  const data: any = await biliApi
    .get('https://api.bilibili.com/x/v3/fav/folder/created/list-all', {
      searchParams: { up_mid: upMid },
    })
    .json()
  if (!data.data?.list) return []
  return data.data.list.map((f: any) => ({
    id: f.id,
    title: f.title,
    cover: '',
    mediaCount: f.media_count,
  }))
}

export interface FavResource {
  bvid: string
  title: string
  duration: number
  pageCount: number
  upperName: string
}

export async function getFavResources(mediaId: number): Promise<FavResource[]> {
  const data: any = await biliApi
    .get('https://api.bilibili.com/x/v3/fav/resource/list', {
      searchParams: { media_id: mediaId, ps: 20, pn: 1, platform: 'web' },
    })
    .json()
  if (!data.data?.medias) return []
  return data.data.medias
    .filter((m: any) => m.type === 2)
    .map((m: any) => ({
      bvid: m.bvid ?? m.bv_id,
      title: m.title,
      duration: m.duration,
      pageCount: m.page ?? 1,
      upperName: m.upper?.name ?? '',
    }))
}

export async function getCollectedFavFolders(upMid: number): Promise<FavFolder[]> {
  const data: any = await biliApi
    .get('https://api.bilibili.com/x/v3/fav/folder/collected/list', {
      searchParams: { up_mid: upMid, ps: 50, pn: 1, platform: 'web' },
    })
    .json()
  if (!data.data?.list) {
    console.debug('getCollectedFavFolders response:', data)
    return []
  }
  return data.data.list.map((f: any) => ({
    id: f.id,
    title: f.title,
    cover: f.cover ?? '',
    mediaCount: f.media_count,
    upperName: f.upper?.name,
  }))
}
