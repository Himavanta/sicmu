import { defineComponent, ref } from 'vue'

import PlayerArtwork from './PlayerArtwork.tsx'
import PlayerControls from './PlayerControls.tsx'
import PlayerInfo from './PlayerInfo.tsx'
import PlayerProgress from './PlayerProgress.tsx'
import Playlist from './Playlist.tsx'

import style from './FloatingShell.module.scss'

export default defineComponent(() => {
  const showPlaylist = ref(false)
  const togglePlaylist = () => {
    showPlaylist.value = !showPlaylist.value
  }

  return () => (
    <div class={[style.shell, showPlaylist.value && style.shellExpanded].filter(Boolean).join(' ')}>
      <div class={style.banner}>
        <PlayerArtwork />
        <div class={style.overlay}>
          <PlayerInfo />
          <div class={style.midRow}>
            <PlayerControls showPlaylist={showPlaylist.value} onTogglePlaylist={togglePlaylist} />
            <PlayerProgress />
          </div>
          <div class={style.progTrack}>
            <div class={style.progFill} style={{ width: '35%' }} />
            <div class={style.progThumb} />
          </div>
        </div>
      </div>

      <div
        class={[style.playlistWrap, showPlaylist.value && style.playlistOpen]
          .filter(Boolean)
          .join(' ')}
      >
        <Playlist />
      </div>
    </div>
  )
})
