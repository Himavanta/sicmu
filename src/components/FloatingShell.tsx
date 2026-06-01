import { useDraggable } from '@vueuse/core'
import { defineComponent, ref } from 'vue'

import PlayerArtwork from './PlayerArtwork.tsx'
import PlayerControls from './PlayerControls.tsx'
import PlayerInfo from './PlayerInfo.tsx'
import PlayerProgress from './PlayerProgress.tsx'
import PlayerVolume from './PlayerVolume.tsx'
import Playlist from './Playlist.tsx'

import style from './FloatingShell.module.scss'

export default defineComponent(() => {
  const shellRef = ref<HTMLElement | null>(null)
  const showPlaylist = ref(false)
  const togglePlaylist = () => {
    showPlaylist.value = !showPlaylist.value
  }

  const { style: dragStyle } = useDraggable(shellRef, {
    initialValue: { x: window.innerWidth - 300, y: window.innerHeight - 300 },
    restrictInView: true,
    containerElement: document.documentElement,
  })

  return () => (
    <div
      ref={shellRef}
      style={dragStyle.value}
      class={[style.shell, showPlaylist.value && style.shellExpanded].filter(Boolean).join(' ')}
    >
      <div class={style.player}>
        <PlayerArtwork />
        <div class={style.overlay}>
          <PlayerInfo />
          <PlayerProgress />
          <PlayerControls showPlaylist={showPlaylist.value} onTogglePlaylist={togglePlaylist} />
          <PlayerVolume />
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
