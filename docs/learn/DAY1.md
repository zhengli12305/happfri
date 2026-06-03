# 第 1 天：跑通 + 画架构图

**目标（2–3h）**：能启动前后端，走完主流程，能答 Vite 代理与 `VITE_API_BASE_URL`。

## 1. 启动（30min）

```bash
cd backend && python -m pip install -r requirements.txt && python run_desktop.py
# 新终端
npm install && npm run dev
```

验证：`curl http://127.0.0.1:8000/health` → `{"status":"ok"}`

## 2. 走通用户路径（45min）

1. 打开 http://localhost:5173/
2. 「传输文件」→ 上传题库文件
3. 自动进 `/item` 答题 → 「提交答卷」
4. `/score` 看分 → 「查看答案卡」→ 点题号进详情

## 3. 必读文件（60min）

| 顺序 | 文件 | 记住 |
|------|------|------|
| 1 | `src/main.tsx` | `BrowserRouter basename={import.meta.env.BASE_URL}` |
| 2 | `src/App.tsx` | `useRoutes(routes)` |
| 3 | `vite.config.ts` | `server.proxy['/api']` → 8000 |
| 4 | `backend/app/main.py` | CORS、唯一解析接口 |

对照 [ARCHITECTURE.md](./ARCHITECTURE.md) 画自己的路由 + Store 图。

## 4. 自测答案

**Q: 开发时 `/api/parse-questions` 为何能到 8000？**  
A: Vite `server.proxy` 把浏览器发往 dev server 的 `/api/*` 转发到 `http://127.0.0.1:8000`，同源无跨域问题。

**Q: 生产 API 从哪来？**  
A: 构建时注入 `import.meta.env.VITE_API_BASE_URL`，`getApiRoot()` + `apiUrl()` 拼完整 URL。

## 5. 复述（10min）

录音 1 分钟：项目做什么、前后端各一个文件、开发怎么联调。
