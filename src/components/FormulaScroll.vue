<script setup>
const assetsBase = import.meta.env.BASE_URL + 'assets/'

import { ref } from 'vue'
import { burgerLayers } from '../data/content.js'

const emit = defineEmits(['hover-layer', 'select-layer'])
const open = ref(false)
const hoverIndex = ref(-1)

function toggle() {
  open.value = !open.value
  // 音效由全局委托处理（展开 paper / 收起 click）
  // 防止按钮聚焦触发浏览器 scroll-into-view 导致页面跳动
  if (document.activeElement) document.activeElement.blur()
}
function onEnter(i) { hoverIndex.value = i; emit('hover-layer', i) }
function onLeave() { hoverIndex.value = -1; emit('hover-layer', -1) }
function onSelect(i) { emit('select-layer', i) }
</script>

<template>
  <div class="formula" :class="{ open }">
    <!-- 卷轴上方的图（未打开时显示，打开后收起；用外框高度过渡，避免 v-if 瞬间高度跳变导致页面抖动） -->
    <div class="scroll-top" :class="{ hide: open }">
      <img :src="assetsBase + 'scroll-top.png'" alt="" class="scroll-top-img" aria-hidden="true" />
    </div>

    <!-- 卷轴（点击展开/收起） -->
    <button class="formula-scroll" @click="toggle" :aria-expanded="open" aria-label="秘方卷轴">
      <div class="scroll-rod scroll-rod--top"></div>
      <div class="scroll-paper">
        <span class="scroll-title">SECRET<br />FORMULA</span>
        <span class="scroll-stamp mono-label">TOP SECRET</span>
      </div>
      <div class="scroll-rod scroll-rod--bottom"></div>
      <!-- 绳子 -->
      <svg class="scroll-string" viewBox="0 0 20 40" aria-hidden="true">
        <path d="M10 0 L10 18" stroke="var(--tomato)" stroke-width="1" fill="none"/>
        <path d="M10 22 L10 40" stroke="var(--tomato)" stroke-width="1" fill="none"/>
        <circle cx="10" cy="20" r="3" fill="none" stroke="var(--tomato)" stroke-width="1"/>
      </svg>
    </button>

    <!-- 打开后：从卷轴后方往左冒出的图 -->
    <transition name="pop-left">
      <img v-if="open" :src="assetsBase + 'scroll-out.png'" alt="" class="scroll-out-img" aria-hidden="true" />
    </transition>

    <!-- 展开面板：从纸卷里浮现（grid-rows + opacity 平滑过渡） -->
    <div class="formula-panel" :class="{ expanded: open }">
      <div class="panel-inner">
        <div class="formula-head">
          <span class="formula-head-label mono-label">THE KRABBY PATTY RECIPE</span>
        </div>
        <ul class="formula-list">
          <li
            v-for="(layer, i) in burgerLayers"
            :key="layer.id"
            class="formula-item"
            :class="{ hover: hoverIndex === i }"
            @mouseenter="onEnter(i)"
            @mouseleave="onLeave"
            @click="onSelect(i)"
            role="button"
            :tabindex="0"
          >
            <span class="formula-num mono-label">{{ layer.num }}</span>
            <span class="formula-dot" :style="{ background: layer.color }" aria-hidden="true"></span>
            <div class="formula-info">
              <span class="formula-name">{{ layer.name }}</span>
              <span class="formula-channel mono-label">{{ layer.channel }}</span>
            </div>
            <span class="formula-arrow" aria-hidden="true">→</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.formula {
  position: relative;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  width: clamp(200px, 22vw, 260px);
  animation: formula-bob 3.2s ease-in-out infinite;   /* 图片+卷轴一起浮动 */
}
@keyframes formula-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* ======== 卷轴 ======== */
.formula-scroll {
  display: flex; flex-direction: column; align-items: center;
  width: 100%; padding: 0; cursor: pointer;
  transition: transform var(--dur) var(--ease-spring);
  position: relative;
  z-index: 2;
}
.formula-scroll:hover { transform: scale(1.03); }

/* 卷轴上方的图（未打开时显示；外框高度过渡，收起时裁剪图片不被压扁） */
.scroll-top {
  position: relative;
  height: clamp(200px, 22vw, 264px);   /* 正方形图的高度，与宽度一致 */
  margin-bottom: -82px;                /* 卷轴上移，对齐图上的黑色横线（再上一点点） */
  overflow: hidden;                    /* 收起时裁剪，避免图片被纵向压扁 */
  z-index: 3;
  pointer-events: none;                /* 不拦截鼠标，hover 穿透到卷轴 */
  filter: drop-shadow(0 6px 12px rgba(26, 26, 24, 0.18));
  transition: height 450ms var(--ease-out), margin-bottom 450ms var(--ease-out);  /* 无 opacity 过渡：避免关闭时与 scroll-out 淡出叠加产生虚影 */
}
.scroll-top.hide {
  height: 0;
  margin-bottom: 0;
  opacity: 0;
}
.scroll-top-img {
  display: block;
  width: clamp(200px, 22vw, 264px);    /* 再大一倍 */
  height: clamp(200px, 22vw, 264px);   /* 固定高，随外框裁剪，不参与缩放 */
}

