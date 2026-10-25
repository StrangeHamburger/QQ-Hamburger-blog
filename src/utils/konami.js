// ============================================================
// Konami 秘技：↑↑↓↓←→←→BA → 蟹黄堡雨
// 终端输入时不监听（避免打字误触）
// ============================================================
import { playSound } from './sound.js'

const SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let inited = false

export function initKonami() {
  if (inited) return
  inited = true
  let idx = 0
  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('term-open')) return
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    if (key === SEQ[idx]) {
      idx++
      if (idx === SEQ.length) {
        idx = 0
        burgerRain()
      }
    } else {
      idx = key === SEQ[0] ? 1 : 0
    }
  })
}

function burgerRain() {
  playSound('horn')
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div')
    b.className = 'burger-rain'
    b.textContent = '🍔'
    b.style.left = (5 + Math.random() * 90) + 'vw'
    b.style.animationDelay = (Math.random() * 0.9).toFixed(2) + 's'
    b.style.animationDuration = (1.6 + Math.random() * 1.2).toFixed(2) + 's'
    document.body.appendChild(b)
    b.addEventListener('animationend', () => b.remove(), { once: true })
  }
}
