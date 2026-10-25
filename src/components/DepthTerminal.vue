<script setup>
// ============================================================
// 深海终端彩蛋：按 ~ 呼出 CRT 绿屏，输入指令与"蟹堡王系统"对话
// 桌面端投影到笔记本屏幕内（Teleport 到 .screen-portal），移动端全屏
// 页脚的 ">_" 小按钮会派发 open-terminal 事件（移动端无键盘的入口）
// ============================================================
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

const open = ref(false)
const lines = ref([])
const input = ref('')
const bodyEl = ref(null)
const inputEl = ref(null)
const teleportTo = ref('body')

const HELP = [
  '可用指令：',
  '  help            显示本帮助',
  '  whoami          我是谁',
  '  ls              列出本店文件',
  '  cat 秘方.txt    查看蟹黄堡秘方',
  '  depth           当前水深',
  '  make burger     做一个蟹黄堡',
  '  sudo ...        以蟹老板权限执行',
  '  clear           清屏',
  '  exit / Esc      关闭终端'
]

let history = []
let histIdx = -1

function print(text, cls = '') {
  lines.value.push({ text, cls })
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight
    inputEl.value?.focus()
  })
}

function openTerm() {
  teleportTo.value = document.querySelector('.screen-portal') ? '.screen-portal' : 'body'
  open.value = true
  // 终端态标记：门户 overlay 光标变文本、全局点击气泡屏蔽（见 App.vue / bubbles.js）
  document.body.classList.add('term-open')
  if (!lines.value.length) {
    print('KRUSTY KRAB 深海终端 v3.0 — 已连接后厨主机')
    print('输入 help 查看指令 · 输入 exit 或按 Esc / ~ 关闭终端。', 'dim')
  }
  nextTick(() => inputEl.value?.focus())
}
function closeTerm() {
  open.value = false
  document.body.classList.remove('term-open')
}

function onOpenEvent() { openTerm() }

function onKey(e) {
  const t = e.target
  const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
  if (e.code === 'Backquote' || e.key === '`' || e.key === '~') {
    if (!typing) {
      e.preventDefault()
      open.value ? closeTerm() : openTerm()
    }
    return
  }
  if (e.key === 'Escape' && open.value) {
    closeTerm()
    return
  }
  // 终端开着但焦点不在输入框（比如被站点点击驱散）：任意按键自动拉回输入框，
  // 字符本身也会落进 input（焦点恢复后浏览器继续派发到 activeElement）
  if (open.value && !typing && document.activeElement !== inputEl.value &&
      !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
    inputEl.value?.focus()
  }
}

function depthText() {
  const el = document.querySelector('.depth-gauge')
  return el ? el.textContent.replace(/^DEPTH/i, '').trim() : '-0 M'
}

// 带停顿的多行输出（做汉堡的小动画感）
function printSeq(seq, gap = 420) {
  seq.forEach((s, i) => setTimeout(() => print(s.text ?? s, s.cls), i * gap))
}

