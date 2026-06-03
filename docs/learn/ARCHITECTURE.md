# happyfri 架构速查

## 一句话

用户上传 Word/PDF/Excel → 后端 `parser.py` 解析为 JSON → 前端 Zustand 存题 → 答题计时计分 → 成绩与答题卡复盘。

## 数据流

```mermaid
flowchart LR
  User[用户] --> Home[HomeView]
  Home --> Upload[UploadDrawer]
  Upload --> API["POST /api/parse-questions"]
  API --> Parser[parser.py]
  Parser --> JSON[QuizParseResult]
  JSON --> GameStore[useGameStore]
  GameStore --> Item[ItemView]
  Item --> Score[ScoreView]
  Score --> Card[AnswerCardView]
  Card --> Detail[AnswerDetailView]
```

## 路由表

| 路径 | 组件 | 作用 |
|------|------|------|
| `/` | HomeView | 首页、上传抽屉 |
| `/upload` | UploadView | 独立上传页 |
| `/item` | ItemView | 答题（可 `state.reset` 重练） |
| `/score` | ScoreView | 成绩 |
| `/answer-card` | AnswerCardView | 答题卡网格 |
| `/answer-card/:index` | AnswerDetailView | 单题复盘 |

定义：`src/router/index.tsx`（`lazy` + `Suspense`）

## 状态

| Store | 文件 | 职责 |
|-------|------|------|
| `useGameStore` | `src/stores/game.ts` | 题目、答案、题号、计时、分数、复盘列表 |
| `useUiStore` | `src/stores/ui.ts` | 上传 loading、错误文案 |

持久化：`src/stores/gamePersistence.ts` → `sessionStorage` 键 `happyfri-game-session`

## 请求

| 环境 | 解析 URL 方式 |
|------|----------------|
| 开发 | 相对路径 `/api/...`，Vite 代理到 `127.0.0.1:8000` |
| 生产 | `VITE_API_BASE_URL` + 路径，见 `src/config/api.ts` |

上传：`src/api/quiz.ts`，`FormData`，不手动设 `Content-Type`。

## 后端

| 端点 | 文件 |
|------|------|
| `GET /health` | `backend/app/main.py` |
| `POST /api/parse-questions` | `main.py` → `parser.parse_uploaded_file` |

契约：`backend/app/schemas.py`（Pydantic）

## 入口链

`index.html` → `src/main.tsx`（hydrate 会话）→ `App.tsx`（`useRoutes`）→ 各 View

## 部署

- 构建：`npm run build`（`tsc` + Vite + SPA 404 拷贝）
- GitHub Pages：`VITE_BASE_PATH=/<repo>/`，`BrowserRouter basename`
- API 须 HTTPS：`secrets.VITE_API_BASE_URL`
