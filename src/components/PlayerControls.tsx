import { defineComponent, type PropType } from 'vue'

import { state, togglePlay, prev, next } from '../state/index.ts'

import style from './PlayerControls.module.scss'

export default defineComponent(
  (props: { showPlaylist: boolean; onTogglePlaylist: () => void }) => {
    return () => (
      <div class={style.controls}>
        <button class={style.btn} aria-label='上一首' onClick={prev}>
          <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
            <path d='M6 6h2v12H6zm3.5 6l8.5 6V6z' />
          </svg>
        </button>

        <button
          class={[style.btn, style.playBtn].join(' ')}
          aria-label={state.playing ? '暂停' : '播放'}
          onClick={togglePlay}
        >
          {state.playing ? (
            <svg viewBox='0 0 24 24' width='18' height='18' fill='currentColor'>
              <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
            </svg>
          ) : (
            <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'>
              <path d='M8 5v14l11-7z' />
            </svg>
          )}
        </button>

        <button class={style.btn} aria-label='下一首' onClick={next}>
          <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
            <path d='M16 6h-2v12h2zm-3.5 6l-8.5 6V6z' />
          </svg>
        </button>

        <button
          class={[style.btn, props.showPlaylist && style.btnActive].filter(Boolean).join(' ')}
          aria-label='播放列表'
          onClick={() => props.onTogglePlaylist?.()}
        >
          <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
            <path d='M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2z' />
          </svg>
        </button>
      </div>
    )
  },
  {
    props: {
      showPlaylist: { type: Boolean, required: true },
      onTogglePlaylist: { type: Function as PropType<() => void>, required: true },
    },
  },
)
