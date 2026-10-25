// ============================================================
// 点击气泡：任何点击处冒出几颗小气泡（下潜世界的触感）
// 桌面门户的转发点击（合成事件 bubbles:true）与真实点击都会到达
// document，统一在此接管；键盘触发的点击（无坐标）跳过
// ============================================================
let inited = false
const MAX_ALIVE = 80
let alive = 0

export function spawnBubbles(x, y, count = 3) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (document.body.classList.contains('term-open')) return   // 终端态不冒泡
  if (alive > MAX_ALIVE) return
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span')
    const size = 9 + Math.random() * 9
    b.className = 'tap-bubble'
    b.style.cssText =
      `left:${x}px;top:${y}px;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;` +
      `--dx:${(Math.random() * 44 - 22).toFixed(0)}px;--dur:${(1100 + Math.random() * 700).toFixed(0)}ms;` +
      `animation-delay:${(i * 60).toFixed(0)}ms;`
    document.body.appendChild(b)
    alive++
    b.addEventListener('animationend', () => { b.remove(); alive-- }, { once: true })
  }
}

export function initGlobalBubbles() {
  if (inited) return
  inited = true
  document.addEventListener('click', (e) => {
    if (!e.clientX && !e.clientY) return
    if (e.target instanceof HTMLCanvasElement) return   // 3D 开场：点房间/笔记本不冒泡
    // 门户模式下只在站点屏幕内冒泡：点 3D 房间空白（飞回操作）不冒泡
    const portal = document.querySelector('.screen-portal')
    if (portal) {
      const cs = getComputedStyle(portal)
      if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.5) return   // 仍在 3D 开场
      const r = portal.getBoundingClientRect()
      const pad = 6
      if (e.clientX < r.left - pad || e.clientX > r.right + pad ||
          e.clientY < r.top - pad || e.clientY > r.bottom + pad) return
    }
    spawnBubbles(e.clientX, e.clientY, 3)
  }, true)
}

// 标题果冻抖动（Web Animations API，免 class 管理）；返回是否真的动了
export function wobble(el) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  el.animate(
    [
      { transform: 'scale(1, 1)' },
      { transform: 'scale(1.07, 0.88) rotate(-1.2deg)' },
      { transform: 'scale(0.95, 1.06) rotate(1deg)' },
      { transform: 'scale(1.03, 0.98)' },
      { transform: 'scale(1, 1)' }
    ],
    { duration: 560, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
  )
  return true
}