function submit() {
  const raw = input.value
  input.value = ''
  const cmd = raw.trim()
  print('chef@krusty-krab:~$ ' + cmd, 'cmd')
  if (!cmd) return
  history.unshift(cmd)
  histIdx = -1
  const lower = cmd.toLowerCase()
  const head = lower.split(/\s+/)[0]
  const arg = cmd.slice(cmd.indexOf(' ') + 1).trim()

  if (head === 'help') {
    HELP.forEach(l => print(l))
    print('传闻：在页面上输入 ↑↑↓↓←→←→BA，天上有东西掉下来…', 'dim')
  } else if (head === 'whoami' || cmd.includes('我是谁') || cmd.includes('你是谁')) {
    print('QQ Hamburger · 25 届 CS · 蟹堡王深夜值班厨师（兼职修企鹅电脑）')
  } else if (head === 'ls') {
    print('秘方.txt  项目/  彩蛋/  凤凰.dll  蟹老板的账本.xlsx')
  } else if (head === 'cat') {
    if (arg.includes('秘方') || arg.toLowerCase() === 'secret') {
      print('▓▓▓▓▓ TOP SECRET ▓▓▓▓▓', 'warn')
      print('蟹老板：这份秘方的价值 = 整个比奇堡！想都别想！')
    } else if (arg.includes('账本')) {
      print('今日营业额：██████████（蟹老板捂住了账本）')
    } else {
      print('cat: ' + (arg || '?') + ': 没有那个文件（试试 ls）', 'warn')
    }
  } else if (head === 'depth' || cmd.includes('水深') || cmd.includes('多深')) {
    print('当前水深 ' + depthText() + ' — 继续往下滚，更深的地方藏着别的秘密。')
  } else if (head === 'sudo') {
    print('[sudo] 蟹老板 的密码：********')
    setTimeout(() => print('蟹老板：密码错误。这家店我说了算，年轻人。', 'warn'), 500)
  } else if (head === 'make' || head === 'cook' || cmd.includes('蟹黄') || cmd.includes('汉堡')) {
    if ((arg && (arg.includes('burger') || arg.includes('堡'))) || cmd.includes('蟹黄') || cmd.includes('汉堡')) {
      printSeq([
        '正在热锅…滋滋滋',
        '铺上面包 → 肉饼 → 芝士 → 生菜 → 番茄',
        '浇上秘方酱料（这一步删掉了 30 行代码）'
      ], 520)
      // 像素蟹黄堡：逐行弹出，按层上色。
      // 每行 = 前导空格 + 等宽块字符，(30 - 宽度) / 2 居中，保证层层对齐
      const art = [
        ['        ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄', 'c-bun'],
        ['    ██████████████████████', 'c-bun'],
        ['  ██████████████████████████', 'c-bun'],
        [' ▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒▓▒', 'c-lettuce'],
        ['  ██████████████████████████', 'c-cheese'],
        [' ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒', 'c-patty'],
        ['    ██████████████████████', 'c-tomato-line'],
        ['  ██████████████████████████', 'c-bun'],
        ['      ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀', 'c-bun'],
        ['▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄', 'c-plate']
      ]
      art.forEach((l, i) => setTimeout(() => print(l[0], l[1]), 1900 + i * 130))
      setTimeout(() => print('✅ 蟹黄堡完成！好看又好吃。', 'warn'), 1900 + art.length * 130 + 250)
    } else {
      print('make: 不知道要做什么。试试 make burger', 'warn')
    }
  } else if (head === 'hello' || head === 'hi' || head === '你好') {
    print('你好，深海。今天也适合写代码。')
  } else if (cmd.includes('凤凰') || cmd.includes('phenix')) {
    print('提示：她藏在楼上的收银机里。红键、蓝键、连点三下屏幕。', 'dim')
  } else if (head === 'clear' || cmd.includes('清屏')) {
    lines.value = []
  } else if (head === 'exit' || head === 'quit' || cmd.includes('再见') || cmd.includes('拜拜') || cmd.includes('退出')) {
    closeTerm()
  } else if (cmd.includes('帮助') || cmd === '?') {
    HELP.forEach(l => print(l))
  } else {
    print('命令未找到：' + cmd + '（输入 help 查看可用的秘密指令）', 'warn')
  }
}

function hist(dir) {
  if (!history.length) return
  histIdx = Math.min(history.length - 1, Math.max(-1, histIdx + dir))
  input.value = histIdx === -1 ? '' : history[histIdx]
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('open-terminal', onOpenEvent)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('open-terminal', onOpenEvent)
})
</script>

