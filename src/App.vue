<script setup>
import { ref, onMounted } from 'vue'
import KrustyScene from './components/KrustyScene.vue'
import ScreenPortal from './components/ScreenPortal.vue'
import { initGlobalClickSound } from './utils/sound.js'

// 全局点击音效（深海餐厅主题，按元素自动选音）
onMounted(initGlobalClickSound)

// 'intro'：3D 场景远观，等待点击笔记本
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
  <KrustyScene :phase="phase" @arrive="onArrive" @leave="onLeave" />
  <ScreenPortal :phase="phase" />
</template>
