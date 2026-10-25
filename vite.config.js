import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',   // 自定义域名部署（qqhamburger.top 根路径）
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    watch: {
      // Windows 下系统文件通知偶发丢失导致监听僵死（改动不生效），
      // 改用轮询：稳定可靠，代价是少量后台 CPU
      usePolling: true,
      interval: 300
    }
  }
})
