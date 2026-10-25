<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Burger25D from './Burger25D.vue'
import FormulaScroll from './FormulaScroll.vue'
import SeaLife from './SeaLife.vue'
import { burgerLayers } from '../data/content.js'
import { spawnBubbles, wobble } from '../utils/bubbles.js'
import { playSound } from '../utils/sound.js'
import ResumeChannel from './channels/ResumeChannel.vue'
import GithubChannel from './channels/GithubChannel.vue'
import InterestsChannel from './channels/InterestsChannel.vue'
import GuestbookChannel from './channels/GuestbookChannel.vue'
import BlogChannel from './channels/BlogChannel.vue'
import ComingSoonChannel from './channels/ComingSoonChannel.vue'

// embedded：门户内嵌模式，透传给 channel 组件（弹窗投影到门户内）
defineProps({ embedded: Boolean })

const channelMap = {
  github: GithubChannel,
  blog: BlogChannel,
  resume: ResumeChannel,
  interests: InterestsChannel,
  guestbook: GuestbookChannel,
  soon: ComingSoonChannel
}

const activeId = ref('')
const activeLayer = ref(-1)
const detailOpen = ref(false)

// 汉堡随鼠标轻微 3D 倾斜（iso-stage 上 mousemove → rotateX/rotateY）
const tilt = ref({ x: 0, y: 0 })
function onTilt(e) {
  const r = e.currentTarget.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  tilt.value = { x: py * -7, y: px * 9 }
}
function resetTilt() { tilt.value = { x: 0, y: 0 } }

const activeChannel = computed(() => (activeId.value ? channelMap[activeId.value] : null))
const activeMeta = computed(() => burgerLayers.find(l => l.id === activeId.value))

function onHoverLayer(i) { activeLayer.value = i }

// 卷轴条目点击 → 打开栏目抽屉
function onSelectLayer(i) {
  const layer = burgerLayers[i]
  if (!layer) return
  activeId.value = layer.id
  openedAt = performance.now()   // 标记这次点击是"打开"，避免 document 层立即又关掉
  detailOpen.value = true
}

// 食材来源气泡：点汉堡的某一层 → 气泡悬在面包上方，2 秒消散
const tip = ref(null)
let tipTimer = null
function onLayerClick(i, e) {
  tip.value = i
  playSound('bubble')
  spawnBubbles(e.clientX, e.clientY, 4)
  clearTimeout(tipTimer)
  tipTimer = setTimeout(() => (tip.value = null), 2000)   // 最多 2 秒
}
function closeDetail() {
  detailOpen.value = false
  activeId.value = ''   // v-if 变 false → Vue transition 走滑出动画（380ms）后自动卸载
}

