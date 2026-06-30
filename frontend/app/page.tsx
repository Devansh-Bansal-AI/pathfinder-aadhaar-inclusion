"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, FileText, PlusCircle, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCases, getStats } from "@/lib/api";
import type { CaseRecord, Stats } from "@/lib/types";

export default function Dashboard() {
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
      <section className="grid gap-4 rounded-lg bg-muted p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="text-sm font-medium text-success">Government-tech case navigation</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">AI-powered legal documentation navigator for Aadhaar inclusion</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Built for ASHA workers, school teachers, NGO caseworkers and legal aid volunteers who need practical, rule-backed paths through difficult enrollment cases.
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new">
            <PlusCircle className="h-4 w-4" />
            New Case
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={<Users />} label="Total Cases" value={loading ? "..." : String(stats?.analytics.total_cases ?? cases.length)} />
        <Metric icon={<ShieldCheck />} label="Avg. Confidence" value={loading ? "..." : `${Math.round((stats?.analytics.average_confidence ?? 0) * 100)}%`} />
        <Metric icon={<Activity />} label="Legal Nodes" value={loading ? "..." : String(stats?.legal_graph.nodes ?? 0)} />
        <Metric icon={<FileText />} label="Rules Loaded" value={loading ? "..." : String(stats?.legal_graph.rules ?? 0)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent Cases</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search ID, name or district" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>
          <div className="grid gap-3">
            {recent.map((caseRecord) => (
              <Link key={caseRecord.case_id} href={`/cases/${caseRecord.case_id}`} className="grid gap-1 rounded-md border border-border p-3 hover:bg-muted sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="font-medium">{caseRecord.person_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {caseRecord.case_id} · {caseRecord.person.district} · {caseRecord.problem}
                  </div>
                </div>
                <div className="text-sm font-semibold text-success">{Math.round(caseRecord.confidence * 100)}%</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Analytics</CardTitle>
          </div>
          <Chart title="Cases by District" values={stats?.analytics.cases_by_district ?? {}} />
          <Chart title="Most Common Problems" values={stats?.analytics.common_problems ?? {}} />
          <div className="mt-5 rounded-md border border-border p-3">
            <div className="text-xs uppercase text-muted-foreground">Most Used Legal Path</div>
            <div className="mt-1 text-sm font-medium">{stats?.analytics.most_used_legal_path ?? "Loading"}</div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="rounded-md bg-muted p-3 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </Card>
  );
}

function Chart({ title, values }: { title: string; values: Record<string, number> }) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = Math.max(1, ...entries.map(([, value]) => value));
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="grid gap-2">
        {entries.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-2 text-sm">
            <span className="truncate text-muted-foreground">{label}</span>
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
