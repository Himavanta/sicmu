import { useTitle } from '@vueuse/core'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import style from './index.module.scss'

export default defineComponent(() => {
  useTitle('hhh')
  return () => (
    <div class={style.component}>
      <span>PlayerPage</span>
      <RouterView />
    </div>
  )
})
