<script setup>
import { ref } from 'vue'
import { photos } from '../data/content.js'

// 红色按钮：开关屏幕；蓝色按钮：换图片（不影响开关）
const screenOn = ref(false)
const photoIndex = ref(0)

function toggleScreen() { screenOn.value = !screenOn.value }
function nextPhoto() {
  if (photos.length < 2) return
  photoIndex.value = (photoIndex.value + 1) % photos.length
}
</script>

<template>
  <div class="mini-computer" :class="{ 'screen-on': screenOn }">
    <div class="box">
      <!-- 屏幕（显示当前照片） -->
      <div class="mc-screen">
        <img :src="photos[photoIndex]" alt="屏幕照片" class="mc-photo" :class="{ 'zoom-first': photoIndex === 0 }" />
        <div class="mc-scan" aria-hidden="true"></div>
        <!-- 故障效果层（仅关闭时显示） -->
        <div class="glitch-noise" aria-hidden="true"></div>
        <div class="glitch-noise-2" aria-hidden="true"></div>
        <!-- 小块碎片（替代长条） -->
        <div class="glitch-chip chip-1" aria-hidden="true"></div>
        <div class="glitch-chip chip-2" aria-hidden="true"></div>
        <div class="glitch-chip chip-3" aria-hidden="true"></div>
        <div class="glitch-chip chip-4" aria-hidden="true"></div>
        <div class="glitch-chip chip-5" aria-hidden="true"></div>
        <div class="glitch-chip chip-6" aria-hidden="true"></div>
        <span class="mc-boot off" v-if="!screenOn">SIGNAL LOST</span>
        <span class="mc-boot on" v-else>BOOT OK</span>
      </div>

      <!-- 红蓝按钮 -->
      <div class="mc-buttons">
        <button
          class="mc-btn btn-red"
          :class="{ active: screenOn }"
          @click="toggleScreen"
          :aria-label="screenOn ? '关闭屏幕' : '打开屏幕'"
        >
          <span class="btn-dot" aria-hidden="true"></span>
          <span class="btn-label mono-label">{{ screenOn ? 'POWER ON' : 'POWER' }}</span>
        </button>
        <button
          class="mc-btn btn-blue"
          @click="nextPhoto"
          :disabled="photos.length < 2"
          aria-label="切换图片"
        >
          <span class="btn-dot" aria-hidden="true"></span>
          <span class="btn-label mono-label">PHOTO</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-computer {
  position: absolute;
  right: 492px; top: 278px;  /* 右移1/3身位（right 减小 83px） */
  z-index: 40;
  width: clamp(190px, 22vw, 250px);  /* 再放大 */
  transition: transform var(--dur) var(--ease-spring);
}
.mini-computer:hover { transform: translateY(-4px); }

.box {
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 5px 0 var(--ink-12), 0 14px 30px rgba(26,26,24,0.22);
}

/* ======== 屏幕 ======== */
.mc-screen {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #101010;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
}
.mc-photo {
  width: 100%; height: 100%;
  object-fit: contain;
  opacity: 0.13;
  filter: brightness(0.4);
  transition: opacity var(--dur) var(--ease-out), filter var(--dur) var(--ease-out), transform var(--dur) var(--ease-out);
}
/* 第一张图放大一点点（1%） */
.mc-photo.zoom-first { transform: scale(1.01); }
.screen-on .mc-photo { opacity: 1; filter: brightness(1); }

.mc-scan {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.035) 0 1px,
    transparent 1px 3px
  );
  pointer-events: none;
}

.mc-boot {
  position: absolute;
  bottom: 4px; left: 6px;
  font-size: 6px;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.4);
  font-family: var(--font-mono);
}
.mc-boot.on { display: none; }
.screen-on .mc-boot.off { display: none; }
.screen-on .mc-boot.on { display: block; }

/* ======== 故障效果（仅关闭时，无长条横线） ======== */
.glitch-noise,
.glitch-noise-2 {
  position: absolute;
  display: none;
}

/* 雪花噪点 1（粗，快跳） */
.mini-computer:not(.screen-on) .glitch-noise {
  display: block;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 90px 90px;
  opacity: 0.45;
  pointer-events: none;
  animation: glitch-noise-jump 0.28s steps(4) infinite;
}

/* 雪花噪点 2（细密，反向慢跳） */
.mini-computer:not(.screen-on) .glitch-noise-2 {
  display: block;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='40' height='40' filter='url(%23n2)'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  opacity: 0.3;
  pointer-events: none;
  animation: glitch-noise-jump2 0.45s steps(5) infinite reverse;
}
@keyframes glitch-noise-jump {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-7%, 5%); }
  50% { transform: translate(5%, -6%); }
  75% { transform: translate(-4%, 7%); }
  100% { transform: translate(0, 0); }
}
@keyframes glitch-noise-jump2 {
  0% { transform: translate(0, 0); }
  30% { transform: translate(9%, -7%); }
  60% { transform: translate(-6%, 8%); }
  100% { transform: translate(4%, -3%); }
}

