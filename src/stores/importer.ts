import { getFavResources, getSeasonResources } from '../api/index.ts'
import type { FavFolder, FavResource } from '../api/index.ts'
import { play } from './player.ts'
import { state } from './state.ts'
import type { Song } from './types.ts'

/* ══════════════════════════════════════════
   收藏夹 / 订阅导入：首页到达即替换歌单并开播，
   后续页逐页后台追加，无需等待全部拉完
   ══════════════════════════════════════════ */

let seq = 0

export async function importFolder(folder: FavFolder) {
  // 期间再次发起导入时，旧任务的结果一律丢弃（以最新一次为准）
  const token = ++seq
  const isSeason = folder.type === 21 && !!folder.ownerMid

  state.importing = true
  let firstPage = true
  try {
    for (let page = 1; ; page++) {
      const result = isSeason
        ? await getSeasonResources(folder.id, folder.ownerMid!, page)
        : await getFavResources(folder.id, page)
      if (token !== seq) return

      // 空页即停止（防御空页导致的死循环）
      if (result.items.length === 0) break

      const songs = toSongs(result.items)
      if (firstPage) {
        state.playlist.splice(0, state.playlist.length, ...songs)
        void play(0)
        firstPage = false
      } else {
        state.playlist.push(...songs)
      }

      if (!result.hasMore) break
    }
  } catch (e) {
    console.error('导入失败:', e)
  } finally {
    if (token === seq) state.importing = false
  }
}

function toSongs(items: FavResource[]): Song[] {
  return items.map((r) => {
    const pages =
      r.pageCount > 1
        ? Array.from({ length: r.pageCount }, () => ({
            cid: 0,
            title: '加载中…',
            duration: 0,
          }))
        : []
    return {
      bvid: r.bvid,
      title: r.title,
      artist: r.upperName,
      duration: r.duration,
      pic: '',
      cid: 0,
      pages,
      currentPageIndex: 0,
      metaLoaded: false,
    }
  })
}