// Esc 关抽屉
function onEscKey(e) {
  if (e.key !== 'Escape') return
  if (detailOpen.value) closeDetail()
}
watch(detailOpen, (v) => {
  if (v) window.addEventListener('keydown', onEscKey)
  else window.removeEventListener('keydown', onEscKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onEscKey))

// 标准弹窗语义：抽屉开着时，点面板外的任何东西（背板、空白、装饰）都关闭。
// 不能只靠背板自己的 @click：门户里转发点击落在"面积最小"的元素上，
// 背板是全屏（面积最大），几乎总会被背板下方的小元素抢走。
let openedAt = 0
function onDocClick(e) {
  if (!detailOpen.value) return
  if (performance.now() - openedAt < 120) return   // 忽略打开抽屉的那次点击
  if (e.target?.closest?.('.drawer-panel')) return // 面板内交给面板自己的控件
  closeDetail()
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

// 标题彩蛋：戳「汉堡包秘方」→ 果冻抖动 + 冒泡
function onTitleClick(e) {
  wobble(e.currentTarget)
  spawnBubbles(e.clientX, e.clientY, 4)
}
</script>

<template>
  <section class="burger-section" id="burger">
    <!-- 深层海域：鱼群 / 灯笼鱼 / 远景鲸鱼（下潜叙事：越深越暗的生物） -->
    <SeaLife type="fish" :pf="90" :dur="20" class="bs-fish" />
    <SeaLife type="angler" :pf="120" :dur="24" class="bs-angler" />
    <SeaLife type="whale" :pf="140" :dur="34" flip class="bs-whale" />

    <!-- 海底背景装饰（与 Hero 呼应） -->
    <div class="bs-bubbles" aria-hidden="true">
      <span class="bs-bubble b1"></span>
      <span class="bs-bubble b2"></span>
      <span class="bs-bubble b3"></span>
    </div>
    <div class="bs-jelly bs-jelly--l" aria-hidden="true">
      <svg viewBox="0 0 60 80">
        <path d="M10 30 C 10 12, 50 12, 50 30 C 50 40, 40 46, 30 46 C 20 46, 10 40, 10 30 Z" fill="rgba(240, 150, 195, 0.28)" stroke="rgba(240, 120, 180, 0.35)" stroke-width="1.5"/>
        <path d="M18 46 C 16 60, 14 68, 16 74 M25 46 C 24 62, 26 70, 24 76 M35 46 C 36 60, 34 68, 36 74 M42 46 C 44 62, 42 70, 44 76" stroke="rgba(240, 120, 180, 0.3)" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="bs-jelly bs-jelly--r" aria-hidden="true">
      <svg viewBox="0 0 60 80">
        <path d="M10 30 C 10 12, 50 12, 50 30 C 50 40, 40 46, 30 46 C 20 46, 10 40, 10 30 Z" fill="rgba(120, 180, 220, 0.25)" stroke="rgba(90, 150, 200, 0.35)" stroke-width="1.5"/>
        <path d="M18 46 C 16 60, 14 68, 16 74 M25 46 C 24 62, 26 70, 24 76 M35 46 C 36 60, 34 68, 36 74 M42 46 C 44 62, 42 70, 44 76" stroke="rgba(90, 150, 200, 0.3)" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="bs-seaweed" aria-hidden="true">
      <svg viewBox="0 0 120 60">
        <path d="M20 60 C 15 45, 28 40, 20 25 C 14 14, 22 6, 18 0" stroke="rgba(90, 160, 80, 0.3)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M60 60 C 55 42, 68 38, 60 20 C 54 10, 62 4, 58 0" stroke="rgba(90, 160, 80, 0.24)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M100 60 C 95 48, 105 40, 98 26 C 92 16, 100 8, 96 0" stroke="rgba(90, 160, 80, 0.18)" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
    </div>

    <div class="container" v-reveal>
      <span class="section-eyebrow mono-label">SECRET FORMULA</span>
      <h2 class="section-title" title="戳我一下" @click="onTitleClick">汉堡包秘方</h2>
      <p class="section-sub">六层秘方 · 从上到下，每一层都是一个栏目的入口</p>
    </div>

    <div class="burger-wrap container" v-reveal="{ delay: 120 }">
      <!-- 左：秘方卷轴 -->
      <FormulaScroll
        @hover-layer="onHoverLayer"
        @select-layer="onSelectLayer"
      />
      <!-- 右：2.5D 汉堡（点击层 = 食材来源气泡） -->
      <div class="iso-stage" @mousemove="onTilt" @mouseleave="resetTilt">
        <Burger25D :active-layer="activeLayer" :tilt="tilt" @layer-click="onLayerClick" />
        <!-- 食材来源气泡 -->
        <transition name="tip-pop">
          <div v-if="tip !== null" class="ingredient-tip" role="status">
            <span class="tip-name mono-label">{{ burgerLayers[tip].ingredient }} · 来源</span>
            <span class="tip-text">{{ burgerLayers[tip].source }}</span>
          </div>
        </transition>
      </div>
    </div>

    <!-- 详情面板（右侧滑出/滑入，Vue transition 接管完整开关动画） -->
    <div class="drawer" :class="{ open: detailOpen }">
      <div class="drawer-backdrop" @click="closeDetail"></div>
      <transition name="drawer">
        <div class="drawer-panel" v-if="detailOpen || activeMeta">
          <div class="drawer-head">
            <span class="drawer-num mono-label">{{ activeMeta.num }}</span>
            <span class="drawer-name">{{ activeMeta.name }}</span>
            <span class="drawer-channel mono-label">{{ activeMeta.channel }}</span>
            <button class="drawer-close" @click="closeDetail" aria-label="关闭">×</button>
          </div>
          <div class="drawer-body">
            <component :is="activeChannel" v-if="activeChannel" :embedded="embedded" />
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
.burger-section {
  position: relative;   /* 背景装饰定位基准 */
  overflow: hidden;
  padding: var(--space-6) 0 var(--space-7);
  /* 分区色带已由全局下潜背景层（PageHome .depth-veil）接管 */
}

/* ======== 海底背景装饰 ======== */
.bs-fish { left: 4%; top: 38%; width: 140px; }
.bs-angler { left: 10%; bottom: 4%; width: 118px; }
.bs-whale { right: -50px; top: 5%; width: 270px; }

.bs-bubbles { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.bs-bubble {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(36, 66, 94, 0.14);
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2), rgba(36,66,94,0.04) 70%);
  animation: bs-rise linear infinite;
}
.bs-bubble.b1 { width: 12px; height: 12px; left: 6%; top: 30%; animation-duration: 12s; }
.bs-bubble.b2 { width: 18px; height: 18px; left: 90%; top: 50%; animation-duration: 15s; animation-delay: 3s; }
.bs-bubble.b3 { width: 8px; height: 8px; left: 60%; top: 10%; animation-duration: 18s; animation-delay: 6s; }
@keyframes bs-rise {
  0% { transform: translateY(60px); opacity: 0; }
  10% { opacity: 0.6; }
  100% { transform: translateY(-320px) translateX(10px); opacity: 0; }
}

.bs-jelly { position: absolute; z-index: 0; opacity: 0.85; pointer-events: none; }
.bs-jelly svg { width: 100%; display: block; }
.bs-jelly--l { left: 2%; top: 42%; width: 44px; animation: bs-jelly-a 7s ease-in-out infinite; }
.bs-jelly--r { right: 3%; bottom: 18%; width: 38px; animation: bs-jelly-b 8.5s ease-in-out infinite; }
@keyframes bs-jelly-a {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-16px) rotate(4deg); }
}
@keyframes bs-jelly-b {
  0%, 100% { transform: translateY(-10px) rotate(4deg); }
  50% { transform: translateY(6px) rotate(-3deg); }
}

