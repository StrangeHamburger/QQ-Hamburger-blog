// ============================================================
// 主题化点击音效（Web Audio API 合成，零音频文件）
// 深海餐厅主题：收银机叮 / 水泡 / 木块 / 纸卷 / 电子哔 / 玻璃碎
//
// 用法：
//   playSound('cash')        —— 手动指定
//   initGlobalClickSound()   —— 全局委托：任何 click 自动按元素选音效
// ============================================================

let ctx = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ---- 基础构件 ----

// 单音：频率滑落 + 包络
function tone(ac, t, { freq = 900, end = 500, dur = 0.09, vol = 0.12, type = 'square', attack = 0.001 }) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, end), t + dur)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + attack)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

// 噪声（带通可选）
function noise(ac, t, { dur = 0.15, vol = 0.1, freq = 1000, q = 1, sweep = null }) {
  const len = Math.floor(ac.sampleRate * dur)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = ac.createBufferSource()
  src.buffer = buf
  let node = src
  if (freq) {
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(freq, t)
    if (sweep) bp.frequency.exponentialRampToValueAtTime(sweep, t + dur)
    bp.Q.value = q
    node.connect(bp)
    node = bp
  }
  const gain = ac.createGain()
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  node.connect(gain).connect(ac.destination)
  src.start(t)
}

// ---- 音效库（深海餐厅主题） ----

// 凤凰号角：优先用视频提取的音频样本，未加载时回退合成音
let hornSample = null
const hornSampleUrl = import.meta.env.BASE_URL + 'assets/fx-horn.mp3'
// 卷轴开/关：视频提取音频样本
let scrollOpenSample = null
const scrollOpenSampleUrl = import.meta.env.BASE_URL + 'assets/fx-scroll-open.mp3'
let scrollCloseSample = null
const scrollCloseSampleUrl = import.meta.env.BASE_URL + 'assets/fx-scroll-close.mp3'
// 靠近/离开笔记本屏幕（3D 场景）：视频提取音频样本
let approachSample = null
const approachSampleUrl = import.meta.env.BASE_URL + 'assets/fx-approach.mp3'
let leaveSample = null
const leaveSampleUrl = import.meta.env.BASE_URL + 'assets/fx-leave.mp3'
// 看画音效（进入看画视角后，从左到右依次播放）
const paintSampleUrls = [
  import.meta.env.BASE_URL + 'assets/fx-paint-1.mp3',
  import.meta.env.BASE_URL + 'assets/fx-paint-2.mp3',
  import.meta.env.BASE_URL + 'assets/fx-paint-3.mp3',
  import.meta.env.BASE_URL + 'assets/fx-paint-4.mp3'
]
let paintSamples = [null, null, null, null]

async function loadSample(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const ac = getCtx()
    if (!ac) return null
    return await ac.decodeAudioData(buf)
  } catch (e) {
    return null
  }
}

function playSample(sample, { rate = 1, vol = 0.85, offset = 0 } = {}) {
  const ac = getCtx()
  if (!ac || !sample) return false
  const src = ac.createBufferSource()
  src.buffer = sample
  src.playbackRate.value = rate
  const gain = ac.createGain()
  gain.gain.value = vol
  src.connect(gain).connect(ac.destination)
  src.start(ac.currentTime + 0.01, offset)
  return true
}

// 预加载样本（initGlobalClickSound 时调用）
export function preloadSamples() {
  if (hornSampleUrl && !hornSample) {
    loadSample(hornSampleUrl).then((b) => { hornSample = b })
  }
  if (scrollOpenSampleUrl && !scrollOpenSample) {
    loadSample(scrollOpenSampleUrl).then((b) => { scrollOpenSample = b })
  }
  if (scrollCloseSampleUrl && !scrollCloseSample) {
    loadSample(scrollCloseSampleUrl).then((b) => { scrollCloseSample = b })
  }
  if (approachSampleUrl && !approachSample) {
    loadSample(approachSampleUrl).then((b) => { approachSample = b })
  }
  if (leaveSampleUrl && !leaveSample) {
    loadSample(leaveSampleUrl).then((b) => { leaveSample = b })
  }
  paintSampleUrls.forEach((url, i) => {
    if (url && !paintSamples[i]) {
      loadSample(url).then((b) => { paintSamples[i] = b })
    }
  })
}

