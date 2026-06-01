import { defineComponent } from 'vue'

import style from './PlayerProgress.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.progress}>
      <div class={style.track}>
        <div class={style.fill} style={{ width: '35%' }} />
        <div class={style.thumb} />
      </div>
      <div class={style.timeRow}>
        <span class={style.time}>1:23</span>
        <span class={style.time}>3:45</span>
      </div>
    </div>
  )
})
