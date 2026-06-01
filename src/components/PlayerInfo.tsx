import { defineComponent } from 'vue'

import style from './PlayerInfo.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.info}>
      <h2 class={style.title}>午夜旋律</h2>
    </div>
  )
})
