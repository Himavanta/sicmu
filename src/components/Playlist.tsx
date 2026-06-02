import { defineComponent } from 'vue'

import { getFlatPlaylist, getCurrentFlatIndex, playPage } from '../state/index.ts'

import style from './Playlist.module.scss'

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default defineComponent(() => {
  return () => {
    const flat = getFlatPlaylist()
    const currentFlat = getCurrentFlatIndex()

    return (
      <div class={style.playlist}>
        <div class={style.header}>
          播放列表
          <span class={style.headerCount}>{flat.length} 首</span>
        </div>
        <div class={style.list}>
          {flat.length === 0 && <div class={style.empty}>暂无内容，点击歌曲播放</div>}
          {flat.map((track, fi) => {
            const isCurrent = fi === currentFlat
            return (
              <div
                class={[style.item, isCurrent && style.itemPlaying].filter(Boolean).join(' ')}
                key={`${track.songIndex}-${track.pageIndex}`}
                onClick={() => void playPage(track.songIndex, track.pageIndex)}
              >
                <div class={style.itemIndex}>
                  {isCurrent ? (
                    <svg viewBox='0 0 24 24' width='10' height='10' fill='currentColor'>
                      <path d='M8 5v14l11-7z' />
                    </svg>
                  ) : (
                    <span class={style.indexNum}>{fi + 1}</span>
                  )}
                </div>
                <div class={style.itemInfo}>
                  <span
                    class={[style.itemTitle, isCurrent && style.itemTitlePlaying]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {track.title}
                  </span>
                </div>
                <span class={style.itemDuration}>{formatDuration(track.duration)}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
