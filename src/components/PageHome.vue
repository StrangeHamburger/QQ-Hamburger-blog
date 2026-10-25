<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { profile } from '../data/content.js'
import { onScrollProgress, getScrollRoot, MAX_DEPTH } from '../utils/depth.js'
import { spawnBubbles, wobble } from '../utils/bubbles.js'
import ProjectsShowcase from './ProjectsShowcase.vue'
import BurgerSection from './BurgerSection.vue'
import MiniComputer from './MiniComputer.vue'
import SeaLife from './SeaLife.vue'
import DepthTerminal from './DepthTerminal.vue'
import AboutSection from './AboutSection.vue'

// embedded：被内嵌在笔记本屏幕门户里（ScreenPortal）时的模式
// 隐藏右下角小电脑、改根高度为 100% 适配门户滚动容器
defineProps({ embedded: Boolean })

const nameClicked = ref(false)

// ===== 下潜叙事：滚动进度 → 水深 =====
const depth = ref(0)                                   // 0~1
const depthM = computed(() => Math.round(depth.value * MAX_DEPTH))
const veilEl = ref(null)
let offDepth = null

// 顶栏高亮：滚动到哪个区，哪个导航项亮起来（顶部 / 项目 / 汉堡秘方）
const activeSection = ref('top')
function updateActiveSection() {
  const root = getScrollRoot()
  const rect = root ? root.getBoundingClientRect() : { top: 0, height: window.innerHeight }
  const line = rect.top + rect.height * 0.38   // 屏幕上方 38% 处作为分界线
  let cur = 'top'
  const about = document.getElementById('about')
  const works = document.getElementById('works')
  const burger = document.getElementById('burger')
  if (about && about.getBoundingClientRect().top <= line) cur = 'about'
  if (works && works.getBoundingClientRect().top <= line) cur = 'works'
  if (burger && burger.getBoundingClientRect().top <= line) cur = 'burger'
  activeSection.value = cur
}

onMounted(() => {
  offDepth = onScrollProgress((p) => {
    depth.value = p
    updateActiveSection()
  })
})
onBeforeUnmount(() => { if (offDepth) offDepth() })

// 彩蛋1：点名字 → 果冻抖动 + 印章 + 气泡
// 按词拆分（词内 nowrap，避免逐字 span 把 "Hamburger" 拆断成 Hamb/urger）
const nameWords = profile.name.split(' ').map(w => w.split(''))
const nameEl = ref(null)
function onNameClick(e) {
  nameClicked.value = true
  setTimeout(() => (nameClicked.value = false), 900)
  wobble(nameEl.value)
  spawnBubbles(e.clientX, e.clientY, 4)
}

// 锚点滚动 → 对应 section（门户内嵌时 scrollIntoView 会滚最近的滚动容器，两端通用）
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// 页脚 ">_" 按钮：打开深海终端（移动端无键盘的入口）
function openTerminal() {
  window.dispatchEvent(new CustomEvent('open-terminal'))
}

// 访客统计（不蒜子）：数字本身不可信——该服务常返回被污染的共享缓存值（千万级）。
// 策略：MutationObserver 永久监听注入（不设时间窗，注入多晚都接管）；
//   <10 万 → 千分位显示真实数字；≥10 万 → 显示「超多」（不假装精确）；
//   8s 仍无数据（服务被墙/挂掉）→ 整行换成无数字文案，不留「…」占位。
onMounted(() => {
  const statEl = document.getElementById('footer-stat')
  const pvEl = document.getElementById('busuanzi_value_site_pv')
  const uvEl = document.getElementById('busuanzi_value_site_uv')
  if (!statEl || !pvEl || !uvEl) return

  const fmt = (raw) => {
    const n = Number(String(raw).replace(/,/g, ''))
    if (!Number.isFinite(n) || n <= 0) return null
    return n < 100000 ? n.toLocaleString() : '超多'
  }

  const mo = new MutationObserver(() => {
    const pv = fmt(pvEl.textContent)
    const uv = fmt(uvEl.textContent)
    if (!pv || !uv) return
    mo.disconnect()   // 整行重写会移除 span，先断开避免自触发
    statEl.textContent = `🦀 被踩点 ${pv} 次 · 来过 ${uv} 只蟹`
  })
  mo.observe(pvEl, { childList: true, characterData: true, subtree: true })
  mo.observe(uvEl, { childList: true, characterData: true, subtree: true })

  setTimeout(() => {
    if (!fmt(pvEl.textContent)) statEl.textContent = '🦀 蟹老板正在营业，欢迎光临'
  }, 8000)
})
</script>

