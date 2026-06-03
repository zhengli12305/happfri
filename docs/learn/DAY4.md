# 第 4 天：请求层与前后端契约

**目标（2–3h）**：能抓包说明 FormData、错误处理、部署变量。

## 1. 前端上传链路

`src/api/quiz.ts`:

```ts
const formData = new FormData()
formData.append('file', file)
axios.post(apiUrl('/api/parse-questions'), formData, { timeout: 60000 })
```

**不要**手动设置 `Content-Type: multipart/form-data`，否则缺少 boundary。

## 2. URL 拼接

- 开发：`getApiRoot()` 为空 → `/api/parse-questions` → Vite 代理
- 生产：`VITE_API_BASE_URL=https://api.example.com` → 完整 URL

## 3. ajax.ts 与 quiz.ts 分离

`src/config/ajax.ts` 是通用 JSON 实例；上传走独立 `axios.post`，面试可说「文件上传与 JSON API 分离配置」。

## 4. 后端契约 `schemas.py`

- `type`: `ONE | MORE | JUDGE`
- `options` 至少 2 项
- `correctAnswerIds` 非空、去重

响应 JSON 字段与前端 `QuizParseResult` 一致（camelCase 由 Pydantic 默认 alias 或一致命名——本项目前后端字段名一致）。

## 5. 动手：Network 抓包（1h）

1. DevTools → Network → 上传文件
2. 看 Request：Form Data、无错误 Content-Type
3. 看 Response：`quizTitle`、`questions[]`
4. 故意传空文件 → 400，`detail` 文案

## 6. 自测答案

**Q: 422/500 如何展示？**  
A: FastAPI `HTTPException(detail=...)` → Axios `response.data.detail` → `uiStore.setError`。

**Q: GitHub Pages 为何不能用 http API？**  
A: Pages 是 HTTPS，请求 http 资源会被浏览器混合内容策略拦截；workflow 里强制检查 `https://`。

## 7. 相关文件

`vite.config.ts`、`.github/workflows/deploy-pages.yml`、`.env.example`
