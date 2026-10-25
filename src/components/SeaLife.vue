<script setup>
// ============================================================
// SeaLife：分层海洋生物剪影（下潜叙事的一部分）
// type:  fish 鱼群 | turtle 海龟 | angler 灯笼鱼 | whale 鲸鱼 | glow 发光点
// 浅层用墨蓝剪影，深层剪影更暗 + 带微光；--dp（0~1，.home 提供）驱动滚动视差
// ============================================================
defineProps({
  type: { type: String, default: 'fish' },
  pf: { type: Number, default: 60 },      // 视差系数：滚动全程相对内容位移的 px
  dur: { type: Number, default: 16 },     // 漂移周期 s
  flip: { type: Boolean, default: false } // 水平翻转
})
</script>

<template>
  <div class="sea-life" :class="'tone-' + type" :style="{ '--pf': pf }" aria-hidden="true">
    <!-- 鱼群 -->
    <div v-if="type === 'fish'" class="sl-drift" :style="{ animationDuration: dur + 's' }">
      <svg viewBox="0 0 120 44" :style="flip ? 'transform: scaleX(-1)' : ''">
        <g class="fish-a">
          <path d="M4 10 C 8 4, 15 4, 19 10 C 15 16, 8 16, 4 10 Z M19 10 L25 6 L25 14 Z" />
        </g>
        <g class="fish-b">
          <path d="M44 26 C 47 21, 53 21, 56 26 C 53 31, 47 31, 44 26 Z M56 26 L61 23 L61 29 Z" />
        </g>
        <g class="fish-c">
          <path d="M84 8 C 88 3, 94 3, 98 8 C 94 13, 88 13, 84 8 Z M98 8 L103 5 L103 11 Z" />
        </g>
        <g class="fish-d">
          <path d="M62 36 C 65 32, 70 32, 73 36 C 70 40, 65 40, 62 36 Z M73 36 L77 34 L77 38 Z" />
        </g>
      </svg>
    </div>

    <!-- 海龟 -->
    <div v-else-if="type === 'turtle'" class="sl-drift" :style="{ animationDuration: dur + 's' }">
      <svg viewBox="0 0 64 36" :style="flip ? 'transform: scaleX(-1)' : ''">
        <ellipse cx="28" cy="18" rx="17" ry="10" />
        <path d="M43 13 C 48 10, 54 11, 56 15 C 57 18, 54 21, 48 21 C 45 21, 43 19, 43 13 Z" />
        <path d="M13 12 C 8 6, 2 6, 0 10 C 3 14, 9 15, 13 14 Z" />
        <path d="M14 24 C 9 28, 4 29, 2 27 C 4 23, 10 21, 15 22 Z" />
        <path d="M42 25 C 46 29, 50 30, 53 28 C 51 24, 46 23, 42 24 Z" />
        <path d="M24 9 C 20 3, 14 2, 12 5 C 15 9, 20 11, 24 11 Z" />
      </svg>
    </div>

    <!-- 灯笼鱼（深处，吊灯会呼吸发光） -->
    <div v-else-if="type === 'angler'" class="sl-drift sl-drift--slow" :style="{ animationDuration: dur + 's' }">
      <svg viewBox="0 0 96 54" :style="flip ? 'transform: scaleX(-1)' : ''">
        <path d="M8 30 C 10 16, 28 10, 46 14 C 62 17, 74 24, 72 31 C 70 39, 50 45, 30 42 C 16 40, 6 36, 8 30 Z" />
        <path d="M72 31 L90 22 L86 38 Z" />
        <path d="M60 33 L66 40 M64 32 L69 38" stroke-width="1.6" fill="none" class="sl-line" />
        <path d="M38 13 C 40 5, 48 2, 54 5" stroke-width="2" fill="none" class="sl-line" />
        <circle class="sl-glow" cx="55" cy="5" r="4.5" />
        <circle class="sl-eye" cx="52" cy="22" r="2.4" />
      </svg>
    </div>

    <!-- 鲸鱼（远景剪影） -->
    <div v-else-if="type === 'whale'" class="sl-drift sl-drift--slow" :style="{ animationDuration: dur + 's' }">
      <svg viewBox="0 0 220 84" :style="flip ? 'transform: scaleX(-1)' : ''">
        <path d="M12 48 C 34 16, 96 8, 138 22 C 168 32, 190 40, 202 38 L 210 44 L 198 52 C 160 70, 66 74, 28 62 C 14 57, 6 53, 12 48 Z" />
        <path d="M84 56 C 94 66, 114 68, 124 62 C 114 56, 96 54, 84 56 Z" />
        <path d="M200 40 C 208 34, 214 34, 218 38 C 214 42, 208 44, 202 44 Z" />
      </svg>
    </div>

    <!-- 深海发光点（bioluminescence，纯 CSS） -->
    <div v-else-if="type === 'glow'" class="sl-glowdots">
      <span v-for="i in 7" :key="i" class="gd" :class="'gd-' + i" :style="{ animationDelay: (i * 0.7) + 's', animationDuration: (3 + (i % 3)) + 's' }"></span>
    </div>
  </div>
