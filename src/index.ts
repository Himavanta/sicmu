import { createApp } from 'vue'
import type { App as VueApp } from 'vue'

import CardPlayer from './card/index.vue'
import PagePlayer from './page/index.vue'

if (location.href === 'https://t.bilibili.com/sicmu') {
  const app = createApp(PagePlayer)
  const container = useApp(app)

  void mount('body', container)
} else {
  const app = createApp(CardPlayer)
  const container = useApp(app)

  void mount('.bili-dyn-home--member>aside.right>section.sticky', container)
}

function useApp(app: VueApp<Element>) {
  const box = document.createElement('div')
  app.mount(box)
  return box
}

async function mount(selector: string, el: Node) {
  return new Promise((r) => {
    const target = document.querySelector<HTMLElement>(selector)
    if (target) {
      target.prepend(el)
      r(true)
    } else {
      const observer = new MutationObserver(() => {
        const target = document.querySelector<HTMLElement>(selector)
        if (target) {
          target.prepend(el)
          observer.disconnect()
          r(true)
        }
      })
      observer.observe(document.documentElement, { childList: true, subtree: true })
    }
  })
}
