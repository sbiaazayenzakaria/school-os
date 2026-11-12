# SchoolOS — Comprehensive Requirements Specification Document (STAGE 0)
## European Education Management Platform

**Document Version:** 3.1.0  
**Product Scope:** Full Education Management Platform (SIMS / SIS + Operations + Portals + Finance + HR + Documents)  
**Educational Levels:** Primary (Elementary) and Secondary (Middle & High School)  
**Target Customers:** Public, Independent, and Private Educational Institutions across Europe  
**Status:** Approved in Principle — Final Review Adjustments Applied  
**Role:** Senior Software Architect, Education Technology Product Architect, Business Analyst & Technical Lead  

---

## 1. Executive Summary & Strategic Product Vision

**SchoolOS** is a scalable, multi-tenant Education Management Platform engineered to run the pedagogical, administrative, financial, operational, and compliance life of European schools.

### 1.1 Core Strategic Decisions
1. **One Universal, Configurable Platform:** Rather than building fragile, country-specific silos, SchoolOS employs a **polymorphic domain architecture**. Country-specific requirements (e.g., German 1–6 grading, French 0–20 grading, UK Year groups, French cycles, SEPA payments, regional data protection rules) are managed via configuration profiles, strategy engines, and localization adapters.
2. **Unified Primary & Secondary Support:** Primary education (homeroom-centered, continuous care, qualitative/competency assessments default) and Secondary education (departmental, period-based schedules, subject-specialist teaching, quantitative grading, electives) share a unified data core without forcing unnatural workflows onto either level.
3. **Comprehensive Platform Scope & Subscription Entitlements:** Capabilities such as Finance, HR, Document Management, and Parent/Student Portals are integral parts of the full SchoolOS product scope. Their availability in a given deployment is governed by **subscription entitlements** and **institutional configuration flags**, rather than being treated as secondary or nonessential.
4. **Dynamic ISO 4217 Currency Architecture:** The platform dynamically supports any valid ISO 4217 currency code (e.g., EUR, GBP, CHF, SEK, NOK, DKK, PLN, USD, etc.) with localized formatting, rather than relying on a hardcoded list of currencies.
5. **Decoupled Architecture:** Frontend-first development using strictly typed TypeScript contracts and modular service abstractions, preparing for a NestJS + PostgreSQL + Prisma **Modular Monolith** backend.

---

## 2. Platform Scope & Capability Classification

All 20 functional domains represent first-class capabilities within the unified SchoolOS platform architecture. To support staged rollout and flexible licensing, capabilities are categorized by delivery phase and subscription enablement:

| Capability Tier | Delivery Phase & Governance | Functional Domains in SchoolOS |
| :--- | :--- | :--- |
| **Foundation Core** | Baseline delivery for initial school operations; universally enabled. | Identity & Access Management (IAM), Organizations & Campuses, Students & Guardians, Admissions Pipeline, Academic Hierarchy, Staff Directory, Attendance Management, Assessment & Polymorphic Grading, Timetable & Classrooms, System Configuration, GDPR Compliance Center. |
| **Operational & Community Suite** | Phased delivery (Stages H–J); activated via school configuration and subscription entitlements. | Dedicated Parent Portal, Dedicated Student Portal, Multilingual Communication Hub & Urgent Broadcasts, Document Management Repository, Human Resources & Contracts, Tuition Invoicing & Multi-Currency Billing, SEPA Payments, Expense Tracking. |
| **Enterprise & Ecosystem Suite** | Phased delivery (Stages K–M); enterprise licensing and external ecosystem connectivity. | Consolidated Multi-Campus Reporting, Automated Timetable Collision Solver, OneRoster 1.2 CSV/REST Data Exchange, External LMS Roster Synchronization (Canvas, Moodle, Google Classroom), Regional Ministry & Census Export Adapters. |

---

## 3. Primary vs. Secondary Educational Architecture

