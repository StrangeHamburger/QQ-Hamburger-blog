<script setup>
const assetsBase = import.meta.env.BASE_URL + 'assets/'

import { ref } from 'vue'
import { photos } from '../data/content.js'
import { playSound } from '../utils/sound.js'

// 照片雪碧图：6 张合成 1 张（请求数 6→1，手机端加载更快），切换用 object-position 切片
const spritePhoto = import.meta.env.BASE_URL + 'assets/sprite-photos.webp'

// ============================================================
// 复古收银机 + 凤凰丁神奶彩蛋 v2
// 触发：红+蓝按钮各点一次 → 3 秒后气泡提示（尖尖指收银台）
// → 连点屏幕 3 次 → 屏幕碎裂（保持坏到对话结束）
// → 凤凰从右登场（尖尖指凤凰）→ 点击凤凰推进对话
// → 最后一击 → 凤凰返回 → 屏幕恢复
// ============================================================

const screenOn = ref(false)
const photoIndex = ref(0)

// ============ 凤凰彩蛋（集中配置） ============
const EGG_HINT = '你可以试试连续点击三次屏幕'
const EGG_WORDS = [
  { img: 2, text: '你好，我是凤凰丁神奶，是你召唤了我，我将要你帮我实现三个愿望' },
  { img: 3, text: '首先，请v我50块让我星期四能给你进行恳德基的祝福仪式' },
  { img: 3, text: '然后，我需要你在一分钟之内做六百个后空翻，锻炼你的身体' },
  { img: 3, text: '最后，我需要你去下面汉堡包那里留言，让你赛博永生' },
  { img: 4, text: '拴Q，boy里嘛糍！！！' }
]

// 状态机：idle → hint → breaking → enter → talk → bye → idle
const eggState = ref('idle')
const clickedBtns = new Set()
const screenClicks = ref(0)
const talkIndex = ref(-1)
const fxImg = ref(1)
const fxVisible = ref(false)
const bubbleVisible = ref(false)
const bubbleText = ref('')
let hintTimer = null

// 屏幕是否处于"坏"状态（碎裂后一直保持）
const screenBroken = computed(() =>
  ['breaking', 'enter', 'talk', 'bye'].includes(eggState.value)
)

// ============ 基础功能 ============
function toggleScreen() { screenOn.value = !screenOn.value }
function nextPhoto() { photoIndex.value = (photoIndex.value + 1) % photos.length }

function onRed() { toggleScreen(); noteButton('red') }
function onBlue() { nextPhoto(); noteButton('blue') }

function noteButton(which) {
  if (eggState.value !== 'idle') return
  clickedBtns.add(which)
  if (clickedBtns.size >= 2) {
    hintTimer = setTimeout(() => {
      if (eggState.value !== 'idle') return
      playSound('mystery')
      eggState.value = 'hint'
      bubbleText.value = EGG_HINT
      bubbleVisible.value = true
    }, 1000)   // 间隔 1 秒
  }
}

// 屏幕点击：仅 hint 阶段连点 3 次（音效由全局委托处理）
function onScreenClick() {
  if (eggState.value !== 'hint') return
  screenClicks.value++
  if (screenClicks.value >= 3) startBreaking()
}

// 凤凰点击：talk 阶段推进对话（音效由全局委托处理）
function onPhenixClick() {
  if (eggState.value === 'talk') advanceTalk()
}

// 屏幕碎裂 → 凤凰登场
function startBreaking() {
  playSound('crash')
  bubbleVisible.value = false
  eggState.value = 'breaking'
  setTimeout(() => {
    playSound('horn')   // 登场号角
    eggState.value = 'enter'
    fxImg.value = 1
    fxVisible.value = true
    setTimeout(() => {
      showBubble(0)
      eggState.value = 'talk'
    }, 950)
  }, 950)
}

