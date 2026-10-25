// 共享门户注册：krustyScene 每帧取门户 DOM 做投影对齐，ScreenPortal 挂载时注册
let portalEl = null

export function setPortal(el) { portalEl = el }
export function getPortal() { return portalEl }

// 门户是透视投影（matrix3d 非仿射变换），Chrome 的 elementFromPoint / hit-test 会失效
//（滚动偏移未应用：点击视觉位置，事件却落在未滚动坐标）。但 getBoundingClientRect
// 返回滚动后的正确视觉位置——因此手动遍历门户内元素，找包含 (x,y) 的面积最小的
// 元素（= 最深层的可点目标），用于把 overlay 捕获的点击转发给门户内容。
//
// 注意三个与原生 hit-test 对齐的细节：
//   1. 跳过矩形退化的元素（亚像素目标不可点）；
//   2. 跳过 visibility: hidden 的元素（收起的面板/装饰，隐藏态统一用 visibility 标记）；
//   3. 平局（面积相等）时取 DOM 顺序更靠后的 = 更深的子元素——否则全屏容器
//      会以父级身份赢过同样全屏的子元素（.drawer 抢走 .drawer-backdrop 的点击，
//      导致桌面端点空白关不掉抽屉）。
//   注意不能按 pointer-events 过滤：门户内容整体继承 none（交互全靠本函数转发），
//      按它过滤会把整站元素全部跳过。
export function portalDeepestAt(portal, x, y) {
  let best = null
  let bestArea = Infinity
  for (const el of portal.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) continue
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      if (getComputedStyle(el).visibility !== 'visible') continue
      const area = (r.width || 1) * (r.height || 1)
      if (area <= bestArea) {
        bestArea = area
        best = el
      }
    }
  }
  return best
}
