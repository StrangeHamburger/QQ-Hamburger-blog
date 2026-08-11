<script setup>
import { github } from '../../data/content.js'

// GitHub 语言颜色（GitHub 官方风格）
const LANG_COLORS = {
  Go: '#00ADD8',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Vue: '#41b883',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051'
}
function langColor(lang) {
  return LANG_COLORS[lang] || '#8b949e'
}
</script>

<template>
  <div class="channel gh-panel">
    <!-- ======== 用户卡（meowj 式） ======== -->
    <div class="gh-user">
      <img :src="github.avatar" :alt="github.username" class="gh-avatar" />
      <div class="gh-user-info">
        <span class="gh-username">{{ github.username }}</span>
        <span v-if="github.bio" class="gh-bio">{{ github.bio }}</span>
        <span v-if="github.location" class="gh-loc mono-label">📍 {{ github.location }}</span>
        <span class="gh-stats mono-label">
          {{ github.followers }} 关注者 · {{ github.following }} 关注中 · {{ github.publicRepos }} 仓库
        </span>
      </div>
      <a class="gh-go" :href="github.url" target="_blank" rel="noopener">
        跳转 GitHub 主页 <span aria-hidden="true">↗</span>
      </a>
    </div>

    <!-- ======== 仓库列表（meowj 式行） ======== -->
    <div class="gh-repos">
      <a
        v-for="r in github.repos"
        :key="r.name"
        class="gh-repo"
        :href="r.href"
        target="_blank"
        rel="noopener"
      >
        <div class="gh-top">
          <span class="gh-name">{{ r.name }}</span>
          <span class="gh-side mono-label">
            <span class="gh-dot" :style="{ background: langColor(r.lang) }"></span>
            {{ r.lang }} · ★ {{ r.stars }} · {{ r.updatedDays }} 天前更新
          </span>
        </div>
        <span class="gh-desc">{{ r.desc }}</span>
        <span class="gh-open mono-label">查看仓库 <span aria-hidden="true">↗</span></span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.gh-panel { display: flex; flex-direction: column; gap: 14px; }

/* ======== 用户卡 ======== */
.gh-user {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 20px 16px;
  background: var(--paper);
  border: 1.5px solid var(--ink-12);
  border-radius: var(--radius-lg);
  text-align: center;
}
.gh-avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  border: 3px solid var(--cream);
  box-shadow: 0 0 0 2px var(--navy), 0 6px 14px rgba(26,26,24,0.15);
}
.gh-username {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
}
.gh-bio { font-size: 12px; color: var(--ink-70); max-width: 30ch; line-height: 1.6; }
.gh-loc { font-size: 9px; color: var(--ink-50); }
.gh-stats { font-size: 9px; color: var(--ink-50); }

.gh-go {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--cream);
  background: var(--navy);
  border-radius: 999px;
  padding: 8px 18px;
  box-shadow: 0 2px 0 var(--ink-12);
  transition: transform var(--dur-fast) var(--ease-spring), background var(--dur-fast);
}
.gh-go:hover { transform: translateY(-2px); background: var(--tomato); }

/* ======== 仓库列表 ======== */
.gh-repos { display: flex; flex-direction: column; gap: 10px; }

.gh-repo {
  display: flex; flex-direction: column;
  padding: 14px 16px;
  background: var(--cream);
  border: 1.5px solid var(--ink-12);
  border-radius: var(--radius);
  transition: transform var(--dur-fast) var(--ease-spring), border-color var(--dur-fast), box-shadow var(--dur-fast);
}
.gh-repo:hover {
  transform: translateY(-3px);
  border-color: var(--navy);
  box-shadow: var(--shadow-pop);
}

.gh-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.gh-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  font-family: var(--font-mono);
  transition: color var(--dur-fast);
}
.gh-repo:hover .gh-name { color: var(--tomato); }
.gh-side { font-size: 8px; color: var(--ink-50); display: flex; align-items: center; gap: 5px; }
.gh-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }

.gh-desc {
  font-size: 12px;
  color: var(--ink-70);
  margin-top: 6px;
  line-height: 1.6;
}

.gh-open {
  margin-top: 10px;
  align-self: flex-end;
  font-size: 9px;
  color: var(--ink-40);
  transition: color var(--dur-fast);
}
.gh-repo:hover .gh-open { color: var(--tomato); }
</style>
