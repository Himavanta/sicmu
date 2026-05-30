import { defineComponent } from 'vue'

import style from './app.module.scss'

export default defineComponent(() => {
  return () => (
    <div class={style.App} style='position:fixed; top:0; left:0; background:red; '>
      test
    </div>
  )
})
