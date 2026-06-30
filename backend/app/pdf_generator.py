from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from dotenv import load_dotenv

from .knowledge import load_rules
from .models import CaseRecord

# Load environment variables
load_dotenv()

ROOT = Path(__file__).resolve().parents[2]

pdf_env = os.getenv("PATHFINDER_PDF_DIR")
if pdf_env:
    pdf_path = Path(pdf_env)
    if not pdf_path.is_absolute():
        PDF_DIR = (ROOT / pdf_path).resolve()
    else:
        PDF_DIR = pdf_path
else:
    PDF_DIR = (ROOT / "pdfs").resolve()


TITLES = {
    "Introducer Declaration": "Introducer Declaration",
    "Community Affidavit": "Community Residence and Identity Affidavit",
    "Employer Verification Letter": "Employer Verification Letter",
    "School Verification Letter": "School Verification Letter",
    "Cover Letter to Enrollment Officer": "Cover Letter to Aadhaar Enrollment Officer",
}


def generate_pdf(case: CaseRecord, document_type: str) -> Path:
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    safe_type = document_type.lower().replace(" ", "_")
    path = PDF_DIR / f"{case.case_id}_{safe_type}.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=54, leftMargin=54, topMargin=48, bottomMargin=48)
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="SmallMuted", parent=styles["BodyText"], fontSize=9, textColor=colors.HexColor("#475569")))
    styles.add(ParagraphStyle(name="HeadingBlue", parent=styles["Heading1"], textColor=colors.HexColor("#0f4c81"), spaceAfter=16))
    story = [
        Paragraph("PathFinder", styles["SmallMuted"]),
        Paragraph(TITLES.get(document_type, document_type), styles["HeadingBlue"]),
        Paragraph(f"Date: {datetime.now().strftime('%d %B %Y')}", styles["BodyText"]),
        Paragraph(f"Case ID: {case.case_id}", styles["BodyText"]),
        Spacer(1, 0.18 * inch),
        _person_table(case),
        Spacer(1, 0.2 * inch),
        Paragraph(_body_text(case, document_type), styles["BodyText"]),
        Spacer(1, 0.2 * inch),
        Paragraph("<b>Legal justification</b>", styles["Heading3"]),
        Paragraph("; ".join(case.generated_path.get("legal_reasoning", [])), styles["BodyText"]),
        Spacer(1, 0.15 * inch),
        Paragraph(f"Reference: {_references(case)}", styles["SmallMuted"]),
        Spacer(1, 0.35 * inch),
        _signature_table(),
    ]
    doc.build(story)
    return path


def _person_table(case: CaseRecord) -> Table:
    person = case.person
    rows = [
        ["Resident Name", person.name, "Approx. Age", str(person.approximate_age)],
        ["Gender", person.gender, "State/District", f"{person.state} / {person.district}"],
        ["Current Location", person.current_location, "Occupation", person.occupation],
        ["Problem", case.problem, "Recommended Path", " -> ".join(case.generated_path.get("recommended_path", []))],
    ]
    table = Table(rows, colWidths=[1.35 * inch, 2.1 * inch, 1.35 * inch, 2.1 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e6f0fa")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def _body_text(case: CaseRecord, document_type: str) -> str:
    name = case.person.name
    district = case.person.district
    if document_type == "Community Affidavit":
        return f"This affidavit records community verification that {name} is presently residing in {district} and is known locally for the purpose of Aadhaar enrollment support."
    if document_type == "Employer Verification Letter":
        return f"This letter confirms that {name} is engaged in work associated with the undersigned employer and may use this verification to support current residence and identity linkage."
    if document_type == "School Verification Letter":
        return f"This letter confirms that {name} is known to the school institution and may use school records to support identity details for Aadhaar enrollment."
    if document_type == "Introducer Declaration":
        return f"The undersigned introducer declares that {name} has been identified for Aadhaar enrollment through the recommended legal pathway."
    return f"To the Enrollment Officer: PathFinder recommends accepting the enclosed supporting documents for {name}, based on the generated legal documentation pathway and local verification evidence."


def _references(case: CaseRecord) -> str:
    reasoning = " ".join(case.generated_path.get("legal_reasoning", []))
    configured = [rule["circular_reference"] for rule in load_rules() if rule["circular_reference"] in reasoning]
    if not configured:
        configured = [rule["circular_reference"] for rule in load_rules()[:2]]
    return ", ".join(dict.fromkeys(configured))


def _signature_table() -> Table:
    rows = [
        ["Applicant / Guardian Signature", "Verifier Signature", "Enrollment Officer Notes"],
        ["\n\n________________________", "\n\n________________________", "\n\n________________________"],
    ]
    table = Table(rows, colWidths=[2.2 * inch, 2.2 * inch, 2.2 * inch])
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table
