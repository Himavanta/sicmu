import { defineConfig } from 'vite-plus'

export default defineConfig({
  oxc: { jsx: { importSource: 'vue' } },
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    dts: false,
    exports: true,
    platform: 'browser',
    minify: true,
    format: 'iife',
    css: { minify: true },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    semi: false,
    sortImports: {},
    singleQuote: true,
    jsxSingleQuote: true,
  },
})