<template>
  <div class="home" :class="{ 'is-embedded': embedded }" :style="{ '--dp': depth }">
    <!-- ======== 下潜层：随滚动变深的固定背景 / 进度条 / 深度计 ======== -->
    <div ref="veilEl" class="depth-veil" aria-hidden="true"></div>
    <div class="scroll-progress" aria-hidden="true"><span class="scroll-progress-fill" :style="{ width: (depth * 100).toFixed(1) + '%' }"></span></div>
    <div class="depth-gauge mono-label" aria-hidden="true">DEPTH -{{ depthM }} M</div>

    <!-- ======== 导航 ======== -->
    <header class="nav">
      <div class="container nav-inner">
        <span class="nav-brand mono-label">{{ profile.name }}<span class="nav-brand-suffix"> · CS PORTFOLIO</span></span>
        <nav class="nav-links" aria-label="页面导航">
          <button class="nav-link mono-label" :class="{ active: activeSection === 'top' }" @click="scrollToId('hero')">顶部</button>
          <button class="nav-link mono-label" :class="{ active: activeSection === 'about' }" @click="scrollToId('about')">关于</button>
          <button class="nav-link mono-label" :class="{ active: activeSection === 'works' }" @click="scrollToId('works')">项目</button>
          <button class="nav-link mono-label" :class="{ active: activeSection === 'burger' }" @click="scrollToId('burger')">汉堡秘方</button>
        </nav>
      </div>
    </header>

    <!-- ======== Hero ======== -->
    <section class="hero" id="hero">
      <!-- 深海气泡（背景装饰） -->
      <div class="hero-bubbles" aria-hidden="true">
        <span class="bubble b1"></span>
        <span class="bubble b2"></span>
        <span class="bubble b3"></span>
        <span class="bubble b4"></span>
      </div>

      <!-- 浅海小鱼群（下潜叙事：表层） -->
      <SeaLife type="fish" :pf="50" :dur="18" class="hero-fish" />

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

      <div class="container hero-inner" v-reveal>
        <div class="hero-copy">
          <p class="hero-title mono-label">{{ profile.title }}</p>
          <div class="hero-name-block" @click="onNameClick">
            <h1 ref="nameEl" class="hero-name" :class="{ stamped: nameClicked }"><span
              v-for="(word, w) in nameWords" :key="w" class="hn-word"
            ><span
              v-for="(ch, i) in word" :key="i" class="hn-out" :style="{ '--i': w * 7 + i }"
            ><span class="hn-in">{{ ch }}</span></span></span></h1>
            <span class="hero-stamp mono-label">{{ profile.stamp }}</span>
          </div>
          <p class="hero-tagline">
            <svg class="tagline-mail" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5h18v14H3V5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M3 6.5 12 13l9-6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
            <span>{{ profile.tagline }}</span>
          </p>
        </div>

        <!-- 右栏：复古收银机（在栏内落地，不再页面级悬浮） -->
        <div class="hero-side">
          <MiniComputer />
        </div>

        <!-- 按钮 -->
        <div class="hero-actions">
          <button class="btn btn-primary" v-magnetic @click="scrollToId('burger')">查看汉堡秘方 ↓</button>
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

    <!-- ======== 关于我（厨师档案） ======== -->
    <AboutSection />

    <!-- ======== 项目精选 ======== -->
    <ProjectsShowcase :embedded="embedded" />

    <!-- ======== 汉堡包秘方（技能墙以下整块） ======== -->
    <BurgerSection :embedded="embedded" />

    <!-- ======== 页脚：海床（深海叙事的落点） + 访客统计（不蒜子） ======== -->
    <footer class="site-footer">
      <svg class="footer-wave" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 22 C 120 8, 240 8, 360 20 S 600 34, 720 22 S 960 6, 1080 18 S 1320 34, 1440 22 L 1440 0 L 0 0 Z" fill="currentColor"/>
      </svg>
      <div class="footer-body">
        <SeaLife type="glow" :pf="30" class="footer-glow" />
        <svg class="footer-seagrass" viewBox="0 0 220 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <path d="M24 120 C 18 92, 34 80, 24 52 C 17 32, 28 16, 22 0" stroke="rgba(8, 20, 34, 0.6)" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M62 120 C 56 96, 72 84, 62 58 C 55 40, 66 24, 60 8" stroke="rgba(8, 20, 34, 0.45)" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M168 120 C 162 96, 178 86, 168 60 C 161 42, 172 26, 166 10" stroke="rgba(8, 20, 34, 0.5)" stroke-width="7" fill="none" stroke-linecap="round"/>
          <path d="M204 120 C 198 100, 212 88, 204 66" stroke="rgba(8, 20, 34, 0.4)" stroke-width="5" fill="none" stroke-linecap="round"/>
        </svg>
        <button class="footer-term-btn mono-label" title="深海终端（快捷键 ~）" @click="openTerminal"><span aria-hidden="true">&gt;_</span>终端</button>
        <span class="mono-label" id="footer-stat">🦀 被踩点 <span id="busuanzi_value_site_pv">…</span> 次 · 来过 <span id="busuanzi_value_site_uv">…</span> 只蟹</span>
        <span class="mono-label footer-copy">© 2026 QQ HAMBURGER · DEEP SEA RESTAURANT</span>
      </div>
    </footer>

    <!-- 深海终端彩蛋（~ 呼出） -->
    <DepthTerminal />
  </div>
