import { biliApi } from './ky-config.ts'

export interface FavFolder {
  id: number
  title: string
  cover: string
  mediaCount: number
  upperName?: string
  type?: number
  ownerMid?: number
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
    type: f.type,
    ownerMid: f.mid,
  }))
}

export interface FavResource {
  bvid: string
  title: string
  duration: number
  pageCount: number
  upperName: string
}

export interface FavResourceList {
  items: FavResource[]
  hasMore: boolean
}

export async function getFavResources(
  mediaId: number,
  page = 1,
  pageSize = 20,
): Promise<FavResourceList> {
  const data: any = await biliApi
    .get('https://api.bilibili.com/x/v3/fav/resource/list', {
      searchParams: { media_id: mediaId, ps: pageSize, pn: page },
    })
    .json()
  if (!data.data?.medias) return { items: [], hasMore: false }
  return {
    items: data.data.medias
      .filter((m: any) => m.type === 2)
      .map((m: any) => ({
        bvid: m.bvid ?? m.bv_id,
        title: m.title,
        duration: m.duration,
        pageCount: m.page ?? 1,
        upperName: m.upper?.name ?? '',
      })),
    hasMore: !!data.data.has_more,
  }
}

export async function getSeasonResources(
  seasonId: number,
  mid: number,
  page = 1,
  pageSize = 100,
): Promise<FavResourceList> {
  const data: any = await biliApi
    .get('https://api.bilibili.com/x/polymer/web-space/seasons_archives_list', {
      searchParams: {
        mid,
        season_id: seasonId,
        sort_reverse: false,
        page_size: pageSize,
        page_num: page,
        web_location: '333.1387',
      },
    })
    .json()
  if (!data.data?.archives) return { items: [], hasMore: false }
  const pageInfo = data.data.page
  return {
    items: data.data.archives.map((a: any) => ({
      bvid: a.bvid,
      title: a.title,
      duration: a.duration,
      pageCount: 1,
      upperName: '',
    })),
    // 该接口无 has_more 字段，翻页依据是 data.page；单页上限实测为 100，超过报 -400
    hasMore: pageInfo ? pageInfo.page_num * pageInfo.page_size < pageInfo.total : false,
  }
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
    type: f.type,
    ownerMid: f.mid,
  }))
}
