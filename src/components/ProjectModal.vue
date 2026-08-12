<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  title: String,
  subtitle: String,
  meta: String,
  body: Object,
  href: String,   // 项目/GitHub 链接（可选）
  hrefLabel: String  // 按钮文字（默认"查看项目"）
})
const emit = defineEmits(['close'])

// ESC 关闭
function onKey(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- 全屏详情（meowj 式 case study） -->
  <Teleport to="body">
    <div class="project-modal" role="dialog" aria-modal="true">
      <div class="pm-backdrop" @click="emit('close')"></div>
      <div class="pm-panel">
        <button class="pm-close" @click="emit('close')" aria-label="关闭详情">×</button>

        <!-- 头部 -->
        <header class="pm-head">
          <span class="pm-tag mono-label">{{ meta }}</span>
          <h2 class="pm-title">{{ title }}</h2>
          <p v-if="subtitle" class="pm-subtitle">{{ subtitle }}</p>
        </header>

        <!-- 正文 -->
        <div class="pm-body">
          <!-- 引言 -->
          <p v-if="body?.intro" class="pm-intro">{{ body.intro }}</p>

          <!-- 通用 sections（paras / list / chips） -->
          <template v-for="(sec, si) in (body?.sections || [])" :key="si">
            <h3 class="pm-section mono-label">{{ sec.title }}</h3>

            <!-- 段落 -->
            <template v-if="sec.type === 'paras'">
              <p v-for="(para, pi) in sec.content" :key="pi" class="pm-para">{{ para }}</p>
            </template>

            <!-- 列表 -->
            <ul v-else-if="sec.type === 'list'" class="pm-features">
              <li v-for="(f, fi) in sec.content" :key="fi" class="pm-feature">
                <span class="pm-check" aria-hidden="true">✓</span>{{ f }}
              </li>
            </ul>

            <!-- 胶囊 -->
            <div v-else-if="sec.type === 'chips'" class="pm-tech">
              <span v-for="(t, ti) in sec.content" :key="ti" class="pm-tech-chip">{{ t }}</span>
            </div>
          </template>

          <!-- 跳转按钮 -->
          <div v-if="href" class="pm-footer">
            <a
              class="pm-link"
              :href="href"
              target="_blank"
              rel="noopener"
            >
              {{ hrefLabel || '查看项目' }} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.project-modal {
  position: fixed; inset: 0;
  z-index: 300;
  display: flex; justify-content: center; align-items: center;
  padding: 20px;
}

.pm-backdrop {
  position: absolute; inset: 0;
  background: rgba(16, 16, 16, 0.62);
  backdrop-filter: blur(3px);
  animation: fade-in 260ms ease;
}

.pm-panel {
  position: relative;
  width: min(720px, 92vw);
  max-height: 86vh;
  background: var(--cream);
  border: 2px solid var(--ink);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 0 rgba(26, 26, 24, 0.15), 0 30px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex; flex-direction: column;
  animation: panel-in 320ms var(--ease-spring);
}
@keyframes fade-in { from { opacity: 0; } }
@keyframes panel-in {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
}

.pm-close {
  position: absolute;
  top: 14px; right: 16px;
  font-size: 28px;
  color: var(--ink-50);
  line-height: 1;
  padding: 4px 10px;
  border-radius: 6px;
  transition: color var(--dur-fast), background var(--dur-fast), transform var(--dur-fast);
  z-index: 2;
}
.pm-close:hover { color: var(--tomato); background: var(--tomato-soft); transform: rotate(90deg); }

/* 头部 */
.pm-head {
  padding: 26px 32px 20px;
  border-bottom: 2px solid var(--ink);
  background: var(--paper);
  flex-shrink: 0;
}
.pm-tag {
  display: inline-block;
  font-size: 9px;
  color: var(--tomato);
  border: 1px solid var(--tomato);
  border-radius: 3px;
  padding: 2px 8px;
  letter-spacing: 0.2em;
}
.pm-title {
  font-family: var(--font-serif);
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 700;
  color: var(--ink);
  margin-top: 10px;
}
.pm-subtitle {
  color: var(--ink-50);
  font-size: 14px;
  margin-top: 6px;
}

/* 正文 */
.pm-body {
  padding: 24px 32px 32px;
  overflow-y: auto;
}
.pm-intro {
  font-family: var(--font-serif);
  font-size: 17px;
  line-height: 1.8;
  color: var(--navy);
  margin-bottom: 20px;
}
.pm-section {
  display: block;
  font-size: 10px;
  color: var(--tomato);
  letter-spacing: 0.25em;
  margin: 20px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--ink-08);
}
.pm-para {
  color: var(--ink-70);
  font-size: 14px;
  line-height: 1.9;
  margin-bottom: 10px;
}
.pm-features { list-style: none; }
.pm-feature {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--ink-70);
}
.pm-check {
  color: var(--tomato);
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
}
.pm-tech { display: flex; flex-wrap: wrap; gap: 8px; }
.pm-tech-chip {
  font-size: 12px;
  padding: 5px 14px;
  background: var(--paper);
  border: 1px solid var(--ink-12);
  border-radius: 999px;
  color: var(--ink-70);
  transition: background var(--dur-fast), border-color var(--dur-fast);
}
.pm-tech-chip:hover { background: var(--mustard-soft); border-color: var(--mustard); }

/* 底部跳转按钮 */
.pm-footer {
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid var(--ink-08);
  display: flex; justify-content: flex-end;
}
.pm-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--cream);
  background: var(--navy);
  border-radius: 999px;
  padding: 10px 22px;
  box-shadow: 0 3px 0 var(--ink-12);
  transition: transform var(--dur-fast) var(--ease-spring), background var(--dur-fast);
}
.pm-link:hover { transform: translateY(-2px); background: var(--tomato); }

@media (max-width: 767px) {
  .pm-head { padding: 20px 20px 16px; }
  .pm-body { padding: 18px 20px 24px; }
}
</style>
