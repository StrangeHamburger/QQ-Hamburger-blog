<script setup>
import { onMounted } from 'vue'
import { initGlobalClickSound } from './utils/sound.js'

// 全局点击音效（深海餐厅主题，按元素自动选音；首页/项目详情页都生效）
onMounted(initGlobalClickSound)
</script>

<template>
  <router-view />
</template>
