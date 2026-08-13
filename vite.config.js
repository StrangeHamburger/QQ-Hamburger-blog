import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/QQ-Hamburger-blog/',   // GitHub Pages 子路径部署（绑自定义域名后改回 '/'）
  server: {
    host: true,
    port: 5173,
    strictPort: false
  }
})
