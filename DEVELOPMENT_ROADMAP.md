# SchoolOS — Comprehensive Development Roadmap (STAGE 0)
## European Education Management Platform Implementation Plan

**Document Version:** 3.1.0  
**Progression Model:** Gated Sequential Stages (Stage 0 through Stage M, with Stage A Decomposition A1–A4)  
**Backend Target:** Modular Monolith (NestJS + PostgreSQL + Prisma)  
**Frontend Target:** Feature-Driven React + TypeScript + Vite + Tailwind CSS  
**Demonstration Institutions:** École Démonstration Paris & Bavarian Demo School  
**Status:** Approved in Principle — Final Review Adjustments Applied  
**Role:** Senior Software Architect, Education Technology Product Architect, Technical Lead  

---

## Roadmap Progression Model & Working Rules

In strict compliance with the **Agent Working Rules**, development proceeds through sequentially gated stages. **No stage or sub-stage will be executed without prior sign-off of the preceding stage.**

```
[ Stage 0: Requirements, Modular Architecture & Design System ] ◄── CURRENT STATUS
           │
           ▼
[ Stage A: Project Foundation, Design System, App Shell & Demo Dashboard ]
  ├── A1: Project Initialization & Tooling
  ├── A2: Design System & Reusable UI Primitives
  ├── A3: Application Shell & Localization (EN, FR, DE + Dynamic Currencies)
  └── A4: Multi-Tenant Mock Environment & Administrator Dashboard
           │
           ▼
[ Stage B: Organizations, Campuses & Institutional Configuration ]
           │
           ▼
[ Stage C: Students, Guardians, Custodial Rights & Admissions Pipeline ]
           │
           ▼
[ Stage D: Teachers, Staff & Academic Structure (Primary & Secondary) ]
           │
           ▼
[ Stage E: Attendance Management (Daily Homeroom & Period-Based) ]
           │
           ▼
[ Stage F: Examinations, European Grading (Primary Competency Default) & Report Cards ]
           │
           ▼
[ Stage G: Timetable Management, Resource Allocation & Substitutions ]
           │
           ▼
[ Stage H: Dedicated Parent & Student Portals (Entitlement-Gated) ]
           │
           ▼
[ Stage I: Multilingual Communication & Document Repository (Entitlement-Gated) ]
           │
           ▼
[ Stage J: Dynamic ISO Currency Finance, SEPA Invoicing & Human Resources (Entitlement-Gated) ]
           │
           ▼
[ Stage K: Operational Reporting, Data Exports, Legal Holds & Audit Center ]
           │
           ▼
[ Stage L: Backend Integration, Modular Monolith & Production Security Hardening ]
           │
           ▼
[ Stage M: External Education Integrations & Regional Expansions ]
```

---

## Detailed Stage Specifications

---

### STAGE A: Project Foundation, Design System, App Shell & Demo Dashboard
Stage A is partitioned into four distinct, verifiable sub-stages:

#### Sub-Stage A1: Project Initialization & Tooling
- **Objectives:** Bootstrap the React + TypeScript + Vite application workspace with strict compiler flags, establish Tailwind CSS baseline, configure ESLint and Prettier, and set up directory structure.
- **Deliverables:**
  - `package.json`, `tsconfig.json` (strict mode, no unused locals/parameters, no implicit any), `vite.config.ts`.
  - `tailwind.config.js` configured with European design tokens, semantic color mappings, and typography hierarchy.
  - ESLint configuration enforcing modern React, TypeScript, and accessibility rules.
  - Core directory structure (`src/app`, `src/features`, `src/layouts`, `src/shared`, `src/locales`).
- **Acceptance Criteria & Verification:**
  - `npm run build` exits 0 with zero warnings.
  - `npm run lint` passes with 0 errors.

#### Sub-Stage A2: Design System & Reusable UI Primitives
- **Objectives:** Implement the foundational WCAG 2.2 AA compliant UI primitives that will power all 14 bounded domains.
- **Deliverables:**
  - Core primitives: `Button` (primary, secondary, destructive, ghost, outline), `Card`, `Badge` (semantic colors + `<GradeBadge>`, `<CompetencyBadge>`, `<SensitivityBadge>`, `<LegalHoldBanner>`), `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Modal`, `Drawer`, `DataTable` (sortable, filterable, selectable), `Skeleton`, `Toast`, and `Alert`.
  - Accessible focus ring standards, proper ARIA labeling, and keyboard trap prevention.
