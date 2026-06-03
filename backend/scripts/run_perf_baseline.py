#!/usr/bin/env python3
"""
一键跑后端性能基线，输出 docs/perf/BASELINE.md

前置：另开终端启动后端
  cd backend && python run_desktop.py

然后：
  cd backend && python scripts/run_perf_baseline.py
"""
from __future__ import annotations

import json
import os
import statistics
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx

BACKEND_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_ROOT.parent
PERF_DIR = REPO_ROOT / "docs" / "perf"
LOCUST_CSV_PREFIX = PERF_DIR / "locust_out"

sys.path.insert(0, str(BACKEND_ROOT))

from tests.helpers import build_sample_docx  # noqa: E402

HOST = os.environ.get("PERF_API_BASE", "http://127.0.0.1:8000").rstrip("/")
SAMPLES = 5


def ensure_perf_dir() -> None:
    PERF_DIR.mkdir(parents=True, exist_ok=True)


def check_health(client: httpx.Client) -> dict:
    t0 = time.perf_counter()
    r = client.get("/health")
    elapsed_ms = (time.perf_counter() - t0) * 1000
    body: object
    try:
        body = r.json()
    except json.JSONDecodeError:
        body = r.text[:200]
    return {"status_code": r.status_code, "latency_ms": round(elapsed_ms, 2), "body": body}


def single_parse_timings(client: httpx.Client, label: str, content: bytes, filename: str) -> dict:
    timings: list[float] = []
    last_status = 0
    for _ in range(SAMPLES):
        t0 = time.perf_counter()
        r = client.post(
            "/api/parse-questions",
            files={"file": (filename, content, DOCX_MIME)},
        )
        timings.append((time.perf_counter() - t0) * 1000)
        last_status = r.status_code
        if r.status_code != 200:
            return {
                "label": label,
                "error": r.text[:200],
                "status_code": last_status,
            }

    timings.sort()
    return {
        "label": label,
        "status_code": last_status,
        "samples": SAMPLES,
        "min_ms": round(min(timings), 2),
        "p50_ms": round(statistics.median(timings), 2),
        "p95_ms": round(timings[max(0, int(len(timings) * 0.95) - 1)], 2),
        "max_ms": round(max(timings), 2),
        "mean_ms": round(statistics.mean(timings), 2),
    }


DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def run_pytest_benchmark() -> str:
    cmd = [
        sys.executable,
        "-m",
        "pytest",
        "tests/test_parser_perf.py",
        "--benchmark-only",
        "--benchmark-columns=min,median,max",
        "-q",
    ]
    proc = subprocess.run(cmd, cwd=BACKEND_ROOT, capture_output=True, text=True)
    output = (proc.stdout or "") + (proc.stderr or "")
    if proc.returncode != 0:
        return f"pytest-benchmark 失败 (exit {proc.returncode}):\n```\n{output}\n```"
    return output.strip()


def run_locust_headless() -> dict:
    LOCUST_CSV_PREFIX.parent.mkdir(parents=True, exist_ok=True)
    for suffix in ("", "_stats", "_stats_history", "_failures", "_exceptions"):
        p = Path(f"{LOCUST_CSV_PREFIX}{suffix}.csv")
        if p.exists():
            p.unlink()

    cmd = [
        sys.executable,
        "-m",
        "locust",
        "-f",
        "locustfile.py",
        f"--host={HOST}",
        "--headless",
        "-u",
        "5",
        "-r",
        "1",
        "-t",
        "30s",
        f"--csv={LOCUST_CSV_PREFIX}",
    ]
    proc = subprocess.run(cmd, cwd=BACKEND_ROOT, capture_output=True, text=True)
    stats_path = Path(f"{LOCUST_CSV_PREFIX}_stats.csv")
    summary: dict = {
        "exit_code": proc.returncode,
        "stderr_tail": (proc.stderr or "")[-500:],
        "stdout_tail": (proc.stdout or "")[-500:],
    }
    if stats_path.exists():
        import csv

        for encoding in ("utf-8-sig", "utf-8", "gbk"):
            try:
                with stats_path.open(encoding=encoding, newline="") as f:
                    rows = list(csv.DictReader(f))
                summary["rows"] = rows
                break
            except UnicodeDecodeError:
                continue
    return summary


