import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig, type PluginOption } from 'vite-plus'

const OUT_DIR = 'dist'

const { version, description } = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'))

const metainfo = `// ==UserScript==
// @name         sicmu
// @namespace    https://github.com/Himavanta/sicmu
// @version      ${version}
// @description  ${description}
// @author       Himavanta
// @match        https://t.bilibili.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://unpkg.com/sicmu/dist/data.user.js
// @downloadURL  https://unpkg.com/sicmu/dist/data.user.js
// ==/UserScript==

`

export default defineConfig({
  plugins: [vue() as PluginOption],
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    fromVite: true,
    dts: false,
    platform: 'browser',
    minify: true,
    format: 'iife',
    sourcemap: false,
    css: { minify: true },
    outputOptions: {
      entryFileNames: 'data.user.js',
    },
    inputOptions: {
      onLog(_, log) {
        if (log.code === 'INVALID_ANNOTATION') return
      },
    },
    hooks: {
      'build:done'() {
        const cssPath = resolve(OUT_DIR, 'style.css')
        const jsPath = resolve(OUT_DIR, 'data.user.js')

        if (!existsSync(cssPath) || !existsSync(jsPath)) return

        const css = readFileSync(cssPath, 'utf-8')
        let js = readFileSync(jsPath, 'utf-8')

        const injectCode = `document.head.appendChild(Object.assign(document.createElement('style'),{textContent:${JSON.stringify(css)}}));`

        writeFileSync(jsPath, metainfo + injectCode + js, 'utf-8')
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
