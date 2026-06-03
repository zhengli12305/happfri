"""
Locust 压测脚本 — happyfri 核心接口 POST /api/parse-questions

用法（需先启动后端 python run_desktop.py）:
  cd backend
  locust -f locustfile.py --host=http://127.0.0.1:8000

Web UI: http://localhost:8089
无界面压测:
  locust -f locustfile.py --host=http://127.0.0.1:8000 --headless -u 5 -r 1 -t 30s --csv=perf/locust_out
"""
from __future__ import annotations

from locust import HttpUser, between, task

from tests.helpers import build_sample_docx

SMALL_DOCX = build_sample_docx(10)
MEDIUM_DOCX = build_sample_docx(50)
DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


class QuizParseUser(HttpUser):
    """模拟用户上传题库并触发解析（CPU 密集型）。"""

    wait_time = between(1, 2)

    @task(8)
    def parse_small_docx(self):
        self.client.post(
            "/api/parse-questions",
            files={"file": ("small_10q.docx", SMALL_DOCX, DOCX_MIME)},
            name="POST /api/parse-questions [10题 docx]",
        )

    @task(2)
    def parse_medium_docx(self):
        self.client.post(
            "/api/parse-questions",
            files={"file": ("medium_50q.docx", MEDIUM_DOCX, DOCX_MIME)},
            name="POST /api/parse-questions [50题 docx]",
        )

    @task(1)
    def health_check(self):
        self.client.get("/health", name="GET /health")