- **Acceptance Criteria & Verification:**
  - All primitives render in all states (Default, Hover, Focus, Disabled, Loading, Error, Empty).
  - TypeScript types strictly validate prop contracts.

#### Sub-Stage A3: Application Shell & Localization
- **Objectives:** Build the main application shell (`AppLayout`), the internationalization engine (`react-i18next`), and the dynamic ISO 4217 currency and date formatting layer.
- **Deliverables:**
  - `I18nProvider` with structured dictionaries in English (`en`), French (`fr`), and German (`de`) for `common`, `navigation`, and `dashboard` namespaces.
  - Dynamic `Intl` formatter (`formatCurrency` handling any valid ISO 4217 code, `formatDate`, `formatNumber`).
  - App Shell: Collapsible 260px Sidebar with linguistic elasticity (supporting German text expansion), sticky Header with Breadcrumbs, Global Search shortcut, Language Switcher (`EN` | `FR` | `DE`), and User Profile Menu.
- **Acceptance Criteria & Verification:**
  - Instant language switching across English, French, and German without layout jumps or clipped text.
  - Proper formatting of dynamic currencies (e.g. `1 250,50 €` in DE/FR vs `€1,250.50` in EN; `CHF 1,250.50`; `1 250,50 kr`).

#### Sub-Stage A4: Multi-Tenant Mock Environment & Administrator Dashboard
- **Objectives:** Implement the in-memory multi-tenant state provider seeded with the two demonstration institutions, and deliver the executive Administrator Dashboard with live KPI widgets, charts, and quick actions.
- **Deliverables:**
  - In-memory mock store initialized with:
    - **`École Démonstration Paris`** (French Demo School: Trimester, EUR, French 0–20 / Competency).
    - **`Bavarian Demo School`** (German Demo School: Semester, EUR, German 1–6 / Competency).
  - Multi-Tenant & Campus Switcher in the top header allowing instant switching between demo institutions.
  - Administrator Dashboard:
    - European KPI Metric Cards: Total Enrolled Pupils, Active Staff, Today's Attendance %, Outstanding Receivables in dynamic ISO currency.
    - Attendance trend visualization and admissions pipeline chart.
    - Recent Pupil Registrations table.
    - Quick Action Bar (*New Enrollment, Record Attendance, Collect Fee, Post Announcement*).
- **Acceptance Criteria & Verification:**
  - Switching between `École Démonstration Paris` and `Bavarian Demo School` immediately updates dashboard metrics, campus contexts, and active currency/grading defaults.
  - Responsive layout verified on mobile (375px), tablet (768px), and desktop (1280px+).

---

### STAGE B: Organizations, Campuses & Configuration
- **Objectives:** Build the multi-tenant institutional settings engine, supporting multi-campus hierarchies, academic calendars, localized settings, and subscription entitlement management.
- **Functional Deliverables:**
  - Organization profile management (legal identity, registration numbers, SIRET/Steuernummer, tax info, official crest).
  - Campus management (Primary Campus, Secondary Campus, physical facilities, localized timezones).
  - Academic Year & Term configuration (Semesters, Trimesters, Quarters, holiday schedules).
  - Localization preferences (dynamic ISO 4217 base currency, date/number formats, working week).
  - Subscription entitlement viewer (active modules: Core, Portals, Finance, HR, Documents).
- **Technical Deliverables:**
  - `IOrganizationService` contract and local in-memory adapter.
  - `TenantContext` & `CampusContext` providers with localStorage persistence.
- **Dependencies:** Stage A.
- **Acceptance Criteria:** Instant switching across organizations and campuses; robust form validation.

---

