<script setup>
// ============================================================
// 关于我：厨师档案卡 + 技能三卡
// 彩蛋：点档案卡 → 死神角色右上角登场 4 秒（带台词）
//       点技能卡 → 汉堡材料按「从下到上」累计出现，集齐六层提示完成
// ============================================================
import { ref } from 'vue'
import SeaLife from './SeaLife.vue'
import LayerQ from './LayerQ.vue'
import { spawnBubbles, wobble } from '../utils/bubbles.js'
import { playSound } from '../utils/sound.js'
import { profile, about, skillGroups, burgerLayers } from '../data/content.js'

const reaperSrc = import.meta.env.BASE_URL + 'assets/reaper.png'
const doneSrc = import.meta.env.BASE_URL + 'assets/burger-girl.png'
const doneAudio = new Audio(import.meta.env.BASE_URL + 'assets/burger-done.mp4')
doneAudio.preload = 'auto'

function onTitleClick(e) {
  wobble(e.currentTarget)
  spawnBubbles(e.clientX, e.clientY, 4)
}

// 档案卡 → 死神登场 4 秒
const reaperVisible = ref(false)
let reaperTimer = null
function onFileClick(e) {
  wobble(e.currentTarget)
  spawnBubbles(e.clientX, e.clientY, 4)
  reaperVisible.value = true
  playSound('bubble')
  clearTimeout(reaperTimer)
  reaperTimer = setTimeout(() => (reaperVisible.value = false), 4000)
}

// 技能卡累计集齐：汉堡材料按「从下到上」出现（底包→番茄→肉饼→芝士→生菜→顶包）
const ORDER_BOTTOM_UP = [5, 4, 3, 2, 1, 0]
const collectCount = ref(0)
const activeCard = ref(null)      // 材料Q图挂在哪张卡上（刚收集）
const collectLayer = ref(null)    // 刚收集的材料层索引
const cardDone = ref(false)       // 六层集齐
const burgerDone = ref(false)     // 集齐庆祝：汉堡装角色登场
let cardTimer = null
let doneTimer = null

function onSkillClick(i, e) {
  playSound('bubble')
  spawnBubbles(e.clientX, e.clientY, 4)
  activeCard.value = i
  collectLayer.value = ORDER_BOTTOM_UP[collectCount.value % 6]
  collectCount.value++
  cardDone.value = collectCount.value % 6 === 0
  clearTimeout(cardTimer)
  cardTimer = setTimeout(() => (activeCard.value = null), 3000)
  if (cardDone.value) {
    // 六层集齐：汉堡装角色全屏覆盖页面 1 秒 + 播放庆祝音频（用户提供的 mp4 音轨）
    burgerDone.value = true
    try { doneAudio.currentTime = 0; doneAudio.play().catch(() => {}) } catch (err) { /* 自动播放被拦截时静默 */ }
    clearTimeout(doneTimer)
    doneTimer = setTimeout(() => (burgerDone.value = false), 1000)
  }
}
</script>

