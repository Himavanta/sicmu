import { defineComponent } from 'vue'

import { state, currentSong } from '../stores/index.ts'

import style from './PlayerArtwork.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.artwork}>
      {currentSong.value?.pic ? (
        <>
          <img
            class={[style.coverImg, state.playing && !state.loading && style.coverImgPlaying]
              .filter(Boolean)
              .join(' ')}
            src={currentSong.value.pic}
            alt={currentSong.value.title}
            referrerpolicy='origin'
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
