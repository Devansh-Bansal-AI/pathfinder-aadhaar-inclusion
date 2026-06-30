# PathFinder Project Context

## Project Summary

PathFinder is a local full-stack prototype for helping field workers and legal aid volunteers identify practical Aadhaar enrollment pathways for people with missing or weak documentation.

The app is designed for users such as ASHA workers, government school teachers, NGO caseworkers, and legal aid volunteers. They enter a person's situation, known witnesses, available documents, location, and enrollment problem. The system then recommends a legal pathway, explains the reasoning, flags risks, estimates timeline, stores the case, and generates supporting PDF documents.

## What We Have Built

### 1. FastAPI Backend

The backend lives in `backend/` and exposes a local API for case creation, path generation, analytics, rules, and PDF generation.

Main backend entry point:

- `backend/main.py`

Current API endpoints:

- `GET /health` - confirms the backend is running.
- `GET /rules` - returns the configured UIDAI pathway rules.
- `GET /stats` - returns graph stats and case analytics.
- `POST /generate-path` - generates a legal path without saving a case.
- `POST /cases` - generates a path and saves the case.
- `GET /cases` - lists saved cases, with optional search.
- `GET /cases/{case_id}` - returns one saved case.
- `POST /generate-pdf` - creates a PDF document for a saved case.
- `GET /pdfs/{filename}` - downloads generated PDFs.

The backend uses CORS so the frontend at `localhost:3000` can call the API at `127.0.0.1:8000`.

### 2. Legal Path Graph Engine

The decision logic is implemented in:

- `backend/app/graph_engine.py`

It loads legal pathway rules from:

- `knowledge/uidai_rules.json`

The engine uses NetworkX to build a directed graph of legal evidence pathways. It considers:

- Existing documents.
- Local witnesses such as ASHA, school, employer, neighbour, and anganwadi.
- Whether a family member has Aadhaar.
- The person's state and district.
- The specific enrollment problem, such as no address proof, biometric failure, migrant status, homelessness, or no introducer.

The generated result includes:

- Recommended legal path.
- Confidence score.
- Legal reasoning.
- Required documents.
- Estimated number of steps.
- Estimated timeline in days.
- Regional notes.
- Risk indicators.
- Alternative paths.

### 3. SQLite Case Storage

Case persistence is implemented in:

- `backend/app/database.py`

The app stores cases in:

- `database/pathfinder.db`

Each case includes:

- Case ID.
- Created date.
- Person details.
- Problem type.
- Generated legal path.
- Confidence score.
- Generated document records.
- Outcome status.

The database also supports analytics such as:

- Total cases.
- Cases by district.
- Common problems.
- Average confidence.
- Most used legal path.

### 4. Seed Data

The backend seeds realistic sample cases on startup through:

- `backend/app/seed.py`

This gives the dashboard usable data immediately after the project starts.

### 5. PDF Generation

PDF generation is implemented in:

- `backend/app/pdf_generator.py`

Generated PDFs are saved in:

- `pdfs/`

Supported document types include:

- Cover Letter to Enrollment Officer.
- Community Affidavit.
- Employer Verification Letter.
- School Verification Letter.
- Introducer Declaration.
- Biometric Exception Note when applicable.

The PDF includes person details, case ID, recommended path, legal justification, references, and signature areas.

### 6. Next.js Frontend

The frontend lives in:

- `frontend/`

It is built with:

- Next.js.
- TypeScript.
- Tailwind CSS.
- shadcn-style local UI components.
- Lucide icons.

Main pages:

- `frontend/app/page.tsx` - dashboard with metrics, search, recent cases, and analytics.
- `frontend/app/cases/new/page.tsx` - three-step new case workflow.
- `frontend/app/cases/[id]/page.tsx` - case detail page with generated path, reasoning, risks, alternatives, PDF generation, JSON export, and print action.

Shared frontend API helpers and types:

- `frontend/lib/api.ts`
- `frontend/lib/types.ts`

### 7. UI Features

Current frontend features include:

- Dashboard metrics.
- Recent case list.
- Search by case ID, name, or district.
- Analytics charts for districts and common problems.
- New case creation workflow.
- Case detail page with confidence score and legal route.
- Required document generation.
- PDF download links.
- JSON export.
- Print-friendly case page.
- Dark mode toggle.

### 8. Recent Fix

We fixed a hydration warning caused by browser extension attributes being injected into the `<body>` element before React hydration.

Changed file:

- `frontend/app/layout.tsx`

Fix:

- Added `suppressHydrationWarning` to the `<body>` element.

Verification:

- `npm run build` passed successfully.

## How To Run The Project

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run backend:

