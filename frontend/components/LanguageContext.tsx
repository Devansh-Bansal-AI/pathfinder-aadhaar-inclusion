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
    "Person": "Person",
    "ASHA": "ASHA",
    "School": "School",
    "Employer": "Employer",
    "Neighbour": "Neighbour",
    "Head of Family": "Head of Family",
    "Gazetted Officer": "Gazetted Officer",
    "Community Affidavit": "Community Affidavit",
    "Employer Certificate": "Employer Certificate",
    "School Record": "School Record",
    "Identity Proof": "Identity Proof",
    "Address Proof": "Address Proof",
    "Aadhaar": "Aadhaar",
    "Introducer": "Introducer",

    // Document Names
    "Cover Letter to Enrollment Officer": "Cover Letter to Enrollment Officer",
    "Introducer Declaration": "Introducer Declaration",
    "Employer Verification Letter": "Employer Verification Letter",
    "School Verification Letter": "School Verification Letter",
    "Biometric Exception Note": "Biometric Exception Note",

    // Rule Titles
    "Introducer Based Enrollment": "Introducer Based Enrollment",
    "ASHA Community Verification": "ASHA Community Verification",
    "School Record as Identity Support": "School Record as Identity Support",
    "Employer Verification for Migrant Workers": "Employer Verification for Migrant Workers",
    "Head of Family Enrollment": "Head of Family Enrollment",
    "Neighbour Residence Affidavit": "Neighbour Residence Affidavit",
    "Gazetted Officer Certificate": "Gazetted Officer Certificate",
    "Document to Aadhaar Bridge": "Document to Aadhaar Bridge",

    // Legal Explanations
    "Introducer -> Aadhaar: Introducer certification for residents without standard documents (UIDAI Circular XXXXX).": "Introducer -> Aadhaar: Introducer certification for residents without standard documents (UIDAI Circular XXXXX).",
    "ASHA -> Community Affidavit: Community health worker verification of residence and identity (UIDAI Circular ASHA-REF-02).": "ASHA -> Community Affidavit: Community health worker verification of residence and identity (UIDAI Circular ASHA-REF-02).",
    "Community Affidavit -> Introducer: Affidavit supports referral to designated introducer (UIDAI Circular ASHA-REF-02).": "Community Affidavit -> Introducer: Affidavit supports referral to designated introducer (UIDAI Circular ASHA-REF-02).",
    "School -> School Record: School-issued record confirms name, approximate age and guardian details (UIDAI Circular SCHOOL-003).": "School -> School Record: School-issued record confirms name, approximate age and guardian details (UIDAI Circular SCHOOL-003).",
    "School Record -> Identity Proof: Institutional identity record accepted as supporting identity evidence (UIDAI Circular SCHOOL-003).": "School Record -> Identity Proof: Institutional identity record accepted as supporting identity evidence (UIDAI Circular SCHOOL-003).",
    "Employer -> Employer Certificate: Employer confirms workplace, period of engagement and current location (UIDAI Circular EMP-004).": "Employer -> Employer Certificate: Employer confirms workplace, period of engagement and current location (UIDAI Circular EMP-004).",
    "Employer Certificate -> Address Proof: Workplace-linked certification supports local address pathway (UIDAI Circular EMP-004).": "Employer Certificate -> Address Proof: Workplace-linked certification supports local address pathway (UIDAI Circular EMP-004).",
    "Head of Family -> Aadhaar: Head of Family confirms relationship for Aadhaar enrollment (UIDAI Circular HOF-005).": "Head of Family -> Aadhaar: Head of Family confirms relationship for Aadhaar enrollment (UIDAI Circular HOF-005).",
    "Neighbour -> Community Affidavit: Neighbour testimony establishes physical residence (UIDAI Circular LOCAL-006).": "Neighbour -> Community Affidavit: Neighbour testimony establishes physical residence (UIDAI Circular LOCAL-006).",
    "Community Affidavit -> Address Proof: Affidavit can supplement missing address documents (UIDAI Circular LOCAL-006).": "Community Affidavit -> Address Proof: Affidavit can supplement missing address documents (UIDAI Circular LOCAL-006).",
    "Gazetted Officer -> Identity Proof: Officer-certified identity certificate (UIDAI Circular GO-007).": "Gazetted Officer -> Identity Proof: Officer-certified identity certificate (UIDAI Circular GO-007).",
    "Gazetted Officer -> Address Proof: Officer-certified residence certificate (UIDAI Circular GO-007).": "Gazetted Officer -> Address Proof: Officer-certified residence certificate (UIDAI Circular GO-007).",
    "Identity Proof -> Aadhaar: Accepted proof of identity for Aadhaar enrollment (UIDAI Circular STD-008).": "Identity Proof -> Aadhaar: Accepted proof of identity for Aadhaar enrollment (UIDAI Circular STD-008).",
    "Address Proof -> Aadhaar: Accepted proof of address for Aadhaar enrollment (UIDAI Circular STD-008).": "Address Proof -> Aadhaar: Accepted proof of address for Aadhaar enrollment (UIDAI Circular STD-008).",

    // Regional Notes
    "Works best when the introducer is attached to an active enrollment centre.": "Works best when the introducer is attached to an active enrollment centre.",
    "Attach ASHA ID and local health register references where available.": "Attach ASHA ID and local health register references where available.",
    "Prefer notarized affidavit in urban districts.": "Prefer notarized affidavit in urban districts.",
    "Headmaster signature improves acceptance.": "Headmaster signature improves acceptance.",
    "Carry the original school register extract if possible.": "Carry the original school register extract if possible.",
    "Add GST/license number if the employer has one.": "Add GST/license number if the employer has one.",
    "May need additional neighbour statement in informal settlements.": "May need additional neighbour statement in informal settlements.",
    "Carry family member Aadhaar and relationship statement.": "Carry family member Aadhaar and relationship statement.",
    "Use two neighbour witnesses for higher confidence.": "Use two neighbour witnesses for higher confidence.",
    "Attach ration shop or shelter certificate when available.": "Attach ration shop or shelter certificate when available.",
    "Useful escalation path for homeless and stateless residents.": "Useful escalation path for homeless and stateless residents.",
    "Block or tehsil office seal should be visible.": "Block or tehsil office seal should be visible.",
    "Pair with address proof at the enrollment centre.": "Pair with address proof at the enrollment centre.",
    "Ensure address matches current district.": "Ensure address matches current district.",

    // Risk Indicators
    "No designated introducer has been identified yet.": "No designated introducer has been identified yet.",
    "Biometric exception may require supervised enrollment and medical note.": "Biometric exception may require supervised enrollment and medical note.",
    "Displacement history may require extra residence corroboration.": "Displacement history may require extra residence corroboration.",
    "Current location should be verified by shelter, ASHA or local body.": "Current location should be verified by shelter, ASHA or local body.",
    "Employer or neighbour evidence should match the current district.": "Employer or neighbour evidence should match the current district.",
    "Escalate early to a gazetted officer or legal aid clinic.": "Escalate early to a gazetted officer or legal aid clinic.",
    "Confidence is moderate; collect one additional institutional witness.": "Confidence is moderate; collect one additional institutional witness.",
    "No documents and no neighbour witness increases rejection risk.": "No documents and no neighbour witness increases rejection risk.",
    "Low procedural risk if generated documents are signed before submission.": "Low procedural risk if generated documents are signed before submission."
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
    "Person": "व्यक्ति",
    "ASHA": "आशा कार्यकर्ता",
    "School": "स्कूल",
    "Employer": "नियोक्ता",
    "Neighbour": "पड़ोसी",
    "Head of Family": "परिवार का मुखिया",
    "Gazetted Officer": "राजपत्रित अधिकारी",
    "Community Affidavit": "सामुदायिक हलफनामा",
    "Employer Certificate": "नियोक्ता प्रमाणपत्र",
    "School Record": "स्कूल रिकॉर्ड",
    "Identity Proof": "पहचान का प्रमाण",
    "Address Proof": "पते का प्रमाण",
    "Aadhaar": "आधार",
    "Introducer": "परिचयकर्ता",

    // Document Names
    "Cover Letter to Enrollment Officer": "नामांकन अधिकारी को कवर पत्र",
    "Introducer Declaration": "परिचयकर्ता घोषणा",
    "Employer Verification Letter": "नियोक्ता सत्यापन पत्र",
    "School Verification Letter": "स्कूल सत्यापन पत्र",
    "Biometric Exception Note": "बायोमेट्रिक अपवाद नोट",

    // Rule Titles
    "Introducer Based Enrollment": "परिचयकर्ता आधारित नामांकन",
    "ASHA Community Verification": "आशा सामुदायिक सत्यापन",
    "School Record as Identity Support": "पहचान समर्थन के रूप में स्कूल रिकॉर्ड",
    "Employer Verification for Migrant Workers": "प्रवासी श्रमिकों के लिए नियोक्ता सत्यापन",
    "Head of Family Enrollment": "परिवार के मुखिया द्वारा नामांकन",
    "Neighbour Residence Affidavit": "पड़ोसी निवास हलफनामा",
    "Gazetted Officer Certificate": "राजपत्रित अधिकारी प्रमाणपत्र",
    "Document to Aadhaar Bridge": "दस्तावेज़ से आधार ब्रिज",

    // Legal Explanations
    "Introducer -> Aadhaar: Introducer certification for residents without standard documents (UIDAI Circular XXXXX).": "परिचयकर्ता -> आधार: बिना मानक दस्तावेजों वाले निवासियों के लिए परिचयकर्ता प्रमाणन (यूआईडीएआई परिपत्र XXXXX)।",
    "ASHA -> Community Affidavit: Community health worker verification of residence and identity (UIDAI Circular ASHA-REF-02).": "आशा -> सामुदायिक हलफनामा: निवास और पहचान का सामुदायिक स्वास्थ्य कार्यकर्ता द्वारा सत्यापन (यूआईडीएआई परिपत्र ASHA-REF-02)।",
    "Community Affidavit -> Introducer: Affidavit supports referral to designated introducer (UIDAI Circular ASHA-REF-02).": "सामुदायिक हलफनामा -> परिचयकर्ता: हलफनामा नामित परिचयकर्ता को रिफर करने का समर्थन करता है (यूआईडीएआई परिपत्र ASHA-REF-02)।",
    "School -> School Record: School-issued record confirms name, approximate age and guardian details (UIDAI Circular SCHOOL-003).": "स्कूल -> स्कूल रिकॉर्ड: स्कूल द्वारा जारी रिकॉर्ड नाम, अनुमानित आयु और अभिभावक के विवरण की पुष्टि करता है (यूआईडीएआई परिपत्र SCHOOL-003)।",
    "School Record -> Identity Proof: Institutional identity record accepted as supporting identity evidence (UIDAI Circular SCHOOL-003).": "स्कूल रिकॉर्ड -> पहचान का प्रमाण: संस्थागत पहचान रिकॉर्ड को पहचान साक्ष्य के रूप में स्वीकार किया जाता है (यूआईडीएआई परिपत्र SCHOOL-003)।",
    "Employer -> Employer Certificate: Employer confirms workplace, period of engagement and current location (UIDAI Circular EMP-004).": "नियोक्ता -> नियोक्ता प्रमाणपत्र: नियोक्ता कार्यस्थल, काम की अवधि और वर्तमान स्थान की पुष्टि करता है (यूआईडीएआई परिपत्र EMP-004)।",
    "Employer Certificate -> Address Proof: Workplace-linked certification supports local address pathway (UIDAI Circular EMP-004).": "नियोक्ता प्रमाणपत्र -> पते का प्रमाण: कार्यस्थल से जुड़ा प्रमाणन स्थानीय पते के मार्ग का समर्थन करता है (यूआईडीएआई परिपत्र EMP-004)।",
    "Head of Family -> Aadhaar: Head of Family confirms relationship for Aadhaar enrollment (UIDAI Circular HOF-005).": "परिवार का मुखिया -> आधार: परिवार का मुखिया आधार नामांकन के लिए संबंध की पुष्टि करता है (यूआईडीएआई परिपत्र HOF-005)।",
    "Neighbour -> Community Affidavit: Neighbour testimony establishes physical residence (UIDAI Circular LOCAL-006).": "पड़ोसी -> सामुदायिक हलफनामा: पड़ोसी की गवाही भौतिक निवास स्थापित करती है (यूआईडीएआई परिपत्र LOCAL-006)।",
    "Community Affidavit -> Address Proof: Affidavit can supplement missing address documents (UIDAI Circular LOCAL-006).": "सामुदायिक हलफनामा -> पते का प्रमाण: हलफनामा लापता पते के दस्तावेजों की कमी को पूरा कर सकता है (यूआईडीएआई परिपत्र LOCAL-006)।",
    "Gazetted Officer -> Identity Proof: Officer-certified identity certificate (UIDAI Circular GO-007).": "राजपत्रित अधिकारी -> पहचान का प्रमाण: अधिकारी द्वारा प्रमाणित पहचान पत्र (यूआईडीएआई परिपत्र GO-007)।",
    "Gazetted Officer -> Address Proof: Officer-certified residence certificate (UIDAI Circular GO-007).": "राजपत्रित अधिकारी -> पते का प्रमाण: अधिकारी द्वारा प्रमाणित निवास प्रमाण पत्र (यूआईडीएआई परिपत्र GO-007)।",
    "Identity Proof -> Aadhaar: Accepted proof of identity for Aadhaar enrollment (UIDAI Circular STD-008).": "पहचान का प्रमाण -> आधार: आधार नामांकन के लिए पहचान का स्वीकृत प्रमाण (यूआईडीएआई परिपत्र STD-008)।",
    "Address Proof -> Aadhaar: Accepted proof of address for Aadhaar enrollment (UIDAI Circular STD-008).": "पते का प्रमाण -> आधार: आधार नामांकन के लिए पते का स्वीकृत प्रमाण (यूआईडीएआई परिपत्र STD-008)।",

    // Regional Notes
    "Works best when the introducer is attached to an active enrollment centre.": "सबसे अच्छा तब काम करता है जब परिचयकर्ता एक सक्रिय नामांकन केंद्र से जुड़ा हो।",
    "Attach ASHA ID and local health register references where available.": "जहां उपलब्ध हो, वहां आशा आईडी और स्थानीय स्वास्थ्य रजिस्टर संदर्भ संलग्न करें।",
    "Prefer notarized affidavit in urban districts.": "शहरी जिलों में नोटरीकृत हलफनामे को प्राथमिकता दें।",
    "Headmaster signature improves acceptance.": "प्रधानाध्यापक के हस्ताक्षर स्वीकृति में सुधार करते हैं।",
    "Carry the original school register extract if possible.": "यदि संभव हो तो मूल स्कूल रजिस्टर उद्धरण साथ रखें।",
    "Add GST/license number if the employer has one.": "यदि नियोक्ता के पास जीएसटी/लाइसेंस संख्या हो तो उसे जोड़ें।",
    "May need additional neighbour statement in informal settlements.": "अनौपचारिक बस्तियों में अतिरिक्त पड़ोसी के बयान की आवश्यकता हो सकती है।",
    "Carry family member Aadhaar and relationship statement.": "परिवार के सदस्य का आधार और संबंध विवरण साथ रखें।",
    "Use two neighbour witnesses for higher confidence.": "उच्च विश्वसनीयता के लिए दो पड़ोसी गवाहों का उपयोग करें।",
    "Attach ration shop or shelter certificate when available.": "उपलब्ध होने पर राशन की दुकान या आश्रय प्रमाणपत्र संलग्न करें।",
    "Useful escalation path for homeless and stateless residents.": "बेघर और राज्यविहीन निवासियों के लिए उपयोगी समाधान मार्ग।",
    "Block or tehsil office seal should be visible.": "ब्लॉक या तहसील कार्यालय की सील दिखाई देनी चाहिए।",
    "Pair with address proof at the enrollment centre.": "नामांकन केंद्र पर पते के प्रमाण के साथ जोड़ें।",
    "Ensure address matches current district.": "सुनिश्चित करें कि पता वर्तमान जिले से मेल खाता हो।",

    // Risk Indicators
    "No designated introducer has been identified yet.": "अभी तक कोई नामित परिचयकर्ता नहीं मिला है।",
    "Biometric exception may require supervised enrollment and medical note.": "बायोमेट्रिक अपवाद के लिए पर्यवेक्षित नामांकन और चिकित्सा नोट की आवश्यकता हो सकती है।",
    "Displacement history may require extra residence corroboration.": "विस्थापन के इतिहास के लिए अतिरिक्त निवास पुष्टि की आवश्यकता हो सकती है।",
    "Current location should be verified by shelter, ASHA or local body.": "वर्तमान स्थान को आश्रय गृह, आशा या स्थानीय निकाय द्वारा सत्यापित किया जाना चाहिए।",
    "Employer or neighbour evidence should match the current district.": "नियोक्ता या पड़ोसी के साक्ष्य वर्तमान जिले से मेल खाने चाहिए।",
    "Escalate early to a gazetted officer or legal aid clinic.": "जल्द ही राजपत्रित अधिकारी या कानूनी सहायता क्लिनिक से संपर्क करें।",
    "Confidence is moderate; collect one additional institutional witness.": "विश्वसनीयता मध्यम है; एक अतिरिक्त संस्थागत गवाह एकत्र करें।",
    "No documents and no neighbour witness increases rejection risk.": "कोई दस्तावेज न होने और कोई पड़ोसी गवाह न होने से अस्वीकृति का जोखिम बढ़ जाता है।",
    "Low procedural risk if generated documents are signed before submission.": "यदि उत्पन्न दस्तावेजों को जमा करने से पहले हस्ताक्षरित किया जाता है तो प्रक्रियात्मक जोखिम कम होता है।"
  }
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
    if (!key) return "";

    const trimmedKey = key.trim();

    // Check if key is a path arrow separated string
    // e.g. "Neighbour -> Community Affidavit -> Introducer -> Aadhaar"
    if (trimmedKey.includes(" -> ")) {
      return trimmedKey
        .split(" -> ")
        .map((n) => t(n))
        .join(" -> ");
    }

    // Check if key is a state-specific rule warning
    // e.g. "Introducer Based Enrollment: not state-specific for Jharkhand; verify locally."
    const stateWarningRegex = /^(.*?): not state-specific for (.*?); verify locally\.$/;
    const match = trimmedKey.match(stateWarningRegex);
    if (match) {
      const [, ruleTitle, stateName] = match;
      if (language === "hi") {
        return `${t(ruleTitle)}: ${stateName} के लिए राज्य-विशिष्ट नहीं है; स्थानीय स्तर पर सत्यापन करें।`;
      }
    }

    return translations[language][trimmedKey] || trimmedKey;
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
