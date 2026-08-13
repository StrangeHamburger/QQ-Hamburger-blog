<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MobileHome from './components/MobileHome.vue'
import KrustyScene from './components/KrustyScene.vue'
import ScreenPortal from './components/ScreenPortal.vue'
import { initGlobalClickSound } from './utils/sound.js'

// 全局点击音效（深海餐厅主题，按元素自动选音）
onMounted(initGlobalClickSound)

// 图片预加载：页面加载完成即提前拉取未挂载 DOM 的图片（敬请期待/彩蛋/卷轴冒图等），
// 用户滚动到对应区域时图片已在缓存里，秒开
onMounted(() => {
  const preloadList = [
    'scroll-out.webp', 'soon.webp',
    'fx-1.webp', 'fx-2.webp', 'fx-3.webp', 'fx-4.webp',
    'hobby-sport.webp', 'hobby-game.webp'
  ]
  preloadList.forEach((u) => {
    const img = new Image()
    img.src = import.meta.env.BASE_URL + 'assets/' + u
  })
})

// 移动端直接显示网站页面，不进入 3D 房间场景（性能 + 交互适配）
const isMobile = ref(false)
let mq = null
function syncIsMobile() {
  isMobile.value = mq ? mq.matches : window.innerWidth <= 768
}
onMounted(() => {
  mq = window.matchMedia('(max-width: 768px)')
  syncIsMobile()
  mq.addEventListener('change', syncIsMobile)
})
onBeforeUnmount(() => {
  if (mq) mq.removeEventListener('change', syncIsMobile)
})

// 'intro'：3D 场景远观，等待点击笔记本（仅桌面端）
// 'home' ：相机已飞到笔记本前，DOM 门户（内嵌主站）淡入，常驻
const phase = ref('intro')

function onArrive() {
  phase.value = 'home'
}

function onLeave() {
  phase.value = 'intro'
}
</script>

<template>
  <!-- 移动端：跳过 3D 场景，直接显示网站页面（适配集中在 MobileHome.vue） -->
  <MobileHome v-if="isMobile" />

  <!-- 桌面端：3D 房间 → 点笔记本 → 门户投影进入网站 -->
  <template v-else>
    <KrustyScene :phase="phase" @arrive="onArrive" @leave="onLeave" />
    <ScreenPortal :phase="phase" />
  </template>
</template>