```bash
cd backend
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Run frontend:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Current Project Status

The project is a working local prototype. The backend and frontend both run successfully, the dashboard loads seeded case data, legal paths can be generated, cases are stored in SQLite, and PDFs can be produced for required documents.

This is suitable for a hackathon demo or early product walkthrough. It is not yet production-ready because legal references, security, validation, deployment, and real-world workflow details need more work.

## Strengths

- Clear social impact use case.
- Complete full-stack flow from intake to document generation.
- Rule-backed path generation instead of a purely black-box recommendation.
- Local SQLite storage keeps setup simple.
- Seed data makes demos easy.
- PDF generation gives the prototype a practical field-worker output.
- The case detail page explains confidence, reasoning, risks, and alternatives.

## What We Can Improve

### Legal Accuracy

- Replace placeholder or simplified circular references with verified UIDAI circular numbers and official source links.
- Add versioning to `uidai_rules.json` so rule changes can be audited.
- Include source URLs and validity dates for every rule.
- Add a legal-review status for rules: draft, reviewed, verified, deprecated.

### Path Recommendation Quality

- Improve confidence scoring so it accounts for evidence quality, witness reliability, document age, and state-specific procedures.
- Show why an alternative path was not selected.
- Add stronger handling for cases with no documents and no witnesses.
- Add escalation paths for legal aid, district administration, shelters, and child welfare bodies.

### Data Model

- Track case outcome history instead of a single outcome string.
- Add notes, follow-up dates, assigned worker, organization, and status.
- Store generated documents with timestamps and signer details.
- Add attachment support for scanned documents or photos.

### Frontend Experience

- Add stronger form validation before users move between steps.
- Add autosave for partially completed case forms.
- Improve mobile ergonomics for field use.
- Add multilingual labels and generated documents.
- Add loading, empty, and error states for all API calls.
- Add filters for district, problem type, confidence, and outcome.

### PDF Documents

- Improve PDF formatting for official submission.
- Add organization letterhead support.
- Add language-specific document templates.
- Add configurable signer blocks.
- Add QR code or verification code linking back to the case record.
- Add preview before generating final PDFs.

### Backend Reliability

- Add automated tests for path generation, API endpoints, database behavior, and PDF creation.
- Add input sanitization and stricter validation for person details.
- Add structured logging.
- Add error responses that the frontend can display clearly.
- Add database migrations instead of direct `CREATE TABLE IF NOT EXISTS`.

### Security And Privacy

- Add authentication and user roles.
- Encrypt sensitive case data at rest.
- Add audit logs for viewing, editing, exporting, and generating documents.
- Avoid exposing personally identifiable information in logs.
- Add consent fields for collecting and processing applicant data.

### Deployment

- Add environment configuration for API URLs, database path, PDF output path, and CORS origins.
- Add Docker setup for backend and frontend.
- Add production build/run documentation.
- Add backup and restore process for the SQLite database.

### Offline And Field Use

- Add offline-first case capture.
- Add sync when the device reconnects.
- Add printable offline forms.
- Add low-bandwidth mode.
- Add support for shared devices used by NGOs or field offices.

## Suggested Next Milestones

1. Verify and upgrade the UIDAI rules dataset.
2. Add backend tests for the legal graph engine.
3. Add frontend validation and better error states.
4. Improve PDF templates and add multilingual output.
5. Add case status tracking and follow-up workflow.
6. Add authentication and privacy controls.
7. Package the app with Docker for easier demos and deployment.

## Tech Stack

Backend:

- Python.
- FastAPI.
- Pydantic.
- NetworkX.
- SQLite.
- ReportLab.
- Uvicorn.

Frontend:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Lucide React.

Storage and generated assets:

- SQLite database in `database/pathfinder.db`.
- Generated PDFs in `pdfs/`.
- Legal rules in `knowledge/uidai_rules.json`.

## Important Files

- `README.md` - project overview and run instructions.
- `context.md` - this project context and improvement plan.
- `requirements.txt` - backend dependencies.
- `package.json` - root frontend command shortcuts.
- `backend/main.py` - FastAPI app and routes.
- `backend/app/graph_engine.py` - legal path recommendation engine.
- `backend/app/database.py` - SQLite storage and analytics.
- `backend/app/models.py` - Pydantic data models.
- `backend/app/pdf_generator.py` - PDF creation.
- `backend/app/seed.py` - sample data.
- `knowledge/uidai_rules.json` - legal pathway rules.
- `frontend/app/layout.tsx` - app shell and navigation.
- `frontend/app/page.tsx` - dashboard.
- `frontend/app/cases/new/page.tsx` - new case workflow.
- `frontend/app/cases/[id]/page.tsx` - case detail and document generation.
- `frontend/lib/api.ts` - frontend API client.
- `frontend/lib/types.ts` - frontend TypeScript types.

