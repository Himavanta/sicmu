import { defineComponent } from 'vue'

import style from './PlayerProgress.module.scss'

export default defineComponent(() => {
  return () => <span class={style.time}>1:23 / 3:10</span>
})