<template>
  <section class="about" id="about">
    <SeaLife type="fish" :pf="60" :dur="20" class="about-fish" />

    <div class="container">
      <div class="about-head" v-reveal>
        <span class="about-eyebrow mono-label">ABOUT · 厨师档案</span>
        <h2 class="about-title" title="戳我一下" @click="onTitleClick">关于我</h2>
      </div>

      <div class="about-grid" v-reveal="{ delay: 100 }">
        <!-- 左：员工档案卡（点击 → 死神登场在卡片右上角） -->
        <div class="file-card" role="button" :tabindex="0" @click="onFileClick" @keydown.enter="onFileClick">
          <!-- 死神角色：站在档案卡右上角 -->
          <transition name="reaper">
            <div v-if="reaperVisible" class="about-reaper-wrap" aria-hidden="true">
              <span class="reaper-say">档案已调阅。</span>
              <img :src="reaperSrc" class="about-reaper" alt="" />
            </div>
          </transition>
          <span class="file-tab mono-label">PERSONNEL FILE</span>
          <span class="file-no mono-label">{{ profile.employeeId }}</span>
          <h3 class="file-name">{{ profile.name }}</h3>
          <span class="file-role mono-label">{{ profile.title }}</span>
          <div class="file-lines">
            <p v-for="(p, i) in about.paragraphs" :key="i">{{ p }}</p>
          </div>
          <div class="file-foot">
            <span class="file-sign" aria-hidden="true">{{ about.signature }}</span>
            <span class="file-stamp mono-label" aria-hidden="true">在册</span>
          </div>
        </div>

        <!-- 右：技能三卡（点击 → 材料累计出现） -->
        <div class="skill-cards">
          <article
            v-for="(g, i) in skillGroups"
            :key="g.group"
            class="skill-card"
            :class="['tone-' + (i % 3), { 'has-tip': activeCard === i }]"
            role="button"
            :tabindex="0"
            @click="onSkillClick(i, $event)"
            @keydown.enter="onSkillClick(i, $event)"
          >
            <span class="skill-icon" aria-hidden="true">{{ g.icon }}</span>
            <div class="skill-body">
              <div class="skill-top">
                <span class="skill-name mono-label">{{ g.group }}</span>
                <span class="skill-level mono-label">{{ g.level }}</span>
              </div>
              <p class="skill-desc">{{ g.desc }}</p>
              <div class="skill-items">
                <span v-for="it in g.items" :key="it" class="chip">{{ it }}</span>
              </div>
            </div>
            <!-- 材料Q图：点击收集后在卡片内部右下角出现 -->
            <transition name="tip-pop">
              <div v-if="activeCard === i && collectLayer !== null" class="material-q" role="status">
                <LayerQ :shape="burgerLayers[collectLayer].shape" :size="74" />
              </div>
            </transition>
          </article>
        </div>
      </div>
      <!-- 集齐庆祝：汉堡装角色直接在页面登场 4 秒 -->
      <transition name="done-pop">
        <img v-if="burgerDone" :src="doneSrc" class="burger-done" alt="" aria-hidden="true" />
      </transition>
    </div>
  </section>
</template>

<style scoped>
.about { position: relative; padding: var(--space-7) 0 var(--space-8); }

.about-fish { left: 4%; bottom: 9%; right: auto; top: auto; width: 116px; }

.about-head { padding-bottom: var(--space-3); border-bottom: 2px solid var(--ink); }
.about-eyebrow { display: block; color: var(--tomato); font-size: 11px; font-weight: 700; }
.about-title {
  font-family: var(--font-serif);
  font-size: var(--text-h1);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--ink);
  margin-top: 4px;
  cursor: pointer;
  user-select: none;
  display: inline-block;
}

.about-grid {
  margin-top: var(--space-6);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
}

/* ======== 左：厨师档案卡 ======== */
.file-card {
  position: relative;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: var(--radius);
  padding: 26px 22px 18px;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.file-card:hover,
.file-card.is-hover {
  transform: scale(1.04);
  box-shadow: var(--shadow-pop);
}
/* 档案夹标签页 */
.file-tab {
  position: absolute;
  top: -13px; left: 18px;
  background: var(--tomato);
  color: var(--cream);
  font-size: 10px;
  letter-spacing: 0.18em;
  padding: 4px 12px;
  border-radius: 5px 5px 0 0;
  border: 2px solid var(--ink);
  border-bottom: none;
}
.file-no {
  display: block;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: var(--ink-40);
}
.file-name {
  font-family: var(--font-serif);
  font-size: 27px;
  font-weight: 700;
  color: var(--ink);
  margin-top: 4px;
}
.file-role {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  color: var(--tomato);
  border-bottom: 1px dashed var(--tomato);
  padding-bottom: 2px;
}
.file-lines { margin-top: 14px; }
.file-lines p {
  font-size: 14px;
  line-height: 2;
  color: var(--ink-70);
  margin-bottom: 10px;
}
.file-foot {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.file-sign {
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--tomato);
  transform: rotate(-3deg);
}
.file-stamp {
  color: var(--tomato);
  border: 2px solid var(--tomato);
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 12px;
  transform: rotate(8deg);
  opacity: 0.85;
}

/* ======== 死神角色（档案卡右上角） ======== */
.about-reaper-wrap {
  position: absolute;
  right: -34px; top: -100px;
  z-index: 5;
  pointer-events: none;
  text-align: center;
}
.about-reaper {
  width: 132px;
  display: block;
  filter: drop-shadow(0 12px 18px rgba(26, 26, 24, 0.28));
  animation: reaper-float 3s ease-in-out infinite;
}
@keyframes reaper-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}
.reaper-say {
  position: absolute;
  right: 108px; top: 6px;
  width: max-content;
  background: #fffdf6;
  border: 2.5px solid var(--ink);
  border-radius: 14px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  box-shadow: 0 3px 0 var(--ink-12), 0 8px 18px rgba(26, 26, 24, 0.14);
}
.reaper-say::after {
  content: '';
  position: absolute;
  left: 100%; top: 55%;
  border: 7px solid transparent;
  border-left-color: var(--ink);
}
.reaper-enter-active { transition: transform 480ms var(--ease-spring), opacity 280ms ease; }
.reaper-enter-from { transform: translateX(70px) scale(0.7); opacity: 0; }
.reaper-leave-active { transition: transform 320ms ease, opacity 240ms ease; }
.reaper-leave-to { transform: translateX(70px) scale(0.85); opacity: 0; }

