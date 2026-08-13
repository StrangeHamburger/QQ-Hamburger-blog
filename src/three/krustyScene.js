// ============================================================
// 海底蟹堡王餐厅 · 3D 场景模块
// 密闭餐厅内部：圆桌正中央放笔记本，旁边一个蟹堡；
// 相机状态机 idle(远观漂移) → arrive(点击笔记本飞近) → home(常驻边框)
// 进入 home 后，把笔记本屏幕 4 角投影成像素，驱动 DOM 门户矩阵对齐
// ============================================================
import * as THREE from 'three'
import { playSound, playPaintSound } from '../utils/sound.js'

const TAU = Math.PI * 2
const TABLE_TOP = 1.2        // 桌面高度（抬高）
const TABLE_R = 3.4          // 桌面半径（放大）
const ROOM_R = 7.5           // 房间半径
const ROOM_H = 4.8           // 房间高度

const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

export function createKrustyScene(el, opts = {}) {
  const { onArrive = () => {}, onLeave = () => {}, getPortal = () => null } = opts

  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const W = window.innerWidth
  const H = window.innerHeight

  // ==================== renderer / scene / camera ====================
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(W, H)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x10243a)
  scene.fog = new THREE.Fog(0x10243a, 16, 28)

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 60)

  // ==================== 灯光 ====================
  scene.add(new THREE.AmbientLight(0x46658a, 0.85))
  scene.add(new THREE.HemisphereLight(0x9fc4e8, 0x241a12, 0.55))

  const lamp = new THREE.SpotLight(0xffd9a0, 120, 0, 0.7, 0.8, 1.6)
  lamp.position.set(0, 3.65, 0)
  lamp.target.position.set(0, 0, 0)
  lamp.castShadow = true
  lamp.shadow.mapSize.set(1024, 1024)
  lamp.shadow.camera.near = 0.5
  lamp.shadow.camera.far = 9
  scene.add(lamp, lamp.target)

  // 相机侧柔和暖光（提亮桌面，避免背光死黑）
  const fill = new THREE.PointLight(0xffd9b0, 10, 20, 2)
  fill.position.set(0, 2.0, 7.6)
  scene.add(fill)

  // 舷窗冷光（气氛光）
  const glowA = new THREE.PointLight(0x79c6ff, 14, 16, 2)
  glowA.position.set(0, 2.5, -7.2)
  scene.add(glowA)
  const glowB = new THREE.PointLight(0x79c6ff, 7, 14, 2)
  glowB.position.set(3.6, 2.6, -3.8)
  scene.add(glowB)

  // ==================== 场景几何 ====================
  const MAT = {
    wall: new THREE.MeshStandardMaterial({ color: 0x1a2c46, roughness: 0.9, side: THREE.BackSide }),
    floor: new THREE.MeshStandardMaterial({ color: 0x4a3828, roughness: 0.95, side: THREE.DoubleSide }),
    ceiling: new THREE.MeshStandardMaterial({ color: 0x1c2f47, roughness: 0.9, side: THREE.DoubleSide }),
    wood: new THREE.MeshStandardMaterial({ color: 0x6e4a2f, roughness: 0.7 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x53351f, roughness: 0.85 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xf2ebdd, roughness: 0.35, metalness: 0.05 }),
    navy: new THREE.MeshStandardMaterial({ color: 0x24425e, roughness: 0.45, metalness: 0.2 }),
    lampShade: new THREE.MeshStandardMaterial({ color: 0xe0452e, roughness: 0.5, side: THREE.DoubleSide }),
    bulb: new THREE.MeshStandardMaterial({ color: 0xfff3d8, emissive: 0xffd9a0, emissiveIntensity: 2.2 })
  }

  // --- 房间 ---
  const floor = new THREE.Mesh(new THREE.CircleGeometry(ROOM_R, 64), MAT.floor)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const wall = new THREE.Mesh(new THREE.CylinderGeometry(ROOM_R, ROOM_R, ROOM_H, 64, 1, true), MAT.wall)
  wall.position.y = ROOM_H / 2
  wall.receiveShadow = true
  scene.add(wall)

  const ceiling = new THREE.Mesh(new THREE.CircleGeometry(ROOM_R, 64), MAT.ceiling)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = ROOM_H
  scene.add(ceiling)

  // --- 背景装饰：护墙板 / 踢脚线 / 腰线 / 檐口 / 挂画 ---
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 })
  const trimBright = new THREE.MeshStandardMaterial({ color: 0x553c22, roughness: 0.7 })

  const wainscot = new THREE.Mesh(
    new THREE.CylinderGeometry(ROOM_R - 0.08, ROOM_R - 0.08, 1.0, 64, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.85, side: THREE.BackSide })
  )
  wainscot.position.y = 0.5
  scene.add(wainscot)

  const baseboard = new THREE.Mesh(new THREE.TorusGeometry(ROOM_R - 0.14, 0.08, 8, 72), trimMat)
  baseboard.position.y = 0.08
  baseboard.rotation.x = Math.PI / 2
  scene.add(baseboard)

  const rail = new THREE.Mesh(new THREE.TorusGeometry(ROOM_R - 0.14, 0.05, 8, 72), trimBright)
  rail.position.y = 1.0
  rail.rotation.x = Math.PI / 2
  scene.add(rail)

  const crown = new THREE.Mesh(new THREE.TorusGeometry(ROOM_R - 0.14, 0.07, 8, 72), trimMat)
  crown.position.y = ROOM_H - 0.12
  crown.rotation.x = Math.PI / 2
  scene.add(crown)

  // 四幅挂画（图片纹理，可点击靠近查看；paintings 供射线检测）
  const paintings = []
  const paintingUrls = [
    import.meta.env.BASE_URL + 'assets/painting-1.jpg',   // 从左到右：左墙
    import.meta.env.BASE_URL + 'assets/painting-2.jpg',   // 后墙左
    import.meta.env.BASE_URL + 'assets/painting-3.jpg',   // 后墙右
    import.meta.env.BASE_URL + 'assets/painting-4.jpg'    // 右墙
  ]
  const paintFrame = new THREE.MeshStandardMaterial({ color: 0x5a3d22, roughness: 0.6 })
  const addPainting = (x, y, z, s, texIndex) => {
    const g = new THREE.Group()
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.1 * s, 0.85 * s, 0.06), paintFrame)
    g.add(back)
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92 * s, 0.67 * s),
      new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
    )
    art.position.set(0, 0, 0.035)
    g.add(art)
    g.position.set(x, y, z)
    g.lookAt(0, y, 0)
    g.userData.painting = texIndex
    scene.add(g)
    paintings.push(g)
    // 异步加载画作图片
    new THREE.TextureLoader().load(
      paintingUrls[texIndex],
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        art.material.map = tex
        art.material.needsUpdate = true
      },
      undefined,
      () => { /* 加载失败保持白底，不影响场景 */ }
    )
  }
  // 四幅挂画：两窗之间 + 左右外侧墙面，对称分布（避开所有窗户）
  addPainting(-6.7, 2.4, -3.25, 0.95, 0)  // 左窗左侧
  addPainting(-3.0, 2.4, -6.4, 0.95, 1)   // 后墙左
  addPainting(3.0, 2.4, -6.4, 0.95, 2)    // 后墙右
  addPainting(6.7, 2.4, -3.25, 0.95, 3)   // 右窗右侧

  // --- 桌下地毯 ---
  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(3.0, 64),
    new THREE.MeshStandardMaterial({ map: makeRugTexture(), roughness: 1 })
  )
  rug.rotation.x = -Math.PI / 2
  rug.position.y = 0.012
  scene.add(rug)

  // --- 吊灯（抬高，悬在桌面与天花板之间） ---
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8), MAT.woodDark)
  cord.position.set(0, ROOM_H - 0.3, 0)
  scene.add(cord)
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.1, 0.8, 32, 1, true), MAT.lampShade)
  shade.position.set(0, ROOM_H - 0.6, 0)
  scene.add(shade)
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.195, 16, 12), MAT.bulb)  // 1.5 倍
  bulb.position.set(0, ROOM_H - 0.85, 0)   // 上移一个身位（原 -1.15）
  scene.add(bulb)

  // --- 方形观景窗（三扇，直角框透出海底，无弧形） ---
  const seaTex = makeSeaTexture()
  const mkWindow = (x, y, z, w, h) => {
    const g = buildWindow(seaTex, w, h)
    g.position.set(x, y, z)
    g.lookAt(0, y, 0)
    scene.add(g)
  }
  mkWindow(0, 2.8, -7.2, 3.8, 2.3)     // 中央大横窗
  mkWindow(5.2, 2.3, -5.0, 1.9, 1.7)   // 右侧方窗
  mkWindow(-5.2, 2.3, -5.0, 1.9, 1.7)  // 左侧方窗

  // --- 圆桌（放大 + 抬高） ---
  const table = new THREE.Group()
  const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(TABLE_R, TABLE_R, 0.16, 48), MAT.wood)
  topMesh.position.y = TABLE_TOP - 0.08
  topMesh.receiveShadow = true
  topMesh.castShadow = true
  table.add(topMesh)
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, TABLE_TOP - 0.16, 24), MAT.woodDark)
  pedestal.position.y = (TABLE_TOP - 0.16) / 2
  table.add(pedestal)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 0.16, 32), MAT.woodDark)
  base.position.y = 0.08
  table.add(base)
  scene.add(table)

  // --- 笔记本（桌面正中） ---
  let screenGrp = null
  let screenGlow = null
  const cornersLocal = [
    new THREE.Vector3(-1.63, 0.17, 0.05),   // BL（屏幕收窄后）
    new THREE.Vector3(1.63, 0.17, 0.05),    // BR
    new THREE.Vector3(1.63, 1.83, 0.05),    // TR
    new THREE.Vector3(-1.63, 1.83, 0.05)    // TL
  ]
  const laptop = new THREE.Group()
  laptop.position.set(0, TABLE_TOP, 0)
  buildLaptop(laptop, MAT, (grp, glow) => { screenGrp = grp; screenGlow = glow })
  scene.add(laptop)

  // 笔记本点击热区（隐形包围盒，宽容判定）
  const hitMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3.9, 2.5, 2.1),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  hitMesh.position.set(0, TABLE_TOP + 2.0, -0.25)
  scene.add(hitMesh)

  // --- 蟹堡 + 调料瓶（笔记本两侧，远离屏幕不穿模） ---
  const burger = new THREE.Group()
  burger.position.set(-2.6, TABLE_TOP, 0.35)
  burger.rotation.y = 0.35
  buildBurger(burger)
  scene.add(burger)

  const drink = new THREE.Group()
  drink.position.set(2.4, TABLE_TOP, 0.1)   // 往左移一点（x 2.6→2.4）
  drink.rotation.y = -0.5
  buildDrink(drink)
  scene.add(drink)

  // --- 气泡（房间内漂浮） ---
  const bubbleMat = new THREE.MeshBasicMaterial({
    color: 0xbfe4ff, transparent: true, opacity: 0.2, depthWrite: false
  })
  const bubbles = []
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.035 + Math.random() * 0.05, 12, 10), bubbleMat)
    m.position.set((Math.random() - 0.5) * 6, Math.random() * 3.0, -2.5 - Math.random() * 3.5)
    scene.add(m)
    bubbles.push({ mesh: m, speed: 0.15 + Math.random() * 0.25, drift: (Math.random() - 0.5) * 0.6 })
  }

  // ==================== 相机状态机 ====================
  const idleBase = new THREE.Vector3(0, 3.0, 8.6)
  const idleTarget = new THREE.Vector3(0, 1.7, 0)
  let mode = 'idle'                       // 'idle' | 'arrive' | 'home' | 'return'
  let arrive = null
  let leaveTween = null
  let homeBase = null
  let homeTarget = null
  let cornersWorld = null

  camera.position.copy(idleBase)
  camera.lookAt(idleTarget)

  function computeArrivePose() {
    if (!screenGrp) return null
    screenGrp.updateMatrixWorld(true)
    const cw = cornersLocal.map((v) => v.clone().applyMatrix4(screenGrp.matrixWorld))
    const center = new THREE.Vector3()
    cw.forEach((v) => center.add(v))
    center.divideScalar(4)
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(
      screenGrp.getWorldQuaternion(new THREE.Quaternion())
    )
    // 相机正对屏幕法线方向：视线垂直于屏幕，页面矩形不变形；拉远留白、垂直居中
    const d = 3.4
    const pos = center.clone().addScaledVector(normal, d)
    const target = center.clone().add(new THREE.Vector3(0, -0.14, 0))
    return { pos, target, center }
  }

  function startArrive() {
    if (mode !== 'idle') return
    playSound('approach')   // 靠近笔记本屏幕音效
    const pose = computeArrivePose()
    if (!pose) return
    arrive = {
      p0: camera.position.clone(),
      t0: new THREE.Vector3(),
      p1: pose.pos,
      t1: pose.target,
      start: performance.now(),
      dur: reducedMotion ? 200 : 2600
    }
    camera.getWorldDirection(arrive.t0).multiplyScalar(10).add(camera.position)
    mode = 'arrive'
  }

  // 点击门户外 → 从屏幕前飞回远观机位
  function startReturn() {
    if (mode !== 'home') return
    playSound('leave')   // 离开笔记本屏幕音效
    onLeave() // 立即隐藏门户，主站淡出，相机随后飞回
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    leaveTween = {
      p0: camera.position.clone(),
      t0: dir.multiplyScalar(10).add(camera.position),
      p1: idleBase.clone(),
      t1: idleTarget.clone(),
      start: performance.now(),
      dur: reducedMotion ? 150 : 1400
    }
    mode = 'return'
  }

  // 靠近看画：idle → view（相机飞到画前）；点画框外 → 回 idle
  let viewTween = null
  let viewIdleTarget = null

  // 从射线命中对象向上找画索引
  function paintingIndex(obj) {
    let o = obj
    while (o) {
      if (o.userData && o.userData.painting !== undefined) return o.userData.painting
      o = o.parent
    }
    return -1
  }

  function startViewPainting(idx) {
    if (mode !== 'idle' || !paintings[idx]) return
    // 看画无音效（用户要求静音）
    const g = paintings[idx]
    const c = g.position
    const center = new THREE.Vector3(c.x, 2.4, c.z)
    const dir = center.clone().normalize()
    const toPos = center.clone().addScaledVector(dir, -2.0)   // 画前 2 个单位
    const toTarget = center.clone()
    viewTween = {
      p0: camera.position.clone(),
      t0: idleTarget.clone(),
      p1: toPos,
      t1: toTarget,
      start: performance.now(),
      dur: reducedMotion ? 150 : 1300,
      back: false
    }
    mode = 'view'
    // 靠近画后播放该画对应音效（每幅画一段；退出看画无音效）
    setTimeout(() => {
      if (mode === 'view' || mode === 'viewIdle') playPaintSound(idx)
    }, reducedMotion ? 200 : 1400)
  }

  function startLeaveView() {
    if (mode !== 'view' && mode !== 'viewIdle') return
    if (mode === 'view' && viewTween && viewTween.back) return   // 已在返回中，防连点重置
    // 看画返回无音效（用户要求静音）
    const cur = camera.position.clone()
    const curTarget = (mode === 'viewIdle' && viewIdleTarget)
      ? viewIdleTarget.clone()
      : idleTarget.clone()
    viewTween = {
      p0: cur,
      t0: curTarget,
      p1: idleBase.clone(),
      t1: idleTarget.clone(),
      start: performance.now(),
      dur: reducedMotion ? 150 : 1200,
      back: true
    }
    mode = 'view'
  }

  function setHomePose() {
    if (!arrive) return
    homeBase = arrive.p1.clone()
    homeTarget = arrive.t1.clone()
    cornersWorld = cornersLocal.map((v) =>
      v.clone().applyMatrix4(screenGrp.matrixWorld)
    )
  }

  // ==================== DOM 门户投影对齐 ====================
  function project(v) {
    // 必须 clone：v.project(camera) 会原地修改向量，污染 cornersWorld
    const p = v.clone().project(camera)
    return { x: (p.x * 0.5 + 0.5) * window.innerWidth, y: (-p.y * 0.5 + 0.5) * window.innerHeight }
  }

  // 单位正方形 → 四边形透视映射，再换算到门户元素局部像素（CSS matrix3d）
  // 元素局部点 (px, py) 对应单位坐标 u=px/w, v=py/h：
  //   X = (a·u + b·v + c) / (g·u + h·v + 1)
  // 通分 w·h 后，matrix3d 的齐次形式为：
  //   m11=a·h, m21=b·w, m41=c·w·h, m14=g·h, m24=h·w, m44=w·h（y 同理）
  function quadTransform(w, h, p0, p1, p2, p3) {
    const x0 = p0.x, y0 = p0.y, x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y
    const dx1 = x1 - x2, dy1 = y1 - y2
    const dx2 = x3 - x2, dy2 = y3 - y2
    const sx = x0 - x1 + x2 - x3
    const sy = y0 - y1 + y2 - y3
    const den = dx1 * dy2 - dy1 * dx2
    let g = 0, hh = 0
    if (Math.abs(den) > 1e-8) {
      g = (sx * dy2 - sy * dx2) / den
      hh = (dx1 * sy - dy1 * sx) / den
    }
    const a = x1 - x0 + g * x1
    const b = x3 - x0 + hh * x3
    const c = x0
    const d = y1 - y0 + g * y1
    const e = y3 - y0 + hh * y3
    const f = y0
    const ww = w * h
    return `matrix3d(${[
      a * h, d * h, 0, g * h,
      b * w, e * w, 0, hh * w,
      0, 0, 1, 0,
      c * ww, f * ww, 0, ww
    ].join(',')})`
  }

  function updatePortal() {
    const portal = getPortal()
    if (!portal || !cornersWorld) return
    const w = portal.clientWidth
    const h = portal.clientHeight
    if (!w || !h) return
    // cornersLocal 顺序为 [BL, BR, TR, TL]；CSS 元素局部 (0,0) 在左上。
    // 屏幕像素空间里 "上" 是世界 y 最大的角，因此传入顺序要换成
    // [TL, TR, BR, BL]，否则元素内容会上下颠倒。
    const px = [cornersWorld[3], cornersWorld[2], cornersWorld[1], cornersWorld[0]].map((v) => project(v))
    portal.style.transform = quadTransform(w, h, px[0], px[1], px[2], px[3])
    portal.style.transformOrigin = '0 0'
  }

  // ==================== 交互 ====================
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function setPointer(e) {
    const r = renderer.domElement.getBoundingClientRect()
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
  }

  function onPointerMove(e) {
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)
    if (mode === 'idle') {
      const p = raycaster.intersectObjects(paintings, true)
      renderer.domElement.style.cursor =
        p.length || raycaster.intersectObject(hitMesh).length ? 'pointer' : 'default'
    } else if (mode === 'home' || mode === 'viewIdle') {
      // 门户外 / 画框外即"返回"可点击区
      renderer.domElement.style.cursor = 'pointer'
    } else {
      renderer.domElement.style.cursor = 'default'
    }
  }

  function onPointerDown(e) {
    if (mode === 'home') {
      // 点击页面（门户外）→ 飞回远观场景
      startReturn()
      return
    }
    if (mode === 'view' || mode === 'viewIdle') {
      // 点画上停留；点画框外 → 回初始机位
      setPointer(e)
      raycaster.setFromCamera(pointer, camera)
      if (!raycaster.intersectObjects(paintings, true).length) startLeaveView()
      return
    }
    if (mode !== 'idle') return
    setPointer(e)
    raycaster.setFromCamera(pointer, camera)
    // 画优先：命中挂画 → 靠近查看
    const p = raycaster.intersectObjects(paintings, true)
    if (p.length) {
      const idx = paintingIndex(p[0].object)
      if (idx >= 0) startViewPainting(idx)
      return
    }
    if (raycaster.intersectObject(hitMesh).length) startArrive()
  }

  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('pointerdown', onPointerDown)

  function onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  // ==================== 主循环 ====================
  const clock = new THREE.Clock()
  let t = 0
  let raf = 0

  function animateBubbles(dt) {
    for (const b of bubbles) {
      b.mesh.position.y += b.speed * dt
      b.mesh.position.x += Math.sin(t * 0.6 + b.mesh.position.y) * 0.002
      if (b.mesh.position.y > 3.2) {
        b.mesh.position.y = 0
        b.mesh.position.x = (Math.random() - 0.5) * 6
        b.mesh.position.z = -2.5 - Math.random() * 3.5
      }
    }
  }

  function tick() {
    raf = requestAnimationFrame(tick)
    const dtRaw = clock.getDelta()
    const dt = Math.min(dtRaw, 0.05)          // 视觉动画域
    const tweenDt = Math.min(dtRaw, 0.5)      // 相机补间域（headless 低帧率也能按墙钟完成）
    t += dt

    if (screenGlow) {
      screenGlow.material.opacity = 0.1 + Math.sin(t * 1.3) * 0.04
    }
    animateBubbles(dt)

    if (mode === 'idle') {
      // 固定机位，不漂移（页面/场景保持静止，避免干扰阅读）
      camera.position.copy(idleBase)
      camera.lookAt(idleTarget)
    } else if (mode === 'arrive') {
      const p = (performance.now() - arrive.start) / arrive.dur
      const e = easeInOutCubic(Math.min(1, p))
      camera.position.lerpVectors(arrive.p0, arrive.p1, e)
      camera.lookAt(tmpVec().lerpVectors(arrive.t0, arrive.t1, e))
      if (p >= 1) {
        mode = 'home'
        setHomePose()
        onArrive()
        updatePortal()
      }
    } else if (mode === 'return') {
      const p = (performance.now() - leaveTween.start) / leaveTween.dur
      const e = easeInOutCubic(Math.min(1, p))
      camera.position.lerpVectors(leaveTween.p0, leaveTween.p1, e)
      camera.lookAt(tmpVec().lerpVectors(leaveTween.t0, leaveTween.t1, e))
      if (p >= 1) {
        mode = 'idle'
        cornersWorld = null
      }
    } else if (mode === 'view') {
      // 靠近看画 / 返回初始机位的相机过渡
      const p = (performance.now() - viewTween.start) / viewTween.dur
      const e = easeInOutCubic(Math.min(1, p))
      camera.position.lerpVectors(viewTween.p0, viewTween.p1, e)
      camera.lookAt(tmpVec().lerpVectors(viewTween.t0, viewTween.t1, e))
      if (p >= 1) {
        if (viewTween.back) {
          mode = 'idle'
        } else {
          viewIdleTarget = viewTween.t1.clone()   // 记住看画目标
          mode = 'viewIdle'
        }
        viewTween = null
      }
    } else if (mode === 'viewIdle') {
      // 停在画前，等待点击画框外返回
      if (viewIdleTarget) camera.lookAt(viewIdleTarget)
    } else if (mode === 'home') {
      // 固定机位，不漂移；仅每帧把门户投影到屏幕
      camera.position.copy(homeBase)
      camera.lookAt(homeTarget)
      updatePortal()
    }

    renderer.render(scene, camera)
  }

  const _tmp = new THREE.Vector3()
  function tmpVec() { return _tmp }

  tick()

  // ==================== 导出接口 ====================
  function enter() { startArrive() }
  function leave() { startReturn() }
  function getState() { return { mode, hasPortal: !!getPortal() } }

  // 调试/演示用
  function setCam(p, t) { idleBase.set(...p); idleTarget.set(...t) }
  window.__krusty = { enter, leave, getState, setCam }

  function dispose() {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    renderer.domElement.removeEventListener('pointermove', onPointerMove)
    renderer.domElement.removeEventListener('pointerdown', onPointerDown)
    renderer.domElement.remove()
    renderer.dispose()
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (m.map) m.map.dispose()
          m.dispose()
        })
      }
    })
  }

  return { canvas: renderer.domElement, enter, leave, getState, dispose }
}

