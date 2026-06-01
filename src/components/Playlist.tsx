import { defineComponent } from 'vue'

import { state, play } from '../state.ts'

import style from './Playlist.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.playlist}>
      <div class={style.header}>播放列表</div>
      <div class={style.list}>
        {state.playlist.map((song, i) => {
          const isPlaying = i === state.currentIndex
          return (
            <div
              class={[style.item, isPlaying && style.itemPlaying].filter(Boolean).join(' ')}
              key={song.id}
              onClick={() => play(i)}
            >
              <div class={style.itemIndex}>
                {isPlaying ? (
                  <svg viewBox='0 0 24 24' width='10' height='10' fill='currentColor'>
                    <path d='M8 5v14l11-7z' />
                  </svg>
                ) : (
                  <span class={style.indexNum}>{i + 1}</span>
                )}
              </div>
              <div class={style.itemInfo}>
                <span
                  class={[style.itemTitle, isPlaying && style.itemTitlePlaying]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {song.title}
                </span>
                <span class={style.itemArtist}>{song.artist}</span>
              </div>
              <span class={style.itemDuration}>{formatDuration(song.duration)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
