import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite-plus'

const OUT_DIR = 'dist'

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: 'false',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  oxc: { jsx: { importSource: 'vue' } },
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    dts: false,
    platform: 'browser',
    minify: true,
    format: 'iife',
    css: { minify: true },
    inputOptions: {
      onLog(level, log) {
        if (log.code === 'INVALID_ANNOTATION') return
      },
    },
    hooks: {
      'build:done': async () => {
        const cssPath = resolve(OUT_DIR, 'style.css')
        const jsPath = resolve(OUT_DIR, 'index.iife.js')

        if (!existsSync(cssPath) || !existsSync(jsPath)) return

        const css = readFileSync(cssPath, 'utf-8')
        let js = readFileSync(jsPath, 'utf-8')

        const injectCode = `document.head.appendChild(Object.assign(document.createElement('style'),{textContent:${JSON.stringify(css)}}));`

        writeFileSync(jsPath, js + injectCode, 'utf-8')
        unlinkSync(cssPath)
      },
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
