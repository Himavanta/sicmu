import { defineComponent } from 'vue'

import { state, currentSong } from '../state/index.ts'

import style from './PlayerArtwork.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.artwork}>
      {currentSong.value.pic ? (
        <>
          <img
            class={[style.coverImg, state.playing && style.coverImgPlaying]
              .filter(Boolean)
              .join(' ')}
            src={currentSong.value.pic}
            alt={currentSong.value.title}
            referrerpolicy='no-referrer'
          />
          <div
            class={[style.overlay, state.playing && style.overlayPlaying].filter(Boolean).join(' ')}
          />
        </>
      ) : (
        <div class={style.gradient} />
      )}
    </div>
  )
})
