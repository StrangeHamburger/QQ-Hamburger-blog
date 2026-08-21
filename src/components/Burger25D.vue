<script setup>
import { ref, watch, computed } from 'vue'
import { burgerLayers } from '../data/content.js'

const props = defineProps({
  activeLayer: { type: Number, default: -1 },
  tilt: { type: Object, default: () => ({ x: 0, y: 0 }) }
})

// 鼠标倾斜：把 tilt 角度转成 3D 透视变换
const tiltStyle = computed(
  () => `perspective(900px) rotateX(${props.tilt.x}deg) rotateY(${props.tilt.y}deg)`
)

// 写实汉堡 v2：更逼真形状 + 层间缝隙
// 尺寸（宽 / 高）
const LAYER_W = [268, 244, 228, 252, 220, 268]
const LAYER_H = [62, 26, 16, 38, 16, 36]

const selected = ref(-1)
watch(() => props.activeLayer, (v) => { selected.value = v })
</script>

<template>
  <div class="rb-tilt" :style="tiltStyle">
    <div class="real-burger" aria-label="汉堡剖面">
    <!-- 餐盘垫纸 -->
    <div class="rb-plate" aria-hidden="true"></div>
    <!-- 左右装饰 -->
    <div class="rb-deco rb-deco--left" aria-hidden="true"><span class="deco-anchor"></span></div>
    <div class="rb-deco rb-deco--right" aria-hidden="true"><span class="deco-star">✦</span></div>
    <!-- 热气 -->
    <div class="rb-steam" aria-hidden="true">
      <svg viewBox="0 0 60 40" class="steam-svg">
        <path d="M10 38 C 16 26, 6 20, 14 6" fill="none" stroke="rgba(26,26,24,0.12)" stroke-width="2" stroke-linecap="round"/>
        <path d="M30 38 C 36 26, 26 20, 34 6" fill="none" stroke="rgba(26,26,24,0.1)" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 38 C 56 26, 46 20, 54 6" fill="none" stroke="rgba(26,26,24,0.08)" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <!-- 地面投影 -->
    <div class="rb-shadow" aria-hidden="true"></div>

    <!-- 层（顶→底） -->
    <div
      v-for="(layer, i) in burgerLayers"
      :key="layer.id"
      class="rb-layer"
      :class="['layer--' + layer.shape, { selected: selected === i }]"
      :style="{ '--w': LAYER_W[i] + 'px', '--h': LAYER_H[i] + 'px', zIndex: selected === i ? 20 : 10 - i }"
    >
      <div class="rb-inner"></div>
      <!-- 层间分隔阴影（厚度感） -->
      <div class="rb-edge" aria-hidden="true"></div>
    </div>
    </div>
  </div>
</template>

<style scoped>
/* 倾斜外壳：鼠标跟随的 3D 透视，独立于浮动的 .real-burger */
.rb-tilt {
  width: 100%;
  height: 100%;
  transition: transform 300ms var(--ease-out);
  transform-style: preserve-3d;
}
.real-burger {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;  /* 顶面包→底面包 */
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  animation: burger-float 4.5s ease-in-out infinite;  /* 轻微浮动 */
}
@keyframes burger-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ======== 餐盘垫纸 ======== */
.rb-plate {
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 360px; height: 52px;
  border-radius: 50%;
  background:
    repeating-linear-gradient(45deg, rgba(224, 69, 46, 0.05) 0 10px, transparent 10px 20px),
    var(--cream);
  border: 2px solid var(--ink-12);
  box-shadow: 0 4px 0 var(--ink-12), 0 14px 28px rgba(26, 26, 24, 0.12);
  z-index: 0;
}

/* ======== 左右装饰 ======== */
.rb-deco {
  position: absolute;
  top: 32%;
  width: 76px; height: 76px;
  z-index: 0;
  opacity: 0.55;
  display: flex; align-items: center; justify-content: center;
}
.rb-deco--left {
  left: 4%;
  border: 2px dashed var(--mustard);
  border-radius: 50%;
  transform: rotate(-8deg);
}
.deco-anchor {
  width: 22px; height: 30px;
  border: 2.5px solid var(--mustard);
  border-top: none;
  border-radius: 0 0 10px 10px;
  position: relative;
}
.deco-anchor::before {
  content: '';
  position: absolute; top: -4px; left: 50%;
  transform: translateX(-50%);
  width: 26px; height: 8px;
  border: 2.5px solid var(--mustard);
  border-radius: 4px;
}
.rb-deco--right {
  right: 4%;
  border: 2px solid var(--tomato-soft);
  border-radius: 6px;
  transform: rotate(10deg);
}
.deco-star {
  font-size: 30px;
  color: var(--tomato);
  animation: star-twinkle 2.6s ease-in-out infinite;
}
@keyframes star-twinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.18) rotate(8deg); }
}

