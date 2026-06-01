import { defineComponent } from 'vue'

import style from './PlayerArtwork.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.artwork}>
      <div class={style.gradient} />
    </div>
  )
})