.bs-seaweed {
  position: absolute;
  right: 8%; bottom: -2px;
  width: 110px;
  z-index: 0;
  pointer-events: none;
  animation: bs-sway 5s ease-in-out infinite;
  transform-origin: bottom center;
}
.bs-seaweed svg { width: 100%; display: block; }
@keyframes bs-sway {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}

.section-eyebrow { color: var(--tomato); font-size: 11px; position: relative; z-index: 1; }
.section-title {
  font-family: var(--font-serif);
  font-size: var(--text-h1);   /* 与「项目」同级标题，保持版面节奏一致 */
  letter-spacing: 0.04em;
  margin-top: 4px;
  color: var(--ink);
  position: relative; z-index: 1;
  cursor: pointer;
  user-select: none;
}
.section-sub {
  margin-top: 8px;
  font-size: 12px;
  color: var(--ink-50);
  letter-spacing: 0.06em;
  position: relative; z-index: 1;
}

.burger-wrap {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  gap: clamp(40px, 8vw, 110px);
  padding-top: var(--space-5);
}

.iso-stage {
  position: relative;
  flex: 0 0 clamp(320px, 40vw, 480px);
  height: clamp(360px, 60vh, 480px);
}
/* 海底光晕（汉堡后面） */
.iso-stage::before {
  content: '';
  position: absolute;
  inset: 6% 10%;
  background: radial-gradient(ellipse at center, rgba(36, 66, 94, 0.09), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* ======== 食材来源气泡（点击汉堡层弹出，2 秒） ======== */
.ingredient-tip {
  position: absolute;
  right: -36px; bottom: 282px;   /* 锚定舞台底部：气泡悬在顶层面包上方半格，尖尖指向面包 */
  width: 224px;
  background: #fffdf6;
  border: 3px solid var(--ink);
  border-radius: 22px;
  padding: 11px 15px;
  display: flex; flex-direction: column; gap: 3px;
  box-shadow: 0 4px 0 var(--ink-12), 0 12px 24px rgba(26, 26, 24, 0.15);
  z-index: 30;
  pointer-events: none;
}
/* 尖尖朝下指面包 */
.ingredient-tip::after {
  content: '';
  position: absolute;
  top: 100%; left: 42px;
  border: 9px solid transparent;
  border-top-color: var(--ink);
}
.tip-name {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--tomato);
  font-weight: 700;
}
.tip-text {
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--ink);
  font-weight: 600;
}
.tip-pop-enter-active { transition: transform 420ms var(--ease-spring), opacity 260ms ease; }
.tip-pop-enter-from { transform: translateY(10px) scale(0.7); opacity: 0; }
.tip-pop-leave-active { transition: opacity 200ms ease; }
.tip-pop-leave-to { opacity: 0; }

