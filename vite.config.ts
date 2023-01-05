import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgicon from 'vite-plugin-svgicon'
import postcss from "./postcss.config.js"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), svgicon({
    include: ['**/assets/svgs/*.svg']
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss,
  },
  server: {
    port: 3000
  }
})