</template>

<style scoped>
/* ======== 下潜背景层 ========
   fixed 于可视屏幕（门户内经 transform 包含 = 贴住笔记本屏幕；移动端 = 贴住视口），
   不随内容滚动。元素高 300%，随 --dp（滚动进度）做纯合成器位移：
   进度 0 露出渐变顶部 1/3（米白纸面），进度 1 露出底部 1/3（深海蓝）。
   用 transform 而不是 background-position：滚动时零重绘，不掉帧。
   注意：门户内 .portal-boot/.portal-scroll 背景已透明，本层不需要 isolation/z-index
   也能落在 canvas 之上、内容之下——不要给 .home 加 isolation/合成提示，
   否则整个内容子树会被降采样成纹理，文字全部发糊。 */
.home { min-height: 100dvh; position: relative; }
.depth-veil {
  position: fixed; top: 0; left: 0; right: 0;
  height: 300%;
  z-index: -1;
  pointer-events: none;
  transform: translateY(calc(var(--dp, 0) * -66.66%));
  /* 渐变：暖米白起步，浅蓝收尾（低饱和、微暖灰过渡） */
  background-color: #aec9d6;   /* 兜底：渐变万一未铺满也不露出 3D 画布 */
  background-image: linear-gradient(180deg,
    #faf6ef 0%, #f5f1e8 15%, #eceadf 27%, #dce1d6 39%,
    #ccd8d2 51%, #c2d6d8 63%, #bcd2d8 75%, #b6cfd8 87%, #aec9d6 100%);
}

/* 番茄酱 + 芥末酱条纹滚动进度条 */
.scroll-progress {
  position: fixed; top: 0; left: 0; right: 0; height: 3px;
  z-index: 80;
  pointer-events: none;
}
.scroll-progress-fill {
  display: block; height: 100%;
  background: repeating-linear-gradient(45deg, var(--tomato) 0 10px, var(--mustard) 10px 20px);
  border-radius: 0 2px 2px 0;
  transition: width 90ms linear;
}

/* 深度计：左下角实时水深 */
.depth-gauge {
  position: fixed; left: 14px; bottom: 12px;
  z-index: 60;
  font-size: 10px;
  color: var(--ink-50);
  background: rgba(255, 253, 248, 0.6);
  border: 1px solid var(--ink-12);
  border-radius: 999px;
  padding: 4px 12px;
  backdrop-filter: blur(2px);
  pointer-events: none;
  transition: color var(--dur), background var(--dur), border-color var(--dur);
}

/* 页脚：深海色块收尾，顶部波浪边呼应 Hero 的深海主题 */
.site-footer { margin-top: var(--space-6); }
.footer-wave {
  display: block;
  width: 100%;
  height: 30px;
  color: var(--navy);
  margin-bottom: -1px;
}
/* 页脚：深色海床收尾，顶部波浪边呼应 Hero 的深海主题 */
.site-footer { margin-top: var(--space-6); }
.footer-wave {
  display: block;
  width: 100%;
  height: 30px;
  color: var(--navy);
  margin-bottom: -1px;
}
.footer-body {
  position: relative;
  overflow: hidden;
  background: var(--navy);
  text-align: center;
  padding: 24px 16px 32px;
  display: flex; flex-direction: column; gap: 10px;
  color: rgba(255, 253, 248, 0.62);
  font-size: 10px;
}
.footer-copy { color: rgba(255, 253, 248, 0.35); position: relative; z-index: 1; }
.footer-body > span { position: relative; z-index: 1; }

/* 海床装饰：海草剪影 + 荧光点 */
.footer-seagrass {
  position: absolute;
  left: 0; right: 0; bottom: -4px;
  width: 100%; height: 110px;
  pointer-events: none;
}
.footer-glow {
  left: 2%; right: 2%; bottom: 0;
  height: 90px;
  width: auto;
  opacity: 0.85;
}

/* 深海终端入口（页脚右下）：芥末黄 + 呼吸光晕，一眼能找到 */
.footer-term-btn {
  position: absolute;
  right: 14px; top: 12px;
  z-index: 2;
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--mustard);
  background: rgba(242, 184, 75, 0.12);
  border: 1.5px solid rgba(242, 184, 75, 0.55);
  border-radius: 999px;
  padding: 5px 13px;
  font-size: 11px;
  cursor: pointer;
  transition: transform var(--dur-fast), background var(--dur-fast);
  animation: term-btn-glow 2.6s ease-in-out infinite;
}
.footer-term-btn:hover {
  transform: translateY(-2px);
  background: rgba(242, 184, 75, 0.22);
}
@keyframes term-btn-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(242, 184, 75, 0); }
  50% { box-shadow: 0 0 12px rgba(242, 184, 75, 0.5); }
}
/* 内嵌模式：由门户滚动容器撑高度，而不是视口 */
.home.is-embedded { min-height: 100%; }

