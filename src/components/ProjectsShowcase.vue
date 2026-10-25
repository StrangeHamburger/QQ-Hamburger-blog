<script setup>
import { ref } from 'vue'
import { projects } from '../data/content.js'
import ProjectModal from './ProjectModal.vue'
import SeaLife from './SeaLife.vue'
import { spawnBubbles, wobble } from '../utils/bubbles.js'

defineProps({ embedded: Boolean })

const active = ref(null)

function openProject(p) { active.value = p }
function closeProject() { active.value = null }

// 标题彩蛋：戳「项目」→ 果冻抖动 + 冒泡
function onTitleClick(e) {
  wobble(e.currentTarget)
  spawnBubbles(e.clientX, e.clientY, 4)
}

// 卡片 3D 倾斜 + 扫光：--rx/--ry 驱动透视旋转，--mx/--my 定位高光
function onTilt(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', (py * -7).toFixed(2) + 'deg')
  el.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg')
  el.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%')
  el.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%')
}
function onUntilt(e) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}
</script>

<template>
  <section class="works" id="works">
    <!-- 中层海域：海龟慢游 -->
    <SeaLife type="turtle" :pf="70" :dur="26" flip class="works-turtle" />
    <div class="container">
      <div class="works-head" v-reveal>
        <h2 class="works-title" title="戳我一下" @click="onTitleClick">项目</h2>
        <span class="works-label mono-label">SELECTED WORKS</span>
      </div>

      <!-- 横向宽卡片：封面左 / 信息右，单项目也能撑满行宽 -->
      <div class="proj-grid" v-reveal="{ delay: 120 }">
        <article
          v-for="(proj, i) in projects"
          :key="proj.no"
          class="proj-card"
          :class="'tone-' + (i % 3)"
          @click="openProject(proj)"
          @mousemove="onTilt"
          @mouseleave="onUntilt"
          role="button"
          :tabindex="0"
          @keydown.enter="openProject(proj)"
        >
          <div class="proj-cover">
            <img v-if="proj.image" :src="proj.image" :alt="proj.name" class="proj-img" />
            <span v-else class="proj-no">{{ proj.no }}</span>
            <span class="proj-dot" aria-hidden="true"></span>
          </div>
          <div class="proj-info">
            <div class="proj-info-top">
              <span class="proj-name">{{ proj.name }}</span>
              <span class="proj-year mono-label">{{ proj.year }}</span>
            </div>
            <p class="proj-desc">{{ proj.desc }}</p>
            <span class="proj-more mono-label">查看详情 <span class="proj-arrow" aria-hidden="true">→</span></span>
          </div>
        </article>
      </div>
    </div>

    <!-- 全屏详情弹层（不跳转页面；组件常驻，visible 驱动内部 transition 开关动画） -->
    <ProjectModal
      :visible="!!active"
      :embedded="embedded"
      :title="active ? active.name : ''"
      :subtitle="active ? active.desc : ''"
      :meta="active ? active.tag + ' · ' + active.year : ''"
      :body="active ? active.detail : null"
      :href="active ? active.href : ''"
      @close="closeProject"
    />
  </section>
</template>
<style scoped>
.works { padding: var(--space-6) 0; }

.works-head {
  display: flex; align-items: baseline; gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--ink);
}
.works-title {
  font-family: var(--font-serif);
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: 0.04em;
  cursor: pointer;
  user-select: none;
}
.works-label { font-size: 10px; color: var(--ink-50); letter-spacing: 0.25em; }

/* ======== 横向宽卡片 ======== */
.works { position: relative; }
.works-turtle { right: 3%; top: 26%; width: 88px; }

.proj-grid {
  margin-top: var(--space-5);
  display: grid;
  /* auto-fit：空轨道折叠 → 只有一个项目时卡片占满整行（内部限宽居中），
     多个项目时按 420px 起步自动铺开换行 */
  grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
  gap: clamp(16px, 2.5vw, 28px);
}

.proj-card {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  box-shadow: var(--shadow-card);
  transform: perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.proj-card:hover, .proj-card.is-hover {
  transform: perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translate(-3px, -3px);
  box-shadow: var(--shadow-pop);
}
/* 鼠标跟随高光（扫光） */
.proj-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.16), transparent 62%);
  opacity: 0;
  transition: opacity var(--dur);
  pointer-events: none;
  z-index: 2;
}
.proj-card:hover::after, .proj-card.is-hover::after { opacity: 1; }

/* 封面：左侧等宽方块，hover 轻微放大 */
.proj-cover {
  position: relative;
  flex: 0 0 clamp(120px, 17vw, 200px);
  min-height: clamp(120px, 17vw, 200px);
  background: var(--paper);
  border-right: 2px solid var(--ink);
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.proj-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform var(--dur-slow) var(--ease-out);
}
.proj-card:hover .proj-img, .proj-card.is-hover .proj-img { transform: scale(1.05); }

/* 无封面时：编号兜底 */
.proj-no {
  font-family: var(--font-serif);
  font-size: clamp(34px, 4vw, 52px);
  font-weight: 700;
  line-height: 1;
}
.tone-0 .proj-no { color: var(--tomato); }
.tone-1 .proj-no { color: var(--navy); }
.tone-2 .proj-no { color: #b8860b; }

/* 角落圆点装饰 */
.proj-dot {
  position: absolute;
  right: 10px; top: 10px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--ink-12);
}

/* 信息区 */
.proj-info {
  flex: 1;
  min-width: 0;
  padding: clamp(14px, 2vw, 24px);
  display: flex; flex-direction: column; gap: 8px;
}
.proj-info-top {
  display: flex; align-items: baseline; gap: 10px;
  flex-wrap: wrap;
}
.proj-name {
  font-family: var(--font-serif);
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 700;
  color: var(--ink);
}
.proj-year { font-size: 10px; color: var(--ink-40); letter-spacing: 0.18em; }
.proj-desc {
  font-size: 13px;
  line-height: 1.75;
  color: var(--ink-70);
}
.proj-more {
  margin-top: auto;
  padding-top: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  display: inline-flex; align-items: center; gap: 6px;
}
.tone-0 .proj-more { color: var(--tomato); }
.tone-1 .proj-more { color: var(--navy); }
.tone-2 .proj-more { color: #b8860b; }
.proj-arrow { transition: transform var(--dur-fast) var(--ease-out); }
.proj-card:hover .proj-arrow, .proj-card.is-hover .proj-arrow { transform: translateX(4px); }

/* ======== 响应式 ======== */
@media (max-width: 480px) {
  .proj-cover { flex-basis: 116px; min-height: 116px; }
  .proj-name { font-size: 16px; }
  .proj-desc { font-size: 12px; }
}
</style>