### STAGE C: Students, Guardians, Custodial Rights & Admissions Pipeline
- **Objectives:** Deliver pupil lifecycle management, guardian relationship modeling with legal custody rights (*Autorité parentale / Sorgerecht*), admissions pipeline, and GDPR data portability workflows.
- **Functional Deliverables:**
  - Pupil directory table with multi-criteria filtering (Campus, Year Group, Class, Status), search, and pagination.
  - Comprehensive Pupil Profile view: Demographics, Guardian Contacts, Academic History, Attendance Summary, Fee Ledger, GDPR Dossier tab.
  - Guardian Management: Primary/secondary guardians, custodial authority flags, emergency contacts.
  - Admissions Pipeline: Inquiry tracking, applicant reviews, and enrollment conversion.
  - GDPR Data Portability: One-click "Export Student Dossier" generating structured JSON and printable PDF dossier.
  - Sensitive health and Special Educational Needs (SEN) protection with `<SensitivityBadge>`.
- **Technical Deliverables:**
  - `IStudentService` and `IAdmissionsService` contracts with in-memory adapters.
  - `useStudentList`, `useStudentDossier`, and `useAdmissions` hooks.
- **Dependencies:** Stage B.
- **Acceptance Criteria:** Full CRUD operations on student records with state machine validation; sensitive data gated by permissions.

---

