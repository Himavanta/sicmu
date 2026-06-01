import { defineComponent } from 'vue'

import style from './PlayerControls.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.controls}>
      <button class={style.btn} aria-label='上一首'>
        <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
          <path d='M6 6h2v12H6zm3.5 6l8.5 6V6z' />
        </svg>
      </button>
      <button class={[style.btn, style.playBtn].join(' ')} aria-label='播放'>
        <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'>
          <path d='M8 5v14l11-7z' />
        </svg>
      </button>
      <button class={style.btn} aria-label='下一首'>
        <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
          <path d='M16 6h-2v12h2zm-3.5 6l-8.5 6V6z' />
        </svg>
      </button>
    </div>
  )
})
