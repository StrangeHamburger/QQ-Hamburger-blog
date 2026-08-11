<script setup>
import { ref, computed } from 'vue'
import Burger25D from './Burger25D.vue'
import FormulaScroll from './FormulaScroll.vue'
import { burgerLayers } from '../data/content.js'
import ResumeChannel from './channels/ResumeChannel.vue'
import GithubChannel from './channels/GithubChannel.vue'
import InterestsChannel from './channels/InterestsChannel.vue'
import GuestbookChannel from './channels/GuestbookChannel.vue'
import BlogChannel from './channels/BlogChannel.vue'
import ComingSoonChannel from './channels/ComingSoonChannel.vue'

const channelMap = {
  github: GithubChannel,
  blog: BlogChannel,
  resume: ResumeChannel,
  interests: InterestsChannel,
  guestbook: GuestbookChannel,
  soon: ComingSoonChannel
}

const activeId = ref('')
const activeLayer = ref(-1)
const detailOpen = ref(false)

const activeChannel = computed(() => (activeId.value ? channelMap[activeId.value] : null))
const activeMeta = computed(() => burgerLayers.find(l => l.id === activeId.value))

function onHoverLayer(i) { activeLayer.value = i }
function onSelectLayer(i) {
  const layer = burgerLayers[i]
  if (!layer) return
  activeId.value = layer.id
  detailOpen.value = true
}
function closeDetail() { detailOpen.value = false }
</script>

<template>
  <section class="burger-section" id="burger">
    <div class="container">
      <span class="section-eyebrow mono-label">SECRET FORMULA</span>
      <h2 class="section-title">汉堡包秘方</h2>
    </div>

    <div class="burger-wrap container">
      <!-- 左：秘方卷轴 -->
      <FormulaScroll
        @hover-layer="onHoverLayer"
        @select-layer="onSelectLayer"
      />
      <!-- 右：2.5D 汉堡 -->
      <div class="iso-stage">
        <Burger25D :active-layer="activeLayer" />
      </div>
    </div>

    <!-- 详情面板（右侧滑出） -->
    <div class="drawer" :class="{ open: detailOpen }">
      <div class="drawer-backdrop" @click="closeDetail"></div>
      <div class="drawer-panel" v-if="detailOpen && activeMeta">
        <div class="drawer-head">
          <span class="drawer-num mono-label">{{ activeMeta.num }}</span>
          <span class="drawer-name">{{ activeMeta.name }}</span>
          <span class="drawer-channel mono-label">{{ activeMeta.channel }}</span>
          <button class="drawer-close" @click="closeDetail" aria-label="关闭">×</button>
        </div>
        <div class="drawer-body">
          <component :is="activeChannel" v-if="activeChannel" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.burger-section {
  padding: var(--space-6) 0 var(--space-7);
  border-top: 1px solid var(--ink-08);
}

.section-eyebrow { color: var(--tomato); font-size: 11px; }
.section-title {
  font-family: var(--font-serif);
  font-size: var(--text-h2);
  margin-top: 4px;
  color: var(--ink);
}

.burger-wrap {
  display: flex; align-items: center; justify-content: center;
  gap: clamp(40px, 8vw, 110px);
  padding-top: var(--space-5);
}

.iso-stage {
  flex: 0 0 clamp(320px, 40vw, 480px);
  height: clamp(360px, 60vh, 480px);
}

/* ======== 详情抽屉 ======== */
.drawer { position: fixed; inset: 0; z-index: 100; pointer-events: none; }
.drawer.open { pointer-events: auto; }
.drawer-backdrop {
  position: absolute; inset: 0;
  background: rgba(26,26,24,0.28);
  opacity: 0; transition: opacity 300ms ease;
}
.drawer.open .drawer-backdrop { opacity: 1; }
.drawer-panel {
  position: absolute; top: 0; right: 0; bottom: 0;
  width: clamp(340px, 38vw, 520px);
  background: var(--cream);
  box-shadow: -4px 0 30px rgba(26,26,24,0.15);
  transform: translateX(100%);
  transition: transform 350ms var(--ease-out);
  display: flex; flex-direction: column; overflow: hidden;
}
.drawer.open .drawer-panel { transform: translateX(0); }

.drawer-head {
  padding: 18px 22px; border-bottom: 1px solid var(--ink-08);
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  background: var(--cream);
}
.drawer-num { color: var(--tomato); font-size: 13px; }
.drawer-name { font-size: 19px; font-weight: 700; }
.drawer-channel { font-size: 8px; color: var(--ink-50); margin-left: auto; letter-spacing: 0.15em; }
.drawer-close { font-size: 24px; color: var(--ink-50); line-height: 1; padding: 0 4px; }

.drawer-body { flex: 1; overflow-y: auto; padding: 22px; }

@media (max-width: 767px) {
  .burger-wrap { flex-direction: column; gap: 20px; }
  .iso-stage { flex: 0 0 280px; height: 300px; }
  .drawer-panel { width: 100vw; }
}
</style>
