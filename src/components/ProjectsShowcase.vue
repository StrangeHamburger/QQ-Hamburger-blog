<script setup>
import { ref } from 'vue'
import { projects } from '../data/content.js'
import ProjectModal from './ProjectModal.vue'

defineProps({ embedded: Boolean })

const active = ref(null)

function openProject(p) { active.value = p }
function closeProject() { active.value = null }
</script>

<template>
  <section class="works" id="works">
    <div class="container">
      <div class="works-head" v-reveal>
        <h2 class="works-title">项目</h2>
        <span class="works-label mono-label">SELECTED WORKS</span>
      </div>

      <!-- 一横排精致小方块 -->
      <div class="tile-row" v-reveal="{ delay: 120 }">
        <article
          v-for="(proj, i) in projects"
          :key="proj.no"
          class="tile"
          :class="'tone-' + (i % 3)"
          @click="openProject(proj)"
          role="button"
          :tabindex="0"
          @keydown.enter="openProject(proj)"
        >
          <div class="tile-card">
            <img v-if="proj.image" :src="proj.image" :alt="proj.name" class="tile-img" />
            <template v-else>
              <span class="tile-no">{{ proj.no }}</span>
              <span class="tile-dot" aria-hidden="true"></span>
              <span class="tile-cross" aria-hidden="true"></span>
            </template>
          </div>
          <div class="tile-meta">
            <span class="tile-name">{{ proj.name }}</span>
            <span class="tile-year mono-label">{{ proj.year }}</span>
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
}
.works-label { font-size: 9px; color: var(--ink-50); letter-spacing: 0.25em; }

/* ======== 小方块 ======== */
.tile-row {
  margin-top: var(--space-5);
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  justify-content: center;
}

.tile {
  width: clamp(92px, 11vw, 128px);
  cursor: pointer;
  text-align: center;
  transition: transform var(--dur) var(--ease-spring);
}
.tile:hover { transform: translateY(-8px); }

/* 卡片：白底 + 彩色粗边 + 双层投影 */
.tile-card {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  background: var(--cream);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: box-shadow var(--dur), border-color var(--dur), transform var(--dur);
  overflow: hidden;
}
.tile:hover .tile-card, .tile.is-hover .tile-card { transform: scale(1.04); }

.tone-0 .tile-card { border: 3px solid var(--tomato); box-shadow: 4px 4px 0 var(--tomato-soft), 0 10px 22px rgba(224,69,46,0.12); }
.tone-1 .tile-card { border: 3px solid var(--navy); box-shadow: 4px 4px 0 rgba(36,66,94,0.18), 0 10px 22px rgba(36,66,94,0.14); }
.tone-2 .tile-card { border: 3px solid var(--mustard); box-shadow: 4px 4px 0 var(--mustard-soft), 0 10px 22px rgba(242,184,75,0.14); }

.tile:hover .tone-0 .tile-card, .tile.is-hover .tone-0 .tile-card { box-shadow: 6px 6px 0 var(--tomato-soft), 0 16px 30px rgba(224,69,46,0.2); }
.tile:hover .tone-1 .tile-card, .tile.is-hover .tone-1 .tile-card { box-shadow: 6px 6px 0 rgba(36,66,94,0.2), 0 16px 30px rgba(36,66,94,0.2); }
.tile:hover .tone-2 .tile-card, .tile.is-hover .tone-2 .tile-card { box-shadow: 6px 6px 0 var(--mustard-soft), 0 16px 30px rgba(242,184,75,0.22); }

.tile-img { width: 100%; height: 100%; object-fit: cover; }

/* 编号 */
.tile-no {
  font-family: var(--font-serif);
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 700;
  line-height: 1;
  transition: transform var(--dur) var(--ease-spring);
}
.tone-0 .tile-no { color: var(--tomato); }
.tone-1 .tile-no { color: var(--navy); }
.tone-2 .tile-no { color: #b8860b; }
.tile:hover .tile-no, .tile.is-hover .tile-no { transform: scale(1.12); }

/* 装饰：角落圆点 + 十字 */
.tile-dot {
  position: absolute;
  right: 10px; top: 10px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--ink-12);
}
.tile-cross {
  position: absolute;
  left: 10px; bottom: 10px;
  width: 10px; height: 10px;
}
.tile-cross::before,
.tile-cross::after {
  content: '';
  position: absolute;
  background: var(--ink-12);
}
.tile-cross::before { left: 4px; top: 0; width: 2px; height: 10px; }
.tile-cross::after { left: 0; top: 4px; width: 10px; height: 2px; }

/* 名称 + 年份 */
.tile-meta {
  margin-top: 10px;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
}
.tile-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-70);
  transition: color var(--dur-fast);
}
.tile:hover .tile-name { color: var(--tomato); }
.tile-year { font-size: 8px; color: var(--ink-30); letter-spacing: 0.15em; }

/* ======== 响应式 ======== */
@media (max-width: 480px) {
  .tile-row { gap: 14px; }
}
</style>
