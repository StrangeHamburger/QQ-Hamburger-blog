<script setup>
import { ref } from 'vue'
import { interests } from '../../data/content.js'

// 当前展开的大类（同时只开一个）
const openIndex = ref(-1)

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}
</script>

<template>
  <div class="channel">
    <div class="hobby-grid">
      <!-- 大类色块 -->
      <div
        v-for="(cat, i) in interests"
        :key="cat.name"
        class="hobby-block"
        :class="['tone-' + i, { open: openIndex === i }]"
        :style="cat.image ? { backgroundImage: 'url(' + cat.image + ')' } : {}"
        role="button"
        :tabindex="0"
        @click="toggle(i)"
        @keydown.enter="toggle(i)"
      >
        <span class="hb-shade" aria-hidden="true"></span>
        <span class="hb-name">{{ cat.name }}</span>
        <span class="hb-desc mono-label">{{ cat.desc }}</span>
        <span class="hb-arrow" :class="{ flipped: openIndex === i }" aria-hidden="true">▼</span>
      </div>
    </div>

    <!-- 展开的目录 -->
    <transition name="items" mode="out-in">
      <div v-if="openIndex >= 0" class="hobby-items" :key="openIndex">
        <div
          v-for="(item, k) in interests[openIndex].items"
          :key="item"
          class="hobby-item"
        >
          <span class="hi-no mono-label">{{ String(k + 1).padStart(2, '0') }}</span>
          <span class="hi-name">{{ item }}</span>
          <span class="hi-bar" aria-hidden="true"></span>
          <span class="hi-go" aria-hidden="true">→</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.hobby-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 大类色块 */
.hobby-block {
  position: relative;
  aspect-ratio: 1 / 1.05;
  border-radius: var(--radius-lg);
  display: flex; flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 6px;
  padding: 18px 16px;
  cursor: pointer;
  transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur);
  box-shadow: 0 3px 0 var(--ink-12), 0 8px 18px rgba(26,26,24,0.1);
  overflow: hidden;
  background-size: cover;         /* 图片铺满 */
  background-position: center;
}
.hobby-block:hover { transform: translateY(-4px); box-shadow: 0 5px 0 var(--ink-12), 0 14px 26px rgba(26,26,24,0.16); }
.hobby-block.open { transform: translateY(-2px); }

/* 无图时的底色（tone 兜底） */
.tone-0 { background-color: var(--navy-deep); }
.tone-1 { background-color: var(--tomato); }
.tone-0 { background-image: linear-gradient(145deg, #2f5272, var(--navy-deep)); }
.tone-1 { background-image: linear-gradient(145deg, #ec5a41, var(--tomato)); }

/* 深色遮罩：保证文字可读 */
.hb-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 15, 22, 0.42) 0%, rgba(10, 15, 22, 0.06) 45%, transparent 100%);
  pointer-events: none;
}

.hb-name, .hb-desc, .hb-arrow { position: relative; z-index: 1; }

.hb-name {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 700;
  color: var(--cream);
  letter-spacing: 0.12em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: transform var(--dur) var(--ease-spring);
}
.hobby-block:hover .hb-name { transform: translateX(3px); }

.hb-desc {
  font-size: 7px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.2em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.hb-arrow {
  position: absolute;
  right: 10px; bottom: 8px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.7);
  transition: transform var(--dur) var(--ease-out);
}
.hb-arrow.flipped { transform: rotate(180deg); }

/* 展开目录 */
.hobby-items {
  margin-top: 14px;
  border: 1.5px solid var(--ink-12);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--cream);
  box-shadow: var(--shadow-card);
}

.hobby-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ink-08);
  transition: background var(--dur-fast), transform var(--dur-fast);
}
.hobby-item:last-child { border-bottom: none; }
.hobby-item:hover { background: var(--mustard-soft); transform: translateX(3px); }

.hi-no {
  font-size: 10px;
  color: var(--tomato);
  min-width: 20px;
}
.hi-name { font-size: 14px; font-weight: 600; color: var(--ink); }

.hi-bar {
  flex: 1;
  height: 1px;
  background: var(--ink-08);
}
.hi-go {
  color: var(--ink-20);
  font-size: 14px;
  transition: transform var(--dur-fast), color var(--dur-fast);
}
.hobby-item:hover .hi-go { transform: translateX(4px); color: var(--tomato); }

.items-enter-active { animation: items-in var(--dur) var(--ease-spring); }
.items-leave-active { animation: items-in 160ms ease-in reverse; }   /* 快速退出，配合 out-in 顺序切换 */
@keyframes items-in {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
}

@media (max-width: 767px) {
  .hobby-block { aspect-ratio: 1 / 1; }
}
</style>