/* 打开后从卷轴后方往左冒出的图 */
.scroll-out-img {
  position: absolute;
  left: -190px;
  top: 38%;
  width: clamp(224px, 26vw, 300px);   /* 再大一倍 */
  z-index: 1;          /* 在卷轴(z2)后面冒出来 */
  filter: drop-shadow(0 8px 16px rgba(26, 26, 24, 0.2));
  pointer-events: none;
}
.pop-left-enter-active {
  transition: opacity 500ms ease, transform 650ms var(--ease-spring);
}
.pop-left-enter-from {
  opacity: 0;
  transform: translateX(42px) scale(0.9);   /* 从卷轴后方位置冒出 */
}
.pop-left-leave-active {
  transition: opacity 150ms ease, transform 180ms ease;   /* 快速缩回，减少与 scroll-top 展开的重叠 */
}
.pop-left-leave-to {
  opacity: 0;
  transform: translateX(-24px) scale(0.92);
}

.scroll-rod {
  width: 100%; height: 10px;
  background: var(--navy);
  border-radius: 5px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.2);
  transition: transform 480ms var(--ease-out);
}
.scroll-rod--top { margin-bottom: -2px; position: relative; z-index: 1; }
.scroll-rod--bottom { margin-top: -2px; position: relative; z-index: 1; }

/* 展开时：上下杆分离（纸被拉开） */
.formula.open .scroll-rod--top { transform: translateY(-7px); }
.formula.open .scroll-rod--bottom { transform: translateY(7px); }

.scroll-paper {
  width: 100%; min-height: 130px;
  background: var(--cream);
  border: 1.5px solid var(--ink-12);
  border-left: 3px solid var(--tomato);
  border-right: 3px solid var(--tomato);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; position: relative;
  box-shadow: 0 2px 10px rgba(26,26,24,0.06);
  transition: min-height 480ms var(--ease-out), background 480ms ease;
}

/* 展开时：纸面变高（接住面板） */
.formula.open .scroll-paper {
  min-height: 90px;
  background: var(--cream);
}

.scroll-title {
  font-family: var(--font-serif);
  font-size: 22px; line-height: 1.2;
  text-align: center; letter-spacing: 0.12em;
  color: var(--navy);
  transition: opacity 260ms ease, transform 260ms ease;
}
.formula.open .scroll-title {
  opacity: 0;
  transform: scale(0.9);
}

.scroll-stamp {
  position: absolute; right: -8px; top: 8px;
  font-size: 7px; color: var(--tomato);
  border: 1.5px solid var(--tomato); border-radius: 3px;
  padding: 2px 6px; transform: rotate(12deg);
  transition: opacity 260ms ease;
}
.formula.open .scroll-stamp { opacity: 0; }

.scroll-string {
  position: absolute; right: 12px; top: 8px;
  width: 16px; height: calc(100% - 16px); opacity: 0.7;
  transition: opacity 260ms ease;
}
.formula.open .scroll-string { opacity: 0; }

/* ======== 展开面板：纸卷里浮现 ======== */
.formula-panel {
  width: 100%;
  display: grid;
  grid-template-rows: 0fr;             /* 用 0fr→1fr 取代 max-height，收起无"假死延迟"、更平滑 */
  overflow: hidden;
  opacity: 0;
  transform: translateY(-8px);
  transition: grid-template-rows 520ms var(--ease-out), opacity 360ms ease 120ms, transform 520ms var(--ease-out);
}
.formula-panel.expanded {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}

.panel-inner {
  min-height: 0;                       /* grid 项可收缩到 0，配合 0fr 完全收起 */
  background: var(--cream);
  border: 1.5px solid var(--ink-12);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
  box-shadow: var(--shadow-card);
}

.formula-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 14px; background: var(--navy);
  color: var(--cream);
}
.formula-head-label { font-size: 8px; letter-spacing: 0.2em; }

.formula-list { list-style: none; padding: 6px 0; }

.formula-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; cursor: pointer;
  transition: background var(--dur-fast), transform var(--dur-fast);
  border-bottom: 1px solid var(--ink-08);
}
.formula-item:last-child { border-bottom: none; }
.formula-item.hover,
.formula-item:hover { background: var(--mustard-soft); transform: translateX(3px); }

.formula-num { font-size: 10px; color: var(--tomato); min-width: 20px; }
.formula-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.formula-info { display: flex; flex-direction: column; flex: 1; }
.formula-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.formula-channel { font-size: 7px; letter-spacing: 0.14em; color: var(--ink-50); }
.formula-arrow { color: var(--ink-30); transition: transform var(--dur-fast), color var(--dur-fast); }
.formula-item:hover .formula-arrow { transform: translateX(4px); color: var(--tomato); }
</style>
