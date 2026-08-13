<script setup>
import { ref, onMounted } from 'vue'
import { fetchMessages, postMessage, formatTime } from '../../lib/supabase.js'

// 留言墙：自研 UI（meowj 式：昵称 + 留言框 + 列表）+ Supabase 免费数据库
// 访客不用登录，填昵称即可留言；数据真实持久化、跨设备同步

const name = ref('')
const text = ref('')
const messages = ref([])
const loading = ref(true)
const sending = ref(false)
const errorMsg = ref('')
const okMsg = ref('')

onMounted(async () => {
  try {
    messages.value = await fetchMessages()
  } catch (e) {
    errorMsg.value = '留言加载失败，请刷新重试'
  } finally {
    loading.value = false
  }
})

async function submit() {
  const content = text.value.trim()
  if (!content || sending.value) return
  sending.value = true
  errorMsg.value = ''
  okMsg.value = ''
  try {
    await postMessage(name.value.trim() || '匿名小蟹', content)
    // 重新拉取（保持与数据库一致）
    messages.value = await fetchMessages()
    text.value = ''
    okMsg.value = '留言成功 🦀'
    setTimeout(() => { okMsg.value = '' }, 2500)
  } catch (e) {
    errorMsg.value = '发送失败，检查网络后重试'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="guestbook">
    <!-- 留言输入（自研：昵称 + 内容 + 计数） -->
    <div class="gb-form">
      <input
        v-model="name"
        type="text"
        class="gb-input gb-name"
        placeholder="你的昵称（可选）"
        maxlength="20"
      />
      <textarea
        v-model="text"
        class="gb-input gb-text"
        placeholder="想问什么？留个言吧..."
        rows="3"
        maxlength="500"
        @keydown.enter.exact.prevent="submit"
      ></textarea>
      <div class="gb-actions">
        <span class="gb-count mono-label">{{ text.length }}/500</span>
        <button class="gb-submit" :disabled="!text.trim() || sending" @click="submit">
          {{ sending ? '发送中…' : '发送留言 →' }}
        </button>
      </div>
      <p v-if="errorMsg" class="gb-msg gb-error">{{ errorMsg }}</p>
      <p v-else-if="okMsg" class="gb-msg gb-ok">{{ okMsg }}</p>
    </div>

    <!-- 留言列表 -->
    <div v-if="loading" class="gb-loading mono-label">正在打捞留言…</div>
    <div v-else-if="messages.length" class="gb-list">
      <div v-for="m in messages" :key="m.id" class="gb-item">
        <span class="gb-avatar" aria-hidden="true">{{ (m.name || '匿').slice(0, 1) }}</span>
        <div class="gb-body">
          <div class="gb-meta">
            <span class="gb-name-label">{{ m.name || '匿名小蟹' }}</span>
            <span class="gb-time mono-label">{{ formatTime(m.created_at) }}</span>
          </div>
          <p class="gb-text-label">{{ m.content }}</p>
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

.gb-msg { font-size: 11px; margin-top: 8px; }
.gb-error { color: var(--tomato); }
.gb-ok { color: var(--navy); }

/* 列表 */
.gb-loading { color: var(--ink-50); font-size: 10px; text-align: center; padding: 16px 0; }
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
