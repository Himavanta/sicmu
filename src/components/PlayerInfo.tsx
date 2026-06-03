import { defineComponent } from 'vue'

import style from './PlayerInfo.module.scss'

export default defineComponent(
  (props) => {
    return () => (
      <div class={style.info}>
        <h2 class={style.title}>{props.title}</h2>
      </div>
    )
  },
  {
    props: {
      title: { type: String, required: true },
    },
  },
)
