import { createApp } from 'vue'

import app from './app.tsx'

const box = document.createElement('div')
createApp(app).mount(box)

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