function showBubble(i) {
  talkIndex.value = i
  bubbleText.value = EGG_WORDS[i].text
  fxImg.value = EGG_WORDS[i].img
  bubbleVisible.value = true
  // 最后一句：1.5 秒后气泡消失 → 凤凰退场（自动）
  if (i === EGG_WORDS.length - 1) {
    setTimeout(finishEgg, 1500)
  }
}

// 对话推进：点击凤凰换下一句；最后一句由自动退场接管
function advanceTalk() {
  if (talkIndex.value < EGG_WORDS.length - 1) {
    showBubble(talkIndex.value + 1)
  }
}

// 退场：气泡消失 → 凤凰滑出 → 恢复
function finishEgg() {
  bubbleVisible.value = false
  eggState.value = 'bye'
  playSound('fade')
  setTimeout(() => {
    fxVisible.value = false   // 触发滑出动画
    setTimeout(resetEgg, 800)
  }, 300)
}

function resetEgg() {
  eggState.value = 'idle'
  clickedBtns.clear()
  screenClicks.value = 0
  talkIndex.value = -1
  fxImg.value = 1
  clearTimeout(hintTimer)
}
</script>

<template>
  <div class="mini-computer" :class="{ 'screen-on': screenOn }">
    <div class="box">
      <!-- 顶部招牌条 -->
      <div class="mc-sign" aria-hidden="true">
        <span class="mc-sign-text">MY HANDSOME PHOTOS</span>
      </div>

      <!-- 屏幕 -->
      <div class="mc-screen" :class="{ breaking: eggState === 'breaking', broken: screenBroken }" @click="onScreenClick">
        <!-- 照片堆栈：全部常驻 DOM，切换只改 opacity（避免换 src 重绘闪烁） -->
        <div class="mc-photo-stack" aria-hidden="true">
          <img
            v-for="(p, i) in photos"
            :key="i"
            :src="spritePhoto"
            :style="{ objectPosition: i * 20 + '% 50%' }"
            alt=""
            class="mc-photo"
            :class="{ active: i === photoIndex, 'zoom-first': i === 0 }"
          />
        </div>
        <div class="mc-scan" aria-hidden="true"></div>
        <!-- 故障效果层 -->
        <div class="glitch-noise" aria-hidden="true"></div>
        <div class="glitch-noise-2" aria-hidden="true"></div>
        <div class="glitch-chip chip-1" aria-hidden="true"></div>
        <div class="glitch-chip chip-2" aria-hidden="true"></div>
        <div class="glitch-chip chip-3" aria-hidden="true"></div>
        <div class="glitch-chip chip-4" aria-hidden="true"></div>
        <div class="glitch-chip chip-5" aria-hidden="true"></div>
        <div class="glitch-chip chip-6" aria-hidden="true"></div>
        <!-- 碎裂裂纹层 -->
        <svg class="fx-crack" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0 L 52 30 L 30 45 L 55 60 L 45 100" stroke="rgba(255,255,255,0.95)" stroke-width="1.2" fill="none"/>
          <path d="M52 30 L 85 24" stroke="rgba(255,255,255,0.7)" stroke-width="0.8" fill="none"/>
          <path d="M55 60 L 82 68" stroke="rgba(255,255,255,0.7)" stroke-width="0.8" fill="none"/>
          <path d="M30 45 L 8 52" stroke="rgba(255,255,255,0.7)" stroke-width="0.8" fill="none"/>
          <path d="M45 100 L 48 78 L 70 72" stroke="rgba(255,255,255,0.6)" stroke-width="0.8" fill="none"/>
        </svg>
        <span class="mc-boot off" v-if="!screenOn">SIGNAL LOST</span>
        <span class="mc-boot on" v-else>BOOT OK</span>
      </div>

      <!-- 红蓝按钮（带英文标识） -->
      <div class="mc-btns">
        <button class="btn-red" @click="onRed" aria-label="开关屏幕" :disabled="screenBroken">
          <span class="btn-label mono-label">POWER</span>
        </button>
        <button class="btn-blue" @click="onBlue" aria-label="切换照片" :disabled="screenBroken">
          <span class="btn-label mono-label">PHOTO</span>
        </button>
      </div>
    </div>

    <!-- 凤凰（对话阶段点击推进） -->
    <transition name="fx-slide">
      <div v-if="fxVisible" class="fx-phenix" @click="onPhenixClick" role="button" aria-label="凤凰丁神奶">
        <img :src="assetsBase + 'fx-' + fxImg + '.webp'" alt="" class="fx-img" />
      </div>
    </transition>

    <!-- 气泡（hint 尖尖指收银台 / talk 尖尖指凤凰；所有气泡可点击推进对话，= 点凤凰效果） -->
    <transition name="bubble-pop">
      <div
        v-if="bubbleVisible"
        :key="talkIndex"
        class="fx-bubble"
        :class="{ hint: eggState === 'hint', tappable: true, first: talkIndex === 0 }"
        @click="onPhenixClick()"
      >{{ bubbleText }}</div>
    </transition>
  </div>
