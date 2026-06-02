import { defineComponent, ref } from 'vue'

import { getVideoInfo } from '../api/index.ts'
import { state, currentIndex, play, playPage } from '../stores/index.ts'
import TrackRow from './TrackRow.tsx'

import style from './Playlist.module.scss'

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default defineComponent(() => {
  const expandedMap = ref<Record<number, boolean>>({})
  const loadingMap = ref<Record<number, boolean>>({})

  async function toggleExpand(si: number) {
    if (expandedMap.value[si]) {
      expandedMap.value = { ...expandedMap.value, [si]: false }
      return
    }
    const song = state.playlist[si]
    if (song.pages.length > 1 && song.pages[0]?.cid === 0) {
      loadingMap.value = { ...loadingMap.value, [si]: true }
      try {
        const info = await getVideoInfo(song.bvid)
        song.title = info.title
        song.artist = info.artist
        song.duration = info.duration
        song.pic = info.pic
        song.pages = info.pages
      } catch (e) {
        console.error('获取视频信息失败:', e)
        loadingMap.value = { ...loadingMap.value, [si]: false }
        return
      }
      loadingMap.value = { ...loadingMap.value, [si]: false }
    }
    expandedMap.value = { ...expandedMap.value, [si]: true }
  }

  return () => {
    let topNum = 0

    return (
      <div class={style.playlist}>
        <div class={style.header}>播放列表</div>
        <div class={style.list}>
          {state.playlist.length === 0 && <div class={style.empty}>暂无内容</div>}
          {state.playlist.map((song, si) => {
            const isSongPlaying = si === currentIndex.value
            const multi = song.pages.length > 1
            const isExpanded = expandedMap.value[si]
            const isLoading = loadingMap.value[si]
            topNum++

            const rows: any[] = []

            if (multi) {
              rows.push(
                <TrackRow
                  mode='folder'
                  title={song.title}
                  duration={fmt(song.duration)}
                  index={topNum}
                  active={isSongPlaying}
                  pageCount={song.pages.length}
                  expanded={isExpanded}
                  loading={isLoading}
                  onClick={() => void toggleExpand(si)}
                />,
              )

              if (isExpanded) {
                for (let pi = 0; pi < song.pages.length; pi++) {
                  const page = song.pages[pi]
                  const isPagePlaying = isSongPlaying && song.currentPageIndex === pi

                  rows.push(
                    <TrackRow
                      mode='leaf'
                      title={page.title}
                      duration={fmt(page.duration)}
                      index={pi + 1}
                      active={isPagePlaying}
                      playing={isPagePlaying}
                      isLoading={state.loading && isPagePlaying}
                      indent
                      onClick={() => void playPage(si, pi)}
                    />,
                  )
                }
              }
            } else {
              const isPlaying = isSongPlaying && song.currentPageIndex === 0

              rows.push(
                <TrackRow
                  mode='leaf'
                  title={song.title}
                  duration={fmt(song.duration)}
                  index={topNum}
                  active={isPlaying}
                  playing={isPlaying}
                  isLoading={state.loading && isPlaying}
                  onClick={() => void play(si)}
                />,
              )
            }

            return rows
          })}
        </div>
      </div>
    )
  }
})
