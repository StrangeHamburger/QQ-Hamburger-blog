<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MobileHome from './components/MobileHome.vue'
import KrustyScene from './components/KrustyScene.vue'
import ScreenPortal from './components/ScreenPortal.vue'
import { getPortal, portalDeepestAt } from './three/portalRef.js'
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
// 初始值在 setup 阶段同步判断（window 客户端可用），避免首帧误渲染桌面 3D 分支
const isMobile = ref(window.innerWidth <= 768)
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

// ===== 门户点击/滚轮 overlay =====
// 门户是透视投影（matrix3d 非仿射变换），Chrome 对它的 hit-test 失效（滚动偏移未应用），
// elementFromPoint 返回 canvas 而非门户内容。因此用一个无变换的全屏透明层接管指针：
//   - 点击门户内元素（getBoundingClientRect 手动命中）→ 转发 click 给该元素
//   - 点击门户外 → 派发 portal-outside-click（场景监听后飞回远观）
//   - 滚轮 → 转发给 .portal-scroll（保持门户内滚动）
function onPortalHit(e) {
  const portal = getPortal()
  if (!portal) return
  const target = portalDeepestAt(portal, e.clientX, e.clientY)
  if (target && target !== portal) {
    target.dispatchEvent(new MouseEvent('click', {
      bubbles: true, cancelable: true, view: window,
      clientX: e.clientX, clientY: e.clientY
    }))
  } else {
    window.dispatchEvent(new CustomEvent('portal-outside-click'))
  }
}
function onPortalWheel(e) {
  // 弹窗打开时：滚轮滚弹窗内部（.pm-body），否则滚门户主体
  const modalBody = document.querySelector('.project-modal .pm-body')
  if (modalBody) {
    const prev = modalBody.style.scrollBehavior
    modalBody.style.scrollBehavior = 'auto'
    modalBody.scrollTop += e.deltaY
    modalBody.style.scrollBehavior = prev
    e.preventDefault()
    return
  }
  // 频道抽屉（汉堡秘方右侧滑出的栏目，如 GitHub）打开时：滚抽屉内容，而不是滚页面
  const drawerBody = document.querySelector('.drawer.open .drawer-body')
  if (drawerBody) {
    const prev = drawerBody.style.scrollBehavior
    drawerBody.style.scrollBehavior = 'auto'
    drawerBody.scrollTop += e.deltaY
    drawerBody.style.scrollBehavior = prev
    e.preventDefault()
    return
  }
  const ps = document.querySelector('.screen-portal .portal-scroll')
  if (ps) {
    // 临时关掉 scroll-behavior: smooth——增量滚轮与 smooth 动画互相打断（滚不动/卡顿）
    const prev = ps.style.scrollBehavior
    ps.style.scrollBehavior = 'auto'
    ps.scrollTop += e.deltaY
    ps.style.scrollBehavior = prev
    e.preventDefault()
  }
}
</script>

<template>
  <!-- 移动端：跳过 3D 场景，直接显示网站页面（适配集中在 MobileHome.vue） -->
  <MobileHome v-if="isMobile" />

  <!-- 桌面端：3D 房间 → 点笔记本 → 门户投影进入网站 -->
  <template v-else>
    <KrustyScene :phase="phase" @arrive="onArrive" @leave="onLeave" />
    <ScreenPortal :phase="phase" />
    <!-- 门户 overlay：接管点击/滚轮（见 onPortalHit/onPortalWheel 注释） -->
    <div v-if="phase === 'home'" class="portal-hit" @click="onPortalHit" @wheel="onPortalWheel"></div>
  </template>
</template>

<style>
/* 门户交互 overlay：全屏透明、无 transform（hit-test 正常），z 高于 portal(1)/场景(0) */
.portal-hit {
  position: fixed;
  inset: 0;
  z-index: 10;
  cursor: default;
}
</style>