</template>

<script>
import { computed } from 'vue'
</script>

<style scoped>
.mini-computer {
  position: absolute;
  right: 417px; top: 278px;
  z-index: 40;
  width: clamp(170px, 20vw, 225px);
  transition: transform var(--dur) var(--ease-spring);
}

.box {
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: var(--radius-lg);
  padding: 10px;
  box-shadow: 0 5px 0 var(--ink-12), 0 14px 28px rgba(26, 26, 24, 0.12);
}

/* ======== 顶部招牌条 ======== */
.mc-sign {
  background: var(--tomato);
  border: 1.5px solid var(--ink);
  border-radius: 4px;
  padding: 4px 0;
  text-align: center;
  margin-bottom: 8px;
  box-shadow: 0 2px 0 var(--ink-12);
}
.mc-sign-text {
  font-family: var(--font-mono);
  font-size: 15px;   /* 大一倍（原 7.5px） */
  font-weight: 700;
  color: var(--cream);
  letter-spacing: 0.12em;
  white-space: nowrap;
}

/* ======== 屏幕 ======== */
.mc-screen {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #101010;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}
/* 照片堆栈：所有照片叠放，active 控制显示 */
.mc-photo-stack {
  position: absolute; inset: 0;
  overflow: hidden;
}
.mc-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;             /* 雪碧图切片：cover 按高缩放，object-position 20% 步进切出对应照片 */
  opacity: 0;
  /* 不用 will-change/filter：部分 GPU 驱动合成层会丢内容（照片消失） */
  transition: none;
}
.mc-photo.active { opacity: 0.13; }
.mc-photo.zoom-first { transform: scale(1.01); }
.screen-on .mc-photo.active { opacity: 1; }

.mc-scan {
  position: absolute; inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 4px);
  mix-blend-mode: overlay;
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

/* ======== 碎裂 ======== */
.fx-crack {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  opacity: 0;
  pointer-events: none;
}
/* 碎裂瞬间 */
.mc-screen.breaking { animation: screen-break 950ms ease; }
.mc-screen.breaking .fx-crack { animation: crack-in 420ms steps(6) 80ms forwards; }
/* 保持碎裂（对话期间屏幕一直坏） */
.mc-screen.broken { animation: broken-flicker 0.42s steps(2) infinite; }
.mc-screen.broken .fx-crack { opacity: 1; }
/* 坏屏幕：故障层常显 */
.mc-screen.broken .glitch-noise,
.mc-screen.broken .glitch-noise-2,
.mc-screen.broken .glitch-chip { display: block; }
.mc-screen.broken .mc-photo.active { opacity: 0.15; }

