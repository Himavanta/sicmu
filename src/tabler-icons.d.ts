declare module '@tabler/icons-vue/dist/esm/icons/*.mjs' {
  import type { FunctionalComponent } from 'vue'

  interface TablerIconProps {
    size?: string | number
    color?: string
    stroke?: string | number
    title?: string
    class?: string
  }

  const icon: FunctionalComponent<TablerIconProps>
  export default icon
}
