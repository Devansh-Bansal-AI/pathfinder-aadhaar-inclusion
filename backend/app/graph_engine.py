from __future__ import annotations

import math
from typing import Any
import networkx as nx

from .knowledge import load_rules
from .models import PathRequest, PathResponse


DOCUMENT_NODE_MAP = {
    "Ration Card": "Address Proof",
    "School ID": "School Record",
    "Birth Certificate": "Identity Proof",
    "Employer Letter": "Employer Certificate",
    "Electricity Bill": "Address Proof",
    "Bank Passbook": "Address Proof",
    "Voter ID": "Identity Proof",
    "Driving License": "Identity Proof",
}


PROBLEM_RISKS = {
    "No Introducer": "No designated introducer has been identified yet.",
    "Biometric Failure": "Biometric exception may require supervised enrollment and medical note.",
    "Displaced": "Displacement history may require extra residence corroboration.",
    "Homeless": "Current location should be verified by shelter, ASHA or local body.",
    "Migrant": "Employer or neighbour evidence should match the current district.",
    "Stateless": "Escalate early to a gazetted officer or legal aid clinic.",
}


class LegalGraphEngine:
    def __init__(self) -> None:
        self.rules = load_rules()
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self) -> None:
        for rule in self.rules:
            for edge in rule["edges"]:
                self.graph.add_edge(
                    edge["from"],
                    edge["to"],
                    weight=max(0.01, 1.0 - edge["confidence"]),
                    rule_id=rule["id"],
                    title=rule["title"],
                    source=rule["source"],
                    circular_reference=rule["circular_reference"],
                    states=rule["states"],
                    **edge,
                )

    def stats(self) -> dict[str, int]:
        return {
            "nodes": self.graph.number_of_nodes(),
            "edges": self.graph.number_of_edges(),
            "rules": len(self.rules),
        }

    def _candidate_starts(self, request: PathRequest) -> list[str]:
        person = request.person
        starts = ["Person"]
        if person.known_by_asha:
            starts.append("ASHA")
        if person.known_by_school:
            starts.append("School")
        if person.known_by_employer:
            starts.append("Employer")
        if person.known_by_neighbour:
            starts.append("Neighbour")
        if person.has_aadhaar_family_member:
            starts.append("Head of Family")
        if person.known_by_anganwadi:
            starts.append("ASHA")
        if request.problem in {"Stateless", "Homeless", "No Identity Proof"}:
            starts.append("Gazetted Officer")
        for document in person.existing_documents:
            mapped = DOCUMENT_NODE_MAP.get(document)
            if mapped:
                starts.append(mapped)
        return list(dict.fromkeys(starts))

    def _edge_allowed(self, data: dict[str, Any], state: str) -> bool:
        states = data.get("states", [])
        return "All India" in states or state in states

    def _path_details(self, path: list[str], state: str) -> tuple[float, int, list[str], list[str]]:
        confidences: list[float] = []
        days = 0
        reasoning: list[str] = []
        notes: list[str] = []
        for source, target in zip(path, path[1:]):
            data = self.graph[source][target]
            if not self._edge_allowed(data, state):
                confidences.append(data["confidence"] * 0.82)
                notes.append(f"{data['title']}: not state-specific for {state}; verify locally.")
            else:
                confidences.append(data["confidence"])
            days += int(data.get("estimated_days", 1))
            reasoning.append(f"{source} -> {target}: {data['legal_basis']} ({data['circular_reference']}).")
            if data.get("regional_notes"):
                notes.append(data["regional_notes"])
        confidence = math.prod(confidences) ** (1 / max(1, len(confidences))) if confidences else 0.6
        return round(confidence, 2), days, reasoning, list(dict.fromkeys(notes))

    def generate_path(self, request: PathRequest) -> PathResponse:
        starts = self._candidate_starts(request)
        candidates: list[dict[str, Any]] = []
        for start in starts:
            if start not in self.graph:
                continue
            try:
                path = nx.shortest_path(self.graph, start, "Aadhaar", weight="weight")
            except (nx.NetworkXNoPath, nx.NodeNotFound):
                continue
            confidence, days, reasoning, notes = self._path_details(path, request.person.state)
            score = confidence - (0.015 * max(0, len(path) - 3))
            candidates.append(
                {
                    "path": path,
                    "confidence": round(score, 2),
                    "days": days,
                    "reasoning": reasoning,
                    "notes": notes,
                }
            )

        if not candidates:
            fallback = ["Gazetted Officer", "Identity Proof", "Aadhaar"]
            confidence, days, reasoning, notes = self._path_details(fallback, request.person.state)
            candidates.append({"path": fallback, "confidence": confidence, "days": days, "reasoning": reasoning, "notes": notes})

        candidates.sort(key=lambda item: (item["confidence"], -len(item["path"])), reverse=True)
        best = candidates[0]
        required_documents = self._required_documents(best["path"], request)
        risks = self._risks(request, best["confidence"])
        return PathResponse(
            recommended_path=best["path"],
            confidence=best["confidence"],
            legal_reasoning=best["reasoning"],
            required_documents=required_documents,
            estimated_steps=max(1, len(best["path"]) - 1),
            estimated_days=best["days"],
            regional_notes=best["notes"],
            risk_indicators=risks,
            alternative_paths=[
                {
                    "recommended_path": item["path"],
                    "confidence": item["confidence"],
                    "estimated_days": item["days"],
                }
                for item in candidates[1:4]
            ],
        )

    def _required_documents(self, path: list[str], request: PathRequest) -> list[str]:
        docs = ["Cover Letter to Enrollment Officer"]
        if "Community Affidavit" in path:
            docs.append("Community Affidavit")
        if "Employer Certificate" in path:
            docs.append("Employer Verification Letter")
        if "School Record" in path:
            docs.append("School Verification Letter")
        if "Introducer" in path or "Head of Family" in path:
            docs.append("Introducer Declaration")
        if request.problem == "Biometric Failure":
            docs.append("Biometric Exception Note")
        return list(dict.fromkeys(docs))

    def _risks(self, request: PathRequest, confidence: float) -> list[str]:
        risks = []
        if request.problem in PROBLEM_RISKS:
            risks.append(PROBLEM_RISKS[request.problem])
        if confidence < 0.75:
            risks.append("Confidence is moderate; collect one additional institutional witness.")
        if "No Documents" in request.person.existing_documents and not request.person.known_by_neighbour:
            risks.append("No documents and no neighbour witness increases rejection risk.")
        return risks or ["Low procedural risk if generated documents are signed before submission."]