@keyframes screen-break {
  0%, 100% { transform: none; filter: none; }
  10% { transform: translateX(-3px) skewX(2deg); filter: brightness(2.2); }
  20% { transform: translateX(4px); filter: brightness(1.5); }
  30% { transform: translateX(-2px) skewX(-3deg); }
  40% { transform: translateY(2px) scale(1.02); }
  50% { transform: translateX(3px); filter: brightness(3); }
  60% { transform: translateX(-3px) skewX(2deg); }
  70% { transform: translateY(-2px); }
  80% { transform: translateX(2px); filter: brightness(1.8); }
}
@keyframes crack-in {
  0% { opacity: 0; transform: scale(1.4); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes broken-flicker {
  0%, 100% { transform: none; filter: brightness(1); }
  50% { transform: translateX(1px); filter: brightness(1.6); }
}

/* ======== 故障效果 ======== */
.glitch-noise, .glitch-noise-2 { position: absolute; display: none; }
.mini-computer:not(.screen-on) .glitch-noise,
.mc-screen.broken .glitch-noise {
  display: block;
  inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
  opacity: 0.5;
  animation: noise-jump 0.28s steps(4) infinite;
  pointer-events: none;
}
.mini-computer:not(.screen-on) .glitch-noise-2,
.mc-screen.broken .glitch-noise-2 {
  display: block;
  inset: -50%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='3'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23n2)' opacity='0.35'/%3E%3C/svg%3E");
  animation: noise-jump 0.45s steps(5) infinite reverse;
  pointer-events: none;
}
@keyframes noise-jump {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-7%, 5%); }
  50% { transform: translate(5%, -4%); }
  75% { transform: translate(-4%, 7%); }
  100% { transform: translate(0, 0); }
}

.glitch-chip { position: absolute; display: none; mix-blend-mode: screen; pointer-events: none; }
.mini-computer:not(.screen-on) .glitch-chip,
.mc-screen.broken .glitch-chip { display: block; }
.chip-1 { width: 28px; height: 6px; left: 12%; top: 22%; background: rgba(224,69,46,0.35); animation: chip-a 0.8s steps(2) infinite; }
.chip-2 { width: 18px; height: 5px; left: 68%; top: 35%; background: rgba(70,130,220,0.32); animation: chip-b 1s steps(2) infinite; }
.chip-3 { width: 36px; height: 7px; left: 30%; top: 58%; background: rgba(70,200,180,0.3); animation: chip-c 0.7s steps(2) infinite; }
.chip-4 { width: 14px; height: 4px; left: 80%; top: 70%; background: rgba(255,255,255,0.2); animation: chip-a 1.2s steps(2) infinite reverse; }
.chip-5 { width: 22px; height: 5px; left: 45%; top: 40%; background: rgba(224,69,46,0.3); animation: chip-b 0.9s steps(2) infinite reverse; }
.chip-6 { width: 30px; height: 6px; left: 8%; top: 80%; background: rgba(70,130,220,0.28); animation: chip-c 1.1s steps(2) infinite; }
@keyframes chip-a {
  0%, 100% { transform: translateX(0); opacity: 0; }
  30% { transform: translateX(10px); opacity: 1; }
  60% { transform: translateX(-8px); opacity: 0.6; }
  70% { transform: translateX(4px); opacity: 0; }
}
@keyframes chip-b {
  0%, 100% { transform: translateY(0); opacity: 0; }
  40% { transform: translateY(8px) translateX(-6px); opacity: 1; }
  65% { transform: translateY(-6px); opacity: 0.5; }
  75% { transform: translateY(3px); opacity: 0; }
}
@keyframes chip-c {
  0%, 100% { transform: translateX(0) scale(1); opacity: 0; }
  35% { transform: translateX(-10px) scale(1.1); opacity: 1; }
  60% { transform: translateX(6px) scale(0.9); opacity: 0.4; }
  70% { transform: translateX(-3px); opacity: 0; }
}

