# happyfri 性能基线报告

> 自动生成时间：2026-05-31 13:10 UTC  
> 后端地址：`http://127.0.0.1:8001`  
> 生成命令：`cd backend && python scripts/run_perf_baseline.py`

## 1. 冒烟：健康检查

| 指标 | 值 |
|------|-----|
| HTTP 状态 | 200 |
| 延迟 | 29.27 ms |
| 响应体 | `{"status": "ok"}` |

## 2. 单请求基线（连续 5 次，无并发）

### 10 题 docx

| 指标 | 值 |
|------|-----|
| P50 | 11.26 ms |
| P95 | 11.71 ms |
| 平均 | 11.12 ms |
| 最小/最大 | 9.59 / 13.03 ms |

### 50 题 docx

| 指标 | 值 |
|------|-----|
| P50 | 18.67 ms |
| P95 | 20.39 ms |
| 平均 | 25.93 ms |
| 最小/最大 | 17.4 / 55.48 ms |

## 3. 函数级：pytest-benchmark（parser 纯 CPU）

```
..                                                                       [100%]

------------------------------------- benchmark: 2 tests -------------------------------------
Name (time in ms)                         Min             Median                 Max          
----------------------------------------------------------------------------------------------
test_parse_10_questions_benchmark      7.1187 (1.0)       7.9217 (1.0)      297.0190 (7.30)   
test_parse_50_questions_benchmark     14.0697 (1.98)     15.1472 (1.91)      40.6980 (1.0)    
----------------------------------------------------------------------------------------------

Legend:
  Outliers: 1 Standard Deviation from Mean; 1.5 IQR (InterQuartile Range) from 1st Quartile and 3rd Quartile.
  OPS: Operations Per Second, computed as 1 / Mean
2 passed in 3.26s
```

## 4. 接口压测：Locust headless（5 用户，30 秒）


| 接口 | 请求数 | 失败数 | 平均(ms) | P95(ms) | RPS |
|------|--------|--------|----------|---------|-----|
| GET /health | 13 | 0 | 2.1202615820444546 | 3 | 0.4433862306165333 |
| POST /api/parse-questions [10题 docx] | 66 | 0 | 10.939336357158467 | 13 | 2.2510377862070152 |
| POST /api/parse-questions [50题 docx] | 13 | 0 | 29.417253869514052 | 58 | 0.4433862306165333 |


## 5. 结论模板（面试用）

- 瓶颈在 **`POST /api/parse-questions`** 同步解析，无 DB。
- 题量从 10 → 50，单请求耗时近似线性上升（见上表对比）。
- 5 并发下 P95 / RPS 见 Locust 表；CPU 密集型，单 worker 易饱和。
- 优化方向：`run_in_executor`、多 worker、大文件异步任务队列。

## 6. 前端（需手动）

生产包：`npm run build && npm run preview`，Chrome Lighthouse 测 `/` 与 `/item`。  
步骤见 [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md)。