// 看画音效：每幅画对应一段（idx 0-3 = 左→右）
export function playPaintSound(idx) {
  const ac = getCtx()
  if (!ac) return
  const s = paintSamples[idx]
  if (!s) return
  const src = ac.createBufferSource()
  src.buffer = s
  const gain = ac.createGain()
  gain.gain.value = 0.85
  src.connect(gain).connect(ac.destination)
  src.start(ac.currentTime + 0.05)
}

const SOUNDS = {
  // 默认：轻咔哒
  click: (ac, t) => tone(ac, t, { freq: 950, end: 480, dur: 0.07, vol: 0.09 }),

  // 悬停：极轻的上滑气泡声（音量刻意压低，不打扰）
  hover: (ac, t) => tone(ac, t, { freq: 520, end: 880, dur: 0.06, vol: 0.028, type: 'sine' }),

  // 收银机按钮：金属"叮"（高频双音 + 尾音）
  cash: (ac, t) => {
    tone(ac, t, { freq: 2093, end: 1800, dur: 0.16, vol: 0.08, type: 'sine' })
    tone(ac, t + 0.02, { freq: 2637, end: 2200, dur: 0.22, vol: 0.06, type: 'sine' })
    noise(ac, t, { dur: 0.03, vol: 0.03, freq: 5000, q: 2 })
  },

  // CRT 电子哔（屏幕点击）
  beep: (ac, t) => tone(ac, t, { freq: 1250, end: 900, dur: 0.06, vol: 0.07, type: 'square' }),

  // 水泡咕噜（汉堡层/兴趣/凤凰对话）
  bubble: (ac, t) => {
    tone(ac, t, { freq: 320, end: 780, dur: 0.11, vol: 0.09, type: 'sine' })
    noise(ac, t + 0.02, { dur: 0.04, vol: 0.04, freq: 1500, q: 3 })
  },

  // 纸卷展开（卷轴打开：视频音频）
  'scroll-open': (ac, t) => {
    if (playSample(scrollOpenSample, { rate: 1 })) return
    noise(ac, t, { dur: 0.22, vol: 0.1, freq: 700, q: 0.8, sweep: 1400 })
    tone(ac, t + 0.05, { freq: 500, end: 300, dur: 0.15, vol: 0.05, type: 'triangle' })
  },

  // 卷轴关闭（视频音频）
  'scroll-close': (ac, t) => {
    if (playSample(scrollCloseSample, { rate: 1 })) return
    tone(ac, t, { freq: 500, end: 200, dur: 0.16, vol: 0.09, type: 'triangle' })
  },

  // 木块轻敲（项目卡片）
  wooden: (ac, t) => {
    tone(ac, t, { freq: 240, end: 90, dur: 0.09, vol: 0.13, type: 'triangle' })
    noise(ac, t, { dur: 0.03, vol: 0.05, freq: 900, q: 2 })
  },

  // 开门 whoosh（弹层开合）
  whoosh: (ac, t) => {
    noise(ac, t, { dur: 0.28, vol: 0.1, freq: 350, q: 0.7, sweep: 2200 })
    tone(ac, t, { freq: 200, end: 520, dur: 0.25, vol: 0.04, type: 'sine' })
  },

  // 确认双音（主要按钮）
  confirm: (ac, t) => {
    tone(ac, t, { freq: 660, end: 660, dur: 0.08, vol: 0.09, type: 'sine' })
    tone(ac, t + 0.09, { freq: 990, end: 990, dur: 0.12, vol: 0.09, type: 'sine' })
  },

  // 玻璃碎裂（彩蛋）
  crash: (ac, t) => {
    noise(ac, t, { dur: 0.22, vol: 0.13, freq: 2400, q: 0.5 })
    tone(ac, t, { freq: 180, end: 50, dur: 0.24, vol: 0.12, type: 'triangle' })
    tone(ac, t + 0.03, { freq: 3200, end: 1400, dur: 0.1, vol: 0.04, type: 'sine' })
  },

  // 神秘水泡（彩蛋 hint）
  mystery: (ac, t) => {
    tone(ac, t, { freq: 220, end: 320, dur: 0.3, vol: 0.07, type: 'sine' })
    tone(ac, t + 0.15, { freq: 330, end: 460, dur: 0.3, vol: 0.06, type: 'sine' })
    noise(ac, t + 0.25, { dur: 0.06, vol: 0.05, freq: 1800, q: 4 })
  },

  // 靠近笔记本屏幕（视频音频 / 合成回退）
  approach: (ac, t) => {
    if (playSample(approachSample, { rate: 1 })) return
    tone(ac, t, { freq: 400, end: 800, dur: 0.3, vol: 0.08, type: 'sine' })
  },

  // 离开笔记本屏幕（视频音频 / 合成回退）
  leave: (ac, t) => {
    if (playSample(leaveSample, { rate: 1 })) return
    tone(ac, t, { freq: 800, end: 300, dur: 0.3, vol: 0.08, type: 'sine' })
  },

  // 凤凰登场号角（视频提取音频 / 合成回退）
  horn: (ac, t) => {
    if (playSample(hornSample, { rate: 1 })) return
    tone(ac, t, { freq: 280, end: 720, dur: 0.4, vol: 0.1, type: 'triangle' })
    tone(ac, t + 0.05, { freq: 420, end: 960, dur: 0.4, vol: 0.06, type: 'sine' })
  },

  // 凤凰退场（同一音频稍慢 / 合成回退）
  fade: (ac, t) => {
    if (playSample(hornSample, { rate: 0.8, vol: 0.6 })) return
    tone(ac, t, { freq: 700, end: 180, dur: 0.5, vol: 0.07, type: 'triangle' })
    noise(ac, t + 0.1, { dur: 0.2, vol: 0.03, freq: 500, q: 1, sweep: 200 })
  }
}

