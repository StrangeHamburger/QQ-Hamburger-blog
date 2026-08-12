<script setup>
import { ref, onMounted } from 'vue'
import { github as staticGithub } from '../../data/content.js'
import ProjectModal from '../ProjectModal.vue'

// ============================================================
// GitHub 栏目 · 运行时自动同步
// 打开栏目时调用 GitHub API 拉取最新数据（仓库/stars/关注数）
// API 失败/超时 → 降级显示 content.js 里的静态数据（不会白屏）
// ============================================================

const data = ref(staticGithub)
const syncing = ref(false)

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

function daysAgo(iso) {
  const then = new Date(iso)
  const now = new Date()
  return Math.max(0, Math.floor((now - then) / 86400000))
}

async function sync() {
  const name = data.value.username
  if (!name || syncing.value) return
  syncing.value = true
  try {
    // 8 秒超时，防止国内网络卡死
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)

    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${name}`, { signal: controller.signal }),
      fetch(`https://api.github.com/users/${name}/repos?sort=updated&per_page=10`, { signal: controller.signal })
    ])
    clearTimeout(timer)

    if (!uRes.ok || !rRes.ok) return  // 失败保留静态数据

    const u = await uRes.json()
    const repos = await rRes.json()

    data.value = {
      username: u.login || name,
      avatar: u.avatar_url || data.value.avatar,
      bio: u.bio || '',
      location: u.location || '',
      followers: u.followers ?? 0,
      following: u.following ?? 0,
      publicRepos: u.public_repos ?? 0,
      url: `https://github.com/${u.login || name}`,
      repos: repos.map(r => ({
        name: r.name,
        desc: r.description || '',
        lang: r.language || '',
        stars: r.stargazers_count ?? 0,
        updatedDays: daysAgo(r.updated_at),
        href: r.html_url
      }))
    }
  } catch {
    // 网络失败 → 保持静态数据（content.js）
  } finally {
    syncing.value = false
  }
}

onMounted(sync)

// 仓库详情弹层
const active = ref(null)
function openRepo(r) {
  active.value = {
    name: r.name,
    desc: r.desc,
    meta: (r.lang || '—') + ' · ' + r.stars + ' ★',
    href: r.href,
    detail: {
      intro: r.desc,
      sections: [
        {
          type: 'paras',
          title: '关于这个仓库',
          content: ['这个仓库托管在 GitHub 上，点下方按钮查看完整源码。']
        },
        {
          type: 'chips',
          title: '主要语言',
          content: r.lang ? [r.lang] : []
        }
      ]
    }
  }
}
function closeRepo() { active.value = null }
</script>

<template>
  <div class="channel gh-panel">
    <!-- 同步状态 -->
    <span v-if="syncing" class="gh-syncing mono-label">⟳ 正在同步 GitHub 数据…</span>

    <!-- ======== 用户卡（meowj 式） ======== -->
    <div class="gh-user">
      <img :src="data.avatar" :alt="data.username" class="gh-avatar" />
      <div class="gh-user-info">
        <span class="gh-username">{{ data.username }}</span>
        <span v-if="data.bio" class="gh-bio">{{ data.bio }}</span>
        <span v-if="data.location" class="gh-loc mono-label">📍 {{ data.location }}</span>
        <span class="gh-stats mono-label">
          {{ data.followers }} 关注者 · {{ data.following }} 关注中 · {{ data.publicRepos }} 仓库
        </span>
      </div>
      <a class="gh-go" :href="data.url" target="_blank" rel="noopener">
        跳转 GitHub 主页 <span aria-hidden="true">↗</span>
      </a>
    </div>

    <!-- ======== 仓库列表（自动同步） ======== -->
    <div class="gh-repos">
      <div
        v-for="r in data.repos"
        :key="r.name"
        class="gh-repo"
        role="button"
        :tabindex="0"
        @click="openRepo(r)"
        @keydown.enter="openRepo(r)"
      >
        <div class="gh-top">
          <span class="gh-name">{{ r.name }}</span>
          <span class="gh-side mono-label">
            <span class="gh-dot" :style="{ background: langColor(r.lang) }"></span>
            {{ r.lang || '—' }} · ★ {{ r.stars }} · {{ r.updatedDays }} 天前更新
          </span>
        </div>
        <span class="gh-desc">{{ r.desc || '暂无描述' }}</span>
        <span class="gh-open mono-label">查看详情 <span aria-hidden="true">↗</span></span>
      </div>
      <p v-if="!data.repos.length" class="gh-empty mono-label">暂无公开仓库</p>
    </div>

    <!-- 仓库详情弹层 -->
    <ProjectModal
      v-if="active"
      :title="active.name"
      :subtitle="active.desc"
      :meta="active.meta"
      :body="active.detail"
      :href="active.href"
      href-label="查看仓库"
      @close="closeRepo"
    />
  </div>
</template>

<style scoped>
.gh-panel { display: flex; flex-direction: column; gap: 14px; }

.gh-syncing {
  align-self: center;
  font-size: 9px;
  color: var(--navy);
  animation: sync-pulse 1.2s ease-in-out infinite;
}
@keyframes sync-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

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

.gh-empty { color: var(--ink-50); font-size: 10px; text-align: center; padding: 16px 0; }
</style>
