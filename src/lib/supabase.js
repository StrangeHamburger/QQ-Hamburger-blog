// ============================================================
// Supabase 配置（留言墙存储）
// URL / publishable key 都是公开的（前端用），数据库权限由 RLS 策略控制：
//   匿名可读 + 匿名可写（仅 insert，不能改/删）
// ============================================================
export const SUPABASE_URL = 'https://zaahiuzmklzpzpnkabqr.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_n2koGAr8HtPBQajvKZ49Dw_G-FfwqxH'

// ---- 留言 API（REST 直连，无 SDK 依赖） ----
export async function fetchMessages(limit = 50) {
  const url = `${SUPABASE_URL}/rest/v1/guestbook?select=*&order=created_at.desc&limit=${limit}`
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
  })
  if (!res.ok) throw new Error('读取留言失败')
  return res.json()
}

export async function postMessage(name, content) {
  const url = `${SUPABASE_URL}/rest/v1/guestbook`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ name, content })
  })
  if (!res.ok) throw new Error('发送失败')
}

// ISO 时间 → 本地可读（如 8/13 18:30）
export function formatTime(iso) {
  try {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch {
    return ''
  }
}
