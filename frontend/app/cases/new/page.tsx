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
    setToast("Generating legal path and case record...");
    try {
      const created = await createCase(person, problem);
      setToast("Case created. Opening generated path.");
      router.push(`/cases/${created.case_id}`);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Unable to create case");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-5">
      <div className="text-sm text-muted-foreground">Dashboard / New Case</div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">New inclusion case</h1>
          <p className="mt-1 text-sm text-muted-foreground">Capture field evidence, identify the blockage, then generate a rule-backed route to Aadhaar enrollment.</p>
        </div>
        <StepPills step={step} />
      </div>

      {toast && <div className="rounded-md border border-border bg-muted px-4 py-3 text-sm">{toast}</div>}

      <Card>
        {step === 1 && (
          <div className="grid gap-5">
            <CardTitle>Step 1: Person Information</CardTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name"><Input value={person.name} onChange={(e) => update("name", e.target.value)} required /></Field>
              <Field label="Approximate Age"><Input type="number" min={0} max={120} value={person.approximate_age} onChange={(e) => update("approximate_age", Number(e.target.value))} /></Field>
              <Field label="Gender"><Select value={person.gender} onChange={(e) => update("gender", e.target.value)}><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></Select></Field>
              <Field label="State"><Input value={person.state} onChange={(e) => update("state", e.target.value)} /></Field>
              <Field label="District"><Input value={person.district} onChange={(e) => update("district", e.target.value)} /></Field>
              <Field label="Language"><Input value={person.language} onChange={(e) => update("language", e.target.value)} /></Field>
              <Field label="Current Location"><Input value={person.current_location} onChange={(e) => update("current_location", e.target.value)} /></Field>
              <Field label="Occupation"><Input value={person.occupation} onChange={(e) => update("occupation", e.target.value)} /></Field>
              <Field label="Family Members" className="md:col-span-2"><Input value={person.family_members} onChange={(e) => update("family_members", e.target.value)} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["has_mobile", "Has Mobile"],
                ["has_aadhaar_family_member", "Has Aadhaar Family Member"],
                ["known_by_asha", "Known by ASHA"],
                ["known_by_school", "Known by School"],
                ["known_by_anganwadi", "Known by Anganwadi"],
                ["known_by_employer", "Known by Employer"],
                ["known_by_neighbour", "Known by Neighbour"]
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
                  <input type="checkbox" checked={Boolean(person[key as keyof PersonInfo])} onChange={(e) => update(key as keyof PersonInfo, e.target.checked as never)} />
                  {label}
                </label>
              ))}
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">Existing Documents</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DOCUMENTS.map((document) => (
                  <label key={document} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={person.existing_documents.includes(document)}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...person.existing_documents.filter((item) => item !== "No Documents"), document]
                          : person.existing_documents.filter((item) => item !== document);
                        update("existing_documents", document === "No Documents" && event.target.checked ? ["No Documents"] : next);
                      }}
                    />
                    {document}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <CardTitle>Step 2: Current Problem</CardTitle>
            <Field label="Select the enrollment blockage">
              <Select value={problem} onChange={(e) => setProblem(e.target.value)}>
                {PROBLEMS.map((item) => <option key={item}>{item}</option>)}
              </Select>
            </Field>
            <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
              This choice changes the risk indicators and may add escalation documents such as affidavits, introducer declarations or officer-facing cover letters.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <CardTitle>Step 3: Generate Path</CardTitle>
            <div className="grid gap-3 rounded-md border border-border p-4 text-sm">
              <div><b>Resident:</b> {person.name || "Unnamed case"}</div>
              <div><b>Location:</b> {person.district}, {person.state}</div>
              <div><b>Problem:</b> {problem}</div>
              <div><b>Known by:</b> {[person.known_by_asha && "ASHA", person.known_by_school && "School", person.known_by_employer && "Employer", person.known_by_neighbour && "Neighbour"].filter(Boolean).join(", ") || "No local witness marked"}</div>
            </div>
            <Button onClick={submit} disabled={submitting || !person.name || !person.district}>
              <FileSymlink className="h-4 w-4" />
              {submitting ? "Generating..." : "Generate Legal Path"}
            </Button>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || submitting}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 3 && (
          <Button onClick={() => setStep((current) => Math.min(3, current + 1))}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function StepPills({ step }: { step: number }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((item) => (
        <span key={item} className={`inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm ${item <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {item < step && <CheckCircle2 className="h-4 w-4" />}
          {item}
        </span>
      ))}
    </div>
  );
}
