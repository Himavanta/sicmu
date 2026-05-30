import { onUnmounted } from 'vue'

export function useStyle(textContent: string) {
  const style = Object.assign(document.createElement('style'), {
    textContent,
  })

  document.head.appendChild(style)

  onUnmounted(() => style.remove())
}
