import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import style from './index.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.component}>
      <RouterView />
      <span>PlayerPage</span>
    </div>
  )
})
