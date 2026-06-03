# happyfri — React + TypeScript + Vite

智能题库答题前端：上传 Word / PDF / Excel，解析后答题、查看成绩与答题卡。

## 技术栈

- React 19 + TypeScript
- Vite 8
- React Router 7
- Zustand（全局状态，替代原 Pinia）
- Axios

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
