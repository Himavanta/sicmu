import { defineComponent } from 'vue'

import { currentSong } from '../state/index.ts'

import style from './PlayerArtwork.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.artwork}>
      {currentSong.value.pic ? (
        <img
          class={style.coverImg}
          src={currentSong.value.pic}
          alt={currentSong.value.title}
          referrerpolicy='no-referrer'
        />
      ) : (
        <div class={style.gradient} />
      )}
    </div>
  )
})