/* ======== 右：技能三卡 ======== */
.skill-cards { display: flex; flex-direction: column; gap: 14px; }
.skill-card {
  position: relative;
  display: flex; gap: 14px;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.skill-card:hover,
.skill-card.is-hover {
  transform: scale(1.04);
  box-shadow: var(--shadow-pop);
}
.skill-icon {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 19px;
}
.tone-0 .skill-icon { background: var(--tomato-soft); color: var(--tomato); }
.tone-1 .skill-icon { background: rgba(36, 66, 94, 0.12); color: var(--navy); }
.tone-2 .skill-icon { background: var(--mustard-soft); color: #b8860b; }

.skill-body { flex: 1; min-width: 0; }
.skill-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; flex-wrap: wrap;
}
.skill-name { font-size: 11px; letter-spacing: 0.16em; color: var(--ink); }
.tone-0 .skill-name { color: var(--tomato); }
.tone-1 .skill-name { color: var(--navy); }
.tone-2 .skill-name { color: #b8860b; }
/* 实在的熟练度标签 */
.skill-level {
  font-size: 10px;
  color: var(--ink-50);
  border: 1px dashed var(--ink-30);
  border-radius: 999px;
  padding: 2px 9px;
  white-space: nowrap;
}
.tone-0 .skill-level { color: var(--tomato); border-color: var(--tomato-soft); }
.tone-1 .skill-level { color: var(--navy); border-color: rgba(36, 66, 94, 0.3); }
.tone-2 .skill-level { color: #b8860b; border-color: var(--mustard-soft); }

.skill-desc { font-size: 13px; color: var(--ink-70); margin: 6px 0 9px; line-height: 1.7; }
.skill-items { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  font-size: 11px;
  padding: 3px 10px;
  border: 1px solid var(--ink-12);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink-70);
  transition: border-color var(--dur-fast), color var(--dur-fast);
}
.skill-card:hover .chip { border-color: var(--ink-30); color: var(--ink); }

/* ======== 材料Q图（卡片内部右下角） ======== */
.material-q {
  position: absolute;
  right: 14px; bottom: 9px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  z-index: 30;
  pointer-events: none;
  transform: rotate(-5deg);
  animation: mq-bob 2.4s ease-in-out infinite;
}
.material-q :deep(.lq) {
  filter: drop-shadow(0 0 3px #fffdf6) drop-shadow(0 0 3px #fffdf6) drop-shadow(0 3px 4px rgba(26, 26, 24, 0.28));
  border-radius: 10px;
}
.mq-done {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--tomato);
  background: #fffdf6;
  border: 2px solid var(--tomato);
  border-radius: 999px;
  padding: 1px 9px;
  box-shadow: 0 2px 0 var(--ink-12);
}
/* ======== 集齐庆祝：汉堡装角色全屏覆盖 1 秒 ======== */
.burger-done {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 450;
  pointer-events: none;
}
.done-pop-enter-active { transition: opacity 140ms ease; }
.done-pop-enter-from { opacity: 0; }
.done-pop-leave-active { transition: opacity 220ms ease; }
.done-pop-leave-to { opacity: 0; }
@keyframes mq-bob {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -4px; }
}
.tip-pop-enter-active { transition: transform 420ms var(--ease-spring), opacity 260ms ease; }
.tip-pop-enter-from { transform: translateY(8px) scale(0.5) rotate(-14deg); opacity: 0; }
.tip-pop-leave-active { transition: opacity 200ms ease; }
.tip-pop-leave-to { opacity: 0; }

/* ======== 响应式 ======== */
@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-reaper-wrap { top: -4px; right: 0; }
  .about-reaper { width: 104px; }
}
@media (max-width: 767px) {
  .about { padding: var(--space-6) 0 var(--space-7); }
  .about-fish { display: none; }   /* 单列布局没有空白水域，藏起来 */
  .file-card { padding: 24px 18px 16px; }
  .material-tip { right: 0; width: min(240px, 74vw); }
}
</style>
