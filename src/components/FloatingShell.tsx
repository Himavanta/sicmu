import { useDraggable } from '@vueuse/core'
import { defineComponent, ref } from 'vue'

import style from './FloatingShell.module.scss'

export default defineComponent({
  setup() {
    const shellRef = ref<HTMLElement | null>(null)
    const { style: dragStyle, isDragging } = useDraggable(shellRef, {
      initialValue: { x: window.innerWidth - 400, y: window.innerHeight - 300 },
      restrictInView: true,
    })

    return () => (
      <div
        ref={shellRef}
        style={dragStyle.value}
        class={[style.shell, isDragging.value && style.dragging].filter(Boolean)}
      >
        <div class={style.header}>
          <span class={style.title}>Sicmu</span>
        </div>
        <div class={style.content}>
          <p class={style.placeholder}>播放器内容区域</p>
        </div>
      </div>
    )
  },
})
