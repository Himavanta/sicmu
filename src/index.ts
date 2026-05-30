import { createApp } from 'vue'

import app from './app.tsx'

const box = document.createElement('div')
document.body.append(box)
createApp(app).mount(box)