export function playSound(kind = 'click') {
  try {
    const ac = getCtx()
    if (!ac) return
    const fn = SOUNDS[kind] || SOUNDS.click
    fn(ac, ac.currentTime)
  } catch (e) {
    /* 音效失败静默 */
  }
}

// ---- 全局点击委托：按元素自动选音效 ----
let inited = false

// 元素 → 音效映射（按 class 特征匹配，顺序重要）
function soundFor(el) {
  const cls = typeof el.className === 'string' ? el.className : ''
  if (!cls) return null
  if (cls.includes('btn-red') || cls.includes('btn-blue')) return 'cash'
  if (cls.includes('mc-screen')) return 'beep'
  if (cls.includes('formula-scroll')) {
    // 展开=纸卷声，收起=卷轴关闭声（看父容器是否 open）
    return el.parentElement && el.parentElement.classList.contains('open') ? 'scroll-close' : 'scroll-open'
  }
  if (cls.includes('formula-item')) return 'bubble'
  if (cls.includes('fx-phenix')) return 'bubble'
  if (cls.includes('modal')) return 'whoosh'
  if (cls.includes('proj-') || cls.includes('tile') || cls.includes('case-')) return 'wooden'
  if (cls.includes('btn-primary')) return 'confirm'
  if (cls.includes('gh-')) return 'beep'
  if (cls.includes('interest')) return 'bubble'
  if (cls.includes('guest-') || cls.includes('send')) return 'bubble'
  return 'click'
}

export function initGlobalClickSound() {
  if (inited) return
  inited = true
  preloadSamples()   // 预加载音频样本（凤凰号角）
  document.addEventListener('click', (e) => {
    // 找到最近的交互元素
    const el = e.target.closest('button, a, [role="button"], li, .tile, .modal, .proj-card, .formula-item')
    if (!el) return
    const kind = soundFor(el)
    if (kind) playSound(kind)
  }, true)   // 捕获阶段：确保先于组件内其他逻辑
}

// ---- 全局悬停音效：鼠标移入交互元素时轻响（桌面端门户内由 overlay 转发 mouseover 触发） ----
let hoverInited = false
let lastHoverEl = null
let lastHoverAt = 0

export function initGlobalHoverSound() {
  if (hoverInited) return
  hoverInited = true
  // 只在有 hover 能力的设备上注册（触屏没有悬停）
  if (!window.matchMedia('(hover: hover)').matches) return
  document.addEventListener('mouseover', (e) => {
    const t = e.target
    if (!t || typeof t.closest !== 'function') return
    const el = t.closest('button, a, [role="button"], .formula-item, .tile, .proj-card')
    if (!el) { lastHoverEl = null; return }
    if (el === lastHoverEl) return
    lastHoverEl = el
    const now = performance.now()
    if (now - lastHoverAt < 90) return   // 快速扫过时克制，避免连响
    lastHoverAt = now
    playSound('hover')
  }, true)
}
