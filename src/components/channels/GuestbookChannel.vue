<script setup>
import { ref, onMounted } from 'vue'

// 留言墙：giscus（GitHub Discussions 驱动，跨设备/访客同步）
// 评论真实存进仓库 Discussions（General 分类），GitHub 账号登录即可留言
const wrap = ref(null)

onMounted(() => {
  const s = document.createElement('script')
  s.src = 'https://giscus.app/client.js'
  s.setAttribute('data-repo', 'StrangeHamburger/QQ-Hamburger-blog')
  s.setAttribute('data-repo-id', 'R_kgDOT1ZR9g')
  s.setAttribute('data-category', 'General')
  s.setAttribute('data-category-id', 'DIC_kwDOT1ZR9s4DDRUK')
  s.setAttribute('data-mapping', 'pathname')   // 按页面路径归组（单页站 = 统一留言区）
  s.setAttribute('data-strict', '0')
  s.setAttribute('data-reactions-enabled', '1')
  s.setAttribute('data-emit-metadata', '0')
  s.setAttribute('data-input-position', 'bottom')
  s.setAttribute('data-theme', 'light')
  s.setAttribute('data-lang', 'zh-CN')
  s.setAttribute('crossorigin', 'anonymous')
  s.async = true
  wrap.value.appendChild(s)
})
</script>

<template>
  <div class="guestbook">
    <p class="gb-intro mono-label">用 GitHub 账号登录即可留言，评论会同步到仓库 Discussions 📮</p>
    <div class="giscus-wrap" ref="wrap"></div>
  </div>
</template>

<style scoped>
.guestbook { display: flex; flex-direction: column; gap: 14px; }
.gb-intro { font-size: 11px; color: var(--ink-50); text-align: center; }
.giscus-wrap {
  background: var(--cream);
  border: 1.5px solid var(--ink-12);
  border-radius: var(--radius);
  padding: 10px;
  min-height: 120px;
}
</style>
