// ============================================================
// 微交互指令（滚动入场 + 磁性按钮）
// 质感提纯：给页面加"滚动驱动"的生命感，而不是死板的一整页
// ============================================================

// v-reveal：元素进入视口时淡入上移，只触发一次
// 用法：<section v-reveal> 或 <article v-reveal="{ delay: 120 }">
export const vReveal = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return
    el.classList.add('reveal')
    const delay = binding.value && binding.value.delay
    if (delay) el.style.transitionDelay = delay + 'ms'
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    el._revealIo = io
  },
  unmounted(el) {
    if (el._revealIo) el._revealIo.disconnect()
  }
}

// v-magnetic：hover 时元素轻微跟随鼠标（只在 hover 设备生效）
// 用法：<button v-magnetic>（会接管 transform，请勿与 translateY hover 叠加）
export const vMagnetic = {
  mounted(el) {
    if (!window.matchMedia('(hover: hover)').matches) return
    el.classList.add('magnetic')
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      el.style.transform = `translate(${(x * 0.16).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    el._magnetic = { move, leave }
  },
  unmounted(el) {
    if (!el._magnetic) return
    el.removeEventListener('mousemove', el._magnetic.move)
    el.removeEventListener('mouseleave', el._magnetic.leave)
  }
}
