import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import type { App as VueApp } from 'vue'

import CardPlayer from './card/index.vue'
import PagePlayer from './page/index.vue'
import router from './page/router.ts'
import { queryClient } from './stores/query-client.ts'

if (location.href === 'https://t.bilibili.com/sicmu') {
  const app = createApp(PagePlayer)
  app.use(router)
  const container = useApp(app)

  document.body.append(container)
} else {
  const app = createApp(CardPlayer)
  const container = useApp(app)

  const TARGET_SELECTOR = '.bili-dyn-home--member>aside.right>section.sticky'

  const el = document.querySelector<HTMLElement>(TARGET_SELECTOR)
  if (el) {
    el.prepend(container)
  } else {
    const observer = new MutationObserver(() => {
      const target = document.querySelector<HTMLElement>(TARGET_SELECTOR)
      if (target) {
        target.prepend(container)
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
}

function useApp(app: VueApp<Element>) {
  app.use(VueQueryPlugin, { queryClient })
  const box = document.createElement('div')
  app.mount(box)
  return box
}
