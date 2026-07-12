import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.db import init_db
from app.main import app

SAMPLE_PAYLOAD = {
    "clientId": "test-client-001",
    "quizTitle": "第三章测验",
    "score": 85,
    "total": 20,
    "correct": 17,
    "accuracy": 85,
    "elapsedTime": 320,
    "typeAccuracy": [
        {"type": "ONE", "label": "单选题", "total": 10, "correct": 9, "accuracy": 90},
        {"type": "MORE", "label": "多选题", "total": 5, "correct": 3, "accuracy": 60},
        {"type": "JUDGE", "label": "判断题", "total": 5, "correct": 5, "accuracy": 100},
    ],
    "timestamp": 1710000000000,
}


@pytest.fixture()
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    db_path = tmp_path / "test.db"
    monkeypatch.setenv("HAPPYFRI_DB_PATH", str(db_path))
    init_db(db_path)
    with TestClient(app) as test_client:
        yield test_client
    monkeypatch.delenv("HAPPYFRI_DB_PATH", raising=False)


def test_create_and_list_quiz_results(client: TestClient):
    create_resp = client.post("/api/quiz-results", json=SAMPLE_PAYLOAD)
    assert create_resp.status_code == 201
    created = create_resp.json()
    assert created["id"]
    assert created["timestamp"] == SAMPLE_PAYLOAD["timestamp"]

    list_resp = client.get(
        "/api/quiz-results",
        params={"clientId": SAMPLE_PAYLOAD["clientId"]},
    )
    assert list_resp.status_code == 200
    results = list_resp.json()["results"]
    assert len(results) == 1
    assert results[0]["quizTitle"] == "第三章测验"
    assert results[0]["accuracy"] == 85
    assert len(results[0]["typeAccuracy"]) == 3


def test_list_quiz_results_requires_client_id(client: TestClient):
    resp = client.get("/api/quiz-results")
    assert resp.status_code == 422


def test_create_quiz_result_validation(client: TestClient):
    bad_payload = {**SAMPLE_PAYLOAD, "total": 0}
    resp = client.post("/api/quiz-results", json=bad_payload)
    assert resp.status_code == 422
