import { createApp } from 'vue'
import type { App as VueApp } from 'vue'

import CardPlayer from './card/index.vue'
import PagePlayer from './page/index.vue'

if (location.href === 'https://t.bilibili.com/sicmu') {
  const app = createApp(PagePlayer)
  const container = useApp(app)

  document.body.append(container)
} else {
  const app = createApp(CardPlayer)
  const container = useApp(app)

  mount('.bili-dyn-home--member>aside.right>section.sticky', container)
}

function useApp(app: VueApp<Element>) {
  const box = document.createElement('div')
  app.mount(box)
  return box
}

function mount(selector: string, el: Node) {
  const observer = new MutationObserver(() => {
    const target = document.querySelector<HTMLElement>(selector)
    if (target) {
      target.append(el)
      observer.disconnect()
    }
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}