/* 小块碎片（短小色块乱窜闪现） */
.glitch-chip {
  position: absolute;
  display: none;
  mix-blend-mode: screen;
  pointer-events: none;
}
.mini-computer:not(.screen-on) .glitch-chip { display: block; }

.chip-1 { width: 26px; height: 6px;  left: 10%; top: 24%; background: rgba(224, 69, 46, 0.38);   animation: chip-a 0.8s steps(2) infinite; }
.chip-2 { width: 16px; height: 5px;  left: 66%; top: 34%; background: rgba(70, 130, 220, 0.35);  animation: chip-b 1s steps(2) infinite; }
.chip-3 { width: 34px; height: 7px;  left: 28%; top: 56%; background: rgba(70, 200, 180, 0.32);  animation: chip-c 0.7s steps(2) infinite; }
.chip-4 { width: 12px; height: 4px;  left: 78%; top: 72%; background: rgba(255, 255, 255, 0.22); animation: chip-a 1.2s steps(2) infinite reverse; }
.chip-5 { width: 20px; height: 5px;  left: 44%; top: 42%; background: rgba(224, 69, 46, 0.32);   animation: chip-b 0.9s steps(2) infinite reverse; }
.chip-6 { width: 28px; height: 6px;  left: 6%;  top: 82%; background: rgba(70, 130, 220, 0.3);   animation: chip-c 1.1s steps(2) infinite; }

@keyframes chip-a {
  0%, 100% { transform: translateX(0); opacity: 0; }
  28% { transform: translateX(10px); opacity: 1; }
  55% { transform: translateX(-7px); opacity: 0.6; }
  72% { transform: translateX(3px); opacity: 0; }
}
@keyframes chip-b {
  0%, 100% { transform: translateY(0); opacity: 0; }
  35% { transform: translateY(8px) translateX(-5px); opacity: 1; }
  60% { transform: translateY(-5px); opacity: 0.5; }
  78% { transform: translateY(2px); opacity: 0; }
}
@keyframes chip-c {
  0%, 100% { transform: translateX(0) scale(1); opacity: 0; }
  30% { transform: translateX(-9px) scale(1.1); opacity: 1; }
  58% { transform: translateX(5px) scale(0.9); opacity: 0.4; }
  75% { transform: translateX(-2px); opacity: 0; }
}

/* 照片 RGB 分离（关闭时照片也故障） */
.mini-computer:not(.screen-on) .mc-photo {
  filter: brightness(0.32)
    drop-shadow(2.5px 0 0 rgba(255, 40, 40, 0.4))
    drop-shadow(-2.5px 0 0 rgba(60, 140, 255, 0.4));
  animation: img-glitch 1.1s steps(2) infinite;
}
@keyframes img-glitch {
  0%, 100% { transform: translateX(0); }
  47% { transform: translateX(-2px); }
  49% { transform: translateX(2px); }
  51% { transform: translateX(0); }
}

/* 屏幕整体闪烁 + 横抖 */
.mini-computer:not(.screen-on) .mc-screen {
  animation: screen-flicker 1.5s linear infinite, screen-shake 2.7s steps(2) infinite;
}
@keyframes screen-flicker {
  0%, 100% { opacity: 1; }
  88% { opacity: 1; }
  89% { opacity: 0.5; }
  90% { opacity: 1; }
  94% { opacity: 0.75; }
  95% { opacity: 1; }
}
@keyframes screen-shake {
  0%, 100% { transform: translateX(0); }
  44% { transform: translateX(0); }
  45% { transform: translateX(-3px); }
  46% { transform: translateX(3px); }
  47% { transform: translateX(-2px); }
  48% { transform: translateX(0); }
}

/* SIGNAL LOST 文字抖动 */
.mini-computer:not(.screen-on) .mc-boot.off {
  animation: boot-jitter 0.45s steps(2) infinite;
  color: rgba(255, 120, 100, 0.65);
  text-shadow: 1px 0 0 rgba(255, 40, 40, 0.6), -1px 0 0 rgba(60, 140, 255, 0.6);
}
@keyframes boot-jitter {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(1.5px); }
}

/* ======== 红蓝按钮 ======== */
.mc-buttons {
  display: flex; gap: 8px;
  margin-top: 8px;
}

.mc-btn {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  border-radius: 999px;
  padding: 7px 4px;
  border: 2px solid var(--ink);
  transition: transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast), opacity var(--dur-fast);
  cursor: pointer;
}
.mc-btn:hover { transform: translateY(-2px); }
.mc-btn:active { transform: translateY(0); }
.mc-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

.btn-red {
  background: var(--tomato);
  box-shadow: 0 3px 0 var(--ink-12);
}
.btn-red.active {
  background: var(--mustard);
}

.btn-blue {
  background: var(--navy);
  box-shadow: 0 3px 0 var(--ink-12);
}

.btn-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--cream);
  flex-shrink: 0;
}
.btn-label {
  font-size: 7px;
  color: var(--cream);
  letter-spacing: 0.1em;
}
</style>
