import { defineComponent } from 'vue'

import style from './index.module.scss'

export default defineComponent(() => {
  return () => <div class={style.component}>PlayerPage</div>
})