def write_baseline_md(
    health: dict,
    parse_small: dict,
    parse_medium: dict,
    benchmark_output: str,
    locust_summary: dict,
) -> Path:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    locust_table = ""
    if locust_summary.get("rows"):
        locust_table = "\n| 接口 | 请求数 | 失败数 | 平均(ms) | P95(ms) | RPS |\n|------|--------|--------|----------|---------|-----|\n"
        for row in locust_summary["rows"]:
            name = row.get("Name") or row.get("Type") or ""
            if name in ("Aggregated", "", "Total"):
                continue
            avg = row.get("Average Response Time", "-")
            p95 = row.get("95%", row.get("99%", "-"))
            rps = row.get("Requests/s", "-")
            try:
                avg = f"{float(avg):.1f}"
            except (TypeError, ValueError):
                pass
            try:
                p95 = f"{float(p95):.0f}"
            except (TypeError, ValueError):
                pass
            try:
                rps = f"{float(rps):.2f}"
            except (TypeError, ValueError):
                pass
            locust_table += (
                f"| {row.get('Name', name)} | {row.get('Request Count', '-')} | "
                f"{row.get('Failure Count', '-')} | {avg} | "
                f"{p95} | {rps} |\n"
            )

    md = f"""# happyfri 性能基线报告

> 自动生成时间：{now}  
> 后端地址：`{HOST}`  
> 生成命令：`cd backend && python scripts/run_perf_baseline.py`

## 1. 冒烟：健康检查

| 指标 | 值 |
|------|-----|
| HTTP 状态 | {health.get('status_code')} |
| 延迟 | {health.get('latency_ms')} ms |
| 响应体 | `{json.dumps(health.get('body'), ensure_ascii=False)}` |

## 2. 单请求基线（连续 {SAMPLES} 次，无并发）

### 10 题 docx

| 指标 | 值 |
|------|-----|
| P50 | {parse_small.get('p50_ms', 'N/A')} ms |
| P95 | {parse_small.get('p95_ms', 'N/A')} ms |
| 平均 | {parse_small.get('mean_ms', 'N/A')} ms |
| 最小/最大 | {parse_small.get('min_ms', 'N/A')} / {parse_small.get('max_ms', 'N/A')} ms |

### 50 题 docx

| 指标 | 值 |
|------|-----|
| P50 | {parse_medium.get('p50_ms', 'N/A')} ms |
| P95 | {parse_medium.get('p95_ms', 'N/A')} ms |
| 平均 | {parse_medium.get('mean_ms', 'N/A')} ms |
| 最小/最大 | {parse_medium.get('min_ms', 'N/A')} / {parse_medium.get('max_ms', 'N/A')} ms |

## 3. 函数级：pytest-benchmark（parser 纯 CPU）

```
{benchmark_output}
```

## 4. 接口压测：Locust headless（5 用户，30 秒）

{locust_table or '_Locust 未产出 stats，请检查 backend 是否已启动。_'}

## 5. 结论模板（面试用）

- 瓶颈在 **`POST /api/parse-questions`** 同步解析，无 DB。
- 题量从 10 → 50，单请求耗时近似线性上升（见上表对比）。
- 5 并发下 P95 / RPS 见 Locust 表；CPU 密集型，单 worker 易饱和。
- 优化方向：`run_in_executor`、多 worker、大文件异步任务队列。

## 6. 前端（需手动）

生产包：`npm run build && npm run preview`，Chrome Lighthouse 测 `/` 与 `/item`。  
步骤见 [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md)。
"""
    out = PERF_DIR / "BASELINE.md"
    out.write_text(md, encoding="utf-8")
    return out


def main() -> int:
    ensure_perf_dir()
    print(f"[*] 目标后端: {HOST}")
    print("[*] 请确保已运行: python run_desktop.py")

    try:
        with httpx.Client(base_url=HOST, timeout=120.0) as client:
            health = check_health(client)
            if health["status_code"] != 200:
                print(f"[!] /health 异常: HTTP {health['status_code']} body={health['body']}")
                print(f"    请确认 {HOST} 是本项目的 FastAPI（python run_desktop.py）")
                print("    若 8000 被占用，可: set PERF_API_BASE=http://127.0.0.1:8001")
                return 1
            print(f"[+] health OK ({health['latency_ms']} ms)")

            small = build_sample_docx(10)
            medium = build_sample_docx(50)
            print(f"[*] 单请求压测 {SAMPLES} 次 (10题)...")
            parse_small = single_parse_timings(client, "10题", small, "small_10q.docx")
            print(f"    P50={parse_small.get('p50_ms')} ms")

            print(f"[*] 单请求压测 {SAMPLES} 次 (50题)...")
            parse_medium = single_parse_timings(client, "50题", medium, "medium_50q.docx")
            print(f"    P50={parse_medium.get('p50_ms')} ms")
    except httpx.ConnectError:
        print("[!] 无法连接后端，请先启动: cd backend && python run_desktop.py")
        return 1

    print("[*] pytest-benchmark...")
    benchmark_output = run_pytest_benchmark()

    print("[*] Locust headless 30s...")
    locust_summary = run_locust_headless()

    out = write_baseline_md(health, parse_small, parse_medium, benchmark_output, locust_summary)
    print(f"[+] 报告已写入: {out.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
