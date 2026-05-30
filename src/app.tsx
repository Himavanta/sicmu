import { defineComponent } from 'vue'

import { useStyle } from './style.ts'

import styleTextScss from './app.scss?inline'

export default defineComponent(() => {
  useStyle(styleTextScss)
  return () => <div class='sicmu-app'>test</div>
})
