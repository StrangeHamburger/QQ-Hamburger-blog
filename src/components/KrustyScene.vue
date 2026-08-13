<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { profile } from '../data/content.js'
import { getPortal } from '../three/portalRef.js'
import coverImg from '../assets/intro-cover.jpg'   // 3D 加载封面图

const props = defineProps({
  phase: { type: String, default: 'intro' } // 'intro' | 'home'
})
const emit = defineEmits(['arrive', 'leave'])

const hostRef = ref(null)
let scene = null

// 封面：3D 渲染完成后短暂停留再淡出（coverDone=true 触发 transition 移除）
const coverDone = ref(false)
const coverSrc = coverImg

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

    <!-- 3D 加载封面：渲染完成后淡出切换成 3D 场景 -->
    <transition name="cover-fade">
      <div v-if="!coverDone" class="krusty-cover" aria-hidden="true">
        <img :src="coverSrc" alt="" />
        <span class="cover-tip mono-label">DEEP SEA RESTAURANT · LOADING</span>
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
  background: #0f1d2e;              /* 图加载前的底色（深海蓝黑） */
  display: flex;
  align-items: center;
  justify-content: center;
}
.krusty-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-tip {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
  letter-spacing: 0.35em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}
/* 封面淡出 */
.cover-fade-leave-active { transition: opacity 900ms ease; }
.cover-fade-leave-to { opacity: 0; }
</style>