// ============================================================
// 部件构建
// ============================================================

// 6 行键盘布局（键帽阵列与字母贴图共用）
const KEYBOARD_ROWS = [
  [['esc', 1.4], ['F1', 1], ['F2', 1], ['F3', 1], ['F4', 1], ['F5', 1], ['F6', 1], ['F7', 1], ['F8', 1], ['F9', 1], ['F10', 1], ['F11', 1], ['F12', 1]],
  [['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['⌫', 1.9]],
  [['TAB', 1.5], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1], ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1.5]],
  [['CAPS', 1.8], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1], ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['⏎', 2.2]],
  [['SHIFT', 2.3], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1], ['M', 1], [',', 1], ['.', 1], ['/', 1], ['SHIFT', 2.7]],
  [['CTRL', 1.4], ['WIN', 1.2], ['ALT', 1.2], ['SPACE', 5.8], ['ALT', 1.2], ['FN', 1.2], ['CTRL', 1.4]]
]

// 键盘尺寸（键帽阵列与字母贴图共用）：上下收窄版
const KEY_W = 0.186
const KEY_D = 0.20       // 键深（收窄）
const KB_D = 6 * KEY_D + 5 * 0.016   // 键盘区深 = 1.28
const KEY_GAP = 0.016

// 键帽字母纹理（透明背景，只画字母；坐标与 3D 键帽阵列对齐）
function makeKeyboardLabelTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 640
  const g = c.getContext('2d')
  const kbW = 3.0, kbD = KB_D
  const keyW = KEY_W, keyD = KEY_D, gap = KEY_GAP
  const sx = 1024 / kbW, sy = 640 / kbD
  const zStart = 0.05 - kbD / 2
  const keyWx = (m) => keyW * m + gap * (m - 1)

  g.clearRect(0, 0, 1024, 640)
  g.textAlign = 'center'
  g.textBaseline = 'middle'

  KEYBOARD_ROWS.forEach((row, ri) => {
    const rowW = row.reduce((s, [, m]) => s + keyWx(m), 0) + (row.length - 1) * gap
    let x = -kbW / 2 + (kbW - rowW) / 2
    const z = zStart + ri * (keyD + gap) + keyD / 2
    const isFn = ri === 0
    row.forEach(([label, m]) => {
      const w = keyWx(m)
      const cx = (x + w / 2 + kbW / 2) * sx
      const cy = (z - zStart) * sy
      const sz = isFn ? 15 : (w < keyW * 1.3 ? 21 : 15)
      g.fillStyle = 'rgba(28,42,64,0.8)'
      g.font = `700 ${sz}px "Segoe UI", Arial, sans-serif`
      g.fillText(label, cx, cy)
      x += w + gap
    })
  })

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 立体键盘：3D 键帽阵列（真实凸起键帽，6 行布局，上下收窄）
function buildKeyboard3D(parent) {
  const kbW = 3.0, kbD = KB_D
  const keyW = KEY_W, keyD = KEY_D, gap = KEY_GAP
  const keyH = 0.024          // 键帽凸起高度
  const baseY = 0.14          // deck 顶面

  // 材质：键体米白、顶面更亮、功能键微深
  const keyMat = new THREE.MeshStandardMaterial({ color: 0xeae1cf, roughness: 0.5 })
  const keyTopMat = new THREE.MeshStandardMaterial({ color: 0xf8f3e8, roughness: 0.35 })
  const keyFnMat = new THREE.MeshStandardMaterial({ color: 0xddd3bf, roughness: 0.5 })
  const keyFnTopMat = new THREE.MeshStandardMaterial({ color: 0xefe8d9, roughness: 0.35 })

  const ROWS = KEYBOARD_ROWS

  const keyWx = (m) => keyW * m + gap * (m - 1)
  const zStart = 0.05 - kbD / 2   // 键盘区前缘 z（前移避开屏幕铰链）

  ROWS.forEach((row, ri) => {
    // 每行居中
    const rowW = row.reduce((s, [, m]) => s + keyWx(m), 0) + (row.length - 1) * gap
    let x = -kbW / 2 + (kbW - rowW) / 2
    const z = zStart + ri * (keyD + gap) + keyD / 2
    const isFnRow = ri === 0
    const h = isFnRow ? keyH * 0.78 : keyH

    row.forEach(([, m]) => {
      const w = keyWx(m)
      const isFn = isFnRow
      // 键体
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, keyD),
        isFn ? keyFnMat : keyMat
      )
      body.position.set(x + w / 2, baseY + h / 2, z)
      body.castShadow = true
      parent.add(body)
      // 顶面高光片（内缩，制造圆角感）
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.84, h * 0.3, keyD * 0.76),
        isFn ? keyFnTopMat : keyTopMat
      )
      top.position.set(x + w / 2, baseY + h * 0.88, z)
      parent.add(top)
      x += w + gap
    })
  })

  // 键帽字母层（透明纹理浮在键帽顶面上方，只显示字母）
  const labelPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(kbW, kbD),
    new THREE.MeshBasicMaterial({ map: makeKeyboardLabelTexture(), transparent: true, depthWrite: false })
  )
  labelPlane.rotation.x = -Math.PI / 2
  labelPlane.position.set(0, baseY + keyH + 0.006, 0.05)
  parent.add(labelPlane)
}

