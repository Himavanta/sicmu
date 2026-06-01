import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

import { state, currentSong, duration } from '../state.ts'
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

  const progRef = ref<HTMLElement | null>(null)
  const isSeeking = ref(false)

  function calcTime(e: MouseEvent): number {
    if (!progRef.value || duration.value === 0) return 0
    const rect = progRef.value.getBoundingClientRect()
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1))
    return ratio * duration.value
  }

  function handleSeekStart(e: MouseEvent) {
    isSeeking.value = true
    const t = calcTime(e)
    state.currentTime = t
    // 同步到 audio 元素
    const audio = document.querySelector('audio')
    if (audio) audio.currentTime = t
  }

  function handleSeekMove(e: MouseEvent) {
    if (!isSeeking.value) return
    const t = calcTime(e)
    state.currentTime = t
  }

  function handleSeekEnd(e: MouseEvent) {
    if (!isSeeking.value) return
    isSeeking.value = false
    const t = calcTime(e)
    state.currentTime = t
    const audio = document.querySelector('audio')
    if (audio) audio.currentTime = t
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleSeekMove)
    document.addEventListener('mouseup', handleSeekEnd)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleSeekMove)
    document.removeEventListener('mouseup', handleSeekEnd)
  })

  return () => {
    const pct = duration.value > 0 ? (state.currentTime / duration.value) * 100 : 0

    return (
      <div
        class={[style.shell, showPlaylist.value && style.shellExpanded].filter(Boolean).join(' ')}
      >
        <div class={style.banner}>
          <PlayerArtwork />
          <div class={style.overlay}>
            <PlayerInfo title={currentSong.value.title} />
            <div ref={progRef} class={style.progTrack} onMousedown={handleSeekStart}>
              <div class={style.progFill} style={{ width: `${pct}%` }} />
              <div class={style.progThumb} style={{ left: `${pct}%` }} />
            </div>
            <div class={style.midRow}>
              <PlayerControls showPlaylist={showPlaylist.value} onTogglePlaylist={togglePlaylist} />
              <PlayerProgress />
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
  }
})
