import { defineComponent, ref } from 'vue'

import PlayerArtwork from './PlayerArtwork.tsx'
import PlayerControls from './PlayerControls.tsx'
import PlayerInfo from './PlayerInfo.tsx'
import PlayerProgress from './PlayerProgress.tsx'
import PlayerVolume from './PlayerVolume.tsx'
import Playlist from './Playlist.tsx'

import style from './FloatingShell.module.scss'

export default defineComponent(() => {
  const showPlaylist = ref(false)
  const togglePlaylist = () => {
    showPlaylist.value = !showPlaylist.value
  }

  return () => (
    <div class={[style.shell, showPlaylist.value && style.shellExpanded].filter(Boolean).join(' ')}>
      <div class={style.player}>
        <PlayerArtwork />
        <div class={style.body}>
          <PlayerInfo />
          <PlayerProgress />
          <div class={style.actions}>
            <PlayerControls showPlaylist={showPlaylist.value} onTogglePlaylist={togglePlaylist} />
            <PlayerVolume />
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
