import IconFolderOpen from '@tabler/icons-vue/dist/esm/icons/IconFolderOpen.mjs'
import IconPlayerPause from '@tabler/icons-vue/dist/esm/icons/IconPlayerPause.mjs'
import IconPlayerPlay from '@tabler/icons-vue/dist/esm/icons/IconPlayerPlay.mjs'
import IconPlayerSkipBack from '@tabler/icons-vue/dist/esm/icons/IconPlayerSkipBack.mjs'
import IconPlayerSkipForward from '@tabler/icons-vue/dist/esm/icons/IconPlayerSkipForward.mjs'
import IconPlaylist from '@tabler/icons-vue/dist/esm/icons/IconPlaylist.mjs'
import { defineComponent, type PropType } from 'vue'

import { state, togglePlay, prev, next } from '../stores/index.ts'

import style from './PlayerControls.module.scss'

export default defineComponent(
  (props) => {
    return () => (
      <div class={style.controls}>
        <button class={style.btn} aria-label='上一首' onClick={prev}>
          <IconPlayerSkipBack size={14} />
        </button>

        <button
          class={[style.btn, style.playBtn].join(' ')}
          aria-label={state.playing ? '暂停' : '播放'}
          onClick={togglePlay}
        >
          {state.loading ? (
            <span class={style.loadingDot} />
          ) : state.playing ? (
            <IconPlayerPause size={15} />
          ) : (
            <IconPlayerPlay size={16} />
          )}
        </button>

        <button class={style.btn} aria-label='下一首' onClick={next}>
          <IconPlayerSkipForward size={14} />
        </button>

        <button class={style.btn} aria-label='添加来源' onClick={() => props.onOpenDialog?.()}>
          <IconFolderOpen size={14} />
        </button>

        <button
          class={[style.btn, props.showPlaylist && style.btnActive].filter(Boolean).join(' ')}
          aria-label='播放列表'
          onClick={() => props.onTogglePlaylist?.()}
        >
          <IconPlaylist size={14} />
        </button>
      </div>
    )
  },
  {
    props: {
      showPlaylist: { type: Boolean, required: true },
      onTogglePlaylist: { type: Function as PropType<() => void>, required: true },
      onOpenDialog: { type: Function as PropType<() => void>, required: true },
    },
  },
)
