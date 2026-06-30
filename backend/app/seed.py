from __future__ import annotations

from .database import create_case, list_cases
from .graph_engine import LegalGraphEngine
from .models import CaseCreate, PersonInfo


NAMES = [
    ("Saira Bano", "Delhi", "North East Delhi", "No Address Proof", True, False, False, True, ["No Documents"]),
    ("Ramesh Paswan", "Bihar", "Patna", "Migrant", False, False, True, True, ["Employer Letter"]),
    ("Meena Kumari", "Uttar Pradesh", "Lucknow", "No Identity Proof", True, True, False, False, ["School ID"]),
    ("Imran Sheikh", "Maharashtra", "Mumbai Suburban", "Homeless", False, False, False, True, ["No Documents"]),
    ("Kavita Rawat", "Uttarakhand", "Dehradun", "No Introducer", True, False, False, False, ["Ration Card"]),
    ("Babli Devi", "Rajasthan", "Jaipur", "Displaced", True, False, False, True, ["No Documents"]),
    ("Naseem Ali", "Haryana", "Gurugram", "No Address Proof", False, False, True, True, ["Employer Letter"]),
    ("Pooja Singh", "Delhi", "South Delhi", "No Head of Family", False, True, False, False, ["Birth Certificate"]),
    ("Rahul Das", "Jharkhand", "Ranchi", "No Identity Proof", True, False, False, True, ["No Documents"]),
    ("Tsering Dolma", "Delhi", "New Delhi", "Stateless", False, False, False, False, ["Any Other"]),
    ("Anita Munda", "Jharkhand", "Dhanbad", "No Address Proof", True, False, False, True, ["Bank Passbook"]),
    ("Shabnam Khan", "Delhi", "East Delhi", "Biometric Failure", True, False, False, False, ["Voter ID"]),
    ("Gopal Yadav", "Gujarat", "Ahmedabad", "Migrant", False, False, True, False, ["Employer Letter"]),
    ("Laxmi Oraon", "Bihar", "Gaya", "No Introducer", True, False, False, True, ["No Documents"]),
    ("Nisha Verma", "Punjab", "Ludhiana", "No Identity Proof", False, True, False, False, ["School ID"]),
    ("Vikram Sahu", "Karnataka", "Bengaluru Urban", "No Address Proof", False, False, True, True, ["Employer Letter"]),
    ("Aarti Koli", "Maharashtra", "Pune", "No Head of Family", False, False, False, True, ["Ration Card"]),
    ("Mohan Lal", "Rajasthan", "Jodhpur", "Homeless", True, False, False, True, ["No Documents"]),
    ("Farida Begum", "Telangana", "Hyderabad", "Migrant", False, False, True, False, ["Employer Letter"]),
    ("Deepak Kumar", "Haryana", "Faridabad", "No Address Proof", False, False, False, True, ["Electricity Bill"]),
    ("Sunita Devi", "Uttar Pradesh", "Varanasi", "Displaced", True, False, False, True, ["No Documents"]),
    ("Arjun Tamang", "Uttarakhand", "Nainital", "No Introducer", True, False, False, False, ["Bank Passbook"]),
    ("Reshma Ansari", "Delhi", "North Delhi", "No Identity Proof", True, True, False, True, ["School ID"]),
    ("Kiran Bauri", "Jharkhand", "Bokaro", "No Address Proof", True, False, False, True, ["No Documents"]),
    ("Salim Qureshi", "Maharashtra", "Thane", "Migrant", False, False, True, True, ["Employer Letter"]),
]


def seed_cases(engine: LegalGraphEngine) -> None:
    if len(list_cases()) >= 25:
        return
    for idx, (name, state, district, problem, asha, school, employer, neighbour, docs) in enumerate(NAMES):
        person = PersonInfo(
            name=name,
            approximate_age=18 + (idx % 43),
            gender=["Female", "Male", "Non-binary"][idx % 3],
            state=state,
            district=district,
            language=["Hindi", "Bengali", "Marathi", "Urdu", "Kannada"][idx % 5],
            current_location=f"Ward {idx + 3}, {district}",
            occupation=["Domestic work", "Construction", "Student", "Street vending", "Daily wage work"][idx % 5],
            family_members="2 adults, 1 child" if idx % 2 else "No documented family members nearby",
            has_mobile=idx % 3 != 0,
            has_aadhaar_family_member=idx % 4 == 0,
            known_by_asha=asha,
            known_by_school=school,
            known_by_anganwadi=idx % 5 == 0,
            known_by_employer=employer,
            known_by_neighbour=neighbour,
            existing_documents=docs,
        )
        request = CaseCreate(person=person, problem=problem)
        create_case(person, problem, engine.generate_path(request).model_dump())
