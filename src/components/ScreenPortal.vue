<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { setPortal } from '../three/portalRef.js'
import PageHome from './PageHome.vue'

const props = defineProps({
  phase: { type: String, default: 'intro' } // 'intro' | 'home'
})

const elRef = ref(null)

onMounted(() => {
  // 注册门户元素：krustyScene 每帧用 matrix3d 把它对齐到 3D 屏幕
  setPortal(elRef.value)
})
onBeforeUnmount(() => {
  setPortal(null)
})
</script>

<template>
  <div
    ref="elRef"
    class="screen-portal"
    :class="{ visible: props.phase === 'home' }"
  >
    <div class="portal-boot">
      <div class="portal-scroll">
        <PageHome embedded />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * .screen-portal 是"被 3D 投影"的元素：固定 1280×1280，位于视口左上角，
 * krustyScene 每帧把它的 4 角投影成屏幕像素，写入 matrix3d。
 * 因此这里不能有任何影响 transform 的样式（transform-origin: 0 0 由场景写）。
 */
.screen-portal {
  position: fixed;
  top: 0;
  left: 0;
  width: 1280px;
  height: 730px;   /* ≈1.75:1，匹配 3D 屏幕 3.26×1.86，投影后内容不变形 */
  will-change: transform;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 1;
}

/* 引导层：淡入 + 轻微放大（"启动进入桌面"），不覆盖外层 matrix */
.portal-boot {
  position: absolute;
  inset: 0;
  transform: scale(0.94);
  opacity: 0;
  transform-origin: 50% 50%;
  transition: transform 0.85s var(--ease-out), opacity 0.85s var(--ease-out);
  background: var(--paper);
}
.screen-portal.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.screen-portal.visible .portal-boot {
  transform: scale(1);
  opacity: 1;
}

/* 内嵌站点滚动容器 */
.portal-scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  overflow-anchor: none;   /* 禁用滚动锚定：卷轴开合改变内容高度时，防止浏览器自动调整 scrollTop 造成页面上下抖动 */
  background: var(--paper);
  -webkit-overflow-scrolling: touch;
}
</style>
