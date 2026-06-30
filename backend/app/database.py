from __future__ import annotations

import json
import os
import contextlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4
from dotenv import load_dotenv

from .models import CaseRecord, PersonInfo

# Load environment variables
load_dotenv()

ROOT = Path(__file__).resolve().parents[2]

# Determine Database connection
db_url = os.getenv("DATABASE_URL") or os.getenv("PATHFINDER_DATABASE")
IS_POSTGRES = False

if db_url and (db_url.startswith("postgres://") or db_url.startswith("postgresql://")):
    IS_POSTGRES = True
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    DB_URL = db_url
else:
    IS_POSTGRES = False
    db_env = os.getenv("PATHFINDER_DATABASE")
    if db_env:
        db_path = Path(db_env)
        if not db_path.is_absolute():
            DB_PATH = (ROOT / db_path).resolve()
        else:
            DB_PATH = db_path
    else:
        DB_PATH = (ROOT / "database" / "pathfinder.db").resolve()


def connect() -> Any:
    if IS_POSTGRES:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        conn = psycopg2.connect(DB_URL, cursor_factory=RealDictCursor)
        return conn
    else:
        import sqlite3
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn


@contextlib.contextmanager
def db_session():
    conn = connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def execute(conn: Any, query: str, params: tuple = ()) -> Any:
    if IS_POSTGRES:
        query = query.replace("?", "%s")
        cur = conn.cursor()
        cur.execute(query, params)
        return cur
    else:
        return conn.execute(query, params)


def init_db() -> None:
    with db_session() as conn:
        execute(
            conn,
            """
            CREATE TABLE IF NOT EXISTS cases (
                case_id TEXT PRIMARY KEY,
                created_date TEXT NOT NULL,
                person_name TEXT NOT NULL,
                district TEXT NOT NULL,
                problem TEXT NOT NULL,
                generated_path TEXT NOT NULL,
                confidence REAL NOT NULL,
                documents_generated TEXT NOT NULL,
                outcome TEXT NOT NULL,
                person TEXT NOT NULL
            )
            """
        )


def row_to_case(row: Any) -> CaseRecord:
    person = PersonInfo.model_validate_json(row["person"])
    return CaseRecord(
        case_id=row["case_id"],
        created_date=datetime.fromisoformat(row["created_date"]),
        person_name=row["person_name"],
        problem=row["problem"],
        generated_path=json.loads(row["generated_path"]) if isinstance(row["generated_path"], str) else row["generated_path"],
        confidence=row["confidence"],
        documents_generated=json.loads(row["documents_generated"]) if isinstance(row["documents_generated"], str) else row["documents_generated"],
        outcome=row["outcome"],
        person=person,
    )


def create_case(person: PersonInfo, problem: str, generated_path: dict[str, Any]) -> CaseRecord:
    case_id = f"PF-{datetime.now().strftime('%y%m')}-{uuid4().hex[:6].upper()}"
    created = datetime.now(timezone.utc)
    with db_session() as conn:
        execute(
            conn,
            """
            INSERT INTO cases VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                case_id,
                created.isoformat(),
                person.name,
                person.district,
                problem,
                json.dumps(generated_path),
                generated_path["confidence"],
                json.dumps([]),
                "Path generated",
                person.model_dump_json(),
            ),
        )
    return get_case(case_id)


def list_cases(search: str | None = None) -> list[CaseRecord]:
    query = "SELECT * FROM cases"
    params: tuple[Any, ...] = ()
    if search:
        query += " WHERE case_id LIKE ? OR person_name LIKE ? OR district LIKE ?"
        term = f"%{search}%"
        params = (term, term, term)
    query += " ORDER BY created_date DESC"
    with db_session() as conn:
        return [row_to_case(row) for row in execute(conn, query, params).fetchall()]


def get_case(case_id: str) -> CaseRecord:
    with db_session() as conn:
        row = execute(conn, "SELECT * FROM cases WHERE case_id = ?", (case_id,)).fetchone()
    if row is None:
        raise KeyError(case_id)
    return row_to_case(row)


def add_generated_document(case_id: str, document_type: str, filename: str) -> CaseRecord:
    case = get_case(case_id)
    docs = [doc for doc in case.documents_generated if doc["document_type"] != document_type]
    docs.append({"document_type": document_type, "filename": filename})
    with db_session() as conn:
        execute(
            conn,
            "UPDATE cases SET documents_generated = ?, outcome = ? WHERE case_id = ?",
            (json.dumps(docs), "Documents generated", case_id),
        )
    return get_case(case_id)


def analytics() -> dict[str, Any]:
    cases = list_cases()
    by_district: dict[str, int] = {}
    problems: dict[str, int] = {}
    paths: dict[str, int] = {}
    confidence_total = 0.0
    for case in cases:
        by_district[case.person.district] = by_district.get(case.person.district, 0) + 1
        problems[case.problem] = problems.get(case.problem, 0) + 1
        path_key = " -> ".join(case.generated_path.get("recommended_path", []))
        paths[path_key] = paths.get(path_key, 0) + 1
        dynamic_conf = float(case.confidence)
        confidence_total += dynamic_conf
    return {
        "total_cases": len(cases),
        "cases_by_district": by_district,
        "common_problems": problems,
        "average_confidence": round(confidence_total / len(cases), 2) if cases else 0,
        "most_used_legal_path": max(paths.items(), key=lambda item: item[1])[0] if paths else "No cases yet",
    }
