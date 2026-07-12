# happyfri — React + TypeScript + Vite

智能题库答题前端：上传 Word / PDF / Excel，解析后答题、查看成绩与答题卡。

## 技术栈

- React 19 + TypeScript
- Vite 8
- React Router 7
- Zustand（全局状态，替代原 Pinia）
- Axios
- ECharts + echarts-for-react（答题历史可视化）

## 答题历史与数据持久化

交卷后自动将本次答题的**聚合统计**（正确率、题型分布、耗时等）写入后端 SQLite；在 `/history` 页面用 ECharts 查看趋势。

### 问题 → 方案 → 效果

**持久化**

- **问题**：此前每次答题结果交卷即丢失，无法查看长期进步情况。
- **方案**：FastAPI 新增 `POST/GET /api/quiz-results`，用 SQLite 文件存储；前端通过 `localStorage` 中的匿名 `clientId` 关联历史记录，只保存统计字段，不存题干与选项。
- **效果**：每次交卷自动入库；同一浏览器可跨会话查看历史答题记录。

**统计图表**

- **问题**：成绩页只有数字卡片，无法直观感受进步趋势和薄弱题型。
- **方案**：新增 `/history` 页面，封装 `AccuracyTrendChart`（正确率折线）、`TypeAccuracyRadarChart`（题型雷达，支持「最近一次 / 历史平均」切换）、`DurationBarChart`（耗时柱状图）。
- **效果**：≥2 次答题可看趋势；雷达图对比单选/多选/判断掌握度；历史为空时有引导页。

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/quiz-results` | 保存一次答题聚合结果（201） |
| `GET` | `/api/quiz-results?clientId=...` | 按时间升序返回历史列表 |

请求体字段：`clientId`、`quizTitle`、`score`、`total`、`correct`、`accuracy`、`elapsedTime`、`typeAccuracy[]`。

### 存储选型（SQLite）

答题记录低频、结构固定、查询简单（按 `clientId` 列表）。SQLite 由 Python 标准库支持，单文件部署、无需独立数据库服务，与当前数据量匹配。ECS 上通过 `HAPPYFRI_DB_PATH` 指向 `backend/data/happyfri.db`，目录由 `www-data` 持有写权限。

本地验证：

```bash
cd backend && python -m pytest tests/test_quiz_results.py -v
npm test   # quizHistoryTransform 单测
```

## 开发

```bash
npm install
npm run dev
```

开发时 `/api` 由 Vite 代理到本机后端（默认 `http://127.0.0.1:8000`）。

## 构建

```bash
npm run build
npm run preview
```

生产环境可在 `.env.production` 或 CI 中配置 `VITE_API_BASE_URL`、`VITE_BASE_PATH`。

## 面试学习（1 周速成）

见 [docs/learn/README.md](docs/learn/README.md)：按天跟练、15 道面试题、模拟面试脚本。

```bash
npm test                              # 前端 gameLogic 单测
cd backend && python -m pytest tests/ -v   # 后端 parser 单测
```

## 性能测试（面试可讲链路）

**一条链路讲清楚**：[docs/perf/QUICKSTART.md](docs/perf/QUICKSTART.md)

完整文档：[docs/perf/README.md](docs/perf/README.md) · 口述稿：[INTERVIEW_SCRIPT.md](docs/perf/INTERVIEW_SCRIPT.md) · 实测：[BASELINE.md](docs/perf/BASELINE.md)

```bash
# 终端1
cd backend && python -m pip install -r requirements-dev.txt && python run_desktop.py

# 终端2
cd backend && python scripts/run_perf_baseline.py
# Windows: .\scripts\perf\run-backend-baseline.ps1
```
