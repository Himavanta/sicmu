import { defineComponent } from 'vue'

import style from './PlayingIndicator.module.scss'

export default defineComponent(
  (props: { playing: boolean; loading: boolean; index: number }) => {
    return () => (
      <span class={style.box}>
        {props.loading ? (
          <span class={style.dot} />
        ) : props.playing ? (
          <span class={style.bars}>
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span class={style.num}>{props.index}</span>
        )}
      </span>
    )
  },
  {
    props: {
      playing: { type: Boolean, required: true },
      loading: { type: Boolean, required: true },
      index: { type: Number, required: true },
    },
  },
)