/* ---------- 导航 ---------- */
.nav {
  position: sticky; top: 0; z-index: 70;   /* 70 > 收银台 60：吸顶时盖住任何滚过它的元素 */
  background: var(--paper);
  border-bottom: 1px solid var(--ink-08);
}
.nav-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding-top: var(--space-3); padding-bottom: var(--space-3);
}
.nav-brand { color: var(--ink-70); font-size: 11px; }

/* 右侧锚点链接：hover 时墨字变红 + 下划线从左划入 */
.nav-links { display: flex; gap: 2px; }
.nav-link {
  position: relative;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--ink-50);
  padding: 6px 10px;
  transition: color var(--dur-fast);
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 10px; right: 10px; bottom: 2px;
  height: 2px;
  background: var(--tomato);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur) var(--ease-out);
}
.nav-link:hover, .nav-link.is-hover { color: var(--tomato); }
.nav-link:hover::after, .nav-link.is-hover::after { transform: scaleX(1); }
/* 滚动到对应区时亮起 */
.nav-link.active { color: var(--tomato); }
.nav-link.active::after { transform: scaleX(1); }

@media (max-width: 767px) {
  .nav-brand { font-size: 10px; }
  .nav-brand-suffix { display: none; }   /* 手机端放不下三个链接 + 全称 */
  .nav-link { font-size: 10px; padding: 6px 7px; white-space: nowrap; }
  .nav-link::after { left: 7px; right: 7px; }
}

