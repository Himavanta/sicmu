import { defineComponent } from 'vue'

import { createStyle } from './style.ts'

import style from './app.module.scss'
import styleText from './app.module.scss?inline'

createStyle(styleText)

export default defineComponent(() => {
  return () => <div class={style.App}>test</div>
})
