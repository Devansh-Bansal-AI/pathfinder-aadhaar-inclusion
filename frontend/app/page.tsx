"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, FileText, PlusCircle, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCases, getStats } from "@/lib/api";
import type { CaseRecord, Stats } from "@/lib/types";
import { useLanguage } from "@/components/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCases(), getStats()])
      .then(([caseData, statData]) => {
        setCases(caseData);
        setStats(statData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getCases(search).then(setCases).catch(() => undefined);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const recent = useMemo(() => cases.slice(0, 6), [cases]);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-2xl bg-white/60 backdrop-blur-md dark:bg-black/40 border border-white/40 dark:border-white/10 p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="text-sm font-medium text-success">{t("gov_tech_nav")}</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">{t("dashboard_title")}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {t("dashboard_desc")}
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new">
            <PlusCircle className="h-4 w-4" />
            {t("new_case")}
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={<Users />} label={t("total_cases")} value={loading ? "..." : String(stats?.analytics.total_cases ?? cases.length)} />
        <Metric icon={<ShieldCheck />} label={t("avg_confidence")} value={loading ? "..." : `${Math.round((stats?.analytics.average_confidence ?? 0) * 100)}%`} />
        <Metric icon={<Activity />} label={t("legal_nodes")} value={loading ? "..." : String(stats?.legal_graph.nodes ?? 0)} />
        <Metric icon={<FileText />} label={t("rules_loaded")} value={loading ? "..." : String(stats?.legal_graph.rules ?? 0)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{t("recent_cases")}</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder={t("search_placeholder")} value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>
          <div className="grid gap-3">
            {recent.map((caseRecord) => (
              <Link key={caseRecord.case_id} href={`/cases/${caseRecord.case_id}`} className="grid gap-1 rounded-2xl border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 sm:grid-cols-[1fr_auto] transition-all duration-300 hover:bg-white/40 dark:hover:bg-black/20 hover:-translate-y-0.5 hover:shadow-md">
                <div>
                  <div className="font-semibold text-foreground">{caseRecord.person_name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {caseRecord.case_id} &middot; {caseRecord.person.district} &middot; {t(caseRecord.problem)}
                  </div>
                </div>
                <div className="text-sm font-bold text-success flex items-center">{Math.round(caseRecord.confidence * 100)}%</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>{t("analytics")}</CardTitle>
          </div>
          <Chart title={t("cases_by_district")} values={stats?.analytics.cases_by_district ?? {}} />
          <Chart title={t("most_common_problems")} values={stats?.analytics.common_problems ?? {}} />
          <div className="mt-5 rounded-2xl border border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 backdrop-blur-sm p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("most_used_path")}</div>
            <div className="mt-1.5 text-sm font-semibold">{stats?.analytics.most_used_legal_path ? t(stats.analytics.most_used_legal_path) : t("loading")}</div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="rounded-xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 p-3 text-primary shadow-sm [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </Card>
  );
}

function Chart({ title, values }: { title: string; values: Record<string, number> }) {
  const { t } = useLanguage();
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = Math.max(1, ...entries.map(([, value]) => value));
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="grid gap-2">
        {entries.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-2 text-sm">
            <span className="truncate text-muted-foreground">{t(label)}</span>
            <span className="h-2 rounded-full bg-muted">
              <span className="block h-2 rounded-full bg-success" style={{ width: `${(value / max) * 100}%` }} />
            </span>
            <span className="text-right font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