### STAGE D: Teachers, Staff & Academic Structure (Primary & Secondary)
- **Objectives:** Implement faculty directory, teaching workload tracking, European qualifications, and unified academic hierarchy supporting both Primary (homerooms) and Secondary (departments/subjects) structures.
- **Functional Deliverables:**
  - Staff Directory with department filtering, European qualification badges (CAPES, Agrégation, State Exam, PGCE), and workload status.
  - Workload Management: Visual allocation of contracted weekly teaching hours (*Deputat / Heures d'enseignement*).
  - Academic Structure Manager:
    - Year groups / Grades (configurable naming: CP–CM2, Year 1–13, Klasse 5–12).
    - Classes / Sections (capacity caps, homeroom teacher assignment).
    - Physical classrooms & specialized facilities (Science labs, sports halls, music rooms).
    - Curriculum & Subject Catalog (core mandatory vs. secondary electives / *Options*).
    - Course Enrollment interface for secondary elective tracks.
- **Technical Deliverables:**
  - `IStaffService` and `IAcademicStructureService` contracts and adapters.
- **Dependencies:** Stage C.
- **Acceptance Criteria:** Accurate calculation of teaching workloads; seamless navigation between Primary and Secondary academic structures.

---

### STAGE E: Attendance Management (Homeroom & Period-Based)
- **Objectives:** Deliver dual-mode attendance workflows: fast 1-click morning homeroom register for Primary schools and period-by-period lesson registers for Secondary schools, complete with medical absence justifications.
- **Functional Deliverables:**
  - **Primary Homeroom Daily Register:** Rapid 1-click "Mark All Present" with single-click toggles for Absent, Late, Excused, and Medical.
  - **Secondary Period Register:** Lesson-by-lesson attendance grid for subject teachers, linked to the active timetable slot.
  - Absence Justification & Excuse Tracker: Log parent notifications, medical certificates (*Attestation médicale / Ärztliches Attest*), and attachments.
  - Attendance Reporting & Analytics: Monthly heatmaps, individual pupil absence rates, and automated truancy threshold warnings.
- **Technical Deliverables:**
  - `IAttendanceService` and `IAttendanceStrategy` implementing `HomeroomAttendanceStrategy` and `PeriodAttendanceStrategy`.
- **Dependencies:** Stage D.
- **Acceptance Criteria:** Sub-second UI response time when submitting attendance; cross-check detection flagging pupils present in morning homeroom but absent in later periods.

---

### STAGE F: Examinations, European Grading (Primary Competency Default) & Report Cards
- **Objectives:** Implement assessment term scheduling, batch gradebook entry, the polymorphic European grading engine (Primary Competency rubrics default for primary, German 1–6, French 0–20, Percentage, Letter), and official report card generation.
- **Functional Deliverables:**
  - Assessment scheduler (continuous tests, midterms, trimester exams, mock state exams) with weighting.
  - Spreadsheet-style Gradebook: Fast grade entry grid with keyboard navigation (Enter/Tab navigation, instant auto-save).
  - **Polymorphic Grading Engine:**
    - `PrimaryCompetencyStrategy` (**Default for Primary**): Developmental rubrics (*Exceeding, Secure, Developing, Emerging*) paired with rich narrative teacher comments.
    - `GermanGradingStrategy`: 1.0 to 6.0 scale, inverted calculations, 4.0 passing threshold.
    - `FrenchGradingStrategy`: 0.00 to 20.00 scale, 10/20 passing threshold, *Mentions* calculation.
    - `PercentageGradingStrategy`: 0–100%.
    - `LetterGradingStrategy`: A+ to F.
  - Official Report Card Generator (*Zeugnis / Bulletin Scolaire / Transcript*) with printable, customizable European layouts.
- **Technical Deliverables:**
  - `IAssessmentService`, `IGradeService`, and `GradingStrategyFactory`.
  - Print stylesheet in `PrintLayout` ensuring pixel-perfect PDF and physical printing.
- **Dependencies:** Stage E.
- **Acceptance Criteria:** Mathematical accuracy for inverse German scale averages and French honors mentions; clean competency rendering for primary cohorts.

---

### STAGE G: Timetable Management & Resource Allocation
- **Objectives:** Deliver bell schedule configuration, interactive weekly timetable matrices, physical resource management, real-time conflict detection, and teacher substitutions.
- **Functional Deliverables:**
  - Bell Schedule Manager: Period definitions (45m, 50m, 55m), recess breaks, lunch periods.
  - Interactive Weekly Timetable Grid: Class view, Teacher view, Room view.
  - Real-Time Collision Engine: Instant visual warnings when attempting to double-book a teacher, class cohort, or room.
  - Teacher Substitution / Cover Workflow: Mark absent faculty and assign available cover teachers for specific periods.
- **Technical Deliverables:**
  - `ITimetableService` contract and scheduling solver adapter.
- **Dependencies:** Stage F.
- **Acceptance Criteria:** Collision engine blocks scheduling overlapping periods; responsive timetable grid.

---

### STAGE H: Dedicated Parent & Student Portals (Entitlement-Gated)
- **Objectives:** Deliver dedicated, consumer-friendly, accessible portal layouts for parents and students to view academic progress, timetables, published grades, and fee balances.
- **Functional Deliverables:**
  - Dedicated `PortalLayout` with simplified top-navigation, child switcher, and high visual appeal.
  - **Parent Portal:** Multi-child switcher, real-time absence alerts, published grades, fee balances, receipt downloads, direct teacher messaging.
  - **Student Portal:** Daily timetable, homework planner with due dates, published marks, and notices.
- **Technical Deliverables:**
  - `IParentPortalService` and `IStudentPortalService` contracts.
  - Role-gated portal route tree (`/portal/parent`, `/portal/student`).
- **Dependencies:** Stage G.
- **Acceptance Criteria:** Mobile-first responsiveness; seamless child switching for multi-child families.

---

### STAGE I: Multilingual Communication & Document Repository (Entitlement-Gated)
- **Objectives:** Build the school-wide communication hub with side-by-side multilingual authoring, urgent safety alert broadcasts, and a centralized secure document management repository.
- **Functional Deliverables:**
  - Notice Board with rich-text composer, attachments, and parallel language tabs in English, French, and German.
  - Audience targeting: Entire School, Specific Campus, Year Group, Faculty Only, Parents Only, Students Only.
  - Urgent Safety Alert Banners: Pinned notification banners across active sessions.
  - Document Management Repository: Scoped document storage for pupil enrollment files, health records, transfer certificates, and school policies with expiry dates.
- **Technical Deliverables:**
  - `ICommunicationService` and `IDocumentService` contracts and adapters.
- **Dependencies:** Stage H.
- **Acceptance Criteria:** Multi-language notices render correctly; urgent alerts render prominently; secure document access.

---

### STAGE J: Dynamic ISO Currency Finance, SEPA Invoicing & Human Resources (Entitlement-Gated)
- **Objectives:** Deliver student fee structures in dynamic ISO 4217 currencies, compliant invoicing with SEPA banking details, payment collection, operational expense tracking, and staff HR contracts.
- **Functional Deliverables:**
  - Dynamic Multi-Currency Fee Structures (EUR, GBP, CHF, SEK, etc.): Tuition, registration, lunch plans, sibling discounts, scholarships.
  - Invoicing Engine: Automated term/annual invoice generation with VAT compliance and IBAN/BIC banking coordinates.
  - Payment Collection: Recording SEPA Direct Debit references, bank transfers, cards, cash.
  - Operational Expense Tracker: Expense categories, vendor records, receipt attachments, approval workflows.
  - Human Resources Module: Staff employment contracts, salary grades, leave tracking, background clearance tracking.
- **Technical Deliverables:**
  - `IFinanceService` and `IHumanResourcesService` contracts and adapters.
  - Minor-unit currency arithmetic to prevent floating-point errors.
- **Dependencies:** Stage I.
- **Acceptance Criteria:** Zero floating-point rounding errors; compliant invoice and receipt generation.

---

### STAGE K: Operational Reporting, Data Exports, Legal Holds & Audit Center
- **Objectives:** Deliver pre-built operational school reports, institutional analytics dashboards, GDPR compliance audit logs, and the Legal Hold management system.
- **Functional Deliverables:**
  - Pre-Built Reports: Student rosters, emergency contacts, class attendance summaries, grade distribution statistics, staff teaching loads.
  - Multi-Format Data Exports: Standard CSV, Excel, and print-ready PDF generation.
  - **GDPR Compliance & Legal Hold Center:**
    - Place/Release **Legal Holds** on students, staff, or financial ledgers, suspending automated purging.
    - Two-step auditable deletion workflow with cryptographic **tombstone logging**.
    - Statutory archive segregation (retaining permanent academic transcripts while scrubbing non-statutory PII).
- **Technical Deliverables:**
  - `IReportingService`, `IAuditLogService`, and `IDataRetentionService` contracts.
- **Dependencies:** Stage J.
- **Acceptance Criteria:** Active legal holds block all deletion attempts; audit log records immutable tombstone details.

---

### STAGE L: Backend Integration, Modular Monolith & Production Security Hardening
- **Objectives:** Connect the frontend to the NestJS Modular Monolith backend running on PostgreSQL with Prisma ORM in an EU cloud data region, enforcing strict multi-tenant authorization, secure HttpOnly cookie sessions, and production hardening.
- **Functional Deliverables:**
  - Real database persistence across all 14 bounded domains.
  - Authentication with HttpOnly SameSite=Strict secure JWT cookies and refresh token rotation.
  - Automated tenant isolation enforcing row-level scoping (`organization_id`).
  - Production data seeding for `École Démonstration Paris` and `Bavarian Demo School`.
- **Technical Deliverables:**
  - NestJS modular architecture with 14 domain modules.
  - Prisma schema with multi-tenant foreign keys and indexes.
  - Swap frontend mock adapters with `Http*Service` implementations communicating via REST APIs.
  - Backend Tenant Guard and Entitlement Guard interceptors.
  - Lighthouse audit targeting > 90 across Performance, Accessibility, Best Practices, and SEO.
- **Dependencies:** Stage K.
- **Acceptance Criteria:** Zero frontend UI regressions when swapping to live backend; backend independently blocks unauthorized cross-tenant requests.

---

### STAGE M: External Education Integrations & Regional Expansions
- **Objectives:** Implement external integration adapters for European identity providers, OneRoster 1.2 data exchange, LMS platforms, and regional national ministry reporting formats.
- **Functional Deliverables:**
  - Single Sign-On (SSO): Microsoft Entra ID (Azure AD), Google Workspace for Education, and SAML 2.0.
  - OneRoster 1.2 Data Exchange: Automated CSV import/export and REST endpoints.
  - LMS Roster Sync: Adapters for Canvas, Moodle, and Google Classroom.
  - National Ministry & Census Reporting: Statutory data export adapters.
- **Technical Deliverables:**
  - Integration adapter layer in `src/features/integrations/`.
- **Dependencies:** Stage L.
- **Acceptance Criteria:** Clean mapping of OneRoster 1.2 entities into SchoolOS academic models; verified SSO user provisioning.
