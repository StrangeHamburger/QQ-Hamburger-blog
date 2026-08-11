<script setup>
import { ref } from 'vue'
import { profile, stats } from '../data/content.js'
import ProjectsShowcase from './ProjectsShowcase.vue'
import BurgerSection from './BurgerSection.vue'
import MiniComputer from './MiniComputer.vue'

const nameClicked = ref(false)

// 彩蛋1：点名字变印章
function onNameClick() {
  nameClicked.value = true
  setTimeout(() => (nameClicked.value = false), 900)
}

// 导航按钮 → 滚到秘方区
function scrollToBurger() {
  document.getElementById('burger')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="home">
    <!-- ======== 导航 ======== -->
    <header class="nav">
      <div class="container nav-inner">
        <span class="nav-brand mono-label">{{ profile.name }} · CS PORTFOLIO</span>
      </div>
    </header>

    <!-- ======== Hero ======== -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-name-block" @click="onNameClick">
          <h1 class="hero-name" :class="{ stamped: nameClicked }">{{ profile.name }}</h1>
          <span class="hero-stamp mono-label">{{ profile.stamp }}</span>
        </div>
        <p class="hero-tagline">{{ profile.tagline }}</p>

        <!-- 数据条 -->
        <div class="hero-stats">
          <div v-for="s in stats" :key="s.label" class="stat">
            <span class="stat-num mono-label">{{ s.num }}</span>
            <span class="stat-label mono-label">{{ s.label }}</span>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="hero-actions">
          <button class="btn btn-primary" @click="scrollToBurger">查看汉堡秘方 ↓</button>
          <a class="btn btn-ghost" href="#works">看看项目</a>
        </div>
      </div>
    </section>

    <!-- ======== 项目精选 ======== -->
    <ProjectsShowcase />

    <!-- ======== 汉堡包秘方（技能墙以下整块） ======== -->
    <BurgerSection />

    <!-- ======== 右下角小电脑 ======== -->
    <MiniComputer />
  </div>
</template>

<style scoped>
.home { min-height: 100dvh; position: relative; }

/* ---------- 导航 ---------- */
.nav {
  position: sticky; top: 0; z-index: 50;
  background: var(--paper);
  border-bottom: 1px solid var(--ink-08);
}
.nav-inner {
  display: flex; align-items: center;
  padding-top: var(--space-3); padding-bottom: var(--space-3);
}
.nav-brand { color: var(--ink-70); font-size: 11px; }

/* ---------- Hero ---------- */
.hero { position: relative; overflow: hidden; padding: var(--space-7) 0 var(--space-6); }
.hero-inner { position: relative; }

.hero-name-block {
  display: inline-block; position: relative; cursor: pointer;
}
.hero-name {
  font-family: var(--font-serif);
  font-size: var(--text-hero);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink);
  transition: color var(--dur) var(--ease-out);
}
.hero-name.stamped {
  color: var(--tomato);
  animation: stamp-pop 600ms var(--ease-spring);
}
@keyframes stamp-pop {
  0% { transform: scale(0.9) rotate(-4deg); }
  60% { transform: scale(1.06) rotate(2deg); }
  100% { transform: scale(1) rotate(0); }
}
.hero-stamp {
  position: absolute; right: -70px; top: -8px;
  color: var(--tomato);
  border: 2px solid var(--tomato);
  border-radius: 4px;
  padding: 4px 10px;
  transform: rotate(8deg);
  font-size: 12px;
  opacity: 0.85;
}

.hero-tagline {
  margin-top: var(--space-4);
  font-size: clamp(16px, 2vw, 20px);
  color: var(--ink-70);
  max-width: 30ch;
}

/* 数据条 */
.hero-stats {
  display: flex; gap: var(--space-5);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--ink-08);
  flex-wrap: wrap;
}
.stat { display: flex; flex-direction: column; }
.stat-num { font-size: 26px; font-weight: 700; color: var(--navy); }
.stat-label { font-size: 10px; color: var(--ink-50); margin-top: 2px; }

/* 按钮 */
.hero-actions { display: flex; gap: var(--space-3); margin-top: var(--space-5); flex-wrap: wrap; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: var(--radius-sm);
  font-size: 15px; font-weight: 600;
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast), background var(--dur-fast);
}
.btn-primary {
  background: var(--tomato); color: var(--cream);
  box-shadow: 0 3px 0 var(--navy-deep);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 0 var(--navy-deep); }
.btn-ghost {
  background: var(--cream); color: var(--ink);
  border: 1.5px solid var(--ink-30);
}
.btn-ghost:hover { transform: translateY(-2px); border-color: var(--tomato); color: var(--tomato); }

/* ---------- 响应式 ---------- */
@media (max-width: 767px) {
  .hero { padding-top: var(--space-5); }
  .hero-wave { width: 180px; height: 180px; right: -30px; }
  .hero-stats { gap: var(--space-4); }
  .nav-burger-text { display: none; }
}
</style>
