import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

import App from './app.tsx'

const app = createApp(App)
app.use(VueQueryPlugin)
app.mount('#app')