@media (max-width: 767px) {
  .ingredient-tip { right: -8px; bottom: 95px; width: 196px; }
}

/* ======== 详情抽屉 ======== */
.drawer { position: fixed; inset: 0; z-index: 100; pointer-events: none; }
.drawer.open { pointer-events: auto; }
.drawer-backdrop {
  position: absolute; inset: 0;
  background: rgba(26,26,24,0.28);
  opacity: 0; transition: opacity var(--dur) var(--ease-out);
}
.drawer.open .drawer-backdrop { opacity: 1; }
.drawer-panel {
  position: absolute; top: 0; right: 0; bottom: 0;
  width: clamp(340px, 38vw, 520px);
  background: var(--cream);
  box-shadow: -4px 0 30px rgba(26,26,24,0.15);
  display: flex; flex-direction: column; overflow: hidden;
}
/* 开关动画：打开滑入 480ms / 关闭滑出 380ms（比之前慢，完整过渡） */
.drawer-enter-active { transition: transform 480ms var(--ease-out); }
.drawer-enter-from { transform: translateX(100%); }
.drawer-enter-to { transform: translateX(0); }
.drawer-leave-active { transition: transform 380ms var(--ease-out); }
.drawer-leave-to { transform: translateX(100%); }

.drawer-head {
  padding: 18px 22px; border-bottom: 1px solid var(--ink-08);
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  background: var(--cream);
}
.drawer-num { color: var(--tomato); font-size: 13px; }
.drawer-name { font-size: 19px; font-weight: 700; }
.drawer-channel { font-size: 10px; color: var(--ink-50); margin-left: auto; letter-spacing: 0.15em; }
.drawer-close { font-size: 24px; color: var(--ink-50); line-height: 1; padding: 0 4px; }

.drawer-body { flex: 1; overflow-y: auto; padding: 22px; }

@media (max-width: 767px) {
  .burger-wrap { flex-direction: column; gap: 20px; }
  .iso-stage { flex: 0 0 280px; height: 380px; }   /* 加高：给食材来源气泡留出面包上方的空间 */
  /* 88vw：右侧留出一条背板空白，点空白即可关闭（100vw 时只能点 ×，太麻烦） */
  .drawer-panel { width: 88vw; }
}
</style>