/* ======== 红蓝按钮 ======== */
.mc-btns { display: flex; gap: 10px; margin-top: 10px; }
.btn-red, .btn-blue {
  flex: 1;
  height: 30px;
  border-radius: 999px;
  border: 2px solid var(--ink);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform var(--dur-fast) var(--ease-spring), filter var(--dur-fast);
}
.btn-label {
  font-size: 8px;
  font-weight: 700;
  color: var(--cream);
  letter-spacing: 0.18em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.btn-red {
  background: linear-gradient(180deg, #f06a52, var(--tomato));
  box-shadow: 0 3px 0 rgba(120, 30, 15, 0.45);
}
.btn-blue {
  background: linear-gradient(180deg, #4a7ab0, var(--navy));
  box-shadow: 0 3px 0 rgba(15, 30, 50, 0.45);
}
.btn-red:hover, .btn-blue:hover { transform: translateY(-2px); filter: brightness(1.08); }
.btn-red:active, .btn-blue:active { transform: translateY(1px); box-shadow: 0 1px 0 rgba(0,0,0,0.3); }
.btn-red:disabled, .btn-blue:disabled { opacity: 0.5; cursor: not-allowed; }

/* ======== 凤凰（放大 + 可点击；absolute 随页面滚动） ======== */
.fx-phenix {
  position: absolute;
  left: 457px; top: 73px;   /* 相对收银台，左移 1/3 身位（170/3≈57px） */
  width: 170px;
  z-index: 150;
  cursor: pointer;
}
.fx-img {
  width: 100%;
  display: block;
  filter: drop-shadow(0 10px 20px rgba(26,26,24,0.28));
}
.fx-slide-enter-active { transition: transform 900ms var(--ease-spring); }
.fx-slide-enter-from { transform: translateX(85vw); }
.fx-slide-leave-active { transition: transform 3500ms var(--ease-spring); }   /* 退场慢速 */
.fx-slide-leave-to { transform: translateX(85vw); }

/* ======== 气泡 v4（Q 版可爱风；absolute 随页面滚动） ======== */
.fx-bubble {
  position: absolute;
  left: 286px; top: 73px;   /* 相对收银台，左移 1/3 身位（180/3=60px） */
  width: 180px;
  background: #fffdf6;                 /* 奶油白 */
  border: 3px solid var(--ink);
  border-radius: 24px;                 /* 大圆角，Q 版 */
  padding: 14px 18px;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.7;
  color: var(--ink);
  box-shadow: 0 4px 0 var(--ink-12), 0 12px 24px rgba(26, 26, 24, 0.15);
  z-index: 151;
  cursor: pointer;
}
/* 右上角小圆点装饰（不挡字） */
.fx-bubble::before {
  content: '';
  position: absolute;
  top: -7px; right: 16px;
  width: 13px; height: 13px;
  background: var(--mustard);
  border: 2px solid var(--ink);
  border-radius: 50%;
}
/* 尖尖：talk 指向凤凰（右侧） */
.fx-bubble::after {
  content: '';
  position: absolute;
  left: 100%; top: 28px;
  border: 9px solid transparent;
  border-left-color: var(--ink);
  border-radius: 2px;
}
/* hint 指向收银台（左侧；随页面移动；左移 1/3 身位） */
.fx-bubble.hint { left: 279px; top: 33px; }
.fx-bubble.hint::after {
  left: auto; right: 100%;
  border: 9px solid transparent;
  border-right-color: var(--ink);
}

/* 气泡：可点击推进对话（= 点击凤凰效果） */
.fx-bubble.tappable { cursor: pointer; }

/* 语句切换：先缩小再弹大（1 秒，更明显） */
.bubble-pop-enter-active { animation: bubble-pop 1000ms var(--ease-spring); }
/* hint 提示气泡：柔和淡入（无弹跳，避免看起来像闪烁） */
.fx-bubble.hint { animation: bubble-fade-in 350ms ease both; }
.bubble-pop-leave-active { transition: opacity 180ms ease; }
.bubble-pop-leave-to { opacity: 0; }
@keyframes bubble-pop {
  0% { opacity: 0; transform: scale(0.55); }
  70% { transform: scale(1.12); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes bubble-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 767px) {
  /* 移动端适配已全部集中到 MobileHome.vue（:deep 覆盖），本文件保持桌面端纯净 */
}
</style>