function buildLaptop(group, MAT, onScreen) {
  // 底座（纯白）
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.14, 2.4),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.03 })
  )
  deck.position.set(0, 0.07, 0.05)
  deck.castShadow = true
  group.add(deck)

  // 键盘：立体 3D 键帽阵列（真实凸起键帽）
  buildKeyboard3D(group)

  // 触控板（键盘前方，缩小；移到键盘与底座前缘之间的空隙）
  const pad = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.016, 0.475),
    new THREE.MeshStandardMaterial({ color: 0xd5cfc0, roughness: 0.35, metalness: 0.1 })
  )
  pad.position.set(0, 0.148, 0.96)
  group.add(pad)
  // 触控板描边（深色细框，突出轮廓）
  const padRim = new THREE.Mesh(
    new THREE.BoxGeometry(0.81, 0.008, 0.535),
    new THREE.MeshStandardMaterial({ color: 0x8a8372, roughness: 0.5 })
  )
  padRim.position.set(0, 0.145, 0.96)
  group.add(padRim)

  // 屏幕组（铰链处后仰）
  const hinge = new THREE.Group()
  hinge.position.set(0, 0.15, -1.05)
  hinge.rotation.x = -0.24
  group.add(hinge)

  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.88, 0.09), MAT.navy)  // 向下收窄
  frame.position.set(0, 1.0, 0)
  frame.castShadow = true
  hinge.add(frame)

  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(3.26, 1.66, 0.02),
    new THREE.MeshBasicMaterial({ map: makeWelcomeTexture(), toneMapped: false })
  )
  screen.position.set(0, 1.0, 0.05)
  hinge.add(screen)

  // 下巴（品牌条）
  const chin = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.16, 0.09), MAT.cream)
  chin.position.set(0, 0.08, 0.045)
  hinge.add(chin)

  // 摄像头点（嵌在顶部边框内：屏幕顶 1.83 ~ 边框顶 1.94 之间）
  const camDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x0e1c30, emissive: 0x222222 })
  )
  camDot.position.set(0, 1.90, 0.05)
  hinge.add(camDot)

  // 发光辉光平面（呼吸，尺寸收进屏幕边框内：顶 1.83+0.05 < 边框顶 1.94）
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.34, 1.76),
    new THREE.MeshBasicMaterial({
      color: 0xffe2b0,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
  glow.position.set(0, 1.0, 0.055)
  hinge.add(glow)

  onScreen(hinge, glow)
}

// 面包碎屑凹凸贴图（让面包表面粗糙、不反光）
function makeCrumbTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, 512, 512)
  // 大量细碎颗粒 → bump 让表面起伏，破坏光滑高光
  for (let i = 0; i < 2600; i++) {
    const v = 90 + Math.random() * 130
    g.fillStyle = `rgb(${v},${v},${v})`
    const s = 1 + Math.random() * 3.5
    g.beginPath()
    g.arc(Math.random() * 512, Math.random() * 512, s, 0, TAU)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  return tex
}

