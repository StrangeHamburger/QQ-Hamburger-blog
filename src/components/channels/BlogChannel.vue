<script setup>
import { blogs } from '../../data/content.js'
</script>

<template>
  <div class="channel">
    <p class="blog-note mono-label">BLOG · 最近更新</p>

    <!-- 空态 -->
    <div v-if="!blogs.length" class="blog-empty">
      <span class="be-mark" aria-hidden="true">◌</span>
      <p class="be-title">还没有文章</p>
      <p class="be-desc">墨水还在路上……<br />第一篇博客正在酝酿。</p>
      <span class="be-line mono-label">BLOG COMING SOON</span>
    </div>

    <template v-else>
      <div class="blog-list">
        <article v-for="(b, i) in blogs" :key="i" class="blog-item">
          <span class="blog-date mono-label">{{ b.date }}</span>
          <div class="blog-main">
            <span class="blog-title">{{ b.title }}</span>
            <span class="blog-excerpt">{{ b.excerpt }}</span>
          </div>
          <span class="blog-tag mono-label">{{ b.tag }}</span>
        </article>
      </div>
      <p class="blog-more mono-label">更多文章施工中……</p>
    </template>
  </div>
</template>

<style scoped>
.blog-note {
  display: block; color: var(--tomato); font-size: 9px;
  padding-bottom: 6px; border-bottom: 1px solid var(--ink-08);
}

/* 空态 */
.blog-empty {
  text-align: center;
  padding: 30px 10px;
  border: 1.5px dashed var(--ink-20);
  border-radius: var(--radius-lg);
  margin-top: 12px;
}
.be-mark {
  display: block;
  font-size: 28px;
  color: var(--mustard);
  animation: be-pulse 2.4s ease-in-out infinite;
}
@keyframes be-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
.be-title {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--ink);
  margin-top: 8px;
}
.be-desc {
  color: var(--ink-50);
  font-size: 12px;
  line-height: 1.8;
  margin-top: 6px;
}
.be-line {
  display: block;
  margin-top: 12px;
  font-size: 8px;
  color: var(--tomato);
  letter-spacing: 0.3em;
}
.blog-list { display: flex; flex-direction: column; margin-top: 6px; }
.blog-item {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 14px 0; border-bottom: 1px solid var(--ink-08);
  transition: transform var(--dur-fast);
}
.blog-item:hover { transform: translateX(3px); }
.blog-date { font-size: 9px; color: var(--ink-50); min-width: 52px; padding-top: 3px; }
.blog-main { flex: 1; display: flex; flex-direction: column; }
.blog-title { font-size: 14px; font-weight: 700; color: var(--ink); }
.blog-excerpt { font-size: 12px; color: var(--ink-70); margin-top: 3px; line-height: 1.5; }
.blog-tag {
  font-size: 7px; color: var(--navy);
  border: 1px solid var(--navy); border-radius: 3px;
  padding: 2px 6px; margin-top: 2px;
}
.blog-more { color: var(--ink-50); font-size: 9px; margin-top: 14px; }
</style>
