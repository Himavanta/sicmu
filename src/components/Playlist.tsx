import IconChevronDown from '@tabler/icons-vue/dist/esm/icons/IconChevronDown.mjs'
import IconChevronRight from '@tabler/icons-vue/dist/esm/icons/IconChevronRight.mjs'
import { defineComponent, ref } from 'vue'

import { state, play, playPage } from '../state/index.ts'

import style from './Playlist.module.scss'

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default defineComponent(() => {
  const expandedMap = ref<Record<number, boolean>>({})

  function toggleExpand(index: number) {
    expandedMap.value = { ...expandedMap.value, [index]: !expandedMap.value[index] }
  }

  return () => {
    let singleNum = 0

    return (
      <div class={style.playlist}>
        <div class={style.header}>播放列表</div>
        <div class={style.list}>
          {state.playlist.length === 0 && <div class={style.empty}>暂无内容</div>}
          {state.playlist.map((song, si) => {
            const isSongPlaying = si === state.currentIndex
            const multi = song.pages.length > 1
            const isExpanded = expandedMap.value[si]

            const rows: any[] = []

            if (multi) {
              // ── 多P：父级文件夹 ──

              rows.push(
                <div class={style.parent} key={`p-${song.id}`} onClick={() => toggleExpand(si)}>
                  <div class={style.parentArrow}>
                    {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                  </div>
                  <div class={style.parentInfo}>
                    <span class={style.parentTitle}>{song.title}</span>
                    <span class={style.parentMeta}>{song.pages.length} 首</span>
                  </div>
                  <span class={style.parentDuration}>{formatDuration(song.duration)}</span>
                </div>,
              )

              // ── 多P：分P 子级 ──
              if (isExpanded) {
                for (let pi = 0; pi < song.pages.length; pi++) {
                  const page = song.pages[pi]
                  const isPagePlaying = isSongPlaying && song.currentPageIndex === pi

                  rows.push(
                    <div
                      class={[style.child, isPagePlaying && style.childPlaying]
                        .filter(Boolean)
                        .join(' ')}
                      key={`c-${page.cid}`}
                      onClick={() => void playPage(si, pi)}
                    >
                      <div class={style.childIndex}>
                        {isPagePlaying ? (
                          state.loading ? (
                            <span class={style.loadingDot} />
                          ) : (
                            <span class={[style.playingBars, style.playingBarsActive].join(' ')}>
                              <span />
                              <span />
                              <span />
                            </span>
                          )
                        ) : (
                          <span class={style.childNum}>{pi + 1}</span>
                        )}
                      </div>
                      <span
                        class={[style.childTitle, isPagePlaying && style.childTitlePlaying]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {page.title}
                      </span>
                      <span class={style.childDuration}>{formatDuration(page.duration)}</span>
                    </div>,
                  )
                }
              }
            } else {
              // ── 单P：扁平行 ──
              singleNum++
              const isPlaying = isSongPlaying && song.currentPageIndex === 0

              rows.push(
                <div
                  class={[style.single, isPlaying && style.singlePlaying].filter(Boolean).join(' ')}
                  key={`s-${song.id}`}
                  onClick={() => void play(si)}
                >
                  <div class={style.singleIndex}>
                    {isPlaying ? (
                      state.loading ? (
                        <span class={style.loadingDot} />
                      ) : (
                        <span class={[style.playingBars, style.playingBarsActive].join(' ')}>
                          <span />
                          <span />
                          <span />
                        </span>
                      )
                    ) : (
                      <span class={style.singleNum}>{singleNum}</span>
                    )}
                  </div>
                  <div class={style.singleInfo}>
                    <span
                      class={[style.singleTitle, isPlaying && style.singleTitlePlaying]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {song.title}
                    </span>
                  </div>
                  <span class={style.singleDuration}>{formatDuration(song.duration)}</span>
                </div>,
              )
            }

            return rows
          })}
        </div>
      </div>
    )
  }
})
