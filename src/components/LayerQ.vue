<script setup>
// ============================================================
// LayerQ：汉堡单层材料的 Q 版小图（造型与 Burger25D 各层一致）
// shape: bun-top | lettuce | cheese | patty | tomato | bun-bottom
// size: 显示宽度（px，高度按比例）
// ============================================================
const props = defineProps({
  shape: { type: String, default: 'bun-top' },
  size: { type: Number, default: 118 }
})
</script>

<template>
  <div
    class="lq"
    :class="'lq--' + shape"
    :style="{ width: size + 'px', height: Math.round(size * 0.373) + 'px' }"
  ><div class="lq-inner"></div></div>
</template>

<style scoped>
.lq {
  position: relative;
  filter: drop-shadow(0 3px 5px rgba(26, 26, 24, 0.2));
}
.lq-inner { position: absolute; inset: 0; width: 100%; height: 100%; }

/* ======== 顶层面包 ======== */
.lq--bun-top .lq-inner {
  border-radius: 55% 55% 12px 12px / 92% 92% 12px 12px;
  background:
    radial-gradient(circle at 24% 24%, #fff8e8 1.1px, rgba(255, 244, 215, 0.9) 1.7px, transparent 2.4px),
    radial-gradient(circle at 54% 12%, #fff8e8 0.9px, rgba(255, 244, 215, 0.9) 1.4px, transparent 2px),
    radial-gradient(circle at 72% 26%, #fff8e8 0.9px, rgba(255, 244, 215, 0.9) 1.4px, transparent 2px),
    radial-gradient(circle at 40% 36%, #fff8e8 1px, rgba(255, 244, 215, 0.9) 1.6px, transparent 2.2px),
    radial-gradient(circle at 88% 40%, #fff8e8 0.7px, rgba(255, 244, 215, 0.9) 1.2px, transparent 1.8px),
    linear-gradient(180deg, #f2cc8f 0%, #e6b36c 40%, #d39a54 75%, #bf8444 100%);
  box-shadow:
    inset 0 5px 7px rgba(255, 255, 255, 0.45),
    inset 0 -4px 6px rgba(120, 70, 20, 0.3);
}

/* ======== 脆脆生菜 ======== */
.lq--lettuce .lq-inner {
  background:
    repeating-linear-gradient(100deg, rgba(255, 255, 255, 0.14) 0 2px, transparent 2px 9px),
    linear-gradient(180deg, #8cc96b, #5d9b42 85%);
  clip-path: polygon(
    0 30%, 5% 12%, 10% 26%, 16% 8%, 22% 24%, 28% 6%,
    34% 22%, 41% 5%, 47% 20%, 53% 4%, 59% 20%, 65% 6%,
    71% 22%, 78% 8%, 84% 24%, 90% 10%, 95% 26%, 100% 14%,
    100% 100%, 0 100%
  );
  box-shadow: inset 0 -4px 5px rgba(30, 60, 20, 0.35);
}

/* ======== 浓香芝士 ======== */
.lq--cheese .lq-inner {
  background: linear-gradient(180deg, #fbd876, #f0ba3f);
  clip-path: polygon(
    0 0, 100% 0, 100% 55%,
    92% 88%, 86% 60%, 76% 100%, 68% 58%,
    56% 88%, 46% 55%, 36% 100%, 26% 58%,
    16% 90%, 8% 60%, 0 88%, 0 55%
  );
  box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.55);
}

/* ======== 秘制肉饼 ======== */
.lq--patty .lq-inner {
  border-radius: 12px 12px 26% 26%;
  background:
    radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.14) 2px, transparent 3px),
    radial-gradient(circle at 65% 22%, rgba(0, 0, 0, 0.12) 1.8px, transparent 2.8px),
    radial-gradient(circle at 42% 58%, rgba(0, 0, 0, 0.13) 2px, transparent 3px),
    linear-gradient(180deg, #b07a50 0%, #8a5936 55%, #6d4226 100%);
  box-shadow:
    inset 0 4px 5px rgba(255, 255, 255, 0.2),
    inset 0 -5px 7px rgba(30, 15, 5, 0.42);
}

/* ======== 沙甜番茄 ======== */
.lq--tomato .lq-inner {
  border-radius: 10px 10px 22% 22%;
  background: radial-gradient(circle at 50% 55%, #ec7a58 0%, #d9483c 55%, #a82f26 100%);
  box-shadow:
    inset 0 0 0 3px rgba(255, 170, 140, 0.55),
    inset 0 2px 3px rgba(255, 255, 255, 0.22);
}

/* ======== 底层面包 ======== */
.lq--bun-bottom .lq-inner {
  border-radius: 12px 12px 32% 32%;
  background:
    radial-gradient(circle at 30% 70%, rgba(140, 85, 30, 0.1) 1px, transparent 1.6px),
    linear-gradient(180deg, #e6b977, #d19a55 70%, #c0894a 100%);
  box-shadow: inset 0 4px 5px rgba(255, 255, 255, 0.4);
}
</style>
