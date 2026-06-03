import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite-plus'

const OUT_DIR = 'dist'

const { version } = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'))

const metainfo = `// ==UserScript==
// @name         Sicmu
// @version      ${version}
// @description  油猴脚本
// @author       you
// @match        https://t.bilibili.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

`

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
    outputOptions: {
      entryFileNames: 'data.user.js',
    },
    inputOptions: {
      onLog(level, log) {
        if (log.code === 'INVALID_ANNOTATION') return
      },
    },
    hooks: {
      'build:done': async () => {
        const cssPath = resolve(OUT_DIR, 'style.css')
        const jsPath = resolve(OUT_DIR, 'data.user.js')

        if (!existsSync(cssPath) || !existsSync(jsPath)) return

        const css = readFileSync(cssPath, 'utf-8')
        let js = readFileSync(jsPath, 'utf-8')

        const injectCode = `document.head.appendChild(Object.assign(document.createElement('style'),{textContent:${JSON.stringify(css)}}));`

        writeFileSync(jsPath, metainfo + js + injectCode, 'utf-8')
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
