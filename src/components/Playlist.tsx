import { defineComponent, ref } from 'vue'

import { state, currentIndex, play, playPage, ensureMeta } from '../stores/index.ts'
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
    if (song.pages.length > 1 && !song.metaLoaded) {
      loadingMap.value = { ...loadingMap.value, [si]: true }
      const ok = await ensureMeta(song)
      loadingMap.value = { ...loadingMap.value, [si]: false }
      if (!ok) return
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
                  artist={song.artist}
                  duration={fmt(song.duration)}
                  index={topNum}
                  active={isSongPlaying}
                  pageCount={song.pages.length}
                  expanded={isExpanded}
                  loading={isLoading}
                  playing={false}
                  isLoading={false}
                  indent={false}
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
                      artist={song.artist}
                      duration={fmt(page.duration)}
                      index={pi + 1}
                      active={isPagePlaying}
                      playing={isPagePlaying}
                      isLoading={state.loading && isPagePlaying}
                      pageCount={0}
                      expanded={false}
                      loading={false}
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
                  artist={song.artist}
                  duration={fmt(song.duration)}
                  index={topNum}
                  active={isPlaying}
                  playing={isPlaying}
                  isLoading={state.loading && isPlaying}
                  pageCount={0}
                  expanded={false}
                  loading={false}
                  indent={false}
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
