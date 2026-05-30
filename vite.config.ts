import { defineConfig } from 'vite-plus'

export default defineConfig({
  oxc: { jsx: { importSource: 'vue' } },
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    dts: true,
    exports: true,
    platform: 'neutral',
    minify: true,
    css: {
      minify: true,
      // splitting: true,
      inject: true,
    },
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
