import { defineComponent } from 'vue'

import style from './Playlist.module.scss'

const songs = [
  { id: 1, title: '午夜旋律', artist: 'Sicmu', duration: '3:45', playing: true },
  { id: 2, title: '城市之光', artist: 'Sicmu', duration: '4:12', playing: false },
  { id: 3, title: '星河', artist: 'Sicmu', duration: '3:28', playing: false },
  { id: 4, title: '雨后', artist: 'Sicmu', duration: '5:01', playing: false },
  { id: 5, title: '晨曦', artist: 'Sicmu', duration: '3:55', playing: false },
]

export default defineComponent(() => {
  return () => (
    <div class={style.playlist}>
      <div class={style.header}>播放列表</div>
      <div class={style.list}>
        {songs.map((song) => (
          <div
            class={[style.item, song.playing && style.itemPlaying].filter(Boolean).join(' ')}
            key={song.id}
          >
            <div class={style.itemIndex}>
              {song.playing ? (
                <svg viewBox='0 0 24 24' width='10' height='10' fill='currentColor'>
                  <path d='M8 5v14l11-7z' />
                </svg>
              ) : (
                <span class={style.indexNum}>{song.id}</span>
              )}
            </div>
            <div class={style.itemInfo}>
              <span
                class={[style.itemTitle, song.playing && style.itemTitlePlaying]
                  .filter(Boolean)
                  .join(' ')}
              >
                {song.title}
              </span>
              <span class={style.itemArtist}>{song.artist}</span>
            </div>
            <span class={style.itemDuration}>{song.duration}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