// ============ 汉堡食材专用贴图 ============

// 上包烤色渐变：顶部浅金 → 底部浅麦色（垂直渐变，Lathe 的 v 方向=轮廓：顶→底）
// 之前误用水平渐变 → 渐变绕圆周、正面全变浅麦色，顶包看起来像透明淡壳
function makeBunTopTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#e0a95a')   // 顶：浅金，不再深棕
  grad.addColorStop(0.45, '#edbd6a')
  grad.addColorStop(0.85, '#f2c87a')
  grad.addColorStop(1, '#f8d794')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 512)
  // 细碎烤色斑驳，手作感
  for (let i = 0; i < 1400; i++) {
    const v = 165 + Math.random() * 70
    g.fillStyle = `rgba(${v},${Math.floor(v * 0.78)},95,0.13)`
    const s = 2 + Math.random() * 7
    g.beginPath()
    g.arc(Math.random() * 512, Math.random() * 512, s, 0, TAU)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 肉饼凹凸：竖向煎纹 + 细坑洼（模拟煎肉饼的竖褶与焦面）
function makePattyTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 512
    const len = 30 + Math.random() * 110
    g.strokeStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.45})`
    g.lineWidth = 1 + Math.random() * 2.5
    g.beginPath()
    g.moveTo(x, Math.random() * 60)
    g.lineTo(x + (Math.random() - 0.5) * 12, Math.random() * 60 + len)
    g.stroke()
  }
  for (let i = 0; i < 1500; i++) {
    const v = 70 + Math.random() * 120
    g.fillStyle = `rgb(${v},${v},${v})`
    const s = 1 + Math.random() * 2.6
    g.beginPath()
    g.arc(Math.random() * 512, Math.random() * 512, s, 0, TAU)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  return tex
}

// 生菜皱褶：横向波浪条纹
function makeLettuceTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 46; i++) {
    const y0 = Math.random() * 512
    g.strokeStyle = `rgba(255,255,255,${0.18 + Math.random() * 0.3})`
    g.lineWidth = 2 + Math.random() * 4
    g.beginPath()
    g.moveTo(0, y0)
    for (let x = 0; x <= 512; x += 24) {
      g.lineTo(x, y0 + Math.sin(x * 0.06 + i * 1.7) * 14)
    }
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

// 番茄果肉凹凸：放射状果络
function makeTomatoTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 110; i++) {
    const a = (i / 110) * TAU
    g.strokeStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.3})`
    g.lineWidth = 1 + Math.random() * 2
    g.beginPath()
    g.moveTo(256 + Math.cos(a) * 14, 256 + Math.sin(a) * 14)
    g.lineTo(256 + Math.cos(a) * 262, 256 + Math.sin(a) * 262)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  return tex
}

