# 一条链路讲清楚（5 分钟版）

你要讲的故事：**我如何发现瓶颈、用什么工具、数据是什么、结论是什么**。

---

## 链路图（面试白板可照画）

```
启动后端
    ↓
[L0] GET /health ──────────────→ 服务通了（~30ms）
    ↓
[L1] 单请求 ×5 ────────────────→ 10题 P50≈11ms，50题 P50≈19ms
    ↓
[L2] pytest-benchmark ─────────→ parser 10题 median≈8ms（绕过 HTTP）
    ↓
[L3] Locust 5用户30s ──────────→ 10题 RPS≈2.25，50题 P95≈58ms
    ↓
[L4] Lighthouse（preview）────→ 前端首屏（手动填表）
    ↓
结论：瓶颈 = POST /api/parse-questions 同步解析
```

---

## 一键跑（后端 L0–L3）

```powershell
# 终端 1
cd backend
python -m pip install -r requirements-dev.txt
python run_desktop.py

# 终端 2
.\scripts\perf\run-backend-baseline.ps1
```

或：

```bash
cd backend && python scripts/run_perf_baseline.py
```

**产出**：`docs/perf/BASELINE.md`

---

## 分工具对应「我做了什么」

| 我说的话 | 对应文件/命令 |
|----------|----------------|
| 我先冒烟确认服务 | `curl /health` 或脚本 Step1 |
| 我建立了单请求基线 | `backend/scripts/run_perf_baseline.py` |
| 我隔离了 parser CPU | `pytest tests/test_parser_perf.py --benchmark-only` |
| 我模拟了 5 人同时上传 | `locust -f backend/locustfile.py` |
| 我看了首屏 | `npm run build && preview` + Lighthouse |

---

## 三个必记数字（背下来）

1. **10 题 docx 单请求 P50 ≈ 11 ms**
2. **50 题 docx 单请求 P50 ≈ 19 ms**（题量变 5 倍，耗时约 1.7 倍）
3. **Locust 5 并发：10 题 RPS ≈ 2.25，50 题 P95 ≈ 58 ms**

---

## 完整文档

- [README.md](./README.md) — 链路说明 + 工具地图  
- [BASELINE.md](./BASELINE.md) — 实测报告  
- [INTERVIEW_SCRIPT.md](./INTERVIEW_SCRIPT.md) — 3 分钟口述稿  
- [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md) — 前端 Step5  
