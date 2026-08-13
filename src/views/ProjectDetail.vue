<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects } from '../data/content.js'

// 项目详情独立页（/projects/:id），meowj 式 case study
const route = useRoute()
const router = useRouter()

const proj = computed(() => projects.find((p) => p.id === route.params.id))

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<template>
  <div class="project-detail">
    <!-- 顶栏：返回 + 面包屑 -->
    <div class="pd-bar">
      <button class="pd-back" @click="goBack" aria-label="返回">
        <span aria-hidden="true">←</span> 返回
      </button>
      <span class="pd-crumb mono-label">PROJECTS / {{ proj ? proj.tag : 'NOT FOUND' }}</span>
    </div>

    <div v-if="proj" class="pd-panel">
      <!-- 头部 -->
      <header class="pd-head">
        <span class="pd-tag mono-label">{{ proj.tag }}</span>
        <h1 class="pd-title">{{ proj.name }}</h1>
        <p class="pd-subtitle">{{ proj.desc }}</p>
      </header>

      <!-- 正文 -->
      <div class="pd-body">
        <p v-if="proj.detail?.intro" class="pd-intro">{{ proj.detail.intro }}</p>

        <template v-for="(sec, si) in (proj.detail?.sections || [])" :key="si">
          <h2 class="pd-section mono-label">{{ sec.title }}</h2>

          <template v-if="sec.type === 'paras'">
            <p v-for="(para, pi) in sec.content" :key="pi" class="pd-para">{{ para }}</p>
          </template>

          <ul v-else-if="sec.type === 'list'" class="pd-features">
            <li v-for="(f, fi) in sec.content" :key="fi" class="pd-feature">
              <span class="pd-check" aria-hidden="true">✓</span>{{ f }}
            </li>
          </ul>

          <div v-else-if="sec.type === 'chips'" class="pd-tech">
            <span v-for="(t, ti) in sec.content" :key="ti" class="pd-tech-chip">{{ t }}</span>
          </div>
        </template>

        <!-- 跳转按钮 -->
        <div v-if="proj.href" class="pd-footer">
          <a class="pd-link" :href="proj.href" target="_blank" rel="noopener">
            查看项目 <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 项目不存在 -->
    <div v-else class="pd-missing">
      <p class="pd-missing-title mono-label">404 · 项目不存在</p>
      <button class="pd-back pd-back--solid" @click="router.push('/')">回首页</button>
    </div>
  </div>
</template>

<style scoped>
.project-detail {
  min-height: 100dvh;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(242, 184, 75, 0.07), transparent 55%),
    var(--paper);
  padding: 20px clamp(16px, 5vw, 48px) 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 顶栏 */
.pd-bar {
  width: min(760px, 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.pd-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-70);
  background: transparent;
  padding: 8px 14px;
  border-radius: 999px;
  transition: color var(--dur-fast), background var(--dur-fast), transform var(--dur-fast);
}
.pd-back:hover { color: var(--tomato); background: var(--tomato-soft); transform: translateX(-3px); }
.pd-back--solid {
  color: var(--cream);
  background: var(--navy);
  box-shadow: 0 3px 0 var(--ink-12);
}
.pd-back--solid:hover { color: var(--cream); background: var(--tomato); transform: none; }
.pd-crumb {
  font-size: 9px;
  letter-spacing: 0.25em;
  color: var(--ink-50);
}

/* 卡片 */
.pd-panel {
  width: min(760px, 100%);
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 0 rgba(26, 26, 24, 0.12), 0 30px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  animation: pd-in 380ms var(--ease-spring);
}
@keyframes pd-in {
  from { opacity: 0; transform: translateY(24px); }
}

.pd-head {
  padding: 30px 34px 22px;
  border-bottom: 2px solid var(--ink);
  background: var(--paper);
}
.pd-tag {
  display: inline-block;
  font-size: 9px;
  color: var(--tomato);
  border: 1px solid var(--tomato);
  border-radius: 3px;
  padding: 2px 8px;
  letter-spacing: 0.2em;
}
.pd-title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 700;
  color: var(--ink);
  margin-top: 10px;
}
.pd-subtitle { color: var(--ink-50); font-size: 14px; margin-top: 6px; }

/* 正文 */
.pd-body { padding: 26px 34px 34px; }
.pd-intro {
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 1.8;
  color: var(--navy);
  margin-bottom: 20px;
}
.pd-section {
  display: block;
  font-size: 10px;
  color: var(--tomato);
  letter-spacing: 0.25em;
  margin: 22px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--ink-08);
}
.pd-para {
  color: var(--ink-70);
  font-size: 14px;
  line-height: 1.9;
  margin-bottom: 10px;
}
.pd-features { list-style: none; }
.pd-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--ink-70);
}
.pd-check { color: var(--tomato); font-weight: 700; font-size: 15px; flex-shrink: 0; }
.pd-tech { display: flex; flex-wrap: wrap; gap: 8px; }
.pd-tech-chip {
  font-size: 12px;
  padding: 5px 14px;
  background: var(--paper);
  border: 1px solid var(--ink-12);
  border-radius: 999px;
  color: var(--ink-70);
  transition: background var(--dur-fast), border-color var(--dur-fast);
}
.pd-tech-chip:hover { background: var(--mustard-soft); border-color: var(--mustard); }

/* 底部跳转 */
.pd-footer {
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid var(--ink-08);
  display: flex;
  justify-content: flex-end;
}
.pd-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--cream);
  background: var(--navy);
  border-radius: 999px;
  padding: 10px 22px;
  box-shadow: 0 3px 0 var(--ink-12);
  transition: transform var(--dur-fast) var(--ease-spring), background var(--dur-fast);
}
.pd-link:hover { transform: translateY(-2px); background: var(--tomato); }

/* 404 */
.pd-missing {
  margin-top: 18vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.pd-missing-title { font-size: 12px; letter-spacing: 0.3em; color: var(--ink-50); }

@media (max-width: 767px) {
  .pd-head { padding: 22px 20px 18px; }
  .pd-body { padding: 20px 20px 26px; }
}
</style>
