<script setup>
import { ref } from 'vue'
import { profile } from '../data/content.js'
import ProjectsShowcase from './ProjectsShowcase.vue'
import BurgerSection from './BurgerSection.vue'
import MiniComputer from './MiniComputer.vue'

// embedded：被内嵌在笔记本屏幕门户里（ScreenPortal）时的模式
// 隐藏右下角小电脑、改根高度为 100% 适配门户滚动容器
defineProps({ embedded: Boolean })

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
  <div class="home" :class="{ 'is-embedded': embedded }">
    <!-- ======== 导航 ======== -->
    <header class="nav">
      <div class="container nav-inner">
        <span class="nav-brand mono-label">{{ profile.name }} · CS PORTFOLIO</span>
      </div>
    </header>

    <!-- ======== Hero ======== -->
    <section class="hero">
      <!-- 深海气泡（背景装饰） -->
      <div class="hero-bubbles" aria-hidden="true">
        <span class="bubble b1"></span>
        <span class="bubble b2"></span>
        <span class="bubble b3"></span>
        <span class="bubble b4"></span>
      </div>

      <!-- 海绵宝宝元素：水母 + 海草 -->
      <div class="hero-jelly" aria-hidden="true">
        <svg viewBox="0 0 60 80">
          <path d="M10 30 C 10 12, 50 12, 50 30 C 50 40, 40 46, 30 46 C 20 46, 10 40, 10 30 Z" fill="rgba(240, 150, 195, 0.4)" stroke="rgba(240, 120, 180, 0.5)" stroke-width="1.5"/>
          <path d="M18 46 C 16 60, 14 68, 16 74 M25 46 C 24 62, 26 70, 24 76 M35 46 C 36 60, 34 68, 36 74 M42 46 C 44 62, 42 70, 44 76" stroke="rgba(240, 120, 180, 0.45)" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="26" r="2" fill="rgba(255,255,255,0.7)"/>
          <circle cx="38" cy="26" r="2" fill="rgba(255,255,255,0.7)"/>
        </svg>
      </div>
      <div class="hero-seaweed" aria-hidden="true">
        <svg viewBox="0 0 120 60">
          <path d="M20 60 C 15 45, 28 40, 20 25 C 14 14, 22 6, 18 0" stroke="rgba(90, 160, 80, 0.35)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M60 60 C 55 42, 68 38, 60 20 C 54 10, 62 4, 58 0" stroke="rgba(90, 160, 80, 0.28)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M100 60 C 95 48, 105 40, 98 26 C 92 16, 100 8, 96 0" stroke="rgba(90, 160, 80, 0.22)" stroke-width="4" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="container hero-inner">
        <div class="hero-name-block" @click="onNameClick">
          <h1 class="hero-name" :class="{ stamped: nameClicked }">{{ profile.name }}</h1>
          <span class="hero-stamp mono-label">{{ profile.stamp }}</span>
        </div>
        <p class="hero-tagline">
          <svg class="tagline-mail" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5h18v14H3V5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M3 6.5 12 13l9-6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
          <span>{{ profile.tagline }}</span>
        </p>

        <!-- 按钮 -->
        <div class="hero-actions">
          <button class="btn btn-primary" @click="scrollToBurger">查看汉堡秘方 ↓</button>
          <a class="btn btn-ghost" href="#works">看看项目</a>
        </div>
      </div>

      <!-- 底部波浪分隔线 -->
      <div class="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0 22 C 120 8, 240 8, 360 20 S 600 34, 720 22 S 960 6, 1080 18 S 1320 34, 1440 22 L 1440 40 L 0 40 Z" fill="currentColor"/>
        </svg>
      </div>
    </section>

    <!-- ======== 项目精选 ======== -->
    <ProjectsShowcase :embedded="embedded" />

    <!-- ======== 汉堡包秘方（技能墙以下整块） ======== -->
    <BurgerSection />

    <!-- ======== 复古收银机（内嵌与全站模式都显示） ======== -->
    <MiniComputer />
  </div>
</template>

<style scoped>
.home { min-height: 100dvh; position: relative; }
/* 内嵌模式：由门户滚动容器撑高度，而不是视口 */
.home.is-embedded { min-height: 100%; }

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

/* 深海气泡 */
.hero-bubbles {
  position: absolute; inset: 0;
  pointer-events: none;
  z-index: 0;
}
.bubble {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(36, 66, 94, 0.18);
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(36,66,94,0.05) 70%);
  animation: bubble-rise linear infinite;
}
.b1 { width: 14px; height: 14px; left: 12%; bottom: -20px; animation-duration: 11s; }
.b2 { width: 8px; height: 8px; left: 28%; bottom: -20px; animation-duration: 15s; animation-delay: 2s; }
.b3 { width: 20px; height: 20px; left: 74%; bottom: -20px; animation-duration: 13s; animation-delay: 5s; }
.b4 { width: 10px; height: 10px; left: 88%; bottom: -20px; animation-duration: 17s; animation-delay: 7s; }
@keyframes bubble-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  8% { opacity: 0.7; }
  50% { transform: translateY(-45vh) translateX(12px); opacity: 0.5; }
  92% { opacity: 0.7; }
  100% { transform: translateY(-85vh) translateX(-8px); opacity: 0; }
}

/* 水母（右上角漂浮） */
.hero-jelly {
  position: absolute;
  right: 8%; top: 24%;
  width: 52px;
  z-index: 0;
  opacity: 0.75;
  pointer-events: none;
  animation: jelly-float 6s ease-in-out infinite;
}
.hero-jelly svg { width: 100%; display: block; }
@keyframes jelly-float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-14px) rotate(3deg); }
}

/* 海草（左下角摇摆） */
.hero-seaweed {
  position: absolute;
  left: 3%; bottom: -2px;
  width: 130px;
  z-index: 0;
  pointer-events: none;
  animation: seaweed-sway 4.5s ease-in-out infinite;
  transform-origin: bottom center;
}
.hero-seaweed svg { width: 100%; display: block; }
@keyframes seaweed-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

/* 波浪分隔线（Hero 底部） */
.hero-wave {
  position: absolute;
  left: 0; right: 0; bottom: -1px;
  height: 34px;
  color: var(--navy);
  opacity: 0.22;
  pointer-events: none;
  z-index: 1;
}
.hero-wave svg { width: 100%; height: 100%; display: block; }

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
  display: flex;   /* 块级 flex：独占一行，邮箱在名字正下方 */
  align-items: center;
  gap: 7px;
  margin-left: 16px;   /* 整体右移两个字母宽 */
}
/* 邮箱前的信封图标 */
.tagline-mail {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.85;
}

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
@media (min-width: 768px) {
  /* 电脑端：两个按钮及其以下整体下移两个按键身位（~90px） */
  .hero-actions { margin-top: calc(var(--space-5) + 90px); }
  /* 电脑端：邮箱账号往下移一行（~30px） */
  .hero-tagline { margin-top: calc(var(--space-4) + 30px); }
}

@media (max-width: 767px) {
  .hero { padding-top: var(--space-5); }
  .hero-wave { width: 180px; height: 180px; right: -30px; }
  .nav-burger-text { display: none; }
}
</style>