<template>
  <!-- transition 包在 Teleport 外层（与 ProjectModal 同款结构） -->
  <transition name="term">
    <Teleport v-if="open" :to="teleportTo">
      <div class="depth-term" @click="inputEl?.focus()">
        <div class="dt-head">
          <span class="dt-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="dt-title mono-label">CHEF@KRUSTY-KRAB — DEEP SEA SHELL</span>
          <button class="dt-close" aria-label="关闭终端" @click.stop="closeTerm">×</button>
        </div>
        <div ref="bodyEl" class="dt-body" @click.stop>
          <p v-for="(l, i) in lines" :key="i" class="dt-line" :class="l.cls">{{ l.text }}</p>
          <div class="dt-inputline">
            <span class="dt-prompt">chef@krusty-krab:~$</span>
            <input
              ref="inputEl"
              v-model="input"
              class="dt-input"
              spellcheck="false"
              autocomplete="off"
              aria-label="终端输入"
              @keydown.enter.prevent="submit"
              @keydown.up.prevent="hist(-1)"
              @keydown.down.prevent="hist(1)"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </transition>
</template>

<style scoped>
.depth-term {
  position: fixed; inset: 0;
  z-index: 500;
  display: flex; flex-direction: column;
  background: rgba(5, 16, 13, 0.92);
  border: 2px solid rgba(126, 255, 168, 0.3);
  color: #8effb0;
  font-family: var(--font-mono);
  text-shadow: 0 0 6px rgba(110, 255, 160, 0.45);
  cursor: text;
  overflow: hidden;
}
/* CRT 扫描线 */
.depth-term::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, transparent 1px 3px);
  pointer-events: none;
}

.dt-head {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(126, 255, 168, 0.25);
  flex-shrink: 0;
}
.dt-dots { display: flex; gap: 5px; }
.dt-dots i {
  width: 9px; height: 9px; border-radius: 50%;
  background: rgba(126, 255, 168, 0.35);
}
.dt-dots i:first-child { background: var(--tomato); }
.dt-title { font-size: 10px; letter-spacing: 0.2em; opacity: 0.75; }
.dt-close {
  margin-left: auto;
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  color: #8effb0;
  font-size: 18px; line-height: 1;
  border: 1px solid rgba(126, 255, 168, 0.4);
  border-radius: 6px;
  background: rgba(126, 255, 168, 0.08);
  cursor: pointer;
  transition: color var(--dur-fast), background var(--dur-fast), transform var(--dur-fast);
}
.dt-close:hover {
  color: #ffb3a6;
  background: rgba(224, 69, 46, 0.25);
  border-color: rgba(224, 69, 46, 0.5);
  transform: rotate(90deg);
}

.dt-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 18px;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-all;
}
.dt-line { min-height: 1em; }
.dt-line.cmd { color: #d8ffe4; }
.dt-line.warn { color: #ffd27d; text-shadow: 0 0 6px rgba(255, 200, 100, 0.4); }
.dt-line.dim { opacity: 0.6; }
/* 像素蟹黄堡：按层上色 */
.dt-line.c-bun { color: #ffd27d; text-shadow: 0 0 5px rgba(255, 210, 125, 0.35); }
.dt-line.c-lettuce { color: #8fd974; text-shadow: 0 0 5px rgba(143, 217, 116, 0.35); }
.dt-line.c-cheese { color: #ffe9a8; }
.dt-line.c-patty { color: #b5763b; }
.dt-line.c-tomato-line { color: #ff8a70; }
.dt-line.c-plate { color: rgba(200, 230, 220, 0.55); }

.dt-inputline { display: flex; gap: 8px; align-items: baseline; }
.dt-prompt { color: #ffd27d; flex-shrink: 0; }
.dt-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #8effb0;
  font-family: var(--font-mono);
  font-size: 13px;
  caret-color: #8effb0;
}

/* 开关过渡 */
.term-enter-active { transition: opacity 200ms ease, transform 240ms var(--ease-out); }
.term-enter-from { opacity: 0; transform: scale(0.97) translateY(8px); }
.term-leave-active { transition: opacity 160ms ease; }
.term-leave-to { opacity: 0; }
</style>
