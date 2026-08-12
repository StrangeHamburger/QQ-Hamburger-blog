<script setup>
// 移动端入口：直接显示网站主页（跳过 3D 房间场景）
// 所有移动端专属适配集中在本文件，桌面端组件保持纯净
import PageHome from './PageHome.vue'
</script>

<template>
  <PageHome />
</template>

<style scoped>
/* ========== 移动端适配（集中在此，:deep 覆盖子组件桌面样式） ========== */

/* hero 重排：名字 → tagline → [收银台 absolute] → 按钮（数据条已删，下移量合并到按钮） */
:deep(.hero-actions) {
  margin-top: 336px;   /* 按钮整体往下移（避开收银台 + 一个身位） */
  position: relative;
  z-index: 30;         /* 图层最上层：按钮不透明实色，盖住任何背景图案 */
}
:deep(.hero-actions .btn) {
  background: var(--tomato);   /* 查看汉堡秘方：实色不透明 */
}
:deep(.hero-actions .btn-ghost) {
  background: var(--cream);    /* 看看项目：白底实色（原透明底改为实色） */
}

/* 收银台招牌英语缩小（170px 宽下 15px 字会溢出） */
:deep(.mc-sign-text) {
  font-size: 11px;
}

/* 左下角海草：手机端空间被收银台/按钮占满，上移会与按钮重叠，隐藏 */
:deep(.hero-seaweed) {
  display: none;
}

/* 卷轴打开后的左侧冒出图：手机端收窄 + 往左移四分之一个身位（45px） */
:deep(.scroll-out-img) {
  left: 130px;
  width: 180px;
}

/* 收银台：固定在页面左侧随滚动（absolute 相对 .home），形状与电脑端一致 */
:deep(.mini-computer) {
  position: absolute;
  left: 12px;
  right: auto;
  top: 240px;
  width: clamp(170px, 20vw, 225px);
  z-index: 60;
}

/* 凤凰彩蛋元素：跟随收银台（absolute 相对收银台，在右侧；往下移一个凤凰身位 120px） */
:deep(.fx-phenix) {
  position: absolute;
  left: 190px;
  right: auto;
  top: auto;
  bottom: -20px;
  width: 120px;
}
:deep(.fx-bubble) {
  position: absolute;
  left: 204px;
  right: auto;
  top: auto;
  bottom: 110px;
  width: 130px;
  font-size: 12px;
}
:deep(.fx-bubble.hint) {
  left: 204px;
  right: auto;
  top: auto;
  bottom: 110px;
}

/* 手机端：hint 气泡（"你可以试试…"）的尖尖指向左边（border-right 实色=尖端朝左） */
:deep(.fx-bubble.hint::after) {
  left: auto;
  right: 100%;
  top: 28px;
  border: 9px solid transparent;
  border-right-color: var(--ink);
}
/* 手机端：所有对话气泡（talk）往下移八分之一个身位（~19px，含"你好"） */
:deep(.fx-bubble:not(.hint)) {
  bottom: 116px;
}

/* 手机端气泡箭头：talk 尖尖指向下面（改回） */
:deep(.fx-bubble::after) {
  left: 30px;
  top: 100%;
  border: 9px solid transparent;
  border-top-color: var(--ink);
  border-left-color: transparent;
  border-right-color: transparent;
}
</style>
