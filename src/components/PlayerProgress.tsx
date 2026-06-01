import { defineComponent } from 'vue'

import { state, duration, formatTime } from '../state.ts'

import style from './PlayerProgress.module.scss'

export default defineComponent(() => {
  return () => (
    <span class={style.time}>
      {formatTime(state.currentTime)} / {formatTime(duration.value)}
    </span>
  )
})
