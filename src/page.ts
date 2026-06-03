import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

import App from './page/index.tsx'
import { queryClient } from './stores/query-client.ts'

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })

const box = document.createElement('div')
app.mount(box)

document.body.append(box)
