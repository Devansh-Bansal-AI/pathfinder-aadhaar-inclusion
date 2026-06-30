from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4
from dotenv import load_dotenv

from .models import CaseRecord, PersonInfo

# Load environment variables
load_dotenv()

ROOT = Path(__file__).resolve().parents[2]

db_env = os.getenv("PATHFINDER_DATABASE")
if db_env:
    db_path = Path(db_env)
    if not db_path.is_absolute():
        DB_PATH = (ROOT / db_path).resolve()
    else:
        DB_PATH = db_path
else:
    DB_PATH = (ROOT / "database" / "pathfinder.db").resolve()


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.execute(
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
        conn.commit()


def row_to_case(row: sqlite3.Row) -> CaseRecord:
    person = PersonInfo.model_validate_json(row["person"])
    return CaseRecord(
        case_id=row["case_id"],
        created_date=datetime.fromisoformat(row["created_date"]),
        person_name=row["person_name"],
        problem=row["problem"],
        generated_path=json.loads(row["generated_path"]),
        confidence=row["confidence"],
        documents_generated=json.loads(row["documents_generated"]),
        outcome=row["outcome"],
        person=person,
    )


def create_case(person: PersonInfo, problem: str, generated_path: dict[str, Any]) -> CaseRecord:
    case_id = f"PF-{datetime.now().strftime('%y%m')}-{uuid4().hex[:6].upper()}"
    created = datetime.now(timezone.utc)
    with connect() as conn:
        conn.execute(
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
        conn.commit()
    return get_case(case_id)


def list_cases(search: str | None = None) -> list[CaseRecord]:
    query = "SELECT * FROM cases"
    params: tuple[Any, ...] = ()
    if search:
        query += " WHERE case_id LIKE ? OR person_name LIKE ? OR district LIKE ?"
        term = f"%{search}%"
        params = (term, term, term)
    query += " ORDER BY created_date DESC"
    with connect() as conn:
        return [row_to_case(row) for row in conn.execute(query, params).fetchall()]


def get_case(case_id: str) -> CaseRecord:
    with connect() as conn:
        row = conn.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,)).fetchone()
    if row is None:
        raise KeyError(case_id)
    return row_to_case(row)


def add_generated_document(case_id: str, document_type: str, filename: str) -> CaseRecord:
    case = get_case(case_id)
    docs = [doc for doc in case.documents_generated if doc["document_type"] != document_type]
    docs.append({"document_type": document_type, "filename": filename})
    with connect() as conn:
        conn.execute(
            "UPDATE cases SET documents_generated = ?, outcome = ? WHERE case_id = ?",
            (json.dumps(docs), "Documents generated", case_id),
        )
        conn.commit()
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
        confidence_total += case.confidence
    return {
        "total_cases": len(cases),
        "cases_by_district": by_district,
        "common_problems": problems,
        "average_confidence": round(confidence_total / len(cases), 2) if cases else 0,
        "most_used_legal_path": max(paths.items(), key=lambda item: item[1])[0] if paths else "No cases yet",
    }
