<template>
  <div class="channel soon">
    <div class="soon-card">
      <span class="soon-mark" aria-hidden="true">◌</span>
      <h3 class="soon-title">敬请期待</h3>
      <p class="soon-desc">这个栏目还在烤炉里……<br />配方正在调试中，随时可能出炉。</p>
      <span class="soon-line mono-label">COMING SOON</span>
      <!-- 右下角装饰图（已抠底） -->
      <img src="/src/assets/soon.png" alt="" class="soon-img" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.soon {
  display: flex; justify-content: center; align-items: center;
  min-height: 260px;
}
.soon-card {
  position: relative;
  text-align: center;
  padding: var(--space-5) var(--space-4);
  border: 1.5px dashed var(--ink-20);
  border-radius: var(--radius-lg);
  width: 100%;
  min-height: 240px;
}
.soon-mark {
  font-size: 30px;
  color: var(--mustard);
  display: block;
  animation: soon-pulse 2.4s ease-in-out infinite;
}
@keyframes soon-pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
.soon-title {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--ink);
  margin-top: 10px;
}
.soon-desc {
  color: var(--ink-50);
  font-size: 13px;
  line-height: 1.8;
  margin-top: 8px;
}
.soon-line {
  display: block;
  margin-top: 14px;
  font-size: 8px;
  color: var(--tomato);
  letter-spacing: 0.3em;
}

/* 右下角装饰图（已抠底） */
.soon-img {
  position: absolute;
  right: 14px;
  bottom: 12px;
  width: 64px;
  height: 64px;
  object-fit: contain;
  opacity: 0.9;
  animation: soon-float 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes soon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
