import ky from 'ky'

export interface FavFolder {
  id: number
  title: string
  cover: string
  mediaCount: number
  upperName?: string
}

export async function getCreatedFavFolders(upMid: number): Promise<FavFolder[]> {
  const data: any = await ky
    .get('https://api.bilibili.com/x/v3/fav/folder/created/list-all', {
      credentials: 'include',
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

export async function getCollectedFavFolders(upMid: number): Promise<FavFolder[]> {
  const data: any = await ky
    .get('https://api.bilibili.com/x/v3/fav/folder/collected/list', {
      credentials: 'include',
      searchParams: { up_mid: upMid, ps: 50, pn: 1 },
    })
    .json()
  if (!data.data?.list) return []
  return data.data.list.map((f: any) => ({
    id: f.id,
    title: f.title,
    cover: f.cover ?? '',
    mediaCount: f.media_count,
    upperName: f.upper?.name,
  }))
}
