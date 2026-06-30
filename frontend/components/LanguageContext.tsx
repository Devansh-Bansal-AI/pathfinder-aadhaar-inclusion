"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  requestLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    dashboard: "Dashboard",
    new_case: "New Case",
    pathfinder: "PathFinder",

    // Dashboard
    gov_tech_nav: "Government-tech case navigation",
    dashboard_title: "AI-powered legal documentation navigator for Aadhaar inclusion",
    dashboard_desc: "Built for ASHA workers, school teachers, NGO caseworkers and legal aid volunteers who need practical, rule-backed paths through difficult enrollment cases.",
    total_cases: "Total Cases",
    avg_confidence: "Avg. Confidence",
    legal_nodes: "Legal Nodes",
    rules_loaded: "Rules Loaded",
    recent_cases: "Recent Cases",
    search_placeholder: "Search ID, name or district",
    analytics: "Analytics",
    cases_by_district: "Cases by District",
    most_common_problems: "Most Common Problems",
    most_used_path: "Most Used Legal Path",
    loading: "Loading...",
    loading_case: "Loading case...",

    // New Case Form
    new_inclusion_case: "New inclusion case",
    new_case_desc: "Capture field evidence, identify the blockage, then generate a rule-backed route to Aadhaar enrollment.",
    step1: "Step 1: Person Information",
    step2: "Step 2: Current Problem",
    step3: "Step 3: Generate Path",
    name: "Name",
    approximate_age: "Approximate Age",
    gender: "Gender",
    state: "State",
    district: "District",
    language_field: "Language",
    current_location: "Current Location",
    occupation: "Occupation",
    family_members: "Family Members",
    has_mobile: "Has Mobile",
    has_aadhaar_family_member: "Has Aadhaar Family Member",
    known_by_asha: "Known by ASHA",
    known_by_school: "Known by School",
    known_by_anganwadi: "Known by Anganwadi",
    known_by_employer: "Known by Employer",
    known_by_neighbour: "Known by Neighbour",
    existing_documents: "Existing Documents",
    select_blockage: "Select the enrollment blockage",
    blockage_help: "This choice changes the risk indicators and may add escalation documents such as affidavits, introducer declarations or officer-facing cover letters.",
    resident_label: "Resident:",
    location_label: "Location:",
    problem_label: "Problem:",
    known_by_label: "Known by:",
    no_witness: "No local witness marked",
    generate_legal_path: "Generate Legal Path",
    generating: "Generating...",
    back: "Back",
    next: "Next",
    toast_generating: "Generating legal path and case record...",
    toast_created: "Case created. Opening generated path.",
    toast_failed: "Unable to create case",

    // Case Details
    confidence_score: "Confidence Score",
    outcome: "Outcome",
    timeline: "Timeline",
    days: "days",
    recommended_path: "Recommended Legal Path",
    target_outcome: "Target enrollment outcome",
    evidence_step: "Evidence or legal recognition step",
    legal_explanation: "Legal Explanation",
    regional_notes: "Regional Notes",
    risk_indicators: "Risk Indicators",
    alternative_paths: "Alternative Paths",
    no_alternative: "No stronger alternative path found for this evidence profile.",
    generated_pdfs: "Generated PDFs",
    download: "Download",
    generate_pdf: "Generate PDF",
    case_id: "Case ID",
    export_json: "Export JSON",
    print: "Print",
    dashboard_case: "Dashboard / Case /",

    // Problems
    "No Address Proof": "No Address Proof",
    "No Identity Proof": "No Identity Proof",
    "No Introducer": "No Introducer",
    "Biometric Failure": "Biometric Failure",
    "No Head of Family": "No Head of Family",
    "Displaced": "Displaced",
    "Homeless": "Homeless",
    "Migrant": "Migrant",
    "Stateless": "Stateless",

    // Documents
    "No Documents": "No Documents",
    "Ration Card": "Ration Card",
    "School ID": "School ID",
    "Birth Certificate": "Birth Certificate",
    "Employer Letter": "Employer Letter",
    "Electricity Bill": "Electricity Bill",
    "Bank Passbook": "Bank Passbook",
    "Voter ID": "Voter ID",
    "Driving License": "Driving License",
    "Any Other": "Any Other",

    // Genders
    "Female": "Female",
    "Male": "Male",
    "Non-binary": "Non-binary",
    "Prefer not to say": "Prefer not to say",

    // Nodes (dynamic mapping support)
    "ASHA Verification": "ASHA Verification",
    "Anganwadi Certificate": "Anganwadi Certificate",
    "Introducer Consent": "Introducer Consent",
    "Resident Certificate": "Resident Certificate",
    "SDM Verification": "SDM Verification",
    "UIDAI Center Enrollment": "UIDAI Center Enrollment",
    "Anganwadi Verification": "Anganwadi Verification",
    "Identity Declaration": "Identity Declaration",
    "Address Declaration": "Address Declaration",
    "Officer-Facing Cover Letter": "Officer-Facing Cover Letter",
    "Self Declaration Affidavit": "Self Declaration Affidavit",
    "Head of Family Declaration": "Head of Family Declaration",
    "Address Verification": "Address Verification",
    "Identity Verification": "Identity Verification",
    "Aadhaar Enrolment/Update Form": "Aadhaar Enrolment/Update Form",
  },
  hi: {
    // Nav
    dashboard: "डैशबोर्ड",
    new_case: "नया मामला",
    pathfinder: "पाथफाइंडर",

    // Dashboard
    gov_tech_nav: "सरकारी-तकनीक मामला नेविगेशन",
    dashboard_title: "आधार समावेशन के लिए एआई-संचालित कानूनी दस्तावेज़ नेविगेटर",
    dashboard_desc: "आशा कार्यकर्ताओं, स्कूल शिक्षकों, गैर सरकारी संगठन (NGO) कार्यकर्ताओं और कानूनी सहायता स्वयंसेवकों के लिए निर्मित जिन्हें कठिन नामांकन मामलों में व्यावहारिक, नियम-आधारित मार्गों की आवश्यकता होती है।",
    total_cases: "कुल मामले",
    avg_confidence: "औसत विश्वसनीयता",
    legal_nodes: "कानूनी नोड्स",
    rules_loaded: "लोड किए गए नियम",
    recent_cases: "हाल के मामले",
    search_placeholder: "आईडी, नाम या जिला खोजें",
    analytics: "विश्लेषण",
    cases_by_district: "जिले के अनुसार मामले",
    most_common_problems: "सबसे आम समस्याएं",
    most_used_path: "सबसे अधिक इस्तेमाल किया जाने वाला कानूनी मार्ग",
    loading: "लोड हो रहा है...",
    loading_case: "केस लोड हो रहा है...",

    // New Case Form
    new_inclusion_case: "नया समावेशन मामला",
    new_case_desc: "फ़ील्ड साक्ष्य एकत्र करें, रुकावट की पहचान करें, फिर आधार नामांकन के लिए एक नियम-समर्थित मार्ग उत्पन्न करें।",
    step1: "चरण 1: व्यक्तिगत जानकारी",
    step2: "चरण 2: वर्तमान समस्या",
    step3: "चरण 3: मार्ग उत्पन्न करें",
    name: "नाम",
    approximate_age: "अनुमानित आयु",
    gender: "लिंग",
    state: "राज्य",
    district: "जिला",
    language_field: "भाषा",
    current_location: "वर्तमान स्थान",
    occupation: "व्यवसाय",
    family_members: "परिवार के सदस्य",
    has_mobile: "मोबाइल है",
    has_aadhaar_family_member: "परिवार के सदस्य के पास आधार है",
    known_by_asha: "आशा कार्यकर्ता द्वारा परिचित",
    known_by_school: "स्कूल द्वारा परिचित",
    known_by_anganwadi: "आंगनवाड़ी द्वारा परिचित",
    known_by_employer: "नियोक्ता द्वारा परिचित",
    known_by_neighbour: "पड़ोसी द्वारा परिचित",
    existing_documents: "मौजूदा दस्तावेज़",
    select_blockage: "नामांकन रुकावट का चयन करें",
    blockage_help: "यह विकल्प जोखिम संकेतकों को बदलता है और हलफनामे, परिचयकर्ता घोषणाओं या अधिकारियों के समक्ष प्रस्तुत किए जाने वाले कवर पत्रों जैसे दस्तावेज जोड़ सकता है।",
    resident_label: "निवासी:",
    location_label: "स्थान:",
    problem_label: "समस्या:",
    known_by_label: "द्वारा परिचित:",
    no_witness: "कोई स्थानीय गवाह चिह्नित नहीं",
    generate_legal_path: "कानूनी मार्ग उत्पन्न करें",
    generating: "उत्पन्न किया जा रहा है...",
    back: "पीछे",
    next: "आगे",
    toast_generating: "कानूनी मार्ग और केस रिकॉर्ड उत्पन्न किया जा रहा है...",
    toast_created: "केस बनाया गया। उत्पन्न मार्ग खोला जा रहा है।",
    toast_failed: "केस बनाने में असमर्थ",

    // Case Details
    confidence_score: "विश्वसनीयता स्कोर",
    outcome: "परिणाम",
    timeline: "समयसीमा",
    days: "दिन",
    recommended_path: "अनुशंसित कानूनी मार्ग",
    target_outcome: "लक्ष्य नामांकन परिणाम",
    evidence_step: "साक्ष्य या कानूनी मान्यता चरण",
    legal_explanation: "कानूनी व्याख्या",
    regional_notes: "क्षेत्रीय टिप्पणियाँ",
    risk_indicators: "जोखिम संकेतक",
    alternative_paths: "वैकल्पिक मार्ग",
    no_alternative: "इस साक्ष्य प्रोफ़ाइल के लिए कोई मजबूत वैकल्पिक मार्ग नहीं मिला।",
    generated_pdfs: "उत्पन्न पीडीएफ",
    download: "डाउनलोड करें",
    generate_pdf: "पीडीएफ उत्पन्न करें",
    case_id: "केस आईडी",
    export_json: "JSON निर्यात करें",
    print: "प्रिंट करें",
    dashboard_case: "डैशबोर्ड / केस /",

    // Problems
    "No Address Proof": "पते का प्रमाण नहीं",
    "No Identity Proof": "पहचान का प्रमाण नहीं",
    "No Introducer": "कोई परिचयकर्ता नहीं",
    "Biometric Failure": "बायोमेट्रिक विफलता",
    "No Head of Family": "परिवार का कोई मुखिया नहीं",
    "Displaced": "विस्थापित",
    "Homeless": "बेघर",
    "Migrant": "प्रवासी",
    "Stateless": "राज्यविहीन",

    // Documents
    "No Documents": "कोई दस्तावेज़ नहीं",
    "Ration Card": "राशन कार्ड",
    "School ID": "स्कूल आईडी",
    "Birth Certificate": "जन्म प्रमाण पत्र",
    "Employer Letter": "नियोक्ता का पत्र",
    "Electricity Bill": "बिजली का बिल",
    "Bank Passbook": "बैंक पासबुक",
    "Voter ID": "वोटर आईडी",
    "Driving License": "ड्राइविंग लाइसेंस",
    "Any Other": "कोई अन्य",

    // Genders
    "Female": "महिला",
    "Male": "पुरुष",
    "Non-binary": "नॉन-बाइनरी",
    "Prefer not to say": "बताना नहीं चाहते",

    // Nodes (dynamic mapping support)
    "ASHA Verification": "आशा सत्यापन",
    "Anganwadi Certificate": "आंगनवाड़ी प्रमाणपत्र",
    "Introducer Consent": "परिचयकर्ता की सहमति",
    "Resident Certificate": "निवासी प्रमाणपत्र",
    "SDM Verification": "एसडीएम सत्यापन",
    "UIDAI Center Enrollment": "यूआईडीएआई केंद्र नामांकन",
    "Anganwadi Verification": "आंगनवाड़ी सत्यापन",
    "Identity Declaration": "पहचान घोषणा",
    "Address Declaration": "पता घोषणा",
    "Officer-Facing Cover Letter": "अधिकारी-समक्ष कवर पत्र",
    "Self Declaration Affidavit": "स्व-घोषणा हलफनामा",
    "Head of Family Declaration": "परिवार के मुखिया की घोषणा",
    "Address Verification": "पता सत्यापन",
    "Identity Verification": "पहचान सत्यापन",
    "Aadhaar Enrolment/Update Form": "आधार नामांकन/अद्यतन फॉर्म",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const requestLanguage = () => {
    setShowModal(true);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, requestLanguage }}>
      {children}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 no-print animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-foreground">
              {language === "hi" ? "अधिक भाषाओं का अनुरोध करें" : "Request More Languages"}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {language === "hi"
                ? "पाथफाइंडर को अन्य स्थानीय भाषाओं में उपलब्ध कराने के आपके प्रयास की हम सराहना करते हैं। हमारी टीम जल्द ही अन्य स्थानीय भाषाओं के समर्थन पर काम कर रही है।"
                : "We appreciate your interest in making PathFinder accessible in more regional languages. Our team is working on adding support for additional languages soon."}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95 transition-all duration-300"
              >
                {language === "hi" ? "ठीक है" : "Okay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
