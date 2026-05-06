/**
 * 生产环境：在 .env.production 或 CI 里设置 VITE_API_BASE_URL（如 https://api.example.com，无尾斜杠）。
 * 开发环境：留空则走相对路径 /api/...，由 Vite 代理到本机后端。
 */
export function getApiRoot(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw === undefined || raw === null) return ''
  const s = String(raw).trim()
  return s === '' ? s : s.replace(/\/+$/, '')
}

/** 拼接请求 URL；path 须以 / 开头，如 /api/parse-questions */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const root = getApiRoot()
  return root ? `${root}${p}` : p
}