/* ---------- Hero ---------- */
.hero { position: relative; overflow: hidden; padding: var(--space-7) 0 var(--space-6); }
.hero-inner { position: relative; }

/* 左栏文案 / 右栏收银机（窄屏单列堆叠，≥1024px 两栏） */
.hero-side { margin-top: var(--space-5); display: flex; justify-content: flex-start; }

@media (min-width: 1024px) {
  .hero-inner {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    grid-template-areas:
      'copy side'
      'actions side';
    column-gap: var(--space-6);
    align-items: start;
  }
  .hero-copy { grid-area: copy; }
  .hero-side {
    grid-area: side;
    margin-top: 0;
    align-self: center;
    justify-content: center;
  }
  .hero-actions { grid-area: actions; }
}

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

/* 浅海小鱼群（表层，左下靠波浪处） */
.hero-fish { left: 5%; bottom: 7%; width: 116px; z-index: 0; opacity: 0.8; }
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

/* 身份行：名字上方的 eyebrow */
.hero-title {
  margin-bottom: 14px;
  color: var(--ink-50);
}

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

/* 名字逐字：词内不换行；外层管入场（backwards 只在延迟期隐藏，播完即释放图层，
   避免每个字母常驻合成层导致投影画面发糊），内层管 hover 果冻 */
.hn-word { display: inline-block; white-space: nowrap; }
.hn-word + .hn-word { margin-left: 0.22em; }
.hn-out {
  display: inline-block;
  animation: letter-rise 0.7s var(--ease-out) backwards;
  animation-delay: calc(var(--i) * 45ms + 120ms);
}
.hn-in { display: inline-block; }
.hero-name-block:hover .hn-in {
  animation: letter-jelly 0.55s var(--ease-spring);
  animation-delay: calc(var(--i) * 28ms);
}
@keyframes letter-rise {
  from { opacity: 0; transform: translateY(0.45em) rotate(5deg); }
  to { opacity: 1; transform: none; }
}
@keyframes letter-jelly {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.16, 0.84); }
  55% { transform: scale(0.9, 1.1); }
  78% { transform: scale(1.05, 0.96); }
  100% { transform: scale(1, 1); }
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
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast);
}
.btn-primary {
  background: var(--tomato); color: var(--cream);
  box-shadow: 4px 4px 0 var(--navy-deep);
}
.btn-primary:hover, .btn-primary.is-hover { box-shadow: 6px 6px 0 var(--navy-deep); }
.btn-ghost {
  background: var(--cream); color: var(--ink);
  border: 1.5px solid var(--ink-30);
  box-shadow: 3px 3px 0 var(--ink-12);
}
.btn-ghost:hover, .btn-ghost.is-hover { transform: translate(-2px, -2px); border-color: var(--tomato); color: var(--tomato); box-shadow: 5px 5px 0 var(--ink-12); }

/* ---------- 响应式 ---------- */
@media (max-width: 767px) {
  .hero { padding-top: var(--space-5); }
  .hero-wave { width: 180px; height: 180px; right: -30px; }
  /* 名字顶满屏宽时印章收进名字块内，避免被屏幕截断 */
  .hero-stamp { right: 0; top: -30px; }
  .nav-burger-text { display: none; }
}
</style>
