"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, FileJson, FileText, Printer, RefreshCw, Route, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { API_URL, generatePdf, getCase } from "@/lib/api";
import type { CaseRecord } from "@/lib/types";

export default function CasePage() {
  const params = useParams<{ id: string }>();
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getCase(params.id).then(setCaseRecord);
  }, [params.id]);

  async function handlePdf(documentType: string) {
    if (!caseRecord) return;
    setStatus(`Generating ${documentType}...`);
    const result = await generatePdf(caseRecord.case_id, documentType);
    setCaseRecord(result.case);
    setStatus(`${documentType} is ready.`);
    window.open(`${API_URL}${result.download_url}`, "_blank");
  }

  function exportJson() {
    if (!caseRecord) return;
    const blob = new Blob([JSON.stringify(caseRecord, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${caseRecord.case_id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!caseRecord) {
    return <div className="rounded-md border border-border p-6 text-sm">Loading case...</div>;
  }

  const path = caseRecord.generated_path;

  return (
    <div className="grid gap-6">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Dashboard / Case / {caseRecord.case_id}</div>
          <h1 className="mt-1 text-3xl font-semibold">{caseRecord.person_name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportJson}><FileJson className="h-4 w-4" /> Export JSON</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
          <Button asChild><Link href="/cases/new"><RefreshCw className="h-4 w-4" /> New Case</Link></Button>
        </div>
      </div>

      {status && <div className="no-print rounded-md border border-border bg-muted px-4 py-3 text-sm">{status}</div>}

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="grid content-start gap-5">
          <div>
            <div className="text-sm text-muted-foreground">Confidence Score</div>
            <div className="mt-2 text-6xl font-semibold text-success">{Math.round(path.confidence * 100)}%</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Case ID" value={caseRecord.case_id} />
            <Info label="Outcome" value={caseRecord.outcome} />
            <Info label="Problem" value={caseRecord.problem} />
            <Info label="Timeline" value={`${path.estimated_days} days`} />
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            <CardTitle>Recommended Legal Path</CardTitle>
          </div>
          <div className="grid gap-3">
            {path.recommended_path.map((node, index) => (
              <div key={`${node}-${index}`} className="grid grid-cols-[2rem_1fr] gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</div>
                <div className="rounded-md border border-border p-3">
                  <div className="font-medium">{node}</div>
                  <div className="text-sm text-muted-foreground">{index === path.recommended_path.length - 1 ? "Target enrollment outcome" : "Evidence or legal recognition step"}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Legal Explanation</CardTitle>
          <div className="mt-4 grid gap-3">
            {path.legal_reasoning.map((reason) => <div key={reason} className="rounded-md bg-muted p-3 text-sm">{reason}</div>)}
          </div>
        </Card>
        <Card>
          <CardTitle>Regional Notes</CardTitle>
          <div className="mt-4 grid gap-3">
            {path.regional_notes.map((note) => <div key={note} className="rounded-md bg-muted p-3 text-sm">{note}</div>)}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <CardTitle>Risk Indicators</CardTitle>
          </div>
          <div className="grid gap-2">
            {path.risk_indicators.map((risk) => <div key={risk} className="rounded-md border border-border p-3 text-sm">{risk}</div>)}
          </div>
        </Card>
        <Card>
          <CardTitle>Alternative Paths</CardTitle>
          <div className="mt-4 grid gap-3">
            {path.alternative_paths.length ? path.alternative_paths.map((alt) => (
              <div key={alt.recommended_path.join("-")} className="rounded-md border border-border p-3 text-sm">
                <div className="font-medium">{alt.recommended_path.join(" -> ")}</div>
                <div className="text-muted-foreground">{Math.round(alt.confidence * 100)}% confidence · {alt.estimated_days} days</div>
              </div>
            )) : <div className="text-sm text-muted-foreground">No stronger alternative path found for this evidence profile.</div>}
          </div>
        </Card>
      </section>

      <Card className="no-print">
        <CardTitle>Generated PDFs</CardTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {path.required_documents.map((documentType) => {
            const generated = caseRecord.documents_generated.find((doc) => doc.document_type === documentType);
            return (
              <div key={documentType} className="rounded-md border border-border p-3">
                <div className="mb-3 flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-primary" /> {documentType}</div>
                {generated ? (
                  <Button variant="outline" asChild>
                    <a href={`${API_URL}/pdfs/${generated.filename}`} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /> Download</a>
                  </Button>
                ) : (
                  <Button onClick={() => handlePdf(documentType)}>Generate PDF</Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
