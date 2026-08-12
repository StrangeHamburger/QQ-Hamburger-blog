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

onMounted(async () => {
  const { createKrustyScene } = await import('../three/krustyScene.js')
  scene = createKrustyScene(hostRef.value, {
    onArrive: () => emit('arrive'),
    onLeave: () => emit('leave'),
    getPortal
  })
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

/* 提示淡出 */
.hint-enter-active,
.hint-leave-active { transition: opacity 0.8s ease, transform 0.8s ease; }
.hint-enter-from,
.hint-leave-to { opacity: 0; transform: translateY(8px); }
</style>
