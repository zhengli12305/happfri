import json
import uuid
from typing import Any

from .db import get_connection
from .schemas import QuizResultCreate, QuizResultItem


def insert_quiz_result(payload: QuizResultCreate) -> QuizResultItem:
    record_id = str(uuid.uuid4())
    timestamp = payload.timestamp if payload.timestamp is not None else _now_ms()
    type_accuracy_json = json.dumps(
        [item.model_dump() for item in payload.typeAccuracy],
        ensure_ascii=False,
    )

    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO quiz_results (
              id, client_id, timestamp, quiz_title, score, total,
              correct, accuracy, elapsed_time, type_accuracy
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record_id,
                payload.clientId,
                timestamp,
                payload.quizTitle,
                payload.score,
                payload.total,
                payload.correct,
                payload.accuracy,
                payload.elapsedTime,
                type_accuracy_json,
            ),
        )

    return QuizResultItem(
        id=record_id,
        timestamp=timestamp,
        quizTitle=payload.quizTitle,
        score=payload.score,
        total=payload.total,
        correct=payload.correct,
        accuracy=payload.accuracy,
        elapsedTime=payload.elapsedTime,
        typeAccuracy=payload.typeAccuracy,
    )


def list_quiz_results(client_id: str) -> list[QuizResultItem]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, timestamp, quiz_title, score, total, correct,
                   accuracy, elapsed_time, type_accuracy
            FROM quiz_results
            WHERE client_id = ?
            ORDER BY timestamp ASC
            """,
            (client_id,),
        ).fetchall()

    return [_row_to_item(row) for row in rows]


def _row_to_item(row: Any) -> QuizResultItem:
    type_accuracy_raw = json.loads(row["type_accuracy"])
    from .schemas import TypeAccuracyItem

    return QuizResultItem(
        id=row["id"],
        timestamp=row["timestamp"],
        quizTitle=row["quiz_title"],
        score=row["score"],
        total=row["total"],
        correct=row["correct"],
        accuracy=row["accuracy"],
        elapsedTime=row["elapsed_time"],
        typeAccuracy=[TypeAccuracyItem.model_validate(item) for item in type_accuracy_raw],
    )


def _now_ms() -> int:
    import time

    return int(time.time() * 1000)
