export type PersonInfo = {
  name: string;
  approximate_age: number;
  gender: string;
  state: string;
  district: string;
  language: string;
  current_location: string;
  occupation: string;
  family_members: string;
  has_mobile: boolean;
  has_aadhaar_family_member: boolean;
  known_by_asha: boolean;
  known_by_school: boolean;
  known_by_anganwadi: boolean;
  known_by_employer: boolean;
  known_by_neighbour: boolean;
  existing_documents: string[];
};

export type GeneratedPath = {
  recommended_path: string[];
  confidence: number;
  legal_reasoning: string[];
  required_documents: string[];
  estimated_steps: number;
  estimated_days: number;
  regional_notes: string[];
  risk_indicators: string[];
  alternative_paths: { recommended_path: string[]; confidence: number; estimated_days: number }[];
};

export type CaseRecord = {
  case_id: string;
  created_date: string;
  person_name: string;
  problem: string;
  generated_path: GeneratedPath;
  confidence: number;
  documents_generated: { document_type: string; filename: string }[];
  outcome: string;
  person: PersonInfo;
};

export type Stats = {
  legal_graph: { nodes: number; edges: number; rules: number };
  analytics: {
    total_cases: number;
    cases_by_district: Record<string, number>;
    common_problems: Record<string, number>;
    average_confidence: number;
    most_used_legal_path: string;
  };
};