// 波浪生菜片：薄圆片，边缘多重正弦锯齿挤出成层（比圆锥叶片自然、蓬松）
function makeLettuceLayer(r, wave, phase) {
  const N = 28
  const s = new THREE.Shape()
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * TAU
    const rad = r + Math.sin(a * 5 + phase) * wave + Math.sin(a * 12 + phase * 2.3) * wave * 0.35
    const x = Math.cos(a) * rad
    const y = Math.sin(a) * rad
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.04, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.012, bevelSegments: 1
  })
  geo.rotateX(-Math.PI / 2)   // 平放到桌面，挤出方向朝上
  geo.translate(0, -0.03, 0)
  geo.computeVertexNormals()
  return geo
}

// 手作蟹堡 v4：整体重建，比例更协调饱满
// 设计：下包厚实底盘(0.30) → 番茄(0.12) → 牛肉饼(0.20) → 芝士(0.04) → 生菜(0.08) → 圆润高穹顶(0.38)
// 整体高:宽 ≈ 0.85:1，上包占全高约 1/3，视觉重心居中、层层紧贴不塌
function buildBurger(group) {
  const R = 0.66
  const crumb = makeCrumbTexture()
  const bunTopTex = makeBunTopTexture()
  const pattyTex = makePattyTexture()
  const leafTex = makeLettuceTexture()
  const tomatoTex = makeTomatoTexture()
  // 哑光质感：全部 roughness 抬到 0.85+，无金属反光，食物看起来更"实在"
  const mk = (opts) => new THREE.MeshStandardMaterial({
    roughness: 0.9, metalness: 0, bumpMap: crumb, bumpScale: 0.35, ...opts
  })
  const bun = mk({ color: 0xe8b45c, side: THREE.DoubleSide })   // 下包 / 上包穹顶（双面，防穹顶反面透光）
  const bunTop = mk({ color: 0xffffff, map: bunTopTex, bumpScale: 0.5, side: THREE.DoubleSide }) // 烤色圆顶（双面，防任何角度透视）
  const bunCut = mk({ color: 0xf2dca8, bumpMap: null, roughness: 0.82, side: THREE.DoubleSide }) // 面包切面（双面）
  const patty = mk({ color: 0x9c5a2f, bumpMap: pattyTex, bumpScale: 0.85 })  // 牛肉饼（深棕）
  const pattyEdge = mk({ color: 0x5a3017, bumpMap: pattyTex, bumpScale: 0.85 }) // 煎焦边（更深棕）
  const cheese = mk({ color: 0xffcf45, bumpScale: 0.1 })
  const tomato = mk({ color: 0xff5a3a, bumpMap: tomatoTex, bumpScale: 0.2 })
  const lettuce = mk({ color: 0x6fc956, bumpMap: leafTex, bumpScale: 0.4 })
  const seed = mk({ color: 0xf6ecd2, bumpMap: null })
  const trayMat = mk({ color: 0xf7f3e8, bumpMap: null, roughness: 0.7 })

  const add = (geo, mat, x, y, z, cast = true) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.castShadow = cast
    group.add(m)
    return m
  }

  // ---- 白色瓷托盘：底托 + 翻边 ----
  add(new THREE.CylinderGeometry(0.84, 0.72, 0.1, 48), trayMat, 0, 0.05, 0).receiveShadow = true
  add(new THREE.TorusGeometry(0.78, 0.04, 12, 48), trayMat, 0, 0.10, 0, false).rotation.x = Math.PI / 2

  let y = 0.10 // 托盘顶面

  // ---- 下层面包：圆柱形厚底盘（侧面垂直、底角小圆角过渡） ----
  const bPts = []
  ;[[0, 0], [0.6, 0.015], [0.9, 0.045], [1.0, 0.10], [1.03, 0.16], [1.04, 0.24], [1.03, 0.28], [1.02, 0.30]]
    .forEach(([f, hh]) => bPts.push(new THREE.Vector2(f * R, hh)))
  add(new THREE.LatheGeometry(bPts, 40), bun, 0, y, 0)
  const cut = add(new THREE.CircleGeometry(1.04 * R, 40), bunCut, 0, y + 0.30, 0, false)
  cut.rotation.x = -Math.PI / 2
  y += 0.30

  // ---- 番茄厚片（紧贴底包，带果肉纹理） ----
  add(new THREE.CylinderGeometry(R * 0.90, R * 0.90, 0.12, 48), tomato, 0, y + 0.06, 0)
  y += 0.12

  // ---- 牛肉饼：厚实扁圆 + 煎焦边 + 顶部微凸（深棕色，带竖煎纹） ----
  add(new THREE.CylinderGeometry(R * 0.93, R * 0.97, 0.20, 48, 6), patty, 0, y + 0.10, 0)
  const pattyDome = add(new THREE.SphereGeometry(R * 0.95, 32, 18, 0, TAU, 0, Math.PI * 0.28), patty, 0, y + 0.195, 0)
  pattyDome.scale.y = 0.06   // 压扁成微凸，藏在芝士/生菜之下，不露头
  add(new THREE.TorusGeometry(R * 0.96, 0.02, 10, 48), pattyEdge, 0, y + 0.195, 0).rotation.x = Math.PI / 2
  y += 0.20

  // ---- 芝士片（宽于肉饼悬挑，无滴挂） ----
  add(new THREE.CylinderGeometry(R * 1.04, R * 1.02, 0.04, 48), cheese, 0, y + 0.02, 0)
  y += 0.04

  // ---- 双层波浪生菜（错位，蓬松不塌） ----
  add(makeLettuceLayer(R * 1.10, 0.08, 1.3), lettuce, 0, y + 0.015, 0)
  const l2 = add(makeLettuceLayer(R * 1.03, 0.07, 4.1), lettuce, 0, y + 0.035, 0)
  l2.rotation.y = 0.6
  y += 0.08

  // ---- 上层面包：半圆穹顶压扁 1/3（高=半径×0.67），半径与下包一致，质感同下包（纯色 bun） ----
  const topR = 1.04 * R
  const TOP_H = 0.67 * topR        // 压扁三分之一：高约为半径的 2/3
  const tPts = []
  const HALF = Math.PI / 2
  for (let i = 0; i <= 18; i++) {
    const a = (i / 18) * HALF
    tPts.push(new THREE.Vector2(topR * Math.sin(a), TOP_H * Math.cos(a)))
  }
  const topY = y
  add(new THREE.LatheGeometry(tPts, 48), bun, 0, y, 0)
  // 底部平切盖：封住敞口底（与下包切面同色）
  const bottomCap = add(new THREE.CircleGeometry(topR, 40), bunCut, 0, y, 0, false)
  bottomCap.rotation.x = Math.PI / 2
  y += TOP_H

  // ---- 芝麻：三层环贴在压扁穹顶面上（顶部留白，不聚顶尖） ----
  const domeRings = [
    { a: 0.45, n: 5 },   // 上圈（避开顶尖）
    { a: 0.90, n: 7 },   // 中圈
    { a: 1.15, n: 9 },   // 底圈
  ]
  for (const ring of domeRings) {
    for (let i = 0; i < ring.n; i++) {
      const base = (i / ring.n) * TAU + (ring.n % 2 ? 0 : Math.PI / ring.n)
      const az = base + (Math.random() - 0.5) * 0.08
      const rad = topR * Math.sin(ring.a) + (Math.random() - 0.5) * 0.03
      const hh = TOP_H * Math.cos(ring.a)
      const s = add(new THREE.SphereGeometry(0.034, 10, 8), seed,   // 芝麻更小
        Math.cos(az) * rad,
        topY + hh + 0.02,
        Math.sin(az) * rad)
      s.scale.set(1.3, 0.4, 1.3)
      // 扁轴（局部Y）对齐穹顶表面法线：芝麻斜着贴面，不再横躺
      const nml = new THREE.Vector3(
        Math.sin(ring.a) * Math.cos(az) / topR,
        Math.cos(ring.a) / TOP_H,
        Math.sin(ring.a) * Math.sin(az) / topR
      ).normalize()
      s.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nml)
      s.rotateY(Math.random() * Math.PI)   // 绕自身轴向（即法线）随机自转
    }
  }
}