</template>

<style scoped>
/* 外层：滚动视差（--dp 由 PageHome .home 提供，0~1）
   不加 will-change：投影门户内常驻合成层会被降采样发糊，滚动重算足够快 */
.sea-life {
  position: absolute;
  pointer-events: none;
  transform: translateY(calc(var(--dp, 0) * var(--pf, 0) * 1px));
}
/* 中层：水平漂移（transform 与视差分层，互不打架） */
.sl-drift {
  animation: sl-drift ease-in-out infinite alternate;
}
.sl-drift--slow { animation-timing-function: linear; }
@keyframes sl-drift {
  from { transform: translateX(-22px); }
  to { transform: translateX(22px); }
}

svg { display: block; width: 100%; height: auto; }

/* 浅层：墨蓝剪影 */
.tone-fish path, .tone-turtle path, .tone-turtle ellipse {
  fill: rgba(36, 66, 94, 0.28);
}
.tone-fish .fish-b { opacity: 0.7; }
.tone-fish .fish-c { opacity: 0.5; }
.tone-fish .fish-d { opacity: 0.6; }

/* 深层：更暗 + 微光 */
.tone-angler path { fill: rgba(16, 30, 46, 0.55); }
.tone-angler .sl-line { stroke: rgba(120, 160, 190, 0.6); }
.tone-angler .sl-eye { fill: rgba(190, 220, 240, 0.75); }
.tone-angler .sl-glow {
  fill: #ffe9a8;
  filter: drop-shadow(0 0 6px rgba(255, 224, 130, 0.9));
  animation: lure-pulse 2.4s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}
@keyframes lure-pulse {
  0%, 100% { opacity: 0.55; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.15); }
}

.tone-whale path { fill: rgba(20, 40, 60, 0.16); }

/* 发光点 */
.sl-glowdots { position: relative; }
.gd {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 233, 168, 0.95), rgba(255, 233, 168, 0) 70%);
  animation: gd-pulse ease-in-out infinite alternate;
}
.gd-1 { left: 0%; top: 10px; }
.gd-2 { left: 18%; top: 46px; width: 4px; height: 4px; }
.gd-3 { left: 34%; top: 18px; }
.gd-4 { left: 55%; top: 60px; width: 5px; height: 5px; }
.gd-5 { left: 70%; top: 8px; }
.gd-6 { left: 84%; top: 38px; width: 4px; height: 4px; }
.gd-7 { left: 95%; top: 70px; width: 5px; height: 5px; }
@keyframes gd-pulse {
  from { opacity: 0.15; transform: scale(0.7); }
  to { opacity: 0.9; transform: scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .sl-drift, .sl-glow, .gd { animation: none !important; }
}
</style>
