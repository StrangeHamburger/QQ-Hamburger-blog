import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',   // 自定义域名部署（qqhamburger.top 根路径）
  server: {
    host: true,
    port: 5173,
    strictPort: false
  }
})
