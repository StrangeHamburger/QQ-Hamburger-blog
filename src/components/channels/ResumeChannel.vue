<script setup>
import { resume } from '../../data/content.js'
</script>

<template>
  <div class="channel">
    <!-- 简历暂无 -->
    <div v-if="!resume.education.length" class="resume-empty">
      <span class="re-mark" aria-hidden="true">◌</span>
      <p class="re-title">简历制作中</p>
      <p class="re-desc">经验值正在积累……<br />先看看别的栏目吧。</p>
      <span class="re-line mono-label">RESUME COMING SOON</span>
    </div>

    <template v-else>
      <div class="ch-head">
        <span class="ch-label mono-label">EDUCATION</span>
        <div v-for="e in resume.education" :key="e.period" class="edu-block">
          <span class="edu-period mono-label">{{ e.period }}</span>
          <span class="edu-title">{{ e.title }}</span>
          <span class="edu-org">{{ e.org }}</span>
        </div>
      </div>

      <div class="ch-head" style="margin-top: 24px">
        <span class="ch-label mono-label">SKILL GROUPS</span>
        <div class="skill-group" v-for="g in resume.skills" :key="g.group">
          <span class="sg-name mono-label">{{ g.group }}</span>
          <div class="sg-tags">
            <span v-for="item in g.items" :key="item" class="sg-tag">{{ item }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ch-label {
  display: block; color: var(--tomato); font-size: 9px;
  margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--ink-08);
}

/* 简历空态 */
.resume-empty {
  text-align: center;
  padding: 30px 10px;
  border: 1.5px dashed var(--ink-20);
  border-radius: var(--radius-lg);
}
.re-mark {
  display: block;
  font-size: 28px;
  color: var(--mustard);
  animation: re-pulse 2.4s ease-in-out infinite;
}
@keyframes re-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
.re-title {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--ink);
  margin-top: 8px;
}
.re-desc {
  color: var(--ink-50);
  font-size: 12px;
  line-height: 1.8;
  margin-top: 6px;
}
.re-line {
  display: block;
  margin-top: 12px;
  font-size: 8px;
  color: var(--tomato);
  letter-spacing: 0.3em;
}
.edu-block { margin-bottom: 14px; display: flex; flex-direction: column; }
.edu-period { color: var(--navy); font-size: 10px; }
.edu-title { font-size: 16px; font-weight: 700; margin-top: 2px; }
.edu-org { color: var(--ink-50); font-size: 13px; }

.skill-group { margin-bottom: 14px; }
.sg-name { color: var(--ink-70); font-size: 9px; display: block; margin-bottom: 6px; }
.sg-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.sg-tag {
  font-size: 12px; padding: 4px 10px;
  background: var(--paper); border: 1px solid var(--ink-12);
  border-radius: 999px; color: var(--ink);
}
</style>