/* ======== 热气 ======== */
.rb-steam {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  z-index: 5;
  pointer-events: none;
  opacity: 0.8;
  animation: steam-rise 3.2s ease-in-out infinite;
}
.steam-svg { width: 100%; }
@keyframes steam-rise {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
  50% { transform: translateX(-50%) translateY(-6px); opacity: 0.9; }
}

.rb-shadow {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 310px; height: 30px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(26,26,24,0.22), transparent 70%);
  z-index: 1;
}

/* ======== 通用层 ======== */
.rb-layer {
  position: relative;
  width: var(--w);
  height: var(--h);
  margin: 2px 0;  /* 层间缝隙 */
  transition: transform 260ms var(--ease-spring);
  filter: drop-shadow(0 2px 2px rgba(26,26,24,0.1));
}

.rb-inner {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}

/* 选中：向右滑出（无边框） */
.rb-layer.selected {
  transform: translateX(46px) scale(1.06);
  filter: drop-shadow(0 4px 10px rgba(224,69,46,0.25));
  z-index: 30;
}

/* ======== 顶面包：高拱 + 芝麻 + 皮层质感 ======== */
.layer--bun-top .rb-inner {
  border-radius: 55% 55% 12px 12px / 92% 92% 12px 12px;
  background:
    /* 芝麻（带高光） */
    radial-gradient(circle at 24% 24%, #fff8e8 1.1px, rgba(255,244,215,0.9) 1.7px, transparent 2.4px),
    radial-gradient(circle at 54% 12%, #fff8e8 0.9px, rgba(255,244,215,0.9) 1.4px, transparent 2px),
    radial-gradient(circle at 40% 36%, #fff8e8 1px, rgba(255,244,215,0.9) 1.6px, transparent 2.2px),
    radial-gradient(circle at 72% 26%, #fff8e8 0.9px, rgba(255,244,215,0.9) 1.4px, transparent 2px),
    radial-gradient(circle at 14% 42%, #fff8e8 0.8px, rgba(255,244,215,0.9) 1.3px, transparent 1.9px),
    radial-gradient(circle at 84% 14%, #fff8e8 1px, rgba(255,244,215,0.9) 1.5px, transparent 2.1px),
    radial-gradient(circle at 62% 46%, #fff8e8 0.8px, rgba(255,244,215,0.9) 1.3px, transparent 1.9px),
    radial-gradient(circle at 34% 10%, #fff8e8 0.7px, rgba(255,244,215,0.9) 1.2px, transparent 1.8px),
    radial-gradient(circle at 90% 40%, #fff8e8 0.7px, rgba(255,244,215,0.9) 1.2px, transparent 1.8px),
    radial-gradient(circle at 48% 52%, #fff8e8 0.8px, rgba(255,244,215,0.9) 1.3px, transparent 1.9px),
    /* 皮层细孔 */
    radial-gradient(circle at 30% 70%, rgba(140, 85, 30, 0.12) 1px, transparent 1.6px),
    radial-gradient(circle at 68% 78%, rgba(140, 85, 30, 0.1) 1px, transparent 1.6px),
    radial-gradient(circle at 45% 88%, rgba(140, 85, 30, 0.08) 1px, transparent 1.6px),
    radial-gradient(circle at 82% 62%, rgba(140, 85, 30, 0.1) 0.8px, transparent 1.4px),
    radial-gradient(circle at 18% 82%, rgba(140, 85, 30, 0.09) 0.8px, transparent 1.4px),
    /* 主体渐变 */
    linear-gradient(180deg, #f2cc8f 0%, #e6b36c 40%, #d39a54 75%, #bf8444 100%);
  box-shadow:
    inset 0 5px 7px rgba(255,255,255,0.45),
    inset 0 -4px 6px rgba(120,70,20,0.3);
}

/* ======== 生菜：双层波浪 + 叶脉 ======== */
.layer--lettuce .rb-inner {
  background:
    /* 叶脉（斜向浅条纹） */
    repeating-linear-gradient(
      100deg,
      rgba(255, 255, 255, 0.14) 0 2px,
      transparent 2px 9px
    ),
    linear-gradient(180deg, #8cc96b, #5d9b42 85%);
  clip-path: polygon(
    0 30%, 5% 12%, 10% 26%, 16% 8%, 22% 24%, 28% 6%,
    34% 22%, 41% 5%, 47% 20%, 53% 4%, 59% 20%, 65% 6%,
    71% 22%, 78% 8%, 84% 24%, 90% 10%, 95% 26%, 100% 14%,
    100% 100%, 0 100%
  );
  box-shadow: inset 0 -4px 5px rgba(30, 60, 20, 0.35);
}
/* 生菜卷边高光 */
.layer--lettuce .rb-inner::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.35), transparent 40%);
  clip-path: inherit;
}

/* ======== 芝士：融化滴落 + 光泽 ======== */
.layer--cheese .rb-inner {
  background: linear-gradient(180deg, #fbd876, #f0ba3f);
  clip-path: polygon(
    0 0, 100% 0, 100% 55%,
    92% 88%, 86% 60%, 76% 100%, 68% 58%,
    56% 88%, 46% 55%, 36% 100%, 26% 58%,
    16% 90%, 8% 60%, 0 88%, 0 55%
  );
  box-shadow: inset 0 2px 3px rgba(255,255,255,0.55);
}
.layer--cheese .rb-inner::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent 42%);
  clip-path: inherit;
}

/* ======== 肉饼：厚实糙面 + 焦边 ======== */
.layer--patty .rb-inner {
  border-radius: 12px 12px 26% 26%;
  background:
    radial-gradient(circle at 20% 30%, rgba(0,0,0,0.14) 2px, transparent 3px),
    radial-gradient(circle at 65% 22%, rgba(0,0,0,0.12) 1.8px, transparent 2.8px),
    radial-gradient(circle at 42% 58%, rgba(0,0,0,0.13) 2px, transparent 3px),
    radial-gradient(circle at 80% 50%, rgba(0,0,0,0.11) 1.6px, transparent 2.6px),
    radial-gradient(circle at 10% 66%, rgba(0,0,0,0.1) 1.8px, transparent 2.8px),
    radial-gradient(circle at 55% 80%, rgba(255,255,255,0.06) 2px, transparent 3px),
    linear-gradient(180deg, #b07a50 0%, #8a5936 55%, #6d4226 100%);
  box-shadow:
    inset 0 4px 5px rgba(255,255,255,0.2),
    inset 0 2px 0 rgba(40, 20, 5, 0.28),      /* 焦化顶边 */
    inset 0 -5px 7px rgba(30,15,5,0.42);
}

/* ======== 番茄片：光泽环 ======== */
.layer--tomato .rb-inner {
  border-radius: 10px 10px 22% 22%;
  background: radial-gradient(circle at 50% 55%, #ec7a58 0%, #d9483c 55%, #a82f26 100%);
  box-shadow:
    inset 0 0 0 3px rgba(255, 170, 140, 0.55),
    inset 0 2px 3px rgba(255, 255, 255, 0.22),
    inset 0 -3px 4px rgba(90, 15, 10, 0.35);
}

/* ======== 底面包：皮层质感 ======== */
.layer--bun-bottom .rb-inner {
  border-radius: 12px 12px 32% 32%;
  background:
    radial-gradient(circle at 30% 70%, rgba(140, 85, 30, 0.1) 1px, transparent 1.6px),
    radial-gradient(circle at 70% 80%, rgba(140, 85, 30, 0.09) 1px, transparent 1.6px),
    radial-gradient(circle at 50% 88%, rgba(140, 85, 30, 0.08) 1px, transparent 1.6px),
    linear-gradient(180deg, #e6b977, #d19a55 70%, #c0894a 100%);
  box-shadow:
    inset 0 4px 5px rgba(255,255,255,0.4),
    inset 0 -6px 8px rgba(120, 70, 20, 0.38);
}

/* ======== 层间分隔阴影（厚度感） ======== */
.rb-edge {
  position: absolute;
  left: 2%; right: 2%;
  bottom: -3px;
  height: 5px;
  border-radius: 50%;
  background: rgba(26, 26, 24, 0.14);
  filter: blur(1px);
  pointer-events: none;
}
.rb-layer:last-child .rb-edge { display: none; }
</style>
