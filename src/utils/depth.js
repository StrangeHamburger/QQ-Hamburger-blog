// ============================================================
// 深度系统：滚动进度 0~1 → 下潜叙事
// 桌面端门户内滚 .portal-scroll，移动端/全窗口滚 window
// ============================================================

export const MAX_DEPTH = 3800   // 米：页面底部 ≈ 深海海床

export function getScrollRoot() {
  return document.querySelector('.screen-portal .portal-scroll')
}

// 订阅滚动进度（rAF 节流），返回取消函数
export function onScrollProgress(cb) {
  const root = getScrollRoot()
  const target = root ?? window
  let ticking = false
  let last = -1

  const read = () => {
    ticking = false
    let p = 0
    if (root) {
      const max = root.scrollHeight - root.clientHeight
      p = max > 0 ? root.scrollTop / max : 0
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight
      p = max > 0 ? (window.scrollY || document.documentElement.scrollTop) / max : 0
    }
    p = Math.min(1, Math.max(0, p))
    if (Math.abs(p - last) > 0.001) {
      last = p
      cb(p)
    }
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(read)
    }
  }

  target.addEventListener('scroll', onScroll, { passive: true })
  read()
  return () => target.removeEventListener('scroll', onScroll)
}
