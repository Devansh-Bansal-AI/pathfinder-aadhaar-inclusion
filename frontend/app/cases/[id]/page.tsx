"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, FileJson, FileText, Printer, RefreshCw, Route, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { API_URL, generatePdf, getCase } from "@/lib/api";
import type { CaseRecord } from "@/lib/types";
import { useLanguage } from "@/components/LanguageContext";

export default function CasePage() {
  const { t, language } = useLanguage();
  const params = useParams<{ id: string }>();
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getCase(params.id).then(setCaseRecord);
  }, [params.id]);

  async function handlePdf(documentType: string) {
    if (!caseRecord) return;
    setStatus(`${t("generating")} ${t(documentType)}...`);
    const result = await generatePdf(caseRecord.case_id, documentType);
    setCaseRecord(result.case);
    setStatus(`${t(documentType)} ${language === "hi" ? "तैयार है।" : "is ready."}`);
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
    return <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-xl p-8 text-sm font-semibold">{t("loading_case")}</div>;
  }

  const path = caseRecord.generated_path;

  return (
    <div className="grid gap-6">
      <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{t("dashboard_case")} {caseRecord.case_id}</div>
          <h1 className="mt-1 text-3xl font-semibold">{caseRecord.person_name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportJson}><FileJson className="h-4 w-4" /> {t("export_json")}</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> {t("print")}</Button>
          <Button asChild><Link href="/cases/new"><RefreshCw className="h-4 w-4" /> {t("new_case")}</Link></Button>
        </div>
      </div>

      {status && <div className="no-print rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-md px-5 py-4 text-sm font-medium shadow-sm">{status}</div>}

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="grid content-start gap-5">
          <div>
            <div className="text-sm text-muted-foreground">{t("confidence_score")}</div>
            <div className="mt-2 text-6xl font-semibold text-success">{Math.round(path.confidence * 100)}%</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="case_id" value={caseRecord.case_id} />
            <Info label="outcome" value={caseRecord.outcome} />
            <Info label="problem_label" value={t(caseRecord.problem)} />
            <Info label="timeline" value={`${path.estimated_days} ${t("days")}`} />
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            <CardTitle>{t("recommended_path")}</CardTitle>
          </div>
          <div className="grid gap-3">
            {path.recommended_path.map((node, index) => (
              <div key={`${node}-${index}`} className="grid grid-cols-[2.5rem_1fr] gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-primary/90 to-primary text-sm font-bold text-primary-foreground shadow-sm">{index + 1}</div>
                <div className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 shadow-sm">
                  <div className="font-semibold text-foreground">{t(node)}</div>
                  <div className="text-sm text-muted-foreground mt-1">{index === path.recommended_path.length - 1 ? t("target_outcome") : t("evidence_step")}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>{t("legal_explanation")}</CardTitle>
          <div className="mt-4 grid gap-3">
            {path.legal_reasoning.map((reason) => (
              <div key={reason} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 text-sm leading-relaxed shadow-sm">
                {reason}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>{t("regional_notes")}</CardTitle>
          <div className="mt-4 grid gap-3">
            {path.regional_notes.map((note) => (
              <div key={note} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 text-sm leading-relaxed shadow-sm">
                {note}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <CardTitle>{t("risk_indicators")}</CardTitle>
          </div>
          <div className="grid gap-2">
            {path.risk_indicators.map((risk) => (
              <div key={risk} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 text-sm shadow-sm">
                {risk}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>{t("alternative_paths")}</CardTitle>
          <div className="mt-4 grid gap-3">
            {path.alternative_paths.length ? path.alternative_paths.map((alt) => (
              <div key={alt.recommended_path.join("-")} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 text-sm shadow-sm">
                <div className="font-semibold text-foreground">{alt.recommended_path.map(n => t(n)).join(" -> ")}</div>
                <div className="text-muted-foreground mt-2 text-xs font-semibold uppercase tracking-wider">{Math.round(alt.confidence * 100)}% {t("confidence_score")} &middot; {alt.estimated_days} {t("days")}</div>
              </div>
            )) : <div className="text-sm text-muted-foreground">{t("no_alternative")}</div>}
          </div>
        </Card>
      </section>

      <Card className="no-print">
        <CardTitle>{t("generated_pdfs")}</CardTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {path.required_documents.map((documentType) => {
            const generated = caseRecord.documents_generated.find((doc) => doc.document_type === documentType);
            return (
              <div key={documentType} className="rounded-2xl border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-2 font-semibold text-foreground"><FileText className="h-4 w-4 text-primary" /> {t(documentType)}</div>
                {generated ? (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`${API_URL}/pdfs/${generated.filename}`} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /> {t("download")}</a>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handlePdf(documentType)}>{t("generate_pdf")}</Button>
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
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{t(label)}</div>
      <div className="mt-1.5 font-semibold text-foreground">{value}</div>
    </div>
  );
}