// 饮料：玻璃杯 + 可乐 + 冰块 + 泡沫 + 吸管
function buildDrink(group) {
  // 放大 2 倍后再缩到 0.8 → 1.6 倍
  group.scale.set(1.6, 1.6, 1.6)
  // 质感优化：玻璃透亮、可乐深棕、冰块晶莹
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdff2ff, roughness: 0.04, metalness: 0,
    transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false
  })
  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0x2a1004, roughness: 0.2,
    transparent: true, opacity: 0.9   // 半透明：能看到内部气泡
  })
  const foamMat = new THREE.MeshStandardMaterial({ color: 0xc8a886, roughness: 0.8 })  // 可乐泡沫
  const iceMat = new THREE.MeshStandardMaterial({
    color: 0xd8f0ff, roughness: 0.08, transparent: true, opacity: 0.92
  })
  const strawMat = new THREE.MeshStandardMaterial({ color: 0xe85535, roughness: 0.3 })

  // 玻璃杯身（外壁）
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.8, 32, 1, true), glassMat)
  glass.position.y = 0.4
  glass.castShadow = true
  group.add(glass)
  // 杯底
  const base = new THREE.Mesh(new THREE.CircleGeometry(0.25, 32), glassMat)
  base.rotation.x = -Math.PI / 2
  base.position.y = 0.012
  group.add(base)
  // 可乐液体
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.23, 0.55, 32), liquidMat)
  liquid.position.y = 0.3
  group.add(liquid)
  // 顶部泡沫层
  const foam = new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.26, 0.035, 32), foamMat)
  foam.position.y = 0.575
  group.add(foam)
  // 冰立方
  for (let i = 0; i < 3; i++) {
    const ice = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), iceMat)
    ice.position.set((i - 1) * 0.13, 0.56, ((i + 1) % 2) * 0.1 - 0.05)
    ice.rotation.y = i * 0.8
    group.add(ice)
  }
  // 吸管（倾斜插出杯口）
  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.0, 12), strawMat)
  straw.position.set(0.15, 0.78, 0)
  straw.rotation.z = -0.32
  group.add(straw)
  // 可乐气泡细节：液体内部悬浮小气泡 + 液面浮泡
  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0xfff8ea, roughness: 0.1, transparent: true, opacity: 0.75
  })
  const rand = (a, b) => a + Math.random() * (b - a)
  for (let i = 0; i < 24; i++) {
    const bub = new THREE.Mesh(new THREE.SphereGeometry(rand(0.006, 0.022), 8, 6), bubbleMat)
    const ang = Math.random() * TAU
    bub.position.set(
      Math.cos(ang) * rand(0.03, 0.2),
      rand(0.08, 0.5),
      Math.sin(ang) * rand(0.03, 0.2)
    )
    group.add(bub)
  }
  // 液面浮泡（大一点，贴着泡沫层）
  for (let i = 0; i < 7; i++) {
    const bub = new THREE.Mesh(new THREE.SphereGeometry(rand(0.015, 0.03), 8, 6), bubbleMat)
    const ang = Math.random() * TAU
    bub.position.set(Math.cos(ang) * rand(0.02, 0.18), rand(0.55, 0.6), Math.sin(ang) * rand(0.02, 0.18))
    group.add(bub)
  }
}

// 方形观景窗：直角矩形框 + 海底玻璃 + 底部窗台（无弧形）
function buildWindow(tex, w, h) {
  const g = new THREE.Group()
  const thick = 0.4

  // 矩形环外框（四个直角）
  const shape = new THREE.Shape()
  shape.moveTo(-w / 2, -h / 2)
  shape.lineTo(w / 2, -h / 2)
  shape.lineTo(w / 2, h / 2)
  shape.lineTo(-w / 2, h / 2)
  shape.closePath()
  const hole = new THREE.Path()
  hole.moveTo(-(w - thick) / 2, -(h - thick) / 2)
  hole.lineTo((w - thick) / 2, -(h - thick) / 2)
  hole.lineTo((w - thick) / 2, (h - thick) / 2)
  hole.lineTo(-(w - thick) / 2, (h - thick) / 2)
  hole.closePath()
  shape.holes.push(hole)

  const frame = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: 0x24425e, roughness: 0.95, metalness: 0 })
  )
  frame.position.z = -0.02
  g.add(frame)

  // 玻璃（海底贴图）
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w - thick, h - thick),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true })
  )
  glass.position.set(0, 0, -0.12)
  g.add(glass)

  // 底部窗台（内收的直角石板，增加立体感）
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.3, 0.12, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 })
  )
  sill.position.set(0, -h / 2 - 0.06, 0.1)
  g.add(sill)

  return g
}

