// 共享门户注册：krustyScene 每帧取门户 DOM 做投影对齐，ScreenPortal 挂载时注册
let portalEl = null

export function setPortal(el) { portalEl = el }
export function getPortal() { return portalEl }
