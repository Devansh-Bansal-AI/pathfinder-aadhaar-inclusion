import type { CaseRecord, PersonInfo, Stats } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getStats() {
  return request<Stats>("/stats");
}

export function getCases(search?: string) {
  return request<CaseRecord[]>(`/cases${search ? `?search=${encodeURIComponent(search)}` : ""}`);
}

export function getCase(caseId: string) {
  return request<CaseRecord>(`/cases/${caseId}`);
}

export function createCase(person: PersonInfo, problem: string) {
  return request<CaseRecord>("/cases", {
    method: "POST",
    body: JSON.stringify({ person, problem })
  });
}

export function generatePdf(caseId: string, documentType: string) {
  return request<{ document_type: string; filename: string; download_url: string; case: CaseRecord }>("/generate-pdf", {
    method: "POST",
    body: JSON.stringify({ case_id: caseId, document_type: documentType })
  });
}
