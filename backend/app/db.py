import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "happyfri.db"

_SCHEMA = """
CREATE TABLE IF NOT EXISTS quiz_results (
  id           TEXT PRIMARY KEY,
  client_id    TEXT NOT NULL,
  timestamp    INTEGER NOT NULL,
  quiz_title   TEXT,
  score        REAL NOT NULL,
  total        INTEGER NOT NULL,
  correct      INTEGER NOT NULL,
  accuracy     INTEGER NOT NULL,
  elapsed_time INTEGER NOT NULL,
  type_accuracy TEXT NOT NULL,
  created_at   TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_quiz_results_client_ts
  ON quiz_results(client_id, timestamp);
"""


def get_db_path() -> Path:
    raw = os.environ.get("HAPPYFRI_DB_PATH", "").strip()
    return Path(raw) if raw else DEFAULT_DB_PATH


def init_db(db_path: Path | None = None) -> None:
    path = db_path or get_db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(path) as conn:
        conn.executescript(_SCHEMA)
        conn.commit()


@contextmanager
def get_connection(db_path: Path | None = None) -> Iterator[sqlite3.Connection]:
    path = db_path or get_db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()
