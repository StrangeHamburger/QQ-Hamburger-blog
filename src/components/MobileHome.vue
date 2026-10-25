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

/* hero 单列堆叠：名字/邮箱 → 收银机 → 按钮（收银机已在文档流里，无需位移补丁） */
:deep(.hero-actions) {
  margin-top: 28px;
  position: relative;
  z-index: 30;         /* 按钮不透明实色，盖住任何背景图案 */
}

/* 排版微调 v3.1：名字→邮箱 26px（原 20px 偏紧） */
:deep(.hero-tagline) {
  margin-top: 26px;
}

:deep(.hero-actions .btn) {
  background: var(--tomato);   /* 查看汉堡秘方：实色不透明 */
}
:deep(.hero-actions .btn-ghost) {
  background: var(--cream);    /* 看看项目：白底实色（原透明底改为实色） */
}

/* 收银机招牌英语缩小（170px 宽下 15px 字会溢出） */
:deep(.mc-sign-text) {
  font-size: 11px;
}

/* 手机端隐藏 hero 波浪装饰（在按钮后面透出，显得乱） */
:deep(.hero-wave) {
  display: none;
}

/* 食材来源气泡：面包顶正上方（舞台 380 高，面包顶在 244px 处），不遮挡汉堡 */
:deep(.ingredient-tip) {
  right: -8px;
  bottom: 252px;
  width: 196px;
}

/* 小鱼群：手机端 hero 布局不同，挪到按钮右侧空白区（原左下会被裁切） */
:deep(.hero-fish) {
  left: auto;
  right: 6%;
  bottom: 2.5%;
  width: 92px;
}

/* 左下角海草：手机端空间被收银台/按钮占满，上移会与按钮重叠，隐藏 */
:deep(.hero-seaweed) {
  display: none;
}

/* 卷轴展开后向侧面冒出的装饰图：手机端没有侧向空间，会压住列表行，直接隐藏 */
:deep(.scroll-out-img) {
  display: none;
}

/* 手机端：卷轴未打开时，图上黑线与卷轴边缘重合（200px 图时黑线在 137px 处） */
:deep(.scroll-top) {
  margin-bottom: -63px;
}

/* 凤凰彩蛋元素：跟随收银机（absolute 相对收银机；桌面端基座样式已是右下落点，
   这里只缩小尺寸、微调间距适配窄屏） */
:deep(.fx-phenix) {
  left: 190px;
  bottom: -20px;
  width: 120px;
}
:deep(.fx-bubble) {
  left: 204px;
  bottom: 116px;
  width: 130px;
  font-size: 12px;
}
:deep(.fx-bubble.hint) {
  left: 204px;
  bottom: 110px;
  top: auto;
}

/* 手机端气泡箭头：尖尖指向下面 */
:deep(.fx-bubble::after) {
  left: 30px;
  top: 100%;
  border: 9px solid transparent;
  border-top-color: var(--ink);
  border-left-color: transparent;
  border-right-color: transparent;
}
/* 手机端：hint 气泡尖尖同样朝下（指向收银机屏幕） */
:deep(.fx-bubble.hint::after) {
  left: 30px;
  right: auto;
  top: 100%;
  border: 9px solid transparent;
  border-top-color: var(--ink);
  border-right-color: transparent;
}
</style>
