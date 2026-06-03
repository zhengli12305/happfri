# 性能测试 — 面试口述稿（3 分钟 · 已填实测数据）

> 数据来自 [`BASELINE.md`](./BASELINE.md)（2026-05-31，本机 FastAPI 单 worker）。

---

## 1. 项目背景（20 秒）

happyfri 是 React + FastAPI 的智能题库：用户上传 Word/PDF/Excel，后端解析成 JSON，前端 Zustand 答题计分。**没有数据库**，唯一重的接口是 **`POST /api/parse-questions`**，属于 CPU 密集型同步解析。

---

## 2. 测试链路设计（40 秒）

我把性能验证拆成 **五层**，每层回答不同问题：

| 层级 | 工具 | 回答的问题 |
|------|------|------------|
| L0 | `GET /health` | 服务是否存活 |
| L1 | `run_perf_baseline.py` 单请求 ×5 | 无并发下 10 题 vs 50 题差多少 |
| L2 | pytest-benchmark | 耗时是否在 parser 本身（绕过 HTTP） |
| L3 | Locust 5 用户 30s | 并发下 P95、RPS 拐点 |
| L4 | Lighthouse（手动） | 生产包首屏与交互 |

**关键判断**：答题在浏览器 Zustand 里，不打 API，所以后端压测只打 `parse-questions`。

---

## 3. 实测数据（60 秒 — 打开 BASELINE.md 对照）

**冒烟**

- `/health`：200，`~29 ms`（可忽略）

**单请求基线（无并发，各 5 次）**

| 样本 | P50 | P95 | 结论 |
|------|-----|-----|------|
| 10 题 docx | **11.3 ms** | **11.7 ms** | 基线 |
| 50 题 docx | **18.7 ms** | **20.4 ms** | 题量 ×5，耗时约 ×1.7，近似线性 |

**函数级 benchmark（median）**

- 10 题：`7.9 ms`
- 50 题：`15.1 ms`  
→ 与 HTTP 层数量级一致，说明瓶颈在 **parser**，不是网络栈。

**Locust（5 用户，30 秒）**

| 场景 | 请求数 | 失败 | 平均 | P95 | RPS |
|------|--------|------|------|-----|-----|
| 10 题 docx | 66 | 0 | 10.9 ms | 13 ms | **2.25** |
| 50 题 docx | 13 | 0 | 29.4 ms | 58 ms | 0.44 |

**结论**：并发上来后，50 题 P95 到 **58 ms**，RPS 明显下降；符合 **CPU-bound + 单 worker** 特征。

---

## 4. 实现细节（30 秒）

- FastAPI 是 `async def`，但内部调 **同步** `parse_uploaded_file`，高并发会阻塞事件循环。
- 前端上传 timeout **60s**，说明产品预期大文件可能较慢。
- 测试数据用 `tests/helpers.py` **程序化生成 docx**，保证可复现。

---

## 5. 优化方向（30 秒）

1. `asyncio.to_thread` / 线程池跑解析  
2. `uvicorn -w 4` 多进程  
3. 大 PDF 改异步任务 + 进度轮询  
4. 前端：Lighthouse 测 preview 包，优化首屏背景图  

---

## 1 分钟精简版

> 我对 parse-questions 做了五层测试：health 冒烟、单请求 P50（10 题 11ms / 50 题 19ms）、pytest-benchmark 确认瓶颈在 parser、Locust 5 并发（10 题 RPS 2.25，50 题 P95 58ms）。结论是同步 CPU 解析 + 单 worker，不是 DB。下一步线程池化并加 worker。

---

## 你怎么复现（面试官问「数据怎么来的」）

```bash
# 终端 1
cd backend && python -m pip install -r requirements-dev.txt
python run_desktop.py

# 终端 2（若 8000 被占用：set PERF_API_BASE=http://127.0.0.1:8001）
cd backend && python scripts/run_perf_baseline.py
```

产出：`docs/perf/BASELINE.md`  
脚本：`backend/scripts/run_perf_baseline.py`  
压测场景：`backend/locustfile.py`