// 海底贴图（光柱 / 沙地 / 珊瑚 / 鱼群 / 气泡 / 海面亮区）
function makeSeaTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 384
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 384)
  grad.addColorStop(0, '#3a7cc0')
  grad.addColorStop(0.4, '#1f578d')
  grad.addColorStop(1, '#0d2c47')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 384)

  // 底部沙地
  const sand = g.createLinearGradient(0, 300, 0, 384)
  sand.addColorStop(0, 'rgba(194,168,120,0)')
  sand.addColorStop(1, 'rgba(194,168,120,0.85)')
  g.fillStyle = sand
  g.fillRect(0, 300, 512, 84)

  // 多道光柱
  g.save()
  g.globalAlpha = 0.28
  g.fillStyle = '#d4ecff'
  for (const [x1, x2] of [[150, 232], [286, 352], [380, 432], [70, 118]]) {
    g.beginPath(); g.moveTo(x1, 0); g.lineTo(x2 - 30, 384); g.lineTo(x2 + 18, 384); g.lineTo(x1 + 24, 0); g.closePath(); g.fill()
  }
  g.restore()

  // 远海山影
  g.fillStyle = 'rgba(10,40,66,0.6)'
  g.beginPath(); g.moveTo(0, 320); g.quadraticCurveTo(120, 250, 250, 330); g.quadraticCurveTo(380, 290, 512, 340); g.lineTo(512, 384); g.lineTo(0, 384); g.closePath(); g.fill()

  // 珊瑚剪影
  g.fillStyle = '#16604a'
  g.beginPath()
  g.moveTo(0, 384); g.lineTo(0, 296)
  g.quadraticCurveTo(34, 238, 66, 300)
  g.quadraticCurveTo(92, 220, 126, 292)
  g.quadraticCurveTo(156, 252, 200, 300)
  g.lineTo(240, 384)
  g.closePath(); g.fill()
  g.fillStyle = '#0f4a38'
  g.beginPath()
  g.moveTo(512, 384); g.lineTo(512, 272)
  g.quadraticCurveTo(474, 224, 442, 290)
  g.quadraticCurveTo(414, 256, 386, 302)
  g.lineTo(340, 384)
  g.closePath(); g.fill()
  g.fillStyle = 'rgba(240,150,120,0.55)'
  for (const [bx, by] of [[52, 330], [470, 322], [90, 360]]) {
    g.beginPath(); g.arc(bx, by, 6, 0, TAU); g.fill()
  }

  // 鱼群
  g.fillStyle = 'rgba(140,205,255,0.9)'
  for (const [fx, fy, fa] of [[300, 96, -0.3], [322, 108, -0.2], [338, 92, -0.25], [282, 110, -0.35]]) {
    g.save(); g.translate(fx, fy); g.rotate(fa)
    g.beginPath(); g.ellipse(0, 0, 15, 8, 0, 0, TAU); g.fill()
    g.beginPath(); g.moveTo(-14, -6); g.lineTo(-26, -1); g.lineTo(-14, 6); g.closePath(); g.fill()
    g.restore()
  }
  g.fillStyle = 'rgba(255,190,120,0.85)'
  g.beginPath(); g.ellipse(148, 206, 12, 7, 0.4, 0, TAU); g.fill()

  // 气泡
  g.strokeStyle = 'rgba(210,240,255,0.7)'
  g.lineWidth = 2
  for (const [bx, by, br] of [[90, 160, 6], [108, 140, 4], [390, 200, 5], [406, 178, 3], [250, 300, 7], [176, 120, 3], [344, 260, 4]]) {
    g.beginPath(); g.arc(bx, by, br, 0, TAU); g.stroke()
  }

  // 顶部亮区（透过海面的光）
  const top = g.createLinearGradient(0, 0, 0, 160)
  top.addColorStop(0, 'rgba(210,235,255,0.35)')
  top.addColorStop(1, 'rgba(210,235,255,0)')
  g.fillStyle = top
  g.fillRect(0, 0, 512, 160)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 桌下地毯贴图（同心圆 + 八芒星）
function makeRugTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#2b4259'
  g.fillRect(0, 0, 512, 512)

  g.strokeStyle = 'rgba(242,184,75,0.45)'
  g.lineWidth = 18
  g.beginPath(); g.arc(256, 256, 226, 0, TAU); g.stroke()
  g.strokeStyle = 'rgba(242,235,221,0.35)'
  g.lineWidth = 5
  g.beginPath(); g.arc(256, 256, 208, 0, TAU); g.stroke()
  g.strokeStyle = 'rgba(242,184,75,0.3)'
  g.lineWidth = 12
  g.beginPath(); g.arc(256, 256, 180, 0, TAU); g.stroke()

  g.fillStyle = 'rgba(242,184,75,0.12)'
  g.beginPath(); g.arc(256, 256, 150, 0, TAU); g.fill()
  g.strokeStyle = 'rgba(242,235,221,0.4)'
  g.lineWidth = 4
  g.beginPath(); g.arc(256, 256, 120, 0, TAU); g.stroke()

  // 中心八芒星
  g.fillStyle = 'rgba(242,235,221,0.75)'
  const R0 = 52, N = 8
  g.beginPath()
  for (let i = 0; i < N * 2; i++) {
    const r = i % 2 === 0 ? R0 : R0 * 0.45
    const a = (i / (N * 2)) * TAU - Math.PI / 2
    const x = 256 + Math.cos(a) * r
    const y = 256 + Math.sin(a) * r
    i === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
  }
  g.closePath(); g.fill()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 笔记本键盘贴图（独立键帽 + 字母）
function makeKeyboardTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 640
  const g = c.getContext('2d')

  // 键区底座（浅色圆角板，与白色机身统一，不留深色）
  const rr = (x, y, w, h, r) => {
    g.beginPath()
    g.moveTo(x + r, y)
    g.arcTo(x + w, y, x + w, y + h, r)
    g.arcTo(x + w, y + h, x, y + h, r)
    g.arcTo(x, y + h, x, y, r)
    g.arcTo(x, y, x + w, y, r)
    g.closePath()
  }
  const baseGrad = g.createLinearGradient(0, 24, 0, 392)
  baseGrad.addColorStop(0, '#e6e1d5')
  baseGrad.addColorStop(1, '#d9d3c4')
  g.fillStyle = baseGrad
  // 铺满整张画布：四边原本是透明，贴图会采样成黑色，
  // 导致键盘后缘出现一条黑色"屏幕"，先铺底色消除
  g.fillRect(0, 0, 1024, 640)
  rr(24, 24, 976, 368, 22)
  g.fill()
  g.strokeStyle = 'rgba(120,105,80,0.35)'
  g.lineWidth = 4
  g.stroke()

  const kw = 58, kh = 50, gap = 4   // 键帽 58×50，填满底座宽

  // 真实键盘 6 行布局：[label | 宽度倍率] 或 {row: 特殊}
  const ROWS = [
    // 行1：Esc + F1-F12（功能键矮一点）
    [
      ['esc', 1.4], ['f1', 1], ['f2', 1], ['f3', 1], ['f4', 1],
      ['f5', 1], ['f6', 1], ['f7', 1], ['f8', 1],
      ['f9', 1], ['f10', 1], ['f11', 1], ['f12', 1]
    ],
    // 行2：数字 + 退格
    [
      ['`', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1],
      ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['⌫', 1.9]
    ],
    // 行3：Tab + QWERTY
    [
      ['TAB', 1.5], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1],
      ['Y', 1], ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1.5]
    ],
    // 行4：Caps + ASDF
    [
      ['CAPS', 1.8], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1],
      ['H', 1], ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['⏎', 2.2]
    ],
    // 行5：Shift + ZXCV
    [
      ['SHIFT', 2.3], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1],
      ['N', 1], ['M', 1], [',', 1], ['.', 1], ['/', 1], ['SHIFT', 2.7]
    ],
    // 行6：Ctrl + Win + Alt + Space + Alt + Fn + Ctrl
    [
      ['CTRL', 1.4], ['WIN', 1.2], ['ALT', 1.2], ['SPACE', 5.8], ['ALT', 1.2], ['FN', 1.2], ['CTRL', 1.4]
    ]
  ]

  const keyW = (mult) => Math.round(kw * mult + gap * (mult - 1))

  function key(x, y, w, h, label, opt) {
    const isFn = label.startsWith('f') && label.length <= 3
    const hKey = isFn ? h * 0.78 : h
    const yOff = isFn ? y + (h - hKey) : y
    const tiny = w < 42
    // 底部阴影（柔和浅棕）
    g.fillStyle = 'rgba(96,80,58,0.4)'
    rr(x + 1, yOff + 3, w, hKey, 7); g.fill()
    // 键体渐变（更亮、更圆润）
    const grad = g.createLinearGradient(x, yOff, x, yOff + hKey)
    grad.addColorStop(0, '#f8f1e2')
    grad.addColorStop(0.55, '#eee3cc')
    grad.addColorStop(1, '#ded0b2')
    g.fillStyle = grad
    rr(x, yOff, w, hKey, 7); g.fill()
    // 键体描边（浅金）
    g.strokeStyle = 'rgba(160,132,88,0.6)'
    g.lineWidth = 1.5
    g.stroke()
    // 顶部高光
    g.fillStyle = 'rgba(255,255,255,0.5)'
    rr(x + 2, yOff + 2, w - 4, hKey * 0.22, 5); g.fill()
    // 左下微反光（立体感）
    g.fillStyle = 'rgba(255,255,255,0.13)'
    rr(x + 2, yOff + hKey * 0.78, w - 4, hKey * 0.16, 4); g.fill()
    // 字母（功能键小字，主键大字）
    if (label) {
      g.fillStyle = '#1d2f45'
      g.font = `${isFn || tiny ? '600 13px' : '700 21px'} "Segoe UI", Arial, sans-serif`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText(label, x + w / 2, yOff + hKey / 2 + 1)
    }
  }

  const startY = 40
  let ry = startY
  ROWS.forEach((row, ri) => {
    // 每行居中，填满底座宽度
    const rowW = row.reduce((s, [, m]) => s + keyW(m), 0) + (row.length - 1) * gap
    let x = 24 + (976 - rowW) / 2
    row.forEach(([label, mult]) => {
      const w = keyW(mult)
      key(x, ry, w, kh, label, ri)
      x += w + gap
    })
    ry += kh + gap
  })

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// 笔记本欢迎屏贴图（启动界面：徽章 + 站名 + 提示）
function makeWelcomeTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 576
  const g = c.getContext('2d')

  // 背景：深蓝渐变 + 暗角
  const grad = g.createLinearGradient(0, 0, 0, 576)
  grad.addColorStop(0, '#1b3152')
  grad.addColorStop(0.5, '#152741')
  grad.addColorStop(1, '#0f1e33')
  g.fillStyle = grad
  g.fillRect(0, 0, 1024, 576)
  const vg = g.createRadialGradient(512, 300, 180, 512, 300, 700)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,0.45)')
  g.fillStyle = vg
  g.fillRect(0, 0, 1024, 576)

  // 四角装饰（小锚）
  g.strokeStyle = 'rgba(242,184,75,0.35)'
  g.lineWidth = 2
  const corner = (cx, cy, flipX, flipY) => {
    g.save()
    g.translate(cx, cy)
    g.scale(flipX, flipY)
    g.beginPath()
    g.arc(0, 0, 26, 0.4, 1.6)
    g.stroke()
    g.beginPath()
    g.moveTo(0, -26); g.lineTo(0, 20)
    g.stroke()
    g.beginPath()
    g.arc(0, 20, 7, 0, Math.PI)
    g.stroke()
    g.restore()
  }
  corner(58, 58, 1, 1)
  corner(966, 58, -1, 1)
  corner(58, 518, 1, -1)
  corner(966, 518, -1, -1)

  // 顶部小字
  g.textAlign = 'center'
  g.fillStyle = 'rgba(242,184,75,0.8)'
  g.font = '600 17px Consolas, monospace'
  g.fillText('K R U S T Y   K R A B', 512, 76)

  // 中央 logo 徽章（圆角牌 + 迷你汉堡）
  g.fillStyle = 'rgba(10,20,34,0.55)'
  g.beginPath()
  g.roundRect(436, 118, 152, 152, 28)
  g.fill()
  g.strokeStyle = 'rgba(242,184,75,0.4)'
  g.lineWidth = 2
  g.stroke()
  // 迷你汉堡（canvas 画，从上到下：面包片→菜→芝士→肉饼→番茄→面包片）
  const bx = 512, by = 196
  // ① 顶层面包片（右移，弧度圆润）
  g.fillStyle = '#f0ad4a'
  g.beginPath()
  g.ellipse(bx + 15, by - 30, 38, 27, 0, Math.PI, true)
  g.fill()
  // 顶包高光
  g.fillStyle = 'rgba(255,255,255,0.25)'
  g.beginPath()
  g.ellipse(bx + 11, by - 44, 14, 5, -0.5, 0, Math.PI * 2)
  g.fill()
  // 芝麻（沿圆顶弧线）
  g.fillStyle = '#fff3d0'
  for (let i = 0; i < 7; i++) {
    const a = 0.15 + (i / 6) * 0.8   // 只在上弧
    const sx = bx + 15 + Math.cos(Math.PI - a * Math.PI) * 27
    const sy = by - 30 - Math.sin(a * Math.PI) * 23
    g.beginPath()
    g.ellipse(sx, sy, 3.2, 1.9, a * 3, 0, Math.PI * 2)
    g.fill()
  }
  // ② 生菜（宽，两端伸出，波浪感）
  g.fillStyle = '#7ed260'
  g.beginPath()
  g.roundRect(bx - 42, by + 1, 84, 9, 4)
  g.fill()
  g.fillStyle = '#9ce07e'
  for (let i = -3; i <= 3; i++) {
    g.beginPath()
    g.ellipse(bx + i * 12, by + 3, 6, 2.5, 0, 0, Math.PI * 2)
    g.fill()
  }
  // ③ 芝士（宽）
  g.fillStyle = '#ffd24a'
  g.beginPath()
  g.roundRect(bx - 40, by + 11, 80, 9, 3)
  g.fill()
  g.fillStyle = '#ffe98a'
  g.fillRect(bx - 40, by + 11, 80, 4)
  // ④ 肉饼（棕色，圆角）
  g.fillStyle = '#8a5a34'
  g.beginPath()
  g.roundRect(bx - 37, by + 21, 74, 12, 4)
  g.fill()
  g.fillStyle = 'rgba(255,255,255,0.18)'
  g.fillRect(bx - 37, by + 22, 74, 3)
  // ⑤ 番茄（红）
  g.fillStyle = '#ff5a3c'
  g.beginPath()
  g.roundRect(bx - 36, by + 34, 72, 10, 3)
  g.fill()
  g.fillStyle = 'rgba(255,255,255,0.22)'
  g.fillRect(bx - 36, by + 35, 72, 3)
  // ⑥ 底层面包片（圆角 + 阴影线）
  g.fillStyle = '#f7c56a'
  g.beginPath()
  g.roundRect(bx - 35, by + 45, 70, 12, 5)
  g.fill()
  g.fillStyle = 'rgba(180,120,40,0.35)'
  g.fillRect(bx - 35, by + 54, 70, 3)

  // 站名（发光）
  g.shadowColor = 'rgba(255,214,140,0.9)'
  g.shadowBlur = 40
  g.fillStyle = '#fffdf6'
  g.font = '900 64px Georgia, "Times New Roman", serif'
  g.fillText('QQ HAMBURGER', 512, 342)
  g.shadowBlur = 0

  // 分隔线 + 副标语
  g.fillStyle = 'rgba(255,214,140,0.16)'
  g.fillRect(200, 368, 624, 3)
  g.fillStyle = 'rgba(255,253,246,0.75)'
  g.font = '600 22px Consolas, monospace'
  g.fillText('DEEP SEA RESTAURANT · CS', 512, 412)

  // 底部：点击提示 + 装饰进度条
  g.fillStyle = 'rgba(255,253,246,0.45)'
  g.font = '500 17px Consolas, monospace'
  g.fillText('CLICK TO BOOT', 512, 460)
  g.fillStyle = 'rgba(255,255,255,0.12)'
  g.beginPath()
  g.roundRect(362, 482, 300, 6, 3)
  g.fill()
  g.fillStyle = 'rgba(242,184,75,0.8)'
  g.beginPath()
  g.roundRect(362, 482, 132, 6, 3)
  g.fill()

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
