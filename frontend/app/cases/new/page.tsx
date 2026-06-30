"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileSymlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createCase } from "@/lib/api";
import type { PersonInfo } from "@/lib/types";
import { useLanguage } from "@/components/LanguageContext";

const DOCUMENTS = ["No Documents", "Ration Card", "School ID", "Birth Certificate", "Employer Letter", "Electricity Bill", "Bank Passbook", "Voter ID", "Driving License", "Any Other"];
const PROBLEMS = ["No Address Proof", "No Identity Proof", "No Introducer", "Biometric Failure", "No Head of Family", "Displaced", "Homeless", "Migrant", "Stateless"];

const emptyPerson: PersonInfo = {
  name: "",
  approximate_age: 28,
  gender: "Female",
  state: "Delhi",
  district: "",
  language: "Hindi",
  current_location: "",
  occupation: "",
  family_members: "",
  has_mobile: false,
  has_aadhaar_family_member: false,
  known_by_asha: false,
  known_by_school: false,
  known_by_anganwadi: false,
  known_by_employer: false,
  known_by_neighbour: false,
  existing_documents: ["No Documents"]
};

export default function NewCasePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [person, setPerson] = useState<PersonInfo>(emptyPerson);
  const [problem, setProblem] = useState(PROBLEMS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  function update<K extends keyof PersonInfo>(key: K, value: PersonInfo[K]) {
    setPerson((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setToast(t("toast_generating"));
    try {
      const created = await createCase(person, problem);
      setToast(t("toast_created"));
      router.push(`/cases/${created.case_id}`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : t("toast_failed"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5">
      <div className="text-sm text-muted-foreground">{t("dashboard")} / {t("new_case")}</div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("new_inclusion_case")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("new_case_desc")}</p>
        </div>
        <StepPills step={step} />
      </div>

      {toast && <div className="rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-md shadow-sm px-5 py-4 text-sm font-medium">{toast}</div>}

      <Card>
        {step === 1 && (
          <div className="grid gap-5">
            <CardTitle>{t("step1")}</CardTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t("name")}><Input value={person.name} onChange={(e) => update("name", e.target.value)} required /></Field>
              <Field label={t("approximate_age")}><Input type="number" min={0} max={120} value={person.approximate_age} onChange={(e) => update("approximate_age", Number(e.target.value))} /></Field>
              <Field label={t("gender")}><Select value={person.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="Female">{t("Female")}</option>
                <option value="Male">{t("Male")}</option>
                <option value="Non-binary">{t("Non-binary")}</option>
                <option value="Prefer not to say">{t("Prefer not to say")}</option>
              </Select></Field>
              <Field label={t("state")}><Input value={person.state} onChange={(e) => update("state", e.target.value)} /></Field>
              <Field label={t("district")}><Input value={person.district} onChange={(e) => update("district", e.target.value)} /></Field>
              <Field label={t("language_field")}><Input value={person.language} onChange={(e) => update("language", e.target.value)} /></Field>
              <Field label={t("current_location")}><Input value={person.current_location} onChange={(e) => update("current_location", e.target.value)} /></Field>
              <Field label={t("occupation")}><Input value={person.occupation} onChange={(e) => update("occupation", e.target.value)} /></Field>
              <Field label={t("family_members")} className="md:col-span-2"><Input value={person.family_members} onChange={(e) => update("family_members", e.target.value)} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["has_mobile", t("has_mobile")],
                ["has_aadhaar_family_member", t("has_aadhaar_family_member")],
                ["known_by_asha", t("known_by_asha")],
                ["known_by_school", t("known_by_school")],
                ["known_by_anganwadi", t("known_by_anganwadi")],
                ["known_by_employer", t("known_by_employer")],
                ["known_by_neighbour", t("known_by_neighbour")]
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-black/20 backdrop-blur-sm p-4 text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/50 dark:hover:bg-black/30 hover:border-primary/40">
                  <input type="checkbox" className="h-4 w-4 rounded-full text-primary focus:ring-primary/50 cursor-pointer" checked={Boolean(person[key as keyof PersonInfo])} onChange={(e) => update(key as keyof PersonInfo, e.target.checked as never)} />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">{t("existing_documents")}</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DOCUMENTS.map((document) => (
                  <label key={document} className="flex items-center gap-3 rounded-2xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-black/20 backdrop-blur-sm p-4 text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/50 dark:hover:bg-black/30 hover:border-primary/40">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded-full text-primary focus:ring-primary/50 cursor-pointer"
                      checked={person.existing_documents.includes(document)}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...person.existing_documents.filter((item) => item !== "No Documents"), document]
                          : person.existing_documents.filter((item) => item !== document);
                        update("existing_documents", document === "No Documents" && event.target.checked ? ["No Documents"] : next);
                      }}
                    />
                    <span className="font-medium">{t(document)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <CardTitle>{t("step2")}</CardTitle>
            <Field label={t("select_blockage")}>
              <Select value={problem} onChange={(e) => setProblem(e.target.value)}>
                {PROBLEMS.map((item) => <option key={item} value={item}>{t(item)}</option>)}
              </Select>
            </Field>
            <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-5 text-sm text-muted-foreground shadow-sm">
              {t("blockage_help")}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <CardTitle>{t("step3")}</CardTitle>
            <div className="grid gap-4 rounded-2xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-black/20 backdrop-blur-md p-6 text-sm shadow-sm">
              <div className="flex gap-2">
                <span className="font-semibold w-24 shrink-0 text-muted-foreground">{t("resident_label")}</span> 
                <span className="font-medium text-foreground">{person.name || "Unnamed case"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-24 shrink-0 text-muted-foreground">{t("location_label")}</span> 
                <span className="font-medium text-foreground">{person.district || "Unknown"}, {person.state}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-24 shrink-0 text-muted-foreground">{t("problem_label")}</span> 
                <span className="font-medium text-foreground">{t(problem)}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-24 shrink-0 text-muted-foreground">{t("known_by_label")}</span> 
                <span className="font-medium text-foreground">
                  {[
                    person.known_by_asha && t("known_by_asha"),
                    person.known_by_school && t("known_by_school"),
                    person.known_by_employer && t("known_by_employer"),
                    person.known_by_neighbour && t("known_by_neighbour")
                  ].filter(Boolean).join(", ") || t("no_witness")}
                </span>
              </div>
            </div>
            <Button onClick={submit} disabled={submitting || !person.name || !person.district}>
              <FileSymlink className="h-4 w-4" />
              {submitting ? t("generating") : t("generate_legal_path")}
            </Button>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || submitting}>
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
        {step < 3 && (
          <Button onClick={() => setStep((current) => Math.min(3, current + 1))}>
            {t("next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function StepPills({ step }: { step: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((item) => (
        <span key={item} className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all shadow-sm ${item <= step ? "bg-gradient-to-b from-primary/90 to-primary text-primary-foreground shadow-primary/20" : "bg-white/40 dark:bg-black/20 text-muted-foreground border border-white/20 dark:border-white/5 backdrop-blur-sm"}`}>
          {item < step && <CheckCircle2 className="h-4 w-4" />}
          {item}
        </span>
      ))}
    </div>
  );
}
