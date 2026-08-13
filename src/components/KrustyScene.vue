<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { profile } from '../data/content.js'
import { getPortal } from '../three/portalRef.js'

const props = defineProps({
  phase: { type: String, default: 'intro' } // 'intro' | 'home'
})
const emit = defineEmits(['arrive', 'leave'])

const hostRef = ref(null)
let scene = null

// 封面：3D 渲染完成后短暂停留再淡出（coverDone=true 触发 transition 移除）
const coverDone = ref(false)

// 上升气泡参数（固定分布，纯 CSS 动画）
const bubbles = [
  { left: '6%', size: 12, delay: 0, dur: 4.2 },
  { left: '18%', size: 7, delay: 1.6, dur: 5.0 },
  { left: '31%', size: 15, delay: 0.8, dur: 4.6 },
  { left: '47%', size: 6, delay: 2.4, dur: 5.4 },
  { left: '60%', size: 10, delay: 0.4, dur: 4.0 },
  { left: '72%', size: 17, delay: 1.9, dur: 4.8 },
  { left: '84%', size: 8, delay: 1.1, dur: 5.2 },
  { left: '93%', size: 13, delay: 2.8, dur: 4.4 }
]

onMounted(async () => {
  const { createKrustyScene } = await import('../three/krustyScene.js')
  scene = createKrustyScene(hostRef.value, {
    onArrive: () => emit('arrive'),
    onLeave: () => emit('leave'),
    getPortal
  })
  // 3D 就绪：等 600ms 让首帧稳定，再淡出封面
  setTimeout(() => { coverDone.value = true }, 600)
})

onBeforeUnmount(() => {
  scene?.dispose()
  scene = null
})
</script>

<template>
  <div class="krusty-scene">
    <div ref="hostRef" class="krusty-canvas-host"></div>

    <!-- 暗角：始终保留，聚焦中央桌面 -->
    <div class="krusty-vignette" aria-hidden="true"></div>

    <!-- 3D 加载封面：深海气泡 + CSS 汉堡（渲染完成后淡出） -->
    <transition name="cover-fade">
      <div v-if="!coverDone" class="krusty-cover" aria-hidden="true">
        <!-- 上升气泡 -->
        <span
          v-for="(b, i) in bubbles"
          :key="i"
          class="cover-bubble"
          :style="{
            left: b.left,
            width: b.size + 'px',
            height: b.size + 'px',
            animationDelay: b.delay + 's',
            animationDuration: b.dur + 's'
          }"
        ></span>
        <!-- 中心：CSS 迷你汉堡 + 站名 -->
        <div class="cover-center">
          <div class="mini-burger" aria-hidden="true">
            <span class="mb-bun-top"></span>
            <span class="mb-lettuce"></span>
            <span class="mb-cheese"></span>
            <span class="mb-patty"></span>
            <span class="mb-bun-bottom"></span>
          </div>
          <span class="cover-title">DEEP SEA RESTAURANT</span>
          <span class="cover-tip mono-label">LOADING…</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.krusty-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: auto;
}
.krusty-canvas-host {
  position: absolute;
  inset: 0;
}
.krusty-canvas-host canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* 暗角 */
.krusty-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(8, 14, 24, 0.42) 100%);
}

/* 3D 加载封面 */
.krusty-cover {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: linear-gradient(180deg, #0d1b2e 0%, #132c44 55%, #0d1b2e 100%);  /* 深海蓝黑 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 上升气泡 */
.cover-bubble {
  position: absolute;
  bottom: -24px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.12) 60%, transparent 100%);
  opacity: 0;
  animation-name: cover-bubble-rise;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}
@keyframes cover-bubble-rise {
  0%   { transform: translateY(0); opacity: 0; }
  12%  { opacity: 0.7; }
  85%  { opacity: 0.45; }
  100% { transform: translateY(-108vh); opacity: 0; }
}

/* 中心内容 */
.cover-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* CSS 迷你汉堡（加载动画主体） */
.mini-burger {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
  animation: cover-burger-bob 2.2s ease-in-out infinite;
}
.mb-bun-top {
  width: 56px; height: 16px;
  background: #f0ad4a;
  border-radius: 30px 30px 6px 6px;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.08);
}
.mb-lettuce {
  width: 60px; height: 6px;
  background: #7cbf5a;
  border-radius: 4px;
  margin-top: -2px;
}
.mb-cheese {
  width: 50px; height: 4px;
  background: #f5c94a;
  border-radius: 2px;
  margin-top: -1px;
}
.mb-patty {
  width: 58px; height: 8px;
  background: #8a5a34;
  border-radius: 4px;
  margin-top: -1px;
}
.mb-bun-bottom {
  width: 56px; height: 8px;
  background: #e8a24a;
  border-radius: 4px 4px 10px 10px;
  margin-top: -1px;
}
@keyframes cover-burger-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

.cover-title {
  font-family: var(--font-serif);
  font-size: 15px;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  animation: cover-title-pulse 2.4s ease-in-out infinite;
}
@keyframes cover-title-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
.cover-tip {
  font-size: 9px;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.45);
}
/* 封面淡出 */
.cover-fade-leave-active { transition: opacity 900ms ease; }
.cover-fade-leave-to { opacity: 0; }
</style>
