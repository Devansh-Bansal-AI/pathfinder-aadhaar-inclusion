from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RULE_PATH = ROOT / "knowledge" / "uidai_rules.json"


def load_rules() -> list[dict[str, Any]]:
    with RULE_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)
