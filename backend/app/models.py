from __future__ import annotations

from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class PersonInfo(BaseModel):
    name: str
    approximate_age: int = Field(ge=0, le=120)
    gender: str
    state: str
    district: str
    language: str
    current_location: str
    occupation: str
    family_members: str
    has_mobile: bool = False
    has_aadhaar_family_member: bool = False
    known_by_asha: bool = False
    known_by_school: bool = False
    known_by_anganwadi: bool = False
    known_by_employer: bool = False
    known_by_neighbour: bool = False
    existing_documents: list[str] = []


class PathRequest(BaseModel):
    person: PersonInfo
    problem: str


class PathResponse(BaseModel):
    recommended_path: list[str]
    confidence: float
    legal_reasoning: list[str]
    required_documents: list[str]
    estimated_steps: int
    estimated_days: int
    regional_notes: list[str]
    risk_indicators: list[str]
    alternative_paths: list[dict[str, Any]]


class CaseCreate(PathRequest):
    pass


class PdfRequest(BaseModel):
    case_id: str
    document_type: str


class CaseRecord(BaseModel):
    case_id: str
    created_date: datetime
    person_name: str
    problem: str
    generated_path: dict[str, Any]
    confidence: float
    documents_generated: list[dict[str, str]]
    outcome: str
    person: PersonInfo
