<script setup>
import { ref, onMounted } from 'vue'

// 留言墙：localStorage 持久化（key: krabby-guestbook）
const STORAGE_KEY = 'krabby-guestbook'
const name = ref('')
const text = ref('')
const messages = ref([])

onMounted(() => {
  try {
    messages.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { messages.value = [] }
})

function submit() {
  const content = text.value.trim()
  if (!content) return
  messages.value.unshift({
    name: name.value.trim() || '匿名小蟹',
    text: content,
    time: new Date().toLocaleString('zh-CN', { hour12: false })
  })
  // 最多留 50 条
  messages.value = messages.value.slice(0, 50)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value)) } catch {}
  text.value = ''
}
</script>

<template>
  <div class="guestbook">
    <!-- 留言输入 -->
    <div class="gb-form">
      <input
        v-model="name"
        type="text"
        class="gb-input gb-name"
        placeholder="你的名字（可选）"
        maxlength="20"
      />
      <textarea
        v-model="text"
        class="gb-input gb-text"
        placeholder="在这里留下想说的话……"
        rows="3"
        maxlength="200"
        @keydown.enter.exact.prevent="submit"
      ></textarea>
      <div class="gb-actions">
        <span class="gb-count mono-label">{{ text.length }}/200</span>
        <button class="gb-submit" :disabled="!text.trim()" @click="submit">
          贴上留言 →
        </button>
      </div>
    </div>

    <!-- 留言列表 -->
    <div class="gb-list" v-if="messages.length">
      <div v-for="(m, i) in messages" :key="i" class="gb-item">
        <span class="gb-avatar" aria-hidden="true">{{ m.name.slice(0, 1) }}</span>
        <div class="gb-body">
          <div class="gb-meta">
            <span class="gb-name-label">{{ m.name }}</span>
            <span class="gb-time mono-label">{{ m.time }}</span>
          </div>
          <p class="gb-text-label">{{ m.text }}</p>
        </div>
      </div>
    </div>
    <p v-else class="gb-empty mono-label">还没有留言，来贴第一张便签吧 🦀</p>
  </div>
</template>

<style scoped>
.guestbook { display: flex; flex-direction: column; gap: 18px; }

/* 表单 */
.gb-form {
  background: var(--paper);
  border: 1.5px solid var(--ink-12);
  border-radius: var(--radius);
  padding: 14px;
  box-shadow: var(--shadow-card);
}
.gb-input {
  width: 100%;
  font-family: inherit;
  font-size: 13px;
  color: var(--ink);
  background: var(--cream);
  border: 1.5px solid var(--ink-12);
  border-radius: var(--radius-sm);
  padding: 9px 12px;
  transition: border-color var(--dur-fast);
  resize: none;
}
.gb-input:focus { outline: none; border-color: var(--tomato); }
.gb-name { margin-bottom: 10px; width: 55%; }
.gb-text { display: block; }

.gb-actions {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 10px;
}
.gb-count { font-size: 9px; color: var(--ink-50); }
.gb-submit {
  font-size: 13px; font-weight: 600;
  color: var(--cream);
  background: var(--tomato);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  box-shadow: 0 2px 0 var(--navy-deep);
  transition: transform var(--dur-fast), box-shadow var(--dur-fast), opacity var(--dur-fast);
}
.gb-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 0 var(--navy-deep); }
.gb-submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* 列表 */
.gb-list { display: flex; flex-direction: column; gap: 10px; }
.gb-item {
  display: flex; gap: 10px;
  background: var(--cream);
  border: 1px solid var(--ink-08);
  border-radius: var(--radius);
  padding: 12px;
  transition: transform var(--dur-fast), border-color var(--dur-fast);
}
.gb-item:hover { transform: translateX(3px); border-color: var(--mustard); }

.gb-avatar {
  flex-shrink: 0;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--navy);
  color: var(--cream);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
}
.gb-body { flex: 1; min-width: 0; }
.gb-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.gb-name-label { font-size: 13px; font-weight: 700; color: var(--navy); }
.gb-time { font-size: 8px; color: var(--ink-50); }
.gb-text-label { font-size: 13px; color: var(--ink-70); margin-top: 3px; word-break: break-word; }

.gb-empty { color: var(--ink-50); font-size: 10px; text-align: center; padding: 20px 0; }
</style>