SchoolOS natively accommodates both Primary and Secondary models through configurable domain policies rather than divergent codebases.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Unified Academic Core                             │
│   (AcademicYear, Term, Campus, Grade/YearGroup, Section/Classroom, Pupil)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────┐
│         Primary School Model          │ │      Secondary School Model       │
├───────────────────────────────────────┤ ├───────────────────────────────────┤
│ • Structure: Homeroom / Class-based   │ │ • Structure: Department / Subject │
│ • Teaching: Generalist Class Teacher  │ │ • Teaching: Specialist Instructors│
│ • Attendance: Daily Homeroom Register │ │ • Attendance: Period-by-Period    │
│ • Schedule: Integrated Daily Blocks   │ │ • Schedule: Rotating Bell Periods │
│ • Evaluation: Competencies & Narrative│ │ • Evaluation: Numeric / Multi-Scale│
│ • Report Cards: Developmental Remarks │ │ • Report Cards: Weighted GPA / %  │
└───────────────────────────────────────┘ └───────────────────────────────────┘
```

### 3.1 Primary Education Characteristics
- **Generalist Instruction:** A single primary homeroom teacher (*Klassenlehrer*, *Professeur des écoles*, *Class Teacher*) delivers the majority of subjects to a fixed cohort.
- **Session-Based Attendance:** Attendance taken once in the morning (AM) and optionally once in the afternoon (PM), defaulting to "All Present" with fast exception marking.
- **Default Assessment Model:** **Developmental competency rubrics** (*Emerging, Developing, Secure, Exceeding* or *Non acquis, En voie d'acquisition, Acquis, Expert*) paired with **rich qualitative narrative teacher comments** are the platform default. Configurable numerical or letter grading remains available where an institution specifically mandates it.
- **Holistic Care & Dismissal:** Guardian authorization tracking for student pickup, after-school care (*Garderie*, *Hort*), and daily meals.

### 3.2 Secondary Education Characteristics
- **Departmentalized & Specialist Instruction:** Students rotate between subject teachers across science laboratories, language rooms, and specialized workshops.
- **Period / Lesson Attendance:** Attendance recorded every period by the active subject teacher; cross-checked against morning registration to flag intra-day truancy.
- **Course Selection & Electives:** Flexible student course enrollment accommodating core tracks and elective options (*Wahlpflichtfächer*, *Options*, *Spécialités*, *IB Higher/Standard Levels*).
- **Formal Academic Examinations:** Midterm, final, and mock exams evaluated on rigorous quantitative scales (German 1–6, French 0–20, Percentage, Letter grades, or GPA).

---

## 4. Comprehensive Functional Requirements (20 Functional Domains)

### 4.1 Domain 1: Dashboard and Analytics
- **Role-Tailored Dashboards:**
  - *Super / Organization Admin:* Multi-campus metrics, aggregate student enrollment, staff count, operational attendance rates, financial balance overview.
  - *Campus Principal / Head of School:* Daily attendance health, faculty cover/substitution status, upcoming institutional events, incident alerts.
  - *Primary Teacher:* Morning attendance register shortcut, daily schedule, pupil birthdays, parent messages, developmental milestones pending review.
  - *Secondary Teacher:* Next period countdown, timetable with room assignments, unsubmitted lesson registers, upcoming assessment grading deadlines.
  - *Parent Portal:* Child selector, real-time absence alerts, published grades, fee balance due, institutional announcements, teacher contact.
  - *Student Portal:* Daily schedule, homework submissions, exam calendar, attendance summary, published report cards.
- **Analytical Widgets:** Interactive metric cards, attendance trends over terms, grade distribution histograms, and budgetary variance indicators.

### 4.2 Domain 2: Students and Student Records
- **Pupil Lifecycle State Machine:** `Applicant -> Admitted -> Enrolled -> Active -> On Leave -> Transferred -> Graduated -> Archived / Withdrawn`.
- **Comprehensive Demographic & Identity Profile:**
  - Legal name, preferred name, unique student ID, national student registry identifier (where legally mandated), date of birth, biological sex, gender identity (optional).
  - Languages spoken at home (critical for multilingual European environments).
  - Identification documents metadata tracking (passport/ID verification status).
- **Academic Record Dossier:** Historical enrollment records, year groups, homerooms, transcript archive, standardized test results.
- **Special Educational Needs (SEN) & Health (GDPR Art. 9 Protected):**
  - Accommodations (e.g., extra exam time, sensory needs, assistive technology).
  - Medical alerts, dietary restrictions, emergency protocols.
  - *Access Guard:* Restricted strictly to authorized staff; hidden from general exports.

### 4.3 Domain 3: Parents and Guardians
- **Guardian Entity & Relationship Modeling:**
  - Multi-guardian linking per student (Mother, Father, Stepparent, Legal Guardian, Foster Parent).
  - **Legal Parental Responsibility Flag:** Distinct indicator for legal custody rights (*Autorité parentale*, *Sorgerecht*), vital for school consent verification and access rights.
  - Primary contact designation, billing recipient designation, emergency pickup authorization.
  - Contact details (verified email, mobile phone, residential address).
- **Multi-Child Family Linking:** Sibling association across primary and secondary campuses for consolidated billing and joint parent portal access.

### 4.4 Domain 4: Admissions and Enrollment
- **Admissions Pipeline:** Application submission, document verification, interview/assessment scheduling, offer issuance, acceptance, and enrollment conversion.
- **Cohort Enrollment & Promotion:**
  - Batch year-end promotion workflow (e.g., advancing Grade 5 cohorts to Grade 6, moving Grade 10 to Grade 11).
  - Section assignment balancing (gender ratio, academic balance, behavioral distribution).
  - Course-level enrollment for secondary electives.

### 4.5 Domain 5: Teachers and Staff
- **Staff Entity & Employment Records:**
  - Personal identity, employee ID, contact info, emergency contacts.
  - Professional credentials: Degrees, national teaching qualifications (e.g., State Examination, CAPES/Agrégation, PGCE, Master of Education).
  - Department membership (e.g., Mathematics, Modern Foreign Languages, Humanities).
  - Employment status: Full-time, Part-time, Permanent (*Titulaire*), Fixed-term, Substitute/Supply teacher.
- **Workload & Allocation:**
  - Weekly contracted teaching hours (*Deputat / Heures d'enseignement*).
  - Assigned teaching periods vs. administrative/supervision duties.
  - Visual workload capacity meter.

### 4.6 Domain 6: Academic Structure (Years, Terms, Classes, Subjects, Departments)
- **Multi-Campus Hierarchy:** Organization -> Campus -> Academic Year -> Terms -> Year Groups / Grades -> Classes / Sections.
- **Academic Calendar Configuration:**
  - Semesters (2 terms), Trimesters (3 terms), Quarters (4 terms).
  - Working week configuration (Standard Monday–Friday; configurable per campus).
  - Term boundaries, holidays, teacher training days, exam windows.
- **Year Groups / Grades:** Fully configurable naming (e.g., *Maternelle / Grundschule*, *Year 1–6 / CP–CM2*, *Collège / Gymnasium*, *Lycée / Oberstufe*).
- **Classes / Sections:** Cohort identifier (e.g., *6ème A*, *Klasse 9b*), physical room assignment, maximum student capacity cap, homeroom teacher assignment.
- **Curriculum & Subject Catalog:** Subject codes, multilingual names, department, weekly period allocation, mandatory core vs. elective classification.

### 4.7 Domain 7: Attendance Management
- **Primary Attendance Mode (Daily / Session):**
  - Fast homeroom grid. One-click "Mark All Present", then click individual students to toggle: `Absent (Unexcused)`, `Absent (Excused)`, `Late`, `Medical`.
- **Secondary Attendance Mode (Period / Lesson):**
  - Subject teacher records attendance for each timetabled period.
  - Automated comparison against morning homeroom attendance to detect period skipping.
- **Absence Workflow & Justifications:**
  - Parent absence notification submission via portal.
  - Medical certificate (*Attestation médicale / Ärztliches Attest*) tracking with document attachment.
  - Statutory truancy threshold monitoring (alerts when pupil unexcused absences exceed regulatory limits).

### 4.8 Domain 8: Examinations and Assessments
- **Assessment Types:** Formative assessments, homework checks, unit quizzes, major term examinations (*Klassenarbeiten / Contrôles sur table*), oral presentations, mock state exams.
- **Assessment Management:** Weighting configuration (e.g., Homework 20%, Continuous Quizzes 30%, Term Exam 50%), date, room allocation, maximum score.
- **Batch Gradebook Interface:** Spreadsheet-style rapid score entry grid for teachers with keyboard navigation (Enter/Tab navigation, instant auto-save).

### 4.9 Domain 9: Configurable Grading and Report Cards
- **Polymorphic Grading Engine:**
  - **Primary Competency Rubrics (Default for Primary):** Developmental rubrics (*Exceeding, Secure, Developing, Emerging* or *Non acquis, En voie d'acquisition, Acquis, Expert*) and qualitative narrative comments.
  - **German Scale (1.0 to 6.0):** Inverted scale (1.0 best, 4.0 passing threshold, 6.0 failing), decimal precision, points conversion (0–15 points for *Oberstufe*).
  - **French Scale (0 to 20):** 2-decimal precision, 10/20 passing, automatic honors (*Mentions*: Très Bien, Bien, Assez Bien, Passable, Ajourné).
  - **Percentage Scale (0% to 100%):** Standard continuous numerical scale.
  - **Letter Grades (A+ to F):** Grade-point mapped scale.
  - **Custom Institutional Scales:** Configurable boundaries, labels, and display styles.
- **Official Report Cards (*Zeugnis / Bulletin Scolaire / Transcript*):**
  - Customizable layouts supporting multilingual headers.
  - Teacher remarks, homeroom summary, attendance statistics summary, conduct/effort grades.
  - Pixel-perfect print and PDF export with institutional crest.

### 4.10 Domain 10: Timetable and Classroom Resources
- **Bell Schedule Configuration:** Period definitions, standard lesson duration (45m, 50m, 55m), recess breaks, lunch hours, assembly periods.
- **Timetable Matrices:** Class weekly timetable, teacher individual schedule, room utilization matrix.
- **Physical Resources Inventory:** Rooms, labs, sports facilities, seating capacity, equipment tags (projector, lab benches, piano).
- **Collision Detection:** Real-time prevention of double-booking teachers, student cohorts, or rooms.
- **Teacher Cover / Substitution Management:** Absence logging for teachers and assignment of available supply/cover faculty.

### 4.11 Domain 11: Parent Portal (Core Platform Capability / Entitlement-Gated)
- **Dedicated Family Experience:**
  - Child switcher for parents with multiple enrolled dependents across campuses.
  - Timetable, attendance records, homework assignments.
  - Published grades, assessment feedback, and terminal report card downloads.
  - Fee invoice review, payment history, and receipt downloads.
  - Direct, auditable messaging with homeroom and subject teachers.

### 4.12 Domain 12: Student Portal (Core Platform Capability / Entitlement-Gated)
- **Age-Appropriate Pupil Experience:**
  - Secondary view: Personal timetable, homework planner with due dates, assignment grades, circular announcements.
  - Primary view: Simplified icon-driven access to daily schedule, school activities, and learning links.

### 4.13 Domain 13: Communication and Announcements
- **Institutional Notice Board:** Rich text announcements with file attachments, categorized by audience (All Institution, Campus, Specific Grade, Faculty Only, Parents Only, Students Only).
- **Urgent Broadcast Banners:** High-priority safety, weather, or closure alerts pinned across all active user sessions.
- **Multilingual Authoring:** Author notices with side-by-side tabs in English, French, and German.

### 4.14 Domain 14: Finance, Invoicing, Payments and Expenses (Core Platform Capability / Entitlement-Gated)
- **Tuition & Fee Structures:**
  - Dynamic multi-currency support for any valid ISO 4217 code (EUR, GBP, CHF, SEK, NOK, DKK, PLN, USD, etc.).
  - Configurable fee categories: Tuition, Registration, Canteen (*Mensa / Demi-pension*), School Bus, Extracurriculars.
  - Installment plans: Annual upfront, Termly, 10-month, 12-month schedules.
  - Sibling discounts (*Geschwisterrabatt / Réduction fratrie*) and scholarships.
- **Invoicing & Payments:**
  - Tax/VAT compliant invoice generation with IBAN/BIC banking coordinates.
  - Payment recording: SEPA Direct Debit, Bank Transfer, Card, Cash.
  - Aging accounts receivable report (Current, 30 days, 60 days, Overdue).
- **Operational Expense Tracking:** Expense categories, vendor management, invoice attachments, multi-level approvals.

### 4.15 Domain 15: Human Resources (Core Platform Capability / Entitlement-Gated)
- Staff contracts, salary grade levels, leave management (Annual leave, Sick leave, Sabbatical, Maternity/Paternity), document repository (teaching permits, police background clearance certificates).

### 4.16 Domain 16: Document Management (Core Platform Capability / Entitlement-Gated)
- Secure, centralized document storage scoped per student, staff, and campus:
  - Student enrollment documents, transfer certificates, medical records.
  - Institutional policies, circulars, curriculum handbooks.
  - Categorization, access permission tags, and expiration date tracking.

### 4.17 Domain 17: Reporting and Exports
- **Pre-Built Operational Reports:** Student roster lists, emergency contact sheets, class attendance summaries, grade distribution statistics, financial aging reports.
- **Data Export Formats:** Standard CSV, Excel, and print-ready PDF.
- **Custom Report Builder (Future Enterprise):** Ad-hoc query generator with filterable fields.

### 4.18 Domain 18: User Management and Permissions (RBAC)
- **User Accounts & Authentication:** Single identity with multi-factor authentication (MFA) capability.
- **Role Hierarchy:**
  - `PLATFORM_SUPER_ADMIN`: SaaS platform operations.
  - `ORGANIZATION_ADMIN`: Multi-campus executive director / school board.
  - `CAMPUS_PRINCIPAL`: Head of school / Schulleiter / Chef d'établissement.
  - `ACADEMIC_COORDINATOR`: Head of year, department lead, curriculum director.
  - `TEACHER`: Homeroom teacher, subject teacher.
  - `STAFF`: Administrative registrar, bursar, nurse, counselor.
  - `PARENT`: Verified guardian.
  - `STUDENT`: Enrolled pupil.
- **Granular Permissions:** Over 80 granular permission keys (e.g., `student:view_pii`, `student:view_medical`, `attendance:record`, `grade:publish`, `finance:invoice_create`).

### 4.19 Domain 19: School and Organization Configuration
- Organization profile (legal name, registration, tax credentials).
- Campus setup (multiple physical locations under one organization).
- Academic year definitions and active session designation.
- Localization settings (Language, Dynamic ISO 4217 Base Currency, Timezone, Date/Number formats, Working week).
- Academic policies (Active grading scale, attendance mode, term structure).

### 4.20 Domain 20: Integrations with External Education Systems
- **Integration Layer Boundaries:**
  - Identity Providers: OpenID Connect (OIDC), SAML 2.0, Microsoft Entra ID (Azure AD), Google Workspace for Education.
  - Standard Education Data Formats: OneRoster 1.2 CSV / REST export.
  - Learning Management Systems: Canvas, Moodle, Google Classroom roster sync.
  - National Ministry & Census Reporting: Structured data export adapters.

---

## 5. Security, GDPR Architecture, Legal Holds & Retention Policies

> [!IMPORTANT]
> **Legal Review Notice:** SchoolOS provides technical controls, data separation, and retention workflows architected around GDPR technical principles. However, technical implementation alone does **not** constitute certified legal compliance. Institutional deployment requires legal and country-specific review, formal Data Processing Agreements (DPAs), and institutional privacy impact assessments (DPIAs), particularly regarding national education archive laws and child data handling.

### 5.1 Retention Policies, Legal Holds & Auditable Erasure
1. **Configurable Retention Schedules:**
   - Operational retention policies are defined per data category (e.g., Inactive applicant records retained for 12 months; medical absence notes retained for 3 years; final academic graduation transcripts retained permanently under statutory education laws).
2. **Statutory Retention vs. Right to Erasure (Art. 17 Exemption Handling):**
   - The platform recognizes that the GDPR "Right to be Forgotten" is not absolute. When an erasure request is executed for a student:
     - Non-statutory personal data (marketing preferences, optional photos, extracurricular notes) is permanently scrubbed or anonymized.
     - Legally mandated academic records (graduation diplomas, official grade transcripts, financial tax invoices) are flagged as **Statutory Archive** and retained in read-only encrypted storage until statutory expiration.
3. **Legal Hold Mechanism:**
   - Authorized administrators can place a **Legal Hold** on a student, staff member, or institutional financial ledger.
   - A Legal Hold immediately suspends all automated retention purging, deletion requests, or anonymization workflows for that entity.
   - Any attempt to delete or alter a record under an active Legal Hold is blocked and flagged in the immutable security audit log.
4. **Two-Step Auditable Deletion Workflow:**
   - Destruction of sensitive pupil or financial data requires a two-step "Request $\rightarrow$ DPO/Admin Approval" workflow.
   - The deletion leaves a cryptographic **tombstone record** in the audit log (recording actor, approving officer, timestamp, and legal basis for deletion/retention without preserving the deleted PII).
5. **Data Subject Rights Automation:**
   - **Right of Access & Portability (Art. 15 & 20):** Self-service/Admin "Export Student Dossier" generating structured JSON and human-readable PDF archive.
   - **Parental Custodial Verification (Art. 8):** Detailed tracking of parental responsibility to prevent unauthorized access by non-custodial individuals.

---

## 6. Demonstration Institutions (Stage A Prototype Baseline)

To test multi-tenancy, multi-campus hierarchies, polymorphic grading, and dynamic currency localization during development, SchoolOS defines two standardized, clearly identified fictional demonstration institutions:

1. **École Démonstration Paris (Fictional Demo Institution)**
   - *Type:* Bilingual Franco-International Primary & Secondary Institution.
   - *Structure:* 2 Campuses (Campus Primaire Victor Hugo, Campus Secondaire Montmartre).
   - *Calendar:* 3-Term Trimester system.
   - *Default Grading:* French Scale (0–20 with decimal honors) for Secondary; Competency Rubrics for Primary.
   - *Currency:* EUR (€) via ISO 4217.
   - *Working Week:* Monday–Friday.
2. **Bavarian Demo School (Fictional Demo Institution)**
   - *Type:* German-English Academic Primary & Secondary School (*Gymnasium*).
   - *Structure:* 1 Unified Campus (Campus München Schwabing).
   - *Calendar:* 2-Term Semester system.
   - *Default Grading:* German Scale (1.0–6.0 inverted KMK-curve) for Secondary; Developmental Rubrics for Primary.
   - *Currency:* EUR (€) via ISO 4217.
   - *Working Week:* Monday–Friday.
