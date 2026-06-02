import {
  IconPlayerSkipBack,
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlaylist,
} from '@tabler/icons-vue'
import { defineComponent, type PropType } from 'vue'

import { state, togglePlay, prev, next } from '../state/index.ts'

import style from './PlayerControls.module.scss'

export default defineComponent(
  (props: { showPlaylist: boolean; onTogglePlaylist: () => void }) => {
    return () => (
      <div class={style.controls}>
        <button class={style.btn} aria-label='上一首' onClick={prev}>
          <IconPlayerSkipBack size={16} />
        </button>

        <button
          class={[style.btn, style.playBtn].join(' ')}
          aria-label={state.playing ? '暂停' : '播放'}
          onClick={togglePlay}
        >
          {state.playing ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={20} />}
        </button>

        <button class={style.btn} aria-label='下一首' onClick={next}>
          <IconPlayerSkipForward size={16} />
        </button>

        <button
          class={[style.btn, props.showPlaylist && style.btnActive].filter(Boolean).join(' ')}
          aria-label='播放列表'
          onClick={() => props.onTogglePlaylist?.()}
        >
          <IconPlaylist size={16} />
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
