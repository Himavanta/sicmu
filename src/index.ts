import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

import App from './app.tsx'
import { queryClient } from './stores/query-client.ts'

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })

const box = document.createElement('div')
app.mount(box)

const TARGET_SELECTOR = '.bili-dyn-home--member>aside.right>section.sticky'

const el = document.querySelector<HTMLElement>(TARGET_SELECTOR)
if (el) {
  el.prepend(box)
} else {
  const observer = new MutationObserver(() => {
    const target = document.querySelector<HTMLElement>(TARGET_SELECTOR)
    if (target) {
      target.prepend(box)
      observer.disconnect()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
