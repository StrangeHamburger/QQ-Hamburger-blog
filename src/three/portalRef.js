// 共享门户注册：krustyScene 每帧取门户 DOM 做投影对齐，ScreenPortal 挂载时注册
let portalEl = null

export function setPortal(el) { portalEl = el }
export function getPortal() { return portalEl }

// 门户是透视投影（matrix3d 非仿射变换），Chrome 的 elementFromPoint / hit-test 会失效
//（滚动偏移未应用：点击视觉位置，事件却落在未滚动坐标）。但 getBoundingClientRect
// 返回滚动后的正确视觉位置——因此手动遍历门户内元素，找包含 (x,y) 的面积最小的
// 元素（= 最深层的可点目标），用于把 overlay 捕获的点击转发给门户内容。
export function portalDeepestAt(portal, x, y) {
  let best = null
  let bestArea = Infinity
  for (const el of portal.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      const area = (r.width || 1) * (r.height || 1)
      if (area < bestArea) {
        bestArea = area
        best = el
      }
    }
  }
  return best
}
